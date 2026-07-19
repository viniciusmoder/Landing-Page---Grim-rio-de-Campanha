const searchContainer = document.querySelector(".search");
const searchButtons = document.querySelectorAll(".btn-option");
const btnSearch = document.querySelector("#btn-search");
const inputField = document.querySelector("#search-field");
const form = document.querySelector(".form");
const btnHero = document.querySelector(".btn-hero");
const contactSession = document.querySelector(".contact");
const charactersContainer = document.querySelector(".characters");
const navbarLink = document.querySelectorAll(".navbar a");

navbarLink.forEach(link => {
    link.addEventListener("click", () => {
        if (link.classList.contains("header-active")) {
            return;
        }

        navbarLink.forEach(item => {
            item.classList.remove("header-active");
        });

        link.classList.add("header-active");
    });
});


let random = [];
let carrosselIndex = 0;

const api = `https://www.dnd5eapi.co/api/2014/`;
const languageSupport = "?lang=pt-BR";

function randomCards(arr) { 
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]]; // Troca elementos (destructuring)
  }
  return arr;
}

btnHero.addEventListener("click", () => {
    contactSession.scrollIntoView({ behavior: "smooth" });
});

async function getCharacters() {
    try {
        const charactersResponse = await fetch("characters.json");
        const charactersList = await charactersResponse.json();

        // Embaralha a lista vinda do JSON toda vez que a página recarrega
        randomList = randomCards(charactersList);
        carrosselIndex = 0;

        // Monta a estrutura estática do carrossel (Botões e casca do card)
        renderCarrosselStructure();
        
        // Exibe o primeiro personagem da lista aleatória
        renderCard();
        
        // Ativa os ouvintes de clique nas setas
        setupArrowEvents();
    }
    catch (error) {
        console.error('Erro ao ler o JSON ou desenhar os cards:', error);
        charactersContainer.innerHTML = '<p>Erro ao carregar o conteúdo do carrossel.</p>';
    }
}

// Cria a estrutura base do carrossel apenas uma vez
function renderCarrosselStructure() {
    charactersContainer.innerHTML = `
        <button class="arrow-btn arrow-left">&lt;</button>    
        <div class="character-card">
            <div class="card-content" id="card-dynamic-content"></div>
        </div>
        <button class="arrow-btn arrow-right">&gt;</button>
    `;
}

// Atualiza especificamente o conteúdo de dentro do card
function renderCard() {
    const cardDynamicContent = document.getElementById("card-dynamic-content");
    if (!cardDynamicContent || randomList.length === 0) return;

    const character = randomList[carrosselIndex];

    // Injeta as informações do personagem atual com as classes corrigidas
    cardDynamicContent.innerHTML = `
        <img class="char-img" src="${character.imagem}" alt="${character.nome}">
        <div class="char-info">
            <h1 class="char-nome">${character.nome}</h1>
            <hr class="line-name">
            <div class="char-class">
                <p>${character.classe}</p>
                <p>(${character.subclasse})</p>
            </div>
            <div class="char-class">
                <p>Nível: ${character.nivel}</p>
                <p>Espécie: (${character.especie})</p>
            </div>
            <div class="skills">
                <div class="skill-value"><p>FOR</p><p>${character.atributos.força}</p></div>
                <div class="skill-value"><p>DES</p><p>${character.atributos.destreza}</p></div>
                <div class="skill-value"><p>CON</p><p>${character.atributos.constituicao}</p></div>
                <div class="skill-value"><p>INT</p><p>${character.atributos.inteligencia}</p></div>
                <div class="skill-value"><p>SAB</p><p>${character.atributos.sabedoria}</p></div>
                <div class="skill-value"><p>CAR</p><p>${character.atributos.carisma}</p></div>
            </div>
            <p class="description">${character.descricao}</p>
        </div>
    `;
}

// Configura os cliques e apenas muda o index, chamando o renderCard para atualizar a tela
function setupArrowEvents() {
    const leftArrow = document.querySelector('.arrow-left');
    const rightArrow = document.querySelector('.arrow-right');

    if (!leftArrow || !rightArrow) return;

    leftArrow.addEventListener('click', () => {
        if (carrosselIndex === 0) {
            carrosselIndex = randomList.length - 1;
        } else {
            carrosselIndex--;
        }
        renderCard(); 
    });

    rightArrow.addEventListener('click', () => {
        if (carrosselIndex === randomList.length - 1) {
            carrosselIndex = 0;
        } else {
            carrosselIndex++;
        }
        renderCard(); 
    });
}

btnSearch.addEventListener("click", () => {
    let searchInput = formatInput(inputField.value);

    const btnActive = document.querySelector(".btn-option.active");

    let searchArea = btnActive.dataset.endpoint;

    request(searchInput, searchArea);
});

