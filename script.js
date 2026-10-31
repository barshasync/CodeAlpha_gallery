// FRAME gallery: source data and all interactive behavior live here.
const photographs = [
  { title: 'The Quiet Between', category: 'Nature', image: 'photo-1470770841072-f978cf4d019e', alt: 'Still mountain lake surrounded by forest at dusk' },
  { title: 'Lines of Light', category: 'Architecture', image: 'photo-1511818966892-d7d671e672a2', alt: 'Sculptural modern architecture against the sky' },
  { title: 'A Softer Light', category: 'Portraits', image: 'photo-1534528741775-53994a69daeb', alt: 'Thoughtful portrait in soft natural light' },
  { title: 'Wild at Heart', category: 'Wildlife', image: 'photo-1472396961693-142e6e269027', alt: 'Deer standing in a quiet woodland' },
  { title: 'Somewhere, Slowly', category: 'Travel', image: 'photo-1464822759023-fed622ff2c3b', alt: 'Mountain peaks rising through the clouds' },
  { title: 'Liquid Geometry', category: 'Abstract', image: 'photo-1518837695005-2083093ee35b', alt: 'Ocean waves forming abstract lines and patterns' },
  { title: 'Into the Green', category: 'Nature', image: 'photo-1448375240586-882707db888b', alt: 'Sunlight filtering through a deep green forest' },
  { title: 'Concrete Poetry', category: 'Architecture', image: 'photo-1487958449943-2429e8be8625', alt: 'Minimal white modern building under a clear sky' },
  { title: 'Sunday Best', category: 'Portraits', image: 'photo-1506794778202-cad84cf45f1d', alt: 'Candid portrait of a man in warm evening light' },
  { title: 'The Watcher', category: 'Wildlife', image: 'photo-1500462918059-b1a0cb512f1d', alt: 'Wild animal looking out from its natural habitat' },
  { title: 'Between Departures', category: 'Travel', image: 'photo-1500530855697-b586d89ba3ee', alt: 'Open road stretching through a broad landscape' },
  { title: 'Blue Hour', category: 'Abstract', image: 'photo-1519608487953-e999c86e7455', alt: 'Blue-toned night sky with atmospheric clouds' },
  { title: 'First Light', category: 'Nature', image: 'photo-1470252649378-9c29740c9fa8', alt: 'Golden dawn rising over misty rolling hills' },
  { title: 'A Study in Stone', category: 'Architecture', image: 'photo-1511818966892-d7d671e672a2', alt: 'Geometric facade detail in warm sunlight' },
  { title: 'Unscripted', category: 'Portraits', image: 'photo-1531123897727-8f129e1688ce', alt: 'Natural expressive portrait against a dark backdrop' },
  { title: 'Silent Passage', category: 'Wildlife', image: 'photo-1484406566174-9da000fda645', alt: 'Wild deer resting in a green forest' },
  { title: 'The Long Way Home', category: 'Travel', image: 'photo-1501785888041-af3ef285b470', alt: 'Winding trail beside a mountain lake' },
  { title: 'Soft Focus', category: 'Abstract', image: 'photo-1477346611705-65d1883cee1e', alt: 'Dreamlike blurred light and color at sunset' }
];

