class Color {
    
        static RED = new Color("#FF0000")
        static GREEN = new Color("#00FF00")
        static BLUE = new Color("#0000FF")
        static BLACK = new Color("#000000")
        static WHITE = new Color("#FFFFFF")
        static YELLOW = new Color("#FFFF00")
        static ORANGE = new Color("#FFA500")
        static PURPLE = new Color("#FF00FF")
        static GREY = new Color("#A4A4A4")
        static PINK = new Color("#FFAAFF")
    
        constructor(public hex: string) { }
    
        static random() {
            // From http://www.paulirish.com/2009/random-hex-color-code-snippets/
            return new Color('#' + Math.floor(Math.random() * 16777215).toString(16));
        };
    
    }

class Direction {

    constructor(public x: number, public y: number, public index: number, public id: String, public color:Color) { }

    static NORTH = new Direction(0, 1, 0, "NORTH", Color.RED);
    static NORTHEAST = new Direction(1, 1, 1, "NORTHEAST", Color.ORANGE);
    static EAST = new Direction(1, 0, 2, "EAST", Color.YELLOW);
    static SOUTHEAST = new Direction(1, -1, 3, "SOUTHEAST", Color.GREEN);
    static SOUTH = new Direction(0, -1, 4, "SOUTH", Color.BLUE);
    static SOUTHWEST = new Direction(-1, -1, 5, "SOUTHWEST", Color.PURPLE);
    static WEST = new Direction(-1, 0, 6, "WEST", Color.PINK);
    static NORTHWEST = new Direction(-1, 1, 7, "NORTHWEST", Color.GREY);

    static ALL = [
        Direction.NORTH,
        Direction.NORTHEAST,
        Direction.EAST,
        Direction.SOUTHEAST,
        Direction.SOUTH,
        Direction.SOUTHWEST,
        Direction.WEST,
        Direction.NORTHWEST
    ];

    toString() {
        return this.id;
    }

    static random(): Direction {
        return RandomUtils.randomElement(Direction.ALL);
    }

    static randomRect(): Direction {
        return RandomUtils.randomElement([Direction.NORTH, Direction.SOUTH, Direction.EAST, Direction.WEST]);
    }


    opposite(): Direction {

        if (this == Direction.NORTH) {
            return Direction.SOUTH;
        }
        if (this == Direction.NORTHEAST) {
            return Direction.SOUTHWEST;
        }
        if (this == Direction.EAST) {
            return Direction.WEST;
        }
        if (this == Direction.SOUTHEAST) {
            return Direction.NORTHWEST;
        }
        if (this == Direction.SOUTH) {
            return Direction.NORTH;
        }
        if (this == Direction.SOUTHWEST) {
            return Direction.NORTHEAST;
        }
        if (this == Direction.WEST) {
            return Direction.EAST;
        }
        if (this == Direction.NORTHWEST) {
            return Direction.SOUTHEAST;
        }
    }

    clockwise(): Direction {
        if (this == Direction.NORTH) {
            return Direction.NORTHEAST;
        }
        if (this == Direction.NORTHEAST) {
            return Direction.EAST;
        }
        if (this == Direction.EAST) {
            return Direction.SOUTHEAST;
        }
        if (this == Direction.SOUTHEAST) {
            return Direction.SOUTH;
        }
        if (this == Direction.SOUTH) {
            return Direction.SOUTHWEST;
        }
        if (this == Direction.SOUTHWEST) {
            return Direction.WEST;
        }
        if (this == Direction.WEST) {
            return Direction.NORTHWEST;
        }
        if (this == Direction.NORTHWEST) {
            return Direction.NORTH;
        }
    }

    anticlockwise(): Direction {
        if (this == Direction.NORTH) {
            return Direction.NORTHWEST;
        }
        if (this == Direction.NORTHEAST) {
            return Direction.NORTH;
        }
        if (this == Direction.EAST) {
            return Direction.NORTHEAST;
        }
        if (this == Direction.SOUTHEAST) {
            return Direction.EAST;
        }
        if (this == Direction.SOUTH) {
            return Direction.SOUTHEAST;
        }
        if (this == Direction.SOUTHWEST) {
            return Direction.SOUTH;
        }
        if (this == Direction.WEST) {
            return Direction.SOUTHWEST;
        }
        if (this == Direction.NORTHWEST) {
            return Direction.WEST;
        }
    }

    

}

