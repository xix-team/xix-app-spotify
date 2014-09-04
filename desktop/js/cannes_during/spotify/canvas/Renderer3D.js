// Renderer3D.js

breelNS.defineClass(breelNS.projectName+".canvas.Renderer3D", breelNS.projectName+".canvas.CanvasRenderer", function(p, s, Renderer3D) {

	var CanvasRenderer = breelNS.getNamespace(breelNS.projectName+".canvas").CanvasRenderer;
	var HoverCamera = breelNS.getNamespace(breelNS.projectName + ".canvas").HoverCamera;
	var siteManager, scheduler, params, colors;

	p.init = function(ctx) {
		siteManager           = breelNS.getNamespace(breelNS.projectName).singletons.siteManager;
		params                = siteManager.settings.params;
		colors 				  = siteManager.settings.colors;
		scheduler             = siteManager.scheduler;
		this.gl               = ctx;
		this.width            = ctx.canvas.width;
		this.height           = ctx.canvas.height;
		this.zFar             = 4000;
		this._x               = 0;
		this._y               = 0; 
		this.childrenList     = [];
		this.projection       = mat4.create();
		this.camera           = mat4.create();
		this.isStarted        = true;
		this.matrix           = mat4.create();
		mat4.identity(this.matrix);
		
		this.gl.viewport(0, 0, this.width, this.height);
		// this.gl.disable(this.gl.DEPTH_TEST);
		this.gl.enable(this.gl.CULL_FACE);
		this.gl.clearColor( 0, 0, 0, 0 );
		this.gl.enable(this.gl.BLEND);
		this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);	
		
		this.projection       = mat4.perspective(45, ctx.canvas.width/ctx.canvas.height, 1, this.zFar);
		this.camera           = new HoverCamera().init(2000, .1, true);
		this.camera._targetRX = -Math.PI * .25;
		this.camera._targetRY = -Math.PI * .4;
		this.camera.target.set([0, 100, 0]);

		this.cameraGlobe      = new HoverCamera().init(2000, .1, true);
		this.cameraGlobe.target.set([0, 100, 0]);
		this.cameraGlobe.enableTouchEvents();
		
		this.mtx              = mat4.create();
		this.efIndex          = scheduler.addEF(this, this.render, []);
		this.buf              = new Uint8Array(4);
		this.isIn2D  	  	  = false;
		this._state	 	  	  = 0;
		this._prestate	  	  = 0;
		this._isLocked		  = false;

		this._initTextures();
		this._initViews();

		var that = this;


		this.isTouch = false;

		if ("ontouchstart" in window || navigator.msMaxTouchPoints)
        {
            this.isTouch = true;
        } else {
            this.isTouch = false;
        }

		if(!this.isTouch){
			document.body.addEventListener("click", function(e) { that._onClick(e); });
			document.body.addEventListener("mousemove", function(e) { that._onTouchMove(e); });
		}else{
			document.body.addEventListener("touchstart", function(e) { that._onTouchStart(e); });
		}
		

		return this;
	};


	p._onClick = function(e) {
		if(siteManager.globalStateManager.getCurrentState()!= "Landing") return;
		if(this._isLocked) return;

		for ( var i=0; i<this.childrenList.length; i++) {
			var p = this.childrenList[i];
			if(p.isGlobeParticle) continue;
			if(p.mouseLocked){
				p.mouseLocked = false;
				this.dispatchCustomEvent(CanvasRenderer.ON_PARTICLE_CLICK, {particle:p});
				break;
			}
		}

		/*
		if(e.touches) {
			var near = vec3.create([e.touches[0].pageX, this.height-e.touches[0].pageY, 0]);
			var far = vec3.create([e.touches[0].pageX, this.height-e.touches[0].pageY, 1]);
		} else {
			var near = vec3.create([e.clientX, this.height-e.clientY, 0]);
			var far = vec3.create([e.clientX, this.height-e.clientY, 1]);
		}
		
		var view = this.camera.update();
		var viewport = [0, 0, this.width, this.height];
		var posNear = vec3.unproject(near, view, this.projection, viewport);
		var posFar = vec3.unproject(far, view, this.projection, viewport);

		for ( var i=0; i<this.childrenList.length; i++) {
			var p = this.childrenList[i];
			if(p.isGlobeParticle) continue;
			var per = (p.z - posNear[2]) / (posFar[2] - posNear[2]);
			var tx = per * ( posFar[0] - posNear[0]) + posNear[0];
			var ty = per * ( posFar[1] - posNear[1]) + posNear[1];

			var s = p.size*p.scaleInDepth*2;
			try {
				if(p.distanceToPos(tx, ty) < s*s) {
					this.dispatchCustomEvent(CanvasRenderer.ON_PARTICLE_CLICK, {particle:p});
					break;
				}
			}catch(e) {

			}
		}*/
	};


	p._onTouchMove = function(e) {

		if(siteManager.globalStateManager.getCurrentState()!= "Landing") return;
		if(this._isLocked || this._mouseLocked) return;
		var near = vec3.create([e.clientX, this.height-e.clientY, 0]);
		var far = vec3.create([e.clientX, this.height-e.clientY, 1]);
		var view = this.camera.matrix;
		var viewport = [0, 0, this.width, this.height];
		var posNear = vec3.unproject(near, view, this.projection, viewport);
		var posFar = vec3.unproject(far, view, this.projection, viewport);
		var overIndex = -1;
		var dist = 1000;
		for ( var i=0; i<this.childrenList.length; i++) {
			var p = this.childrenList[i];
			if(p.isGlobeParticle) continue;
			var per = (p.z - posNear[2]) / (posFar[2] - posNear[2]);
			var tx = per * ( posFar[0] - posNear[0]) + posNear[0];
			var ty = per * ( posFar[1] - posNear[1]) + posNear[1];
			var s = p.size*p.scaleInDepth*2;
			
			var d = p.distanceToPos(tx, ty);
			if(d < s*s && (d < dist)) {
				if(overIndex > -1){
					this.childrenList[overIndex].offsetScale = 0;
					this.childrenList[overIndex].targetSpeed = 1;
					p.mouseLocked = false;
				}
				dist = d;
				overIndex = i;
				p.offsetScale = 1;
				p.targetSpeed = 0.25;
				p.mouseLocked = true;

				
				
			}else{
				p.offsetScale = 0;
				p.targetSpeed = 1;
				p.mouseLocked = false;
			}
			
		}
		if(overIndex < 0)this.dispatchCustomEvent("onParticleOut");
		else this.dispatchCustomEvent("onParticleOver", {particle:this.childrenList[overIndex], x:e.clientX, y:e.clientY});
	};


	p._onTouchStart = function(e) {

		if(siteManager.globalStateManager.getCurrentState()!= "Landing") return;
		if(this._isLocked) return;

		var near = vec3.create([e.touches[0].pageX, this.height-e.touches[0].pageY, 0]);
		var far = vec3.create([e.touches[0].pageX, this.height-e.touches[0].pageY, 1]);

		var view = this.camera.matrix;
		var viewport = [0, 0, this.width, this.height];
		var posNear = vec3.unproject(near, view, this.projection, viewport);
		var posFar = vec3.unproject(far, view, this.projection, viewport);
		var overIndex = -1;
		var dist = 1000000;

		for ( var i=0; i<this.childrenList.length; i++) {
			var p = this.childrenList[i];
			if(p.isGlobeParticle) continue;
			var per = (p.z - posNear[2]) / (posFar[2] - posNear[2]);
			var tx = per * ( posFar[0] - posNear[0]) + posNear[0];
			var ty = per * ( posFar[1] - posNear[1]) + posNear[1];
			var s = p.size*p.scaleInDepth*2;
			try {
				var d = p.distanceToPos(tx, ty);
				if(d < s*s && (d < dist)) {
					if(overIndex > -1){
						this.childrenList[overIndex].offsetScale = 0;
						this.childrenList[overIndex].targetSpeed = 1;
						p.mouseLocked = false;
					}
					dist = d;
					overIndex = i;
					p.offsetScale = 1;
					p.targetSpeed = 0.25;
					p.mouseLocked = true;
					
				}else{
					p.offsetScale = 0;
					p.targetSpeed = 1;
					p.mouseLocked = false;
				}
			} catch (e) {
				console.log( 'ERROR : ', p );
			}
		}

		if(overIndex > -1)this.dispatchCustomEvent(CanvasRenderer.ON_PARTICLE_CLICK, {particle:this.childrenList[overIndex]});
	};

	p.stop = function() {
		scheduler.removeEF(this.efIndex);
		this.efIndex = -1;
	};


	p._initTextures = function() {
		var canvas = document.createElement("canvas");
		canvas.width = 512;
		canvas.height = 512;
		var c = canvas.getContext("2d");
		var i;
		for(i=0; i<colors.length; i++) {
			var tx = i%4;
			var ty = Math.floor(i/4);
			c.beginPath();
			c.arc(64+128*tx, 64+128*ty, 60, 0, 2 * Math.PI, false);
			c.fillStyle = colors[i];
			c.fill();
		}

		i = colors.length;
		var tx = i%4;
		var ty = Math.floor(i/4);
		c.beginPath();
		c.arc(64+128*tx, 64+128*ty, 60, 0, 2 * Math.PI, false);
		c.fillStyle = "#fff";
		c.fill();

		this.texture = new bongiovi.GLTexture(this.gl, canvas);
	};


	p._initViews = function() {
		this._vParticles 	= new ViewParticles(this.gl, false);
		this._vGlobe 		= new ViewGlobe(this.gl);
		this._vLines 		= new ViewLines(this.gl, false);
		this._vGlobeLines 	= new ViewGlobeLines(this.gl, true);
		this._vPicking	    = new ViewPicking(this.gl);
	};


	p._generateBuffers = function() {

		this._vParticles.updateModel(this.childrenList);
		this._vGlobe.updateModel(this.childrenList);
		this._vLines.updateModel(this.childrenList);
		this._vGlobeLines.updateModel(this.childrenList);
	};


	p.render = function() {

		this._generateBuffers();

		this.matrix = this.camera.update();
		this.matrixGlobe = this.cameraGlobe.update();
		this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
		

		if(this._vParticles.isReady) {
			this._vLines.render(this.matrix, this.projection, this.texture);
			this._vParticles.render(this.matrix, this.projection, this.texture);
			this._vGlobeLines.render(this.matrixGlobe, this.projection, this.texture);
			this._vGlobe.render(this.matrixGlobe, this.projection, this.texture);
		}
	};


	p.lock = function(toLock) {
		this._isLocked = toLock;
	};


	p.resize = function(width, height) {
		this.width            = width;
		this.height           = height;
		this.gl.canvas.width  = this.width;
		this.gl.canvas.height = this.height;
		this.gl.viewport(0, 0, this.width, this.height);
		this.projection       = mat4.perspective(45, this.width/this.height, 1, this.zFar);
	};
});


vec3.unproject = function (vec, view, proj, viewport, dest) {
    if (!dest) { dest = vec; }

    var m = mat4.create();
    var v = new Array(4);

    v[0] = (vec[0] - viewport[0]) * 2.0 / viewport[2] - 1.0;
    v[1] = (vec[1] - viewport[1]) * 2.0 / viewport[3] - 1.0;
    v[2] = 2.0 * vec[2] - 1.0;
    v[3] = 1.0;

    mat4.multiply(proj, view, m);
    if(!mat4.inverse(m)) { return null; }

    mat4.multiplyVec4(m, v);
    if(v[3] === 0.0) { return null; }

    dest[0] = v[0] / v[3];
    dest[1] = v[1] / v[3];
    dest[2] = v[2] / v[3];

    return dest;
};