// HoverCamera.js

breelNS.defineClass(breelNS.projectName+".canvas.HoverCamera", breelNS.projectName+".canvas.SimpleCamera", function(p, s, HoverCamera) {
	var ListenerFunctions = breelNS.getNamespace("generic.events").ListenerFunctions;
	var siteManager
	p.init = function(radius, speed, isInvert) {
		siteManager              = breelNS.getNamespace(breelNS.projectName).singletons.siteManager;
		this._targetRadius       = radius;
		this.radius 		     = this._targetRadius;
		this._speed              = speed == undefined ? .015 : speed;
		
		this._targetRX           = 0;
		this._tempRX             = 0;
		this.rx                  = 0;
		this._targetRY           = -Math.PI/2;
		this._tempRY             = -Math.PI/2;
		this.ry                  = -Math.PI/2;
		this._distx              = 0;
		this._disty              = 0;
		this._prex               = 0;
		this._prey               = 0;
		this.mouseX              = 0;
		this.mouseY              = 0;
		this._needUpdate         = false;
		this.lockWheel           = true;
		this.lockRx              = false;
		this.lockRy              = false;
		this._isLocked           = false;
		this._isInvert 			 = isInvert === undefined ? false : isInvert;
		this._xOffset			 = 0;
		this._targetXOffset	 	 = 0;
		this._yOffset			 = 0;
		this._targetYOffset	 	 = 0;

		this._onMouseDownBound   = ListenerFunctions.createListenerFunction(this, this._onMouseDown);
		this._onMouseMoveBound   = ListenerFunctions.createListenerFunction(this, this._onMouseMove);
		this._onMouseUpBound     = ListenerFunctions.createListenerFunction(this, this._onMouseUp);
		this._onMouseWheelBound  = ListenerFunctions.createListenerFunction(this, this._onMouseWheel);
		
		this._onMotionBound      = ListenerFunctions.createListenerFunction(this, this._onMotion);
		// ListenerFunctions.addDOMListener(window, "devicemotion", this._onMotionBound);
		
		this._touchEventsEnabled = false;			
		// this.enableTouchEvents();

		this.matrix = mat4.create();
		mat4.identity(this.matrix);

		this.x = 0;
		this.y = 0;
		this.z = 0;

		this.target = vec3.create([0, 0, 0]);
		this.up 	= vec3.create([0, -1, 0]);
		this.eye 	= vec3.create();

		document.addEventListener("mousemove", this._offsetCameraAngle.bind(this));

		return this;
	};


	
	p._offsetCameraAngle = function(e) {
		
		if(!this.respondToMousePos) return;
		
		this._targetXOffset = e.clientX / window.innerWidth - .5;
		this._targetYOffset = e.clientY / window.innerHeight - .5;
	};

	


	p._onMotion = function(e) {
		this._needUpdate = true;
		this.mouseY = event.accelerationIncludingGravity.x * (-20);
		this.mouseX = event.accelerationIncludingGravity.z * 20;
	}

	p.enableTouchEvents = function() {

		if (this._touchEventsEnabled) return;
		this._touchEventsEnabled = true;

		ListenerFunctions.addDOMListener(document,"mousedown",this._onMouseDownBound);
		ListenerFunctions.addDOMListener(document,"mouseup",this._onMouseUpBound);
		ListenerFunctions.addDOMListener(document,"mousemove",this._onMouseMoveBound);

		ListenerFunctions.addDOMListener(document,"touchstart",this._onMouseDownBound);
		ListenerFunctions.addDOMListener(document,"touchend",this._onMouseUpBound);
		ListenerFunctions.addDOMListener(document,"touchmove",this._onMouseMoveBound);

		if(siteManager.config.enableMouseWheel == "true") {
			ListenerFunctions.addDOMListener(document,"mousewheel",this._onMouseWheelBound);
			ListenerFunctions.addDOMListener(document,"DOMMouseScroll",this._onMouseWheelBound);
		}

	};


	p.disableTouchEvents = function() {

		this._touchEventsEnabled = false;

		ListenerFunctions.removeDOMListener(document,"mousedown",this._onMouseDownBound);
		ListenerFunctions.removeDOMListener(document,"mouseup",this._onMouseUpBound);
		ListenerFunctions.removeDOMListener(document,"mousemove",this._onMouseMoveBound);

		ListenerFunctions.removeDOMListener(document,"touchstart",this._onMouseDownBound);
		ListenerFunctions.removeDOMListener(document,"touchend",this._onMouseUpBound);
		ListenerFunctions.removeDOMListener(document,"touchmove",this._onMouseMoveBound);

		if(siteManager.config.enableMouseWheel == "true") {
			ListenerFunctions.removeDOMListener(document,"mousewheel",this._onMouseWheelBound);
			ListenerFunctions.removeDOMListener(document,"DOMMouseScroll",this._onMouseWheelBound);
		}

	};

	p._onMouseDown = function(e) {
		this._needUpdate = true;
		if(e.clientX) {
			this._prex = e.clientX;
			this._prey = e.clientY;
		} else if(e.touches) {
			this._prex = e.touches[0].pageX;
			this._prey = e.touches[0].pageY;
		} else {
			return;
		}
		
		this._tempRX = this.rx;
		this._tempRY = this.ry;
	}


	p._onMouseUp = function(e) {
		this._needUpdate = false;
	}


	p._onMouseMove = function(e) {

		e.preventDefault();
		if(e.clientX) {
			this.mouseX = e.clientX;
			this.mouseY = e.clientY;
		} else if(e.touches) {
			this.mouseX = e.touches[0].pageX;
			this.mouseY = e.touches[0].pageY;
		} else {
			return;
		}
	}


	p._onMouseWheel = function(e) {
		e.preventDefault();
		if(this.lockWheel || this._isLocked) return;
		var w = e.wheelDelta;
		var d = e.detail;
		var value = 0;
		if (d){
			if (w) value = w/d/40*d>0?1:-1; // Opera
		    else value = -d/3;              // Firefox;         TODO: do not /3 for OS X
		} else value = w/120; 

		this._targetRadius -= value*5;
	}


	p._updateDistance = function() {
		this._distx = (this.mouseY - this._prey) / 200;
		this._disty = (this.mouseX - this._prex) / 200;
	}


	p.update = function() {
		if(this._needUpdate) {
			this._updateDistance();
			this._targetRX = this._tempRX + this._distx;
			this._targetRY = this._tempRY + this._disty;
		}

		if(!this.lockRx && !this._isLocked) this.rx += (this._targetRX - this.rx) * this._speed;
		if(!this.lockRy && !this._isLocked) this.ry += (this._targetRY - this.ry) * this._speed;
		// this.ry += (this._targetRY - this.ry) * this._speed;

		var limit = Math.PI/2-.2;
		if(this.rx > limit) {
			this.rx = limit;
			this._targetRX = limit;
		} else if(this.rx < -limit) {
			this.rx = -limit;
			this._targetRX = -limit;
		}

		var ry = this._isInvert ? -this.ry : this.ry;

		this.radius += (this._targetRadius - this.radius ) * this._speed;
		

		this._xOffset += (this._targetXOffset - this._xOffset) * .02;
		this._yOffset += (this._targetYOffset - this._yOffset) * .02;

		var rng = 1000;

		this.x = -Math.cos(this.rx) * Math.cos(ry) * this.radius - this._xOffset * rng;
		this.y = -Math.sin(this.rx) * this.radius - this._yOffset * rng;
		this.z = -Math.cos(this.rx) * Math.sin(ry) * this.radius;

		return s.update.call(this);;
	}


	p.lock = function(aBoolean, aTrx) {
		if(VisualiserSettings == undefined) VisualiserSettings = breelNS.getNamespace("allForThis.visualiser").VisualiserSettings;
		this._isLocked = aBoolean;
		// console.log("aBoolean, aTrx : ", aBoolean, aTrx);
		var trx = this._isLocked ? VisualiserSettings.inspectCameraAngleLock : 0;
		// console.log("VisualiserSettings.inspectCameraAngleLock : ", VisualiserSettings.inspectCameraAngleLock);
		// console.log("trx : ", trx);
		if(aTrx !== undefined) trx = aTrx;

		var tween = new TWEEN.Tween(this).to({'rx':trx, 'ry':-Math.PI/2}, 1000).easing(TWEEN.Easing.Cubic.EaseOut).start();
		this._targetRX = trx;
		this._tempRX = trx;
		this._targetRY = -Math.PI/2;
		this._tempRY = -Math.PI/2;
		this._distx = 0;
		this._disty = 0;
		this._prex = 0;
		this._prey = 0;
		this.mouseX = 0;
		this.mouseY = 0;
	}
});