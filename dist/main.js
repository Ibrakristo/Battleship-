/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
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
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  game,
});

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsIm1hcHBpbmdzIjoiOztVQUFBO1VBQ0E7Ozs7O1dDREE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7Ozs7Ozs7OztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsc0JBQXNCLE9BQU87QUFDN0I7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQkFBMkIsT0FBTztBQUNsQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkJBQTJCLE9BQU87QUFDbEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUCxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1AsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscURBQXFELE1BQU07QUFDM0Q7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGlFQUFlO0FBQ2Y7QUFDQSxDQUFDLEVBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly90ZW1wbGF0ZTAwMS93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly90ZW1wbGF0ZTAwMS93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vdGVtcGxhdGUwMDEvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly90ZW1wbGF0ZTAwMS93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL3RlbXBsYXRlMDAxLy4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIFRoZSByZXF1aXJlIHNjb3BlXG52YXIgX193ZWJwYWNrX3JlcXVpcmVfXyA9IHt9O1xuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwibGV0IGdhbWUgPSAoZnVuY3Rpb24gKCkge1xuICBsZXQgdHVybiA9IDA7XG4gIGxldCBwbGF5ZXJBID0gcGxheWVyKFwiQUJDXCIpO1xuICBsZXQgcGxheWVyQiA9IHBsYXllcihcIkNBRFwiKTtcbiAgZnVuY3Rpb24gY2hlY2tGb3JXaW5uZXIoKSB7XG4gICAgbGV0IEFsb3NlID0gcGxheWVyQS5nZXRTaGlwcygpLnJlZHVjZSgoeCwgc2hpcCkgPT4ge1xuICAgICAgaWYgKCFzaGlwLmRlc3Ryb3llZCkgcmV0dXJuIGZhbHNlO1xuICAgICAgZWxzZSByZXR1cm4geDtcbiAgICB9LCB0cnVlKTtcbiAgICBsZXQgQmxvc2UgPSBwbGF5ZXJCLmdldFNoaXBzKCkucmVkdWNlKCh4LCBzaGlwKSA9PiB7XG4gICAgICBpZiAoIXNoaXAuZGVzdHJveWVkKSByZXR1cm4gZmFsc2U7XG4gICAgICBlbHNlIHJldHVybiB4O1xuICAgIH0sIHRydWUpO1xuICAgIFxuICAgIGlmIChBbG9zZSkgcmV0dXJuIHBsYXllckI7XG4gICAgZWxzZSBpZiAoQmxvc2UpIHJldHVybiBwbGF5ZXJBO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNoYW5nZVR1cm4oKSB7XG4gICAgdHVybiA9IHR1cm4gPyAwIDogMTtcbiAgICBpZih0dXJuID09MSl7XG4gICAgICB3aGlsZSh0cnVlKXtcbiAgICAgIGxldCBpbmRleCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSoxMDApKzE7XG4gICAgICBsZXQgeCA9IERPTS5jcHVoaXQoaW5kZXgpO1xuICAgICAgaWYoeCA9PSB1bmRlZmluZWQpIGNvbnRpbnVlO1xuICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIGZ1bmN0aW9uIGhpdHRpbmcodHVybk9wcHNpdGUsaW5kZXgpIHtcbiAgICB0dXJuT3Bwc2l0ZSA9IHR1cm5PcHBzaXRlID09IFwiQVwiPzE6MDtcbiAgICBpZih0dXJuT3Bwc2l0ZSAhPSB0dXJuKSByZXR1cm4gO1xuICAgIGxldCBwbGF5ZXIgPSB0dXJuID8gcGxheWVyQSA6IHBsYXllckI7XG4gICAgbGV0IHNoaXBzID0gcGxheWVyLmdldFNoaXBzKCk7XG4gICAgbGV0IHNoaXA7XG4gICAgZm9yKGxldCBpIG9mIHNoaXBzKXtcbiAgICAgIGZvcihsZXQgaiBvZiBpLmluZGV4ZXMpe1xuICAgICAgICBpZihqID09IGluZGV4KVxuICAgICAgICBzaGlwID0gaTtcbiAgICAgIH1cbiAgICB9XG4gICAgY2hhbmdlVHVybigpO1xuXG4gICAgIGlmKCFzaGlwKSByZXR1cm4gZmFsc2U7ICBcbiAgICAgc2hpcC5oaXRzIC09MTtcbiAgICAgaWYoc2hpcC5oaXRzID09IDApIHNoaXAuZGVzdHJveWVkID0gdHJ1ZTtcblxuICAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGluaXRDcHUoKXtcbiAgICBsZXQgYXJyID0gW107XG4gICAgbGV0IHBsYXllciA9IHBsYXllckI7XG4gICAgd2hpbGUoIXBsYXllci5yZWFkeSl7XG4gICAgICBsZXQgc2l6ZSAgPSBwbGF5ZXIuc2l6ZU9mU2hpcCgpO1xuICAgICAgbGV0IHJhbmRvbSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSoxMDApO1xuICAgICAgaWYoKE1hdGguY2VpbChyYW5kb20vMTApKjEwLXJhbmRvbSk8c2l6ZSljb250aW51ZTtcbiAgICAgIGlmKGFyci5pbmNsdWRlcyhyYW5kb20pKSBjb250aW51ZTtcblxuICAgICAgZm9yKGxldCBpID0gMCA7IGk8c2l6ZTtpKyspe1xuICAgICAgYXJyLnB1c2gocmFuZG9tK2kpO1xuICAgICAgcGxheWVyLnNldFNoaXBJbmRleGVzKHJhbmRvbStpKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgfVxuXG4gIGluaXRDcHUoKTtcbiAgcmV0dXJuIHtcbiAgICBwbGF5ZXJBLFxuICAgIHBsYXllckIsXG4gICAgY2hlY2tGb3JXaW5uZXIsXG4gICAgY2hhbmdlVHVybixcbiAgICBoaXR0aW5nLFxuICB9O1xufSkoKTtcblxubGV0IERPTSA9IGZ1bmN0aW9uKCl7XG4gIGxldCB3cmFwcGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi53cmFwcGVyXCIpO1xuICBsZXQgZW5lbXlDb25hdGluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI0VcIik7XG4gIGxldCBjb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI0FcIik7XG4gIHdyYXBwZXIucmVtb3ZlQ2hpbGQoZW5lbXlDb25hdGluZXIpO1xuICBmdW5jdGlvbiBpbml0RXZlbnQoKXtcbiAgICBsZXQgc3F1YXJlcyA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yQWxsKFwiLnNxdWFyZVwiKTtcbiAgICBzcXVhcmVzLmZvckVhY2goKHNxdWFyZSk9PntcbiAgICAgIHNxdWFyZS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwoZSk9PntcbiAgICAgICAgbGV0IGluZGV4ID0gcGFyc2VJbnQoZS50YXJnZXQuaWQucmVwbGFjZShcInBvaW50QVwiLFwiXCIpKTtcbiAgICAgICAgaWYoIWdhbWUucGxheWVyQS5yZWFkeSl7XG4gICAgICAgICAgbGV0IHNpemUgPSBnYW1lLnBsYXllckEuc2l6ZU9mU2hpcCgpO1xuICAgICAgICAgIGlmKCEoKE1hdGguY2VpbChpbmRleC8xMCkqMTApLWluZGV4Pj1zaXplKSl7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICAgIGxldCBlbGVtZW50ID0gZS50YXJnZXQ7XG4gICAgICAgICAgZm9yKGxldCBpICA9IDAgOyBpPHNpemU7aSsrKXtcbiAgICAgICAgICAgIGlmKGVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKFwic2hpcFwiKSlcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIGVsZW1lbnQgPSBlbGVtZW50Lm5leHRFbGVtZW50U2libGluZ1xuICAgICAgICAgIH1cbiAgICAgICAgICBlbGVtZW50ID0gZS50YXJnZXQ7XG4gICAgICAgICAgZm9yKGxldCBpICA9IDAgOyBpPHNpemU7aSsrKXtcbiAgICAgICAgICAgIGdhbWUucGxheWVyQS5zZXRTaGlwSW5kZXhlcyhpbmRleCtpKTtcbiAgICAgICAgICAgIGVsZW1lbnQuY2xhc3NMaXN0LmFkZChcInNoaXBcIilcbiAgICAgICAgICAgIGVsZW1lbnQgPSBlbGVtZW50Lm5leHRFbGVtZW50U2libGluZztcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYoIWdhbWUucGxheWVyQS5yZWFkeSkgcmV0dXJuO1xuICAgICAgICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQoZW5lbXlDb25hdGluZXIpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9KVxuICAgIGxldCBlc3F1YXJlcyA9IGVuZW15Q29uYXRpbmVyLnF1ZXJ5U2VsZWN0b3JBbGwoXCIuc3F1YXJlXCIpO1xuICAgIGVzcXVhcmVzLmZvckVhY2goKHNxdWFyZSk9PntcbiAgICAgIHNxdWFyZS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwoZSk9PntcbiAgICAgICAgaWYoZS50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKFwiaGl0XCIpfHxlLnRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoXCJtaXNzXCIpKSByZXR1cm47XG4gICAgICAgIGxldCBpbmRleCA9IGUudGFyZ2V0LmlkLnJlcGxhY2UoXCJwb2ludEVcIixcIlwiKTtcbiAgICAgICAgbGV0IHR1cm4gPSBlLnRhcmdldC5wYXJlbnRFbGVtZW50LmlkO1xuICAgICAgICBsZXQgaGl0ID0gZ2FtZS5oaXR0aW5nKHR1cm4saW5kZXgpO1xuICAgICAgICBpZihoaXQgPT0gdW5kZWZpbmVkKSByZXR1cm47XG4gICAgICAgIGlmIChoaXQpIGUudGFyZ2V0LmNsYXNzTGlzdC5hZGQoXCJoaXRcIilcbiAgICAgICAgZWxzZSBlLnRhcmdldC5jbGFzc0xpc3QuYWRkKFwibWlzc1wiKTtcbiAgICAgIH0pXG4gICAgfSlcbiAgfVxuICBpbml0RXZlbnQoKTtcbiAgXG4gICAgZnVuY3Rpb24gY3B1aGl0KGluZGV4KXtcbiAgICAgIGxldCBlbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgI3BvaW50QSR7aW5kZXh9YClcbiAgICAgIGlmKGVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKFwiaGl0XCIpfHxlbGVtZW50LmNsYXNzTGlzdC5jb250YWlucyhcIm1pc3NcIikpIHJldHVybjtcbiAgICAgIGxldCBoaXQgPSBnYW1lLmhpdHRpbmcoXCJBXCIsaW5kZXgpO1xuXG4gICAgICBpZihoaXQgPT0gdW5kZWZpbmVkKSByZXR1cm47XG4gICAgICBpZiAoaGl0KSBlbGVtZW50LmNsYXNzTGlzdC5hZGQoXCJoaXRcIilcbiAgICAgIGVsc2UgZWxlbWVudC5jbGFzc0xpc3QuYWRkKFwibWlzc1wiKTtcbiAgICAgIHJldHVybiBoaXQ7XG4gICAgfVxuXG4gICAgcmV0dXJue1xuICAgICAgY3B1aGl0LFxuICAgIH1cbiAgfSgpO1xuXG5mdW5jdGlvbiBwbGF5ZXIobmFtZSkge1xuICBsZXQgc2hpcEluZGV4ID0gMDtcbiAgbGV0IHNoaXBzO1xuICBsZXQgcCA9ICB7XG4gICAgbmFtZSxcbiAgICBnZXRTaGlwcyxcbiAgICBzZXRTaGlwSW5kZXhlcyxcbiAgICByZWFkeSA6IGZhbHNlLFxuICAgIHNpemVPZlNoaXAsXG4gIH07XG5cblxuICBmdW5jdGlvbiBpbmNyZWFzZUluZGV4KCl7XG4gICAgc2hpcEluZGV4ICs9MTtcbiAgICBpZihzaGlwSW5kZXggPT0gNSl7XG4gICAgICAgIHAucmVhZHkgPSB0cnVlO1xuICAgIH1cbiAgfVxuICBmdW5jdGlvbiBzZXRTaGlwSW5kZXhlcyhudW0pe1xuICAgIGxldCBzaGlwcyA9IGdldFNoaXBzKCk7XG4gICAgbGV0IGluZGV4ID0gc2hpcEluZGV4O1xuICAgIGlmKHNoaXBzW2luZGV4XS5pbmRleGVzLmluY2x1ZGVzKG51bSkpIHJldHVybjtcbiAgICBzaGlwc1tpbmRleF0uaW5kZXhlcy5wdXNoKG51bSk7XG4gICAgaWYoc2hpcHNbaW5kZXhdLmluZGV4ZXMubGVuZ3RoID09IHNoaXBzW2luZGV4XS5sZW5ndGgpIGluY3JlYXNlSW5kZXgoKTtcbiAgfVxuICBmdW5jdGlvbiBzaXplT2ZTaGlwKCl7XG4gICAgbGV0IHNoaXBzID0gZ2V0U2hpcHMoKTtcbiAgICBsZXQgaW5kZXggPSBzaGlwSW5kZXg7XG4gICAgcmV0dXJuIHNoaXBzW2luZGV4XS5sZW5ndGg7XG4gIH1cbiAgZnVuY3Rpb24gY3JlYXRlU2hpcHMoKSB7XG4gICAgc2hpcHMgPSBbXG4gICAgICB7XG4gICAgICAgIG5hbWU6IFwiQ2FycmllclwiLFxuICAgICAgICBsZW5ndGg6IDUsXG4gICAgICAgIGhpdHM6IDUsXG4gICAgICAgIGluZGV4ZXM6IFtdLFxuICAgICAgICBkZXN0cm95ZWQ6IGZhbHNlLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgbmFtZTogXCJCYXR0bGVzaGlwXCIsXG4gICAgICAgIGxlbmd0aDogNCxcbiAgICAgICAgaGl0czogNCxcbiAgICAgICAgaW5kZXhlczogW10sXG4gICAgICAgIGRlc3Ryb3llZDogZmFsc2UsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBuYW1lOiBcIkNydWlzZXJcIixcbiAgICAgICAgbGVuZ3RoOiAzLFxuICAgICAgICBoaXRzOiAzLFxuICAgICAgICBpbmRleGVzOiBbXSxcbiAgICAgICAgZGVzdHJveWVkOiBmYWxzZSxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIG5hbWU6IFwiU3VibWFyaW5lXCIsXG4gICAgICAgIGxlbmd0aDogMyxcbiAgICAgICAgaGl0czogMyxcbiAgICAgICAgaW5kZXhlczogW10sXG4gICAgICAgIGRlc3Ryb3llZDogZmFsc2UsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBuYW1lOiBcIkRlc3Ryb3llclwiLFxuICAgICAgICBsZW5ndGg6IDIsXG4gICAgICAgIGhpdHM6IDIsXG4gICAgICAgIGluZGV4ZXM6IFtdLFxuICAgICAgICBkZXN0cm95ZWQ6IGZhbHNlLFxuICAgICAgfSxcbiAgICBdO1xuICB9XG4gIGNyZWF0ZVNoaXBzKCk7XG5cbiAgZnVuY3Rpb24gZ2V0U2hpcHMoKSB7XG4gICAgcmV0dXJuIHNoaXBzO1xuICB9XG5cbiAgcmV0dXJuIHA7XG59XG5leHBvcnQgZGVmYXVsdCB7XG4gIGdhbWUsXG59O1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9