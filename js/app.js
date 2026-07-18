/* =========================================================
   PRIME SIP KITCHEN — Shared Application Logic & PWA Media Engine
   ========================================================= */

/* ---------- PWA Service Worker Registration ---------- */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then(reg => console.log('Service Worker registered successfully:', reg.scope))
      .catch(err => console.error('Service Worker registration failed:', err));
  });
}

/* ---------- Load YouTube Iframe Player API ---------- */
const tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
const firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

let bgPlayer;
window.onYouTubeIframeAPIReady = function() {
  // 1. Background Video Hero loop
  const bgPlaceholder = document.getElementById('youtube-bg-player');
  if (bgPlaceholder) {
    bgPlayer = new YT.Player('youtube-bg-player', {
      videoId: 'u-nrdkufWm0',
      playerVars: {
        autoplay: 1,
        mute: 1,
        controls: 0,
        disablekb: 1,
        fs: 0,
        modestbranding: 1,
        rel: 0,
        showinfo: 0,
        loop: 1,
        playlist: 'u-nrdkufWm0', // Required for loop in YT player
        playsinline: 1
      },
      events: {
        onReady: function(e) {
          e.target.playVideo();
        },
        onStateChange: function(e) {
          // Manual fallback loop safety
          if (e.data === YT.PlayerState.ENDED) {
            e.target.playVideo();
          }
        }
      }
    });
  }

  // 2. Playlist Audio Player (Hidden in Controller)
  const audioPlaceholder = document.getElementById('youtube-audio-player');
  if (audioPlaceholder) {
    MediaEngine.ytAudioPlayer = new YT.Player('youtube-audio-player', {
      height: '0',
      width: '0',
      videoId: 'Xiop2yTFB0s',
      playerVars: {
        listType: 'playlist',
        list: 'PLbky1Uo8tP8CSLdGbdwFezMjDuukfUh7A',
        autoplay: 0,
        controls: 0,
        disablekb: 1,
        loop: 1
      },
      events: {
        onReady: function() {
          console.log('YouTube Audio Player (Playlist) loaded and ready.');
        }
      }
    });
  }
};

/* ---------- Menu data (single source of truth) ---------- */
const MENU = [
  // Prime Combos & Platters
  { id:"soft-life-combo", cat:"combos", name:"Soft Life Combo", price:15000,
    desc:"Grilled chicken, jollof rice, fried plantain and a house salad, plated for one." },
  { id:"executive-combo", cat:"combos", name:"Executive Combo", price:25000,
    desc:"Mixed grill of chicken and beef, coconut rice, plantain and grilled vegetables." },
  { id:"lamb-shank-platter", cat:"combos", name:"Slow-Cooked Lamb Shank Platter", price:35000,
    desc:"Lamb shank braised for six hours until it falls off the bone, served with herbed rice and pepper sauce." },
  { id:"asun-platter", cat:"combos", name:"Asun Platter", price:25000,
    desc:"Smoky, spiced goat meat chopped and tossed in pepper and onions, built for sharing." },
  { id:"lamb-chops", cat:"combos", name:"Grilled Lamb Chops", price:32000,
    desc:"Char-grilled lamb chops finished with rosemary butter, served with truffle mash." },

  // Swallows & Local Soups
  { id:"ewedu", cat:"swallows", name:"Ewedu", price:4000,
    desc:"Silky jute-leaf soup, drawn smooth and finished with a touch of locust bean." },
  { id:"okra-seafood", cat:"swallows", name:"Seafood Okra", price:8500,
    desc:"Okra loaded with prawns, croaker fish and periwinkle in a rich palm oil base." },
  { id:"miyan-taushe", cat:"swallows", name:"Miyan Taushe", price:7000,
    desc:"Northern pumpkin soup slow-cooked with beef and dried fish, mildly spiced." },
  { id:"edikang-ikong", cat:"swallows", name:"Edikang Ikong", price:9000,
    desc:"Layered greens and waterleaf simmered with assorted meat and stockfish." },
  { id:"fisherman-soup", cat:"swallows", name:"Fisherman Soup", price:10500,
    desc:"A generous catch of fresh and dried fish in a peppered, aromatic broth." },
  { id:"tuwon-shinkafa", cat:"swallows", name:"Tuwon Shinkafa", price:2500,
    desc:"Smooth rice swallow, the classic northern pairing for any of our soup pots." },
  { id:"poundo-yam", cat:"swallows", name:"Poundo Yam", price:2500,
    desc:"Stretch-smooth pounded yam, made fresh to order." },

  // Continental & Pepper Soups
  { id:"goat-pepper-soup", cat:"pepper", name:"Goat Meat Pepper Soup", price:6000,
    desc:"Tender goat meat in a fiery, aromatic broth built on native spice." },
  { id:"lamb-chicken-mushroom", cat:"pepper", name:"Lamb & Chicken Mushroom Soup", price:9500,
    desc:"A continental-leaning pepper soup layered with mushroom and fresh herbs." },
  { id:"catfish-pepper-soup", cat:"pepper", name:"Catfish Pepper Soup", price:7500,
    desc:"Fresh catfish simmered in a light, peppery, herb-forward broth." },
  { id:"chicken-suya-skewers", cat:"pepper", name:"Chicken Suya Skewers", price:6500,
    desc:"Char-grilled skewers dusted in yaji spice, served with onion and tomato." },

  // Premium Sips & Desserts
  { id:"prime-sip-special", cat:"sips", name:"Prime Sip Special", price:5500,
    desc:"Our signature house mocktail — hibiscus, ginger, citrus and a whisper of mint." },
  { id:"tiger-nut-drink", cat:"sips", name:"Tiger Nut Drink", price:2000,
    desc:"Kunun Aya made fresh in-house, naturally sweet and lightly spiced." },
  { id:"zobo-royale", cat:"sips", name:"Zobo Royale", price:2500,
    desc:"Hibiscus zobo steeped with ginger, pineapple and cloves, served chilled." },
  { id:"mojito-classic", cat:"sips", name:"Classic Mojito", price:6000,
    desc:"Fresh mint, lime and soda over crushed ice — alcoholic or virgin, your call." },
  { id:"ice-cream-sundae", cat:"sips", name:"Ice Cream Sundae", price:4500,
    desc:"Layered vanilla and chocolate scoops, caramel, nuts and a wafer crown." },
  { id:"chapman", cat:"sips", name:"House Chapman", price:4000,
    desc:"The Nigerian classic — grenadine, bitters, citrus and a fizz of soda." },
];

