const express = require("express");
const {
  createReservation,
  getReservations,
  updateReservation,
  deleteReservations,
  getStatusHistory,
  getStatistics,
} = require("../controllers/reservationController");
const { protect, adminOnly } = require("../middlewares/authMiddleware");

const router = express.Router();

// Rutas principales
router
  .route("/")
  .get(protect, getReservations) // Filtros en reservas
  .post(protect, createReservation);

router.route("/:id").patch(protect, updateReservation); // Actualizar reserva
router.route("/:id").delete(protect, adminOnly, deleteReservations); // delete

// Ruta para historial de cambios
router.route("/:reservationId/history").get(protect, getStatusHistory);

// Ruta para estadísticas
router.route("/statistics").get(protect, adminOnly, getStatistics);

module.exports = router;
