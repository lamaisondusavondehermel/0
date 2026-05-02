let cart = JSON.parse(localStorage.getItem('hermel_cart')) || [];

function updateCartIcon() {
    const counts = document.querySelectorAll('.cart-count');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    counts.forEach(el => el.innerText = totalItems);
}

function addToCart(productName, price, image, isRedirect = false) {
    const qty = parseInt(document.getElementById('qty-value')?.innerText || 1);
    const existingItem = cart.find(item => item.name === productName);
    
    if (existingItem) {
        existingItem.quantity += qty;
    } else {
        cart.push({ name: productName, price: price, img: image, quantity: qty });
    }

    saveCart();
    if (isRedirect) {
        window.location.href = 'cart.html';
    } else {
        alert("Ajouté au panier !");
    }
}

// NEW: Functions for the Cart Page
function changeQuantity(index, delta) {
    cart[index].quantity += delta;
    if (cart[index].quantity <= 0) {
        removeFromCart(index);
    } else {
        saveCart();
        renderCart(); // This will be defined in cart.html
    }
}

function removeFromCart(index) {
    cart.splice(index, 1);
    saveCart();
    renderCart();
}

function saveCart() {
    localStorage.setItem('hermel_cart', JSON.stringify(cart));
    updateCartIcon();
}

document.addEventListener('DOMContentLoaded', updateCartIcon);

// Add this to the bottom of cart.js
function clearCart() {
    cart = [];
    localStorage.setItem('hermel_cart', JSON.stringify(cart));
    updateCartIcon();
}