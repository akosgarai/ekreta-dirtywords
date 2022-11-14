class Application {
	constructor() {
		this.dirtyWordsURL = 'https://raw.githubusercontent.com/skidoodle/ekreta-src/master/KretaWeb/Resources/DirtyWords.xml';
		this.dirtyWords = [];
		this.request = new XMLHttpRequest();
		this.initCanvasVariables();
	}
	initCanvasVariables() {
		this.dashLen = 100;
		this.dashOffset = 100;
		this.speed = document.getElementById('speed').value;
		this.dirtyWord = '';
		this.index = 0;
		this.x = 10;
		this.y = 0;
		const canvas = document.getElementById('canvas');
		this.ctx = canvas.getContext('2d');
		this.ctx.font = this.getFont();
		this.ctx.lineWidth = 4;
		this.ctx.lineJoin = "round";
		this.ctx.globalAlpha = document.getElementById('alpha').value;
		this.ctx.strokeStyle = document.getElementById('stroke-color').value;
		this.ctx.fillStyle = document.getElementById('fill-color').value;
		this.ctx.clearRect(0, 0, canvas.width, canvas.height);
		this.dashWidth = this.ctx.measureText('–').width + this.ctx.lineWidth * Math.random();
	}
	// calculate the font size based on the canvas size
	// and return the string to be used for the canvas.font property
	getFont() {
		return '40px Comic Sans MS, cursive, TSCu_Comic, sans-serif';
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
			// show the settings panel
			document.getElementById('settings-panel').style.display = 'block';
		}
	}
	// returns a random element from the dirty words array
	getDirty() {
		return this.dirtyWords[Math.floor(Math.random() * this.dirtyWords.length)];
	}
	displayNewDirty() {
		this.initCanvasVariables();
		this.dirtyWord = this.getDirty();
		this.render();
	}
	render() {
		if (this.dashOffset <= 0) {
			this.ctx.fillText(this.dirtyWord[this.index], this.x, this.y + 50);  // fill final letter
			this.dashOffset = this.dashLen;                                      // prep next char
			const nextCharSize = this.ctx.measureText(this.dirtyWord[this.index++]).width + this.ctx.lineWidth * Math.random();
			// if the next size is bigger than the canvas width, start a new line
			if (typeof this.dirtyWord[this.index] !== 'undefined' && this.x + nextCharSize + (this.dashWidth * 2) > this.ctx.canvas.width) {
				// if the previous character is a space or '-', just start a new line
				// otherwise add a '-' to the end of the previous line
				if (this.dirtyWord[this.index - 1] === ' ' || this.dirtyWord[this.index - 1] === '-') {
					this.x = 10;
					this.y += 60;
				} else {
					this.dirtyWord = this.dirtyWord.substring(0, this.index) + '-' + this.dirtyWord.substring(this.index);
					this.x += this.dashWidth;
				}
			} else {
				this.x += nextCharSize;
			}
			this.ctx.setTransform(1, 0, 0, 1, 0, 3 * Math.random()); // random y-delta
			this.ctx.rotate(Math.random() * 0.005); // random rotation
		}

		if (this.index < this.dirtyWord.length) {
			requestAnimationFrame(this.render.bind(this));
		}
		this.ctx.clearRect(this.x, this.y, 60, 60);
		this.ctx.setLineDash([this.dashLen - this.dashOffset, this.dashOffset - this.speed]); // create a long dash mask
		this.dashOffset -= this.speed; // reduce dash length
		this.ctx.strokeText(this.dirtyWord[this.index], this.x, this.y + 50); // stroke letter
	}
}
