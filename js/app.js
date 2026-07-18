/* =========================================================
   PRIME SIP KITCHEN — Shared Application Logic & Media Engine
   ========================================================= */

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
  synthInterval: null,
  isPlaying: false,

  init() {
    if (this.audioCtx) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    this.audioCtx = new AudioContext();
    this.masterVolume = this.audioCtx.createGain();
    this.masterVolume.gain.value = 0.15; // Soft ambient volume
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
    osc1.frequency.setValueAtTime(880, now); // A5 note
    osc1.frequency.exponentialRampToValueAtTime(1760, now + 0.12);
    
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(1320, now); // E6 note
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

  // Generates a soft, warm jazz lounge backing progression dynamically
  startAmbientMusic() {
    this.init();
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }

    this.isPlaying = true;
    const chords = [
      [146.83, 185.00, 220.00, 277.18], // Dmaj7 (Warm, relaxing)
      [164.81, 196.00, 246.94, 293.66], // Em7
      [130.81, 164.81, 196.00, 261.63], // Cmaj7
      [110.00, 138.59, 164.81, 220.00]  // A7
    ];
    let chordIndex = 0;

    const playNextChord = () => {
      if (!this.isPlaying) return;
      const now = this.audioCtx.currentTime;
      const notes = chords[chordIndex];

      notes.forEach((freq) => {
        const osc = this.audioCtx.createOscillator();
        const filter = this.audioCtx.createBiquadFilter();
        const gain = this.audioCtx.createGain();

        // Low-pass filtered triangle waves sound like soft electric pianos
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(450, now);
        filter.frequency.exponentialRampToValueAtTime(250, now + 4);

        gain.gain.setValueAtTime(0, now);
        // Soft attack
        gain.gain.linearRampToValueAtTime(0.06, now + 1.2);
        // Long decay
        gain.gain.exponentialRampToValueAtTime(0.001, now + 5.8);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterVolume);

        osc.start(now);
        osc.stop(now + 6);
      });

      chordIndex = (chordIndex + 1) % chords.length;
    };

    // Play immediately and cycle every 6 seconds
    playNextChord();
    this.synthInterval = setInterval(playNextChord, 6000);
  },

  stopAmbientMusic() {
    this.isPlaying = false;
    if (this.synthInterval) {
      clearInterval(this.synthInterval);
      this.synthInterval = null;
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

/* ---------- Cart / checkout page ---------- */
function initCartPage(){
  const root = document.querySelector("[data-cart-root]");
  if(!root) return;

  const empty = document.querySelector("[data-cart-empty]");
  const layout = document.querySelector("[data-cart-layout]");

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
      if(!name || !phone){ toast("Please fill in your name and phone number"); return; }

      payBtn.disabled = true;
      payBtn.textContent = "Processing…";

      setTimeout(()=>{
        payBtn.textContent = "Order Confirmed ✓";
        toast("Payment simulated — your order has been placed");
        Cart.clear();
        setTimeout(()=> render(), 600);
      }, 1400);
    });
  }

  render();
}

document.addEventListener("DOMContentLoaded", ()=>{
  initAmbientControl();
  initNav();
  initReveal();
  initEmbers();
  initMenuPage();
  initCartPage();
  Cart.updateBadge();
});
