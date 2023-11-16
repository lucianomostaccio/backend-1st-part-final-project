const express = require("express");

const app = express();
const port = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import rutas
const productRoutes = require("../router/productRoutes");
const cartRoutes = require("../router/cartRoutes");

// Configurar las rutas
app.use("/api/products", productRoutes);
app.use("/api/carts", cartRoutes);

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});
