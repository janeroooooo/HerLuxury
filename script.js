// Cart functionality
let cart = [];
const cartCount = document.querySelector('.cart-count');
const cartModal = document.getElementById('cart-modal');
const cartIcon = document.getElementById('cart-icon');
const closeCart = document.querySelector('.close-cart');
const cartItems = document.querySelector('.cart-items');
const cartTotalAmount = document.getElementById('cart-total-amount');

// Search functionality
const searchIcon = document.querySelector('.fa-search').parentElement;
const searchModal = document.createElement('div');
searchModal.className = 'search-modal';
searchModal.innerHTML = `
    <div class="search-container">
        <div class="search-header">
            <button class="back-button"><i class="fas fa-arrow-left"></i></button>
            <input type="text" id="search-input" placeholder="Search products...">
            <button class="close-search"><i class="fas fa-times"></i></button>
        </div>
        <div class="search-results"></div>
    </div>
`;

// Add search modal to body
document.body.appendChild(searchModal);

// Search event listeners
searchIcon.addEventListener('click', (e) => {
    e.preventDefault();
    searchModal.classList.add('active');
    document.getElementById('search-input').focus();
});

document.querySelector('.close-search').addEventListener('click', () => {
    searchModal.classList.remove('active');
});

document.querySelector('.back-button').addEventListener('click', () => {
    searchModal.classList.remove('active');
});

// Close search when clicking outside
document.addEventListener('click', (e) => {
    if (e.target === searchModal) {
        searchModal.classList.remove('active');
    }
});

// Search functionality
const searchInput = document.getElementById('search-input');
const searchResults = document.querySelector('.search-results');

searchInput.addEventListener('input', debounce(handleSearch, 300));

function handleSearch() {
    const query = searchInput.value.toLowerCase().trim();
    if (query.length < 2) {
        searchResults.innerHTML = '';
        return;
    }

    // Get all products from the page
    const products = Array.from(document.querySelectorAll('.product-card')).map(card => ({
        name: card.querySelector('h3').textContent,
        price: card.querySelector('.price').textContent,
        image: card.querySelector('img').src,
        link: card.querySelector('a').href
    }));

    // Filter products based on search query
    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(query)
    );

    // Display results
    displaySearchResults(filteredProducts);
}

function displaySearchResults(products) {
    if (products.length === 0) {
        searchResults.innerHTML = '<p>No products found</p>';
        return;
    }

    searchResults.innerHTML = products.map(product => `
        <a href="${product.link}" class="search-result-item">
            <img src="${product.image}" alt="${product.name}">
            <div class="search-result-info">
                <h3>${product.name}</h3>
                <p class="price">${product.price}</p>
            </div>
        </a>
    `).join('');
}

// Debounce function to limit search frequency
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

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
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.name}" style="width: 60px; height: 60px; object-fit: cover;">
            </div>
            <div class="cart-item-details">
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

