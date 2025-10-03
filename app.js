// // ---------------------------
// // Particles background
// // ---------------------------
// function particles() {
//   const c = document.getElementById('bg');
//   if (!c) return;
//   const ctx = c.getContext('2d');
//   const DPR = window.devicePixelRatio || 1;
//   let W, H;

//   function resize() {
//     W = c.width = innerWidth * DPR;
//     H = c.height = innerHeight * DPR;
//     ctx.scale(DPR, DPR);
//   }
//   resize();
//   addEventListener('resize', resize);

//   const P = Array.from({ length: 80 }, () => ({
//     x: Math.random() * innerWidth,
//     y: Math.random() * innerHeight,
//     r: Math.random() * 2.2 + 0.8,
//     dx: (Math.random() - 0.5) * 0.2,
//     dy: (Math.random() - 0.5) * 0.2
//   }));

//   function tick() {
//     ctx.clearRect(0, 0, innerWidth, innerHeight);
//     for (const p of P) {
//       p.x += p.dx;
//       p.y += p.dy;
//       if (p.x < 0 || p.x > innerWidth) p.dx *= -1;
//       if (p.y < 0 || p.y > innerHeight) p.dy *= -1;
//       ctx.beginPath();
//       ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
//       ctx.fillStyle = 'rgba(64, 65, 8, 0.21)';
//       ctx.fill();
//     }
//     requestAnimationFrame(tick);
//   }
//   tick();
// }

// // ---------------------------
// // Forms (Login / Signup / Delivery / Store)
// // ---------------------------
// function setupForms() {
//   const byId = id => document.getElementById(id);

//   // Login
//   if (byId('loginForm')) {
//     byId('loginForm').addEventListener('submit', e => {
//       e.preventDefault();
//       const email = e.target.email.value;
//       const pass = e.target.password.value;
//       const users = JSON.parse(localStorage.getItem('pm:users') || '[]');
//       const ok = users.find(u => u.email === email && u.password === pass);
//       if (ok) {
//         toast('Welcome back! Logged in ✅');
//         localStorage.setItem('pm:currentUser', JSON.stringify({ ...ok, type: 'user' }));
//         updateNavbar();
//         loadProfile();
//         window.location.href = "profile.html"; // redirect
//       } else {
//         toast('Invalid credentials. Try signing up.', true);
//       }
//     });
//   }

//   // Signup
//   if (byId('signupForm')) {
//     byId('signupForm').addEventListener('submit', e => {
//       e.preventDefault();
//       const data = Object.fromEntries(new FormData(e.target).entries());
//       const users = JSON.parse(localStorage.getItem('pm:users') || '[]');
//       users.push(data);
//       localStorage.setItem('pm:users', JSON.stringify(users));
//       localStorage.setItem('pm:currentUser', JSON.stringify({ ...data, type: 'user' }));
//       toast('Account created 🎉 Welcome!');
//       updateNavbar();
//       loadProfile();
//       window.location.href = "profile.html";
//     });
//   }

//   // Delivery register
//   if (byId('deliveryForm')) {
//     byId('deliveryForm').addEventListener('submit', e => {
//       e.preventDefault();
//       const data = Object.fromEntries(new FormData(e.target).entries());
//       const list = JSON.parse(localStorage.getItem('pm:delivery') || '[]');
//       list.push({ ...data, createdAt: Date.now() });
//       localStorage.setItem('pm:delivery', JSON.stringify(list));
//       localStorage.setItem('pm:currentUser', JSON.stringify({ ...data, type: 'delivery' }));
//       toast('Delivery partner registered 🚴');
//       updateNavbar();
//       loadProfile();
//       window.location.href = "profile.html";
//     });
//   }

//   // Store register
//   if (byId('storeForm')) {
//     byId('storeForm').addEventListener('submit', e => {
//       e.preventDefault();
//       const data = Object.fromEntries(new FormData(e.target).entries());
//       const list = JSON.parse(localStorage.getItem('pm:stores') || '[]');
//       list.push({ ...data, createdAt: Date.now() });
//       localStorage.setItem('pm:stores', JSON.stringify(list));
//       localStorage.setItem('pm:currentUser', JSON.stringify({ ...data, type: 'store' }));
//       toast('Store registered 🏪');
//       updateNavbar();
//       loadProfile();
//       window.location.href = "profile.html";
//     });
//   }
// }

// // ---------------------------
// // Navbar
// // ---------------------------
// function updateNavbar() {
//   const user = JSON.parse(localStorage.getItem('pm:currentUser'));
//   document.querySelectorAll('.guestOnly').forEach(el => el.style.display = user ? 'none' : 'inline-block');
//   document.querySelectorAll('.authOnly').forEach(el => el.style.display = user ? 'inline-block' : 'none');
// }

