// ProfileParticleController.js

breelNS.defineClass(breelNS.projectName+".page.landing.ProfileParticleController", breelNS.projectName+".common.profileParticles.ProfileParticleController", function(p, s, ProfileParticleController) {
	// var random = function(a, b) { return a + Math.random() * ( b - a); }
	// var ProfileParticleRenderer = breelNS.getNamespace(breelNS.projectName + ".common.profileParticles").ProfileParticleRenderer;
	// var DomParticle    		= breelNS.getNamespace(breelNS.projectName + ".common.profileParticles.particles").DomParticle;
	// var CenterParticle    	= breelNS.getNamespace(breelNS.projectName + ".common.profileParticles.particles").CenterParticle;
	// var ProfileParticle    	= breelNS.getNamespace(breelNS.projectName + ".common.profileParticles.particles").ProfileParticle;
	// var ColorParticle    	= breelNS.getNamespace(breelNS.projectName + ".common.profileParticles.particles").ColorParticle;
	//var ProfileParticleIntroController = breelNS.getNamespace(breelNS.projectName + ".page.landing").ProfileParticleIntroController;
	var ProfileParticleIntroController = breelNS.getNamespace(breelNS.projectName + ".page.landing").ProfileParticleIntroController;
	// var ListenerFunctions      = breelNS.getNamespace("generic.events").ListenerFunctions;

	// var siteManager;

	var ProfileParticle    	= breelNS.getNamespace(breelNS.projectName + ".canvas.particles").ProfileParticle;
	var CenterParticle    	= breelNS.getNamespace(breelNS.projectName + ".canvas.particles").CenterParticle;
	

	ProfileParticleController.ON_PROFILE_PARTICLE_CLICK = 'profileParticleControllerOnProfileParticleClick';
	ProfileParticleController.ON_ALL_ZOOMED_OUT = 'profileParticleControllerOnAllZoomedOut';
	ProfileParticleController.ON_ALL_ZOMMED_IN = 'profileParticleControllerOnAllZoomedIn';

	var siteManager;

	p.init = function(el){

		siteManager = breelNS.getNamespace(breelNS.projectName).singletons.siteManager;

		this.params = {};

		this.params.numProfileParticles	 			= 4;
		this.params.numParticlesCenter	 			= 0;
		this.params.numParticlesSmall 				= 0;

		this.params.baseSize						= 5;
		this.params.sizeDifference					= 7;
		this.params.profileParticleMultiplier		= .055*.4;//.018;

		this.params.centerParticleMultiplier		= .055;
		this.params.colorParticleMultiplier			= .002;
		this.params.topAdjust						= 30;
		this.params.centerAlbumAdjust				= -20;
		this.params.profileRadiusAdjust				= 50;
		this.params.startAnimationZoomVisibility	= 0.2;

		this.params.profileMinWidth					= 40;
		this.params.centerMinWidth					= 124;

		this.params.intro = {}
		this.params.intro.copyMargin				= 20;
		this.params.intro.startAngle				= 1.2;
		this.params.intro.startScale				= .6;
		this.params.intro.endScale					= 1.2;

		this.params.colorAcceleration 				= 2;
		this.params.profileAcceleration				= 3;

		this.params.velocityDecreasing 				= .5;

		this.params.colorParticleEndAnimationDuration 	= 50;
		this.params.profileParticleEndAnimationDuration = 50;
		this.params.centerParticleEndAnimationDuration 	= 50;

		s.init.call(this, el);

	};


	p.startIntro = function(){

		this.initModeReady = false;


		this.introController = new ProfileParticleIntroController();
		this.introController.init(this.params);

		this.introController.addEventListener(ProfileParticleIntroController.ENDED, this._onProfileIntroEndedBound);

		var p = this.createCenterParticle(false, 'intro');
		p.offsetScale = 0.3;

		p.createAlbumEl();
		p.el.style.opacity = 1;
		p.albumEl.style.opacity = 1;
		p.detailEl.style.opacity = 0;
		p.visibleContainer.style.opacity = 0;

		this.show();
		this.introController.start(p, this._currentData[0], this.el);

	};

	p._onProfileIntroEnded = function(e){


		var particle = e.detail.particle;

		//this.startAnimation(false, particle);
		particle.startAnimation = false;
		particle.endAnimation = false;
		particle.offsetScale = 0;
		particle.mode = 'default';

		this._particleAnimationsInProgress = true;
		this.createProfileParticles();

		var self = this;
		setTimeout(function(){
			self.introController.destroy();
			self.initModeReady = false;
			self._initMode = false;
			self._mainMode = true;
		},3000);

	};


	p.startAnimation = function(createCenterParticle, particle){
		this._particleAnimationsInProgress = true;
		//this._renderer.removeAll();

		if (createCenterParticle)
			this.createCenterParticle(true, 'normal');

		if (particle !== undefined){
			particle.startAnimation = false;
			particle.endAnimation = false;
			this._renderer.addProfileChild(particle);
		}

		this.createProfileParticles();

	};

	p.createCenterParticle = function(addToRenderer, mode){

		var p = new CenterParticle().init(this.el,this.params,mode);
		p.setIndex(0);

		p.addEventListener(CenterParticle.ON_CLICK, this._onProfileParticleClickBound);
		p.addEventListener(CenterParticle.ON_REMOVE, this._onProfileParticleAnimationEndBound);
		p.isLocked = true;
		p.hoverAdjust = 0;
		p.isCenterProfile = true;
		p.setData(this._currentData[0]);
		p.visibleContainer.style.opacity = 1;
		p.setRadianDistance(0);
		if (mode != 'intro'){
			p.createColorOverlay();
			
		}

		this._renderer.addProfileChild(p);

		p.offset.y = -100*this._scale;

		return p;

	};

	p.createProfileParticles = function(){

		var self = this;

		for(i=0; i<this.params.numProfileParticles; i++) {


			var delay = 50 * (i+1);
			setTimeout(function(){
				self._addProfileParticle(0);

				if (i == self.params.numProfileParticles){
					self._particleAnimationsInProgress = false;


					// if (self._renderer.profileParticles[self._renderer.profileParticles.length-1].mode == 'intro'){
					// 	self._renderer.profileParticles[self._renderer.profileParticles.length-1].detailEl.style.opacity = 1;
					// }
				}

			},delay);
		}

		if (this.params.numProfileParticles == 0){
			this._particleAnimationsInProgress = false;
		}

		setTimeout(function(){

			self.dispatchCustomEvent(ProfileParticleController.ON_ALL_ZOOMED_IN);
		},200*(this.params.numProfileParticles+1));



	};


	p._addProfileParticle = function(e){


		var p = new ProfileParticle().init(this.el, this.params);
		p.setIndex(e);

		p.setData(this._currentData[this._renderer.profileParticles.length]);
		p.positionDetailEl();
		p.setPullMode(false);
		// p.pullMode = true;
		p.addEventListener(ProfileParticle.ON_CLICK, this._onProfileParticleClickBound);
		p.addEventListener(ProfileParticle.ON_REMOVE, this._onProfileParticleAnimationEndBound);
		p.addEventListener(ProfileParticle.TRIGGER_NEW, this._onProfileParticleTriggerNewBound);
		p.setGravityPoint(this._renderer.profileParticles[this._renderer.profileParticles.length-1]);

		p.offset.y = -100*this._scale;

		var width = this.el.clientWidth;
		var height = this.el.clientHeight;
		var initRadian = this.params.startRadianPos[this._renderer.profileParticles.length-1];
		var centerPoint = p.getCenterPoint();

		var pos = this.getInitPos({w:width-(p.size*2), h:height-(p.size*2)}, this.params.initProfileRadius, initRadian*Math.PI);
		p.x = pos.x - centerPoint.x;
		p.y = pos.y - centerPoint.y;

		p.isLocked = true;
		p.radianPos = initRadian;


		p.createColorOverlay();

		this._renderer.addProfileChild(p);

	};

	p.onResize = function(w,h, changePullMode){
		this._scale = h/siteManager.model.baseHeight;

		this.el.style.height = h  + 'px';
		this.el.style.width = w + 'px';
		this.params.initProfileRadius = (w * this.params.centerParticleMultiplier) + this.params.profileRadiusAdjust;
		this.params.initColorRadius = h/4;
		var mergedArray = this._renderer.particles;
		for (var i=0;i<mergedArray.length;i++){
			mergedArray[i].onResize({w:w, h: h}, this.params, changePullMode);

				var p = mergedArray[i];
				var centerPoint = p.getCenterPoint();

				p.offset.y = -100*this._scale;

				if (mergedArray[i].type == 'profile'){
					var pos = this.getInitPos({w:w-(p.size*2), h:h-(p.size*2)}, this.params.initProfileRadius, p.radianPos*Math.PI);
					p.x = pos.x - centerPoint.x;
					p.y = pos.y - centerPoint.y;
				}else{
					p.x = 0;
					p.y = 0;
				}

		}


	};



});
