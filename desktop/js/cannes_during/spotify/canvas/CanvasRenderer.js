// CanvasRenderer.js

breelNS.defineClass(breelNS.projectName+".canvas.CanvasRenderer", "generic.events.EventDispatcher", function(p, s, CanvasRenderer) {
	var MathUtils 	= breelNS.getNamespace("generic.math").MathUtils;
	var HoverCamera = breelNS.getNamespace(breelNS.projectName + ".canvas").HoverCamera;
	var Renderer2D  = breelNS.getNamespace(breelNS.projectName + ".canvas").Renderer2D;
	var Renderer3D  = breelNS.getNamespace(breelNS.projectName + ".canvas").Renderer3D;
	var siteManager, scheduler, params;

	CanvasRenderer.ON_PARTICLE_CLICK = "onParticleClick";
	CanvasRenderer.ON_PARTICLE_OVER  = "onParticleOver";

	p.init = function(ctx) {
		this.ctx          = ctx;
		siteManager 	  = breelNS.getNamespace(breelNS.projectName).singletons.siteManager;
		params			  = siteManager.settings.params;
		scheduler         = siteManager.scheduler;
		
		this.width        = this.ctx.canvas.width;
		this.height       = this.ctx.canvas.height;
		this.zFar         = 3000;
		this._x           = 0;
		this._y           = 0; 
		
		this.childrenList = [];
		this.projection   = mat4.create();
		this.camera       = mat4.create();
		this.isStarted    = true;
		
		
		this.projection   = mat4.perspective(90, 1, .1, this.zFar);
		this.camera       = new HoverCamera().init(2000);
		this.camera._targetRX = -Math.PI * .25;
		this.camera._targetRY = -Math.PI * .4;

		this.cameraGlobe       = new HoverCamera().init(2000);
		// this.cameraGlobe._targetRX = -Math.PI * .25;
		// this.cameraGlobe._targetRY = -Math.PI * .4;
		this.cameraGlobe.enableTouchEvents();

		this.mtx          = mat4.create();
		this.mtxGlobe     = mat4.create();
		this.efIndex      = scheduler.addEF(this, this.render, []);
		this.isIn2D  	  = true;
		this._state	 	  = 0;
		this._prestate	  = 0;
		this._mouseLocked = false;
		return this;
	};


	p.start = function() {
		if(this.efIndex == -1) this.efIndex = scheduler.addEF(this, this.render, []);
	};


	p.stop = function() {
		scheduler.removeEF(this.efIndex);
		this.efIndex = -1;
	};


	p.render = function() {
		//	MUST BE OVERRIDEN	
	};


	p.setState = function(index) {
		if(this._state == index) return;
		this._preState = this._state;
		this._state = index;
	};


	p.addChild = function(child) {
		this.childrenList.push(child);
	};

	p.removeChild = function(child) {
		if(this.childrenList.indexOf(child) == -1) return;
		this.childrenList.splice(this.childrenList.indexOf(child), 1);
	};


	p.removeAll = function() {
		this.childrenList = [];
	};


	p.updateChildrenList = function(list) {
		this.childrenList = list;
	};

	CanvasRenderer.createRenderer = function(canvas, force2D) {
		Renderer2D  = breelNS.getNamespace(breelNS.projectName + ".canvas").Renderer2D;
		Renderer3D  = breelNS.getNamespace(breelNS.projectName + ".canvas").Renderer3D;
		console.log( "Create Renderer : ", browserName );

		var strWebgl = browserName == "Safari" ? "experimental-webgl" : "webgl";

		
		if(force2D) {
			this.isIn2D = true;
			var renderer = new Renderer2D().init(canvas.getContext("2d"));
			renderer.isIn2D = true;
			return renderer;
		} else {
			if (!window.WebGLRenderingContext) {
				// Browser has no idea what WebGL is. Suggest they
				// get a new browser by presenting the user with link to
				// http://get.webgl.org
				var renderer = new Renderer2D().init(canvas.getContext("2d"));
				renderer.isIn2D = true;
				return renderer;
			}

			gl = canvas.getContext(strWebgl);   
			if (!gl) {
				// Browser could not initialize WebGL. User probably needs to
				// update their drivers or get a new browser. Present a link to
				// http://get.webgl.org/troubleshooting
				var renderer = new Renderer2D().init(canvas.getContext("2d"));
				renderer.isIn2D = true;
				return renderer;
			}

			var renderer = new Renderer3D().init(canvas.getContext(strWebgl));
			// var renderer = new Renderer3D().init(canvas.getContext("webgl", { premultipliedalpha: false }));
			renderer.isIn2D = false;

			return renderer;
		}
		
	}

});