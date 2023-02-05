import index from './index.js'

describe("player",function(){
    test("creating ships",()=>{
        expect(index.game.playerA.getShips()).toEqual([{
            name:"Carrier",
            length:5,
            hits:5,
            indexes:[],
            destroyed:false,
        },{
            name:"Battleship",
            length:4,
            hits:4,
            indexes:[],
            destroyed:false,
        },{
            name:"Cruiser",
            length:3,
            hits:3,
            indexes:[],
            destroyed:false,
        },{
            name:"Submarine",
            length:3,
            hits:3,
            indexes:[],
            destroyed:false,
        },{
            name:"Destroyer",
            length:2,
            hits:2,
            indexes:[],
            destroyed:false,
        }])
    })
})
describe("gameController",()=>{
    test("winning",()=>expect(index.game.checkForWinner()).toBe(false))
    test("hitting",()=>{
        index.game.playerA.getShips()[0].indexes.push(1);
        index.game.hitting(1,1);
        expect(index.game.playerA.getShips()[0].hits).toBe(4);
    })
})

