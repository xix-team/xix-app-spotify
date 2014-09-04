// MainLoaderPage.js

breelNS.defineClass(breelNS.projectName+".page.MainLoaderPage", "generic.templates.LoaderPage", function(p, s, MainLoaderPage) {
	var TweenHelper            = breelNS.getNamespace("generic.animation").TweenHelper;
	var DomElementOpacityTween = breelNS.getNamespace("generic.animation").DomElementOpacityTween;
	var EventDispatcher        = breelNS.getNamespace("generic.events").EventDispatcher;
	var GlobalStateManager     = breelNS.getNamespace("generic.core").GlobalStateManager;
	var ListenerFunctions      = breelNS.getNamespace("generic.events").ListenerFunctions;
	var ElementUtils           = breelNS.getNamespace("generic.htmldom").ElementUtils;
	var DomElementCreator      = breelNS.getNamespace("generic.htmldom").DomElementCreator;
	var LoaderAnim      	   = breelNS.getNamespace(breelNS.projectName+".loader").LoaderAnim
	var siteManager;

	p.initialize = function() {

		/*
			DOM handling
		*/

		// force a hidden dom element so the main sprite gets loaded
		var dummySpriteLoader = $('<div class="dummySpriteLoader"></div>');
		this.container.appendChild(dummySpriteLoader[0]);


		this.logoContainer = $('<div class="logoContainer"></div>').css({
			position: 'absolute',
			margin: '-198px auto 0 auto',
			top: '50%',
			left: '0px',
			right: '0px',
			width: '296px',
			height: '49px'
		});

		this.logoSpotify = $('<div class="logoSpotify"></div>').css({
			position: 'relative',
			float: 'left',
			width: '165px',
			height: '49px',
			background: 'url("common/files/images/landing/logo_sprite.png")',
			//opacity: 0
		});

		this.logoSeparator = $('<div class="logoSeparator"></div>').css({
			position: 'relative',
			float: 'left',
			margin: '0 0 0 12px',
			width: '3px',
			height: '49px',
			background: 'url("common/files/images/landing/logo_sprite.png")',
			backgroundPosition: '119px 0px',
			//opacity: 0
		});

		this.logoCannes = $('<div class="logoCannes"></div>').css({
			position: 'relative',
			float: 'left',
			margin: '0 0 0 17px',
			width: '99px',
			height: '49px',
			background: 'url("common/files/images/landing/logo_sprite.png")',
			backgroundPosition: '99px 0px',
			//opacity: 0
		});

		this.logoContainer.append(this.logoSpotify);
		this.logoContainer.append(this.logoSeparator);
		this.logoContainer.append(this.logoCannes);

		this.container.appendChild(this.logoContainer[0]);

		// this._logo 				= document.createElement("div");
		// this._logo.className 	= "loaderLogo";
		// this.container.appendChild(this._logo);
		this._loaderAnim		= new LoaderAnim().init(this.container);
		this._canvas 			= this._loaderAnim.getCanvas();
		this._onAnimCompleteBound = ListenerFunctions.createListenerFunction(this, this._onAnimComplete);
		this._loaderAnim.addEventListener("animComplete", this._onAnimCompleteBound);
	};

	p.setLoadingPercent = function(aPercent) {
		this._loaderAnim.setPercentage(aPercent);
	};


	p.open = function() {
		//var that = this;

		this.setOpened();

		CSSanimate.fromTo(this.logoSpotify[0], {
			transform: 'translateY(-50px)',
			opacity: 0
		}, {
			transform: 'translateY(0px)',
			opacity: 1
		}, {
			ease: 'easeOutSine',
			duration: 1000,
			delay: 100
		}, function() {}.bind(this));

		CSSanimate.fromTo(this.logoSeparator[0], {
			transform: 'translateY(-50px)',
			opacity: 0
		}, {
			transform: 'translateY(0px)',
			opacity: 1
		}, {
			ease: 'easeOutSine',
			duration: 1000,
			delay: 200
		}, function() {}.bind(this));

		CSSanimate.fromTo(this.logoCannes[0], {
			transform: 'translateY(-50px)',
			opacity: 0
		}, {
			transform: 'translateY(0px)',
			opacity: 1
		}, {
			ease: 'easeOutSine',
			duration: 1000,
			delay: 300
		}, function() {}.bind(this));


		// DomElementOpacityTween.createWithAnimation(this.container, 0, 1, 1, TWEEN.Easing.Sinusoidal.In, 0, function() {
		//
		// });
		// that.setOpened();
	};


	p.close = function() { };


	p._onAnimComplete = function() {
		//var that = this;


		CSSanimate.fromTo(this._canvas, {
			opacity: 1,
		}, {
			opacity: 0
		}, {
			ease: 'linear',
			duration: 900,
			delay: 500
		}, function() {
			this.setClosed();
		}.bind(this));

		// DomElementOpacityTween.createWithAnimation(this._canvas, 1, 0, .5, TWEEN.Easing.Sinusoidal.Out, 0, function() {
		// 	that.setClosed();
		// });
	};


	p.setClosed = function() {
		this._loaderAnim.stop();
		s.setClosed.call(this);
	};


});
