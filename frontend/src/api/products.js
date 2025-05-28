import client from "./client";

export function fetchProducts() {
    return client.get("/products").then((res) => res.data);
}