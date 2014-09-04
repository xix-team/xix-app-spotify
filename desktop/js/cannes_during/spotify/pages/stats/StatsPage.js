// StatsPage.js

breelNS.defineClass(breelNS.projectName+".page.StatsPage", "generic.templates.BasicPage", function(p, s, StatsPage) {
	var ElementUtils            = breelNS.getNamespace("generic.htmldom").ElementUtils;
	var ListenerFunctions       = breelNS.getNamespace("generic.events").ListenerFunctions;
	var ServiceID = breelNS.getNamespace("spotify.common.model.backendmanager").ServiceID;
	var StatisticsDataSend = breelNS.getNamespace("spotify.common.model.data.statistics").StatisticsDataSend;

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

	var DURATION = 6000;

	p.initialize = function(isExtended, closeCallback) {
		siteManager 		= breelNS.getNamespace(breelNS.projectName).singletons.siteManager;

		this.template       = siteManager.assetManager.getAsset("StatsContainer").innerHTML;
		
		// this.container.innerHTML = this.template;
		this._isExtended = isExtended || false;
		this._closeCallback = closeCallback;

		this.el = document.createElement('div');
		if(!this._isExtended){
			this.el.className = "mainWidget";
			this.container.appendChild(this.el);
		} else {
			this.el.className = 'extendedWidget';
		}
		this.el.innerHTML = this.template;

		this._widgetContainer = this.el.querySelector(".widgetContainer");
		this._title = this.el.querySelector(".title");
		this._mainTitle = this.el.querySelector("h1");
		this._currentCount = this.el.querySelector(".currentCount");
		this._totalCount = this.el.querySelector(".totalCount");
		this._timerElement = this.el.querySelector(".timer");
		
		this._prevButton = this.el.querySelector(".paginator .prev");
		this._nextButton = this.el.querySelector(".paginator .next");

		// EVENT LISTENERS
		this._onNavigationBound   = ListenerFunctions.createListenerFunction(this, this._onNavigation);
		ListenerFunctions.addDOMListener(this._prevButton, "click", this._onNavigationBound);
		ListenerFunctions.addDOMListener(this._nextButton, "click", this._onNavigationBound);

		this._currentIndex = 0;
		this._currentWidget = null;
		this._widgets = [];

		ElementUtils.addClass(this.el, 'closed');

		this.setOpened();

		this._params = {
			type: 0,
			extra: 0
		};
		
		return this;
	};

	p.clearDatas = function(){
		this.datas = null;
		this.title = '';
		this.mainTitle = '';
	};

	p.fetch = function(params){
		if(params){
			this._params.type = params.type || 0;
				
			this._params.extra = params.extra;

			if(this._isExtended){
				if(this._params.type === 3 && this._params.extra === -1){
					this._params.extra = 0;
				}
			}
				
		} else {
			console.warn('You tried to fecth statistics data without parameters.')
			return;
		}

		if(!this._isExtended){
			this.openExtended();
		}

		this.close();

		var data = new StatisticsDataSend(this._params);
		var method = !this._isExtended ? ServiceID.GET_STATISTICS : ServiceID.GET_STATISTICS_LIST;
		siteManager.backendManager.load(
			method,
			data,
			function(requestExtra, datas){ 
				if(requestExtra !== this._params.extra) return;
				console.debug( "Update Data : ", datas );
				if(datas.data.statistics){
					this.updateDatas(datas.data.statistics);
				} else {
					this.updateDatas(datas.data);
				}
			}.bind(this, this._params.extra), 
			function(){ 
				console.error(arguments);
			}
		);
	};

	p.updateDatas = function(datas){
		if(datas === 'debugDatas') datas = DUMMY_STATS;

		var noDelay = ElementUtils.hasClass(this.el, 'closed');

		ElementUtils.addClass(this.el, 'closed');

		// if(this._extended){
		// 	this._extended.close();
		// }

		setTimeout(function(){
			this.clearDatas();

			this.datas = datas;
			switch(this._params.type){
				case 0:
					this.title = 'Cannes';
					this.mainTitle = 'Cannes Statistics';
					break;
				case 1:
					this.title = siteManager.model.getAgencyNameWithIndex(this._params.extra);
					this.mainTitle = 'Company Statistics';
					break;
				case 2:
					this.title = this._params.extra;
					this.mainTitle = 'Country Statistics';
					break;
				case 3:
					if(this._params.extra !== -1){
						for(var i in PROFESSION_MAPPING){
							if(this._params.extra === PROFESSION_MAPPING[i].serverID){
								this.title = siteManager.copyManager._copyDocument['common.professions.id_'+PROFESSION_MAPPING[i].copyID];;
							}
						}
					} else {
						this.title = 'All professions';
					}
					this.mainTitle = 'Profession Statistics';
					break;
				default:
					this.title = 'Statistics';
					this.mainTitle = 'Statistics';
					break;
			}
			this._createWidgets(this.datas);

			this._initTimer();

			if(!this._isExtended){
				ElementUtils.removeClass(this.el, 'closed');
				if(this._extended) ElementUtils.removeClass(this._extended.el, 'closed');
			}
		}.bind(this), noDelay ? 0 : 500);
	};

	p.open = function() {

		if(this.datas === null || this.datas === undefined){
			console.warn('Stats widget has no data to display');
			return;
		}

		if(ElementUtils.hasClass(this.el, 'closed')){
			this._initTimer();
		}

		setTimeout(function(){
			ElementUtils.removeClass(this.el, 'closed');
		}.bind(this), 100);

		if(this._extended) {
			this._extended.open();
		}
	};

	p.close = function() {
		if(this._closeCallback){
			var callback = this._closeCallback;
			this._closeCallback = null;
			callback();
			return;
		}
		// this.setClosed();
		// console.error('toto');
		if(this._timer) clearTimeout(this._timer);

		if(this._extended){
			this._extended.close();
		}

		ElementUtils.addClass(this.el, 'closed');
	};

	p.openExtended = function(closeCallback){
		console.debug(this);
		if(!this._extended){
			this._extended = new StatsPage().initialize(true, closeCallback);
			this.container.appendChild(this._extended.el);
		}

		this._extended.fetch(this._params);
		console.log('debug');
		console.log('debug');
		console.log('debug');
		console.log(this);

		return this._extended;
	};

	p.closeExtended = function(){
		if(!this._extended) return false;
		this._extended.close();

		// this._extended = null;

		// if(this._isExtended){
		// 	setTimeout(function(){
		// 		// this.setClosed();
		// 		this.el.parentNode.removeChild(this.el);
		// 	}.bind(this), 500);
		// }

		return false;
	};

	p._initTimer = function(){
		if(this._isExtended) return;
		ElementUtils.removeClass(this._timerElement, 'running');

		this._timerElement.style['-moz-transition-duration'] = 0+'ms';
		this._timerElement.style['-o-transition-duration'] = 0+'ms';
		this._timerElement.style['-webkit-transition-duration'] = 0+'ms';
		this._timerElement.style['transition-duration'] = 0+'ms';

		setTimeout(function(){
			ElementUtils.addClass(this._timerElement, 'running');

			if(this._timer) clearTimeout(this._timer);
			this._timer = setTimeout(this._onNavigation.bind(this, 'next'), DURATION);

			this._timerElement.style['-moz-transition-duration'] = DURATION+'ms';
			this._timerElement.style['-o-transition-duration'] = DURATION+'ms';
			this._timerElement.style['-webkit-transition-duration'] = DURATION+'ms';
			this._timerElement.style['transition-duration'] = DURATION+'ms';
		}.bind(this), 500)
	}

	p._render = function() {
		// H1 title
		if(this.mainTitle){
			this._mainTitle.innerHTML = this.mainTitle;
		} else {
			this._mainTitle.innerHTML = 'Statistics';
		}

		// Widget title
		if(this._widgets[this._currentIndex] && this._widgets[this._currentIndex].title){
			this._title.innerHTML = this._widgets[this._currentIndex].title;
		} else if(this.title){
			this._title.innerHTML = this.title;
		} else {
			this._title.innerHTML = 'Statistics';
		}

		this._currentCount.innerHTML = this._currentIndex+1;
		this._totalCount.innerHTML = this._widgets.length;
	};

	p._createWidgets = function(datas){
		this._clearWidgets();
		for(var type in datas){
			this._addWidget(type, datas[type]);
		}

		for(var i in this._widgets){
			if(i == 0) continue;
			this._widgets[i].el.style.left = '200%';
		}

		setTimeout(function(){
			if(this._widgets.length){
				this._widgets[this._currentIndex].el.style.left = '0%';
				ElementUtils.addClass(this._widgets[this._currentIndex].el, 'animated');
				if(this._isExtended){
					this._widgetContainer.style.height = this._widgets[this._currentIndex].el.offsetHeight + 'px';
				}
			}
		}.bind(this), 100);

		this._render();
	};

	p._clearWidgets = function(){
		var removableWidget;
		while(this._widgets.length){
			removableWidget = this._widgets.pop();
			removableWidget.close();
			this._widgetContainer.removeChild(removableWidget.el);
		}
		while(this._widgetContainer.lastElementChild){
			this._widgetContainer.removeChild(this._widgetContainer.lastElementChild);
		}
		this._currentIndex = 0;
		this._render();
	};

	p._addWidget = function(type, data){
		if(!this._isExtended) {
			this._addMainWidget(type, data);
		} else {
			this._addExtendedWidget(type, data);
		}
	};

	p._addMainWidget = function(type, data){
		var newWidget;
		switch(type){
			case 'tempo':
				var TempoWidget = breelNS.getNamespace(breelNS.projectName+".page.stats.widgets").TempoStatsWidget;
				newWidget = new TempoWidget().initialize(data);
				break;
			case 'genres':
				var GenresWidget = breelNS.getNamespace(breelNS.projectName+".page.stats.widgets").GenresStatsWidget;
				newWidget = new GenresWidget().initialize(data);
				break;
			case 'mood':
				var MoodWidget = breelNS.getNamespace(breelNS.projectName+".page.stats.widgets").MoodStatsWidget;
				newWidget = new MoodWidget().initialize(data);
				break;

			case 'hotttnesss':
				var MainstreamWidget = breelNS.getNamespace(breelNS.projectName+".page.stats.widgets").MainstreamStatsWidget;
				newWidget = new MainstreamWidget().initialize(data);
				break;
			case 'energy':
				var EnergyWidget = breelNS.getNamespace(breelNS.projectName+".page.stats.widgets").EnergyStatsWidget;
				newWidget = new EnergyWidget().initialize(data);
				break;
			default:
				return;
		}
		if(newWidget){
			this._widgets.push(newWidget);
			this._widgetContainer.appendChild(newWidget.el);
		}
	};

	p._addExtendedWidget = function(type, data){
		var newWidget;

		var ExtendedWidget = breelNS.getNamespace(breelNS.projectName+".page.stats.widgets").ExtendedStatsWidget;
		
		newWidget = new ExtendedWidget().initialize(data, type);

		this._widgets.push(newWidget);
		this._widgetContainer.appendChild(newWidget.el);
	};


	p._onNavigation = function(e){
		if(!this._widgets.length) return
		
		var isNext = false;
		if(e === 'next') {
			isNext = true;
		}

		if(e.target) {
			isNext = ElementUtils.hasClass(e.target, 'next');
		}

		if(isNext){
			this._widgets[this._currentIndex].el.style.left = '-150%';
			this._currentIndex = (this._currentIndex+1) % this._widgets.length;
			ElementUtils.removeClass(this._widgets[this._currentIndex].el, 'animated');
			this._widgets[this._currentIndex].el.style.left = '150%';

			setTimeout(function(){
				ElementUtils.addClass(this._widgets[this._currentIndex].el, 'animated');
				this._widgets[this._currentIndex].el.style.left = '0%';
			}.bind(this), 1);
			
		} else {
			this._widgets[this._currentIndex].el.style.left = '150%';
			this._currentIndex = (this._currentIndex-1) < 0 ? this._widgets.length-1 : this._currentIndex-1;
			ElementUtils.removeClass(this._widgets[this._currentIndex].el, 'animated');
			this._widgets[this._currentIndex].el.style.left = '-150%';
			setTimeout(function(){
				ElementUtils.addClass(this._widgets[this._currentIndex].el, 'animated');
				this._widgets[this._currentIndex].el.style.left = '0%';
			}.bind(this), 1);
		}
		
		// relative positionning to 0
		if(this._widgets[this._currentIndex].el.offsetTop !== 0)
			this._widgets[this._currentIndex].el.style.top = - this._widgets[this._currentIndex].el.offsetTop + 'px';

		if(this._isExtended){
			this._widgetContainer.style.height = this._widgets[this._currentIndex].el.offsetHeight + 'px';
		};

		this._initTimer();

		this._render();
	}
});