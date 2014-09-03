

breelNS.defineClass(breelNS.projectName+".common.profileParticles.ExpandedProfileController", "generic.events.EventDispatcher", function(p, s, ExpandedProfileController) {
	// var ExpandedProfileStartView = breelNS.getNamespace(breelNS.projectName+".page.landing.expandedProfile").ExpandedProfileStartView;
	// var ExpandedProfileBottomView = breelNS.getNamespace(breelNS.projectName+".page.landing.expandedProfile").ExpandedProfileBottomView;
	var ListenerFunctions      = breelNS.getNamespace("generic.events").ListenerFunctions;
	var siteManager;

	ExpandedProfileController.ON_BG_CLICK = 'expandedProfileOnBgClick';

	p.init = function(el){

		siteManager = breelNS.getNamespace(breelNS.projectName).singletons.siteManager;

		this._el = el;

		// this.expandedProfileStartView = new ExpandedProfileStartView();
		// this.expandedProfileStartView.init(this._el.querySelector('.startViewWrapper'));

		// this.expandedProfileBottomView = new ExpandedProfileBottomView();
		// this.expandedProfileBottomView.init(this._el.querySelector('.controlWrapper'));

		this.expandedViewWrapper = this._el.querySelector('.expandedViewWrapper');
		this.middleWrapper = this._el.querySelector('#middleWrapper');

		this._bgTouchEl = el.querySelector('.backgroundTouchEl');

		var btn = this._el.querySelector(".closeBtn");

		this._onBackgroundClickBound = ListenerFunctions.createListenerFunction(this, this._onBackgroundClick);
		this._bgTouchEl.addEventListener('click', this._onBackgroundClickBound);
		if(btn) btn.addEventListener('click', this._onBackgroundClickBound);

	};



	p._onBackgroundClick = function(){
		this.dispatchCustomEvent(ExpandedProfileController.ON_BG_CLICK);
	};

	p.setData = function(data){
		console.log( "Set Expanded Data : " );
		console.log( "Set Expanded Data : " );
		console.log( "Set Expanded Data : " );
		console.log( "Set Expanded Data : " );
		console.log( "Set Expanded Data : ", data );
		this.expandedProfileStartView.setData(data);
		this.expandedProfileBottomView.setData(data);
	};

	p.show = function(){
		this._el.style.opacity = 1;
		this._el.style.display = 'block';
		this.expandedProfileStartView.show();
		this.expandedProfileBottomView.show();
		this.onResize();

		this.onResize();

		siteManager.globalStateManager.getPage("Landing")._controller.lock(true);
	};

	p.hide = function(){
		// Fade all
		CSSanimate.to(this._el, {
			opacity: 0
		},
		{
			ease: 'easeOutSine',
			duration: 400,
			delay: 0
		}, function() {
			this._onHided();
		}.bind(this));
		
		this.expandedProfileStartView.hide();
		this.expandedProfileBottomView.hide();
		
	};

	p._onHided = function() {
		this._el.style.display = 'none';
		siteManager.globalStateManager.getPage("Landing")._controller.lock(false);
	};

	p.onResize = function(){
		var imageSize = window.innerHeight*.25;
		this.expandedViewWrapper.style.marginTop = -(this.expandedViewWrapper.clientHeight / 2) + 'px';
		this.middleWrapper.style.marginLeft = (-imageSize*.5) + "px"
		this.middleWrapper.style.height =  imageSize + "px";
		this.middleWrapper.style.width = imageSize + "px";


	};



});
