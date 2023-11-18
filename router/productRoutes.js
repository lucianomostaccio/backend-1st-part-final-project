const express = require("express");
const router = express.Router();
const ProductManager = require("../src/ProductManager");

const productManager = new ProductManager();

// Rutas para manejo de productos

// Obtener todos los productos
// @ts-ignore
router.get("/", async (req, res) => {
  try {
    const products = await productManager.getProducts();
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener los productos" });
  }
});

// Obtener un producto por ID
router.get("/:pid", async (req, res) => {
  try {
    const productId = Number(req.params.pid);
    console.log("id de producto ingresada:", productId);
    const product = await productManager.getProductById(productId);

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

// Agregar un nuevo producto
router.post("/", async (req, res) => {
  const productData = req.body;
  try {
    await productManager.addProduct(productData);
    res.status(201).json({ message: "Pedido de agregado exitoso" });
    console.log("producto agregado:", productData);
  } catch (error) {
    console.error("error al agregar el producto", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Actualizar un producto por id
router.put("/:pid", async (req, res) => {
  const productId = Number(req.params.pid);
  console.log("id de producto ingresada:", productId);
  const updatedProduct = req.body;
  console.log("nuevos campos", updatedProduct);
  productManager.updateProduct(productId, updatedProduct);
  res.json({
    message:
      "Pedido exitoso, producto deberia haberse actualizado exitosamente",
  });
});

// Eliminar un producto por ID
router.delete("/:pid", async (req, res) => {
  const productId = Number(req.params.pid);
  productManager.deleteProduct(productId);
  res.json({
    message: "Pedido exitoso, debería haberse eliminado el producto",
  });
});

module.exports = router;
