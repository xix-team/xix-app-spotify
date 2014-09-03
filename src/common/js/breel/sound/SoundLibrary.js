(function() {
	
	var EventDispatcher = breelNS.getNamespace("generic.events").EventDispatcher;
	var ListenerFunctions = breelNS.getNamespace("generic.events").ListenerFunctions;

	var SoundLoader = breelNS.getNamespace("generic.sound").SoundLoader;
	var SoundObject = breelNS.getNamespace("generic.sound").SoundObject;
	var FlashSoundLoader = breelNS.getNamespace("generic.sound.flash").FlashSoundLoader;
	var Html5SoundLoader = breelNS.getNamespace("generic.sound.html5").Html5SoundLoader;
	var WebAudioSoundLoader = breelNS.getNamespace("generic.sound.webAudio").WebAudioSoundLoader;

	var SoundPlayerFlashLink = breelNS.getClass("generic.sound.flash.SoundPlayerFlashLink");

	var namespace = breelNS.getNamespace("generic.sound");

	if(!namespace.SoundLibrary) {
		var SoundLibrary = function SoundLibrary() {

			this._soundFolderPath = "";
			this._loadingQueues = {};

			this._sounds = {};

			this._audioFileExtension = "";
			this._usingAudioTech = "";

			this._webAudioContext = null;
			this._hasUserEnabledAudio = false;

			this._flashLink = null;
			this._flashElement = null;
			this._flashLoadedCallbackBound = ListenerFunctions.createListenerFunction(this, this._flashLoadedCallback);
			this._flashStatusCallbackBound = ListenerFunctions.createListenerFunction(this, this._flashStatusCallback);
			this._flashSoundRefDidFinishBound = ListenerFunctions.createListenerFunction(this, this._flashSoundRefDidFinish);
			this._flashObjectLoaded = false;
			this._flashSyncSoundLocation = null;
			this._loadNextSoundPendingFlashLoad = false;

			this._paddingDuration = 0;
			this._currentLoadingQueue = [];

			this._queueLengthAtBegin = 0;
			this._loadingQueueNames = [];

			this._init();
		};

		namespace.SoundLibrary = SoundLibrary;

		SoundLibrary.LOADED_ONE = "loadedOne";	// fired when we load one sound
		SoundLibrary.ERROR_ONE = "errorOne";	// fired when there's an error on one sound
		SoundLibrary.LOAD_PROGRESS = "loadProgress";	// fired with a progress value
		SoundLibrary.LOADED_QUEUE = "loadedQueue";	// fired when we finish loading the queue
		SoundLibrary.ERROR_QUEUE = "errorQueue";	// fired at the end of the queue if there were any errors

		SoundLibrary.TECH_FLASH = "techFlash";
		SoundLibrary.TECH_HTML5 = "techHtml5";
		SoundLibrary.TECH_WEBAUDIO = "techWebAudio";


		var p = SoundLibrary.prototype = new EventDispatcher();

		p._init = function() {			
			
			return this;
		};

		p.setup = function(aSoundFolderPath, aTechnology, aFileExtension) {
			this._soundFolderPath = aSoundFolderPath;
			this._usingAudioTech = aTechnology;
			this._audioFileExtension = aFileExtension;

			switch(this._usingAudioTech) {

				case SoundLibrary.TECH_WEBAUDIO:
					this._hasUserEnabledAudio = false;
				break;

				case SoundLibrary.TECH_FLASH:

					this._loadNextSoundPendingFlashLoad = true;
					this._hasUserEnabledAudio = true;
				break;

				case SoundLibrary.TECH_HTML5 :
					this._hasUserEnabledAudio = false;
				break;

				default:

				break;

			}

		};

		p.getAudioTech = function() {
			return this._usingAudioTech;			
		};


		p.createWebAudioContext = function() {

			if (this._usingAudioTech == SoundLibrary.TECH_WEBAUDIO) {
				
				if (typeof(AudioContext) !== "undefined")
				{
					this._webAudioContext = new AudioContext();
				} else if (typeof(webkitAudioContext) !== "undefined") {
					this._webAudioContext = new webkitAudioContext();				
				} else {
					throw new Error("ERROR : tried to create a WebAudioContext when that technology is not available");
				}
			} else {
				throw new Error("ERROR : tried to set a WebAudioContext when not using that technology");
			}

		};

		/**
		 * Plays a preloaded dummy (silent) audio file (should be from a user input) to enable audio on tablet devices		 
		 */
		p.userInitiatedDummySound = function(aSilentSoundPath) {

			if (!this._hasUserEnabledAudio)
			{
				var silentSound = this._sounds[aSilentSoundPath];
				if (!silentSound){
					throw new Error("SoundLibrary : userInitiatedDummySound - silent sound has not yet been loaded");
				} else {
					silentSound.setVolume(0, 0, 0);
					silentSound.play(0,0,0);
				}
			}

		};

		p.createFlashObject = function(aDestinationElementId, aSoundPlayerSWFLocation, aSyncSoundLocation) {
			console.log("generic.sound.SoundLibrary::createFlashObject");
			console.log(aDestinationElementId, aSoundPlayerSWFLocation, aSyncSoundLocation);
			
			if (this._usingAudioTech = SoundLibrary.TECH_FLASH){			

				
				this._flashSyncSoundLocation = aSyncSoundLocation;

				this._flashLink = SoundPlayerFlashLink.createSingleton(SoundPlayerFlashLink.DEFAULT_SINGLETON_NAME);
				this._flashLink.addEventListener(SoundPlayerFlashLink.FLASH_LOADED, this._flashLoadedCallbackBound);

				var flashvars = {"flashLoadedCallback": "breelNS.singletons." + SoundPlayerFlashLink.DEFAULT_SINGLETON_NAME + ".flashLoaded"};
				var params = {"allowscriptaccess": "always"};
				var attributes = {};

				swfobject.embedSWF(aSoundPlayerSWFLocation, aDestinationElementId, "1000", "580", "10.0.0", null, flashvars, params, attributes, this._flashStatusCallbackBound);


			} else {
				throw new Error("ERROR : tried to set a Flash Object when not using that technology");
			}

		};
		
		p._flashLoadedCallback = function(aEvent) {
			console.log("generic.sound.SoundLibrary::_flashLoadedCallback");
			console.log(this._loadingQueues);
			
			for (var queueName in this._loadingQueues) {
				var queue = this._loadingQueues[queueName];
				for (var i =0; i < queue.length; i++)
				{
					queue[i].setFlashElement(this._flashElement);							
				}
			};


			// load sync sound
			var syncLoadedCallback = ListenerFunctions.createListenerFunction(this, function(aEvent) {
				
				this._flashLink.removeEventListener(SoundLibrary.GROUP_LOADED, syncLoadedCallback);


				if (aEvent.detail == "loader0") {
					this._flashElement.setSyncSound(this._flashSyncSoundLocation);
					this._flashElement.setDefaultPaddingLength(this._paddingDuration / 1000);
					this._flashElement.startClock();

					if (this._loadNextSoundPendingFlashLoad) {
						this._loadNextSoundPendingFlashLoad = false;
						this._loadNextSound();
					}
				}	

			});

			this._flashLink.addEventListener(SoundPlayerFlashLink.GROUP_LOADED, syncLoadedCallback);
			
			this._flashElement.loadFiles([this._flashSyncSoundLocation]);


			this._flashObjectLoaded = true;
		};

		p._flashStatusCallback = function(aEvent) {

			console.log("SoundLibrary :: flash status callback : ", aEvent);
			if (aEvent.success) {

				this._flashElement = aEvent.ref;


			} else {
				throw new Error("ERROR : SoundLibrary : flash audio player did not load successfully");
			}
		};

		p._flashSoundRefDidFinish = function(aEvent) {
			// METODO: implement this
			// this method is called when a particular sound ref has finished playing - we then remove it from the list on each FlashSoundObject
			var flashRef = aEvent.detail;
			for (var sndIndex in this._sounds)
			{
				var snd = this._sounds[sndIndex];
				snd.flashRefDidFinish(flashRef);
			}

		};
	
		/**
		 * If the samples have a silent padding at the start & end (required for accurate Flash timing), set the duration here
		 * @param  {int} aPaddingS [padding duration in seconds]		
		 */
		p.setDefaultSamplePadding = function(aPaddingS) {
			this._paddingDuration = parseInt(aPaddingS);

			if (this._usingAudioTech == SoundLibrary.TECH_FLASH) {
				if (this._flashObjectLoaded) this._flashElement.setDefaultPaddingLength(this._paddingDuration);
			}
		};


		/**
		 * adds a sound path to the loading queue (we can name our queues)
		 * @param  {[String]} aPath    [the sounds' path string relative to the sound folder. Without extension, we add this depending on the tech used]
		 * @param  {[String]} aQueueId [the name of the queue this sound belongs to (preload, gamePage etc)]		 
		 * @param  {[String]} aDuration [the duration of the audio WITHOUT padding (so will be 2 * aPaddingS shorter than actual audio file) in seconds]		 
		 * @param  {[String]} aPaddingS [the amount of padding applied to each end of the sample (not total amount), in seconds]		 
		 */
		p.addSoundToLoadingQueue = function(aPath, aQueueId, aDuration, aPaddingS) {


			if (typeof(this._loadingQueues[aQueueId]) == "undefined")
			{
				this._loadingQueues[aQueueId] = [];
			}

			var soundURL = this._getSoundURL(aPath);
		
			// store our loading params in an object
			var newLoadObject = this._createLoaderObject(aPath, soundURL, aQueueId);

			var loadCallbackBound = ListenerFunctions.createListenerFunctionWithArguments(this, this._soundDidLoad, [newLoadObject]);
			newLoadObject.addEventListener(SoundLoader.LOADED, loadCallbackBound);
 			
 			var newSoundObject = newLoadObject.getSoundObject();

 			newSoundObject.setPaddingFromMetadata(aPaddingS);
 			newSoundObject.setDurationFromMetadata(aDuration); 			

			this._sounds[aPath] = newSoundObject;

			this._loadingQueues[aQueueId].push(newLoadObject);

			return newSoundObject;

		};


		p._createLoaderObject = function(aPath, aSoundUrl, aQueueId) {
			var newLoadObject;
			switch(this._usingAudioTech){

				case SoundLibrary.TECH_HTML5:
					newLoadObject = Html5SoundLoader.create(aPath, aSoundUrl, aQueueId);
				break;
				case SoundLibrary.TECH_WEBAUDIO:
					newLoadObject = WebAudioSoundLoader.create(aPath, aSoundUrl, aQueueId, this._webAudioContext);
				break;
				default :
					newLoadObject = FlashSoundLoader.create(aPath, aSoundUrl, aQueueId, this._flashLink);

					if(this._flashObjectLoaded) newLoadObject.setFlashElement(this._flashElement);

				break;
			}

			return newLoadObject;
		};

		/**
		 * adds the contents of a particular queue to the current load queue
		 * @param  {[type]} aQueueId [the name of the queue to be loaded]		 
		 */
		p.beginQueue = function(aQueueId) {

			if (this._loadingQueues[aQueueId]) {

				for (var i =0; i < this._loadingQueues[aQueueId].length; i++)
					this._currentLoadingQueue.push(this._loadingQueues[aQueueId][i]);

				this._queueLengthAtBegin = this._currentLoadingQueue.length;
				this._loadingQueueNames.push(aQueueId);

				this._loadNextSound();				

			} else {
				throw new Error("SoundLibrary ERROR : tried to begin queue that does not exist");
			}

		};

	
		/**
		 * Gets a sound object for the specified path, if it exits
		 * @param  {String} aPath [The path given when the sound was loaded (without extension or asset folder name)]
		 * @return {[SoundObject]}       [the SoundObject in question, or null if it does not exist]
		 */
		p.getSound = function(aPath) {
			if (this._sounds[aPath]) return this._sounds[aPath];
			else return null;
		}


		p.playSound = function(aPath, aDelay, aVolume, aOverTime, aLoop) {

			// TODO: preload sound if it hasn't been already

			if (!aPath) throw new Error("SoundLibrary :: ERROR : no path defined in playSound");

			aOverTime = aOverTime || 0;
			aDelay = aDelay || 0;
			aVolume = (typeof(aVolume) != "undefined") ? aVolume : 1;


			console.log("SoundLibrary :: playing sound " + aPath + " with delay " + aDelay + " at volume " + aVolume);

			var snd = this.getSound(aPath);
			if (snd) {
				snd.setVolume(aVolume, aOverTime, aDelay);
				snd.play(0,aDelay, undefined, aLoop);
				return snd;
			} else {
				// load this sound if it's not ready and play it straight off
				if (console.warn) console.warn("SoundLibrary :: WARNING : called play on unloaded sound, sound will play after load");
				var newQueueName = aPath + "_loadQueue";
				var soundUrl = this._getSoundURL(aPath);
				var newLoaderObject = this._createLoaderObject(aPath, soundUrl, newQueueName);
				var soundObject = newLoaderObject.getSoundObject();
				this._sounds[aPath] = soundObject;
				var soundLoadCallback = ListenerFunctions.createListenerFunction(this, function() {
					this._sounds[aPath].play(0, aDelay);
				});
				soundObject.addEventListener(SoundObject.LOADED, soundLoadCallback);
				soundObject.load();

				return soundObject;
			}
		};

		p._loadNextSound = function() {
			// console.log("generic.sound.SoundLibrary::_loadNextSound");
			// console.log(this._currentLoadingQueue, this._loadingQueueNames);
			
			if (this._loadNextSoundPendingFlashLoad) return;

			if (this._currentLoadingQueue.length > 0){
				this._loadSound(this._currentLoadingQueue.shift());
			} else {
				while(this._loadingQueueNames.length)
					this.dispatchCustomEvent(SoundLibrary.LOADED_QUEUE, this._loadingQueueNames.shift());

			}

		};


		p._loadSound = function(aLoadObject) {

			aLoadObject.load();

		};


		p._soundDidLoad = function(aLoadingObject) {

			// console.log("sound did load: ", aLoadingObject);
			this.dispatchCustomEvent(SoundLibrary.LOADED_ONE)

			var loadProgress = 1 - (this._currentLoadingQueue.length / this._queueLengthAtBegin);

			this.dispatchCustomEvent(SoundLibrary.LOAD_PROGRESS, loadProgress);

			this._loadNextSound();
		};


		/**
		 * returns the correct sound URL for the path provided, depending on the tech used
		 * @param  {[type]} aSoundPath [the path relative to the sound folder]		 
		 */
		p._getSoundURL = function(aSoundPath) {
			var aSoundURL = this._soundFolderPath + "/";
			aSoundURL += aSoundPath + "." + this._audioFileExtension;
			return aSoundURL;
		};

		
		SoundLibrary.createSingleton = function(aSoundFolderPath, aTechnology, aFileExtension) {

			if (!namespace.singletons) namespace.singletons = {};
			if (!namespace.singletons.SoundLibrary)
			{
				namespace.singletons.SoundLibrary = new SoundLibrary();
				
				namespace.singletons.SoundLibrary.setup(aSoundFolderPath, aTechnology, aFileExtension);
			}	
			return namespace.singletons.SoundLibrary;	
		};
		
	}

})();