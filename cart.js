// cart.js
let cart = JSON.parse(localStorage.getItem('cart')) || [];

const cartDrawer = document.getElementById('cartDrawer');
const cartOverlay = document.getElementById('cartOverlay');
const cartIcon = document.getElementById('cartIcon');
const closeCart = document.getElementById('closeCart');
const cartItemsContainer = document.querySelector('.cart-items');
const cartTotal = document.getElementById('cartTotal');
const cartCount = document.getElementById('cartCount');

// Toggle cart drawer
if (cartIcon && cartDrawer && cartOverlay) {
  cartIcon.addEventListener('click', (e) => {
    e.preventDefault();
    cartDrawer.classList.add('open');
    cartOverlay.classList.add('active');
    renderCart();
  });

  closeCart.addEventListener('click', () => {
    cartDrawer.classList.remove('open');
    cartOverlay.classList.remove('active');
  });

  cartOverlay.addEventListener('click', () => {
    cartDrawer.classList.remove('open');
    cartOverlay.classList.remove('active');
  });
}

// Render cart items
function renderCart() {
  if (!cartItemsContainer) return;
  
  cartItemsContainer.innerHTML = '';
  let total = 0;
  let itemCount = 0;

  cart.forEach(item => {
    total += item.price * item.quantity;
    itemCount += item.quantity;

    const div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <div class="cart-item-info">
        <h4>${item.name}</h4>
        <p>৳${item.price}</p>
      </div>
      <div class="quantity-control">
        <button onclick="updateQuantity(${item.id}, -1)">-</button>
        <span>${item.quantity}</span>
        <button onclick="updateQuantity(${item.id}, 1)">+</button>
      </div>
    `;
    cartItemsContainer.appendChild(div);
  });

  if (cartTotal) cartTotal.textContent = `৳${total}`;
  if (cartCount) cartCount.textContent = itemCount;
}

// Update quantity
function updateQuantity(id, change) {
  cart = cart.map(item =>
    item.id === id
      ? { ...item, quantity: Math.max(0, item.quantity + change) }
      : item
  ).filter(item => item.quantity > 0);

  localStorage.setItem('cart', JSON.stringify(cart));
  renderCart();
}

// Add to cart
function addToCart(product) {
  const existing = cart.find(item => item.id === product.id);
  if (existing) {
    existing.quantity++;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  localStorage.setItem('cart', JSON.stringify(cart));
  renderCart();
}

// Initialize cart count on page load
document.addEventListener("DOMContentLoaded", renderCart);
