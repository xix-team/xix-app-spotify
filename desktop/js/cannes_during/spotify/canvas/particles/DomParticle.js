// DomParticle.js

breelNS.defineClass(breelNS.projectName+".canvas.particles.DomParticle", "generic.events.EventDispatcher", function(p, s, DomParticle) {
	var random = function(a, b) { return a + Math.random() * ( b - a); }
	var colors = ["#f7d364", "#82b600", "#137054", "#98ceb7", "#2694ac", "#003e5e"];
	var siteManager;

	

	p.init = function(parent, params) {

		siteManager = breelNS.getNamespace(breelNS.projectName).singletons.siteManager;
		this.x          = 0;
		this.y          = 0;
		this.vx         = 0;
		this.vy         = 0;
		this.ax         = 0;
		this.ay         = 0;
		// this.acc        = params.acceleration;
		this.vel        = .1;
		this.decreasing = params.velocityDecreasing;
		this.color      = siteManager.settings.colors[Math.floor(Math.random() * siteManager.settings.colors.length)];
		// this.size       = random(params.baseSize, params.baseSize+params.sizeDifference);
		this.isLocked	= false;
		this._innerAdjust = 10;
		this.params = params;
		// this.detractMode = false;
		this._data = null;

		this.closestGravityChild = null;
		this.pullMode = false;
		this._inHoverMode = false;
		this._index = undefined;

		this.startAnimation = true;
		this.endAnimation = false;
		this.relativeParticle = null;

		this.startDistanceToGravity = undefined;
		this.currentDistanceToGravity = undefined;

		this.totalRadianDistance = undefined;
		this.startRotateRadian = undefined;
		this.currentRotateRadian = undefined;

		this.currentScale = 1;
		this.colorOverlay = null;

		this.el = document.createElement('div');
		this.el.className = 'particle';

		this.visibleContainer = document.createElement('div');
		this.visibleContainer.className = 'visibleContainer';
		this.albumEl = document.createElement('div');
		this.albumEl.className = 'albumContainer';
		this.innerEl = document.createElement('div');
		this.innerEl.className = 'innerEl';
		this.innerEl.style.borderRadius = '10000px';
		this.bgInnerEl = document.createElement('div');
		this.bgInnerEl.className = 'bgInnerEl';
		this.bgInnerEl.style.borderRadius = '10000px';

		this.innerEl.appendChild(this.bgInnerEl);
		this.detailEl = document.createElement('div');
		this.detailEl.className = 'detailEl';

		this.detailCopyHolder = document.createElement('div');
		this.detailCopyHolder.className = "detailCopyHolder";

		this.profileName = document.createElement('h3');
		this.profileName.className = 'profileName';

		this.lowDetail = document.createElement('h5');
		this.lowDetail.className = 'lowDetail';

		this.detailCopyHolder.appendChild(this.profileName);
		this.detailCopyHolder.appendChild(this.lowDetail);

		this.detailEl.appendChild(this.detailCopyHolder);

		this.visibleContainer.appendChild(this.innerEl);
		this.visibleContainer.appendChild(this.detailEl);
		this.el.appendChild(this.albumEl);
		this.el.appendChild(this.visibleContainer);

		this.el.addEventListener('mouseover', this._onMouseOver.bind(this), false);
		this.el.addEventListener('mouseout', this._onMouseOut.bind(this), false);
		this.el.addEventListener('click', this._onClick.bind(this), false);

		this.childrenInPullMode = true;
		this.checkPullOnChildren = true;

		this.scale = 0;
		this.infoOpacity = 0;
		this.opacity = 0;
		this.innerScale = 1;
		this.offsetScale = 0;
		this.triggered = false;

		this.offset = {x: 0, y: 0};


		CSS.set(this.el, {opacity: 0});
		parent.appendChild(this.el);

	
		this.parent = parent;

		console.log('INIT PARTICLE');

		return this;
	};

	p.createColorOverlay = function(){

		return;
		this.colorOverlay = document.createElement('div');
		this.colorOverlay.className = 'colorOverlay';
		this.visibleContainer.appendChild(this.colorOverlay);
		var color = siteManager.settings.colors[this._data.genre];
		this.colorOverlay.style.background = color;

		this.onResize({w:window.innerWidth, h: window.innerHeight});

	};


	p._onMouseOver = function(e){
		if (this._inHoverMode) return;
		this._inHoverMode = true;
		this.checkPullOnChildren = false;
		
	};

	p._onMouseOut = function(e){
		if (!this._inHoverMode) return;
		this._inHoverMode = false;
	};

	p.setPullMode = function(val){
		this.pullMode = val;
	};


	p.setIndex = function(index){
		this._index = index;
	};

	p.getIndex = function(){
		return this._index;	
	};

	p.remove = function(){
		// console.log('parent: ',this.parent, 'el: ',this.el);
		this.parent.removeChild(this.el);
	};

	p.getCenterPoint = function(){

		return {x: (this.parentDims.w / 2) - this.size, y: (this.parentDims.h / 2) - this.size};
	};
	

	p.setGravityPoint = function(p){

		// debugger;
		this.closestGravityChild = p;
		
	};

	p.getDistanceTo = function(p){

		return this.distanceTo(p)	
	};


	p.checkParticlePull = function(){


		dist = Math.sqrt(this.distanceTo(this.closestGravityChild));
		// dist -= this.closestGravityChild.size;
		if (this.startDistanceToGravity === undefined)
			this.startDistanceToGravity = dist;
		
		this.currentDistanceToGravity = dist;

		var range = this.size + this.closestGravityChild.size;
	
		var nf = this._getNormal(this.closestGravityChild, this, dist);
		var fx = nf.x * ( 1.0 - range/dist ) * this.acc;
		var fy = nf.y * ( 1.0 - range/dist ) * this.acc;
		this.ax += fx;
		this.ay += fy;
		// console.log(fx);

	
	};



	p.checkParticle = function(p) {
		if(this.x == p.x && this.y == p.y) {
			this.x += random(1, -1);
			this.y += random(-1, 1);
		} 

		dist = Math.sqrt(this.distanceTo(p) );
		
		var range = this.size + p.size;
		if(dist > range) dist = range;
		
		var nf = this._getNormal(this, p, dist);
		var fx = nf.x * ( 1.0 - dist/range ) * this.acc;
		var fy = nf.y * ( 1.0 - dist/range ) * this.acc;
		if (isNaN(fx)) debugger;
		this.ax += fx;
		this.ay += fy;

		// this.imageScale = (this.size-5)*2/this.image.width;


	};

	p.update = function() {
		if(this.isLocked) return;
		this.vx += this.ax;
		this.vy += this.ay;


		this.x += this.vx;
		this.y += this.vy;

		if (isNaN(this.x)) debugger;

		if(this.ax == 0 && this.ay == 0) {
			// var forceToCenter = 0;
			// this.vx += this.vx > 0 ? -forceToCenter : forceToCenter;
			// this.vy += this.vy > 0 ? -forceToCenter : forceToCenter;
		} else {
			this.ax = this.ay = 0;
		}
		
		this.vx *= this.decreasing;
		this.vy *= this.decreasing;


	};


	p._getNormal = function(p2, p1, length) {
		var x = p2.x - p1.x;
		var y = p2.y - p1.y;
		var o = {x:x/length, y:y/length};
		if (isNaN(o.x)) debugger;
		return o;
	};


	p.render = function(ctx, index) {

		if(!this.renderedOnce) CSS.set(this.el, {opacity: 1});
		this.renderedOnce = true;

		var x = Math.round(this.x*100)/100;
		var y = Math.round(this.y*100)/100;
		var s = Math.round(this.scale*1000)/1000;
		var o = Math.round(this.opacity*100)/100;


		if(this.lastO !== o || this.lastS !== s || this.lastX !== x || this.lastY !== y){
			//main element
			CSS.set(this.el, {
				opacity: o,
				transform: CSS.to3DString('transform', x + this.offset.x, y + this.offset.y) + ' ' +
				CSS.to3DString('scale', s, s)
			});
		}

		this.lastO = o;
		this.lastS = s;
		this.lastY = y;
		this.lastX = x;

		

		
		//scale one mouse over
		s = Math.round(this.innerScale*1000)/1000;

		if(this.hoverLastS !== s){
			CSS.set(this.innerEl, {
				transform: CSS.to3DString('scale', s, s)
			});
		} 
		

		//show details
		o = Math.round(this.infoOpacity*100)/100;

		if(this.hoverLastO !== o){
			CSS.set(this.detailEl, {opacity: o});
			CSS.set(this.bgInnerEl, {opacity: o});
		} 
		
		


		this.hoverLastO = o;
		this.hoverLastS = s;

	};



	p.distanceTo = function(p) {
		return (this.x-p.x)*(this.x-p.x)+(this.y-p.y)*(this.y-p.y);
	};

	p.getClosestPointInCircle = function(radius, centerPoint){

		var xDiff = centerPoint.x - (this.x + centerPoint.x);
		var yDiff = centerPoint.y - (this.y + centerPoint.y);

		var x = centerPoint.x + radius * ( xDiff / Math.sqrt( Math.pow(xDiff,2) + Math.pow(yDiff, 2) ) );
		var y = centerPoint.y + radius * ( yDiff / Math.sqrt( Math.pow(xDiff,2) + Math.pow(yDiff,2) ) );

		return {x:x, y:y};
	};


	p.positionDetailEl = function(){
		var sumHeight = this.profileName.clientHeight + this.lowDetail.clientHeight + 4;
		this.detailCopyHolder.style.height = sumHeight + 'px';
		this.detailCopyHolder.style.marginTop = -sumHeight / 2 + 'px';
	};
	
});
