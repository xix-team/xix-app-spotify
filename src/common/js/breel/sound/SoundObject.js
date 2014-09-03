(function() {
	
	var EventDispatcher = breelNS.getNamespace("generic.events").EventDispatcher;
	var ListenerFunctions = breelNS.getNamespace("generic.events").ListenerFunctions;

	var namespace = breelNS.getNamespace("generic.sound");

	var SoundLogger = breelNS.getNamespace("generic.sound").SoundLogger;
	var soundLogger = SoundLogger.getSingleton();

	if(!namespace.SoundObject) {
		var SoundObject = function SoundObject() {

			this._soundPath = "";
			this._soundURL = "";
			this._isLoaded = false;
			this._isPlaying = false;
			this._rawDuration = -1;
			this._duration = -1;
			this._padding = 0;
			this.isMute = false;
			this._isMonophonic = true; // if true, we can only have the sound playing one at a time (playing again causes sound to stop and re-play)
		
			this._tweens = [];

			this._currentVolume = 1;
			this._currentVolumeTween = null;
			this._updateVolumeBound = ListenerFunctions.createListenerFunction(this, this._updateVolume);
		};

		namespace.SoundObject = SoundObject;

		SoundObject.LOADED = "loaded";
		SoundObject.ERROR = "error";

		var p = SoundObject.prototype = new EventDispatcher();

		/*
			N.B. All times are in seconds
		 */

		p.setup = function(aSoundPath, aSoundURL) {			
			
			this._soundPath = aSoundPath;
			this._soundURL = aSoundURL;

			return this;
		};

		p.getPath = function() {
			return this._soundPath;
		};

		p.setPadding = function(aPadding) {
			this._padding = aPadding;
		};

		p.setIsMonophonic = function(aIsMonophonic) {
			this._isMonophonic = aIsMonophonic;
		}

		/**
		 * Sets the raw duration of the sample, including padding. 
		 * @param  {[Number]} aRawDuration [total duration of the sample, including padding]		 
		 */
		p._setRawDuration = function(aRawDuration) {			
			this._rawDuration = aRawDuration;		
			this._duration = this._rawDuration - (2 * this._padding);
		};

		/**
		 * Sets the audio duration (excluding padding) for the sample. E.g. if audio is 1s long, with 0.2s padding, you would call this with the argument 1, having set _padding to 0.2s
		 * @param  {[Number]} aAudioDuration [The length of the audio in the sample, in seconds]		 
		 */
		p._setAudioDuration = function(aAudioDuration) {
			this._duration = aAudioDuration;
			this._rawDuration = this._duration + (2 * this._padding);
		};

		p.getDuration = function() {
			return this._duration;
		};

		p.getPadding = function() {
			return this._padding;
		};

		p.load = function() {
			// override this method
		};

		p._loadCompleted = function() {
			this.dispatchCustomEvent(SoundObject.LOADED, this._soundPath);
		};

		p.play = function(aFromTime, aDelayTime, aTimingCorrection, aLoop) {
			

			if (this._isLoaded && (!this._isPlaying || !this._isMonophonic)) {
				soundLogger.pushMessage("SoundObject :: playing sound " + this._soundPath + " from time : " + aFromTime + " with delay : " + aDelayTime + " and correction : " + aTimingCorrection + " will start in " + (aDelayTime - aTimingCorrection));
				return true;
			}				
			else if (this._isPlaying && this._isMonophonic) {
				console.warn("SoundObject :: tried to play monophonic sound that is already playing: " + this._soundPath);
				return false;
			} else if (!this._isLoaded){
				console.warn("SoundObject :: tried to play unloaded sound : " + this._soundPath);
				return false;
			} 
				
			// override this method

		};

		p.pause = function(aDelayTime) {

			aDelayTime = aDelayTime || 0;

			soundLogger.pushMessage("SoundObject :: pausing sound " + this._soundPath + " with delay :" + aDelayTime);
			
			return this._isPlaying;
		};

		p.setVolume = function(aVolume, aOverTime, aDelayTime, aEasingFunction) {

			aDelayTime = aDelayTime || 0;
			aEasingFunction = aEasingFunction || TWEEN.Easing.Quartic.InOut;

			aOverTime *= 1000;	// convert to MS
			aDelayTime *= 1000;	// convert to MS

			console.log("SoundObject :: setting " + this._soundPath + " to volume " + aVolume + " over time : " + aOverTime + " with delay : " + aDelayTime);

			if(this._currentVolumeTween) this._currentVolumeTween.stop();

			if (aOverTime) {
				new TWEEN.Tween(this).to({ "_currentVolume" : aVolume}, aOverTime).onUpdate(this._updateVolumeBound).delay(aDelayTime).easing(aEasingFunction).start();
			} else {
				this._currentVolume = aVolume;
				this._updateVolume();
			}
			

		};

		p.switchMute = function(sSwitch) {
			if (sSwitch) {
				this.isMute = true;
			}
			else {
				this.isMute = false;
			}
			this._updateVolume();
		}


		p.setPaddingFromMetadata = function(aPadding) {
			aPadding = aPadding || 0;
			this._padding = aPadding;			
			this._setRawDuration(this._rawDuration);	// updates the actual sound duration with the new padding
		};

		p.setDurationFromMetadata = function(aDuration) {
			aDuration = aDuration || 0;
			this._setAudioDuration(aDuration);
		};
	

		p._updateVolume = function() {		

			// override this function

		};

		p._playbackFinished = function() {
			soundLogger.pushMessage("SoundObject :: sound " + this._soundPath + " finished");

		};
		

		p.destroy = function() {
		

		};
		
		SoundObject.create = function(aSoundPath, aSoundURL) {
			var newSoundObject = new SoundObject();		
			newSoundObject.setup(aSoundPath, aSoundURL);	
			return newSoundObject;
		};
		
	}

})();