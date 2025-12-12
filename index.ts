import React, { useState, useMemo } from "react";

// Single-file React + Tailwind example app for a paint shop website
// Requirements: Tailwind CSS set up in the project (create-react-app + tailwindcss)
// Save as App.jsx and run inside a Tailwind-enabled React project.

const BRANDS = ["Coral", "Suvinil", "Sherwin-Williams", "Lukscolor"];
const FINISHES = ["Fosco", "Semibrilho", "Brilhante", "Acetinado"];

const SAMPLE_PRODUCTS = Array.from({ length: 8 }).map((_, i) => ({
  id: i + 1,
  name: [`Tinta Acrílica ${i + 1}`, `Esmalte Sintético ${i + 1}`][i % 2],
  brand: BRANDS[i % BRANDS.length],
  finish: FINISHES[i % FINISHES.length],
  size: ["1L", "3.6L", "18L"][i % 3],
  color: ["#F6D6AD", "#A3D2CA", "#FFD6E0", "#D6E4FF"][i % 4],
  price: (59 + i * 12).toFixed(2),
  image: `https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=60&h=600&crop=entropy&sat=-50&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-4.0.3`,
  description:
    "Tinta de alta qualidade, ótimo rendimento e secagem rápida. Ideal para ambientes internos e externos dependendo da versão.",
}));

