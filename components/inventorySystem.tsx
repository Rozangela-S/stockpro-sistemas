"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { NicheConfig } from "@/data/niches";
import {
  createProduct,
  deleteProduct,
  getProducts,
  Product,
  updateProductQuantity,
} from "@/lib/inventory";

type InventorySystemProps = {
  config: NicheConfig;
};

export default function InventorySystem({ config }: InventorySystemProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("todas");

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    supplier: "",
    costPrice: "",
    salePrice: "",
    quantity: "",
    minQuantity: "",
    extra: {} as Record<string, string>,
  });

  useEffect(() => {
    setProducts(getProducts(config.storageKey));
  }, [config.storageKey]);

  const stats = useMemo(() => {
    const totalProducts = products.length;

    const totalItems = products.reduce(
      (total, product) => total + product.quantity,
      0
    );

    const totalCost = products.reduce(
      (total, product) => total + product.costPrice * product.quantity,
      0
    );

    const totalSale = products.reduce(
      (total, product) => total + product.salePrice * product.quantity,
      0
    );

    const lowStock = products.filter(
      (product) => product.quantity <= product.minQuantity
    ).length;

    const estimatedProfit = totalSale - totalCost;

    return {
      totalProducts,
      totalItems,
      totalCost,
      totalSale,
      lowStock,
      estimatedProfit,
    };
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesCategory =
        categoryFilter === "todas" || product.category === categoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [products, search, categoryFilter]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const product = createProduct(config.storageKey, {
      name: formData.name,
      category: formData.category,
      supplier: formData.supplier,
      costPrice: Number(formData.costPrice),
      salePrice: Number(formData.salePrice),
      quantity: Number(formData.quantity),
      minQuantity: Number(formData.minQuantity),
      extra: formData.extra,
    });

    setProducts([product, ...products]);

    setFormData({
      name: "",
      category: "",
      supplier: "",
      costPrice: "",
      salePrice: "",
      quantity: "",
      minQuantity: "",
      extra: {},
    });
  }

  function handleDelete(productId: string) {
    const updatedProducts = deleteProduct(config.storageKey, productId);
    setProducts(updatedProducts);
  }

  function handleMovement(productId: string, type: "entrada" | "saida") {
    const quantityText =
      type === "entrada"
        ? "Quantidade de entrada:"
        : "Quantidade de saída:";

    const value = prompt(quantityText);

    if (!value) return;

    const quantity = Number(value);

    if (Number.isNaN(quantity) || quantity <= 0) {
      alert("Informe uma quantidade válida.");
      return;
    }

    const updatedProducts = updateProductQuantity(
      config.storageKey,
      productId,
      type,
      quantity
    );

    setProducts(updatedProducts);
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <Header config={config} />

      <section className="px-6 pb-20 pt-32">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <Link
                href="/"
                className="text-sm font-bold text-blue-600 hover:text-blue-700"
              >
                ← Voltar para sistemas
              </Link>

              <h1 className="mt-5 text-4xl font-black tracking-tight text-slate-950 md:text-5xl">
                {config.title}
              </h1>

              <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
                {config.description}
              </p>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-3 lg:grid-cols-6">
            <StatCard title="Produtos" value={stats.totalProducts} />
            <StatCard title="Itens" value={stats.totalItems} />
            <StatCard title="Estoque baixo" value={stats.lowStock} />
            <StatCard
              title="Custo total"
              value={formatMoney(stats.totalCost)}
            />
            <StatCard
              title="Valor de venda"
              value={formatMoney(stats.totalSale)}
            />
            <StatCard
              title="Lucro estimado"
              value={formatMoney(stats.estimatedProfit)}
            />
          </div>

          <div className="mt-10 grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
            <form
              onSubmit={handleSubmit}
              className="rounded-3xl bg-white p-6 shadow-xl"
            >
              <h2 className="text-2xl font-black text-slate-950">
                Cadastrar {config.productLabel.toLowerCase()}
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Preencha os dados para adicionar um novo item ao estoque.
              </p>

              <div className="mt-6 grid gap-5">
                <Input
                  label={`Nome do ${config.productLabel.toLowerCase()}`}
                  value={formData.name}
                  placeholder={
                    config.key === "mercadinho"
                      ? "Ex: Arroz tipo 1"
                      : config.key === "autopecas"
                      ? "Ex: Filtro de óleo"
                      : "Ex: Camiseta básica"
                  }
                  onChange={(value) =>
                    setFormData({ ...formData, name: value })
                  }
                />

                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Categoria
                  </label>

                  <select
                    required
                    value={formData.category}
                    onChange={(event) =>
                      setFormData({ ...formData, category: event.target.value })
                    }
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  >
                    <option value="">Selecione</option>

                    {config.categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                {config.extraFields.map((field) => (
                  <Input
                    key={field.key}
                    label={field.label}
                    value={formData.extra[field.key] || ""}
                    placeholder={field.placeholder}
                    onChange={(value) =>
                      setFormData({
                        ...formData,
                        extra: {
                          ...formData.extra,
                          [field.key]: value,
                        },
                      })
                    }
                  />
                ))}

                <Input
                  label="Fornecedor"
                  value={formData.supplier}
                  placeholder="Ex: Distribuidora Central"
                  onChange={(value) =>
                    setFormData({ ...formData, supplier: value })
                  }
                />

                <div className="grid gap-5 md:grid-cols-2">
                  <Input
                    label="Preço de custo"
                    type="number"
                    value={formData.costPrice}
                    placeholder="Ex: 20"
                    onChange={(value) =>
                      setFormData({ ...formData, costPrice: value })
                    }
                  />

                  <Input
                    label="Preço de venda"
                    type="number"
                    value={formData.salePrice}
                    placeholder="Ex: 35"
                    onChange={(value) =>
                      setFormData({ ...formData, salePrice: value })
                    }
                  />

                  <Input
                    label="Quantidade"
                    type="number"
                    value={formData.quantity}
                    placeholder="Ex: 50"
                    onChange={(value) =>
                      setFormData({ ...formData, quantity: value })
                    }
                  />

                  <Input
                    label="Estoque mínimo"
                    type="number"
                    value={formData.minQuantity}
                    placeholder="Ex: 10"
                    onChange={(value) =>
                      setFormData({ ...formData, minQuantity: value })
                    }
                  />
                </div>
              </div>

              <button
                type="submit"
                className="mt-8 w-full rounded-2xl bg-blue-600 px-6 py-4 font-black text-white shadow-xl shadow-blue-600/20 transition hover:bg-blue-700"
              >
                Cadastrar no estoque
              </button>
            </form>

            <div className="rounded-3xl bg-white p-6 shadow-xl">
              <div className="flex flex-col justify-between gap-5 border-b border-slate-100 pb-6 md:flex-row md:items-center">
                <div>
                  <h2 className="text-2xl font-black text-slate-950">
                    Produtos cadastrados
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Consulte, filtre e movimente o estoque.
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Buscar por nome..."
                  className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />

                <select
                  value={categoryFilter}
                  onChange={(event) => setCategoryFilter(event.target.value)}
                  className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                >
                  <option value="todas">Todas as categorias</option>

                  {config.categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {filteredProducts.length === 0 ? (
                <div className="py-16 text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-100 text-3xl">
                    📦
                  </div>

                  <h3 className="mt-5 text-xl font-black text-slate-950">
                    Nenhum produto encontrado
                  </h3>

                  <p className="mt-2 text-slate-500">
                    Cadastre um item para começar o controle de estoque.
                  </p>
                </div>
              ) : (
                <div className="mt-6 grid gap-5">
                  {filteredProducts.map((product) => {
                    const isLowStock = product.quantity <= product.minQuantity;

                    return (
                      <div
                        key={product.id}
                        className="rounded-3xl border border-slate-100 bg-slate-50 p-5"
                      >
                        <div className="flex flex-col justify-between gap-5 xl:flex-row xl:items-start">
                          <div>
                            <div className="flex flex-wrap items-center gap-3">
                              <h3 className="text-xl font-black text-slate-950">
                                {product.name}
                              </h3>

                              {isLowStock && (
                                <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-black text-red-700">
                                  Estoque baixo
                                </span>
                              )}
                            </div>

                            <p className="mt-2 text-sm font-bold text-slate-500">
                              {product.category} • Fornecedor:{" "}
                              {product.supplier || "Não informado"}
                            </p>

                            <div className="mt-5 grid gap-4 md:grid-cols-3">
                              {config.extraFields.map((field) => (
                                <Info
                                  key={field.key}
                                  label={field.label}
                                  value={
                                    product.extra[field.key] || "Não informado"
                                  }
                                />
                              ))}

                              <Info
                                label="Quantidade"
                                value={`${product.quantity} un.`}
                              />

                              <Info
                                label="Estoque mínimo"
                                value={`${product.minQuantity} un.`}
                              />

                              <Info
                                label="Custo"
                                value={formatMoney(product.costPrice)}
                              />

                              <Info
                                label="Venda"
                                value={formatMoney(product.salePrice)}
                              />

                              <Info
                                label="Lucro unitário"
                                value={formatMoney(
                                  product.salePrice - product.costPrice
                                )}
                              />
                            </div>
                          </div>

                          <div className="flex min-w-[230px] flex-wrap gap-2 xl:justify-end">
                            <button
                              onClick={() =>
                                handleMovement(product.id, "entrada")
                              }
                              className="rounded-full bg-green-100 px-4 py-2 text-xs font-black text-green-700 transition hover:bg-green-200"
                            >
                              Entrada
                            </button>

                            <button
                              onClick={() =>
                                handleMovement(product.id, "saida")
                              }
                              className="rounded-full bg-orange-100 px-4 py-2 text-xs font-black text-orange-700 transition hover:bg-orange-200"
                            >
                              Saída
                            </button>

                            <button
                              onClick={() => handleDelete(product.id)}
                              className="rounded-full bg-red-100 px-4 py-2 text-xs font-black text-red-700 transition hover:bg-red-200"
                            >
                              Excluir
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function Header({ config }: { config: NicheConfig }) {
  return (
    <header className="fixed left-0 top-0 z-50 w-full border-b border-white/30 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-2xl font-black tracking-tight text-slate-950">
          {config.name}
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link
            href="/mercadinho"
            className="text-sm font-semibold text-slate-600 hover:text-blue-600"
          >
            Mercadinho
          </Link>

          <Link
            href="/autopecas"
            className="text-sm font-semibold text-slate-600 hover:text-blue-600"
          >
            Autopeças
          </Link>

          <Link
            href="/moda"
            className="text-sm font-semibold text-slate-600 hover:text-blue-600"
          >
            Moda
          </Link>
        </nav>
      </div>
    </header>
  );
}

function StatCard({
  title,
  value,
}: {
  title: string;
  value: string | number;
}) {
  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
      <p className="text-sm font-bold text-slate-500">{title}</p>
      <p className="mt-3 text-2xl font-black text-slate-950">{value}</p>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-slate-700">
        {label}
      </label>

      <input
        type={type}
        required
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-2xl border text-black border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
      />
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white p-4">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <p className="mt-1 font-black text-slate-800">{value}</p>
    </div>
  );
}

function formatMoney(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}