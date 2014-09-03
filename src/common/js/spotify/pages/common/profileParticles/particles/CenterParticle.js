// CenterParticle.js

breelNS.defineClass(breelNS.projectName+".canvas.particles.CenterParticle", breelNS.projectName+".canvas.particles.DomParticle", function(p, s, CenterParticle) {
	var AnimationManager = breelNS.getNamespace("generic.animation").AnimationManager;

	var random = function(a, b) { return a + Math.random() * ( b - a); }
	var siteManager;

	CenterParticle.ON_CLICK = 'centerParticleOnClick';
	CenterParticle.ON_REMOVE = 'centerParticleOnRemove';


	p.init = function(parent, params, mode) {

		siteManager = breelNS.getNamespace(breelNS.projectName).singletons.siteManager;
		s.init.call(this, parent, params);
		this.acc        = params.profileAcceleration;
		this.gravityChildren = [];
		this.mode = mode;
		this.type = 'center';
		this.endAnimationDuration = this.params.centerParticleEndAnimationDuration;
		this.parentDims = {h:window.innerHeight, w: window.innerWidth};
		this.deactivatePullTimer = null;


		$(this.profileName).addClass('big');
		$(this.lowDetail).addClass('big');

		

		this.onResize(this.parentDims, params);

		

		return this;
	};



	p.createAlbumEl = function(){

		this.albumEl = document.createElement('div');
		this.albumEl.className = 'albumContainer';
		this.el.appendChild(this.albumEl);

		this.albumEl.style.backgroundImage = 'url('+this._data.imgAlbum+')';

		this.onResize(this.parentDims, this.params)

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
		this.dispatchCustomEvent(CenterParticle.ON_CLICK, {data: this._data});
	};

	p.setData = function(data){
		if(data) {
			this._data = data;
			this.innerEl.style.backgroundImage = 'url('+data.loaded.profile.src+')';
			// this.innerEl.style.background = 'yellow';
			this.profileName.innerHTML = data.firstName;

			var agency = data.agency;
			if(agency.length < 1) agency = 'SPEAKER';
			this.lowDetail.innerHTML = agency;

			this.lowDetail.innerHTML = agency;

			/*if(data.country && data.country != "")
				this._locationEl.innerHTML = data.country;
			else
				this._locationHolderEl.style.display = "none";*/
		}
	};



	p.positionDetailEl = function(){
		var sumHeight = this.profileName.clientHeight + this.lowDetail.clientHeight + 4;
		this.detailCopyHolder.style.height = sumHeight + 'px';
		this.detailCopyHolder.style.marginTop = -sumHeight / 2 + 'px';
	};


	p.render = function() {
		
		this.currentRotateRadian = 0;
		var ease = 0.2;
		var easingOut = .2;
		var introEasing = .2;
		var oEase = 0.2;
		var maxHoverSizeAdd = .1;
		var targetScale = 1;
		var targetO = 1;
		var innerTargetS = 0;

		this.offsetScale = 0;

		if(this.startAnimation){
			targetScale = 1;
			targetO = 1;
			ease = introEasing;
			if (this.scale >= (1 - 0.01)){
				this.startAnimation = false;
			}
		}else if (this.endAnimation){
			targetScale = 0.2;
			targetO = 0;
			ease = easingOut;
			if (this.opacity < 0.01){
				this.endAnimation = false;
				this.dispatchCustomEvent(CenterParticle.ON_REMOVE);
			}

		}else if (this.mode == 'intro'){
			this.offsetScale = .2;
			targetScale = 1;
			targetO = 1;
			ease = introEasing;
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
		this.scale += ((targetScale  + this.offsetScale) - this.scale) * ease;
		this.opacity += (targetO - this.opacity) * ease;
		//this.scale += ((this.targetScale + this.offsetScale) - this.scale) * easing;

		s.render.call(this);
	};

	p.onResize = function(dims){


		this.size = Math.round(dims.w * this.params.centerParticleMultiplier);
		if (this.size < this.params.centerMinWidth/2)
			this.size = this.params.centerMinWidth/2;



		if (this.mode == 'intro' && this.albumEl !== null){
			this.albumEl.style.height = this.size*2 + this.params.centerAlbumAdjust + 'px';
			this.albumEl.style.width = this.size*2 + this.params.centerAlbumAdjust + 'px';
			this.albumEl.style.left = - this.params.centerAlbumAdjust/2 + 'px';
			this.albumEl.style.top = - this.params.centerAlbumAdjust/2 + 'px';
		}

		this.el.style.width = this.el.style.height = this.size*2 + 'px';

		this.el.style.left = (dims.w * .5) - this.size + 'px';
		this.el.style.top = (dims.h * .5) - this.size - this.params.topAdjust + 'px';

		
		this.positionDetailEl();

		

	};

});
