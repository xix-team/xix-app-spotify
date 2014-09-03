(function() {
	
	var EventDispatcher = breelNS.getNamespace("generic.events").EventDispatcher;
	var ListenerFunctions = breelNS.getNamespace("generic.events").ListenerFunctions;

	var SoundLoader = breelNS.getNamespace("generic.sound").SoundLoader;
	var Html5SoundObject = breelNS.getNamespace("generic.sound.html5").Html5SoundObject;

	var namespace = breelNS.getNamespace("generic.sound.html5");

	if(!namespace.Html5SoundLoader) {
		var Html5SoundLoader = function Html5SoundLoader() {

			this._audio = null;

			this._loadCompleteBound = ListenerFunctions.createListenerFunction(this, this._loadComplete);

		};

		namespace.Html5SoundLoader = Html5SoundLoader;


		var p = Html5SoundLoader.prototype = new SoundLoader();
		var s = SoundLoader.prototype;

		p.setup = function(aSoundPath, aSoundURL, aQueueId) {

			s.setup.call(this, aSoundPath, aSoundURL, aQueueId);

			this._audio = new Audio();
			this._audio.preload = "none";
			this._audio.src = aSoundURL;

			var loadCompleteEventName = "canplaythrough";	// event that we use to detect (this may need to change across browsers)
			this._audio.addEventListener(loadCompleteEventName, this._loadCompleteBound);
			
			this._soundObject = Html5SoundObject.create(this._path, this._url, this._audio);
			this._soundObject.setIsMonophonic(this._soundObjectIsMonophonic);

		};

		p.load = function() {
			if (this._audio) {
				this._audio.load();
				return true;
			} else {
				return false;
			}
		};

		p._loadComplete = function() {
			this.dispatchCustomEvent(SoundLoader.LOADED, this._path);
		};

		Html5SoundLoader.create = function(aSoundPath, aSoundURL, aQueueId) {
			var newHtml5SoundLoader = new Html5SoundLoader();
			newHtml5SoundLoader.setup(aSoundPath, aSoundURL, aQueueId);
			return newHtml5SoundLoader;

		}
	}

})();