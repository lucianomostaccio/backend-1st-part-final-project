// const express = require("express");
// const router = express.Router();
// const fs = require("fs/promises");
// const path = require("path");

// const cartsFilePath = path.join(__dirname, "../carts.json");

// // Rutas para manejo de carritos

// router.post("/", async (req, res) => {
//   try {
//     const { products } = req.body;

//     if (!Array.isArray(products)) {
//       res.status(400).send("La propiedad 'products' debe ser un array.");
//       return;
//     }

//     const cartsData = await fs.readFile(cartsFilePath, "utf-8");
//     const carts = JSON.parse(cartsData);

//     // Autogenerar ID para cart
//     const id = carts.reduce((maxId, cart) => (cart.id > maxId ? cart.id : maxId), 0) + 1;

//     const newCart = {
//       id,
//       products,
//     };

//     carts.push(newCart);

//     await fs.writeFile(cartsFilePath, JSON.stringify(carts, null, 2), "utf-8");

//     res.json(newCart);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Error interno del servidor");
//   }
// });

// router.get("/:cid", async (req, res) => {
//   try {
//     const cartId = Number(req.params.cid);
//     const cartsData = await fs.readFile(cartsFilePath, "utf-8");
//     const carts = JSON.parse(cartsData);
//     const cart = carts.find((cart) => cart.id === cartId);

//     if (cart) {
//       res.json(cart.products);
//     } else {
//       res.status(404).send("Carrito no encontrado");
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Error interno del servidor");
//   }
// });

// router.post("/:cid/product/:pid", async (req, res) => {
//   try {
//     const cartId = Number(req.params.cid);
//     const productId = Number(req.params.pid);
//     const { quantity } = req.body;

//     if (!quantity || isNaN(quantity)) {
//       res.status(400).send("La propiedad 'quantity' es requerida y debe ser un número.");
//       return;
//     }

//     const cartsData = await fs.readFile(cartsFilePath, "utf-8");
//     const carts = JSON.parse(cartsData);

//     const index = carts.findIndex((cart) => cart.id === cartId);

//     if (index !== -1) {
//       const cart = carts[index];
//       const existingProductIndex = cart.products.findIndex((product) => product.id === productId);

//       if (existingProductIndex !== -1) {
//         cart.products[existingProductIndex].quantity += quantity;
//       } else {
//         cart.products.push({ id: productId, quantity });
//       }

//       await fs.writeFile(cartsFilePath, JSON.stringify(carts, null, 2), "utf-8");

//       res.json(cart);
//     } else {
//       res.status(404).send("Carrito no encontrado");
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Error interno del servidor");
//   }
// });
// module.exports = router;

//nuevo code:
const express = require("express");
const router = express.Router();
const CartManager = require("../src/CartManager");

const cartManager = new CartManager();

// Rutas para manejo de carts

// Agregar un nuevo cart
router.post("/", async (req, res) => {
  try {
    await cartManager.addCart();
    res.status(201).json({ message: "cart agregado exitosamente" });
  } catch (error) {
    console.error("error al agregar el carrito", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Obtener un cart por ID
router.get("/:pid", async (req, res) => {
  try {
    const cartId = Number(req.params.pid);
    console.log("id de cart ingresada:", cartId);
    const cart = await cartManager.getCartById(cartId);

    if (cart) {
      res.json(cart);
    } else {
      res.status(404).send("Cart no encontrado");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error interno del servidor");
  }
});

// Agregar a un cart específico un producto
router.post("/:cid/product/:pid", async (req, res) => {
  try {
    const cartId = Number(req.params.cid);
    const prodId = Number(req.params.pid);
    console.log(
      `Se está buscando en el carrito con id:${cartId}, el producto con id:${prodId}`
    );

    await cartManager.addProductToCart(cartId, prodId);
    res.json({
      message: "pedido exitoso. Si existe el carrito se agregó el producto",
    });
  } catch (error) {
    console.error("Error al agregar el producto al carrito:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

module.exports = router;
