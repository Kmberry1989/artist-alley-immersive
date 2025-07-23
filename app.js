// --- Mute Button Logic ---
document.addEventListener('DOMContentLoaded', () => {
  const muteBtn = document.getElementById('mute-btn');
  const muteIcon = document.getElementById('mute-icon');
  const ambient = document.getElementById('ambient-audio');
  let muted = false;
  let muteFadeTimer = null;
  function showMuteBtn() {
    if (muteBtn) {
      muteBtn.classList.add('visible');
      muteBtn.style.opacity = '1';
      if (muteFadeTimer) clearTimeout(muteFadeTimer);
      muteFadeTimer = setTimeout(() => {
        muteBtn.classList.remove('visible');
        muteBtn.style.opacity = '0';
      }, 2500);
    }
  }
  if (muteBtn) {
    muteBtn.addEventListener('click', () => {
      muted = !muted;
      if (ambient) ambient.muted = muted;
      if (muteIcon) muteIcon.textContent = muted ? '🔇' : '🔊';
      showMuteBtn();
    });
  }
  // Show on any user interaction
  ['mousemove','mousedown','touchstart','keydown'].forEach(evt => {
    document.addEventListener(evt, showMuteBtn);
  });
  // Set initial state
  if (ambient) ambient.muted = muted;
  if (muteIcon) muteIcon.textContent = muted ? '🔇' : '🔊';
});
// --- Ambient Audio and UI Fade ---
let ambientStarted = false;
function startAmbientAudio() {
  if (ambientStarted) return;
  const audio = document.getElementById('ambient-audio');
  if (audio) {
    audio.volume = 0.33;
    audio.play().catch(() => {});
    ambientStarted = true;
  }
}
document.addEventListener('click', startAmbientAudio, { once: true });
document.addEventListener('touchstart', startAmbientAudio, { once: true });

function playFootstep() {
  const audio = document.getElementById('footstep-audio');
  if (audio) {
    audio.currentTime = 0;
    audio.volume = 0.5;
    audio.play().catch(() => {});
  }
}

// --- UI Fade on Idle ---
let uiIdleTimer = null;
function setUIIdle() {
  document.querySelector('.ui-overlay')?.classList.add('idle');
}
function clearUIIdle() {
  document.querySelector('.ui-overlay')?.classList.remove('idle');
  if (uiIdleTimer) clearTimeout(uiIdleTimer);
  uiIdleTimer = setTimeout(setUIIdle, 2000);
}
['mousemove','mousedown','touchstart','keydown'].forEach(evt => {
  document.addEventListener(evt, clearUIIdle);
});
setTimeout(setUIIdle, 3000);

// --- Artwork info toggle ---
let infoVisible = true;
function showArtworkInfo(show = true) {
  const info = document.getElementById('artwork-info');
  if (!info) return;
  if (show) {
    info.classList.add('visible');
    infoVisible = true;
  } else {
    info.classList.remove('visible');
    infoVisible = false;
  }
}
function toggleArtworkInfo() {
  showArtworkInfo(!infoVisible);
}
document.addEventListener('DOMContentLoaded', () => {
  const img = document.getElementById('current-artwork-image');
  if (img) {
    img.addEventListener('click', toggleArtworkInfo);
    img.addEventListener('touchstart', toggleArtworkInfo);
  }
});

// --- Tap/Swipe Navigation ---
document.addEventListener('DOMContentLoaded', () => {
  // Tap zones
  const left = document.getElementById('tap-zone-left');
  const right = document.getElementById('tap-zone-right');
  if (left) left.addEventListener('click', () => { if (window.app) { window.app.previousArtwork(); playFootstep(); } });
  if (right) right.addEventListener('click', () => { if (window.app) { window.app.nextArtwork(); playFootstep(); } });
});

// --- Enhance navigation to play footstep sound ---
// These overrides require the ArtistAlleyApp class to be defined. They are
// applied once the DOM is ready to ensure the class is available.
function enhanceNavigationWithFootsteps() {
  const origPrev = ArtistAlleyApp.prototype.previousArtwork;
  ArtistAlleyApp.prototype.previousArtwork = function() {
    playFootstep();
    origPrev.call(this);
  };

  const origNext = ArtistAlleyApp.prototype.nextArtwork;
  ArtistAlleyApp.prototype.nextArtwork = function() {
    playFootstep();
    origNext.call(this);
  };

  const origGoTo = ArtistAlleyApp.prototype.goToArtwork;
  ArtistAlleyApp.prototype.goToArtwork = function(index) {
    playFootstep();
    origGoTo.call(this, index);
  };
}

document.addEventListener('DOMContentLoaded', enhanceNavigationWithFootsteps);

// --- Responsive text fix for modals (resize observer) ---
if (window.ResizeObserver) {
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.modal-info, .artwork-plaque').forEach(el => {
      new ResizeObserver(() => {
        el.style.fontSize = '';
        if (el.scrollHeight > el.clientHeight) {
          el.style.fontSize = '0.95em';
        }
      }).observe(el);
    });
  });
}


