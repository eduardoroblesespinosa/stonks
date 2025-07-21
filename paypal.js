import { addCredits } from 'game';

const rechargePackages = [
    { name: 'Pack Inicial', credits: 50, price: '1.50', containerId: 'paypal-button-container-1' },
    { name: 'Pack Explorador', credits: 120, price: '3.00', containerId: 'paypal-button-container-2' },
    { name: 'Pack Cósmico', credits: 250, price: '5.00', containerId: 'paypal-button-container-3' },
    { name: 'Pack Galáctico', credits: 700, price: '10.00', containerId: 'paypal-button-container-4' },
    { name: 'Pack Universo', credits: 2000, price: '25.00', containerId: 'paypal-button-container-5' }
];

function createRechargeCards() {
    const container = document.getElementById('recharge-options');
    if (!container) return;

    rechargePackages.forEach(pkg => {
        const cardHtml = `
            <div class="col-md-4 col-lg">
                <div class="card bg-dark-transparent h-100 text-white text-center recharge-card">
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title">${pkg.name}</h5>
                        <p class="card-text display-6 fw-bold">${pkg.credits}</p>
                        <p class="card-text">Créditos</p>
                        <p class="fs-4 fw-bold mt-auto mb-3">$${pkg.price}</p>
                        <div id="${pkg.containerId}"></div>
                    </div>
                </div>
            </div>
        `;
        container.innerHTML += cardHtml;
    });
}

function renderPayPalButton(pkg) {
     paypal.Buttons({
        createOrder: function(data, actions) {
            return actions.order.create({
                purchase_units: [{
                    description: `Recarga de ${pkg.credits} créditos para Ruleta Cósmica`,
                    amount: {
                        value: pkg.price
                    }
                }]
            });
        },
        onApprove: function(data, actions) {
            return actions.order.capture().then(function(details) {
                addCredits(pkg.credits);
            });
        },
        onError: function(err) {
            console.error('An error occurred with the PayPal payment:', err);
            alert('Ocurrió un error con el pago. Por favor, inténtalo de nuevo.');
        }
    }).render(`#${pkg.containerId}`);
}


export function initPayPalButtons() {
    createRechargeCards();
    rechargePackages.forEach(pkg => {
        renderPayPalButton(pkg);
    });
}