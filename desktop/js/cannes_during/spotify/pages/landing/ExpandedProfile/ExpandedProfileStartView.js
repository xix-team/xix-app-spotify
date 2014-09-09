

breelNS.defineClass(breelNS.projectName+".page.landing.expandedProfile.ExpandedProfileStartView", breelNS.projectName+".common.profileParticles.expandedProfile.ExpandedProfileStartView", function(a, c) {
	breelNS.getNamespace("generic.events");
    a.init = function(a) {
        breelNS.getNamespace(breelNS.projectName);
        c.init.call(this, a);
        this._middleWrapperTouchEl = this._middleWrapperEl.querySelector(".touchEl");
        this._hoverTimer = null;
        this._hoverTimerFired = !1;
        if (this._isIE10 = -1 !== navigator.appVersion.indexOf("MSIE 10"))
            $(this._albumCoverEl).css("opacity", 
            0), $(this._albumCoverEl).addClass("reset3D"), $(this._profileImageEl).addClass("reset3D");
        $(this._middleWrapperTouchEl).on("click", this._onToggleFlip.bind(this));
        $(this._albumCoverEl).on("click", this._onToggleFlip.bind(this));
        $(this._profileImageEl).on("click", this._onToggleFlip.bind(this))
    };
    a.setData = function(a) {
        this._ready = !1;
        this._fullNameEl.innerHTML = a.firstName + " " + a.lastName;
        this._locationHolderEl.style.display = "block";
        this._agencyEl.innerHTML = a.agency && "" != a.agency ? a.agency : "SPEAKER";
        a.country && 
        "" != a.country ? this._locationEl.innerHTML = a.country : this._locationHolderEl.style.display = "none";
        var b = new Image;
        b.onload = function() {
            CSSanimate.to(this._profileImageEl, {opacity: 1}, {duration: 300,ease: "easeInOutSine",delay: 0}, function() {
                this._ready = !0;
                this._hoverTimer = setTimeout(function() {
                    this._flip(!0)
                }.bind(this), 2E3)
            }.bind(this));
            b.onload = null
        }.bind(this);
        CSS.set(this._profileImageEl, {opacity: 0});
        this._albumCoverEl.style.backgroundImage = "url(" + a.imgAlbum + ")";
        this._profileImageEl.style.backgroundImage = 
        "url(" + a.largeImg + ")";
        b.src = a.largeImg
    };
    a._onToggleFlip = function(a) {
        if (this._ready) {
            clearTimeout(this._hoverTimer);
            var b = this.isAlbum ? !1 : !0;
            a.stopPropagation();
            a.preventDefault();
            this._flip(b)
        }
    };
    a._onMiddleWrapperMouseOver = function() {
    };
    a._onMiddleWrapperMouseOut = function() {
    };
    a.show = function() {
        this.removeAllTweens();
        this._el.style.display = "block";
        this._locationHolderEl.style.marginLeft = -(this._locationEl.clientWidth / 2 + 15) + "px";
        ga("send", "event", "desktop/click", "profile", "desktop/events/profileOpen");
        CSSanimate.fromTo(this._el, {opacity: 0}, {opacity: 1}, {ease: "easeOutSine",duration: 300,delay: 100}, function() {
        }.bind(this));
        CSSanimate.fromTo(this._topWrapperEl, {transform: "translateY(-50px)"}, {transform: "translateY(0px)"}, {ease: "easeOutSine",duration: 300,delay: 100}, function() {
        }.bind(this));
        CSSanimate.fromTo(this._middleWrapperHolderEl, {transform: "scale(0.5, 0.5)"}, {transform: "scale(1, 1)"}, {ease: "easeOutSine",duration: 300,delay: 100}, function() {
        }.bind(this))
    };
    a.hide = function() {
        CSSanimate.removeTween(this._profileImageEl);
        clearTimeout(this._hoverTimer);
        this._hoverTimerFired = !1;
        this.removeAllTweens();
        this._el.style.display = "none";
        this._flip(!1);
        ga("send", "event", "desktop/click", "profile", "desktop/events/profileClose")
    };
    a._flip = function(a) {
        this.isAlbum = a;
        if (this._isIE10) {
            var b = a ? 0 : 1;
            CSSanimate.to(this._albumCoverEl, {opacity: a ? 1 : 0}, {ease: "easeOutSine",duration: 300,delay: 0}, function() {
            });
            CSSanimate.to(this._profileImageEl, {opacity: b}, {ease: "easeOutSine",duration: 300,delay: 0}, function() {
            })
        } else
            a ? $("#middleWrapper").addClass("flipped") : 
            $("#middleWrapper").removeClass("flipped")
    }





});