// --- All helper functions at the top-level scope, before any class definitions ---
function randomInt(a, b) { return Math.floor(Math.random() * (b - a + 1)) + a; }
function createBrickIntricacies() {
  const container = document.getElementById('brick-intricacies');
  if (!container) return;
  container.innerHTML = '';
  for (let i = 0; i < 18; i++) {
    const div = document.createElement('div');
    div.className = 'brick-intricacy-shape';
    div.style.width = randomInt(24, 60) + 'px';
    div.style.height = randomInt(8, 22) + 'px';
    div.style.left = randomInt(2, 95) + '%';
    div.style.top = randomInt(2, 90) + '%';
    div.style.transform = `rotate(${randomInt(-18, 18)}deg)`;
    div.style.opacity = (Math.random() * 0.18 + 0.08).toFixed(2);
    container.appendChild(div);
  }
}
function createPlantIntricacies() {
  const container = document.getElementById('plant-intricacies');
  if (!container) return;
  container.innerHTML = '';
  for (let i = 0; i < 6; i++) {
    const div = document.createElement('div');
    div.className = 'plant-intricacy-shape';
    div.style.width = randomInt(18, 38) + 'px';
    div.style.height = randomInt(28, 60) + 'px';
    div.style.left = randomInt(3, 90) + '%';
    div.style.top = randomInt(60, 95) + '%';
    div.style.transform = `rotate(${randomInt(-30, 30)}deg)`;
    div.style.opacity = (Math.random() * 0.18 + 0.08).toFixed(2);
    container.appendChild(div);
  }
}
function createBenchIntricacies() {
  const container = document.getElementById('bench-intricacies');
  if (!container) return;
  container.innerHTML = '';
  for (let i = 0; i < 3; i++) {
    const div = document.createElement('div');
    div.className = 'bench-intricacy-shape';
    div.style.width = randomInt(30, 60) + 'px';
    div.style.height = randomInt(10, 18) + 'px';
    div.style.left = randomInt(60, 85) + '%';
    div.style.top = randomInt(80, 95) + '%';
    div.style.transform = `rotate(${randomInt(-10, 10)}deg)`;
    div.style.opacity = (Math.random() * 0.15 + 0.08).toFixed(2);
    container.appendChild(div);
  }
}
function maybeShowCarriage() {
  const carriage = document.getElementById('vintage-carriage');
  if (!carriage) return;
  if (Math.random() < 0.33) {
    carriage.style.display = 'block';
    carriage.innerHTML = `<svg class="vintage-carriage-svg" viewBox="0 0 120 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="20" width="80" height="28" rx="8" fill="#b22222" stroke="#7a1818" stroke-width="3"/>
      <ellipse cx="30" cy="52" rx="12" ry="8" fill="#222" stroke="#7a1818" stroke-width="3"/>
      <ellipse cx="80" cy="52" rx="12" ry="8" fill="#222" stroke="#7a1818" stroke-width="3"/>
      <rect x="70" y="10" width="18" height="18" rx="4" fill="#fff8f0" stroke="#b22222" stroke-width="2"/>
      <rect x="18" y="10" width="18" height="18" rx="4" fill="#fff8f0" stroke="#b22222" stroke-width="2"/>
      <rect x="50" y="5" width="20" height="15" rx="4" fill="#fff8f0" stroke="#b22222" stroke-width="2"/>
    </svg>`;
  } else {
    carriage.style.display = 'none';
    carriage.innerHTML = '';
  }
}
function renderIntricacies() {
  createBrickIntricacies();
  createPlantIntricacies();
  createBenchIntricacies();
  maybeShowCarriage();
}

function spawnVisitors() {
  const ground = document.querySelector('.ground-elements');
  if (!ground) return;
  ground.querySelectorAll('.visitor').forEach(v => v.remove());
  const count = Math.random() < 0.5 ? 0 : randomInt(1, 3);
  for (let i = 0; i < count; i++) {
    const div = document.createElement('div');
    div.className = 'visitor';
    div.style.left = randomInt(5, 90) + '%';
    ground.appendChild(div);
  }
}

function triggerBlink() {
  const overlay = document.getElementById('blink-overlay');
  if (!overlay) return;
  overlay.classList.remove('blinking');
  // Force reflow to restart the animation
  void overlay.offsetWidth;
  overlay.classList.add('blinking');
}

