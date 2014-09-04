// Renderer2D.js

breelNS.defineClass(breelNS.projectName+".canvas.Renderer2D", breelNS.projectName+".canvas.CanvasRenderer", function(p, s, Renderer2D) {
	
	var CanvasRenderer = breelNS.getNamespace(breelNS.projectName+".canvas").CanvasRenderer;
	var MathUtils      = breelNS.getNamespace("generic.math").MathUtils;
	var siteManager, scheduler, params;

	p.init = function(ctx) {
		siteManager 	  = breelNS.getNamespace(breelNS.projectName).singletons.siteManager;
		params			  = siteManager.settings.params;
		this._isLocked 	  = false;
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
		return s.init.call(this, ctx);
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
	};

	p._onTouchMove = function(e) {
		if(siteManager.globalStateManager.getCurrentState()!= "Landing") return;
		if(this._isLocked || this._mouseLocked) return;
		var orgX, orgY;
		if(e.touches) {
			var clickPos = {x:e.touches[0].pageX-this.width*.5, y:e.touches[0].pageY-this.height*.5};
			orgX = e.touches[0].pageX;
			orgY = e.touches[0].pageY
		} else {
			var clickPos = {x:e.clientX-this.width*.5, y:e.clientY-this.height*.5};
			orgX = e.clientX;
			orgY = e.clientY;
		}
		
		clickPos.x -= this._x;
		clickPos.y -= this._y;
		var overIndex = -1;
		var dist = 1000000;
		for(var i=0; i<this.childrenList.length; i++) {

			var p = this.childrenList[i];
			if(p.isGlobeParticle) continue;


				p.scaleInDepth = 1;
				var s = p.size*2;

				var d = p.distanceToPos(clickPos.x, clickPos.y);
				if(d < s*s && (d < dist)) {
					if(overIndex > -1){
						this.childrenList[overIndex].offsetScale = 0;
						this.childrenList[overIndex].targetSpeed = 1;
						this.childrenList[overIndex].mouseLocked = false;
					}
					dist = d;
					overIndex = i;
					p.offsetScale = 1;
					p.targetSpeed = 0.25;
					p.mouseLocked = true;
					this.dispatchCustomEvent("onParticleOver", {particle:p, x:orgX, y:orgY});
					//break;
				}else{
					p.offsetScale = 0;
					p.targetSpeed = 1;
					p.mouseLocked = false;
				}

			
		}
		if(overIndex < 0)this.dispatchCustomEvent("onParticleOut");
	}


	p._onTouchStart = function(e) {

		if(siteManager.globalStateManager.getCurrentState()!= "Landing") return;
		if(this._isLocked) return;

		var clickPos = {x:e.touches[0].pageX-this.width*.5, y:e.touches[0].pageY-this.height*.5};
		var orgX = e.touches[0].pageX;
		var orgY = e.touches[0].pageY

		clickPos.x -= this._x;
		clickPos.y -= this._y;

		var overIndex = -1;
		var dist = 1000000;

		for ( var i=0; i<this.childrenList.length; i++) {
			var p = this.childrenList[i];
			if(p.isGlobeParticle) continue;

			var s = p.size*p.scaleInDepth*2;
			try {
				var d = p.distanceToPos(clickPos.x, clickPos.y);

				if(d < s*s && (d < dist)) {
					console.log('FOUND ONE');
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

	p.render = function() {

		var ctx = this.ctx;
		var time = new Date().getTime();
		ctx.clearRect(0, 0, this.width, this.height);


		mat4.multiply(this.projection, this.camera.update(), this.mtx);
		mat4.multiply(this.projection, this.cameraGlobe.update(), this.mtxGlobe);
		var pos = vec3.create(),
			tmp = [],
			finalPos = vec3.create(),
			scale, tmpScale, alphaScale;

		ctx.save();
		ctx.translate(this.width*.5+this._x, this.height*.5+this._y);

		var len = this.childrenList.length;
		

		for ( var i=0; i<this.childrenList.length; i++) {
			var child = this.childrenList[i];
			var toDebug = Math.random() > .99;
			if(child.alpha == 0)  continue;

			vec3.set([child.x, child.y, child.z], pos);
			if(!child.isGlobeParticle) mat4.multiplyVec3(this.mtx, pos, finalPos);
			else mat4.multiplyVec3(this.mtxGlobe, pos, finalPos);

			scale = MathUtils.map(finalPos[2], 0, this.zFar, 0, 1);
			tmpScale = Math.pow(scale, params.sizeDifferenceInDepth);

			ctx.save();
			finalPos[0] *= scale;
			finalPos[1] *= scale;
			// alphaScale = MathUtils.contrast(scale, params.alphaDifferenceInDepth, .75);
			if(!child.finalPos) child.finalPos = vec3.create([finalPos]);
			else vec3.set(finalPos, child.finalPos);
			child.depthScale = scale;
			ctx.translate(finalPos[0], finalPos[1]);
			ctx.scale(tmpScale, tmpScale);
			if(child.size * tmpScale < .5) {
				ctx.restore();
				continue;
			}
			ctx.globalAlpha = child.alpha;

			if(ctx.globalAlpha >= .01 ) {
				
				if(child.connectDots.length > 0) {
					ctx.beginPath();
					ctx.globalAlpha = .5;
					
					for(var j=0; j<child.connectDots.length; j++) {

						var p = child.connectDots[j];
						if(child.finalPos != undefined && p.finalPos != undefined)  {
							if(child.isGlobeParticle) {
								// console.log( "Draw Globe Line" );
								ctx.moveTo(0, 0);
								ctx.strokeStyle = "rgba(255, 255, 255, .25);";
								ctx.lineTo( (p.finalPos[0]-child.finalPos[0])/tmpScale, (p.finalPos[1]-child.finalPos[1])/tmpScale);
								ctx.stroke();
							} else {
								// if(this._state == 1) {
									ctx.moveTo(0, 0);
									ctx.strokeStyle = p.color;
									ctx.lineTo( (p.finalPos[0]-child.finalPos[0])/tmpScale, (p.finalPos[1]-child.finalPos[1])/tmpScale);
									ctx.stroke();
								// }
							}
							
						}
					}
				}

				// var img = child.getTexture();
				// ctx.drawImage(img, -child.size*child.scale, -child.size*child.scale, child.size*2*child.scale, child.size*2*child.scale);
				ctx.beginPath();
				ctx.arc(0, 0, child.size*child.scale, 0, 2 * Math.PI, false);
				ctx.fillStyle = child.isGlobeParticle ? "#fff" : child.color;
				ctx.fill();
			}


			
			ctx.restore();
		}

		ctx.restore();
	};

	p.lock = function(toLock) {
		this._isLocked = toLock;
	};


	p.resize = function(width, height) {

		this.width            = width;
		this.height           = height;
		this.ctx.canvas.width  = this.width;
		this.ctx.canvas.height = this.height;
		
		// this.projection       = mat4.perspective(45, this.width/this.height, 1, this.zFar);
	};
});