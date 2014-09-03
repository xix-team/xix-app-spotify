(function() {
	
	var EventDispatcher = breelNS.getNamespace("generic.events").EventDispatcher;
	var ListenerFunctions = breelNS.getNamespace("generic.events").ListenerFunctions;

	var Metronome = breelNS.getNamespace("generic.music").Metronome;
	

	var namespace = breelNS.getNamespace("generic.music");

	var SoundLogger = breelNS.getNamespace("generic.sound").SoundLogger;
	var soundLogger = SoundLogger.getSingleton();

	if(!namespace.MusicalSound) {
		var MusicalSound = function MusicalSound() {

			this._running = false;

			this._soundObject = null;
			this._metronome = null;

			this._isLooping = false;

			this._durationBars = 0;		
			this._durationBeats = 0;	

			this._startingBeatNumbers = [];	// the beat numbers at which this sound will begin
			this._stoppingBeatNumbers = [];	// the beat numbers at which this sound will stop
			this._loopingBeatNumbers = [];	// the beat numbers at which this sound will loop
			this._currentBeatNumber = -1;

			this._paddingBeats = 0;	
			this._paddingTime = 0;

			this._bpm = 120;
			this._beatsPerBar = 4;

			this._onMetronomeBeatBound = ListenerFunctions.createListenerFunction(this, this._onMetronomeBeat);
			this._onMetronomeBarBound = ListenerFunctions.createListenerFunction(this, this._onMetronomeBar);
			
			this._soundObjectLoadedBound = ListenerFunctions.createListenerFunction(this, this._soundObjectLoaded);
		};

		namespace.MusicalSound = MusicalSound;

		MusicalSound.BAR_TICK = "metronomeBarTick";
		MusicalSound.BEAT_TICK = "metronomeBeatTick";		

		var p = MusicalSound.prototype = new EventDispatcher();

		p.setup = function() {			
		

			return this;
		};

		
		p.setBPM = function(aBPM) {

			this._bpm = aBPM;
			this._beatInterval = (60.0) / this._bpm;

		};

		p.setBeatsPerBar = function(aNumBeats) {
			this._beatsPerBar = aNumBeats;
		};

		p.addStartBeatNumber = function(aBeatNumber) {		
			soundLogger.pushMessage("MusicalSound :: adding start beat number : " + aBeatNumber + " to " + this._soundObject.getPath());
			this._startingBeatNumbers.push(aBeatNumber);
			// this.removeStopBeatNumber(aBeatNumber);
			// this._removeLoopBeatNumber(aBeatNumber);
		};

		p.addStartBarNumber = function(aBarNumber) {			
			this.addStartBeatNumber(aBarNumber * this._beatsPerBar);
		};

		p.removeStartBeatNumber = function(aBeatNumber) {
			while(this._startingBeatNumbers.indexOf(aBeatNumber)){
				this._startingBeatNumbers.splice(this._startingBeatNumbers.indexOf(aBeatNumber));
			}

		};

		p.addStopBeatNumber = function(aBeatNumber) {
			soundLogger.pushMessage("MusicalSound :: adding stop beat number : " + aBeatNumber + " to " + this._soundObject.getPath());
			this._stoppingBeatNumbers.push(aBeatNumber);
			// this.removeStartBeatNumber(aBeatNumber);
			// this._removeLoopBeatNumber(aBeatNumber);
		};

		p.addStopBarNumber = function(aBarNumber) {
			this.addStopBeatNumber(aBarNumber * this._beatsPerBar);			
		}

		p.removeStopBeatNumber = function(aBeatNumber) {
			while(this._stoppingBeatNumbers.indexOf(aBeatNumber)){
				this._stoppingBeatNumbers.splice(this._stoppingBeatNumbers.indexOf(aBeatNumber));
			}

		};

		p._removeLoopBeatNumber = function(aBeatNumber) {
			while(this._loopingBeatNumbers.indexOf(aBeatNumber)){
				this._loopingBeatNumbers.splice(this._loopingBeatNumbers.indexOf(aBeatNumber));
			}
		}

		p.clearAllStopStarts = function() {
			soundLogger.pushMessage("MusicalSound :: clearing all stop/starts from : " + this._soundObject.getPath());
			this._startingBeatNumbers = [];
			this._stoppingBeatNumbers = [];
		};

		p.setLooping = function(aLooping) {
			this._isLooping = aLooping;
		}

		p.attachToMetronome = function(aMetronomeObject) {

			this._metronome = aMetronomeObject;
			this._metronome.addEventListener(Metronome.BAR_TICK_AUDIO, this._onMetronomeBarBound);
			this._metronome.addEventListener(Metronome.BEAT_TICK_AUDIO, this._onMetronomeBeatBound);

			this.setBPM(this._metronome.getBPM());
			this.setBeatsPerBar(this._metronome.getBeatsPerBar());

		};

		p._onMetronomeBar = function(aEvent) {


		};

		p._onMetronomeBeat = function(aEvent) {
			
			this.onBeat(aEvent.detail.totalBeats, aEvent.detail.timeOffset)

		};

		p.onBeat = function(aBeatNumber, aBeatTimeOffset) {

			this._currentBeatNumber = aBeatNumber;

			if (!this._soundObjectLoaded) return;

			if (!this._running) {

				var timeOffset = -1;
				for (var i=0; i < this._startingBeatNumbers.length; i++)
				{	
					var beatDiff = (this._startingBeatNumbers[i] - aBeatNumber);					
					if (beatDiff <= this._paddingBeats) {

						// we are near a start beat, start playing with offset
						timeOffset = (beatDiff * this._beatInterval) - aBeatTimeOffset;
						
						this.start(this._startingBeatNumbers[i], aBeatTimeOffset);
						soundLogger.pushMessage("MusicalSound : " + this._soundObject.getPath() + " cued to start at beat : " + this._startingBeatNumbers[i] + " at beat " + aBeatNumber + " with time offset " + timeOffset);

						this._startingBeatNumbers.splice(i, 1);
						return;
					}
				}


			} else {

				var timeOffset = -1;
				for (var i=0; i < this._loopingBeatNumbers.length; i++)
				{	
					var beatDiff = (this._loopingBeatNumbers[i] - aBeatNumber);										
					if (beatDiff <= this._paddingBeats) {
						// we are near a start beat, start playing with offset
						timeOffset = (beatDiff * this._beatInterval) - aBeatTimeOffset;
						
						this.start(this._loopingBeatNumbers[i], aBeatTimeOffset);

						soundLogger.pushMessage("MusicalSound : " + this._soundObject.getPath() + " cued to loop at beat : " + this._loopingBeatNumbers[i] + " at beat " + aBeatNumber + " with time offset " + timeOffset);
						this._loopingBeatNumbers.splice(i, 1);
						return;
					}
				}


				for (var i = 0; i < this._stoppingBeatNumbers.length; i++)
				{
					var beatDiff = (this._stoppingBeatNumbers[i] - aBeatNumber);
						
					if (beatDiff <= 1) {
						timeOffset = (beatDiff * this._beatInterval) - aBeatTimeOffset;
						
						this.stop(this._stoppingBeatNumbers[i],aBeatTimeOffset);

						soundLogger.pushMessage("MusicalSound : " + this._soundObject.getPath() + " cued to stop at beat : " + this._stoppingBeatNumbers[i] + " at beat " + aBeatNumber + " with time offset " + timeOffset);

						this._stoppingBeatNumbers.splice(i, 1);
						return;
					}			

				}

			}

		};
		
		p.getDurationBars = function() {
			return this._durationBars;
		};

		p.getDurationBeats = function() {
			return this._durationBeats;
		};

		p.getPadding = function() {
			if (this._soundObject && this._soundObjectLoaded) {
				return this._soundObject.getPadding();
			} else return -1;
		};

		p.setSoundObject = function(aSoundObject) {
			this._soundObject = aSoundObject;

			var SoundObject = breelNS.getNamespace("generic.sound").SoundObject;
			if (this._soundObject._isLoaded) this._soundObjectLoaded();
			else this._soundObject.addEventListener(SoundObject.LOADED, this._soundObjectLoadedBound);

			var durationTime = this._soundObject.getDuration();
			this._durationBeats = Math.floor(durationTime / this._beatInterval);

			this._durationBars = this._durationBeats / this._beatsPerBar;
			this._paddingTime = this._soundObject.getPadding();
			this._paddingBeats = this._paddingTime / this._beatInterval;

		};

		p.load = function() {
			if (this._soundObject) this._soundObject.load();
			else throw new Error("ERROR : tried to load MusicalSound before setting sound object");
		};

		p._soundObjectLoaded = function(aEvent) {
						
			var SoundObject = breelNS.getNamespace("generic.sound").SoundObject;
			this._soundObject.removeEventListener(SoundObject.LOADED, this._soundObjectLoadedBound);
			
			// does this method really need to be here?

		};

		p.start = function(aBeatNumber, aWithTimeOffset) {
			
			aWithTimeOffset = aWithTimeOffset || 0;

			this._running = true;
			this._soundObject.play(this._paddingTime, this._paddingTime, aWithTimeOffset);

			if (this._isLooping) {
				var newLoopingBeatNumber = aBeatNumber + this._durationBeats;
				this._loopingBeatNumbers.push(newLoopingBeatNumber);			
			}

		};

		p.stop = function(aBeatNumber, aWithTimeOffset) {

			aWithTimeOffset = aWithTimeOffset || 0;

			this._loopingBeatNumbers = []; // clear looping beat numbers

			this._soundObject.pause(aWithTimeOffset);

			this._running = false;
		};

		p.setVolume = function(aVolume, aOverTime, aDelayTime, aEasingFunction) {

			if (this._soundObject) {
				this._soundObject.setVolume(aVolume, aOverTime, aDelayTime, aEasingFunction);
			}
		};

		p.destroy = function() {
			this.stop(0);
			this._soundObject.destroy();
			this._soundObject = null;
			this._metronome = null;
		};
		
		MusicalSound.create = function() {
			var newMusicalSound = new MusicalSound();		
			newMusicalSound.setup();	
			return newMusicalSound;
		};
		
	}

})();