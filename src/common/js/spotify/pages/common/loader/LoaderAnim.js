// LoaderAnim.js

breelNS.defineClass(breelNS.projectName+".loader.LoaderAnim", "generic.events.EventDispatcher", function(p, s, LoaderAnim) {
	var siteManager;
	var random = function(min, max) { return min + Math.random() * ( max - min); }

	p.init = function(container) {
		siteManager                   = breelNS.getNamespace(breelNS.projectName).singletons.siteManager;
		this._canvas                  = document.createElement("canvas");
		this._canvas.width            = 400;
		this._canvas.height           = 100;
		this._canvas.style.position   = "absolute";
		this._canvas.style.left       = "50%";
		this._canvas.style.marginLeft = "-200px";
		this._canvas.style.top        = "50%";
		this._canvas.style.marginTop  = "-150px";
		this._canvas.style.zIndex     = 5;
		
		this._container               = container;
		this._ctx                     = this._canvas.getContext("2d");
		this._percentage              = 0;
		this._targetPer               = 0;
		this._particles               = [];
		this._hasEnded				  = false;
		
		this._container.appendChild(this._canvas);
		this._numSteps                = 30;
		this._span                    = 1/ this._numSteps;
		this._efIndex                 = siteManager.scheduler.addEF(this, this.render, []);

		return this;
	};


	p.setPercentage = function(per) {
		this._targetPer = per;
	};


	p.render = function() {
		this._percentage += ( this._targetPer - this._percentage) * .05;
		var range = 15;
		var rangeY = 25;
		var colors = siteManager.settings.colors;

		while(this._percentage > this._particles.length * this._span) {
			range = Math.sin(this._particles.length/this._numSteps * Math.PI) * 25;
			rangeY = Math.sin(this._particles.length/this._numSteps * Math.PI) * 25;
			var tx = (this._particles.length+1) * this._span * this._canvas.width + random(-range, range);
			var ty = 50 + random(-rangeY, rangeY);
			var color = colors[Math.floor(Math.random() * colors.length)];
			var size = random(3, 6);
			var dot = new Dot(tx, ty, color, size);
			this._particles.push(dot);
		}

		this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);

		for(var i=0; i<this._particles.length-1; i++) {
			var p = this._particles[i];
			if(i == this._particles.length -2) break;

			if(p.hasConnection) {
				this._ctx.save();
				this._ctx.globalAlpha = p.alpha;
				this._ctx.beginPath();
				var p1 = this._particles[i+1];
				this._ctx.moveTo(p.x, p.y);
				this._ctx.strokeStyle = p1.color;
				this._ctx.lineTo(p1.x, p1.y);
				this._ctx.stroke();
				this._ctx.restore();
			}
		}

		for(var i=0; i<this._particles.length-1; i++) {
			var p = this._particles[i];
			p.update();
			this._ctx.save();	
			this._ctx.globalAlpha = p.alpha;
			this._ctx.beginPath();
			this._ctx.translate(p.x, p.y);
			this._ctx.fillStyle = p.color;
			this._ctx.arc(0, 0, p.size, 0, 2 * Math.PI, false);
			this._ctx.fill();
			this._ctx.restore();
		}

		// console.log( this._particles.length, this._targetPer );
		if(this._particles.length == this._numSteps && this._targetPer == 1 && !this._hasEnded) {
			this._hasEnded = true;
			siteManager.scheduler.delay(this, this.delayDispatch, [], 1000);
		}
	};


	p.delayDispatch = function() {
		this.dispatchCustomEvent("animComplete");
	};


	p.stop = function() {
		siteManager.scheduler.removeEF(this._efIndex);
	};


	p.getCanvas = function() { return this._canvas; };
});


(function() {
	var random = function(min, max) { return min + Math.random() * ( max - min); }

	Dot = function(x, y, color, size) {
		this.tx = x;
		this.ty = y;
		var range = 10;
		this.x = x + random(-range, range);
		this.y = y + random(-range, range);
		this.color = color;
		this.size = 0;
		this.targetSize = size;
		this.alpha = 0;
		this.easing = random(.1, .05);
		this.hasConnection = Math.random() > .66;
	}

	var p = Dot.prototype;

	p.update = function() {
		this.x += ( this.tx - this.x) * this.easing;
		this.y += ( this.ty - this.y) * this.easing;
		this.alpha += (1.0 - this.alpha) * this.easing;
		this.size += (this.targetSize - this.size) * this.easing;
	};
})();