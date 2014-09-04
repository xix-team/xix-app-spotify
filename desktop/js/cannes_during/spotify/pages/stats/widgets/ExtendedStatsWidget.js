// ExtendedStatsWidget.js

breelNS.defineClass(breelNS.projectName+".page.stats.widgets.ExtendedStatsWidget", "generic.templates.BasicPage", function(p, s, ExtendedStatsWidget) {
	var ElementUtils            = breelNS.getNamespace("generic.htmldom").ElementUtils;
	var ListenerFunctions       = breelNS.getNamespace("generic.events").ListenerFunctions;
	var siteManager;

	var PROFESSION_MAPPING = [
		{
			name: 'Suits',
			serverName: 'Business',
			serverID: 0,
			copyID: 0
		},
		{
			name: 'Entertainers',
			serverName: 'Film, Music & Entertainment',
			serverID: 1,
			copyID: 1
		},
		{
			name: 'Creatives',
			serverName: 'Creative',
			serverID: 2,
			copyID: 2
		},
		{
			name: 'Journos',
			serverName: 'Journalist',
			serverID: 3,
			copyID: 3
		},
		{
			name: 'Marketeers',
			serverName: 'Marketing & Social',
			serverID: 4,
			copyID: 4
		},
		{
			name: 'Media peeps',
			serverName: 'Media',
			serverID: 5,
			copyID: 5
		},
		{
			name: 'Techies',
			serverName: 'Technology',
			serverID: 6,
			copyID: 6
		},
		{
			name: 'Fashionistas',
			serverName: 'Fashion & Design',
			serverID: 7,
			copyID: 7
		},
		{
			name: 'Social wizards',
			serverName: 'Social Media gurus',
			serverID: 10,
			copyID: 9
		},
		{
			name: 'Brand gurus',
			serverName: 'Brand',
			serverID: 9,
			copyID: 10
		},
		{
			name: 'The Interactives',
			serverName: 'Interactive',
			serverID: 11,
			copyID: 11
		},
		{
			name: 'Speakers',
			serverName: 'Speakers',
			serverID: 12,
			copyID: 8
		}
	];

	p.initialize = function(data, type) {
		siteManager = breelNS.getNamespace(breelNS.projectName).singletons.siteManager;
		this.template = siteManager.assetManager.getAsset("StatsExtendedContent");
		this.title = siteManager.copyManager.getCopy('desktop.cannes.stats.etended.'+type);
		this.type = type;
		
		this.el = document.createElement('div');
		this.el.className = 'extendedStatsWidget';
		this.el.innerHTML = this.template.innerHTML;

		this._ul = this.el.querySelector("ul");

		data = this.parse(data);

		this.render(data);

		return this;
	};

	p.parse = function(data){
		for(var i in data){
			if(data[i].value < 1) data[i].value *= 100;
			data[i].value = Math.round(data[i].value);
		}

		return data;
	};

	p.render = function(data){
		var newLi, name;
		for(var i in data){
			newLi = document.createElement('li');
			name = data[i].name;

			for(var j in PROFESSION_MAPPING){
				if(name === PROFESSION_MAPPING[j].serverName){
					name = siteManager.copyManager._copyDocument['common.professions.id_'+PROFESSION_MAPPING[j].copyID];;
				}
			}
			
			newLi.innerHTML = '<div class="name">'+name+'</div>'
			if(this.type === 'tempo'){
				newLi.innerHTML += '<div class="percent">'+data[i].value+' bpm</div>'
			} else {
				newLi.innerHTML += '<div class="percent">'+data[i].value+'%</div>'
			}

			this._ul.appendChild(newLi);
		}
	};

	p.open = function() {
		this.setOpened();
	};


	p.close = function() {
		this.setClosed();
	};
});