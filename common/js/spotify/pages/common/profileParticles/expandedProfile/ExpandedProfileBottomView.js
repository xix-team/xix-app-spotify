

breelNS.defineClass(breelNS.projectName+".common.profileParticles.expandedProfile.ExpandedProfileBottomView", "generic.events.EventDispatcher", function(a) {
	  breelNS.getNamespace("generic.events");
    var c = breelNS.getNamespace("spotify.common.utils.genresdata").GenresData;
    a.init = function(a) {
        breelNS.getNamespace(breelNS.projectName);
        this._el = a;
        this._genreEl = a.querySelector(".genre");
        this._genreIconEl = a.querySelector(".genreIcon");
        this._artistEl = a.querySelector(".artist");
        this._songTitleEl = a.querySelector(".songTitle");
        this._genreHolderEl = a.querySelector(".genreHolder")
    };
    a.setData = function(a) {
        this._data = a;
        this._genreEl.innerHTML = a.songGenres;
        this._artistEl.innerHTML = a.artistName;
        this._songTitleEl.innerHTML = a.songTitle;
        this._genreIconClass = "genreIcon_" + a.songGenresID;
        $(this._genreIconEl).addClass(this._genreIconClass);
        (a = c.getItemFromProp("backendID", a.songGenresID)) && $(this._genreEl).css("color", a.color)
    };
    a.show = function() {
        this._el.style.display = "block";
        this._genreHolderEl.style.marginLeft = -(this._genreEl.clientWidth / 
        2 + 15) + "px"
    };
    a.hide = function() {
        $(this._genreIconEl).removeClass(this._genreIconClass);
        this._el.style.display = "none"
    }

});