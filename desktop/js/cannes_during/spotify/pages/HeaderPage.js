// HeaderPage.js

breelNS.defineClass(breelNS.projectName+".page.HeaderPage", "generic.templates.BasicPage", function(p, s, HeaderPage) {
	var DomElementOpacityTween = breelNS.getNamespace("generic.animation").DomElementOpacityTween;
	var siteManager;

	p.initialize = function() {
		siteManager 		= breelNS.getNamespace(breelNS.projectName).singletons.siteManager;
		this._template 		= siteManager.assetManager.getAsset("HeaderContent");
		this._isOpened 		= false;
		this.container.appendChild(this._template);
		CSS.set(this.container, {opacity: 0});
	};


	p.open = function() {
		this.setOpened();
	};


	p.show = function() {
		if(this._isOpened) return;
		this._isOpened = true;
		CSSanimate.to(this.container, {opacity: 1},{duration: 400, ease: 'easeInOutQuad', delay: 0}, function(){}.bind(this));
		//DomElementOpacityTween.createWithAnimation(this.container, 0, 1, .5, TWEEN.Easing.Exponential.Out, 0);
	};


	p.close = function() {
		this.setClosed();
	};
});