const Reservation = require("../models/Reservation");
const statusHistory = require("../models/statusHistory");

exports.getReservations = async (req, res) => {
  try {
    const { status, startDate, endDate, priority } = req.query;

    // Obj con filtro dinamico

    const filters = {};
    if (status) filters.status = status;
    if (priority) filters.priority = priority;

    // filtar por rango de fechas

    if (startDate || endDate) {
      filters.date = {};

      if (startDate) filters.date.$gte = new Date(startDate); // mayor o igual a start Date   $gte => greather than or equal
      if (endDate) filters.date.$lte = new Date(endDate); // menor o igual a end Date         $lte => less than or equal
    }

    const reservations = await Reservation.find(filters).populate(
      "assignedWorker"
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
  const { serviceType, client, address, assignedWorker, date, priority } =
    req.body;
  const reservation = new Reservation({
    serviceType,
    client,
    address,
    assignedWorker,
    date,
    priority,
  });
  await reservation.save();
  res.status(201).json(reservation);
};

exports.updateReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const reservation = await Reservation.findById(id);
    if (!reservation)
      return res.status(404).json({ message: "Reservation not found" });

    // registrar cambio de estado

    if (updates.status && updates.status !== reservation.status) {
      await statusHistory.create({
        reservation: id,
        oldStatus: reservation.status,
        newStatus: updates.status,
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
    res
      .status(500)
      .jsno({
        message: "Erros eliminating the reservation",
        error: error.message,
      });
  }
};

// consultar historial

exports.getStatusHistory = async (req, res) => {
  try {
    const { reservationId } = req.params;
    const history = await statusHistory.find({ reservation: reservationId });
    res.status(200).json(history);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error obtaining history", error: error.message });
  }
};

exports.getStatistics = async (req, res) => {
  try {
    const totalReservations = await Reservation.countDocuments();
    const completedReservations = await Reservation.countDocuments({
      status: "completed",
    });
    const pendingReservations = await Reservation.countDocuments({
      status: "pending",
    });
    const inProgressReservations = await Reservation.countDocuments({
      status: "in_progress",
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