function parseDimensions(dimStr) {
  if (!dimStr) return { width: 48, height: 48 };
  const parts = dimStr.split('x').map(p => p.trim());
  const parsePart = (p) => {
    let ft = 0;
    let inch = 0;
    const ftMatch = p.match(/(\d+(?:\.\d+)?)'/);
    const inMatch = p.match(/(\d+(?:\.\d+)?)\"/);
    if (ftMatch) ft = parseFloat(ftMatch[1]);
    if (inMatch) inch = parseFloat(inMatch[1]);
    if (!ftMatch && !inMatch) {
      const num = parseFloat(p);
      if (!isNaN(num)) inch = num;
    }
    return ft * 12 + inch;
  };
  const w = parsePart(parts[0] || '');
  const h = parsePart(parts[1] || parts[0] || '');
  return { width: w || 48, height: h || 48 };
}
function getArtworkImageSrc(title) {
  const map = {
    "Highland Covered Bridge": "HighlandCoveredBridge.jpg",
    "Complex Autumn": "ComplexAutumn.PNG",
    "Righteous Judgement": "RighteousJudgement.jpg",
    "Fairy House": "FairyHouse.jpg",
    "Kittyo's Rainbow": "KittyosRainbow.png",
    "AI USA": "AiUsa.PNG",
    "Grow & Glow": "GrowandGlow.PNG",
    "Broken": "Broken.PNG",
    "My Mind's Eye": "MyMindsEye.jpg",
    "Flowers for Kokomo": "FlowersforKokomo.jpg",
    "Radiant Wilds": "RadiantWild.jpg",
    "Joan and Magdalena": "JoanandMagdalena.png",
    "Wildflower": "Wildflower.PNG",
    "Seeds of Hope": "SeedsofHope.png",
    "Guardians of the Void": "GuardiansoftheVoid.jpg",
    "Bridge Over Troubled Waters": "BridgeOverTroubledWater1.jpg"
  };
  return `assets/image/${map[title] || 'HighlandCoveredBridge.jpg'}`;
}
function getArtworkUSDZSrc(title) {
  const map = {
    "Highland Covered Bridge": "HighlandCoveredBridge.usdz.usdz",
    "Complex Autumn": "ComplexAutumn.usdz.usdz",
    "Righteous Judgement": "RighteousJudgement.usdz.usdz",
    "Fairy House": "FairyHouse.usdz.usdz",
    "Kittyo's Rainbow": "KittyosRainbow.usdz.usdz",
    "AI USA": "AIUSA.usdz.usdz",
    "Grow & Glow": "GrowandGlow.usdz.usdz",
    "Broken": "Broken.usdz.usdz",
    "My Mind's Eye": "MyMindsEye.usdz.usdz",
    "Flowers for Kokomo": "FlowersforKokomo.usdz.usdz",
    "Radiant Wilds": "Radiant wild.usdz.usdz",
    "Joan and Magdalena": "JoanandMagdalena.usdz.usdz",
    "Wildflower": "Wildflower.usdz.usdz",
    "Seeds of Hope": "SeedsofHope.usdz.usdz",
    "Guardians of the Void": "GuardiansoftheVoid.usdz.usdz",
    "Bridge Over Troubled Waters": "BridgeOverTroubledWater1.usdz.usdz"
  };
  return `assets/augmented/${map[title] || 'HighlandCoveredBridge.usdz.usdz'}`;
}
function openARQuickLook(title) {
  const usdz = getArtworkUSDZSrc(title);
  const mv = document.getElementById('ar-model-viewer');
  if (mv) {
    mv.setAttribute('src', usdz);
  }
  if (app && app.modalController) {
    app.modalController.showARModal();
  }
  const a = document.createElement('a');
  a.href = usdz;
  a.rel = 'ar';
  a.setAttribute('download', '');
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  setTimeout(() => document.body.removeChild(a), 100);
}
// Re-render on load and occasionally (for subtle animation)
document.addEventListener('DOMContentLoaded', () => {
  renderIntricacies();
  spawnVisitors();
  setInterval(renderIntricacies, 12000);
});
// Artist Alley Virtual Experience - Interactive Controller

/* ==============================
   Artwork Data
============================== */
const artworks = [
  {
    id: 1,
    title: "Highland Covered Bridge",
    artist: "Alyson Hatcher-Kendall",
    medium: "acrylic on marine board",
    dimensions: "4' x 4'",
    price: "$300",
    status: "available",
    description: "A stunning representation of Indiana's covered bridge heritage, capturing the rustic charm and architectural beauty of these historic structures that dot the Hoosier countryside.",
    artistBio: "Alyson Hatcher-Kendall is a local artist who specializes in capturing Indiana's architectural heritage through vibrant acrylic paintings."
  },
  {
    id: 2,
    title: "Complex Autumn",
    artist: "Dajanell Johnson",
    medium: "acrylic on marine board",
    dimensions: "3' x 4'",
    price: "$300",
    status: "available",
    description: "An intricate exploration of fall's rich palette, layering colors and textures to create depth and seasonal warmth that celebrates Indiana's beautiful autumn landscapes.",
    artistBio: "Dajanell Johnson creates expressive paintings that celebrate the natural beauty of the Midwest through bold colors and dynamic compositions."
  },
  {
    id: 3,
    title: "Righteous Judgement",
    artist: "Deb Edwards",
    medium: "acrylic on marine board",
    dimensions: "5'6\" x 3'",
    price: "request price",
    status: "available",
    description: "A powerful composition that invites contemplation on themes of justice and moral reflection, rendered with striking imagery and symbolic depth.",
    artistBio: "Deb Edwards creates thought-provoking artwork that explores social themes and human nature through compelling visual narratives."
  },
  {
    id: 4,
    title: "Fairy House",
    artist: "Lana Kirtley",
    medium: "fabric on marine board",
    dimensions: "4' x 4'",
    price: "$300",
    status: "available",
    description: "A whimsical textile creation that brings enchantment and wonder to life through innovative fabric artistry and imaginative design.",
    artistBio: "Lana Kirtley is a fiber artist who transforms fabric into magical worlds, blending traditional textile techniques with contemporary artistic vision."
  },
  {
    id: 5,
    title: "Kittyo's Rainbow",
    artist: "Jaetta Hall",
    medium: "acrylic and fabric",
    dimensions: "72\" x 80\"",
    price: "$160",
    status: "available",
    description: "A joyful mixed-media piece combining paint and fabric to create a vibrant, uplifting composition that radiates positivity and creative energy.",
    artistBio: "Jaetta Hall combines multiple mediums to create uplifting artwork that brings joy and color to community spaces."
  },
  {
    id: 6,
    title: "AI USA",
    artist: "Patrick Redmon",
    medium: "AI art printed on aluminum",
    dimensions: "4' x 5'",
    price: "$800",
    status: "available",
    description: "A cutting-edge exploration of American themes through artificial intelligence, printed on durable aluminum for permanent outdoor display.",
    artistBio: "Patrick Redmon pushes artistic boundaries by exploring the intersection of technology and traditional American imagery through AI-generated art."
  },
  {
    id: 7,
    title: "Grow & Glow",
    artist: "Mia Flowers",
    medium: "acrylic on marine board",
    dimensions: "4' x 6'",
    price: "$275",
    status: "available",
    description: "An inspiring piece about growth and inner radiance, painted with vibrant acrylics that seem to emanate light and positive energy.",
    artistBio: "Mia Flowers creates uplifting artwork that celebrates personal growth and the radiant potential within each individual."
  },
  {
    id: 8,
    title: "Broken",
    artist: "Ramona \"Mona\" Daniels",
    medium: "acrylic on marine board",
    dimensions: "2' x 4'",
    price: "$715",
    status: "available",
    description: "A raw and honest exploration of resilience, transforming themes of fragility into powerful artistic expression about healing and strength.",
    artistBio: "Mona Daniels creates emotionally powerful artwork that addresses themes of struggle, healing, and the human capacity for resilience."
  },
  {
    id: 9,
    title: "My Mind's Eye",
    artist: "Sam Prifogle",
    medium: "acrylic on marine board",
    dimensions: "4' x 5'",
    price: "$500",
    status: "available",
    description: "An introspective journey into the artist's inner vision, revealing layers of consciousness through bold brushwork and psychological imagery.",
    artistBio: "Sam Prifogle explores the inner landscape of human consciousness through abstract and symbolic artistic expressions."
  },
  {
    id: 10,
    title: "Flowers for Kokomo",
    artist: "Oscar Toloza",
    medium: "acrylic on marine board",
    dimensions: "8' x 8'",
    price: "request price",
    status: "available",
    description: "A grand floral tribute to the city of Kokomo, celebrating community beauty through an impressive large-scale composition that honors local pride.",
    artistBio: "Oscar Toloza creates large-scale public artwork that celebrates community identity and local pride through vibrant, accessible imagery."
  },
  {
    id: 11,
    title: "Radiant Wilds",
    artist: "Michelle Sutton",
    medium: "interior/exterior spray paint",
    dimensions: "8' x 8'",
    price: "$3,000",
    status: "available",
    description: "A stunning large-scale work that captures the untamed beauty of nature through innovative spray paint techniques and bold environmental themes.",
    artistBio: "Michelle Sutton specializes in large-scale outdoor murals that celebrate the natural world through contemporary spray paint artistry."
  },
  {
    id: 12,
    title: "Joan and Magdalena",
    artist: "Tarja Harney",
    medium: "acrylic and spray paint",
    dimensions: "3' x 3'",
    price: "$200",
    status: "available",
    description: "An intimate portrait study combining traditional and contemporary painting methods to honor feminine strength and spiritual connection.",
    artistBio: "Tarja Harney creates portraits that celebrate the strength and spirituality of women through mixed media techniques."
  },
  {
    id: 13,
    title: "Wildflower",
    artist: "Rose Bloom",
    medium: "acrylic on marine board",
    dimensions: "4' x 6'",
    price: "$1000",
    status: "available",
    description: "A delicate botanical study that celebrates the wild beauty of Indiana's native flora with exquisite detail and natural authenticity.",
    artistBio: "Rose Bloom specializes in botanical artwork that captures the delicate beauty and ecological importance of native Indiana plant life."
  },
  {
    id: 14,
    title: "Seeds of Hope",
    artist: "Lesley Wysong",
    medium: "acrylic on marine board",
    dimensions: "4' x 6'8\"",
    price: "$450",
    status: "available",
    description: "An uplifting work about potential and growth, symbolizing the transformative power of hope and community investment in the future.",
    artistBio: "Lesley Wysong creates artwork that explores themes of hope, growth, and community transformation through symbolic imagery."
  },
  {
    id: 15,
    title: "Guardians of the Void",
    artist: "Marcia Blacklidge",
    medium: "mixed media",
    dimensions: "4' x 6'",
    price: "request price",
    status: "available",
    description: "A mysterious and compelling mixed-media exploration of protection and the unknown, rich with symbolic depth and spiritual undertones.",
    artistBio: "Marcia Blacklidge creates mystical mixed-media artwork that explores themes of protection, spirituality, and the unknown through symbolic imagery."
  },
  {
    id: 16,
    title: "Bridge Over Troubled Waters",
    artist: "Troy Caldwell",
    medium: "granite",
    dimensions: "60\" x 24\" x 16\"",
    price: "$3,000",
    status: "available",
    description: "A powerful three-dimensional granite work that speaks to overcoming challenges and finding connection across divides, both literal and metaphorical.",
    artistBio: "Troy Caldwell is a sculptor who works in stone to create monuments to human resilience and the power of connection across differences."
  }
];

/* ==============================
   Global State
============================== */
let currentArtworkIndex = 0;
let isTransitioning = false;
let touchStartX = 0;
let touchStartY = 0;
let touchStartTime = 0;

/* ==============================
   Utility Functions
============================== */
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function lerp(start, end, factor) {
  return start + (end - start) * factor;
}

/* ==============================
   Parallax System
============================== */
class ParallaxController {
  constructor() {
    this.layers = {
      background: { element: $('.background-layer'), speed: 0.2 },
      midground: { element: $('.midground-layer'), speed: 0.4 },
      lights: { element: $('.lights-layer'), speed: 0.6 },
      artwork: { element: $('.artwork-layer'), speed: 1.0 },
      foreground: { element: $('.foreground-layer'), speed: 1.4 }
    };
    this.basePosition = 0;
    this.targetPosition = 0;
  }

  moveToPosition(direction) {
    if (isTransitioning) return;

    const moveDistance = direction * 100; // Percentage of screen width
    this.targetPosition += moveDistance;

    // Apply different speeds to each layer for parallax effect
    Object.keys(this.layers).forEach(layerName => {
      const layer = this.layers[layerName];
      if (layer.element) {
        const layerDistance = moveDistance * layer.speed;
        const currentTransform = getComputedStyle(layer.element).transform;
        const currentX = this.getTransformX(currentTransform);
        const currentY = this.getTransformY(currentTransform);
        const newX = currentX - layerDistance;

        layer.element.style.transform = `translate(${newX}px, ${currentY}px)`;
      }
    });
  }

  getTransformY(transformString) {
    if (transformString === 'none') return 0;
    const values = transformString.split('(')[1].split(')')[0].split(',');
    return parseFloat(values[5]) || 0;
  }

  cameraJog() {
    const offset = randomInt(-15, 15);
    Object.keys(this.layers).forEach(layerName => {
      const layer = this.layers[layerName];
      if (layer.element) {
        const currentTransform = getComputedStyle(layer.element).transform;
        const currentX = this.getTransformX(currentTransform);
        const currentY = this.getTransformY(currentTransform);
        layer.element.style.transition = 'transform 0.4s ease';
        layer.element.style.transform = `translate(${currentX}px, ${currentY + offset}px)`;
        setTimeout(() => {
          layer.element.style.transform = `translate(${currentX}px, ${currentY}px)`;
        }, 400);
      }
    });
  }

  getTransformX(transformString) {
    if (transformString === 'none') return 0;
    const values = transformString.split('(')[1].split(')')[0].split(',');
    return parseFloat(values[4]) || 0;
  }

  reset() {
    Object.keys(this.layers).forEach(layerName => {
      const layer = this.layers[layerName];
      if (layer.element) {
        layer.element.style.transform = 'translateX(0)';
      }
    });
    this.basePosition = 0;
    this.targetPosition = 0;
  }
}

/* ==============================
   Artwork Display Controller
============================== */
class ArtworkDisplay {
  constructor() {
    this.titleEl = $('#artwork-title');
    this.artistEl = $('#artwork-artist');
    this.detailsEl = $('#artwork-details');
    this.descEl = $('#artwork-description');
    this.bioEl = $('#artwork-artist-bio');
    this.placeholderEl = $('#artwork-placeholder');
    this.progressFillEl = $('#progress-fill');
    this.progressTextEl = $('#progress-text');
  }

  updateArtwork(index) {
    const artwork = artworks[index];
    if (!artwork) return;

    showArtworkInfo();

    // Update main display
    if (this.titleEl) this.titleEl.textContent = artwork.title;
    if (this.artistEl) this.artistEl.textContent = `by ${artwork.artist}`;
    if (this.detailsEl) this.detailsEl.textContent = `${artwork.medium} • ${artwork.dimensions} • ${artwork.price}`;
    if (this.descEl) this.descEl.textContent = artwork.description;
    if (this.bioEl) this.bioEl.textContent = artwork.artistBio;
    if (this.placeholderEl) this.placeholderEl.textContent = artwork.title;

    // Update image
    const imgEl = document.getElementById('artwork-img');
    if (imgEl) {
      imgEl.src = getArtworkImageSrc(artwork.title);
      imgEl.alt = artwork.title;
    }
    // Update AR button
    const arBtn = document.getElementById('ar-btn');
    if (arBtn) {
      arBtn.onclick = () => openARQuickLook(artwork.title);
    }

    // Scale artwork frame based on dimensions
    const dims = parseDimensions(artwork.dimensions);
    const widthFt = dims.width / 12;
    const heightFt = dims.height / 12;
    const widthPx = Math.round(clamp(widthFt * 50, 160, 480));
    const heightPx = Math.round(clamp(heightFt * 60, 220, 560));
    document.documentElement.style.setProperty('--artwork-frame-width', `${widthPx}px`);
    document.documentElement.style.setProperty('--artwork-frame-height', `${heightPx}px`);

    // Update progress indicator
    const progress = ((index + 1) / artworks.length) * 100;
    if (this.progressFillEl) {
      this.progressFillEl.style.width = `${progress}%`;
    }
    if (this.progressTextEl) {
      this.progressTextEl.textContent = `${index + 1} of ${artworks.length}`;
    }

    // Update thumbnail active state
    this.updateThumbnailActive(index);

    // Trigger spotlight animation
    this.animateSpotlight();
  }

  animateSpotlight() {
    const spotlight = $('.artwork-spotlight');
    if (spotlight) {
      spotlight.style.opacity = '0';
      setTimeout(() => {
        spotlight.style.opacity = '1';
      }, 200);
    }
  }

  updateThumbnailActive(index) {
    $$('.thumbnail').forEach((thumb, i) => {
      thumb.classList.toggle('active', i === index);
    });
  }
}

/* ==============================
   Touch Gesture Handler
============================== */
class TouchHandler {
  constructor() {
    this.bindEvents();
    this.minSwipeDistance = 50;
    this.maxSwipeTime = 300;
  }

  bindEvents() {
    const container = $('.alley-container');
    if (!container) return;

    // Touch events
    container.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: true });
    container.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: true });
    
    // Mouse events for desktop testing
    container.addEventListener('mousedown', this.handleMouseStart.bind(this));
    container.addEventListener('mouseup', this.handleMouseEnd.bind(this));
    
    // Prevent context menu on long press
    container.addEventListener('contextmenu', (e) => e.preventDefault());
  }

  handleTouchStart(e) {
    const touch = e.touches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
    touchStartTime = Date.now();
  }

  handleTouchEnd(e) {
    if (!touchStartX || !touchStartY) return;

    const touch = e.changedTouches[0];
    const touchEndX = touch.clientX;
    const touchEndY = touch.clientY;
    const touchEndTime = Date.now();

    this.processSwipe(touchStartX, touchStartY, touchEndX, touchEndY, touchEndTime - touchStartTime);
  }

  handleMouseStart(e) {
    touchStartX = e.clientX;
    touchStartY = e.clientY;
    touchStartTime = Date.now();
  }

  handleMouseEnd(e) {
    if (!touchStartX || !touchStartY) return;

    const touchEndTime = Date.now();
    this.processSwipe(touchStartX, touchStartY, e.clientX, e.clientY, touchEndTime - touchStartTime);
  }

  processSwipe(startX, startY, endX, endY, duration) {
    const deltaX = endX - startX;
    const deltaY = endY - startY;
    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);

    // Reset touch coordinates
    touchStartX = 0;
    touchStartY = 0;

    // Check if it's a valid swipe
    if (absDeltaX < this.minSwipeDistance) return;
    if (absDeltaY > absDeltaX * 0.3) return; // Too vertical
    if (duration > this.maxSwipeTime) return; // Too slow

    // Determine direction and trigger navigation
    if (deltaX > 0) {
      // Swipe right - previous artwork
      if (window.app) window.app.previousArtwork();
    } else {
      // Swipe left - next artwork
      if (window.app) window.app.nextArtwork();
    }
  }
}

