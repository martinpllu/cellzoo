/// <reference path="../core/grid.ts"/>
/// <reference path="../core/engine.ts"/>



class Collider implements Agent {

    direction = Direction.random();

    constructor(public cell:Cell<Agent>){}

    getColor(){
        return this.direction.color;
    }

    step(){
        let neighbours = RandomUtils.shuffle(this.cell.neighbourAgents());
        for (var i = 0; i < neighbours.length; i++) {
            let other = neighbours[i];
            if (other != null) {
                this.direction = other.direction;
                break;
            }
        }
        var target = this.cell.neighbour(this.direction);
        this.cell.moveAgent(target);
    }

}

class Colliders implements Simulation<Collider> {

    description = `
    <p>Each cell contains an agent with a random direction, colour coded as follows:
    ${this.describeColours()}</p>
    <p>When agents collide, one agent (selected at random) inherits the direction of the other agent.</p>

    <p>An agent can only move if their target cell is empty.</p>

    `

    describeColours(){
        let result = '';
        for (let direction of Direction.ALL){
            result += `<span style="color:${direction.color.hex};margin:4px">${direction.id.toLowerCase()}</span>`;
        }
        return result;
    }

    init(grid: Grid<Collider>) {
        var density = UrlUtils.parameter('density', '0.5');
        var n = Math.floor(grid.width * grid.height * parseFloat(density));
        for (var i=0; i<n; i++){
            var cell = grid.randomEmptyCell();
            cell.agent = new Collider(cell);
        }
    }

    step(grid: Grid<Collider>){
        var colliders = grid.agents();
        colliders = RandomUtils.shuffle(colliders);
        for (var i = 0; i < colliders.length; i++) {
    		var agent = colliders[i];
            agent.step();
        }
    }

}

var colliders = new Colliders();
var engine = new GridEngine(colliders);
engine.step();
