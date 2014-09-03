

breelNS.defineClass(breelNS.projectName+".page.landing.expandedProfile.ExpandedProfileStartView", breelNS.projectName+".common.profileParticles.expandedProfile.ExpandedProfileStartView", function(p, s, ExpandedProfileStartView) {
	var ListenerFunctions      = breelNS.getNamespace("generic.events").ListenerFunctions;
	var siteManager;

	p.init = function(el){

		siteManager = breelNS.getNamespace(breelNS.projectName).singletons.siteManager;

		s.init.call(this, el);

		this._middleWrapperTouchEl = this._middleWrapperEl.querySelector('.touchEl');

		// this._onMiddleWrapperMouseOverBound = ListenerFunctions.createListenerFunction(this, this._onMiddleWrapperMouseOver);
		// this._onMiddleWrapperMouseOutBound = ListenerFunctions.createListenerFunction(this, this._onMiddleWrapperMouseOut);
		// this._middleWrapperEl.addEventListener('mouseover', this._onMiddleWrapperMouseOverBound);
		// this._middleWrapperEl.addEventListener('mouseout', this._onMiddleWrapperMouseOutBound);

		this._hoverTimer = null;
		this._hoverTimerFired = false;

		// NOTICE: Problem with IE10 and the 3D flip - This is a fallback solution
		this._isIE10 = navigator.appVersion.indexOf("MSIE 10") !== -1;

		if (this._isIE10) {
			$(this._albumCoverEl).css("opacity", 0);
			$(this._albumCoverEl).addClass("reset3D");
			$(this._profileImageEl).addClass("reset3D");
		}



		$(this._middleWrapperTouchEl).on('click', this._onToggleFlip.bind(this));
		$(this._albumCoverEl).on('click', this._onToggleFlip.bind(this));
		$(this._profileImageEl).on('click', this._onToggleFlip.bind(this));
		
	};

	p.setData = function(data){

		this._ready = false;

		this._fullNameEl.innerHTML = data.firstName +' '+ data.lastName;
		this._locationHolderEl.style.display = "block";

		if(data.agency && data.agency != "")
			this._agencyEl.innerHTML = data.agency;
		else
			this._agencyEl.innerHTML = "SPEAKER"//data.agency;

		if(data.country && data.country != "")
			this._locationEl.innerHTML = data.country;
		else
			this._locationHolderEl.style.display = "none";



		var img = new Image();
		img.onload = function(){

			

			CSSanimate.to(this._profileImageEl, {opacity: 1}, {duration: 300, ease: 'easeInOutSine', delay: 0}, function(){
				this._ready = true;

				this._hoverTimer = setTimeout(function(){
					this._flip(true);	
				}.bind(this), 2000);

			}.bind(this));

			img.onload = null;

		}.bind(this);



		CSS.set(this._profileImageEl, {opacity: 0});

		this._albumCoverEl.style.backgroundImage = 'url('+data.imgAlbum+')';
		this._profileImageEl.style.backgroundImage = 'url('+data.largeImg+')';
		
		img.src = data.largeImg;
		
		

	};


	p._onToggleFlip = function(e){
		if(!this._ready) return;

		clearTimeout(this._hoverTimer);
		var isAlbum = this.isAlbum ? false : true;
		e.stopPropagation();
		e.preventDefault();
		this._flip(isAlbum);
	};

	p._onMiddleWrapperMouseOver = function(){
		/*if (!this._hoverTimerFired) return;

		//this._animate(this._albumCoverEl, this._profileImageEl);

		this._flip(true);*/
	};

	p._onMiddleWrapperMouseOut = function(){

		/*this._hoverTimerFired = true;

		clearTimeout(this._hoverTimer);

		//this._animate(this._profileImageEl, this._albumCoverEl);

		this._flip(false);*/
	};

	p.show = function(){

		var self = this;
		

		this.removeAllTweens();
		this._el.style.display = 'block';

		var locationWidth = this._locationEl.clientWidth;
		this._locationHolderEl.style.marginLeft = -(locationWidth/2  + 15 ) + 'px';

		ga('send', 'event', 'desktop/click', 'profile', 'desktop/events/profileOpen');

		// Fade all
		CSSanimate.fromTo(this._el, {
			opacity: 0
		}, {
			opacity: 1
		}, {
			ease: 'easeOutSine',
			duration: 300,
			delay: 100
		}, function() {
		}.bind(this));

		// Top
		CSSanimate.fromTo(this._topWrapperEl, {
			transform: 'translateY(-50px)'
		}, {
			transform: 'translateY(0px)'
		}, {
			ease: 'easeOutSine',
			duration: 300,
			delay: 100
		}, function() {
		}.bind(this));

		// Middle
		CSSanimate.fromTo(this._middleWrapperHolderEl, {
			transform: 'scale(0.5, 0.5)'
		}, {
			transform: 'scale(1, 1)'
		}, {
			ease: 'easeOutSine',
			duration: 300,
			delay: 100
		}, function() {
		}.bind(this));
	};

	p.hide = function(){


		CSSanimate.removeTween(this._profileImageEl);

		clearTimeout(this._hoverTimer);
		this._hoverTimerFired = false;

		this.removeAllTweens();
		this._el.style.display = 'none';

		this._flip(false);


		
		ga('send', 'event', 'desktop/click', 'profile', 'desktop/events/profileClose');
	};

	p._flip = function(isAlbum) {

		this.isAlbum = isAlbum;

		if (!this._isIE10) {
			if (isAlbum) {
				$("#middleWrapper").addClass("flipped");
			} else {
				$("#middleWrapper").removeClass("flipped");
			}
		} else {

			var coverOpacity = isAlbum ? 1 : 0;
			var profileOpacity = isAlbum ? 0 : 1;

			CSSanimate.to(this._albumCoverEl, {
				opacity: coverOpacity
			}, {
				ease: 'easeOutSine',
				duration: 300,
				delay: 0
			}, function() {
			});

			CSSanimate.to(this._profileImageEl, {
				opacity: profileOpacity
			}, {
				ease: 'easeOutSine',
				duration: 300,
				delay: 0
			}, function() {
			});	

		}
	};





});
