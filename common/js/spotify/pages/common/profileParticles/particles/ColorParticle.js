// ColorParticle.js

breelNS.defineClass(breelNS.projectName+".common.profileParticles.particles.ColorParticle", breelNS.projectName+".common.profileParticles.particles.DomParticle", function(p, s, ColorParticle) {
	var random = function(a, b) { return a + Math.random() * ( b - a); }
	var siteManager;

	p.init = function(parent, params) {

		siteManager = breelNS.getNamespace(breelNS.projectName).singletons.siteManager;

		s.init.call(this, parent, params);
		this.acc       	   = params.colorAcceleration;
		
		this.el.style.background = this.color;
		this.parent = parent;
		this.endAnimationDuration = this.params.colorParticleEndAnimationDuration;
		this.currentOpacity = 1;

		this.type = 'color';
		this.detractTimer = null;

		this.parentWidthCenter = this.parent.clientWidth/2;
		this.parentHeightCenter = this.parent.clientHeight/2;

	
		this.onResize({w: this.parent.clientWidth, h: this.parent.clientHeight}, params, false);

		return this;
	};

	

	p.render = function(){

		// this.el.style.height = this.size*2 + 'px';
		// this.el.style.width = this.size*2 + 'px';

		// this.el.style.left = this.parentWidthCenter - this.size + 'px';
		// this.el.style.top = this.parentHeightCenter - this.size + 'px';

		var left = Math.round(this.x);
		var top = Math.round(this.y);

		if (this.endAnimation){
			this.currentOpacity -= (1 / this.endAnimationDuration) * 1;
			this.el.style.opacity = this.currentOpacity;
			if (this.currentOpacity < 0.001){
				this.el.style.opacity = 0;
				this.endAnimation = false;
			}
		}
		
		this.el.style[siteManager.animationManager.currentTransformStr] = siteManager.animationManager.getTranslateStr(left, top);
		// this.el.style.borderRadius = this.size + 'px';

	};

	p.onResize = function(dims, params, changePullMode){

		// clearTimeout(this.detractTimer);

		var baseSize = dims.w * params.colorParticleMultiplier;
		this.size =	random(baseSize, baseSize+params.sizeDifference);

		this.parentWidthCenter = dims.w/2;
		this.parentHeightCenter = dims.h/2;


		this.el.style.height = this.size*2 + 'px';
		this.el.style.width = this.size*2 + 'px';

		this.el.style.left = this.parentWidthCenter - this.size + 'px';
		this.el.style.top = this.parentHeightCenter - this.size + 'px';

		this.el.style.borderRadius = this.size + 'px';

		
		

		
		if (!changePullMode) return;
		
		this.setPullMode(true);
		// var self = this;
		// this.detractTimer = setTimeout(function(){
		// 	// self.pullMode = false;
		// },500);
	};
	

});