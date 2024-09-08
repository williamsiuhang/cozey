import { api_url } from "../constants/index";
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const API = {
  get: async (url: string) => {
    const response = await fetch(`${api_url}${url}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.json();
  },
  post: async (url: string, data?: any) => {
    const response = await fetch(`${api_url}${url}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: data ? JSON.stringify(data) : undefined,
    });

    await delay(1000);

    return response.json();
  },
  put: async (url: string, data?: any) => {
    const response = await fetch(`${api_url}${url}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: data ? JSON.stringify(data) : undefined,
    });

    await delay(1000);

    return response.json();
  },
  delete: async (url: string) => {
    const response = await fetch(`${api_url}${url}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.json();
  },
};

export default API;
