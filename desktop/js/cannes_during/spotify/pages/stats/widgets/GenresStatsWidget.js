// GenresStatsWidget.js

breelNS.defineClass(breelNS.projectName+".page.stats.widgets.GenresStatsWidget", "generic.templates.BasicPage", function(p, s, GenresStatsWidget) {
	var ElementUtils            = breelNS.getNamespace("generic.htmldom").ElementUtils;
	var ListenerFunctions       = breelNS.getNamespace("generic.events").ListenerFunctions;
	var siteManager;

	p.initialize = function(datas) {
		siteManager = breelNS.getNamespace(breelNS.projectName).singletons.siteManager;
		this.template = siteManager.assetManager.getAsset("StatsGenreContent");
		
		this.el = document.createElement('div');
		this.el.className = 'genresStatsWidget';
		this.el.innerHTML = this.template.innerHTML;

		this._highlight = this.el.querySelector(".highlight");
		this._barsUl = this.el.querySelector(".bars");

		datas = this.parse(datas);

		this.initDom(datas);
		this.render(datas);

		return this;
	};

	p.parse = function(datas){
		// console.log(datas);
		var comparator = function(a,b) {
			if (a['value'] < b['value']) return 1;
			if (a['value'] > b['value']) return -1;
			return 0;
		}

		datas.list = datas.list.sort(comparator);

		var total = datas.total;
		var max = datas.list[0].value;

		for(var i in datas.list){
			datas.list[i].width = 100*datas.list[i].value/max + '%';
			datas.list[i].percent = Math.round(100*datas.list[i].value/total)+'%';
		}

		return datas;
	};

	p.initDom = function(datas){
		var newBar, newMask;
		for(var i in siteManager.genres){
			// console.log(i);
			newBar = document.createElement('li');
			newMask = document.createElement('div');
			newMask.className = 'mask';

			if(datas.list[i]){
				newMask.style.width = datas.list[i].width;
				newMask.style.background = siteManager.colors[datas.list[i].id];	
			} else {
				newMask.style.width = 0;
				newMask.style.background = 'transparent';
			}
			

			newBar.appendChild(newMask);
			this._barsUl.appendChild(newBar);
		}
	};

	p.render = function(datas){
		var copy = siteManager.copyManager.getCopy('desktop.cannes.stats.genre.id_'+datas.list[0].id);
		copy = copy.replace('<number> %', datas.list[0].percent+'');

		this._highlight.innerHTML = copy;

		this._highlight.style.color = siteManager.colors[datas.list[0].id];
	};

	p.open = function() {
		this.setOpened();
	};


	p.close = function() {
		this.setClosed();
	};
});