// منع أي رسالة alert من الظهور في الموقع نهائياً
window.alert = function() { 
    console.log("Alert blocked safely."); 
    return false; 
};

let cart = JSON.parse(localStorage.getItem('hermel_cart')) || [];

function saveCart() {
    localStorage.setItem('hermel_cart', JSON.stringify(cart));
}

function addToCart(name, price, image) {
    const existingItem = cart.find(item => item.name === name);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ name, price: parseFloat(price), image: image, quantity: 1 });
    }
    saveCart();
    showNotification(name + " added to your ritual");
}

function removeFromCart(index) {
    cart.splice(index, 1);
    saveCart();
    if (typeof renderCart === "function") renderCart();
}

function changeQuantity(index, delta) {
    if (cart[index].quantity + delta > 0) {
        cart[index].quantity += delta;
        saveCart();
        if (typeof renderCart === "function") renderCart();
    }
}

function clearCart() {
    cart = [];
    saveCart();
}

// دالة التنبيه الأنيقة البديلة عن alert
function showNotification(message) {
    const old = document.querySelector('.toast-msg');
    if(old) old.remove();

    const toast = document.createElement("div");
    toast.className = 'toast-msg';
    toast.innerText = message;
    toast.style.cssText = `
        position: fixed; bottom: 30px; left: 50%; transform: translateX(-50%);
        background: #3e2723; color: #fcfaf8; padding: 12px 25px;
        border-radius: 50px; z-index: 10000; font-size: 14px;
        font-family: sans-serif; box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        transition: opacity 0.5s; opacity: 1;
    `;
    document.body.appendChild(toast);
    setTimeout(() => { 
        toast.style.opacity = "0"; 
        setTimeout(() => toast.remove(), 500); 
    }, 2500);
}