/* ==============================
   Modal Controllers
============================== */
class ModalController {
  constructor() {
    this.bindEvents();
  }

  bindEvents() {
    // Wait for DOM to be ready before binding events
    const bindWhenReady = () => {


      // AR preview modal
      const takeHomeBtn = $('#take-home-btn');
      const arModal = $('#ar-modal');
      const arClose = $('#ar-close');
      const arResize = $('#ar-resize');
      const arPurchase = $('#ar-purchase');
      const interestBtn = $('#interest-btn');
      const actionOverlay = $('#action-overlay');

      const hideActionOverlay = () => {
        if (actionOverlay) actionOverlay.classList.remove('visible');
      };

      if (interestBtn) {
        interestBtn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          if (actionOverlay) actionOverlay.classList.toggle('visible');
        });
      }
      document.addEventListener('click', (e) => {
        if (!actionOverlay || !interestBtn) return;
        if (actionOverlay.classList.contains('visible') &&
            !actionOverlay.contains(e.target) &&
            e.target !== interestBtn) {
          actionOverlay.classList.remove('visible');
        }
      });

      if (takeHomeBtn) {
        takeHomeBtn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          hideActionOverlay();
          this.showARModal();
        });
      }
      if (arClose) {
        arClose.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.hideARModal();
        });
      }
      if (arModal) {
        arModal.addEventListener('click', (e) => {
          if (e.target === arModal) this.hideARModal();
        });
      }
      if (arResize) {
        arResize.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          // Simulate resize functionality
          console.log('AR resize triggered');
        });
      }
      if (arPurchase) {
        arPurchase.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.hideARModal();
          this.showContactModal();
        });
      }

      // Contact modal
      const contactBtn = $('#contact-btn');
      const contactModal = $('#contact-modal');
      const contactClose = $('#contact-close');
      const contactCancel = $('#contact-cancel');
      const contactForm = $('#contact-form');

      if (contactBtn) {
        contactBtn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          hideActionOverlay();
          this.showContactModal();
        });
      }
      if (contactClose) {
        contactClose.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.hideContactModal();
        });
      }
      if (contactCancel) {
        contactCancel.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.hideContactModal();
        });
      }
      if (contactModal) {
        contactModal.addEventListener('click', (e) => {
          if (e.target === contactModal) this.hideContactModal();
        });
      }
      if (contactForm) {
        contactForm.addEventListener('submit', (e) => this.handleContactSubmit(e));
      }

      // Price watch modal
      const watchBtn = $('#watch-btn');
      const watchModal = $('#watch-modal');
      const watchClose = $('#watch-close');
      const watchCancel = $('#watch-cancel');
      const watchForm = $('#watch-form');

      if (watchBtn) {
        watchBtn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          hideActionOverlay();
          this.showWatchModal();
        });
      }
      if (watchClose) {
        watchClose.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.hideWatchModal();
        });
      }
      if (watchCancel) {
        watchCancel.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.hideWatchModal();
        });
      }
      if (watchModal) {
        watchModal.addEventListener('click', (e) => {
          if (e.target === watchModal) this.hideWatchModal();
        });
      }
      if (watchForm) {
        watchForm.addEventListener('submit', (e) => this.handleWatchSubmit(e));
      }
    };

    // Bind immediately or wait for DOM
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', bindWhenReady);
    } else {
      bindWhenReady();
    }
  }


  showARModal() {
    const artwork = artworks[currentArtworkIndex];
    if (!artwork) return;

    const arTitle = $('#ar-artwork-title');
    const modelViewer = document.getElementById('ar-model-viewer');
    const arDesc = $('#ar-description');
    const arBio = $('#ar-artist-bio');

    if (arTitle) arTitle.textContent = artwork.title;
    if (modelViewer) modelViewer.setAttribute('src', getArtworkUSDZSrc(artwork.title));
    if (arDesc) arDesc.textContent = artwork.description;
    if (arBio) arBio.textContent = artwork.artistBio;

    const modal = $('#ar-modal');
    if (modal) modal.classList.add('active');
  }

  hideARModal() {
    const modal = $('#ar-modal');
    if (modal) modal.classList.remove('active');
  }

  showContactModal() {
    const artwork = artworks[currentArtworkIndex];
    if (!artwork) return;

    const contactTitle = $('#contact-artwork-title');
    if (contactTitle) contactTitle.textContent = `"${artwork.title}" by ${artwork.artist}`;

    const modal = $('#contact-modal');
    if (modal) modal.classList.add('active');
  }

  hideContactModal() {
    const modal = $('#contact-modal');
    if (modal) modal.classList.remove('active');
  }

  handleContactSubmit(e) {
    e.preventDefault();
    
    const name = $('#contact-name').value;
    const email = $('#contact-email').value;
    const message = $('#contact-message').value;
    const artwork = artworks[currentArtworkIndex];

    fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        email,
        message,
        artwork: artwork.title,
        artist: artwork.artist
      })
    })
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(() => {
        alert(`Thank you, ${name}! Your inquiry about "${artwork.title}" has been sent.`);
        e.target.reset();
        this.hideContactModal();
      })
      .catch(() => alert('Sorry, there was an error sending your message.'));
  }

  showWatchModal() {
    const artwork = artworks[currentArtworkIndex];
    if (!artwork) return;

    const watchTitle = $('#watch-artwork-title');
    if (watchTitle) watchTitle.textContent = `"${artwork.title}" by ${artwork.artist}`;

    const modal = $('#watch-modal');
    if (modal) modal.classList.add('active');
  }

  hideWatchModal() {
    const modal = $('#watch-modal');
    if (modal) modal.classList.remove('active');
  }

  handleWatchSubmit(e) {
    e.preventDefault();

    const name = $('#watch-name').value;
    const contact = $('#watch-contact').value;
    const artwork = artworks[currentArtworkIndex];

    fetch('/api/price-watch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        contact,
        artwork: artwork.title,
        artist: artwork.artist
      })
    })
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(() => {
        alert(`Thanks, ${name}! We'll notify you at ${contact} if the price drops.`);
        e.target.reset();
        this.hideWatchModal();
      })
      .catch(() => alert('Sorry, there was an error processing your request.'));
  }
}

