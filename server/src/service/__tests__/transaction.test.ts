import { describe, expect, it, beforeAll, vi } from "vitest";
import { DB } from "../../app";
import Database from "../database";
import { purchaseProduct } from "../transaction";
import { getInventory, getOrderParts } from "../inventory";
import dayjs from "dayjs";

describe("TransactionService", () => {
  it("should purchase products", async () => {
    await purchaseProduct([1, 2]);

    expect(DB.orders).toHaveLength(3);
    expect(DB.orders[2]).toMatchObject({
      id: 3,
      total: 270,
      productIds: [1, 2],
      status: "paid",
      customerName: "Vi Tester",
      customerEmail: "vi.tester@example.com",
    });
    expect(DB.parts.find((part) => part.id === 1)?.quantity).toBe(4);
    expect(DB.parts.find((part) => part.id === 2)?.quantity).toBe(4);
    expect(DB.parts.find((part) => part.id === 3)?.quantity).toBe(4);
    expect(DB.parts.find((part) => part.id === 4)?.quantity).toBe(4);
    expect(DB.parts.find((part) => part.id === 5)?.quantity).toBe(4);
    expect(DB.parts.find((part) => part.id === 6)?.quantity).toBe(4);
    expect(DB.parts.find((part) => part.id === 7)?.quantity).toBe(4);
  });

  it("should throw an error if a product is not found", async () => {
    await expect(purchaseProduct([1, 4])).rejects.toThrow("Product not found");
  });

  it("should throw an error if a product is out of stock", async () => {
    let quantity = DB.parts.find((part) => part.id === 1)!.quantity;

    // Mock parts out of stock
    DB.parts.find((part) => part.id === 1)!.quantity = 0;
    await expect(purchaseProduct([1])).rejects.toThrow("Product out of stock");

    // reset quantity back
    DB.parts.find((part) => part.id === 1)!.quantity = quantity;
  });

  it("should throw an error if a product does not have enough stock", async () => {
    await expect(purchaseProduct([1, 1, 1, 1, 1])).rejects.toThrow(
      "Product does not have enough stock"
    );
  });
});

describe("InventoryService", () => {
  it("should get updated inventory details", () => {
    const inventory = getInventory();

    expect(inventory.products.find((p) => p.id === 1)?.stock).toBe(4);
    expect(inventory.products.find((p) => p.id === 2)?.stock).toBe(4);
    expect(inventory.products.find((p) => p.id === 3)?.stock).toBe(5);
  });

  it("should get updated order parts", () => {
    const orders = getOrderParts();
    const today = dayjs().format("YYYY-MM-DD");

    expect(orders[today]).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });
});
