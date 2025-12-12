/* script.js */
/* Código Vanilla JS para: - Renderização de produtos, - Filtros dinâmicos, - Modal de produto, - Calculadora de tinta, - Visualizador de cores, - Comportamentos do header. */

/* ===== Mock de dados dos produtos =====
Cada produto tem: id, name, type, finish, usage (array), brand, images (array), description, coverage (m²/L), sizes (array) */
const PRODUCTS = [
  {
    id: 'p1',
    name: 'Acrílica Standard - Branco Neve',
    type: 'Acrílica',
    finish: 'Fosco',
    usage: ['Interno'],
    brand: 'ColorPlus',
    images: [], // sem imagens reais, usaremos placeholder
    description: 'Ótima cobertura para ambiente interno com secagem rápida.',
    coverage: 12,
    sizes: ['0.9L', '3.6L', '18L'],
    accessories: ['Rolo espuma 23cm', 'Fita crepe 48mm']
  },
  {
    id: 'p2',
    name: 'Látex Resist - Branco Puro',
    type: 'Látex',
    finish: 'Acetinado',
    usage: ['Interno', 'Externo'],
    brand: 'ProTintas',
    images: [],
    description: 'Alta durabilidade, ideal para fachadas e áreas úmidas.',
    coverage: 10,
    sizes: ['3.6L', '18L'],
    accessories: ['Rolo anti-gota', 'Diluidor']
  },
  {
    id: 'p3',
    name: 'Epóxi Pro - Piso Industrial',
    type: 'Epóxi',
    finish: 'Brilhante',
    usage: ['Piso'],
    brand: 'MasterCoat',
    images: [],
    description: 'Resistência química e mecânica para pisos industriais e garagens.',
    coverage: 8,
    sizes: ['1L', '5L'],
    accessories: ['Lixa 120', 'Primário Epóxi']
  },
  {
    id: 'p4',
    name: 'Esmalte Premium - Metal Guard',
    type: 'Esmalte',
    finish: 'Semibrilho',
    usage: ['Metal'],
    brand: 'ColorPlus',
    images: [],
    description: 'Proteção anticorrosiva para estruturas metálicas.',
    coverage: 11,
    sizes: ['0.9L', '3.6L'],
    accessories: ['Pincel cerdas duras', 'Removedor']
  },
  // adicione mais produtos conforme necessário
];

/* ===== Helpers ===== */
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));

/* ===== Header scroll animation ===== */
const header = $('#siteHeader');
window.addEventListener('scroll', () => {
  if (window.scrollY > 20) header.classList.add('scrolled');
  else header.classList.remove('scrolled');
});

/* ===== Renderização de produtos ===== */
const productGrid = $('#productGrid');
const searchInput = $('#searchInput');

/* Cria HTML do cartão do produto */
function createProductCard(p) {
  const container = document.createElement('article');
  container.className = 'product-card';
  container.setAttribute('role', 'listitem');
  container.innerHTML = `
    <div style="height:140px; background:linear-gradient(90deg, #f4f4f4, #e9e9e9); display:flex; align-items:center; justify-content:center; border-radius:8px; color:#777;">
      <div style="text-align:center;">
        <div style="font-size:14px">${p.name}</div>
        <small style="display:block; margin-top:6px; color:var(--muted)">${p.brand} • ${p.type} • ${p.finish}</small>
      </div>
    </div>
    <div>
      <div class="product-meta">
        <div>
          <div class="product-name">${p.name}</div>
          <div class="product-tags">${p.sizes.join(' • ')}</div>
        </div>
        <div>
          <button class="btn-primary view-product" data-id="${p.id}">Ver</button>
        </div>
      </div>
      <p class="product-desc" style="color:var(--muted); font-size:0.95rem; margin-top:0.6rem">${p.description}</p>
    </div>
  `;
  return container;
}

/* Renderiza lista (usado após filtragem) */
function renderProducts(list) {
  productGrid.innerHTML = '';
  if (list.length === 0) {
    productGrid.innerHTML = `<div style="grid-column:1/-1; padding:1rem; color:var(--muted)">Nenhum produto encontrado com esses filtros.</div>`;
    return;
  }
  list.forEach(p => productGrid.appendChild(createProductCard(p)));
  // adiciona listeners para abrir modal
  $$('.view-product').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.currentTarget.dataset.id;
      openProductModal(id);
    });
  });
}

