/**
 * ============================================================
 * Design Helper Hub — script.js
 * 
 * What this file does:
 *  1. Stores all tool data in a JS array (our "database")
 *  2. Renders category cards with tool counts
 *  3. Switches between the home page and category pages
 *  4. Renders tool cards for the selected category
 *  5. Filters tools by text search (real-time)
 *  6. Filters tools by "Free Only" or "No Watermark"
 *  7. Powers the hero search bar with a dropdown
 * ============================================================
 */

// ============================================================
// 1. TOOL DATA
//    Each tool object has:
//      - name:        Display name of the tool
//      - url:         URL to open in a new tab
//      - desc:        Short description shown on the card
//      - category:    Must match a category id below
//      - free:        true = free, false = paid/freemium
//      - noWatermark: true = output has no watermark
// ============================================================
const tools = [

  // ---- Background Removal ----
  {
    name: "remove.bg",
    url: "https://www.remove.bg",
    desc: "AI-powered background removal in seconds. Best in class accuracy for portraits and objects.",
    category: "background-removal",
    free: true,
    noWatermark: false,   // Free tier adds watermark on HD download
  },
  {
    name: "Erase.bg",
    url: "https://www.erase.bg",
    desc: "Free background remover for images of humans, animals, and complex objects.",
    category: "background-removal",
    free: true,
    noWatermark: true,
  },
  {
    name: "Photopea",
    url: "https://www.photopea.com",
    desc: "Full-featured browser-based image editor. Remove backgrounds manually with professional tools — no install needed.",
    category: "background-removal",
    free: true,
    noWatermark: true,
  },
  {
    name: "Adobe Express BG Remover",
    url: "https://www.adobe.com/express/feature/image/remove-background",
    desc: "Adobe's one-click background remover, free for basic use. Clean output with a generous free tier.",
    category: "background-removal",
    free: false,        // Requires free account; HD exports are paid
    noWatermark: false,
  },

  // ---- Image Compression ----
  {
    name: "TinyPNG",
    url: "https://tinypng.com",
    desc: "Compress PNG and JPEG files up to 80% smaller using smart lossy compression. One of the most trusted tools.",
    category: "compression",
    free: true,
    noWatermark: true,
  },
  {
    name: "Squoosh",
    url: "https://squoosh.app",
    desc: "Google's open-source image compressor. Supports WebP, AVIF, MozJPEG. All processing happens in your browser.",
    category: "compression",
    free: true,
    noWatermark: true,
  },
  {
    name: "Compressor.io",
    url: "https://compressor.io",
    desc: "Lossy and lossless compression for JPEG, PNG, GIF, and SVG. Simple drag-and-drop interface.",
    category: "compression",
    free: true,
    noWatermark: true,
  },
  {
    name: "iLoveIMG Compress",
    url: "https://www.iloveimg.com/compress-image",
    desc: "Batch compress multiple images at once. Supports JPG, PNG, SVG, and GIF formats.",
    category: "compression",
    free: true,
    noWatermark: false, // Free tier has watermark on some outputs
  },

  // ---- Image Resizing ----
  {
    name: "Canva Resize",
    url: "https://www.canva.com/resize",
    desc: "Resize images for any social platform or custom dimensions. Includes templates for Instagram, Twitter, YouTube, and more.",
    category: "resizing",
    free: true,
    noWatermark: false, // Some exports require Pro
  },
  {
    name: "Simple Image Resizer",
    url: "https://www.simpleimageresizer.com",
    desc: "Straightforward tool to resize images by pixels or percentage. No upload size limits, no sign-up required.",
    category: "resizing",
    free: true,
    noWatermark: true,
  },
  {
    name: "iLoveIMG Resize",
    url: "https://www.iloveimg.com/resize-image",
    desc: "Resize one or many images at once to exact pixel dimensions or percentages. Fast and browser-based.",
    category: "resizing",
    free: true,
    noWatermark: false,
  },

  // ---- Color Tools ----
  {
    name: "Coolors",
    url: "https://coolors.co",
    desc: "Generate beautiful color palettes instantly. Hit the spacebar to cycle through thousands of harmonious combinations.",
    category: "color-tools",
    free: true,
    noWatermark: true,
  },
  {
    name: "Adobe Color",
    url: "https://color.adobe.com",
    desc: "Create palettes from images, explore trending themes, and check accessibility contrast ratios — all free.",
    category: "color-tools",
    free: true,
    noWatermark: true,
  },
  {
    name: "CSS Gradient",
    url: "https://cssgradient.io",
    desc: "Visual gradient generator that produces clean CSS code. Supports linear, radial, and conic gradients.",
    category: "color-tools",
    free: true,
    noWatermark: true,
  },
  {
    name: "Huemint",
    url: "https://huemint.com",
    desc: "AI-powered palette generator that creates brand-ready color schemes. See colors applied to real UI mockups instantly.",
    category: "color-tools",
    free: true,
    noWatermark: true,
  },
];

