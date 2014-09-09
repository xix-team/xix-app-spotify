// HomePage.js

breelNS.defineClass(breelNS.projectName+".page.HomePage", "generic.templates.BasicPage", function(p, s, HomePage) {
	var TweenHelper        = breelNS.getNamespace("generic.animation").TweenHelper;
	var EventDispatcher    = breelNS.getNamespace("generic.events").EventDispatcher;
	var GlobalStateManager = breelNS.getNamespace("generic.core").GlobalStateManager;
	var ListenerFunctions  = breelNS.getNamespace("generic.events").ListenerFunctions;
	var ElementUtils       = breelNS.getNamespace("generic.htmldom").ElementUtils;
	var DomElementCreator  = breelNS.getNamespace("generic.htmldom").DomElementCreator;
	var CanvasRenderer     = breelNS.getNamespace(breelNS.projectName+".canvas").CanvasRenderer;
	var Particle           = breelNS.getNamespace(breelNS.projectName+".canvas").Particle;
	var siteManager;
	p.initialize = function() {
		console.log( "init" );
		siteManager 		= breelNS.getNamespace(breelNS.projectName).singletons.siteManager;

		var h1 = document.createElement("h1");
		this.container.appendChild(h1);
		h1.innerHTML = "HomePage";
	}


	p.open = function() {
		console.log( "Open" );
		this.setOpened();
	};


	p.close = function() {
		console.log( "Close" );
		this.setClosed();
	}
});