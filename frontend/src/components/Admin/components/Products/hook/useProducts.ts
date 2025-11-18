import { useEffect, useState } from "react";
import { getProducts, createProduct, deleteProduct, updateProduct } from "@/apis/productApi";
import { IProduct } from "@/types/types";

export function useProducts() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      console.error("Lỗi lấy sản phẩm:", error);
    } finally {
      setLoading(false);
    }
  };

  // CREATE
  const addProduct = async (product: IProduct) => {
    try {
      const newProduct = await createProduct(product);
      setProducts((prev) => [...prev, newProduct]);
      return newProduct;
    } catch (error) {
      console.error("Lỗi tạo sản phẩm:", error);
      throw error;
    }
  };

  // UPDATE
  const editProduct = async (id: number, product: IProduct) => {
    try {
      const updated = await updateProduct(id, product);
      setProducts((prev) =>
        prev.map((p) => (p.product_id === id ? updated : p))
      );
      return updated;
    } catch (error) {
      console.error("Lỗi cập nhật sản phẩm:", error);
      throw error;
    }
  };

  // DELETE
  const removeProduct = async (id: number) => {
    try {
      await deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.product_id !== id));
    } catch (error) {
      console.error("Lỗi xóa sản phẩm:", error);
      throw error;
    }
  };

  // LOAD LẦN ĐẦU
  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products,
    loading,
    fetchProducts,
    addProduct,
    editProduct,
    removeProduct,
  };
}
