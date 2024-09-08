import { PartDetails, ProductDetails, ResponseProducts } from "@cozey/index";
import { DB } from "../app";
import dayjs from "dayjs";

/**
 * Get the product details and available product inventory.
 * Product stock is based on the quantity of product parts
 */
export const getProductDetails = (): ProductDetails[] => {
  return DB.products.map((product) => {
    const parts = product.partIds.map((partId) => {
      return DB.parts.find((part) => part.id === partId);
    });

    // Determine the available stock
    // based on the minimum quantity of parts
    const stock = Math.min(...parts.map((part) => part?.quantity ?? 0));

    return {
      ...product,
      stock,
    };
  });
};

/** Get the part details excluding quantity */
export const getPartDetails = (): PartDetails[] => {
  return DB.parts.map((part) => ({
    id: part.id,
    name: part.name,
  }));
};

/** Get the inventory details of products and parts */
export const getInventory = (): ResponseProducts => {
  return {
    products: getProductDetails(),
    parts: getPartDetails(),
  };
};

/**
 * Determine the daily list for order parts based on existing orders.
 * For the purpose of this assessment, we will ignore timezones differences.
 */
export const getOrderParts = () => {
  // Get all accumulated product IDs and part IDs from orders per day
  const dates = [
    ...new Set(
      DB.orders.map((order) => dayjs(order.date).format("YYYY-MM-DD"))
    ),
  ].sort((a, b) => dayjs(b).unix() - dayjs(a).unix());

  // Map the part IDs of the orders for each date
  const data = dates.reduce(
    (acc: Record<string, PartDetails["id"][]>, date) => {
      // Initialize the order parts for date
      if (!acc[date]) acc[date] = [];

      // Get all product IDs for the date
      const productIds = DB.orders
        .filter((order) => dayjs(order.date).format("YYYY-MM-DD") === date)
        .map((order) => order.productIds)
        .flat();

      // Get all part IDs for the date
      const partIds = productIds.map((productId) => {
        const product = DB.products.find((product) => product.id === productId);
        return product?.partIds ?? [];
      });

      acc[date].push(...partIds.flat());
      return acc;
    },
    {}
  );

  return data;
};

/**
 * Complete an order by updating the order status to "fulfilled".
 * @returns The remaining paid orders
 */
export const completeOrder = (orderId: number) => {
  const order = DB.orders.find((o) => o.id === orderId);

  if (!order) {
    throw new Error("Order not found");
  }

  // update order status
  order.status = "fulfilled";

  // return remaining paid orders
  return DB.orders.filter((o) => o.status === "paid");
};
