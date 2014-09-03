

breelNS.defineClass(breelNS.projectName+".page.landing.ExpandedProfileController", breelNS.projectName+".common.profileParticles.ExpandedProfileController", function(p, s, ExpandedProfileController) {
	var ExpandedProfileStartView = breelNS.getNamespace(breelNS.projectName+".page.landing.expandedProfile").ExpandedProfileStartView;
	var ExpandedProfileBottomView = breelNS.getNamespace(breelNS.projectName+".page.landing.expandedProfile").ExpandedProfileBottomView;
	var ListenerFunctions      = breelNS.getNamespace("generic.events").ListenerFunctions;
	var siteManager;

	ExpandedProfileController.ON_BG_CLICK = 'expandedProfileOnBgClick';

	p.init = function(el){

		siteManager = breelNS.getNamespace(breelNS.projectName).singletons.siteManager;

		s.init.call(this, el);

		this.expandedProfileStartView = new ExpandedProfileStartView();
		this.expandedProfileStartView.init(this._el.querySelector('.startViewWrapper'));

		this.expandedProfileBottomView = new ExpandedProfileBottomView();
		this.expandedProfileBottomView.init(this._el.querySelector('.controlWrapper'));

	};


	p._onBackgroundClick = function(e){

		this.dispatchCustomEvent(ExpandedProfileController.ON_BG_CLICK);
		//console.log(e);
		//this.dispatchCustomEvent(ExpandedProfileController.ON_BG_CLICK);
	};

});
