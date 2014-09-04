(function() {
	
	var EventDispatcher = breelNS.getNamespace("generic.events").EventDispatcher;
	var ListenerFunctions = breelNS.getNamespace("generic.events").ListenerFunctions;

	var SoundObject = breelNS.getNamespace("generic.sound").SoundObject;

	var namespace = breelNS.getNamespace("generic.sound.html5");

	if(!namespace.Html5SoundObject) {
		var Html5SoundObject = function Html5SoundObject() {

			this._audio = null;
			this._isStartSeeking = false;

			this._audioLoadedBound = ListenerFunctions.createListenerFunction(this, this._loadCompleted);
			this._playbackFinishedBound = ListenerFunctions.createListenerFunction(this, this._playbackFinished);
			this._checkStartBound = ListenerFunctions.createListenerFunction(this, this._checkStart);
			this._delayedSeekBound = ListenerFunctions.createListenerFunction(this, this._delayedSeek);
			this._delayedPauseBound = ListenerFunctions.createListenerFunction(this, this._delayedPause);
			
			this._updateVolumeBound = ListenerFunctions.createListenerFunction(this, this._updateVolume);
			this.loopBound = ListenerFunctions.createListenerFunction(this, this._loopHandler);
		};

		namespace.Html5SoundObject = Html5SoundObject;


		var p = Html5SoundObject.prototype = new SoundObject();
		var s = SoundObject.prototype;

		p.setup = function(aSoundPath, aSoundURL, aAudioObject) {	

			s.setup.call(this, aSoundPath, aSoundURL);

			this._audio = aAudioObject;
			this._audio.addEventListener("ended", this._playbackFinishedBound);
			var loadCompleteEventName = "loadeddata";
			this._audio.addEventListener(loadCompleteEventName, this._audioLoadedBound);

			this._startFromTime = -1;
			this._startDelay = -1;

			this._intendedStartTime = -1; // the time at which we want the audio to begin
			this._intendedStartSampleLocation = -1; // the sample location (in ms) that we want to be at on _indendedStartTime
			
			return this;
		};

		p.load = function() {
			this._audio.preload = "auto";
			this._audio.load();
			this._isLoaded = true;
		};

		p._loadCompleted = function(aEvent) {

			var duration = 0;
			if (this._audio.buffered.length > 0){
				duration = this._audio.buffered.end(0);
				// console.log("Html5SoundObject :: " + this._soundPath + " reported duration of " + duration);
				// this._setRawDuration(duration * 1000);
			}

			s._loadCompleted.call(this);
		};

		p.play = function(aFromTime, aDelayTime, aTimingCorrection, aLoop) {

			aFromTime = aFromTime || 0;
			aDelayTime = aDelayTime || 0;
			aTimingCorrection = aTimingCorrection || 0;

			if (!s.play.call(this, aFromTime, aDelayTime, aTimingCorrection)) return;

			this._startFromTime = aFromTime;
			this._startDelay = aDelayTime - aTimingCorrection;

			if (!this._isPlaying) {
				this._audio.currentTime = 0;
				this._audio.play();
				this._isStartSeeking = true;
				// this._audio.volume = 0;
				this._intendedStartTime = (new Date().getTime() / 1000) + aDelayTime + this._padding;
				this._intendedStartSampleLocation = this._padding + aDelayTime + aFromTime;
				if (aLoop) ListenerFunctions.addDOMListener(this._audio, 'ended', this.loopBound);
				setTimeout(this._checkStartBound, 10);				
			} else {
				
				// this needs to be done better, possibly with another set of short seeks
				this._intendedStartTime = (new Date().getTime() / 1000) + ((aDelayTime - aTimingCorrection));
				this._intendedStartSampleLocation = this._padding + aTimingCorrection;
				setTimeout(this._delayedSeekBound, (aDelayTime - aTimingCorrection) * 1000);
			}

			this._isPlaying = true;
			
		};

		p._loopHandler = function(e) {

			console.log('HTML5Sound LoopHandler Called: ');
			if (!this._audio) return;
			this._audio.play();

		}

		p._delayedSeek = function() {		

			var timeDiff = this._intendedStartTime - (new Date().getTime() / 1000);
			this._audio.currentTime = this._intendedStartSampleLocation + timeDiff;

		};
		

		p._checkStart = function() {

			var currentElementTime = this._audio.currentTime;
			var currentRealTime = (new Date().getTime()) / 1000;

			if (currentRealTime < this._intendedStartTime) {

				var diffRealTime = currentRealTime - this._intendedStartTime;
				var diffSampleTime = currentElementTime - this._intendedStartSampleLocation;
				var catchupAmount = diffRealTime - diffSampleTime;

				if (catchupAmount > 10){
					this._audio.currentTime = (currentElementTime + catchupAmount)
				} 

				setTimeout(this._checkStartBound, 10);

			} else {

				this._isStartSeeking = false;
				this._updateVolume();

			}


		};

		p.pause = function(aDelayTime) {

			aDelayTime = aDelayTime || 0;
			aDelayTime *= 1000;

			if(!s.pause.call(this, aDelayTime)) return;

			if (aDelayTime == 0) {
				this._audio.pause();	
				this._isPlaying = false;
			} else {
				setTimeout(this._delayedPauseBound, aDelayTime);
			}
			
		};

		p._delayedPause = function() {
			this._audio.pause();
			this._isPlaying = false;
		};
		
		p._playbackFinished = function() {

			s._playbackFinished.call(this);

			this._isPlaying = false;

		};

		p._updateVolume = function() {

			s._updateVolume.call(this);

			// if (!this._isStartSeeking)
			if (!this.isMute) this._audio.volume = this._currentVolume;
			else this._audio.volume = 0;
			if(this._currentVolume<0) this._currentVolume = 0;
			else if(this._currentVolume>1) this._currentVolume = 1;
				this._audio.volume = this._currentVolume;

		};


		p.destroy = function() {

			s.destroy.call(this);
			
		};
		
		Html5SoundObject.create = function(aSoundPath, aSoundURL, aAudioObject) {
			var newHtml5SoundObject = new Html5SoundObject();		
			newHtml5SoundObject.setup(aSoundPath, aSoundURL, aAudioObject);	
			return newHtml5SoundObject;
		};
		
	}

})();