// CenterParticle.js

breelNS.defineClass(breelNS.projectName+".canvas.particles.ProfileParticle", breelNS.projectName+".canvas.particles.DomParticle", function(p, s, ProfileParticle) {
	var AnimationManager = breelNS.getNamespace("generic.animation").AnimationManager;
	var MathUtils = breelNS.getNamespace("generic.math").MathUtils;

	var random = function(a, b) { return a + Math.random() * ( b - a); }
	var siteManager;

	ProfileParticle.ON_CLICK = 'centerParticleOnClick';
	ProfileParticle.ON_REMOVE = 'centerParticleOnRemove';
	ProfileParticle.TRIGGER_NEW = 'profileParticleTriggerNew';

	p.init = function(parent, params) {

		siteManager = breelNS.getNamespace(breelNS.projectName).singletons.siteManager;
		s.init.call(this, parent, params);

		this.acc        = params.profileAcceleration;
		this._rad = 70/2;
		
		
		this.gravityChildren = [];
		
		
		this.type = 'profile';
		this.endAnimationDuration = this.params.profileParticleEndAnimationDuration;
		this.parentDims = {h:parent.clientHeight, w: parent.clientWidth};
		this.deactivatePullTimer = null;


		this.onResize(this.parentDims, params);

		
		
		return this;
	};

	p.setRadianDistance = function(rad){
		this.totalRadianDistance =  -rad;
		console.log('totalradiandistance: ',this.totalRadianDistance);
		this.startRotateRadian = rad;
	};


	p.addGravityChild = function(p){
		this.gravityChildren.push(p);
	};

	

	p._onClick = function(e){

		e.preventDefault();

		this.dispatchCustomEvent(ProfileParticle.ON_CLICK, {data: this._data});
	};



	p.activatePullOnGravityChildren = function(){

		for (var i=0;i<this.gravityChildren.length;i++){
			console.log('activate pull');
			this.gravityChildren[i].setPullMode(true);
		}

		this.childrenInPullMode = true;
	};

	p.deactivatePullOnGravityChildren = function(){

		for (var i=0;i<this.gravityChildren.length;i++){
			console.log('deactivate pull');
			this.gravityChildren[i].setPullMode(false);
		}

		this.childrenInPullMode = false;
	};

	p.setData = function(data){
		this._data = data;

	if(data) {
		if(data)
			this.innerEl.style.backgroundImage = 'url('+data.loaded.profile.src+')';
		else
			this.innerEl.style.backgroundImage = 'url(/desktop/files/images/1x/common/profile_noimage.png)';

		this.profileName.innerHTML = data.firstName;


		var agency = data.agency;
		if(agency.length < 1) agency = 'SPEAKER';
		this.lowDetail.innerHTML = agency;
	}

	};

	p.getData = function() { return this._data; };



	






	p.render = function() {

		this.currentRotateRadian = 0;
		var ease = 0.2;
		var oEase = 0.2;
		var easingOut = .2;
		var introEasing = .2;
		var maxHoverSizeAdd = .2;
		
		var targetO = 1;
		var targetScale = 1;
		var innerTargetS = 0;

		if(this.startAnimation){
			targetScale = 1;
			targetO = 1;
			ease = introEasing;
			if (this.scale >= (1 - 0.01)){
				this.startAnimation = false;
				this.positionDetailEl();
			}
		}else if (this.endAnimation){
			targetScale = 0;
			targetO = 0;
			ease = easingOut;
			if (this.scale < .4 && !this.triggered){
				// this.endAnimation = false;
				this.dispatchCustomEvent(ProfileParticle.TRIGGER_NEW);
				this.triggered = true;
			}
			if (this.scale <= 0.1){
				this.dispatchCustomEvent(ProfileParticle.ON_REMOVE);
				this.endAnimation = false;
				this.el.style.display = 'none';
			}

		}

		if (this._inHoverMode){
			oEase = .2;
			innerTargetS = maxHoverSizeAdd;
		}else{
			oEase = .5;
			innerTargetS = 0;
		}

		var targetOpacity = innerTargetS/maxHoverSizeAdd;
		this.infoOpacity += (targetOpacity-this.infoOpacity) *oEase;
		this.innerScale += ((1 + innerTargetS) - this.innerScale) * oEase;

		this.scale += ((targetScale) - this.scale) * ease;
		this.opacity += (targetO - this.opacity) * ease;


		s.render.call(this)

	};

	p.onResize = function(dims){
		this.size = Math.round(dims.w * this.params.profileParticleMultiplier);
		if (this.size < this.params.profileMinWidth/2)
			this.size = this.params.profileMinWidth/2;

		this.el.style.width = this.el.style.height = this.size*2 + 'px';
		this.el.style.left = (dims.w * .5) - this.size + 'px';
		this.el.style.top = (dims.h * .5) - this.size - this.params.topAdjust + 'px';
		this.parentDims = {h:this.parent.clientHeight, w: this.parent.clientWidth};
		this.positionDetailEl();

	};

});
