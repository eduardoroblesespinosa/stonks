document.addEventListener('DOMContentLoaded', () => {
    const bmvContainer = document.getElementById('bmv-stocks-container');
    const internationalContainer = document.getElementById('international-stocks-container');
    const indicesContainer = document.getElementById('indices-container');
    const newsContainer = document.getElementById('news-container');
    const favoritesContainer = document.getElementById('favorites-container');
    const favoritesSection = document.getElementById('favorites');
    const searchInput = document.getElementById('search-input');
    const themeSwitcher = document.getElementById('theme-switcher');
    const realEstateContainer = document.getElementById('real-estate-container');
    const preciousMetalsContainer = document.getElementById('precious-metals-container');
    const energyContainer = document.getElementById('energy-container');
    const archetypesContainer = document.getElementById('archetypes-container');

    // ROI Calculator elements
    const calculateRoiBtn = document.getElementById('calculate-roi-btn');
    const purchasePriceInput = document.getElementById('purchase-price');
    const sellPriceInput = document.getElementById('sell-price');
    const numSharesInput = document.getElementById('num-shares');
    const roiResultContainer = document.getElementById('roi-result-container');
    const totalInvestmentEl = document.getElementById('total-investment');
    const totalReturnEl = document.getElementById('total-return');
    const profitLossEl = document.getElementById('profit-loss');
    const roiResultEl = document.getElementById('roi-result');
    const investmentBar = document.getElementById('investment-bar');
    const profitLossBar = document.getElementById('profit-loss-bar');

    let stockChart = null;
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    const allStocks = [...mexicanStocks, ...internationalStocks];

    const createStockCard = (stock) => {
        const changeClass = stock.change >= 0 ? 'text-profit' : 'text-loss';
        const changeIcon = stock.change >= 0 ? 'bi-arrow-up-right' : 'bi-arrow-down-left';
        const isFavorite = favorites.includes(stock.ticker);
        const favoriteIconClass = isFavorite ? 'bi-star-fill' : 'bi-star';

        return `
            <div class="col-lg-3 col-md-4 col-sm-6 stock-card-wrapper" data-ticker="${stock.ticker}">
                <div class="card stock-card h-100">
                    <div class="card-body d-flex flex-column">
                        <div class="d-flex justify-content-between align-items-start">
                            <div>
                                <h5 class="card-title mb-0">${stock.name}</h5>
                                <h6 class="card-subtitle mb-2 text-muted">${stock.ticker}</h6>
                            </div>
                            <i class="bi ${favoriteIconClass} favorite-btn fs-5" data-ticker="${stock.ticker}" style="cursor: pointer;"></i>
                        </div>
                        <div class="mt-auto">
                            <p class="stock-price mb-0">${stock.price.toFixed(2)}</p>
                            <p class="stock-change ${changeClass} mb-0">
                                <i class="bi ${changeIcon}"></i> ${stock.change.toFixed(2)} (${stock.changePercent.toFixed(2)}%)
                            </p>
                        </div>
                         <button class="btn btn-outline-primary btn-sm mt-3 view-details-btn" data-ticker="${stock.ticker}">View Details</button>
                    </div>
                </div>
            </div>
        `;
    };

    const createRealEstateCard = (property) => `
        <div class="col-lg-4 col-md-6">
            <div class="card real-estate-card h-100">
                <img src="${property.imageUrl}" class="card-img-top" alt="${property.name}">
                <div class="card-body">
                    <h5 class="card-title">${property.name}</h5>
                    <h6 class="card-subtitle mb-2 text-muted"><i class="bi bi-geo-alt-fill"></i> ${property.location}</h6>
                    <p class="card-text">${property.description}</p>
                </div>
                <ul class="list-group list-group-flush">
                    <li class="list-group-item"><strong>Price:</strong> $${property.price.toLocaleString()} USD</li>
                    <li class="list-group-item"><strong>Lot Size:</strong> ${property.size}</li>
                </ul>
                <div class="card-body">
                    <a href="#" class="btn btn-primary w-100">Contact Agent</a>
                </div>
            </div>
        </div>
    `;

    const createMetalCard = (metal) => {
        const changeClass = metal.change >= 0 ? 'text-profit' : 'text-loss';
        const changeIcon = metal.change >= 0 ? 'bi-arrow-up-right' : 'bi-arrow-down-left';

        return `
            <div class="col-lg-4 col-md-6">
                <div class="card real-estate-card h-100">
                    <img src="${metal.imageUrl}" class="card-img-top" alt="${metal.name}">
                    <div class="card-body">
                        <h5 class="card-title">${metal.name}</h5>
                        <p class="card-text small">${metal.description}</p>
                    </div>
                    <ul class="list-group list-group-flush">
                         <li class="list-group-item">
                            <div class="d-flex justify-content-between align-items-center">
                                <span class="fw-bold fs-5">$${metal.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                <span class="fs-6 text-muted">per ${metal.unit}</span>
                            </div>
                        </li>
                        <li class="list-group-item ${changeClass}">
                            <i class="bi ${changeIcon}"></i> ${metal.change.toFixed(2)} (${metal.changePercent.toFixed(2)}%)
                        </li>
                    </ul>
                    <div class="card-body">
                        <a href="#" class="btn btn-primary w-100">View Investment Options</a>
                    </div>
                </div>
            </div>
        `;
    };

    const createEnergyCard = (energy) => {
        const changeClass = energy.change >= 0 ? 'text-profit' : 'text-loss';
        const changeIcon = energy.change >= 0 ? 'bi-arrow-up-right' : 'bi-arrow-down-left';
        const typeBadge = energy.type === 'Renewable' 
            ? '<span class="badge bg-success">Renewable</span>' 
            : '<span class="badge bg-secondary">Non-Renewable</span>';

        return `
            <div class="col-lg-4 col-md-6">
                <div class="card energy-card h-100">
                    <img src="${energy.imageUrl}" class="card-img-top" alt="${energy.name}">
                    <div class="card-body">
                        <h5 class="card-title d-flex justify-content-between align-items-center">
                            <span>${energy.name}</span>
                            ${typeBadge}
                        </h5>
                        <p class="card-text small">${energy.description}</p>
                    </div>
                    <ul class="list-group list-group-flush">
                         <li class="list-group-item">
                            <div class="d-flex justify-content-between align-items-center">
                                <span class="fw-bold fs-5">$${energy.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                <span class="fs-6 text-muted">per ${energy.unit}</span>
                            </div>
                        </li>
                        <li class="list-group-item ${changeClass}">
                            <i class="bi ${changeIcon}"></i> ${energy.change.toFixed(3)} (${energy.changePercent.toFixed(2)}%)
                        </li>
                    </ul>
                    <div class="card-body">
                        <a href="#" class="btn btn-primary w-100">Explore Projects</a>
                    </div>
                </div>
            </div>
        `;
    };

    const createArchetypeCard = (item) => {
        const trendSymbol = item.trendValue >= 0 ? '▲' : '▼';
        const trendClass = item.trendValue >= 0 ? 'text-profit' : 'text-loss';

        return `
            <div class="col-lg-4 col-md-6">
                <div class="card archetype-card h-100">
                    <img src="${item.imageUrl}" class="card-img-top" alt="${item.name}">
                    <div class="card-body">
                        <h5 class="card-title d-flex justify-content-between align-items-center">
                            <span>${item.name}</span>
                            <span class="badge bg-info text-dark">${item.type}</span>
                        </h5>
                        <p class="card-text small">${item.description}</p>
                    </div>
                    <ul class="list-group list-group-flush">
                         <li class="list-group-item">
                            <div class="d-flex justify-content-between align-items-center">
                                <span class="fw-bold fs-5">${item.influence.toFixed(1)}</span>
                                <span class="fs-6 text-muted">Influence Level</span>
                            </div>
                        </li>
                        <li class="list-group-item ${trendClass}">
                            <span class="fw-bold">${item.trend} ${trendSymbol} ${Math.abs(item.trendValue)}</span>
                        </li>
                    </ul>
                    <div class="card-body">
                        <a href="#" class="btn btn-primary w-100">Channel Energy</a>
                    </div>
                </div>
            </div>
        `;
    };

    const createIndexCard = (item, index) => `
        <div class="carousel-item ${index === 0 ? 'active' : ''}">
            <div class="row justify-content-center">
                <div class="col-11 col-md-10 col-lg-8">
                     <div class="index-card text-center">
                        <span class="fw-bold">${item.name}:</span>
                        <span class="ms-2">${item.value.toFixed(2)}</span>
                        <span class="ms-2 ${item.change >= 0 ? 'text-profit' : 'text-loss'}">
                            ${item.change.toFixed(2)} (${item.changePercent.toFixed(2)}%)
                        </span>
                    </div>
                </div>
            </div>
        </div>
    `;

    const createNewsItem = (item) => `
        <a href="#" class="list-group-item list-group-item-action">
            <div class="d-flex w-100 justify-content-between">
                <h5 class="mb-1">${item.title}</h5>
                <small>${item.date}</small>
            </div>
            <p class="mb-1">${item.summary}</p>
            <small>${item.source}</small>
        </a>
    `;

    const renderStocks = () => {
        bmvContainer.innerHTML = mexicanStocks.map(createStockCard).join('');
        internationalContainer.innerHTML = internationalStocks.map(createStockCard).join('');
        renderFavorites();
        addCardListeners();
    };
    
    const renderRealEstate = () => {
        realEstateContainer.innerHTML = realEstateProperties.map(createRealEstateCard).join('');
    };
    
    const renderMetals = () => {
        preciousMetalsContainer.innerHTML = preciousMetals.map(createMetalCard).join('');
    };
    
    const renderEnergy = () => {
        energyContainer.innerHTML = energyResources.map(createEnergyCard).join('');
    };

    const renderArchetypes = () => {
        archetypesContainer.innerHTML = archetypesAndDeities.map(createArchetypeCard).join('');
    };
    
    const renderFavorites = () => {
        const favoriteStocks = allStocks.filter(s => favorites.includes(s.ticker));
        if (favoriteStocks.length > 0) {
            favoritesSection.classList.remove('d-none');
            favoritesContainer.innerHTML = favoriteStocks.map(createStockCard).join('');
        } else {
            favoritesSection.classList.add('d-none');
            favoritesContainer.innerHTML = '';
        }
    };
    
    const toggleFavorite = (ticker) => {
        const index = favorites.indexOf(ticker);
        if (index > -1) {
            favorites.splice(index, 1);
        } else {
            favorites.push(ticker);
        }
        localStorage.setItem('favorites', JSON.stringify(favorites));
        renderStocks(); // Re-render all to update star icons
    };
    
    const showStockDetails = (ticker) => {
        const stock = allStocks.find(s => s.ticker === ticker);
        if (!stock) return;

        const modal = new bootstrap.Modal(document.getElementById('stock-modal'));
        document.getElementById('stock-modal-label').innerText = `${stock.name} (${stock.ticker})`;

        const chartCanvas = document.getElementById('stock-chart');
        
        if (stockChart) {
            stockChart.destroy();
        }

        const labels = stock.history.map((_, i) => `Day ${i + 1}`);
        stockChart = new Chart(chartCanvas, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Price History',
                    data: stock.history,
                    borderColor: 'var(--color-neutral)',
                    backgroundColor: 'rgba(13, 110, 253, 0.1)',
                    fill: true,
                    tension: 0.3
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
            }
        });
        
        modal.show();
    };
    
    function addCardListeners() {
        document.querySelectorAll('.favorite-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                toggleFavorite(e.target.dataset.ticker);
            });
        });
        
        document.querySelectorAll('.view-details-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                showStockDetails(e.target.dataset.ticker);
            });
        });
    }

    const calculateROI = () => {
        const purchasePrice = parseFloat(purchasePriceInput.value);
        const sellPrice = parseFloat(sellPriceInput.value);
        const numShares = parseInt(numSharesInput.value);

        if (isNaN(purchasePrice) || isNaN(sellPrice) || isNaN(numShares) || purchasePrice <= 0 || numShares <= 0) {
            roiResultContainer.classList.add('d-none');
            // Optionally show an error message
            return;
        }

        const totalInvestment = purchasePrice * numShares;
        const totalReturn = sellPrice * numShares;
        const profitLoss = totalReturn - totalInvestment;
        const roi = (profitLoss / totalInvestment) * 100;

        totalInvestmentEl.textContent = `$${totalInvestment.toFixed(2)}`;
        totalReturnEl.textContent = `$${totalReturn.toFixed(2)}`;
        
        profitLossEl.textContent = `$${profitLoss.toFixed(2)}`;
        roiResultEl.textContent = `${roi.toFixed(2)}%`;

        profitLossEl.classList.toggle('text-profit', profitLoss >= 0);
        profitLossEl.classList.toggle('text-loss', profitLoss < 0);
        roiResultEl.classList.toggle('text-profit', roi >= 0);
        roiResultEl.classList.toggle('text-loss', roi < 0);

        // Update visualizer
        const investmentPercentage = (totalInvestment / (totalInvestment + Math.abs(profitLoss))) * 100;
        const profitLossPercentage = 100 - investmentPercentage;
        
        investmentBar.style.width = `${totalInvestment / totalReturn * 100}%`;
        investmentBar.classList.remove('bg-success', 'bg-danger', 'bg-primary');
        investmentBar.classList.add('bg-primary');
        
        profitLossBar.style.width = `${Math.abs(profitLoss) / totalReturn * 100}%`;
        profitLossBar.classList.remove('bg-success', 'bg-danger');
        profitLossBar.textContent = profitLoss >= 0 ? 'Profit' : 'Loss';
        
        if (profitLoss >= 0) {
            investmentBar.style.width = `${totalInvestment / totalReturn * 100}%`;
            profitLossBar.style.width = `${profitLoss / totalReturn * 100}%`;
            profitLossBar.classList.add('bg-success');
        } else { // loss
            investmentBar.style.width = `100%`;
            profitLossBar.style.width = `${Math.abs(profitLoss) / totalInvestment * 100}%`;
            investmentBar.classList.add('bg-danger');
            profitLossBar.classList.add('d-none'); // Hide profit bar on loss, investment bar shows full amount
        }
        
        if(profitLoss < 0) {
            investmentBar.style.width = '100%';
            investmentBar.classList.remove('bg-primary');
            investmentBar.classList.add('bg-danger');
            investmentBar.textContent = `-$${Math.abs(profitLoss).toFixed(2)} Loss`;
            profitLossBar.style.width = '0%';

        } else {
            investmentBar.style.width = `${(totalInvestment/totalReturn)*100}%`;
            investmentBar.textContent = 'Investment';
            investmentBar.classList.remove('bg-danger');
            investmentBar.classList.add('bg-primary');

            profitLossBar.style.width = `${(profitLoss/totalReturn)*100}%`;
            profitLossBar.classList.remove('d-none');
            profitLossBar.classList.add('bg-success');
        }

        roiResultContainer.classList.remove('d-none');
    };

    const filterStocks = (query) => {
        const upperQuery = query.toUpperCase();
        document.querySelectorAll('.stock-card-wrapper').forEach(card => {
            const ticker = card.dataset.ticker.toUpperCase();
            if (ticker.includes(upperQuery)) {
                card.style.display = '';
            } else {
                card.style.display = 'none';
            }
        });
    };
    
    const setTheme = (theme) => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        themeSwitcher.checked = theme === 'dark';
        if (stockChart) {
            stockChart.options.scales.x.ticks.color = theme === 'dark' ? '#e0e0e0' : '#212529';
            stockChart.options.scales.y.ticks.color = theme === 'dark' ? '#e0e0e0' : '#212529';
            stockChart.update();
        }
    };
    
    // Initial Setup
    indicesContainer.innerHTML = globalIndices.map(createIndexCard).join('');
    newsContainer.innerHTML = newsFeed.map(createNewsItem).join('');
    renderStocks();
    renderRealEstate();
    renderMetals();
    renderEnergy();
    renderArchetypes();
    
    // Event Listeners
    searchInput.addEventListener('input', (e) => filterStocks(e.target.value));
    calculateRoiBtn.addEventListener('click', calculateROI);
    
    themeSwitcher.addEventListener('change', (e) => {
        setTheme(e.target.checked ? 'dark' : 'light');
    });

    // Load saved theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
});