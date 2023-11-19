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
