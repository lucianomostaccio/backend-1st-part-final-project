const fs = require("fs");
const path = require("path");

class ProductManager {
  constructor(filePath) {
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
    const { title, description, price, thumbnail, code, stock } = productData;

    if (!title || !description || !price || !thumbnail || !code || !stock) {
      console.error("Todos los campos son obligatorios.");
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
      price,
      thumbnail,
      code,
      stock,
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

// Ejemplo de uso:
const filePath = path.join(__dirname, "products.json");
const manager = new ProductManager(filePath);

const allProducts = manager.getProducts();
console.log("Todos los productos:", allProducts);

manager.addProduct({
  title: "Producto 1",
  description: "Descripción del producto 1",
  price: 10000,
  thumbnail: "images/producto1.jpg",
  code: "PROD001",
  stock: 50,
});

manager.addProduct({
  title: "Producto 2",
  description: "Descripción del producto 2",
  price: 5000,
  thumbnail: "images/producto2.jpg",
  code: "PROD002",
  stock: 70,
});

const productById = manager.getProductById(1);
console.log("Producto por ID:", productById);

manager.updateProduct(1, { price: 15000 }); // Actualizar el precio del Producto 1

manager.deleteProduct(2); // Eliminar el Producto 2
console.log("(se ha eliminado el producto 2)");
console.log("Todos los productos que quedaron:", allProducts);
