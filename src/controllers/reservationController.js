const Reservation = require("../models/reservation");
const statusHistory = require("../models/statusHistory");

exports.getReservations = async (req, res) => {
  try {
    const { reservationStatus, startDate, endDate, priority } = req.query;

    // Obj con filtro dinamico

    const filters = {};
    if (reservationStatus) filters.reservationStatus = reservationStatus;
    if (priority) filters.priority = priority;

    // filtar por rango de fechas

    if (startDate || endDate) {
      filters.date = {};

      if (startDate) filters.date.$gte = new Date(startDate); // mayor o igual a start Date   $gte => greather than or equal
      if (endDate) filters.date.$lte = new Date(endDate); // menor o igual a end Date         $lte => less than or equal
    }

    const reservations = await Reservation.find(filters).populate(
      "assignedWorker",
      "name username"
    );
    res.status(200).json(reservations);
  } catch (error) {
    res.status(500).json({
      message: "Error in obtaining reservations",
      error: error.message,
    });
  }
};

exports.createReservation = async (req, res) => {
  try {
    const { serviceType, client, address, date, priority, reservationStatus } =
      req.body;

    // Verificar que req.user esté disponible (gracias al middleware protect)
    if (!req.user) {
      return res
        .status(401)
        .json({ message: "Unauthorized: User not authenticated" });
    }

    const reservation = new Reservation({
      serviceType,
      client,
      address,
      assignedWorker: req.user._id, // Asignar automáticamente al usuario autenticado
      date,
      priority,
      reservationStatus,
    });

    await reservation.save();
    res.status(201).json(reservation);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating reservation", error: error.message });
  }
};

exports.updateReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const reservation = await Reservation.findById(id);
    if (!reservation)
      return res.status(404).json({ message: "Reservation not found" });

    // Registrar cambio de estado
    if (
      updates.reservationStatus &&
      updates.reservationStatus !== reservation.reservationStatus
    ) {
      await statusHistory.create({
        reservation: id,
        oldReservationStatus: reservation.reservationStatus,
        newReservationStatus: updates.reservationStatus,
        changedBy: req.user.id, // El ID del usuario autenticado
      });
    }

    // Actualizar la reserva
    const updatedReservation = await Reservation.findByIdAndUpdate(
      id,
      updates,
      {
        new: true,
      }
    );
    res.status(200).json(updatedReservation);
  } catch (error) {
    res.status(500).json({
      message: "Error updating the reservation",
      error: error.message,
    });
  }
};

exports.deleteReservations = async (req, res) => {
  try {
    const { id } = req.params;

    //Buscar y eliminar

    const reservation = await Reservation.findByIdAndDelete(id);

    if (!reservation) {
      return res.status(404).json({ message: "Not found" });
    }

    res.status(200).json({ message: "Reservation eliminated succesfully" });
  } catch (error) {
    res.status(500).jsno({
      message: "Erros eliminating the reservation",
      error: error.message,
    });
  }
};

// consultar historial

exports.getStatusHistory = async (req, res) => {
  try {
    const { reservationId } = req.params;

    const history = await statusHistory
      .find({ reservation: reservationId })
      .populate("changedBy", "name username") // Asegúrate de incluir `name`
      .exec();

    console.log("Historial enviado al frontend:", history); // Depuración
    res.status(200).json(history);
  } catch (error) {
    res.status(500).json({
      message: "Error obtaining history",
      error: error.message,
    });
  }
};
exports.getStatistics = async (req, res) => {
  try {
    const totalReservations = await Reservation.countDocuments();
    const completedReservations = await Reservation.countDocuments({
      reservationStatus: "completed",
    });
    const pendingReservations = await Reservation.countDocuments({
      reservationStatus: "pending",
    });
    const inProgressReservations = await Reservation.countDocuments({
      reservationStatus: "in_progress",
    });

    res.status(200).json({
      totalReservations,
      completedReservations,
      pendingReservations,
      inProgressReservations,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error obtaining the stats", error: error.message });
  }
};