// ============================================================
// 2. CATEGORY METADATA
//    Maps category IDs to display info (icon, title, subtitle)
// ============================================================
const categories = {
  "background-removal": {
    icon: "🎭",
    title: "Background Removal",
    subtitle: "AI-powered tools to remove image backgrounds in one click.",
  },
  "compression": {
    icon: "🗜️",
    title: "Image Compression",
    subtitle: "Shrink file sizes dramatically while preserving visual quality.",
  },
  "resizing": {
    icon: "📐",
    title: "Image Resizing",
    subtitle: "Resize images to exact pixel dimensions or percentages.",
  },
  "color-tools": {
    icon: "🎨",
    title: "Color Tools",
    subtitle: "Palette generators, gradient builders, and color pickers.",
  },
};

// ============================================================
// 3. STATE
//    Tracks which category is active & which filter is selected
// ============================================================
let currentCategory = null;  // "background-removal", "compression", etc.
let currentFilter   = "all"; // "all" | "free" | "no-watermark"

// ============================================================
// 4. ON PAGE LOAD: fill in tool counts on the home page cards
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
  // For each category, count tools and display "X tools" inside the card
  Object.keys(categories).forEach(catId => {
    const count = tools.filter(t => t.category === catId).length;
    const el = document.getElementById(`count-${catId}`);
    if (el) el.textContent = `${count} tools`;
  });
});

// ============================================================
// 5. PAGE SWITCHING
//    showHome() → display the home page
//    showCategory(id) → display the category tool list
// ============================================================

