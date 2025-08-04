document.addEventListener("DOMContentLoaded", () => {
  const checkoutItems = document.getElementById("checkoutItems");
  const checkoutTotal = document.getElementById("checkoutTotal");
  const checkoutBtn = document.getElementById("checkoutBtn");

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  function renderCheckout() {
    checkoutItems.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
      total += item.price * item.quantity;

      const row = document.createElement("tr");
      row.innerHTML = `
        <td><img src="${item.image}" alt="${item.name}" width="60"></td>
        <td>${item.name}</td>
        <td>
          <button onclick="updateQuantity(${item.id}, -1)">-</button>
          <span>${item.quantity}</span>
          <button onclick="updateQuantity(${item.id}, 1)">+</button>
        </td>
        <td>৳${item.price * item.quantity}</td>
      `;
      checkoutItems.appendChild(row);
    });

    checkoutTotal.textContent = `৳${total}`;
  }

  // updateQuantity comes from cart.js
  window.updateQuantity = (id, change) => {
    cart = cart.map(item =>
      item.id === id
        ? { ...item, quantity: Math.max(0, item.quantity + change) }
        : item
    ).filter(item => item.quantity > 0);

    localStorage.setItem("cart", JSON.stringify(cart));
    renderCheckout();
  };

  checkoutBtn.addEventListener("click", () => {
    localStorage.removeItem("cart");
    window.location.href = "confirmed.html";
  });

  renderCheckout();
});