// // ---------------------------
// // Profile
// // ---------------------------
// function loadProfile() {
//   const user = JSON.parse(localStorage.getItem('pm:currentUser'));
//   const box = document.getElementById('profileDetails');
//   if (!box) return;
//   if (user) {
//     let html = `<p><strong>Name:</strong> ${user.name || user.storeName}</p>`;
//     if (user.type === 'store') {
//       html += `<p><strong>Owner:</strong> ${user.owner}</p>`;
//       html += `<p><strong>Phone:</strong> ${user.phone}</p>`;
//       html += `<p><strong>Address:</strong> ${user.address}</p>`;
//     } else if (user.type === 'delivery') {
//       html += `<p><strong>Phone:</strong> ${user.phone}</p>`;
//       html += `<p><strong>City:</strong> ${user.city}</p>`;
//       html += `<p><strong>Vehicle:</strong> ${user.vehicle}</p>`;
//     } else {
//       html += `<p><strong>Email:</strong> ${user.email}</p>`;
//       html += `<p><strong>Phone:</strong> ${user.phone}</p>`;
//     }
//     box.innerHTML = html;
//   } else {
//     box.innerHTML = `<p>No profile data.</p>`;
//   }
// }

// // ---------------------------
// // Logout
// // ---------------------------
// document.addEventListener('DOMContentLoaded', () => {
//   const logoutBtn = document.getElementById('logoutBtn');
//   if (logoutBtn) {
//     logoutBtn.addEventListener('click', () => {
//       localStorage.removeItem('pm:currentUser');
//       toast("Logged out 👋");
//       updateNavbar();
//       window.location.href = "home.html"; // go back home
//     });
//   }
// });

// // ---------------------------
// // Toast
// // ---------------------------
// function toast(msg, danger = false) {
//   const wrap = document.getElementById('toast');
//   if (!wrap) return;
//   const el = document.createElement('div');
//   el.className = 'toast';
//   el.textContent = msg;
//   if (danger) el.style.borderColor = 'rgba(255,99,99,0.6)';
//   wrap.appendChild(el);
//   setTimeout(() => {
//     el.style.opacity = '0';
//     setTimeout(() => el.remove(), 300);
//   }, 2300);
// }

// // ---------------------------
// // Main Carousel
// // ---------------------------
// function setupMainCarousel() {
//   const slides = document.querySelectorAll('.carousel-slide');
//   const dots = document.querySelectorAll('.carousel-dots .dot');
//   const prevBtn = document.getElementById('prev-btn');
//   const nextBtn = document.getElementById('next-btn');

//   let currentSlide = 0;

//   function showSlide(index) {
//     slides.forEach(slide => slide.classList.remove('active'));
//     dots.forEach(dot => dot.classList.remove('active'));
//     if (slides[index]) slides[index].classList.add('active');
//     if (dots[index]) dots[index].classList.add('active');
//   }

//   function nextSlide() {
//     currentSlide = (currentSlide + 1) % slides.length;
//     showSlide(currentSlide);
//   }

//   function prevSlide() {
//     currentSlide = (currentSlide - 1 + slides.length) % slides.length;
//     showSlide(currentSlide);
//   }

//   if (nextBtn) nextBtn.addEventListener('click', nextSlide);
//   if (prevBtn) prevBtn.addEventListener('click', prevSlide);

//   dots.forEach((dot, index) => {
//     dot.addEventListener('click', () => {
//       currentSlide = index;
//       showSlide(currentSlide);
//     });
//   });

//   if (slides.length > 0) showSlide(currentSlide);
// }

// // ---------------------------
// // Theme & Menu Toggle
// // ---------------------------
// function setupUI() {
//   const themeToggleBtn = document.getElementById('themeToggle');
//   const menuToggleBtn = document.getElementById('menuToggle');
//   const navLinks = document.querySelector('#navbar .links');

//   if (themeToggleBtn) {
//   themeToggleBtn.addEventListener('click', () => {
//     document.body.classList.toggle('dark-mode');

//     // emoji change
//     if (document.body.classList.contains('dark-mode')) {
//       themeToggleBtn.textContent = "☀️"; // Light mode icon
//     } else {
//       themeToggleBtn.textContent = "🌙"; // Dark mode icon
//     }
//   });
// }

//   if (menuToggleBtn && navLinks) {
//     menuToggleBtn.addEventListener('click', () => {
//       navLinks.classList.toggle('show');
//     });
//   }
// }

