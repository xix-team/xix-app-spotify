// MoodStatsWidget.js

breelNS.defineClass(breelNS.projectName+".page.stats.widgets.MoodStatsWidget", "generic.templates.BasicPage", function(p, s, MoodStatsWidget) {
	var ElementUtils            = breelNS.getNamespace("generic.htmldom").ElementUtils;
	var ListenerFunctions       = breelNS.getNamespace("generic.events").ListenerFunctions;
	var siteManager;

	p.initialize = function(data) {
		siteManager = breelNS.getNamespace(breelNS.projectName).singletons.siteManager;
		this.template = siteManager.assetManager.getAsset("StatsMoodContent");
		
		this.el = document.createElement('div');
		this.el.className = 'moodStatsWidget';
		this.el.innerHTML = this.template.innerHTML;

		this._copy = this.el.querySelector(".copy");
		this._moods = this.el.querySelector(".moods");

		data = this.parse(data);

		this.render(data);

		return this;
	};

	p.parse = function(data){
		// var max = {count:0};
		// var total = 0;
		// for(var i in data){
		// 	if(data[i].count > max.count){
		// 		max = data[i];
		// 	}
		// 	total += data[i].count;
		// }
		// max.percent = Math.round(max.count * 100 / total);

		return data;
	};

	p.render = function(data){
		var active = this._moods.children[data];
		ElementUtils.addClass(active, 'active');
		var copy = siteManager.copyManager.getCopy('desktop.cannes.stats.mood.id_'+data);
		// copy = copy.replace('<number>', data.percent+'');

		this._copy.innerHTML = copy;
		// this._copy.innerHTML = this._copy.innerHTML.replace('_name_', data.id);
	};

	p.open = function() {
		this.setOpened();
	};


	p.close = function() {
		this.setClosed();
	};
});