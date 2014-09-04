// SmallLoaderPage.js

breelNS.defineClass(breelNS.projectName+".page.SmallLoaderPage", "generic.templates.LoaderPage", function(p, s, SmallLoaderPage) {
	var TweenHelper = breelNS.getNamespace("generic.animation").TweenHelper;
	var EventDispatcher = breelNS.getNamespace("generic.events").EventDispatcher;
	var GlobalStateManager = breelNS.getNamespace("generic.core").GlobalStateManager;
	var ListenerFunctions = breelNS.getNamespace("generic.events").ListenerFunctions;
	var ElementUtils = breelNS.getNamespace("generic.htmldom").ElementUtils;
	var DomElementCreator = breelNS.getNamespace("generic.htmldom").DomElementCreator;
	var siteManager;

	p.initialize = function() {
		console.log( "init" );
	}

	p.setLoadingPercent = function(aPercent) {
		console.log("setLoadingPercent : ", aPercent);
	};


	p.open = function() {
		console.log( "Open" );
		this.setOpened();
	};


	p.close = function() {
		console.log( "Close" );
		this.setClosed();
	}
});