

breelNS.defineClass(breelNS.projectName+".page.landing.expandedProfile.ExpandedProfileBottomView", breelNS.projectName+".common.profileParticles.expandedProfile.ExpandedProfileBottomView", function(a,c) {
	var e = breelNS.getNamespace("generic.events").ListenerFunctions;
    a.init = function(a) {
        breelNS.getNamespace(breelNS.projectName);
        c.init.call(this, a);
        this._onSpotifyBtnClickBound = e.createListenerFunction(this, this._onSpotifyBtnClick);
        this._openSpotifyBtn = this._el.querySelector(".openInSpotify");
        this._openSpotifyBtn.addEventListener("click", 
        this._onSpotifyBtnClickBound)
    };
    a.show = function() {
        this._el.style.display = "block";
        this._genreHolderEl.style.marginLeft = -(this._genreEl.clientWidth / 2 + 15) + "px";
        CSSanimate.fromTo(this._el, {opacity: 0,transform: "translateY(50px)"}, {opacity: 1,transform: "translateY(0px)"}, {ease: "easeOutSine",duration: 300,delay: 100}, function() {
        }.bind(this))
    };
    a._onSpotifyBtnClick = function(a) {
        a.preventDefault();
        a.stopPropagation();
        ga("send", "event", "desktop/click", "profile", "desktop/events/btnOpenSpotify");
        window.open("http://open.spotify.com/track/" + 
        this._data.spotifyID)
    }

	

});