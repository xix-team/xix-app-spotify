// GenresFilter.js

breelNS.defineClass(breelNS.projectName+".page.landing.GenresFilter", "generic.events.EventDispatcher", function(p, s, GenresFilter) {
	var ElementUtils            = breelNS.getNamespace("generic.htmldom").ElementUtils;
	var ListenerFunctions       = breelNS.getNamespace("generic.events").ListenerFunctions;
	var ServiceID 				= breelNS.getNamespace("spotify.common.model.backendmanager").ServiceID;
	var StatisticsDataSend 		= breelNS.getNamespace("spotify.common.model.data.statistics").StatisticsDataSend;
	var siteManager;

	p.init = function(container, controller) {
		siteManager           = breelNS.getNamespace(breelNS.projectName).singletons.siteManager;

		this._controller      = controller;
		this._container       = container;
		this._btnGenre        = this._container.querySelector("#btnGenre");
		this._genresList      = this._container.querySelector("#genresList");

		this._itemTemplate    = this._container.querySelector("#genreItemTemplate");

		// EVENT LISTENERS
		this._onToggleBound   = ListenerFunctions.createListenerFunction(this, this._onToggle);
		ListenerFunctions.addDOMListener(this._btnGenre, "click", this._onToggleBound);

		this.state = {
			open: false
		};

		this._btnWidth = this._btnGenre.style.width = this._btnGenre.clientWidth+'px';

		var data = new StatisticsDataSend({type: 0});
		siteManager.backendManager.load(
			ServiceID.GET_STATISTICS,
			data,
			function(datas){ 
				var comparator = function(a,b) {
					if (a['id'] < b['id']) return -1;
					if (a['id'] > b['id']) return 1;
					return 0;
				}

				var list = datas.data.statistics.genres.list;

				var genreData;
				for(var i in list){
					list[i].percent = Math.round(list[i].value * 100 / datas.data.statistics.genres.total);
					list[i].name = siteManager.genres[list[i].id];
					list[i].color = siteManager.colors[list[i].id];
				}

				this._datas = list;
			}.bind(this), 
			function(){ 
				console.error(arguments);
			}
		);

		return this;
	};


	p.show = function() {
		// ElementUtils.addClass(this._container, "display");
	};

	p._onToggle = function(e){
		if(!this.state.open){
			this.open();
			ga('send', 'event', 'desktop/click', 'genres', 'genres/open');
		} else {
			if(!this._controller.setState(1)) return;
			this.close();
			ga('send', 'event', 'desktop/click', 'genres', 'genres/close');
		}
	};

	p.open = function(){
		if(this.state.open) return;
		if(!this._controller.setState(5)) return;
		this._controller._onGenreFilter();
		this.state.open = true;
		this._btnGenre.style.width = '';
		ElementUtils.addClass(this._container, "open");

		this._generatesDomItems();
	};

	p._generatesDomItems = function(){
		for(var i in this._datas){
			var node = this._itemTemplate.cloneNode(true);
			this._bindDataItem(this._datas[i], node);

			this._genresList.appendChild(node);

			setTimeout(function(node){
				ElementUtils.addClass(node, "visible");
			}.bind(this, node), 100+30*i);
		}

	};

	p._bindDataItem = function(data, node, index){
		node.id = "";
		node.innerHTML = node.innerHTML.replace(/\{\{\=([\w]*)\}\}/gi, function(m, code) {
			return data[code];
		});

		var dot = node.querySelector('.dot').style['background-color'] = data.color;
		var legend = node.querySelector('.legend').style['color'] = data.color;

		if(data.selected){
			ElementUtils.addClass(node, "selected");
			if(index !== undefined){
				this._controller._filterGenreWithIndex(index);
			}
		} else {
			ElementUtils.removeClass(node, "selected");
			// this._controller._filterGenreWithIndex(-1);
		}

		node.onmousedown = function(e){
			ElementUtils.addClass(node, "mousedown");
		}.bind(this);
		node.onmouseup = function(e){
			ElementUtils.removeClass(node, "mousedown");
		}.bind(this);

		node.onmouseleave = node.onmouseenter = function(e){
			this._onItemHover.bind(this, data, node, e)();
			ElementUtils.removeClass(node, "mousedown");
		}.bind(this);

		node.onclick = this._onItemClick.bind(this, data, node);
		node.data = data;
	};

	p._onItemHover = function(data, node, event){
		// TODO: handle hover event
	};

	p._onItemClick = function(data, node, event){
		console.log('Toggle genre: '+data.name);

		data.selected = !data.selected;

		if(data.selected){
			this._controller._filterGenreWithIndex(data.id);
		} else {
			this._controller._filterGenreWithIndex(-1);
		}

		for(var i in this._genresList.childNodes){
			if(this._genresList.childNodes[i] !== node && this._genresList.childNodes[i].data && this._genresList.childNodes[i].data.selected === true) {
				this._genresList.childNodes[i].data.selected = false;
				this._bindDataItem(this._genresList.childNodes[i].data, this._genresList.childNodes[i]);
			}
		}

		ga('send', 'event', 'desktop/click', 'genres', 'desktop/genre/select - '+data.name);

		this._bindDataItem(data, node);
	};

	p._clearDomItem = function(){
		if(!this._genresList.childNodes) return;
		if(this._genresList.childNodes.length === 0) return;
		var length = this._genresList.childNodes.length;
		for(var i in this._genresList.childNodes){
			setTimeout(function(node){
				try {
					node.data = null;
					this._genresList.removeChild(node);
				} catch(e) {

				}
			}.bind(this, this._genresList.childNodes[i]), 20*(length -i));
		}
	};

	p.close = function(){
		if(!this.state.open) return;
		this.state.open = false;
		this._controller._onCloseGenreFilter();

		this._btnGenre.style.width = this._btnWidth;
		ElementUtils.removeClass(this._container, "open");

		this._clearDomItem();
	};

});