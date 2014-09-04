// ProfileParticleController.js

breelNS.defineClass(breelNS.projectName+".common.profileParticles.ProfileParticleController", "generic.events.EventDispatcher", function(p, s, ProfileParticleController) {
	var random = function(a, b) { return a + Math.random() * ( b - a); }
	var ProfileParticleRenderer = breelNS.getNamespace(breelNS.projectName + ".common.profileParticles").ProfileParticleRenderer;
	var CenterParticle    	= breelNS.getNamespace(breelNS.projectName + ".common.profileParticles.particles").CenterParticle;
	var ProfileParticle    	= breelNS.getNamespace(breelNS.projectName + ".common.profileParticles.particles").ProfileParticle;
	var ColorParticle    	= breelNS.getNamespace(breelNS.projectName + ".common.profileParticles.particles").ColorParticle;
	var ProfileParticleIntroController = breelNS.getNamespace(breelNS.projectName + ".common.profileParticles").ProfileParticleIntroController;
	var ListenerFunctions      = breelNS.getNamespace("generic.events").ListenerFunctions;

	var siteManager;

	ProfileParticleController.ON_PROFILE_PARTICLE_CLICK = 'profileParticleControllerOnProfileParticleClick';
	ProfileParticleController.ON_ALL_ZOOMED_OUT = 'profileParticleControllerOnAllZoomedOut';
	ProfileParticleController.ON_ALL_ZOMMED_IN = 'profileParticleControllerOnAllZoomedIn';


	p.init = function(el){

		siteManager = breelNS.getNamespace(breelNS.projectName).singletons.siteManager;

		this.el = el;

	
		this._renderer = new ProfileParticleRenderer();
		this._renderer.init(siteManager.scheduler);

		this.params.startRadianPos = [0.2, 0.4, 0.6, .8, 1.4];


		this._initMode = true;
		this.initModeReady = false;
		this._mainMode = false;
		this.mainModeReady = false;

		this._endCounter = 0;
		this._triggerCounter = 0;

		this._particleAnimationsInProgress = false;

		this.getRandomProfiles();
		this.showNewOnParticleRemove = true;

		this._onProfileParticleClickBound = ListenerFunctions.createListenerFunction(this, this._onProfileParticleClick);
		this._onProfileParticleAnimationEndBound = ListenerFunctions.createListenerFunction(this, this._onProfileParticleAnimationEnd);
		this._onProfileParticleTriggerNewBound = ListenerFunctions.createListenerFunction(this, this._onProfileParticleTriggerNew);
		this._onProfileIntroEndedBound = ListenerFunctions.createListenerFunction(this, this._onProfileIntroEnded);


		this.onResize(window.innerWidth, window.innerHeight, false);

	};

	p.checkStatus = function(){

		if (this.currentDataLoaded){
			if (this._initMode && this.initModeReady)
				this.startIntro();
			else if (this._mainMode && this.mainModeReady)
				this.startAnimation(true, undefined);

		}

	};

	p.showIntro = function(){

		this.initMode = true;
		this.initModeReady = true;
		this.checkStatus();
	};

	p.startIntro = function(){

		this.initModeReady = false;


		this.introController = new ProfileParticleIntroController();
		this.introController.init(this.params);

		this.introController.addEventListener(ProfileParticleIntroController.ENDED, this._onProfileIntroEndedBound);

		var p = this.createCenterParticle(false, 'intro');
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

		this.startAnimation(false, particle);
		var self = this;
		setTimeout(function(){

			// self.introController.removeAll(0);
			self.introController.destroy();
			// self.introController = null;
			self.initModeReady = false;
			self._initMode = false;
			self._mainMode = true;
		},3000);


	};

	p._onProfileParticleClick = function(e){

		var data = e.detail.data;

		this.dispatchCustomEvent(ProfileParticleController.ON_PROFILE_PARTICLE_CLICK, data);

	};

	p._onProfileParticleTriggerNew = function(){

		this._triggerCounter++;
		if (this._triggerCounter < this._renderer.profileParticles.length){
			this._renderer.profileParticles[this._triggerCounter].endAnimation = true;
		}

	};

	p._onProfileParticleAnimationEnd = function(){

		this._endCounter++;
		if (this._endCounter == this._renderer.profileParticles.length){
			console.log(' new animation !');
			this.dispatchCustomEvent(ProfileParticleController.ON_ALL_ZOOMED_OUT);
			this._renderer.removeAll();
			this._endCounter = 0;
			this._triggerCounter = 0;
			if (!this.showNewOnParticleRemove){
				this.hide();
				return;
			}

			var self = this;
			setTimeout(function(){

				if (self._mainMode)
					self.mainModeReady = true;
				else if (self._initMode) {
					self.initModeReady = true;
				}
					

				self.checkStatus();
			},1000);
		}

	};

	p.show = function(){

		this.el.style.display = 'block';
	};

	p.hide = function(){


		this.el.style.display = 'none';
	};

	p.startAnimation = function(createCenterParticle, particle){


		this._particleAnimationsInProgress = true;

		this._renderer.removeAll();
		if (createCenterParticle)
			this.createCenterParticle(true, 'normal');

		if (particle !== undefined){
			particle.startAnimation = false;
			particle.endAnimation = false;
			this._renderer.addProfileChild(particle);
		}

		this.createProfileParticles();

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

	p._addColorParticle = function(e){

		var p = new ColorParticle().init(this.el, this.params);
		p.setPullMode(true);
		var gravityPoint = this._renderer.profileParticles[e];
		p.setGravityPoint(gravityPoint);
		gravityPoint.addGravityChild(p);

		var width = this.el.clientWidth;
		var height = this.el.clientHeight;
		var initRadian = this._renderer.profileParticles[e].startRotateRadian + random(-0.3, 0.3);
		if (gravityPoint.type == 'center')
			initRadian = this.params.startRadianPos[Math.floor(random(0,4))]  + random(-0.3, 0.3);

		var centerPoint = p.getCenterPoint();

		var pos = this.getInitPos({w:width, h:height}, this.params.initColorRadius, initRadian*Math.PI);
		p.x = pos.x - centerPoint.x;
		p.y = pos.y - centerPoint.y;

		this._renderer.addColorChild(p);

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
			this._renderer.addProfileChild(p);
		}

		return p;

	};

	p.createProfileParticles = function(){

		var self = this;

		for(i=0; i<this.params.numProfileParticles; i++) {


			var delay = 200 * (i+1);
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

	p.createColorParticles = function(){

		for (var i=0;i<this._renderer.profileParticles.length-1;i++){

			for (var j=0;j<this.params.numParticlesSmall;j++){
				this._addColorParticle(i);
			}
		}

		for (var i=0;i<this.params.numParticlesCenter;i++){
			// console.log(this._renderer.profileParticles[this._renderer.profileParticles.length-1].size);
			this._addColorParticle(this._renderer.profileParticles.length-1);
		}

	};


	p.removeParticlesAndShowNew = function(clickedParticle){

		if(clickedParticle === undefined) {
			
			var allusers = siteManager.model.allUsers;
			clickedParticle = allusers[Math.floor(Math.random() * allusers.length)];
		}

		this.mainModeReady = false;
		this.showNewOnParticleRemove = true;

		var delay = 0;

		var data = [];
		for(var i=0; i<this._renderer.profileParticles.length; i++) {
			var o = this._renderer.profileParticles[i]._data;
			if(this._renderer.profileParticles[i].isCenterProfile) data.push(o);
		}

		var particle = this._renderer.profileParticles[this._endCounter];


		if (particle){
			particle.endAnimation = true;
		}else{
			this.mainModeReady = true;
			this.show();
			delay = 2200;
		}


		// if (clickedParticle !== undefined)
		var that = this;
		setTimeout(function(){
			that.getProfilesWithId(clickedParticle);
		}, delay);

		return data;


		//	LOOPING DISPLAY RANDOM PARTICLES WHEN IN IDLE STATE
		// else
			// this.getRandomProfiles();


	};

	p.removeParticles = function(){

		this.showNewOnParticleRemove = false;

		this.mainModeReady = false;

		var particle = this._renderer.profileParticles[this._endCounter];
		if (!particle) return;
		particle.endAnimation = true;
	};



	p.getInitPos = function(dim, radius, theta){

		var obj = {};

		obj.x = dim.w/2 + radius * Math.cos(theta);
		obj.y = dim.h/2 + radius * Math.sin(theta);



		return obj;

	};

	p.getRandomProfiles = function(){
		var allusers = siteManager.model.allUsers;
		if(allusers.length == 0) {
			siteManager.scheduler.next(this, this.getRandomProfiles, []);
			return;
		}
		if(allusers ) {
			var user = allusers[Math.floor(Math.random() * allusers.length)];
			this._currentData = [];
			siteManager.model.getMatchUsers(this, this.onDataBackendResp, user.userID)
		} else {
			var fakeBackendResp = siteManager.dummyData.getUserData();
			this.onDataBackendResp(fakeBackendResp);
		}
	};


	p.getProfilesWithId = function(particle) {
		this._currentData = [];
		siteManager.model.getMatchUsers(this, this.onDataBackendResp, particle.userID)
	};

	p.onDataBackendResp = function(resp){
		this._currentData = resp.slice();
		this._currentLoadIndex = 0;
		this._currentUserLoadIndex = 0;
		this._loadUserData();


	};

	p._loadUserData = function(){

		// console.log('current load index loaduserdata(): ', this._currentLoadIndex);

		this.currentDataLoaded = false;

		if (this._currentLoadIndex == this._currentData.length){
			this._onCurrentDataLoaded();
			return;
		}
		if (this._currentUserLoadIndex == 0){
			this._currentData[this._currentLoadIndex].loaded = {};
			this._currentData[this._currentLoadIndex].loaded.profile = null;
			this._currentData[this._currentLoadIndex].loaded.album = null;

			var profileImg;

			if(this._currentData[this._currentLoadIndex].mediumImg)
				profileImg = this._currentData[this._currentLoadIndex].mediumImg;
			else
				profileImg = "/desktop/files/images/1x/common/profile_noimage.png";

			this.loadImage(profileImg, 'profile');

		}else if (this._currentUserLoadIndex == 1) {

			console.log("DO ALBUM ALREADY")
			//this.loadImage(this._currentData[this._currentLoadIndex].imgAlbum, 'album');
		}

	};

	p.loadImage = function(url, attr){

		var img = new Image();
		var self = this;
		img.onload = function(){

			self._currentData[self._currentLoadIndex].loaded[attr] = img;
			self._currentUserLoadIndex++;
			if (self._currentUserLoadIndex == 1){
				self._currentLoadIndex++;
				self._currentUserLoadIndex = 0;

				// console.log('current load index loadimage(): ', self._currentLoadIndex);
			}
			self._loadUserData();

		};


		img.onerror = function() {
				console.log('failed to load img: ' + url)

				self.loadImage('/desktop/files/images/1x/common/profile_noimage.png', attr);


		}

		img.src = url;

	};

	p._onCurrentDataLoaded = function(){

		console.log('on data loaded !');

		this.currentDataLoaded = true;
		this.checkStatus();

	};


	p.onResize = function(w,h, changePullMode){

		this.el.style.height = h  + 'px';
		this.el.style.width = w + 'px';

		this.params.initProfileRadius = (w * this.params.centerParticleMultiplier) + this.params.profileRadiusAdjust;
		this.params.initColorRadius = h/4;

		var mergedArray = this._renderer.particles;
		for (var i=0;i<mergedArray.length;i++){
			mergedArray[i].onResize({w:w, h: h}, this.params, changePullMode);

			if (mergedArray[i].type == 'profile'){
				var p = mergedArray[i];
				var centerPoint = p.getCenterPoint();
				var pos = this.getInitPos({w:w-(p.size*2), h:h-(p.size*2)}, this.params.initProfileRadius, p.radianPos*Math.PI);
				p.x = pos.x - centerPoint.x;
				p.y = pos.y - centerPoint.y;
			}

		}


	};


});
