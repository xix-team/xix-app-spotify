window._tasks = {

  /**
   * helper method to handle an array of tasks in parallel
   * @param {function[]} aMethods array of functions to be called
   * @param {function} fCallback callback to be called when complete
   *
   * @example
   * _tasks.parallel([
   *   function(callback) {
   *     // the async function will call the callback
   *     callAsyncFunction(callback)
   *   }.bind(this),
   *
   * ], function() {
   *     console.log("done");
   * });
   */

  parallel: function(aMethods, fCallback) {
    var results = [];
    var result_count = 0;
    aMethods.forEach(function(callback, index) {
      callback(function() {
        results[index] = Array.prototype.slice.call(arguments);
        result_count++;
        if (result_count == aMethods.length) {
          fCallback(results);
        }
      });
    });
  },

  /**
   * helper method to handle an array of tasks in series
   * @param {function[]} aMethods array of functions to be called
   * @param {function} fCallback callback to be called when complete
   *
   * @example
   * _tasks.series([
   *   function(callback) {
   *     // the async function will call the callback
   *     callAsyncFunction(callback)
   *   }.bind(this),
   *
   * ], function() {
   *     console.log("done");
   * });
   */
  series: function(aMethods, fCallback) {

    var results = [];

    var next = function() {

      var method = aMethods.shift();
      if (method) {
        method(function() {
          results.push(Array.prototype.slice.call(aMethods));
          next();
        });
      } else {
        fCallback();
      }
    };

    next();
  },

  /**
   * helper method to handle an array of tasks based on an existing array in parallel
   * @param {function[]} aMethods array of functions to be called
   * @param {function} fDoForEach method to be called for each entry of the array
   * @param {function} fCallback callback to be called when complete
   *
   * @example
   * _tasks.parallelForEach(ar, function(i, callback) {
   *   callAsyncFunction(i, function() {
   *     callback();
   *   });
   * }.bind(this), function() {
   *   console.log('done');
   * }.bind(this));
   */
  parallelForEach: function(aMethods, fDoForEach, fCallback) {
    var completed = 0;
    if (aMethods.length === 0) {
      fCallback();
    }
    var len = aMethods.length;
    for (var i = 0; i < len; i++) {
      fDoForEach(aMethods[i], function() {
        completed++;
        if (completed === aMethods.length) {
          fCallback();
        }
      })
    }
  },


  /**
   * helper method to handle an array of tasks based on an existing array in series
   * @param {function[]} aMethods array of functions to be called
   * @param {function} fDoForEach method to be called for each entry of the array
   * @param {function} fCallback callback to be called when complete
   *
   * @example
   * _tasks.seriesForEach(ar, function(i, callback) {
   *   callAsyncFunction(i, function() {
   *     callback();
   *   });
   * }.bind(this), function() {
   *   console.log('done');
   * }.bind(this));
   */
  seriesForEach: function(aMethods, fDoForEach, fCallback) {
    aMethods = aMethods.slice(0);

    function processOne() {
      var item = aMethods.pop();
      fDoForEach(item, function(result) {
        if (aMethods.length > 0) {
          setTimeout(processOne, 0);
        } else {
          fCallback();
        }
      });
    }

    if (aMethods.length > 0) {
      setTimeout(processOne, 0);
    } else {
      fCallback();
    }
  }
};


