// ViewPicking.js

(function() {
	ViewPicking = function(gl, idVertexShader, idFragmentShader) {
		if(gl == undefined) return;
		View.call(this, gl, "picking-vs", "picking-fs");
	}

	var p = ViewPicking.prototype = new View();
	var s = View.prototype;


	p._init = function() {
        this.isReady = false;
	};


	p.updateModel = function(particles) {
		var justCreated = false;
		if(this.model == undefined)  {
			this.model = new bongiovi.GLModel(this.gl, 4*particles.length);
			this.model.setAttribute(0, "aUVOffset", 2);
			this.model.setAttribute(1, "sizeOffset", 2);
			this.model.setAttribute(2, "aVertexColor", 3);
			justCreated = true;
		}
		

		for(var i=0; i<particles.length; i++) {
			var p = particles[i];
			var size = 0;

	        this.model.updateVertex(i*4+0, p.x, p.y, p.z);
	        this.model.updateVertex(i*4+1, p.x, p.y, p.z);
	        this.model.updateVertex(i*4+2, p.x, p.y, p.z);
	        this.model.updateVertex(i*4+3, p.x, p.y, p.z);

	        
	        this.model.updateTextCoord(i*4+0, 0, 0);
	        this.model.updateTextCoord(i*4+1, 1, 0);
	        this.model.updateTextCoord(i*4+2, 1, 1);
	        this.model.updateTextCoord(i*4+3, 0, 1); 

	        var tx = (p.colorIndex%4) * .25;
	        var ty = .75- Math.floor(p.colorIndex/4) * .25;
	        this.model.updateAttribute(0, i*4+0, [tx, ty]); 
	        this.model.updateAttribute(0, i*4+1, [tx, ty]); 
	        this.model.updateAttribute(0, i*4+2, [tx, ty]); 
	        this.model.updateAttribute(0, i*4+3, [tx, ty]); 

	        this.model.updateAttribute(1, i*4+0, [-p.size, -p.size]); 
	        this.model.updateAttribute(1, i*4+1, [ p.size, -p.size]); 
	        this.model.updateAttribute(1, i*4+2, [ p.size,  p.size]); 
	        this.model.updateAttribute(1, i*4+3, [-p.size,  p.size]); 
	        
	        var color = getColor(i);
	        // console.log( color );

	        this.model.updateAttribute(2, i*4+0, [color.r, color.g, color.b]); 
	        this.model.updateAttribute(2, i*4+1, [color.r, color.g, color.b]); 
	        this.model.updateAttribute(2, i*4+2, [color.r, color.g, color.b]); 
	        this.model.updateAttribute(2, i*4+3, [color.r, color.g, color.b]); 
		}
		
        if(justCreated) this.model.generateBuffer();
        else this.model.updateBuffer();
        this.isReady = true;
	};


	p.render = function(camera, projection, texture) {
		this.invert           = mat4.create(camera);
		mat4.inverse(this.invert)
		this.invertCamera     = mat4.toInverseMat3(this.invert);

		this.model.setTexture(0, texture);	
		this.shader.setParameter("invertCamera", "uniformMatrix3fv", this.invertCamera);
		this.model.render(this.shader, camera, projection);
	};


	var getColor = function(index) {
		var b = (index % 256);
		var g = Math.floor(index/256);
		return {r:0, g:g/256, b:b/256};
	}
})();