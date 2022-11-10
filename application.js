class Application {
	constructor() {
		this.dirtyWordsURL = 'https://raw.githubusercontent.com/skidoodle/ekreta-src/master/KretaWeb/Resources/DirtyWords.xml';
		this.dirtyWords = [];
		this.request = new XMLHttpRequest();
		this.initCanvasVariables();
	}
	initCanvasVariables() {
		this.dashLen = 220;
		this.dashOffset = 220;
		this.speed = 5;
		this.dirtyWord = '';
		this.index = 0;
		this.x = 30;
	}
    // Download the dirty words xml, parse it to JSON and store it in a variable.
	doDownload() {
		this.request.open('GET', this.dirtyWordsURL, true);
		this.request.onload = this.onloadFunction.bind(this);
		this.request.send();
	}
	onloadFunction() {
		if (this.request.status >= 200 && this.request.status < 400) {
			const data = this.request.responseText;
			const parser = new DOMParser();
			const xmlDoc = parser.parseFromString(data, "text/xml");
			// the xml contans a root element called 'DirtyWords' and the actual words are in the elements called 'Word'
			const dirtyWords = xmlDoc.getElementsByTagName('Word');
			for (let i = 0; i < dirtyWords.length; i++) {
				this.dirtyWords.push(dirtyWords[i].childNodes[0].nodeValue);
			}
			// show the hidden button
			document.getElementById('get-dirty').style.display = 'block';
		}
	}
	// returns a random element from the dirty words array
	getDirty() {
		return this.dirtyWords[Math.floor(Math.random() * this.dirtyWords.length)];
	}
	displayNewDirty() {
		this.initCanvasVariables();
		this.dirtyWord = this.getDirty();
		this.draw();
	}
	// draw the dirty word on the canvas
	// The background of the canvas has to be black, the font color white and the font size 30px
	draw() {
		const canvas = document.getElementById('canvas');
		this.ctx = canvas.getContext('2d');
		this.ctx.font = "50px Comic Sans MS, cursive, TSCu_Comic, sans-serif"; 
		this.ctx.lineWidth = 4;
		this.ctx.lineJoin = "round";
		this.ctx.globalAlpha = 2/3;
		this.ctx.strokeStyle = "#ffffff";
		this.ctx.fillStyle = "#ffffff";
		this.ctx.clearRect(0, 0, canvas.width, canvas.height);
		this.render();
	}
	render() {
		this.ctx.clearRect(this.x, 0, 60, 150);
		this.ctx.setLineDash([this.dashLen - this.dashOffset, this.dashOffset - this.speed]); // create a long dash mask
		this.dashOffset -= this.speed;                                         // reduce dash length
		this.ctx.strokeText(this.dirtyWord[this.index], this.x, 90);                               // stroke letter

		if (this.dashOffset > 0) {
			requestAnimationFrame(this.render.bind(this));             // animate
		} else {
			this.ctx.fillText(this.dirtyWord[this.index], this.x, 90);                               // fill final letter
			this.dashOffset = this.dashLen;                                      // prep next char
			this.x += this.ctx.measureText(this.dirtyWord[this.index++]).width + this.ctx.lineWidth * Math.random();
			this.ctx.setTransform(1, 0, 0, 1, 0, 3 * Math.random());        // random y-delta
			this.ctx.rotate(Math.random() * 0.005);                         // random rotation
			if (this.index < this.dirtyWord.length) {
				requestAnimationFrame(this.render.bind(this));
			}
		}
	}
}
