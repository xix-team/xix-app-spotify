

breelNS.defineClass(breelNS.projectName+".common.profileParticles.expandedProfile.ExpandedProfileStartView", "generic.events.EventDispatcher", function(a) {
	breelNS.getNamespace("generic.events");
    a.init = function(a) {
        breelNS.getNamespace(breelNS.projectName);
        this._el = a;
        this._tweens = [];
        this._topWrapperEl = a.querySelector(".topWrapper");
        this._middleWrapperEl = a.querySelector("#middleWrapper");
        this._middleWrapperHolderEl = a.querySelector("#middleWrapperHolder");
        this._fullNameEl = this._topWrapperEl.querySelector(".fullName");
        this._agencyEl = this._topWrapperEl.querySelector(".agencyTitle");
        this._locationEl = this._topWrapperEl.querySelector(".location");
        this._locationHolderEl = this._topWrapperEl.querySelector(".locationHolder");
        this._albumCoverEl = this._middleWrapperEl.querySelector(".albumCover");
        this._profileImageEl = this._middleWrapperEl.querySelector(".profileImage");
        this._locationHolderEl = this._topWrapperEl.querySelector(".locationHolder")
    };
    a.setData = function(a) {
        this._fullNameEl.innerHTML = a.firstName + " " + a.lastName;
        this._locationHolderEl.style.display = 
        "block";
        this._agencyEl.innerHTML = a.agency && "" != a.agency ? a.agency : "SPEAKER";
        a.country && "" != a.country ? this._locationEl.innerHTML = a.country : this._locationHolderEl.style.display = "none";
        this._albumCoverEl.style.backgroundImage = "url(" + a.imgAlbum + ")";
        this._profileImageEl.style.backgroundImage = "url(" + a.largeImg + ")"
    };
    a.show = function() {
        this.removeAllTweens();
        this._el.style.display = "block";
        this._locationHolderEl.style.marginLeft = -(this._locationEl.clientWidth / 2 + 15) + "px"
    };
    a.hide = function() {
        this.removeAllTweens();
        this._el.style.display = "none"
    };
    a._animate = function(a, e) {
        this.removeAllTweens();
        var b = (new TWEEN.Tween({value: 0})).to({value: 1}, 800).easing(TWEEN.Easing.Exponential.Out).onUpdate(function() {
            e.style.opacity = this.value;
            a.style.opacity = 1 - this.value
        });
        b.start();
        b.onComplete(function() {
        });
        this._tweens.push(b)
    };
    a.removeAllTweens = function() {
        for (var a = 0; a < this._tweens.length; a++)
            null !== this._tweens[a] && this._tweens[a].stop()
    }




});
