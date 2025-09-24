// ---------------------------
// SPA Router
// ---------------------------
const Router = {
  currentPage: 'home',
  go(page) {
    document.querySelectorAll('.route').forEach(s => s.classList.remove('active'));
    const target = document.querySelector(`[data-page="${page}"]`);
    if (target) {
      target.classList.add('active');
      history.pushState({}, '', `#${page}`);
      this.currentPage = page;
      this.updateBackButton();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
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
const PLANTS = [
  { id: 1, name: 'Snake Plant', img: 'https://images.unsplash.com/photo-1545249390-6bdfa286032f?q=80&w=800&auto=format&fit=crop' },
  { id: 2, name: 'Monstera',  img: 'https://images.unsplash.com/photo-1545249390-6bdfa286032f?q=80&w=800&auto=format&fit=crop' },
  { id: 3, name: 'Areca Palm', img: 'https://images.unsplash.com/photo-1545249390-6bdfa286032f?q=80&w=800&auto=format&fit=crop' },
  { id: 4, name: 'Aloe Vera', img: 'https://images.unsplash.com/photo-1545249390-6bdfa286032f?q=80&w=800&auto=format&fit=crop' },
  { id: 5, name: 'ZZ Plant', img: 'https://images.unsplash.com/photo-1545249390-6bdfa286032f?q=80&w=800&auto=format&fit=crop' },
  { id: 6, name: 'Peace Lily', img: 'https://images.unsplash.com/photo-1545249390-6bdfa286032f?q=80&w=800&auto=format&fit=crop' },
];

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

// // ---------------------------
// // Store Search
// // ---------------------------
// const STORES = [
//   { id: 1, name: 'Green Farm Noida 1', pincode: '201301' },
//   { id: 2, name: 'Fresh Veggies Noida 2', pincode: '201301' },
//   { id: 3, name: 'Organic Basket Noida 3', pincode: '201301' },
//   { id: 4, name: 'Happy Farms Noida 4', pincode: '201301' },
//   { id: 5, name: 'Green Earth Noida 5', pincode: '201301' },
//   { id: 6, name: 'Farmers Delight Noida 6', pincode: '201301' },
//   { id: 7, name: 'Delhi Fresh 1', pincode: '110001' },
//   { id: 8, name: 'Delhi Organics 2', pincode: '110001' },
//   { id: 9, name: 'Green Delhi 3', pincode: '110001' },
//   { id: 10, name: 'Healthy Harvest Delhi 4', pincode: '110001' },
//   { id: 11, name: 'Farm Delhi 5', pincode: '110001' },
//   { id: 12, name: 'Organic Delhi 6', pincode: '110001' },
//   { id: 13, name: 'Ghaziabad Greens 1', pincode: '201001' },
//   { id: 14, name: 'Fresh Ghaziabad 2', pincode: '201001' },
//   { id: 15, name: 'Organic Ghaziabad 3', pincode: '201001' },
//   { id: 16, name: 'Healthy Farm Ghaziabad 4', pincode: '201001' },
//   { id: 17, name: 'Green Basket Ghaziabad 5', pincode: '201001' },
//   { id: 18, name: 'Farmers Choice Ghaziabad 6', pincode: '201001' },
// ];

function renderStores(pincode) {
  const storeList = document.getElementById('storeList');
  if (!storeList) return;

  if (!pincode) {
    storeList.innerHTML = '<p>Please select a pincode to see stores.</p>';
    return;
  }

  const filtered = STORES.filter(s => s.pincode === pincode);
  if (!filtered.length) {
    storeList.innerHTML = '<p>No stores found for this pincode.</p>';
    return;
  }

  storeList.innerHTML = filtered.map(store => `
    <div class="store-card">
      <h3>${store.name}</h3>
      <p>Pincode: ${store.pincode}</p>
      <button onclick="alert('Visit ${store.name}')">Visit Store</button>
    </div>
  `).join('');
}

document.addEventListener('DOMContentLoaded', () => {
  const pincodeSelect = document.getElementById('pincodeSelect');
  if (pincodeSelect) {
    pincodeSelect.addEventListener('change', () => renderStores(pincodeSelect.value));
    renderStores(''); // initial message
  }
});

// ---------------------------
// Run on DOMContentLoaded
// ---------------------------
document.addEventListener('DOMContentLoaded', () => {
  particles();
  Router.init();
  renderCatalog();
  setupForms();
  updateNavbar();
  loadProfile();

  const toggle = document.getElementById('menuToggle');
  const links = document.querySelector('#navbar .links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      links.classList.toggle('show');
      toggle.classList.toggle('open');
    });
  }
});
document.addEventListener('DOMContentLoaded', () => {
  const productSearchInput = document.getElementById('productSearchInput');
  const productSearchBtn = document.getElementById('productSearchBtn');
  const productResults = document.getElementById('productResults');

  // Mock products across multiple stores
const ALL_PRODUCTS = [
  { name: "Organic Tomato", specs: "1 kg, Freshly harvested", price: 60, farmer: "Ramesh Kumar", store: "Green Farm Noida 1", inStock: true },
  { name: "Spinach", specs: "500 g, Organic", price: 40, farmer: "Sita Devi", store: "Green Farm Noida 1", inStock: true },
  { name: "Tomato", specs: "1 kg, Farm fresh", price: 55, farmer: "Rahul Yadav", store: "Fresh Veggies Noida 2", inStock: false },
  { name: "Potato", specs: "1 kg, Fresh", price: 35, farmer: "Amit Singh", store: "Happy Farms Noida 4", inStock: true },
  { name: "Tomato", specs: "1 kg, Organic", price: 65, farmer: "Deepa Devi", store: "Delhi Fresh 1", inStock: true },
  { name: "Spinach", specs: "500 g, Fresh", price: 38, farmer: "Sunil Kumar", store: "Delhi Organics 2", inStock: false },
  { name: "Aloe Vera", specs: "1 plant, potted", price: 120, farmer: "Suresh Yadav", store: "Organic Ghaziabad 3", inStock: true },
  { name: "Carrot", specs: "1 kg, Fresh", price: 50, farmer: "Neha Sharma", store: "Green Farm Noida 1", inStock: true },
  { name: "Cucumber", specs: "1 kg, Organic", price: 45, farmer: "Rajesh Kumar", store: "Fresh Veggies Noida 2", inStock: true },
  { name: "Capsicum", specs: "500 g, Fresh", price: 70, farmer: "Priya Singh", store: "Happy Farms Noida 4", inStock: false },
  { name: "Lettuce", specs: "1 bunch, Organic", price: 30, farmer: "Manoj Yadav", store: "Green Earth Noida 5", inStock: true },
  { name: "Cabbage", specs: "1 kg, Fresh", price: 35, farmer: "Sonia Devi", store: "Farmers Delight Noida 6", inStock: true },
  { name: "Bell Pepper", specs: "500 g, Organic", price: 80, farmer: "Rakesh Kumar", store: "Delhi Fresh 1", inStock: true },
  { name: "Broccoli", specs: "500 g, Fresh", price: 90, farmer: "Anita Devi", store: "Delhi Organics 2", inStock: false },
  { name: "Cauliflower", specs: "1 kg, Organic", price: 55, farmer: "Vikas Sharma", store: "Green Delhi 3", inStock: true },
  { name: "Mint Leaves", specs: "1 bunch, Fresh", price: 15, farmer: "Sunita Yadav", store: "Healthy Harvest Delhi 4", inStock: true },
  { name: "Coriander", specs: "1 bunch, Organic", price: 20, farmer: "Rajesh Singh", store: "Farm Delhi 5", inStock: true },
  { name: "Fenugreek", specs: "1 bunch, Fresh", price: 25, farmer: "Seema Devi", store: "Organic Delhi 6", inStock: false },
  { name: "Basil", specs: "1 bunch, Organic", price: 30, farmer: "Ramesh Yadav", store: "Ghaziabad Greens 1", inStock: true },
  { name: "Chilli", specs: "250 g, Fresh", price: 40, farmer: "Priya Sharma", store: "Fresh Ghaziabad 2", inStock: true },
  { name: "Garlic", specs: "500 g, Organic", price: 60, farmer: "Anil Kumar", store: "Organic Ghaziabad 3", inStock: false },
  { name: "Ginger", specs: "250 g, Fresh", price: 50, farmer: "Suman Devi", store: "Healthy Farm Ghaziabad 4", inStock: true },
  { name: "Beetroot", specs: "1 kg, Organic", price: 45, farmer: "Ravi Kumar", store: "Green Basket Ghaziabad 5", inStock: true },
  { name: "Pumpkin", specs: "1 kg, Fresh", price: 35, farmer: "Kavita Sharma", store: "Farmers Choice Ghaziabad 6", inStock: true },
  { name: "Sweet Corn", specs: "2 pcs, Organic", price: 25, farmer: "Ankit Yadav", store: "Green Farm Noida 1", inStock: true },
  { name: "Radish", specs: "500 g, Fresh", price: 20, farmer: "Priya Devi", store: "Fresh Veggies Noida 2", inStock: true },
  { name: "Okra", specs: "500 g, Organic", price: 40, farmer: "Sunil Sharma", store: "Happy Farms Noida 4", inStock: false },
  { name: "Brinjal", specs: "1 kg, Fresh", price: 45, farmer: "Ramesh Singh", store: "Green Earth Noida 5", inStock: true },
  { name: "Snake Plant", specs: "1 plant, potted", price: 150, farmer: "Anita Devi", store: "Farmers Delight Noida 6", inStock: true },
  { name: "Money Plant", specs: "1 plant, potted", price: 200, farmer: "Deepak Kumar", store: "Delhi Fresh 1", inStock: true },
  { name: "Peace Lily", specs: "1 plant, potted", price: 180, farmer: "Sonia Sharma", store: "Delhi Organics 2", inStock: false },
  { name: "Tulsi Plant", specs: "1 plant, potted", price: 120, farmer: "Rakesh Yadav", store: "Green Delhi 3", inStock: true },
  { name: "Areca Palm", specs: "1 plant, potted", price: 250, farmer: "Sunita Devi", store: "Healthy Harvest Delhi 4", inStock: true },
  { name: "Monstera", specs: "1 plant, potted", price: 300, farmer: "Rajesh Sharma", store: "Farm Delhi 5", inStock: true },
  { name: "Cactus", specs: "1 plant, potted", price: 100, farmer: "Neha Yadav", store: "Organic Delhi 6", inStock: true },
  // ... continue adding until 200 products
];

  function renderProducts(query) {
    const q = query.trim().toLowerCase();
    const filtered = ALL_PRODUCTS.filter(p => p.name.toLowerCase().includes(q));

    if (filtered.length === 0) {
      productResults.innerHTML = `<p>No products found for "${query}".</p>`;
      return;
    }

    productResults.innerHTML = filtered.map(p => `
      <div class="product-card">
        <div class="product-details">
          <h3>${p.name}</h3>
          <p><strong>Specs:</strong> ${p.specs}</p>
          <p><strong>Price:</strong> ₹${p.price}</p>
          <p><strong>Farmer:</strong> ${p.farmer}</p>
          <p><strong>Store:</strong> ${p.store}</p>
          <p><strong>Status:</strong> ${p.inStock ? 'Available' : 'Out of Stock'}</p>
        </div>
        <div class="product-actions">
          <button class="${p.inStock ? '' : 'disabled'}" ${p.inStock ? `onclick="alert('Bought ${p.name} from ${p.store}')"` : 'disabled'}>
            Buy
          </button>
        </div>
      </div>
    `).join('');
  }

  productSearchBtn.addEventListener('click', () => {
    const query = productSearchInput.value;
    if (!query) return;
    renderProducts(query);
  });

  // Optional: search on Enter key
  productSearchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') productSearchBtn.click();
  });
});