// Product Detail Functionality
function loadProductDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('product');
    
    if (!productId) return;

    // Product data (in a real application, this would come from a database)
    const products = {
        'lv-neverfull-mm': {
            title: 'Louis Vuitton Neverfull MM',
            brand: 'Louis Vuitton',
            price: '₱125,830',
            description: 'The iconic Neverfull MM tote features a roomy interior and the signature Monogram canvas. Perfect for everyday use, this spacious tote comes with a removable pouch.',
            material: 'Monogram Canvas',
            dimensions: '32.0 x 29.0 x 17.0 cm',
            color: 'Monogram',
            condition: 'New',
            images: {
                main: 'images/products/lv-neverfull/main.png',
                thumbnails: [
                    'images/products/lv-neverfull/thumbnail1.png',
                    'images/products/lv-neverfull/thumbnail2.png',
                    'images/products/lv-neverfull/thumbnail3.png',
                    'images/products/lv-neverfull/thumbnail4.png'
                ]
            },
            relatedProducts: ['chanel-flap-medium', 'gucci-dionysus-small', 'prada-re-edition-2005']
        },
        'chanel-flap-medium': {
            title: 'Chanel Classic Flap Medium',
            brand: 'Chanel',
            price: '₱295,000',
            description: 'The iconic Chanel Classic Flap bag in medium size. Features the signature quilted leather and interwoven chain strap.',
            material: 'Lambskin Leather',
            dimensions: '25.5 x 16.0 x 7.5 cm',
            color: 'Black',
            condition: 'New',
            images: {
                main: 'images/products/chanel-flap/main.png',
                thumbnails: [
                    'images/products/chanel-flap/thumbnail1.png',
                    'images/products/chanel-flap/thumbnail2.png',
                    'images/products/chanel-flap/thumbnail3.png',
                    'images/products/chanel-flap/thumbnail4.png'
                ]
            },
            relatedProducts: ['lv-neverfull-mm', 'hermes-birkin-30', 'fendi-baguette']
        },
        'hermes-birkin-30': {
            title: 'Hermès Birkin 30',
            brand: 'Hermès',
            price: '₱650,000',
            description: 'The legendary Hermès Birkin 30 in Togo leather. A timeless investment piece that combines luxury and functionality.',
            material: 'Togo Leather',
            dimensions: '30.0 x 22.0 x 16.0 cm',
            color: 'Gold',
            condition: 'New',
            images: {
                main: 'images/products/hermes-birkin/main.png',
                thumbnails: [
                    'images/products/hermes-birkin/thumbnail1.png',
                    'images/products/hermes-birkin/thumbnail2.png',
                    'images/products/hermes-birkin/thumbnail3.png',
                    'images/products/hermes-birkin/thumbnail4.png'
                ]
            },
            relatedProducts: ['chanel-flap-medium', 'lv-neverfull-mm', 'gucci-dionysus-small']
        },
        'gucci-dionysus-small': {
            title: 'Gucci Dionysus Small',
            brand: 'Gucci',
            price: '₱85,000',
            description: 'The Gucci Dionysus small shoulder bag features the iconic tiger head closure and is crafted from GG Supreme canvas with leather trim.',
            material: 'GG Supreme Canvas',
            dimensions: '28.0 x 17.0 x 9.0 cm',
            color: 'Brown',
            condition: 'New',
            images: {
                main: 'images/products/gucci-dionysus/main.png',
                thumbnails: [
                    'images/products/gucci-dionysus/thumbnail1.png',
                    'images/products/gucci-dionysus/thumbnail2.png',
                    'images/products/gucci-dionysus/thumbnail3.png',
                    'images/products/gucci-dionysus/thumbnail4.png'
                ]
            },
            relatedProducts: ['prada-re-edition-2005', 'fendi-baguette', 'lv-neverfull-mm']
        },
        'prada-re-edition-2005': {
            title: 'Prada Re-Edition 2005',
            brand: 'Prada',
            price: '₱75,000',
            description: 'The Prada Re-Edition 2005 bag is a modern take on the iconic nylon bag, featuring a detachable shoulder strap and multiple pockets.',
            material: 'Nylon',
            dimensions: '26.0 x 16.5 x 6.5 cm',
            color: 'Black',
            condition: 'New',
            images: {
                main: 'images/products/prada-re-edition/main.png',
                thumbnails: [
                    'images/products/prada-re-edition/thumbnail1.png',
                    'images/products/prada-re-edition/thumbnail2.png',
                    'images/products/prada-re-edition/thumbnail3.png',
                    'images/products/prada-re-edition/thumbnail4.png'
                ]
            },
            relatedProducts: ['gucci-dionysus-small', 'fendi-baguette', 'chanel-flap-medium']
        },
        'fendi-baguette': {
            title: 'Fendi Baguette',
            brand: 'Fendi',
            price: '₱95,000',
            description: 'The iconic Fendi Baguette bag features the signature FF logo and is crafted from luxurious materials with a structured silhouette.',
            material: 'Leather',
            dimensions: '24.0 x 14.0 x 5.0 cm',
            color: 'Brown',
            condition: 'New',
            images: {
                main: 'images/products/fendi-baguette/main.png',
                thumbnails: [
                    'images/products/fendi-baguette/thumbnail1.png',
                    'images/products/fendi-baguette/thumbnail2.png',
                    'images/products/fendi-baguette/thumbnail3.png',
                    'images/products/fendi-baguette/thumbnail4.png'
                ]
            },
            relatedProducts: ['prada-re-edition-2005', 'gucci-dionysus-small', 'hermes-birkin-30']
        }
    };

    const product = products[productId];
    if (!product) return;

    // Update product details
    document.getElementById('product-title').textContent = product.title;
    document.getElementById('product-brand').textContent = product.brand;
    document.getElementById('product-price').textContent = product.price;
    document.getElementById('product-description').textContent = product.description;
    document.getElementById('product-material').textContent = product.material;
    document.getElementById('product-dimensions').textContent = product.dimensions;
    document.getElementById('product-color').textContent = product.color;
    document.getElementById('product-condition').textContent = product.condition;

    // Update images
    const mainImage = document.getElementById('main-product-image');
    mainImage.src = product.images.main;
    mainImage.alt = product.title;

    const thumbnails = document.querySelectorAll('.thumbnail');
    thumbnails.forEach((thumb, index) => {
        if (product.images.thumbnails[index]) {
            thumb.src = product.images.thumbnails[index];
            thumb.alt = `${product.title} - Thumbnail ${index + 1}`;
        }
    });

    // Add thumbnail click functionality
    thumbnails.forEach(thumb => {
        thumb.addEventListener('click', () => {
            // Remove active class from all thumbnails
            thumbnails.forEach(t => t.classList.remove('active'));
            // Add active class to clicked thumbnail
            thumb.classList.add('active');
            // Update main image
            mainImage.src = thumb.src;
        });
    });

    // Load related products
    loadRelatedProducts(product.relatedProducts, products);

    // Handle quantity selector
    const quantityInput = document.querySelector('.quantity-input');
    const minusBtn = document.querySelector('.quantity-btn.minus');
    const plusBtn = document.querySelector('.quantity-btn.plus');

    minusBtn.addEventListener('click', () => {
        const currentValue = parseInt(quantityInput.value);
        if (currentValue > 1) {
            quantityInput.value = currentValue - 1;
        }
    });

    plusBtn.addEventListener('click', () => {
        const currentValue = parseInt(quantityInput.value);
        quantityInput.value = currentValue + 1;
    });

    quantityInput.addEventListener('change', () => {
        const value = parseInt(quantityInput.value);
        if (value < 1) {
            quantityInput.value = 1;
        }
    });

    // Handle add to cart button
    const addToCartBtn = document.querySelector('.add-to-cart-btn');
    addToCartBtn.addEventListener('click', () => {
        const quantity = parseInt(quantityInput.value);
        const productData = {
            name: product.title,
            price: product.price,
            quantity: quantity,
            image: product.images.main
        };
        
        // Add to cart multiple times based on quantity
        for (let i = 0; i < quantity; i++) {
            addToCart(productData);
        }
        
        // Show notification
        showNotification(`Added ${quantity} ${product.title} to cart`);
        
        // Reset quantity to 1
        quantityInput.value = 1;
    });
}

