const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "../products.json");

class ProductManager {
  constructor() {
    this.path = filePath;
    this.products = [];
    this.nextId = 1;
    this.loadProductsFromFile();
  }

  loadProductsFromFile() {
    try {
      const data = fs.readFileSync(this.path, "utf8");
      this.products = JSON.parse(data);
      const lastProduct = this.products[this.products.length - 1];
      if (lastProduct) {
        this.nextId = lastProduct.id + 1;
      }
    } catch (err) {
      console.error("Error al cargar los productos desde el archivo:", err);
    }
  }

  saveProductsToFile() {
    try {
      const data = JSON.stringify(this.products, null, 2);
      fs.writeFileSync(this.path, data, "utf8");
      console.log("Productos guardados en el archivo correctamente.");
    } catch (err) {
      console.error("Error al guardar los productos en el archivo:", err);
    }
  }

  addProduct(productData) {
    const {
      title,
      description,
      code,
      price,
      status = true,
      stock,
      category,
      thumbnails,
    } = productData;

    if (
      !title ||
      !description ||
      !code ||
      !price ||
      status ||
      !stock ||
      category ||
      !thumbnails
    ) {
      console.error(
        "Los campos son obligatorios: title, description, code,  price, status (es 'true' por defecto), stock, y category. El array de thumbnails es opcional."
      );
      return;
    }

    const codeExists = this.products.some((product) => product.code === code);
    if (codeExists) {
      console.error("Ya existe un producto con ese código.");
      return;
    }

    const newProduct = {
      id: this.nextId,
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnails,
    };

    this.products.push(newProduct);
    this.nextId++;
    this.saveProductsToFile();
    console.log("Producto agregado:", newProduct);
  }

  getProducts() {
    return this.products;
  }

  getProductById(id) {
    const product = this.products.find((product) => product.id === id);

    if (!product) {
      console.error("Producto no encontrado");
    } else {
      return product;
    }
  }

  updateProduct(id, updatedProduct) {
    const index = this.products.findIndex((product) => product.id === id);

    if (index !== -1) {
      this.products[index] = { ...this.products[index], ...updatedProduct };
      this.saveProductsToFile();
      console.log("Producto actualizado:", this.products[index]);
    } else {
      console.error("Producto no encontrado para actualizar");
    }
  }

  deleteProduct(id) {
    const index = this.products.findIndex((product) => product.id === id);

    if (index !== -1) {
      this.products.splice(index, 1);
      this.saveProductsToFile();
      console.log("Producto eliminado con éxito.");
    } else {
      console.error("Producto no encontrado para eliminar");
    }
  }
}

module.exports = ProductManager;
