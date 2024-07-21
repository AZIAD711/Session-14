const apiUrl = 'https://fakestoreapi.com/products'; 

document.addEventListener('DOMContentLoaded', () => {
  const productsContainer = document.getElementById('products');
  const cartContainer = document.getElementById('cart-items');
  const searchInput = document.getElementById('search');
  const filterSelect = document.getElementById('filter');
  const sortSelect = document.getElementById('sort');
  const clearCartButton = document.getElementById('clear-cart');
  
  let products = [];
  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  // Fetch all products
  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      products = data;
      renderProducts(products);
      populateFilterOptions(products);
      renderCart();
    });

  // Render products
  function renderProducts(products) {
    productsContainer.innerHTML = products.map(product => `
      <div class="product">
        <img src="${product.image}" alt="${product.title}">
        <h3>${product.title}</h3>
        <p>${product.description}</p>
        <p>$${product.price}</p>
        <button onclick="addToCart(${product.id})">Add to Cart</button>
      </div>
    `).join('');
  }

  // Render cart
  function renderCart() {
    cartContainer.innerHTML = cart.map(item => `
      <li class="cart-item">
        ${item.title} - $${item.price} x ${item.quantity}
        <button onclick="increaseQuantity(${item.id})">+</button>
        <button onclick="decreaseQuantity(${item.id})">-</button>
        <button onclick="removeFromCart(${item.id})">Remove</button>
      </li>
    `).join('');
    localStorage.setItem('cart', JSON.stringify(cart));
  }

  // Add to cart
  window.addToCart = function(productId) {
    const product = products.find(p => p.id === productId);
    const cartItem = cart.find(item => item.id === productId);
    
    if (cartItem) {
      cartItem.quantity++;
    } else {
      cart.push({ ...product, quantity: 1 });
    }

    renderCart();
  }

  // Increase quantity
  window.increaseQuantity = function(productId) {
    const cartItem = cart.find(item => item.id === productId);
    cartItem.quantity++;
    renderCart();
  }

  // Decrease quantity
  window.decreaseQuantity = function(productId) {
    const cartItem = cart.find(item => item.id === productId);
    if (cartItem.quantity > 1) {
      cartItem.quantity--;
    } else {
      cart = cart.filter(item => item.id !== productId);
    }
    renderCart();
  }

  // Remove from cart
  window.removeFromCart = function(productId) {
    cart = cart.filter(item => item.id !== productId);
    renderCart();
  }

  // Clear cart
  clearCartButton.addEventListener('click', () => {
    cart = [];
    renderCart();
  });

  // Search products
  searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase();
    const filteredProducts = products.filter(product =>
      product.title.toLowerCase().includes(query)
    );
    renderProducts(filteredProducts);
  });

  // Filter products by type
  filterSelect.addEventListener('change', () => {
    const selectedType = filterSelect.value;
    const filteredProducts = selectedType ? products.filter(product =>
      product.category === selectedType
    ) : products;
    renderProducts(filteredProducts);
  });

  // Sort products by price
  sortSelect.addEventListener('change', () => {
    const sortOrder = sortSelect.value;
    const sortedProducts = [...products].sort((a, b) =>
      sortOrder === 'asc' ? a.price - b.price : b.price - a.price
    );
    renderProducts(sortedProducts);
  });

  // Populate filter options
  function populateFilterOptions(products) {
    const categories = [...new Set(products.map(product => product.category))];
    filterSelect.innerHTML += categories.map(category => `
      <option value="${category}">${category}</option>
    `).join('');
  }
});