/** Show the main homepage and hide the category page */
function showHome() {
  document.getElementById("home-page").style.display = "block";
  document.getElementById("category-page").style.display = "none";
  currentCategory = null;
  // Clear hero search when returning home
  document.getElementById("hero-search-input").value = "";
  document.getElementById("hero-search-results").innerHTML = "";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/** Show the category page for a given category ID */
function showCategory(categoryId) {
  currentCategory = categoryId;
  currentFilter   = "all";

  const cat = categories[categoryId];
  if (!cat) return; // Guard against unknown IDs

  // Update the category hero section
  document.getElementById("cat-icon").textContent     = cat.icon;
  document.getElementById("cat-title").textContent    = cat.title;
  document.getElementById("cat-subtitle").textContent = cat.subtitle;

  // Reset search + filters to defaults
  document.getElementById("tool-search").value = "";
  setFilter("all", document.querySelector("[data-filter='all']"));

  // Switch pages
  document.getElementById("home-page").style.display     = "none";
  document.getElementById("category-page").style.display = "block";

  // Render the tool cards
  renderTools();

  // Scroll to top of page
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ============================================================
// 6. RENDER TOOLS
//    Reads currentCategory, currentFilter, and the search input
//    then builds and injects the tool card HTML
// ============================================================
function renderTools() {
  const grid     = document.getElementById("tools-grid");
  const noResult = document.getElementById("no-results");
  const query    = document.getElementById("tool-search").value.toLowerCase().trim();

  // Filter tools matching the current category
  let filtered = tools.filter(t => t.category === currentCategory);

  // Apply the active filter button (free / no-watermark)
  if (currentFilter === "free") {
    filtered = filtered.filter(t => t.free);
  } else if (currentFilter === "no-watermark") {
    filtered = filtered.filter(t => t.noWatermark);
  }

  // Apply the search query (matches name or description)
  if (query) {
    filtered = filtered.filter(t =>
      t.name.toLowerCase().includes(query) ||
      t.desc.toLowerCase().includes(query)
    );
  }

  // Show "no results" message if nothing matches
  if (filtered.length === 0) {
    grid.innerHTML = "";
    noResult.style.display = "block";
    return;
  }

  noResult.style.display = "none";

  // Build the HTML string for all tool cards
  grid.innerHTML = filtered.map((tool, index) => `
    <div class="tool-card" style="animation-delay: ${index * 0.06}s">
      <div class="tool-card-top">
        <span class="tool-name">${tool.name}</span>
        <div class="tool-badges">
          <!-- Free/Paid badge -->
          <span class="badge ${tool.free ? 'badge-free' : 'badge-paid'}">
            ${tool.free ? 'Free' : 'Freemium'}
          </span>
          <!-- No watermark badge (only shown if true) -->
          ${tool.noWatermark ? '<span class="badge badge-no-watermark">No Watermark</span>' : ""}
        </div>
      </div>
      <!-- Tool description -->
      <p class="tool-desc">${tool.desc}</p>
      <!-- CTA button that opens the tool in a new tab -->
      <a href="${tool.url}" target="_blank" rel="noopener noreferrer" class="tool-btn">
        Open Tool ↗
      </a>
    </div>
  `).join("");
}

// ============================================================
// 7. FILTER HANDLING
//    Called when a filter button is clicked
// ============================================================

/**
 * setFilter(filterName, buttonEl)
 * @param {string} filterName — "all" | "free" | "no-watermark"
 * @param {HTMLElement} buttonEl — the clicked button (to mark active)
 */
function setFilter(filterName, buttonEl) {
  currentFilter = filterName;

  // Remove "active" from all filter buttons, then add to clicked one
  document.querySelectorAll(".filter-btn").forEach(btn => btn.classList.remove("active"));
  if (buttonEl) buttonEl.classList.add("active");

  // Re-render to apply the new filter
  renderTools();
}

// ============================================================
// 8. SEARCH IN CATEGORY PAGE
//    Called via oninput on #tool-search
// ============================================================
function filterTools() {
  renderTools(); // renderTools already reads the search input value
}

// ============================================================
// 9. HERO SEARCH (Home Page)
//    Live dropdown that searches across ALL categories
// ============================================================

/**
 * handleHeroSearch(query)
 * @param {string} query — current value of the hero search input
 */
function handleHeroSearch(query) {
  const resultsContainer = document.getElementById("hero-search-results");
  const q = query.toLowerCase().trim();

  // Hide dropdown if query is empty or too short
  if (q.length < 2) {
    resultsContainer.innerHTML = "";
    return;
  }

  // Search across all tools from all categories
  const matches = tools.filter(t =>
    t.name.toLowerCase().includes(q) ||
    t.desc.toLowerCase().includes(q)
  );

  if (matches.length === 0) {
    resultsContainer.innerHTML = `
      <div class="search-result-item" style="cursor:default;">
        <span class="search-result-desc">No tools found for "${query}"</span>
      </div>
    `;
    return;
  }

  // Build a dropdown row for each matching tool
  resultsContainer.innerHTML = matches.map(tool => {
    const catName = categories[tool.category]?.title || tool.category;
    return `
      <div class="search-result-item" onclick="openToolFromSearch('${tool.url}', '${tool.category}')">
        <div>
          <div class="search-result-name">${tool.name}</div>
          <div class="search-result-desc">${tool.desc.slice(0, 70)}…</div>
        </div>
        <span class="search-result-cat">${catName}</span>
      </div>
    `;
  }).join("");
}

/**
 * openToolFromSearch(url, categoryId)
 * When user clicks a hero search result:
 *  - Navigate to the tool's category page
 *  - Open the tool URL in a new tab
 */
function openToolFromSearch(url, categoryId) {
  // Navigate to the category so user sees context
  showCategory(categoryId);
  // Open the tool itself
  window.open(url, "_blank", "noopener,noreferrer");
}

// Close hero search dropdown when clicking anywhere outside it
document.addEventListener("click", (e) => {
  const search  = document.getElementById("hero-search-input");
  const results = document.getElementById("hero-search-results");
  // If click is NOT on the input or results, clear the dropdown
  if (search && !search.contains(e.target) && !results.contains(e.target)) {
    results.innerHTML = "";
  }
});

// ============================================================
// 10. MOBILE NAV TOGGLE
// ============================================================
const hamburger = document.getElementById("hamburger");
const mobileNav = document.getElementById("mobileNav");

hamburger.addEventListener("click", () => {
  mobileNav.classList.toggle("open");
});

/** Called by mobile nav buttons to close the drawer after navigation */
function closeMobileNav() {
  mobileNav.classList.remove("open");
}