const CATEGORY_LABELS = {
  combos:  { name:"Prime Combos & Platters", note:"Built for sharing — our most requested table." },
  swallows:{ name:"Swallows & Local Soups", note:"Pick a swallow base and pair it with any pot below." },
  pepper:  { name:"Continental & Pepper Soups", note:"Warming, peppered bowls for any hour of the day." },
  sips:    { name:"Premium Sips & Desserts", note:"Curated drinks and something sweet to close the meal." },
};

const NAIRA = n => "₦" + n.toLocaleString("en-NG");

/* ---------- Shared Database Managers (localStorage) ---------- */
const Database = {
  ORDERS_KEY: "psk_orders_v1",
  BOOKINGS_KEY: "psk_bookings_v1",

  readOrders() {
    try { return JSON.parse(localStorage.getItem(this.ORDERS_KEY)) || []; } catch(e) { return []; }
  },
  writeOrders(orders) {
    localStorage.setItem(this.ORDERS_KEY, JSON.stringify(orders));
    window.dispatchEvent(new Event('psk_db_update'));
  },
  addOrder(order) {
    const orders = this.readOrders();
    orders.push(order);
    this.writeOrders(orders);
  },
  updateOrderStatus(orderId, status, prepMinutes = 0) {
    const orders = this.readOrders();
    const order = orders.find(o => o.id === orderId);
    if (order) {
      order.status = status;
      if (status === 'confirmed' && prepMinutes > 0) {
        order.confirmedAt = Date.now();
        order.prepMinutes = prepMinutes;
        order.targetPickupTime = Date.now() + (prepMinutes * 60 * 1000);
      }
      this.writeOrders(orders);
    }
  },

  readBookings() {
    try { return JSON.parse(localStorage.getItem(this.BOOKINGS_KEY)) || []; } catch(e) { return []; }
  },
  writeBookings(bookings) {
    localStorage.setItem(this.BOOKINGS_KEY, JSON.stringify(bookings));
    window.dispatchEvent(new Event('psk_db_update'));
  },
  addBooking(booking) {
    const bookings = this.readBookings();
    bookings.push(booking);
    this.writeBookings(bookings);
  }
};

/* ---------- Cart engine (localStorage) ---------- */
const Cart = {
  KEY:"psk_cart_v1",
  read(){ try{ return JSON.parse(localStorage.getItem(this.KEY)) || []; }catch(e){ return []; } },
  write(items){ localStorage.setItem(this.KEY, JSON.stringify(items)); this.updateBadge(); },
  add(id, qty=1){
    const item = MENU.find(m=>m.id===id);
    if(!item) return;
    const items = this.read();
    const existing = items.find(i=>i.id===id);
    if(existing){ existing.qty += qty; } else { items.push({ id, qty }); }
    this.write(items);
    return items;
  },
  setQty(id, qty){
    let items = this.read();
    if(qty<=0){ items = items.filter(i=>i.id!==id); }
    else { const it = items.find(i=>i.id===id); if(it) it.qty = qty; }
    this.write(items);
    return items;
  },
  remove(id){ return this.write(this.read().filter(i=>i.id!==id)); },
  clear(){ this.write([]); },
  count(){ return this.read().reduce((s,i)=>s+i.qty,0); },
  subtotal(){
    return this.read().reduce((s,i)=>{
      const m = MENU.find(x=>x.id===i.id);
      return s + (m ? m.price*i.qty : 0);
    },0);
  },
  updateBadge(){
    document.querySelectorAll("[data-cart-count]").forEach(el=>{
      const n = this.count();
      el.textContent = n;
      el.style.display = n>0 ? "flex" : "none";
    });
  }
};

