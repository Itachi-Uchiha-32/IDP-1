document.addEventListener("DOMContentLoaded", () => {
  const links = document.querySelectorAll(".sidebar ul li a");
  const sections = document.querySelectorAll(".content-section");

  // Sidebar navigation click handler
  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const target = link.getAttribute("data-section");

      // Toggle active section
      sections.forEach((section) => section.classList.remove("active"));
      document.getElementById(target).classList.add("active");

      // Toggle active link
      links.forEach((l) => l.classList.remove("active"));
      link.classList.add("active");

      // Load content based on section
      if (target === "cart-summary") loadCartSummary();
      else if (target === "order-history") loadOrderHistory();
      else if (target === "my-requests") loadMyRequests();
      // No need to load for make-request (just form)
    });
  });

  // Load Cart Summary
  function loadCartSummary() {
    const container = document.getElementById("cartSummaryContainer");
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (cart.length === 0) {
      container.innerHTML = "<p>No items in cart.</p>";
      return;
    }

    let total = 0;
    let table = `
      <table>
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Quantity</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
    `;

    cart.forEach((item) => {
      total += item.price * item.quantity;
      table += `
        <tr>
          <td><img src="${item.image}" width="60"></td>
          <td>${item.name}</td>
          <td>${item.quantity}</td>
          <td>৳${item.price * item.quantity}</td>
        </tr>
      `;
    });

    table += `
        </tbody>
      </table>
      <div class="checkout-container">
        <h3>Total: ৳${total}</h3>
        <a href="checkout.html" class="btn checkout-btn">Go to Checkout</a>
      </div>
    `;

    container.innerHTML = table;
  }

  // Load Order History
  function loadOrderHistory() {
    const container = document.getElementById("orderHistoryContainer");
    const orderHistory = JSON.parse(localStorage.getItem("orders")) || [];

    container.innerHTML = "";

    if (orderHistory.length === 0) {
      container.innerHTML = "<p>No past orders yet.</p>";
      return;
    }

    orderHistory.forEach((order) => {
      const card = document.createElement("div");
      card.className = "order-card";

      let html = `
      <h4>Order #${order.id} - ${order.date}</h4>
      <table>
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Quantity</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
      `;

      order.items.forEach((item) => {
        html += `
        <tr>
          <td><img src="${item.image}" width="60"></td>
          <td>${item.name}</td>
          <td>${item.quantity}</td>
          <td>৳${item.price * item.quantity}</td>
        </tr>
      `;
      });

      html += `
        </tbody>
      </table>
      <h4>Total: ৳${order.total}</h4>
      `;

      card.innerHTML = html;
      container.appendChild(card);
    });
  }

  // Form submission for product request
  const productRequestForm = document.getElementById("productRequestForm");
  productRequestForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // Collect form data
    const name = productRequestForm.productName.value.trim();
    const description = productRequestForm.description.value.trim();
    const group = productRequestForm.group.value.trim();
    const company = productRequestForm.company.value.trim();
    const category = productRequestForm.category.value;

    if (!name || !description || !group || !company || !category) {
      alert("Please fill in all fields.");
      return;
    }

    // Create new request object
    const newRequest = {
      id: Date.now(), // unique id
      name,
      description,
      group,
      company,
      category,
      status: "Pending",
    };

    // Get existing requests from localStorage
    const requests = JSON.parse(localStorage.getItem("productRequests")) || [];
    requests.push(newRequest);

    // Save updated requests
    localStorage.setItem("productRequests", JSON.stringify(requests));

    // Reset form
    productRequestForm.reset();

    alert("Product request submitted successfully!");

    // Optionally, switch to My Requests section to see it immediately
    switchToSection("my-requests");
    loadMyRequests();
  });

  // Load My Requests table
  function loadMyRequests() {
    const container = document.getElementById("myRequestsContainer");
    const requests = JSON.parse(localStorage.getItem("productRequests")) || [];

    if (requests.length === 0) {
      container.innerHTML = "<p>You have no product requests.</p>";
      return;
    }

    let html = `
      <table>
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Description</th>
            <th>Group</th>
            <th>Company</th>
            <th>Category</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
    `;

    requests.forEach((req) => {
      html += `
        <tr data-id="${req.id}">
          <td>${req.name}</td>
          <td>${req.description}</td>
          <td>${req.group}</td>
          <td>${req.company}</td>
          <td>${req.category}</td>
          <td>${req.status}</td>
          <td>
            <button class="action-btn edit-btn">Edit</button>
            <button class="action-btn delete-btn">Delete</button>
          </td>
        </tr>
      `;
    });

    html += `
        </tbody>
      </table>
    `;

    container.innerHTML = html;

    // Add event listeners for edit and delete buttons
    container.querySelectorAll(".edit-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const tr = e.target.closest("tr");
        const id = Number(tr.getAttribute("data-id"));
        editRequest(id);
      });
    });

    container.querySelectorAll(".delete-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const tr = e.target.closest("tr");
        const id = Number(tr.getAttribute("data-id"));
        deleteRequest(id);
      });
    });
  }

  // Edit request function: fills the form for editing
  function editRequest(id) {
    const requests = JSON.parse(localStorage.getItem("productRequests")) || [];
    const request = requests.find((r) => r.id === id);
    if (!request) return alert("Request not found.");

    // Switch to Make Request section and fill form
    switchToSection("make-request");

    productRequestForm.productName.value = request.name;
    productRequestForm.description.value = request.description;
    productRequestForm.group.value = request.group;
    productRequestForm.company.value = request.company;
    productRequestForm.category.value = request.category;

    // Save the editing id to form dataset for tracking
    productRequestForm.dataset.editingId = id;

    // Change submit button text
    productRequestForm.querySelector("button[type='submit']").textContent = "Update Request";
  }

  // Delete request function
  function deleteRequest(id) {
    if (!confirm("Are you sure you want to delete this request?")) return;

    let requests = JSON.parse(localStorage.getItem("productRequests")) || [];
    requests = requests.filter((r) => r.id !== id);
    localStorage.setItem("productRequests", JSON.stringify(requests));

    alert("Request deleted.");

    loadMyRequests();
  }

  // Handle form submit for both new and update
  productRequestForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // Collect form data
    const name = productRequestForm.productName.value.trim();
    const description = productRequestForm.description.value.trim();
    const group = productRequestForm.group.value.trim();
    const company = productRequestForm.company.value.trim();
    const category = productRequestForm.category.value;

    if (!name || !description || !group || !company || !category) {
      alert("Please fill in all fields.");
      return;
    }

    const editingId = productRequestForm.dataset.editingId;

    const requests = JSON.parse(localStorage.getItem("productRequests")) || [];

    if (editingId) {
      // Update existing request
      const idx = requests.findIndex((r) => r.id === Number(editingId));
      if (idx !== -1) {
        requests[idx] = {
          ...requests[idx],
          name,
          description,
          group,
          company,
          category,
          status: requests[idx].status, // keep status unchanged
        };
        localStorage.setItem("productRequests", JSON.stringify(requests));
        alert("Request updated successfully!");
      }
      // Clear editing state
      delete productRequestForm.dataset.editingId;
      productRequestForm.querySelector("button[type='submit']").textContent = "Submit Request";
    } else {
      // Create new request
      const newRequest = {
        id: Date.now(),
        name,
        description,
        group,
        company,
        category,
        status: "Pending",
      };
      requests.push(newRequest);
      localStorage.setItem("productRequests", JSON.stringify(requests));
      alert("Product request submitted successfully!");
    }

    productRequestForm.reset();

    // Switch to My Requests to show updated list
    switchToSection("my-requests");
    loadMyRequests();
  });

  // Helper: Switch content sections and sidebar active link by section id
  function switchToSection(sectionId) {
    sections.forEach((section) => section.classList.remove("active"));
    document.getElementById(sectionId).classList.add("active");

    links.forEach((l) => l.classList.remove("active"));
    links.forEach((l) => {
      if (l.getAttribute("data-section") === sectionId) l.classList.add("active");
    });
  }

  // Load default section on page load
  loadCartSummary();
});
