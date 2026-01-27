// Menu toggle
const menu = document.getElementById('menu');
const menuBtn = document.getElementById('menu-button');
menuBtn.addEventListener('click', () => menu.classList.toggle('active'));

// ESC zavře menu
document.addEventListener('keydown', e => {
  if(e.key==='Escape'){
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

  const { data: cards, error } = await sb
    .from('cards')
    .select('*')
    .eq('id', id)
    .single();

  if(error){
    console.error(error);
    return;
  }

  const container = document.querySelector('.card-detail-container');
  container.innerHTML = `
    <img class="card-image" src="${cards.image_url}" alt="${cards.name}">
    <div class="card-info">
      <h1>${cards.name}</h1>
      <p class="price">${cards.price} Kč</p>
      <p>${cards.description || "Žádný popis karty."}</p>
      <button class="add-to-cart">Přidat do košíku</button>
    </div>
  `;

  // Přidání animace fade
  setTimeout(()=>{
    document.querySelector('.card-image').style.opacity = 1;
    document.querySelector('.card-info').style.opacity = 1;
  }, 50);
}

window.addEventListener('DOMContentLoaded', loadCardDetail);