CSS = {
  _getBrowserPrefix: function() {
    var oPrefix = {
      MozTransform: "-moz-",
      msTransform: "-ms-",
      WebkitTransform: "-webkit-",
      OTransform: "-o-",
      transform: ""
    };

    return oPrefix[this._getSupportedProperty(['transform', 'MozTransform',
      'WebkitTransform', 'msTransform', 'OTransform'
    ])];
  },

  _getSupportedProperty: function(proparray) {

    var root = document.documentElement; //reference root element of document
    for (var i = 0; i < proparray.length; i++) { //loop through possible properties
      if (typeof root.style[proparray[i]] == "string") { //if the property value is a string (versus undefined)
        return proparray[i]; //return that string
      }
    }
    return null;
  },


  to3DString:function(type, x, y, z) {
    switch(type){
      case 'transform': 
        if(typeof x === 'string'){
          return 'translate3d(' + this._checkVal(x) +',' + this._checkVal(y) +',' + this._checkVal(z) +')';
        }
        return 'translate3d(' + this._checkVal(x) +'px,' + this._checkVal(y) +'px,' + this._checkVal(z) +'px)';
      break;
      case 'scale': 
        return 'scale3d(' + this._checkVal(x) +',' + this._checkVal(y) +',' + this._checkVal(z,1) +')';
      break;
      case 'rotate':
        var ref = x;
        if(y > ref) ref = y;
        if(z > ref) ref = z;
        return 'rotate3d(' + this._checkVal(x/ref) +',' + this._checkVal(y/ref) +',' + this._checkVal(z/ref) +','+ref+'deg)';
      break;
    }
      
  },

  _checkVal: function(val, def) {
      if(!def) def = 0;
      if(val) return val;
      else return def;  
  },

  set: function(element, properties) {
    Object.keys(properties).forEach(function(key) {

      if (key === 'transform') {
        element.style.setProperty(this._getBrowserPrefix() + 'transform',
          properties[key], '');
      } else {
        element.style.setProperty(key, properties[key].toString(), '');
      }

    }.bind(this));
  }


};


