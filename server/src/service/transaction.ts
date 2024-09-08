import { Part, ProductDetails } from "@cozey/index";
import { DB } from "../app";
import { getProductDetails } from "./inventory";
import dayjs from "dayjs";
import randomName from "random-name";

/**
 * Purchase a product
 * @param productId
 */
export const purchaseProduct = async (productIds: number[]) => {
  // products
  const productDetails = getProductDetails();
  const products = productIds
    .map((id) => productDetails.find((p) => p.id === id))
    .filter((p) => p) as ProductDetails[];

  // check products exist
  if (!productIds.every((id) => products.some((p) => p.id === id)))
    throw new Error("Product not found");
  // check products are in stock
  if (products.some((p) => p.stock <= 0))
    throw new Error("Product out of stock");
  // check products have enough stock
  if (
    products.some(
      (p) => p.stock < productIds.filter((id) => id === p.id).length
    )
  )
    throw new Error("Product does not have enough stock");

  // update inventory
  for (const product of products) {
    // minus parts
    for (const partId of product.partIds) {
      const part = DB.parts.find((p) => p.id === partId) as Part;
      part.quantity -= 1;
    }
  }

  // create order
  const id = DB.orders.length + 1;
  const total = products.reduce((acc, p) => acc + p.price, 0);
  const date = dayjs().toISOString();
  const fName = randomName.first();
  const lName = randomName.last();

  DB.orders.push({
    id,
    total,
    date,
    shippingAddress: "123 Fake St",
    customerName: `${fName} ${lName}`,
    customerEmail: `${fName.toLowerCase()}.${lName.toLowerCase()}@example.com`,
    productIds,
    status: "paid",
  });
};
