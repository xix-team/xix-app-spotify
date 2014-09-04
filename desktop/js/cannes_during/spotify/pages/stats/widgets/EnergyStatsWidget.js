// EnergyStatsWidget.js

breelNS.defineClass(breelNS.projectName+".page.stats.widgets.EnergyStatsWidget", "generic.templates.BasicPage", function(p, s, EnergyStatsWidget) {
	var ElementUtils            = breelNS.getNamespace("generic.htmldom").ElementUtils;
	var ListenerFunctions       = breelNS.getNamespace("generic.events").ListenerFunctions;
	var siteManager;

	p.initialize = function(data) {
		siteManager = breelNS.getNamespace(breelNS.projectName).singletons.siteManager;
		this.template = siteManager.assetManager.getAsset("StatsEnergyContent");
		
		this.el = document.createElement('div');
		this.el.className = 'energyStatsWidget';
		this.el.innerHTML = this.template.innerHTML;

		this._copy = this.el.querySelector(".copy");
		// this._curve = this.el.querySelector(".curve");

		data = this.parse(data);

		this.render(data);

		return this;
	};

	p.parse = function(data){

		data = Math.floor(data * 4);

		return data;
	};

	p.render = function(data){
		var img = this.el.querySelector(".curve .curve"+data);
		ElementUtils.addClass(img, 'display');
		
		var copy = siteManager.copyManager.getCopy('desktop.cannes.stats.energy.id_'+data);
		this._copy.innerHTML = copy;
		// this._copy.innerHTML = this._copy.innerHTML.replace('_percent_', data);
	};

	p.open = function() {
		this.setOpened();
	};


	p.close = function() {
		this.setClosed();
	};
});