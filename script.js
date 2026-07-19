//Elementos capturados
const searchButtons = document.querySelectorAll(".btn-option");
const btnSearch = document.querySelector("#btn-search");
const inputField = document.querySelector("#search-field");
const form = document.querySelector(".form");
const btnHero = document.querySelector(".btn-hero");
const contactSession = document.querySelector(".contact");
const charactersContainer = document.querySelector(".characters");
const navbarLink = document.querySelectorAll(".navbar a");
const errorMessage = document.querySelector(".error-message");

//Necessário para o carrossel
let randomList = [];
let carrosselIndex = 0;

//Constantes da API
const api = `https://www.dnd5eapi.co/api/2014/`;
const languageSupport = "?lang=pt-BR";

//////GERAL///////
//Faz com que a tela deslize de forma suave
btnHero.addEventListener("click", () => {
    contactSession.scrollIntoView({ behavior: "smooth" });
});

//Comportamento do Header
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


/////////HERO/////////////


////////PERSONAGENS/////////
//Aleatoriza o array de personagens
function randomCards(arr) { 
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]]; // Troca elementos (destructuring)
  }
  return arr;
}

//Busca as informações dos personagens no arquivo json e chama as funções necessárias
async function getCharacters() {
    try {
        const charactersResponse = await fetch("characters.json");
        const charactersList = await charactersResponse.json();

        randomList = randomCards(charactersList);
        carrosselIndex = 0;

        renderCarrosselContainer();
        renderCard();
        setupArrowEvents();
    }

    catch (error) {
        console.error('Erro ao ler o JSON ou desenhar os cards:', error);
        charactersContainer.innerHTML = '<p>Erro ao carregar o conteúdo do carrossel.</p>';
    }
}

//Renderiza o contâiner do carrossel
function renderCarrosselContainer() {
    charactersContainer.innerHTML = `
        <button class="arrow-btn arrow-left">&lt;</button>    
        <div class="character-card">
            <div class="card-content" id="card-dynamic-content"></div>
        </div>
        <button class="arrow-btn arrow-right">&gt;</button>
    `;
}

//Renderiza o contéudo do card de personagem
function renderCard() {
    const cardDynamicContent = document.getElementById("card-dynamic-content");
    if (!cardDynamicContent || randomList.length === 0) return;

    const character = randomList[carrosselIndex];

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

//Permite ir ou voltar no carrossel, editando a posição no array de personagens
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

/////////PESQUISA////////////
//Descobre qual a área de busca para completar a url da requisição
btnSearch.addEventListener("click", () => {
    let searchInput = formatInput(inputField.value);

    const btnActive = document.querySelector(".btn-option.active");

    let searchArea = btnActive.dataset.endpoint;

    request(searchInput, searchArea);
});

//Formata o texto digitado pelo usuário, para garantir que seja enviado corretamente para a API
function formatInput(text) {
    return text.trim().replace(" ","-").toLowerCase();
}

//Recebe o retorno da API e decide qual função de render chamar
function renderResultCard(responseObject, searchArea) {
    if (!responseObject) return;

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

//Render do card das espécies
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

//Render do card dos monstros
function renderMonsters(monster, card) {
    const name = monster.name;
    const type = monster.type;
    const size = monster.size;
    const hitPoints = monster.hit_points;
    const challengeRating = monster.challenge_rating;
    const image = monster.image;

    card.innerHTML = `
        <h1 class="result-name">${monster.name}</h1>
        <div class="card-info">
            <p><strong>Type:</strong> ${type}</p>
            <p><strong>Size:</strong> ${size}</p>
            <p><strong>Hit Points:</strong> ${hitPoints}</p>
            <p><strong>Challenge Rating:</strong> ${challengeRating}</p>
        </div>
    `;

    card.className = "result-container monsters-card";
}

//Render do card das magias
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
            <p><strong>School:</strong>${school}</p>
            <p><strong>Level:</strong> ${level}</p>
            <p><strong>Range:</strong> ${range}</p>
            <p><strong>Casting Time:</strong> ${time}</p>
            <p><strong>Duration:</strong> ${duration}</p>
            <p class="description">"${desc}"</p>
        </div>
    `;

    card.className = "result-container spells-card";
}

//Render do card das classes
function renderClass(dndClass, card) {
    const name = dndClass.name;
    const hitDie = dndClass.hit_die;
    const save1 = dndClass.saving_throws[0].name;
    const save2 = dndClass.saving_throws[1].name;
    const skills = dndClass.proficiency_choices[0].desc;

    card.innerHTML = `
        <h1 class="result-name">${name}</h1>
        <div class="card-info">
            <p><strong>Hit die:</strong> d${hitDie}</p>
            <p><strong>Saving Throws:</strong> ${save1} & ${save2}</p>
            <p><strong>Skills:</strong> ${skills}</p>
    `;

    card.className = "result-container classes-card";
}

//Faz a requisição
async function request(value, area) {
    try {
        errorMessage.textContent = "";
        
        const response = await fetch(`${api}${area}/${value}${languageSupport}`);

        if(!response.ok || !inputField.value) {
            errorMessage.textContent = `Não foi possível encontrar nenhum resultado equivalente ao texto digitado. Por favor, tente novamente.`;
            return;            
        }

        const responseObject = await response.json();

        renderResultCard(responseObject, area);        
    }
    catch (error) {
        console.log(error);
    }
}

//Faz com que a cor do botão de busca seja a mesma do botão de pesquisa atualmente selecionado
searchButtons.forEach(btn => {
    btn.addEventListener("click", (event) => {
        const btnActive = event.currentTarget;

        searchButtons.forEach(btn => {
            btn.classList.remove("active");
            const colorClass = btn.classList[1];

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

////////////FORM////////////
//Evento para simular o envio do formulário
form.addEventListener("submit", event => {
    event.preventDefault();

    const userName = document.querySelector("#name").value;

    form.innerHTML += `
        <p>Sua mensagem foi enviada, ${userName}.<br>
        Obrigado por preencher este formulário!</p> 
    `;

    form.reset();
});


//Inicializa os cards dos personagens na tela
getCharacters();