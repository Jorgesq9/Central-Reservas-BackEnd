const app = require("./app");
const mongoose = require("mongoose");
require("dotenv").config();

// Conectar a MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {});
    console.log("MongoDB conectado correctamente");
  } catch (error) {
    console.error("Error al conectar MongoDB", error);
    process.exit(1);
  }
};

// Llamar a la conexión y arrancar el servidor
connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Servidor corriendo en http://localhost:${PORT}`)
);
