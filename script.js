

// =========================
// Dados de exemplo

const letrasData = [
  {
    title: "Amor e Fé",
    lyrics: `[C] Amor e [G] fé, a força da [Am] canção
[C] Mantém o [G] coração cheio de [Am] emoção
[F] Caminhando juntos, [C] lado a lado
[G] Com esperança e [C] dedicação`
  },
  {
    title: "Brilho do Sol",
    lyrics: `[D] O sol nasce [A] brilhando no [Bm] horizonte
[D] Trazendo luz [A] e alegria a [Bm] todos nós
[G] Cada amanhecer [D] é uma nova chance
[A] De viver com amor e [D] esperança`
  },
  {
    title: "Caminho da Vida",
    lyrics: `[G] Seguindo o [D] caminho da [Em] vida
[G] Com coragem e [D] fé na [Em] lida
[C] Aprendemos juntos [G] cada lição
[Am] Crescendo em amor e [D] gratidão`
  }
];


// =========================
// Função para transpor acordes
function transposeChords(chordString, semitones){
  if(semitones === 0) return chordString;
  const notes = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
  return chordString.replace(/\[([A-G]#?)(m?)(7?)(sus?)(add?\d?)\]/g, (match, note, minor, seven, sus, add) => {
    let idx = notes.indexOf(note);
    if(idx === -1) return match;
    idx = (idx + semitones + 12) % 12;
    return `[${notes[idx]+minor+seven+sus+add}]`;
  });
}

// =========================
// Função para destacar acordes
function highlightChords(text){
  return text.replace(/\[([A-G]#?m?7?sus?add?\d?)\]/g, '<span class="chord">[$1]</span>');
}

// =========================
// Modal
const modal = document.getElementById("songModal");
const modalTitle = document.getElementById("modalTitle");
const modalText = document.getElementById("modalText");
const modalTranspose = document.getElementById("modalTranspose");
const modalTransposeContainer = document.getElementById("modalTransposeContainer");
const closeBtn = document.querySelector(".modal .close");

function openModal(title, content){
  modalTitle.textContent = title;
  modalText.innerHTML = highlightChords(content);
  modal.style.display = "flex";
  modalTranspose.value = "0";

  modalTranspose.onchange = () => {
    const semitones = parseInt(modalTranspose.value) || 0;
    const transposed = transposeChords(content, semitones);
    modalText.innerHTML = highlightChords(transposed);
  }
}

closeBtn.onclick = () => { modal.style.display = "none"; }
window.onclick = e => { if(e.target === modal) modal.style.display = "none"; }

// =========================
// Popula listas
function populateList(data, listElement){
  listElement.innerHTML = "";
  data.sort((a,b) => a.title.localeCompare(b.title));
  data.forEach(item => {
    const li = document.createElement("li");
    li.textContent = item.title;
    li.addEventListener("click", () => {
      openModal(item.title, item.lyrics);
    });
    listElement.appendChild(li);
  });
}

const letrasList = document.getElementById("letrasList");
const acordesList = document.getElementById("acordesList");

// Para acordes, vamos mostrar o mesmo texto no modal
populateList(letrasData, letrasList);
populateList(letrasData, acordesList); 

// =========================
// Tabs
const tabButtons = document.querySelectorAll(".tab-button");
const tabContents = document.querySelectorAll(".tab-content");
tabButtons.forEach(btn => {
  btn.addEventListener("click", ()=>{
    tabButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    const target = btn.dataset.tab;
    tabContents.forEach(c => c.classList.remove("active"));
    document.getElementById(target).classList.add("active");
  });
});

// =========================
// Pesquisa
const searchInput = document.getElementById("searchInput");
searchInput.addEventListener("input", ()=>{
  const query = searchInput.value.toLowerCase();
  [letrasData, letrasData].forEach((data, idx)=>{
    const list = idx === 0 ? letrasList : acordesList;
    list.innerHTML = "";
    data.filter(item => item.title.toLowerCase().includes(query) || item.lyrics.toLowerCase().includes(query))
        .forEach(item => {
          const li = document.createElement("li");
          li.textContent = item.title;
          li.addEventListener("click", ()=>{
            openModal(item.title, item.lyrics);
          });
          list.appendChild(li);
        });
  });
});
