// LandingPage.js

breelNS.defineClass(breelNS.projectName+".page.LandingPage", "generic.templates.BasicPage", function(p, s, LandingPage) {
	var ListenerFunctions      = breelNS.getNamespace("generic.events").ListenerFunctions;
	var ElementUtils           = breelNS.getNamespace("generic.htmldom").ElementUtils;
	var BrowserDetector 	   = breelNS.getNamespace("generic.utils").BrowserDetector;
	var DomElementOpacityTween = breelNS.getNamespace("generic.animation").DomElementOpacityTween;
	var SearchPanel            = breelNS.getNamespace(breelNS.projectName+".page.landing").SearchPanel;
	var CanvasRenderer         = breelNS.getNamespace(breelNS.projectName+".canvas").CanvasRenderer;
	var ParticleController	   = breelNS.getNamespace(breelNS.projectName+".page.landing").ParticleController;
	var FallingImages	       = breelNS.getNamespace(breelNS.projectName+".page.landing").FallingImages;
	var ProfileParticleController = breelNS.getNamespace(breelNS.projectName+".page.landing").ProfileParticleController;
	var ExpandedProfileController = breelNS.getNamespace(breelNS.projectName+".page.landing").ExpandedProfileController;
	var siteManager, params;


	//var images = ["desktop/files/images/1x/common/albums/01.jpg","desktop/files/images/1x/common/albums/02.jpg","desktop/files/images/1x/common/albums/03.jpg","desktop/files/images/1x/common/albums/04.jpg","desktop/files/images/1x/common/albums/05.jpg"];


	p.initialize = function() {

		siteManager                  = breelNS.getNamespace(breelNS.projectName).singletons.siteManager;
		params						 = siteManager.settings.params;
		debugger;
		this.template                = siteManager.assetManager.getAsset("LandingContent");
		this._canvas                 = document.createElement("canvas");
		this._canvas.width           = window.innerWidth;
		this._canvas.height          = window.innerHeight;
		this._canvas.style.position  = "absolute";
		this._cursorHolder 			 = document.createElement("div");
		this.container.appendChild(this._cursorHolder);
		this._cursorHolder.className = "cursorHolder";
		this._arriveCount			 = 0;
		this._isInParticleClickAnim  = false;
		this.hasExplored 			 = false;

		this.renderer                = CanvasRenderer.createRenderer(this._canvas, siteManager.config.config.force2D);
		this.renderer._y             = -100;
		this._onParticleClickBound = ListenerFunctions.createListenerFunction(this, this._onParticleClick);
		this.renderer.addEventListener(CanvasRenderer.ON_PARTICLE_CLICK, this._onParticleClickBound);
		this.profileParticleController = new ProfileParticleController();
		this.profileParticleController.init(this.template.querySelector('.profileParticleWrapper_desktop'));
		this._onProfileParticleClickBound = ListenerFunctions.createListenerFunction(this, this._onProfileParticleClick);
		this.profileParticleController.addEventListener(ProfileParticleController.ON_PROFILE_PARTICLE_CLICK, this._onProfileParticleClickBound);

		this.expandedProfileController = new ExpandedProfileController();
		this.expandedProfileController.init(this.template.querySelector('.expandedProfileWrapper'));
		this._onExpandedProfileBgClickBound = ListenerFunctions.createListenerFunction(this, this._onExpandedProfileBgClick);
		this.expandedProfileController.addEventListener(ExpandedProfileController.ON_BG_CLICK, this._onExpandedProfileBgClickBound);

		this.container.appendChild(this.template);
		this.container.appendChild(this._canvas);
		debugger;
		this._copyContainer = this.template.querySelector(".landingCopyContainer");
		this._copyContainer.style.marginTop = -this._copyContainer.clientHeight + 140 + "px";
		this._btnExplore = this.template.querySelector("#btnExplore");
		this._btnExplore.style.marginLeft = (this._copyContainer.clientWidth - this._btnExplore.clientWidth + 15) * .5 + "px";

		this.checkIpadOrientation();

		var images = [];
		for(var i = 1; i < 15; i++){
			var id = i.toString();
			if(i < 10) id = '0' + i.toString();
			var img = siteManager.assetManager.assets['intro_cover' + id];
			img.width = 130;
			img.height = 130;
			images.push(img);
		}

		this._controller	= new ParticleController().init(this.renderer);
		this._searchPanel 	= new SearchPanel().init(this.template.querySelector(".landingSearchPanel"), this._controller);
		this._fallingImages = new FallingImages().init(this.container, images, images.length);
		this._controller.lock(true);
		this._searchPanel.lock();

		this._onParticleOverBound = ListenerFunctions.createListenerFunction(this, this._onParticleOver);
		this._onParticleOutBound  = ListenerFunctions.createListenerFunction(this, this._onParticleOut);
		this._onNewCloudsBound    = ListenerFunctions.createListenerFunction(this, this._onNewClouds);
		this._controller.addEventListener(ParticleController.ON_PARTICLE_ROLLOVER, this._onParticleOverBound);
		this._controller.addEventListener(ParticleController.ON_PARTICLE_ROLLOUT, this._onParticleOutBound);
		this._controller.addEventListener(ParticleController.ON_NEW_CLOUDS, this._onNewCloudsBound);

		this._onExploreBound = ListenerFunctions.createListenerFunction(this, this._onExplore);
		ListenerFunctions.addDOMListener(this._btnExplore, "click", this._onExploreBound);

		// this._onSearchingBound          = ListenerFunctions.createListenerFunction(this, this._onSearching);
		// this._onSearchingForBound       = ListenerFunctions.createListenerFunction(this, this._onSearchingFor);
		this._filterGenreBound          = ListenerFunctions.createListenerFunction(this, this._filterGenre);
		this._filterGenreWithIndexBound = ListenerFunctions.createListenerFunction(this, this._filterGenreWithIndex);
		this._closeFilterGenreBound     = ListenerFunctions.createListenerFunction(this, this._closeFilterGenre);
		this._onTypingBound             = ListenerFunctions.createListenerFunction(this, this._onTyping);
		this._onSearchPeopleBound       = ListenerFunctions.createListenerFunction(this, this._onSearchPeople);
		this._onTransitionStartBound 	= ListenerFunctions.createListenerFunction(this, this._onTransitionStart);
		this._onPeopleOpenBound 		= ListenerFunctions.createListenerFunction(this, this._onPeopleOpen);

		this._controller.addEventListener(ParticleController.ON_TRANSITION_START, this._onTransitionStartBound);
		this._searchPanel.addEventListener(SearchPanel.FILTER_GENRE, this._filterGenreBound);
		this._searchPanel.addEventListener(SearchPanel.FILTER_GENRE_WITH_INDEX, this._filterGenreWithIndexBound);
		this._searchPanel.addEventListener(SearchPanel.CLOSE_FILTER_GENRE, this._closeFilterGenreBound);
		// this._searchPanel.addEventListener(SearchPanel.START_SEARCHING, this._onSearchingBound);
		// this._searchPanel.addEventListener(SearchPanel.SEARCHING_FOR, this._onSearchingForBound);
		this._searchPanel.addEventListener(SearchPanel.USER_TYPING, this._onTypingBound);
		this._searchPanel.addEventListener(SearchPanel.SEARCH_PEOPLE, this._onSearchPeopleBound);
		this._searchPanel.addEventListener(SearchPanel.PEOPLE_MENU_OPEN, this._onPeopleOpenBound);

		this._onImageArriveBound = ListenerFunctions.createListenerFunction(this, this._onImageArrive);
		this._fallingImages.addEventListener(FallingImages.IMAGE_ARRIVED, this._onImageArriveBound);

		this._onProfileParticleControllerAllZoomedOutBound = ListenerFunctions.createListenerFunction(this, this._onProfileParticleControllerAllZoomedOut);
		this._onProfileParticleControllerAllZoomedInBound = ListenerFunctions.createListenerFunction(this, this._onProfileParticleControllerAllZoomedIn);

		this.profileParticleController.addEventListener(ProfileParticleController.ON_ALL_ZOOMED_OUT, this._onProfileParticleControllerAllZoomedOutBound);
		this.profileParticleController.addEventListener(ProfileParticleController.ON_ALL_ZOOMED_IN, this._onProfileParticleControllerAllZoomedInBound);

		var that = this;
		window.addEventListener("resize", function(e) {	 that._onResize(e);  });
		window.addEventListener("keydown", function(e) { that._onKeyDown(e); });

		var amount = Math.floor(siteManager.settings.params.numParticles);
		siteManager.model.getInitUsers(this, function(data) {
			that._initData = data;
			that._numParticlesPerStep = that._initData.length/that._fallingImages.length;
			that._controller.initialParticlesLenght = that._initData.length;
			that._controller.setState(0);
		}, amount);

	};

	p._onProfileParticleControllerAllZoomedIn = function(){
		this._controller.lock(false);
		this._searchPanel.unlock();
	};

	p._onProfileParticleControllerAllZoomedOut = function(){
		console.log( "Put back DAta ", this.putBackData );
		if(this._isInParticleClickAnim && this.putBackData.length > 0 ) this._controller.addPutBackParticles(this.putBackData);
		this._isInParticleClickAnim = false;
	};

	p._onPeopleOpen = function(e) {
		this.expandedProfileController.hide();
	};

	p._onExpandedProfileBgClick = function(e){
		// console.log( "Return to particles" );
		// this._controller.lock(false);
		this.expandedProfileController.hide();
		siteManager.globalStateManager.getPage("Stats").open();
		siteManager.scheduler.delay(this._controller, this._controller.lock, [false], 500);
	};

	p._onProfileParticleClick = function(e){
		console.log( 'Profile particle clicked' );
		this._controller.lock(true);

		var detail = e.detail;

		if (detail === undefined) return;

		this.expandedProfileController.setData(detail);
		this.expandedProfileController.show();

		siteManager.globalStateManager.getPage("Stats").close();

	};

	p._onNewClouds = function(e) {
		this.profileParticleController.removeParticles();
	};

	p._onTransitionStart = function(e) {
		this.profileParticleController.removeParticles();

		if(e.detail.state == 4) {
			this._searchPanel.showArrows();
		} else {
			this._searchPanel.hideArrows();
		}

		this._searchPanel.lock();
		if(this._controller.getState() != 0) siteManager.scheduler.delay(this._searchPanel, this._searchPanel.unlock, [], 3000);
	};


	p._onTyping = function(e) {
		this._controller.typing();
	};


	p._onSearchPeople = function(e) {
		// this._controller.setState(6);
		this._controller.searchForPeople(e.detail.index);
	};

	p._onParticleClick = function(e) {
		if(this._controller.getState() == 5) return;
		this._isInParticleClickAnim = true;
		if (this.profileParticleController._particleAnimationsInProgress) return;
		this.putBackData = this.profileParticleController.removeParticlesAndShowNew(e.detail.particle.userObject);

		console.debug( "putback  : ", this.putBackData );
		this._onParticleOut();
		this._searchPanel.lock();
	}

	p._onImageArrive = function(e) {

		var data = [];
		var settings = [];
		var count = 0;
		while(count++ < this._numParticlesPerStep && this._initData.length > 0) {
			var d = this._initData.pop();

			var s = {origin: {x: e.detail, y: 0}};


			data.push(d);
			settings.push(s);

		}

		this._arriveCount ++;
		this._controller.addParticles(data, settings);
		this._controller.offsetGlobalRadius(50);


		if(this._arriveCount >= this._fallingImages.length) {
			this._fallingImages.destroy();
			//this._controller.postInitParticles();
			siteManager.scheduler.delay(this._controller, this._controller.setState, [1], 200);
			siteManager.scheduler.delay(this, this.animComplete, [], 500);
		} else if ( this._arriveCount == 10) {
			//ElementUtils.addClass(document.body, "dark");
		}
	};

	p.animComplete = function() {
		siteManager.scheduler.delay(this.profileParticleController, this.profileParticleController.showIntro, [] , 0);
		setTimeout(this._showUi.bind(this), 3000);
		//siteManager.scheduler.delay(this._searchPanel, this._searchPanel.show, [] , 1000);
	};

	p._showUi = function() {
		var that = this;
		debugger;
		var mobilePush = this.template.querySelector(".mobilePush");
		CSSanimate.to(mobilePush, {opacity: 1},{duration: 400, ease: 'easeInOutQuad', delay: 0}, function(){}.bind(this));
		siteManager.globalStateManager.getPage("Header").show();
		siteManager.globalStateManager.getPage("Footer").show();
		this._searchPanel.show();

		siteManager.globalStateManager.getPage("Stats").fetch({type: 0});



	}

	p._onExplore = function(e) {
		if(this.hasExplored) return;
		this.hasExplored = true;
		if(this._initData == undefined) {
			console.log( "Waiting for data" );
			siteManager.scheduler.next(this, this._onExplore, []);
			return;
		}
		ga('send', 'event', 'desktop/click', 'landing', 'btnExplore');



		var that = this;
		/*var mobilePush = this.template.querySelector(".mobilePush");
		mobilePush.style.display = "block";
		DomElementOpacityTween.createWithAnimation(mobilePush, 0, 1, .5, TWEEN.Easing.Exponential.Out, 0, function() {
		});*/

		DomElementOpacityTween.createWithAnimation(this._copyContainer, 1, 0, .5, TWEEN.Easing.Exponential.Out, 0, function() {
			that._copyContainer.style.display = "none";
		});

		if(!siteManager.config.config.skipIntro) this._fallingImages.start();
		else {
			ElementUtils.addClass(document.body, "dark");
			this._fallingImages.destroy();
			this._controller.setState(1);
			this._controller.initParticles();
			this.animComplete();
		}

		ga('send', 'pageview', {
			'page': 'desktop/pages/landing',
			'title': 'desktop/pages/landing'
		});

	};


	//	PARTICLE ROLLOVER
	p._onParticleOver = function(e) {
		ElementUtils.addClass(document.body, "hideCursor");
		ElementUtils.addClass(this._cursorHolder, "display");
		this._cursorHolder.style.left = e.detail.x - 10 + "px";
		this._cursorHolder.style.top = e.detail.y - 10 + "px";
	};


	p._onParticleOut = function(e) {
		ElementUtils.removeClass(this._cursorHolder, "display");
		ElementUtils.removeClass(document.body, "hideCursor");
	};



	//	FILTERING
	p._filterGenre = function() {
		console.log('_filterGenre');
		this._controller.setState(5);
		this._controller.filterGenre(-1);
	};

	p._filterGenreWithIndex = function(event) {
		console.log('_filterGenreWithIndex');
		this._controller.filterGenre(event.detail);
	};

	p._closeFilterGenre = function() {
		console.log('_closeFilterGenre');
		this._controller.filterGenre(-1);
		this._controller.setState(1);
	};


	//	OPEN & CLOSE
	p.open = function() {
		// var delay = .1;
		// var that = this;

		CSSanimate.fromTo($('.landingTitle')[0], {
			transform: 'translateY(50px)',
			opacity: 0
		}, {
			transform: 'translateY(0px)',
			opacity: 1
		}, {
			ease: 'easeOutSine',
			duration: 1000,
			delay: 50
		}, function() {}.bind(this));

		CSSanimate.fromTo($('.landingText')[0], {
			transform: 'translateY(50px)',
			opacity: 0
		}, {
			transform: 'translateY(0px)',
			opacity: 1
		}, {
			ease: 'easeOutSine',
			duration: 1000,
			delay: 250
		}, function() {}.bind(this));

		CSSanimate.fromTo($('.instructions')[0], {
			//transform: 'translateY(-50px)',
			opacity: 0
		}, {
			//transform: 'translateY(0px)',
			opacity: 1
		}, {
			ease: 'easeOutSine',
			duration: 1000,
			delay: 700
		}, function() {
			this.setOpened();
		}.bind(this));

		CSSanimate.fromTo($('#btnExplore')[0], {
			//transform: 'translateY(-50px)',
			opacity: 0
		}, {
			//transform: 'translateY(0px)',
			opacity: 1
		}, {
			ease: 'easeOutSine',
			duration: 1000,
			delay: 800
		}, function() {
			this.setOpened();
		}.bind(this));

		// DomElementOpacityTween.createWithAnimation(this._copyContainer.querySelector(".landingTitle"), 0, 1, .5, TWEEN.Easing.Sinusoidal.Out, delay);
		// DomElementOpacityTween.createWithAnimation(this._copyContainer.querySelector(".landingText"), 0, 1, .7, TWEEN.Easing.Exponential.Out, delay);
		// DomElementOpacityTween.createWithAnimation(this._copyContainer.querySelector("#btnExplore"), 0, 1, .5, TWEEN.Easing.Sinusoidal.In, delay+.1, function() {
		// 	that.setOpened();
		// });

		ga('send', 'pageview', {
			'page': 'desktop/pages/loading',
			'title': 'desktop/pages/loading'
		});


		this._searchPanel.lock();
	};


	p.close = function() {
		this.setClosed();
	}

	p._onResize = function(e) {
		console.log( "Resizing" );
		var w = window.innerWidth;
		var h = window.innerHeight;
		this.renderer.resize(w,h);
		this._fallingImages.resize(w,h);
		this.profileParticleController.onResize(w, h, true);
		this.expandedProfileController.onResize();

		this.checkIpadOrientation();
	};

	p.checkIpadOrientation = function(){
		if(window.browserDetector._isTabletDevice){
			if(window.innerWidth < window.innerHeight){
				this.showIpadNoPortrait();
			} else {
				this.hideIpadNoPortrait();
			}
		}
	};

	p.showIpadNoPortrait = function(){
		var noPortrait = siteManager.assetManager.getAsset("IPADnoPortraitContent");
		document.querySelector('body').appendChild(noPortrait);
		setTimeout(function(){
			ElementUtils.addClass(noPortrait, "display");
		}, 1);
	};

	p.hideIpadNoPortrait = function(){
		var elements = document.querySelectorAll('#IPADnoPortraitContent');
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


	//	DEBUG
	p._onKeyDown = function(e) {
		// console.debug( "KEY CODE : ", e.keyCode );
		if(e.keyCode == 83) {				//	's' for go to search destination
			// this._controller.search(Math.floor(Math.random() * 97));
		} else if(e.keyCode == 68) {		//	'd' for return to searching view
			// this._controller.typing();
		} else if(e.keyCode == 71) {		//	'g' for searching genre
			// this._filterGenre();
		} else if(e.keyCode == 67) {		//	'c' for close searching genre
			// this._closeFilterGenre();
		} else if(e.keyCode >= 48 && e.keyCode < 57) {		//	'c' for close searching genre
			// this._filterGenreWithIndex(e.keyCode-48);
		} else if(e.keyCode == 37) {
			this._controller.shift(-1);
		} else if(e.keyCode == 39) {
			this._controller.shift(1);
		}
	};
});
