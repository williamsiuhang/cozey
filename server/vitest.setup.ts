import { vi } from "vitest";
import Database from "./src/service/database";

// Mock the database instance
vi.mock("../../app", () => {
  return {
    DB: new Database(),
  };
});

// Mock the random-name module globally
vi.mock("random-name", () => {
  return {
    default: {
      first: vi.fn(() => "Vi"),
      last: vi.fn(() => "Tester"),
    },
  };
});