const imageUrl = (id, width = 900) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=82`;
const grid = document.querySelector('#gallery-grid');
const search = document.querySelector('#gallery-search');
const count = document.querySelector('#result-count');
const empty = document.querySelector('#empty-state');
const lightbox = document.querySelector('#lightbox');
const lightboxImage = document.querySelector('#lightbox-image');
const imageWrap = document.querySelector('.lightbox-image-wrap');
let activeCategory = 'all';
let visiblePhotographs = [...photographs];
let currentIndex = 0;
let previouslyFocused = null;

function renderGallery() {
  const query = search.value.trim().toLocaleLowerCase();
  visiblePhotographs = photographs.filter((photo) => {
    const inCategory = activeCategory === 'all' || photo.category.toLowerCase() === activeCategory;
    const matchesSearch = !query || `${photo.title} ${photo.category}`.toLocaleLowerCase().includes(query);
    return inCategory && matchesSearch;
  });
  grid.replaceChildren();
  visiblePhotographs.forEach((photo, index) => {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'photo-card';
    card.setAttribute('aria-label', `View ${photo.title}, ${photo.category}`);
    card.style.animationDelay = `${Math.min(index % 6, 5) * 45}ms`;
    const image = document.createElement('img');
    image.src = imageUrl(photo.image);
    image.alt = photo.alt;
    image.loading = 'lazy';
    image.decoding = 'async';
    image.addEventListener('error', () => { image.src = 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=900&q=80'; }, { once: true });
    const caption = document.createElement('span');
    caption.className = 'card-caption';
    const text = document.createElement('span');
    text.innerHTML = `<span class="card-title">${photo.title}</span><br><span class="card-category">${photo.category}</span>`;
    const open = document.createElement('span');
    open.className = 'card-open'; open.setAttribute('aria-hidden', 'true'); open.textContent = '↗';
    caption.append(text, open); card.append(image, caption);
    card.addEventListener('click', () => openLightbox(index));
    grid.append(card);
  });
  count.textContent = `${visiblePhotographs.length} ${visiblePhotographs.length === 1 ? 'photograph' : 'photographs'}`;
  empty.hidden = visiblePhotographs.length > 0;
  grid.hidden = visiblePhotographs.length === 0;
  updateFilterCounts();
}

function updateFilterCounts() {
  document.querySelectorAll('.filter-button').forEach((button) => {
    const category = button.dataset.filter;
    if (category === 'all') button.innerHTML = `All <span>${photographs.length}</span>`;
    else button.textContent = button.dataset.label || button.textContent.replace(/\s+\(\d+\)$/, '');
  });
}

function openLightbox(index) {
  if (!visiblePhotographs.length) return;
  currentIndex = index;
  previouslyFocused = document.activeElement;
  lightbox.classList.add('open');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.classList.add('no-scroll');
  showLightboxPhoto();
  document.querySelector('#lightbox-close').focus();
}

function showLightboxPhoto() {
  const photo = visiblePhotographs[currentIndex];
  if (!photo) return;
  imageWrap.classList.add('loading');
  lightboxImage.src = imageUrl(photo.image, 1800);
  lightboxImage.alt = photo.alt;
  lightboxImage.onload = () => imageWrap.classList.remove('loading');
  lightboxImage.onerror = () => { imageWrap.classList.remove('loading'); lightboxImage.src = imageUrl(photographs[0].image, 1800); };
  document.querySelector('#lightbox-title').textContent = photo.title;
  document.querySelector('#lightbox-category').textContent = photo.category;
  document.querySelector('#lightbox-count').textContent = `${String(currentIndex + 1).padStart(2, '0')} / ${String(visiblePhotographs.length).padStart(2, '0')}`;
}

function moveLightbox(direction) {
  currentIndex = (currentIndex + direction + visiblePhotographs.length) % visiblePhotographs.length;
  showLightboxPhoto();
}

function closeLightbox() {
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('no-scroll');
  if (previouslyFocused && typeof previouslyFocused.focus === 'function') previouslyFocused.focus();
}

document.querySelectorAll('.filter-button').forEach((button) => {
  button.dataset.label = button.textContent.trim();
  button.addEventListener('click', () => {
    activeCategory = button.dataset.filter;
    document.querySelectorAll('.filter-button').forEach((item) => {
      const selected = item === button;
      item.classList.toggle('active', selected);
      item.setAttribute('aria-pressed', String(selected));
    });
    renderGallery();
  });
});
search.addEventListener('input', renderGallery);
document.querySelector('#clear-search').addEventListener('click', () => { search.value = ''; activeCategory = 'all'; document.querySelector('[data-filter="all"]').click(); search.focus(); });
document.querySelector('#lightbox-close').addEventListener('click', closeLightbox);
document.querySelector('#lightbox-prev').addEventListener('click', () => moveLightbox(-1));
document.querySelector('#lightbox-next').addEventListener('click', () => moveLightbox(1));
lightbox.addEventListener('click', (event) => { if (event.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', (event) => {
  if (!lightbox.classList.contains('open')) return;
  if (event.key === 'Escape') closeLightbox();
  if (event.key === 'ArrowLeft') moveLightbox(-1);
  if (event.key === 'ArrowRight') moveLightbox(1);
});

// Compact navigation menu and automatic close after selecting a destination.
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('#nav-links');
menuToggle.addEventListener('click', () => {
  const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Open navigation' : 'Close navigation');
  navLinks.classList.toggle('open', !isOpen);
});
navLinks.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  menuToggle.setAttribute('aria-expanded', 'false'); menuToggle.setAttribute('aria-label', 'Open navigation'); navLinks.classList.remove('open');
}));

// Reveal sections as they enter the viewport; show them immediately when reduced motion is preferred.
const revealObserver = new IntersectionObserver((entries) => entries.forEach((entry) => {
  if (entry.isIntersecting) { entry.target.classList.add('visible'); revealObserver.unobserve(entry.target); }
}), { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

// Keep the top control and active navigation state in sync with scrolling.
const topButton = document.querySelector('#to-top');
const navSections = [...document.querySelectorAll('main section[id]')];
window.addEventListener('scroll', () => {
  topButton.classList.toggle('visible', window.scrollY > 600);
  let current = 'top';
  navSections.forEach((section) => { if (window.scrollY >= section.offsetTop - 170) current = section.id; });
  document.querySelectorAll('.nav-link').forEach((link) => {
    const href = link.getAttribute('href');
    link.classList.toggle('is-active', href === `#${current}` || (current === 'collections' && href === '#collections'));
  });
}, { passive: true });
topButton.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

renderGallery();
