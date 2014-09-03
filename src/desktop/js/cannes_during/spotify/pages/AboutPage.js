// AboutPage.js

breelNS.defineClass(breelNS.projectName+".page.AboutPage", "generic.templates.BasicPage", function(p, s, AboutPage) {
	var DomElementOpacityTween = breelNS.getNamespace("generic.animation").DomElementOpacityTween;
	var ListenerFunctions = breelNS.getNamespace("generic.events").ListenerFunctions;
	var siteManager;


	p.initialize = function() {
		siteManager 		= breelNS.getNamespace(breelNS.projectName).singletons.siteManager;
		this._template 		= siteManager.assetManager.getAsset("AboutContent");
		this.container.appendChild(this._template);

		this._aboutIntroWrapper = this.container.querySelector('.aboutIntroWrapper');
		this._tAndCWrapper = this.container.querySelector('.tAndCWrapper');
		// this._aboutIntroCloseBtn = this.container.querySelector('.aboutIntroCloseBtn');
		// this._tAndCCloseBtn = this.container.querySelector('.aboutTandCCloseBtn');

		this._onCloseBtnClickBound = ListenerFunctions.createListenerFunction(this, this._onCloseBtnClick);
		// this._aboutIntroCloseBtn.addEventListener('click', this._onCloseBtnClickBound);
		// this._tAndCCloseBtn.addEventListener('click', this._onCloseBtnClickBound);

		this._showtAndCTimer = null;
		this._showtAndCDelay = 6000;

		this._aboutIntroWrapper.style.display = 'block';
		this._aboutIntroWrapper.style.opacity = 1;
		this._tAndCWrapper.style.display = 'none';
		this._tAndCWrapper.style.opacity = 0;

		this.container.addEventListener("click", function(e) {
			siteManager.globalStateManager.preState();
		});
	};

	p.setOpened = function(){

		s.setOpened.call(this);
		
		var self = this;
		// this._showtAndCTimer = setTimeout(function(){

		// 	self.hideAboutIntro();


		// },this._showtAndCDelay);
	};

	p.hideAboutIntro = function(){

		var self = this;
		DomElementOpacityTween.createWithAnimation(self._aboutIntroWrapper, 1, 0, .5, TWEEN.Easing.Exponential.Out, 0, function() {
			
			// self.showTAndC(.5);
			// self._aboutIntroWrapper.style.display = 'none';
			// self._tAndCWrapper.style.display = 'block';

		});

	};

	p.showTAndC = function(delay){

		var self = this;
		DomElementOpacityTween.createWithAnimation(self._tAndCWrapper, 0, 1, .5, TWEEN.Easing.Exponential.Out, delay, function() {
			
			

		});


	};

	p._onCloseBtnClick = function(){

		siteManager.globalStateManager.preState();

		ga('send', 'pageview', {
			'page': 'desktop/pages/landing',
			'title': 'desktop/pages/landing'
		});

	};


	p.open = function() {
		var that = this;
		DomElementOpacityTween.createWithAnimation(this.container, 0, 1, .5, TWEEN.Easing.Exponential.Out, 0, function() {
			console.log( "Set OPENED" );
			that.setOpened();
			// desktop/pages/about
			ga('send', 'pageview', {
				'page': 'desktop/pages/about',
				'title': 'desktop/pages/about'
			});
		});
	};


	p.close = function() {
		clearTimeout(this._showtAndCTimer);

		var that = this;
		DomElementOpacityTween.createWithAnimation(this.container, 1, 0, .5, TWEEN.Easing.Exponential.Out, 0, function() {
			that.setClosed();	
		});
	};



});