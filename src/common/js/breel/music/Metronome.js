(function() {
	
	var EventDispatcher = breelNS.getNamespace("generic.events").EventDispatcher;
	var ListenerFunctions = breelNS.getNamespace("generic.events").ListenerFunctions;

	var namespace = breelNS.getNamespace("generic.music");

	if(!namespace.Metronome) {
		var Metronome = function Metronome() {

			this._running = false;

			this._bpm = 120;
			this._beatsPerBar = 4;

			this._bars = 0;
			this._beats = 0;

			this._loopPointBeats = -1; // sets this metronome to loop bar numbers back to 0

			// internal vars for speed
			this.__beatsPassed = 0;
			this.__timeDiff = 0;	
			this.__updateVariance = 0;
			this.__totalBeats = 0;

			this._lastBeatTimeS = null;

			this._beatInterval = (60 * 1000) / this._bpm; 

			this.__nextUpdateInterval = this._beatInterval;
			this.__nextUpdateInterval += 1; // add 1 ms to ensure we're always after a beat event

			this._updateBound = ListenerFunctions.createListenerFunction(this, this._update);

		};

		namespace.Metronome = Metronome;

		/*
			We have two sets of events; one for audio updates, which we want to keep as tight as possible, and visual.
			Ideally keep any DOM updates, console logs etc to the Visual Priority updates, as these can cause lags and therefore timing
			delays on the audio priority events
		 */
		Metronome.BAR_TICK_AUDIO = "metronomeBarTickAudio";
		Metronome.BEAT_TICK_AUDIO = "metronomeBeatTickAudio";		

		Metronome.BAR_TICK = "metronomeBarTickNormalPriority";
		Metronome.BEAT_TICK = "metronomeBeatTickNormalPriority";

		Metronome.UPDATE_INTERVAL = 10;

		var p = Metronome.prototype = new EventDispatcher();

		p.setup = function() {			
		

			return this;
		};

		p.setBPM = function(aBPM) {

			this._bpm = aBPM;
			this._beatInterval = 60 / this._bpm; 
			this.__nextUpdateInterval = Metronome.UPDATE_INTERVAL;		

			this.__nextUpdateInterval += 1;	// add 1 ms to ensure we're always after a beat event
		};

		p.setBeatsPerBar = function(aNumBeats) {
			this._beatsPerBar = aNumBeats;
		};

		p.getBPM = function() { return this._bpm; }
		p.getBeatsPerBar = function() { return this._beatsPerBar; }

		p.getBars = function() {
			return this._bars;
		};

		p.getBeats = function() {
			return this._beats;
		};

		p.setLoopBar = function(aLoopBar) {
			this._loopPointBeats = (aLoopBar * this._beatsPerBar) + 1;
		};


		p.start = function() {

			this._lastBeatTimeS = (new Date().getTime() / 1000);
			this._bars = 0;
			this._beats = 0;

			this._running = true;

			setTimeout(this._updateBound, this.__nextUpdateInterval);

		};

		p.stop = function() {


			this._running = false;
		};

		p._update = function() {

			// set the timeout to update before any other (potentially lengthly) calls
			setTimeout(this._updateBound, this.__nextUpdateInterval);

			var currentDateS = (new Date().getTime() / 1000);
			this.__timeDiff =  currentDateS - this._lastBeatTimeS;		
			if (this.__timeDiff == this._beatInterval) this.__beatsPassed = 1;
			else this.__beatsPassed = Math.floor((this.__timeDiff) / this._beatInterval);

			
			if (this.__beatsPassed > 0)
			{
				this._beats += this.__beatsPassed;	

				this.__totalBeats = (this._bars * this._beatsPerBar) + this._beats;

				if (this.__totalBeats == this._loopPointBeats){
					this._beats = 0;
					this.__totalBeats = 0;
					this._bars = 0;
				}

				this.__updateVariance = (this.__timeDiff % this._beatInterval);
				
				this._lastBeatTimeS = currentDateS - this.__updateVariance;

				// dispatch AUDIO tick events first so everything stays tight
											
				if (this._beats >= this._beatsPerBar)
				{
					this._bars++;
					this._beats = 0;
					this.dispatchCustomEvent(Metronome.BAR_TICK_AUDIO, { 
						bars : this._bars,
						beats : this._beats,
						totalBeats : this.__totalBeats,
						timeOffset : this.__updateVariance
					});
				}	

				this.dispatchCustomEvent(Metronome.BEAT_TICK_AUDIO, { 
					bars : this._bars,
					beats : this._beats,
					totalBeats : this.__totalBeats,
					timeOffset : this.__updateVariance
				});

			

				// then normal events afterwards

			

				this.dispatchCustomEvent(Metronome.BEAT_TICK, { 
					bars : this._bars,
					beats : this._beats,
					totalBeats : this.__totalBeats,
					timeOffset : this.__updateVariance
				});


				if (this._beats >= this._beatsPerBar)
				{					
					this.dispatchCustomEvent(Metronome.BAR_TICK, { 
						bars : this._bars,
						beats : this._beats,
						totalBeats : this.__totalBeats,
						timeOffset : this.__updateVariance
					});
				}	
							
			} 						
			
		};

		p.convertDurationToBeats = function(aDuration) {
			return Math.floor(aDuration / this._beatInterval);
		};

		p.convertDurationToWholeBars = function(aDuration) {
			return Math.floor(aDuration / (this._beatInterval * this._beatsPerBar));
		};

		p.convertBeatsToDuration = function(aBeats) {
			return this._beatInterval * aBeats;

		};

		p.convertBarsToDuration = function(aBars) {
			return this.convertBeatsToDuration(aBars * this._beatsPerBar);
		};

		p.destroy = function() {
		

		};
		
		Metronome.create = function() {
			var newMetronome = new Metronome();		
			newMetronome.setup();	
			return newMetronome;
		};
		
	}

})();