/* ===== Filtros interativos (lógica) =====
Ao mudar qualquer checkbox ou a busca, filtramos PRODUCTS e chamamos renderProducts.
Filtragem: se ao menos um filtro de um grupo estiver selecionado, usamos OR dentro do grupo.
Entre grupos usamos AND (produto deve satisfazer todos os grupos ativos).
*/
function getActiveFilters() {
  const filters = {
    type: [],
    finish: [],
    usage: [],
    brand: []
  };
  $$('input[name="type"]:checked').forEach(i => filters.type.push(i.value));
  $$('input[name="finish"]:checked').forEach(i => filters.finish.push(i.value));
  $$('input[name="usage"]:checked').forEach(i => filters.usage.push(i.value));
  $$('input[name="brand"]:checked').forEach(i => filters.brand.push(i.value));
  return filters;
}

function filterProducts() {
  const q = searchInput.value.trim().toLowerCase();
  const active = getActiveFilters();

  const filtered = PRODUCTS.filter(p => {
    // Search text: name, brand, type
    if (q) {
      const hay = `${p.name} ${p.brand} ${p.type} ${p.finish}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }

    // Tipo
    if (active.type.length) {
      if (!active.type.includes(p.type)) return false;
    }
    // Acabamento
    if (active.finish.length) {
      if (!active.finish.includes(p.finish)) return false;
    }
    // Uso (produto pode ter vários usos; precisa incluir pelo menos um)
    if (active.usage.length) {
      const intersect = p.usage.some(u => active.usage.includes(u));
      if (!intersect) return false;
    }
    // Marca
    if (active.brand.length) {
      if (!active.brand.includes(p.brand)) return false;
    }

    return true;
  });

  renderProducts(filtered);
}

/* Bind dos filtros e botões */
$$('input[type="checkbox"]').forEach(cb => cb.addEventListener('change', filterProducts));
searchInput.addEventListener('input', () => {
  // debounce simples
  clearTimeout(searchInput._t);
  searchInput._t = setTimeout(filterProducts, 180);
});
$('#resetFilters').addEventListener('click', () => {
  $$('input[type="checkbox"]').forEach(cb => cb.checked = false);
  searchInput.value = '';
  filterProducts();
});

/* Inicializa com todos produtos */
renderProducts(PRODUCTS);

/* ===== Modal de página de produto (simulada) ===== */
const modal = $('#productModal');
const modalBody = $('#modalBody');
const closeModalBtn = $('#closeModal');

function openProductModal(id) {
  const p = PRODUCTS.find(x => x.id === id);
  if (!p) return;
  modalBody.innerHTML = `
    <h2>${p.name}</h2>
    <div style="display:flex; gap:1rem; flex-wrap:wrap; margin-bottom:0.5rem">
      <div style="flex:1; min-width:200px; background:#f4f4f4; border-radius:8px; padding:0.75rem;">
        <div style="height:200px; display:flex; align-items:center; justify-content:center; color:#777">Imagem do galão</div>
      </div>
      <div style="flex:1; min-width:220px;">
        <p style="color:var(--muted)">${p.description}</p>
        <ul>
          <li><strong>Rendimento:</strong> ${p.coverage} m² / L (estimado)</li>
          <li><strong>Acabamento:</strong> ${p.finish}</li>
          <li><strong>Uso:</strong> ${p.usage.join(', ')}</li>
          <li><strong>Marcas/Modelos:</strong> ${p.brand}</li>
        </ul>
        <label for="sizeSelect">Selecione a embalagem</label>
        <select id="sizeSelect">${p.sizes.map(s => `<option>${s}</option>`).join('')}</select>
        <div style="margin-top:0.75rem;">
          <strong>Acessórios Recomendados:</strong>
          <ul>${p.accessories.map(a => `<li>${a}</li>`).join('')}</ul>
        </div>
      </div>
    </div>
    <div style="display:flex; gap:0.5rem; justify-content:flex-end;">
      <button class="btn-ghost" id="closeModal2">Fechar</button>
      <button class="btn-primary">Adicionar ao Carrinho</button>
    </div>
  `;
  modal.setAttribute('aria-hidden','false');
  // Traps & listeners
  $('#closeModal2').addEventListener('click', closeModal);
  closeModalBtn.setAttribute('aria-hidden','false');
}

function closeModal() {
  modal.setAttribute('aria-hidden','true');
  modalBody.innerHTML = '';
}
closeModalBtn.addEventListener('click', closeModal);
modal.addEventListener('click', (e) => {
  if (e.target === modal) closeModal();
});

/* ===== Calculadora de Tinta (lógica crítica) =====
Inputs: largura (m), altura (m), número de demãos.
Lógica:
  area = largura * altura
  total_area = area * demãos
  coverage = rendimento (m² por L) — user-specified, padrão 10
  liters_needed = total_area / coverage
  Mostramos:
    - Área (m²)
    - Litros necessários (2 casas)
    - Recomendação de latas (arredondamento para cima)
Observação: Sempre arredondamos para cima a quantidade de litros quando necessário para garantir cobertura suficiente.
*/
const calcBtn = $('#calcBtn');
const clearCalc = $('#clearCalc');
const calcResult = $('#calcResult');

calcBtn.addEventListener('click', () => {
  // obter valores
  const w = parseFloat($('#width').value) || 0;
  const h = parseFloat($('#height').value) || 0;
  const coats = parseInt($('#coats').value, 10) || 1;
  const coverage = parseFloat($('#coverage').value) || 10;

  // validação mínima
  if (w <= 0 || h <= 0) {
    calcResult.innerHTML = `<strong style="color:#c0392b">Informe largura e altura válidas (maiores que 0).</strong>`;
    return;
  }

  // cálculo passo a passo (digit-by-digit approach as per instruction rationale):
  // area = w * h
  const area = w * h; // m²
  // total area considerando demãos
  const totalArea = area * coats; // m²
  // litros necessários (sem arredondamento ainda)
  const liters = totalArea / coverage; // L
  // recomendação prática: arredondar para cima (ex: latas inteiras). Mostramos também valor com 2 casas.
  const litersRoundedUp = Math.ceil(liters * 100) / 100; // arredondamento para cima 2 casas (segurança)
  const litersCeil = Math.ceil(liters); // latas inteiras recomendadas

  // Output
  calcResult.innerHTML = `
    <div><strong>Área da parede:</strong> ${area.toFixed(2)} m²</div>
    <div><strong>Área total (com ${coats} demão/ões):</strong> ${totalArea.toFixed(2)} m²</div>
    <div><strong>Rendimento usado:</strong> ${coverage} m² por litro</div>
    <div style="margin-top:0.4rem"><strong>Litros necessários:</strong> ${liters.toFixed(2)} L</div>
    <div><strong>Recomendação prática (segurança):</strong> ${litersRoundedUp.toFixed(2)} L (arredondado para cima)</div>
    <div><strong>Latas inteiras (aprox.):</strong> ${litersCeil} L</div>
  `;
});

clearCalc.addEventListener('click', () => {
  $('#width').value = '';
  $('#height').value = '';
  $('#coats').value = '2';
  $('#coverage').value = '10';
  calcResult.innerHTML = '';
});

/* ===== Visualizador de cores (simulação) =====
Ao escolher cor, aplicamos overlay com opacity sobre a imagem.
*/
const swatches = $$('.swatch');
const colorPicker = $('#colorPicker');
const applyColorBtn = $('#applyColor');
const resetColorBtn = $('#resetColor');
const colorOverlay = $('#colorOverlay');

swatches.forEach(s => {
  s.addEventListener('click', (e) => {
    const c = e.currentTarget.dataset.color;
    colorPicker.value = c;
    // aplica instantâneo
    colorOverlay.style.backgroundColor = c;
  });
});

applyColorBtn.addEventListener('click', () => {
  colorOverlay.style.backgroundColor = colorPicker.value;
});
resetColorBtn.addEventListener('click', () => {
  colorOverlay.style.backgroundColor = 'transparent';
});

/* ===== Pequenas melhorias de usabilidade ===== */
// preencher ano no rodapé
document.getElementById('year').textContent = new Date().getFullYear();

// Nav toggle (mobile)
const navToggle = $('.nav-toggle');
navToggle.addEventListener('click', () => {
  const menu = $('#navMenu');
  const expanded = navToggle.getAttribute('aria-expanded') === 'true';
  navToggle.setAttribute('aria-expanded', String(!expanded));
  menu.style.display = expanded ? 'none' : 'flex';
});

// Formulário de contato (simulado)
const contactForm = $('#contactForm');
contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  // validação mínima
  const nome = $('#nome').value.trim();
  const email = $('#email').value.trim();
  const mensagem = $('#mensagem').value.trim();
  if (!nome || !email || !mensagem) {
    alert('Preencha Nome, E-mail e Mensagem.');
    return;
  }
  // simulando envio
  alert('Mensagem enviada! Em breve nosso time entrará em contato.');
  contactForm.reset();
});

/* ===== Inicialização final ===== */
filterProducts(); // aplica estado inicial
