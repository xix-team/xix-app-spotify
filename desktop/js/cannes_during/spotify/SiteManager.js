// SiteManager.js

(function() {
	var Core              = breelNS.getNamespace("generic.core").Core;
	var ListenerFunctions = breelNS.getNamespace("generic.events").ListenerFunctions;
	var GlobalSettings    = breelNS.getNamespace(breelNS.projectName+".model").GlobalSettings;
	var namespace         = breelNS.getNamespace(breelNS.projectName);
	var BackendManager    = breelNS.getNamespace("spotify.common.model.backendmanager").BackendManager;
	var DummyData         = breelNS.getNamespace(breelNS.projectName + ".model").DummyData;
	var Model             = breelNS.getNamespace(breelNS.projectName + ".model").Model;
	var GenresData        = breelNS.getNamespace("spotify.common.utils.genresdata").GenresData;

	if(!namespace.SiteManager) {
		var SiteManager = function() {
			Core.call(this);
		};

		namespace.SiteManager = SiteManager;
		var p = SiteManager.prototype = new Core();
		var s = Core.prototype;


		p.setup = function() {
			s.setup.call(this);
			// Backend manager
			this.backendManager = new BackendManager();
			this.settings       = new GlobalSettings().init();
			this.dummyData      = new DummyData().init();
			this.model 			= new Model().init();

			// this.divRotation	= document.createElement("div");
			// document.body.appendChild(this.divRotation);
			// this.divRotation.className = "rotatePage";
			// document.oncontextmenu = function(e) {   return false;	}
		}

		p._onConfigLoaded = function(e) {
			s._onConfigLoaded.call(this);

			this.getGenresData();
		};


		p.getGenresData = function() {
			if( this.copyManager._copyDocument == null) {
				this.scheduler.next(this, this.getGenresData, []);
				return;
			}
			if (!this.genres) {
				this.genres = [];
				this.colors = [];
				var len = GenresData.list.length;
				for (i = 0; i < len; i++) {
					this.genres[GenresData.list[i].backendID] = this.copyManager.getCopy(GenresData.list[i].copyID);
					// console.log( GenresData.list[i].color );
					this.colors.push(GenresData.list[i].color);
				}

				this.settings.colors = this.colors;
				console.log( "Genres list created", this.genres );
			}
		};
		

		SiteManager.createSingleton = function() {
			if (!namespace.singletons) namespace.singletons = {};
			if (!namespace.singletons.siteManager) {
				namespace.singletons.siteManager = new SiteManager();
				namespace.singletons.siteManager.setup();
			}
			return namespace.singletons.siteManager;
		};
	}
})();