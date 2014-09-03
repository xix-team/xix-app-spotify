// CenterRenderer.js

breelNS.defineClass(breelNS.projectName+".canvas.CenterRenderer", breelNS.projectName+".canvas.CanvasRenderer", function(p, s, CenterRenderer) {
	p.init = function(ctx) {
		return s.init.call(this, ctx);
	};

	p.render = function() {
		var ctx = this.ctx;
		var time = new Date().getTime();
		ctx.clearRect(0, 0, this.width, this.height);

		toDebug = Math.random() > .95;

		ctx.save();
		ctx.translate(this.width*.5+this._x, this.height*.5+this._y);

		for ( var i=0; i<this.childrenList.length; i++) {
			var child = this.childrenList[i];
			if(child.alpha == 0 )  continue;

			for(j=0; j<this.childrenList.length; j++) {
				if(j!=i)child.checkParticle(this.childrenList[j]);
			}

			child.update();

			ctx.save();
			ctx.globalAlpha = child.alpha;
			ctx.translate(child.x, child.y);
			if(ctx.globalAlpha >= .01) child.render(ctx);
			ctx.restore();
		}
		// if(toDebug) console.log( "=========" );
		ctx.restore();
	};


	p.addChild = function(child) {
		this.childrenList.unshift(child);
	};
});