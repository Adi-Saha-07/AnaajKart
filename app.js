// ---------------------------
// Particles background
// ---------------------------
function particles() {
  const c = document.getElementById('bg');
  if (!c) return;
  const ctx = c.getContext('2d');
  const DPR = window.devicePixelRatio || 1;
  let W, H;

  function resize() {
    W = c.width = innerWidth * DPR;
    H = c.height = innerHeight * DPR;
    ctx.scale(DPR, DPR);
  }
  resize();
  addEventListener('resize', resize);

  const P = Array.from({ length: 80 }, () => ({
    x: Math.random() * innerWidth,
    y: Math.random() * innerHeight,
    r: Math.random() * 2.2 + 0.8,
    dx: (Math.random() - 0.5) * 0.2,
    dy: (Math.random() - 0.5) * 0.2
  }));

  function tick() {
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    for (const p of P) {
      p.x += p.dx;
      p.y += p.dy;
      if (p.x < 0 || p.x > innerWidth) p.dx *= -1;
      if (p.y < 0 || p.y > innerHeight) p.dy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(252, 255, 89, 0.14)';
      ctx.fill();
    }
    requestAnimationFrame(tick);
  }
  tick();
}

// ---------------------------
// Forms (Login / Signup / Delivery / Store)
// ---------------------------
function setupForms() {
  const byId = id => document.getElementById(id);

  // Login
  if (byId('loginForm')) {
    byId('loginForm').addEventListener('submit', e => {
      e.preventDefault();
      const email = e.target.email.value;
      const pass = e.target.password.value;
      const users = JSON.parse(localStorage.getItem('pm:users') || '[]');
      const ok = users.find(u => u.email === email && u.password === pass);
      if (ok) {
        toast('Welcome back! Logged in ✅');
        localStorage.setItem('pm:currentUser', JSON.stringify({ ...ok, type: 'user' }));
        updateNavbar();
        loadProfile();
        window.location.href = "profile.html"; // redirect
      } else {
        toast('Invalid credentials. Try signing up.', true);
      }
    });
  }

  // Signup
  if (byId('signupForm')) {
    byId('signupForm').addEventListener('submit', e => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(e.target).entries());
      const users = JSON.parse(localStorage.getItem('pm:users') || '[]');
      users.push(data);
      localStorage.setItem('pm:users', JSON.stringify(users));
      localStorage.setItem('pm:currentUser', JSON.stringify({ ...data, type: 'user' }));
      toast('Account created 🎉 Welcome!');
      updateNavbar();
      loadProfile();
      window.location.href = "profile.html";
    });
  }

  // Delivery register
  if (byId('deliveryForm')) {
    byId('deliveryForm').addEventListener('submit', e => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(e.target).entries());
      const list = JSON.parse(localStorage.getItem('pm:delivery') || '[]');
      list.push({ ...data, createdAt: Date.now() });
      localStorage.setItem('pm:delivery', JSON.stringify(list));
      localStorage.setItem('pm:currentUser', JSON.stringify({ ...data, type: 'delivery' }));
      toast('Delivery partner registered 🚴');
      updateNavbar();
      loadProfile();
      window.location.href = "profile.html";
    });
  }

  // Store register
  if (byId('storeForm')) {
    byId('storeForm').addEventListener('submit', e => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(e.target).entries());
      const list = JSON.parse(localStorage.getItem('pm:stores') || '[]');
      list.push({ ...data, createdAt: Date.now() });
      localStorage.setItem('pm:stores', JSON.stringify(list));
      localStorage.setItem('pm:currentUser', JSON.stringify({ ...data, type: 'store' }));
      toast('Store registered 🏪');
      updateNavbar();
      loadProfile();
      window.location.href = "profile.html";
    });
  }
}

// ---------------------------
// Navbar
// ---------------------------
function updateNavbar() {
  const user = JSON.parse(localStorage.getItem('pm:currentUser'));
  document.querySelectorAll('.guestOnly').forEach(el => el.style.display = user ? 'none' : 'inline-block');
  document.querySelectorAll('.authOnly').forEach(el => el.style.display = user ? 'inline-block' : 'none');
}

// ---------------------------
// Profile
// ---------------------------
function loadProfile() {
  const user = JSON.parse(localStorage.getItem('pm:currentUser'));
  const box = document.getElementById('profileDetails');
  if (!box) return;
  if (user) {
    let html = `<p><strong>Name:</strong> ${user.name || user.storeName}</p>`;
    if (user.type === 'store') {
      html += `<p><strong>Owner:</strong> ${user.owner}</p>`;
      html += `<p><strong>Phone:</strong> ${user.phone}</p>`;
      html += `<p><strong>Address:</strong> ${user.address}</p>`;
    } else if (user.type === 'delivery') {
      html += `<p><strong>Phone:</strong> ${user.phone}</p>`;
      html += `<p><strong>City:</strong> ${user.city}</p>`;
      html += `<p><strong>Vehicle:</strong> ${user.vehicle}</p>`;
    } else {
      html += `<p><strong>Email:</strong> ${user.email}</p>`;
      html += `<p><strong>Phone:</strong> ${user.phone}</p>`;
    }
    box.innerHTML = html;
  } else {
    box.innerHTML = `<p>No profile data.</p>`;
  }
}

// ---------------------------
// Logout
// ---------------------------
document.addEventListener('DOMContentLoaded', () => {
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('pm:currentUser');
      toast("Logged out 👋");
      updateNavbar();
      window.location.href = "home.html"; // go back home
    });
  }
});

// ---------------------------
// Toast
// ---------------------------
function toast(msg, danger = false) {
  const wrap = document.getElementById('toast');
  if (!wrap) return;
  const el = document.createElement('div');
  el.className = 'toast';
  el.textContent = msg;
  if (danger) el.style.borderColor = 'rgba(255,99,99,0.6)';
  wrap.appendChild(el);
  setTimeout(() => {
    el.style.opacity = '0';
    setTimeout(() => el.remove(), 300);
  }, 2300);
}

// ---------------------------
// Main Carousel
// ---------------------------
function setupMainCarousel() {
  const slides = document.querySelectorAll('.carousel-slide');
  const dots = document.querySelectorAll('.carousel-dots .dot');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');

  let currentSlide = 0;

  function showSlide(index) {
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    if (slides[index]) slides[index].classList.add('active');
    if (dots[index]) dots[index].classList.add('active');
  }

  function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
  }

  function prevSlide() {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(currentSlide);
  }

  if (nextBtn) nextBtn.addEventListener('click', nextSlide);
  if (prevBtn) prevBtn.addEventListener('click', prevSlide);

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      currentSlide = index;
      showSlide(currentSlide);
    });
  });

  if (slides.length > 0) showSlide(currentSlide);
}

// ---------------------------
// Theme & Menu Toggle
// ---------------------------
function setupUI() {
  const themeToggleBtn = document.getElementById('themeToggle');
  const menuToggleBtn = document.getElementById('menuToggle');
  const navLinks = document.querySelector('#navbar .links');

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
    });
  }

  if (menuToggleBtn && navLinks) {
    menuToggleBtn.addEventListener('click', () => {
      navLinks.classList.toggle('show');
    });
  }
}

// ---------------------------
// Init
// ---------------------------
document.addEventListener('DOMContentLoaded', () => {
  particles();
  setupForms();
  updateNavbar();
  loadProfile();
  setupMainCarousel();
  setupUI();
});
