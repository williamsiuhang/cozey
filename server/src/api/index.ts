import { Request, Response } from "express";
import Controllers from "./controllers";
import Validators from "./validators";
import { body } from "express-validator";

const MainRouter = require("express").Router();

MainRouter.get("/", (req: Request, res: Response) =>
  res.send("Cozey Giftbox API at your service")
);

// PUBLIC ROUTES
MainRouter.get("/products", Controllers.getProducts);
MainRouter.post(
  "/purchase",
  Validators.purchaseProduct,
  Controllers.purchaseProduct
);

// ADMIN ROUTES (WMS)
// ... Implement auth and permissions for these routes
MainRouter.get("/orders", Controllers.getOrders);
MainRouter.get("/order-parts", Controllers.getOrderParts);
MainRouter.put(
  "/complete-order/:id",
  Validators.completeOrder,
  Controllers.completeOrder
);

// DEV ROUTES
// ... Only for development / assessment purposes
MainRouter.post("/reset", Controllers.resetAll);

export default MainRouter;