/* ---------- Web Audio Synthesized Sound Engine ---------- */
const MediaEngine = {
  audioCtx: null,
  masterVolume: null,
  isPlaying: false,
  ytAudioPlayer: null, // Initialized by YouTube API

  init() {
    if (this.audioCtx) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    this.audioCtx = new AudioContext();
    this.masterVolume = this.audioCtx.createGain();
    this.masterVolume.gain.value = 0.15;
    this.masterVolume.connect(this.audioCtx.destination);
  },

  playChime() {
    this.init();
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    
    const now = this.audioCtx.currentTime;
    
    // Create a sparkling chime sound (sine waves)
    const osc1 = this.audioCtx.createOscillator();
    const osc2 = this.audioCtx.createOscillator();
    const gainNode = this.audioCtx.createGain();
    
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(880, now);
    osc1.frequency.exponentialRampToValueAtTime(1760, now + 0.12);
    
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(1320, now);
    osc2.frequency.exponentialRampToValueAtTime(2640, now + 0.12);

    gainNode.gain.setValueAtTime(0.08, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc1.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(this.audioCtx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.4);
    osc2.stop(now + 0.4);
  },

  playAlarm() {
    this.init();
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    
    const now = this.audioCtx.currentTime;
    
    // Create a rich digital service desk bell chime
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(587.33, now);
    osc.frequency.setValueAtTime(880.00, now + 0.1);
    osc.frequency.setValueAtTime(1174.66, now + 0.2);
    
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.12, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.9);
    
    osc.connect(gain);
    gain.connect(this.audioCtx.destination);
    
    osc.start(now);
    osc.stop(now + 1.0);
  },

  startAmbientMusic() {
    this.isPlaying = true;
    if (this.ytAudioPlayer && typeof this.ytAudioPlayer.playVideo === 'function') {
      this.ytAudioPlayer.playVideo();
    }
  },

  stopAmbientMusic() {
    this.isPlaying = false;
    if (this.ytAudioPlayer && typeof this.ytAudioPlayer.pauseVideo === 'function') {
      this.ytAudioPlayer.pauseVideo();
    }
  },

  toggleMusic(pillEl) {
    if (this.isPlaying) {
      this.stopAmbientMusic();
      pillEl.classList.remove('playing');
      pillEl.querySelector('.audio-label').textContent = 'Lounge Audio: Off';
    } else {
      this.startAmbientMusic();
      pillEl.classList.add('playing');
      pillEl.querySelector('.audio-label').textContent = 'Lounge Audio: On';
    }
  }
};

/* ---------- Floating Ambient Sound Setup ---------- */
function initAmbientControl() {
  if (document.getElementById('lounge-audio-toggle')) return;

  const controller = document.createElement('div');
  controller.className = 'audio-controller';
  controller.innerHTML = `
    <div class="audio-pill" id="lounge-audio-toggle">
      <div class="audio-icon">🔊</div>
      <span class="audio-label">Lounge Audio: Off</span>
      <div class="audio-visualizer">
        <span class="audio-bar"></span>
        <span class="audio-bar"></span>
        <span class="audio-bar"></span>
        <span class="audio-bar"></span>
      </div>
    </div>
    <!-- Hidden iframe mount target for YouTube Player API -->
    <div id="youtube-audio-player" style="position: absolute; width: 1px; height: 1px; opacity: 0; pointer-events: none;"></div>
  `;
  document.body.appendChild(controller);

  const toggleBtn = document.getElementById('lounge-audio-toggle');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      MediaEngine.toggleMusic(toggleBtn);
    });
  }
}

/* ---------- Nav: scroll state + mobile toggle ---------- */
function initNav(){
  const header = document.querySelector(".site-header");
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");
  if(header){
    const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive:true });
  }
  if(toggle && links){
    toggle.addEventListener("click", ()=>{
      links.classList.toggle("open");
      document.body.style.overflow = links.classList.contains("open") ? "hidden" : "";
    });
    links.querySelectorAll("a").forEach(a=>a.addEventListener("click", ()=>{
      links.classList.remove("open");
      document.body.style.overflow = "";
    }));
  }
  // mark active link
  const path = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a[href]").forEach(a=>{
    if(a.getAttribute("href") === path) a.classList.add("active");
  });
}

