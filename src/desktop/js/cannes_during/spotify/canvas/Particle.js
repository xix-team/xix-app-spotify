// Particle.js

breelNS.defineClass(breelNS.projectName+".canvas.Particle", "generic.events.EventDispatcher", function(p, s, Particle) {
	var random = function(a, b) { return a + Math.random() * ( b - a); }
	var MathUtils 	= breelNS.getNamespace("generic.math").MathUtils;
	var siteManager, params;
	var minDist = 15000;


	Particle.DATA_TYPE_COUNTRY    = "country";
	Particle.DATA_TYPE_GENRES     = "colorIndex";
	Particle.DATA_TYPE_AGENCY     = "agency";
	Particle.DATA_TYPE_SPEAKER    = "speaker";
	Particle.DATA_TYPE_PROFESSION = "profession";

	p.init = function(skipAnim) {
		siteManager 	  = breelNS.getNamespace(breelNS.projectName).singletons.siteManager;
		colors		      = siteManager.settings.colors;
		params			  = siteManager.settings.params;
		this.x            = 0;
		this.y            = 0;
		this.targetZ      = random(-params.zRange, params.zRange);
		this.z            = random(-params.zRange, params.zRange);
		this.randomZ      = this.z;
		this.currentZ     = this.z;
		this.xOffset = this.yOffset = this.zOffset = 0;
		this.vx	= this.vy = this.vz = 0;
		this.ax = this.ay = this.az = 0;

		this.ringOffset   = 0;

		this.alpha        = 0;
		this.targetAlpha  = 1.0;

		this.speedValue     = random(.01, .05);
		this.targetSpeed  = 1;
		this.rotSpeed     = this.speedValue;
		this.theta        = random(0, Math.PI * 2);		
		this.radius       = params.maxRadius* random(1, 2);
		this.thetaOffset  = 0;
		this.targetThetaOffset = 0;
		this.targetRadius = random(params.minRadius, params.maxRadius);
		this.baseRadius   = this.targetRadius;
		this.easing       = random(.04, .03);
		this.size         = random(params.baseSize, params.baseSize+params.sizeDifference);
		this.offsetScale 	= 0;

		this.speedOffset  = 1.0 + (1.0 - this.targetRadius / params.ratationRadius) * params.speedDifference;
		this.colorIndex   = Math.floor(Math.random() * colors.length);
		this.color        = colors[this.colorIndex];
		this.scale		  = 1;
		this.isGlobeParticle = false;
		this.isDying	  = false;
		this.scaleInDepth = 1.0;
		this.layerIndex   = 0;
		this.layerRange   = 0;

		this.numConnectDots = 0;
		this.connectDots 	= [];

		if(skipAnim) {
			this.radius = this.baseRadius*.75;
		}

		//	DATA
		this.country     	= Math.floor(random(0, 10));
		this.agency      	= Math.floor(random(0, 10));
		this.speaker     	= Math.floor(random(0, 10));
		this.profession 	= Math.floor(random(0, 10));

 		return this;
	};


	p.searchType = function(type, currentIndex, total, targetPos) {
		targetPos = targetPos == undefined ? 0 : targetPos;
		if(type == "") {
			this.targetZ = this.randomZ;
			this.targetRadius = this.baseRadius;
		} else {
			this.radius = this.baseRadius;
			
			var index = this[type];

			var offset ;
			if(index == currentIndex) {
				offset = 0;
			} else {
				var d0 = index - currentIndex;
				var d1;
				if(currentIndex > index ) d1 = currentIndex - index - total;
				else d1 = currentIndex - index + total;
				if(Math.abs(d0) < Math.abs(d1)) offset = d0;
				else offset = -d1;
			}

			// if(Math.abs(offset) > 5) console.log( "Search Type : ", index, currentIndex, offset, "::", d0, d1, "-> ", currentIndex, index, total);

			offset += targetPos;
			this.layerIndex = offset;

			this.targetZ = offset * params.layerDistance;
			// this.currentZ = this.targetZ;
		}
		
	};


	p.searchGenre = function(index) {
		this.targetRadius = params.minRadius;
		var offset = this.colorIndex - 4.5;
		this.targetZ = offset * params.layerDistance * .4;
		if(index == -1) this.targetAlpha = 1;
		else this.targetAlpha = index == this.colorIndex ? 1 : 0;
	};

	p.resetGenre = function() {
		this.targetAlpha = 1;
		this.targetZ = this.randomZ;
	};


	p.resetRadius = function() {	this.targetRadius = this.baseRadius;	};


	p.resetLayerIndex = function() {
		if(!this.isDying) {
			this.ringOffset       = 0;
			this.layerIndex       -= 5;	
			this.targetZ          = this.layerIndex * params.layerDistance;
			this.currentZ         = this.targetZ;
		}
	};


	p.update = function(parameters) {
		this.vx += this.ax;
		this.vy += this.ay;
		this.vz += this.az;
		this.xOffset += this.vx;
		this.yOffset += this.vy;
		this.zOffset += this.vz;


		var decrease = params.explosionDecrease;
		this.vx *= decrease;
		this.vy *= decrease;
		this.vz *= decrease;
		this.ax = this.ay = this.az = 0;

		this.xOffset -= this.xOffset * this.easing;
		this.yOffset -= this.yOffset * this.easing;
		this.zOffset -= this.zOffset * this.easing;
	};


	p.initConnectDots = function(particles, min) {
		var _minDist = (min == undefined) ? minDist : min;
		while(this.connectDots.length < this.numConnectDots) {
			var p = particles[Math.floor(Math.random() * particles.length)];
			if( this.distanceTo(p) < _minDist ) {
				this.connectDots.push(p);
			}
		}
	};


	p.updateConnectDots = function(particles) {
		var len = this.connectDots.length;
		while(len--) {
			var p = this.connectDots[len];
			if(this.distanceTo(p) > minDist) this.connectDots.splice(len, 1);
		}


		var index;
		var numTries = 0;
		while(this.connectDots.length < this.numConnectDots) {
			if(numTries++ > 100) {
				// console.log( "Too many tries" );				
				return
			}
			do {
				index = Math.floor(Math.random() * particles.length);
			} while(index == this.particleIndex);

			
			var p = particles[index];
			if( this.distanceTo(p) < minDist ) {
				this.connectDots.push(p);
			}
		}
	};


	p.getTexture = function() {
		return this._canvas;
	};


	p.distanceTo = function(p) {
		return (this.x-p.x)*(this.x-p.x)+(this.y-p.y)*(this.y-p.y)+(this.z-p.z)*(this.z-p.z);
	};


	p.distanceTo3D = function(p) {
		// if(this.finalPos) return this.finalPos[0] - p.finalPos[0]
	};


	p.distanceToPos3D = function(x, y) {
		return Math.sqrt( (this.x-x)*(this.x-x) + (this.y-y)*(this.y-y) );
	}

	p.distanceToPos = function(x, y) {
		var offs = this.size*this.scaleInDepth*.5;

		if(this.finalPos != undefined) return ( (this.finalPos[0]-x+offs)*(this.finalPos[0]-x+offs) + (this.finalPos[1]-y+offs)*(this.finalPos[1]-y+offs) );
		else return ( (this.x-x+offs)*(this.x-x+offs) + (this.y-y+offs)*(this.y-y+offs) );
	}


	p.distanceToPosSqrd = function(x, y) {
		if(this.finalPos != undefined) return Math.sqrt( (this.finalPos[0]-x)*(this.finalPos[0]-x) + (this.finalPos[1]-y)*(this.finalPos[1]-y) );
		else return Math.sqrt( (this.x-x)*(this.x-x) + (this.y-y)*(this.y-y) );
	}

	
});