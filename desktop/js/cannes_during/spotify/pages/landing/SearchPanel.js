// SearchPanel.js

breelNS.defineClass(breelNS.projectName+".page.landing.SearchPanel", "generic.events.EventDispatcher", function(p, s, SearchPanel) {
	var ElementUtils            = breelNS.getNamespace("generic.htmldom").ElementUtils;
	var ListenerFunctions       = breelNS.getNamespace("generic.events").ListenerFunctions;
	var DomElementOpacityTween  = breelNS.getNamespace("generic.animation").DomElementOpacityTween;
	var DomElementPositionTween = breelNS.getNamespace("generic.animation").DomElementPositionTween;
	var GenresFilter            = breelNS.getNamespace(breelNS.projectName+".page.landing").GenresFilter;
	var PeopleSelect            = breelNS.getNamespace(breelNS.projectName+".page.landing").PeopleSelect;
	var siteManager;

	var isValidated = false;

	SearchPanel.START_SEARCHING         = "startSearching";
	SearchPanel.SEARCHING_FOR           = "searchingFor";
	SearchPanel.USER_TYPING             = "userTyping";
	SearchPanel.FILTER_GENRE            = "filterGenre";

	SearchPanel.FILTER_GENRE_WITH_INDEX = "filterGenreWithIndex";
	SearchPanel.CLOSE_FILTER_GENRE      = "closeFilterGenre";
	SearchPanel.SEARCH_PEOPLE      		= "searchPeople";
	SearchPanel.PEOPLE_MENU_OPEN      	= "searchPeopleOpen";

	p.init = function(container, controller) {
		siteManager                     = breelNS.getNamespace(breelNS.projectName).singletons.siteManager;
		this._controller                = controller;
		this._container                 = container;
		this._isFromArrow 				= false;
		this._btnSearch                 = this._container.querySelector("#btnSearch");
		// this._btnMagnifer               = this._container.querySelector(".btnSearch");

		// this._btnMagnifer.style.cursor  = "pointer";

		this._btnAbout                  = this._container.querySelector("#btnAbout");
		this._btnStats                  = this._container.querySelector("#btnStats");
		this._btnFacebookShare          = this._container.querySelector("#btnShare .facebook");
		this._btnTwitterShare           = this._container.querySelector("#btnShare .twitter");
		this._btnAgency                 = this._container.querySelector(".btnAgency");
		this._btnPeople                 = this._container.querySelector(".btnPeople");
		this._btnCountry                = this._container.querySelector("#btnGlobe");
		this._searchContainer           = this._container.querySelector(".searchContainer");

		this._prevArrow                 = this._container.querySelector(".searchInputWrapper .arrows .prevArrow");
		this._nextArrow                 = this._container.querySelector(".searchInputWrapper .arrows .nextArrow");

		this._searchInput               = this._container.querySelector(".searchInput");
		this._searchInputSuggestionContainer      = this._container.querySelector(".searchInputSuggestionContainer");
		this._searchInputSuggestion      = this._container.querySelector(".searchInputSuggestion");
		this._searchInputSpanValue      = this._container.querySelector(".searchInputSpanValue");
		this._searchInputSpanComplete   = this._container.querySelector(".searchInputSpanComplete");

		this._searchInput.onfocus       = this._onInputFocus.bind(this);

		this._genresFilterContainer     = this._container.querySelector("#genresFilterContainer");
		this._genresFilter              = new GenresFilter().init(this._genresFilterContainer, this);

		this._validateInputButton       = this._container.querySelector(".validate");
		this._searchInputWrapper        = this._container.querySelector(".searchInputWrapper");
		this._peopleSelectWrapper       = this._container.querySelector(".searchSelectWrapper");
		this._peopleSelect              = new PeopleSelect().init(this._peopleSelectWrapper, this);

		//	EVENT LISTENERS
		this._onSearchBound             = ListenerFunctions.createListenerFunction(this, this._onSearch);
		ListenerFunctions.addDOMListener(this._btnSearch, "click", this._onSearchBound);
		this._onSearchCountryBound      = ListenerFunctions.createListenerFunction(this, this._onSearchCountry);
		ListenerFunctions.addDOMListener(this._btnCountry, "click", this._onSearchCountryBound);

		this._onAboutBound              = ListenerFunctions.createListenerFunction(this, this._onAbout);
		ListenerFunctions.addDOMListener(this._btnAbout, "click", this._onAboutBound);

		this._onShareBound              = ListenerFunctions.createListenerFunction(this, this._onShare);
		ListenerFunctions.addDOMListener(this._btnFacebookShare, "click", this._onShareBound);
		ListenerFunctions.addDOMListener(this._btnTwitterShare, "click", this._onShareBound);

		Social.facebook.init(globals.social.facebook.appId);

		this._onStatsBound              = ListenerFunctions.createListenerFunction(this, this._onStats);
		ListenerFunctions.addDOMListener(this._btnStats, "click", this._onStatsBound);

		this._onCancelBound             = ListenerFunctions.createListenerFunction(this, this._onCancel);
		this._onSearchAgencyBound       = ListenerFunctions.createListenerFunction(this, this._onSearchAgencyClick);
		this._btnAgency.addEventListener("click", this._onSearchAgencyBound);
		this._onSearchPeopleBound       = ListenerFunctions.createListenerFunction(this, this._onSearchPeople);
		this._btnPeople.addEventListener("click", this._onSearchPeopleBound);

		this._onArrowsClickBound        = ListenerFunctions.createListenerFunction(this, this._onArrowsClick);
		this._prevArrow.addEventListener("click", this._onArrowsClickBound);
		this._nextArrow.addEventListener("click", this._onArrowsClickBound);

		this._onValidateClickBound  = ListenerFunctions.createListenerFunction(this, this._onValidateClick);
		this._validateInputButton.addEventListener('click', this._onValidateClickBound);

		this._onInputFocusBound  = ListenerFunctions.createListenerFunction(this, this._onFocus);
		this._searchInputSuggestionContainer.addEventListener('click', this._onInputFocusBound);

		this._onInputSearchChangeBound  = ListenerFunctions.createListenerFunction(this, this._onSearchInputChange);
		this._searchInput.addEventListener('input', this._onInputSearchChangeBound);
		this._onInputSearchKeyDownBound = ListenerFunctions.createListenerFunction(this, this._onSearchInputKeydown);

		// this._onSendOutSearchBound      = ListenerFunctions.createListenerFunction(this, this._onSendOutSearch);
		// ListenerFunctions.addDOMListener(this._btnMagnifer, "click", this._onSendOutSearchBound);

		this._onPeopleSelectBound       = ListenerFunctions.createListenerFunction(this, this._onPeopleSelect);
		this._peopleSelect.addEventListener(PeopleSelect.ON_PEOPLE_SELECTED, this._onPeopleSelectBound);

		this._onPeopleMenuOpenBound = ListenerFunctions.createListenerFunction(this, this._onPeopleMenuOpen);
		this._peopleSelect.addEventListener(PeopleSelect.ON_PEOPLE_MENU_OPEN, this._onPeopleMenuOpenBound);

		this._buttonLock = false;

		this._autocomplete = {
			query: '',
			suggestion: '',
			suggestions: [],
			currentSuggestion: 0,
			datas: []
		};

		this._onSearchAgency();

		return this;
	};


	p.show = function() {
		ElementUtils.addClass(this._container, "display");
	};

	p._onCancel = function() {
		this.setState(1);
	};


	p._onSearch = function(e) {
		this.setState(3);
	};

	p._onSearchCountry = function(e) {
		this.setState(2);
	};


	p._onSendOutSearch = function(e) {
		if(this._controller.getState() == 2) {
			console.debug( "Search for country", this._searchInputSpanValue.innerHTML );
			console.debug( "Search for country", this._searchInputSpanValue.innerHTML );
			console.debug( "Search for country", this._searchInputSpanValue.innerHTML );
			console.debug( "Search for country", this._searchInputSpanValue.innerHTML );
			this._controller.searchForCountry(this._searchInputSpanValue.innerHTML);
		} else if(this._controller.getState() == 3) {
			var index  = siteManager.model.getPosIndexWithAgyIndex(e.agencyIndex);
			console.debug( "Search for Agency : ", index );
			this._controller.search(index);

			// siteManager.globalStateManager.getPage("Stats").fetch({type: 0});
			// this._controller.search(95);
		}
	};

	p.lock = function(){
		this._buttonLock = true;
		var overlay = document.createElement('div');
		overlay.className = "searchSoftLock";
		this._container.appendChild(overlay);
	};

	p.unlock = function(){
		this._buttonLock = false;
		var elements = document.querySelectorAll('.searchSoftLock');
		if(elements.length === 0) return;
		for(i in elements){
			if(elements[i].remove){
				var el = elements[i];
				el.remove();
			}
		}
	};

	p.showArrows = function(){
		this._prevArrow.style.display = 'block';
		this._nextArrow.style.display = 'block';
	};
	p.hideArrows = function(){
		this._prevArrow.style.display = 'none';
		this._nextArrow.style.display = 'none';
	};


	p.showCountryNoResult = function(){
		if(this._state !== 2) return;
		var noResult = siteManager.assetManager.getAsset("CountryNoResultContent");
		document.querySelector('#LandingContent').appendChild(noResult);
		setTimeout(function(){
			ElementUtils.addClass(noResult, "display");
		}, 1000);
	};
	p.hideCountryNoResult = function(){
		var elements = document.querySelectorAll('#CountryNoResultContent');
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


	// 	SEEMS UNUSED
	// p.searchFor = function(str) {
	// 	this.dispatchCustomEvent(SearchPanel.SEARCHING_FOR, {strSearch:str});
	// };

	p.setState = function(state){
		if(this._buttonLock) return false;

		ElementUtils.removeClass(this._btnSearch, "selected");
		ElementUtils.removeClass(this._btnCountry, "selected");

		// remove domlisteners
		ListenerFunctions.removeDOMListener(this._btnSearch, "click", this._onCancelBound);
		ListenerFunctions.removeDOMListener(this._btnSearch, "click", this._onSearchBound);
		ListenerFunctions.removeDOMListener(this._btnCountry, "click", this._onCancelBound);
		ListenerFunctions.removeDOMListener(this._btnCountry, "click", this._onSearchCountryBound);

		window.removeEventListener('keydown', this._onInputSearchKeyDownBound);

		this._genresFilter.close();

		// siteManager.globalStateManager.getPage("Stats").close();

		this.hideCountryNoResult();

		// ElementUtils.removeClass(this._searchContainer, "visible");

		this._controller.setState(state);
		this._state = state;

		switch(state){
			// cancel
			case 1:
				ListenerFunctions.addDOMListener(this._btnSearch, "click", this._onSearchBound);
				ListenerFunctions.addDOMListener(this._btnCountry, "click", this._onSearchCountryBound);

				setTimeout(function(){
					if(ElementUtils.hasClass(this._searchContainer, "visible")) return;
					this._searchContainer.style.display = 'none';
				}.bind(this), 250);
				break;
			// search country
			case 2:
				ga('send', 'event', 'desktop/click', 'search', 'desktop/events/btnWorld');

				this._autocomplete.datas = siteManager.model.countries;

				console.log( "Search for Country" );
				this._onSearchAgency();
				ElementUtils.addClass(this._btnCountry, "selected");
				ElementUtils.removeClass(this._searchContainer, "searchWithButtons");
				ListenerFunctions.addDOMListener(this._btnCountry, "click", this._onCancelBound);
				ListenerFunctions.addDOMListener(this._btnSearch, "click", this._onSearchBound);

				// TODO: remove this line and call it when needed.
				// this.showCountryNoResult();
				break;
			// search agencie
			case 3:
				ga('send', 'event', 'desktop/click', 'search', 'desktop/events/btnSearch');

				this._autocomplete.datas = siteManager.model.agencies;

				ElementUtils.addClass(this._btnSearch, "selected");
				ElementUtils.addClass(this._searchContainer, "searchWithButtons");
				ListenerFunctions.addDOMListener(this._btnSearch, "click", this._onCancelBound);
				ListenerFunctions.addDOMListener(this._btnCountry, "click", this._onSearchCountryBound);
				break;

			default:
				ListenerFunctions.addDOMListener(this._btnSearch, "click", this._onSearchBound);
				ListenerFunctions.addDOMListener(this._btnCountry, "click", this._onSearchCountryBound);

				break;
		}
		switch(state){
			case 2:
			case 3:
				// wait until css interpretation of class .searchWithButtons

				this._searchContainer.style.display = 'block';
				setTimeout(function(){
					ElementUtils.addClass(this._searchContainer, "visible");
				}.bind(this), 1);

				window.addEventListener('keydown', this._onInputSearchKeyDownBound);

				// DomElementOpacityTween.createWithAnimation(this._searchContainer, 0, 1, 1, TWEEN.Easing.Exponential.Out, 0);
				// DomElementPositionTween.createWithAnimation(this._searchContainer, 0, -10, 0, 0, 1.25, TWEEN.Easing.Exponential.Out, 0, null, true);
				// this.dispatchCustomEvent(SearchPanel.START_SEARCHING);
				this._searchInput.focus();

				this._resetInput();
				break;
			default:
				ElementUtils.removeClass(this._searchContainer, "visible");
				break;
		}
		this._onSearchAgency();

		return true;
	};


	p._onFocus = function() {
		this._searchInput.focus();
	};
	p._onInputFocus = function() {
		// this._resetInput();
	};

	p._resetInput = function() {
		//reset input
		this._searchInput.value = '';
		this._onSearchInputChange();
		isValidated = false;
		ElementUtils.removeClass(this._searchInputSuggestion, "validated");
	};

	p._onSearchInputChange = function() {
		var query = this._autocomplete.query = this._searchInput.value;
		// if(query == '') return;

		console.log( "query :|" , query, "|" , " is From Arrow : ", this._isFromArrow);

		this._searchInputSpanValue.innerHTML = query;
		this._searchInputSpanComplete.innerHTML = '';
		if(query != '' && !this._isFromArrow)this.dispatchCustomEvent(SearchPanel.USER_TYPING);

		// DUMMY
		// TODO: fetch best suggestion and callback _onSearchInputAutoSuggest(suggestion)
		if(this._autocomplete.query.length === 0){
			this._autocomplete.suggestion = '';
			suggestion = '';
			this._autocomplete.suggestions = this._autocomplete.datas;
			this._searchInputSpanValue.innerHTML = '';
			this._searchInputSpanComplete.innerHTML = 'Search';
			ElementUtils.addClass(this._searchInputSpanComplete, "placeholder");
			ElementUtils.removeClass(this._validateInputButton, "clickable");
			this.hideArrows();
			return;
		}

		ElementUtils.removeClass(this._searchInputSpanComplete, "placeholder");

		this._autocomplete.currentSuggestion = 0;
		this._autocomplete.suggestions = $.grep(this._autocomplete.datas, function(e){
			return RegExp('^'+this._autocomplete.query+'', 'i').test(e.name);
		}.bind(this));
		
		if(this._autocomplete.suggestions[0]){
			this._onSearchInputAutoSuggest(this._autocomplete.suggestions[0]);
		} else {
			this._onSearchInputAutoSuggest();
		}

		if(this._autocomplete.suggestions.length > 1){
			this.showArrows();
		} else {
			this.hideArrows();
		}

		this._isFromArrow = false;

	};

	p._onSearchInputAutoSuggest = function( suggestion ) {
		// if(suggestion)
		if(suggestion){
			this._autocomplete.suggestion = suggestion;
			ElementUtils.addClass(this._validateInputButton, "clickable");
		} else {
			this._autocomplete.suggestion = '';
			ElementUtils.removeClass(this._validateInputButton, "clickable");
		}

		var parts = RegExp('(^'+this._autocomplete.query+')(.*)', 'i').exec(this._autocomplete.suggestion.name);

		// replace input text by suggestion
		if(parts !== null)
			this._searchInputSpanValue.innerHTML = this._searchInput.value = parts[1];
		if(parts !== null && parts.length > 2){
			this._searchInputSpanComplete.innerHTML = parts[2];
		}
	};

	p._onSearchInputKeydown = function(e){
		if(e.which === 37 || e.which === 39 ) {
			e.preventDefault();
			e.stopPropagation();
			e.stopImmediatePropagation();
			console.info('Landing keydown event is overrided');

			if(e.which === 37){
				this._onArrowsClick({target: {className: 'prevArrow'}});
			} else {
				this._onArrowsClick({target: {className: 'nextArrow'}});
			}
		}

		if(e.which === 9 ) {

			e.stopPropagation();
			e.preventDefault();


			console.debug( "Start search with Tab" );
			this.validate(this._autocomplete.suggestion);
		}

		if(e.which === 13) {

			e.stopPropagation();
			e.preventDefault();

			this.validate(this._autocomplete.suggestion);
		}
	};

	p._onValidateClick = function(e){
		if(ElementUtils.hasClass(this._validateInputButton, "clickable")){
			this.validate(this._autocomplete.suggestion);
		}
	};

	p.validate = function( object ){
		if(!object) return;
		this._autocomplete.query = object.name;

		this._searchInput.value = this._autocomplete.query;
		this._searchInput.blur()

		this._onSearchInputChange();

		console.log('TODO: Validate search',object);
		this._onSendOutSearch(object);

		if(this._state === 3)
			this.showArrows();

		isValidated = true;
		ElementUtils.addClass(this._searchInputSuggestion, "validated");
	};

	p._onArrowsClick = function(e){
		this._isFromArrow = true;
		var newAgyIndex;
		console.debug( "Shifting " );
		console.debug( "Shifting " );
		console.debug( "Shifting " );
		console.debug( "Shifting " );
		console.debug( "Shifting " );
		if(ElementUtils.hasClass(e.target, "prevArrow")){
			newAgyIndex = this._controller.shift(-1);
			this._autocomplete.currentSuggestion = this._autocomplete.currentSuggestion-1 < 0 ? this._autocomplete.suggestions.length-1 : this._autocomplete.currentSuggestion-1;
		} else {
			newAgyIndex = this._controller.shift(1);
			this._autocomplete.currentSuggestion = this._autocomplete.currentSuggestion+1 >= this._autocomplete.suggestions.length ? 0 : this._autocomplete.currentSuggestion+1;
		}

		if(isValidated){
			var strAgy = siteManager.model.getAgencyNameWithPosIndex(newAgyIndex);
			if(strAgy !== -1) {
				var nextAgency = $.grep(this._autocomplete.datas, function(e){
					return e.name === strAgy;
				});

				siteManager.globalStateManager.getPage("Stats").fetch({type: 1, extra: nextAgency[0].agencyIndex});
				this.validate(nextAgency[0]);
			}
		} else {
			this._onSearchInputAutoSuggest(this._autocomplete.suggestions[this._autocomplete.currentSuggestion]);
		}
	};

	p._onAbout = function(e) {
		siteManager.globalStateManager.setPage("About");
	};

	p._onShare = function(e) {
		switch(e.target.className){
			case 'facebook':
				Social.facebook.share({
					name: siteManager.copyManager.getCopy("mobile.sharing.facebook.title"),
					caption: '',
					description: siteManager.copyManager.getCopy("mobile.sharing.facebook.description"),
					link: siteManager.copyManager.getCopy("mobile.sharing.facebook.link"),
					picture: window.location.protocol+'//'+window.location.hostname+'/common/files/images/social/spotifycannes_fb.jpg'
				});

				ga('send', 'event', 'desktop/click', 'share', 'desktop/events/btnShareFb');
				break;
			case 'twitter':
				Social.twitter.share({
					link: siteManager.copyManager.getCopy("mobile.sharing.twitter.link"),
					text: siteManager.copyManager.getCopy("mobile.sharing.twitter.text")
				});

				ga('send', 'event', 'desktop/click', 'share', 'desktop/events/btnShareTw');
				break;
			default:

				break;
		}
		console.info('TODO: implement social shares for : '+e.target.className);
	};

	p._onStats = function(e) {
		// siteManager.globalStateManager.getPage("Stats").updateDatas({tempo: 60});
		// var _ret = siteManager.globalStateManager.getPage("Stats").toggleExtended( this._onStats.bind(this) );
		// if(_ret) {
		// 	ElementUtils.addClass(this._btnStats, "open");
		// 	ga('send', 'event', 'desktop/click', 'stats', 'stats/open');
		// } else {
		// 	ElementUtils.removeClass(this._btnStats, "open");
		// 	ga('send', 'event', 'desktop/click', 'stats', 'stats/close');
		// }
	};


	p._onSearchAgencyClick = function(e) {
		if(ElementUtils.hasClass(this._btnAgency, "selected")) return;
		ga('send', 'event', 'desktop/click', 'search', 'desktop/search/btnAgency');
		this._onSearchAgency(e);
	};
	p._onSearchAgency = function(e) {
		// this._controller.setState(3);
		if(ElementUtils.hasClass(this._btnAgency, "selected")) return;

		if(e!=undefined) this._controller.setState(3);
		this.dispatchCustomEvent(SearchPanel.START_SEARCHING);

		ElementUtils.addClass(this._btnAgency, "selected");
		ElementUtils.removeClass(this._btnPeople, "selected");

		ElementUtils.addClass(this._searchContainer, "searchAgency");
		ElementUtils.removeClass(this._searchContainer, "searchPeople");

		this._searchInputWrapper.style.display = "block";

		this._resetInput();

		DomElementPositionTween.createWithAnimation(this._searchInputWrapper, 0, -60, 0, 0, 1.25, TWEEN.Easing.Exponential.Out, .2, null, false);
		DomElementPositionTween.createWithAnimation(this._peopleSelectWrapper, 0, 0, 0, -60, 1.25, TWEEN.Easing.Exponential.Out, 0, function(){
			if(!ElementUtils.hasClass(this._btnAgency, "selected")) return;
			this._peopleSelectWrapper.style.display = "none";
		}.bind(this), false);

		DomElementOpacityTween.createWithAnimation(this._searchInputWrapper, 0, 1, 1, TWEEN.Easing.Exponential.Out, .2);
		DomElementOpacityTween.createWithAnimation(this._peopleSelectWrapper, 1, 0, 1, TWEEN.Easing.Exponential.Out, 0);
	};

	p._onSearchPeople = function(e) {
		// this._controller.setState(3);
		if(ElementUtils.hasClass(this._btnPeople, "selected")) return;

		console.log( "Search for People" );
		this._controller.setState(6);

		ga('send', 'event', 'desktop/click', 'search', 'desktop/search/btnPeople');

		ElementUtils.addClass(this._btnPeople, "selected");
		ElementUtils.removeClass(this._btnAgency, "selected");

		ElementUtils.addClass(this._searchContainer, "searchPeople");
		ElementUtils.removeClass(this._searchContainer, "searchAgency");

		this._peopleSelectWrapper.style.display = "block";

		DomElementPositionTween.createWithAnimation(this._searchInputWrapper, 0, 0, 0, -60, 1.25, TWEEN.Easing.Exponential.Out, 0, function(){
			if(!ElementUtils.hasClass(this._btnPeople, "selected")) return;
			this._searchInputWrapper.style.display = "none";
		}.bind(this), false);
		DomElementPositionTween.createWithAnimation(this._peopleSelectWrapper, 0, -60, 0, 0, 1.25, TWEEN.Easing.Exponential.Out, .2, null, false);

		DomElementOpacityTween.createWithAnimation(this._searchInputWrapper, 1, 0, 1, TWEEN.Easing.Exponential.Out, 0);
		DomElementOpacityTween.createWithAnimation(this._peopleSelectWrapper, 0, 1, 1, TWEEN.Easing.Exponential.Out, .2);

		this.dispatchCustomEvent(SearchPanel.SEARCH_PEOPLE, {index:-1});
	};


	p._onPeopleSelect = function(e) {
		this.dispatchCustomEvent(SearchPanel.SEARCH_PEOPLE, {index:e.detail.index});
	};


	p._onPeopleMenuOpen = function(e) {
		this.dispatchCustomEvent(SearchPanel.PEOPLE_MENU_OPEN);	
	};

	p._onGenreFilter = function() {
		this.dispatchCustomEvent(SearchPanel.FILTER_GENRE);
	};

	p._filterGenreWithIndex = function(index) {
		this.dispatchCustomEvent(SearchPanel.FILTER_GENRE_WITH_INDEX, index);
	};


	p._onCloseGenreFilter = function() {
		this.dispatchCustomEvent(SearchPanel.CLOSE_FILTER_GENRE);
	};

});
