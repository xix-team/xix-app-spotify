(function() {
	
	var EventDispatcher = breelNS.getNamespace("generic.events").EventDispatcher;
	var ListenerFunctions = breelNS.getNamespace("generic.events").ListenerFunctions;

	var SoundObject = breelNS.getNamespace("generic.sound").SoundObject;

	var namespace = breelNS.getNamespace("generic.sound.webAudio");

	if(!namespace.WebAudioSoundObject) {
		var WebAudioSoundObject = function WebAudioSoundObject() {

			this._rq = null;
			this._soundBuffer = null;
			this._soundSource = null;
			this._context = null;
			this._gainNode = null;

			this._supportsBufferSourceStartFunction = false;

			this._trimPadding = false;

			this._loadCompleteBound = ListenerFunctions.createListenerFunction(this, this._loadCompleted);
			this._playbackFinishedBound = ListenerFunctions.createListenerFunction(this, this._playbackFinished);
			this._updateVolumeBound = ListenerFunctions.createListenerFunction(this, this._updateVolume);
		};

		namespace.WebAudioSoundObject = WebAudioSoundObject;


		var p = WebAudioSoundObject.prototype = new SoundObject();
		var s = SoundObject.prototype;

		SoundObject.LOADED = "soundObjectLoaded";

		p.setup = function(aSoundPath, aSoundURL, aAudioObject, aWebAudioContext) {	

			s.setup.call(this, aSoundPath, aSoundURL, aAudioObject);

			this._context = aWebAudioContext;
			this._gainNode = this._context.createGainNode();
			this._gainNode.connect(this._context.destination);

			var dummySoundSource = this._context.createBufferSource();
			this._supportsBufferSourceStartFunction = typeof(dummySoundSource.start) == "function";
			dummySoundSource = null;

			
			return this;
		};

		p.load = function() {

			this._rq = new XMLHttpRequest();
			this._rq.open("GET", this._soundURL, true);
			this._rq.responseType = "arraybuffer";

			this._rq.onload = this._loadCompleteBound;
			this._rq.send();

		};

		p._loadCompleted = function() {			

			var audioData = this._rq.response;
			
			var rawBuffer = this._context.createBuffer(audioData, false);	

			if (this._trimPadding) {

				// trim the padding from the raw buffer so we can play it immediately

				var sampleBufferLength = rawBuffer.length - ((2 * this._padding) * rawBuffer.sampleRate);
			
				this._soundBuffer = this._context.createBuffer(rawBuffer.numberOfChannels, sampleBufferLength, rawBuffer.sampleRate);

				var startSampleOffset = (this._padding) * rawBuffer.sampleRate;			

				for (var i =0; i < rawBuffer.numberOfChannels; i++)
				{
					var channel = this._soundBuffer.getChannelData(i);
					var rawChannel = rawBuffer.getChannelData(i);
					var channelSampleData = rawChannel.subarray(startSampleOffset, startSampleOffset + sampleBufferLength);
					channel.set(channelSampleData);
				}

			} else {

				this._soundBuffer = rawBuffer;

			}
			// console.log(" Web Audio Sound " + this._soundPath + " loaded : buffer length : " + rawBuffer.duration);
		

			this._isLoaded = true;
			
			s._loadCompleted.call(this);
		};

		p.play = function(aFromTime, aDelayTime, aTimingCorrection, aLoop) {

			aLoop = aLoop || false;
			aFromTime = aFromTime || 0;
			aDelayTime = aDelayTime || 0;
			aTimingCorrection = aTimingCorrection || 0;

			if (!s.play.call(this, aFromTime, aDelayTime, aTimingCorrection)) return;

			this._soundSource = this._context.createBufferSource();
			this._soundSource.buffer = this._soundBuffer;
			this._soundSource.connect(this._gainNode);
			this._soundSource.loop = aLoop;
			var delayTimeS = (aDelayTime - aTimingCorrection);
			var fromTimeS = aFromTime;

			if (this._supportsBufferSourceStartFunction){

				this._soundSource.start(this._context.currentTime + delayTimeS,fromTimeS);	

			}				
			else {

				this._soundSource.noteOn(this._context.currentTime + delayTimeS,fromTimeS);	

			}
				
			
			this._isPlaying = true;
		};

		p.pause = function(aDelayTime) {

			if(!s.pause.call(this, aDelayTime)) return;

			this._soundSource.stop(aDelayTime);			

			this._playbackFinished();
		};

		p._playbackFinished = function() {

			s._playbackFinished.call(this);

			this._isPlaying = false;

		};

		p._updateVolume = function() {

			s._updateVolume.call(this);

			if (!this.isMute) {
				this._gainNode.gain.value = this._currentVolume;
			}
			else this._gainNode.gain.value = 0;

		};
		


		p.destroy = function() {

			s.destroy.call(this);
			this._soundBuffer = null;

		};
		
		WebAudioSoundObject.create = function(aSoundPath, aSoundURL, aAudioObject, aWebAudioContext) {
			var newWebAudioSoundObject = new WebAudioSoundObject();		
			newWebAudioSoundObject.setup(aSoundPath, aSoundURL, aAudioObject, aWebAudioContext);	
			return newWebAudioSoundObject;
		};
		
	}

})();