CSSanimate = {

  /**
      Really simple css3 animation wrapper. Focussing on a consistent syntax and full hardware acceleration.
      It _eventually_ will provides automated fallback to jQuery animate for feature lacking browsers.


      example(s):

        fromTo:
        convoy.animate.fromTo(this.dom, {transform: 'translateY(-50px)'}, {transform: 'translateY(0px)', opacity: 1}, {ease: 'easeOutExpo', duration: 1800, delay: 500}, function() {
          console.log('animation done!')
        }.bind(this));

        to:
        convoy.animate.to(this.dom, {transform: 'scale(1.5)'}, {ease: 'easeOutExpo', duration: 900, delay: 0}, function() {
          console.log('animation done!')
        }.bind(this));

        nested call (make sure to bind the outer scrope):

        convoy.animate.fromTo(this.dom, {transform: 'translateY(-50px)'}, {transform: 'translateY(0px)', opacity: 1}, {ease: 'easeOutExpo', duration: 1800, delay: 500}, function() {
          console.log('animation done!')

          convoy.animate.to(this.dom, {transform: 'scale(1.5)'}, {ease: 'easeOutExpo', duration: 900, delay: 0}, function() {
            console.log('animation2 done!')
          });
        }.bind(this));

      */

  fromTo: function(element, from, to, settings, externalCallback) {
    CSS.set(element, from);
    this.startAnimation(element, to, settings, externalCallback);
  },

  to: function(element, to, settings, externalCallback) {
    this.startAnimation(element, to, settings, externalCallback);
  },

  setTransitionProperties: function(element, duration, ease) {
    var e = ease ? ' ' + this.easingLookupTable[ease] : '';
    element.style[CSS._getBrowserPrefix() + 'transition'] = 'all ' + duration + 'ms' + e;
  },

  removeTween: function(element) {

    var tween;
    var l = this.tweenCounts ? this.tweenCounts.length : 0;
     for (var i = 0; i < l; i++) {
      if (this.tweenCounts[i].element == element) {
          tween = this.tweenCounts[i];
          this.tweenCounts.splice(i,1);
          
          element.removeEventListener(this._getTransitionEndName(), tween.onComplete);
          element.style[CSS._getBrowserPrefix() + 'transition'] = 'all 0ms';
          break;
      }
    }
  },


  startAnimation: function(element, to, settings, callback) {
    if (!this.tweenCounts) this.tweenCounts = [];
    CSSanimate.removeTween(element);
    var tween = {};
    tween.element = element;
    tween.onComplete = this._transitionComplete.bind(this, element, callback);
    this.tweenCounts.push(tween);
    setTimeout(function() {

      element.style[CSS._getBrowserPrefix() + 'transition'] = 'all ' + settings.duration +
      'ms ' + this.easingLookupTable[settings.ease];

      Object.keys(to).forEach(function(key) {
        if (key === 'transform') {
          element.style.setProperty(CSS._getBrowserPrefix() + 'transform',
            to[key], '');
        } else {
          element.style.setProperty(key, to[key].toString(), '');
        }
      }.bind(this));
    }.bind(this), settings.delay);

    
    element.addEventListener(this._getTransitionEndName(), tween.onComplete);
  },

  _transitionComplete:function(element, callback) {

    CSSanimate.removeTween(element);
    callback();
    
  },

  _getTransitionEndName: function() {
    var dummy = document.createElement('div'),
      eventNameHash = {
        webkit: 'webkitTransitionEnd',
        Moz: 'transitionend',
        O: 'oTransitionEnd',
        ms: 'MSTransitionEnd'
      },
      transitionEnd = (function _getTransitionEndEventName() {
        var retValue = 'transitionend';

        Object.keys(eventNameHash).some(function(vendor) {
          if (vendor + 'TransitionProperty' in dummy.style) {
            retValue = eventNameHash[vendor];
            return true;
          }
        });

        return retValue;
      }());

    return transitionEnd;
  },

  easingLookupTable: {

    // pulled from http://matthewlein.com/ceaser

    'linear': 'cubic-bezier(0.390, 0.575, 0.565, 1.000)',
    'easeInSine': 'cubic-bezier(0.470, 0.000, 0.745, 0.715)',
    'easeInExpo': 'cubic-bezier(0.950, 0.050, 0.795, 0.035)',
    'easeInBack': 'cubic-bezier(0.600, -0.280, 0.735, 0.045)',
    'easeInQuad' : 'cubic-bezier(0.55, 0.085, 0.68, 0.53)',
    'easeInQuart' : 'cubic-bezier(0.895, 0.03, 0.685, 0.22)',
    'easeInQubic' : 'cubic-bezier(0.55, 0.055, 0.675, 0.19)',
    'easeInQuint' : 'cubic-bezier(0.755, 0.05, 0.855, 0.06)',
    'easeInCirc' : 'cubic-bezier(0.6, 0.04, 0.98, 0.335)',

    'easeOutSine': 'cubic-bezier(0.390, 0.575, 0.565, 1.000)',
    'easeOutExpo': 'cubic-bezier(0.190, 1.000, 0.220, 1.000)',
    'easeOutBack': 'cubic-bezier(0.175, 0.885, 0.320, 1.275)',
    'easeOutQuad' : 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    'easeOutQuart' : 'cubic-bezier(0.165, 0.84, 0.44, 1)',
    'easeOutQubic' : 'cubic-bezier(0.215, 0.61, 0.355, 1)',
    'easeOutQuint' : 'cubic-bezier(0.23, 1, 0.32, 1)',
    'easeOutCirc' : 'cubic-bezier(0.075, 0.82, 0.165, 1)',

    'easeInOutSine': 'cubic-bezier(0.445, 0.050, 0.550, 0.950)',
    'easeInOutExpo': 'cubic-bezier(1.000, 0.000, 0.000, 1.000)',
    'easeInOutBack': 'cubic-bezier(0.680, -0.550, 0.265, 1.550)',
    'easeInOutQuad' : 'cubic-bezier(0.455, 0.03, 0.515, 0.955)',
    'easeInOutQuart' : 'cubic-bezier(0.77, 0, 0.175, 1)',
    'easeInOutQubic' : 'cubic-bezier(0.645, 0.045, 0.355, 1)',
    'easeInOutQuint' : 'cubic-bezier(0.86, 0, 0.07, 1)',
    'easeInOutCirc' : 'cubic-bezier(0.785, 0.135, 0.15, 0.86)'
    
  }
};




