// =================== MENU ===================
const menu = document.getElementById('menu');
const menuBtn = document.getElementById('menu-button');

menuBtn.addEventListener('click', () => menu.classList.toggle('active'));

// ESC zavře menu
document.addEventListener('keydown', e => {
  if(e.key==='Escape'){
    menu.classList.remove('active');
    closeLightbox();
  }
});

// =================== SUPABASE ===================
const supabaseUrl = 'https://hwjbfrhbgeczukcjkmca.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh3amJmcmhiZ2VjenVrY2prbWNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk0NDU5MjQsImV4cCI6MjA4NTAyMTkyNH0.BlgIov7kFq2EUW17hLs6o1YujL1i9elD7wILJP6h-lQ';
const sb = supabase.createClient(supabaseUrl, supabaseKey);

// =================== LIGHTBOX ===================
const lightbox = document.createElement('div');
lightbox.className = 'lightbox';
lightbox.innerHTML = `<img src="" alt="Detail">`;
document.body.appendChild(lightbox);

lightbox.addEventListener('click', closeLightbox);

function openLightbox(url){
  const img = lightbox.querySelector('img');
  img.src = url;
  lightbox.classList.add('active');
}

function closeLightbox(){
  lightbox.classList.remove('active');
}

// =================== GET CARD ID ===================
function getCardId() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id');
}

// =================== LOAD CARD DETAIL ===================
async function loadCardDetail() {
  const id = getCardId();
  if(!id) return;

  const { data: card, error } = await sb
    .from('cards')
    .select('*')
    .eq('id', id)
    .single();

  if(error){
    console.error(error);
    return;
  }

  const container = document.querySelector('.card-detail-container');

  // =================== IMAGE ARRAY ===================
  let images = [];
  if(card.real_images){
    // oddělené čárkou nebo jen jedna URL
    const cleaned = card.real_images.split(',').map(u => u.trim()).filter(u => u);
    if(cleaned.length > 0) images = cleaned;
  }

  // fallback jen pokud není žádná real fotka
  if(images.length === 0){
    images = [card.image_url];
  }

  // Vygenerujeme HTML pro fotky
  let imagesHtml = '';
  images.forEach(url => {
    imagesHtml += `<img class="card-image" src="${url}" alt="${card.name}">`;
  });

  container.innerHTML = `
    <div class="card-images-wrapper">
      ${imagesHtml}
    </div>
    <div class="card-info">
      <h1>${card.name}</h1>
      <p class="price">${card.price} Kč</p>
      <p>${card.description || "Žádný popis karty."}</p>
      <button class="add-to-cart">Přidat do košíku</button>
    </div>
  `;

  // =================== FADE ANIMACE ===================
  setTimeout(() => {
    document.querySelectorAll('.card-image').forEach(img => img.style.opacity = 1);
    document.querySelector('.card-info').style.opacity = 1;
  }, 50);

  // =================== LIGHTBOX CLICK ===================
  document.querySelectorAll('.card-image').forEach(img => {
    img.addEventListener('click', () => openLightbox(img.src));
  });
}

// =================== INIT ===================
window.addEventListener('DOMContentLoaded', loadCardDetail);
