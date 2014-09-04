// DummyData.js

breelNS.defineClass(breelNS.projectName+".model.DummyData", "generic.events.EventDispatcher", function(p, s, DummyData) {
	var UserObject         = breelNS.getNamespace(breelNS.projectName + ".model").UserObject;
	var siteManager, params;

	p.init = function() {
		siteManager                 = breelNS.getNamespace(breelNS.projectName).singletons.siteManager;
		return this;
	};


	p.getInitData = function() {
		var data = [];
		var count = 0;
		var objs = [];
		for(var i=0; i<siteManager.settings.params.numParticles; i++) {
			var vo = new UserObject().init();
			if(count ++ < 30 && Math.random() > .99) vo.hasConnections = true;
			data.push(vo);
			// objs.push(vo.o);
		}

		/*
		for(var i=0; i<3000; i++) {
			var vo = new UserObject().init();
			objs.push(vo.o);
		}

		console.debug( "====== ", objs.length );
		console.log( JSON.stringify(objs) );
		*/

		return data;
	};


	p.shift = function(dir) {
		
	};


	p.search = function(index) {
		var numParticles = 300;
		var ary = [];

		for(var i=0;i<numParticles; i++) {
			var vo = new UserObject().init(index);
			ary.push(vo);
		}

		return ary;
	};


	p.getClosedParticles = function(index) {
		var returnAry = [];
		return returnAry;
	};


	p.getDummyClosedParticles = function(vo) {
		var ary = [vo];
		for(var i=0;i<4; i++) {
			var vo = new UserObject().init();
			ary.push(vo);
		}

		return ary;
	};


	p.searchCountry = function() {
		var numParticles = 200;
		var o = {};
		// var ary = [];
		// for(var i=0;i<numParticles; i++) {
		// 	var vo = new UserObject().init();
		// 	ary.push(vo);
		// }
		// o.data = ary;
		o.lat = Math.random() * 180 - 90;
		o.lng = Math.random() * 360 - 180;

		return o;
	};


	p.getUserData = function() {
		var ary = [];
		for(var i=0; i<5; i++) {
			var vo = new UserObject().init();
			ary.push(vo);
		}
		return ary;
	};
});