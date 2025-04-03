// Cart functionality
let cart = [];
const cartCount = document.querySelector('.cart-count');
const cartModal = document.getElementById('cart-modal');
const cartIcon = document.getElementById('cart-icon');
const closeCart = document.querySelector('.close-cart');
const cartItems = document.querySelector('.cart-items');
const cartTotalAmount = document.getElementById('cart-total-amount');

// Cart modal functionality
cartIcon.addEventListener('click', (e) => {
    e.preventDefault();
    cartModal.classList.add('active');
});

closeCart.addEventListener('click', () => {
    cartModal.classList.remove('active');
});

// Close cart when clicking outside
document.addEventListener('click', (e) => {
    if (e.target === cartModal) {
        cartModal.classList.remove('active');
    }
});

// Add to cart functionality
document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', function(e) {
        const productCard = e.target.closest('.product-card');
        const productName = productCard.querySelector('h3').textContent;
        const productPrice = productCard.querySelector('.price').textContent;
        
        addToCart({
            name: productName,
            price: productPrice
        });
        
        // Show feedback
        showNotification('Added to cart');
    });
});

function addToCart(product) {
    cart.push(product);
    updateCartCount();
    updateCartDisplay();
    updateCartTotal();
}

function updateCartCount() {
    cartCount.textContent = cart.length;
}

function updateCartDisplay() {
    cartItems.innerHTML = cart.map((item, index) => `
        <div class="cart-item">
            <div>
                <h4>${item.name}</h4>
                <p>${item.price}</p>
            </div>
            <button class="remove-item" data-index="${index}">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `).join('');

    // Add event listeners to remove buttons
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', (e) => {
            const index = parseInt(e.target.closest('.remove-item').dataset.index);
            removeFromCart(index);
        });
    });
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartCount();
    updateCartDisplay();
    updateCartTotal();
    showNotification('Item removed from cart');
}

function updateCartTotal() {
    const total = cart.reduce((sum, item) => {
        const price = parseFloat(item.price.replace('₱', '').replace(',', ''));
        return sum + price;
    }, 0);
    
    cartTotalAmount.textContent = `₱${total.toLocaleString()}`;
}

// Notification system
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Style the notification
    notification.style.position = 'fixed';
    notification.style.bottom = '20px';
    notification.style.right = '20px';
    notification.style.backgroundColor = 'var(--primary-color)';
    notification.style.color = 'var(--secondary-color)';
    notification.style.padding = '1rem 2rem';
    notification.style.borderRadius = '4px';
    notification.style.zIndex = '1000';
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Navbar scroll effect
let lastScroll = 0;
const navbar = document.querySelector('.main-nav');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.2)';
    }
    
    lastScroll = currentScroll;
});

// Product card hover effect
document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-5px)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    updateCartDisplay();
    updateCartTotal();
});