/* ==============================
   Main Application Controller
============================== */
class ArtistAlleyApp {
  constructor() {
    this.parallax = new ParallaxController();
    this.display = new ArtworkDisplay();
    this.touchHandler = new TouchHandler();
    this.modalController = new ModalController();
    
    this.init();
  }

  init() {
    this.createThumbnails();
    this.bindNavigationEvents();
    this.display.updateArtwork(currentArtworkIndex);
    this.hideLoadingScreen();
  }

  createThumbnails() {
    const container = $('#thumbnail-container');
    if (!container) return;

    container.innerHTML = '';
    artworks.forEach((artwork, index) => {
      const thumbnail = document.createElement('div');
      thumbnail.className = 'thumbnail';
      if (index === currentArtworkIndex) {
        thumbnail.classList.add('active');
      }
      thumbnail.textContent = artwork.title;
      thumbnail.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.goToArtwork(index);
      });
      container.appendChild(thumbnail);
    });
  }

  bindNavigationEvents() {
    const bindWhenReady = () => {
      const prevBtn = $('#prev-btn');
      const nextBtn = $('#next-btn');

      if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.previousArtwork();
        });
      }

      if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.nextArtwork();
        });
      }

      // Update button states
      this.updateNavigationButtons();
    };

    // Bind immediately or wait for DOM
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', bindWhenReady);
    } else {
      bindWhenReady();
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        this.previousArtwork();
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        this.nextArtwork();
      }
    });
  }

  previousArtwork() {
    if (isTransitioning) return;

    triggerBlink();

    const newIndex = currentArtworkIndex - 1;
    if (newIndex < 0) return;
    
    this.navigateToArtwork(newIndex, 1);
  }

  nextArtwork() {
    if (isTransitioning) return;

    triggerBlink();

    const newIndex = currentArtworkIndex + 1;
    if (newIndex >= artworks.length) return;
    
    this.navigateToArtwork(newIndex, -1);
  }

  goToArtwork(index) {
    if (isTransitioning || index === currentArtworkIndex) return;
    
    const direction = index > currentArtworkIndex ? -1 : 1;
    this.navigateToArtwork(index, direction);
  }

  navigateToArtwork(newIndex, direction) {
    if (isTransitioning) return;
    isTransitioning = true;
    const frame = document.getElementById('current-artwork-frame');
    if (frame) {
      frame.classList.add('fade-out');
    }
    setTimeout(() => {
      currentArtworkIndex = newIndex;
      this.display.updateArtwork(currentArtworkIndex);
      if (frame) {
        frame.classList.remove('fade-out');
        frame.classList.add('fade-in');
        setTimeout(() => frame.classList.remove('fade-in'), 400);
      }
      this.updateNavigationButtons();
      setTimeout(() => {
        isTransitioning = false;
      }, 400);
    }, 350);
    // Parallax movement
    this.parallax.moveToPosition(direction);
    this.parallax.cameraJog();
    renderIntricacies();
    spawnVisitors();
  }

  updateNavigationButtons() {
    const prevBtn = $('#prev-btn');
    const nextBtn = $('#next-btn');

    if (prevBtn) {
      prevBtn.disabled = currentArtworkIndex === 0;
    }

    if (nextBtn) {
      nextBtn.disabled = currentArtworkIndex === artworks.length - 1;
    }
  }

  hideLoadingScreen() {
    setTimeout(() => {
      const loadingScreen = $('#loading-screen');
      if (loadingScreen) {
        loadingScreen.classList.add('hidden');
        setTimeout(() => {
          loadingScreen.style.display = 'none';
        }, 1000);
      }
    }, 2000); // Show loading screen for 2 seconds
  }
}

