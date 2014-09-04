// RingController.js
breelNS.defineClass(breelNS.projectName+".page.landing.RingController", "generic.events.EventDispatcher", function(p, s, RingController) {
	var ListenerFunctions  = breelNS.getNamespace("generic.events").ListenerFunctions;
	var Particle           = breelNS.getNamespace(breelNS.projectName+".canvas").Particle;
	var ParticleController = breelNS.getNamespace(breelNS.projectName+".page.landing").ParticleController;
	var siteManager, params;

	RingController.ON_SEARCH_ANIM_OVER = "onSearchAnimOver";

	p.init = function(particles, renderer) {
		siteManager      = breelNS.getNamespace(breelNS.projectName).singletons.siteManager;
		params           = siteManager.settings.params;
		this.particles   = particles
		this._renderer   = renderer;
		this._ringIndex  = 0;
		this._totalRings = 0;
		this._isLocked   = false;
		this._isTyping 	= false;
		return this;
	};


	p.reset = function(total) {
		this._ringIndex 		= 0;
		this._totalRings 		= total;		
	};

	p.shift = function(dir) {
		this._ringIndex += dir;
		this._totalRings = siteManager.model.numAgencies;

		console.debug( "Shift : ", this._ringIndex, this._totalRings );
		this._dir = dir;
		if(this._ringIndex < 0) this._ringIndex = this._ringIndex = this._totalRings-1;
		if(this._ringIndex >= this._totalRings) this._ringIndex = 0;


		for ( var i=0; i<this.particles.length; i++) {
			var p = this.particles[i];
			p.layerRange = 0;
			p.layerIndex -= dir;

			if(p.layerIndex < -2) p.isDying = true;
			else if (p.layerIndex > 2) p.isDying = true;

			var ta = p.layerIndex == 0 ? 1 : 0;
			p.targetAlpha = ta;
			p.targetZ = p.layerIndex * params.layerDistance;
		}


		siteManager.model.searchForNextAgencyIndex(this._ringIndex, this, this._addShiftData);
		return this._ringIndex;
	};


	p._addShiftData = function(data) {
		for(var i=0; i<data.length; i++) {
			var p = new Particle().init();
			p.colorIndex = data[i].genre
			p.agency = data[i].agencyIndex;
			this.particles.push(p);
			p.layerIndex = this._dir == 1 ? -2 : 2;
			p.targetZ = p.currentZ = p.layerIndex * params.layerDistance;
			p.alpha = p.targetAlpha = 0;
		}
	};


	p.search = function(index, state) {
		if(this._isLocked) return;
		this._isLocked = true;
		this._isTyping = false;
		this._state = state;
		ParticleController = breelNS.getNamespace(breelNS.projectName+".page.landing").ParticleController;
		this._ringIndex = index;

		for ( var i=0; i<this.particles.length; i++) {
			var p = this.particles[i];
			p.isDying = true;
		}

		console.debug( "Search : ", index );
		siteManager.model.searchForAgencyIndexRange(index, this, this._addSearchParticles);		
	};


	p._addSearchParticles = function(data) {
		var connectDots    = [];
		for(var i=0; i<data.length; i++) {
			var p            = new Particle().init();
			p.userObject     = data[i];
			p.colorIndex     = data[i].songGenresID;
			p.color          = siteManager.settings.colors[p.colorIndex];
			p.hasConnections = data[i].hasConnections;
			p.agency         = data[i].agencyIndex;

			p.searchType(ParticleController.STATES[this._state].type, this._ringIndex, siteManager.model.numAgencies, 5);
			this.particles.push(p);
			if(p.hasConnections) {
				p.numConnectDots = 1 + Math.floor(Math.random() * params.maxConnections);
				p.particleIndex = i;
				connectDots.push(p);
			}
		}
		for(var i=0; i<connectDots.length; i++)   connectDots[i].initConnectDots(this.particles);

		var hasOnCompleteCall = false;
		for ( var i=0; i<this.particles.length; i++) {
			var p = this.particles[i];
			var delay = p.layerIndex+2;

			if(p.isDying) {	
				p.targetAlpha = p.alpha = 1;
				var tween = new TWEEN.Tween(this.particles[i]).delay(delay*200).to({"ringOffset":-5 * params.layerDistance, "targetAlpha":0, "alpha":0}, 1500).easing(TWEEN.Easing.Cubic.InOut).start();
			} else {
				p.targetAlpha = p.alpha = 0;
				if(p.layerIndex == 5 && !hasOnCompleteCall) {
					var that = this;
					hasOnCompleteCall = true;
					var tween = new TWEEN.Tween(this.particles[i]).delay(delay*200).to({"ringOffset":-5 * params.layerDistance, "targetAlpha":1, "alpha":1}, 1500).easing(TWEEN.Easing.Cubic.InOut).start().onComplete(function(){that._onSearchComplete();});	
				} else {
					var tween = new TWEEN.Tween(this.particles[i]).delay(delay*200).to({"ringOffset":-5 * params.layerDistance, "targetAlpha":1, "alpha":1}, 1500).easing(TWEEN.Easing.Cubic.InOut).start();		
				}
				
			}
			
		}
	};


	p._onSearchComplete = function(e) {
		siteManager.scheduler.delay(this, this._delayResetLayerIndex, [], 500);
	};


	p._delayResetLayerIndex = function() {
		var hasDispatchCompleteEvent = false;
		for ( var i=0; i<this.particles.length; i++) {
			var p = this.particles[i];
			p.resetLayerIndex();

			if(p.layerIndex != 0) {
				if(!hasDispatchCompleteEvent) {
					var that = this;
					var tween = new TWEEN.Tween(p).to({"layerRange":500, "alpha":0, "targetAlpha":0}, 400).easing(TWEEN.Easing.Cubic.InOut).start().onComplete(function(){ that._searchAnimationOver(); });
					hasDispatchCompleteEvent = true;
				} else {
					var tween = new TWEEN.Tween(p).to({"layerRange":500, "alpha":0, "targetAlpha":0}, 500).easing(TWEEN.Easing.Cubic.InOut).start();	
				}
				
			}
			
		}
		this._isLocked = false;
	};

	p._searchAnimationOver = function() {
		//	WHEN SEARCH ANIMATION IS OVER, RESET CAMERA POSITION AND PARTICLE POSITIONS
		//	UNLOCK THE INTERACTION]
		this.dispatchCustomEvent(RingController.ON_SEARCH_ANIM_OVER);
	};


	p.typing = function() {
		if(this._isTyping) return;
		this._isTyping = true;
		for ( var i=0; i<this.particles.length; i++) {
			var p = this.particles[i];

			if(p.layerIndex != 0) {
				var tween = new TWEEN.Tween(p).to({"layerRange":0, "alpha":1, "targetAlpha":1}, 500).easing(TWEEN.Easing.Cubic.Out).start();	
			}
			
		}
	};


	p.getCurrentIndex = function() {
		return this._ringIndex;
	};


	p.getData = function(index) {
		// backend calls happen here	
	};
});