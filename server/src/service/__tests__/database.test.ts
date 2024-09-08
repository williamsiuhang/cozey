import { describe, expect, it, beforeEach } from "vitest";
import fs from "fs";
import path from "path";
import Database from "../database";

// Helper function to read JSON files
const readJSONFile = (filePath: string) => {
  const absolutePath = path.resolve(__dirname, filePath);
  const fileContent = fs.readFileSync(absolutePath, "utf-8");
  return JSON.parse(fileContent);
};

describe("DatabaseService", () => {
  let db: Database;

  beforeEach(() => {
    db = new Database();
  });

  it("should create database instance with correct products", () => {
    const expectedProducts = readJSONFile("../../data/products.json");
    expect(db.products).toEqual(expectedProducts);
  });

  it("should create database instance with correct parts", () => {
    const expectedParts = readJSONFile("../../data/parts.json");
    expect(db.parts).toEqual(expectedParts);
  });

  it("should create database instance with correct orders", () => {
    const expectedOrders = readJSONFile("../../data/orders.json");
    expect(db.orders).toEqual(expectedOrders);
  });
});