/* ==============================
   Initialize Application
============================== */
let app;

function initializeApp() {
  console.log('Initializing Artist Alley Virtual Experience...');
  
  // Wait for DOM to be fully loaded
  const init = () => {
    app = new ArtistAlleyApp();
    window.app = app; // Make app globally accessible
    console.log('Artist Alley experience ready!');
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}

// Initialize when DOM is ready
initializeApp();

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    // Pause any animations when tab is hidden
  } else {
    // Resume animations when tab is visible
  }
});

// Handle orientation changes
window.addEventListener('orientationchange', () => {
  setTimeout(() => {
    // Recalculate positions after orientation change
    if (app) {
      app.display.updateArtwork(currentArtworkIndex);
    }
  }, 100);
});

// Prevent default behaviors only where needed
document.addEventListener('touchstart', (e) => {
  // Only prevent default for the alley container, not UI elements
  if (e.target.closest('.alley-container') && !e.target.closest('.ui-overlay')) {
    e.preventDefault();
  }
}, { passive: false });

// Export for debugging
window.artistAlley = {
  app: () => app,
  artworks,
  currentIndex: () => currentArtworkIndex,
  goTo: (index) => app?.goToArtwork(index),
  next: () => app?.nextArtwork(),
  prev: () => app?.previousArtwork()
};