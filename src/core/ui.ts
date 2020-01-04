
class GridUI<A extends Agent> {

	paint = true;
	looping = true;
	delay = 0;
	lastFrameTime = 0;
	lastUpdatedFpsTime = 0;
	canvas: HTMLCanvasElement;
	context: CanvasRenderingContext2D;

	constructor(private engine:GridEngine<A>, private cellsize){
		this.initDescription();
		this.initButtons();
		this.initPermalink();
		this.initCanvas();
	}

	initDescription(){
		var description = document.getElementById('description');
		description.innerHTML = this.engine.simulation.description;
	}

	initPermalink(){
		var permalink = document.getElementById('permalink');
		permalink.setAttribute('href', UrlUtils.fullUrl())
	}

	initButtons(){
		var play = document.getElementById('play');
		var pause = document.getElementById('pause');
		var step = document.getElementById('step');
		var faster = document.getElementById('faster');
		var slower = document.getElementById('slower');
		var paintOff = document.getElementById('paint_off');
		var paintOn = document.getElementById('paint_on');
		var ui = this;
		play.addEventListener('click', function(e){
	        ui.looping = true;
			play.classList.add('hide');
			pause.classList.remove('hide');
			step.classList.add('disabled');
			faster.classList.remove('disabled');
			slower.classList.remove('disabled');
			paintOff.classList.remove('disabled');
			engine.step();
	    });
		pause.addEventListener('click', function(e){
	        ui.looping = false;
			play.classList.remove('hide');
			pause.classList.add('hide');
			step.classList.remove('disabled');
			faster.classList.add('disabled');
			slower.classList.add('disabled');
			paintOff.classList.add('disabled');
	    });
		step.addEventListener('click', function(e){
		    if (!ui.looping){
		        ui.engine.simulation.step(ui.engine.grid);
		    }
		});
		faster.addEventListener('click', function(e){
		    ui.delay = Math.max(ui.delay-50, 0);
			ui.delay
		});

		slower.addEventListener('click', function(e){
		    ui.delay = ui.delay+50;
		});

		paintOn.addEventListener('click', function(e){
		    ui.paint = true;
			paintOn.classList.add('hide')
			paintOff.classList.remove('hide')
			play.classList.remove('disabled');
			pause.classList.remove('disabled');
			faster.classList.remove('disabled');
			slower.classList.remove('disabled');
		});

		paintOff.addEventListener('click', function(e){
		    ui.paint = false;
			paintOff.classList.add('hide')
			paintOn.classList.remove('hide')
			faster.classList.add('disabled');
			slower.classList.add('disabled');
			play.classList.add('disabled');
			pause.classList.add('disabled');
		});
		// pause.click();

	}

    initCanvas() {
        this.canvas = <HTMLCanvasElement>document.getElementById('canvas');
        this.canvas.setAttribute("width", (this.cellsize * this.engine.grid.width).toString());
        this.canvas.setAttribute("height", (this.cellsize * this.engine.grid.height).toString());
        this.context = <CanvasRenderingContext2D>this.canvas.getContext('2d');CanvasPattern
		let self = this;
		this.canvas.onclick = function(event:MouseEvent){
			var rect = self.canvas.getBoundingClientRect();
			var x = event.clientX - rect.left;
			var y = event.clientY - rect.top;
			console.log("x: " + x + " y: " + y);
			let cellx = Math.floor(x/self.cellsize);
			let celly = Math.floor(y/self.cellsize);
			let cell = self.engine.grid.cell(cellx, celly);
			console.log(`Cell [${cellx}, ${celly}]`)
			console.log(cell.agent);
		}
    }

    clear() {
        this.context.fillStyle = Color.BLACK.hex;
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    square(x:number, y:number, color:Color) {
        this.context.fillStyle = color.hex;
        this.context.fillRect(x * this.cellsize, y * this.cellsize, this.cellsize, this.cellsize);
    }

    draw(grid: Grid<A>) {
        this.clear();
        var cells = grid.cells();
        for (var i = 0; i < cells.length; i++) {
			var cell = cells[i];
			if (cell.agent != null && cell.agent.getColor() != Color.BLACK){
            	this.square(cell.x, cell.y, cell.agent.getColor());
			}
        }
    }

	update(){
		let self = this;
		let engine = self.engine;
		this.updateFps();
		if (this.paint){
			this.draw(self.engine.grid);
			if (this.looping){
		        setTimeout(function () {
		            requestAnimationFrame(self.engine.step);
		        }, this.delay);
			}
		}
		else {
			setTimeout(function () {
	            engine.step.call(engine);
	        }, 0);
		}
	}

	updateFps(){
		var currentTime = new Date().getTime()
		if (currentTime - this.lastUpdatedFpsTime > 200){
			var elapsed = currentTime - this.lastFrameTime;
			var fps = 1000 / elapsed;
			var roundedFps = fps.toFixed(1);
			document.getElementById('fps').innerHTML = roundedFps;
			this.lastUpdatedFpsTime = currentTime;
		}
		this.lastFrameTime = currentTime;
		document.getElementById('iteration').innerHTML = this.engine.iteration.toString();

	}

}


// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating

// requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel

// MIT license

(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'],
        x;
    for (x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() {
                callback(currTime + timeToCall);
            },
                timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
} ());
