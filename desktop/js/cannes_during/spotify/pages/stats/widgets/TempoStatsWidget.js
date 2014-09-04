// TempoStatsWidget.js

breelNS.defineClass(breelNS.projectName+".page.stats.widgets.TempoStatsWidget", "generic.templates.BasicPage", function(p, s, TempoStatsWidget) {
	var ElementUtils            = breelNS.getNamespace("generic.htmldom").ElementUtils;
	var ListenerFunctions       = breelNS.getNamespace("generic.events").ListenerFunctions;
	var siteManager;

	var SPECTRUM = [1.5, 1.5, 1.5, 1.5, 1, 1, 1, .50, .50, .50, .50, .50, .50, .50, .50, .50, .50, .50, .50, .50, .50, .50, .50, .50, .50, .50, .50, .50, .50, .50, .50, .50, .50, .50, .50, 1.50, 1.50, 1.50, 1.50, 1.50, 1.50, 1.50, 1.50, 1.50, 1.50, 1.50, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2];

	p.initialize = function(data) {
		siteManager = breelNS.getNamespace(breelNS.projectName).singletons.siteManager;
		this.template = siteManager.assetManager.getAsset("StatsTempoContent");
		
		this.el = document.createElement('div');
		this.el.className = 'tempoStatsWidget';
		this.el.innerHTML = this.template.innerHTML;

		this._copy = this.el.querySelector(".copy");
		this._spectrumUl = this.el.querySelector(".spectrum");

		this.initSpectrum();

		// if(!(data instanceof Number)){
		// 	data = 60;
		// }
		this._tempo = data;
		this._timer = setInterval(this.pulse.bind(this), 1/(data/60) *1000);
		this.render();

		return this;
	};

	p.initSpectrum = function(){
		var newBar, newMask;
		for(var i in SPECTRUM){
			newBar = document.createElement('li');
			newMask = document.createElement('div');
			newMask.className = 'mask';

			SPECTRUM[i] = {
				coef: SPECTRUM[i],
				mask: newMask
			};

			newMask.style.height = Math.random()*.35*100 + '%';

			newBar.appendChild(newMask);
			this._spectrumUl.appendChild(newBar);
		}
	};

	p.pulse = function(){
		ElementUtils.removeClass(this._spectrumUl, 'animated');
		for(var i in SPECTRUM){
			SPECTRUM[i].mask.style.height = SPECTRUM[i].coef * Math.random()*.35*100 + '%';
		}
		setTimeout(function(){
			ElementUtils.addClass(this._spectrumUl, 'animated');
		}.bind(this), 10);
	};

	p.render = function() {
		var copy;
		if(this._tempo < 90){
			copy = siteManager.copyManager.getCopy('desktop.cannes.stats.tempo.id_0');
		} else if(this._tempo < 130) {
			copy = siteManager.copyManager.getCopy('desktop.cannes.stats.tempo.id_1');
		} else if(this._tempo < 155) {
			copy = siteManager.copyManager.getCopy('desktop.cannes.stats.tempo.id_2');
		} else {
			copy = siteManager.copyManager.getCopy('desktop.cannes.stats.tempo.id_3');
		}

		this._copy.innerHTML = copy;
	};

	p.open = function() {
		this.setOpened();
	};


	p.close = function() {
		clearInterval(this._timer);
		this.setClosed();
	};
});