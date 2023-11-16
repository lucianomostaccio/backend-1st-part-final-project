const express = require("express");
const router = express.Router();
const fs = require("fs/promises");
const path = require("path");

const cartsFilePath = path.join(__dirname, "../cart.json");

// Rutas para manejo de carritos


router.post("/", async (req, res) => {
  try {
    const { products } = req.body;

    if (!Array.isArray(products)) {
      res.status(400).send("La propiedad 'products' debe ser un array.");
      return;
    }

    const cartsData = await fs.readFile(cartsFilePath, "utf-8");
    const carts = JSON.parse(cartsData);

    // Autogenerar ID
    const id = carts.reduce((maxId, cart) => (cart.id > maxId ? cart.id : maxId), 0) + 1;

    const newCart = {
      id,
      products,
    };

    carts.push(newCart);

    await fs.writeFile(cartsFilePath, JSON.stringify(carts, null, 2), "utf-8");

    res.json(newCart);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error interno del servidor");
  }
});

router.get("/:cid", async (req, res) => {
  try {
    const cartId = Number(req.params.cid);
    const cartsData = await fs.readFile(cartsFilePath, "utf-8");
    const carts = JSON.parse(cartsData);
    const cart = carts.find((cart) => cart.id === cartId);

    if (cart) {
      res.json(cart.products);
    } else {
      res.status(404).send("Carrito no encontrado");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error interno del servidor");
  }
});

router.post("/:cid/product/:pid", async (req, res) => {
  try {
    const cartId = Number(req.params.cid);
    const productId = Number(req.params.pid);
    const { quantity } = req.body;

    if (!quantity || isNaN(quantity)) {
      res.status(400).send("La propiedad 'quantity' es requerida y debe ser un número.");
      return;
    }

    const cartsData = await fs.readFile(cartsFilePath, "utf-8");
    const carts = JSON.parse(cartsData);

    const index = carts.findIndex((cart) => cart.id === cartId);

    if (index !== -1) {
      const cart = carts[index];
      const existingProductIndex = cart.products.findIndex((product) => product.id === productId);

      if (existingProductIndex !== -1) {
        cart.products[existingProductIndex].quantity += quantity;
      } else {
        cart.products.push({ id: productId, quantity });
      }

      await fs.writeFile(cartsFilePath, JSON.stringify(carts, null, 2), "utf-8");

      res.json(cart);
    } else {
      res.status(404).send("Carrito no encontrado");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error interno del servidor");
  }
});



module.exports = router;