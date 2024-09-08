import { Request, Response } from "express";
import {
  completeOrder,
  getInventory,
  getOrderParts,
} from "../service/inventory";
import { purchaseProduct } from "../service/transaction";
import { DB } from "../app";

const Controllers = {
  /** Fetch all products */
  getProducts: (req: Request, res: Response) => {
    res.json(getInventory());
  },
  /**
   * Purchase products
   * @param {number[]} req.body.productIds - Array of product IDs to purchase
   */
  purchaseProduct: async (req: Request, res: Response) => {
    const { productIds } = req.body;
    await purchaseProduct(productIds);
    res.json(getInventory());
  },
  /** Fetch all orders */
  getOrders: (req: Request, res: Response) => {
    res.json({
      orders: DB.orders,
    });
  },
  /** Fetch all order parts */
  getOrderParts: async (req: Request, res: Response) => {
    const data = await getOrderParts();
    res.json(data);
  },
  /** Completes an order */
  completeOrder: async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const remainingOrders = completeOrder(id);

    res.json({ orders: remainingOrders });
  },
  /** Reset mock database */
  resetAll: (req: Request, res: Response) => {
    DB.reset();
    res.json({
      orders: DB.orders,
      ...getInventory(),
    });
  },
};

export default Controllers;
