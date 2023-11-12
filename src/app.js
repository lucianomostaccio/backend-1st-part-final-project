const express = require("express");
const path = require("path");
const ProductManager = require("./ProductManager.js");

const app = express();
const port = 8080;

const filePath = path.join(__dirname, "../products.json");
const manager = new ProductManager(filePath);

// Endpoint para obtener todos los productos con opcional ?limit=
app.get("/products", async (req, res) => {
  try {
    // @ts-ignore
    const limit = Number(req.query.limit);
    const products = await manager.getProducts();

    if (!isNaN(limit)) {
      res.json(products.slice(0, limit));
    } else {
      res.json(products);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error interno del servidor");
  }
});

//Endpoint para obtener un producto por ID
app.get("/products/:pid", async (req, res) => {
  try {
    const productId = Number(req.params.pid);
    const product = await manager.getProductById(productId);

    if (product) {
      res.json(product);
    } else {
      res.status(404).send("Producto no encontrado");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error interno del servidor");
  }
});

// Iniciar el servidor
app.listen(port);