interface Agent {

    cell: Cell<Agent>;
    step();
    getColor(): Color;
}




class Cell<A extends Agent> {

    public neighbours: Cell<A>[];
    agent: A;

    constructor(public grid: Grid<A>, public x: number, public y: number) { }

    initNeighbours = function () {
        this.neighbours = [];
        var i, direction, nx, ny, neighbour;
        for (i = 0; i < Direction.ALL.length; i++) {
            direction = Direction.ALL[i];
            nx = this.x + direction.x;
            ny = this.y + direction.y;
            if (nx === this.grid.width) {
                nx = 0;
            } else if (nx === -1) {
                nx = this.grid.width - 1;
            }
            if (ny === this.grid.height) {
                ny = 0;
            } else if (ny === -1) {
                ny = this.grid.height - 1;
            }
            neighbour = this.grid.cells2D[nx][ny];
            this.neighbours[i] = neighbour;
        }
    }

    moveAgent(target: Cell<A>) {
        if (target.agent != null) {
            return false;
        }
        target.agent = this.agent;

        this.agent = null;
        target.agent.cell = target;
        return true;
    }

    toString() {
        return "(" + this.x + ',' + this.y + ")";
    }

    randomNeighbour(): Cell<A> {
        return RandomUtils.randomElement(this.neighbours);
    }

    neighbourAgents():A[]{
        let result = [];
        for (var i = 0; i < this.neighbours.length; i++) {
            var neighbour = this.neighbours[i];
            let agent = neighbour.agent;
            if (agent != null){
                result.push(agent);
            }
        }
        return result;
    }

    neighbour(direction: Direction): Cell<A> {
        return this.neighbours[direction.index];
    }


}



class Grid<A extends Agent> {


    private cells2D: Cell<A>[];
    private cellsList: Cell<A>[];
    private numCells: number;

    constructor(public width: number, public height: number) {

        var x, y, column, cell;

        this.cells2D = []; // 2D array of cells
        this.cellsList = []; // Flat array of cells

        for (x = 0; x < width; x++) {
            column = [];
            this.cells2D[x] = column;
        }
        for (x = 0; x < this.width; x++) {
            for (y = 0; y < this.height; y++) {
                cell = new Cell(this, x, y);
                this.cells2D[x][y] = cell;
                this.cellsList.push(cell);
            }
        }
        for (x = 0; x < this.cellsList.length; x++) {
            this.cellsList[x].initNeighbours();
        }
        this.numCells = this.cellsList.length;
    }

    randomCell() {
        return RandomUtils.randomElement(this.cellsList)
    }

    randomEmptyCell() {
        var emptyCells = []
        for (var i = 0; i < this.cellsList.length; i++) {
            var cell = this.cellsList[i];
            if (cell.agent == null) {
                emptyCells.push(cell);
            }
        }
        return RandomUtils.randomElement(emptyCells);
    }

    agents() {
        var result = []
        for (var i = 0; i < this.cellsList.length; i++) {
            var cell = this.cellsList[i];
            if (cell.agent != null) {
                result.push(cell.agent);
            }
        }
        return result;
    }

    cells(): Cell<A>[] {
        return this.cellsList;
    }

    cell(x: number, y: number): Cell<A> {
        return this.cells2D[x][y];
    }


}

class RandomUtils {

    static randomElement(list) {
        if (list.length == 0) {
            return null;
        }
        var index = RandomUtils.random(list.length);
        return list[index];
    }

    static randomBoolean() {
        return Math.random() > 0.5;
    }

    static random(max) {
        return Math.floor(Math.random() * max);
    }

    static shuffle(array: any[]) {
        array = array.slice();
        var counter = array.length, temp, index;
        while (counter > 0) {
            index = Math.floor(Math.random() * counter);
            counter--;
            temp = array[counter];
            array[counter] = array[index];
            array[index] = temp;
        }
        return array;
    }

}
