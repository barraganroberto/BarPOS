import client from "./client";

// GET /api/products
export async function fetchProducts() {
    const res = await client.get("/products");
    return res.data;
}

// POST /api/products
export async function createProduct(payload) {
    const res = await client.post("/products", payload);
    return res.data;
}

// PUT /api/products/:id
export async function updateProduct({ id, ...payload }) {
    const res = await client.put(`/products/${id}`, payload);
    return res.data;
}

// DELETE /api/products/:id
export async function deleteProduct(id) {
    const res = await client.delete(`/products/${id}`);
    return res.data;
}