// Function to load related products
function loadRelatedProducts(relatedProductIds, products) {
    const relatedProductsContainer = document.querySelector('.related-products .product-grid');
    if (!relatedProductsContainer) return;

    relatedProductsContainer.innerHTML = relatedProductIds.map(id => {
        const product = products[id];
        if (!product) return '';

        return `
            <div class="product-card">
                <a href="product-detail.html?product=${id}">
                    <img src="${product.images.main}" alt="${product.title}">
                    <div class="product-info">
                        <h3>${product.title}</h3>
                        <p class="price">${product.price}</p>
                    </div>
                </a>
                <button class="add-to-cart">Add to Cart</button>
            </div>
        `;
    }).join('');

    // Add event listeners to the new "Add to Cart" buttons
    relatedProductsContainer.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function(e) {
            const productCard = e.target.closest('.product-card');
            const productName = productCard.querySelector('h3').textContent;
            const productPrice = productCard.querySelector('.price').textContent;
            
            addToCart({
                name: productName,
                price: productPrice
            });
            
            showNotification('Added to cart');
        });
    });
}

// Initialize product details when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    loadProductDetails();
    updateCartCount();
    updateCartDisplay();
    updateCartTotal();
});

// Burger Menu Functionality
const burgerMenu = document.querySelector('.burger-menu');
const navContainer = document.querySelector('.nav-container');
let navOverlay;

// Create overlay element
function createOverlay() {
    navOverlay = document.createElement('div');
    navOverlay.className = 'nav-overlay';
    document.body.appendChild(navOverlay);
}

// Initialize overlay
createOverlay();