export default function App() {
  const [query, setQuery] = useState("");
  const [brandFilter, setBrandFilter] = useState("");
  const [finishFilter, setFinishFilter] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showCalculator, setShowCalculator] = useState(false);
  const [area, setArea] = useState(20);
  const [coverage, setCoverage] = useState(12); // m2 per liter
  const [selectedColor, setSelectedColor] = useState("#F6D6AD");

  const filtered = useMemo(() => {
    return SAMPLE_PRODUCTS.filter((p) => {
      if (brandFilter && p.brand !== brandFilter) return false;
      if (finishFilter && p.finish !== finishFilter) return false;
      if (query && !p.name.toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    });
  }, [brandFilter, finishFilter, query]);

  const litersNeeded = useMemo(() => {
    const liters = Math.max(0, area / coverage);
    // round up to nearest whole liter or to packaging sizes
    return Math.ceil(liters * 10) / 10; // 1 decimal
  }, [area, coverage]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-md bg-gradient-to-br from-indigo-500 to-pink-400 flex items-center justify-center text-white font-bold">T</div>
            <div>
              <h1 className="font-extrabold">Tintas & Cores</h1>
              <div className="text-xs text-gray-500">Mais de 20 anos colorindo sua vida</div>
            </div>
          </div>

          <nav className="hidden md:flex gap-6 items-center text-sm">
            <a className="hover:text-indigo-600" href="#home">Home</a>
            <a className="hover:text-indigo-600" href="#produtos">Produtos</a>
            <a className="hover:text-indigo-600" href="#paleta">Paleta</a>
            <a className="hover:text-indigo-600" href="#blog">Dicas</a>
            <a className="hover:text-indigo-600" href="#contato">Contato</a>
          </nav>

          <div className="flex items-center gap-3">
            <button className="bg-indigo-600 text-white px-4 py-2 rounded-md shadow hover:bg-indigo-700">Fale Conosco</button>
            <button className="border px-3 py-2 rounded-md text-sm">Minha Conta</button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="max-w-6xl mx-auto px-6 py-10" id="home">
        <section className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-4xl font-extrabold leading-tight">Dê Vida e Cor aos Seus Projetos.</h2>
            <p className="mt-4 text-gray-600">Tintas de qualidade, consultoria de cores e serviços para profissionais e DIY. Encontre o produto certo e calcule a quantidade ideal.</p>

            <div className="mt-6 flex gap-3">
              <a href="#produtos" className="bg-pink-500 text-white px-5 py-3 rounded-lg shadow hover:opacity-95">Explore Nossas Cores</a>
              <button onClick={() => setShowCalculator(true)} className="border px-5 py-3 rounded-lg">Calcule Sua Tinta</button>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-3">
              <Feature icon="🚚" title="Entrega Rápida" desc="Em até 48h na cidade" />
              <Feature icon="🎨" title="Consultoria de Cores" desc="Profissionais disponíveis" />
              <Feature icon="🔧" title="Máquina de Cores" desc="Precisão e variedade" />
            </div>
          </div>

          <div className="relative">
            <div className="rounded-xl overflow-hidden shadow-lg">
              <img alt="hero" src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=60" className="w-full h-80 object-cover" />
              <div className="p-4 bg-gradient-to-t from-black/40 to-transparent text-white">
                <strong>Promoção da Semana:</strong> Tinta Acrílica 18L com 15% off
              </div>
            </div>

            <div className="absolute -bottom-6 left-6 bg-white p-4 rounded-xl shadow w-72">
              <div className="text-xs text-gray-500">Categorias Populares</div>
              <div className="flex gap-2 mt-3 flex-wrap">
                <Tag name="Acrílica" />
                <Tag name="Esmalte" />
                <Tag name="Textura" />
                <Tag name="Complementos" />
              </div>
            </div>
          </div>
        </section>

        {/* Products / Catalog */}
        <section id="produtos" className="mt-20">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold">Produtos</h3>
            <div className="flex items-center gap-3">
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar produto ou cor" className="border px-3 py-2 rounded-md" />
              <select value={brandFilter} onChange={(e) => setBrandFilter(e.target.value)} className="border px-3 py-2 rounded-md">
                <option value="">Todas as marcas</option>
                {BRANDS.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
              <select value={finishFilter} onChange={(e) => setFinishFilter(e.target.value)} className="border px-3 py-2 rounded-md">
                <option value="">Todos os acabamentos</option>
                {FINISHES.map((f) => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filtered.map((p) => (
              <article key={p.id} className="bg-white rounded-lg shadow hover:shadow-lg overflow-hidden">
                <div className="h-40 bg-gray-100 flex items-center justify-center overflow-hidden">
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">{p.name}</h4>
                    <div className="text-sm text-gray-500">{p.size}</div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">{p.brand} • {p.finish}</p>

                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md border" style={{ backgroundColor: p.color }} />
                      <span className="text-sm">R$ {p.price}</span>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => { setSelectedProduct(p); setSelectedColor(p.color); }} className="px-3 py-1 text-sm border rounded">Detalhes</button>
                      <button onClick={() => alert('Adicionar ao carrinho - mock')} className="px-3 py-1 text-sm bg-indigo-600 text-white rounded">Comprar</button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Paleta / Visualizador de Cores */}
        <section id="paleta" className="mt-20 grid md:grid-cols-2 gap-8 items-start">
          <div>
            <h3 className="text-2xl font-bold">Paleta de Cores</h3>
            <p className="text-gray-600 mt-2">Visualize cores em diferentes ambientes e escolha combinações prontas.</p>

            <div className="mt-4 grid grid-cols-4 gap-3">
              {['#F6D6AD','#A3D2CA','#FFD6E0','#D6E4FF','#FFE2A3','#C2E7FF'].map((c) => (
                <button key={c} onClick={() => setSelectedColor(c)} style={{ background: c }} className="h-14 rounded shadow border" aria-label={`Selecionar cor ${c}`} />
              ))}
            </div>

            <div className="mt-6">
              <h4 className="font-semibold">Combinações sugeridas</h4>
              <div className="mt-3 grid grid-cols-3 gap-2">
                <ComboCard title="Neutro Aconchegante" colors={["#F6D6AD","#D6E4FF"]} />
                <ComboCard title="Fresco e Claro" colors={["#A3D2CA","#FFE2A3"]} />
                <ComboCard title="Delicado" colors={["#FFD6E0","#C2E7FF"]} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <h4 className="font-semibold">Visualizador (preview)</h4>
            <div className="mt-3 rounded overflow-hidden border">
              {/* Simple visualizer: overlay color on a demo room image */}
              <div className="relative">
                <img src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=60" alt="sala" className="w-full h-64 object-cover" />
                <div style={{ background: selectedColor, mixBlendMode: 'multiply', opacity: 0.7 }} className="absolute inset-0" />
                <div className="absolute bottom-3 left-3 bg-white/80 p-2 rounded">
                  <span className="text-sm font-medium">Cor selecionada: </span>
                  <span className="font-semibold">{selectedColor}</span>
                </div>
              </div>

              <div className="p-3 border-t">
                <label className="text-sm">Modificar cobertura (m²/L)</label>
                <input type="range" min={6} max={20} value={coverage} onChange={(e) => setCoverage(Number(e.target.value))} className="w-full mt-2" />
                <div className="text-xs text-gray-500 mt-2">Cobertura atual: {coverage} m²/L</div>
              </div>
            </div>
          </div>
        </section>

        {/* Blog / Tutorials */}
        <section id="blog" className="mt-20">
          <h3 className="text-2xl font-bold">Dicas e Tutoriais</h3>
          <div className="mt-6 grid md:grid-cols-3 gap-6">
            <TutorialCard title="Como pintar uma parede nova" excerpt="Guia passo a passo para preparar a parede, escolher a tinta e aplicar com perfeição." />
            <TutorialCard title="Evitar bolhas na pintura" excerpt="Principais causas e soluções para um acabamento liso." />
            <TutorialCard title="Melhor tinta para área externa" excerpt="Como escolher uma tinta resistente e duradoura para fachadas." />
          </div>
        </section>

        {/* Contact */}
        <section id="contato" className="mt-20 bg-white rounded-lg shadow p-6">
          <h3 className="text-2xl font-bold">Contato e Localização</h3>
          <div className="mt-4 grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-gray-600">Tem dúvidas? Envie uma mensagem ou fale conosco pelo WhatsApp.</p>
              <form className="mt-4 grid gap-3">
                <input placeholder="Seu nome" className="border px-3 py-2 rounded" />
                <input placeholder="Telefone ou WhatsApp" className="border px-3 py-2 rounded" />
                <textarea placeholder="Mensagem" className="border px-3 py-2 rounded" rows={4} />
                <div className="flex gap-3">
                  <button type="button" className="bg-indigo-600 text-white px-4 py-2 rounded">Enviar</button>
                  <a href="https://api.whatsapp.com/send?phone=5511999999999" target="_blank" rel="noreferrer" className="px-4 py-2 border rounded">Abrir WhatsApp</a>
                </div>
              </form>
            </div>

            <div>
              <div className="text-sm text-gray-500">Nossa loja</div>
              <div className="mt-2 font-semibold">Rua das Cores, 123 — Centro</div>
              <div className="text-sm text-gray-500 mt-2">Horário: Seg — Sex: 08:00 — 18:00 | Sáb: 08:00 — 13:00</div>

              <div className="mt-4">
                <iframe title="mapa" className="w-full h-48 rounded" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3"></iframe>
              </div>
            </div>
          </div>
        </section>

        {/* About */}
        <section className="mt-12 bg-white rounded-lg shadow p-6">
          <h3 className="text-2xl font-bold">Sobre Nós</h3>
          <p className="text-gray-600 mt-2">Missão: Fornecer produtos de qualidade e ajudar clientes a transformar ideias em ambientes cheios de personalidade.
          Diferenciais: Mais de 20 anos no mercado, máquina de cores de alta precisão, equipe técnica especializada.</p>
        </section>

        <footer className="mt-10 text-center text-sm text-gray-500 mb-10">© {new Date().getFullYear()} Tintas & Cores — Todos os direitos reservados</footer>
      </main>

      {/* Product Modal */}
      {selectedProduct && (
        <Modal onClose={() => setSelectedProduct(null)}>
          <div className="grid md:grid-cols-2 gap-6">
            <img src={selectedProduct.image} className="w-full h-72 object-cover rounded" alt={selectedProduct.name} />
            <div>
              <h3 className="text-xl font-bold">{selectedProduct.name}</h3>
              <div className="text-sm text-gray-500 mt-1">{selectedProduct.brand} • {selectedProduct.finish}</div>
              <p className="mt-4 text-gray-700">{selectedProduct.description}</p>
              <div className="mt-4 flex items-center gap-3">
                <div className="w-8 h-8 rounded border" style={{ backgroundColor: selectedProduct.color }} />
                <div className="text-lg font-semibold">R$ {selectedProduct.price}</div>
              </div>

              <div className="mt-6 flex gap-3">
                <button onClick={() => alert('Comprar - mock')} className="bg-indigo-600 text-white px-4 py-2 rounded">Comprar</button>
                <button onClick={() => { setShowCalculator(true); setSelectedProduct(null); }} className="px-4 py-2 border rounded">Calcular Tinta</button>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Calculator Modal */}
      {showCalculator && (
        <Modal onClose={() => setShowCalculator(false)}>
          <div>
            <h3 className="text-xl font-bold">Calculadora de Tinta</h3>
            <div className="mt-4 grid gap-3">
              <label className="text-sm">Área a pintar (m²)</label>
              <input type="number" value={area} onChange={(e) => setArea(Number(e.target.value))} className="border px-3 py-2 rounded" />

              <label className="text-sm">Rendimento (m² por litro)</label>
              <input type="number" value={coverage} onChange={(e) => setCoverage(Number(e.target.value))} className="border px-3 py-2 rounded" />

              <div className="mt-4 p-3 bg-gray-50 rounded">
                <div>Você precisa de aproximadamente <strong>{litersNeeded} L</strong> de tinta.</div>
                <div className="text-xs text-gray-500 mt-1">Considere perdas e número de demãos para ajustar.</div>
              </div>

              <div className="mt-4 flex gap-3">
                <button onClick={() => { setShowCalculator(false); alert('Adicionar lista de compras - mock'); }} className="bg-indigo-600 text-white px-4 py-2 rounded">Adicionar à Lista</button>
                <button onClick={() => setShowCalculator(false)} className="px-4 py-2 border rounded">Fechar</button>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Floating WhatsApp */}
      <a href="https://api.whatsapp.com/send?phone=5511999999999" target="_blank" rel="noreferrer" className="fixed bottom-6 right-6 bg-green-500 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg">💬</a>
    </div>
  );
}

function Feature({ icon, title, desc }) {
  return (
    <div className="flex items-start gap-3">
      <div className="text-2xl">{icon}</div>
      <div>
        <div className="font-semibold">{title}</div>
        <div className="text-sm text-gray-500">{desc}</div>
      </div>
    </div>
  );
}

function Tag({ name }) {
  return <div className="px-3 py-1 bg-gray-50 rounded text-sm border">{name}</div>;
}

function ComboCard({ title, colors }) {
  return (
    <div className="p-3 border rounded flex items-center gap-3">
      <div className="flex-1">
        <div className="font-medium">{title}</div>
        <div className="text-xs text-gray-500">Sugestão pronta para combinar</div>
      </div>
      <div className="flex gap-1">
        {colors.map((c) => <div key={c} style={{ background: c }} className="w-8 h-8 rounded border" />)}
      </div>
    </div>
  );
}

function TutorialCard({ title, excerpt }) {
  return (
    <article className="bg-white rounded shadow p-4">
      <div className="h-28 bg-gray-100 rounded mb-3 flex items-center justify-center">📘</div>
      <h4 className="font-semibold">{title}</h4>
      <p className="text-sm text-gray-500 mt-2">{excerpt}</p>
      <div className="mt-3">
        <a className="text-indigo-600 text-sm">Ler mais →</a>
      </div>
    </article>
  );
}

function Modal({ children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative max-w-4xl w-full bg-white rounded-lg p-6 shadow-lg">
        <button onClick={onClose} className="absolute right-4 top-4 text-gray-500">✕</button>
        {children}
      </div>
    </div>
  );
}