function formatInput(text) {
    return text.trim().replace(" ","-").toLowerCase();
}

function renderResultCard(responseObject, searchArea) {
    if (!responseObject) return;
    console.log("entrou no método");

    const resultCard = document.querySelector("#result");

    switch (searchArea) {
        case "classes":
            renderClass(responseObject, resultCard);
            break;
        
        case "spells":
            renderSpells(responseObject, resultCard);
            break;
        
        case "monsters":
            renderMonsters(responseObject, resultCard);
            break;
        
        case "races":
            renderSpecies(responseObject, resultCard);
            break;
    }
}

function renderSpecies(specie, card) {
    const name = specie.name;
    const speed = specie.speed;
    const desc = specie.alignment;
    const age = specie.age;

    card.innerHTML = `
        <h1 class="result-name">${name}</h1>
        <div class="card-info">
            <p><strong>Deslocamento:</strong> ${speed} ft.</p>
            <p><strong>Idade:</strong> ${age}</p>
            <p>${desc}</p>
        </div>
    `;

    card.className = "result-container species-card";
}

function renderMonsters(monster, card) {
    const name = monster.name;
    const type = monster.type;
    const size = monster.size;
    const hitPoints = monster.hit_points;
    const challangeRating = monster.challenge_rating;
    const image = monster.image;

    card.innerHTML = `
        <h1 class="result-name">${monster.name}</h1>
        <div class="card-info">
            <p><strong>Type:</strong> ${type}</p>
            <p><strong>Size:</strong> ${size}</p>
            <p><strong>Hit Points:</strong> ${hitPoints}</p>
            <p><strong>Challange Rating:</strong> ${challangeRating}</p>
        </div>
    `;

    card.className = "result-container monsters-card";
}

function renderSpells(spell, card) {
    const name = spell.name;
    const school = spell.school.name;
    const time = spell.casting_time;
    const level = spell.level;
    const range = spell.range;
    const duration = spell.duration;
    const desc = spell.desc;    

card.innerHTML = `
    <h1 class="result-name">${name}</h1>
    <div class="card-info">
        <p>${school}</p>
        <p><strong>Level:</strong> ${level}</p>
        <p><strong>Range:</strong> ${range}</p>
        <p><strong>Casting Time:</strong> ${time}</p>
        <p><strong>Duration:</strong> ${duration}</p>
        <p class="description">"${desc}"</p>
    </div>
`;

    card.className = "result-container spells-card";
}

function renderClass(dndClass, card) {
    console.log("passou no swithc");
    const name = dndClass.name;
    const hitDie = dndClass.hit_die;
    const save1 = dndClass.saving_throws[0].name;
    const save2 = dndClass.saving_throws[1].name;
    const skills = dndClass.proficiency_choices[0].desc;
    

    card.innerHTML = `
        <h1 class="result-name">${name}<h1>
        <div class="card-info">
            <p><strong>Hit die:</strong> d${hitDie}</p>
            <p><strong>Saving Throws:</strong> ${save1} & ${save2}</p>
            <p><strong>Skills:</strong> ${skills}</p>
    `;

    card.className = "result-container classes-card";
}

async function request(value, area) {
    try {
        const response = await fetch(`${api}${area}/${value}${languageSupport}`);

        if(!response.ok) throw new Error("Erro na resposta: ", response.status);

        console.log(`${api}${area}/${value}${languageSupport}`);
        const responseObject = await response.json();
        console.log("Rebecido: ", responseObject);

        renderResultCard(responseObject, area);
        
    }
    catch (error) {
        console.log(error);
    }
}

searchButtons.forEach(btn => {
    btn.addEventListener("click", (event) => {
        const btnActive = event.currentTarget;

        searchButtons.forEach(btn => {
            btn.classList.remove("active");
            const colorClass = btn.classList[1]; // Exemplo de captura de classe

            if (colorClass) {
                btnSearch.classList.remove(colorClass);
            } 
        });   
        
        btnActive.classList.add("active");

        const btnColorClass = btnActive.classList[1];

        if (btnColorClass) {
                btnSearch.classList.add(btnColorClass);
            }
        
        if (btnActive.dataset.placeholder) {
            inputField.placeholder = btnActive.dataset.placeholder;
        }
    });
});

form.addEventListener("submit", event => {
    event.preventDefault();

    const userName = document.querySelector("#name").value;

    form.innerHTML += `
        <p>Sua mensagem foi enviada, ${userName}.<br>
        Obrigado por preencher este formulário!</p> 
    `;

    form.reset();
});

getCharacters();