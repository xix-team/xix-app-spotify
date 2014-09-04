// ViewGlobeLines.js

(function() {
	var MAX_CAPICITY = 3000;

	ViewGlobeLines = function(gl) {
		if(gl == undefined) return;
		this.modelGenerated = false;
		this._lines = [];
		View.call(this, gl, "line-vs", "line-globe-fs");
	}

	var p = ViewGlobeLines.prototype = new View();
	var s = View.prototype;


	p._init = function() {
		this.model = new bongiovi.GLModel(this.gl, 4);
		this.model.setAttribute(0, "aVertexColor", 4);
		this.model.showWireFrame = true;
		this.justCreated = true;
	
		var indices = [];
		for(var i=0;i<MAX_CAPICITY; i++) {
			indices.push(i);
		}
		this.model.generateIndexBuffer(indices);
	};

	p.updateModel = function(ps) {
		if(this.modelGenerated) return;
		this.modelGenerated = true;
		var particles = [];
		for(var i=0;i<ps.length; i++) {
			if(ps[i].isGlobeParticle) particles.push(ps[i]);
		}

		var tmp = [];
		for(var i=0; i<particles.length; i++) {
			if(particles[i].numConnectDots > 0) tmp.push(particles[i]);
		}

		this._lines = tmp;


		// this.model.clearBuffers();
		var count = 0;
		for(var i=0; i<tmp.length; i++) {
			var p = tmp[i];
			for(var j=0; j<p.connectDots.length; j++) {
				var p1 = p.connectDots[j];
				var color = getColor(p1.color);
				color.a = p1.alpha*.2;
				if(p1.isGlobeParticle) {
					color.r = color.g = color.b = 1;
					color.a = p1.alpha*.10;
				}
				
				this.model.updateVertex(count, p.x, p.y, p.z);
				this.model.updateTextCoord(count, 0, 0);
				this.model.updateAttribute(0, count, [color.r, color.g, color.b, .1]); 
				count++;
				this.model.updateVertex(count, p1.x, p1.y, p1.z);
				this.model.updateTextCoord(count, 0, 0);
				this.model.updateAttribute(0, count, [color.r, color.g, color.b, .1]); 
				count++;
			}
		}


		for ( var i=count; i<MAX_CAPICITY; i++) {
			this.model.updateVertex(i, 0, 0, 0);
			this.model.updateTextCoord(i, 0, 0);
			this.model.updateAttribute(0, i, [0, 0, 0, 0]); 
		}

		if(this.justCreated) this.model.generateBuffer();
		else this.model.updateBuffer();
  		this.justCreated = false;
	};


	p.render = function(camera, projection, texture) {
		if(this._lines[0].alpha == 0) return;
		this.gl.lineWidth(.5);
		this.model.setTexture(0, texture);	
		this.shader.setParameter("globeAlpha", "uniform1f", this._lines[0].alpha/this._lines[0].targetGlobeAlpha);
		this.model.render(this.shader, camera, projection);
	};


	var getColor = function(colorStr) {
		var orgStr = colorStr;
		colorStr = colorStr.replace("#", "");
		var colorValue = parseInt(colorStr, 16);
		var o = {};
		o.r = (colorValue >> 16 & 0xFF) / 0xFF;
		o.g = (colorValue >> 8 & 0xFF) / 0xFF;
		o.b = (colorValue & 0xFF) / 0xFF;
		o.a = .25;
		return o;
	}
})();