import * as productModel from "../models/productModel.js";

// Create
export const storeProducts = async (req, res) => {
  const {
    sku_produk,
    kategori_produk,
    nama_produk,
    harga_beli,
    harga_jual,
    stok,
    approved,
    id_user,
    id_supplier,
  } = req.body;

  try {
    const result = await productModel.storeProducts(
      sku_produk,
      kategori_produk,
      nama_produk,
      harga_beli,
      harga_jual,
      stok,
      approved,
      id_user,
      id_supplier
    );

    return res
      .status(201)
      .json({ message: "Product stored successfully", product: result });
  } catch (error) {
    console.error("storeProducts error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Read
export const getAllProducts = async (req, res) => {
  try {
    const products = await productModel.getAllProducts();

    return res.status(200).json(products);
  } catch (error) {
    console.error("getAllProducts error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getProductById = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await productModel.getProductById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json(product);
  } catch (error) {
    console.error("getProductById error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Update
export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const {
    sku_produk,
    kategori_produk,
    nama_produk,
    harga_beli,
    harga_jual,
    stok,
    approved,
  } = req.body;

  try {
    // supplier hanya boleh update produknya sendiri diambil dari JWT
    if (req.user.id_supplier) {
      const product = await productModel.getProductById(id);
      if (!product || product.id_supplier !== req.user.id_supplier) {
        return res.status(403).json({ message: "Access denied" });
      }
    }

    const affectedRows = await productModel.updateProduct(
      id,
      sku_produk,
      kategori_produk,
      nama_produk,
      harga_beli,
      harga_jual,
      stok,
      approved
    );

    if (affectedRows === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json({ message: "Product updated successfully" });
  } catch (error) {
    console.error("updateProduct error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const assignProductToEmployeeByEmployeeId = async (req, res) => {
  const { id } = req.params;
  const { id_user } = req.body;

  try {
    const affectedRows = await productModel.assignProductToEmployeeByEmployeeId(
      id,
      id_user
    );

    if (affectedRows === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res
      .status(200)
      .json({ message: "Product assigned to employee successfully" });
  } catch (error) {
    console.error("assignProductToEmployeeByEmployeeId error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const reStockProduct = async (req, res) => {
  const { id_produk, newStock } = req.body;

  try {
    const affectedRows = await productModel.reStockProduct(id_produk, newStock);

    if (affectedRows === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json({ message: "Product restocked successfully" });
  } catch (error) {
    console.error("reStockProduct error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Delete
export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    // supplier hanya boleh hapus produknya sendiri diambil dari JWT
    if (req.user.id_supplier) {
      const product = await productModel.getProductById(id);
      if (!product || product.id_supplier !== req.user.id_supplier) {
        return res.status(403).json({ message: "Access denied" });
      }
    }

    const affectedRows = await productModel.deleteProduct(id);

    if (affectedRows === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("deleteProduct error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
