let data = JSON.parse(localStorage.getItem("snakeData"));

document.addEventListener('DOMContentLoaded', () => {
    initialize();
    data = JSON.parse(localStorage.getItem("snakeData"));
    textRefresh();
    refreshBoatsText();
});

// Données modifiable
const rows = 7;
const cols = 7;
let Shot = 15;
let boats = [
    // Exemple de boat
    {
        onflow : true, // Ne pas toucher
        name : 'Porte-avions', // Nom Modifiable
        position : {size : 5, direction : ''}, // Taille Modifiable
        positions: [
        ]
    },
    {
        onflow : true,
        name : 'Cuirassé',
        position : {size : 4, direction : ''},
        positions: [
        ]
    },
    {
        onflow : true,
        name : 'Destroyer',
        position : {size : 3, direction : ''},
        positions: [
        ]
    },
    {
        onflow : true,
        name : 'Patrouilleur',
        position : {size : 2, direction : ''},
        positions: [
        ]
    },
    // POUR RAJOUTER UN BATEAU
    // {
    //     onflow : true,
    //     name : 'NOM_DU_BATEAU',
    //     position : {size : TAILE_DU_BATEAU, direction : ''},
    //     positions: [
    //     ]
    // }
    
];

// Ne pas toucher
let started = false;
const overlay = document.getElementById("overlay");
const text = document.getElementById('text');
const hardmodeBTN = document.getElementById('hardmode');

hardmodeBTN.addEventListener('click', () => {
    Shot = hardmodeBTN.checked ? 10 : 15;
    textRefresh();
})

// Création du terrain
function initialize(){
    const grid = document.getElementById("grid");

    for (let r = 0; r < rows; r++) {
        const row = document.createElement("tr");

        for (let c = 0; c < cols; c++) {
            const cell = document.createElement("td");
            cell.classList.add("cell");
            cell.id = `cell-${c}-${r}`;
            cell.dataset.row = r;
            cell.dataset.col = c;
            cell.addEventListener('click', () => {
                shootCell(c,r);
            })
            row.appendChild(cell);
        }

        grid.appendChild(row);
    }
}

// créers les bateaux
function createBoat(){
    for(let boat of boats){
        let directionInt = getRandomInt(0,1);
        let direction = (directionInt === 0) ? 'horizontal' : 'vertical';
        boat.position.direction = direction;
        let error = true;
        let trypositions = [];
        while(error){
            trypositions = [];
            const xhead = getRandomInt(0,rows-1) ;
            const yhead = getRandomInt(0,cols-1);
            error = false;
            for(let j = 0; j < boat.position.size; j++){
                if(direction === 'horizontal'){
                    if(canExist(xhead-j,yhead)){
                        trypositions.push({x: xhead-j,y: yhead, hit:false});
                    }else{
                        error = true;
                        break;
                    }
                }else{
                    if(canExist(xhead,yhead-j)){
                        trypositions.push({x: xhead,y: yhead-j, hit:false});
                    }else{
                        error = true;
                        break;
                    }
                }
            }
        }
        boat.positions = trypositions;
    }
}

function canExist(x,y){
    if(x >=0 && y >=0 && x <= rows-1 && y <= cols-1){
        for(let boat of boats){
            for(let position of boat.positions){
                const positionx = position.x;
                const positiony = position.y;
                if(x === positionx && y === positiony){
                    return false;
                }
            }
        }
    }else {
        return false;
    }
    return true;
}

// Tirer sur une case
function shootCell(x,y){
    if(!started) return;
    if(canExist(x,y)){
        MissShot(x,y);
        Shot -=1;
    }else{
        HitShot(x,y);
    }
    if(Shot<=0){
        looseGame();
    }
    textRefresh();
    refreshBoatsStatus();
    refreshBoatsText();
}

function MissShot(x,y){
    const shotedCell = document.getElementById(`cell-${x}-${y}`);
    shotedCell.classList.add('miss');
}

function HitShot(x,y){
    const positions = boats.flatMap(b => b.positions);
    const shootedCell = document.getElementById(`cell-${x}-${y}`);
    shootedCell.classList.add('hit');
    const shootedPosition = positions.find(obj => obj.x === x && obj.y === y);
    shootedPosition.hit = true;
    refreshBoatsStatus();
}

function refreshBoatsStatus(){
    let win = true;
    for(let boat of boats){
        let isDown = true;
        for(let pose of boat.positions){
            if(!pose.hit){
                isDown = false;
                win = false;
            }
        }
        boat.onflow = !isDown;
    }
    if(win) winGame();
}

function refreshBoatsText(){
    const boatText = document.getElementById('boatsInfo');
    boatText.innerHTML = "";
    for(let boat of boats){
        boatText.innerHTML += `<span>${boat.name} : ${boat.onflow? 'En vie' : 'Coulé'}</span>`;
    }
}

function looseGame(){
    started = false;
    overlay.style.display = 'block';
    const cells = Array.from(document.getElementsByClassName('cell'));
    cells.forEach(element => {
        element.classList.remove('hit');
        element.classList.remove('miss');
    });
}

function winGame(){
    started = false;
    overlay.style.display = 'block';
    const cells = Array.from(document.getElementsByClassName('cell'));
    cells.forEach(element => {
        element.classList.remove('hit');
        element.classList.remove('miss');
    });
    text.innerHTML = `Vous avez gagné !!!`;
}

function Play(){
    const cells = Array.from(document.getElementsByClassName('cell'));
    cells.forEach(element => {
        element.classList.remove('hit');
        element.classList.remove('miss');
    });
    overlay.style.display = 'none';
    Shot = hardmodeBTN.checked ? 10 : 15 ;
    started = true;
    createBoat();
    textRefresh();
}

// Position des bateaux
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Affichage Text 
function textRefresh(){
    text.innerHTML = `Tir(s) restant(s) : ${Shot}`;
    if(Shot === 0){
        text.innerHTML = `Vous n'avez plus de tir !!!`;
    }
}