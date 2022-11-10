class Application {
	constructor() {
		this.dirtyWordsURL = 'https://raw.githubusercontent.com/skidoodle/ekreta-src/master/KretaWeb/Resources/DirtyWords.xml';
		this.dirtyWords = [];
		this.request = new XMLHttpRequest();
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
		document.getElementById('dirty').innerHTML = this.getDirty();
	}
}
