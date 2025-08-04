let allProducts = [];
const grid = document.querySelector('.product-grid');
const searchInput = document.getElementById('searchInput');
const companyFilter = document.getElementById('companyFilter');
const categoryFilter = document.getElementById('categoryFilter');
const groupFilter = document.getElementById('groupFilter');

// Fetch data and populate products + dropdowns
fetch('products.json')
  .then(res => res.json())
  .then(products => {
    allProducts = products;

    // Populate dropdowns dynamically
    populateDropdown(companyFilter, [...new Set(products.map(p => p.company))]);
    populateDropdown(categoryFilter, [...new Set(products.map(p => p.category))]);
    populateDropdown(groupFilter, [...new Set(products.map(p => p.category))]); // using category as group for now

    renderProducts(allProducts);
  });

// Populate dropdown helper
function populateDropdown(selectElement, items) {
  items.forEach(item => {
    const option = document.createElement('option');
    option.value = item;
    option.textContent = item;
    selectElement.appendChild(option);
  });
}

// Render products
function renderProducts(products) {
  grid.innerHTML = '';
  if (products.length === 0) {
    grid.innerHTML = '<p>No products found.</p>';
    return;
  }
  products.forEach(product => {
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
}

// Filter function
function filterProducts() {
  let filtered = allProducts;

  const searchValue = searchInput.value.toLowerCase();
  const companyValue = companyFilter.value;
  const categoryValue = categoryFilter.value;
  const groupValue = groupFilter.value;

  if (searchValue) {
    filtered = filtered.filter(p => p.name.toLowerCase().includes(searchValue));
  }
  if (companyValue) {
    filtered = filtered.filter(p => p.company === companyValue);
  }
  if (categoryValue) {
    filtered = filtered.filter(p => p.category === categoryValue);
  }
  if (groupValue) {
    filtered = filtered.filter(p => p.category === groupValue);
  }

  renderProducts(filtered);
}

// Event listeners
searchInput.addEventListener('input', filterProducts);
companyFilter.addEventListener('change', filterProducts);
categoryFilter.addEventListener('change', filterProducts);
groupFilter.addEventListener('change', filterProducts);
