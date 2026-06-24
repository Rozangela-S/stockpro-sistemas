export type NicheKey = "mercadinho" | "autopecas" | "moda";

export type ExtraField = {
  key: string;
  label: string;
  placeholder: string;
};

export type NicheConfig = {
  key: NicheKey;
  name: string;
  title: string;
  description: string;
  accent: string;
  storageKey: string;
  productLabel: string;
  categories: string[];
  extraFields: ExtraField[];
};

export const niches: Record<NicheKey, NicheConfig> = {
  mercadinho: {
    key: "mercadinho",
    name: "MercadoStock",
    title: "Controle de Estoque para Mercadinho",
    description:
      "Gerencie produtos, validade, fornecedores, entradas, saídas e estoque baixo de uma mercearia ou mercadinho.",
    accent: "emerald",
    storageKey: "mercadostock-products",
    productLabel: "Produto",
    categories: [
      "Alimentos",
      "Bebidas",
      "Limpeza",
      "Higiene",
      "Hortifruti",
      "Padaria",
      "Congelados",
    ],
    extraFields: [
      {
        key: "brand",
        label: "Marca",
        placeholder: "Ex: Nestlé, Ypê, Coca-Cola",
      },
      {
        key: "expirationDate",
        label: "Validade",
        placeholder: "Ex: 2026-12-31",
      },
    ],
  },

  autopecas: {
    key: "autopecas",
    name: "AutoParts Stock",
    title: "Controle de Estoque para Peças Automotivas",
    description:
      "Controle peças, códigos, marcas, modelos compatíveis, fornecedores e movimentações de estoque.",
    accent: "blue",
    storageKey: "autoparts-products",
    productLabel: "Peça",
    categories: [
      "Motor",
      "Freios",
      "Suspensão",
      "Elétrica",
      "Filtros",
      "Óleos",
      "Pneus",
      "Acessórios",
    ],
    extraFields: [
      {
        key: "partCode",
        label: "Código da peça",
        placeholder: "Ex: FIL-0987",
      },
      {
        key: "compatibleModel",
        label: "Modelo compatível",
        placeholder: "Ex: Gol, Onix, Corolla",
      },
    ],
  },

  moda: {
    key: "moda",
    name: "ModaStock",
    title: "Controle de Estoque para Loja de Roupas",
    description:
      "Gerencie roupas por tamanho, cor, categoria, preço, fornecedores, quantidade e estoque mínimo.",
    accent: "pink",
    storageKey: "modastock-products",
    productLabel: "Peça",
    categories: [
      "Camisetas",
      "Calças",
      "Vestidos",
      "Jaquetas",
      "Shorts",
      "Calçados",
      "Acessórios",
      "Moda íntima",
    ],
    extraFields: [
      {
        key: "size",
        label: "Tamanho",
        placeholder: "Ex: P, M, G, 38, 40",
      },
      {
        key: "color",
        label: "Cor",
        placeholder: "Ex: Preto, Azul, Branco",
      },
    ],
  },
};