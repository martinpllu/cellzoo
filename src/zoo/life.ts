/// <reference path="../core/grid.ts"/>
/// <reference path="../core/engine.ts"/>

class LifeAgent implements Agent {

    alive: boolean;
    aliveNext: boolean;
    
    constructor(public cell:Cell<LifeAgent>){
        this.alive = Math.random() > 0.5;
    }

    step(){
        let n = this.countAliveNeighbours();
        if (this.alive) {
            this.aliveNext = n == 2 || n == 3;
        } 
        else {
            this.aliveNext = n == 3;
        }
    }

    countAliveNeighbours():number {
        let neighbours = this.cell.neighbourAgents();
        let n = 0;
        for (let i = 0; i < neighbours.length; i++) {
            if (neighbours[i].alive) n++;
        }
        return n;
    }

    update(){
        this.alive = this.aliveNext;
    }

    getColor(){
        return this.alive ? Color.GREEN : Color.BLACK;
    }

}


class Life implements Simulation<LifeAgent> {

    description = `John Conway's <a href="https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life">Game of Life</a>`

    init(grid: Grid<LifeAgent>) {
        for (let cell of grid.cells()){
            cell.agent = new LifeAgent(cell);
        }
    }

    step(grid: Grid<LifeAgent>){
        let cells = grid.cells();
        let numCells = cells.length;
        for (let i = 0; i < numCells; i++) {
            cells[i].agent.step();
            
        }
        for (let k = 0; k < numCells; k++) {
            cells[k].agent.update();
        }

    }

}


var life = new Life();
new GridEngine(life).step();
