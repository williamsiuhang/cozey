# Cozey Technical Assessment

## Installation / Requirements

Requires docker installed

1. In project folder, run `docker compose up -d`

Note: Restarting server resets all data

---

## Problem

The retailer sells gift boxes containing multiple products. Customers order a single box (e.g., Valentine's Box), but the warehouse must pick and pack individual items for each order. The warehouse team currently creates manual lists for picking items and packing orders. The task is to automate the process by building a simple software solution for the company.

---

## Objective

Create a Warehouse Management System (WMS) to automate eCommerce operations, handling customer orders and generating picking and packing lists. For this assessment, the shop and WMS will be combined into a single dashboard.

---

## Features

The solution will consist of a Shop and Warehouse Management System built with Vite and React, using the Joy UI library by MUI. The server will be created with Node and Express. For the purpose of this assessment, the Shop and WMS are combined into one dashboard. The dashboard will include the following features:

### Shop:

- Users can view available products (giftboxes) and remaining stock.
- Users can purchase giftboxes.

### Warehouse (Order Parts, Packaging, Orders):

- Users can view all orders
- Picking team can view Order Parts for orders from specified dates
- Packing team can view Packaging for orders along with their packing details
- Packing team can "Complete Order" for packed and shipped orders

**_Terminology_**

"Parts" are individual items that make up giftboxes.

"Products" are giftboxes.

"Orders" refer to the entire cart/line items.

`Reference shared/index.d.ts for database schemas, custom and API endpoint response type definitions`

Orders: Displays all orders, regardless of status.

Packaging: Lists all orders with detailed breakdowns, including the parts that make up giftboxes and shipping information for the packing team.

Order Parts: Shows a list of all the parts needed for the day’s orders, providing a picking list for the warehouse team.

---

## Technical Breakdown:

App Setup:

- The app was created using Vite and React for building the frontend UI. The frontend was built using Joy UI from MUI for a clean and minimal user interface.

Backend:

- The server was built with Node.js and Express to create API endpoints for Shop and WMS.

Containerization:

- Docker was used for easy setup and consistent environments, with a docker-compose.yml file to start both the web app and Node server.

TypeScript:

- TypeScript was used with type definitions representing database schemas and handling other business logic. Type definitions are shared between app and server.

Mocked Database:

- A mock database was implemented using a Database class that reads from parts.json, products.json, and orders.json files to simulate real data. In a production environment, this would be replaced by a real SQL (e.g., PostgreSQL) or NoSQL database.

Unit Testing:

- Vitest was used for unit testing

---

## Challenges and Limitations

Price Calculations for Individual Parts:

- Pricing is based on gift boxes, not individual parts. If the business wants to sell parts separately, the pricing logic needs adjustment.

Discounts/Coupons:

- Currently, discounts aren’t supported. Adding a "coupons" table to apply discounts to order.total before saving could resolve this.

Timezone Management:

- The app assumes a single timezone, which may cause issues when generating lists for "yesterday's" orders across different timezones.
