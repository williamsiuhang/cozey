import { describe, expect, it, vi } from "vitest";
import Database from "../database";
import {
  getProductDetails,
  getPartDetails,
  getInventory,
  getOrderParts,
  completeOrder,
} from "../inventory";
import { DB } from "../../app";

describe("InventoryService", () => {
  it("should get product details with correct stock", () => {
    const productDetails = getProductDetails();
    expect(productDetails).toEqual([
      {
        id: 1,
        name: "Valentines Box",
        partIds: [1, 2, 3, 4],
        price: 150,
        stock: 5,
      },
      { id: 2, name: "Birthday Box", partIds: [5, 6, 7], price: 120, stock: 5 },
      {
        id: 3,
        name: "Client Gift Box",
        partIds: [8, 9, 10],
        price: 60,
        stock: 5,
      },
    ]);
  });

  it("should get part details excluding quantity", () => {
    const partDetails = getPartDetails();
    expect(partDetails).toEqual([
      { id: 1, name: "Red Roses Bouquet" },
      { id: 2, name: "Box of chocolates" },
      { id: 3, name: "Love card" },
      { id: 4, name: "Women’s perfume" },
      { id: 5, name: "Birthday cupcake" },
      { id: 6, name: "$100 Visa Gift Card" },
      { id: 7, name: "Birthday card" },
      { id: 8, name: "Bottle of wine" },
      { id: 9, name: "Fruit basket" },
      { id: 10, name: "Pen" },
    ]);
  });

  it("should get inventory details of products and parts", () => {
    const inventory = getInventory();
    expect(inventory).toEqual({
      products: [
        {
          id: 1,
          name: "Valentines Box",
          partIds: [1, 2, 3, 4],
          price: 150,
          stock: 5,
        },
        {
          id: 2,
          name: "Birthday Box",
          partIds: [5, 6, 7],
          price: 120,
          stock: 5,
        },
        {
          id: 3,
          name: "Client Gift Box",
          partIds: [8, 9, 10],
          price: 60,
          stock: 5,
        },
      ],
      parts: [
        { id: 1, name: "Red Roses Bouquet" },
        { id: 2, name: "Box of chocolates" },
        { id: 3, name: "Love card" },
        { id: 4, name: "Women’s perfume" },
        { id: 5, name: "Birthday cupcake" },
        { id: 6, name: "$100 Visa Gift Card" },
        { id: 7, name: "Birthday card" },
        { id: 8, name: "Bottle of wine" },
        { id: 9, name: "Fruit basket" },
        { id: 10, name: "Pen" },
      ],
    });
  });

  it("should get order parts grouped by date", () => {
    const orderParts = getOrderParts();
    expect(orderParts).toEqual({
      "2024-08-20": [1, 2, 3, 4, 5, 6, 7],
      "2024-08-21": [1, 2, 3, 4],
    });
  });
});

describe("InventoryService - completeOrder", () => {
  it("should complete an order", () => {
    expect(DB.orders[0].status).toBe("paid");
    completeOrder(1);
    expect(DB.orders[0].status).toBe("fulfilled");
  });

  it("shoud throw an error if order is not found", async () => {
    expect(() => completeOrder(123)).toThrow("Order not found");
  });
});
