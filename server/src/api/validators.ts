import { NextFunction, Request, Response } from "express";
import { body, param, validationResult } from "express-validator";
import { getProductDetails } from "../service/inventory";
import { DB } from "../app";

/**
 * Express validation chain checker
 * place at the end of validation chains
 */
const validateAll = (req: Request, res: Response, next: NextFunction) => {
  // Finds the validation errors in this request and wraps them in an object with handy functions
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.error(errors.array());
    const error = errors.array()[0]; // only first error
    return res.status(400).send(error.msg || "Invalid request");
  }
  next();
};

// Express validation chains
export default {
  purchaseProduct: [
    body("productIds").isArray().withMessage("Product IDs must be an array"),
    body("productIds.*")
      .isNumeric()
      .withMessage("Product IDs must be a number"),
    body("productIds").custom((ids: number[]) => {
      const products = getProductDetails();
      const count = ids.reduce((acc: Record<number, number>, id: number) => {
        acc[id] = (acc[id] || 0) + 1;
        return acc;
      }, {});

      for (const [productId, quantity] of Object.entries(count)) {
        const product = products.find(
          (product) => Number(product.id) === Number(productId)
        );

        // check that product exists
        if (!product) {
          throw new Error(`Product ID ${productId} does not exist`);
        }

        // check that product has enough stock
        if (product.stock < quantity) {
          throw new Error(`Product ID ${productId} does not have enough stock`);
        }
      }

      return true;
    }),
    validateAll,
  ],
  completeOrder: [
    param("id").isNumeric().withMessage("Order ID must be a number"),
    param("id").custom((id) => {
      const order = DB.orders.find((order) => Number(order.id) === Number(id));

      // Check that order ID exists
      if (!order) {
        throw new Error(`Order ID ${id} does not exist`);
      }

      // Check that order is not yet completed
      if (order.status === "fulfilled") {
        throw new Error(`Order ID ${id} is already completed`);
      }

      return true;
    }),
    validateAll,
  ],
};
