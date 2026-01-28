const supabaseUrl = 'https://hwjbfrhbgeczukcjkmca.supabase.co';
const supabaseKey = 'TVŮJ_KEY'; // nechávám jak máš
const sb = supabase.createClient(supabaseUrl, supabaseKey);

// ========= ID =========
const id = new URLSearchParams(window.location.search).get('id');
if (!id) throw new Error('Chybí ID karty');

// ========= ELEMENTY =========
const thumbsWrap = document.getElementById('thumbs');
const mainImg = document.getElementById('current');
const light = document.getElementById('lightbox');
const lightImg = document.getElementById('lightImg');

const nameEl = document.getElementById('name');
const descEl = document.getElementById('description');
const priceEl = document.getElementById('price');
const metaEl = document.getElementById('meta');
const statusEl = document.getElementById('status');
const psaEl = document.getElementById('psa');
const psaInfoEl = document.getElementById('psa-info');

let images = [];
let index = 0;

// ========= LOAD =========
async function loadCard(){
  const { data: card, error } = await sb
    .from('cards')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return console.error(error);

  // BASIC DATA
  nameEl.textContent = card.name || '';
  descEl.textContent = card.description || '';
  priceEl.textContent = `${card.price} Kč`;
  metaEl.textContent = `Edice: ${card.set || '—'} · Stav: ${card.condition || '—'}`;

  // STATUS
  statusEl.textContent = card.status || 'Skladem';

  // ===== PSA =====
  psaEl.style.display = 'none';
  psaInfoEl.style.display = 'none';
  psaEl.textContent = '';

  if (card.psa_grade) {
    psaEl.textContent = `PSA ${card.psa_grade}`;
    psaEl.style.display = 'inline-flex';
    psaInfoEl.style.display = 'block';

    psaEl.onclick = () => {
      psaInfoEl.scrollIntoView({ behavior:'smooth' });
    };
  }

  // ===== IMAGES =====
  images = [];

  if (card.real_images && typeof card.real_images === 'string') {
    images = card.real_images.split(',').map(i => i.trim()).filter(Boolean);
  }

  if (!images.length && card.image_url) images = [card.image_url];
  if (!images.length) return;

  renderImages();
}

// ========= GALERIE =========
function renderImages(){
  thumbsWrap.innerHTML = '';
  index = 0;
  mainImg.src = images[0];

  images.forEach((src,i)=>{
    const img = document.createElement('img');
    img.src = src;
    if(i===0) img.classList.add('active');
    img.onclick = ()=>setImage(i);
    thumbsWrap.appendChild(img);
  });
}

function setImage(i){
  index=i;
  mainImg.src=images[i];
  [...thumbsWrap.children].forEach(el=>el.classList.remove('active'));
  thumbsWrap.children[i].classList.add('active');
}

// ========= LIGHTBOX =========
document.getElementById('mainImage').onclick=()=>{
  lightImg.src=images[index];
  light.classList.add('active');
};
document.getElementById('close').onclick=()=>light.classList.remove('active');
document.getElementById('prev').onclick=()=>nav(-1);
document.getElementById('next').onclick=()=>nav(1);

function nav(dir){
  index=(index+dir+images.length)%images.length;
  setImage(index);
  lightImg.src=images[index];
}

document.addEventListener('keydown',e=>{
  if(e.key==='Escape') light.classList.remove('active');
});

// ========= START =========
loadCard();
