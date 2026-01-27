// Menu toggle
const menu = document.getElementById('menu');
const menuBtn = document.getElementById('menu-button');
menuBtn.addEventListener('click', () => menu.classList.toggle('active'));

// ESC zavře menu
document.addEventListener('keydown', e => {
  if(e.key === 'Escape'){
    menu.classList.remove('active');
  }
});

// Supabase
const supabaseUrl = 'https://hwjbfrhbgeczukcjkmca.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh3amJmcmhiZ2VjenVrY2prbWNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk0NDU5MjQsImV4cCI6MjA4NTAyMTkyNH0.BlgIov7kFq2EUW17hLs6o1YujL1i9elD7wILJP6h-lQ';
const sb = supabase.createClient(supabaseUrl, supabaseKey);

// Získat ID karty z URL
function getCardId() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id');
}

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

  // Zkusíme vzít real_images jako JSON
  let images = [];
  if(card.real_images){
    try {
      const parsed = JSON.parse(card.real_images);
      if(Array.isArray(parsed) && parsed.length > 0){
        images = parsed; // tady bereme ty reálné fotky
      }
    } catch(e){
      console.warn("real_images není validní JSON, použije se fallback image_url");
    }
  }

  // fallback jen pokud není ani jedna real fotka
  if(images.length === 0){
    images = [card.image_url];
  }

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
    <div class="lightbox" id="lightbox"><img src="" alt=""></div>
  `;

  // Fade animace
  setTimeout(() => {
    document.querySelectorAll('.card-image').forEach(img => img.style.opacity = 1);
    document.querySelector('.card-info').style.opacity = 1;
  }, 50);

  // Lightbox
  const lightbox = document.getElementById('lightbox');
  document.querySelectorAll('.card-image').forEach(img => {
    img.addEventListener('click', () => {
      lightbox.querySelector('img').src = img.src;
      lightbox.classList.add('active');
    });
  });

  lightbox.addEventListener('click', () => {
    lightbox.classList.remove('active');
  });
}

window.addEventListener('DOMContentLoaded', loadCardDetail);
