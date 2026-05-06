document.addEventListener('DOMContentLoaded', () => {
    // --- Announcement Bar Logic ---
    const messages = [
        "🤍 Un aroma diferente para tu día a día 🤍",
        "✨ Deja lo de siempre, prueba algo diferente ✨"
    ];
    let msgIndex = 0;
    const announcementText = document.getElementById('announcement-text');
    
    // Change message every 5 seconds (matching CSS animation)
    setInterval(() => {
        msgIndex = (msgIndex + 1) % messages.length;
        announcementText.innerText = messages[msgIndex];
    }, 5000);

    // --- Cart functionality ---
    const cartBtn = document.getElementById('cart-btn');
    const closeCartBtn = document.getElementById('close-cart');
    const cartSidebar = document.getElementById('cart-sidebar');
    const cartOverlay = document.getElementById('cart-overlay');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartCountEl = document.getElementById('cart-count');
    const totalPriceEl = document.getElementById('total-price');

    let cart = [];

    function openCart() {
        cartSidebar.classList.add('active');
        cartOverlay.classList.add('active');
    }

    function closeCart() {
        cartSidebar.classList.remove('active');
        cartOverlay.classList.remove('active');
    }

    cartBtn.addEventListener('click', openCart);
    closeCartBtn.addEventListener('click', closeCart);
    cartOverlay.addEventListener('click', closeCart);

    function updateCartUI() {
        cartItemsContainer.innerHTML = '';
        let total = 0;
        let count = 0;

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p style="text-align:center; color:var(--text-light); margin-top:2rem;">Tu carrito está vacío.</p>';
        } else {
            cart.forEach((item, index) => {
                total += item.price * item.quantity;
                count += item.quantity;

                const itemEl = document.createElement('div');
                itemEl.className = 'cart-item';
                itemEl.innerHTML = `
                    <img src="${item.img[0]}" alt="${item.name}">
                    <div style="flex:1;">
                        <div style="font-weight: 600; font-size: 0.9rem; margin-bottom: 0.3rem;">${item.name}</div>
                        <div style="color: var(--color-blue); font-weight: 800;">$${item.price.toLocaleString('es-CO')} x ${item.quantity}</div>
                        <button class="remove-item" data-index="${index}">Eliminar</button>
                    </div>
                `;
                cartItemsContainer.appendChild(itemEl);
            });
        }

        cartCountEl.innerText = count;
        totalPriceEl.innerText = total.toLocaleString('es-CO');

        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = e.target.getAttribute('data-index');
                cart.splice(index, 1);
                updateCartUI();
            });
        });
    }

    // --- Toast Notifications ---
    const toastContainer = document.getElementById('toast-container');
    function showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `<span class="icon">✓</span> <span>${message}</span>`;
        toastContainer.appendChild(toast);
        
        // Remove toast after 3 seconds
        setTimeout(() => {
            toast.style.animation = 'fadeOutToast 0.4s cubic-bezier(0.25, 0.8, 0.25, 1) forwards';
            setTimeout(() => {
                toast.remove();
            }, 400);
        }, 3000);
    }

    // --- Modal Functionality ---
    const modalOverlay = document.getElementById('product-modal');
    const closeModalBtn = document.getElementById('close-modal');
    
    const modalImg = document.getElementById('modal-img');
    const modalThumbnails = document.querySelector('.modal-thumbnails');
    const modalTitle = document.getElementById('modal-title');
    const modalPrice = document.getElementById('modal-price');
    const modalDesc = document.getElementById('modal-desc');
    const modalQuantity = document.getElementById('modal-quantity');
    const qtyMinus = document.getElementById('qty-minus');
    const qtyPlus = document.getElementById('qty-plus');
    const modalAddBtn = document.getElementById('modal-add-btn');
    
    let currentProduct = null;

    // Función Global para abrir el modal
    window.openProductModal = function(id, name, price, imgs, desc) {
        currentProduct = { id, name, price, img: imgs };
        
        modalImg.src = imgs[0];
        modalTitle.innerText = name;
        modalPrice.innerText = '$' + price.toLocaleString('es-CO');
        modalDesc.innerText = desc;
        modalQuantity.value = 1;
        
        // Generate thumbnails
        modalThumbnails.innerHTML = '';
        if(imgs.length > 1) {
            imgs.forEach((imgSrc, index) => {
                const thumb = document.createElement('img');
                thumb.src = imgSrc;
                thumb.className = index === 0 ? 'modal-thumb active' : 'modal-thumb';
                thumb.onclick = () => {
                    modalImg.src = imgSrc;
                    document.querySelectorAll('.modal-thumb').forEach(t => t.classList.remove('active'));
                    thumb.classList.add('active');
                };
                modalThumbnails.appendChild(thumb);
            });
        }
        
        modalOverlay.classList.add('active');
    };

    function closeProductModal() {
        modalOverlay.classList.remove('active');
    }
    
    closeModalBtn.addEventListener('click', closeProductModal);
    modalOverlay.addEventListener('click', (e) => {
        if(e.target === modalOverlay) closeProductModal();
    });

    qtyMinus.addEventListener('click', () => {
        let val = parseInt(modalQuantity.value);
        if(val > 1) modalQuantity.value = val - 1;
    });
    
    qtyPlus.addEventListener('click', () => {
        let val = parseInt(modalQuantity.value);
        if(val < 99) modalQuantity.value = val + 1;
    });

    modalAddBtn.addEventListener('click', () => {
        if(!currentProduct) return;
        
        const quantityToAdd = parseInt(modalQuantity.value);
        const existingItem = cart.find(item => item.id === currentProduct.id);

        if (existingItem) {
            existingItem.quantity += quantityToAdd;
        } else {
            cart.push({ ...currentProduct, quantity: quantityToAdd });
        }

        updateCartUI();
        
        showToast('Producto añadido al carrito');
        closeProductModal();
        openCart();
    });

    // --- FAQ Accordion ---
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const item = question.parentElement;
            const answer = item.querySelector('.faq-answer');
            
            // Cerrar otros abiertos
            document.querySelectorAll('.faq-item').forEach(otherItem => {
                if(otherItem !== item) {
                    otherItem.classList.remove('active');
                    otherItem.querySelector('.faq-answer').style.maxHeight = null;
                }
            });

            // Toggle actual
            item.classList.toggle('active');
            if (item.classList.contains('active')) {
                answer.style.maxHeight = answer.scrollHeight + "px";
            } else {
                answer.style.maxHeight = null;
            }
        });
    });

    // --- Loading Screen ---
    const loadingScreen = document.getElementById('loading-screen');
    if(loadingScreen) {
        setTimeout(() => {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.remove();
                
                // Show Welcome Modal after loading
                setTimeout(() => {
                    const welcomeModal = document.getElementById('welcome-modal');
                    if(welcomeModal) welcomeModal.classList.add('active');
                }, 1000);
            }, 600);
        }, 1500);
    }

    // --- Welcome & Profile Modals ---
    const profileBtn = document.getElementById('profile-btn');
    const profileModal = document.getElementById('profile-modal');
    const wishlistBtn = document.getElementById('wishlist-btn');
    
    if(profileBtn && profileModal) {
        profileBtn.addEventListener('click', () => {
            if(typeof renderWishlistInProfile === 'function') renderWishlistInProfile();
            profileModal.classList.add('active');
        });
    }

    if(wishlistBtn && profileModal) {
        wishlistBtn.addEventListener('click', () => {
            if(typeof renderWishlistInProfile === 'function') renderWishlistInProfile();
            profileModal.classList.add('active');
        });
    }

    // Forms prevent default
    document.getElementById('welcome-form')?.addEventListener('submit', (e) => {
        e.preventDefault();
        showToast('¡Gracias por unirte!');
        document.getElementById('welcome-modal').classList.remove('active');
    });
    document.getElementById('login-form')?.addEventListener('submit', (e) => {
        e.preventDefault();
        showToast('Sesión iniciada');
        profileModal.classList.remove('active');
    });
    document.getElementById('register-form')?.addEventListener('submit', (e) => {
        e.preventDefault();
        showToast('¡Registro exitoso!');
        profileModal.classList.remove('active');
    });

    // --- Wishlist Logic ---
    let wishlist = JSON.parse(localStorage.getItem('zabal_wishlist')) || [];
    
    window.toggleWishlist = function(productId) {
        const heartIcon = document.getElementById('heart-' + productId);
        if (wishlist.includes(productId)) {
            wishlist = wishlist.filter(id => id !== productId);
            heartIcon?.classList.remove('active');
            showToast('Eliminado de tu lista de deseos');
        } else {
            wishlist.push(productId);
            heartIcon?.classList.add('active');
            showToast('Agregado a tu lista de deseos');
        }
        localStorage.setItem('zabal_wishlist', JSON.stringify(wishlist));
    };

    // Initialize wishlist icons
    wishlist.forEach(id => {
        const icon = document.getElementById('heart-' + id);
        if(icon) icon.classList.add('active');
    });

    // --- Render Wishlist in Profile ---
    function renderWishlistInProfile() {
        const wishlistContainer = document.getElementById('profile-wishlist-items');
        if (!wishlistContainer) return;

        if (wishlist.length === 0) {
            wishlistContainer.innerHTML = '<p style="color: var(--text-light); font-size: 0.9rem;">No tienes productos guardados aún.</p>';
            return;
        }

        wishlistContainer.innerHTML = '';
        wishlist.forEach(id => {
            // Mock fetching product details (in a real app, you'd fetch from a database)
            let productName = "Producto guardado";
            let productPrice = "$10.000";
            let productImg = "";
            if (id === '1') {
                productName = "Pañitos de Vainilla";
                productPrice = "$10.000";
                productImg = "Imagenes/panito-vainilla-1.png";
            }

            const itemEl = document.createElement('div');
            itemEl.style.display = 'flex';
            itemEl.style.alignItems = 'center';
            itemEl.style.gap = '1rem';
            itemEl.style.marginBottom = '1rem';
            itemEl.style.textAlign = 'left';
            itemEl.innerHTML = `
                <img src="${productImg}" alt="${productName}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 8px; border: 1px solid var(--border-color);">
                <div style="flex: 1;">
                    <h4 style="font-size: 0.95rem; margin-bottom: 0.2rem;">${productName}</h4>
                    <p style="color: var(--color-blue); font-weight: bold; font-size: 0.9rem;">${productPrice}</p>
                </div>
                <button onclick="toggleWishlist('${id}'); renderWishlistInProfile();" style="background: none; border: none; color: #ff4d4f; cursor: pointer; text-decoration: underline; font-size: 0.8rem;">Quitar</button>
            `;
            wishlistContainer.appendChild(itemEl);
        });
    }

    // Render it when profile modal opens
    if (profileBtn) {
        profileBtn.addEventListener('click', renderWishlistInProfile);
    }

    // --- Feedback & Admin Logic ---
    const feedbackForm = document.getElementById('feedback-form');
    const feedbackText = document.getElementById('feedback-text');
    let comments = JSON.parse(localStorage.getItem('zabal_feedback')) || [];

    feedbackForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        if(feedbackText.value.trim() === '') return;
        
        comments.push({ date: new Date().toLocaleDateString(), text: feedbackText.value });
        localStorage.setItem('zabal_feedback', JSON.stringify(comments));
        
        showToast('¡Gracias por tus comentarios!');
        feedbackText.value = '';
    });

    // Admin trigger
    const adminTrigger = document.getElementById('admin-trigger');
    const adminComments = document.getElementById('admin-comments');
    const commentsList = document.getElementById('comments-list');

    if (adminTrigger && adminComments && commentsList) {
        adminTrigger.addEventListener('dblclick', () => {
            const code = prompt('Ingrese el código de administrador:');
            if (code === '1982') {
                adminComments.style.display = 'block';
                commentsList.innerHTML = comments.length === 0 ? '<p>No hay comentarios aún.</p>' : '';
                comments.forEach(c => {
                    commentsList.innerHTML += `
                        <div style="background: var(--bg-white); padding: 1rem; border-radius: 10px; border: 1px solid #eee;">
                            <small style="color: var(--color-purple); font-weight: bold;">${c.date}</small>
                            <p style="margin-top: 0.5rem; color: var(--text-main);">${c.text}</p>
                        </div>
                    `;
                });
            } else if(code !== null) {
                alert('Código incorrecto');
            }
        });
    }
});
