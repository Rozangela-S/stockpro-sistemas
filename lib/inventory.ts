export type MovementType = "entrada" | "saida";

export type Product = {
  id: string;
  name: string;
  category: string;
  supplier: string;
  costPrice: number;
  salePrice: number;
  quantity: number;
  minQuantity: number;
  extra: Record<string, string>;
  createdAt: string;
};

export type Movement = {
  id: string;
  productId: string;
  productName: string;
  type: MovementType;
  quantity: number;
  createdAt: string;
};

export function getProducts(storageKey: string): Product[] {
  if (typeof window === "undefined") return [];

  const data = localStorage.getItem(storageKey);

  if (!data) return [];

  try {
    return JSON.parse(data) as Product[];
  } catch {
    return [];
  }
}

export function saveProducts(storageKey: string, products: Product[]) {
  if (typeof window === "undefined") return;

  localStorage.setItem(storageKey, JSON.stringify(products));
}

export function createProduct(
  storageKey: string,
  product: Omit<Product, "id" | "createdAt">
) {
  const products = getProducts(storageKey);

  const newProduct: Product = {
    ...product,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };

  saveProducts(storageKey, [newProduct, ...products]);

  return newProduct;
}

export function deleteProduct(storageKey: string, productId: string) {
  const products = getProducts(storageKey);

  const updatedProducts = products.filter((product) => product.id !== productId);

  saveProducts(storageKey, updatedProducts);

  return updatedProducts;
}

export function updateProductQuantity(
  storageKey: string,
  productId: string,
  type: MovementType,
  quantity: number
) {
  const products = getProducts(storageKey);

  const updatedProducts = products.map((product) => {
    if (product.id !== productId) return product;

    const nextQuantity =
      type === "entrada"
        ? product.quantity + quantity
        : Math.max(product.quantity - quantity, 0);

    return {
      ...product,
      quantity: nextQuantity,
    };
  });

  saveProducts(storageKey, updatedProducts);

  return updatedProducts;
}