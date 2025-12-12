/**
 * =======================================================
 * JAVASCRIPT PURO (VANILLA JS - ES6+) PARA LOJA DE TINTAS
 * =======================================================
 */

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Funcionalidade do Cabeçalho (Header Sticky) ---
    const header = document.getElementById('main-header');
    
    // Adiciona classe ao header quando o usuário rola para animar
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });


    // --- 2. Filtros de Busca Avançados (Lógica Crítica) ---
    
    const filterCheckboxes = document.querySelectorAll('.sidebar-filters input[type="checkbox"]');
    const productCards = document.querySelectorAll('.product-card');

    const applyFilters = () => {
        // 1. Coletar os filtros ativos por categoria
        const activeFilters = {
            tipo: [],
            acabamento: [],
            uso: [],
            marca: []
        };

        filterCheckboxes.forEach(checkbox => {
            if (checkbox.checked) {
                const category = checkbox.getAttribute('data-filter');
                const value = checkbox.value;
                activeFilters[category].push(value);
            }
        });

        // 2. Iterar sobre os produtos para aplicar a lógica de ocultar/exibir
        productCards.forEach(card => {
            let matchesAllCategories = true;

            // Para cada categoria de filtro (tipo, acabamento, uso, marca)
            for (const category in activeFilters) {
                const requiredValues = activeFilters[category];
                
                // Se houver filtros ativos nesta categoria E o card não tiver um dos valores necessários
                if (requiredValues.length > 0) {
                    const cardValue = card.getAttribute(`data-${category}`);
                    
                    // Se o valor do card não está na lista de filtros ativos para esta categoria, ele não corresponde.
                    if (!requiredValues.includes(cardValue)) {
                        matchesAllCategories = false;
                        break; // Para o loop interno, pois o produto já falhou em uma categoria.
                    }
                }
            }

            // 3. Ocultar ou Exibir o card
            if (matchesAllCategories) {
                card.classList.remove('hidden');
            } else {
                card.classList.add('hidden');
            }
        });

        // Opcional: Adicionar lógica para 'Nenhum Produto Encontrado'
        const visibleProducts = document.querySelectorAll('.product-card:not(.hidden)').length;
        console.log(`Produtos visíveis: ${visibleProducts}`);
    };

    // Adicionar listener a todos os checkboxes
    filterCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', applyFilters);
    });

    // Chama a função uma vez para garantir que o estado inicial esteja correto (se houver filtros pré-selecionados)
    applyFilters();


    // --- 3. Calculadora de Tinta (Lógica Crítica) ---
    const widthInput = document.getElementById('wall-width');
    const heightInput = document.getElementById('wall-height');
    const coatsSelect = document.getElementById('coats');
    const calculateBtn = document.getElementById('calculate-btn');
    const resultBox = document.getElementById('calculation-result');

    // Rendimento médio por litro (m²/L) - Varia na vida real, aqui usamos um valor base.
    const YIELD_PER_LITER = 10; // 10 metros quadrados por litro (m²/L)

    const calculatePaintNeeded = () => {
        // 1. Coletar e validar inputs
        const width = parseFloat(widthInput.value);
        const height = parseFloat(heightInput.value);
        const coats = parseInt(coatsSelect.value, 10);

        if (isNaN(width) || isNaN(height) || width <= 0 || height <= 0 || coats <= 0) {
            resultBox.innerHTML = `<p style="color:var(--color-error);">⚠️ Por favor, insira valores válidos para largura, altura e demãos.</p>`;
            return;
        }

        // 2. Lógica do Cálculo
        const totalArea = width * height; // Área em m²
        
        // 3. Cálculo do Volume Total (considerando número de demãos)
        const totalLiters = (totalArea * coats) / YIELD_PER_LITER;

        // Arredondamento para fins de exibição (2 casas decimais)
        const litersToBuy = Math.ceil(totalLiters * 2) / 2; // Arredonda para o próximo 0.5 Litro (ex: 1.1L vira 1.5L)

        // 4. Exibir o resultado
        resultBox.innerHTML = `
            A área total é de <strong>${totalArea.toFixed(2)} m²</strong>.
            <p>Com ${coats} demãos e rendimento de ${YIELD_PER_LITER} m²/L, você precisará de um total de **${totalLiters.toFixed(2)} L** de tinta.</p>
            <p style="font-weight: bold; color: var(--color-primary-dark);">Recomendamos comprar aproximadamente ${litersToBuy.toFixed(1)} L para garantir.</p>
        `;
    };

    // Adicionar listeners para o botão e para mudanças nos inputs
    calculateBtn.addEventListener('click', calculatePaintNeeded);
    widthInput.addEventListener('input', calculatePaintNeeded);
    heightInput.addEventListener('input', calculatePaintNeeded);
    coatsSelect.addEventListener('change', calculatePaintNeeded);

    // Inicializa o cálculo na abertura da página com os valores padrão
    calculatePaintNeeded(); 


    // --- 4. Visualizador de Cores (Inspiração UX) ---
    const colorPicker = document.getElementById('color-picker');
    const colorOverlay = document.getElementById('color-overlay');
    const colorChips = document.querySelectorAll('.color-chip');

    const updateColorOverlay = (color) => {
        colorOverlay.style.backgroundColor = color;
    };

    // 1. Atualizar ao mover o color picker
    colorPicker.addEventListener('input', (event) => {
        updateColorOverlay(event.target.value);
    });

    // 2. Atualizar ao clicar em um chip de cor
    colorChips.forEach(chip => {
        chip.addEventListener('click', (event) => {
            const selectedColor = event.target.getAttribute('data-color');
            updateColorOverlay(selectedColor);
            colorPicker.value = selectedColor; // Atualiza o picker para refletir o chip
        });
    });

});