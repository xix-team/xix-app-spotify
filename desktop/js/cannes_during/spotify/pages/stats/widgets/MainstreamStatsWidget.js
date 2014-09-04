// MainstreamStatsWidget.js

breelNS.defineClass(breelNS.projectName+".page.stats.widgets.MainstreamStatsWidget", "generic.templates.BasicPage", function(p, s, MainstreamStatsWidget) {
	var ElementUtils            = breelNS.getNamespace("generic.htmldom").ElementUtils;
	var ListenerFunctions       = breelNS.getNamespace("generic.events").ListenerFunctions;
	var siteManager;

	p.initialize = function(data) {
		siteManager = breelNS.getNamespace(breelNS.projectName).singletons.siteManager;
		this.template = siteManager.assetManager.getAsset("StatsMainstreamContent");
		
		this.el = document.createElement('div');
		this.el.className = 'mainstreamStatsWidget';
		this.el.innerHTML = this.template.innerHTML;

		this._copy = this.el.querySelector(".copy");
		this._row1 = this.el.querySelector(".persons .row1 .mask");
		this._row2 = this.el.querySelector(".persons .row2 .mask");

		data = this.parse(data);

		this.render(data);

		return this;
	};

	p.parse = function(data){
		data = Math.round(data*100);

		if(data < 0){
			data = 0;
		} else if (data > 100){
			data = 100;
		}

		return data;
	};

	p.render = function(data){

		var copy;
		var percent = data;
		if(data > 50){
			copy = siteManager.copyManager.getCopy('desktop.cannes.stats.hotness.id_0');
			percent = data;
		} else {
			copy = siteManager.copyManager.getCopy('desktop.cannes.stats.hotness.id_1')
			percent = 100 - data;
		}

		copy = copy.replace('<number> %', '<br/><span><number>%</span>');
		copy = copy.replace('<number>', percent);

		this._row1.style.width = (percent > 50 ? 100 : percent*100/50) + '%'; 
		this._row2.style.width = (percent < 50 ? 0 : (percent-50)*100/50) + '%';

		this._copy.innerHTML = copy;
	};

	p.open = function() {
		this.setOpened();
	};


	p.close = function() {
		this.setClosed();
	};
});