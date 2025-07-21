const mexicanStocks = [
    { ticker: 'AMX L', name: 'América Móvil', price: 15.80, change: 0.15, changePercent: 0.96, history: [15.5, 15.6, 15.4, 15.7, 15.8] },
    { ticker: 'FEMSA UBD', name: 'Fomento Económico Mexicano', price: 180.25, change: -1.50, changePercent: -0.83, history: [182.1, 181.5, 181.9, 180.5, 180.25] },
    { ticker: 'WALMEX *', name: 'Walmart de México', price: 71.50, change: 0.75, changePercent: 1.06, history: [70.5, 70.8, 70.7, 71.1, 71.5] },
    { ticker: 'GFNORTE O', name: 'Grupo Financiero Banorte', price: 145.90, change: -0.20, changePercent: -0.14, history: [146.0, 146.2, 145.8, 146.1, 145.9] },
    { ticker: 'CEMEX CPO', name: 'Cemex', price: 12.30, change: 0.25, changePercent: 2.07, history: [12.0, 12.1, 12.05, 12.2, 12.3] },
];

const internationalStocks = [
    { ticker: 'AAPL', name: 'Apple Inc.', price: 195.89, change: 1.25, changePercent: 0.64, history: [194.5, 195.1, 194.9, 195.5, 195.89] },
    { ticker: 'TSLA', name: 'Tesla, Inc.', price: 250.22, change: -5.60, changePercent: -2.19, history: [255.0, 256.1, 252.5, 253.0, 250.22] },
    { ticker: 'MSFT', name: 'Microsoft Corp.', price: 370.95, change: 3.10, changePercent: 0.84, history: [368.0, 369.5, 369.0, 370.1, 370.95] },
    { ticker: 'BABA', name: 'Alibaba Group', price: 88.67, change: -1.12, changePercent: -1.25, history: [90.1, 89.5, 89.8, 89.2, 88.67] },
    { ticker: 'GOOGL', name: 'Alphabet Inc.', price: 138.58, change: 0.98, changePercent: 0.71, history: [137.2, 137.8, 137.5, 138.1, 138.58] },
];

const globalIndices = [
    { name: 'S&P 500', value: 4550.58, change: 15.20, changePercent: 0.33 },
    { name: 'NASDAQ', value: 14250.85, change: -50.40, changePercent: -0.35 },
    { name: 'DOW JONES', value: 35400.12, change: 120.75, changePercent: 0.34 },
    { name: 'DAX', value: 15980.40, change: 45.10, changePercent: 0.28 },
    { name: 'Nikkei 225', value: 33450.70, change: -150.20, changePercent: -0.45 },
];

const newsFeed = [
    { title: "Market hits new highs on tech sector gains", source: "Financial News Today", summary: "Tech giants pushed the S&P 500 to a record close...", date: "2024-07-20" },
    { title: "Central Bank hints at interest rate stability", source: "Economic Times", summary: "Officials suggest rates will hold steady through the next quarter...", date: "2024-07-20" },
    { title: "Tesla stock drops amid production concerns", source: "Auto Investor", summary: "Shares of TSLA fell after reports of supply chain disruptions surfaced...", date: "2024-07-19" },
    { title: "Emerging markets show strong growth potential", source: "Global Wealth", summary: "Investors are looking towards emerging markets for higher returns...", date: "2024-07-18" },
];

const realEstateProperties = [
    { id: 're01', name: 'Coastal View Lot', location: 'Baja California', price: 120000, size: '500 m²', imageUrl: 'property1.png', description: 'Stunning ocean-view lot, perfect for a vacation home. Utilities available at the property line.' },
    { id: 're02', name: 'Mountain Retreat Plot', location: 'Chihuahua', price: 75000, size: '1,200 m²', imageUrl: 'property2.png', description: 'Secluded mountain plot surrounded by pine trees. Ideal for a cabin or off-grid living.' },
    { id: 're03', name: 'Suburban Development Land', location: 'Nuevo León', price: 250000, size: '800 m²', imageUrl: 'property3.png', description: 'Prime land for commercial or residential development in a fast-growing suburban area.' },
];

const preciousMetals = [
    { id: 'metal01', name: 'Gold', price: 2350.50, change: 15.25, changePercent: 0.65, imageUrl: 'gold.png', unit: 'oz', description: 'The timeless store of value, seen as a hedge against inflation and economic uncertainty.' },
    { id: 'metal02', name: 'Silver', price: 29.80, change: -0.45, changePercent: -1.49, imageUrl: 'silver.png', unit: 'oz', description: 'Valued for both its industrial applications and as an affordable precious metal investment.' },
    { id: 'metal03', name: 'Platinum', price: 995.00, change: 8.70, changePercent: 0.88, imageUrl: 'platinum.png', unit: 'oz', description: 'A rare metal with significant use in the automotive and jewelry industries.' },
];

const energyResources = [
    { id: 'en01', name: 'Solar Energy', type: 'Renewable', price: 0.05, change: 0.002, changePercent: 4.17, imageUrl: 'solar-panels.png', unit: 'kWh', description: 'Investment in solar power generation, a leading source of renewable energy with decreasing production costs.' },
    { id: 'en02', name: 'Wind Power', type: 'Renewable', price: 0.04, change: -0.001, changePercent: -2.44, imageUrl: 'wind-turbines.png', unit: 'kWh', description: 'Harnessing wind for clean electricity. A growing sector with significant technological advancements.' },
    { id: 'en03', name: 'Crude Oil', type: 'Non-Renewable', price: 85.50, change: 1.25, changePercent: 1.48, imageUrl: 'oil-rig.png', unit: 'barrel', description: 'A primary global energy source, its price is influenced by geopolitical events and global demand.' },
    { id: 'en04', name: 'Natural Gas', type: 'Non-Renewable', price: 2.85, change: 0.15, changePercent: 5.56, imageUrl: 'natural-gas.png', unit: 'MMBtu', description: 'A cleaner-burning fossil fuel, often used as a transitional energy source in the shift to renewables.' },
];

const archetypesAndDeities = [
    { id: 'ad01', name: 'The Sovereign', type: 'Archetype', influence: 95.8, trend: 'Ascending', trendValue: 1.2, imageUrl: 'sovereign.png', description: 'Represents order, leadership, and the power to build stable structures. Its energy promotes strategic thinking and sovereignty.' },
    { id: 'ad02', name: 'The Creator', type: 'Archetype', influence: 88.2, trend: 'Dynamic', trendValue: 0.8, imageUrl: 'creator.png', description: 'The source of innovation, artistry, and manifestation. This energy helps bring new ideas into form and reality.' },
    { id: 'ad03', name: 'The Alchemist', type: 'Archetype', influence: 92.5, trend: 'Transforming', trendValue: -0.5, imageUrl: 'alchemist.png', description: 'The archetype of transformation and change. It governs the processes of turning challenges into opportunities and lead into gold.' },
];