/* ---------- Reveal on scroll ---------- */
function initReveal(){
  const els = document.querySelectorAll(".reveal");
  if(!("IntersectionObserver" in window)){ els.forEach(e=>e.classList.add("in")); return; }
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add("in"); io.unobserve(e.target); } });
  }, { threshold:0.14 });
  els.forEach(e=>io.observe(e));
}

/* ---------- Hero embers ---------- */
function initEmbers(){
  const field = document.querySelector(".hero-embers");
  if(!field) return;
  const count = window.innerWidth < 700 ? 12 : 24;
  for(let i=0;i<count;i++){
    const e = document.createElement("span");
    e.className = "ember";
    e.style.left = Math.random()*100 + "%";
    e.style.animationDelay = (Math.random()*9) + "s";
    e.style.animationDuration = (7 + Math.random()*6) + "s";
    e.style.opacity = 0.4 + Math.random()*0.5;
    field.appendChild(e);
  }
}

/* ---------- Toast ---------- */
function toast(msg){
  let t = document.querySelector(".toast");
  if(!t){
    t = document.createElement("div");
    t.className = "toast";
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(t._timer);
  t._timer = setTimeout(()=>t.classList.remove("show"), 2400);
}

/* ---------- Menu page: filters + render + add-to-cart ---------- */
function initMenuPage(){
  const grid = document.querySelector("[data-menu-root]");
  if(!grid) return;

  Object.keys(CATEGORY_LABELS).forEach(cat=>{
    const section = document.querySelector(`[data-cat="${cat}"] .menu-items`);
    if(!section) return;
    const items = MENU.filter(m=>m.cat===cat);
    section.innerHTML = items.map(m => `
      <article class="menu-item" data-id="${m.id}">
        <div class="menu-item-top">
          <h4>${m.name}</h4>
        </div>
        <p class="desc">${m.desc}</p>
        <div class="menu-item-foot">
          <span class="price">${NAIRA(m.price)}</span>
          <button class="add-btn" data-add="${m.id}">Add to order</button>
        </div>
      </article>
    `).join("");
  });

  document.body.addEventListener("click", (e)=>{
    const btn = e.target.closest("[data-add]");
    if(!btn) return;
    const id = btn.getAttribute("data-add");
    Cart.add(id);
    
    // Play the sparkling chime sound effect
    MediaEngine.playChime();

    const item = MENU.find(m=>m.id===id);
    btn.textContent = "Added ✓";
    btn.classList.add("added");
    toast(`${item.name} added to your order`);
    setTimeout(()=>{ btn.textContent = "Add to order"; btn.classList.remove("added"); }, 1400);
  });

  // filter chips
  const chips = document.querySelectorAll(".filter-chip");
  chips.forEach(chip=>{
    chip.addEventListener("click", ()=>{
      chips.forEach(c=>c.classList.remove("active"));
      chip.classList.add("active");
      const target = chip.getAttribute("data-filter");
      if(target === "all"){
        document.querySelectorAll(".menu-cat").forEach(s=>s.style.display = "");
      } else {
        document.querySelectorAll(".menu-cat").forEach(s=>{
          s.style.display = s.getAttribute("data-cat") === target ? "" : "none";
        });
        document.querySelector(`[data-cat="${target}"]`)?.scrollIntoView({ behavior:"smooth", block:"start" });
      }
    });
  });
}

/* ---------- Customer Order Tracking View logic ---------- */
let trackerInterval = null;

function renderOrderTracker(orderId) {
  const layout = document.querySelector("[data-cart-layout]");
  const empty = document.querySelector("[data-cart-empty]");
  let trackerPanel = document.querySelector("#active-order-tracker");

  if (empty) empty.style.display = "none";
  if (layout) layout.style.display = "none";

  if (!trackerPanel) {
    trackerPanel = document.createElement("div");
    trackerPanel.id = "active-order-tracker";
    trackerPanel.className = "order-tracker-panel";
    const mainSection = document.querySelector("main");
    if (mainSection) mainSection.appendChild(trackerPanel);
  }

  function updateTrackerUI() {
    const orders = Database.readOrders();
    const order = orders.find(o => o.id === orderId);

    if (!order) {
      trackerPanel.innerHTML = `<h3 style='text-align:center;'>Order not found</h3>`;
      clearInterval(trackerInterval);
      return;
    }

    const isPending = order.status === 'pending';
    const isPreparing = order.status === 'confirmed';
    const isReady = order.status === 'ready';
    const isCompleted = order.status === 'completed';

    // Calculate time left
    let timeHtml = "";
    if (isPending) {
      timeHtml = `<p>Waiting for Chef's confirmation...</p>`;
    } else if (isPreparing) {
      const timeLeft = order.targetPickupTime - Date.now();
      if (timeLeft <= 0) {
        timeHtml = `<h4 style="color:#ff5252;">00:00</h4><p>Preparing final touches for pickup</p>`;
      } else {
        const mins = Math.floor(timeLeft / 60000);
        const secs = Math.floor((timeLeft % 60000) / 1000);
        const displaySecs = secs < 10 ? '0' + secs : secs;
        const displayMins = mins < 10 ? '0' + mins : mins;
        timeHtml = `<h4>${displayMins}:${displaySecs}</h4><p>Estimated pickup countdown</p>`;
      }
    } else if (isReady) {
      timeHtml = `<h4 style="color:#4caf50;">Ready ✓</h4><p>Your order is hot and waiting at the counter!</p>`;
    } else if (isCompleted) {
      timeHtml = `<h4 style="color:var(--text-muted);">Completed</h4><p>Thank you for dining with Prime Sip Kitchen!</p>`;
      clearInterval(trackerInterval);
    }

    trackerPanel.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem; border-bottom:1px solid rgba(255,255,255,0.08); padding-bottom:0.5rem;">
        <h3 style="color:var(--primary-gold); font-family:var(--font-display);">Order #${order.id.split('-').pop()}</h3>
        <span style="font-size:0.8rem; background:rgba(255,255,255,0.06); padding:2px 8px; border-radius:12px;">${order.type.toUpperCase()}</span>
      </div>

      <!-- Stepper Progress -->
      <div class="tracker-steps">
        <div class="tracker-step ${isPending || isPreparing || isReady || isCompleted ? 'completed' : ''} ${isPending ? 'active' : ''}">
          <div class="tracker-step-icon">📋</div>
          <span>Received</span>
        </div>
        <div class="tracker-step ${isPreparing || isReady || isCompleted ? 'completed' : ''} ${isPreparing ? 'active' : ''}">
          <div class="tracker-step-icon">🍳</div>
          <span>Preparing</span>
        </div>
        <div class="tracker-step ${isReady || isCompleted ? 'completed' : ''} ${isReady ? 'active' : ''}">
          <div class="tracker-step-icon">🥡</div>
          <span>Ready</span>
        </div>
      </div>

      <!-- Countdown Clock -->
      <div class="tracker-clock">
        ${timeHtml}
      </div>

      <div style="font-size:0.85rem; color:var(--text-muted); background:rgba(0,0,0,0.2); padding:1rem; border-radius:10px; border:1px solid rgba(255,255,255,0.04);">
        <p><strong>Customer:</strong> ${order.name}</p>
        <p><strong>Phone:</strong> ${order.phone}</p>
        <p><strong>Total Amount:</strong> ${NAIRA(order.total)}</p>
      </div>

      ${isCompleted ? `<button onclick="localStorage.removeItem('psk_active_order'); location.reload();" class="btn btn-primary" style="width:100%; margin-top:1.5rem;">Place a New Order</button>` : ''}
    `;
  }

  updateTrackerUI();
  clearInterval(trackerInterval);
  trackerInterval = setInterval(updateTrackerUI, 1000);
}

/* ---------- Cart / checkout page ---------- */
function initCartPage(){
  const root = document.querySelector("[data-cart-root]");
  if(!root) return;

  const empty = document.querySelector("[data-cart-empty]");
  const layout = document.querySelector("[data-cart-layout]");

  // Check if there is an active order already placed in this browser
  const activeOrderId = localStorage.getItem("psk_active_order");
  if (activeOrderId) {
    renderOrderTracker(activeOrderId);
    return;
  }

  function render(){
    const items = Cart.read();
    if(items.length === 0){
      if(empty) empty.style.display = "block";
      if(layout) layout.style.display = "none";
      return;
    }
    if(empty) empty.style.display = "none";
    if(layout) layout.style.display = "grid";

    root.innerHTML = items.map(i=>{
      const m = MENU.find(x=>x.id===i.id);
      if(!m) return "";
      return `
      <div class="cart-line" data-id="${m.id}">
        <div class="cart-line-thumb">${m.name.split(" ").slice(0,2).join(" ")}</div>
        <div class="cart-line-body">
          <div class="cart-line-top">
            <h4>${m.name}</h4>
            <span class="price">${NAIRA(m.price * i.qty)}</span>
          </div>
          <div class="qty-control">
            <button class="qty-btn" data-qty="dec">−</button>
            <span class="qty-val">${i.qty}</span>
            <button class="qty-btn" data-qty="inc">+</button>
          </div>
          <a href="#" class="remove-link" data-remove>Remove</a>
        </div>
      </div>`;
    }).join("");

    const subtotal = Cart.subtotal();
    const deliveryEl = document.querySelector("[data-delivery-fee]");
    const orderType = document.querySelector('input[name="order-type"]:checked')?.value || "dine-in";
    const deliveryFee = orderType === "delivery" ? 2500 : 0;
    if(deliveryEl) deliveryEl.textContent = deliveryFee ? NAIRA(deliveryFee) : "—";

    const subtotalEl = document.querySelector("[data-subtotal]");
    const totalEl = document.querySelector("[data-total]");
    if(subtotalEl) subtotalEl.textContent = NAIRA(subtotal);
    if(totalEl) totalEl.textContent = NAIRA(subtotal + deliveryFee);

    const payBtn = document.querySelector("[data-pay-btn]");
    if(payBtn) payBtn.disabled = items.length === 0;
  }

  root.addEventListener("click", (e)=>{
    const line = e.target.closest(".cart-line");
    if(!line) return;
    const id = line.getAttribute("data-id");
    if(e.target.closest("[data-qty='inc']")){
      const items = Cart.read();
      const it = items.find(x=>x.id===id);
      Cart.setQty(id, (it?.qty||0)+1);
      MediaEngine.playChime();
      render();
    } else if(e.target.closest("[data-qty='dec']")){
      const items = Cart.read();
      const it = items.find(x=>x.id===id);
      Cart.setQty(id, (it?.qty||1)-1);
      render();
    } else if(e.target.closest("[data-remove]")){
      e.preventDefault();
      Cart.remove(id);
      toast("Item removed");
      render();
    }
  });

  document.querySelectorAll('input[name="order-type"]').forEach(radio=>{
    radio.addEventListener("change", ()=>{
      document.querySelectorAll(".order-type").forEach(el=>el.classList.remove("selected"));
      radio.closest(".order-type").classList.add("selected");
      document.querySelectorAll("[data-delivery-field]").forEach(el=>{
        el.classList.toggle("hidden-field", radio.value !== "delivery");
      });
      render();
    });
  });

  document.querySelectorAll('input[name="pay-method"]').forEach(radio=>{
    radio.addEventListener("change", ()=>{
      document.querySelectorAll(".pay-method").forEach(el=>el.classList.remove("selected"));
      radio.closest(".pay-method").classList.add("selected");
    });
  });

  const form = document.querySelector("[data-checkout-form]");
  if(form){
    form.addEventListener("submit", (e)=>{
      e.preventDefault();
      const payBtn = document.querySelector("[data-pay-btn]");
      const name = document.querySelector("#cust-name")?.value.trim();
      const phone = document.querySelector("#cust-phone")?.value.trim();
      const email = document.querySelector("#cust-email")?.value.trim();
      const address = document.querySelector("#cust-address")?.value.trim() || "";
      const type = document.querySelector('input[name="order-type"]:checked')?.value || "dine-in";
      
      if(!name || !phone){ toast("Please fill in your name and phone number"); return; }

      payBtn.disabled = true;
      payBtn.textContent = "Processing…";

      setTimeout(()=>{
        const items = Cart.read().map(i => {
          const m = MENU.find(x => x.id === i.id);
          return { id: i.id, name: m.name, qty: i.qty, price: m.price };
        });
        
        const subtotal = Cart.subtotal();
        const deliveryFee = type === "delivery" ? 2500 : 0;
        
        const orderId = 'PSK-' + Date.now();

        const order = {
          id: orderId,
          name,
          phone,
          email,
          address,
          type,
          items,
          subtotal,
          deliveryFee,
          total: subtotal + deliveryFee,
          status: 'pending',
          createdAt: Date.now()
        };

        // Save order to simulated DB
        Database.addOrder(order);

        // Clear cart
        Cart.clear();

        // Save active order identifier for customer tracking
        localStorage.setItem("psk_active_order", orderId);

        toast("Order placed! Waiting for confirmation...");
        
        // Render the status tracking view
        renderOrderTracker(orderId);
      }, 1000);
    });
  }

  render();
}

/* ---------- Interactive Reservation Booking Submit ---------- */
function initReservationForm() {
  const rForm = document.getElementById("reservation-form");
  if (!rForm) return;

  rForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("res-name").value.trim();
    const phone = document.getElementById("res-phone").value.trim();
    const date = document.getElementById("res-date").value;
    const time = document.getElementById("res-time").value;
    const guests = document.getElementById("res-guests").value;
    const notes = document.getElementById("res-notes").value.trim();

    const booking = {
      id: 'RES-' + Date.now(),
      name,
      phone,
      date,
      time,
      guests,
      notes,
      createdAt: Date.now()
    };

    Database.addBooking(booking);
    MediaEngine.playChime();
    
    alert(`Prestige Table booked! Reference: ${booking.id}. A confirmation SMS will be sent to ${phone}.`);
    rForm.reset();
  });
}

/* ---------- Owner Dashboard Logic ---------- */
const DashboardEngine = {
  lastCheckedOrderCount: 0,
  intervalId: null,

  init() {
    const dRoot = document.getElementById('dashboard-root');
    if (!dRoot) return;

    this.lastCheckedOrderCount = Database.readOrders().length;
    this.render();

    // Poll for changes
    window.addEventListener('psk_db_update', () => this.render());
    
    // Regular 1 second intervals for timers
    this.intervalId = setInterval(() => this.updateTimers(), 1000);

    // Audio Alert Checker: Checks for new orders and plays sound
    setInterval(() => {
      const currentOrders = Database.readOrders();
      if (currentOrders.length > this.lastCheckedOrderCount) {
        // Play service desk bell alarm
        MediaEngine.playAlarm();
        toast("New order received!");
        this.lastCheckedOrderCount = currentOrders.length;
        this.render();
      }
    }, 1500);
  },

  render() {
    const orders = Database.readOrders();
    const bookings = Database.readBookings();

    const pendingList = document.getElementById('pending-orders-list');
    const activeList = document.getElementById('active-orders-list');
    const completedList = document.getElementById('completed-orders-list');
    const bookingList = document.getElementById('bookings-list');

    // Counts
    const pendingCount = document.getElementById('count-pending');
    const activeCount = document.getElementById('count-active');
    const completedCount = document.getElementById('count-completed');
    const bookingCount = document.getElementById('count-bookings');

    const pendingOrders = orders.filter(o => o.status === 'pending');
    const activeOrders = orders.filter(o => o.status === 'confirmed' || o.status === 'ready');
    const completedOrders = orders.filter(o => o.status === 'completed');

    if (pendingCount) pendingCount.textContent = pendingOrders.length;
    if (activeCount) activeCount.textContent = activeOrders.length;
    if (completedCount) completedCount.textContent = completedOrders.length;
    if (bookingCount) bookingCount.textContent = bookings.length;

    // Render Pending
    if (pendingList) {
      if (pendingOrders.length === 0) {
        pendingList.innerHTML = `<p style="color:var(--text-muted); text-align:center;">No pending orders.</p>`;
      } else {
        pendingList.innerHTML = pendingOrders.map(o => `
          <div class="dashboard-card" data-card-id="${o.id}">
            <div class="dashboard-card-header">
              <div class="dashboard-card-title">
                <h4>Order #${o.id.split('-').pop()}</h4>
                <span>Placed at ${new Date(o.createdAt).toLocaleTimeString()}</span>
              </div>
              <span class="dashboard-timer urgency-medium">Pending</span>
            </div>
            <div class="dashboard-card-body">
              <p><strong>Customer:</strong> ${o.name} (${o.phone})</p>
              <p><strong>Type:</strong> ${o.type.toUpperCase()}</p>
              ${o.address ? `<p><strong>Address:</strong> ${o.address}</p>` : ''}
              <ul class="dashboard-items-list">
                ${o.items.map(it => `<li>${it.qty}x ${it.name}</li>`).join('')}
              </ul>
              <p><strong>Total:</strong> ${NAIRA(o.total)}</p>
              
              <div class="prep-select-container">
                <label style="font-size:0.75rem; font-weight:700;">Prep Time:</label>
                <select class="prep-select" id="prep-${o.id}">
                  <option value="10">10 Minutes</option>
                  <option value="15" selected>15 Minutes</option>
                  <option value="20">20 Minutes</option>
                  <option value="30">30 Minutes</option>
                  <option value="45">45 Minutes</option>
                </select>
                <button class="dashboard-btn dashboard-btn-confirm" onclick="DashboardEngine.confirmOrder('${o.id}')">Confirm</button>
              </div>
            </div>
          </div>
        `).join('');
      }
    }

    // Render Active (Preparing / Ready)
    if (activeList) {
      if (activeOrders.length === 0) {
        activeList.innerHTML = `<p style="color:var(--text-muted); text-align:center;">No active orders.</p>`;
      } else {
        activeList.innerHTML = activeOrders.map(o => {
          const isReady = o.status === 'ready';
          return `
            <div class="dashboard-card" data-card-id="${o.id}">
              <div class="dashboard-card-header">
                <div class="dashboard-card-title">
                  <h4>Order #${o.id.split('-').pop()}</h4>
                  <span>Placed at ${new Date(o.createdAt).toLocaleTimeString()}</span>
                </div>
                <span class="dashboard-timer" id="timer-${o.id}" data-target="${o.targetPickupTime || 0}" data-status="${o.status}">
                  ${isReady ? 'Ready' : '--:--'}
                </span>
              </div>
              <div class="dashboard-card-body">
                <p><strong>Customer:</strong> ${o.name} (${o.phone})</p>
                <p><strong>Type:</strong> ${o.type.toUpperCase()}</p>
                <ul class="dashboard-items-list">
                  ${o.items.map(it => `<li>${it.qty}x ${it.name}</li>`).join('')}
                </ul>
                <p><strong>Total:</strong> ${NAIRA(o.total)}</p>
                
                <div class="dashboard-actions">
                  ${!isReady ? `<button class="dashboard-btn dashboard-btn-ready" onclick="DashboardEngine.readyOrder('${o.id}')">Mark Ready</button>` : ''}
                  <button class="dashboard-btn dashboard-btn-complete" onclick="DashboardEngine.completeOrder('${o.id}')">Handover & Complete</button>
                </div>
              </div>
            </div>
          `;
        }).join('');
      }
    }

    // Render Completed
    if (completedList) {
      if (completedOrders.length === 0) {
        completedList.innerHTML = `<p style="color:var(--text-muted); text-align:center;">No completed orders.</p>`;
      } else {
        completedList.innerHTML = completedOrders.slice(-5).reverse().map(o => `
          <div class="dashboard-card" style="opacity: 0.6;">
            <div class="dashboard-card-header">
              <div class="dashboard-card-title">
                <h4>Order #${o.id.split('-').pop()}</h4>
                <span>Completed</span>
              </div>
              <span class="dashboard-timer urgency-low" style="border-color:transparent;">Done</span>
            </div>
            <div class="dashboard-card-body">
              <p><strong>Customer:</strong> ${o.name}</p>
              <p><strong>Total:</strong> ${NAIRA(o.total)}</p>
            </div>
          </div>
        `).join('');
      }
    }

    // Render Bookings
    if (bookingList) {
      if (bookings.length === 0) {
        bookingList.innerHTML = `<p style="color:var(--text-muted); text-align:center;">No bookings recorded.</p>`;
      } else {
        bookingList.innerHTML = bookings.map(b => `
          <div class="dashboard-card">
            <div class="dashboard-card-header">
              <div class="dashboard-card-title">
                <h4>Booking: ${b.name}</h4>
                <span>Placed at ${new Date(b.createdAt).toLocaleTimeString()}</span>
              </div>
              <span class="dashboard-timer urgency-low">${b.guests} Guests</span>
            </div>
            <div class="dashboard-card-body">
              <p><strong>Phone:</strong> ${b.phone}</p>
              <p><strong>Date / Time:</strong> ${b.date} at ${b.time}</p>
              ${b.notes ? `<p><strong>Note:</strong> <em>"${b.notes}"</em></p>` : ''}
            </div>
          </div>
        `).join('');
      }
    }
  },

  confirmOrder(orderId) {
    const select = document.getElementById(`prep-${orderId}`);
    const minutes = parseInt(select?.value || 15);
    Database.updateOrderStatus(orderId, 'confirmed', minutes);
    toast(`Order confirmed! Prep time: ${minutes}m`);
    this.render();
  },

  readyOrder(orderId) {
    Database.updateOrderStatus(orderId, 'ready');
    toast("Order is ready for pickup!");
    this.render();
  },

  completeOrder(orderId) {
    Database.updateOrderStatus(orderId, 'completed');
    toast("Order completed!");
    this.render();
  },

  updateTimers() {
    document.querySelectorAll('[id^="timer-"]').forEach(el => {
      const targetTime = parseInt(el.getAttribute('data-target') || 0);
      const status = el.getAttribute('data-status');

      if (status === 'ready') {
        el.textContent = "Ready";
        el.className = "dashboard-timer urgency-low";
        return;
      }

      if (!targetTime) return;

      const timeLeft = targetTime - Date.now();

      el.className = "dashboard-timer";

      if (timeLeft <= 0) {
        el.textContent = "Overdue";
        el.classList.add("urgency-overdue");
      } else {
        const mins = Math.floor(timeLeft / 60000);
        const secs = Math.floor((timeLeft % 60000) / 1000);
        const displaySecs = secs < 10 ? '0' + secs : secs;
        const displayMins = mins < 10 ? '0' + mins : mins;
        
        el.textContent = `${displayMins}:${displaySecs}`;

        if (mins < 3) {
          el.classList.add("urgency-high");
        } else if (mins < 10) {
          el.classList.add("urgency-medium");
        } else {
          el.classList.add("urgency-low");
        }
      }
    });
  }
};

window.DashboardEngine = DashboardEngine;

/* ---------- Dom Loaded Init ---------- */
document.addEventListener("DOMContentLoaded", ()=>{
  initAmbientControl();
  initNav();
  initReveal();
  initEmbers();
  initMenuPage();
  initCartPage();
  initReservationForm();
  DashboardEngine.init();
  Cart.updateBadge();
});
