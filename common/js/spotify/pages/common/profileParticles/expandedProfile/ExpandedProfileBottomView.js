

breelNS.defineClass(breelNS.projectName+".page.landing.expandedProfile.ExpandedProfileBottomView", breelNS.projectName+".common.profileParticles.expandedProfile.ExpandedProfileBottomView", function(p, s, ExpandedProfileBottomView) {
	var ListenerFunctions      = breelNS.getNamespace("generic.events").ListenerFunctions;
	var siteManager;

	p.init = function(el){

		siteManager = breelNS.getNamespace(breelNS.projectName).singletons.siteManager;

		s.init.call(this, el);

		this._onSpotifyBtnClickBound = ListenerFunctions.createListenerFunction(this, this._onSpotifyBtnClick);
		this._openSpotifyBtn = this._el.querySelector('.openInSpotify');
		this._openSpotifyBtn.addEventListener('click', this._onSpotifyBtnClickBound);
	};

	p.show = function() {

		this._el.style.display = 'block';

		var genreCopyWidth = this._genreEl.clientWidth;
		this._genreHolderEl.style.marginLeft = -(genreCopyWidth/2 + 15) + 'px';

		// Bottom
		CSSanimate.fromTo(this._el, {
			opacity: 0, 
			transform: 'translateY(50px)'
		}, {
			opacity: 1, 
			transform: 'translateY(0px)'
		}, {
			ease: 'easeOutSine',
			duration: 300,
			delay: 100
		}, function() {
		}.bind(this));
	};

	p._onSpotifyBtnClick = function(e){

		e.preventDefault();
		e.stopPropagation();

		ga('send', 'event', 'desktop/click', 'profile', 'desktop/events/btnOpenSpotify');
		
		var songID = this._data.spotifyID;
		window.open("http://open.spotify.com/track/" + songID);
	};

	

});