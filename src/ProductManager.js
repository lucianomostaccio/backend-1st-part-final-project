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
  //cargar productos desde el json
  async loadProductsFromFile() {
    try {
      const data = await fs.promises.readFile(this.path, "utf8");
      this.products = JSON.parse(data);
      console.log("Productos leídos desde el json:", this.products);
      const lastProduct = this.products[this.products.length - 1];
      if (lastProduct) {
        this.nextId = lastProduct.id + 1;
      }
    } catch (err) {
      console.error("Error al cargar los productos desde el archivo:", err);
    }
  }
  //guardar todos los productos en el json
  async saveProductsToFile() {
    try {
      const data = JSON.stringify(this.products, null, 2);
      await fs.promises.writeFile(this.path, data, "utf8");
      console.log("Productos guardados en el archivo correctamente.");
    } catch (err) {
      console.error("Error al guardar los productos en el archivo:", err);
    }
  }
  //agregar producto
  async addProduct(productData) {
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

    if (!title || !description || !code || !price || !stock || !category) {
      console.error(
        "Los campos son obligatorios: title, description, code,  price, status (es 'true' por defecto), stock, y category. El array de thumbnails es opcional."
      );
      return;
    }
    //chequear si ya existe
    const codeExists = this.products.some((product) => product.code === code);
    if (codeExists) {
      console.error("Ya existe un producto con ese código.");
      return;
    }
    //setear nuevo producto
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

    this.products.push(newProduct); //pushearlo
    console.log("se acaba de agregar el producto en el array:", newProduct);
    this.nextId++; //autogenerar el id sumando 1
    await this.saveProductsToFile(); //ejecutar la función para escribir el nuevo producto en el json
    console.log("Producto agregado:", newProduct);
  }

  //traer los productos
  getProducts() {
    return this.products;
  }

  //traer producto por id
  getProductById(id) {
    const product = this.products.find((product) => product.id === id);
655
    if (!product) {
      console.error("Producto no encontrado");
    } else {
      return product;
    }
  }
  //updatear producto obtenido con id en el paso anterior
  async updateProduct(id, updatedProduct) {
    const index = this.products.findIndex((product) => product.id === id);

    if (index !== -1) {
      this.products[index] = { ...this.products[index], ...updatedProduct };
      await this.saveProductsToFile();
      console.log("Producto actualizado:", this.products[index]);
    } else {
      console.error("Producto no encontrado para actualizar");
    }
  }

  //borrar producto por id
  async deleteProduct(id) {
    const index = this.products.findIndex((product) => product.id === id);

    if (index !== -1) {
      this.products.splice(index, 1);
      await this.saveProductsToFile();
      console.log("Producto eliminado con éxito.");
    } else {
      console.error("Producto no encontrado para eliminar");
    }
  }
}

module.exports = ProductManager;
