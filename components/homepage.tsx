import Link from "next/link";

const systems = [
  {
    href: "/mercadinho",
    name: "MercadoStock",
    title: "Mercadinho e Mercearia",
    description:
      "Controle produtos, validade, categorias, fornecedores, entradas e saídas.",
    icon: "🛒",
  },
  {
    href: "/autopecas",
    name: "AutoParts Stock",
    title: "Loja de Peças Automotivas",
    description:
      "Gerencie peças, códigos, marcas, compatibilidade, estoque mínimo e movimentações.",
    icon: "🚗",
  },
  {
    href: "/moda",
    name: "ModaStock",
    title: "Loja de Roupas",
    description:
      "Controle roupas por tamanho, cor, categoria, quantidade, preço e fornecedor.",
    icon: "👕",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="max-w-3xl">
          <span className="rounded-full bg-white/10 px-4 py-2 text-sm font-bold text-blue-200">
            Portfólio de sistemas
          </span>

          <h1 className="mt-6 text-4xl font-black tracking-tight md:text-6xl">
            Sistemas de controle de estoque por nicho.
          </h1>

          <p className="mt-6 text-lg leading-8 text-slate-300">
            Três sistemas demonstrativos para negócios que vendem mercadorias:
            mercadinho, loja de peças automotivas e loja de roupas.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {systems.map((system) => (
            <Link
              key={system.href}
              href={system.href}
              className="group rounded-3xl border border-white/10 bg-white/10 p-8 backdrop-blur transition hover:-translate-y-2 hover:bg-white/15"
            >
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-3xl bg-white text-3xl">
                {system.icon}
              </div>

              <p className="text-sm font-bold text-blue-200">{system.name}</p>

              <h2 className="mt-3 text-2xl font-black">{system.title}</h2>

              <p className="mt-4 leading-7 text-slate-300">
                {system.description}
              </p>

              <span className="mt-8 inline-flex rounded-full bg-blue-600 px-5 py-3 text-sm font-bold text-white transition group-hover:bg-blue-500">
                Acessar sistema
              </span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}