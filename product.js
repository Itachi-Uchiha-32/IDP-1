// Get product ID from URL
const params = new URLSearchParams(window.location.search);
const productId = params.get('id');

// Fetch product data
fetch('products.json')
  .then(response => response.json())
  .then(products => {
    const product = products.find(p => p.id == productId);
    const detailsSection = document.getElementById('product-details');

    if (product) {
      detailsSection.innerHTML = `
        <img src="${product.image}" alt="${product.name}">
        <div class="product-info">
          <h2>${product.name}</h2>
          <p><strong>Company:</strong> ${product.company}</p>
          <p><strong>Category:</strong> ${product.category}</p>
          <p class="price">৳${product.price}</p>
          <p>${product.description}</p>
          <button class="btn add-to-cart-btn" data-id="${product.id}">Add to Cart</button>
        </div>
      `;
    } else {
      detailsSection.innerHTML = `<p>Sorry, product not found.</p>`;
    }
  })
  .catch(err => {
    console.error('Error loading product:', err);
    document.getElementById('product-details').innerHTML = `<p>Error loading product details.</p>`;
  });
