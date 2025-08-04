// main.js
document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");

  if (menuToggle) {
    menuToggle.addEventListener("click", () => {
      navLinks.classList.toggle("active");
    });
  }
});

fetch('products.json')
  .then(response => response.json())
  .then(products => {
    const grid = document.querySelector('.product-grid');
    if (!grid) return;
    
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

      card.querySelector('.add-to-cart-btn').addEventListener('click', () => {
        addToCart(product);
        alert(`${product.name} added to cart!`);
      });

      grid.appendChild(card);
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
