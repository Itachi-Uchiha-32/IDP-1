document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");

  menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("active");
  });
  renderCart();
});
fetch('products.json')
  .then(response => response.json())
  .then(products => {
    const grid = document.querySelector('.product-grid');
    grid.innerHTML = '';

    // Show only first 6 products
    products.slice(0, 6).forEach(product => {
      const card = document.createElement('div');
      card.className = 'product-card';

      card.innerHTML = `
        <img src="${product.image}" alt="${product.name}">
        <h3>${product.name}</h3>
        <p>৳${product.price}</p>
        <button class="btn add-to-cart-btn" data-id="${product.id}">Add to Cart</button>
      `;

      card.querySelector('img').addEventListener('click', () => {
        window.location.href = `product.html?id=${product.id}`;
      });
      card.querySelector('h3').addEventListener('click', () => {
        window.location.href = `product.html?id=${product.id}`;
      });
      
      grid.appendChild(card);

      card.querySelector('.add-to-cart-btn').addEventListener('click', () => {
        addToCart(product);
        alert(`${product.name} added to cart!`);
      });
    });


    

    // Add the "See All Products" button below the grid
    const seeAllBtn = document.createElement('a');
    seeAllBtn.href = 'products.html';
    seeAllBtn.textContent = 'See All Products';
    seeAllBtn.className = 'btn see-all-btn';
    seeAllBtn.style.marginTop = '20px';
    seeAllBtn.style.display = 'inline-block';

    grid.parentElement.appendChild(seeAllBtn);
  })
  .catch(error => console.error('Error loading products:', error));


  let cart = JSON.parse(localStorage.getItem('cart')) || [];

const cartDrawer = document.getElementById('cartDrawer');
const cartOverlay = document.getElementById('cartOverlay');
const cartIcon = document.getElementById('cartIcon');
const closeCart = document.getElementById('closeCart');
const cartItemsContainer = document.querySelector('.cart-items');
const cartTotal = document.getElementById('cartTotal');
const cartCount = document.getElementById('cartCount');

// Toggle cart drawer
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

// Render cart items
function renderCart() {
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

  cartTotal.textContent = `৳${total}`;
  cartCount.textContent = itemCount;
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

// Add to cart (call this on product button click)
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



