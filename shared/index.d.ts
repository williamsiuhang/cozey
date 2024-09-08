/**
 * Database types -----------------------------------------------------------------------
 * This file contains the types for the database.
 * Each type represents a table schema in the database.
 */

/** Individual product inside a line item */
export type Part = {
  id: number;
  name: string;
  quantity: number;
};

/** Line item */
export type Product = {
  id: number;
  name: string;
  price: number;
  partIds: Part["id"][];
};

/** Customer order */
export type Order = {
  id: number;
  total: number;
  date: string;
  shippingAddress: string;
  customerName: string;
  customerEmail: string;
  productIds: Product["id"][];
  status: "paid" | "fulfilled";
};

/**
 * Custom types --------------------------------------------------------------------------
 * This section contains the custom types for the application.
 */

/** Details of a part (id & name) */
export type PartDetails = Omit<Part, "quantity">;

/** Details of a product including available stock */
export type ProductDetails = Product & {
  stock: number; // computed inventory based on Part quantities
};

/** YYYY-MM-DD */
type Date = string;

/**
 * Response types ------------------------------------------------------------------------
 * This section contains the types for the responses from the server.
 */

/**
 * Products and parts details,
 * including available product stock
 */
export type ResponseProducts = {
  products: ProductDetails[];
  parts: PartDetails[];
};

/** Existing orders in the database */
export type ResponseOrders = {
  orders: Order[];
};

/**
 * Order parts data using date (YYYY-MM-DD) as key,
 * and an array of part IDs from the orders of that day
 */
export type ResponseOrderParts = Record<Date, Part["id"][]>;

/** List of remaining unfulfilled orders */
export type ResponseCompleteOrder = {
  orders: Order[]; // unfulfilled orders
};
