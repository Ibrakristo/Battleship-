let game = (function () {
  let turn = 0;
  let playerA = player("ABC");
  let playerB = player("CAD");
  function checkForWinner() {
    let Alose = playerA.getShips().reduce((x, ship) => {
      if (!ship.destroyed) return false;
      else return x;
    }, true);
    let Blose = playerB.getShips().reduce((x, ship) => {
      if (!ship.destroyed) return false;
      else return x;
    }, true);
    
    if (Alose) return playerB;
    else if (Blose) return playerA;
    return false;
  }

  function changeTurn() {
    turn = turn ? 0 : 1;
    if(turn ==1){
      while(true){
      let index = Math.floor(Math.random()*100)+1;
      let x = DOM.cpuhit(index);
      if(x == undefined) continue;
      break;
      }
    }
  }
  function hitting(turnOppsite,index) {
    turnOppsite = turnOppsite == "A"?1:0;
    if(turnOppsite != turn) return ;
    let player = turn ? playerA : playerB;
    let ships = player.getShips();
    let ship;
    for(let i of ships){
      for(let j of i.indexes){
        if(j == index)
        ship = i;
      }
    }
    changeTurn();

     if(!ship) return false;  
     ship.hits -=1;
     if(ship.hits == 0) ship.destroyed = true;

     return true;
  }

  function initCpu(){
    let arr = [];
    let player = playerB;
    while(!player.ready){
      let size  = player.sizeOfShip();
      let random = Math.floor(Math.random()*100);
      if((Math.ceil(random/10)*10-random)<size)continue;
      if(arr.includes(random)) continue;

      for(let i = 0 ; i<size;i++){
      arr.push(random+i);
      player.setShipIndexes(random+i);
      }
    }

  }

  initCpu();
  return {
    playerA,
    playerB,
    checkForWinner,
    changeTurn,
    hitting,
  };
})();

let DOM = function(){
  let wrapper = document.querySelector(".wrapper");
  let enemyConatiner = document.querySelector("#E");
  let container = document.querySelector("#A");
  wrapper.removeChild(enemyConatiner);
  function initEvent(){
    let squares = container.querySelectorAll(".square");
    squares.forEach((square)=>{
      square.addEventListener("click",(e)=>{
        let index = parseInt(e.target.id.replace("pointA",""));
        if(!game.playerA.ready){
          let size = game.playerA.sizeOfShip();
          if(!((Math.ceil(index/10)*10)-index>=size)){
            return;
          }
          let element = e.target;
          for(let i  = 0 ; i<size;i++){
            if(element.classList.contains("ship"))
            return;
            element = element.nextElementSibling
          }
          element = e.target;
          for(let i  = 0 ; i<size;i++){
            game.playerA.setShipIndexes(index+i);
            element.classList.add("ship")
            element = element.nextElementSibling;
          }
          if(!game.playerA.ready) return;
          wrapper.appendChild(enemyConatiner);
          return;
        }
      })
    })
    let esquares = enemyConatiner.querySelectorAll(".square");
    esquares.forEach((square)=>{
      square.addEventListener("click",(e)=>{
        if(e.target.classList.contains("hit")||e.target.classList.contains("miss")) return;
        let index = e.target.id.replace("pointE","");
        let turn = e.target.parentElement.id;
        let hit = game.hitting(turn,index);
        if(hit == undefined) return;
        if (hit) e.target.classList.add("hit")
        else e.target.classList.add("miss");
      })
    })
  }
  initEvent();
  
    function cpuhit(index){
      let element = document.querySelector(`#pointA${index}`)
      if(element.classList.contains("hit")||element.classList.contains("miss")) return;
      let hit = game.hitting("A",index);

      if(hit == undefined) return;
      if (hit) element.classList.add("hit")
      else element.classList.add("miss");
      return hit;
    }

    return{
      cpuhit,
    }
  }();

function player(name) {
  let shipIndex = 0;
  let ships;
  let p =  {
    name,
    getShips,
    setShipIndexes,
    ready : false,
    sizeOfShip,
  };


  function increaseIndex(){
    shipIndex +=1;
    if(shipIndex == 5){
        p.ready = true;
    }
  }
  function setShipIndexes(num){
    let ships = getShips();
    let index = shipIndex;
    if(ships[index].indexes.includes(num)) return;
    ships[index].indexes.push(num);
    if(ships[index].indexes.length == ships[index].length) increaseIndex();
  }
  function sizeOfShip(){
    let ships = getShips();
    let index = shipIndex;
    return ships[index].length;
  }
  function createShips() {
    ships = [
      {
        name: "Carrier",
        length: 5,
        hits: 5,
        indexes: [],
        destroyed: false,
      },
      {
        name: "Battleship",
        length: 4,
        hits: 4,
        indexes: [],
        destroyed: false,
      },
      {
        name: "Cruiser",
        length: 3,
        hits: 3,
        indexes: [],
        destroyed: false,
      },
      {
        name: "Submarine",
        length: 3,
        hits: 3,
        indexes: [],
        destroyed: false,
      },
      {
        name: "Destroyer",
        length: 2,
        hits: 2,
        indexes: [],
        destroyed: false,
      },
    ];
  }
  createShips();

  function getShips() {
    return ships;
  }

  return p;
}
export default {
  game,
};
