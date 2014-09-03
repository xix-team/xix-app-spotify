// FallingImages.js

breelNS.defineClass(breelNS.projectName+".page.landing.FallingImages", "generic.events.EventDispatcher", function(p, s, FallingImages) {
	var getRandomElem = function(ary) {return ary[Math.floor(Math.random() * ary.length)]}
	
	var random        = function(a, b) { return a + Math.random() * (b-a); }
	var siteManager;
	var ElementUtils           = breelNS.getNamespace("generic.htmldom").ElementUtils;

	FallingImages.IMAGE_ARRIVED = "onImageArrivedVBottom";

	p.init = function(container, aryImgs, numOfImage) {
		siteManager             = breelNS.getNamespace(breelNS.projectName).singletons.siteManager;
		// this._container 		= container;

		this._container			= document.createElement("div");
		this._container.className = "fallingImageContainer";
		container.appendChild(this._container);



		this._imgs				= aryImgs;
		this.length			= numOfImage;
		this._count 			= 0;
		this._dropInterval		= 0;
		this._images 			= [];
		this._efIndex 			= -1;

		this._scale = window.innerHeight/siteManager.model.baseHeight;

		return this;
	};


	p.start = function() {
		ElementUtils.addClass(document.body, "dark");
		this._count = 0;
		this._dropImage();
		if(this._efIndex != -1) siteManager.scheduler.removeEF(this._efIndex);
		this._efIndex = siteManager.scheduler.addEF(this, this.update, []);
	};


	p._dropImage = function() {


		

		var src = null;
		var tmpSrc = null;
		var exists = false;


		
		while(!src){
			exists = false;
			tmpSrc = getRandomElem(this._imgs).src;

			for(var i in this._images){
				if(this._images[i].src === tmpSrc){
					exists = true;
					break;
				};
			}

			if(!exists) src = tmpSrc;
		}

		
		//console.log(img);
		var img = new Image();
		img.src = src;
		img.width = img.height = 65;
		img.className = "dropImage";
		var left = (window.innerWidth * .5) - (img.width*.5);

		var range = 100*this._scale;
		img.tx = random(-range*5, range*5);
		img.ty = random(0, -range*3) - img.height;


		img.vy = 0;
		img.angle = Math.random() * 360;
		img.alpha = 1;
		img.scale = this._scale;
		img.angleRotation = img.tx/Math.abs(img.tx);
		//img.scale = random(2.5, 2);
		//img.alpha = 5;
		img.easing = random(.07, .05);
		this._images.push(img);


		CSS.set(img, {transform: CSS.to3DString('transform', img.tx, img.ty)});

		this._count++;
		if(this._count < this.length) {
			this._dropInterval = Math.random()*200 + 50;
			//this._dropInterval -= 200/this.length;
			siteManager.scheduler.delay(this, this._dropImage, [], this._dropInterval);
		}

		

	};

	p.resize = function(w, h){
		
		this._scale = h/siteManager.model.baseHeight;
	};

	p.update = function() {
		//var m = mat4.create();
		var a = .3;

		

		for (i=0; i<this._images.length;) {
			var img = this._images[i];
			if(img.arrived) continue;
			var toY = (this._scale *350) + (window.innerHeight*.5) - img.height;
			img.vy += a;
			img.ty += img.vy;
			img.angle += img.easing*img.angleRotation*5;

			/*mat4.identity(m);
			mat4.translate(m, vec3.create([img.tx, img.ty, 0]));
			mat4.scale(m, vec3.create([img.scale, img.scale, img.scale]));*/





			
			//img.vy *= 1.00005;
			img.tx += ( - img.tx ) * img.easing *.5;
			//img.alpha = 1;
			//img.alpha += ( - img.alpha ) * img.easing;
			//img.scale = 1;
			//img.scale += ( .5 - img.scale ) * img.easing;

			/*var str = "";
			for(var j=0;j<m.length;j++) {
				str += m[j];
				if(j!=m.length-1) str += ",";
			}*/

			var position = (img.ty)/(toY);
			

			var offset = toY*.5;
			position = (img.ty - offset)/(toY - offset);
			position = Math.max(position, 0);

			img.alpha += ((1-position) - img.alpha) * .2;
			img.scale += ((1-position) - img.scale) * .1;
			

			// if(img.ty > (window.innerHeight*.5)) {
			// 	img.alpha -= .25
			// }

			// img.style['WebkitTransform'] = "matrix3d("+str +")";
			//img.style[siteManager.animationManager.currentTransformStr] = "matrix3d("+str +")";
			//img.style.opacity = img.alpha;


			CSS.set(img, {transform: CSS.to3DString('transform', img.tx, img.ty) + ' ' +
				CSS.to3DString('scale', img.scale, img.scale) + ' ' + 
				CSS.to3DString('rotate', 0, 0, img.angle)
			});



			if(img.ty > toY && !img.arrived) {
				img.arrived = true;
				this.dispatchCustomEvent(FallingImages.IMAGE_ARRIVED, img.tx);
				$(img).remove();
				this._images.splice(i, 1)
			} else {
				i++;
				if(!img.parentNode) this._container.appendChild(img);
			}
		};
	};


	p.destroy = function() {
		if(this._efIndex != -1) siteManager.scheduler.removeEF(this._efIndex);
		this._efIndex = -1;

		for(var i=0; i<this._images.length; i++) {
			this._images[i].src = "";
			this._images[i].style.opacity = 0;
			this._images[i].style.display = "none";
			if(this._images[i].parentNode) this._images[i].parentNode.removeChild(this._images[i]);
		}

		this._container.style.display = "none";
		this._container.style.opacity = 0;
		try {
			this._container.parentNode.removeChild(this._container);
		} catch(e) {
			console.log( "Error remove falling image container" );
		}
	};


});
