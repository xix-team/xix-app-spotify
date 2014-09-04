(function() {

	var ListenerFunctions = breelNS.getNamespace("generic.events").ListenerFunctions;

	var namespace = breelNS.getNamespace("generic.animation");

	if(!namespace.AnimationManager) {

		var AnimationManager = function AnimationManager() {
			this._init();
		};

		namespace.AnimationManager = AnimationManager;
		var p = AnimationManager.prototype;

		p._init = function() {
			this._onRequestAnimationFrameBound = null;

			this.currentTransformStr = undefined;
			this.currentCSSTransformEvtCompareStr = undefined;
			this.currentTransitionStr = undefined;
			this.currentCSSTransitionEvtCompareStr = undefined;

			return this;
		};

		p.setup = function() {
			this._onRequestAnimationFrameBound = ListenerFunctions.createListenerFunction(this, this._onRequestAnimationFrame);
			requestAnimFrame(this._onRequestAnimationFrameBound);

			this.currentTransformStr = this.getSupportedTransfromStr();
			this.currentCSSTransformEvtCompareStr = this.getSupportedCSSTransformEventCompareStr();

			this.currentTransitionStr = this.getSupportedTransitionStr();
			this.currentCSSTransitionEvtCompareStr = this.getSupportedCSSTransitionEventCompareStr();

		};

		p._onRequestAnimationFrame = function() {
			TWEEN.update();

			requestAnimFrame(this._onRequestAnimationFrameBound);
		};

		p.getTranslateStr = function(left, top){

			var fullStr = 'translate3d('+left+'px'+','+top+'px,0px)';

			if(browserName == "Microsoft Internet Explorer") {
				if(fullVersion < 10){
					fullStr = 'translate('+left+'px'+','+top+'px)';
				}
			}

			return fullStr;

		};

		p.getSupportedTransitionStr = function(){
			var prefixes = 'transition webkitTransition MozTransition OTransition msTransition'.split(' ');
			for(var i = 0; i < prefixes.length; i++) {
				if(document.createElement('div').style[prefixes[i]] !== undefined) {
					return prefixes[i];
				}
			}
		};
		
		p.getSupportedCSSTransitionEventCompareStr = function(){

			var prefixes = 'transition -webkit-transition -moz-transition -o-transition -ms-transform'.split(' ');
			for(var i = 0; i < prefixes.length; i++) {
				if(document.createElement('div').style[prefixes[i]] !== undefined) {
					return prefixes[i];
				}
			}
		};
		
		p.getSupportedTransfromStr = function(){
			var prefixes = 'transform WebkitTransform MozTransform OTransform msTransform'.split(' ');
			for(var i = 0; i < prefixes.length; i++) {
				if(document.createElement('div').style[prefixes[i]] !== undefined) {
					return prefixes[i];
				}
			}
		};

		p.getSupportedCSSTransformEventCompareStr = function(){
			var prefixes = 'transform -webkit-transform -moz-transform -o-transform -ms-transform'.split(' ');
			for(var i = 0; i < prefixes.length; i++) {
				if(document.createElement('div').style[prefixes[i]] !== undefined) {
					return prefixes[i];
				}
			}
		};

		AnimationManager.create = function() {
			var newAnimationManager = new AnimationManager();
			newAnimationManager.setup();
			return newAnimationManager;
		};
	}

})();