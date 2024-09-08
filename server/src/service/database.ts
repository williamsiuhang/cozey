import fs from "fs";
import path from "path";
import { Order, Part, Product } from "@cozey/index";

/**
 * In a real production environment, we would use SQL or NoSQL to store our data.
 * For this assessment, we will use a JSON file to store our mock data,
 * and a Database class to represent the database.
 *
 * Also, we will skip getters / setters in this assessment for simplicity.
 */
export default class Database {
  products: Product[] = [];
  orders: Order[] = [];
  parts: Part[] = [];

  constructor() {
    this.reset();
  }

  reset() {
    const partsPath = path.resolve(__dirname, "../data/parts.json");
    const productsPath = path.resolve(__dirname, "../data/products.json");
    const ordersPath = path.resolve(__dirname, "../data/orders.json");

    this.parts = JSON.parse(fs.readFileSync(partsPath, "utf-8"));
    this.products = JSON.parse(fs.readFileSync(productsPath, "utf-8"));
    this.orders = JSON.parse(fs.readFileSync(ordersPath, "utf-8"));
  }
}