// Toggle menu
function toggleMenu() {
    burgerMenu.classList.toggle('active');
    navContainer.classList.toggle('active');
    navOverlay.classList.toggle('active');
    document.body.style.overflow = navContainer.classList.contains('active') ? 'hidden' : '';
}

// Close menu
function closeMenu() {
    burgerMenu.classList.remove('active');
    navContainer.classList.remove('active');
    navOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

// Event listeners for burger menu
burgerMenu.addEventListener('click', toggleMenu);
navOverlay.addEventListener('click', closeMenu);

// Handle navigation links
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', (e) => {
        // Only prevent default for hash links
        if (link.getAttribute('href').startsWith('#')) {
            e.preventDefault();
        }
        // Close menu after a short delay to allow navigation
        setTimeout(closeMenu, 100);
    });
});

// Handle icon clicks
document.querySelectorAll('.nav-icons a').forEach(icon => {
    icon.addEventListener('click', (e) => {
        // Only prevent default for hash links
        if (icon.getAttribute('href').startsWith('#')) {
            e.preventDefault();
        }
        // Close menu after a short delay
        setTimeout(closeMenu, 100);
    });
});

// Handle cart icon click
document.getElementById('cart-icon').addEventListener('click', (e) => {
    e.preventDefault();
    // Close menu if it's open
    if (navContainer.classList.contains('active')) {
        closeMenu();
    }
    // Open cart modal
    cartModal.classList.add('active');
});

// Handle search icon click
document.querySelector('.fa-search').parentElement.addEventListener('click', (e) => {
    e.preventDefault();
    // Close menu if it's open
    if (navContainer.classList.contains('active')) {
        closeMenu();
    }
    // Open search modal
    searchModal.classList.add('active');
    document.getElementById('search-input').focus();
});

// Close menu when screen is resized 
window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && navContainer.classList.contains('active')) {
        closeMenu();
    }
});

// Handle checkout button click
document.querySelector('.checkout-button').addEventListener('click', () => {
    // Save cart data to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    // Redirect to payment page
    window.location.href = 'payment.html';
});

// Payment page functionality
function loadPaymentPage() {
    const paymentItems = document.getElementById('payment-items');
    const paymentTotalAmount = document.getElementById('payment-total-amount');
    const paymentForm = document.getElementById('payment-form');
    const creditCardDetails = document.getElementById('credit-card-details');
    const gcashDetails = document.getElementById('gcash-details');

    // Load cart data from localStorage
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Display cart items
    if (paymentItems) {
        if (cart.length === 0) {
            paymentItems.innerHTML = '<p>Your cart is empty</p>';
        } else {
            paymentItems.innerHTML = cart.map(item => `
                <div class="payment-item">
                    <div class="payment-item-image">
                        <img src="${item.image}" alt="${item.name}">
                    </div>
                    <div class="payment-item-details">
                        <h4>${item.name}</h4>
                        <p>${item.price}</p>
                    </div>
                </div>
            `).join('');
        }
    }

    // Update total amount
    if (paymentTotalAmount) {
        const total = cart.reduce((sum, item) => {
            const price = parseFloat(item.price.replace('₱', '').replace(',', ''));
            return sum + price;
        }, 0);
        paymentTotalAmount.textContent = `₱${total.toLocaleString()}`;
    }

    // Handle payment method selection
    const paymentMethods = document.querySelectorAll('input[name="payment-method"]');
    paymentMethods.forEach(method => {
        method.addEventListener('change', (e) => {
            if (e.target.value === 'credit-card') {
                creditCardDetails.style.display = 'block';
                gcashDetails.style.display = 'none';
            } else {
                creditCardDetails.style.display = 'none';
                gcashDetails.style.display = 'block';
            }
        });
    });

    // Handle form submission
    if (paymentForm) {
        paymentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Show loading state
            const payButton = paymentForm.querySelector('.pay-button');
            payButton.textContent = 'Processing...';
            payButton.disabled = true;

            // Simulate payment processing
            setTimeout(() => {
                // Clear cart
                localStorage.removeItem('cart');
                
                // Show success message
                alert('Payment successful! Thank you for your purchase.');
                
                // Redirect to home page
                window.location.href = 'main.html';
            }, 2000);
        });
    }
}

// Initialize payment page if on payment.html
if (window.location.pathname.includes('payment.html')) {
    loadPaymentPage();
}
