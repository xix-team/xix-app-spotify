// ProfileParticleController.js

breelNS.defineClass(breelNS.projectName+".common.profileParticles.ProfileParticleRenderer", "generic.events.EventDispatcher", function(p, s, ProfileParticleRenderer) {
	var random = function(a, b) { return a + Math.random() * ( b - a); }
	p.init = function(scheduler) {
		this.detractMode = false;
		this.profileParticles = [];
		this.colorParticles = [];

		this.efIndex      = scheduler.addEF(this, this.render, []);

		this.particles = [];
	
		
	};

	p.render = function() {
		
		// var mergedArray = this.colorParticles.concat(this.profileParticles);

		var mergedArray = this.particles;
		
		for (var i=0;i<mergedArray.length;i++){
			var child = mergedArray[i];

			// if (child.endAnimation && child.type == 'color'){

			// 	child.checkParticlePush();
			

			// if (child.pullMode){
			// 	child.checkParticlePull();
				
			// 	if (child.type == 'color' && child.closestGravityChild.checkPullOnChildren){
			// 		if (Math.abs(child.ax) < 0.01){
			// 			child.setPullMode(false);

			// 		}
			// 	}
			// }else{
			// 	for (var j=0; j<mergedArray.length;j++){
			// 		if (i!=j){
			// 			child.checkParticle(mergedArray[j]);
			// 		}
			// 	}
			// }

			// child.update();

			child.render();
		}
	};

	
	

	p.addProfileChild = function(child){

		this.profileParticles.unshift(child);
		this.particles = [];
		this.particles = this.profileParticles.concat(this.colorParticles);

	};

	p.addColorChild = function(child){

		this.colorParticles.unshift(child);
		this.particles = [];
		this.particles = this.profileParticles.concat(this.colorParticles);

	};

	p.removeAll = function() {
		var mergedArray = this.particles.slice();
		
		this.profileParticles = [];
		this.colorParticles = [];
		this.particles = [];

		while (mergedArray.length > 0){
			mergedArray[0].remove();
			mergedArray.shift();
			
		}
	};

	// p.onResize = function(dims, params, changePullMode){

	// 	var mergedArray = this.particles;
	// 	for (var i=0;i<mergedArray.length;i++){
	// 		mergedArray[i].onResize(dims, params, changePullMode);
	// 	}

	// };
	
	
});