// // ---------------------------
// // Init
// // ---------------------------
// document.addEventListener('DOMContentLoaded', () => {
//   particles();
//   setupForms();
//   updateNavbar();
//   loadProfile();
//   setupMainCarousel();
//   setupUI();
// });
// A self-executing function to avoid polluting the global scope
(function() {

    // =========================================================
    // 1. Theme Toggle Functionality (Dark/Light Mode)
    // =========================================================
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;
    const currentTheme = localStorage.getItem('theme');

    // Load saved theme on page load
    if (currentTheme) {
        body.classList.remove('light-mode', 'dark-mode');
        body.classList.add(currentTheme);
        // Change button icon based on the current theme
        themeToggle.textContent = currentTheme === 'dark-mode' ? '☀️' : '🌙';
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            if (body.classList.contains('light-mode')) {
                // Switch to Dark Mode
                body.classList.remove('light-mode');
                body.classList.add('dark-mode');
                localStorage.setItem('theme', 'dark-mode');
                themeToggle.textContent = '☀️';
            } else {
                // Switch to Light Mode
                body.classList.remove('dark-mode');
                body.classList.add('light-mode');
                localStorage.setItem('theme', 'light-mode');
                themeToggle.textContent = '🌙';
            }
        });
    }

    // =========================================================
    // 2. Mobile Menu Toggle Functionality
    // =========================================================
    const menuToggle = document.getElementById('menuToggle');
    // Assuming the navigation links are inside a container with class 'links' inside #navbar
    const navbarLinks = document.querySelector('#navbar .links');

 // A self-executing function to avoid polluting the global scope
(function() {
    // ... (baaki ka code wahi rahega) ...

    // =========================================================
    // 2. Mobile Menu Toggle Functionality
    // =========================================================
    const menuToggle = document.getElementById('menuToggle');
    const navbarLinks = document.querySelector('#navbar .links');

    if (menuToggle && navbarLinks) {
        menuToggle.addEventListener('click', () => {
            // Toggle a class to show/hide the menu
            navbarLinks.classList.toggle('nav-open');
            // Change icon
            menuToggle.textContent = navbarLinks.classList.contains('nav-open') ? '✕' : '☰';
        });

        // Close menu when a navigation link is clicked
        navbarLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navbarLinks.classList.remove('nav-open');
                menuToggle.textContent = '☰';
            });
        });
    }

    // ... (baaki ka code wahi rahega) ...
})();

    // =========================================================
    // 3. Active Navigation Link Highlighting
    // =========================================================
    const currentPath = window.location.pathname;
    // Extract filename (e.g., 'index.html', 'about.html')
    const currentFile = currentPath.substring(currentPath.lastIndexOf('/') + 1) || 'index.html';

    document.querySelectorAll('#navbar .links a').forEach(link => {
        const linkHref = link.getAttribute('href');
        // Check if the link's href matches the current file
        if (linkHref && linkHref === currentFile) {
            link.classList.add('active'); // Add 'active' class for styling
        }
        // Special case: if on index2.html, highlight index.html (assuming index2 is post-login index)
        if (currentFile === 'index2.html' && linkHref === 'index.html') {
             link.classList.add('active');
        }
    });

    // =========================================================
    // 4. Simple Router Utility (For `onclick="Router.go('home')"`)
    // =========================================================
    window.Router = {
        go: function(route) {
            const routes = {
                'home': 'index.html',
                'about': 'about.html',
                'login': 'login.html',
                'signup': 'signup.html',
                'profile': 'profile.html',
                'store': 'store.html',
                'ai': 'ai.html',
                'pincodesearch': 'pincodetosearch.html'
            };

            const targetPage = routes[route.toLowerCase()];
            if (targetPage) {
                window.location.href = targetPage;
            } else {
                console.warn(`Router: Route not found for '${route}'.`);
                // Fallback
                window.location.href = 'index.html';
            }
        }
    };


    // =========================================================
    // 5. Form Handling Placeholders (You must add your server logic here)
    // =========================================================

    // A. Login Form (Assumes your login form has id="loginForm")
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Stop default form submission

            // **********************************************
            // TODO: Yahan par aapko apni **API call (fetch)** aur **Login logic** add karna hoga.
            // Safal login hone par, user ko index2.html par redirect karein.
            // **********************************************
             console.log('Login form submitted. Add API call logic here.');
             // Example redirect: window.location.href = 'index2.html';
        });
    }

    // B. Pincode Search Form (Assumes your form has id="pincodeForm")
    const pincodeForm = document.getElementById('pincodeForm');
    if (pincodeForm) {
        pincodeForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Stop default form submission

            const pincodeInput = document.getElementById('pincodeInput'); // Assuming input has id="pincodeInput"
            const pincode = pincodeInput ? pincodeInput.value : null;

            if (pincode && pincode.length === 6 && !isNaN(pincode)) {
                // **********************************************
                // TODO: Yahan par aapko pincode ko API par bhejkar **search results** laane ka logic add karna hoga.
                // **********************************************
                console.log(`Searching for Pincode: ${pincode}`);
            } else {
                alert('Kripya ek valid 6-digit pincode daalein.');
            }
        });
    }

    // =========================================================
    // 6. Canvas Background Placeholder (For #bg element)
    // =========================================================
    const canvas = document.getElementById('bg');
    if (canvas) {
        // **********************************************
        // TODO: Agar aapne koi background animation (jaise particles ya stars) banaya hai,
        // toh uska JavaScript code yahan add karein.
        // **********************************************
    }

})();
