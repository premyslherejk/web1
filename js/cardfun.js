const supabaseUrl = 'https://hwjbfrhbgeczukcjkmca.supabase.co';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh3amJmcmhiZ2VjenVrY2prbWNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk0NDU5MjQsImV4cCI6MjA4NTAyMTkyNH0.BlgIov7kFq2EUW17hLs6o1YujL1i9elD7wILJP6h-lQ';

const sb = supabase.createClient(supabaseUrl, supabaseKey);

// ========= ELEMENTY =========
const id = new URLSearchParams(window.location.search).get('id');
if (!id) throw new Error('Chybí ID karty v URL');

const thumbsWrap = document.getElementById('thumbs');
const mainImg = document.getElementById('current');
const light = document.getElementById('lightbox');
const lightImg = document.getElementById('lightImg');

const nameEl = document.getElementById('name');
const descEl = document.getElementById('description');
const priceEl = document.getElementById('price');
const metaEl = document.getElementById('meta');
const statusEl = document.getElementById('status');

let images = [];
let index = 0;

// ========= LOAD =========
async function loadCard() {
  const { data: card, error } = await sb
    .from('cards')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error(error);
    return;
  }

  // ===== DATA =====
  nameEl.textContent = card.name || '';
  descEl.textContent = card.description || '';
  priceEl.textContent = `${card.price} Kč`;
  metaEl.textContent = `Edice: ${card.set || '—'} · Stav: ${card.condition || '—'}`;

  // ===== STATUS =====
  statusEl.classList.remove('graded');
  const psaEl = document.getElementById('psa');

// STATUS – vždy nahoře
statusEl.textContent = card.status || 'Skladem';
statusEl.classList.remove('graded');

// PSA – zvlášť pod názvem
psaEl.textContent = '';

if (card.psa_grade) {
  psaEl.textContent = `PSA ${card.psa_grade}`;
}


  // ===== IMAGES =====
  images = [];

  if (card.real_images && typeof card.real_images === 'string') {
    images = card.real_images
      .split(',')
      .map(url => url.trim())
      .filter(Boolean);
  }

  if (!images.length && card.image_url) {
    images = [card.image_url];
  }

  if (!images.length) {
    console.warn('Karta nemá žádné obrázky');
    return;
  }

  renderImages();
}

// ========= GALERIE =========
function renderImages() {
  thumbsWrap.innerHTML = '';
  index = 0;
  mainImg.src = images[0];

  images.forEach((src, i) => {
    const img = document.createElement('img');
    img.src = src;
    if (i === 0) img.classList.add('active');

    img.addEventListener('click', () => setImage(i));
    thumbsWrap.appendChild(img);
  });
}

function setImage(i) {
  index = i;
  mainImg.src = images[i];
  [...thumbsWrap.children].forEach(el => el.classList.remove('active'));
  thumbsWrap.children[i].classList.add('active');
}

// ========= LIGHTBOX =========
document.getElementById('mainImage').onclick = () => {
  if (!images.length) return;
  lightImg.src = images[index];
  light.classList.add('active');
};

document.getElementById('close').onclick = () =>
  light.classList.remove('active');

document.getElementById('prev').onclick = () => nav(-1);
document.getElementById('next').onclick = () => nav(1);

function nav(dir) {
  index = (index + dir + images.length) % images.length;
  setImage(index);
  lightImg.src = images[index];
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') light.classList.remove('active');
});

// ========= START =========
loadCard();

