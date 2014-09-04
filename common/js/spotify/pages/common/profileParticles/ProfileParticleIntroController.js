// ProfileParticleIntroController.js

breelNS.defineClass(breelNS.projectName+".page.landing.ProfileParticleIntroController", "generic.events.EventDispatcher", function(p, s, ProfileParticleIntroController) {
	var getRandomElem = function(ary) {return ary[Math.floor(Math.random() * ary.length)]}
	var random        = function(a, b) { return a + Math.random() * (b-a); }
	var siteManager;

	ProfileParticleIntroController.ENDED = "profileParticlesIntroEnded";

	p.init = function(params) {
		siteManager             = breelNS.getNamespace(breelNS.projectName).singletons.siteManager;

		// s.init.call(this, container);
		this.parent = parent;
		this.params = params;

		this.animateObjects = [];

		this.startAngle = params.intro.startAngle;
		this.startScale = params.intro.startScale;
		this.endScale = params.intro.endScale;

		this.topAdjust = params.topAdjust;
		this.size = undefined;

		this.copyMargin = params.intro.copyMargin;
		this.copyWrapper = null;
		this.albumCopyWrapper = null;
		this.profileCopyWrapper = null;
		this.locationCopyWrapper = null;
		this.locationCopyStrEl = null;


		this.particle = null;

		this._tweens = [];

		this.data = null;

		return this;
	};

	p.start = function(particle, data, container) {
		this.data = data;
		this.particle = particle;

		this._container = container;

		this.createCopyWrapper();
		this.onResize();

		this.animateToMiddle();

	};

	p.animateToMiddle = function(){




		var startY = -1000;

		this.particle.y = startY;

		var animateVals = {value: 0};
		var duration = 1000;


		var starty = -1000;
		
		//var heightDistance = 0;//(windowHeight * .5) - this.particle.size - this.params.topAdjust;
		var angle = scale = 0;
		var angleDistance = this.startAngle;
		var scaleDistance = this.endScale - this.startScale;

		var tween = new TWEEN.Tween(this.particle).to({y:0},duration).easing(TWEEN.Easing.Exponential.Out);


		CSSanimate.to(this.albumCopyWrapper, {
			opacity: 1
		}, {
			duration: duration*.8,
			ease: 'easeOutSine',
			delay: duration*.2
		}, function(){
		}.bind(this));

		tween.start();
		tween.onComplete(this.onImageLanded.bind(this));

		this._tweens.push(tween);
	};


	p.createCopyWrapper = function(){

		data = this.data;

		var copyWrapper = document.createElement('div');
		copyWrapper.className = 'introCopyWrapper';

		var albumCopyWrapper = document.createElement('div');
		albumCopyWrapper.className = 'introAlbumCopyWrapper';

		var artist = document.createElement('h4');
		artist.className = 'artistTitle';
		artist.innerHTML = data.artistName;

		var songTitle = document.createElement('h5');
		songTitle.className = 'songTitle';
		songTitle.innerHTML = data.songTitle;

		albumCopyWrapper.appendChild(artist);
		albumCopyWrapper.appendChild(songTitle);


		var profileCopyWrapper = document.createElement('div');
		profileCopyWrapper.className = 'introProfileCopyWrapper';

		var name = document.createElement('h3');
		name.className = 'profileName';
		name.innerHTML = data.firstName +' '+ data.lastName;

		var agencyTitle = document.createElement('h4');
		agencyTitle.className = 'agencyTitle';
		agencyTitle.innerHTML = data.agency;

		

		

		if(data.country.length){

			var locationHolder = document.createElement('div');
			locationHolder.className = 'locationHolder';

			var locationIcon = document.createElement('div');
			locationIcon.className = 'locationIcon';

			var location = document.createElement('h5');
			location.className = 'location';
			location.innerHTML = data.country;
			this.locationCopyStrEl = location;

			

			locationHolder.appendChild(locationIcon);
			locationHolder.appendChild(location);

			this.locationCopyWrapper = locationHolder;

		}
		
		

		profileCopyWrapper.appendChild(name);
		profileCopyWrapper.appendChild(agencyTitle);
		if(locationHolder)profileCopyWrapper.appendChild(locationHolder);

		copyWrapper.appendChild(profileCopyWrapper);
		copyWrapper.appendChild(albumCopyWrapper);
		this._container.appendChild(copyWrapper);

		this.profileCopyWrapper = profileCopyWrapper;
		this.albumCopyWrapper = albumCopyWrapper;
		this.copyWrapper = copyWrapper;



	};


	p.onImageLanded = function(){




		CSSanimate.to(this.particle.albumEl, {
			transform: CSS.to3DString('rotate', 0, 180, 0)
		}, {
			duration: 400,
			ease: 'easeInOutSine',
			delay: 0
		}, function(){
		}.bind(this));

		CSS.set(this.particle.visibleContainer, {opacity: 0, transform: CSS.to3DString('rotate', 0, 180, 0)});

		CSSanimate.to(this.particle.visibleContainer, {
			opacity: 1,
			transform: CSS.to3DString('rotate', 0, 0, 0)
		}, {
			duration: 400,
			ease: 'easeInOutSine',
			delay: 0
		}, function(){
		}.bind(this));


		CSSanimate.to(this.profileCopyWrapper, {
			opacity: 1
		}, {
			duration: 400,
			ease: 'easeInOutSine',
			delay: 0
		}, function(){
		}.bind(this));

		CSSanimate.to(this.albumCopyWrapper, {
			opacity: 0
		}, {
			duration: 400,
			ease: 'easeOutSine',
			delay: 0
		}, function(){
		}.bind(this));

		setTimeout(this.removeCopy.bind(this), 1500)
		

		//this._animate(this.particle.albumEl, this.particle.visibleContainer, this.profileCopyWrapper, this.albumCopyWrapper, 1000);
		//
	};

	p._animate = function(hideEl, showEl, copyShow, copyHide, delay){

		// this.removeAllTweens();

		var animateVals = {value: 0};
		var duration = 1000;
		
		var self = this;
		var tween = new TWEEN.Tween(animateVals).to({value:1},duration).easing(TWEEN.Easing.Exponential.Out).delay(delay).onUpdate(function(){

			showEl.style.opacity = this.value;
			hideEl.style.opacity = 1 - this.value;

			copyShow.style.opacity = this.value;
			copyHide.style.opacity = 1 - this.value;


		});
		tween.start();
		tween.onComplete(function(){

			hideEl.style.display = 'none';

		});

		this._tweens.push(tween);
	};

	p.removeCopy = function(delay){

		CSSanimate.to(this.copyWrapper, {
			opacity: 0
		}, {
			duration: 400,
			ease: 'easeOutSine',
			delay: 0
		}, function(){
			
			this.dispatchCustomEvent(ProfileParticleIntroController.ENDED, {particle: this.particle});
		}.bind(this));

		

	};

	p.removeAll = function(delay){

		var animateVals = {value: 0};
		var duration = 3000;

		var self = this;
		var tween = new TWEEN.Tween(animateVals).to({value:1},duration).easing(TWEEN.Easing.Exponential.Out).delay(delay).onUpdate(function(){
			self._container.style.opacity = 1 - this.value;
		});
		tween.start();
		tween.onComplete(function(){
			self.destroy();
			// self.destroy();
		});

		this._tweens.push(tween);



	};






	p.destroy = function(){
		this.removeAllTweens();
		this._container.removeChild(this.copyWrapper);
	};

	p.onResize = function(){

		this.size = (window.innerWidth * this.params.centerParticleMultiplier)*2;

		this.copyWrapper.style.marginTop = - 30 + (this.size/2)+this.params.centerAlbumAdjust/2 + this.params.intro.copyMargin + 'px';

		if(this.locationCopyWrapper)this.locationCopyWrapper.style.marginLeft = -(this.locationCopyStrEl.clientWidth/2 + 10) + 'px';

	};

	p.removeAllTweens = function(){

		for (var i=0;i<this._tweens.length;i++){
			if (this._tweens[i] !== null)
				this._tweens[i].stop();
		}
	};




});
