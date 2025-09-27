// ---------------------------
// SPA Router
// ---------------------------
const Router = {
  // currentPage: 'home',
  go(page) {
    // document.querySelectorAll('.route').forEach(s => s.classList.remove('active'));
    // const target = document.querySelector(`[data-page="${page}"]`);
    // if (target) {
    //   target.classList.add('active');
    //   history.pushState({}, '', `#${page}`);
    //   this.currentPage = page;
    //   this.updateBackButton();
    //   window.scrollTo({ top: 0, behavior: 'smooth' });
    // }
  },
  updateBackButton() {
    const backButton = document.querySelector('.back-button');
    if (backButton) {
      backButton.classList.toggle('show', this.currentPage !== 'home');
    }
  },
  init() {
    const start = location.hash?.replace('#', '') || 'home';
    this.go(start);
    document.querySelectorAll('[data-route]').forEach(a => {
      a.addEventListener('click', e => {
        e.preventDefault();
        this.go(a.getAttribute('data-route'));
      });
    });
    window.addEventListener('popstate', () => {
      const page = location.hash?.replace('#', '') || 'home';
      this.go(page);
    });
  }
};
window.Router = Router;

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
      ctx.fillStyle = 'rgba(89,255,167,0.14)';
      ctx.fill();
    }
    requestAnimationFrame(tick);
  }
  tick();
}

// ---------------------------
// Plants / Catalog
// ---------------------------
// const PLANTS = [
//   { id: 1, name: 'Snake Plant', img: 'https://images.unsplash.com/photo-1545249390-6bdfa286032f?q=80&w=800&auto=format&fit=crop' },
//   { id: 2, name: 'Monstera',  img: 'https://images.unsplash.com/photo-1545249390-6bdfa286032f?q=80&w=800&auto=format&fit=crop' },
//   { id: 3, name: 'Areca Palm', img: 'https://images.unsplash.com/photo-1545249390-6bdfa286032f?q=80&w=800&auto=format&fit=crop' },
//   { id: 4, name: 'Aloe Vera', img: 'https://images.unsplash.com/photo-1545249390-6bdfa286032f?q=80&w=800&auto=format&fit=crop' },
//   { id: 5, name: 'ZZ Plant', img: 'https://images.unsplash.com/photo-1545249390-6bdfa286032f?q=80&w=800&auto=format&fit=crop' },
//   { id: 6, name: 'Peace Lily', img: 'https://images.unsplash.com/photo-1545249390-6bdfa286032f?q=80&w=800&auto=format&fit=crop' },
// ];

function renderCatalog() {
  const track = document.getElementById('plantCarouselTrack');
  const grid = document.getElementById('plantGrid');
  const target = track || grid;
  if (!target) return;
  target.innerHTML = PLANTS.map(p => `
    <div class="card glass plant" data-id="${p.id}">
      <img src="${p.img}" alt="${p.name}">
      <div class="meta">
        <div>
          <strong>${p.name}</strong>
        </div>
        <button class="btn ghost add-btn" onclick="addToCart(${p.id})">Like</button>
      </div>
    </div>
  `).join('');
  if (track) setupCarousel();
}

const CART = JSON.parse(localStorage.getItem('pm:cart') || '[]');
function addToCart(id) {
  const item = PLANTS.find(x => x.id === id);
  if (!item) return;
  CART.push(item);
  localStorage.setItem('pm:cart', JSON.stringify(CART));
  toast(`${item.name} Liked The Photo`);
}

// ---------------------------
// Carousel
// ---------------------------
function setupCarousel() {
  const track = document.getElementById('plantCarouselTrack');
  const slides = Array.from(track.children);
  if (!track || slides.length === 0) return;
  const options = { root: track, rootMargin: "0px", threshold: 0.7 };
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      entry.target.classList.toggle('active', entry.isIntersecting);
    });
  }, options);
  slides.forEach(slide => observer.observe(slide));
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
        Router.go('profile');
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
      Router.go('profile');
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
      Router.go('profile');
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
      Router.go('profile');
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
      Router.go('home');
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
        if (slides[index]) {
            slides[index].classList.add('active');
        }
        if (dots[index]) {
            dots[index].classList.add('active');
        }
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(currentSlide);
    }
    
    // Check if buttons exist before adding event listeners
    if (nextBtn) {
        nextBtn.addEventListener('click', nextSlide);
    }
    if (prevBtn) {
        prevBtn.addEventListener('click', prevSlide);
    }

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentSlide = index;
            showSlide(currentSlide);
        });
    });

    if (slides.length > 0) {
        showSlide(currentSlide);
    }
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
  Router.init();
  particles();
  setupForms();
  updateNavbar();
  setupMainCarousel();
  setupUI();
});
