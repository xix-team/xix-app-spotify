var  $$document=document;
breelNS.defineClass(breelNS.projectName + ".page.landing.FallingImages", "generic.events.EventDispatcher", function(a, c, e) {
    var b, d = breelNS.getNamespace("generic.htmldom").ElementUtils;
    e.IMAGE_ARRIVED = "onImageArrivedVBottom";
    a.init = function(a, c, d) {
        b = breelNS.getNamespace(breelNS.projectName).singletons.siteManager;
        this._container = document.createElement("div");
        this._container.className = "fallingImageContainer";
        a.appendChild(this._container);
        this._imgs = c;
        this.length = d;
        this._dropInterval = this._count = 0;
        this._images = [];
        this._efIndex = -1;
        this._scale = window.innerHeight / b.model.baseHeight;
        return this
    };
    a.start = function() {
        d.addClass(document.body, "dark");
        this._count = 0;
        this._dropImage(); - 1 != this._efIndex && b.scheduler.removeEF(this._efIndex);
        this._efIndex = b.scheduler.addEF(this, this.update, [])
    };
    a._dropImage = function() {
        for (var a = null, c = null, d = !1; !a;) {
            var d = !1,
                c = this._imgs[Math.floor(Math.random() * this._imgs.length)].src,
                e;
            for (e in this._images)
                if (this._images[e].src === c) {
                    d = !0;
                    break
                }
            d || (a = c)
        }
        c = new Image;
        c.src = a;
        c.width =
            c.height = 65;
        c.className = "dropImage";
        a = 100 * this._scale;
        c.tx = 5 * -a + Math.random() * (5 * a - 5 * -a);
        c.ty = 0 + Math.random() * (3 * -a - 0) - c.height;
        c.vy = 0;
        c.angle = 360 * Math.random();
        c.alpha = 1;
        c.scale = this._scale;
        c.angleRotation = c.tx / Math.abs(c.tx);
        c.easing = 0.07 + Math.random() * (0.05 - 0.07);
        this._images.push(c);
        CSS.set(c, {
            transform: CSS.to3DString("transform", c.tx, c.ty)
        });
        this._count++;
        if (this._count < this.length) this._dropInterval = 200 * Math.random() + 50, b.scheduler.delay(this, this._dropImage, [], this._dropInterval)
    };
    a.resize =
        function(a, c) {
            this._scale = c / b.model.baseHeight
        };
    a.update = function() {
        for (i = 0; i < this._images.length;) {
            var a = this._images[i];
            if (!a.arrived) {
                var b = 350 * this._scale + 0.5 * window.innerHeight - a.height;
                a.vy += 0.3;
                a.ty += a.vy;
                a.angle += 5 * a.easing * a.angleRotation;
                a.tx += 0.5 * -a.tx * a.easing;
                var c = a.ty / b,
                    c = 0.5 * b,
                    c = (a.ty - c) / (b - c),
                    c = Math.max(c, 0);
                a.alpha += 0.2 * (1 - c - a.alpha);
                a.scale += 0.1 * (1 - c - a.scale);
                CSS.set(a, {
                    transform: CSS.to3DString("transform", a.tx, a.ty) + " " + CSS.to3DString("scale", a.scale, a.scale) + " " + CSS.to3DString("rotate",
                        0, 0, a.angle)
                });
                a.ty > b && !a.arrived ? (a.arrived = !0, this.dispatchCustomEvent(e.IMAGE_ARRIVED, a.tx), $(a).remove(), this._images.splice(i, 1)) : (i++, a.parentNode || this._container.appendChild(a))
            }
        }
    };
    a.destroy = function() {
        -1 != this._efIndex && b.scheduler.removeEF(this._efIndex);
        this._efIndex = -1;
        for (var a = 0; a < this._images.length; a++) this._images[a].src = "", this._images[a].style.opacity = 0, this._images[a].style.display = "none", this._images[a].parentNode && this._images[a].parentNode.removeChild(this._images[a]);
        this._container.style.display =
            "none";
        this._container.style.opacity = 0;
        try {
            this._container.parentNode.removeChild(this._container)
        } catch (c) {
            console.log("Error remove falling image container")
        }
    }
});
breelNS.defineClass(breelNS.projectName + ".page.landing.ProfileParticleIntroController", "generic.events.EventDispatcher", function(a, c, e) {
    e.ENDED = "profileParticlesIntroEnded";
    a.init = function(a) {
        breelNS.getNamespace(breelNS.projectName);
        this.parent = parent;
        this.params = a;
        this.animateObjects = [];
        this.startAngle = a.intro.startAngle;
        this.startScale = a.intro.startScale;
        this.endScale = a.intro.endScale;
        this.topAdjust = a.topAdjust;
        this.size = void 0;
        this.copyMargin = a.intro.copyMargin;
        this.particle = this.locationCopyStrEl =
            this.locationCopyWrapper = this.profileCopyWrapper = this.albumCopyWrapper = this.copyWrapper = null;
        this._tweens = [];
        this.data = null;
        return this
    };
    a.start = function(a, c, e) {
        this.data = c;
        this.particle = a;
        this._container = e;
        this.createCopyWrapper();
        this.onResize();
        this.animateToMiddle()
    };
    a.animateToMiddle = function() {
        this.particle.y = -1E3;
        scale = 0;
        var a = (new TWEEN.Tween(this.particle)).to({
            y: 0
        }, 1E3).easing(TWEEN.Easing.Exponential.Out);
        CSSanimate.to(this.albumCopyWrapper, {
            opacity: 1
        }, {
            duration: 800,
            ease: "easeOutSine",
            delay: 200
        }, function() {}.bind(this));
        a.start();
        a.onComplete(this.onImageLanded.bind(this));
        this._tweens.push(a)
    };
    a.createCopyWrapper = function() {
        data = this.data;
        var a = document.createElement("div");
        a.className = "introCopyWrapper";
        var c = document.createElement("div");
        c.className = "introAlbumCopyWrapper";
        var e = document.createElement("h4");
        e.className = "artistTitle";
        e.innerHTML = data.artistName;
        var g = document.createElement("h5");
        g.className = "songTitle";
        g.innerHTML = data.songTitle;
        c.appendChild(e);
        c.appendChild(g);
        e = document.createElement("div");
        e.className = "introProfileCopyWrapper";
        g = document.createElement("h3");
        g.className = "profileName";
        g.innerHTML = data.firstName + " " + data.lastName;
        var h = document.createElement("h4");
        h.className = "agencyTitle";
        h.innerHTML = data.agency;
        if (data.country.length) {
            var l = document.createElement("div");
            l.className = "locationHolder";
            var k = document.createElement("div");
            k.className = "locationIcon";
            var m = document.createElement("h5");
            m.className = "location";
            m.innerHTML = data.country;
            this.locationCopyStrEl =
                m;
            l.appendChild(k);
            l.appendChild(m);
            this.locationCopyWrapper = l
        }
        e.appendChild(g);
        e.appendChild(h);
        l && e.appendChild(l);
        a.appendChild(e);
        a.appendChild(c);
        this._container.appendChild(a);
        this.profileCopyWrapper = e;
        this.albumCopyWrapper = c;
        this.copyWrapper = a
    };
    a.onImageLanded = function() {
        CSSanimate.to(this.particle.albumEl, {
            transform: CSS.to3DString("rotate", 0, 180, 0)
        }, {
            duration: 400,
            ease: "easeInOutSine",
            delay: 0
        }, function() {}.bind(this));
        CSS.set(this.particle.visibleContainer, {
            opacity: 0,
            transform: CSS.to3DString("rotate",
                0, 180, 0)
        });
        CSSanimate.to(this.particle.visibleContainer, {
            opacity: 1,
            transform: CSS.to3DString("rotate", 0, 0, 0)
        }, {
            duration: 400,
            ease: "easeInOutSine",
            delay: 0
        }, function() {}.bind(this));
        CSSanimate.to(this.profileCopyWrapper, {
            opacity: 1
        }, {
            duration: 400,
            ease: "easeInOutSine",
            delay: 0
        }, function() {}.bind(this));
        CSSanimate.to(this.albumCopyWrapper, {
            opacity: 0
        }, {
            duration: 400,
            ease: "easeOutSine",
            delay: 0
        }, function() {}.bind(this));
        setTimeout(this.removeCopy.bind(this), 1500)
    };
    a._animate = function(a, c, e, g, h) {
        h = (new TWEEN.Tween({
            value: 0
        })).to({
                value: 1
            },
            1E3).easing(TWEEN.Easing.Exponential.Out).delay(h).onUpdate(function() {
            c.style.opacity = this.value;
            a.style.opacity = 1 - this.value;
            e.style.opacity = this.value;
            g.style.opacity = 1 - this.value
        });
        h.start();
        h.onComplete(function() {
            a.style.display = "none"
        });
        this._tweens.push(h)
    };
    a.removeCopy = function() {
        CSSanimate.to(this.copyWrapper, {
            opacity: 0
        }, {
            duration: 400,
            ease: "easeOutSine",
            delay: 0
        }, function() {
            this.dispatchCustomEvent(e.ENDED, {
                particle: this.particle
            })
        }.bind(this))
    };
    a.removeAll = function(a) {
        var c = this,
            a = (new TWEEN.Tween({
                value: 0
            })).to({
                    value: 1
                },
                3E3).easing(TWEEN.Easing.Exponential.Out).delay(a).onUpdate(function() {
                c._container.style.opacity = 1 - this.value
            });
        a.start();
        a.onComplete(function() {
            c.destroy()
        });
        this._tweens.push(a)
    };
    a.destroy = function() {
        this.removeAllTweens();
        this._container.removeChild(this.copyWrapper)
    };
    a.onResize = function() {
        this.size = 2 * window.innerWidth * this.params.centerParticleMultiplier;
        this.copyWrapper.style.marginTop = -30 + this.size / 2 + this.params.centerAlbumAdjust / 2 + this.params.intro.copyMargin + "px";
        if (this.locationCopyWrapper) this.locationCopyWrapper.style.marginLeft = -(this.locationCopyStrEl.clientWidth / 2 + 10) + "px"
    };
    a.removeAllTweens = function() {
        for (var a = 0; a < this._tweens.length; a++) null !== this._tweens[a] && this._tweens[a].stop()
    }
});
breelNS.defineClass(breelNS.projectName + ".page.landing.ProfileParticleController", breelNS.projectName + ".common.profileParticles.ProfileParticleController", function(a, c, e) {
    var b = breelNS.getNamespace(breelNS.projectName + ".page.landing").ProfileParticleIntroController,
        d = breelNS.getNamespace(breelNS.projectName + ".canvas.particles").ProfileParticle,
        f = breelNS.getNamespace(breelNS.projectName + ".canvas.particles").CenterParticle;
    e.ON_PROFILE_PARTICLE_CLICK = "profileParticleControllerOnProfileParticleClick";
    e.ON_ALL_ZOOMED_OUT = "profileParticleControllerOnAllZoomedOut";
    e.ON_ALL_ZOMMED_IN = "profileParticleControllerOnAllZoomedIn";
    var g;
    a.init = function(a) {
        g = breelNS.getNamespace(breelNS.projectName).singletons.siteManager;
        this.params = {};
        this.params.numProfileParticles = 4;
        this.params.numParticlesCenter = 0;
        this.params.numParticlesSmall = 0;
        this.params.baseSize = 5;
        this.params.sizeDifference = 7;
        this.params.profileParticleMultiplier = 0.055 * 0.4;
        this.params.centerParticleMultiplier = 0.055;
        this.params.colorParticleMultiplier =
            0.0020;
        this.params.topAdjust = 30;
        this.params.centerAlbumAdjust = -20;
        this.params.profileRadiusAdjust = 50;
        this.params.startAnimationZoomVisibility = 0.2;
        this.params.profileMinWidth = 40;
        this.params.centerMinWidth = 124;
        this.params.intro = {};
        this.params.intro.copyMargin = 20;
        this.params.intro.startAngle = 1.2;
        this.params.intro.startScale = 0.6;
        this.params.intro.endScale = 1.2;
        this.params.colorAcceleration = 2;
        this.params.profileAcceleration = 3;
        this.params.velocityDecreasing = 0.5;
        this.params.colorParticleEndAnimationDuration =
            50;
        this.params.profileParticleEndAnimationDuration = 50;
        this.params.centerParticleEndAnimationDuration = 50;
        c.init.call(this, a)
    };
    a.startIntro = function() {
        this.initModeReady = !1;
        this.introController = new b;
        this.introController.init(this.params);
        this.introController.addEventListener(b.ENDED, this._onProfileIntroEndedBound);
        var a = this.createCenterParticle(!1, "intro");
        a.offsetScale = 0.3;
        a.createAlbumEl();
        a.el.style.opacity = 1;
        a.albumEl.style.opacity = 1;
        a.detailEl.style.opacity = 0;
        a.visibleContainer.style.opacity =
            0;
        this.show();
        this.introController.start(a, this._currentData[0], this.el)
    };
    a._onProfileIntroEnded = function(a) {
        a = a.detail.particle;
        a.startAnimation = !1;
        a.endAnimation = !1;
        a.offsetScale = 0;
        a.mode = "default";
        this._particleAnimationsInProgress = !0;
        this.createProfileParticles();
        var b = this;
        setTimeout(function() {
            b.introController.destroy();
            b.initModeReady = !1;
            b._initMode = !1;
            b._mainMode = !0
        }, 3E3)
    };
    a.startAnimation = function(a, b) {
        this._particleAnimationsInProgress = !0;
        a && this.createCenterParticle(!0, "normal");
        if (void 0 !==
            b) b.startAnimation = !1, b.endAnimation = !1, this._renderer.addProfileChild(b);
        this.createProfileParticles()
    };
    a.createCenterParticle = function(a, b) {
        var c = (new f).init(this.el, this.params, b);
        c.setIndex(0);
        c.addEventListener(f.ON_CLICK, this._onProfileParticleClickBound);
        c.addEventListener(f.ON_REMOVE, this._onProfileParticleAnimationEndBound);
        c.isLocked = !0;
        c.hoverAdjust = 0;
        c.isCenterProfile = !0;
        c.setData(this._currentData[0]);
        c.visibleContainer.style.opacity = 1;
        c.setRadianDistance(0);
        "intro" != b && c.createColorOverlay();
        this._renderer.addProfileChild(c);
        c.offset.y = -100 * this._scale;
        return c
    };
    a.createProfileParticles = function() {
        var a = this;
        for (i = 0; i < this.params.numProfileParticles; i++) setTimeout(function() {
            a._addProfileParticle(0);
            if (i == a.params.numProfileParticles) a._particleAnimationsInProgress = !1
        }, 50 * (i + 1));
        if (0 == this.params.numProfileParticles) this._particleAnimationsInProgress = !1;
        setTimeout(function() {
            a.dispatchCustomEvent(e.ON_ALL_ZOOMED_IN)
        }, 200 * (this.params.numProfileParticles + 1))
    };
    a._addProfileParticle = function(a) {
        var b =
            (new d).init(this.el, this.params);
        b.setIndex(a);
        b.setData(this._currentData[this._renderer.profileParticles.length]);
        b.positionDetailEl();
        b.setPullMode(!1);
        b.addEventListener(d.ON_CLICK, this._onProfileParticleClickBound);
        b.addEventListener(d.ON_REMOVE, this._onProfileParticleAnimationEndBound);
        b.addEventListener(d.TRIGGER_NEW, this._onProfileParticleTriggerNewBound);
        b.setGravityPoint(this._renderer.profileParticles[this._renderer.profileParticles.length - 1]);
        b.offset.y = -100 * this._scale;
        var c = this.el.clientWidth,
            e = this.el.clientHeight,
            a = this.params.startRadianPos[this._renderer.profileParticles.length - 1],
            f = b.getCenterPoint(),
            c = this.getInitPos({
                w: c - 2 * b.size,
                h: e - 2 * b.size
            }, this.params.initProfileRadius, a * Math.PI);
        b.x = c.x - f.x;
        b.y = c.y - f.y;
        b.isLocked = !0;
        b.radianPos = a;
        b.createColorOverlay();
        this._renderer.addProfileChild(b)
    };
    a.onResize = function(a, b, c) {
        this._scale = b / g.model.baseHeight;
        this.el.style.height = b + "px";
        this.el.style.width = a + "px";
        this.params.initProfileRadius = a * this.params.centerParticleMultiplier + this.params.profileRadiusAdjust;
        this.params.initColorRadius = b / 4;
        for (var d = this._renderer.particles, e = 0; e < d.length; e++) {
            d[e].onResize({
                w: a,
                h: b
            }, this.params, c);
            var f = d[e],
                p = f.getCenterPoint();
            f.offset.y = -100 * this._scale;
            if ("profile" == d[e].type) {
                var q = this.getInitPos({
                    w: a - 2 * f.size,
                    h: b - 2 * f.size
                }, this.params.initProfileRadius, f.radianPos * Math.PI);
                f.x = q.x - p.x;
                f.y = q.y - p.y
            } else f.x = 0, f.y = 0
        }
    }
});
breelNS.defineClass(breelNS.projectName + ".page.landing.expandedProfile.ExpandedProfileStartView", breelNS.projectName + ".common.profileParticles.expandedProfile.ExpandedProfileStartView", function(a, c) {
    breelNS.getNamespace("generic.events");
    a.init = function(a) {
        breelNS.getNamespace(breelNS.projectName);
        c.init.call(this, a);
        this._middleWrapperTouchEl = this._middleWrapperEl.querySelector(".touchEl");
        this._hoverTimer = null;
        this._hoverTimerFired = !1;
        if (this._isIE10 = -1 !== navigator.appVersion.indexOf("MSIE 10")) $(this._albumCoverEl).css("opacity",
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
            CSSanimate.to(this._profileImageEl, {
                opacity: 1
            }, {
                duration: 300,
                ease: "easeInOutSine",
                delay: 0
            }, function() {
                this._ready = !0;
                this._hoverTimer = setTimeout(function() {
                    this._flip(!0)
                }.bind(this), 2E3)
            }.bind(this));
            b.onload = null
        }.bind(this);
        CSS.set(this._profileImageEl, {
            opacity: 0
        });
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
    a._onMiddleWrapperMouseOver = function() {};
    a._onMiddleWrapperMouseOut = function() {};
    a.show = function() {
        this.removeAllTweens();
        this._el.style.display = "block";
        this._locationHolderEl.style.marginLeft = -(this._locationEl.clientWidth / 2 + 15) + "px";
        ga("send", "event", "desktop/click", "profile", "desktop/events/profileOpen");
        CSSanimate.fromTo(this._el, {
            opacity: 0
        }, {
            opacity: 1
        }, {
            ease: "easeOutSine",
            duration: 300,
            delay: 100
        }, function() {}.bind(this));
        CSSanimate.fromTo(this._topWrapperEl, {
            transform: "translateY(-50px)"
        }, {
            transform: "translateY(0px)"
        }, {
            ease: "easeOutSine",
            duration: 300,
            delay: 100
        }, function() {}.bind(this));
        CSSanimate.fromTo(this._middleWrapperHolderEl, {
            transform: "scale(0.5, 0.5)"
        }, {
            transform: "scale(1, 1)"
        }, {
            ease: "easeOutSine",
            duration: 300,
            delay: 100
        }, function() {}.bind(this))
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
            CSSanimate.to(this._albumCoverEl, {
                opacity: a ? 1 : 0
            }, {
                ease: "easeOutSine",
                duration: 300,
                delay: 0
            }, function() {});
            CSSanimate.to(this._profileImageEl, {
                opacity: b
            }, {
                ease: "easeOutSine",
                duration: 300,
                delay: 0
            }, function() {})
        } else a ? $("#middleWrapper").addClass("flipped") :
            $("#middleWrapper").removeClass("flipped")
    }
});
breelNS.defineClass(breelNS.projectName + ".page.landing.expandedProfile.ExpandedProfileBottomView", breelNS.projectName + ".common.profileParticles.expandedProfile.ExpandedProfileBottomView", function(a, c) {
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
        CSSanimate.fromTo(this._el, {
            opacity: 0,
            transform: "translateY(50px)"
        }, {
            opacity: 1,
            transform: "translateY(0px)"
        }, {
            ease: "easeOutSine",
            duration: 300,
            delay: 100
        }, function() {}.bind(this))
    };
    a._onSpotifyBtnClick = function(a) {
        a.preventDefault();
        a.stopPropagation();
        ga("send", "event", "desktop/click", "profile", "desktop/events/btnOpenSpotify");
        window.open("http://open.spotify.com/track/" +
            this._data.spotifyID)
    }
});
breelNS.defineClass(breelNS.projectName + ".page.landing.ExpandedProfileController", breelNS.projectName + ".common.profileParticles.ExpandedProfileController", function(a, c, e) {
    var b = breelNS.getNamespace(breelNS.projectName + ".page.landing.expandedProfile").ExpandedProfileStartView,
        d = breelNS.getNamespace(breelNS.projectName + ".page.landing.expandedProfile").ExpandedProfileBottomView;
    breelNS.getNamespace("generic.events");
    e.ON_BG_CLICK = "expandedProfileOnBgClick";
    a.init = function(a) {
        breelNS.getNamespace(breelNS.projectName);
        c.init.call(this, a);
        this.expandedProfileStartView = new b;
        this.expandedProfileStartView.init(this._el.querySelector(".startViewWrapper"));
        this.expandedProfileBottomView = new d;
        this.expandedProfileBottomView.init(this._el.querySelector(".controlWrapper"))
    };
    a._onBackgroundClick = function() {
        this.dispatchCustomEvent(e.ON_BG_CLICK)
    }
});
breelNS.defineClass(breelNS.projectName + ".page.MainLoaderPage", "generic.templates.LoaderPage", function(a, c) {
    breelNS.getNamespace("generic.animation");
    breelNS.getNamespace("generic.animation");
    breelNS.getNamespace("generic.events");
    breelNS.getNamespace("generic.core");
    var e = breelNS.getNamespace("generic.events").ListenerFunctions;
    breelNS.getNamespace("generic.htmldom");
    breelNS.getNamespace("generic.htmldom");
    var b = breelNS.getNamespace(breelNS.projectName + ".loader").LoaderAnim;
    a.initialize = function() {
        this.container.appendChild($('<div class="dummySpriteLoader"></div>')[0]);
        this.logoContainer = $('<div class="logoContainer"></div>').css({
            position: "absolute",
            margin: "-198px auto 0 auto",
            top: "50%",
            left: "0px",
            right: "0px",
            width: "296px",
            height: "49px"
        });
        this.logoSpotify = $('<div class="logoSpotify"></div>').css({
            position: "relative",
            "float": "left",
            width: "165px",
            height: "49px",
            background: 'url("common/files/images/landing/logo_sprite.png")'
        });
        this.logoSeparator = $('<div class="logoSeparator"></div>').css({
            position: "relative",
            "float": "left",
            margin: "0 0 0 12px",
            width: "3px",
            height: "49px",
            background: 'url("common/files/images/landing/logo_sprite.png")',
            backgroundPosition: "119px 0px"
        });
        this.logoCannes = $('<div class="logoCannes"></div>').css({
            position: "relative",
            "float": "left",
            margin: "0 0 0 17px",
            width: "99px",
            height: "49px",
            background: 'url("common/files/images/landing/logo_sprite.png")',
            backgroundPosition: "99px 0px"
        });
        this.logoContainer.append(this.logoSpotify);
        this.logoContainer.append(this.logoSeparator);
        this.logoContainer.append(this.logoCannes);
        this.container.appendChild(this.logoContainer[0]);
        this._loaderAnim = (new b).init(this.container);
        this._canvas = this._loaderAnim.getCanvas();
        this._onAnimCompleteBound = e.createListenerFunction(this, this._onAnimComplete);
        this._loaderAnim.addEventListener("animComplete", this._onAnimCompleteBound)
    };
    a.setLoadingPercent = function(a) {
        this._loaderAnim.setPercentage(a)
    };
    a.open = function() {
        this.setOpened();
        CSSanimate.fromTo(this.logoSpotify[0], {
                transform: "translateY(-50px)",
                opacity: 0
            }, {
                transform: "translateY(0px)",
                opacity: 1
            }, {
                ease: "easeOutSine",
                duration: 1E3,
                delay: 100
            },
            function() {}.bind(this));
        CSSanimate.fromTo(this.logoSeparator[0], {
            transform: "translateY(-50px)",
            opacity: 0
        }, {
            transform: "translateY(0px)",
            opacity: 1
        }, {
            ease: "easeOutSine",
            duration: 1E3,
            delay: 200
        }, function() {}.bind(this));
        CSSanimate.fromTo(this.logoCannes[0], {
            transform: "translateY(-50px)",
            opacity: 0
        }, {
            transform: "translateY(0px)",
            opacity: 1
        }, {
            ease: "easeOutSine",
            duration: 1E3,
            delay: 300
        }, function() {}.bind(this))
    };
    a.close = function() {};
    a._onAnimComplete = function() {
        CSSanimate.fromTo(this._canvas, {
            opacity: 1
        }, {
            opacity: 0
        }, {
            ease: "linear",
            duration: 900,
            delay: 500
        }, function() {
            this.setClosed()
        }.bind(this))
    };
    a.setClosed = function() {
        this._loaderAnim.stop();
        c.setClosed.call(this)
    }
});
breelNS.defineClass(breelNS.projectName + ".page.SmallLoaderPage", "generic.templates.LoaderPage", function(a) {
    breelNS.getNamespace("generic.animation");
    breelNS.getNamespace("generic.events");
    breelNS.getNamespace("generic.core");
    breelNS.getNamespace("generic.events");
    breelNS.getNamespace("generic.htmldom");
    breelNS.getNamespace("generic.htmldom");
    a.initialize = function() {
        console.log("init")
    };
    a.setLoadingPercent = function(a) {
        console.log("setLoadingPercent : ", a)
    };
    a.open = function() {
        console.log("Open");
        this.setOpened()
    };
    a.close = function() {
        console.log("Close");
        this.setClosed()
    }
});
breelNS.defineClass(breelNS.projectName + ".page.landing.GenresFilter", "generic.events.EventDispatcher", function(a) {
    var c = breelNS.getNamespace("generic.htmldom").ElementUtils,
        e = breelNS.getNamespace("generic.events").ListenerFunctions,
        b = breelNS.getNamespace("spotify.common.model.backendmanager").ServiceID,
        d = breelNS.getNamespace("spotify.common.model.data.statistics").StatisticsDataSend,
        f;
    a.init = function(a, c) {
        f = breelNS.getNamespace(breelNS.projectName).singletons.siteManager;
        this._controller = c;
        this._container =
            a;
        this._btnGenre = this._container.querySelector("#btnGenre");
        this._genresList = this._container.querySelector("#genresList");
        this._itemTemplate = this._container.querySelector("#genreItemTemplate");
        this._onToggleBound = e.createListenerFunction(this, this._onToggle);
        e.addDOMListener(this._btnGenre, "click", this._onToggleBound);
        this.state = {
            open: !1
        };
        this._btnWidth = this._btnGenre.style.width = this._btnGenre.clientWidth + "px";
        var l = new d({
            type: 0
        });
        f.backendManager.load(b.GET_STATISTICS, l, function(a) {
            var b = a.data.statistics.genres.list,
                c;
            for (c in b) b[c].percent = Math.round(100 * b[c].value / a.data.statistics.genres.total), b[c].name = f.genres[b[c].id], b[c].color = f.colors[b[c].id];
            this._datas = b
        }.bind(this), function() {
            console.error(arguments)
        });
        return this
    };
    a.show = function() {};
    a._onToggle = function() {
        this.state.open ? this._controller.setState(1) && (this.close(), ga("send", "event", "desktop/click", "genres", "genres/close")) : (this.open(), ga("send", "event", "desktop/click", "genres", "genres/open"))
    };
    a.open = function() {
        if (!this.state.open && this._controller.setState(5)) this._controller._onGenreFilter(),
            this.state.open = !0, this._btnGenre.style.width = "", c.addClass(this._container, "open"), this._generatesDomItems()
    };
    a._generatesDomItems = function() {
        for (var a in this._datas) {
            var b = this._itemTemplate.cloneNode(!0);
            this._bindDataItem(this._datas[a], b);
            this._genresList.appendChild(b);
            setTimeout(function(a) {
                c.addClass(a, "visible")
            }.bind(this, b), 100 + 30 * a)
        }
    };
    a._bindDataItem = function(a, b, d) {
        b.id = "";
        b.innerHTML = b.innerHTML.replace(/\{\{\=([\w]*)\}\}/gi, function(b, c) {
            return a[c]
        });
        b.querySelector(".dot").style["background-color"] =
            a.color;
        b.querySelector(".legend").style.color = a.color;
        a.selected ? (c.addClass(b, "selected"), void 0 !== d && this._controller._filterGenreWithIndex(d)) : c.removeClass(b, "selected");
        b.onmousedown = function() {
            c.addClass(b, "mousedown")
        }.bind(this);
        b.onmouseup = function() {
            c.removeClass(b, "mousedown")
        }.bind(this);
        b.onmouseleave = b.onmouseenter = function(d) {
            this._onItemHover.bind(this, a, b, d)();
            c.removeClass(b, "mousedown")
        }.bind(this);
        b.onclick = this._onItemClick.bind(this, a, b);
        b.data = a
    };
    a._onItemHover = function() {};
    a._onItemClick = function(a, b) {
        console.log("Toggle genre: " + a.name);
        a.selected = !a.selected;
        a.selected ? this._controller._filterGenreWithIndex(a.id) : this._controller._filterGenreWithIndex(-1);
        for (var c in this._genresList.childNodes)
            if (this._genresList.childNodes[c] !== b && this._genresList.childNodes[c].data && !0 === this._genresList.childNodes[c].data.selected) this._genresList.childNodes[c].data.selected = !1, this._bindDataItem(this._genresList.childNodes[c].data, this._genresList.childNodes[c]);
        ga("send", "event",
            "desktop/click", "genres", "desktop/genre/select - " + a.name);
        this._bindDataItem(a, b)
    };
    a._clearDomItem = function() {
        if (this._genresList.childNodes && 0 !== this._genresList.childNodes.length) {
            var a = this._genresList.childNodes.length,
                b;
            for (b in this._genresList.childNodes) setTimeout(function(a) {
                try {
                    a.data = null, this._genresList.removeChild(a)
                } catch (b) {}
            }.bind(this, this._genresList.childNodes[b]), 20 * (a - b))
        }
    };
    a.close = function() {
        if (this.state.open) this.state.open = !1, this._controller._onCloseGenreFilter(), this._btnGenre.style.width =
            this._btnWidth, c.removeClass(this._container, "open"), this._clearDomItem()
    }
});
breelNS.defineClass(breelNS.projectName + ".page.landing.PeopleSelect", "generic.events.EventDispatcher", function(a, c, e) {
    var b = breelNS.getNamespace("generic.htmldom").ElementUtils,
        d = breelNS.getNamespace("generic.events").ListenerFunctions,
        f, g = [{
            name: "Suits",
            serverID: 0,
            copyID: 0
        }, {
            name: "Entertainers",
            serverID: 1,
            copyID: 1
        }, {
            name: "Creatives",
            serverID: 2,
            copyID: 2
        }, {
            name: "Journos",
            serverID: 3,
            copyID: 3
        }, {
            name: "Marketeers",
            serverID: 4,
            copyID: 4
        }, {
            name: "Media peeps",
            serverID: 5,
            copyID: 5
        }, {
            name: "Techies",
            serverID: 6,
            copyID: 6
        }, {
            name: "Fashionistas",
            serverID: 7,
            copyID: 7
        }, {
            name: "Social wizards",
            serverID: 10,
            copyID: 9
        }, {
            name: "Brand gurus",
            serverID: 9,
            copyID: 10
        }, {
            name: "The Interactives",
            serverID: 11,
            copyID: 11
        }, {
            name: "Speakers",
            serverID: 12,
            copyID: 8
        }];
    e.ON_PEOPLE_SELECTED = "onPeopleSelected";
    e.ON_PEOPLE_MENU_OPEN = "onPeopleMenuOpen";
    a.init = function(a, b) {
        f = breelNS.getNamespace(breelNS.projectName).singletons.siteManager;
        this._controller = b;
        this._container = a;
        this._customSelect = this._container.querySelector(".customSelect");
        this._hoverBox =
            this._container.querySelector(".hoverBox");
        this._onCloseBound = d.createListenerFunction(this, this.close);
        this._onToggleBound = d.createListenerFunction(this, this._onToggle);
        d.addDOMListener(this._customSelect, "click", this._onToggleBound);
        this.state = {
            open: !1
        };
        this._generatesDomItems();
        return this
    };
    a.show = function() {};
    a._onToggle = function(a) {
        this.state.open || (this.dispatchCustomEvent(e.ON_PEOPLE_MENU_OPEN), a.stopPropagation(), this.open())
    };
    a._showOverlay = function() {
        var a = document.createElement("div");
        a.className = "selectOverlay";
        document.querySelector("#LandingContent").appendChild(a);
        setTimeout(function() {
            b.addClass(a, "display")
        }, 1)
    };
    a._hideOverlay = function() {
        var a = document.querySelectorAll(".selectOverlay");
        if (0 !== a.length)
            for (i in a)
                if (a[i].remove) {
                    var c = a[i];
                    b.removeClass(c, "display");
                    setTimeout(function() {
                        c.remove()
                    }, 500)
                }
    };
    a.open = function() {
        if (!this.state.open) this.state.open = !0, this._resetHoverBox(), this._showOverlay(), b.addClass(this._customSelect, "focus"), d.addDOMListener(document, "click",
            this._onCloseBound)
    };
    a._resetHoverBox = function() {
        if (this.state.open) {
            var a = this._container.querySelector(".selected");
            this._hoverBox.style.top = 27 * ([].indexOf.call(a.parentNode.children, a) - 1) + "px"
        }
    };
    a.close = function() {
        if (this.state.open) this.state.open = !1, this._hideOverlay(), this._hoverBox.style.top = "", b.removeClass(this._customSelect, "focus"), d.removeDOMListener(document, "click", this._onCloseBound)
    };
    a._generatesDomItems = function() {
        var a = -1,
            b;
        do {
            var c = document.createElement("li");
            c.className = "customSelectItem";
            this._customSelect.appendChild(c);
            b = {}; - 1 === a ? (b.name = "All professions", b.index = a) : (b.name = f.copyManager._copyDocument["common.professions.id_" + g[a].copyID], b.index = g[a].serverID);
            b.selected = -1 === a;
            this._bindDataItem(b, c);
            a++
        } while (void 0 !== g[a]);
        this._customSelect.onmouseleave = this._resetHoverBox.bind(this)
    };
    a._bindDataItem = function(a, c) {
        c.innerHTML = a.name;
        a.selected ? b.addClass(c, "selected") : b.removeClass(c, "selected");
        c.onmouseenter = function(a) {
            if (this.state.open) this._hoverBox.style.top = a.target.offsetTop +
                "px"
        }.bind(this);
        c.onclick = this._onItemClick.bind(this, a, c);
        c.data = a
    };
    a._onItemClick = function(a, b, c) {
        console.log("Toggle job: " + a.name);
        if (this.state.open) {
            ga("send", "event", "desktop/click", "search", "desktop/search/btnPeople/select - " + a.name);
            c.stopPropagation();
            a.selected = !0;
            for (var d in this._customSelect.childNodes)
                if (this._customSelect.childNodes[d] !== b && this._customSelect.childNodes[d].data && !0 === this._customSelect.childNodes[d].data.selected) this._customSelect.childNodes[d].data.selected = !1,
                    this._bindDataItem(this._customSelect.childNodes[d].data, this._customSelect.childNodes[d]);
            this._bindDataItem(a, b);
            console.debug("People Selected : ", a);
            this.dispatchCustomEvent(e.ON_PEOPLE_SELECTED, {
                index: a.index
            });
            this.close()
        }
    }
});
breelNS.defineClass(breelNS.projectName + ".page.landing.SearchPanel", "generic.events.EventDispatcher", function(a, c, e) {
    var b = breelNS.getNamespace("generic.htmldom").ElementUtils,
        d = breelNS.getNamespace("generic.events").ListenerFunctions,
        f = breelNS.getNamespace("generic.animation").DomElementOpacityTween,
        g = breelNS.getNamespace("generic.animation").DomElementPositionTween,
        h = breelNS.getNamespace(breelNS.projectName + ".page.landing").GenresFilter,
        l = breelNS.getNamespace(breelNS.projectName + ".page.landing").PeopleSelect,
        k, m = !1;
    e.START_SEARCHING = "startSearching";
    e.SEARCHING_FOR = "searchingFor";
    e.USER_TYPING = "userTyping";
    e.FILTER_GENRE = "filterGenre";
    e.FILTER_GENRE_WITH_INDEX = "filterGenreWithIndex";
    e.CLOSE_FILTER_GENRE = "closeFilterGenre";
    e.SEARCH_PEOPLE = "searchPeople";
    e.PEOPLE_MENU_OPEN = "searchPeopleOpen";
    a.init = function(a, b) {
        k = breelNS.getNamespace(breelNS.projectName).singletons.siteManager;
        this._controller = b;
        this._container = a;
        this._isFromArrow = !1;
        this._btnSearch = this._container.querySelector("#btnSearch");
        this._btnAbout =
            this._container.querySelector("#btnAbout");
        this._btnStats = this._container.querySelector("#btnStats");
        this._btnFacebookShare = this._container.querySelector("#btnShare .facebook");
        this._btnTwitterShare = this._container.querySelector("#btnShare .twitter");
        this._btnAgency = this._container.querySelector(".btnAgency");
        this._btnPeople = this._container.querySelector(".btnPeople");
        this._btnCountry = this._container.querySelector("#btnGlobe");
        this._searchContainer = this._container.querySelector(".searchContainer");
        this._prevArrow = this._container.querySelector(".searchInputWrapper .arrows .prevArrow");
        this._nextArrow = this._container.querySelector(".searchInputWrapper .arrows .nextArrow");
        this._searchInput = this._container.querySelector(".searchInput");
        this._searchInputSuggestionContainer = this._container.querySelector(".searchInputSuggestionContainer");
        this._searchInputSuggestion = this._container.querySelector(".searchInputSuggestion");
        this._searchInputSpanValue = this._container.querySelector(".searchInputSpanValue");
        this._searchInputSpanComplete = this._container.querySelector(".searchInputSpanComplete");
        this._searchInput.onfocus = this._onInputFocus.bind(this);
        this._genresFilterContainer = this._container.querySelector("#genresFilterContainer");
        this._genresFilter = (new h).init(this._genresFilterContainer, this);
        this._validateInputButton = this._container.querySelector(".validate");
        this._searchInputWrapper = this._container.querySelector(".searchInputWrapper");
        this._peopleSelectWrapper = this._container.querySelector(".searchSelectWrapper");
        this._peopleSelect = (new l).init(this._peopleSelectWrapper, this);
        this._onSearchBound = d.createListenerFunction(this, this._onSearch);
        d.addDOMListener(this._btnSearch, "click", this._onSearchBound);
        this._onSearchCountryBound = d.createListenerFunction(this, this._onSearchCountry);
        d.addDOMListener(this._btnCountry, "click", this._onSearchCountryBound);
        this._onAboutBound = d.createListenerFunction(this, this._onAbout);
        d.addDOMListener(this._btnAbout, "click", this._onAboutBound);
        this._onShareBound = d.createListenerFunction(this,
            this._onShare);
        d.addDOMListener(this._btnFacebookShare, "click", this._onShareBound);
        d.addDOMListener(this._btnTwitterShare, "click", this._onShareBound);
        Social.facebook.init(globals.social.facebook.appId);
        this._onStatsBound = d.createListenerFunction(this, this._onStats);
        d.addDOMListener(this._btnStats, "click", this._onStatsBound);
        this._onCancelBound = d.createListenerFunction(this, this._onCancel);
        this._onSearchAgencyBound = d.createListenerFunction(this, this._onSearchAgencyClick);
        this._btnAgency.addEventListener("click",
            this._onSearchAgencyBound);
        this._onSearchPeopleBound = d.createListenerFunction(this, this._onSearchPeople);
        this._btnPeople.addEventListener("click", this._onSearchPeopleBound);
        this._onArrowsClickBound = d.createListenerFunction(this, this._onArrowsClick);
        this._prevArrow.addEventListener("click", this._onArrowsClickBound);
        this._nextArrow.addEventListener("click", this._onArrowsClickBound);
        this._onValidateClickBound = d.createListenerFunction(this, this._onValidateClick);
        this._validateInputButton.addEventListener("click",
            this._onValidateClickBound);
        this._onInputFocusBound = d.createListenerFunction(this, this._onFocus);
        this._searchInputSuggestionContainer.addEventListener("click", this._onInputFocusBound);
        this._onInputSearchChangeBound = d.createListenerFunction(this, this._onSearchInputChange);
        this._searchInput.addEventListener("input", this._onInputSearchChangeBound);
        this._onInputSearchKeyDownBound = d.createListenerFunction(this, this._onSearchInputKeydown);
        this._onPeopleSelectBound = d.createListenerFunction(this, this._onPeopleSelect);
        this._peopleSelect.addEventListener(l.ON_PEOPLE_SELECTED, this._onPeopleSelectBound);
        this._onPeopleMenuOpenBound = d.createListenerFunction(this, this._onPeopleMenuOpen);
        this._peopleSelect.addEventListener(l.ON_PEOPLE_MENU_OPEN, this._onPeopleMenuOpenBound);
        this._buttonLock = !1;
        this._autocomplete = {
            query: "",
            suggestion: "",
            suggestions: [],
            currentSuggestion: 0,
            datas: []
        };
        this._onSearchAgency();
        return this
    };
    a.show = function() {
        b.addClass(this._container, "display")
    };
    a._onCancel = function() {
        this.setState(1)
    };
    a._onSearch =
        function() {
            this.setState(3)
        };
    a._onSearchCountry = function() {
        this.setState(2)
    };
    a._onSendOutSearch = function(a) {
        2 == this._controller.getState() ? (console.debug("Search for country", this._searchInputSpanValue.innerHTML), console.debug("Search for country", this._searchInputSpanValue.innerHTML), console.debug("Search for country", this._searchInputSpanValue.innerHTML), console.debug("Search for country", this._searchInputSpanValue.innerHTML), this._controller.searchForCountry(this._searchInputSpanValue.innerHTML)) :
            3 == this._controller.getState() && (a = k.model.getPosIndexWithAgyIndex(a.agencyIndex), console.debug("Search for Agency : ", a), this._controller.search(a))
    };
    a.lock = function() {
        this._buttonLock = !0;
        var a = document.createElement("div");
        a.className = "searchSoftLock";
        this._container.appendChild(a)
    };
    a.unlock = function() {
        this._buttonLock = !1;
        var a = document.querySelectorAll(".searchSoftLock");
        if (0 !== a.length)
            for (i in a) a[i].remove && a[i].remove()
    };
    a.showArrows = function() {
        this._prevArrow.style.display = "block";
        this._nextArrow.style.display =
            "block"
    };
    a.hideArrows = function() {
        this._prevArrow.style.display = "none";
        this._nextArrow.style.display = "none"
    };
    a.showCountryNoResult = function() {
        if (2 === this._state) {
            var a = k.assetManager.getAsset("CountryNoResultContent");
            document.querySelector("#LandingContent").appendChild(a);
            setTimeout(function() {
                b.addClass(a, "display")
            }, 1E3)
        }
    };
    a.hideCountryNoResult = function() {
        var a = document.querySelectorAll("#CountryNoResultContent");
        if (0 !== a.length)
            for (i in a)
                if (a[i].remove) {
                    var c = a[i];
                    b.removeClass(c, "display");
                    setTimeout(function() {
                        c.remove()
                    }, 500)
                }
    };
    a.setState = function(a) {
        if (this._buttonLock) return !1;
        b.removeClass(this._btnSearch, "selected");
        b.removeClass(this._btnCountry, "selected");
        d.removeDOMListener(this._btnSearch, "click", this._onCancelBound);
        d.removeDOMListener(this._btnSearch, "click", this._onSearchBound);
        d.removeDOMListener(this._btnCountry, "click", this._onCancelBound);
        d.removeDOMListener(this._btnCountry, "click", this._onSearchCountryBound);
        window.removeEventListener("keydown", this._onInputSearchKeyDownBound);
        this._genresFilter.close();
        this.hideCountryNoResult();
        this._controller.setState(a);
        this._state = a;
        switch (a) {
            case 1:
                d.addDOMListener(this._btnSearch, "click", this._onSearchBound);
                d.addDOMListener(this._btnCountry, "click", this._onSearchCountryBound);
                setTimeout(function() {
                    if (!b.hasClass(this._searchContainer, "visible")) this._searchContainer.style.display = "none"
                }.bind(this), 250);
                break;
            case 2:
                ga("send", "event", "desktop/click", "search", "desktop/events/btnWorld");
                this._autocomplete.datas = k.model.countries;
                console.log("Search for Country");
                this._onSearchAgency();
                b.addClass(this._btnCountry, "selected");
                b.removeClass(this._searchContainer, "searchWithButtons");
                d.addDOMListener(this._btnCountry, "click", this._onCancelBound);
                d.addDOMListener(this._btnSearch, "click", this._onSearchBound);
                break;
            case 3:
                ga("send", "event", "desktop/click", "search", "desktop/events/btnSearch");
                this._autocomplete.datas = k.model.agencies;
                b.addClass(this._btnSearch, "selected");
                b.addClass(this._searchContainer, "searchWithButtons");
                d.addDOMListener(this._btnSearch,
                    "click", this._onCancelBound);
                d.addDOMListener(this._btnCountry, "click", this._onSearchCountryBound);
                break;
            default:
                d.addDOMListener(this._btnSearch, "click", this._onSearchBound), d.addDOMListener(this._btnCountry, "click", this._onSearchCountryBound)
        }
        switch (a) {
            case 2:
            case 3:
                this._searchContainer.style.display = "block";
                setTimeout(function() {
                    b.addClass(this._searchContainer, "visible")
                }.bind(this), 1);
                window.addEventListener("keydown", this._onInputSearchKeyDownBound);
                this._searchInput.focus();
                this._resetInput();
                break;
            default:
                b.removeClass(this._searchContainer, "visible")
        }
        this._onSearchAgency();
        return !0
    };
    a._onFocus = function() {
        this._searchInput.focus()
    };
    a._onInputFocus = function() {};
    a._resetInput = function() {
        this._searchInput.value = "";
        this._onSearchInputChange();
        m = !1;
        b.removeClass(this._searchInputSuggestion, "validated")
    };
    a._onSearchInputChange = function() {
        var a = this._autocomplete.query = this._searchInput.value;
        console.log("query :|", a, "|", " is From Arrow : ", this._isFromArrow);
        this._searchInputSpanValue.innerHTML =
            a;
        this._searchInputSpanComplete.innerHTML = "";
        "" != a && !this._isFromArrow && this.dispatchCustomEvent(e.USER_TYPING);
        0 === this._autocomplete.query.length ? (suggestion = this._autocomplete.suggestion = "", this._autocomplete.suggestions = this._autocomplete.datas, this._searchInputSpanValue.innerHTML = "", this._searchInputSpanComplete.innerHTML = "Search", b.addClass(this._searchInputSpanComplete, "placeholder"), b.removeClass(this._validateInputButton, "clickable"), this.hideArrows()) : (b.removeClass(this._searchInputSpanComplete,
            "placeholder"), this._autocomplete.currentSuggestion = 0, this._autocomplete.suggestions = $.grep(this._autocomplete.datas, function(a) {
            return RegExp("^" + this._autocomplete.query + "", "i").test(a.name)
        }.bind(this)), this._autocomplete.suggestions[0] ? this._onSearchInputAutoSuggest(this._autocomplete.suggestions[0]) : this._onSearchInputAutoSuggest(), 1 < this._autocomplete.suggestions.length ? this.showArrows() : this.hideArrows(), this._isFromArrow = !1)
    };
    a._onSearchInputAutoSuggest = function(a) {
        a ? (this._autocomplete.suggestion =
            a, b.addClass(this._validateInputButton, "clickable")) : (this._autocomplete.suggestion = "", b.removeClass(this._validateInputButton, "clickable"));
        a = RegExp("(^" + this._autocomplete.query + ")(.*)", "i").exec(this._autocomplete.suggestion.name);
        if (null !== a) this._searchInputSpanValue.innerHTML = this._searchInput.value = a[1];
        if (null !== a && 2 < a.length) this._searchInputSpanComplete.innerHTML = a[2]
    };
    a._onSearchInputKeydown = function(a) {
        if (37 === a.which || 39 === a.which) a.preventDefault(), a.stopPropagation(), a.stopImmediatePropagation(),
            console.info("Landing keydown event is overrided"), 37 === a.which ? this._onArrowsClick({
                target: {
                    className: "prevArrow"
                }
            }) : this._onArrowsClick({
                target: {
                    className: "nextArrow"
                }
            });
        9 === a.which && (a.stopPropagation(), a.preventDefault(), console.debug("Start search with Tab"), this.validate(this._autocomplete.suggestion));
        13 === a.which && (a.stopPropagation(), a.preventDefault(), this.validate(this._autocomplete.suggestion))
    };
    a._onValidateClick = function() {
        b.hasClass(this._validateInputButton, "clickable") && this.validate(this._autocomplete.suggestion)
    };
    a.validate = function(a) {
        if (a) this._autocomplete.query = a.name, this._searchInput.value = this._autocomplete.query, this._searchInput.blur(), this._onSearchInputChange(), console.log("TODO: Validate search", a), this._onSendOutSearch(a), 3 === this._state && this.showArrows(), m = !0, b.addClass(this._searchInputSuggestion, "validated")
    };
    a._onArrowsClick = function(a) {
        this._isFromArrow = !0;
        console.debug("Shifting ");
        console.debug("Shifting ");
        console.debug("Shifting ");
        console.debug("Shifting ");
        console.debug("Shifting ");
        b.hasClass(a.target, "prevArrow") ? (a = this._controller.shift(-1), this._autocomplete.currentSuggestion = 0 > this._autocomplete.currentSuggestion - 1 ? this._autocomplete.suggestions.length - 1 : this._autocomplete.currentSuggestion - 1) : (a = this._controller.shift(1), this._autocomplete.currentSuggestion = this._autocomplete.currentSuggestion + 1 >= this._autocomplete.suggestions.length ? 0 : this._autocomplete.currentSuggestion + 1);
        if (m) {
            var c = k.model.getAgencyNameWithPosIndex(a); - 1 !== c && (a = $.grep(this._autocomplete.datas, function(a) {
                return a.name ===
                    c
            }), k.globalStateManager.getPage("Stats").fetch({
                type: 1,
                extra: a[0].agencyIndex
            }), this.validate(a[0]))
        } else this._onSearchInputAutoSuggest(this._autocomplete.suggestions[this._autocomplete.currentSuggestion])
    };
    a._onAbout = function() {
        k.globalStateManager.setPage("About")
    };
    a._onShare = function(a) {
        switch (a.target.className) {
            case "facebook":
                Social.facebook.share({
                    name: k.copyManager.getCopy("mobile.sharing.facebook.title"),
                    caption: "",
                    description: k.copyManager.getCopy("mobile.sharing.facebook.description"),
                    link: k.copyManager.getCopy("mobile.sharing.facebook.link"),
                    picture: window.location.protocol + "//" + window.location.hostname + "/common/files/images/social/spotifycannes_fb.jpg"
                });
                ga("send", "event", "desktop/click", "share", "desktop/events/btnShareFb");
                break;
            case "twitter":
                Social.twitter.share({
                    link: k.copyManager.getCopy("mobile.sharing.twitter.link"),
                    text: k.copyManager.getCopy("mobile.sharing.twitter.text")
                }), ga("send", "event", "desktop/click", "share", "desktop/events/btnShareTw")
        }
        console.info("TODO: implement social shares for : " +
            a.target.className)
    };
    a._onStats = function() {};
    a._onSearchAgencyClick = function(a) {
        b.hasClass(this._btnAgency, "selected") || (ga("send", "event", "desktop/click", "search", "desktop/search/btnAgency"), this._onSearchAgency(a))
    };
    a._onSearchAgency = function(a) {
        if (!b.hasClass(this._btnAgency, "selected")) void 0 != a && this._controller.setState(3), this.dispatchCustomEvent(e.START_SEARCHING), b.addClass(this._btnAgency, "selected"), b.removeClass(this._btnPeople, "selected"), b.addClass(this._searchContainer, "searchAgency"),
            b.removeClass(this._searchContainer, "searchPeople"), this._searchInputWrapper.style.display = "block", this._resetInput(), g.createWithAnimation(this._searchInputWrapper, 0, -60, 0, 0, 1.25, TWEEN.Easing.Exponential.Out, 0.2, null, !1), g.createWithAnimation(this._peopleSelectWrapper, 0, 0, 0, -60, 1.25, TWEEN.Easing.Exponential.Out, 0, function() {
                if (b.hasClass(this._btnAgency, "selected")) this._peopleSelectWrapper.style.display = "none"
            }.bind(this), !1), f.createWithAnimation(this._searchInputWrapper, 0, 1, 1, TWEEN.Easing.Exponential.Out,
                0.2), f.createWithAnimation(this._peopleSelectWrapper, 1, 0, 1, TWEEN.Easing.Exponential.Out, 0)
    };
    a._onSearchPeople = function() {
        if (!b.hasClass(this._btnPeople, "selected")) console.log("Search for People"), this._controller.setState(6), ga("send", "event", "desktop/click", "search", "desktop/search/btnPeople"), b.addClass(this._btnPeople, "selected"), b.removeClass(this._btnAgency, "selected"), b.addClass(this._searchContainer, "searchPeople"), b.removeClass(this._searchContainer, "searchAgency"), this._peopleSelectWrapper.style.display =
            "block", g.createWithAnimation(this._searchInputWrapper, 0, 0, 0, -60, 1.25, TWEEN.Easing.Exponential.Out, 0, function() {
                if (b.hasClass(this._btnPeople, "selected")) this._searchInputWrapper.style.display = "none"
            }.bind(this), !1), g.createWithAnimation(this._peopleSelectWrapper, 0, -60, 0, 0, 1.25, TWEEN.Easing.Exponential.Out, 0.2, null, !1), f.createWithAnimation(this._searchInputWrapper, 1, 0, 1, TWEEN.Easing.Exponential.Out, 0), f.createWithAnimation(this._peopleSelectWrapper, 0, 1, 1, TWEEN.Easing.Exponential.Out, 0.2), this.dispatchCustomEvent(e.SEARCH_PEOPLE, {
                index: -1
            })
    };
    a._onPeopleSelect = function(a) {
        this.dispatchCustomEvent(e.SEARCH_PEOPLE, {
            index: a.detail.index
        })
    };
    a._onPeopleMenuOpen = function() {
        this.dispatchCustomEvent(e.PEOPLE_MENU_OPEN)
    };
    a._onGenreFilter = function() {
        this.dispatchCustomEvent(e.FILTER_GENRE)
    };
    a._filterGenreWithIndex = function(a) {
        this.dispatchCustomEvent(e.FILTER_GENRE_WITH_INDEX, a)
    };
    a._onCloseGenreFilter = function() {
        this.dispatchCustomEvent(e.CLOSE_FILTER_GENRE)
    }
});
breelNS.defineClass(breelNS.projectName + ".page.LandingPage", "generic.templates.BasicPage", function(a) {
    var c = breelNS.getNamespace("generic.events").ListenerFunctions,
        e = breelNS.getNamespace("generic.htmldom").ElementUtils;
    breelNS.getNamespace("generic.utils");
    var b = breelNS.getNamespace("generic.animation").DomElementOpacityTween,
        d = breelNS.getNamespace(breelNS.projectName + ".page.landing").SearchPanel,
        f = breelNS.getNamespace(breelNS.projectName + ".canvas").CanvasRenderer,
        g = breelNS.getNamespace(breelNS.projectName +
            ".page.landing").ParticleController,
        h = breelNS.getNamespace(breelNS.projectName + ".page.landing").FallingImages,
        l = breelNS.getNamespace(breelNS.projectName + ".page.landing").ProfileParticleController,
        k = breelNS.getNamespace(breelNS.projectName + ".page.landing").ExpandedProfileController,
        m;
    a.initialize = function() {
        m = breelNS.getNamespace(breelNS.projectName).singletons.siteManager;
        this.template = m.assetManager.getAsset("LandingContent");
        this._canvas = document.createElement("canvas");
        this._canvas.width = window.innerWidth;
        this._canvas.height = window.innerHeight;
        this._canvas.style.position = "absolute";
        this._cursorHolder = document.createElement("div");
        this.container.appendChild(this._cursorHolder);
        this._cursorHolder.className = "cursorHolder";
        this._arriveCount = 0;
        this.hasExplored = this._isInParticleClickAnim = !1;
        this.renderer = f.createRenderer(this._canvas, m.config.config.force2D);
        this.renderer._y = -100;
        this._onParticleClickBound = c.createListenerFunction(this, this._onParticleClick);
        this.renderer.addEventListener(f.ON_PARTICLE_CLICK,
            this._onParticleClickBound);
        this.profileParticleController = new l;
        debugger;
        this.profileParticleController.init($$document.querySelector(".profileParticleWrapper_desktop"));
        this._onProfileParticleClickBound = c.createListenerFunction(this, this._onProfileParticleClick);
        this.profileParticleController.addEventListener(l.ON_PROFILE_PARTICLE_CLICK, this._onProfileParticleClickBound);
        this.expandedProfileController = new k;
        this.expandedProfileController.init($$document.querySelector(".expandedProfileWrapper"));
        this._onExpandedProfileBgClickBound =
            c.createListenerFunction(this, this._onExpandedProfileBgClick);
        this.expandedProfileController.addEventListener(k.ON_BG_CLICK, this._onExpandedProfileBgClickBound);
        this.container.appendChild(this.template);
        this.container.appendChild(this._canvas);
        this._copyContainer = $$document.querySelector(".landingCopyContainer");
        this._copyContainer.style.marginTop = -this._copyContainer.clientHeight + 140 + "px";
        this._btnExplore = $$document.querySelector("#btnExplore");
        this._btnExplore.style.marginLeft = 0.5 * (this._copyContainer.clientWidth -
            this._btnExplore.clientWidth + 15) + "px";
        this.checkIpadOrientation();
        for (var a = [], b = 1; 15 > b; b++) {
            var e = b.toString();
            10 > b && (e = "0" + b.toString());
            e = m.assetManager.assets["intro_cover" + e];
            e.width = 130;
            e.height = 130;
            a.push(e)
        }
        this._controller = (new g).init(this.renderer);
        this._searchPanel = (new d).init($$document.querySelector(".landingSearchPanel"), this._controller);
        this._fallingImages = (new h).init(this.container, a, a.length);
        this._controller.lock(!0);
        this._searchPanel.lock();
        this._onParticleOverBound = c.createListenerFunction(this,
            this._onParticleOver);
        this._onParticleOutBound = c.createListenerFunction(this, this._onParticleOut);
        this._onNewCloudsBound = c.createListenerFunction(this, this._onNewClouds);
        this._controller.addEventListener(g.ON_PARTICLE_ROLLOVER, this._onParticleOverBound);
        this._controller.addEventListener(g.ON_PARTICLE_ROLLOUT, this._onParticleOutBound);
        this._controller.addEventListener(g.ON_NEW_CLOUDS, this._onNewCloudsBound);
        this._onExploreBound = c.createListenerFunction(this, this._onExplore);
        c.addDOMListener(this._btnExplore,
            "click", this._onExploreBound);
        this._filterGenreBound = c.createListenerFunction(this, this._filterGenre);
        this._filterGenreWithIndexBound = c.createListenerFunction(this, this._filterGenreWithIndex);
        this._closeFilterGenreBound = c.createListenerFunction(this, this._closeFilterGenre);
        this._onTypingBound = c.createListenerFunction(this, this._onTyping);
        this._onSearchPeopleBound = c.createListenerFunction(this, this._onSearchPeople);
        this._onTransitionStartBound = c.createListenerFunction(this, this._onTransitionStart);
        this._onPeopleOpenBound = c.createListenerFunction(this, this._onPeopleOpen);
        this._controller.addEventListener(g.ON_TRANSITION_START, this._onTransitionStartBound);
        this._searchPanel.addEventListener(d.FILTER_GENRE, this._filterGenreBound);
        this._searchPanel.addEventListener(d.FILTER_GENRE_WITH_INDEX, this._filterGenreWithIndexBound);
        this._searchPanel.addEventListener(d.CLOSE_FILTER_GENRE, this._closeFilterGenreBound);
        this._searchPanel.addEventListener(d.USER_TYPING, this._onTypingBound);
        this._searchPanel.addEventListener(d.SEARCH_PEOPLE,
            this._onSearchPeopleBound);
        this._searchPanel.addEventListener(d.PEOPLE_MENU_OPEN, this._onPeopleOpenBound);
        this._onImageArriveBound = c.createListenerFunction(this, this._onImageArrive);
        this._fallingImages.addEventListener(h.IMAGE_ARRIVED, this._onImageArriveBound);
        this._onProfileParticleControllerAllZoomedOutBound = c.createListenerFunction(this, this._onProfileParticleControllerAllZoomedOut);
        this._onProfileParticleControllerAllZoomedInBound = c.createListenerFunction(this, this._onProfileParticleControllerAllZoomedIn);
        this.profileParticleController.addEventListener(l.ON_ALL_ZOOMED_OUT, this._onProfileParticleControllerAllZoomedOutBound);
        this.profileParticleController.addEventListener(l.ON_ALL_ZOOMED_IN, this._onProfileParticleControllerAllZoomedInBound);
        var q = this;
        window.addEventListener("resize", function(a) {
            q._onResize(a)
        });
        window.addEventListener("keydown", function(a) {
            q._onKeyDown(a)
        });
        m.model.getInitUsers(this, function(a) {
            q._initData = a;
            q._numParticlesPerStep = q._initData.length / q._fallingImages.length;
            q._controller.initialParticlesLenght =
                q._initData.length;
            q._controller.setState(0)
        }, Math.floor(m.settings.params.numParticles))
    };
    a._onProfileParticleControllerAllZoomedIn = function() {
        this._controller.lock(!1);
        this._searchPanel.unlock()
    };
    a._onProfileParticleControllerAllZoomedOut = function() {
        console.log("Put back DAta ", this.putBackData);
        this._isInParticleClickAnim && 0 < this.putBackData.length && this._controller.addPutBackParticles(this.putBackData);
        this._isInParticleClickAnim = !1
    };
    a._onPeopleOpen = function() {
        this.expandedProfileController.hide()
    };
    a._onExpandedProfileBgClick = function() {
        this.expandedProfileController.hide();
        m.globalStateManager.getPage("Stats").open();
        m.scheduler.delay(this._controller, this._controller.lock, [!1], 500)
    };
    a._onProfileParticleClick = function(a) {
        console.log("Profile particle clicked");
        this._controller.lock(!0);
        a = a.detail;
        void 0 !== a && (this.expandedProfileController.setData(a), this.expandedProfileController.show(), m.globalStateManager.getPage("Stats").close())
    };
    a._onNewClouds = function() {
        this.profileParticleController.removeParticles()
    };
    a._onTransitionStart = function(a) {
        this.profileParticleController.removeParticles();
        4 == a.detail.state ? this._searchPanel.showArrows() : this._searchPanel.hideArrows();
        this._searchPanel.lock();
        0 != this._controller.getState() && m.scheduler.delay(this._searchPanel, this._searchPanel.unlock, [], 3E3)
    };
    a._onTyping = function() {
        this._controller.typing()
    };
    a._onSearchPeople = function(a) {
        this._controller.searchForPeople(a.detail.index)
    };
    a._onParticleClick = function(a) {
        if (5 != this._controller.getState() && (this._isInParticleClickAnim = !0, !this.profileParticleController._particleAnimationsInProgress)) this.putBackData = this.profileParticleController.removeParticlesAndShowNew(a.detail.particle.userObject), console.debug("putback  : ", this.putBackData), this._onParticleOut(), this._searchPanel.lock()
    };
    a._onImageArrive = function(a) {
        for (var b = [], c = [], d = 0; d++ < this._numParticlesPerStep && 0 < this._initData.length;) {
            var e = this._initData.pop(),
                f = {
                    origin: {
                        x: a.detail,
                        y: 0
                    }
                };
            b.push(e);
            c.push(f)
        }
        this._arriveCount++;
        this._controller.addParticles(b, c);
        this._controller.offsetGlobalRadius(50);
        this._arriveCount >= this._fallingImages.length && (this._fallingImages.destroy(), m.scheduler.delay(this._controller, this._controller.setState, [1], 200), m.scheduler.delay(this, this.animComplete, [], 500))
    };
    a.animComplete = function() {
        m.scheduler.delay(this.profileParticleController, this.profileParticleController.showIntro, [], 0);
        setTimeout(this._showUi.bind(this), 3E3)
    };
    a._showUi = function() {
        var a = $$document.querySelector(".mobilePush");
        CSSanimate.to(a, {
            opacity: 1
        }, {
            duration: 400,
            ease: "easeInOutQuad",
            delay: 0
        }, function() {}.bind(this));
        m.globalStateManager.getPage("Header").show();
        m.globalStateManager.getPage("Footer").show();
        this._searchPanel.show();
        m.globalStateManager.getPage("Stats").fetch({
            type: 0
        })
    };
    a._onExplore = function() {
        if (!this.hasExplored)
            if (this.hasExplored = !0, void 0 == this._initData) console.log("Waiting for data"), m.scheduler.next(this, this._onExplore, []);
            else {
                ga("send", "event", "desktop/click", "landing", "btnExplore");
                var a = this;
                b.createWithAnimation(this._copyContainer,
                    1, 0, 0.5, TWEEN.Easing.Exponential.Out, 0, function() {
                        a._copyContainer.style.display = "none"
                    });
                m.config.config.skipIntro ? (e.addClass(document.body, "dark"), this._fallingImages.destroy(), this._controller.setState(1), this._controller.initParticles(), this.animComplete()) : this._fallingImages.start();
                ga("send", "pageview", {
                    page: "desktop/pages/landing",
                    title: "desktop/pages/landing"
                })
            }
    };
    a._onParticleOver = function(a) {
        e.addClass(document.body, "hideCursor");
        e.addClass(this._cursorHolder, "display");
        this._cursorHolder.style.left =
            a.detail.x - 10 + "px";
        this._cursorHolder.style.top = a.detail.y - 10 + "px"
    };
    a._onParticleOut = function() {
        e.removeClass(this._cursorHolder, "display");
        e.removeClass(document.body, "hideCursor")
    };
    a._filterGenre = function() {
        console.log("_filterGenre");
        this._controller.setState(5);
        this._controller.filterGenre(-1)
    };
    a._filterGenreWithIndex = function(a) {
        console.log("_filterGenreWithIndex");
        this._controller.filterGenre(a.detail)
    };
    a._closeFilterGenre = function() {
        console.log("_closeFilterGenre");
        this._controller.filterGenre(-1);
        this._controller.setState(1)
    };
    a.open = function() {
        CSSanimate.fromTo($(".landingTitle")[0], {
            transform: "translateY(50px)",
            opacity: 0
        }, {
            transform: "translateY(0px)",
            opacity: 1
        }, {
            ease: "easeOutSine",
            duration: 1E3,
            delay: 50
        }, function() {}.bind(this));
        CSSanimate.fromTo($(".landingText")[0], {
            transform: "translateY(50px)",
            opacity: 0
        }, {
            transform: "translateY(0px)",
            opacity: 1
        }, {
            ease: "easeOutSine",
            duration: 1E3,
            delay: 250
        }, function() {}.bind(this));
        CSSanimate.fromTo($(".instructions")[0], {
            opacity: 0
        }, {
            opacity: 1
        }, {
            ease: "easeOutSine",
            duration: 1E3,
            delay: 700
        }, function() {
            this.setOpened()
        }.bind(this));
        CSSanimate.fromTo($("#btnExplore")[0], {
            opacity: 0
        }, {
            opacity: 1
        }, {
            ease: "easeOutSine",
            duration: 1E3,
            delay: 800
        }, function() {
            this.setOpened()
        }.bind(this));
        ga("send", "pageview", {
            page: "desktop/pages/loading",
            title: "desktop/pages/loading"
        });
        this._searchPanel.lock()
    };
    a.close = function() {
        this.setClosed()
    };
    a._onResize = function() {
        console.log("Resizing");
        var a = window.innerWidth,
            b = window.innerHeight;
        this.renderer.resize(a, b);
        this._fallingImages.resize(a,
            b);
        this.profileParticleController.onResize(a, b, !0);
        this.expandedProfileController.onResize();
        this.checkIpadOrientation()
    };
    a.checkIpadOrientation = function() {
        window.browserDetector._isTabletDevice && (window.innerWidth < window.innerHeight ? this.showIpadNoPortrait() : this.hideIpadNoPortrait())
    };
    a.showIpadNoPortrait = function() {
        var a = m.assetManager.getAsset("IPADnoPortraitContent");
        document.querySelector("body").appendChild(a);
        setTimeout(function() {
            e.addClass(a, "display")
        }, 1)
    };
    a.hideIpadNoPortrait = function() {
        var a =
            document.querySelectorAll("#IPADnoPortraitContent");
        if (0 !== a.length)
            for (i in a)
                if (a[i].remove) {
                    var b = a[i];
                    e.removeClass(b, "display");
                    setTimeout(function() {
                        b.remove()
                    }, 500)
                }
    };
    a._onKeyDown = function(a) {
        83 != a.keyCode && 68 != a.keyCode && 71 != a.keyCode && 67 != a.keyCode && (48 <= a.keyCode && 57 > a.keyCode || (37 == a.keyCode ? this._controller.shift(-1) : 39 == a.keyCode && this._controller.shift(1)))
    }
});
breelNS.defineClass(breelNS.projectName + ".page.HomePage", "generic.templates.BasicPage", function(a) {
    breelNS.getNamespace("generic.animation");
    breelNS.getNamespace("generic.events");
    breelNS.getNamespace("generic.core");
    breelNS.getNamespace("generic.events");
    breelNS.getNamespace("generic.htmldom");
    breelNS.getNamespace("generic.htmldom");
    breelNS.getNamespace(breelNS.projectName + ".canvas");
    breelNS.getNamespace(breelNS.projectName + ".canvas");
    a.initialize = function() {
        console.log("init");
        breelNS.getNamespace(breelNS.projectName);
        var a = document.createElement("h1");
        this.container.appendChild(a);
        a.innerHTML = "HomePage"
    };
    a.open = function() {
        console.log("Open");
        this.setOpened()
    };
    a.close = function() {
        console.log("Close");
        this.setClosed()
    }
});
breelNS.defineClass(breelNS.projectName + ".page.HeaderPage", "generic.templates.BasicPage", function(a) {
    breelNS.getNamespace("generic.animation");
    var c;
    a.initialize = function() {
        c = breelNS.getNamespace(breelNS.projectName).singletons.siteManager;
        this._template = c.assetManager.getAsset("HeaderContent");
        this._isOpened = !1;
        this.container.appendChild(this._template);
        CSS.set(this.container, {
            opacity: 0
        })
    };
    a.open = function() {
        this.setOpened()
    };
    a.show = function() {
        if (!this._isOpened) this._isOpened = !0, CSSanimate.to(this.container, {
            opacity: 1
        }, {
            duration: 400,
            ease: "easeInOutQuad",
            delay: 0
        }, function() {}.bind(this))
    };
    a.close = function() {
        this.setClosed()
    }
});
breelNS.defineClass(breelNS.projectName + ".page.FooterPage", "generic.templates.BasicPage", function(a) {
    breelNS.getNamespace("generic.animation");
    var c;
    a.initialize = function() {
        c = breelNS.getNamespace(breelNS.projectName).singletons.siteManager;
        this._template = c.assetManager.getAsset("FooterContent");
        this._isOpened = !1;
        this.container.appendChild(this._template);
        CSS.set(this.container, {
            opacity: 0
        })
    };
    a.open = function() {
        this.setOpened()
    };
    a.show = function() {
        if (!this._isOpened) this._isOpened = !0, CSSanimate.to(this.container, {
            opacity: 1
        }, {
            duration: 400,
            ease: "easeInOutQuad",
            delay: 0
        }, function() {}.bind(this))
    };
    a.close = function() {
        this.setClosed()
    }
});
breelNS.defineClass(breelNS.projectName + ".page.AboutPage", "generic.templates.BasicPage", function(a, c) {
    var e = breelNS.getNamespace("generic.animation").DomElementOpacityTween,
        b = breelNS.getNamespace("generic.events").ListenerFunctions,
        d;
    a.initialize = function() {
        d = breelNS.getNamespace(breelNS.projectName).singletons.siteManager;
        this._template = d.assetManager.getAsset("AboutContent");
        this.container.appendChild(this._template);
        this._aboutIntroWrapper = this.container.querySelector(".aboutIntroWrapper");
        this._tAndCWrapper =
            this.container.querySelector(".tAndCWrapper");
        this._onCloseBtnClickBound = b.createListenerFunction(this, this._onCloseBtnClick);
        this._showtAndCTimer = null;
        this._showtAndCDelay = 6E3;
        this._aboutIntroWrapper.style.display = "block";
        this._aboutIntroWrapper.style.opacity = 1;
        this._tAndCWrapper.style.display = "none";
        this._tAndCWrapper.style.opacity = 0;
        this.container.addEventListener("click", function() {
            d.globalStateManager.preState()
        })
    };
    a.setOpened = function() {
        c.setOpened.call(this)
    };
    a.hideAboutIntro = function() {
        e.createWithAnimation(this._aboutIntroWrapper,
            1, 0, 0.5, TWEEN.Easing.Exponential.Out, 0, function() {})
    };
    a.showTAndC = function(a) {
        e.createWithAnimation(this._tAndCWrapper, 0, 1, 0.5, TWEEN.Easing.Exponential.Out, a, function() {})
    };
    a._onCloseBtnClick = function() {
        d.globalStateManager.preState();
        ga("send", "pageview", {
            page: "desktop/pages/landing",
            title: "desktop/pages/landing"
        })
    };
    a.open = function() {
        var a = this;
        e.createWithAnimation(this.container, 0, 1, 0.5, TWEEN.Easing.Exponential.Out, 0, function() {
            console.log("Set OPENED");
            a.setOpened();
            ga("send", "pageview", {
                page: "desktop/pages/about",
                title: "desktop/pages/about"
            })
        })
    };
    a.close = function() {
        clearTimeout(this._showtAndCTimer);
        var a = this;
        e.createWithAnimation(this.container, 1, 0, 0.5, TWEEN.Easing.Exponential.Out, 0, function() {
            a.setClosed()
        })
    }
});
breelNS.defineClass(breelNS.projectName + ".page.StatsPage", "generic.templates.BasicPage", function(a, c, e) {
    var b = breelNS.getNamespace("generic.htmldom").ElementUtils,
        d = breelNS.getNamespace("generic.events").ListenerFunctions,
        f = breelNS.getNamespace("spotify.common.model.backendmanager").ServiceID,
        g = breelNS.getNamespace("spotify.common.model.data.statistics").StatisticsDataSend,
        h, l = [{
            name: "Suits",
            serverName: "Business",
            serverID: 0,
            copyID: 0
        }, {
            name: "Entertainers",
            serverName: "Film, Music & Entertainment",
            serverID: 1,
            copyID: 1
        }, {
            name: "Creatives",
            serverName: "Creative",
            serverID: 2,
            copyID: 2
        }, {
            name: "Journos",
            serverName: "Journalist",
            serverID: 3,
            copyID: 3
        }, {
            name: "Marketeers",
            serverName: "Marketing & Social",
            serverID: 4,
            copyID: 4
        }, {
            name: "Media peeps",
            serverName: "Media",
            serverID: 5,
            copyID: 5
        }, {
            name: "Techies",
            serverName: "Technology",
            serverID: 6,
            copyID: 6
        }, {
            name: "Fashionistas",
            serverName: "Fashion & Design",
            serverID: 7,
            copyID: 7
        }, {
            name: "Social wizards",
            serverName: "Social Media gurus",
            serverID: 10,
            copyID: 9
        }, {
            name: "Brand gurus",
            serverName: "Brand",
            serverID: 9,
            copyID: 10
        }, {
            name: "The Interactives",
            serverName: "Interactive",
            serverID: 11,
            copyID: 11
        }, {
            name: "Speakers",
            serverName: "Speakers",
            serverID: 12,
            copyID: 8
        }];
    a.initialize = function(a, c) {
        h = breelNS.getNamespace(breelNS.projectName).singletons.siteManager;
        this.template = h.assetManager.getAsset("StatsContainer").innerHTML;
        this._isExtended = a || !1;
        this._closeCallback = c;
        this.el = document.createElement("div");
        this._isExtended ? this.el.className = "extendedWidget" : (this.el.className = "mainWidget", this.container.appendChild(this.el));
        this.el.innerHTML = this.template;
        this._widgetContainer = this.el.querySelector(".widgetContainer");
        this._title = this.el.querySelector(".title");
        this._mainTitle = this.el.querySelector("h1");
        this._currentCount = this.el.querySelector(".currentCount");
        this._totalCount = this.el.querySelector(".totalCount");
        this._timerElement = this.el.querySelector(".timer");
        this._prevButton = this.el.querySelector(".paginator .prev");
        this._nextButton = this.el.querySelector(".paginator .next");
        this._onNavigationBound = d.createListenerFunction(this,
            this._onNavigation);
        d.addDOMListener(this._prevButton, "click", this._onNavigationBound);
        d.addDOMListener(this._nextButton, "click", this._onNavigationBound);
        this._currentIndex = 0;
        this._currentWidget = null;
        this._widgets = [];
        b.addClass(this.el, "closed");
        this.setOpened();
        this._params = {
            type: 0,
            extra: 0
        };
        return this
    };
    a.clearDatas = function() {
        this.datas = null;
        this.mainTitle = this.title = ""
    };
    a.fetch = function(a) {
        if (a) {
            this._params.type = a.type || 0;
            this._params.extra = a.extra;
            if (this._isExtended && 3 === this._params.type &&
                -1 === this._params.extra) this._params.extra = 0;
            this._isExtended || this.openExtended();
            this.close();
            a = new g(this._params);
            h.backendManager.load(!this._isExtended ? f.GET_STATISTICS : f.GET_STATISTICS_LIST, a, function(a, b) {
                a === this._params.extra && (console.debug("Update Data : ", b), b.data.statistics ? this.updateDatas(b.data.statistics) : this.updateDatas(b.data))
            }.bind(this, this._params.extra), function() {
                console.error(arguments)
            })
        } else console.warn("You tried to fecth statistics data without parameters.")
    };
    a.updateDatas =
        function(a) {
            "debugDatas" === a && (a = DUMMY_STATS);
            var c = b.hasClass(this.el, "closed");
            b.addClass(this.el, "closed");
            setTimeout(function() {
                this.clearDatas();
                this.datas = a;
                switch (this._params.type) {
                    case 0:
                        this.title = "Cannes";
                        this.mainTitle = "Cannes Statistics";
                        break;
                    case 1:
                        this.title = h.model.getAgencyNameWithIndex(this._params.extra);
                        this.mainTitle = "Company Statistics";
                        break;
                    case 2:
                        this.title = this._params.extra;
                        this.mainTitle = "Country Statistics";
                        break;
                    case 3:
                        if (-1 !== this._params.extra)
                            for (var c in l) {
                                if (this._params.extra ===
                                    l[c].serverID) this.title = h.copyManager._copyDocument["common.professions.id_" + l[c].copyID]
                            } else this.title = "All professions";
                        this.mainTitle = "Profession Statistics";
                        break;
                    default:
                        this.mainTitle = this.title = "Statistics"
                }
                this._createWidgets(this.datas);
                this._initTimer();
                this._isExtended || (b.removeClass(this.el, "closed"), this._extended && b.removeClass(this._extended.el, "closed"))
            }.bind(this), c ? 0 : 500)
        };
    a.open = function() {
        null === this.datas || void 0 === this.datas ? console.warn("Stats widget has no data to display") :
            (b.hasClass(this.el, "closed") && this._initTimer(), setTimeout(function() {
                b.removeClass(this.el, "closed")
            }.bind(this), 100), this._extended && this._extended.open())
    };
    a.close = function() {
        if (this._closeCallback) {
            var a = this._closeCallback;
            this._closeCallback = null;
            a()
        } else this._timer && clearTimeout(this._timer), this._extended && this._extended.close(), b.addClass(this.el, "closed")
    };
    a.openExtended = function(a) {
        console.debug(this);
        if (!this._extended) this._extended = (new e).initialize(!0, a), this.container.appendChild(this._extended.el);
        this._extended.fetch(this._params);
        console.log("debug");
        console.log("debug");
        console.log("debug");
        console.log(this);
        return this._extended
    };
    a.closeExtended = function() {
        if (!this._extended) return !1;
        this._extended.close();
        return !1
    };
    a._initTimer = function() {
        this._isExtended || (b.removeClass(this._timerElement, "running"), this._timerElement.style["-moz-transition-duration"] = "0ms", this._timerElement.style["-o-transition-duration"] = "0ms", this._timerElement.style["-webkit-transition-duration"] = "0ms", this._timerElement.style["transition-duration"] =
            "0ms", setTimeout(function() {
                b.addClass(this._timerElement, "running");
                this._timer && clearTimeout(this._timer);
                this._timer = setTimeout(this._onNavigation.bind(this, "next"), 6E3);
                this._timerElement.style["-moz-transition-duration"] = "6000ms";
                this._timerElement.style["-o-transition-duration"] = "6000ms";
                this._timerElement.style["-webkit-transition-duration"] = "6000ms";
                this._timerElement.style["transition-duration"] = "6000ms"
            }.bind(this), 500))
    };
    a._render = function() {
        this._mainTitle.innerHTML = this.mainTitle ? this.mainTitle :
            "Statistics";
        this._title.innerHTML = this._widgets[this._currentIndex] && this._widgets[this._currentIndex].title ? this._widgets[this._currentIndex].title : this.title ? this.title : "Statistics";
        this._currentCount.innerHTML = this._currentIndex + 1;
        this._totalCount.innerHTML = this._widgets.length
    };
    a._createWidgets = function(a) {
        this._clearWidgets();
        for (var c in a) this._addWidget(c, a[c]);
        for (var d in this._widgets)
            if (0 != d) this._widgets[d].el.style.left = "200%";
        setTimeout(function() {
            if (this._widgets.length && (this._widgets[this._currentIndex].el.style.left =
                "0%", b.addClass(this._widgets[this._currentIndex].el, "animated"), this._isExtended)) this._widgetContainer.style.height = this._widgets[this._currentIndex].el.offsetHeight + "px"
        }.bind(this), 100);
        this._render()
    };
    a._clearWidgets = function() {
        for (var a; this._widgets.length;) a = this._widgets.pop(), a.close(), this._widgetContainer.removeChild(a.el);
        for (; this._widgetContainer.lastElementChild;) this._widgetContainer.removeChild(this._widgetContainer.lastElementChild);
        this._currentIndex = 0;
        this._render()
    };
    a._addWidget =
        function(a, b) {
            this._isExtended ? this._addExtendedWidget(a, b) : this._addMainWidget(a, b)
        };
    a._addMainWidget = function(a, b) {
        var c;
        switch (a) {
            case "tempo":
                c = (new(breelNS.getNamespace(breelNS.projectName + ".page.stats.widgets").TempoStatsWidget)).initialize(b);
                break;
            case "genres":
                c = (new(breelNS.getNamespace(breelNS.projectName + ".page.stats.widgets").GenresStatsWidget)).initialize(b);
                break;
            case "mood":
                c = (new(breelNS.getNamespace(breelNS.projectName + ".page.stats.widgets").MoodStatsWidget)).initialize(b);
                break;
            case "hotttnesss":
                c = (new(breelNS.getNamespace(breelNS.projectName + ".page.stats.widgets").MainstreamStatsWidget)).initialize(b);
                break;
            case "energy":
                c = (new(breelNS.getNamespace(breelNS.projectName + ".page.stats.widgets").EnergyStatsWidget)).initialize(b);
                break;
            default:
                return
        }
        c && (this._widgets.push(c), this._widgetContainer.appendChild(c.el))
    };
    a._addExtendedWidget = function(a, b) {
        var c;
        c = (new(breelNS.getNamespace(breelNS.projectName + ".page.stats.widgets").ExtendedStatsWidget)).initialize(b, a);
        this._widgets.push(c);
        this._widgetContainer.appendChild(c.el)
    };
    a._onNavigation = function(a) {
        if (this._widgets.length) {
            var c = !1;
            "next" === a && (c = !0);
            a.target && (c = b.hasClass(a.target, "next"));
            c ? (this._widgets[this._currentIndex].el.style.left = "-150%", this._currentIndex = (this._currentIndex + 1) % this._widgets.length, b.removeClass(this._widgets[this._currentIndex].el, "animated"), this._widgets[this._currentIndex].el.style.left = "150%") : (this._widgets[this._currentIndex].el.style.left = "150%", this._currentIndex = 0 > this._currentIndex -
                1 ? this._widgets.length - 1 : this._currentIndex - 1, b.removeClass(this._widgets[this._currentIndex].el, "animated"), this._widgets[this._currentIndex].el.style.left = "-150%");
            setTimeout(function() {
                b.addClass(this._widgets[this._currentIndex].el, "animated");
                this._widgets[this._currentIndex].el.style.left = "0%"
            }.bind(this), 1);
            if (0 !== this._widgets[this._currentIndex].el.offsetTop) this._widgets[this._currentIndex].el.style.top = -this._widgets[this._currentIndex].el.offsetTop + "px";
            if (this._isExtended) this._widgetContainer.style.height =
                this._widgets[this._currentIndex].el.offsetHeight + "px";
            this._initTimer();
            this._render()
        }
    }
});
breelNS.defineClass(breelNS.projectName + ".page.stats.widgets.TempoStatsWidget", "generic.templates.BasicPage", function(a) {
    var c = breelNS.getNamespace("generic.htmldom").ElementUtils;
    breelNS.getNamespace("generic.events");
    var e, b = [1.5, 1.5, 1.5, 1.5, 1, 1, 1, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2];
    a.initialize = function(a) {
        e = breelNS.getNamespace(breelNS.projectName).singletons.siteManager;
        this.template = e.assetManager.getAsset("StatsTempoContent");
        this.el = document.createElement("div");
        this.el.className = "tempoStatsWidget";
        this.el.innerHTML = this.template.innerHTML;
        this._copy = this.el.querySelector(".copy");
        this._spectrumUl = this.el.querySelector(".spectrum");
        this.initSpectrum();
        this._tempo = a;
        this._timer = setInterval(this.pulse.bind(this), 1E3 * (1 / (a / 60)));
        this.render();
        return this
    };
    a.initSpectrum = function() {
        var a, c, e;
        for (e in b) a = document.createElement("li"), c = document.createElement("div"),
            c.className = "mask", b[e] = {
                coef: b[e],
                mask: c
            }, c.style.height = 35 * Math.random() + "%", a.appendChild(c), this._spectrumUl.appendChild(a)
    };
    a.pulse = function() {
        c.removeClass(this._spectrumUl, "animated");
        for (var a in b) b[a].mask.style.height = 35 * b[a].coef * Math.random() + "%";
        setTimeout(function() {
            c.addClass(this._spectrumUl, "animated")
        }.bind(this), 10)
    };
    a.render = function() {
        this._copy.innerHTML = 90 > this._tempo ? e.copyManager.getCopy("desktop.cannes.stats.tempo.id_0") : 130 > this._tempo ? e.copyManager.getCopy("desktop.cannes.stats.tempo.id_1") :
            155 > this._tempo ? e.copyManager.getCopy("desktop.cannes.stats.tempo.id_2") : e.copyManager.getCopy("desktop.cannes.stats.tempo.id_3")
    };
    a.open = function() {
        this.setOpened()
    };
    a.close = function() {
        clearInterval(this._timer);
        this.setClosed()
    }
});
breelNS.defineClass(breelNS.projectName + ".page.stats.widgets.GenresStatsWidget", "generic.templates.BasicPage", function(a) {
    breelNS.getNamespace("generic.htmldom");
    breelNS.getNamespace("generic.events");
    var c;
    a.initialize = function(a) {
        c = breelNS.getNamespace(breelNS.projectName).singletons.siteManager;
        this.template = c.assetManager.getAsset("StatsGenreContent");
        this.el = document.createElement("div");
        this.el.className = "genresStatsWidget";
        this.el.innerHTML = this.template.innerHTML;
        this._highlight = this.el.querySelector(".highlight");
        this._barsUl = this.el.querySelector(".bars");
        a = this.parse(a);
        this.initDom(a);
        this.render(a);
        return this
    };
    a.parse = function(a) {
        a.list = a.list.sort(function(a, b) {
            return a.value < b.value ? 1 : a.value > b.value ? -1 : 0
        });
        var b = a.total,
            c = a.list[0].value,
            f;
        for (f in a.list) a.list[f].width = 100 * a.list[f].value / c + "%", a.list[f].percent = Math.round(100 * a.list[f].value / b) + "%";
        return a
    };
    a.initDom = function(a) {
        var b, d, f;
        for (f in c.genres) b = document.createElement("li"), d = document.createElement("div"), d.className = "mask", a.list[f] ?
            (d.style.width = a.list[f].width, d.style.background = c.colors[a.list[f].id]) : (d.style.width = 0, d.style.background = "transparent"), b.appendChild(d), this._barsUl.appendChild(b)
    };
    a.render = function(a) {
        var b = c.copyManager.getCopy("desktop.cannes.stats.genre.id_" + a.list[0].id),
            b = b.replace("<number> %", a.list[0].percent + "");
        this._highlight.innerHTML = b;
        this._highlight.style.color = c.colors[a.list[0].id]
    };
    a.open = function() {
        this.setOpened()
    };
    a.close = function() {
        this.setClosed()
    }
});
breelNS.defineClass(breelNS.projectName + ".page.stats.widgets.MoodStatsWidget", "generic.templates.BasicPage", function(a) {
    var c = breelNS.getNamespace("generic.htmldom").ElementUtils;
    breelNS.getNamespace("generic.events");
    var e;
    a.initialize = function(a) {
        e = breelNS.getNamespace(breelNS.projectName).singletons.siteManager;
        this.template = e.assetManager.getAsset("StatsMoodContent");
        this.el = document.createElement("div");
        this.el.className = "moodStatsWidget";
        this.el.innerHTML = this.template.innerHTML;
        this._copy =
            this.el.querySelector(".copy");
        this._moods = this.el.querySelector(".moods");
        a = this.parse(a);
        this.render(a);
        return this
    };
    a.parse = function(a) {
        return a
    };
    a.render = function(a) {
        c.addClass(this._moods.children[a], "active");
        this._copy.innerHTML = e.copyManager.getCopy("desktop.cannes.stats.mood.id_" + a)
    };
    a.open = function() {
        this.setOpened()
    };
    a.close = function() {
        this.setClosed()
    }
});
breelNS.defineClass(breelNS.projectName + ".page.stats.widgets.MainstreamStatsWidget", "generic.templates.BasicPage", function(a) {
    breelNS.getNamespace("generic.htmldom");
    breelNS.getNamespace("generic.events");
    var c;
    a.initialize = function(a) {
        c = breelNS.getNamespace(breelNS.projectName).singletons.siteManager;
        this.template = c.assetManager.getAsset("StatsMainstreamContent");
        this.el = document.createElement("div");
        this.el.className = "mainstreamStatsWidget";
        this.el.innerHTML = this.template.innerHTML;
        this._copy = this.el.querySelector(".copy");
        this._row1 = this.el.querySelector(".persons .row1 .mask");
        this._row2 = this.el.querySelector(".persons .row2 .mask");
        a = this.parse(a);
        this.render(a);
        return this
    };
    a.parse = function(a) {
        a = Math.round(100 * a);
        0 > a ? a = 0 : 100 < a && (a = 100);
        return a
    };
    a.render = function(a) {
        var b, d = a;
        50 < a ? (b = c.copyManager.getCopy("desktop.cannes.stats.hotness.id_0"), d = a) : (b = c.copyManager.getCopy("desktop.cannes.stats.hotness.id_1"), d = 100 - a);
        b = b.replace("<number> %", "<br/><span><number>%</span>");
        b = b.replace("<number>", d);
        this._row1.style.width =
            (50 < d ? 100 : 100 * d / 50) + "%";
        this._row2.style.width = (50 > d ? 0 : 100 * (d - 50) / 50) + "%";
        this._copy.innerHTML = b
    };
    a.open = function() {
        this.setOpened()
    };
    a.close = function() {
        this.setClosed()
    }
});
breelNS.defineClass(breelNS.projectName + ".page.stats.widgets.EnergyStatsWidget", "generic.templates.BasicPage", function(a) {
    var c = breelNS.getNamespace("generic.htmldom").ElementUtils;
    breelNS.getNamespace("generic.events");
    var e;
    a.initialize = function(a) {
        e = breelNS.getNamespace(breelNS.projectName).singletons.siteManager;
        this.template = e.assetManager.getAsset("StatsEnergyContent");
        this.el = document.createElement("div");
        this.el.className = "energyStatsWidget";
        this.el.innerHTML = this.template.innerHTML;
        this._copy =
            this.el.querySelector(".copy");
        a = this.parse(a);
        this.render(a);
        return this
    };
    a.parse = function(a) {
        return a = Math.floor(4 * a)
    };
    a.render = function(a) {
        var d = this.el.querySelector(".curve .curve" + a);
        c.addClass(d, "display");
        this._copy.innerHTML = e.copyManager.getCopy("desktop.cannes.stats.energy.id_" + a)
    };
    a.open = function() {
        this.setOpened()
    };
    a.close = function() {
        this.setClosed()
    }
});
breelNS.defineClass(breelNS.projectName + ".page.stats.widgets.ExtendedStatsWidget", "generic.templates.BasicPage", function(a) {
    breelNS.getNamespace("generic.htmldom");
    breelNS.getNamespace("generic.events");
    var c, e = [{
        name: "Suits",
        serverName: "Business",
        serverID: 0,
        copyID: 0
    }, {
        name: "Entertainers",
        serverName: "Film, Music & Entertainment",
        serverID: 1,
        copyID: 1
    }, {
        name: "Creatives",
        serverName: "Creative",
        serverID: 2,
        copyID: 2
    }, {
        name: "Journos",
        serverName: "Journalist",
        serverID: 3,
        copyID: 3
    }, {
        name: "Marketeers",
        serverName: "Marketing & Social",
        serverID: 4,
        copyID: 4
    }, {
        name: "Media peeps",
        serverName: "Media",
        serverID: 5,
        copyID: 5
    }, {
        name: "Techies",
        serverName: "Technology",
        serverID: 6,
        copyID: 6
    }, {
        name: "Fashionistas",
        serverName: "Fashion & Design",
        serverID: 7,
        copyID: 7
    }, {
        name: "Social wizards",
        serverName: "Social Media gurus",
        serverID: 10,
        copyID: 9
    }, {
        name: "Brand gurus",
        serverName: "Brand",
        serverID: 9,
        copyID: 10
    }, {
        name: "The Interactives",
        serverName: "Interactive",
        serverID: 11,
        copyID: 11
    }, {
        name: "Speakers",
        serverName: "Speakers",
        serverID: 12,
        copyID: 8
    }];
    a.initialize = function(a,
        d) {
        c = breelNS.getNamespace(breelNS.projectName).singletons.siteManager;
        this.template = c.assetManager.getAsset("StatsExtendedContent");
        this.title = c.copyManager.getCopy("desktop.cannes.stats.etended." + d);
        this.type = d;
        this.el = document.createElement("div");
        this.el.className = "extendedStatsWidget";
        this.el.innerHTML = this.template.innerHTML;
        this._ul = this.el.querySelector("ul");
        a = this.parse(a);
        this.render(a);
        return this
    };
    a.parse = function(a) {
        for (var c in a) 1 > a[c].value && (a[c].value *= 100), a[c].value = Math.round(a[c].value);
        return a
    };
    a.render = function(a) {
        var d, f, g;
        for (g in a) {
            d = document.createElement("li");
            f = a[g].name;
            for (var h in e) f === e[h].serverName && (f = c.copyManager._copyDocument["common.professions.id_" + e[h].copyID]);
            d.innerHTML = '<div class="name">' + f + "</div>";
            d.innerHTML = "tempo" === this.type ? d.innerHTML + ('<div class="percent">' + a[g].value + " bpm</div>") : d.innerHTML + ('<div class="percent">' + a[g].value + "%</div>");
            this._ul.appendChild(d)
        }
    };
    a.open = function() {
        this.setOpened()
    };
    a.close = function() {
        this.setClosed()
    }
});
breelNS.defineClass(breelNS.projectName + ".model.UserObject", "generic.events.EventDispatcher", function(a) {
    var c = [25, 20, 15, 15, 7, 5, 5, 3, 3, 2],
        e = "JAMES,JOHN,ROBERT,MICHAEL,WILLIAM,DAVID,RICHARD,CHARLES,JOSEPH,THOMAS,CHRISTOPHER,DANIEL,PAUL,MARK,DONALD,GEORGE,KENNETH,STEVEN,EDWARD,BRIAN,RONALD,ANTHONY,KEVIN,JASON,MATTHEW,GARY,TIMOTHY,JOSE,LARRY,JEFFREY,FRANK,SCOTT,ERIC,STEPHEN,ANDREW,RAYMOND,GREGORY,JOSHUA,JERRY,DENNIS,WALTER,PATRICK,PETER,HAROLD,DOUGLAS,HENRY,CARL,ARTHUR,RYAN,ROGER,JOE,JUAN,JACK,ALBERT,JONATHAN,JUSTIN,TERRY,GERALD,KEITH,SAMUEL,WILLIE,RALPH,LAWRENCE,NICHOLAS,ROY,BENJAMIN,BRUCE,BRANDON,ADAM,HARRY,FRED,WAYNE,BILLY,STEVE,LOUIS,JEREMY,AARON,RANDY,HOWARD,EUGENE,CARLOS,RUSSELL,BOBBY,VICTOR,MARTIN,ERNEST,PHILLIP,TODD,JESSE,CRAIG,ALAN,SHAWN,CLARENCE,SEAN,PHILIP,CHRIS,JOHNNY,EARL,JIMMY,ANTONIO,DANNY,BRYAN,TONY,LUIS,MIKE,STANLEY,LEONARD,NATHAN,DALE,MANUEL,RODNEY,CURTIS,NORMAN,ALLEN,MARVIN,VINCENT,GLENN,JEFFERY,TRAVIS,JEFF,CHAD,JACOB,LEE,MELVIN,ALFRED,KYLE,FRANCIS,BRADLEY,JESUS,HERBERT,FREDERICK,RAY,JOEL,EDWIN,DON,EDDIE,RICKY,TROY,RANDALL,BARRY,ALEXANDER,BERNARD,MARIO,LEROY,FRANCISCO,MARCUS,MICHEAL,THEODORE,CLIFFORD,MIGUEL,OSCAR,JAY,JIM,TOM,CALVIN,ALEX,JON,RONNIE,BILL,LLOYD,TOMMY,LEON,DEREK,WARREN,DARRELL,JEROME,FLOYD,LEO,ALVIN,TIM,WESLEY,GORDON,DEAN,GREG,JORGE,DUSTIN,PEDRO,DERRICK,DAN,LEWIS,ZACHARY,COREY,HERMAN,MAURICE,VERNON,ROBERTO,CLYDE,GLEN,HECTOR,SHANE,RICARDO,SAM,RICK,LESTER,BRENT,RAMON,CHARLIE,TYLER,GILBERT,GENE,MARC,REGINALD,RUBEN,BRETT,ANGEL,NATHANIEL,RAFAEL,LESLIE,EDGAR,MILTON,RAUL,BEN,CHESTER,CECIL,DUANE,FRANKLIN,ANDRE,ELMER,BRAD,GABRIEL,RON,MITCHELL,ROLAND,ARNOLD,HARVEY,JARED,ADRIAN,KARL,CORY,CLAUDE,ERIK,DARRYL,JAMIE,NEIL,JESSIE,CHRISTIAN,JAVIER,FERNANDO,CLINTON,TED,MATHEW,TYRONE,DARREN,LONNIE,LANCE,CODY,JULIO,KELLY,KURT,ALLAN,NELSON,GUY,CLAYTON,HUGH,MAX,DWAYNE,DWIGHT,ARMANDO,FELIX,JIMMIE,EVERETT,JORDAN,IAN,WALLACE,KEN,BOB,JAIME,CASEY,ALFREDO,ALBERTO,DAVE,IVAN,JOHNNIE,SIDNEY,BYRON,JULIAN,ISAAC,MORRIS,CLIFTON,WILLARD,DARYL,ROSS,VIRGIL,ANDY,MARSHALL,SALVADOR,PERRY,KIRK,SERGIO,MARION,TRACY,SETH,KENT,TERRANCE,RENE,EDUARDO,TERRENCE,ENRIQUE,FREDDIE,WADE".split(","),
        b = "SMITH,JOHNSON,WILLIAMS,JONES,BROWN,DAVIS,MILLER,WILSON,MOORE,TAYLOR,ANDERSON,THOMAS,JACKSON,WHITE,HARRIS,MARTIN,THOMPSON,GARCIA,MARTINEZ,ROBINSON,CLARK,RODRIGUEZ,LEWIS,LEE,WALKER,HALL,ALLEN,YOUNG,HERNANDEZ,KING,WRIGHT,LOPEZ,HILL,SCOTT,GREEN,ADAMS,BAKER,GONZALEZ,NELSON,CARTER,MITCHELL,PEREZ,ROBERTS,TURNER,PHILLIPS,CAMPBELL,PARKER,EVANS,EDWARDS,COLLINS,STEWART,SANCHEZ,MORRIS,ROGERS,REED,COOK,MORGAN,BELL,MURPHY,BAILEY,RIVERA,COOPER,RICHARDSON,COX,HOWARD,WARD,TORRES,PETERSON,GRAY,RAMIREZ,JAMES,WATSON,BROOKS,KELLY,SANDERS,PRICE,BENNETT,WOOD,BARNES,ROSS,HENDERSON,COLEMAN,JENKINS,PERRY,POWELL,LONG,PATTERSON,HUGHES,FLORES,WASHINGTON,BUTLER,SIMMONS,FOSTER,GONZALES,BRYANT,ALEXANDER,RUSSELL,GRIFFIN,DIAZ,HAYES,MYERS,FORD,HAMILTON,GRAHAM,SULLIVAN,WALLACE,WOODS,COLE,WEST,JORDAN,OWENS,REYNOLDS,FISHER,ELLIS,HARRISON,GIBSON,MCDONALD,CRUZ,MARSHALL,ORTIZ,GOMEZ,MURRAY,FREEMAN,WELLS,WEBB,SIMPSON,STEVENS,TUCKER,PORTER,HUNTER,HICKS,CRAWFORD,HENRY,BOYD,MASON,MORALES,KENNEDY,WARREN,DIXON,RAMOS,REYES,BURNS,GORDON,SHAW,HOLMES,RICE,ROBERTSON,HUNT,BLACK,DANIELS,PALMER,MILLS,NICHOLS,GRANT,KNIGHT,FERGUSON,ROSE,STONE,HAWKINS,DUNN,PERKINS,HUDSON,SPENCER,GARDNER,STEPHENS,PAYNE,PIERCE,BERRY,MATTHEWS,ARNOLD,WAGNER,WILLIS,RAY,WATKINS,OLSON,CARROLL,DUNCAN,SNYDER,HART,CUNNINGHAM,BRADLEY,LANE,ANDREWS,RUIZ,HARPER,FOX,RILEY,ARMSTRONG,CARPENTER,WEAVER,GREENE,LAWRENCE,ELLIOTT,CHAVEZ,SIMS,AUSTIN,PETERS,KELLEY,FRANKLIN,LAWSON,FIELDS,GUTIERREZ,RYAN,SCHMIDT,CARR,VASQUEZ,CASTILLO,WHEELER,CHAPMAN,OLIVER,MONTGOMERY,RICHARDS,WILLIAMSON,JOHNSTON,BANKS,MEYER,BISHOP,MCCOY,HOWELL,ALVAREZ,MORRISON,HANSEN,FERNANDEZ,GARZA,HARVEY,LITTLE,BURTON,STANLEY,NGUYEN,GEORGE,JACOBS,REID,KIM,FULLER,LYNCH,DEAN,GILBERT,GARRETT,ROMERO,WELCH,LARSON,FRAZIER,BURKE,HANSON,DAY,MENDOZA,MORENO,BOWMAN,MEDINA,FOWLER,BREWER,HOFFMAN,CARLSON,SILVA,PEARSON,HOLLAND,DOUGLAS,FLEMING,JENSEN,VARGAS,BYRD,DAVIDSON,HOPKINS,MAY,TERRY,HERRERA,WADE,SOTO,WALTERS,CURTIS,NEAL,CALDWELL,LOWE,JENNINGS,BARNETT,GRAVES,JIMENEZ,HORTON,SHELTON,BARRETT,OBRIEN,CASTRO,SUTTON,GREGORY,MCKINNEY,LUCAS,MILES,CRAIG,RODRIQUEZ,CHAMBERS,HOLT,LAMBERT,FLETCHER,WATTS,BATES,HALE,RHODES,PENA,BECK,NEWMAN,HAYNES,MCDANIEL,MENDEZ,BUSH,VAUGHN,PARKS,DAWSON,SANTIAGO,NORRIS,HARDY,LOVE,STEELE,CURRY,POWERS,SCHULTZ,BARKER,GUZMAN,PAGE,MUNOZ,BALL,KELLER,CHANDLER,WEBER,LEONARD,WALSH,LYONS,RAMSEY,WOLFE,SCHNEIDER,MULLINS,BENSON,SHARP,BOWEN,DANIEL,BARBER,CUMMINGS,HINES,BALDWIN,GRIFFITH,VALDEZ,HUBBARD,SALAZAR,REEVES,WARNER,STEVENSON,BURGESS,SANTOS,TATE,CROSS,GARNER,MANN,MACK,MOSS,THORNTON,DENNIS,MCGEE,FARMER,DELGADO,AGUILAR,VEGA,GLOVER,MANNING,COHEN,HARMON,RODGERS,ROBBINS,NEWTON,TODD,BLAIR,HIGGINS,INGRAM,REESE,CANNON,STRICKLAND,TOWNSEND,POTTER,GOODWIN,WALTON,ROWE,HAMPTON,ORTEGA,PATTON,SWANSON,JOSEPH,FRANCIS,GOODMAN,MALDONADO,YATES,BECKER,ERICKSON,HODGES,RIOS,CONNER,ADKINS,WEBSTER,NORMAN,MALONE,HAMMOND,FLOWERS,COBB,MOODY,QUINN,BLAKE,MAXWELL,POPE,FLOYD,OSBORNE,PAUL,MCCARTHY,GUERRERO,LINDSEY,ESTRADA,SANDOVAL,GIBBS,TYLER,GROSS,FITZGERALD,STOKES,DOYLE,SHERMAN,SAUNDERS,WISE,COLON,GILL,ALVARADO,GREER,PADILLA,SIMON,WATERS,NUNEZ,BALLARD,SCHWARTZ,MCBRIDE,HOUSTON,CHRISTENSEN,KLEIN,PRATT,BRIGGS,PARSONS,MCLAUGHLIN,ZIMMERMAN,FRENCH,BUCHANAN,MORAN,COPELAND,ROY,PITTMAN,BRADY,MCCORMICK,HOLLOWAY,BROCK,POOLE,FRANK,LOGAN,OWEN,BASS,MARSH,DRAKE,WONG,JEFFERSON,PARK,MORTON,ABBOTT,SPARKS,PATRICK,NORTON,HUFF,CLAYTON,MASSEY,LLOYD,FIGUEROA,CARSON,BOWERS,ROBERSON,BARTON,TRAN,LAMB,HARRINGTON,CASEY,BOONE,CORTEZ,CLARKE,MATHIS,SINGLETON,WILKINS,CAIN,BRYAN,UNDERWOOD,HOGAN,MCKENZIE,COLLIER,LUNA,PHELPS,MCGUIRE,ALLISON,BRIDGES,WILKERSON,NASH,SUMMERS,ATKINS,WILCOX,PITTS,CONLEY,MARQUEZ,BURNETT,RICHARD,COCHRAN,CHASE,DAVENPORT,HOOD,GATES,CLAY,AYALA,SAWYER,ROMAN,VAZQUEZ,DICKERSON,HODGE,ACOSTA,FLYNN,ESPINOZA,NICHOLSON,MONROE,WOLF,MORROW,KIRK,RANDALL,ANTHONY,WHITAKER,OCONNOR,SKINNER,WARE,MOLINA,KIRBY,HUFFMAN,BRADFORD,CHARLES,GILMORE,DOMINGUEZ,ONEAL,BRUCE,LANG,COMBS,KRAMER,HEATH,HANCOCK,GALLAGHER,GAINES,SHAFFER,SHORT,WIGGINS,MATHEWS,MCCLAIN,FISCHER,WALL,SMALL,MELTON,HENSLEY,BOND,DYER,CAMERON,GRIMES,CONTRERAS,CHRISTIAN,WYATT,BAXTER,SNOW,MOSLEY,SHEPHERD,LARSEN,HOOVER,BEASLEY,GLENN,PETERSEN,WHITEHEAD,MEYERS,KEITH,GARRISON,VINCENT,SHIELDS,HORN,SAVAGE,OLSEN,SCHROEDER,HARTMAN,WOODARD,MUELLER,KEMP,DELEON,BOOTH,PATEL,CALHOUN,WILEY,EATON,CLINE,NAVARRO,HARRELL,LESTER,HUMPHREY,PARRISH,DURAN,HUTCHINSON,HESS,DORSEY,BULLOCK,ROBLES,BEARD,DALTON,AVILA,VANCE,RICH,BLACKWELL,YORK,JOHNS,BLANKENSHIP,TREVINO,SALINAS,CAMPOS,PRUITT,MOSES,CALLAHAN,GOLDEN,MONTOYA,HARDIN,GUERRA,MCDOWELL,CAREY,STAFFORD,GALLEGOS,HENSON,WILKINSON,BOOKER,MERRITT,MIRANDA,ATKINSON,ORR,DECKER,HOBBS,PRESTON,TANNER,KNOX,PACHECO,STEPHENSON,GLASS,ROJAS,SERRANO,MARKS,HICKMAN,ENGLISH,SWEENEY,STRONG,PRINCE,MCCLURE,CONWAY,WALTER,ROTH,MAYNARD,FARRELL,LOWERY,HURST,NIXON,WEISS,TRUJILLO,ELLISON,SLOAN,JUAREZ,WINTERS,MCLEAN,RANDOLPH,LEON,BOYER,VILLARREAL,MCCALL,GENTRY,CARRILLO,KENT,AYERS,LARA,SHANNON,SEXTON,PACE,HULL,LEBLANC,BROWNING,VELASQUEZ,LEACH,CHANG,HOUSE,SELLERS,HERRING,NOBLE,FOLEY,BARTLETT,MERCADO,LANDRY,DURHAM,WALLS,BARR,MCKEE,BAUER,RIVERS,EVERETT,BRADSHAW,PUGH,VELEZ,RUSH,ESTES,DODSON,MORSE,SHEPPARD,WEEKS,CAMACHO,BEAN,BARRON,LIVINGSTON,MIDDLETON,SPEARS,BRANCH,BLEVINS,CHEN,KERR,MCCONNELL,HATFIELD,HARDING,ASHLEY,SOLIS,HERMAN,FROST,GILES,BLACKBURN,WILLIAM,PENNINGTON,WOODWARD,FINLEY,MCINTOSH,KOCH,BEST,SOLOMON,MCCULLOUGH,DUDLEY,NOLAN,BLANCHARD,RIVAS,BRENNAN,MEJIA,KANE,BENTON,JOYCE,BUCKLEY,HALEY,VALENTINE,MADDOX,RUSSO,MCKNIGHT,BUCK,MOON,MCMILLAN,CROSBY,BERG,DOTSON,MAYS,ROACH,CHURCH,CHAN,RICHMOND,MEADOWS,FAULKNER,ONEILL,KNAPP,KLINE,BARRY,OCHOA,JACOBSON,GAY,AVERY,HENDRICKS,HORNE,SHEPARD,HEBERT,CHERRY,CARDENAS,MCINTYRE,WHITNEY,WALLER,HOLMAN,DONALDSON,CANTU,TERRELL,MORIN,GILLESPIE,FUENTES,TILLMAN,SANFORD,BENTLEY,PECK,KEY,SALAS,ROLLINS,GAMBLE,DICKSON,BATTLE,SANTANA,CABRERA,CERVANTES,HOWE,HINTON,HURLEY,SPENCE,ZAMORA,YANG,MCNEIL,SUAREZ,CASE,PETTY,GOULD,MCFARLAND,SAMPSON,CARVER,BRAY,ROSARIO,MACDONALD,STOUT,HESTER,MELENDEZ,DILLON,FARLEY,HOPPER,GALLOWAY,POTTS,BERNARD,JOYNER,STEIN,AGUIRRE,OSBORN,MERCER,BENDER,FRANCO,ROWLAND,SYKES,BENJAMIN,TRAVIS,PICKETT,CRANE,SEARS,MAYO,DUNLAP,HAYDEN,WILDER,MCKAY,COFFEY,MCCARTY,EWING,COOLEY,VAUGHAN,BONNER,COTTON,HOLDER,STARK,FERRELL,CANTRELL,FULTON,LYNN,LOTT,CALDERON,ROSA,POLLARD,HOOPER,BURCH,MULLEN,FRY,RIDDLE,LEVY,DAVID,DUKE,ODONNELL,GUY,MICHAEL,BRITT,FREDERICK,DAUGHERTY,BERGER,DILLARD,ALSTON,JARVIS,FRYE,RIGGS,CHANEY,ODOM,DUFFY,FITZPATRICK,VALENZUELA,MERRILL,MAYER,ALFORD,MCPHERSON,ACEVEDO,DONOVAN,BARRERA,ALBERT,COTE,REILLY,COMPTON,RAYMOND,MOONEY,MCGOWAN,CRAFT,CLEVELAND,CLEMONS,WYNN,NIELSEN,BAIRD,STANTON,SNIDER,ROSALES,BRIGHT,WITT,STUART,HAYS,HOLDEN,RUTLEDGE,KINNEY,CLEMENTS,CASTANEDA,SLATER,HAHN,EMERSON,CONRAD,BURKS,DELANEY,PATE,LANCASTER,SWEET,JUSTICE,TYSON,SHARPE,WHITFIELD,TALLEY,MACIAS,IRWIN,BURRIS,RATLIFF,MCCRAY,MADDEN,KAUFMAN,BEACH,GOFF,CASH,BOLTON,MCFADDEN,LEVINE,GOOD,BYERS,KIRKLAND,KIDD,WORKMAN,CARNEY,DALE,MCLEOD,HOLCOMB,ENGLAND,FINCH,HEAD,BURT,HENDRIX,SOSA,HANEY,FRANKS,SARGENT,NIEVES,DOWNS,RASMUSSEN,BIRD,HEWITT,LINDSAY,LE,FOREMAN,VALENCIA,ONEIL,DELACRUZ,VINSON,DEJESUS,HYDE,FORBES,GILLIAM,GUTHRIE,WOOTEN,HUBER,BARLOW,BOYLE,MCMAHON,BUCKNER,ROCHA,PUCKETT,LANGLEY,KNOWLES,COOKE,VELAZQUEZ,WHITLEY,NOEL,VANG".split(","),
        d = "19th Nervous Breakdown;59th Street Bridge Song;96 Tears;Baby, Now That I Found You;Bend Me, Shape Me;Big Yellow Taxi;Black is Black;Boots;Born to Be Wild;Build Me Up Buttercup;Bus Stop;California Dreamin';Can't Buy Me Love;Catch Us If You Can;Chain of Fools;Cherry, Cherry;Christmas (Baby Please Come Home);Classical Gas;Daydream Believer;Delilah;Different Drum;Dirty Water;Double Shot;Down By the River;Draggin' the Line;Eight Days a Week;Everyday People;Expressway to Your Heart;Feelin' Alright;Ferry Cross the Mersey;Fire;For What It's Worth;Get Together;Glad All Over;Golden Slumbers/Carry That Weight/The End;Green Onions;Green RIver;Hang on Sloopy;Hanky Panky;Happy Together;Hard Day's Night;Heatwave;Help;Helpless;Hey Baby, They're Playing Our Song;Hide Your Love Away;I Can't Explain;I Got a Line on You;I Got You Babe;I Only Wanna Be With You;I'm Lookin' Through You;Judy in Disguise;Jumpin' Jack Flash;Kicks;Kind of a Drag;Laugh, Laugh;Leavin' on a Jet Plane;Let's Live for Today;Let's Spend the Night Together;Little Red Riding Hood;Love Potion #9;Me and Bobby McGee;Memphis;Midnight Confessions;Monster Mash;More Today Than Yesterday;Mother's Little Helper;Never Ending Love for You;Nobody But Me;Nowhere Man;Ohio;Paint It Black;Penny Lane;Pretty Woman;Purple Haze;Reach Out in the Darkness;Reflections of My Life;Rescue Me;Secret Agent Man;She Loves You;She's Not There;Snoopy's Christmas;Somebody to Love;Son of a Preacher Man;Steppin' Stone;Summer Song;Sunshine of Your Love;Suspicious Minds;Suzie Q;Sweet Caroline;Teach Your Children;Tell Me Why;The Beat Goes On;The Boxer;The Horse;The Letter;The Weight;Those Were the Days;Tighter Tighter;Time Won't Let Me;To Love Somebody;Two of Us;Venus;Wake Up Little Susie;Well Respected Man;Where Have All the Flowers Gone?;White Rabbit;Whiter Shade of Pale;Who'll Stop the Rain;Wooly Bully;Yellow Submarine".split(";"),
        f = "Rolling Stones;Simon and Garfunkel;Question Mark & the Mysterians;Foundations;American Breed;Joni Mitchell;Los Bravos;Nancy Sinatra;Steppenwolf;Foundations;Hollies;Mamas and the Papas;Beatles;Dave Clark 5;Aretha Franklin;Neil Diamond;Darlene Love;Classical Gas -- Mason Williams;Monkees;Tom Jones;Stone Ponys;The Standells;Swingin' Medallions;Neil Young;Tommy James & the Shondells;Beatles;Sly & the Family Stone;Soul Survivors;Traffic;Gerry & the Pacemakers;Jimi Hendrix;Buffalo Springfield;Youngbloods;Dave Clark 5;Beatles;Booker T & the MGs;Creedence Clearwater Revival;McCoys;Tommy James and The Shondells;Turtles;Beatles;Martha and the Vandellas;Beatles;Neil Young;Buckinghams;Beatles;The Who;Spirit;Sonny & Cher;Dusty Springfield;Beatles;John Fred & His Playboy Band;Rolling Stones;Paul Revere & the Raiders;Buckinghams;Beau Brummels;Peter, Paul & Mary;Grass Roots;Rolling Stones;Sam the Sham & the Pharoahs;Searchers;Janis Joplin;Johnny Rivers;Grass Roots;Bobby 'Boris' Pickett;Spiral Staircase;Rolling Stones;Delaney & Bonnie;Human Beinz;Beatles;Crosby Stills & Nash;Rolling Stones;Beatles;Ray Orbison;Jimi Hendrix;Friend & Lover;Marmalade;Fontella Bass;Johnny Rivers;Beatles;Zombies;Royal Guardsmen;Jefferson Airplane;Dusty Springfield;Monkees;Chad and Jeremy;Cream;Elvis;Creedence Clearwater Revival;Neil Diamond;Crosby, Stills & Nash;Beatles;Sonny & Cher;Simon & Garfunkel;Cliff Nobles & Co.;Boxtops;The Band;Mary Hopkin;Alive 'N Kickin';Outsiders;Bee Gees;Beatles;Shocking Blue;Everly Brothers;Kinks;Johnny Rivers;Jefferson Airplane;Procol Harum;Credence Clearwater Revival;Sam the Sham & the Pharaohs;Beatles".split(";"),
        g = "SapientNitro,LBi,AKQA,Engine,BAE Systems Detica,Salmon,Deloitte Digital,iProspect,RAPP,Wunderman Network UK,M&C Saatchi,iris Worldwide,CACI,Razorfish UK,GSI Marketing Solutions,Javelin Group,Endava UK,Dare,MRM Meteorite,Havas EHS,Tullo Marshall Warren,Amaze,R/GA London,VCCP,Grass Roots Group UK,Proximity London,POSSIBLE,Reading Room,HeathWallace,Greenlight,TH_NK,Stickyeyes,Leo Burnett Group,Profero,Realise,Zone,iCrossing,Haymarket Network,Jam,Tangent Snowball,Investis,Axonn Media Limited,ais London,The BIO Agency,The Big Group,Edelman Digital,VML London,Cognifide,Valtech,CDS Digital,Technophobia Ltd,Karmarama,Ayima Search Marketing,Epiphany,Equator,Group FMG,The Group,GJoshua,Volume,Summit Media,gyro,WCRS,twentysix,Click Consult,Jellyfish,Metia,Rippleffect,Agency Republic,POKE,Foolproof,Latitude Digital Marketing,Hugo & Cat,WeaponPrecedent,Indicia,Elvis,AIA Worldwide,CMW,MSL Group UK,The Real Adventure,Code Computerlove,TBG,Rufus Leonard,Add People,Freestyle Interactive,Holler,Tempero Social Media Management,Search Laboratory,Abacus e-Media,Redweb,Fresh Egg,Huge,Grey London,Five by Five,eequimedia,Mediaworks Online Marketing,Brass,Pancentric Digital".split(","),
        h = "Afghanistan;Albania;Algeria;Andorra;Angola;Antigua and Barbuda;Argentina;Armenia;Aruba;Australia;Austria;Azerbaijan;Bahamas, The;Bahrain;Bangladesh;Barbados;Belarus;Belgium;Belize;Benin;Bhutan;Bolivia;Bosnia and Herzegovina;Botswana;Brazil;Brunei;Bulgaria;Burkina Faso;Burma;Burundi;Cambodia;Cameroon;Canada;Cape Verde;Central African Republic;Chad;Chile;China;Colombia;Comoros;Congo, Democratic Republic of the;Congo, Republic of the;Costa Rica;Cote d'Ivoire;Croatia;Cuba;Curacao;Cyprus;Czech Republic;Denmark;Djibouti;Dominica;Dominican Republic;East Timor (see Timor-Leste);Ecuador;Egypt;El Salvador;Equatorial Guinea;Eritrea;Estonia;Ethiopia;Fiji;Finland;France;Gabon;Gambia, The;Georgia;Germany;Ghana;Greece;Grenada;Guatemala;Guinea;Guinea-Bissau;Guyana;Haiti;Holy See;Honduras;Hong Kong;Hungary;Iceland;India;Indonesia;Iran;Iraq;Ireland;Israel;Italy;Jamaica;Japan;Jordan;Kazakhstan;Kenya;Kiribati;Korea, North;Korea, South;Kosovo;Kuwait;Kyrgyzstan;Laos;Latvia;Lebanon;Lesotho;Liberia;Libya;Liechtenstein;Lithuania;Luxembourg;Macau;Macedonia;Madagascar;Malawi;Malaysia;Maldives;Mali;Malta;Marshall Islands;Mauritania;Mauritius;Mexico;Micronesia;Moldova;Monaco;Mongolia;Montenegro;Morocco;Mozambique;Namibia;Nauru;Nepal;Netherlands;Netherlands Antilles;New Zealand;Nicaragua;Niger;Nigeria;North Korea;Norway;Oman;Pakistan;Palau;Palestinian Territories;Panama;Papua New Guinea;Paraguay;Peru;Philippines;Poland;Portugal;Qatar;Romania;Russia;Rwanda;Saint Kitts and Nevis;Saint Lucia;Saint Vincent and the Grenadines;Samoa;San Marino;Sao Tome and Principe;Saudi Arabia;Senegal;Serbia;Seychelles;Sierra Leone;Singapore;Sint Maarten;Slovakia;Slovenia;Solomon Islands;Somalia;South Africa;South Korea;South Sudan;Spain;Sri Lanka;Sudan;Suriname;Swaziland;Sweden;Switzerland;Syria;Taiwan;Tajikistan;Tanzania;Thailand;Timor-Leste;Togo;Tonga;Trinidad and Tobago;Tunisia;Turkey;Turkmenistan;Tuvalu;Uganda;Ukraine;United Arab Emirates;United Kingdom;Uruguay;Uzbekistan;Vanuatu;Venezuela;Vietnam;Yemen;Zambia;Zimbabwe".split(";"),
        l = function(a) {
            return a[Math.floor(Math.random() * a.length)]
        };
    a.init = function(a) {
        breelNS.getNamespace(breelNS.projectName);
        for (var m = Math.floor(100 * Math.random()), n = 0, o = this.genre = 0; o < c.length; o++)
            if (m > n && m < n + c[o]) {
                this.genre = o;
                break
            } else n += c[o];
        this.genre = -1;
        this.agencyIndex = void 0 == a ? Math.floor(Math.random() * g.length) : a;
        this.agencyIndex += Math.floor(-2 + 5 * Math.random());
        0 > this.agencyIndex && (this.agencyIndex += g.length);
        this.agencyIndex >= g.length && (this.agencyIndex -= g.length);
        a = Math.floor(0 + 5 * Math.random()) +
            1;
        this.smallImg = "desktop/files/images/1x/common/users/0" + a + ".png";
        this.mediumImg = "desktop/files/images/1x/common/users/0" + a + ".png";
        this.largeImg = "desktop/files/images/1x/common/users/0" + a + ".png";
        this.imgAlbum = "desktop/files/images/1x/common/albums/0" + a + ".jpg";
        this.songGenres = "";
        this.hasConnections = 0.95 < Math.random();
        this.firstName = l(e);
        this.lastName = l(b);
        this.country = l(h);
        this.agency = g[this.agencyIndex];
        this.songTitle = l(d);
        this.artistName = l(f);
        this.o = {
            agencyIndex: this.agencyIndex,
            smallImg: this.smallImg,
            mediumImg: this.mediumImg,
            largeImg: this.largeImg,
            imgAlbum: this.imgAlbum,
            songGenres: this.songGenres,
            firstName: this.firstName,
            lastName: this.lastName,
            country: this.country,
            agency: this.agency,
            songTitle: this.songTitle,
            artistName: this.artistName
        };
        return this
    };
    a.setAgency = function(a) {
        this.agencyIndex = a;
        this.agency = g[this.agencyIndex]
    }
});
breelNS.defineClass(breelNS.projectName + ".model.Model", "generic.events.EventDispatcher", function(a) {
    var c = breelNS.getNamespace("spotify.common.model.backendmanager").ServiceID,
        e = breelNS.getNamespace("spotify.common.model.data.userdata").UserDataSend,
        b = breelNS.getNamespace("spotify.common.model.data.userdata").PeopleSeachSend,
        d = breelNS.getNamespace("spotify.common.model.data.userdata").CountrySearchSend,
        f = breelNS.getNamespace("spotify.common.model.data.userdata").GetMatchSend,
        g = breelNS.getNamespace("spotify.common.model.data.userdata").AgencySearchSend,
        h = breelNS.getNamespace("spotify.common.model.data.userdata").CannesSearchSend,
        l = breelNS.getNamespace(breelNS.projectName + ".model").UserObject;
    breelNS.getNamespace("generic.events");
    breelNS.getNamespace("spotify.common.utils.genresdata");
    var k = void 0,
        m = "A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z".split(","),
        n, o;
    a.init = function() {
        n = breelNS.getNamespace(breelNS.projectName).singletons.siteManager;
        o = n.settings.params;
        this._callback = this._target = void 0;
        this._searchIndex = -1;
        this._agencyData = [];
        this._completeCount = 0;
        this._totalCount = 5;
        this._saveData = !1;
        this.allUsers = [];
        this.countries = [];
        this.baseHeight = 1280;
        this._search_successHandlerBinded = this._search_successHandler.bind(this);
        this._agency_successHandlerBinded = this._agency_successHandler.bind(this);
        this._match_successHandlerBinded = this._match_successHandler.bind(this);
        this._agencyList_successHandlerBinded = this._agencyList_successHandler.bind(this);
        this._countryList_successHandlerBinded = this._countryList_successHandler.bind(this);
        this._search_errorHandlerBinded =
            this._search_errorHandler.bind(this);
        this.getTotalAmountOfAgencies();
        this.getAllCountries();
        this.getInitUsers(void 0, void 0, n.settings.params.numParticles);
        this.numScale = 1;
        if (null != navigator.userAgent.match(/iPad/i)) this.numScale = 0.5;
        console.log("Number Scale : ", this.numScale);
        console.log("Number Scale : ", this.numScale);
        console.log("Number Scale : ", this.numScale);
        console.log("Number Scale : ", this.numScale);
        console.log("Number Scale : ", this.numScale);
        return this
    };
    a.getInitUsers = function(a, b, d) {
        0 !=
            this.allUsers.length ? (console.log("All user data exist"), b.call(a, this.allUsers)) : (this._saveData = !0, this._target = a, this._callback = b, console.debug("Get INIT USERS"), d = void 0 == d ? o.numParticles : d, a = new e(0, d), n.backendManager.load(c.GET_ALL_USERS, a, this._search_successHandlerBinded, this._search_errorHandlerBinded))
    };
    a.getMatchUsers = function(a, b, d) {
        this._target = a;
        this._callback = b;
        a = new f(void 0 == d ? "5396f47bbbd1a1351ed97242" : d);
        console.debug("Get MATCH USERS", a);
        n.backendManager.load(c.GET_MATCH, a, this._match_successHandlerBinded,
            this._search_errorHandlerBinded)
    };
    a.searchForAgencyIndexRange = function(a, b, c) {
        this._target = b;
        this._callback = c;
        this._agencyData = [];
        this._completeCount = 0;
        this._searchIndex = a;
        if (5 > this.numAgencies) {
            this._totalCount = this.numAgencies;
            for (b = 0; b < this.agencies.length; b++) this.searchForAgencyIndex(b)
        } else {
            this._totalCount = 5;
            for (b = a - 2; b <= a + 2; b++) this.searchForAgencyIndex(b)
        }
    };
    a.searchForAgencyIndex = function(a) {
        0 > a ? a += this.numAgencies : a >= this.numAgencies && (a -= this.numAgencies);
        var b = this.getAgencyIndexWithPosIndex(a);
        console.debug("Search for agency : ", a, b);
        a = new g(b, 60 * this.numScale);
        n.backendManager.load(c.SEARCH_PEOPLE, a, this._agency_successHandlerBinded, this._search_errorHandlerBinded)
    };
    a.searchForNextAgencyIndex = function(a, b, d) {
        this._target = b;
        this._callback = d;
        a = this.getAgencyIndexWithPosIndex(a);
        console.debug("Get search result for Next/Pre Agencies", a);
        a = new g(a, 60 * this.numScale);
        n.backendManager.load(c.SEARCH_PEOPLE, a, this._search_successHandlerBinded, this._search_errorHandlerBinded)
    };
    a.searchForCountry =
        function(a, b, e) {
            this._target = b;
            this._callback = e;
            b = new d(a, 300 * this.numScale);
            console.debug("Get search result for Country", a, b.getParams());
            n.backendManager.load(c.SEARCH_PEOPLE, b, this._search_successHandlerBinded, this._search_errorHandlerBinded)
        };
    a.searchForPeople = function(a, d, e) {
        this._target = d;
        this._callback = e;
        console.debug("Get search result for People", a);
        a = -1 == a ? new h(o.numParticles) : new b(a, o.numParticles);
        n.backendManager.load(c.SEARCH_PEOPLE, a, this._search_successHandlerBinded, this._search_errorHandlerBinded)
    };
    a.getTotalAmountOfAgencies = function() {
        var a = new b(0, 0);
        n.backendManager.load(c.GET_AGENCIES_LIST, a, this._agencyList_successHandlerBinded, this._search_errorHandlerBinded)
    };
    a.getAllCountries = function() {
        var a = new b(0, 0);
        n.backendManager.load(c.GET_COUNTRY_LIST, a, this._countryList_successHandlerBinded, this._search_errorHandlerBinded)
    };
    a._agency_successHandler = function(a) {
        a.status.isOK ? a.data.users ? this._processAgencyData(a.data.users) : this._processAgencyData(a.data) : console.warn(a.status)
    };
    a._match_successHandler =
        function(a) {
            if (a.status.isOK) {
                if (this._target && this._callback) {
                    for (var b = [], c = 0; c < a.data.users.length; c++) {
                        var d = a.data.users[c],
                            e = {};
                        e.firstName = d.user.name.first;
                        e.lastName = d.user.name.last;
                        for (var f in d.user) e[f] = d.user[f];
                        e.smallImg = d.user.smallPictureUrl && "" != d.user.smallPictureUrl && "undefined" != d.user.smallPictureUrl ? d.user.smallPictureUrl : "/desktop/files/images/1x/common/profile_noimage.png";
                        e.mediumImg = d.user.mediumPictureUrl && "" != d.user.mediumPictureUrl && "undefined" != d.user.mediumPictureUrl ?
                            d.user.mediumPictureUrl : "/desktop/files/images/1x/common/profile_noimage.png";
                        e.largeImg = d.user.largePictureUrl && "" != d.user.largePictureUrl && "undefined" != d.user.largePictureUrl ? d.user.largePictureUrl : "/desktop/files/images/1x/common/profile_noimage.png";
                        e.imgAlbum = d.song.coverURL;
                        e.songTitle = d.song.name;
                        e.songGenres = k[d.song.genreID];
                        e.songGenre = k[d.song.genreID];
                        e.genre = k[d.song.genreID];
                        e.songGenresID = d.song.genreID;
                        e.userID = d.user.id;
                        e.spotifyID = d.song.id;
                        e.artistName = d.song.artist;
                        b.push(e)
                    }
                    this._callback.call(this._target,
                        b);
                    this._callback = this._target = void 0;
                    this._searchIndex = -1
                }
            } else console.warn(a.status)
        };
    a._search_successHandler = function(a) {
        a.status.isOK ? this._saveData ? a.data.users ? this._processData(a.data.users) : this._processData(a.data) : this._target && this._callback && (a.data.users ? this._processData(a.data.users) : this._processData(a.data)) : console.warn(a.status)
    };
    a._countryList_successHandler = function(a) {
        this.countryList = {
            "#": []
        };
        if (a.status.isOK) {
            this.countries = a.data.countries;
            for (a = 0; a < this.countries.length; a++) {
                var b =
                    this.countries[a].name;
                this.countries[a].lat = this.countries[a].coords[0];
                this.countries[a].lng = this.countries[a].coords[1];
                "" == b || " " == b || (b = b.substring(0, 1).toUpperCase(), -1 < m.indexOf(b) ? (void 0 == this.countryList[b] && (this.countryList[b] = []), this.countryList[b].push(this.countries[a].name)) : this.countryList["#"].push(this.countries[a].name))
            }
        } else console.warn(a.status)
    };
    a._agencyList_successHandler = function(a) {
        this.agencyList = {
            "#": []
        };
        if (a.status.isOK) {
            this.numAgencies = a.data.agencies.length;
            this.agencies =
                a.data.agencies;
            for (a = 0; a < this.agencies.length; a++) {
                var b = this.agencies[a].name;
                this.agencies[a].index = a;
                "" == b || " " == b || (b = b.substring(0, 1).toUpperCase(), -1 < m.indexOf(b) ? (void 0 == this.agencyList[b] && (this.agencyList[b] = []), this.agencyList[b].push(this.agencies[a].name)) : this.agencyList["#"].push(this.agencies[a].name))
            }
        } else console.warn(a.status)
    };
    a.getAgencyIndex = function(a) {
        for (var b = 0; b < this.agencies.length; b++)
            if (this.agencies[b].name == a) return this.agencies[b].agencyIndex;
        return -1
    };
    a.getAgencyIndexWithPosIndex =
        function(a) {
            return this.agencies[a] ? this.agencies[a].agencyIndex : -1
        };
    a.getAgencyNameWithPosIndex = function(a) {
        return this.agencies[a] ? this.agencies[a].name : -1
    };
    a.getAgencyNameWithIndex = function(a) {
        for (var b in this.agencies)
            if (this.agencies[b].agencyIndex === a) return this.agencies[b].name.toLowerCase();
        return -1
    };
    a.getPosIndexWithAgyIndex = function(a) {
        for (var b = 0; b < this.agencies.length; b++)
            if (this.agencies[b].agencyIndex == a) return b;
        return -1
    };
    a.getAgencyPositionIndex = function(a) {
        for (var b = 0; b < this.agencies.length; b++)
            if (this.agencies[b].name ==
                a) return b;
        return -1
    };
    a.getCountry = function(a) {
        for (var a = a.slice(), a = a.toLowerCase(), b, c = 0; c < this.countries.length; c++)
            if (b = this.countries[c].name.slice(), b = b.toLowerCase(), b == a) return this.countries[c];
        return null
    };
    a._search_errorHandler = function(a) {
        console.warn("_onSearch_errorHandler", a)
    };
    a._processData = function(a) {
        k = n.genres;
        for (var b = [], c = 0; c < a.length; c++) {
            var d;
            d = (new l).init();
            var e = a[c],
                f;
            for (f in e) {
                d[f] = e[f];
                if ("genre" == f) d.songGenresID = e[f], d.songGenres = k[e[f]], d.songGenre = k[e[f]];
                if ("songGenre" ==
                    f) d.songGenresID = e[f], d.songGenres = k[e[f]], d.songGenre = k[e[f]]
            }
            b.push(d)
        }
        this._callback && this._callback.call(this._target, b);
        this._callback = this._target = void 0;
        if (this._saveData) this.allUsers = b, this._saveData = !1
    };
    a._processAgencyData = function(a) {
        this._completeCount++;
        console.log("Complete calls : ", this._completeCount);
        for (var b = 0; b < a.length; b++) {
            var c, d = this._searchIndex + this._completeCount - 3;
            0 > d ? d += this.numAgencies : d >= this.numAgencies && (d -= this.numAgencies);
            c = (new l).init();
            var e = a[b],
                f;
            for (f in e) {
                c[f] =
                    e[f];
                if ("genre" == f) c.songGenresID = e[f], c.songGenres = k[e[f]];
                if ("songGenre" == f) c.songGenresID = e[f], c.songGenres = k[e[f]], c.songGenre = k[e[f]]
            }
            c.setAgency(d);
            this._agencyData.push(c)
        }
        if (this._completeCount == this._totalCount) this._callback.call(this._target, this._agencyData), this._callback = this._target = void 0
    }
});
breelNS.defineClass(breelNS.projectName + ".model.DummyData", "generic.events.EventDispatcher", function(a) {
    var c = breelNS.getNamespace(breelNS.projectName + ".model").UserObject,
        e;
    a.init = function() {
        e = breelNS.getNamespace(breelNS.projectName).singletons.siteManager;
        return this
    };
    a.getInitData = function() {
        for (var a = [], d = 0, f = 0; f < e.settings.params.numParticles; f++) {
            var g = (new c).init();
            if (30 > d++ && 0.99 < Math.random()) g.hasConnections = !0;
            a.push(g)
        }
        return a
    };
    a.shift = function() {};
    a.search = function(a) {
        for (var d = [],
            e = 0; 300 > e; e++) {
            var g = (new c).init(a);
            d.push(g)
        }
        return d
    };
    a.getClosedParticles = function() {
        return []
    };
    a.getDummyClosedParticles = function(a) {
        for (var d = [a], e = 0; 4 > e; e++) a = (new c).init(), d.push(a);
        return d
    };
    a.searchCountry = function() {
        var a = {};
        a.lat = 180 * Math.random() - 90;
        a.lng = 360 * Math.random() - 180;
        return a
    };
    a.getUserData = function() {
        for (var a = [], d = 0; 5 > d; d++) {
            var e = (new c).init();
            a.push(e)
        }
        return a
    }
});
breelNS.defineClass(breelNS.projectName + ".model.GlobalSettings", "generic.events.EventDispatcher", function(a) {
    console.log("GlobalSettings");
    a.init = function() {
        this.colors = "#83b601,#039568,#3bb1e3,#116275,#b7e2f5,#98ceb7,#f7d363,#ff8a6e,#fae6db,#ec607b".split(",");
        var a = {};
        this.params = a;
        a.numParticles = 612;
        a.numConnectDots = 10;
        a.maxConnections = 5;
        a.speed = 0.05;
        a.baseSize = 5;
        a.sizeDifference = 16;
        a.speedDifference = 4;
        a.zRange = 100;
        a.minRadius = 449;
        a.maxRadius = 631;
        a.ratationRadius = 690;
        a.blendModeAdd = !1;
        a.layerDistance =
            300;
        a.sizeDifferenceInDepth = 2.5;
        a.alphaDifferenceInDepth = 1.7;
        a.acceleration = 4;
        a.velocityDecreasing = 0.5;
        a.forceToCenter = 0.5;
        a.explosionRadius = 200;
        a.explosionForce = 25;
        a.explosionDecrease = 0.96;
        null != navigator.userAgent.match(/iPad/i) && (a.numParticles *= 0.5, a.minRadius *= 0.75, a.maxRadius *= 0.75, a.ratationRadius *= 0.75, a.baseSize *= 2);
        return this
    }
});
(function() {
    var a = breelNS.getNamespace("generic.core").Core;
    breelNS.getNamespace("generic.events");
    var c = breelNS.getNamespace(breelNS.projectName + ".model").GlobalSettings,
        e = breelNS.getNamespace(breelNS.projectName),
        b = breelNS.getNamespace("spotify.common.model.backendmanager").BackendManager,
        d = breelNS.getNamespace(breelNS.projectName + ".model").DummyData,
        f = breelNS.getNamespace(breelNS.projectName + ".model").Model,
        g = breelNS.getNamespace("spotify.common.utils.genresdata").GenresData;
    if (!e.SiteManager) {
        var h =
            function() {
                a.call(this)
            };
        e.SiteManager = h;
        var l = h.prototype = new a,
            k = a.prototype;
        l.setup = function() {
            k.setup.call(this);
            this.backendManager = new b;
            this.settings = (new c).init();
            this.dummyData = (new d).init();
            this.model = (new f).init()
        };
        l._onConfigLoaded = function() {
            k._onConfigLoaded.call(this);
            this.getGenresData()
        };
        l.getGenresData = function() {
            if (null == this.copyManager._copyDocument) this.scheduler.next(this, this.getGenresData, []);
            else if (!this.genres) {
                this.genres = [];
                this.colors = [];
                var a = g.list.length;
                for (i =
                    0; i < a; i++) this.genres[g.list[i].backendID] = this.copyManager.getCopy(g.list[i].copyID), this.colors.push(g.list[i].color);
                this.settings.colors = this.colors;
                console.log("Genres list created", this.genres)
            }
        };
        h.createSingleton = function() {
            if (!e.singletons) e.singletons = {};
            if (!e.singletons.siteManager) e.singletons.siteManager = new h, e.singletons.siteManager.setup();
            return e.singletons.siteManager
        };
    }
})();
(function() {
    console.log("Namespace : ", breelNS.projectName);
    breelNS.getNamespace(breelNS.projectName).SiteManager.createSingleton().load(breelNS.dirRoot + "files/xml/config_cannes_during.xml", "common/files/copy/cannes/en_in.json");
    document.body.addEventListener("touchmove", function(a) {
        a.preventDefault()
    });
})();