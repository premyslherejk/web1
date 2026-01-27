const supabaseUrl = 'https://hwjbfrhbgeczukcjkmca.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh3amJmcmhiZ2VjenVrY2prbWNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk0NDU5MjQsImV4cCI6MjA4NTAyMTkyNH0.BlgIov7kFq2EUW17hLs6o1YujL1i9elD7wILJP6h-lQ';
const sb = supabase.createClient(supabaseUrl, supabaseKey);

// ID z URL
const id = new URLSearchParams(window.location.search).get('id');
if(!id) throw 'Chybí ID karty';

const thumbsWrap = document.getElementById('thumbs');
const mainImg = document.getElementById('current');
const light = document.getElementById('lightbox');
const lightImg = document.getElementById('lightImg');

let images = [];
let index = 0;

async function loadCard(){
  const { data: card, error } = await sb
    .from('cards')
    .select('*')
    .eq('id', id)
    .single();

  if(error) return console.error(error);

  // DATA
  document.getElementById('name').textContent = card.name;
  document.getElementById('description').textContent = card.description || '';
  document.getElementById('price').textContent = `${card.price} Kč`;
  document.getElementById('meta').textContent =
    `Edice: ${card.set} · Stav: ${card.condition}`;

  // STATUS
  const status = document.getElementById('status');
  status.textContent = card.status;

  if(card.graded){
    status.textContent += ` · ${card.grading_company} ${card.grade}`;
    status.classList.add('graded');
  }

  // IMAGES
  images = Array.isArray(card.real_images) && card.real_images.length
    ? card.real_images
    : [card.image_url];

  mainImg.src = images[0];
  thumbsWrap.innerHTML = '';

  images.forEach((src,i)=>{
    const img = document.createElement('img');
    img.src = src;
    if(i===0) img.classList.add('active');
    img.onclick = ()=>setImage(i);
    thumbsWrap.appendChild(img);
  });
}

function setImage(i){
  index = i;
  mainImg.src = images[i];
  [...thumbsWrap.children].forEach(el=>el.classList.remove('active'));
  thumbsWrap.children[i].classList.add('active');
}

// LIGHTBOX
document.getElementById('mainImage').onclick = ()=>{
  lightImg.src = images[index];
  light.classList.add('active');
};

document.getElementById('close').onclick = ()=>light.classList.remove('active');
document.getElementById('prev').onclick = ()=>nav(-1);
document.getElementById('next').onclick = ()=>nav(1);

function nav(dir){
  index = (index + dir + images.length) % images.length;
  setImage(index);
  lightImg.src = images[index];
}

document.addEventListener('keydown',e=>{
  if(e.key==='Escape') light.classList.remove('active');
});

loadCard();
