// PeopleSelect.js

breelNS.defineClass(breelNS.projectName+".page.landing.PeopleSelect", "generic.events.EventDispatcher", function(p, s, PeopleSelect) {
	var ElementUtils            = breelNS.getNamespace("generic.htmldom").ElementUtils;
	var ListenerFunctions       = breelNS.getNamespace("generic.events").ListenerFunctions;
	var siteManager;

	var PROFESSION_MAPPING = [
		{
			name: 'Suits',
			serverID: 0,
			copyID: 0
		},
		{
			name: 'Entertainers',
			serverID: 1,
			copyID: 1
		},
		{
			name: 'Creatives',
			serverID: 2,
			copyID: 2
		},
		{
			name: 'Journos',
			serverID: 3,
			copyID: 3
		},
		{
			name: 'Marketeers',
			serverID: 4,
			copyID: 4
		},
		{
			name: 'Media peeps',
			serverID: 5,
			copyID: 5
		},
		{
			name: 'Techies',
			serverID: 6,
			copyID: 6
		},
		{
			name: 'Fashionistas',
			serverID: 7,
			copyID: 7
		},
		{
			name: 'Social wizards',
			serverID: 10,
			copyID: 9
		},
		{
			name: 'Brand gurus',
			serverID: 9,
			copyID: 10
		},
		{
			name: 'The Interactives',
			serverID: 11,
			copyID: 11
		},
		{
			name: 'Speakers',
			serverID: 12,
			copyID: 8
		}
	];

	PeopleSelect.ON_PEOPLE_SELECTED = "onPeopleSelected";
	PeopleSelect.ON_PEOPLE_MENU_OPEN = "onPeopleMenuOpen";

	p.init = function(container, controller) {
		siteManager           = breelNS.getNamespace(breelNS.projectName).singletons.siteManager;

		this._controller      = controller;
		this._container       = container;

		this._customSelect	  = this._container.querySelector(".customSelect");
		this._hoverBox		  = this._container.querySelector('.hoverBox');

		// EVENT LISTENERS
		this._onCloseBound   = ListenerFunctions.createListenerFunction(this, this.close);
		this._onToggleBound   = ListenerFunctions.createListenerFunction(this, this._onToggle);
		ListenerFunctions.addDOMListener(this._customSelect, "click", this._onToggleBound);

		this.state = {
			open: false
		};

		this._generatesDomItems();

		return this;
	};


	p.show = function() {
		// ElementUtils.addClass(this._container, "display");
	};

	p._onToggle = function(event){
		if(this.state.open) return;
		this.dispatchCustomEvent(PeopleSelect.ON_PEOPLE_MENU_OPEN);
		event.stopPropagation();
		this.open();
	};

	p._showOverlay = function(){
		var overlay = document.createElement('div');
		overlay.className = "selectOverlay";
		document.querySelector('#LandingContent').appendChild(overlay);
		setTimeout(function(){
			ElementUtils.addClass(overlay, "display");
		}, 1);
	};
	p._hideOverlay = function(){
		var elements = document.querySelectorAll('.selectOverlay');
		if(elements.length === 0) return;
		for(i in elements){
			if(elements[i].remove){
				var el = elements[i];
				ElementUtils.removeClass(el, "display");
				setTimeout(function(){
					el.remove();
				}, 500)
			}
		}
	};


	p.open = function(){
		if(this.state.open) return;
		this.state.open = true;

		this._resetHoverBox();

		this._showOverlay();

		ElementUtils.addClass(this._customSelect, "focus");
		ListenerFunctions.addDOMListener(document, "click", this._onCloseBound);
	};

	p._resetHoverBox = function(){
		if(!this.state.open) return;

		var selecteditem = this._container.querySelector(".selected");
		var index = [].indexOf.call(selecteditem.parentNode.children, selecteditem)-1;
		this._hoverBox.style.top = index*27 +'px';
	};

	p.close = function(){
		if(!this.state.open) return;
		this.state.open = false;

		this._hideOverlay();

		this._hoverBox.style.top = '';
		ElementUtils.removeClass(this._customSelect, "focus");
		ListenerFunctions.removeDOMListener(document, "click", this._onCloseBound);
	};

	p._generatesDomItems = function(){
		var i = -1;
		var data;
		do {
			var node = document.createElement('li');
			node.className = 'customSelectItem';

			this._customSelect.appendChild(node);

			data = {};
			if(i === -1){
				data.name = 'All professions';
				data.index = i;
			} else {
				data.name = siteManager.copyManager._copyDocument['common.professions.id_'+PROFESSION_MAPPING[i].copyID];
				data.index = PROFESSION_MAPPING[i].serverID;
			}
			
			data.selected = (i === -1);
			
			this._bindDataItem(data, node);

			i++;
		} while(PROFESSION_MAPPING[i] !== undefined);

		this._customSelect.onmouseleave = this._resetHoverBox.bind(this);
	};

	p._bindDataItem = function(data, node){
		node.innerHTML = data.name;

		if(data.selected){
			ElementUtils.addClass(node, "selected");
		} else {
			ElementUtils.removeClass(node, "selected");
		}

		node.onmouseenter = function(e){
			if(!this.state.open) return;
			this._hoverBox.style.top = e.target.offsetTop+'px';
		}.bind(this);

		node.onclick = this._onItemClick.bind(this, data, node);
		node.data = data;
	};

	p._onItemClick = function(data, node, event){
		console.log('Toggle job: '+data.name);
		if(!this.state.open) return;
		// desktop/search/btnMedia
		ga('send', 'event', 'desktop/click', 'search', 'desktop/search/btnPeople/select - '+data.name);

		event.stopPropagation();

		data.selected = true;

		for(var i in this._customSelect.childNodes){
			if(this._customSelect.childNodes[i] !== node && this._customSelect.childNodes[i].data && this._customSelect.childNodes[i].data.selected === true) {
				this._customSelect.childNodes[i].data.selected = false;
				this._bindDataItem(this._customSelect.childNodes[i].data, this._customSelect.childNodes[i]);
			}
		}

		this._bindDataItem(data, node);

		console.debug( "People Selected : ", data );
		this.dispatchCustomEvent(PeopleSelect.ON_PEOPLE_SELECTED, {index:data.index});
		
		this.close();
	};

});