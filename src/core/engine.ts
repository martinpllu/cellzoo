// From ../lib/seedrandom.js
interface Math {
	seedrandom(seed:String)
}

interface Simulation<A extends Agent> {
	description:string;
	init(grid:Grid<A>)
	step(grid:Grid<A>)
}


class GridEngine<A extends Agent> {

	static engine:any; // Can't use generic types in statics...

	grid:Grid<A>;
	iteration = 0;
	ui:GridUI<A>;

	constructor(public simulation: Simulation<A>){
		var defaultSeed = Math.random().toString(36).substring(3);
		var seed = UrlUtils.parameter('seed', defaultSeed);
		Math.seedrandom(seed)
		var width = UrlUtils.intParameter('width', 100);
		var height = UrlUtils.intParameter('height', 100);
		this.grid = new Grid(width, height);
		var cellsize = UrlUtils.intParameter('cellsize', 4);
		simulation.init(this.grid);
		this.ui = new GridUI(this, cellsize);
		GridEngine.engine = this;
	}

	step(){

		// Need to use 'engine' variable since 'this' is not set when
		// called by requestAnimationFrame
		let engine = GridEngine.engine;
		engine.simulation.step(engine.grid);
		engine.ui.update();
		engine.iteration++;
	}

}

class UrlUtils {

	static params = {}

	static intParameter(name, defaultVal){
		var param = UrlUtils.parameter(name, defaultVal);
		if (param){
			return parseInt(param);
		}
		else {
			return defaultVal;
		}
	}

	static parameter(name, defaultVal) {
	    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
	    var value = match && decodeURIComponent(match[1].replace(/\+/g, ' '));
		if (value == undefined){
			value = defaultVal;
		}
		UrlUtils.params[name] = value;
		return value;
	}

	static fullUrl(){
		var url = [location.protocol, '//', location.host, location.pathname].join('');
		var paramPart = ''
		var paramsAndVals = [];
		for (var k in UrlUtils.params){
            paramsAndVals.push(k + "=" + UrlUtils.params[k]);
        }
		if (paramsAndVals.length > 0){
			paramPart = "?" + paramsAndVals.join("&");
		}
		return url + paramPart;
	}

}

window.onload = function(){
	var sim = UrlUtils.parameter('sim', 'life');
	var script = document.createElement('script');
	script.src = `js/zoo/${sim}.js`;
	script.onload = function(){
		document.getElementById('content').setAttribute('style', 'display:block;');
		document.getElementById('spinner').setAttribute('style', 'display:none;');
	}
	document.getElementById('title').textContent = sim;
	document.head.appendChild(script);
}
