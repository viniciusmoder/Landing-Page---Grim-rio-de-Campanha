const searchContainer = document.querySelector(".search");
const searchButtons = document.querySelectorAll(".btn-option");
const btnSearch = document.querySelector("#btn-search");
const inputField = document.querySelector("#search-field");

const api = `https://www.dnd5eapi.co/api/2014/`;
const languageSupport = "?lang=pt-BR";

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
    }
}

function renderClass(dndClass, card) {
    console.log("passou no swithc");
    const name = dndClass.name;
    const hitDie = dndClass.hit_die;

    card.innerHTML = name;
    card.innerHTML += hitDie;

    card.classList.add("classes-card");
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


//     if (btn.classList.contains("active")) {

//         if (btn.classList.contains("color-classes")) {
//             searchContainer.classList.add("color-classes");
//         }

//         if (btn.classList.contains("color-especies")) {
//             searchContainer.classList.add("color-especies");
//         }

//         if (btn.classList.contains("color-magias")) {
//             searchContainer.classList.add("color-magias");
//             btn.classList.toggle("color-magias");
//             btn.classList.toggle("transparent");
//         }
        
//         if (btn.classList.contains("color-criaturas")) {
//             searchContainer.classList.add("color-criaturas");
//         }

//         if (btn.classList.contains("color-itens")) {
//             searchContainer.classList.add("color-itens");
//         }        
//     }
// });

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
