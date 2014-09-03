// GlobalSettings

breelNS.defineClass(breelNS.projectName+".model.GlobalSettings", "generic.events.EventDispatcher", function(p, s, GlobalSettings) {
	console.log( "GlobalSettings" );
	p.init = function() {
		this.colors				= ["#83b601", "#039568", "#3bb1e3", "#116275", "#b7e2f5", "#98ceb7", "#f7d363", "#ff8a6e", "#fae6db", "#ec607b"];
		var params = {};
		this.params = params;
		params.numParticles 	= 612;
		params.numConnectDots 	= 10;
		params.maxConnections 	= 5;
		params.speed 			= .05;
		params.baseSize			= 5;
		params.sizeDifference	= 16;
		params.speedDifference	= 4;
		params.zRange			= 100;
		params.minRadius		= 449;
		params.maxRadius		= 631;
		params.ratationRadius   = 690;
		params.blendModeAdd   	= false;
		params.layerDistance   	= 300;

		params.sizeDifferenceInDepth = 2.5;
		params.alphaDifferenceInDepth = 1.7;

		params.acceleration 		= 4;
		params.velocityDecreasing 	= .5;
		params.forceToCenter 		= .5;


		params.explosionRadius 		= 200;
		params.explosionForce		= 25;
		params.explosionDecrease	= .96;


		var isiPad = navigator.userAgent.match(/iPad/i) != null;
		if(isiPad) {
			params.numParticles		*= .5;
			params.minRadius		*=.75;
			params.maxRadius		*=.75;
			params.ratationRadius   *=.75;
			params.baseSize			*= 2;
		}
		
		return this;
	};
});