(function() {
    var a = breelNS.getNamespace("general.abstract");

    if (void 0 === a.InitObject) {
        var c = function() {
                this._init.apply(this, arguments)
            },
            e = c.prototype = {};
        a.InitObject = c;
        e._init = function() {};
        e.destroy = function() {
            this._destroy()
        };
        e._destroy = function() {}
    }
})();
breelNS.defineClass("generic.events.ListenerFunctions", null, function(a, c, e) {
    e.addDOMListener = function(b, d, e) {
        "function" === typeof b.addEventListener ? b.addEventListener(d, e, !1) : "function" === typeof b.attachEvent ? b.attachEvent("on" + d, e) : b["on" + d] = e
    };
    e.removeDOMListener = function(b, d, e) {
        null == b || void 0 == b || ("function" === typeof b.removeEventListener ? b.removeEventListener(d, e, !1) : "function" === typeof b.attachEvent ? b.detachEvent("on" + d, e) : b["on" + d] = null)
    };
    e.createListenerFunction = function(b, d) {
        if (void 0 ===
            d) throw Error("ERROR ListenerFunctions :: createListenerFunction :: callback function was null when called by :: " + b);
        return function() {
            d.apply(b, arguments)
        }
    };
    e.createListenerFunctionOnce = function(b, d) {
        if (void 0 === d) throw Error("ERROR ListenerFunctions :: createListenerFunction :: callback function was null when called by :: " + b);
        return function() {
            if (void 0 === d) return null;
            d.apply(b, arguments);
            d = void 0
        }
    };
    e.createListenerFunctionWithArguments = function(b, d, e) {
        if (void 0 === d) throw Error("ERROR ListenerFunctions :: createListenerFunction :: callback function was null when called by :: " +
            b);
        return function() {
            for (var a = e.concat([]), h = arguments, c = h.length, k = 0; k < c; k++) a.push(h[k]);
            d.apply(b, a)
        }
    };
    e.createListenerFunctionWithReturn = function(b, d) {
        if (void 0 === d) throw Error("ERROR ListenerFunctions :: createListenerFunctionWithReturn :: callback function was null when called by :: " + b);
        return function() {
            return d.apply(b, arguments)
        }
    }
});
breelNS.defineClass("generic.events.EventDispatcher", "general.abstract.InitObject", function(a, c, e) {
    var b = !0;
    try {
        document.createEvent("CustomEvent")
    } catch (d) {
        b = !1
    }
    a._init = function() {
        c._init.call(this);
        this._eventListeners = null
    };
    a.addEventListener = function(b, d) {
        if (null === this._eventListeners) this._eventListeners = {};
        this._eventListeners[b] || (this._eventListeners[b] = []);
        this._eventListeners[b].push(d);
        return this
    };
    a.removeEventListener = function(b, d) {
        if (null === this._eventListeners) this._eventListeners = {};
        var e = this._eventListeners[b];
        if ("undefined" === typeof e) return this;
        for (var a = e.length, c = 0; c < a; c++) e[c] === d && (e.splice(c, 1), c--, a--);
        return this
    };
    a.dispatchEvent = function(b) {
        if (null === this._eventListeners) this._eventListeners = {};
        var d = b.type;
        try {
            if (null === b.target) b.target = this;
            b.currentTarget = this
        } catch (e) {
            return this.dispatchEvent({
                type: d,
                detail: b.detail,
                dispatcher: this
            })
        }
        d = this._eventListeners[d];
        if (null !== d && void 0 !== d)
            for (var d = this._copyArray(d), a = d.length, c = 0; c < a; c++) d[c].call(this, b);
        return this
    };
    a.dispatchCustomEvent = function(d, e) {
        var a;
        b ? (a = document.createEvent("CustomEvent"), a.dispatcher = this, a.initCustomEvent(d, !1, !1, e)) : a = {
            type: d,
            detail: e,
            dispatcher: this
        };
        return this.dispatchEvent(a)
    };
    a._destroy = function() {
        c._destroy.call(this);
        if (null !== this._eventListeners) {
            for (var b in this._eventListeners) {
                for (var d = this._eventListeners[b], e = d.length, a = 0; a < e; a++) d[a] = null;
                delete this._eventListeners[b]
            }
            this._eventListeners = null
        }
    };
    a._copyArray = function(b) {
        for (var d = Array(b.length), e = d.length, a = 0; a <
            e; a++) d[a] = b[a];
        return d
    };
    e.decorate = function(b) {
        e.apply(b);
        b.addEventListener = a.addEventListener;
        b.dispatchEvent = a.dispatchEvent;
        b.dispatchCustomEvent = a.dispatchCustomEvent;
        b.removeEventListener = a.removeEventListener;
        return b
    }
});
(function() {
    var a = breelNS.getNamespace("generic.math");
    if (!a.MathUtils) {
        var c = Math.cos,
            e = Math.PI,
            b = 2 * Math.PI,
            d = 0.5 * Math.PI,
            f = function() {};
        a.MathUtils = f;
        f.PI2 = b;
        f.HALF_PI = d;
        f.DEG2RAD = e / 180;
        f.RAD2DEG = 180 / e;
        f.EPS = 1.0E-5;
        f.roundToOneDecimal = function(b) {
            return Math.round(10 * b) / 10
        };
        f.roundFixedToDecimal = function(b, d) {
            return parseFloat(b.toFixed(d))
        };
        f.lerp = function(b, d, e) {
            return d * (1 - b) + e * b
        };
        f.cosineInterpolation = function(b, d, a) {
            b = 0.5 * (1 - c(b * e));
            return d * (1 - b) + a * b
        };
        f.map = function(b, d, e, a, c, n) {
            void 0 == n &&
                (n = !1);
            b = a + (b - d) * (c - a) / (e - d);
            n && f.constrain(b, a, c);
            return b
        };
        f.normalize = function(b, d, e) {
            return ns.MathUtils.map(b, d, e, 0, 1)
        };
        f.clamp = function(b, d, e) {
            return b < d ? d : b > e ? e : b
        };
        f.contrast = function(b, d, e) {
            void 0 == e && (e = 0.5);
            return (b - e) * d + e
        };
        f.constrain = function(b, d, e) {
            return b < d ? d : b > e ? e : b
        };
        f.random = function(b, d) {
            return b + Math.random() * (d - b)
        };
        f.sign = function(b) {
            return b ? 0 > b ? -1 : 1 : 0
        };
        f.degreesToRadians = function(b) {
            return b * (Math.PI / 180)
        };
        f.radiansToDegrees = function(b) {
            return b * (180 / Math.PI)
        };
        f.getDistance =
            function(b, d) {
                return Math.sqrt(Math.pow(d.x - b.x, 2) + Math.pow(d.y - b.y, 2))
            };
        f.easeOutExpo = function(b, d, e, a, f) {
            console.log("MathUtils", d / f);
            return d == f ? e + a : a * (-Math.pow(2, -10 * d / f) + 1) + e
        }
    }
})();
(function() {
    var a = breelNS.getNamespace("generic.math");
    if (!a.SimpleTrig) {
        var c = function() {};
        a.SimpleTrig = c;
        c.getAngle = function(e, b, d) {
            d = d || !1;
            e = Math.atan2(e.y - b.y, e.x - b.x);
            return d ? c.toDegrees(e) : e
        };
        c.getDistance = function(e, b) {
            var d = b.x - e.x,
                a = b.y - e.y;
            return Math.sqrt(d * d + a * a)
        };
        c.getPythagoreanDistance = function(e, b) {
            return Math.sqrt(e * e + b * b)
        };
        c.getPointOnHypoteneuse = function(e, b, d) {
            var a = Math.sin(b) * d,
                d = Math.sqrt(d * d - a * a);
            return {
                x: 1.5 < b || -1.5 > b ? e.x + d : e.x - d,
                y: e.y - a
            }
        };
        c.getPointsOnACircle = function(e,
            b, d) {
            for (var a = [], g = 2 * Math.PI / d, h = 0; h < d; ++h) a[h] = c.getPointOnACircle(e, b, g * h);
            return a
        };
        c.getPointOnACircle = function(e, b, d) {
            newX = e * Math.cos(d) + b.x;
            newY = e * Math.sin(d) + b.y;
            return {
                x: newX,
                y: newY
            }
        };
        c.toDegrees = function(e) {
            return 180 * e / Math.PI
        };
        c.toRadians = function(e) {
            return e / 180 * Math.PI
        }
    }
})();
(function() {
    var a = breelNS.getNamespace("generic.math");
    if (!a.BinaryTree) {
        var c = function() {};
        a.BinaryTree = c;
        c.getArrayPosition = function(e, b) {
            for (var d = 0, a = e, g = 0; g <= b; g++) d += (a & 1) * (1 << b - g), a >>= 1;
            return d
        };
        c.getNextPowerOfTwoLength = function(e) {
            for (var b = 0; e > 2 << b;) b++;
            return b
        }
    }
})();
(function() {
    var a = breelNS.getNamespace("generic.utils");
    if (void 0 === a.UrlFunctions) {
        var c = function() {};
        a.UrlFunctions = c;
        c.parseQueryString = function(e) {
            var b = e,
                d = b.indexOf("?"),
                e = []; - 1 !== d && d + 1 !== b.length && (b = b.substring(d + 1, b.length), e = b.split("&"));
            b = {};
            for (d = 0; d < e.length; d++) {
                var a = e[d].split("=");
                b[a[0]] = a[1]
            }
            return b
        }
    }
})();
(function() {
    var a = breelNS.getNamespace("generic.utils");
    if (!a.ComplexKeyDictionary) {
        var c = function() {
            this._keys = [];
            this._values = []
        };
        a.ComplexKeyDictionary = c;
        a = c.prototype;
        a.setValue = function(a, b) {
            for (var d = this._keys, f = d.length, g = 0; g < f; g++)
                if (d[g] === a) {
                    this._values[g] = b;
                    return
                }
            this._keys.push(a);
            this._values.push(b)
        };
        a.getValue = function(a) {
            for (var b = this._keys, d = b.length, f = 0; f < d; f++)
                if (b[f] === a) return this._values[f];
            return null
        }
    }
})();
(function() {
    var a = breelNS.getNamespace("generic.events").EventDispatcher;
    breelNS.getNamespace("generic.utils");
    var c = breelNS.getNamespace("generic.events").ListenerFunctions,
        e = breelNS.getNamespace("generic.math").SimpleTrig,
        b = breelNS.getNamespace("generic.utils");
    if (!b.GestureDetector) {
        var d = function() {
            this._element = null;
            this._isAttached = !1;
            this._globalOriginY = this._globalOriginX = null;
            this._minimumUpdateDistanceY = this._minimumUpdateDistanceX = this._elementHeight = this._elementWidth = this._deltaY = this._deltaX =
                0;
            this._onGlobalMouseLeaveBound = this._onGlobalMouseUpBound = this._onGlobalMouseMoveBound = this._onGlobalMouseDownBound = null
        };
        b.GestureDetector = d;
        a = d.prototype = new a;
        d.fractionOfElementToMoveBeforeUpdate = 0.1;
        d.GESTURE_START = "gestureDetectStart";
        d.GESTURE_UPDATE = "gestureDetectUpdate";
        d.GESTURE_END = "gestureDetectEnd";
        a.setup = function() {
            this._onGlobalMouseDownBound = c.createListenerFunction(this, this._onGlobalMouseDown);
            this._onGlobalMouseMoveBound = c.createListenerFunction(this, this._onGlobalMouseMove);
            this._onGlobalMouseUpBound = c.createListenerFunction(this, this._onGlobalMouseUp);
            this._onGlobalMouseLeaveBound = c.createListenerFunction(this, this._onGlobalMouseLeave);
            c.addDOMListener(document.body, "touchmove", this._onGlobalMouseMoveBound)
        };
        a._onGlobalMouseDown = function(b) {
            b.preventDefault()
        };
        a._onGlobalMouseMove = function(b) {
            if (!this._isAttached) return !1;
            b.preventDefault();
            if ("touchmove" == b.type && b.touches) var a = this._globalOriginX - b.touches[0].pageX,
                e = this._globalOriginY - b.touches[0].pageY;
            else a =
                this._globalOriginX - b.pageX, e = this._globalOriginY - b.pageY;
            var c = !1;
            Math.abs(a - this._deltaX) > this._minimumUpdateDistanceX && (c = !0);
            Math.abs(e - this._deltaY) > this._minimumUpdateDistanceY && (c = !0);
            if (c) this._deltaX = a, this._deltaY = e, b = this._createDataObject(b.type), this.dispatchCustomEvent(d.GESTURE_UPDATE, b);
            return !1
        };
        a._onGlobalMouseUp = function(b) {
            if (!this._isAttached) return !1;
            b.preventDefault();
            this._deltaX = this._globalOriginX - b.pageX;
            this._deltaY = this._globalOriginY - b.pageY;
            this._lastUpdateObject = this._createDataObject(b.type,
                b.target);
            0 < b.pageX && this.dispatchCustomEvent(d.GESTURE_UPDATE, this._lastUpdateObject);
            this.dispatchCustomEvent(d.GESTURE_END, this._lastUpdateObject);
            return !1
        };
        a._onGlobalMouseLeave = function(b) {
            console.log("GestureDetector :: Mouse Left");
            var a = !1;
            b.relatedTarget && b.relatedTarget.nodeName && "HTML" == b.relatedTarget.nodeName && (a = !0);
            b.preventDefault();
            if (!this._isAttached) return !1;
            this._deltaX = this._globalOriginX;
            this._deltaY = this._globalOriginY;
            this._lastUpdateObject = this._createDataObject(b.type, b.target);
            a && this.dispatchCustomEvent(d.GESTURE_END, this._lastUpdateObject)
        };
        a._createDataObject = function(b, d) {
            var a = this._deltaX / this._elementWidth,
                c = this._deltaY / this._elementHeight;
            return {
                x: a,
                y: c,
                distance: e.getPythagoreanDistance(a, c),
                internalType: b,
                targetElem: d
            }
        };
        a.startTrackingGestureOnElement = function(b, a, e, l) {
            l = l || d.fractionOfElementToMoveBeforeUpdate;
            this._element = b;
            this._isAttached = !0;
            this._globalOriginX = a;
            this._globalOriginY = e;
            this._deltaY = this._deltaX = 0;
            c.addDOMListener(document.body, "touchend",
                this._onGlobalMouseUpBound);
            c.addDOMListener(document.body, "touchleave", this._onGlobalMouseLeaveBound);
            c.addDOMListener(document.body, "mousemove", this._onGlobalMouseMoveBound);
            c.addDOMListener(document.body, "mouseup", this._onGlobalMouseUpBound);
            c.addDOMListener(document.body, "mouseleave", this._onGlobalMouseLeaveBound);
            c.addDOMListener(window, "mouseout", this._onGlobalMouseLeaveBound);
            this._elementWidth = this._element.clientWidth;
            this._elementHeight = this._element.clientHeight;
            this._minimumUpdateDistanceX =
                this._elementWidth * l;
            this._minimumUpdateDistanceY = this._elementHeight * l;
            this.dispatchCustomEvent(d.GESTURE_START, null)
        };
        a.detachFromElement = function() {
            c.removeDOMListener(document.body, "touchend", this._onGlobalMouseUpBound);
            c.removeDOMListener(document.body, "touchleave", this._onGlobalMouseLeaveBound);
            c.removeDOMListener(document.body, "mousemove", this._onGlobalMouseMoveBound);
            c.removeDOMListener(document.body, "mouseup", this._onGlobalMouseUpBound);
            c.removeDOMListener(document.body, "mouseleave", this._onGlobalMouseLeaveBound);
            c.removeDOMListener(window, "mouseout", this._onGlobalMouseLeaveBound);
            this._isAttached = !1;
            this._element = null
        };
        a.enable = function() {};
        a.disable = function() {
            c.removeDOMListener(document.body, "mousedown", this._onGlobalMouseDownBound);
            c.removeDOMListener(document.body, "mousemove", this._onGlobalMouseMoveBound);
            c.removeDOMListener(document.body, "touchend", this._onGlobalMouseUpBound);
            c.removeDOMListener(document.body, "mouseup", this._onGlobalMouseUpBound);
            c.removeDOMListener(document.body, "touchleave", this._onGlobalMouseLeaveBound);
            c.removeDOMListener(document.body, "mouseleave", this._onGlobalMouseLeaveBound)
        };
        d.create = function() {
            var b = new d;
            b.setup();
            return b
        }
    }
})();
(function() {
    var a = breelNS.getNamespace("generic.utils");
    if (!a.FullscreenAPI) {
        var c = function() {};
        a.FullscreenAPI = c;
        c.getFullscreenAPI = function() {
            var a = {
                    supportsFullScreen: !1,
                    isFullScreen: function() {
                        return !1
                    },
                    requestFullScreen: function() {},
                    cancelFullScreen: function() {},
                    fullScreenEventName: "",
                    prefix: ""
                },
                b = "webkit moz o ms khtml".split(" ");
            if ("undefined" != typeof document.cancelFullScreen) a.supportsFullScreen = !0;
            else
                for (var d = 0, f = b.length; d < f; d++)
                    if (a.prefix = b[d], "undefined" != typeof document[a.prefix +
                        "CancelFullScreen"]) {
                        a.supportsFullScreen = !0;
                        break
                    } if (a.supportsFullScreen) a.fullScreenEventName = a.prefix + "fullscreenchange", a.isFullScreen = function() {
                switch (this.prefix) {
                    case "":
                        return document.fullScreen;
                    case "webkit":
                        return document.webkitIsFullScreen;
                    default:
                        return document[this.prefix + "FullScreen"]
                }
            }, a.requestFullScreen = function(b) {
                return "" === this.prefix ? b.requestFullScreen() : b[this.prefix + "RequestFullScreen"]()
            }, a.cancelFullScreen = function() {
                return "" === this.prefix ? document.cancelFullScreen() :
                    document[this.prefix + "CancelFullScreen"]()
            };
            return a
        }
    }
})();
(function() {
    var a = breelNS.getNamespace("generic.events").ListenerFunctions,
        c = breelNS.getNamespace("generic.utils");
    if (!c.Scheduler) {
        var e = function() {
            this.FRAMERATE = 60;
            this._delayTasks = [];
            this._nextTasks = [];
            this._deferTasks = [];
            this._batchTasks = [];
            this._highTasks = [];
            this._enterframeTasks = [];
            this._idTable = 0;
            this._onRequestAnimationFrameBound = null
        };
        c.Scheduler = e;
        c = e.prototype;
        c.setup = function() {
            this._onRequestAnimationFrameBound = a.createListenerFunction(this, this._loop);
            requestAnimFrame(this._onRequestAnimationFrameBound)
        };
        c._loop = function() {
            this._process();
            requestAnimFrame(this._onRequestAnimationFrameBound)
        };
        c._process = function() {
            for (var b; 0 < this._highTasks.length;) {
                var d = this._highTasks.pop();
                d.func.call(d.scope, d.params)
            }
            if (0 < this._enterframeTasks.length) {
                b = (new Date).getTime();
                for (var a = 0; a < this._enterframeTasks.length; a++)
                    if (d = this._enterframeTasks[a], null != d && void 0 != d)
                        if (0 == d.timeout) d.func.apply(d.scope, d.params);
                        else if (0 < d.timeout && b - d.time > d.timeout) d.func.apply(d.scope, d.params), d.time = b
            }
            if (0 < this._delayTasks.length) {
                b =
                    (new Date).getTime();
                for (a = 0; a < this._delayTasks.length; a++) d = this._delayTasks[a], b - d.time > d.delay && (d.func.apply(d.scope, d.params), this._delayTasks.splice(a, 1))
            }
            if (0 < this._deferTasks.length) {
                b = (new Date).getTime();
                for (a = 1E3 / this.FRAMERATE; 0 < this._deferTasks.length;)
                    if (d = this._deferTasks.shift(), (new Date).getTime() - b < a) d.func.apply(d.scope, d.params);
                    else {
                        this._deferTasks.unshift(d);
                        break
                    }
            }
            if (0 < this._batchTasks.length)
                if (b = (new Date).getTime(), d = this._batchTasks.shift(), 0 == d.timeout) d.func.apply(d.scope,
                    d.params);
                else if (0 < d.timeout)
                if (b - d.time > d.timeout) {
                    d.func.apply(d.scope, d.params);
                    d.time = b;
                    for (a = 0; a < this._batchTasks.length; a++)
                        if (d = this._batchTasks[a]) d.time = b
                } else this._batchTasks.unshift(d);
            this._highTasks = this._highTasks.concat(this._nextTasks);
            this._nextTasks = []
        };
        c.addEF = function(b, d, a, e) {
            void 0 == e && (e = 0);
            var h = this._idTable;
            this._enterframeTasks[h] = {
                scope: b,
                func: d,
                params: a,
                timeout: e,
                time: (new Date).getTime()
            };
            this._idTable++;
            return h
        };
        c.removeEF = function(b) {
            void 0 != this._enterframeTasks[b] &&
                (this._enterframeTasks[b] = null);
            return -1
        };
        c.delay = function(b, d, a, e) {
            var h = (new Date).getTime();
            this._delayTasks.push({
                scope: b,
                func: d,
                params: a,
                delay: e,
                time: h
            })
        };
        c.defer = function(b, d, a) {
            this._deferTasks.push({
                scope: b,
                func: d,
                params: a
            })
        };
        c.batch = function(b, d, a, e) {
            void 0 == e && (e = 0);
            var h = (new Date).getTime();
            this._batchTasks.push({
                scope: b,
                func: d,
                params: a,
                timeout: e,
                time: h
            })
        };
        c.removeAllBatchTasks = function() {
            this._batchTasks = []
        };
        c.next = function(b, d, a) {
            this._nextTasks.push({
                scope: b,
                func: d,
                params: a
            })
        };
        e.create =
            function() {
                var b = new e;
                b.setup();
                return b
            }
    }
})();
(function() {
    var a = breelNS.getNamespace("generic.utils");
    if (!a.Utils) {
        a.Utils = function() {};
        var c = a.Utils;
        c.destroyIfExists = function(a) {
            null !== a && void 0 !== a && a.destroy instanceof Function && a.destroy()
        };
        c.destroyArrayIfExists = function(a) {
            if (null !== a && void 0 !== a && a instanceof Array)
                for (var b = a.length, d = 0; d < b; d++) {
                    var f = a[d];
                    null !== f && void 0 !== f && f.destroy instanceof Function && f.destroy();
                    a[d] = null
                }
        };
        c.checkIfArraysMatch = function(a, b) {
            var d = a.length,
                f = !0;
            if (d != b.length) return !1;
            for (var g = 0; g < d; g++) {
                var h =
                    a[g],
                    l = b[g];
                if (c.isArray(h) && c.isArray(l)) {
                    if (!c.checkIfArraysMatch(h, l)) {
                        f = !1;
                        break
                    }
                } else if ("object" === typeof h && "object" === typeof l) {
                    if (!c.checkIfObjectsMatch(h, l)) {
                        f = !1;
                        break
                    }
                } else if (h != l) {
                    f = !1;
                    break
                }
            }
            return f
        };
        c.isArrayEmpty = function(a) {
            return 0 == a.length ? !0 : !1
        };
        c.isObjectEmpty = function(a) {
            for (var b in a)
                if (a.hasOwnProperty(b)) return !1;
            return !0
        };
        c.checkIfObjectsMatch = function(a, b) {
            var d = !0;
            if (void 0 === a || void 0 === b || c.objectSize(a) != c.objectSize(b)) return !1;
            for (var f in a) {
                var g = a[f],
                    h = b[f];
                if (c.isArray(g) && c.isArray(h)) {
                    if (!c.checkIfArraysMatch(g, h)) {
                        d = !1;
                        break
                    }
                } else if ("object" === typeof g && "object" === typeof h) {
                    if (!c.checkIfObjectsMatch(g, h)) {
                        d = !1;
                        break
                    }
                } else if (g != h) {
                    d = !1;
                    break
                }
            }
            return d
        };
        c.objectSize = function(a) {
            var b = 0,
                d;
            for (d in a) a.hasOwnProperty(d) && b++;
            return b
        };
        c.isArray = function(a) {
            return "[object Array]" === Object.prototype.toString.apply(a)
        };
        c._toCamelCase = function(a) {
            a = a.replace(/([^a-zA-Z0-9_\-])|^[_0-9]+/g, "").trim().toLowerCase();
            a = a.replace(/([ -]+)([a-zA-Z0-9])/g, function(b,
                d, a) {
                return a.toUpperCase()
            });
            return a = a.replace(/([0-9]+)([a-zA-Z])/g, function(b, d, a) {
                return d + a.toUpperCase()
            })
        };
        c.capitaliseFirstLetter = function(a) {
            return a.charAt(0).toUpperCase() + a.slice(1)
        };
        c._getURLParameter = function(a) {
            return decodeURIComponent((RegExp("[?|&]" + a + "=([^&;]+?)(&|#|;|$)").exec(location.search) || [, ""])[1].replace(/\+/g, "%20")) || null
        };
        c.setCookie = function(a, b, d, f, g, h) {
            var c = new Date,
                k = !1;
            void 0 !== d && (c.setDate(c.getDate() + d), k = !0);
            void 0 !== f && (c.setMinutes(c.getMinutes() + f), k = !0);
            b = escape(b) + (!1 == k ? "" : "; expires=" + c.toUTCString()) + (void 0 == g ? "" : "; domain=" + g) + (void 0 == h ? "" : "; path=" + h);
            document.cookie = a + "=" + b
        };
        c.getCookie = function(a) {
            var b = document.cookie,
                d = b.indexOf(" " + a + "="); - 1 == d && (d = b.indexOf(a + "="));
            if (-1 == d) b = null;
            else {
                d = b.indexOf("=", d) + 1;
                a = b.indexOf(";", d);
                if (-1 == a) a = b.length;
                b = unescape(b.substring(d, a))
            }
            return b
        };
        c.delete_cookie = function(a, b, d) {
            console.log("delete_cookie :: aDomain : ", b);
            document.cookie = a + "=; expires=Thu, 01 Jan 1970 00:00:01 GMT;" + (void 0 == b ? "" :
                "domain=" + b + ";") + (void 0 == d ? "" : " path=" + d)
        }
    }
})();
(function() {
    var a = breelNS.getNamespace("generic.utils");
    if (!a.FormValidation) {
        var c = function() {};
        a.FormValidation = c;
        c.formElementHasEmailNotDefault = function(a, b) {
            return c.formElementHasStringValueNotDefault(a, b) ? !1 == /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,6})$/.test(a.value) ? !1 : !0 : !1
        };
        c.formElementHasStringValueNotDefault = function(a, b) {
            if (!a) return !1;
            var d;
            return (d = a.value ? a.value : a.innerHTML) && "" != d && d != b ? !0 : !1
        };
        c.checkIfRadioButtonIsChecked = function(a) {
            return !a ? !1 : a.checked
        }
    }
})();
(function() {
    var a = breelNS.getNamespace("generic.utils");
    if (void 0 === a.NumberFunctions) {
        var c = function() {};
        a.NumberFunctions = c;
        c.getPaddedNumber = function(a, b) {
            for (var d = a.toString(), f = d.length; f < b; f++) d = "0" + d;
            return d
        }
    }
})();
(function() {
    var a = breelNS.getNamespace("generic.utils");
    if (!a.LevenshteinDistance) {
        var c = function() {};
        a.LevenshteinDistance = c;
        c.prototype.compareStrings = function(a, b) {
            var a = a.toLowerCase(),
                b = b.toLowerCase(),
                d = a.length,
                f = b.length,
                g = [],
                h, c;
            if (!d) return f;
            if (!f) return d;
            for (h = 0; h <= d; h++) g[h] = [h];
            for (c = 0; c <= f; c++) g[0][c] = c;
            for (c = 1; c <= f; c++)
                for (h = 1; h <= d; h++) g[h][c] = a[h - 1] == b[c - 1] ? g[h - 1][c - 1] : Math.min(g[h - 1][c], g[h][c - 1], g[h - 1][c - 1]) + 1;
            return g[d][f]
        }
    }
})();
(function() {
    var a = breelNS.getNamespace("generic.utils").NumberFunctions,
        c = breelNS.getNamespace("generic.utils");
    if (void 0 === c.ColorBlender) {
        var e = function() {};
        c.ColorBlender = e;
        e.getBlendedHexColor = function(b, d, e) {
            var g = parseInt(d.substring(1, 3), 16),
                h = parseInt(d.substring(3, 5), 16),
                d = parseInt(d.substring(5, 7), 16),
                c = parseInt(e.substring(1, 3), 16),
                k = parseInt(e.substring(3, 5), 16),
                e = parseInt(e.substring(5, 7), 16),
                g = "#" + a.getPaddedNumber(Math.round((1 - b) * g + b * c).toString(16), 2),
                g = g + a.getPaddedNumber(Math.round((1 -
                    b) * h + b * k).toString(16), 2);
            return g += a.getPaddedNumber(Math.round((1 - b) * d + b * e).toString(16), 2)
        };
        e.getBlendedRGBColor = function(b, d, a) {
            try {
                return e.Color(Math.floor(b.r + (d.r - b.r) * a), Math.floor(b.g + (d.g - b.g) * a), Math.floor(b.b + (d.b - b.b) * a))
            } catch (g) {}
        };
        e.Color = function(b, d, a) {
            var e = {
                r: void 0,
                g: void 0,
                b: void 0,
                hexvalue: void 0
            };
            void 0 === d ? (e.hexValue = b, e.r = e.hexValue >> 16 & 255, e.g = e.hexValue >> 8 & 255, e.b = e.hexValue & 255) : (e.r = b, e.g = d, e.b = a, e.hexValue = e.r << 16 | e.g << 8 | e.b);
            return e
        }
    }
})();
(function() {
    var a = breelNS.getNamespace("generic.utils");
    if (!a.MultipleCallLock) {
        var c = function() {
            this.locked = !1;
            this.lockIds = []
        };
        a.MultipleCallLock = c;
        a = c.prototype;
        a.lock = function(a) {
            -1 !== this.lockIds.indexOf(a) ? console.log("MultipleCallLock :: lock :: ERROR : lock id " + a + " has already been added") : (this.locked = !0, this.lockIds.push(a), console.log("added lock id : ", a, " new lock length ", this.lockIds.length))
        };
        a.unlock = function(a) {
            var b = this.lockIds.indexOf(a);
            if (-1 === b) console.log("MultipleCallLock :: unlock :: ERROR : lock id " +
                a + " does not exist");
            else if (this.lockIds.splice(b, 1), console.log("remove lock id : ", a, " new lock length ", this.lockIds.length), 0 == this.lockIds.length) this.locked = !1
        };
        c.create = function() {
            return new c
        }
    }
})();
breelNS.defineClass("generic.utils.StringFormat", null, function(a, c, e) {
    e.removeStartAndEndWhiteSpace = function(b) {
        " " === b.charAt(0) && (b = b.substring(1, b.length));
        " " === b.charAt(b.length - 1) && (b = b.substring(0, b.length - 1));
        return b
    };
    e.removeAllWhiteSpace = function(b) {
        b = b.replace(/\s+/g, " ");
        " " === b.charAt(0) && (b = b.substring(1, b.length));
        " " === b.charAt(b.length - 1) && (b = b.substring(0, b.length - 1));
        return b
    };
    e.removeMultipleWhiteSpaces = function(b) {
        return b = b.replace(/\s{2,}/g, " ")
    }
});
breelNS.defineClass("generic.utils.ProfanityCheck", null, function(a) {
    var c = breelNS.getNamespace("generic.events").ListenerFunctions;
    a.setup = function(a) {
        this.profanityList = void 0;
        this.isLoaded = !1;
        this._loader = new XMLHttpRequest;
        this._loader.open("GET", a, !0);
        this._loader.onreadystatechange = c.createListenerFunction(this, this._onReadyStateChange);
        this._loader.send(null)
    };
    a._onReadyStateChange = function() {
        switch (this._loader.readyState) {
            case 4:
                if (400 > this._loader.status) this._data = this._loader.responseText,
                    this.onProfanityLoaded(this._data)
        }
    };
    a.onProfanityLoaded = function(a) {
        this.isLoaded = !0;
        this.profanityList = a.split(",")
    };
    a.checkForProfanity = function(a) {
        for (var b = this.profanityList, d = b.length, f = 0; f < d; f++) {
            var g = b[f];
            if (!("" == g || " " == g) && RegExp("\\b" + g.toLowerCase() + "\\b").test(a.toLowerCase())) return !0
        }
        return !1
    }
});
(function() {
    var a = breelNS.getNamespace("generic.htmldom");
    if (!a.DomElementCreator) {
        var c = function() {};
        a.DomElementCreator = c;
        c.createChild = function(a, b, d, f) {
            b = a.ownerDocument.createElement(b);
            if (void 0 !== d) b.id = d;
            if (void 0 !== f) b.className = f;
            a.appendChild(b);
            return b
        };
        c.createEl = function(a, b) {
            var d = document.createElement(a);
            if (void 0 !== b) d.id = b;
            return d
        };
        c.createAttribute = function(a, b, d) {
            b = a.ownerDocument.createAttribute(b);
            b.nodeValue = d;
            a.setAttributeNode(b);
            return a
        };
        c.createText = function(a, b) {
            var d =
                a.ownerDocument.createTextNode(b);
            a.appendChild(d);
            return d
        };
        c.createSvg = function(a) {
            var b = a.createElementNS("http://www.w3.org/2000/svg", "svg"),
                a = a.createElementNS("http://www.w3.org/2000/svg", "defs");
            b.appendChild(a);
            return b
        };
        c.createSvgElement = function(a, b) {
            var d = a.ownerDocument.createElementNS("http://www.w3.org/2000/svg", b);
            a.appendChild(d);
            return d
        };
        c.createSvgAttribute = function(a, b, d) {
            b = this.ownerDocument.createAttributeNS("http://www.w3.org/2000/svg", b);
            b.nodeValue = d;
            a.setAttributeNode(b);
            return a
        }
    }
})();
(function() {
    var a = breelNS.getNamespace("generic.htmldom");
    if (!a.ElementUtils) {
        var c = function() {};
        a.ElementUtils = c;
        c.addClass = function(b, a) {
            if (void 0 != b) return c.hasClass(b, a) || (b.className += (b.className ? " " : "") + a), b
        };
        c.hasClass = function(b, a) {
            try {
                return RegExp("(\\s|^)" + a + "(\\s|$)").test(b.className)
            } catch (d) {
                console.error("ElementUtils.hasClass :: error : ", d)
            }
            return !1
        };
        c.removeClass = function(b, a, d) {
            if (0 < parseFloat(d)) a = ListenerFunctions.createListenerFunctionWithArguments(this, this.removeClass, [b,
                a
            ]), setTimeout(a, d);
            else if (c.hasClass(b, a)) b.className = b.className.replace(RegExp("(\\s|^)" + a + "(\\s|$)"), " ").replace(/^\s+|\s+$/g, "");
            return b
        };
        c.toggleClass = function(b, a) {
            c.hasClass(b, a) ? c.removeClass(b, a) : c.addClass(b, a);
            return b
        };
        if (window.jQuery) {
            var a = document.createElement("div"),
                e = "function" == typeof a.querySelector;
            c._querySelector = function(b, a) {
                try {
                    return e ? b.querySelector(a) : $(b).children(a)[0]
                } catch (d) {
                    return console.error("Error when trying to select '" + a + "' from ", b), null
                }
            };
            var b = "function" ==
                typeof a.querySelectorAll;
            c._querySelectorAll = function(a, d) {
                try {
                    return b ? a.querySelectorAll(d) : $(a).children(d).get()
                } catch (e) {
                    return console.error("Error when trying to select '" + d + "' from ", a), []
                }
            }
        }
        var d = -1 != navigator.userAgent.indexOf("MSIE 6");
        c._setOpacity = function(b, a) {
            d ? (a = 100 * parseFloat(a), b.style.setProperty("filter", "alpha(opacity=" + a + ")", "")) : b.style.opacity = parseFloat(a)
        }
    }
})();
(function() {
    var a = breelNS.getNamespace("generic.htmldom");
    if (!a.PositionFunctions) {
        var c = function() {};
        a.PositionFunctions = c;
        c.getGlobalPositionForNode = function(a, b) {
            var d = a;
            b.x = 0;
            for (var f = b.y = 0; null != d && !(1E3 < f++);) {
                b.x += d.offsetLeft;
                b.y += d.offsetTop;
                d = d.offsetParent
            }
            return b
        };
        c.debugTraceGlobalPositionForNode = function(a) {
            for (var b = 0; null != a && !(1E3 < b++);) {
                console.log(a.offsetLeft, a.offsetTop, a);
                a = a.offsetParent
            }
        };
        c.getRelativePositionForNode = function(a, b, d, f) {
            b = c.getGlobalPositionForNode(b, {
                x: 0,
                y: 0
            });
            d = c.getGlobalPositionForNode(d, {
                x: 0,
                y: 0
            });
            f.x = a.x + b.x - d.x;
            f.y = a.y + b.y - d.y;
            return f
        }
    }
})();
(function() {
    var a = breelNS.getNamespace("generic.svg");
    if (!a.SvgFactory) {
        var c = function() {};
        a.SvgFactory = c;
        c.svgns = "http://www.w3.org/2000/svg";
        c.createSvg = function(a, b, d) {
            var f = document.createElementNS(c.svgns, "svg");
            void 0 !== a && f.setAttributeNS(null, "id", a);
            void 0 !== b && f.setAttributeNS(null, "width", b);
            void 0 !== d && f.setAttributeNS(null, "height", d);
            return f
        };
        c.createSvgElement = function(a, b) {
            var d = document.createElementNS(c.svgns, a),
                f;
            for (f in b) d.setAttributeNS(null, f, b[f]);
            return d
        };
        c.createSvgDef =
            function() {
                return document.createElementNS("http://www.w3.org/2000/svg", "def")
            };
        c.createLinerGradientTopBottom = function(a, b, d) {
            var f = document.createElementNS(c.svgns, "linearGradient");
            f.setAttributeNS(null, "id", a);
            f.setAttributeNS(null, "x1", "0%");
            f.setAttributeNS(null, "x2", "0%");
            f.setAttributeNS(null, "y1", "0%");
            f.setAttributeNS(null, "y2", "100%");
            a = document.createElementNS(c.svgns, "stop");
            a.setAttributeNS(null, "offset", "0%");
            a.setAttributeNS(null, "stop-color", b);
            f.appendChild(a);
            b = document.createElementNS(c.svgns,
                "stop");
            b.setAttributeNS(null, "offset", "0%");
            b.setAttributeNS(null, "stop-color", d);
            f.appendChild(b);
            return f
        };
        c.createSvgCircle = function(a, b, d, f, g, h) {
            var l = document.createElementNS(c.svgns, "circle");
            l.setAttribute("cx", a);
            l.setAttribute("cy", b);
            l.setAttribute("r", d);
            void 0 !== f && l.setAttributeNS(null, "fill", f);
            void 0 !== g && (l.setAttributeNS(null, "stroke", g), void 0 !== h ? l.setAttributeNS(null, "stroke-width", h) : l.setAttributeNS(null, "stroke-width", "1"));
            return l
        };
        c.createRect = function(a, b, d, f) {
            var g = document.createElementNS(c.svgns,
                "rect");
            g.setAttributeNS(null, "x", a);
            g.setAttributeNS(null, "y", b);
            g.setAttributeNS(null, "width", d);
            g.setAttributeNS(null, "height", f);
            return g
        };
        c.createLine = function(a, b, d, f, g, h, l) {
            var k = document.createElementNS(c.svgns, "line");
            k.setAttributeNS(null, "x1", a);
            k.setAttributeNS(null, "y1", b);
            k.setAttributeNS(null, "x2", d);
            k.setAttributeNS(null, "y2", f);
            void 0 !== g ? k.setAttributeNS(null, "stroke-width", g) : k.setAttributeNS(null, "stroke-width", "1");
            void 0 !== h && k.setAttributeNS(null, "stroke", h);
            void 0 !== l && k.setAttributeNS(null,
                "stroke-linecap", l);
            return k
        };
        c.fillElement = function(a, b) {
            void 0 === a || void 0 === b ? console.log("no element or fill set") : a.setAttributeNS(null, "fill", b)
        };
        c.gradientFillElement = function(a, b) {
            void 0 === a || void 0 === b ? console.log("no element or fill set") : a.setAttributeNS(null, "fill", "url(#" + b + ")")
        }
    }
})();
(function() {
    var a = breelNS.getNamespace("generic.canvas");
    if (!a.CanvasFactory) {
        var c = function() {};
        a.CanvasFactory = c;
        c.create = function(a, b) {
            var d = document.createElement("canvas");
            d.width = a;
            d.height = b;
            return d.getContext("2d")
        };
        c.createFromImage = function(a, b) {
            var b = b || 1,
                d = c.create(a.width * b, a.height * b);
            d.drawImage(a, 0, 0, a.width * b, a.height * b);
            return d
        };
        c.createFromImageUrl = function(a, b, d, f) {
            var f = f || 0,
                b = b || 1,
                g = new Image;
            g.id = f;
            g.onload = function() {
                var a = c.create(g.width * b, g.height * b);
                a.drawImage(g, 0, 0,
                    g.width * b, g.height * b);
                a.canvas.id = f;
                d(a)
            }.bind(this);
            g.src = a
        };
        c.clone = function(a, b) {
            var b = b || 1,
                d = c.create(a.width * b, a.height * b);
            d.drawImage(a, 0, 0, a.width * b, a.height * b);
            return d
        };
        c.mask = function(a, b, d) {
            d = d || "destination-atop";
            a = a.getContext("2d");
            a.save();
            a.globalCompositeOperation = d;
            a.drawImage(b, 0, 0);
            a.restore()
        };
        c.crop = function(a, b, d) {
            var d = d || b,
                f = c.clone(a);
            a.width = d.width;
            a.height = d.height;
            a.getContext("2d").drawImage(f.canvas, b.x, b.y, b.width, b.height, 0, 0, d.width, d.height)
        }
    }
})();
(function() {
    var a = breelNS.getNamespace("generic.math").SimpleTrig,
        c = breelNS.getNamespace("generic.canvas");
    if (!c.Drawing) {
        var e = function() {};
        c.Drawing = e;
        e.drawLinesEllipse = function(b, a, e, g, h, c, k, m, n, o) {
            var h = 0.5 * h,
                g = 0.5 * g,
                p = 1.5 * Math.PI;
            if (null != n || void 0 != n) b.lineWidth = n;
            if (null != o || void 0 != o) b.strokeStyle = o;
            b.beginPath();
            for (n = 0 * Math.PI; n < 2 * c * Math.PI; n += 0.01) {
                var o = a - g * Math.sin(n) * Math.sin(p) + h * Math.cos(n) * Math.cos(p),
                    q = e + h * Math.cos(n) * Math.sin(p) + g * Math.sin(n) * Math.cos(p);
                0 == n ? b.moveTo(o, q) : b.lineTo(o,
                    q)
            }
            m && b.stroke();
            k && b.fill()
        };
        e.drawBezierEllipse = function(b, a, e, g, h, c, k) {
            var a = a - g / 2,
                e = e - h / 2,
                m = 0.5522848 * (g / 2),
                n = 0.5522848 * (h / 2),
                o = a + g,
                p = e + h,
                g = a + g / 2,
                h = e + h / 2;
            b.beginPath();
            b.moveTo(a, h);
            b.bezierCurveTo(a, h - n, g - m, e, g, e);
            b.bezierCurveTo(g + m, e, o, h - n, o, h);
            b.bezierCurveTo(o, h + n, g + m, p, g, p);
            b.bezierCurveTo(g - m, p, a, h + n, a, h);
            b.closePath();
            k && b.stroke();
            c && b.fill()
        };
        e.drawDottedEllipse = function(b, d, f, g, h, c, k) {
            h /= g;
            f = a.getPointsOnACircle(g / 2, {
                x: d,
                y: f
            }, k);
            g = 0;
            for (k = f.length; g < k; ++g) d = f[g], d.y *= h;
            g = 0;
            for (k = f.length; g <
                k; ++g) d = f[g], b.beginPath(), e.drawCircle(b, d.x, d.y, c), b.fill()
        };
        e.drawCircle = function(a, d, e, g) {
            a.arc(d, e, g, 0, 2 * Math.PI, !0)
        };
        CanvasRenderingContext2D.prototype.dashedLineFromTo = function(a, d, e, g, h) {
            var c = !0,
                k = 0,
                e = e - a + 1.0E-8,
                m = g - d,
                g = m / e,
                e = Math.sqrt(e * e + m * m),
                n;
            for (this.moveTo(a, d); 0.1 <= e;) 0 === k ? m = h : (m = k, k = 0, c = !c), h > e && (h = e), n = Math.sqrt(m * m / (1 + g * g)), a += n, d += g * n, this[c ? "lineTo" : "moveTo"](a, d), e -= m, c = !c
        }
    }
})();
(function() {
    var a = breelNS.getNamespace("generic.events").ListenerFunctions,
        c = breelNS.getNamespace("generic.animation");
    if (!c.AnimationManager) {
        var e = function() {
            this._init()
        };
        c.AnimationManager = e;
        c = e.prototype;
        c._init = function() {
            this._onRequestAnimationFrameBound = null;
            this.currentCSSTransitionEvtCompareStr = this.currentTransitionStr = this.currentCSSTransformEvtCompareStr = this.currentTransformStr = void 0;
            return this
        };
        c.setup = function() {
            this._onRequestAnimationFrameBound = a.createListenerFunction(this, this._onRequestAnimationFrame);
            requestAnimFrame(this._onRequestAnimationFrameBound);
            this.currentTransformStr = this.getSupportedTransfromStr();
            this.currentCSSTransformEvtCompareStr = this.getSupportedCSSTransformEventCompareStr();
            this.currentTransitionStr = this.getSupportedTransitionStr();
            this.currentCSSTransitionEvtCompareStr = this.getSupportedCSSTransitionEventCompareStr()
        };
        c._onRequestAnimationFrame = function() {
            TWEEN.update();
            requestAnimFrame(this._onRequestAnimationFrameBound)
        };
        c.getTranslateStr = function(a, d) {
            var e = "translate3d(" +
                a + "px," + d + "px,0px)";
            "Microsoft Internet Explorer" == browserName && 10 > fullVersion && (e = "translate(" + a + "px," + d + "px)");
            return e
        };
        c.getSupportedTransitionStr = function() {
            for (var a = "transition webkitTransition MozTransition OTransition msTransition".split(" "), d = 0; d < a.length; d++)
                if (void 0 !== document.createElement("div").style[a[d]]) return a[d]
        };
        c.getSupportedCSSTransitionEventCompareStr = function() {
            for (var a = "transition -webkit-transition -moz-transition -o-transition -ms-transform".split(" "), d = 0; d < a.length; d++)
                if (void 0 !==
                    document.createElement("div").style[a[d]]) return a[d]
        };
        c.getSupportedTransfromStr = function() {
            for (var a = "transform WebkitTransform MozTransform OTransform msTransform".split(" "), d = 0; d < a.length; d++)
                if (void 0 !== document.createElement("div").style[a[d]]) return a[d]
        };
        c.getSupportedCSSTransformEventCompareStr = function() {
            for (var a = "transform -webkit-transform -moz-transform -o-transform -ms-transform".split(" "), d = 0; d < a.length; d++)
                if (void 0 !== document.createElement("div").style[a[d]]) return a[d]
        };
        e.create =
            function() {
                var a = new e;
                a.setup();
                return a
            }
    }
})();
(function() {
    var a = breelNS.getNamespace("generic.events").ListenerFunctions,
        c = breelNS.getNamespace("generic.animation");
    if (!c.TweenDelay) {
        var e = function() {
            this._init()
        };
        c.TweenDelay = e;
        c = e.prototype;
        c._init = function() {
            this._delayedTweens = [];
            this._tween = null;
            this._updateCallback = a.createListenerFunction(this, this.update);
            this._updateTween = (new TWEEN.Tween({
                update: 0
            })).onUpdate(this._updateCallback)
        };
        c.setup = function(a) {
            this._tween = a
        };
        c.animateTo = function(a, d, e, g) {
            if (0 == g) this.clearAllDelays(), this._tween.to(a,
                1E3 * d).easing(e).start();
            else {
                var h = 0.0010 * Date.now() + g;
                this.clearAllDelaysFrom(h);
                this._delayedTweens.push({
                    startTime: h,
                    to: a,
                    time: d,
                    easingFunction: e
                });
                this._updateTween.to({
                    update: 1
                }, 1E3 * g + 100).start()
            }
            return this
        };
        c.clearAllDelays = function() {
            this._delayedTweens.splice(0, this._delayedTweens.length)
        };
        c.clearAllDelaysFrom = function(a) {
            for (var d = this._delayedTweens, e = d.length, g = 0; g < e; g++)
                if (d[g].startTime > a) {
                    this._delayedTweens.splice(g, this._delayedTweens.length);
                    break
                }
        };
        c.update = function() {
            var a = 0.0010 *
                Date.now();
            if (null !== this._delayedTweens)
                for (var d = this._delayedTweens; 0 < d.length;) {
                    var e = d[0];
                    if (e.startTime > a) break;
                    this._tween.to(e.to, 1E3 * Math.max(0, e.time - (a - e.startTime))).easing(e.easingFunction).start();
                    d.shift()
                }
        };
        c.destroy = function() {
            this._updateCallback = this._delayedTweens = null;
            if (null !== this._updateTween) this._updateTween.stop(), this._updateTween = null;
            if (null !== this._tween) this._tween.stop(), this._tween = null
        };
        e.create = function(a) {
            var d = new e;
            d.setup(a);
            return d
        };
        e.createOnObject = function(a,
            d) {
            var f = (new TWEEN.Tween(a)).onUpdate(d),
                g = new e;
            g.setup(f);
            return g
        }
    }
})();
(function() {
    var a = breelNS.getNamespace("generic.animation").TweenDelay,
        c = breelNS.getNamespace("generic.events").ListenerFunctions,
        e = breelNS.getNamespace("generic.utils").Utils,
        b = breelNS.getNamespace("generic.animation");
    if (!b.DomElementOpacityTween) {
        var d = function() {
            this._init()
        };
        b.DomElementOpacityTween = d;
        b = d.prototype;
        b._init = function() {
            this._element = null;
            this._opacity = 1;
            this._updateCallback = c.createListenerFunction(this, this._update);
            this._tween = new TWEEN.Tween(this);
            this._tween.onUpdate(this._updateCallback);
            this._tween.onComplete();
            this._tweenDelay = a.create(this._tween)
        };
        b.setElement = function(a) {
            this._element = a;
            return this
        };
        b.getElemet = function() {
            return this._element
        };
        b.setCallback = function(a) {
            this._tween.onComplete(function() {
                if (0.9 < this._opacity) this._opacity = 1;
                this.update();
                void 0 !== a && a()
            })
        };
        b.getOpacity = function() {
            return this._x
        };
        b.setStartOpacity = function(a) {
            this._opacity = a;
            return this
        };
        b.animateTo = function(a, b, d, e) {
            this._tweenDelay.animateTo({
                _opacity: a
            }, b, d, e);
            return this
        };
        b.update = function() {
            this._update()
        };
        b._update = function() {
            if (null !== this._element) try {
                this._element.style.setProperty("opacity", this._opacity, "")
            } catch (a) {
                this._element.style.opacity = this._opacity
            }
        };
        b.destroy = function() {
            this._tween = this._updateCallback = this._element = null;
            e.destroyIfExists(this._tweenDelay);
            this._tweenDelay = null
        };
        d.create = function(a, b) {
            var e = new d;
            e.setElement(a);
            e.setStartOpacity(b);
            return e
        };
        d.createWithAnimation = function(a, b, e, c, k, m, n) {
            var o = new d;
            o.setElement(a);
            o.setCallback(n);
            o.setStartOpacity(b);
            o.animateTo(e,
                c, k, m);
            return o
        }
    }
})();
(function() {
    var a = breelNS.getNamespace("generic.animation").TweenDelay,
        c = breelNS.getNamespace("generic.events").ListenerFunctions,
        e = breelNS.getNamespace("generic.utils").Utils,
        b = breelNS.getNamespace("generic.animation");
    if (!b.DomElementPositionTween) {
        var d = function() {
            this._init()
        };
        b.DomElementPositionTween = d;
        b = d.prototype;
        b._init = function() {
            this._element = null;
            this._y = this._x = 0;
            this._updateCallback = c.createListenerFunction(this, this._update);
            this._tween = new TWEEN.Tween(this);
            this._tween.onUpdate(this._updateCallback);
            this._tweenDelay = a.create(this._tween)
        };
        b.setElement = function(a) {
            this._element = a;
            return this
        };
        b.getElemet = function() {
            return this._element
        };
        b.setCallback = function(a) {
            this._tween.onComplete(a)
        };
        b.getXPosition = function() {
            return this._x
        };
        b.getYPosition = function() {
            return this._y
        };
        b.setStartPosition = function(a, b, d) {
            this._x = a;
            this._y = b;
            d && this._update();
            return this
        };
        b.animateTo = function(a, b, d, e, c) {
            this._tweenDelay.animateTo({
                _x: a,
                _y: b
            }, d, e, c);
            return this
        };
        b.update = function() {
            this._update()
        };
        b._update = function() {
            var a =
                "translate(" + this._x + "px, " + this._y + "px)";
            if (null !== this._element) Modernizr.cssanimations ? (this._element.style.setProperty("-khtml-transform", a, ""), this._element.style.setProperty("-moz-transform", a, ""), this._element.style.setProperty("-ms-transform", a, ""), this._element.style.setProperty("-webkit-transform", a, ""), this._element.style.setProperty("-o-transform", a, ""), this._element.style.setProperty("transform", a, "")) : (this._element.style.top = this._y + "px", this._element.style.left = this._x + "px")
        };
        b.destroy =
            function() {
                this._tween = this._updateCallback = this._element = null;
                e.destroyIfExists(this._tweenDelay);
                this._tweenDelay = null
            };
        d.create = function(a, b, e) {
            var c = new d;
            c.setElement(a);
            c.setStartPosition(b, e);
            return c
        };
        d.createWithAnimation = function(a, b, e, c, k, m, n, o, p, q) {
            var r = new d;
            r.setElement(a);
            "function" == typeof p && r.setCallback(p);
            r.setStartPosition(b, e, q);
            r.animateTo(c, k, m, n, o);
            return r
        }
    }
})();
(function() {
    var a = breelNS.getNamespace("generic.animation").TweenDelay,
        c = breelNS.getNamespace("generic.events").ListenerFunctions,
        e = breelNS.getNamespace("generic.utils").Utils,
        b = breelNS.getNamespace("generic.animation");
    if (!b.DomElementScaleTween) {
        var d = function() {
            this._init()
        };
        b.DomElementScaleTween = d;
        b = d.prototype;
        b._init = function() {
            this._element = null;
            this._verticalScale = this._horizontalScale = 1;
            this._updateCallback = c.createListenerFunction(this, this._update);
            this._tween = new TWEEN.Tween(this);
            this._tween.onUpdate(this._updateCallback);
            this._tweenDelay = a.create(this._tween)
        };
        b.setElement = function(a) {
            this._element = a;
            return this
        };
        b.getElemet = function() {
            return this._element
        };
        b.setCallback = function(a) {
            this._tween.onComplete(a)
        };
        b.getHorizontalScale = function() {
            return this._horizontalScale
        };
        b.getVerticalScale = function() {
            return this._verticalScale
        };
        b.setStartScale = function(a, b) {
            this._horizontalScale = a;
            this._verticalScale = b;
            return this
        };
        b.animateTo = function(a, b, d, e, c) {
            this._tweenDelay.animateTo({
                    _horizontalScale: a,
                    _verticalScale: b
                }, d, e,
                c);
            return this
        };
        b.getTransform = function() {
            return "scale(" + this._horizontalScale + ", " + this._verticalScale + ")"
        };
        b.update = function() {
            this._update()
        };
        b._update = function() {
            var a = this.getTransform();
            null !== this._element && (this._element.style.setProperty("-khtml-transform", a, ""), this._element.style.setProperty("-moz-transform", a, ""), this._element.style.setProperty("-ms-transform", a, ""), this._element.style.setProperty("-webkit-transform", a, ""), this._element.style.setProperty("-o-transform", a, ""), this._element.style.setProperty("transform",
                a, ""))
        };
        b.destroy = function() {
            this._updateCallback = this._element = null;
            null !== this._tween && this._tween.stop();
            this._tween = null;
            e.destroyIfExists(this._tweenDelay);
            this._tweenDelay = null
        };
        d.create = function(a, b, e) {
            var c = new d;
            c.setElement(a);
            c.setStartScale(b, e);
            return c
        };
        d.createWithAnimation = function(a, b, e, c, k, m, n, o, p) {
            var q = new d;
            q.setElement(a);
            "function" == typeof p && newDomElementOpacityTween.setCallback(p);
            q.setStartScale(b, e);
            q.animateTo(c, k, m, n, o);
            return q
        }
    }
})();
(function() {
    var a = breelNS.getNamespace("generic.animation");
    if (!a.TweenHelper) {
        var c = function() {};
        a.TweenHelper = c;
        c.linear = TWEEN.Easing.Linear;
        c.quad = TWEEN.Easing.Quadratic;
        c.cubic = TWEEN.Easing.Cubic;
        c.quart = TWEEN.Easing.Quartic;
        c.quint = TWEEN.Easing.Quintic;
        c.sin = TWEEN.Easing.Sinusoidal;
        c.expo = TWEEN.Easing.Exponential;
        c.circ = TWEEN.Easing.Circular;
        c.elastic = TWEEN.Easing.Elastic;
        c.back = TWEEN.Easing.Back;
        c.bounce = TWEEN.Easing.Bounce;
        c.to = function(a, b, d, c, g) {
            g = g || this.linear.EaseNone;
            return (new TWEEN.Tween(a)).to(c,
                1E3 * b).easing(g).delay(1E3 * d)
        };
        c.createGroup = function(e, b) {
            return new a.TweenGroup(this, e, b)
        }
    }
})();
(function() {
    var a = breelNS.getNamespace("generic.animation");
    if (!a.EaseFunctions) {
        var c = function() {};
        a.EaseFunctions = c;
        c.easeInQuart = function(a) {
            return a * a * a * a
        };
        c.easeOutQuart = function(a) {
            return 1 - --a * a * a * a
        };
        c.easeInCubic = function(a) {
            return a * a * a
        };
        c.easeOutCubic = function(a) {
            return --a * a * a + 1
        };
        c.easeInQuad = function(a) {
            return a * a
        };
        c.easeOutQuad = function(a) {
            return a * (2 - a)
        }
    }
})();
(function() {
    var a = breelNS.getNamespace("generic.copy");
    if (!a.XmlNodeTypes) {
        var c = function() {
            this._element = null
        };
        a.XmlNodeTypes = c;
        c.ELEMENT_NODE = 1;
        c.ATTRIBUTE_NODE = 2;
        c.TEXT_NODE = 3;
        c.CDATA_SECTION_NODE = 4;
        c.ENTITY_REFERENCE_NODE = 5;
        c.ENTITY_NODE = 6;
        c.PROCESSING_INSTRUCTION_NODE = 7;
        c.COMMENT_NODE = 8;
        c.DOCUMENT_NODE = 9;
        c.DOCUMENT_TYPE_NODE = 10;
        c.DOCUMENT_FRAGMENT_NODE = 11;
        c.NOTATION_NODE = 12
    }
})();
(function() {
    var a = breelNS.getNamespace("generic.copy");
    if (!a.XmlChildRetreiver) {
        var c = function() {};
        a.XmlChildRetreiver = c;
        a = c.prototype;
        a.getFirstChild = function(a) {
            if (null == a) throw Error("getFirstChild :: no XML found");
            for (var a = a.childNodes, b = a.length, d = 0; d < b; d++) {
                var c = a[d];
                if (c.nodeType == breelNS.generic.copy.XmlNodeTypes.ELEMENT_NODE) return c
            }
        };
        a.getChild = function(a, b) {
            if (null == a) throw Error("getChild :: no XML found");
            for (var d = [], c = a.childNodes, g = c.length, h = 0; h < g; h++) {
                var l = c[h];
                l.nodeName ==
                    b && d.push(l)
            }
            if (0 == d.length) throw Error("getChild ::: no results found in XML");
            return d[0]
        };
        a.getChilds = function(a, b) {
            var b = "*",
                d = [];
            if (null == a) throw Error(" getChilds :: no XML found");
            for (var c = a.childNodes, g = c.length, h = 0; h < g; h++) {
                var l = c[h];
                l.nodeType == breelNS.generic.copy.XmlNodeTypes.ELEMENT_NODE && ("*" == b || l.nodeName == b) && d.push(l)
            }
            if (0 == d.length) throw Error(" getChilds ::: no XML found");
            return d
        };
        a.getChildByAttribute = function(a, b, d, c) {
            c = "*";
            if (null == a) throw Error("getChildByAttribute :: no XML found");
            var g = [],
                a = a.childNodes;
            if (null == a) throw Error("getChildByAttribute ::: no XML found", a);
            for (var h = a.length, l = 0; l < h; l++) {
                var k = a[l];
                k.nodeType == breelNS.generic.copy.XmlNodeTypes.ELEMENT_NODE && ("*" == c || k.nodeName == c) && this.getAttribute(k, b) == d && g.push(k)
            }
            if (0 == g.length) throw console.log(b, d, c), Error("getChildByAttribute :::: no XML found ^ ");
            return g[0]
        };
        a.getNodeValue = function(a) {
            if (null == a) throw Error("getNodeValue :: no XML found");
            return a.nodeType == breelNS.generic.copy.XmlNodeTypes.TEXT_NODE ||
                a.nodeType == breelNS.generic.copy.XmlNodeTypes.CDATA_SECTION_NODE ? "" + a.nodeValue : a.nodeType == breelNS.generic.copy.XmlNodeTypes.ELEMENT_NODE ? "" + a.firstChild.nodeValue : null
        };
        a.getAttribute = function(a, b) {
            if (null == a) throw Error("getAttribute :: no XML found");
            if (a.nodeType != breelNS.generic.copy.XmlNodeTypes.ELEMENT_NODE) throw Error("getNodeValue :: no XML match");
            if (a.hasAttribute) return !a.hasAttribute(b) ? null : a.getAttribute(b);
            for (var d = attributesArray.length, c = 0; c < d; c++)
                if (attributesArray[c].name == b) return currentAtrribute.value;
            return null
        };
        a.hasSimpleContent = function(a) {
            return null == a ? !1 : 1 == a.childNodes.length && (a.firstChild.nodeType == breelNS.generic.copy.XmlNodeTypes.TEXT_NODE || a.firstChild.nodeType == breelNS.generic.copy.XmlNodeTypes.CDATA_SECTION_NODE) ? !0 : !1
        }
    }
})();
(function() {
    var a = breelNS.getNamespace("generic.copy");
    if (!a.XmlCreator) {
        var c = function() {};
        a.XmlCreator = c;
        a = c.prototype;
        a.createXmlLoader = function() {
            return window.XMLHttpRequest ? new XMLHttpRequest : new ActiveXObject("Microsoft.XMLHTTP")
        };
        a.loadXmlFile = function(a) {
            var b = this.createXmlLoader(),
                d = null;
            try {
                b.open("GET", a, !1), b.send(), d = this.createXmlFromString(b.responseText)
            } catch (c) {
                return null
            }
            return d
        };
        a.loadXmlFileWithPost = function() {
            var a = this.createXmlLoader(),
                b = null;
            try {
                a.open("POST", aPath, !1),
                    a.setRequestHeader("Content-type", "application/x-www-form-urlencoded"), a.setRequestHeader("Content-length", aParameters.length), a.setRequestHeader("Connection", "close"), a.send(aParameters), b = this.createXmlFromString(a.responseText)
            } catch (d) {
                return null
            }
            return b
        };
        a.createEmptyXml = function() {
            var a;
            window.DOMParser ? a = (new DOMParser).parseFromString("<temp />", "text/xml") : (a = new ActiveXObject("Microsoft.XMLDOM"), a.async = "false", a.loadXML("<temp />"));
            a.removeChild(a.firstChild);
            return a
        };
        a.createXmlFromString =
            function(a) {
                var b;
                window.DOMParser ? b = (new DOMParser).parseFromString(a, "text/xml") : (b = new ActiveXObject("Microsoft.XMLDOM"), b.async = "false", b.loadXML(a));
                return b
            };
        a.createStringFromXml = function(a) {
            if (window.XMLSerializer) return (new XMLSerializer).serializeToString(a)
        }
    }
})();
(function() {
    var a = breelNS.getNamespace("generic.copy");
    if (!a.XmlModifier) {
        var c = function() {};
        a.XmlModifier = c;
        a = c.prototype;
        a.getOwnerDocument = function(a) {
            return a.nodeType == breelNS.generic.copy.XmlNodeTypes.DOCUMENT_NODE ? a : a.ownerDocument
        };
        a.createChild = function(a, b) {
            var d = this.getOwnerDocument(a).createElement(b);
            a.appendChild(d);
            return d
        };
        a.createAttribute = function(a, b, d) {
            b = this.getOwnerDocument(a).createAttribute(b);
            b.nodeValue = d;
            a.setAttribute(b);
            return a
        };
        a.createText = function(a, b, d) {
            b = d ? this.getOwnerDocument(a).createCDATASection(b) :
                this.getOwnerDocument(a).createTextNode(b);
            a.appendChild(b);
            return a
        }
    }
})();
(function() {
    var a = breelNS.getNamespace("generic.copy"),
        c = breelNS.getNamespace("generic.copy").XmlChildRetreiver;
    if (!a.ExportedXmlCopyDocument) {
        var e = function() {};
        a.ExportedXmlCopyDocument = e;
        a = e.prototype;
        a.init = function() {
            this._xml = null;
            this.xmlChildRetreiver = new c;
            return this
        };
        a.getCopy = function(a) {
            for (var d = this._xml, a = a.split("/"), e = a.length, g = 0; g < e - 1; g++) d = this.xmlChildRetreiver.getChildByAttribute(d, "name", a[g]);
            a = a[e - 1];
            if ("text" == a && this.xmlChildRetreiver.hasSimpleContent(d)) return this.xmlChildRetreiver.getNodeValue(d);
            d = this.xmlChildRetreiver.getChildByAttribute(d, "name", a);
            return null != d ? this.xmlChildRetreiver.getNodeValue(d) : null
        };
        a.hasCopy = function() {
            for (var a = this._xml, d = aPath.split("/"), e = d.length, g = 0; g < e - 1; g++) a = this.xmlChildRetreiver.getChildByAttribute(a, "name", d[g]);
            d = d[e - 1];
            if ("text" == d && this.xmlChildRetreiver.hasSimpleContent(a)) return !0;
            a = this.xmlChildRetreiver.getChildByAttribute(a, "name", d);
            return null != a
        };
        a.setXml = function(a) {
            this._xml = a;
            return this
        };
        a.create = function(a) {
            var d = (new breelNS.generic.copy.ExportedXmlCopyDocument).init();
            d.setXml(a);
            return d
        }
    }
})();
(function() {
    var a = breelNS.getNamespace("generic.copy");
    if (!a.TextConverterChain) {
        var c = function() {};
        a.TextConverterChain = c;
        a = c.prototype;
        a.init = function() {
            this._convertersArray = [];
            return this
        };
        a.addConverter = function(a) {
            this._convertersArray.push(a);
            return this
        };
        a.convertText = function(a) {
            for (var b = this._convertersArray.length, d = 0; d < b; d++) a = this._convertersArray[d].convertText(a);
            return a
        };
        c.create = function() {
            return (new c).init()
        }
    }
})();
(function() {
    var a = breelNS.getNamespace("generic.copy").TextConverterChain,
        c = breelNS.getNamespace("generic.copy");
    if (!c.CopyManager) {
        var e = function() {
            this.returnErrorStringOnNull = !0;
            this._copyDocument = null;
            this._defaultTextConverterChain = a.create()
        };
        c.CopyManager = e;
        c = e.prototype;
        c.setCopyDocument = function(a) {
            console.log("Set Copy Document : ", a);
            breelNS.getNamespace(breelNS.projectName);
            this._copyDocument = a
        };
        c.getDefaultTextConverterChian = function() {
            return this._defaultTextConverterChain
        };
        c.getCopy =
            function(a) {
                if (this._copyDocument[a]) return this._copyDocument[a];
                console.warn("Copy doesn't exist : ", a);
                return ""
            };
        c.hasCopy = function(a) {
            return void 0 != this._copyDocument[a]
        }
    }
})();
(function() {
    var a = breelNS.getNamespace("generic.events").EventDispatcher,
        c = breelNS.getNamespace("generic.events").ListenerFunctions,
        e = breelNS.getNamespace("generic.loading");
    if (!e.JsonLoader) {
        var b = function() {
            this._init()
        };
        e.JsonLoader = b;
        b.LOADED = "loaded";
        b.ERROR = "error";
        a = b.prototype = new a;
        a._init = function() {
            this._callback = this._data = this._loader = this._url = null;
            return this
        };
        a.getData = function() {
            return this._data
        };
        a.setUrl = function(a) {
            this._url = a;
            return this
        };
        a.load = function(a, b, e) {
            this._loader = new XMLHttpRequest;
            this._loader.open(a || "GET", this._url, e || !0);
            this._loader.onreadystatechange = c.createListenerFunction(this, this._onReadyStateChange);
            this._loader.send(b || null);
            return this
        };
        a._onReadyStateChange = function() {
            switch (this._loader.readyState) {
                case 4:
                    if (400 > this._loader.status) {
                        try {
                            this._data = JSON.parse(this._loader.responseText)
                        } catch (a) {
                            console.error("JsonLoader :: ERROR Parsing json: " + a.message + " : ", a);
                            this.dispatchCustomEvent(b.ERROR, a);
                            break
                        }
                        this.dispatchCustomEvent(b.LOADED, this.getData())
                    } else this.dispatchCustomEvent(b.ERROR,
                        null)
            }
        };
        a.destroy = function() {
            if (null !== this._loader) this._loader = this._loader.onreadystatechange = null;
            this._data = this._url = null
        };
        b.create = function(a) {
            var e = new b;
            e.setUrl(a);
            return e
        }
    }
})();
(function() {
    var a = breelNS.getNamespace("generic.events").EventDispatcher,
        c = breelNS.getNamespace("generic.events").ListenerFunctions,
        e = breelNS.getNamespace("generic.loading");
    if (!e.XmlLoader) {
        var b = function() {
            this._init()
        };
        e.XmlLoader = b;
        b.LOADED = "loaded";
        b.ERROR = "error";
        a = b.prototype = new a;
        a._init = function() {
            this._callback = this._data = this._loader = this._url = null;
            return this
        };
        a.getData = function() {
            return this._data
        };
        a.setUrl = function(a) {
            this._url = a;
            return this
        };
        a.load = function() {
            this._loader = new XMLHttpRequest;
            this._loader.open("GET", this._url, !0);
            this._loader.onreadystatechange = c.createListenerFunction(this, this._onReadyStateChange);
            this._loader.send(null);
            return this
        };
        a._onReadyStateChange = function() {
            switch (this._loader.readyState) {
                case 4:
                    400 > this._loader.status ? (this._data = this._loader.responseXML, this.dispatchCustomEvent(b.LOADED, this._data)) : this.dispatchCustomEvent(b.ERROR, null)
            }
        };
        a.destroy = function() {
            if (null !== this._loader) this._loader = this._loader.onreadystatechange = null;
            this._data = this._url = null
        };
        b.create = function(a) {
            var e = new b;
            e.setUrl(a);
            return e
        }
    }
})();
(function() {
    var a = breelNS.getNamespace("generic.analytics");
    if (!a.AnalyticsManager) {
        var c = function() {
            this.allTrackers = this.clientTracker = this.breelTracker = void 0
        };
        a.AnalyticsManager = c;
        a = c.prototype;
        a.setup = function() {
            console.log("AnalyticsManager setup");
            this.breelTracker = ga.getByName("breel");
            this.clientTracker = ga.getByName("client");
            this.allTrackers = ga.getAll();
            this.allTrackersLength = void 0 === this.allTrackers ? 0 : this.allTrackers.length
        };
        a.gaTrackPage = function(a, b, d) {
            if (window.analyticsIsActive) {
                void 0 !==
                    b && "/" != a.charAt(0) && (b += "/" + b);
                for (var c = 0; c < this.allTrackersLength; c++) {
                    var g = this.allTrackers[c];
                    void 0 !== a && void 0 !== b && void 0 !== d ? g.send("pageview", a, b, d) : void 0 !== a && void 0 !== b ? g.send("pageview", a, b) : void 0 !== a ? g.send("pageview", a) : g.send("pageview")
                }
            }
        };
        a.gaTrackEvent = function(a, b, d, c) {
            if (window.analyticsIsActive)
                for (var g = 0; g < this.allTrackersLength; g++) {
                    var h = this.allTrackers[g];
                    void 0 !== d && void 0 !== c ? h.send("event", a, b, d, c) : void 0 !== d ? h.send("event", a, b, d) : h.send("event", a, b)
                }
        };
        a.gaTrackSocialInteraction =
            function(a, b, d, c) {
                if (window.analyticsIsActive)
                    for (var g = 0; g < this.allTrackersLength; g++) {
                        var h = this.allTrackers[g];
                        void 0 !== c ? h.send("social", a, b, d, {
                            page: "/" + c
                        }) : h.send("social", a, b, d)
                    }
            }
    }
})();
(function() {
    var a = breelNS.getNamespace("generic.analytics");
    if (!a.AdriverTracking) {
        var c = function() {
            this.container = void 0
        };
        a.AdriverTracking = c;
        a = c.prototype;
        a.setup = function(a) {
            this.container = a;
            this.ageGate = "http://ad.adriver.ru/cgi-bin/rle.cgi?sid=193778&sz=vhodnaya&bt=21&pz=0&rnd=1620516247";
            this.playVideo = "http://ad.adriver.ru/cgi-bin/rle.cgi?sid=193778&sz=1&bt=21&pz=0&rnd=1620516248";
            this.becomePartButt = "http://ad.adriver.ru/cgi-bin/rle.cgi?sid=193778&sz=2&bt=21&pz=0&rnd=1620516249";
            this.viewGalleryButt =
                "http://ad.adriver.ru/cgi-bin/rle.cgi?sid=193778&sz=3&bt=21&pz=0&rnd=1620516250";
            this.shareTwitter = "http://ad.adriver.ru/cgi-bin/rle.cgi?sid=193778&sz=4&bt=21&pz=0&rnd=1620516251";
            this.shareFacebook = "http://ad.adriver.ru/cgi-bin/rle.cgi?sid=193778&sz=5&bt=21&pz=0&rnd=1620516252";
            this.shareGoogle = "http://ad.adriver.ru/cgi-bin/rle.cgi?sid=193778&sz=6&bt=21&pz=0&rnd=1620516253";
            this.enterThroughFacebook = "http://ad.adriver.ru/cgi-bin/rle.cgi?sid=193778&sz=7&bt=21&pz=0&rnd=1620516254";
            this.enterManually =
                "http://ad.adriver.ru/cgi-bin/rle.cgi?sid=193778&sz=8&bt=21&pz=0&rnd=1620516255"
        };
        a.addTracker = function(a) {
            if (void 0 === this.container) console.log("The adriver holding container has not been created");
            else {
                var b = document.createElement("img");
                b.src = a;
                this.container.appendChild(b)
            }
        };
        a.addTrackerByName = function(a) {
            console.log("addTrackerByName : ", a);
            if (void 0 === this.container) console.log("The adriver holding container has not been created");
            else {
                var b = void 0;
                switch (a) {
                    case "ageGate":
                        b = this.ageGate;
                        break;
                    case "playVideo":
                        b = this.playVideo;
                        break;
                    case "becomePartButt":
                        b = this.becomePartButt;
                        break;
                    case "viewGalleryButt":
                        b = this.viewGalleryButt;
                        break;
                    case "shareTwitter":
                        b = this.shareTwitter;
                        break;
                    case "shareFacebook":
                        b = this.shareFacebook;
                        break;
                    case "shareGoogle":
                        b = this.shareGoogle;
                        break;
                    case "enterThroughFacebook":
                        b = this.enterThroughFacebook;
                        break;
                    case "enterManually":
                        b = this.enterManually
                }
                void 0 === b ? console.log("could not find tracking code with the name of : " + a) : (a = document.createElement("img"), a.src = b,
                    this.container.appendChild(a))
            }
        };
        c.create = function(a) {
            var b = new c;
            b.setup(a);
            return b
        }
    }
})();
(function() {
    var a = breelNS.getNamespace("generic.events").EventDispatcher;
    breelNS.getNamespace("generic.events");
    var c = breelNS.getNamespace("generic.sound");
    if (!c.SoundLogger) {
        var e = function() {
            this._messages = []
        };
        c.SoundLogger = e;
        a = e.prototype = new a;
        a.pushMessage = function() {
            for (var a = 0; a < arguments.length; a++) this._messages.push(arguments[a])
        };
        a.flush = function() {
            for (; this._messages.length;) console.log(this._messages.shift())
        };
        e.getSingleton = function() {
            return e.createSingleton()
        };
        e.createSingleton = function() {
            if (!c.singletons) c.singletons = {};
            if (!c.singletons.SoundLogger) c.singletons.SoundLogger = new e;
            return c.singletons.SoundLogger
        }
    }
})();
(function() {
    var a = breelNS.getNamespace("generic.events").EventDispatcher,
        c = breelNS.getNamespace("generic.events").ListenerFunctions,
        e = breelNS.getNamespace("generic.music");
    if (!e.Metronome) {
        var b = function() {
            this._running = !1;
            this._bpm = 120;
            this._beatsPerBar = 4;
            this._beats = this._bars = 0;
            this._loopPointBeats = -1;
            this.__totalBeats = this.__updateVariance = this.__timeDiff = this.__beatsPassed = 0;
            this._lastBeatTimeS = null;
            this.__nextUpdateInterval = this._beatInterval = 6E4 / this._bpm;
            this.__nextUpdateInterval += 1;
            this._updateBound =
                c.createListenerFunction(this, this._update)
        };
        e.Metronome = b;
        b.BAR_TICK_AUDIO = "metronomeBarTickAudio";
        b.BEAT_TICK_AUDIO = "metronomeBeatTickAudio";
        b.BAR_TICK = "metronomeBarTickNormalPriority";
        b.BEAT_TICK = "metronomeBeatTickNormalPriority";
        b.UPDATE_INTERVAL = 10;
        a = b.prototype = new a;
        a.setup = function() {
            return this
        };
        a.setBPM = function(a) {
            this._bpm = a;
            this._beatInterval = 60 / this._bpm;
            this.__nextUpdateInterval = b.UPDATE_INTERVAL;
            this.__nextUpdateInterval += 1
        };
        a.setBeatsPerBar = function(a) {
            this._beatsPerBar = a
        };
        a.getBPM =
            function() {
                return this._bpm
            };
        a.getBeatsPerBar = function() {
            return this._beatsPerBar
        };
        a.getBars = function() {
            return this._bars
        };
        a.getBeats = function() {
            return this._beats
        };
        a.setLoopBar = function(a) {
            this._loopPointBeats = a * this._beatsPerBar + 1
        };
        a.start = function() {
            this._lastBeatTimeS = (new Date).getTime() / 1E3;
            this._beats = this._bars = 0;
            this._running = !0;
            setTimeout(this._updateBound, this.__nextUpdateInterval)
        };
        a.stop = function() {
            this._running = !1
        };
        a._update = function() {
            setTimeout(this._updateBound, this.__nextUpdateInterval);
            var a = (new Date).getTime() / 1E3;
            this.__timeDiff = a - this._lastBeatTimeS;
            this.__beatsPassed = this.__timeDiff == this._beatInterval ? 1 : Math.floor(this.__timeDiff / this._beatInterval);
            if (0 < this.__beatsPassed) {
                this._beats += this.__beatsPassed;
                this.__totalBeats = this._bars * this._beatsPerBar + this._beats;
                if (this.__totalBeats == this._loopPointBeats) this._bars = this.__totalBeats = this._beats = 0;
                this.__updateVariance = this.__timeDiff % this._beatInterval;
                this._lastBeatTimeS = a - this.__updateVariance;
                if (this._beats >= this._beatsPerBar) this._bars++,
                    this._beats = 0, this.dispatchCustomEvent(b.BAR_TICK_AUDIO, {
                        bars: this._bars,
                        beats: this._beats,
                        totalBeats: this.__totalBeats,
                        timeOffset: this.__updateVariance
                    });
                this.dispatchCustomEvent(b.BEAT_TICK_AUDIO, {
                    bars: this._bars,
                    beats: this._beats,
                    totalBeats: this.__totalBeats,
                    timeOffset: this.__updateVariance
                });
                this.dispatchCustomEvent(b.BEAT_TICK, {
                    bars: this._bars,
                    beats: this._beats,
                    totalBeats: this.__totalBeats,
                    timeOffset: this.__updateVariance
                });
                this._beats >= this._beatsPerBar && this.dispatchCustomEvent(b.BAR_TICK, {
                    bars: this._bars,
                    beats: this._beats,
                    totalBeats: this.__totalBeats,
                    timeOffset: this.__updateVariance
                })
            }
        };
        a.convertDurationToBeats = function(a) {
            return Math.floor(a / this._beatInterval)
        };
        a.convertDurationToWholeBars = function(a) {
            return Math.floor(a / (this._beatInterval * this._beatsPerBar))
        };
        a.convertBeatsToDuration = function(a) {
            return this._beatInterval * a
        };
        a.convertBarsToDuration = function(a) {
            return this.convertBeatsToDuration(a * this._beatsPerBar)
        };
        a.destroy = function() {};
        b.create = function() {
            var a = new b;
            a.setup();
            return a
        }
    }
})();
(function() {
    var a = breelNS.getNamespace("generic.events").EventDispatcher,
        c = breelNS.getNamespace("generic.events").ListenerFunctions,
        e = breelNS.getNamespace("generic.music").Metronome,
        b = breelNS.getNamespace("generic.music"),
        d = breelNS.getNamespace("generic.sound").SoundLogger.getSingleton();
    if (!b.MusicalSound) {
        var f = function() {
            this._running = !1;
            this._metronome = this._soundObject = null;
            this._isLooping = !1;
            this._durationBeats = this._durationBars = 0;
            this._startingBeatNumbers = [];
            this._stoppingBeatNumbers = [];
            this._loopingBeatNumbers = [];
            this._currentBeatNumber = -1;
            this._paddingTime = this._paddingBeats = 0;
            this._bpm = 120;
            this._beatsPerBar = 4;
            this._onMetronomeBeatBound = c.createListenerFunction(this, this._onMetronomeBeat);
            this._onMetronomeBarBound = c.createListenerFunction(this, this._onMetronomeBar);
            this._soundObjectLoadedBound = c.createListenerFunction(this, this._soundObjectLoaded)
        };
        b.MusicalSound = f;
        f.BAR_TICK = "metronomeBarTick";
        f.BEAT_TICK = "metronomeBeatTick";
        a = f.prototype = new a;
        a.setup = function() {
            return this
        };
        a.setBPM = function(a) {
            this._bpm =
                a;
            this._beatInterval = 60 / this._bpm
        };
        a.setBeatsPerBar = function(a) {
            this._beatsPerBar = a
        };
        a.addStartBeatNumber = function(a) {
            d.pushMessage("MusicalSound :: adding start beat number : " + a + " to " + this._soundObject.getPath());
            this._startingBeatNumbers.push(a)
        };
        a.addStartBarNumber = function(a) {
            this.addStartBeatNumber(a * this._beatsPerBar)
        };
        a.removeStartBeatNumber = function(a) {
            for (; this._startingBeatNumbers.indexOf(a);) this._startingBeatNumbers.splice(this._startingBeatNumbers.indexOf(a))
        };
        a.addStopBeatNumber = function(a) {
            d.pushMessage("MusicalSound :: adding stop beat number : " +
                a + " to " + this._soundObject.getPath());
            this._stoppingBeatNumbers.push(a)
        };
        a.addStopBarNumber = function(a) {
            this.addStopBeatNumber(a * this._beatsPerBar)
        };
        a.removeStopBeatNumber = function(a) {
            for (; this._stoppingBeatNumbers.indexOf(a);) this._stoppingBeatNumbers.splice(this._stoppingBeatNumbers.indexOf(a))
        };
        a._removeLoopBeatNumber = function(a) {
            for (; this._loopingBeatNumbers.indexOf(a);) this._loopingBeatNumbers.splice(this._loopingBeatNumbers.indexOf(a))
        };
        a.clearAllStopStarts = function() {
            d.pushMessage("MusicalSound :: clearing all stop/starts from : " +
                this._soundObject.getPath());
            this._startingBeatNumbers = [];
            this._stoppingBeatNumbers = []
        };
        a.setLooping = function(a) {
            this._isLooping = a
        };
        a.attachToMetronome = function(a) {
            this._metronome = a;
            this._metronome.addEventListener(e.BAR_TICK_AUDIO, this._onMetronomeBarBound);
            this._metronome.addEventListener(e.BEAT_TICK_AUDIO, this._onMetronomeBeatBound);
            this.setBPM(this._metronome.getBPM());
            this.setBeatsPerBar(this._metronome.getBeatsPerBar())
        };
        a._onMetronomeBar = function() {};
        a._onMetronomeBeat = function(a) {
            this.onBeat(a.detail.totalBeats,
                a.detail.timeOffset)
        };
        a.onBeat = function(a, b) {
            this._currentBeatNumber = a;
            if (this._soundObjectLoaded)
                if (this._running) {
                    for (c = 0; c < this._loopingBeatNumbers.length; c++)
                        if (e = this._loopingBeatNumbers[c] - a, e <= this._paddingBeats) {
                            e = e * this._beatInterval - b;
                            this.start(this._loopingBeatNumbers[c], b);
                            d.pushMessage("MusicalSound : " + this._soundObject.getPath() + " cued to loop at beat : " + this._loopingBeatNumbers[c] + " at beat " + a + " with time offset " + e);
                            this._loopingBeatNumbers.splice(c, 1);
                            return
                        }
                    for (c = 0; c < this._stoppingBeatNumbers.length; c++)
                        if (e =
                            this._stoppingBeatNumbers[c] - a, 1 >= e) {
                            e = e * this._beatInterval - b;
                            this.stop(this._stoppingBeatNumbers[c], b);
                            d.pushMessage("MusicalSound : " + this._soundObject.getPath() + " cued to stop at beat : " + this._stoppingBeatNumbers[c] + " at beat " + a + " with time offset " + e);
                            this._stoppingBeatNumbers.splice(c, 1);
                            break
                        }
                } else
                    for (var e = -1, c = 0; c < this._startingBeatNumbers.length; c++) {
                        var e = this._startingBeatNumbers[c] - a;
                        if (e <= this._paddingBeats) {
                            e = e * this._beatInterval - b;
                            this.start(this._startingBeatNumbers[c], b);
                            d.pushMessage("MusicalSound : " +
                                this._soundObject.getPath() + " cued to start at beat : " + this._startingBeatNumbers[c] + " at beat " + a + " with time offset " + e);
                            this._startingBeatNumbers.splice(c, 1);
                            break
                        }
                    }
        };
        a.getDurationBars = function() {
            return this._durationBars
        };
        a.getDurationBeats = function() {
            return this._durationBeats
        };
        a.getPadding = function() {
            return this._soundObject && this._soundObjectLoaded ? this._soundObject.getPadding() : -1
        };
        a.setSoundObject = function(a) {
            this._soundObject = a;
            a = breelNS.getNamespace("generic.sound").SoundObject;
            this._soundObject._isLoaded ?
                this._soundObjectLoaded() : this._soundObject.addEventListener(a.LOADED, this._soundObjectLoadedBound);
            a = this._soundObject.getDuration();
            this._durationBeats = Math.floor(a / this._beatInterval);
            this._durationBars = this._durationBeats / this._beatsPerBar;
            this._paddingTime = this._soundObject.getPadding();
            this._paddingBeats = this._paddingTime / this._beatInterval
        };
        a.load = function() {
            if (this._soundObject) this._soundObject.load();
            else throw Error("ERROR : tried to load MusicalSound before setting sound object");
        };
        a._soundObjectLoaded =
            function() {
                this._soundObject.removeEventListener(breelNS.getNamespace("generic.sound").SoundObject.LOADED, this._soundObjectLoadedBound)
            };
        a.start = function(a, b) {
            this._running = !0;
            this._soundObject.play(this._paddingTime, this._paddingTime, b || 0);
            this._isLooping && this._loopingBeatNumbers.push(a + this._durationBeats)
        };
        a.stop = function(a, b) {
            this._loopingBeatNumbers = [];
            this._soundObject.pause(b || 0);
            this._running = !1
        };
        a.setVolume = function(a, b, d, e) {
            this._soundObject && this._soundObject.setVolume(a, b, d, e)
        };
        a.destroy =
            function() {
                this.stop(0);
                this._soundObject.destroy();
                this._metronome = this._soundObject = null
            };
        f.create = function() {
            var a = new f;
            a.setup();
            return a
        }
    }
})();
(function() {
    var a = breelNS.getNamespace("generic.events").EventDispatcher,
        c = breelNS.getNamespace("generic.events").ListenerFunctions,
        e = breelNS.getNamespace("generic.sound"),
        b = breelNS.getNamespace("generic.sound").SoundLogger.getSingleton();
    if (!e.SoundObject) {
        var d = function() {
            this._soundURL = this._soundPath = "";
            this._isPlaying = this._isLoaded = !1;
            this._duration = this._rawDuration = -1;
            this._padding = 0;
            this.isMute = !1;
            this._isMonophonic = !0;
            this._tweens = [];
            this._currentVolume = 1;
            this._currentVolumeTween = null;
            this._updateVolumeBound =
                c.createListenerFunction(this, this._updateVolume)
        };
        e.SoundObject = d;
        d.LOADED = "loaded";
        d.ERROR = "error";
        a = d.prototype = new a;
        a.setup = function(a, b) {
            this._soundPath = a;
            this._soundURL = b;
            return this
        };
        a.getPath = function() {
            return this._soundPath
        };
        a.setPadding = function(a) {
            this._padding = a
        };
        a.setIsMonophonic = function(a) {
            this._isMonophonic = a
        };
        a._setRawDuration = function(a) {
            this._rawDuration = a;
            this._duration = this._rawDuration - 2 * this._padding
        };
        a._setAudioDuration = function(a) {
            this._duration = a;
            this._rawDuration = this._duration +
                2 * this._padding
        };
        a.getDuration = function() {
            return this._duration
        };
        a.getPadding = function() {
            return this._padding
        };
        a.load = function() {};
        a._loadCompleted = function() {
            this.dispatchCustomEvent(d.LOADED, this._soundPath)
        };
        a.play = function(a, d, e) {
            if (this._isLoaded && (!this._isPlaying || !this._isMonophonic)) return b.pushMessage("SoundObject :: playing sound " + this._soundPath + " from time : " + a + " with delay : " + d + " and correction : " + e + " will start in " + (d - e)), !0;
            if (this._isPlaying && this._isMonophonic) return console.warn("SoundObject :: tried to play monophonic sound that is already playing: " +
                this._soundPath), !1;
            if (!this._isLoaded) return console.warn("SoundObject :: tried to play unloaded sound : " + this._soundPath), !1
        };
        a.pause = function(a) {
            b.pushMessage("SoundObject :: pausing sound " + this._soundPath + " with delay :" + (a || 0));
            return this._isPlaying
        };
        a.setVolume = function(a, b, d, e) {
            e = e || TWEEN.Easing.Quartic.InOut;
            b *= 1E3;
            d = 1E3 * (d || 0);
            console.log("SoundObject :: setting " + this._soundPath + " to volume " + a + " over time : " + b + " with delay : " + d);
            this._currentVolumeTween && this._currentVolumeTween.stop();
            b ? (new TWEEN.Tween(this)).to({
                _currentVolume: a
            }, b).onUpdate(this._updateVolumeBound).delay(d).easing(e).start() : (this._currentVolume = a, this._updateVolume())
        };
        a.switchMute = function(a) {
            this.isMute = a ? !0 : !1;
            this._updateVolume()
        };
        a.setPaddingFromMetadata = function(a) {
            this._padding = a || 0;
            this._setRawDuration(this._rawDuration)
        };
        a.setDurationFromMetadata = function(a) {
            this._setAudioDuration(a || 0)
        };
        a._updateVolume = function() {};
        a._playbackFinished = function() {
            b.pushMessage("SoundObject :: sound " + this._soundPath +
                " finished")
        };
        a.destroy = function() {};
        d.create = function(a, b) {
            var e = new d;
            e.setup(a, b);
            return e
        }
    }
})();
(function() {
    var a = breelNS.getNamespace("generic.events").EventDispatcher;
    breelNS.getNamespace("generic.events");
    var c = breelNS.getNamespace("generic.sound");
    if (!c.SoundLoader) {
        var e = function() {
            this._soundObject = this._queueId = this._path = this._url = null;
            this._soundObjectIsMonophonic = !0
        };
        c.SoundLoader = e;
        a = e.prototype = new a;
        e.LOADED = "soundLoaderLoaded";
        a.setup = function(a, d, e, c) {
            this._url = d;
            this._path = a;
            this._queueId = e;
            this._soundObjectIsMonophonic = !0 == c ? !0 : !1
        };
        a.load = function() {};
        a.getSoundObject = function() {
            return this._soundObject
        };
        e.create = function(a, d, c, g) {
            var h = new e;
            h.setup(a, d, c, g);
            return h
        }
    }
})();
(function() {
    var a = breelNS.getClass("generic.events.EventDispatcher");
    breelNS.getClass("generic.events.ListenerFunctions");
    var c = breelNS.getNamespace("generic.sound.flash");
    if (!c.SoundPlayerFlashLink) {
        var e = function() {};
        c.SoundPlayerFlashLink = e;
        e.FILE_LOADED = "groupLoaded";
        e.GROUP_LOADED = "fileLoaded";
        e.SOUND_ENDED_REF = "soundEndedRef";
        e.FLASH_LOADED = "flashLoaded";
        e.DEFAULT_SINGLETON_NAME = "soundPlayerFlashLink";
        var c = e.prototype = new a,
            b = a.prototype;
        c.flashLoaded = function() {
            console.log("generic.sound.flash.SoundPlayerFlashLink::flashLoaded");
            try {
                this.dispatchCustomEvent(e.FLASH_LOADED, null)
            } catch (a) {
                console.error("Error occured in flash loaded callback", a), console.log(a.message, a.fileName, a.lineNumber, a.stack)
            }
        };
        c.groupLoaded = function(a) {
            console.log("generic.sound.flash.SoundPlayerFlashLink::groupLoaded");
            console.log(a);
            try {
                this.dispatchCustomEvent(e.GROUP_LOADED, a)
            } catch (b) {
                console.error("Error occured in flash callback", b), console.log(b.message, b.fileName, b.lineNumber, b.stack)
            }
        };
        c.soundEnded = function(a) {
            console.log("generic.sound.flash.SoundPlayerFlashLink::soundEnded");
            try {
                this.dispatchCustomEvent(e.SOUND_ENDED_REF, a)
            } catch (b) {
                console.error("Error occured in flash callback", b), console.log(b.message, b.fileName, b.lineNumber, b.stack)
            }
        };
        c.fileLoaded = function(a) {
            console.log("generic.sound.flash.SoundPlayerFlashLink::fileLoaded");
            console.log(a);
            try {
                this.dispatchCustomEvent(e.FILE_LOADED, a)
            } catch (b) {
                console.error("Error occured in flash callback", b, b.stack)
            }
        };
        c.destroy = function() {
            b.destroy.call(this)
        };
        e.createSingleton = function(a) {
            var b = new e;
            return breelNS.singletons[a] =
                b
        }
    }
})();
(function() {
    breelNS.getNamespace("generic.events");
    var a = breelNS.getNamespace("generic.events").ListenerFunctions,
        c = breelNS.getClass("generic.sound.flash.SoundPlayerFlashLink"),
        e = breelNS.getNamespace("generic.sound").SoundObject,
        b = breelNS.getNamespace("generic.sound.flash");
    if (!b.FlashSoundObject) {
        var d = function() {
            this._flashLink = this._flashElement = null;
            this._flashSoundRefs = [];
            this.audioID = "";
            this._updateVolumeBound = a.createListenerFunction(this, this._updateVolume)
        };
        b.FlashSoundObject = d;
        var b = d.prototype =
            new e,
            f = e.prototype;
        b.setup = function(b, d, e) {
            f.setup.call(this, b, d);
            this._soundEndedBound = a.createListenerFunction(this, this._soundEnded);
            this._flashLink = e;
            return this
        };
        b.setFlashElement = function(a) {
            this._flashElement = a;
            this._isLoaded = !0
        };
        b.play = function(a, b, d, e) {
            d = d || 0;
            if (f.play.call(this, a || 0, b || 0, d))
                if (this._flashElement) {
                    a = -1 * d;
                    e && this._flashLink.addEventListener(c.SOUND_ENDED_REF, this._soundEndedBound);
                    try {
                        var m = this._flashElement.playAudio(this._soundURL, a)
                    } catch (n) {
                        console.error("Error occured in flash playAudio",
                            n);
                        console.log(n.message, n.fileName, n.lineNumber, n.stack);
                        return
                    }
                    this._flashSoundRefs.push(m);
                    this._updateVolume();
                    console.log("sound reference: ", this._flashSoundRefs)
                } else throw Error("ERROR: tried to play audio on FlashSoundObject before Flash player is loaded");
        };
        b._soundEnded = function(a) {
            var b = this._flashSoundRefs[this._flashSoundRefs.length - 1];
            b == a.detail && (console.log("oh new FlashSoundLoader :: ended ", a, b), this.play())
        };
        b.pause = function() {
            f.pause.call(this);
            for (var a = 0; a < this._flashSoundRefs.length; a++);
            this._isPlaying = !1
        };
        b.flashRefDidFinish = function(a) {
            for (var b = 0; b < this._flashSoundRefs.length; b++) this._flashSoundRefs[b] == a && this._flashSoundRefs.splice(b, 1)
        };
        b._updateVolume = function() {
            f._updateVolume.call(this);
            for (var a = 0; a < this._flashSoundRefs.length; a++) {
                var b = this._flashSoundRefs[a];
                try {
                    this.isMute ? this._flashElement.setVolume(b, 0) : this._flashElement.setVolume(b, this._currentVolume)
                } catch (d) {
                    console.error("Error occured in flash setVolume", d), console.log(d.message, d.fileName, d.lineNumber, d.stack)
                }
            }
        };
        b.destroy = function() {
            f.destroy.call(this)
        };
        d.create = function(a, b, e) {
            var c = new d;
            c.setup(a, b, e);
            return c
        }
    }
})();
(function() {
    breelNS.getNamespace("generic.events");
    var a = breelNS.getNamespace("generic.events").ListenerFunctions,
        c = breelNS.getNamespace("generic.sound").SoundLoader,
        e = breelNS.getNamespace("generic.sound.flash").FlashSoundObject,
        b = breelNS.getClass("generic.sound.flash.SoundPlayerFlashLink"),
        d = breelNS.getNamespace("generic.sound.flash");
    if (!d.FlashSoundLoader) {
        var f = function() {
            this._flashElement = this._flashLink = null;
            this._loadCompleteBound = a.createListenerFunction(this, this._loadComplete);
            this._flashLoadGroupName =
                null
        };
        d.FlashSoundLoader = f;
        var d = f.prototype = new c,
            g = c.prototype;
        d.setup = function(a, d, c, f) {
            g.setup.call(this, a, d, c);
            this._flashLink = f;
            this._flashLink.addEventListener(b.GROUP_LOADED, this._loadCompleteBound);
            this._soundObject = e.create(this._path, this._url, this._flashLink)
        };
        d.setFlashElement = function(a) {
            console.log("setFlashElement", a);
            this._flashElement = a;
            this._soundObject.setFlashElement(this._flashElement)
        };
        d.load = function() {
            console.log("flashsound loader", this.url);
            this._flashLoadGroupName = this._flashElement.loadFiles([this._url])
        };
        d._loadComplete = function(a) {
            a.detail == this._flashLoadGroupName && (console.log("FlashSoundLoader :: loaded " + this._path + " with Flash group name " + this._flashLoadGroupName), this._flashLink.removeEventListener(b.GROUP_LOADED, this._loadCompleteBound), this.dispatchCustomEvent(c.LOADED, this._path))
        };
        f.create = function(a, b, d, e) {
            var c = new f;
            c.setup(a, b, d, e);
            return c
        }
    }
})();
(function() {
    breelNS.getNamespace("generic.events");
    var a = breelNS.getNamespace("generic.events").ListenerFunctions,
        c = breelNS.getNamespace("generic.sound").SoundObject,
        e = breelNS.getNamespace("generic.sound.html5");
    if (!e.Html5SoundObject) {
        var b = function() {
            this._audio = null;
            this._isStartSeeking = !1;
            this._audioLoadedBound = a.createListenerFunction(this, this._loadCompleted);
            this._playbackFinishedBound = a.createListenerFunction(this, this._playbackFinished);
            this._checkStartBound = a.createListenerFunction(this,
                this._checkStart);
            this._delayedSeekBound = a.createListenerFunction(this, this._delayedSeek);
            this._delayedPauseBound = a.createListenerFunction(this, this._delayedPause);
            this._updateVolumeBound = a.createListenerFunction(this, this._updateVolume);
            this.loopBound = a.createListenerFunction(this, this._loopHandler)
        };
        e.Html5SoundObject = b;
        var e = b.prototype = new c,
            d = c.prototype;
        e.setup = function(a, b, e) {
            d.setup.call(this, a, b);
            this._audio = e;
            this._audio.addEventListener("ended", this._playbackFinishedBound);
            this._audio.addEventListener("loadeddata",
                this._audioLoadedBound);
            this._intendedStartSampleLocation = this._intendedStartTime = this._startDelay = this._startFromTime = -1;
            return this
        };
        e.load = function() {
            this._audio.preload = "auto";
            this._audio.load();
            this._isLoaded = !0
        };
        e._loadCompleted = function() {
            0 < this._audio.buffered.length && this._audio.buffered.end(0);
            d._loadCompleted.call(this)
        };
        e.play = function(b, e, c, l) {
            b = b || 0;
            e = e || 0;
            c = c || 0;
            if (d.play.call(this, b, e, c)) this._startFromTime = b, this._startDelay = e - c, this._isPlaying ? (this._intendedStartTime = (new Date).getTime() /
                1E3 + (e - c), this._intendedStartSampleLocation = this._padding + c, setTimeout(this._delayedSeekBound, 1E3 * (e - c))) : (this._audio.currentTime = 0, this._audio.play(), this._isStartSeeking = !0, this._intendedStartTime = (new Date).getTime() / 1E3 + e + this._padding, this._intendedStartSampleLocation = this._padding + e + b, l && a.addDOMListener(this._audio, "ended", this.loopBound), setTimeout(this._checkStartBound, 10)), this._isPlaying = !0
        };
        e._loopHandler = function() {
            console.log("HTML5Sound LoopHandler Called: ");
            this._audio && this._audio.play()
        };
        e._delayedSeek = function() {
            this._audio.currentTime = this._intendedStartSampleLocation + (this._intendedStartTime - (new Date).getTime() / 1E3)
        };
        e._checkStart = function() {
            var a = this._audio.currentTime,
                b = (new Date).getTime() / 1E3;
            if (b < this._intendedStartTime) {
                b = b - this._intendedStartTime - (a - this._intendedStartSampleLocation);
                if (10 < b) this._audio.currentTime = a + b;
                setTimeout(this._checkStartBound, 10)
            } else this._isStartSeeking = !1, this._updateVolume()
        };
        e.pause = function(a) {
            a = 1E3 * (a || 0);
            if (d.pause.call(this, a)) 0 == a ? (this._audio.pause(),
                this._isPlaying = !1) : setTimeout(this._delayedPauseBound, a)
        };
        e._delayedPause = function() {
            this._audio.pause();
            this._isPlaying = !1
        };
        e._playbackFinished = function() {
            d._playbackFinished.call(this);
            this._isPlaying = !1
        };
        e._updateVolume = function() {
            d._updateVolume.call(this);
            this._audio.volume = this.isMute ? 0 : this._currentVolume;
            if (0 > this._currentVolume) this._currentVolume = 0;
            else if (1 < this._currentVolume) this._currentVolume = 1;
            this._audio.volume = this._currentVolume
        };
        e.destroy = function() {
            d.destroy.call(this)
        };
        b.create =
            function(a, d, e) {
                var c = new b;
                c.setup(a, d, e);
                return c
            }
    }
})();
(function() {
    breelNS.getNamespace("generic.events");
    var a = breelNS.getNamespace("generic.events").ListenerFunctions,
        c = breelNS.getNamespace("generic.sound").SoundLoader,
        e = breelNS.getNamespace("generic.sound.html5").Html5SoundObject,
        b = breelNS.getNamespace("generic.sound.html5");
    if (!b.Html5SoundLoader) {
        var d = function() {
            this._audio = null;
            this._loadCompleteBound = a.createListenerFunction(this, this._loadComplete)
        };
        b.Html5SoundLoader = d;
        var b = d.prototype = new c,
            f = c.prototype;
        b.setup = function(a, b, d) {
            f.setup.call(this,
                a, b, d);
            this._audio = new Audio;
            this._audio.preload = "none";
            this._audio.src = b;
            this._audio.addEventListener("canplaythrough", this._loadCompleteBound);
            this._soundObject = e.create(this._path, this._url, this._audio);
            this._soundObject.setIsMonophonic(this._soundObjectIsMonophonic)
        };
        b.load = function() {
            return this._audio ? (this._audio.load(), !0) : !1
        };
        b._loadComplete = function() {
            this.dispatchCustomEvent(c.LOADED, this._path)
        };
        d.create = function(a, b, e) {
            var c = new d;
            c.setup(a, b, e);
            return c
        }
    }
})();
(function() {
    breelNS.getNamespace("generic.events");
    var a = breelNS.getNamespace("generic.events").ListenerFunctions,
        c = breelNS.getNamespace("generic.sound").SoundObject,
        e = breelNS.getNamespace("generic.sound.webAudio");
    if (!e.WebAudioSoundObject) {
        var b = function() {
            this._gainNode = this._context = this._soundSource = this._soundBuffer = this._rq = null;
            this._trimPadding = this._supportsBufferSourceStartFunction = !1;
            this._loadCompleteBound = a.createListenerFunction(this, this._loadCompleted);
            this._playbackFinishedBound =
                a.createListenerFunction(this, this._playbackFinished);
            this._updateVolumeBound = a.createListenerFunction(this, this._updateVolume)
        };
        e.WebAudioSoundObject = b;
        var e = b.prototype = new c,
            d = c.prototype;
        c.LOADED = "soundObjectLoaded";
        e.setup = function(a, b, e, c) {
            d.setup.call(this, a, b, e);
            this._context = c;
            this._gainNode = this._context.createGainNode();
            this._gainNode.connect(this._context.destination);
            this._supportsBufferSourceStartFunction = "function" == typeof this._context.createBufferSource().start;
            return this
        };
        e.load =
            function() {
                this._rq = new XMLHttpRequest;
                this._rq.open("GET", this._soundURL, !0);
                this._rq.responseType = "arraybuffer";
                this._rq.onload = this._loadCompleteBound;
                this._rq.send()
            };
        e._loadCompleted = function() {
            var a = this._context.createBuffer(this._rq.response, !1);
            if (this._trimPadding) {
                var b = a.length - 2 * this._padding * a.sampleRate;
                this._soundBuffer = this._context.createBuffer(a.numberOfChannels, b, a.sampleRate);
                for (var e = this._padding * a.sampleRate, c = 0; c < a.numberOfChannels; c++) {
                    var k = this._soundBuffer.getChannelData(c),
                        m = a.getChannelData(c).subarray(e, e + b);
                    k.set(m)
                }
            } else this._soundBuffer = a;
            this._isLoaded = !0;
            d._loadCompleted.call(this)
        };
        e.play = function(a, b, e, c) {
            c = c || !1;
            a = a || 0;
            b = b || 0;
            e = e || 0;
            if (d.play.call(this, a, b, e)) this._soundSource = this._context.createBufferSource(), this._soundSource.buffer = this._soundBuffer, this._soundSource.connect(this._gainNode), this._soundSource.loop = c, b -= e, this._supportsBufferSourceStartFunction ? this._soundSource.start(this._context.currentTime + b, a) : this._soundSource.noteOn(this._context.currentTime +
                b, a), this._isPlaying = !0
        };
        e.pause = function(a) {
            d.pause.call(this, a) && (this._soundSource.stop(a), this._playbackFinished())
        };
        e._playbackFinished = function() {
            d._playbackFinished.call(this);
            this._isPlaying = !1
        };
        e._updateVolume = function() {
            d._updateVolume.call(this);
            this._gainNode.gain.value = this.isMute ? 0 : this._currentVolume
        };
        e.destroy = function() {
            d.destroy.call(this);
            this._soundBuffer = null
        };
        b.create = function(a, d, e, c) {
            var k = new b;
            k.setup(a, d, e, c);
            return k
        }
    }
})();
(function() {
    breelNS.getNamespace("generic.events");
    var a = breelNS.getNamespace("generic.events").ListenerFunctions,
        c = breelNS.getNamespace("generic.sound").SoundLoader,
        e = breelNS.getNamespace("generic.sound.webAudio").WebAudioSoundObject,
        b = breelNS.getNamespace("generic.sound.webAudio");
    if (!b.WebAudioSoundLoader) {
        var d = function() {
            this._rq = this._audio = null;
            this._loadCompleteBound = a.createListenerFunction(this, this._loadComplete)
        };
        b.WebAudioSoundLoader = d;
        var b = d.prototype = new c,
            f = c.prototype;
        b.setup = function(a,
            b, d, c) {
            f.setup.call(this, a, b, d);
            this._rq = new XMLHttpRequest;
            this._rq.open("GET", b, !0);
            this._rq.responseType = "arraybuffer";
            this._rq.onload = this._loadCompleteBound;
            this._soundObject = e.create(this._path, this._url, this._audio, c);
            this._soundObject.setIsMonophonic(this._soundObjectIsMonophonic)
        };
        b.load = function() {
            return this._rq ? (this._rq.send(), !0) : !1
        };
        b._loadComplete = function() {
            this.dispatchCustomEvent(c.LOADED, this._path)
        };
        d.create = function(a, b, e, c) {
            var f = new d;
            f.setup(a, b, e, c);
            return f
        }
    }
})();
(function() {
    var a = breelNS.getNamespace("generic.events").EventDispatcher,
        c = breelNS.getNamespace("generic.events").ListenerFunctions,
        e = breelNS.getNamespace("generic.sound").SoundLoader,
        b = breelNS.getNamespace("generic.sound").SoundObject,
        d = breelNS.getNamespace("generic.sound.flash").FlashSoundLoader,
        f = breelNS.getNamespace("generic.sound.html5").Html5SoundLoader,
        g = breelNS.getNamespace("generic.sound.webAudio").WebAudioSoundLoader,
        h = breelNS.getClass("generic.sound.flash.SoundPlayerFlashLink"),
        l = breelNS.getNamespace("generic.sound");
    if (!l.SoundLibrary) {
        var k = function() {
            this._soundFolderPath = "";
            this._loadingQueues = {};
            this._sounds = {};
            this._usingAudioTech = this._audioFileExtension = "";
            this._webAudioContext = null;
            this._hasUserEnabledAudio = !1;
            this._flashElement = this._flashLink = null;
            this._flashLoadedCallbackBound = c.createListenerFunction(this, this._flashLoadedCallback);
            this._flashStatusCallbackBound = c.createListenerFunction(this, this._flashStatusCallback);
            this._flashSoundRefDidFinishBound = c.createListenerFunction(this, this._flashSoundRefDidFinish);
            this._flashObjectLoaded = !1;
            this._flashSyncSoundLocation = null;
            this._loadNextSoundPendingFlashLoad = !1;
            this._paddingDuration = 0;
            this._currentLoadingQueue = [];
            this._queueLengthAtBegin = 0;
            this._loadingQueueNames = [];
            this._init()
        };
        l.SoundLibrary = k;
        k.LOADED_ONE = "loadedOne";
        k.ERROR_ONE = "errorOne";
        k.LOAD_PROGRESS = "loadProgress";
        k.LOADED_QUEUE = "loadedQueue";
        k.ERROR_QUEUE = "errorQueue";
        k.TECH_FLASH = "techFlash";
        k.TECH_HTML5 = "techHtml5";
        k.TECH_WEBAUDIO = "techWebAudio";
        a = k.prototype = new a;
        a._init = function() {
            return this
        };
        a.setup = function(a, b, d) {
            this._soundFolderPath = a;
            this._usingAudioTech = b;
            this._audioFileExtension = d;
            switch (this._usingAudioTech) {
                case k.TECH_WEBAUDIO:
                    this._hasUserEnabledAudio = !1;
                    break;
                case k.TECH_FLASH:
                    this._hasUserEnabledAudio = this._loadNextSoundPendingFlashLoad = !0;
                    break;
                case k.TECH_HTML5:
                    this._hasUserEnabledAudio = !1
            }
        };
        a.getAudioTech = function() {
            return this._usingAudioTech
        };
        a.createWebAudioContext = function() {
            if (this._usingAudioTech == k.TECH_WEBAUDIO)
                if ("undefined" !== typeof AudioContext) this._webAudioContext =
                    new AudioContext;
                else if ("undefined" !== typeof webkitAudioContext) this._webAudioContext = new webkitAudioContext;
            else throw Error("ERROR : tried to create a WebAudioContext when that technology is not available");
            else throw Error("ERROR : tried to set a WebAudioContext when not using that technology");
        };
        a.userInitiatedDummySound = function(a) {
            if (!this._hasUserEnabledAudio)
                if (a = this._sounds[a]) a.setVolume(0, 0, 0), a.play(0, 0, 0);
                else throw Error("SoundLibrary : userInitiatedDummySound - silent sound has not yet been loaded");
        };
        a.createFlashObject = function(a, b, d) {
            console.log("generic.sound.SoundLibrary::createFlashObject");
            console.log(a, b, d);
            if (this._usingAudioTech = k.TECH_FLASH) this._flashSyncSoundLocation = d, this._flashLink = h.createSingleton(h.DEFAULT_SINGLETON_NAME), this._flashLink.addEventListener(h.FLASH_LOADED, this._flashLoadedCallbackBound), swfobject.embedSWF(b, a, "1000", "580", "10.0.0", null, {
                flashLoadedCallback: "breelNS.singletons." + h.DEFAULT_SINGLETON_NAME + ".flashLoaded"
            }, {
                allowscriptaccess: "always"
            }, {}, this._flashStatusCallbackBound);
            else throw Error("ERROR : tried to set a Flash Object when not using that technology");
        };
        a._flashLoadedCallback = function() {
            console.log("generic.sound.SoundLibrary::_flashLoadedCallback");
            console.log(this._loadingQueues);
            for (var a in this._loadingQueues)
                for (var b = this._loadingQueues[a], d = 0; d < b.length; d++) b[d].setFlashElement(this._flashElement);
            var e = c.createListenerFunction(this, function(a) {
                this._flashLink.removeEventListener(k.GROUP_LOADED, e);
                if ("loader0" == a.detail && (this._flashElement.setSyncSound(this._flashSyncSoundLocation),
                    this._flashElement.setDefaultPaddingLength(this._paddingDuration / 1E3), this._flashElement.startClock(), this._loadNextSoundPendingFlashLoad)) this._loadNextSoundPendingFlashLoad = !1, this._loadNextSound()
            });
            this._flashLink.addEventListener(h.GROUP_LOADED, e);
            this._flashElement.loadFiles([this._flashSyncSoundLocation]);
            this._flashObjectLoaded = !0
        };
        a._flashStatusCallback = function(a) {
            console.log("SoundLibrary :: flash status callback : ", a);
            if (a.success) this._flashElement = a.ref;
            else throw Error("ERROR : SoundLibrary : flash audio player did not load successfully");
        };
        a._flashSoundRefDidFinish = function(a) {
            var a = a.detail,
                b;
            for (b in this._sounds) this._sounds[b].flashRefDidFinish(a)
        };
        a.setDefaultSamplePadding = function(a) {
            this._paddingDuration = parseInt(a);
            this._usingAudioTech == k.TECH_FLASH && this._flashObjectLoaded && this._flashElement.setDefaultPaddingLength(this._paddingDuration)
        };
        a.addSoundToLoadingQueue = function(a, b, d, h) {
            "undefined" == typeof this._loadingQueues[b] && (this._loadingQueues[b] = []);
            var g = this._getSoundURL(a),
                g = this._createLoaderObject(a, g, b),
                f = c.createListenerFunctionWithArguments(this,
                    this._soundDidLoad, [g]);
            g.addEventListener(e.LOADED, f);
            f = g.getSoundObject();
            f.setPaddingFromMetadata(h);
            f.setDurationFromMetadata(d);
            this._sounds[a] = f;
            this._loadingQueues[b].push(g);
            return f
        };
        a._createLoaderObject = function(a, b, e) {
            switch (this._usingAudioTech) {
                case k.TECH_HTML5:
                    a = f.create(a, b, e);
                    break;
                case k.TECH_WEBAUDIO:
                    a = g.create(a, b, e, this._webAudioContext);
                    break;
                default:
                    a = d.create(a, b, e, this._flashLink), this._flashObjectLoaded && a.setFlashElement(this._flashElement)
            }
            return a
        };
        a.beginQueue = function(a) {
            if (this._loadingQueues[a]) {
                for (var b =
                    0; b < this._loadingQueues[a].length; b++) this._currentLoadingQueue.push(this._loadingQueues[a][b]);
                this._queueLengthAtBegin = this._currentLoadingQueue.length;
                this._loadingQueueNames.push(a);
                this._loadNextSound()
            } else throw Error("SoundLibrary ERROR : tried to begin queue that does not exist");
        };
        a.getSound = function(a) {
            return this._sounds[a] ? this._sounds[a] : null
        };
        a.playSound = function(a, d, e, h, g) {
            if (!a) throw Error("SoundLibrary :: ERROR : no path defined in playSound");
            h = h || 0;
            d = d || 0;
            e = "undefined" != typeof e ?
                e : 1;
            console.log("SoundLibrary :: playing sound " + a + " with delay " + d + " at volume " + e);
            var f = this.getSound(a);
            if (f) return f.setVolume(e, h, d), f.play(0, d, void 0, g), f;
            console.warn && console.warn("SoundLibrary :: WARNING : called play on unloaded sound, sound will play after load");
            e = a + "_loadQueue";
            h = this._getSoundURL(a);
            e = this._createLoaderObject(a, h, e).getSoundObject();
            this._sounds[a] = e;
            h = c.createListenerFunction(this, function() {
                this._sounds[a].play(0, d)
            });
            e.addEventListener(b.LOADED, h);
            e.load();
            return e
        };
        a._loadNextSound = function() {
            if (!this._loadNextSoundPendingFlashLoad)
                if (0 < this._currentLoadingQueue.length) this._loadSound(this._currentLoadingQueue.shift());
                else
                    for (; this._loadingQueueNames.length;) this.dispatchCustomEvent(k.LOADED_QUEUE, this._loadingQueueNames.shift())
        };
        a._loadSound = function(a) {
            a.load()
        };
        a._soundDidLoad = function() {
            this.dispatchCustomEvent(k.LOADED_ONE);
            this.dispatchCustomEvent(k.LOAD_PROGRESS, 1 - this._currentLoadingQueue.length / this._queueLengthAtBegin);
            this._loadNextSound()
        };
        a._getSoundURL =
            function(a) {
                var b = this._soundFolderPath + "/";
                return b += a + "." + this._audioFileExtension
            };
        k.createSingleton = function(a, b, d) {
            if (!l.singletons) l.singletons = {};
            if (!l.singletons.SoundLibrary) l.singletons.SoundLibrary = new k, l.singletons.SoundLibrary.setup(a, b, d);
            return l.singletons.SoundLibrary
        }
    }
})();
(function() {
    var a = breelNS.getNamespace("generic.events").EventDispatcher,
        c = breelNS.getNamespace("generic.events").ListenerFunctions,
        e = breelNS.getNamespace("generic.video"),
        b;
    if (!e.VideoPlayer) {
        var d = function() {
            this.video = null;
            this.duration = -1;
            this.volume = 1;
            this._fadeDownId = void 0;
            this.paused = !1;
            this.fullScreenApi = {
                supportsFullScreen: !1,
                isFullScreen: function() {
                    return !1
                },
                requestFullScreen: function() {},
                cancelFullScreen: function() {},
                fullScreenEventName: "-",
                prefix: ""
            };
            this.browserPrefixes = "webkit moz o ms".split(" ");
            this._hasEnded = this._shouldLoop = !1;
            this.setup();
            this.parentEl = void 0
        };
        d.VIDEO_PROGRESS = "videoProgress";
        d.END_RANGE = 0.0010;
        d.VIDEO_END = "videoEnd";
        d.VIDEO_CAN_PLAY = "videoCanplay";
        d.WEBKITBEGINFULLSCREEN = "webkitbeginfullscreeen";
        d.WEBKITENDFULLSCREEN = "webkitendfullscreen";
        e.VideoPlayer = d;
        a = d.prototype = new a;
        a.setup = function() {
            if ("undefined" != typeof document.cancelFullScreen) this.fullScreenApi.supportsFullScreen = !0;
            else
                for (var a = 0, b = this.browserPrefixes.length; a < b; a++)
                    if (this.fullScreenApi.prefix = this.browserPrefixes[a],
                        "undefined" != typeof document[this.fullScreenApi.prefix + "CancelFullScreen"]) {
                        this.fullScreenApi.supportsFullScreen = !0;
                        break
                    } if (this.fullScreenApi.supportsFullScreen) this.fullScreenApi.fullScreenEventName = this.fullScreenApi.prefix + "fullscreenchange", this.fullScreenApi.isFullScreen = function() {
                switch (this.prefix) {
                    case "":
                        return document.fullScreen;
                    case "webkit":
                        return document.webkitIsFullScreen;
                    default:
                        return document[this.prefix + "FullScreen"]
                }
            }, this.fullScreenApi.requestFullScreen = function(a) {
                console.log("requestFullScreen :: this.prefix  : ",
                    this.prefix);
                return "" === this.prefix ? a.requestFullScreen() : a[this.prefix + "RequestFullScreen"]()
            }, this.fullScreenApi.cancelFullScreen = function() {
                return "" === this.prefix ? document.cancelFullScreen() : document[this.prefix + "CancelFullScreen"]()
            }
        };
        a.load = function(a) {
            b = breelNS.getNamespace(breelNS.projectName).singletons.siteManager;
            console.log("Loading Video : ", a);
            try {
                this.video = document.createElement("video")
            } catch (d) {
                this.video = new Video
            }
            this.addSource(this.video, a + ".mp4", "video/mp4");
            this.addSource(this.video,
                a + ".ogg", "video/ogg");
            this.video.preload = !0;
            this.video.className = "videoPlayer";
            "firefox" == browserDetector.getBrowserName() || browserDetector.getIsAndroid() ? b.scheduler.delay(this, this._canPlay, [], 1E3) : (this._canPlayBound = c.createListenerFunction(this, this._canPlay), c.addDOMListener(this.video, "canplaythrough", this._canPlayBound), this._onWebkitEndfullscreenBound = c.createListenerFunction(this, this._onWebkitEndfullscreen), c.addDOMListener(this.video, "webkitendfullscreen", this._onWebkitEndfullscreenBound));
            this.video.load();
            this._isPausedBound = c.createListenerFunction(this, this._isPaused);
            c.addDOMListener(this.video, "pause", this._isPausedBound);
            this._onVideoEndBound = c.createListenerFunction(this, this._onVideoEnd);
            c.addDOMListener(this.video, "ended", this._onVideoEndBound);
            this._isProgressBound = c.createListenerFunction(this, this._onProgress);
            c.addDOMListener(this.video, "progress", this._onProgress);
            this._loopBound = c.createListenerFunction(this, this._loop);
            this._efIndex = window.setInterval(this._loopBound,
                100)
        };
        a.getVideoElement = function() {
            return this.video
        };
        a.setWidth = function(a) {
            this.video.style.width = a + "px"
        };
        a._canPlay = function() {
            this.dispatchCustomEvent(d.VIDEO_CAN_PLAY, this);
            c.removeDOMListener(this.video, "canplaythrough", this._canPlayBound)
        };
        a._loop = function() {
            if (this.video.currentTime > this.video.duration - d.END_RANGE)
                if (this._shouldLoop) this.dispatchCustomEvent(d.VIDEO_END, this);
                else if (!this._hasEnded) this._hasEnded = !0, this.dispatchCustomEvent(d.VIDEO_END, this)
        };
        a.play = function() {
            this.video.play();
            this.paused = this._hasEnded = !1
        };
        a.loadVideo = function() {
            this.video.load()
        };
        a.pause = function() {
            this.video.pause();
            this.paused = !0
        };
        a._onVideoEnd = function() {
            b.analyticsManager.gaTrack("video", "ended")
        };
        a.toggleFullScreen = function() {
            this.fullScreenApi.supportsFullScreen && (this.fullScreenApi.isFullScreen() ? this.fullScreenApi.cancelFullScreen() : this.fullScreenApi.requestFullScreen(this.video))
        };
        a._onWebkitEndfullscreen = function() {
            this.dispatchCustomEvent(d.WEBKITENDFULLSCREEN)
        };
        a._isPaused = function() {
            return this.paused
        };
        a._onProgress = function() {};
        a.seek = function(a) {
            this.video.currentTime = a
        };
        a.addSource = function(a, b, d) {
            var e = document.createElement("source");
            e.src = b;
            if (d) e.type = d;
            a.appendChild(e)
        };
        a.addToDom = function(a) {
            this.parentEl = a;
            this.parentEl.appendChild(this.video)
        };
        a.fadeDownVolume = function() {
            this._fadeDownId = b.scheduler.addEF(this, this.fadeDownVolumeLoop, [], 50, 10)
        };
        a.fadeDownVolumeLoop = function() {
            if (0 < this.volume && (this.volume -= 0.1, this.volume = Math.round(10 * this.volume) / 10, this.video)) this.video.volume = this.volume
        };
        a.setSize = function(a, b) {
            if (void 0 !== a) this.video.style.width = a + "px";
            if (void 0 !== b) this.video.style.height = b + "px"
        };
        a.destroyVideo = function() {
            window.clearInterval(this._efIndex);
            if (this.video) this.video.pause(), this.video.src = "", this.video = null, this.volume = 1
        }
    }
})();
(function() {
    var a = breelNS.getNamespace("generic.core"),
        c = breelNS.getNamespace("generic.events").EventDispatcher,
        e;
    if (!a.AssetManager) {
        var b = function() {
            this.assets = {};
            this._queue = [];
            this._nAssetLoaded = this._nAssetToLoad = 0;
            this._imagesFolder = "files/images";
            this._imagesFolder = breelNS.dirRoot + this._imagesFolder;
            this._currentPixelDensity = "1x";
            this._req = null;
            this._parser = new DOMParser;
            this._requestOnReadyStateChangeBound = this._requestOnReadyStateChange.bind(this);
            this._currentAsset = null;
            this.combinedSequence = {};
            this._combinedSequenceLoaded = []
        };
        b.ALL_COMPLETE = "allComplete";
        b.PROGRESS = "onProgress";
        b.ERROR = "assetManagerError";
        b.LOADED = "assetManagerLoaded";
        b.TEMPLATE_IMAGES = "assetManagerImageLoading";
        a.AssetManager = b;
        a = b.prototype = new c;
        a.init = function(a) {
            if (void 0 !== a) this._imagesFolder = a;
            e = breelNS.getNamespace(breelNS.projectName).singletons.siteManager;
            a = window.devicePixelRatio;
            this._currentPixelDensity = "1x";
            if (a && 2 <= a) this._currentPixelDensity = "2x"
        };
        a.enqueue = function(a, b, e) {
            if ("sequence" == b)
                for (var c =
                    function(a, b) {
                        return a.length < b ? c("0" + a, b) : a
                    }, l = e.lastIndexOf("_"), k = e.lastIndexOf("."), m = e.substring(0, l + 1), n = e.substring(k, e.length), e = e.substring(l + 1, k), l = 0; l < e; l++) k = c(l.toString(), e.length), this._queue.push({
                    id: a + l,
                    type: b,
                    url: m + k + n
                });
            else this._queue.push({
                id: a,
                type: b,
                url: e
            })
        };
        a.startLoading = function() {
            this._nAssetToLoad = this._queue.length;
            this._nAssetLoaded = 0;
            this._loadNext()
        };
        a._loadNext = function() {
            if (0 == this._queue.length) this._onAllAssetLoaded();
            else {
                var a = this._queue.shift();
                this._currentAsset =
                    a;
                var b = a.type;
                if (this.hasAsset(a.id)) this._loadNext();
                else switch (b) {
                    case "sequenceCombined":
                        this._req = new XMLHttpRequest;
                        this._req.onreadystatechange = this._requestOnReadyStateChangeBound;
                        this._req.open("GET", breelNS.dirRoot + a.url, !0);
                        this._req.send(null);
                        break;
                    case "audio":
                        var e = this,
                            b = new Audio;
                        b.addEventListener("canplaythrough", function() {
                            e._onProgress()
                        });
                        b.src = breelNS.dirRoot + a.url;
                        b.load();
                        break;
                    case "template":
                        this._req = new XMLHttpRequest;
                        this._req.onreadystatechange = this._requestOnReadyStateChangeBound;
                        this._req.open("GET", breelNS.dirRoot + a.url, !0);
                        this._req.send(null);
                        break;
                    case "image":
                    case "svg":
                    case "sequence":
                        var e = this,
                            b = new Image,
                            c = this.getImageSrc(a.url);
                        b.onload = function() {
                            e.assets[a.id] = this;
                            e._onProgress()
                        };
                        b.onerror = function() {
                            console.error("ERROR loading image asset : " + c);
                            e._loadNext()
                        };
                        b.src = c;
                        break;
                    default:
                        this._onProgress()
                }
            }
        };
        a._onProgress = function() {
            this._nAssetLoaded++;
            this.dispatchCustomEvent(b.PROGRESS, {
                loaded: this._nAssetLoaded,
                total: this._nAssetToLoad
            });
            this._loadNext()
        };
        a._onAllAssetLoaded = function() {
            this.dispatchCustomEvent(b.ALL_COMPLETE, null)
        };
        a.getImageSrc = function(a) {
            var b = !0;
            if ("" == a || null == a) return a;
            var e = "";
            this._pathContainsSVG(a) ? (this.supportsSVG() || (b = !1), e = this._imagesFolder + "/svgs") : e = this._imagesFolder + "/" + this._currentPixelDensity; - 1 == a.indexOf(e) && -1 == a.indexOf("/singlequality/") && (a = e + "/" + a);
            b || (a = a.split("/"), b = a[4].split("."), b = b[0], a = a[0] + "/" + a[1] + "/" + a[2] + "/svgFallback/" + b + ".png");
            return a
        };
        a.getPixelDensityInt = function() {
            switch (this._currentPixelDensity) {
                case "1x":
                    return 1;
                case "2x":
                    return 2;
                default:
                    return 1
            }
        };
        a._pathContainsSVG = function(a) {
            return void 0 == a ? !1 : -1 !== a.indexOf(".svg")
        };
        a.getAsset = function(a) {
            return this.assets[a]
        };
        a.hasAsset = function(a) {
            return void 0 != this.assets[a]
        };
        a.removeAsset = function() {};
        a.supportsSVG = function() {
            var a = !0;
            if (!document.createElementNS || !document.createElementNS("http://www.w3.org/2000/svg", "svg").createSVGRect) a = !1, document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure", "1.1") && (a = !0);
            return a
        };
        a.updateAllStyleSheetsForPixelDensity =
            function() {
                for (var a = 0; a < document.styleSheets.length; a++) this.updateImageSrcInCSSSheet(document.styleSheets[a])
            };
        a.updateImageSrcInCSSSheet = function(a) {
            for (var a = a.cssRules || a.rules || [], b = 0; b < a.length; b++) {
                var e = a[b];
                if (e.cssRules)
                    for (var c = 0; c < e.cssRules.length; c++) {
                        var l = e.cssRules[c];
                        if (l.style && "" != l.style.backgroundImage) {
                            var k = "",
                                k = this._pathContainsSVG(l.style.backgroundImage, ".svg") ? l.style.backgroundImage.replace(/\/xx\//g, "/svg/") : l.style.backgroundImage.replace(/\/xx\//g, "/" + this._currentPixelDensity +
                                    "/");
                            l.style.backgroundImage = k
                        }
                    } else if (e.style) try {
                        if ("" != e.style.backgroundImage) k = "", k = this._pathContainsSVG(e.style.backgroundImage, ".svg") ? e.style.backgroundImage.replace(/\/xx\//g, "/svg/") : e.style.backgroundImage.replace(/\/xx\//g, "/" + this._currentPixelDensity + "/"), e.style.backgroundImage = k
                    } catch (m) {}
            }
        };
        a._requestOnReadyStateChange = function() {
            switch (this._req.readyState) {
                case 4:
                    if (400 > this._req.status)
                        if ("template" == this._currentAsset.type) this._templateLoadCallback(this._req.responseText);
                        else {
                            if ("sequenceCombined" == this._currentAsset.type) {
                                if (-1 != this._combinedSequenceLoaded.indexOf(this._currentAsset.id)) break;
                                this._combinedSequenceLoaded.push(this._currentAsset.id);
                                this._loadCombinedImageSequence(this._req.responseText)
                            }
                        } else this.dispatchCustomEvent(b.ERROR, "Error loading template from ", this._currentlyLoadingTemplate, " status : ", this._req.status)
            }
        };
        a._loadCombinedImageSequence = function(a) {
            this.frameData = JSON.parse(a);
            this.imageSequenceCount = 0;
            this.frames = this.frameData.frames.concat();
            this._nAssetToLoad += this.frameData.totalImages;
            a = {};
            this.combinedSequence[this.frameData.name] = a;
            a.imageSequences = [];
            this._loadNextCombinedImage()
        };
        a._loadNextCombinedImage = function() {
            if (this.imageSequenceCount == this.frameData.totalImages) this._createImageSequenceAssets();
            else {
                var a = "../files/sequences/" + this.frameData.name + "/" + this.frameData.name + "_" + this.imageSequenceCount + ".jpg";
                e.useCompressedAssets && (a = "../files/sequences/ie/" + this.frameData.name + "/" + this.frameData.name + "_" + this.imageSequenceCount +
                    ".jpg");
                var b = new Image,
                    c = this;
                b.onerror = function() {
                    console.log("Error Loading image : ", a)
                };
                b.onload = function() {
                    var a = this.src.substring(this.src.lastIndexOf("_") + 1),
                        a = parseInt(a.substring(0, a.indexOf(".")));
                    c.combinedSequence[c.frameData.name].imageSequences[a] = this;
                    c.imageSequenceCount++;
                    c._updateCombinedImageProgress();
                    c._loadNextCombinedImage()
                };
                b.src = a
            }
        };
        a._updateCombinedImageProgress = function() {
            this._nAssetLoaded++;
            this.dispatchCustomEvent(b.PROGRESS, {
                loaded: this._nAssetLoaded,
                total: this._nAssetToLoad
            })
        };
        a._createImageSequenceAssets = function() {
            this.assets[this._currentAsset.id] = this.frameData;
            this._onProgress()
        };
        a.getCombinedSequence = function(a) {
            return this.combinedSequence[a]
        };
        a._templateLoadCallback = function(a) {
            for (var a = this._parser.parseFromString(a, "text/xml").querySelectorAll("*[data-type='template']"), b = 0; b < a.length; b++) {
                for (var e = a[b], c = e.getAttribute("id"), e = this._updateImagesInTemplate(e), l = e.attributes, k = void 0, m = 0; m < l.length; m++)
                    if (void 0 !== l[m] && "data-template-id" == l[m].nodeName) k = l[m].nodeValue;
                void 0 !== k && (c = k);
                this._getAllImagesInTemplate(e);
                this._updateCopyInTemplate(e);
                this.assets[c] = e
            }
            this._onProgress()
        };
        a._updateImagesInTemplate = function(a) {
            for (var b = a.querySelectorAll("img"), e = 0; e < b.length; e++) {
                var c = b[e],
                    l = c.getAttribute("src");
                l && c.setAttribute("src", this.getImageSrc(l))
            }
            return a
        };
        a._getAllImagesInTemplate = function(a) {
            for (var a = a.querySelectorAll("*"), e = [], c = 0; c < a.length; c++)
                for (var h = a[c], l = 0; l < h.attributes.length; l++) {
                    var k = h.attributes[l].value;
                    k.match(/(.png)/) && e.push(k)
                }
            0 <
                e.length && this.dispatchCustomEvent(b.TEMPLATE_IMAGES, e)
        };
        a._updateCopyInTemplate = function(a) {
            for (var a = a.querySelectorAll("*[data-type='copy']"), b = 0; b < a.length; b++) {
                var c = a[b],
                    h = c.getAttribute("data-copyId");
                try {
                    c.innerHTML = e.copyManager.getCopy(h)
                } catch (l) {}
            }
        }
    }
})();
(function() {
    var a = breelNS.getNamespace("generic.events").EventDispatcher,
        c = breelNS.getNamespace("generic.events").ListenerFunctions,
        e = breelNS.getNamespace("generic.core"),
        b;
    if (!e.HistoryStateManager) {
        var d = function() {
            this.onHistoryStateChangeBound = c.createListenerFunction(this, this.onHistoryStateChange);
            this.history = History;
            this.setState = void 0
        };
        e.HistoryStateManager = d;
        a = d.prototype = new a;
        d.STATE_CHANGED = "historyStateChanged";
        a.setup = function() {
            b = breelNS.getNamespace(breelNS.projectName).singletons.siteManager;
            this.addHistoryEventListener()
        };
        a.addHistoryEventListener = function() {
            this.history.Adapter.bind(window, "statechange", this.onHistoryStateChangeBound)
        };
        a.addState = function(a, d, e) {
            console.debug("addState :: aStateObject, aTitle, aUrl : ", a, d, e);
            var d = void 0 === d ? null : d,
                c = window.location.href,
                e = "/" == c.charAt(c.length - 1) ? -1 != window.location.href.indexOf("recipe") ? "/" == breelNS.dirRoot ? "/" + e : "../../" + e : breelNS.dirRoot + e : -1 != window.location.href.indexOf("recipe") ? "/" == breelNS.dirRoot ? "/" + e : "../" + e : breelNS.dirRoot +
                e;
            if (b.config.config.setHistoryState) this.setState = !0, this.history.pushState(a, d, e);
            console.debug("HistoryStateManager ::: addState :: this.history.getCurrentIndex : ", this.history.getCurrentIndex())
        };
        a.onHistoryStateChange = function() {
            var a = this.history.getState(!1);
            this.setState ? this.setState = !1 : this.dispatchCustomEvent(d.STATE_CHANGED, a);
            console.debug("HistoryStateManager ::: onHistoryStateChange :: this.history.getCurrentIndex : ", this.history.getCurrentIndex())
        };
        a.destroy = function() {
            this.history.Adapter.unbind(window,
                "statechange", this.onHistoryStateChangeBound)
        };
        d.create = function() {
            var a = new d;
            a.setup();
            return a
        }
    }
})();
(function() {
    var a = breelNS.getNamespace("generic.events").ListenerFunctions,
        c = breelNS.getNamespace("generic.core").HistoryStateManager,
        e = breelNS.getNamespace("generic.core").AssetManager;
    breelNS.getNamespace("generic.core");
    var b = breelNS.getNamespace("generic.core"),
        d = breelNS.getNamespace(breelNS.projectName + ".page"),
        f;
    if (!b.GlobalStateManager) {
        var g = function() {
            this._preState = this._nextState = this._currentState = "";
            this._params = {};
            this._loader = null;
            this._isMainLoaded = !1;
            this.pages = {};
            this._nToOpen = this._nOpened =
                this._nToClose = this._nClosed = 0;
            this._toLoadID = "";
            this._blocker = null
        };
        g.END_PAGE_OPEN = "endPageOpen";
        g.END_PAGE_CLOSE = "endPageClose";
        b.GlobalStateManager = g;
        b = g.prototype;
        b.init = function() {
            f = breelNS.getNamespace(breelNS.projectName).singletons.siteManager;
            this.historyStateManager = c.create();
            this.onHistoryStateChangedBound = a.createListenerFunction(this, this.onHistoryStateChanged);
            this.historyStateManager.addEventListener(c.STATE_CHANGED, this.onHistoryStateChangedBound);
            this._onPageOpenedBound = a.createListenerFunction(this,
                this._onPageOpened);
            this._onPageClosedBound = a.createListenerFunction(this, this._onPageClosed);
            this._onLoaderOpenedBound = a.createListenerFunction(this, this._onLoaderOpened);
            this._onLoaderClosedBound = a.createListenerFunction(this, this._onLoaderClosed);
            this._onAssetLoadedBound = a.createListenerFunction(this, this._onAssetLoaded);
            this._onAssetProgressBound = a.createListenerFunction(this, this._onAssetProgress);
            this._createBlocker()
        };
        b._createBlocker = function() {
            this._blocker = document.createElement("div");
            this._blocker.style.width = "100%";
            this._blocker.style.height = "100%";
            this._blocker.style.position = "absolute";
            this._blocker.style.top = "0px";
            this._blocker.style.left = "0px";
            this._blocker.style.zIndex = "99";
            this._blocker.style.display = "none";
            this._blocker.id = "siteBlocker";
            document.body.appendChild(this._blocker)
        };
        b.setDefaultState = function() {
            "undefined" != f.config.getVar("startParams") ? this.setPage(f.config.getVar("page"), f.config.getVar("startParams")) : this.setPage(f.config.getVar("page"))
        };
        b.preState = function() {
            "" !=
            this._preState && this.setPage(this._preState)
        };
        b.setPage = function(a, b) {
            if (f.config.hasPage(a) && a != this._currentState) this._params = b, this._nextState = a, this._isMainLoaded ? this._loadPage(this._nextState) : this._loadPage(this._nextState, f.config.getMainLoader())
        };
        b._loadPage = function(b, d) {
            void 0 != this._loader && (a.removeDOMListener(this._loader, g.END_PAGE_CLOSE, this._onLoaderClosedBound), this._loader.close());
            void 0 == d && (d = f.config.getStateLoader(b));
            this._loader = this._buildPage(d, !1);
            this._toLoadID = b;
            if (void 0 !=
                this._loader) a.addDOMListener(this._loader, g.END_PAGE_OPEN, this._onLoaderOpenedBound), a.addDOMListener(this._loader, g.END_PAGE_CLOSE, this._onLoaderClosedBound), this._loader.open(), this._blocker.style.display = "block"
        };
        b._buildPage = function(a, b) {
            if (null == this.getPage(a)) {
                var e = f.config.getPageClass(a);
                if (void 0 == d[e]) throw Error("Page not exist : " + a);
                var c = f.config.getPage(a),
                    g = null !== c ? c.page.attributes.default_state.value : void 0,
                    o = null !== c ? c.page.attributes.default_section.value : void 0,
                    p = null !==
                    c ? c.states : void 0,
                    q = null !== c ? c.sections : void 0;
                null !== c && ("" == g && (g = void 0), "" == o && (o = void 0), 0 == p.length && (p = void 0), 0 == q.length && (q = void 0));
                e = new d[e](e, g, o, p, q, void 0);
                this._listenPage(e, b);
                document.body.appendChild(e.getContainer());
                e.getContainer().id = a;
                this.pages[a] = e;
                void 0 != this._params && e.setParams(this._params);
                e.initialize();
                return e
            }
            return this.getPage(a)
        };
        b._listenPage = function(b, d) {
            d ? (a.addDOMListener(b, g.END_PAGE_OPEN, this._onPageOpenedBound), a.addDOMListener(b, g.END_PAGE_CLOSE, this._onPageClosedBound)) :
                (a.removeDOMListener(b, g.END_PAGE_OPEN, this._onPageOpenedBound), a.removeDOMListener(b, g.END_PAGE_CLOSE, this._onPageClosedBound))
        };
        b._onPageOpened = function(a) {
            null != a && this._nOpened++;
            if (this._nToOpen == this._nOpened) this._blocker.style.display = "none", this._params = null
        };
        b._onPageClosed = function(a) {
            if (null != a) {
                a = a.detail.page;
                this._listenPage(a, !1);
                document.body.removeChild(a.getContainer());
                this.pages[a.getContainer().id] = null;
                this._nClosed++;
                for (var a = f.config.getPageAssetNodes(a.getContainer().id),
                    b = 0; b < a.length; b++) f.assetManager.removeAsset(a[b])
            }
            this._nToClose == this._nClosed && this._openPages(f.config.getStatePagesToOpen(this._nextState))
        };
        b._onLoaderOpened = function() {
            var b = f.config.getStateAssetNodes(this._toLoadID, !this._isMainLoaded);
            a.addDOMListener(f.assetManager, e.ALL_COMPLETE, this._onAssetLoadedBound);
            a.addDOMListener(f.assetManager, e.PROGRESS, this._onAssetProgressBound);
            for (var d = 0; d < b.length; d++) {
                var c = b[d],
                    g = c.attributes.id.value;
                f.assetManager.hasAsset(g) || f.assetManager.enqueue(g,
                    c.attributes.type.value, c.attributes.src.value)
            }
            f.scheduler.delay(f.assetManager, f.assetManager.startLoading, [], 0.5)
        };
        b._onAssetProgress = function(a) {
            this._loader && this._loader.setLoadingPercent && this._loader.setLoadingPercent(a.detail.loaded / a.detail.total)
        };
        b._onAssetLoaded = function() {
            a.removeDOMListener(f.assetManager, e.ALL_COMPLETE, this._onAssetLoadedBound);
            a.removeDOMListener(f.assetManager, e.PROGRESS, this._onAssetProgressBound);
            this._loader ? this._loader.close() : this._onLoaderClosed(null)
        };
        b._onLoaderClosed =
            function(a) {
                if (!this._isMainLoaded) this._isMainLoaded = !0;
                this._loader && this._clearLoader(a.detail.page.getContainer().id);
                console.log("this._nextState : ", this._nextState);
                null !== this._nextState && this._closePages(f.config.getStatePagesToClose(this._nextState))
            };
        b._clearLoader = function(b) {
            try {
                document.body.removeChild(this._loader.getContainer())
            } catch (d) {}
            a.removeDOMListener(this._loader, g.END_PAGE_OPEN, this._onLoaderOpenedBound);
            a.removeDOMListener(this._loader, g.END_PAGE_CLOSE, this._onLoaderClosedBound);
            this._loader = this.pages[b] = null
        };
        b._closePages = function(a) {
            var b = 0;
            this._nClosed = 0;
            for (var d = [], b = 0; b < a.length; b++) {
                var e = this.getPage(a[b]);
                e && d.push(e)
            }
            this._nToClose = d.length;
            if (0 == this._nToClose) this._onPageClosed(null);
            else
                for (b = 0; b < d.length; b++) this._toClosePage(d[b])
        };
        b._openPages = function(a) {
            this._preState = this._currentState;
            this._currentState = this._nextState;
            this._nextState = null;
            var b = 0;
            this._nOpened = this._nToOpen = 0;
            for (var d = [], b = 0; b < a.length; b++) {
                var e = this._buildPage(a[b], !0);
                e && !e.isOpened ?
                    d.push(e) : e && e.isOpened && this._params && e.setParams(this._params)
            }
            this._nToOpen = d.length;
            if (0 == this._nToOpen) this._onPageOpened(null);
            else
                for (b = 0; b < d.length; b++) this._toOpenPage(d[b])
        };
        b.onHistoryStateChanged = function() {};
        b._toClosePage = function(a) {
            a.close()
        };
        b._toOpenPage = function(a) {
            a.open()
        };
        b.getPage = function(a) {
            return this.pages[a]
        };
        b.getPreState = function() {
            return this._preState
        };
        b.getCurrentState = function() {
            return this._currentState
        };
        b.getNextState = function() {
            return this._nextState
        };
        b.getOpenedUIs =
            function() {
                var a = [],
                    b;
                for (b in this.pages) null != this.pages[b] && a.push(this.pages[b]);
                return a
            }
    }
})();
(function() {
    var a = breelNS.getNamespace("generic.events").EventDispatcher,
        c = breelNS.getNamespace("generic.events").ListenerFunctions,
        e = breelNS.getNamespace("generic.utils").Utils,
        b = breelNS.projectName + ".page",
        d = breelNS.getNamespace("generic.core"),
        f;
    if (!d.StateManager) {
        var g = function() {
            this._states = {};
            this._nextStateId = this._nextState = this._preStateId = this._preState = this._currentStateId = this._currentState = void 0;
            this._loader = null;
            this._toLoadID = void 0;
            this._blocker = null;
            this._onNextStateDispatchedBound =
                c.createListenerFunction(this, this.onNextStateDispatched)
        };
        g.STATE_OPEN = "stateOpen";
        g.NEXT_STATE = "nextState";
        g.END_STATE_OPEN = "endStateOpen";
        g.END_STATE_CLOSE = "endStateClose";
        g.STATE_CALLED_SCROLL = "stateCalledScroll";
        g.STATE_MANAGER_CALLED_SCROLL = "stateManagerCalledScroll";
        d.StateManager = g;
        a = g.prototype = new a;
        a.initialize = function(a, d, k, m, n, o) {
            f = breelNS.getNamespace(breelNS.projectName).singletons.siteManager;
            this._onPageOpenedBound = c.createListenerFunction(this, this._onPageOpened);
            this._onPageClosedBound =
                c.createListenerFunction(this, this._onPageClosed);
            this._onStateCalledScrollBound = c.createListenerFunction(this, this._onStateCalledScroll);
            for (var p = 0; p < a.length; p++) {
                var q = a[p],
                    r = q + "State",
                    t = n ? breelNS.getNamespace(m) : breelNS.getNamespace(b + "." + m);
                if (void 0 === o) var s = m + q,
                    s = s.replace(".", "");
                else s = o[p];
                s = f.assetManager.getAsset(s);
                r = new t[r](q, k, s);
                r.addEventListener(g.NEXT_STATE, this._onNextStateDispatchedBound);
                r.addEventListener(g.STATE_CALLED_SCROLL, this._onStateCalledScrollBound);
                this._states[q] =
                    r
            }
            this._getBlocker();
            this.startState = e._toCamelCase("-" + d)
        };
        a.beginStateManager = function(a) {
            this.setState(this.startState, a)
        };
        a.setState = function(a, b) {
            if (a == this._currentStateId) console.log("Tried to open the state that is currently on show. ID : " + a);
            else {
                var d = !1;
                if (this._currentState) d = !0, this._blocker.style.display = "block", this._currentState.addEventListener(g.END_STATE_CLOSE, this._onPageClosedBound), this._preState = this._currentState, this._preStateId = this._currentStateId;
                void 0 !== this._states[a] ?
                    (this._nextState = this._states[a], this._nextStateId = a, this._nextState.addEventListener(g.END_STATE_OPEN, this._onPageOpenedBound)) : console.warn("ERROR : Could not find the state with id  : " + a);
                d ? this._currentState.close(b) : (this.dispatchCustomEvent(g.STATE_OPEN, this._nextStateId), this._blocker.style.display = "block", void 0 !== b && this._nextState.setParams(b), this._nextState.initialize(), this._nextState.open())
            }
        };
        a.setParams = function(a) {
            void 0 !== this._currentState && this._currentState.setParams(a)
        };
        a.onNextStateDispatched =
            function(a) {
                this.setState(a.detail)
            };
        a._onPageOpened = function() {
            if (void 0 !== this._nextState) this._nextState.removeEventListener(g.END_STATE_OPEN, this._onPageOpenedBound), this._blocker.style.display = "none", this._currentState = this._nextState, this._currentStateId = this._nextStateId, this._nextStateId = this._nextState = void 0
        };
        a._onPageClosed = function(a) {
            void 0 === this._blocker && this._getBlocker();
            this._blocker.style.display = "none";
            var b = a.detail.state.container,
                d = a.detail.params;
            null !== b && null !== b.parentNode &&
                b.parentNode.removeChild(b);
            c.removeDOMListener(a.detail, g.END_STATE_CLOSE, this._onPageClosedBound);
            if (void 0 !== this._nextState) void 0 !== d && this._nextState.setParams(d), this._nextState.initialize(), a = this._nextStateId, this._nextState.open(), this.dispatchCustomEvent(g.STATE_OPEN, a)
        };
        a._getBlocker = function() {
            this._blocker = document.getElementById("siteBlocker")
        };
        a.getState = function(a) {
            return this._states[a]
        };
        a.getCurrentState = function() {
            return this._currentState
        };
        a._onStateCalledScroll = function(a) {
            console.log("stateManager :: _onStateCalledScroll : ",
                a);
            this.dispatchCustomEvent(g.STATE_MANAGER_CALLED_SCROLL, a.detail)
        };
        a._onResize = function() {
            void 0 !== this._currentState && this._currentState._onResize(params)
        };
        a.destroy = function() {
            for (var a in this._states) this._states[a].destroy();
            this._currentState.removeEventListener(g.END_STATE_CLOSE, this._onPageClosedBound);
            this._states = {};
            this._nextStateId = this._nextState = this._preStateId = this._preState = this._currentStateId = this._currentState = void 0;
            this._loader = null;
            this._toLoadID = void 0;
            this._blocker = null
        };
        g.create = function(a, b, d, e, c, f) {
            var p = new g;
            p.initialize(a, b, d, e, c, f);
            return p
        }
    }
})();
(function() {
    var a = breelNS.getNamespace("generic.events").EventDispatcher,
        c = breelNS.getNamespace("generic.events").ListenerFunctions,
        e = breelNS.getNamespace("generic.core").StateManager,
        b = breelNS.getNamespace("generic.core");
    if (!b.StateManagerGenerator) {
        var d = function() {
            this.stateManager = void 0
        };
        b.StateManagerGenerator = d;
        a = d.prototype = new a;
        a.setup = function(a, b, d, l, k, m, n) {
            this.stateManager = e.create(a, b, d, l, k, m);
            this._onStateChangedBound = c.createListenerFunction(this, this._onStateChanged);
            this.stateManager.addEventListener(e.STATE_OPEN,
                this._onStateChangedBound);
            this.stateManager.beginStateManager(n)
        };
        a._onStateChanged = function(a) {
            console.log("stateOpening : ", a.detail)
        };
        d.create = function(a, b, e, c, k, m, n) {
            console.log("aStates, aDefaultState, aContainer, aParentNameSpaceId, aAbsoluteParentName, aTemplateIds, aParams : ", a, b, e, c, k, m, n);
            var o = new d;
            o.setup(a, b, e, c, k, m, n);
            return o
        }
    }
})();
(function() {
    var a = breelNS.getNamespace("generic.events").ListenerFunctions,
        c = breelNS.getNamespace("generic.events").EventDispatcher,
        e = breelNS.getNamespace("generic.loading").XmlLoader,
        b = breelNS.getNamespace("generic.core");
    if (!b.ConfigSite) {
        var d = function() {
            this.assets = this.templates = this.pages = this.config = this._configXML = this._configURL = null
        };
        d.CONFIG_LOADED = "configLoaded";
        b.ConfigSite = d;
        c = d.prototype = new c;
        c.setup = function(b) {
            this._configURL = b;
            this.onConfigLoadedBound = a.createListenerFunction(this,
                this.onConfigLoaded);
            this.onConfigErrorBound = a.createListenerFunction(this, this.onConfigError);
            this._xmlLoader = e.create(b);
            a.addDOMListener(this._xmlLoader, e.LOADED, this.onConfigLoadedBound);
            a.addDOMListener(this._xmlLoader, e.ERROR, this.onConfigErrorBound);
            this._xmlLoader.load()
        };
        c.onConfigLoaded = function(a) {
            var b = a.detail;
            try {
                this._configXML = b.querySelector("data"), this.config = JSON.parse(b.querySelector("var").childNodes[0].nodeValue)
            } catch (e) {
                b = (new DOMParser).parseFromString(a.detail.xml, "application/xml"),
                    this._configXML = b.querySelector("data"), this.config = JSON.parse(b.querySelector("var").childNodes[0].nodeValue)
            }
            this._getParametersFromURL();
            this._build();
            this.dispatchCustomEvent(d.CONFIG_LOADED, this)
        };
        c._getParametersFromURL = function() {
            var a = window.location.href;
            if (-1 != a.indexOf("?")) {
                a = a.substring(a.indexOf("?"));
                a = a.split(/\?|&/);
                a.shift();
                for (var b = 0; b < a.length; b++) {
                    var d = a[b].split("=");
                    console.log(d);
                    this.config[d[0]] = d[1]
                }
            }
        };
        c._build = function() {
            this.templates = this._configXML.querySelectorAll("template");
            this.assets = this._configXML.querySelectorAll("asset");
            this.sections = this._configXML.querySelectorAll("section");
            this.states = this._configXML.querySelectorAll("state");
            var a = this._configXML.querySelectorAll("page");
            this.pages = Array(a.length);
            for (var b = this.pages.length - 1; 0 <= b; b--) {
                var d = a[b],
                    e = [],
                    c = d.querySelectorAll("section");
                if (null !== c)
                    for (var m = 0; m < c.length; m++) {
                        var n = c[m],
                            o = {
                                id: void 0,
                                states: void 0,
                                defaultState: void 0
                            };
                        o.id = n.attributes.id.value;
                        o.defaultState = n.attributes.default_state.value;
                        n = n.querySelector("states");
                        if (null !== n) n = n.attributes.id.value.split(","), console.log("statesQuery : ", n), o.states = n;
                        e.push(o)
                    }
                this.pages[b] = {
                    page: d,
                    sections: e,
                    states: []
                }
            }
            console.log("this.pages : ", this.pages)
        };
        c.hasPage = function(a) {
            for (var b = 0; b < this.pages.length; b++)
                if (this.pages[b].page.attributes.id.value == a) return !0;
            return !1
        };
        c.getPage = function(a) {
            for (var b = 0; b < this.pages.length; b++)
                if (this.pages[b].page.attributes.id.value == a) return this.pages[b];
            return null
        };
        c.getPageClass = function(a) {
            for (var b =
                this.templates.length - 1; 0 <= b; b--)
                if (this.templates[b].attributes.id.value == a) return this.templates[b].attributes.className.value;
            return null
        };
        c.getPageDefaultSection = function(a) {
            for (var b = void 0, d = this.pages.length - 1; 0 <= d; d--)
                if (this.pages[d].page.attributes.id.value == a && void 0 !== this.pages[d].page.attributes.default_section) b = this.pages[d].page.attributes.default_section.value;
            return b
        };
        c.getSections = function(a) {
            for (var b = [], d = this.pages.length - 1; 0 <= d; d--)
                if (this.pages[d].page.attributes.id.value ==
                    a) {
                    for (a = this.pages[d].sections.length - 1; 0 <= a; a--) {
                        var e = this.pages[d].sections[a].attributes.id.value,
                            c = this.pages[d].sections[a].attributes.default_state.value,
                            m = this.getStates(this.pages[d].page.attributes.id.value + e);
                        b.push({
                            id: e,
                            defaultState: c,
                            states: m
                        })
                    }
                    return b
                }
        };
        c.getStates = function(a) {
            for (var b = [], d = this.states.length - 1; 0 <= d; d--) this.states[d].attributes.parent_name.value == a && b.push(this.states[d].attributes.id.value);
            return b = 0 == b.length ? void 0 : b
        };
        c.getMainLoader = function() {
            return this._configXML.querySelector("pages").attributes.loader_page.value
        };
        c.getStateLoader = function(a) {
            return this.getPage(a).page.attributes.loader_page.value
        };
        c.getStateAssetNodes = function(a, b) {
            var d = this.getStatePagesToOpen(a, b),
                e = [];
            if (b)
                for (var c = 0; c < this.assets.length; c++) "true" == this.assets[c].attributes.loadfromStart.value && e.push(this.assets[c]);
            for (var m = [], c = 0; c < d.length; c++) m = m.concat(this.getPageAssetNodes(d[c]));
            for (c = 0; c < m.length; c++) this.hasAsset(e, m[c]) || null !== this.getAssetFromID(m[c]) && e.push(this.getAssetFromID(m[c]));
            return e
        };
        c.getPageAssetNodes = function(a) {
            a =
                this.getPageFromID(a).attributes.assets.value.split(",");
            1 == a.length && "" == a[0] && (a = []);
            return a
        };
        c.getPageFromID = function(a) {
            for (var b = 0; b < this.templates.length; b++)
                if (this.templates[b].attributes.id.value == a) return this.templates[b];
            return null
        };
        c.getAssetFromID = function(a) {
            for (var b = 0; b < this.assets.length; b++)
                if (this.assets[b].attributes.id.value == a) return this.assets[b];
            return null
        };
        c.hasAsset = function() {};
        c.getStatePagesToOpen = function(a, b) {
            void 0 == b && (b = !0);
            var d = this.getPage(a).page.attributes.open_pages.value.split(",");
            if (b) {
                var e = this._configXML.querySelector("pages");
                "" != e.attributes.permanent_pages.value && (e = e.attributes.permanent_pages.value.split(","), d = d.concat(e))
            }
            return d
        };
        c.getStatePagesToClose = function(a) {
            var b = [],
                d = this.getFullPagesList(),
                e = this.getPage(a);
            if ("all" == e.page.attributes.keep_pages.value) return b;
            var c = e.page.attributes.keep_pages.value.split(",");
            "" == e.page.attributes.keep_pages.value && (c = []);
            a = this.getStatePagesToOpen(a);
            c = c.concat(a);
            for (a = 0; a < d.length; a++) - 1 == c.indexOf(d[a]) && b.push(d[a]);
            return b
        };
        c.getFullPagesList = function() {
            for (var a = [], b = 0; b < this.templates.length; b++) a.push(this.templates[b].attributes.id.value);
            return a
        };
        c.getDefaultState = function() {
            return this.getVar("state")
        };
        c.getVar = function(a) {
            return this.config[a]
        };
        c.onConfigError = function() {
            console.log("Error Loading Config Data")
        }
    }
})();
(function() {
    var a = breelNS.getNamespace("generic.events").ListenerFunctions,
        c = breelNS.getNamespace("generic.core").ConfigSite,
        e = breelNS.getNamespace("generic.core").GlobalStateManager,
        b = breelNS.getNamespace("generic.core").AssetManager;
    breelNS.getNamespace("flyWell.core");
    var d = breelNS.getNamespace("generic.utils").Scheduler,
        f = breelNS.getNamespace("generic.animation").AnimationManager,
        g = breelNS.getNamespace("generic.copy").CopyManager;
    breelNS.getNamespace("generic.copy");
    breelNS.getNamespace("generic.copy");
    breelNS.getNamespace("generic.copy");
    var h = breelNS.getNamespace("generic.core");
    if (!h.Core) {
        var l = function() {
            this.assetManager = this.globalStateManager = this.config = null;
            this.assetImageRoot = void 0;
            this.sharingManager = this.soundManager = this.copyManager = null;
            this.stateObject = void 0;
            this.exportedXmlCopyDocument = this.xmlChildRetreiver = this.xmlCreator = null;
            this.localLang = "en"
        };
        h.Core = l;
        h = l.prototype;
        h.setup = function() {
            this.animationManager = f.create();
            this.scheduler = d.create();
            this.config = new c;
            this.globalStateManager =
                new e;
            this.assetManager = new b;
            this.copyManager = new g;
            this._onConfigLoadedBound = a.createListenerFunctionOnce(this, this._onConfigLoaded);
            a.addDOMListener(this.config, c.CONFIG_LOADED, this._onConfigLoadedBound);
            this._requestOnReadyStateChangeBound = this._requestOnReadyStateChange.bind(this)
        };
        h.load = function(a, b) {
            this.setCopyDocument(b);
            void 0 === a && (a = "../files/xml/config.xml");
            this.config.setup(a)
        };
        h._onConfigLoaded = function() {
            this.assetManager.init(this.assetImageRoot);
            this.globalStateManager.init();
            this.globalStateManager.setDefaultState();
            this.assetManager.updateAllStyleSheetsForPixelDensity();
            if (breelNS.productionMode) this.config.config.debug = !1, this.config.config.backend.state = "production";
            if (!this.config.config.debug) {
                var a = {};
                window.console = a;
                a.dir = function() {};
                a.debug = function() {};
                a.info = function() {};
                a.warn = function() {};
                a.log = function() {};
                a.trace = function() {};
                a.group = function() {};
                a.groupCollapsed = function() {};
                a.timeStamp = function() {};
                a.profile = function() {};
                a.profileEnd = function() {};
                a.error =
                    function() {}
            }
        };
        h.setCopyDocument = function(a) {
            this._req = new XMLHttpRequest;
            this._req.onreadystatechange = this._requestOnReadyStateChangeBound;
            this._req.open("GET", a, !0);
            this._req.send(null)
        };
        h._requestOnReadyStateChange = function() {
            switch (this._req.readyState) {
                case 4:
                    400 > this._req.status ? this.copyManager.setCopyDocument(JSON.parse(this._req.responseText)) : console.warn("Error Loading Copy File")
            }
        }
    }
})();
(function() {
    var a = breelNS.getNamespace("generic.events").EventDispatcher,
        c = breelNS.getNamespace("generic.events").ListenerFunctions,
        e = breelNS.getNamespace("generic.templates"),
        b;
    if (!e.ButtonGenerator) {
        var d = function() {
            this.element = this.id = void 0;
            this.expire = !1;
            this.life = void 0;
            this.lifeCount = 0;
            this._onMouseOutBound = this._onMouseOverBound = this._onButtonClickedBound = void 0
        };
        e.ButtonGenerator = d;
        a = d.prototype = new a;
        d.CLICK = "buttonClicked_";
        d.DOUBLE_CLICK = "buttonDoubleClicked_";
        d.MOUSE_OVER = "buttonOver_";
        d.MOUSE_OUT = "buttonOut_";
        a.setup = function(a, d, e, l) {
            b = breelNS.getNamespace(breelNS.projectName).singletons.siteManager;
            this.id = a;
            this.element = d;
            this.events = e;
            this.life = l;
            if (0 < this.life) this.expire = !0, this.lifeCount = 0;
            this._onButtonClickedBound = c.createListenerFunction(this, this._onButtonClicked);
            this._onButtonDoubleClickedBound = c.createListenerFunction(this, this._onButtonDoubleClicked);
            this._onMouseOverBound = c.createListenerFunction(this, this._onMouseOver);
            this._onMouseOutBound = c.createListenerFunction(this,
                this._onMouseOut);
            this.addAllEvents()
        };
        a.addAllEvents = function() {
            if (0 < this.events.length)
                for (var a = 0; a < this.events.length; a++) this.addEventByName(this.events[a]);
            else this.addEventByName("click")
        };
        a.removeAllEvents = function() {
            if (0 < this.events.length)
                for (var a = 0; a < this.events.length; a++) this.removeEventByName(this.events[a]);
            else this.removeEventByName("click")
        };
        a.addEventByName = function(a) {
            switch (a) {
                case "click":
                    c.addDOMListener(this.element, browserDetector.getButtonClickEventName(!0), this._onButtonClickedBound);
                    break;
                case "doubleClick":
                    c.addDOMListener(this.element, "dblclick", this._onButtonDoubleClickedBound);
                    break;
                case "mouseover":
                    c.addDOMListener(this.element, "mouseover", this._onMouseOverBound);
                    break;
                case "mouseout":
                    c.addDOMListener(this.element, "mouseout", this._onMouseOutBound)
            }
        };
        a.removeEventByName = function(a) {
            switch (a) {
                case "click":
                    c.removeDOMListener(this.element, browserDetector.getButtonClickEventName(!0), this._onButtonClickedBound);
                    break;
                case "doubleClick":
                    c.removeDOMListener(this.element, "dblclick",
                        this._onButtonDoubleClickedBound);
                    break;
                case "mouseover":
                    c.removeDOMListener(this.element, "mouseover", this._onMouseOverBound);
                    break;
                case "mouseout":
                    c.removeDOMListener(this.element, "mouseout", this._onMouseOutBound)
            }
        };
        a._onButtonClicked = function(a) {
            this.dispatchCustomEvent(d.CLICK + this.id, a);
            a = this.element.getAttribute("data-tracking");
            null !== a && "" != a && " " != a && void 0 !== b.analyticsManager && b.analyticsManager.gaTrackEvent("button", "click", a);
            this.lifeCount++;
            this.expire && this.lifeCount >= this.life && this.removeEventByName("click")
        };
        a._onButtonDoubleClicked = function(a) {
            this.dispatchCustomEvent(d.DOUBLE_CLICK + this.id, a);
            this.removeEventByName("doubleClick")
        };
        a._onMouseOver = function(a) {
            "ie" != browserDetector.getBrowserName && b.sound.buttonRollOver();
            this.dispatchCustomEvent(d.MOUSE_OVER + this.id, a)
        };
        a._onMouseOut = function(a) {
            this.dispatchCustomEvent(d.MOUSE_OUT + this.id, a)
        };
        a.destroy = function() {};
        d.create = function(a, b, e, c) {
            var k = new d;
            k.setup(a, b, e, c);
            return k
        }
    }
})();
(function() {
    var a = breelNS.getNamespace("generic.events").EventDispatcher;
    breelNS.getNamespace("generic.events");
    var c = breelNS.getNamespace("generic.templates").ButtonGenerator,
        e = breelNS.getNamespace("generic.templates");
    if (!e.ButtonAttacher) {
        var b = function() {
            this.buttons = {}
        };
        e.ButtonAttacher = b;
        a = b.prototype = new a;
        a.setupButtons = function() {
            for (var a = this.container.querySelectorAll("*[data-type='button']"), b = 0; b < a.length; b++) {
                var e = a[b],
                    h = e.getAttribute("data-button-events").split(","),
                    l = parseInt(e.getAttribute("data-button-event-life")),
                    k = e.getAttribute("data-button-event-name"),
                    e = new c.create(k, e, h, l);
                this.buttons[k] = e
            }
        };
        a.getButtonEventName = function(a, b) {
            var e;
            switch (a) {
                case "click":
                    e = c.CLICK;
                    break;
                case "doubleClick":
                    e = c.DOUBLE_CLICK;
                    break;
                case "mouseover":
                    e = c.MOUSE_OVER;
                    break;
                case "mouseout":
                    e = c.MOUSE_OUT
            }
            return e + b.id
        };
        a.attachButtEvents = function(a, b) {
            for (var e = a.events.length, c = 0; c < e; c++) {
                var l = a.events[c],
                    k = this.getButtonEventName(l, a);
                a.addEventListener(k, b[l])
            }
        };
        a.removeButtEvents = function(a, b) {
            for (var e = a.events.length,
                c = 0; c < e; c++) {
                var l = a.events[c],
                    k = this.getButtonEventName(l, a);
                a.removeEventListener(k, b[l])
            }
        };
        a.defineEvents = function() {};
        a.addButtonListeners = function() {};
        a.removeButtonListeners = function() {}
    }
})();
(function() {
    breelNS.getNamespace("generic.events");
    var a = breelNS.getNamespace("generic.core").GlobalStateManager,
        c = breelNS.getNamespace("generic.events").ListenerFunctions,
        e = breelNS.getNamespace("generic.core").StateManager,
        b = breelNS.getNamespace("generic.templates").ButtonAttacher,
        d = breelNS.getNamespace("generic.templates"),
        f;
    if (!d.BasicPage) {
        var g = function(a, b, d, e, c, g) {
            this.id = a;
            this.parentId = g;
            this.container = document.createElement("div");
            this.isOpened = !1;
            this.sections = {};
            this.sectionsIds = [];
            this.defaultSection =
                d;
            this.aSections = c;
            this.states = void 0;
            this.aStates = e;
            this.aDefaultState = b
        };
        d.BasicPage = g;
        b = g.prototype = new b;
        b.initialize = function(a) {
            f = breelNS.getNamespace(breelNS.projectName).singletons.siteManager;
            this.parseStatesAndSections();
            void 0 !== a && this.addTemplate(a);
            this.getDomElements();
            this.handleButtons();
            this._onResizeBound = c.createListenerFunction(this, this._onResize);
            c.addDOMListener(window, "resize", this._onResizeBound);
            this._onOrientationChangeBound = c.createListenerFunction(this, this._onOrientationChange);
            c.addDOMListener(window, "orientationchange", this._onOrientationChangeBound);
            this._onWindowFocusBound = c.createListenerFunction(this, this._onWindowFocus);
            c.addDOMListener(window, "focus", this._onWindowFocusBound)
        };
        b._onWindowFocus = function() {};
        b.getDomElements = function() {};
        b.handleButtons = function() {
            this.setupButtons();
            this.defineEvents();
            this.addButtonListeners()
        };
        b.setParams = function() {};
        b.setHistoryData = function() {};
        b.addTemplate = function(a) {
            this.template = f.assetManager.getAsset(a);
            void 0 === this.template ||
                null === this.template || this.container.appendChild(this.template)
        };
        b.parseStatesAndSections = function() {
            void 0 !== this.aSections && this.getSections(this.aSections, this.aSections);
            void 0 !== this.aStates && this.setupStates(this.aDefaultState, this.aStates)
        };
        b.open = function() {
            void 0 !== f.analyticsManager && f.analyticsManager.gaTrackPage(this.id, "/" + this.id);
            this.setOpened()
        };
        b.close = function() {
            this.setClosed()
        };
        b.setOpened = function() {
            this.isOpened = !0;
            this.dispatchCustomEvent(a.END_PAGE_OPEN, {
                page: this
            })
        };
        b.setClosed =
            function() {
                this.isOpened = !1;
                this.dispatchCustomEvent(a.END_PAGE_CLOSE, {
                    page: this
                });
                this.destroy()
            };
        b.destroy = function() {
            c.removeDOMListener(window, "resize", this._onResizeBound);
            this.removeButtonListeners();
            if (this.sections)
                for (var a in this.sections) this.sections[a].destroy()
        };
        b.checkNodePosition = function(a, b) {
            a.compareDocumentPosition(this.container) & Node.DOCUMENT_POSITION_PRECEDING ? this.insertNodeAfter(a, this.container) : a.compareDocumentPosition(this.container) & Node.DOCUMENT_POSITION_FOLLOWING &&
                !(b.compareDocumentPosition(this.container) & Node.DOCUMENT_POSITION_PRECEDING) && this.insertNodeAfter(a, this.container)
        };
        b.insertNodeAfter = function(a, b) {
            a.parentNode.insertBefore(b, a.nextSibling)
        };
        b.getSections = function(a) {
            this.numSections = a.length - 1;
            for (var b = 0; b < a.length; b++) {
                var d = a[b];
                this.sectionsIds.push(d.id);
                this.createSection(d, b)
            }
        };
        b.createSection = function() {
            console.warn("create section function has not been overwritten for this page.")
        };
        b.initSections = function(a) {
            for (var b in this.sections) {
                var d =
                    this.sections[b];
                d.setParams(a);
                d.initialize()
            }
        };
        b.setupStates = function(a, b) {
            this.stateManager = e.create(b, a, this.container, this.parentId + "." + this.id);
            this._onStateChangedBound = c.createListenerFunction(this, this._onStateChanged);
            this._onStateScrollBound = c.createListenerFunction(this, this._onStateScroll);
            this.stateManager.addEventListener(e.STATE_OPEN, this._onStateChangedBound);
            this.stateManager.addEventListener(e.STATE_MANAGER_CALLED_SCROLL, this._onStateScrollBound);
            this.stateManager.beginStateManager()
        };
        b._onStateChanged = function() {};
        b._onStateScroll = function(a) {
            this.scrollToSection(a.detail)
        };
        b.setContainerId = function(a) {
            this.container.id = a
        };
        b._onOrientationChange = function() {};
        b._onResize = function() {
            console.log("RRRRRRR");
            console.log("RRRRRRR");
            console.log("RRRRRRR")
        };
        b.getContainer = function() {
            return this.container
        }
    }
})();
(function() {
    breelNS.getNamespace("generic.events");
    var a = breelNS.getNamespace("generic.core").StateManager,
        c = breelNS.getNamespace("generic.events").ListenerFunctions,
        e = breelNS.getNamespace("generic.animation").DomElementOpacityTween,
        b = breelNS.getNamespace("generic.templates").ButtonAttacher,
        d = breelNS.getNamespace("generic.templates");
    if (!d.BasicState) {
        var f = function(a, b, d) {
            this.id = a;
            this.parentContainer = b;
            this.container = d;
            this.isOpened = !1;
            this.buttons = {}
        };
        d.BasicState = f;
        b = f.prototype = new b;
        b.setParams =
            function() {};
        b.initialize = function() {
            this.parentContainer.appendChild(this.container);
            this._onResizeBound = c.createListenerFunction(this, this._onResize);
            c.addDOMListener(window, "resize", this._onResizeBound)
        };
        b.open = function() {
            this.setOpened()
        };
        b.close = function(a) {
            this.setClosed(a)
        };
        b.setOpened = function() {
            this.isOpened = !0;
            this.dispatchCustomEvent(a.END_STATE_OPEN, {
                state: this
            })
        };
        b.setClosed = function(b) {
            this.isOpened = !1;
            this.dispatchCustomEvent(a.END_STATE_CLOSE, {
                state: this,
                params: b
            });
            this.destroy()
        };
        b.animateOpacity = function(a, b, d, c, f, n, o) {
            c = void 0 === c ? 1 : c;
            n = void 0 === n ? 0 : n;
            f = void 0 === f ? TweenHelper.sin.EaseIn : f;
            switch (a) {
                case "in":
                    e.createWithAnimation(this.container, void 0 === b ? 0 : b, aOpacity, c, f, n, o);
                    break;
                case "out":
                    e.createWithAnimation(this.container, void 0 === b ? 1 : b, aOpacity, c, f, n, o)
            }
        };
        b.destroy = function() {
            c.removeDOMListener(window, "resize", this._onResizeBound);
            this.removeButtonListeners()
        };
        b._onResize = function() {};
        b.getContainer = function() {
            return this.container
        };
        b.getParentContainer = function() {
            return this.parentContainer
        }
    }
})();
(function() {
    var a = breelNS.getNamespace("generic.templates").BasicPage;
    breelNS.getNamespace("generic.events");
    var c = breelNS.getNamespace("generic.templates");
    if (!c.LoaderPage) {
        var e = function(b, d, e, c, h) {
            this._loadingPercent = 0;
            a.call(this, b, d, e, c, h)
        };
        c.LoaderPage = e;
        c = e.prototype = new a;
        e.PERCENTAGE_UPDATE = "percentageUpdate";
        c.initialize = function() {};
        c.setLoadingPercent = function(a) {
            1 < a && (a = 1);
            this._loadingPercent = a;
            console.log("aPercent : ", a)
        };
        c.loadComplete = function() {}
    }
})();
(function() {
    var a = breelNS.getNamespace("generic.events").ListenerFunctions,
        c = breelNS.getNamespace("generic.controllers");
    if (!c.MouseMoveController) {
        var e = function() {
            this._moveTimeout = this.container = null;
            this._isMoving = !1;
            this._moveTimeDelay = 1E3
        };
        c.MouseMoveController = e;
        c = e.prototype;
        c.setup = function(b) {
            this.container = b;
            this.onMouseMoveBound = a.createListenerFunction(this, this.onMouseMove);
            a.addDOMListener(this.container, "mousemove", this.onMouseMoveBound)
        };
        c.onMouseMove = function() {
            var a = this;
            null !==
                this._moveTimeout && clearTimeout(this._moveTimeout);
            this._moveTimeout = setTimeout(function() {
                a.mouseIsStationary()
            }, this._moveTimeDelay);
            this._isMoving || this.mouseIsMoving()
        };
        c.mouseIsMoving = function() {
            this._isMoving = !0
        };
        c.mouseIsStationary = function() {
            this._isMoving = !1
        };
        e.create = function(a) {
            var d = new e;
            d.setup(a);
            return d
        }
    }
})();
(function() {
    var a = breelNS.getNamespace("generic.events").EventDispatcher,
        c = breelNS.getNamespace("generic.sharing"),
        e, b;
    if (!c.SharingManager) {
        var d = function() {
            this.pixelDensity = this._twitter = this._FB = null;
            this.domain = document.location.hostname;
            this.sitePath = document.location.pathname;
            this.imagePath = this.sitePath + "files/images/share_image.jpg";
            this.httpRef = "http"
        };
        c.SharingManager = d;
        a = d.prototype = new a;
        d.BITLY_LOGIN = "allForThis";
        d.BITLY_API_KEY = "R_72ac3db7208175b9d2e6cdb540335bcc";
        d.BITLY_ACCESS_TOKEN =
            "084a11e1c17c04d8deb68d9a25932fda01d3a5da";
        d.TWITTER_BASE_URL = "https://twitter.com/intent/tweet?url=";
        a.setup = function(a) {
            e = breelNS.getNamespace(breelNS.projectName).singletons;
            b = e.siteManager;
            this.pixelDensity = b.assetManager.getPixelDensityInt();
            this.setupShareObjects();
            void 0 !== a && this.setFacebookObj(a)
        };
        a.setupShareObjects = function() {
            this.defaultFacebookShare();
            this.defaultTwitterShare();
            this.defaultGoogleShare();
            this.defaultPinterestShare()
        };
        a.defaultFacebookShare = function() {
            this._facebookShareObj = {
                name: b.copyManager.getCopy("generic/sharing/facebook/title"),
                caption: "",
                descr: b.copyManager.getCopy("generic/sharing/facebook/desc"),
                url: b.copyManager.getCopy("generic/sharing/facebook/url"),
                shortUrl: ""
            }
        };
        a.defaultTwitterShare = function() {
            this._twitterShareObj = {
                name: b.copyManager.getCopy("generic/sharing/twitter/title"),
                descr: b.copyManager.getCopy("generic/sharing/twitter/desc"),
                hashTags: b.copyManager.getCopy("generic/sharing/twitter/hashTags"),
                url: b.copyManager.getCopy("generic/sharing/twitter/url"),
                shortUrl: ""
            }
        };
        a.defaultGoogleShare = function() {
            this._googlePlusShareObj = {
                url: b.copyManager.getCopy("generic/sharing/facebook/url"),
                baseUrl: "https://plus.google.com/share?url="
            }
        };
        a.defaultPinterestShare = function() {
            this._pinterestShareObj = {
                url: b.copyManager.getCopy("generic/sharing/pinterest/url"),
                descr: b.copyManager.getCopy("generic/sharing/pinterest/desc"),
                baseUrl: "http://pinterest.com/pin/create/button/?url=",
                imageUrl: "http://flywell.ba.com/preview/socials/BAFlyWell.jpg"
            }
        };
        a.updateShareObject = function(a,
            b, d) {
            switch (a.toLowerCase()) {
                case "facebook":
                    this._facebookShareObj[b] = d;
                    break;
                case "twitter":
                    this._twitterShareObj[b] = d;
                    break;
                case "google":
                    this._googlePlusShareObj[b] = d;
                    break;
                case "pinterest":
                    this._pinterestShareObj[b] = d
            }
        };
        a.createShortenUrl = function(a, b) {
            var e;
            e = new XMLHttpRequest;
            e.onreadystatechange = function() {
                switch (e.readyState) {
                    case 4:
                        if (400 > e.status) try {
                            console.log("shortenRq.responseText : ", e.responseText);
                            var d = JSON.parse(e.responseText);
                            if ("OK" == d.status_txt) {
                                var c = encodeURIComponent(d.data.url);
                                b.call(this, c)
                            } else b.call(this, a)
                        } catch (l) {
                            console.error("ERROR : Problem with response from bit.ly ", l), b.call(this, a)
                        } else console.error("ERROR: Could not bit.ly shorten url : " + a)
                }
            };
            try {
                var c = "",
                    k = document.location.pathname,
                    m = k.split("/"),
                    k = k.replace(m[m.length - 1], ""),
                    c = c + "http://api.bitly.com/v3/shorten" + ("?apiKey=" + d.BITLY_API_KEY),
                    c = c + ("&access_token=" + d.BITLY_ACCESS_TOKEN + "&longUrl="),
                    c = c + encodeURIComponent(a);
                console.log("shorten URL : " + c);
                e.open("GET", c, !0);
                e.send(null)
            } catch (n) {
                console.error("Error :: there was a problem shortening the URL with bit.ly : ",
                    n), b.call(this, a)
            }
        };
        a.setFacebookObj = function(a) {
            this._FB = a
        };
        a.postToFBWall = function(a) {
            var b = this._facebookShareObj.url.replace("http", this.httpRef);
            this._FB && (void 0 == a ? this._FB.ui({
                method: "feed",
                link: b,
                name: this._facebookShareObj.name,
                description: this._facebookShareObj.descr,
                display: "popup"
            }) : this._FB.ui({
                method: "feed",
                name: this._facebookShareObj.name,
                picture: a,
                link: b,
                description: this._facebookShareObj.descr,
                display: "popup"
            }))
        };
        a.setupTweetButton = function(a) {
            var b;
            b = "" + d.TWITTER_BASE_URL;
            b += this._twitterShareObj.url +
                "&hashtags=";
            b += this._twitterShareObj.hashTags + "&text=";
            b += encodeURIComponent(this._twitterShareObj.descr);
            a = a.parentNode;
            void 0 != a && (a.setAttribute("href", b), a.setAttribute("target", "_blank"))
        };
        a.postGoogleShare = function() {
            console.log("Google plus share : ", this._googlePlusShareObj.url);
            window.open(this._googlePlusShareObj.baseUrl + this._googlePlusShareObj.url, "popupwindow", "scrollbars=yes,width=600,height=400").focus()
        };
        a.renderNativeGooglePlusBtn = function(a) {
            gapi.plusone.go(a)
        };
        a.renderNativeGooglePlusFollowBtn =
            function(a) {
                gapi.follow.go(a)
            };
        a.renderNativeTweetButton = function() {
            twttr.widgets.load()
        };
        a.renderNativeFbButton = function(a) {
            FB.XFBML.parse(a)
        }
    }
})();
(function() {
    var a = breelNS.getNamespace("generic.events").EventDispatcher,
        c = breelNS.getNamespace("generic.events").ListenerFunctions,
        e = breelNS.getNamespace("generic.backend");
    if (!e.BackendHttpRequest) {
        var b = function() {
            this._init()
        };
        e.BackendHttpRequest = b;
        a = b.prototype = new a;
        b.LOADED = "loaded";
        b.ERROR = "error";
        a._init = function() {
            this._sendString = this._openString = this._data = this._loader = this._url = null;
            this._multipart = !1;
            this._callback = this._contentType = this._boundary = null;
            return this
        };
        a.setup = function(a,
            b, e, c, l, k) {
            breelNS.getNamespace(breelNS.projectName);
            this._type = void 0 === a ? "POST" : a;
            this._openString = b;
            this._sendString = void 0 === e ? null : e;
            if (this._multipart = c ? c : !1) this._boundary = l;
            this._contentType = void 0 === k ? "application/x-www-form-urlencoded" : k
        };
        a.load = function() {
            this._loader = "Microsoft Internet Explorer" == browserName ? 10 > fullVersion ? new ActiveXObject("Microsoft.XMLHTTP") : new XMLHttpRequest : new XMLHttpRequest;
            this._loader.open(this._type, this._openString, !0);
            this._loader.onreadystatechange = c.createListenerFunction(this,
                this._onReadyStateChange);
            this._multipart ? this._loader.setRequestHeader("Content-Type", "multipart/form-data; boundary=" + this._boundary) : this._loader.setRequestHeader("Content-type", this._contentType);
            this._loader.send(this._sendString);
            return this
        };
        a._onReadyStateChange = function() {
            switch (this._loader.readyState) {
                case 4:
                    400 > this._loader.status ? (this._data = this._loader.responseText, this.dispatchCustomEvent(b.LOADED, this._data)) : this.dispatchCustomEvent(b.ERROR, null)
            }
        };
        a.destroy = function() {
            if (null !==
                this._loader) this._loader.onreadystatechange = function() {}, this._loader = null;
            this._data = this._url = null
        };
        b.create = function(a, e, c, h, l, k) {
            var m = new b;
            m.setup(a, e, c, h, l, k);
            return m
        }
    }
})();
(function() {
    var a = breelNS.getNamespace("generic.events").EventDispatcher,
        c = breelNS.getNamespace("generic.events").ListenerFunctions,
        e = breelNS.getNamespace("generic.controllers");
    if (!e.KeyboardController) {
        var b = function() {};
        e.KeyboardController = b;
        a = b.prototype = new a;
        a.setup = function(a) {
            a = void 0 === a ? document : a;
            this.onKeyPressBound = c.createListenerFunction(this, this.onKeyPress);
            this.onKeyDownBound = c.createListenerFunction(this, this.onKeyDown);
            c.addDOMListener(a, "keypress", this.onKeyPressBound);
            c.addDOMListener(a,
                "keydown", this.onKeyDownBound)
        };
        a.onKeyPress = function() {};
        a.onKeyDown = function() {};
        b.create = function(a) {
            var e = new b;
            e.setup(a);
            return e
        }
    }
})();
(function() {
    var a = breelNS.getNamespace("generic.events").EventDispatcher,
        c = breelNS.getNamespace("generic.events").ListenerFunctions,
        e = breelNS.getNamespace("generic.controllers");
    if (!e.MicrophoneController) {
        var b = function() {
            this.recognition = void 0;
            this.paused = this.started = this.supported = !1;
            this.onMicrophoneStartBound = c.createListenerFunction(this, this.onMicrophoneStart);
            this.onMicrophoneErrorBound = c.createListenerFunction(this, this.onMicrophoneError);
            this.onMicrophoneEndBound = c.createListenerFunction(this,
                this.onMicrophoneEnd);
            this.onMicrophoneAudioStartBound = c.createListenerFunction(this, this.onMicrophoneAudioStart);
            this.onMicrophoneAudioEndBound = c.createListenerFunction(this, this.onMicrophoneAudioEnd);
            this.onMicrophoneResultBound = c.createListenerFunction(this, this.onMicrophoneResult)
        };
        e.MicrophoneController = b;
        a = b.prototype = new a;
        a.setup = function(a, b, e) {
            if (window.SpeechRecognition) try {
                this.recognition = new SpeechRecognition
            } catch (h) {
                console.log("Browser has no webkitSpeechRecognition support");
                console.log("error : ",
                    h);
                return
            } else if (window.speechRecognition) try {
                    this.recognition = new speechRecognition
                } catch (l) {
                    console.log("Browser has no webkitSpeechRecognition support");
                    console.log("error : ", l);
                    return
                } else if (window.webkitSpeechRecognition) try {
                    this.recognition = new webkitSpeechRecognition
                } catch (k) {
                    console.log("Browser has no webkitSpeechRecognition support");
                    console.log("error : ", k);
                    return
                } else {
                    console.log("Browser has no SpeechRecognition support");
                    return
                }
                this.supported = !0;
            this.recognition.continuous = a;
            this.recognition.interimResults =
                b;
            this.recognition.lang = e;
            c.addDOMListener(this.recognition, "start", this.onMicrophoneStartBound);
            c.addDOMListener(this.recognition, "error", this.onMicrophoneErrorBound);
            c.addDOMListener(this.recognition, "end", this.onMicrophoneEndBound);
            c.addDOMListener(this.recognition, "audiostart", this.onMicrophoneAudioStartBound);
            c.addDOMListener(this.recognition, "audioend", this.onMicrophoneAudioEndBound);
            c.addDOMListener(this.recognition, "result", this.onMicrophoneResultBound)
        };
        a.startMic = function() {
            if (this.supported) try {
                this.recognition.start()
            } catch (a) {
                console.log("can not start the mic :: e : ",
                    a)
            }
        };
        a.stopMic = function() {
            if (this.supported) try {
                this.recognition.stop()
            } catch (a) {
                console.log("can not stop the mic :: e : ", a)
            }
        };
        a.togglePause = function() {
            this.paused = this.paused ? !1 : !0
        };
        a.onMicrophoneStart = function() {
            this.started = !0
        };
        a.onMicrophoneError = function() {
            this.started = !1
        };
        a.onMicrophoneEnd = function() {
            this.started = !1
        };
        a.onMicrophoneAudioStart = function() {};
        a.onMicrophoneAudioEnd = function() {};
        a.onMicrophoneResult = function(a) {
            console.log("onMicrophoneResult :: aEvent.results ", a.results)
        };
        b.create =
            function(a, e, c) {
                var h = new b;
                h.setup(a, e, c);
                return h
            }
    }
})();
(function() {
    var a = breelNS.getNamespace("spotify.common.utils.genresdata");
    if (!a.GenresData) {
        var c = {
            id_0: {
                id: "id_0",
                backendID: 0,
                copyID: "common.genres.id_0",
                color: "#83b601"
            },
            id_1: {
                id: "id_1",
                backendID: 1,
                copyID: "common.genres.id_1",
                color: "#039568"
            },
            id_2: {
                id: "id_2",
                backendID: 2,
                copyID: "common.genres.id_2",
                color: "#3bb1e3"
            },
            id_3: {
                id: "id_3",
                backendID: 3,
                copyID: "common.genres.id_3",
                color: "#116275"
            },
            id_4: {
                id: "id_4",
                backendID: 4,
                copyID: "common.genres.id_4",
                color: "#b7e2f5"
            },
            id_5: {
                id: "id_5",
                backendID: 5,
                copyID: "common.genres.id_5",
                color: "#f7d363"
            },
            id_6: {
                id: "id_6",
                backendID: 6,
                copyID: "common.genres.id_6",
                color: "#ff8a6e"
            },
            id_7: {
                id: "id_7",
                backendID: 7,
                copyID: "common.genres.id_7",
                color: "#98ceb7"
            },
            id_8: {
                id: "id_8",
                backendID: 8,
                copyID: "common.genres.id_8",
                color: "#fae6db"
            },
            id_9: {
                id: "id_9",
                backendID: 9,
                copyID: "common.genres.id_9",
                color: "#ec607b"
            }
        };
        c.list = [c.id_0, c.id_1, c.id_2, c.id_3, c.id_4, c.id_5, c.id_6, c.id_7, c.id_8, c.id_9];
        c.genreIdToClassName = function(a) {
            if (0 === a) return "pop";
            if (1 === a) return "dance";
            if (2 === a) return "hiphop";
            if (3 === a) return "rock";
            if (4 === a) return "jazz";
            if (5 === a) return "country";
            if (6 === a) return "latin";
            if (7 === a) return "reggae";
            if (8 === a) return "screen";
            if (9 === a) return "world"
        };
        c.getItemFromProp = function(a, b) {
            for (var d = c.list.length, f = 0; f < d; f++)
                if (c.list[f][a] === b) return c.list[f]
        };
        a.GenresData = c
    }
})();
(function() {
    var a = breelNS.getNamespace("spotify.common.model.data.createplaylist");
    if (!a.CreatePlaylistSend) {
        var c = function(a, b) {
            this.playlistName = a;
            this.songIDs = b
        };
        c.prototype.getParams = function() {
            return {
                playlistName: this.playlistName,
                songIDs: this.songIDs.join(", ")
            }
        };
        a.CreatePlaylistSend = c
    }
})();
(function() {
    var a = breelNS.getNamespace("spotify.common.model.data.error");
    if (!a.ResponseError) a.ResponseError = function(a, e, b) {
        this.status = a;
        this.errorThrown = e;
        this.loadObj = b
    }
})();
(function() {
    var a = breelNS.getNamespace("spotify.common.model.data.search");
    if (!a.SearchSend) {
        var c = function(a, b) {
            this.str = a;
            this.type = b
        };
        c.TYPE_DEFAULT = "default";
        c.TYPE_ARTIST = "artist";
        c.prototype.getParams = function() {
            var a = {};
            this.type === c.TYPE_ARTIST ? a.artistID = this.str : a.search = this.str;
            return a
        };
        c.prototype.modifyURL = function(a) {
            var b;
            b = this.type === c.TYPE_DEFAULT ? "artist,track" : "track";
            a = a.split("{type}").join(b);
            return a.split("{search}").join(this.str)
        };
        a.SearchSend = c
    }
})();
(function() {
    var a = breelNS.getNamespace("spotify.common.model.data.userdata");
    if (!a.UserDataSend) {
        var c = function(a, b) {
            this.index = a;
            this.qty = b
        };
        c.prototype.getParams = function() {
            return {
                index: this.index,
                qty: this.qty
            }
        };
        a.UserDataSend = c
    }
})();
(function() {
    var a = breelNS.getNamespace("spotify.common.model.data.userdata");
    if (!a.PeopleSeachSend) {
        var c = function(a, b) {
            this.type = 3;
            this.index = 0;
            this.qty = b;
            this.search = a
        };
        c.prototype.getParams = function() {
            return {
                type: this.type,
                index: this.index,
                qty: this.qty,
                search: this.search
            }
        };
        a.PeopleSeachSend = c
    }
})();
(function() {
    var a = breelNS.getNamespace("spotify.common.model.data.userdata");
    if (!a.CountrySearchSend) {
        var c = function(a, b) {
            this.type = 2;
            this.index = 0;
            this.qty = b;
            this.search = a
        };
        c.prototype.getParams = function() {
            return {
                type: this.type,
                index: this.index,
                qty: this.qty,
                search: this.search
            }
        };
        a.CountrySearchSend = c
    }
})();
(function() {
    var a = breelNS.getNamespace("spotify.common.model.data.userdata");
    if (!a.AgencySearchSend) {
        var c = function(a, b) {
            this.type = 1;
            this.index = 0;
            this.qty = b;
            this.search = a
        };
        c.prototype.getParams = function() {
            return {
                type: this.type,
                index: this.index,
                qty: this.qty,
                search: this.search,
                agencyIndex: this.search
            }
        };
        a.AgencySearchSend = c
    }
})();
(function() {
    var a = breelNS.getNamespace("spotify.common.model.data.userdata");
    if (!a.CannesSearchSend) {
        var c = function(a) {
            this.index = this.type = 0;
            this.qty = a;
            this.search = 0
        };
        c.prototype.getParams = function() {
            return {
                type: this.type,
                index: this.index,
                qty: this.qty,
                search: this.search,
                agencyIndex: this.search
            }
        };
        a.CannesSearchSend = c
    }
})();
(function() {
    var a = breelNS.getNamespace("spotify.common.model.data.userdata");
    if (!a.GetMatchSend) {
        var c = function(a) {
            this.userID = a
        };
        c.prototype.getParams = function() {
            console.log("User ID : ", this.userID);
            return {
                userID: this.userID
            }
        };
        a.GetMatchSend = c
    }
})();
(function() {
    var a = breelNS.getNamespace("spotify.common.model.data.submitsong");
    if (!a.SubmitSongSend) {
        var c = function(a, b, d, c) {
            this.songID = a;
            this.coverURL = b;
            this.song = d;
            this.artist = c
        };
        c.prototype.getParams = function() {
            return {
                songID: this.songID,
                coverURL: this.coverURL,
                song: this.song,
                artist: this.artist
            }
        };
        a.SubmitSongSend = c
    }
})();
(function() {
    var a = breelNS.getNamespace("spotify.common.model.data.updateuser");
    if (!a.UpdateUserSend) {
        var c = function(a, b, d, c, g) {
            this.firstname = a;
            this.surname = b;
            this.agency = d;
            this.profession = c;
            this.country = g
        };
        c.prototype.getParams = function() {
            return {
                name: {
                    first: this.firstname,
                    last: this.surname
                },
                agency: this.agency,
                profession: this.profession,
                country: this.country
            }
        };
        a.UpdateUserSend = c
    }
})();
(function() {
    var a = breelNS.getNamespace("spotify.common.model.data.getspotifycover");
    if (!a.GetSpotifyCoverSend) {
        var c = function(a, b) {
            this.type = a;
            this.id = b
        };
        c.TYPE_ARTIST = "artist";
        c.TYPE_ALBUM = "album";
        c.TYPE_TRACK = "track";
        c.prototype.getParams = function() {};
        c.prototype.modifyURL = function(a) {
            a = a.split("{type}").join(this.type);
            return a.split("{id}").join(this.id)
        };
        a.GetSpotifyCoverSend = c
    }
})();
(function() {
    var a = breelNS.getNamespace("spotify.common.model.data.getagencies");
    if (!a.GetAgenciesSend) {
        var c = function() {};
        c.prototype.getParams = function() {};
        a.GetAgenciesSend = c
    }
})();
(function() {
    var a = breelNS.getNamespace("spotify.common.model.data.statistics");
    if (!a.StatisticsDataSend) {
        var c = function(a) {
            if (a) this.type = a.type, this.extra = a.extra
        };
        c.prototype.getParams = function() {
            switch (this.type) {
                case 0:
                    return {
                        type: 0
                    };
                case 1:
                    return {
                        type: 1,
                        agencyIndex: this.extra
                    };
                case 2:
                    return {
                        type: 2,
                        country: this.extra
                    };
                case 3:
                    return {
                        type: -1 === this.extra ? 0 : 3,
                        profession: this.extra
                    }
            }
        };
        a.StatisticsDataSend = c
    }
})();
(function() {
    var a = breelNS.getNamespace("spotify.common.model.backendmanager");
    if (!a.ServiceID) a.ServiceID = {
        LOGIN_FACEBOOK: "login_facebook",
        LOGIN_LINKEDIN: "login_linkedin",
        LOGIN_DELEGATE: "login_delegate",
        LOGIN_EMAIL: "login_email",
        UPDATE_USER: "update_user",
        SEARCH: "search",
        SUBMIT_SONG: "submit_song",
        MATCH_SONG: "match_song",
        CREATE_PLAYLIST: "create_playlist",
        GET_SPOTIFY_COVER: "get_spoitfy_cover",
        GET_AGENCIES: "get_agencies",
        DELETE_ACCOUNT: "delete_account",
        SIGNOUT: "signout",
        UPLOAD_PROFILE_IMAGE: "upload_profile_image",
        DELETE_PROFILE_IMAGE: "delete_profile_image",
        LOAD_USER: "load_user",
        MATCH: "match",
        PLAYLIST: "playlist",
        GET_ALL_USERS: "get_all_users",
        GET_USERS: "data_users",
        GET_AGENCIES_LIST: "get_agencies_list",
        GET_COUNTRY_LIST: "get_country_list",
        GET_RANDOM_DATA: "get_random_data",
        SEARCH_PEOPLE: "search_people",
        GET_MATCH: "get_match",
        GET_STATISTICS: "get_statistics",
        GET_STATISTICS_LIST: "get_statistics_list"
    }
})();
(function() {
    var a = breelNS.getNamespace("spotify.common.model.backendmanager");
    if (!a.ServiceData) {
        var c = breelNS.getNamespace("spotify.common.model.backendmanager").ServiceID,
            e = {
                getSpotifyCoverSuccess: function(a, d, e, c, h) {
                    if ("success" === e) try {
                        d = {
                            status: {
                                isOK: !0,
                                errorCode: 0,
                                errorMsg: "no error"
                            },
                            data: {
                                coverURL: d.thumbnail_url
                            }
                        }
                    } catch (l) {
                        e = 'Can\'t parse "thumbnail_url" from data'
                    }
                    h(a, d, e, c)
                },
                searchSuccess: function(a, d, e, c, h) {
                    if ("success" === e) {
                        var l, k, m, n, o;
                        try {
                            k = Math.min(d.artists.items.length, 3)
                        } catch (p) {
                            k =
                                0
                        }
                        var q;
                        0 < k && (q = []);
                        for (l = 0; l < k; l++) {
                            q[l] = {};
                            try {
                                q[l].id = d.artists.items[l].id
                            } catch (r) {
                                console.warn(r);
                                e = 'Can\'t parse "id" from artists data';
                                h(a, d, e, c);
                                return
                            }
                            try {
                                q[l].name = d.artists.items[l].name
                            } catch (t) {
                                console.warn(t);
                                e = 'Can\'t parse "name" from artists data';
                                h(a, d, e, c);
                                return
                            }
                            try {
                                q[l].imageURL = d.artists.items[l].images && 0 < d.artists.items[l].images.length ? d.artists.items[l].images[0].url : void 0
                            } catch (s) {
                                console.warn(s);
                                e = 'Can\'t parse "image url" from artists data';
                                h(a, d, e, c);
                                return
                            }
                        }
                        try {
                            k =
                                Math.min(d.tracks.items.length, 20)
                        } catch (A) {
                            k = 0
                        }
                        var u;
                        0 < k && (u = []);
                        for (l = 0; l < k; l++) {
                            u[l] = {};
                            try {
                                u[l].id = d.tracks.items[l].id
                            } catch (v) {
                                console.warn(v);
                                e = 'Can\'t parse "id" from tracks data';
                                h(a, d, e, c);
                                return
                            }
                            try {
                                u[l].name = d.tracks.items[l].name
                            } catch (w) {
                                console.warn(w);
                                e = 'Can\'t parse "name" from tracks data';
                                h(a, d, e, c);
                                return
                            }
                            try {
                                m = d.tracks.items[l].artists ? d.tracks.items[l].artists.length : 0;
                                n = "";
                                for (o = 0; o < m; o++) n += d.tracks.items[l].artists[o].name, o < m - 1 && (n += ", ");
                                u[l].artist = n
                            } catch (x) {
                                console.warn(x);
                                e = 'Can\'t parse "artist" from tracks data';
                                h(a, d, e, c);
                                return
                            }
                            try {
                                u[l].imageURL = d.tracks.items[l].album && d.tracks.items[l].album.images && 0 < d.tracks.items[l].album.images.length ? d.tracks.items[l].album.images[0].url : void 0
                            } catch (z) {
                                console.warn(z);
                                e = 'Can\'t parse "image url" from tracks data';
                                h(a, d, e, c);
                                return
                            }
                        }
                        d = {
                            status: {
                                isOK: !0,
                                errorCode: 0,
                                errorMsg: "no error"
                            },
                            data: {
                                artists: q,
                                tracks: u
                            }
                        }
                    }
                    h(a, d, e, c)
                },
                mode: "",
                baseURL: "",
                baseURLDummyData: ""
            };
        e[c.LOGIN_FACEBOOK] = {
            url: "/api/auth/facebook?callback=spotify_loginCallback",
            callback: "spotify_loginCallback"
        };
        e[c.LOGIN_LINKEDIN] = {
            url: "/api/authentication/linkedin"
        };
        e[c.LOGIN_EMAIL] = {
            url: "/api/auth/email",
            type: "POST",
            dataType: "json",
            addCachebuster: !1
        };
        e[c.UPDATE_USER] = {
            url: "/api/users/update",
            urlDummyData: "backenddummydata/updateuser.json",
            type: "POST",
            dataType: "json",
            addCachebuster: !0
        };
        e[c.SEARCH] = {
            url: "https://api.spotify.com/v1/search?q={search}&type={type}",
            urlDummyData: "https://api.spotify.com/v1/search?q={search}&type={type}",
            type: "GET",
            dataType: "json",
            addCachebuster: !1,
            onSuccess: e.searchSuccess
        };
        e[c.SUBMIT_SONG] = {
            url: "/api/songs/submit",
            urlDummyData: "backenddummydata/submitsong.json",
            type: "POST",
            dataType: "json",
            addCachebuster: !0
        };
        e[c.MATCH_SONG] = {
            url: "/api/users/match.json",
            urlDummyData: "backenddummydata/matchsong.json",
            type: "POST",
            dataType: "json",
            addCachebuster: !0
        };
        e[c.CREATE_PLAYLIST] = {
            url: "/api/playlists/create",
            urlDummyData: "backenddummydata/createplaylist.json",
            type: "POST",
            dataType: "json",
            addCachebuster: !0
        };
        e[c.GET_SPOTIFY_COVER] = {
            url: "https://embed.spotify.com/oembed/?url=spotify%3a{type}:{id}",
            urlDummyData: "https://embed.spotify.com/oembed/?url=spotify%3a{type}:{id}",
            type: "GET",
            dataType: "JSONP",
            addCachebuster: !1,
            onSuccess: e.getSpotifyCoverSuccess
        };
        e[c.GET_AGENCIES] = {
            url: "/api/agencies.json",
            urlDummyData: "backenddummydata/getagencies.json",
            type: "GET",
            dataType: "json",
            addCachebuster: !1
        };
        e[c.DELETE_ACCOUNT] = {
            url: "/api/users/delete",
            urlDummyData: "backenddummydata/deleteaccount.json",
            type: "GET",
            dataType: "json",
            addCachebuster: !1
        };
        e[c.SIGNOUT] = {
            url: "/api/auth/signout",
            urlDummyData: "backenddummydata/signout.json",
            type: "GET",
            dataType: "json",
            addCachebuster: !1
        };
        e[c.UPLOAD_PROFILE_IMAGE] = {
            url: "/api/users/update-image",
            urlDummyData: "backenddummydata/uploadimage.json",
            type: "POST",
            dataType: "json",
            addCachebuster: !0,
            processData: !1,
            contentType: !1
        };
        e[c.DELETE_PROFILE_IMAGE] = {
            url: "/api/users/remove-image",
            urlDummyData: "backenddummydata/deleteimage.json",
            type: "GET",
            dataType: "json",
            addCachebuster: !0
        };
        e[c.LOAD_USER] = {
            url: "/api/users/me",
            urlDummyData: "backenddummydata/loaduser.json",
            type: "GET",
            dataType: "json",
            addCachebuster: !0
        };
        e[c.MATCH] = {
            url: "/api/songs/match",
            urlDummyData: "backenddummydata/match_{type}.json",
            type: "GET",
            dataType: "json",
            addCachebuster: !0
        };
        e[c.PLAYLIST] = {
            url: "/api/playlists/create",
            urlDummyData: "backenddummydata/playlist.json",
            type: "POST",
            dataType: "json",
            addCachebuster: !0
        };
        e[c.GET_USERS] = {
            url: "/api/data/users.json",
            urlDummyData: "backenddummydata/match_{type}.json",
            type: "GET",
            dataType: "json",
            addCachebuster: !0
        };
        e[c.SEARCH_PEOPLE] = {
            url: "/api/data/search.json",
            urlDummyData: "backenddummydata/match_{type}.json",
            type: "GET",
            dataType: "json",
            addCachebuster: !0
        };
        e[c.GET_AGENCIES_LIST] = {
            url: "/api/data/agencies.json",
            urlDummyData: "backenddummydata/match_{type}.json",
            type: "GET",
            dataType: "json",
            addCachebuster: !0
        };
        e[c.GET_COUNTRY_LIST] = {
            url: "/api/data/countries.json",
            urlDummyData: "backenddummydata/match_{type}.json",
            type: "GET",
            dataType: "json",
            addCachebuster: !0
        };
        e[c.GET_RANDOM_DATA] = {
            url: "/api/data/random.json",
            urlDummyData: "backenddummydata/match_{type}.json",
            type: "GET",
            dataType: "json",
            addCachebuster: !0
        };
        e[c.GET_MATCH] = {
            url: "/api/data/match.json",
            urlDummyData: "backenddummydata/match_{type}.json",
            type: "GET",
            dataType: "json",
            addCachebuster: !0
        };
        e[c.GET_ALL_USERS] = {
            url: "/api/data/users.json",
            urlDummyData: "backenddummydata/match_{type}.json",
            type: "GET",
            dataType: "json",
            addCachebuster: !0
        };
        e[c.GET_STATISTICS] = {
            url: "/api/data/statistics.json",
            urlDummyData: "",
            type: "GET",
            dataType: "json",
            addCachebuster: !0
        };
        e[c.GET_STATISTICS_LIST] = {
            url: "/api/data/toplist.json",
            urlDummyData: "",
            type: "GET",
            dataType: "json",
            addCachebuster: !0
        };
        e.getData = function(a) {
            var a = this[a],
                d = a["url" +
                    this.mode],
                e = this["baseURL" + this.mode]; - 1 === d.indexOf("http://") && -1 === d.indexOf("https://") && (d = e + d);
            return {
                url: d,
                type: a.type,
                dataType: a.dataType,
                addCachebuster: a.addCachebuster,
                onSuccess: a.onSuccess,
                processData: a.processData,
                contentType: a.contentType
            }
        };
        a.ServiceData = e
    }
})();
(function() {
    var a = breelNS.getNamespace("spotify.common.model.backendmanager");
    if (!a.BackendManager) a.BackendManager = function() {
        breelNS.getNamespace("spotify.common.model.backendmanager");
        var a = breelNS.getNamespace("spotify.common.model.backendmanager").ServiceData,
            e = breelNS.getNamespace("spotify.common.model.data.error").ResponseError,
            b = breelNS.getNamespace("spotify.common.pages.alertmessage").AlertMessageID,
            d = !1,
            f = [],
            g, h = -1,
            l, k, m = this;
        this.load = function(a, b, e, c) {
            if (!a) throw Error('Argument "serviceID" is missing');
            if (!e) throw Error('Argument "callbackSuccess" is missing');
            if (!c) throw Error('Argument "callbackError" is missing');
            f.push({
                serviceID: a,
                params: b,
                callbackSuccess: e,
                callbackError: c
            });
            d || n()
        };
        var n = function() {
                if (!d) {
                    if (breelNS.getNamespace(breelNS.projectName).singletons.siteManager.globalStateManager._blocker) breelNS.getNamespace(breelNS.projectName).singletons.siteManager.globalStateManager._blocker.style.display = "block";
                    d = !0;
                    g = f.shift();
                    var a = o(g.serviceID);
                    g.url = a.url;
                    k = (new Date).getTime();
                    if (g.url) {
                        try {
                            g.paramsObj =
                                g.params.getParams()
                        } catch (b) {
                            g.paramsObj = g.params
                        }
                        try {
                            g.url = g.params.modifyURL(g.url)
                        } catch (e) {}
                        h++;
                        var c = h;
                        l = setTimeout(function() {
                            q(c, void 0, "timeout", void 0)
                        }, 5E3);
                        $.ajax({
                            url: g.url,
                            data: g.paramsObj,
                            type: a.type,
                            dataType: a.dataType,
                            processData: a.processData,
                            contentType: a.contentType,
                            success: function(b, d, e) {
                                if (a.onSuccess) a.onSuccess(c, b, d, e, p);
                                else p(c, b, d, e)
                            }
                        }).fail(function(a, b, d) {
                            console.log("ERROR");
                            q(c, a, b, d)
                        }.bind(this))
                    }
                }
            },
            o = function(b) {
                var d = a.getData(b);
                if (d) {
                    if (d.addCachebuster) d.url =
                        d.url + (/\?/.test(d.url) ? "&" : "?") + (new Date).getTime();
                    return d
                }
                console.error("Can't find serviceID \"" + b + '".', g)
            },
            p = function(a, c, f) {
                if (a === h && d) g.loadTimeMs = (new Date).getTime() - k, "success" === f ? c && c.status ? !c.status.isOK && (void 0 === c.status.errorCode || 1 === c.status.errorCode || 4 === c.status.errorCode) ? (console.warn("PAGE RESTART", c.status), t(), a = {
                    id: b.PAGE_RESTART,
                    from: "callback_directly",
                    callbackRef: m,
                    callbackOK: m.showPageRestartAlert_callbackOKHandler,
                    callbackOKParams: ["error_page_restart"]
                }, breelNS.getNamespace(breelNS.projectName).singletons.siteManager.globalStateManager.setPage("AlertMessage",
                    a)) : g.callbackSuccess(c) : (console.warn(c), g.callbackError(new e("error", 'Invalid "data.status" object', g))) : g.callbackError(new e(f, void 0, g)), r()
            },
            q = function(a, b, c, f) {
                if (a === h && d) g.loadTimeMs = (new Date).getTime() - k, g.callbackError(new e(c, f, g)), r()
            },
            r = function() {
                clearTimeout(l);
                delete g.params;
                delete g.callbackError;
                delete g.callbackSuccess;
                g = void 0;
                d = !1;
                t();
                0 < f.length && n()
            },
            t = function() {
                if (breelNS.getNamespace(breelNS.projectName).singletons.siteManager.globalStateManager._blocker) breelNS.getNamespace(breelNS.projectName).singletons.siteManager.globalStateManager._blocker.style.display =
                    "none"
            };
        this.showPageRestartAlert_callbackOKHandler = function() {
            location.reload()
        }
    }
})();
breelNS.defineClass(breelNS.projectName + ".loader.LoaderAnim", "generic.events.EventDispatcher", function(a) {
    var c;
    a.init = function(a) {
        c = breelNS.getNamespace(breelNS.projectName).singletons.siteManager;
        this._canvas = document.createElement("canvas");
        this._canvas.width = 400;
        this._canvas.height = 100;
        this._canvas.style.position = "absolute";
        this._canvas.style.left = "50%";
        this._canvas.style.marginLeft = "-200px";
        this._canvas.style.top = "50%";
        this._canvas.style.marginTop = "-150px";
        this._canvas.style.zIndex = 5;
        this._container =
            a;
        this._ctx = this._canvas.getContext("2d");
        this._targetPer = this._percentage = 0;
        this._particles = [];
        this._hasEnded = !1;
        this._container.appendChild(this._canvas);
        this._numSteps = 30;
        this._span = 1 / this._numSteps;
        this._efIndex = c.scheduler.addEF(this, this.render, []);
        return this
    };
    a.setPercentage = function(a) {
        this._targetPer = a
    };
    a.render = function() {
        this._percentage += 0.05 * (this._targetPer - this._percentage);
        for (var a = 15, b = 25, d = c.settings.colors; this._percentage > this._particles.length * this._span;) {
            var a = 25 * Math.sin(this._particles.length /
                    this._numSteps * Math.PI),
                b = 25 * Math.sin(this._particles.length / this._numSteps * Math.PI),
                a = (this._particles.length + 1) * this._span * this._canvas.width + (-a + Math.random() * (a - -a)),
                b = 50 + (-b + Math.random() * (b - -b)),
                f = d[Math.floor(Math.random() * d.length)],
                g = 3 + 3 * Math.random();
            this._particles.push(new Dot(a, b, f, g))
        }
        this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
        for (d = 0; d < this._particles.length - 1; d++) {
            a = this._particles[d];
            if (d == this._particles.length - 2) break;
            if (a.hasConnection) this._ctx.save(), this._ctx.globalAlpha =
                a.alpha, this._ctx.beginPath(), b = this._particles[d + 1], this._ctx.moveTo(a.x, a.y), this._ctx.strokeStyle = b.color, this._ctx.lineTo(b.x, b.y), this._ctx.stroke(), this._ctx.restore()
        }
        for (d = 0; d < this._particles.length - 1; d++) a = this._particles[d], a.update(), this._ctx.save(), this._ctx.globalAlpha = a.alpha, this._ctx.beginPath(), this._ctx.translate(a.x, a.y), this._ctx.fillStyle = a.color, this._ctx.arc(0, 0, a.size, 0, 2 * Math.PI, !1), this._ctx.fill(), this._ctx.restore();
        if (this._particles.length == this._numSteps && 1 == this._targetPer &&
            !this._hasEnded) this._hasEnded = !0, c.scheduler.delay(this, this.delayDispatch, [], 1E3)
    };
    a.delayDispatch = function() {
        this.dispatchCustomEvent("animComplete")
    };
    a.stop = function() {
        c.scheduler.removeEF(this._efIndex)
    };
    a.getCanvas = function() {
        return this._canvas
    }
});
(function() {
    Dot = function(a, c, e, b) {
        this.tx = a;
        this.ty = c;
        this.x = a + (-10 + 20 * Math.random());
        this.y = c + (-10 + 20 * Math.random());
        this.color = e;
        this.size = 0;
        this.targetSize = b;
        this.alpha = 0;
        this.easing = 0.1 + -0.05 * Math.random();
        this.hasConnection = 0.66 < Math.random()
    };
    Dot.prototype.update = function() {
        this.x += (this.tx - this.x) * this.easing;
        this.y += (this.ty - this.y) * this.easing;
        this.alpha += (1 - this.alpha) * this.easing;
        this.size += (this.targetSize - this.size) * this.easing
    }
})();
breelNS.defineClass(breelNS.projectName + ".common.profileParticles.expandedProfile.ExpandedProfileStartView", "generic.events.EventDispatcher", function(a) {
    breelNS.getNamespace("generic.events");
    a.init = function(a) {
        breelNS.getNamespace(breelNS.projectName);
        this._el = a;
        this._tweens = [];
        this._topWrapperEl = a.querySelector(".topWrapper");
        this._middleWrapperEl = a.querySelector("#middleWrapper");
        this._middleWrapperHolderEl = a.querySelector("#middleWrapperHolder");
        this._fullNameEl = this._topWrapperEl.querySelector(".fullName");
        this._agencyEl = this._topWrapperEl.querySelector(".agencyTitle");
        this._locationEl = this._topWrapperEl.querySelector(".location");
        this._locationHolderEl = this._topWrapperEl.querySelector(".locationHolder");
        this._albumCoverEl = this._middleWrapperEl.querySelector(".albumCover");
        this._profileImageEl = this._middleWrapperEl.querySelector(".profileImage");
        this._locationHolderEl = this._topWrapperEl.querySelector(".locationHolder")
    };
    a.setData = function(a) {
        this._fullNameEl.innerHTML = a.firstName + " " + a.lastName;
        this._locationHolderEl.style.display =
            "block";
        this._agencyEl.innerHTML = a.agency && "" != a.agency ? a.agency : "SPEAKER";
        a.country && "" != a.country ? this._locationEl.innerHTML = a.country : this._locationHolderEl.style.display = "none";
        this._albumCoverEl.style.backgroundImage = "url(" + a.imgAlbum + ")";
        this._profileImageEl.style.backgroundImage = "url(" + a.largeImg + ")"
    };
    a.show = function() {
        this.removeAllTweens();
        this._el.style.display = "block";
        this._locationHolderEl.style.marginLeft = -(this._locationEl.clientWidth / 2 + 15) + "px"
    };
    a.hide = function() {
        this.removeAllTweens();
        this._el.style.display = "none"
    };
    a._animate = function(a, e) {
        this.removeAllTweens();
        var b = (new TWEEN.Tween({
            value: 0
        })).to({
            value: 1
        }, 800).easing(TWEEN.Easing.Exponential.Out).onUpdate(function() {
            e.style.opacity = this.value;
            a.style.opacity = 1 - this.value
        });
        b.start();
        b.onComplete(function() {});
        this._tweens.push(b)
    };
    a.removeAllTweens = function() {
        for (var a = 0; a < this._tweens.length; a++) null !== this._tweens[a] && this._tweens[a].stop()
    }
});
breelNS.defineClass(breelNS.projectName + ".common.profileParticles.expandedProfile.ExpandedProfileBottomView", "generic.events.EventDispatcher", function(a) {
    breelNS.getNamespace("generic.events");
    var c = breelNS.getNamespace("spotify.common.utils.genresdata").GenresData;
    a.init = function(a) {
        breelNS.getNamespace(breelNS.projectName);
        this._el = a;
        this._genreEl = a.querySelector(".genre");
        this._genreIconEl = a.querySelector(".genreIcon");
        this._artistEl = a.querySelector(".artist");
        this._songTitleEl = a.querySelector(".songTitle");
        this._genreHolderEl = a.querySelector(".genreHolder")
    };
    a.setData = function(a) {
        this._data = a;
        this._genreEl.innerHTML = a.songGenres;
        this._artistEl.innerHTML = a.artistName;
        this._songTitleEl.innerHTML = a.songTitle;
        this._genreIconClass = "genreIcon_" + a.songGenresID;
        $(this._genreIconEl).addClass(this._genreIconClass);
        (a = c.getItemFromProp("backendID", a.songGenresID)) && $(this._genreEl).css("color", a.color)
    };
    a.show = function() {
        this._el.style.display = "block";
        this._genreHolderEl.style.marginLeft = -(this._genreEl.clientWidth /
            2 + 15) + "px"
    };
    a.hide = function() {
        $(this._genreIconEl).removeClass(this._genreIconClass);
        this._el.style.display = "none"
    }
});
breelNS.defineClass(breelNS.projectName + ".common.profileParticles.ExpandedProfileController", "generic.events.EventDispatcher", function(a, c, e) {
    var b = breelNS.getNamespace("generic.events").ListenerFunctions,
        d;
    e.ON_BG_CLICK = "expandedProfileOnBgClick";
    a.init = function(a) {
        d = breelNS.getNamespace(breelNS.projectName).singletons.siteManager;
        this._el = a;
        this.expandedViewWrapper = this._el.querySelector(".expandedViewWrapper");
        this.middleWrapper = this._el.querySelector("#middleWrapper");
        this._bgTouchEl = a.querySelector(".backgroundTouchEl");
        a = this._el.querySelector(".closeBtn");
        this._onBackgroundClickBound = b.createListenerFunction(this, this._onBackgroundClick);
        this._bgTouchEl.addEventListener("click", this._onBackgroundClickBound);
        a && a.addEventListener("click", this._onBackgroundClickBound)
    };
    a._onBackgroundClick = function() {
        this.dispatchCustomEvent(e.ON_BG_CLICK)
    };
    a.setData = function(a) {
        console.log("Set Expanded Data : ");
        console.log("Set Expanded Data : ");
        console.log("Set Expanded Data : ");
        console.log("Set Expanded Data : ");
        console.log("Set Expanded Data : ",
            a);
        this.expandedProfileStartView.setData(a);
        this.expandedProfileBottomView.setData(a)
    };
    a.show = function() {
        this._el.style.opacity = 1;
        this._el.style.display = "block";
        this.expandedProfileStartView.show();
        this.expandedProfileBottomView.show();
        this.onResize();
        this.onResize();
        d.globalStateManager.getPage("Landing")._controller.lock(!0)
    };
    a.hide = function() {
        CSSanimate.to(this._el, {
            opacity: 0
        }, {
            ease: "easeOutSine",
            duration: 400,
            delay: 0
        }, function() {
            this._onHided()
        }.bind(this));
        this.expandedProfileStartView.hide();
        this.expandedProfileBottomView.hide()
    };
    a._onHided = function() {
        this._el.style.display = "none";
        d.globalStateManager.getPage("Landing")._controller.lock(!1)
    };
    a.onResize = function() {
        var a = 0.25 * window.innerHeight;
        this.expandedViewWrapper.style.marginTop = -(this.expandedViewWrapper.clientHeight / 2) + "px";
        this.middleWrapper.style.marginLeft = 0.5 * -a + "px";
        this.middleWrapper.style.height = a + "px";
        this.middleWrapper.style.width = a + "px"
    }
});
breelNS.defineClass(breelNS.projectName + ".common.profileParticles.particles.DomParticle", "generic.events.EventDispatcher", function(a) {
    var c;
    a.init = function(a, b) {
        c = breelNS.getNamespace(breelNS.projectName).singletons.siteManager;
        this.ay = this.ax = this.vy = this.vx = this.y = this.x = 0;
        this.vel = 0.1;
        this.decreasing = b.velocityDecreasing;
        this.color = c.settings.colors[Math.floor(Math.random() * c.settings.colors.length)];
        this.isLocked = !1;
        this._innerAdjust = 10;
        this.params = b;
        this.closestGravityChild = this._data = null;
        this._inHoverMode =
            this.pullMode = !1;
        this._index = void 0;
        this.startAnimation = !0;
        this.endAnimation = !1;
        this.relativeParticle = null;
        this.currentRotateRadian = this.startRotateRadian = this.totalRadianDistance = this.currentDistanceToGravity = this.startDistanceToGravity = void 0;
        this.currentScale = 1;
        this.colorOverlay = null;
        this.el = document.createElement("div");
        this.el.className = "particle";
        this.el.style.height = 2 * this.size + "px";
        this.el.style.width = 2 * this.size + "px";
        this.el.style.left = 0.5 * a.clientWidth - this.size + "px";
        this.el.style.top = 0.5 *
            a.clientHeight - this.size + "px";
        this.parentDims = {
            h: a.clientHeight,
            w: a.clientWidth
        };
        a.appendChild(this.el);
        this.parent = a;
        return this
    };
    a.createColorOverlay = function() {
        this.colorOverlay = document.createElement("div");
        this.colorOverlay.className = "colorOverlay";
        this.visibleContainer.appendChild(this.colorOverlay);
        this.colorOverlay.style.background = c.settings.colors[this._data.genre];
        this.onResize({
            w: window.innerWidth,
            h: window.innerHeight
        })
    };
    a.setPullMode = function(a) {
        this.pullMode = a
    };
    a.setIndex = function(a) {
        this._index =
            a
    };
    a.getIndex = function() {
        return this._index
    };
    a.remove = function() {
        this.parent.removeChild(this.el)
    };
    a.getCenterPoint = function() {
        return {
            x: this.parentDims.w / 2 - this.size,
            y: this.parentDims.h / 2 - this.size
        }
    };
    a.setGravityPoint = function(a) {
        this.closestGravityChild = a
    };
    a.getDistanceTo = function(a) {
        return this.distanceTo(a)
    };
    a.checkParticlePull = function() {
        dist = Math.sqrt(this.distanceTo(this.closestGravityChild));
        if (void 0 === this.startDistanceToGravity) this.startDistanceToGravity = dist;
        this.currentDistanceToGravity =
            dist;
        var a = this.size + this.closestGravityChild.size,
            b = this._getNormal(this.closestGravityChild, this, dist),
            d = b.y * (1 - a / dist) * this.acc;
        this.ax += b.x * (1 - a / dist) * this.acc;
        this.ay += d
    };
    a.checkParticle = function(a) {
        this.x == a.x && this.y == a.y && (this.x += 1 + -2 * Math.random(), this.y += -1 + 2 * Math.random());
        dist = Math.sqrt(this.distanceTo(a));
        var b = this.size + a.size;
        dist > b && (dist = b);
        var d = this._getNormal(this, a, dist),
            a = d.x * (1 - dist / b) * this.acc,
            b = d.y * (1 - dist / b) * this.acc;
        if (isNaN(a)) debugger;
        this.ax += a;
        this.ay += b
    };
    a.update =
        function() {
            if (!this.isLocked) {
                this.vx += this.ax;
                this.vy += this.ay;
                this.x += this.vx;
                this.y += this.vy;
                if (isNaN(this.x)) debugger;
                if (!(0 == this.ax && 0 == this.ay)) this.ax = this.ay = 0;
                this.vx *= this.decreasing;
                this.vy *= this.decreasing
            }
        };
    a._getNormal = function(a, b, d) {
        a = {
            x: (a.x - b.x) / d,
            y: (a.y - b.y) / d
        };
        if (isNaN(a.x)) debugger;
        return a
    };
    a.render = function() {
        this.el.style.height = 2 * this.size + "px";
        this.el.style.width = 2 * this.size + "px";
        this.el.style.left = 0.5 * this.parentDims.w - this.size + "px";
        this.el.style.top = 0.5 * this.parentDims.h -
            this.size + "px";
        var a = Math.round(this.x),
            b = Math.round(this.y);
        this.el.style.WebkitTransform = "translate3d(" + a + "px," + b + "px,0px)";
        this.el.style.borderRadius = this.size + "px"
    };
    a.distanceTo = function(a) {
        return (this.x - a.x) * (this.x - a.x) + (this.y - a.y) * (this.y - a.y)
    };
    a.getClosestPointInCircle = function(a, b) {
        var d = b.x - (this.x + b.x),
            c = b.y - (this.y + b.y),
            g = b.x + a * (d / Math.sqrt(Math.pow(d, 2) + Math.pow(c, 2))),
            d = b.y + a * (c / Math.sqrt(Math.pow(d, 2) + Math.pow(c, 2)));
        return {
            x: g,
            y: d
        }
    }
});
breelNS.defineClass(breelNS.projectName + ".common.profileParticles.particles.ColorParticle", breelNS.projectName + ".common.profileParticles.particles.DomParticle", function(a, c) {
    var e;
    a.init = function(a, d) {
        e = breelNS.getNamespace(breelNS.projectName).singletons.siteManager;
        c.init.call(this, a, d);
        this.acc = d.colorAcceleration;
        this.el.style.background = this.color;
        this.parent = a;
        this.endAnimationDuration = this.params.colorParticleEndAnimationDuration;
        this.currentOpacity = 1;
        this.type = "color";
        this.detractTimer = null;
        this.parentWidthCenter = this.parent.clientWidth / 2;
        this.parentHeightCenter = this.parent.clientHeight / 2;
        this.onResize({
            w: this.parent.clientWidth,
            h: this.parent.clientHeight
        }, d, !1);
        return this
    };
    a.render = function() {
        var a = Math.round(this.x),
            d = Math.round(this.y);
        if (this.endAnimation && (this.currentOpacity -= 1 * (1 / this.endAnimationDuration), this.el.style.opacity = this.currentOpacity, 0.0010 > this.currentOpacity)) this.el.style.opacity = 0, this.endAnimation = !1;
        this.el.style[e.animationManager.currentTransformStr] = e.animationManager.getTranslateStr(a,
            d)
    };
    a.onResize = function(a, d, c) {
        var e = a.w * d.colorParticleMultiplier;
        this.size = e + Math.random() * (e + d.sizeDifference - e);
        this.parentWidthCenter = a.w / 2;
        this.parentHeightCenter = a.h / 2;
        this.el.style.height = 2 * this.size + "px";
        this.el.style.width = 2 * this.size + "px";
        this.el.style.left = this.parentWidthCenter - this.size + "px";
        this.el.style.top = this.parentHeightCenter - this.size + "px";
        this.el.style.borderRadius = this.size + "px";
        c && this.setPullMode(!0)
    }
});
breelNS.defineClass(breelNS.projectName + ".common.profileParticles.particles.ProfileParticle", breelNS.projectName + ".common.profileParticles.particles.DomParticle", function(a, c, e) {
    breelNS.getNamespace("generic.animation");
    breelNS.getNamespace("generic.math");
    var b;
    e.ON_CLICK = "centerParticleOnClick";
    e.ON_REMOVE = "centerParticleOnRemove";
    e.TRIGGER_NEW = "profileParticleTriggerNew";
    a.init = function(a, e) {
        b = breelNS.getNamespace(breelNS.projectName).singletons.siteManager;
        c.init.call(this, a, e);
        this.acc = e.profileAcceleration;
        this.hoverAdjust = this._innerAdjust = 0;
        this.gravityChildren = [];
        this.currentInnerElScale = this.currentOpacity = 1;
        this.currentScale = 0.1;
        this.startHoverSize = 0;
        this.triggered = !1;
        this.currentAddedHoverSize = 0;
        this.radianPos = void 0;
        this.type = "profile";
        this.endAnimationDuration = this.params.profileParticleEndAnimationDuration;
        this.visibleContainer = document.createElement("div");
        this.visibleContainer.className = "visibleContainer";
        this.albumEl = document.createElement("div");
        this.albumEl.className = "albumContainer";
        this.innerEl = document.createElement("div");
        this.innerEl.className = "innerEl";
        this.innerEl.style.height = 2 * this.size - this._innerAdjust + "px";
        this.innerEl.style.width = 2 * this.size - this._innerAdjust + "px";
        this.bgInnerEl = document.createElement("div");
        this.bgInnerEl.className = "bgInnerEl";
        this.innerEl.appendChild(this.bgInnerEl);
        this.detailEl = document.createElement("div");
        this.detailEl.className = "detailEl";
        this.detailCopyHolder = document.createElement("div");
        this.detailCopyHolder.className = "detailCopyHolder";
        this.profileName = document.createElement("h3");
        this.profileName.className = "profileName";
        this.lowDetail = document.createElement("h5");
        this.lowDetail.className = "lowDetail";
        this.detailCopyHolder.appendChild(this.profileName);
        this.detailCopyHolder.appendChild(this.lowDetail);
        this.detailEl.appendChild(this.detailCopyHolder);
        this.parentDims = {
            h: a.clientHeight,
            w: a.clientWidth
        };
        this.deactivatePullTimer = null;
        this.visibleContainer.appendChild(this.innerEl);
        this.visibleContainer.appendChild(this.detailEl);
        this.el.appendChild(this.albumEl);
        this.el.appendChild(this.visibleContainer);
        this.hoverEl = document.createElement("div");
        this.hoverEl.className = "hoverEl";
        this.el.appendChild(this.hoverEl);
        this.hoverEl.addEventListener("mouseover", this._onMouseOver.bind(this), !1);
        this.hoverEl.addEventListener("mouseout", this._onMouseOut.bind(this), !1);
        this.hoverEl.addEventListener("click", this._onClick.bind(this), !1);
        this.checkPullOnChildren = this.childrenInPullMode = !0;
        this.el.style.opacity = 0;
        this.onResize(this.parentDims, e);
        return this
    };
    a.setRadianDistance =
        function(a) {
            this.totalRadianDistance = -a;
            console.log("totalradiandistance: ", this.totalRadianDistance);
            this.startRotateRadian = a
        };
    a.addGravityChild = function(a) {
        this.gravityChildren.push(a)
    };
    a._onMouseOver = function() {
        if (!this._inHoverMode) this._inHoverMode = !0, this.checkPullOnChildren = !1, console.log("check pull on children false !!!")
    };
    a._onMouseOut = function() {
        if (this._inHoverMode) this._inHoverMode = !1
    };
    a._onClick = function(a) {
        a.preventDefault();
        this.dispatchCustomEvent(e.ON_CLICK, {
            data: this._data
        })
    };
    a.activatePullOnGravityChildren =
        function() {
            for (var a = 0; a < this.gravityChildren.length; a++) console.log("activate pull"), this.gravityChildren[a].setPullMode(!0);
            this.childrenInPullMode = !0
        };
    a.deactivatePullOnGravityChildren = function() {
        for (var a = 0; a < this.gravityChildren.length; a++) console.log("deactivate pull"), this.gravityChildren[a].setPullMode(!1);
        this.childrenInPullMode = !1
    };
    a.setData = function(a) {
        if (this._data = a) this.innerEl.style.backgroundImage = a ? "url(" + a.loaded.profile.src + ")" : "url(/desktop/files/images/1x/common/profile_noimage.png)",
            this.profileName.innerHTML = a.firstName, this.lowDetail.innerHTML = a.agency
    };
    a.getData = function() {
        return this._data
    };
    a.positionDetailEl = function() {
        var a = this.profileName.clientHeight + this.lowDetail.clientHeight + 4;
        this.detailCopyHolder.style.height = a + "px";
        this.detailCopyHolder.style.marginTop = -a / 2 + "px"
    };
    a.render = function() {
        var a = mat4.create();
        this.el.style.height = 2 * this.size + "px";
        this.el.style.width = 2 * this.size + "px";
        this.visibleContainer.style.height = 2 * this.size - this.hoverAdjust + "px";
        this.visibleContainer.style.width =
            2 * this.size - this.hoverAdjust + "px";
        this.innerEl.style.height = 2 * this.size - this.hoverAdjust - this._innerAdjust + "px";
        this.innerEl.style.width = 2 * this.size - this.hoverAdjust - this._innerAdjust + "px";
        this.el.style.left = 0.5 * this.parentDims.w - this.size + "px";
        this.el.style.top = 0.5 * this.parentDims.h - this.size - this.params.topAdjust + "px";
        this.visibleContainer.style.left = this.hoverAdjust / 2 + "px";
        this.visibleContainer.style.top = this.hoverAdjust / 2 + "px";
        var c = Math.round(this.x),
            g = Math.round(this.y);
        this.currentRotateRadian =
            0;
        if (this.startAnimation) {
            this.currentScale += 0.41 * (1 - this.currentScale);
            if (null !== this.colorOverlay) this.colorOverlay.style.opacity = 1 - this.currentScale;
            if (this.currentScale >= this.params.startAnimationZoomVisibility) this.el.style.opacity = 1;
            if (0.99 <= this.currentScale) this.startAnimation = !1, this.positionDetailEl()
        } else if (this.endAnimation) {
            this.currentScale += 0.17 * (0 - this.currentScale);
            if (0.4 > this.currentScale && !this.triggered) this.dispatchCustomEvent(e.TRIGGER_NEW), this.triggered = !0;
            this.el.style.opacity =
                this.currentScale;
            if (0.1 >= this.currentScale) this.dispatchCustomEvent(e.ON_REMOVE), this.endAnimation = !1, this.el.style.display = "none"
        } else if (this._inHoverMode) {
            if (this.currentInnerElScale += 0.41 * (1.4 - this.currentInnerElScale), this.innerEl.style[b.animationManager.currentTransformStr] = "scale(" + this.currentInnerElScale + "," + this.currentInnerElScale + ")", this.currentAddedHoverSize++, this.currentInnerElScale >= 1.4 - 0.1) this.detailEl.style.opacity = 1, this.bgInnerEl.style.opacity = 1
        } else if (0 < this.currentAddedHoverSize) this.currentInnerElScale +=
            0.41 * (1 - this.currentInnerElScale), this.innerEl.style[b.animationManager.currentTransformStr] = "scale(" + this.currentInnerElScale + "," + this.currentInnerElScale + ")", this.currentAddedHoverSize--, this.detailEl.style.opacity = 0, this.bgInnerEl.style.opacity = 0;
        mat4.identity(a);
        mat4.translate(a, vec3.create([c, g, 0]));
        mat4.scale(a, vec3.create([this.currentScale, this.currentScale, this.currentScale]));
        mat4.rotateZ(a, this.currentRotateRadian);
        c = "";
        for (g = 0; g < a.length; g++) c += a[g], g != a.length - 1 && (c += ",");
        this.el.style[b.animationManager.currentTransformStr] =
            "matrix3d(" + c + ")";
        this.innerEl.style.borderRadius = this.size - this.hoverAdjust / 2 - this._innerAdjust / 2 + "px"
    };
    a.onResize = function(a) {
        this.size = Math.round(a.w * this.params.profileParticleMultiplier);
        if (this.size < this.params.profileMinWidth / 2) this.size = this.params.profileMinWidth / 2;
        this.el.style.height = 2 * this.size + "px";
        this.el.style.width = 2 * this.size + "px";
        this.visibleContainer.style.height = 2 * this.size - this.hoverAdjust + "px";
        this.visibleContainer.style.width = 2 * this.size - this.hoverAdjust + "px";
        this.innerEl.style.height =
            2 * this.size - this.hoverAdjust - this._innerAdjust + "px";
        this.innerEl.style.width = 2 * this.size - this.hoverAdjust - this._innerAdjust + "px";
        this.el.style.left = 0.5 * a.w - this.size + "px";
        this.el.style.top = 0.5 * a.h - this.size - this.params.topAdjust + "px";
        this.visibleContainer.style.left = this.hoverAdjust / 2 + "px";
        this.visibleContainer.style.top = this.hoverAdjust / 2 + "px";
        if (null !== this.colorOverlay) this.colorOverlay.style.borderRadius = this.size - this.hoverAdjust / 2 + "px";
        this.innerEl.style.borderRadius = this.size - this.hoverAdjust /
            2 - this._innerAdjust / 2 + "px";
        this.bgInnerEl.style.borderRadius = this.size - this.hoverAdjust / 2 - this._innerAdjust / 2 + "px";
        this.positionDetailEl()
    }
});
breelNS.defineClass(breelNS.projectName + ".common.profileParticles.particles.CenterParticle", breelNS.projectName + ".common.profileParticles.particles.DomParticle", function(a, c, e) {
    breelNS.getNamespace("generic.animation");
    var b;
    e.ON_CLICK = "centerParticleOnClick";
    e.ON_REMOVE = "centerParticleOnRemove";
    a.init = function(a, e, g) {
        b = breelNS.getNamespace(breelNS.projectName).singletons.siteManager;
        c.init.call(this, a, e);
        this.acc = e.profileAcceleration;
        this.hoverAdjust = this._innerAdjust = 0;
        this.gravityChildren = [];
        this.mode = g;
        this.currentScale = "intro" == this.mode ? 1.2 : 0.1;
        this.type = "center";
        this.endAnimationDuration = this.params.centerParticleEndAnimationDuration;
        this.visibleContainer = document.createElement("div");
        this.visibleContainer.className = "visibleContainer";
        this.albumEl = null;
        this.innerEl = document.createElement("div");
        this.innerEl.className = "innerEl";
        this.innerEl.style.height = 2 * this.size - this._innerAdjust + "px";
        this.innerEl.style.width = 2 * this.size - this._innerAdjust + "px";
        this.detailEl = document.createElement("div");
        this.detailEl.className = "detailEl";
        this.detailBgEl = document.createElement("div");
        this.detailBgEl.className = "detailBg";
        this.innerEl.appendChild(this.detailBgEl);
        this.detailCopyHolder = document.createElement("div");
        this.detailCopyHolder.className = "detailCopyHolder";
        this.profileName = document.createElement("h3");
        this.profileName.className = "profileName";
        this.lowDetail = document.createElement("h5");
        this.lowDetail.className = "lowDetail";
        this.detailCopyHolder.appendChild(this.profileName);
        this.detailCopyHolder.appendChild(this.lowDetail);
        this.detailEl.appendChild(this.detailCopyHolder);
        this.innerEl.appendChild(this.detailEl);
        this.parentDims = {
            h: window.innerHeight,
            w: window.innerWidth
        };
        this.deactivatePullTimer = null;
        this.visibleContainer.appendChild(this.innerEl);
        this.el.appendChild(this.visibleContainer);
        this.hoverEl = document.createElement("div");
        this.hoverEl.className = "hoverEl";
        this.el.appendChild(this.hoverEl);
        this.hoverEl.addEventListener("mouseover", this._onMouseOver.bind(this), !1);
        this.hoverEl.addEventListener("mouseout", this._onMouseOut.bind(this), !1);
        this.hoverEl.addEventListener("click", this._onClick.bind(this), !1);
        this.checkPullOnChildren = this.childrenInPullMode = !0;
        this.el.style.opacity = 0;
        this.onResize(this.parentDims, e);
        return this
    };
    a.createAlbumEl = function() {
        this.albumEl = document.createElement("div");
        this.albumEl.className = "albumContainer";
        this.el.appendChild(this.albumEl);
        this.albumEl.style.backgroundImage = "url(" + this._data.imgAlbum + ")";
        this.onResize(this.parentDims, this.params)
    };
    a.setRadianDistance = function(a) {
        this.totalRadianDistance = -a;
        console.log("totalradiandistance: ", this.totalRadianDistance);
        this.startRotateRadian = a
    };
    a.addGravityChild = function(a) {
        this.gravityChildren.push(a)
    };
    a._onMouseOver = function() {
        this.detailEl.style.opacity = 1;
        this.detailBgEl.style.opacity = 1
    };
    a._onMouseOut = function() {
        this.detailEl.style.opacity = 0;
        this.detailBgEl.style.opacity = 0
    };
    a._onClick = function(a) {
        a.preventDefault();
        this.dispatchCustomEvent(e.ON_CLICK, {
            data: this._data
        })
    };
    a.setData = function(a) {
        if (a) this._data = a, this.innerEl.style.backgroundImage =
            "url(" + a.loaded.profile.src + ")", this.profileName.innerHTML = a.firstName, this.lowDetail.innerHTML = a.agency
    };
    a.positionDetailEl = function() {
        var a = this.profileName.clientHeight + this.lowDetail.clientHeight + 4;
        this.detailCopyHolder.style.height = a + "px";
        this.detailCopyHolder.style.marginTop = -a / 2 + "px"
    };
    a.render = function() {
        var a = mat4.create(),
            c = Math.round(this.x),
            g = Math.round(this.y);
        this.currentRotateRadian = 0;
        if (this.startAnimation) {
            this.currentScale += 0.2 * (1 - this.currentScale);
            if (null !== this.colorOverlay) this.colorOverlay.style.opacity =
                1 - this.currentScale;
            if (this.currentScale >= this.params.startAnimationZoomVisibility) this.el.style.opacity = 1;
            if (0.99 <= this.currentScale) this.startAnimation = !1
        } else if (this.endAnimation) {
            if (this.currentScale += 0.17 * (0 - this.currentScale), this.el.style.opacity = this.currentScale, 0.01 > this.currentScale) this.endAnimation = !1, this.dispatchCustomEvent(e.ON_REMOVE)
        } else "intro" == this.mode && (this.currentScale += 0.02 * (1 - this.currentScale));
        mat4.identity(a);
        mat4.translate(a, vec3.create([c, g, 0]));
        mat4.scale(a, vec3.create([this.currentScale,
            this.currentScale, this.currentScale
        ]));
        mat4.rotateZ(a, this.currentRotateRadian);
        c = "";
        for (g = 0; g < a.length; g++) c += a[g], g != a.length - 1 && (c += ",");
        this.el.style[b.animationManager.currentTransformStr] = "matrix3d(" + c + ")"
    };
    a.onResize = function(a) {
        this.size = Math.round(a.w * this.params.centerParticleMultiplier);
        if (this.size < this.params.centerMinWidth / 2) this.size = this.params.centerMinWidth / 2;
        this.el.style.height = 2 * this.size + "px";
        this.el.style.width = 2 * this.size + "px";
        if ("intro" == this.mode && null !== this.albumEl) this.albumEl.style.height =
            2 * this.size + this.params.centerAlbumAdjust + "px", this.albumEl.style.width = 2 * this.size + this.params.centerAlbumAdjust + "px", this.albumEl.style.left = -this.params.centerAlbumAdjust / 2 + "px", this.albumEl.style.top = -this.params.centerAlbumAdjust / 2 + "px";
        this.visibleContainer.style.height = 2 * this.size - this.hoverAdjust + "px";
        this.visibleContainer.style.width = 2 * this.size - this.hoverAdjust + "px";
        this.innerEl.style.height = 2 * this.size - this.hoverAdjust - this._innerAdjust + "px";
        this.innerEl.style.width = 2 * this.size - this.hoverAdjust -
            this._innerAdjust + "px";
        this.el.style.left = 0.5 * a.w - this.size + "px";
        this.el.style.top = "intro" == this.mode ? "0px" : 0.5 * a.h - this.size - this.params.topAdjust + "px";
        this.visibleContainer.style.left = this.hoverAdjust / 2 + "px";
        this.visibleContainer.style.top = this.hoverAdjust / 2 + "px";
        if (null !== this.colorOverlay) this.colorOverlay.style.borderRadius = this.size - this.hoverAdjust / 2 + "px";
        this.innerEl.style.borderRadius = this.size - this.hoverAdjust / 2 - this._innerAdjust / 2 + "px";
        this.detailBgEl.style.borderRadius = this.size - this.hoverAdjust /
            2 - this._innerAdjust / 2 + "px";
        this.positionDetailEl()
    }
});
breelNS.defineClass(breelNS.projectName + ".common.profileParticles.ProfileParticleRenderer", "generic.events.EventDispatcher", function(a) {
    a.init = function(a) {
        this.detractMode = !1;
        this.profileParticles = [];
        this.colorParticles = [];
        this.efIndex = a.addEF(this, this.render, []);
        this.particles = []
    };
    a.render = function() {
        for (var a = this.particles, e = 0; e < a.length; e++) a[e].render()
    };
    a.addProfileChild = function(a) {
        this.profileParticles.unshift(a);
        this.particles = [];
        this.particles = this.profileParticles.concat(this.colorParticles)
    };
    a.addColorChild = function(a) {
        this.colorParticles.unshift(a);
        this.particles = [];
        this.particles = this.profileParticles.concat(this.colorParticles)
    };
    a.removeAll = function() {
        var a = this.particles.slice();
        this.profileParticles = [];
        this.colorParticles = [];
        for (this.particles = []; 0 < a.length;) a[0].remove(), a.shift()
    }
});
breelNS.defineClass(breelNS.projectName + ".common.profileParticles.ProfileParticleIntroController", "generic.events.EventDispatcher", function(a, c, e) {
    var b;
    e.ENDED = "profileParticlesIntroEnded";
    a.init = function(a) {
        b = breelNS.getNamespace(breelNS.projectName).singletons.siteManager;
        this.parent = parent;
        this.params = a;
        this.animateObjects = [];
        this.startAngle = a.intro.startAngle;
        this.startScale = a.intro.startScale;
        this.endScale = a.intro.endScale;
        this.topAdjust = a.topAdjust;
        this.size = void 0;
        this.copyMargin = a.intro.copyMargin;
        this.particle = this.locationCopyStrEl = this.locationCopyWrapper = this.profileCopyWrapper = this.albumCopyWrapper = this.copyWrapper = null;
        this._tweens = [];
        this.data = null;
        return this
    };
    a.start = function(a, b, c) {
        this.data = b;
        this.particle = a;
        this._container = c;
        this.createCopyWrapper();
        this.onResize();
        this.animateToMiddle()
    };
    a.animateToMiddle = function() {
        var a = this,
            c = 0.5 * window.innerHeight - this.particle.size - this.params.topAdjust,
            e = y = angle = scale = 0,
            h = this.startAngle,
            l = this.endScale - this.startScale,
            k = (new TWEEN.Tween({
                value: 0
            })).to({
                    value: 1
                },
                2E3).easing(TWEEN.Easing.Exponential.Out).delay(0).onUpdate(function() {
                var k = mat4.create();
                y = c * this.value;
                angle = h * (1 - this.value);
                scale = a.startScale + l * this.value;
                mat4.identity(k);
                mat4.translate(k, vec3.create([e, y, 0]));
                mat4.scale(k, vec3.create([scale, scale, scale]));
                mat4.rotateZ(k, angle);
                for (var n = "", o = 0; o < k.length; o++) n += k[o], o != k.length - 1 && (n += ",");
                a.particle.el.style[b.animationManager.currentTransformStr] = "matrix3d(" + n + ")";
                a.copyWrapper.style.opacity = this.value;
                a.particle.y = y
            });
        k.start();
        k.onComplete(function() {
            a.onImageLanded()
        });
        this._tweens.push(k)
    };
    a.createCopyWrapper = function() {
        data = this.data;
        var a = document.createElement("div");
        a.className = "introCopyWrapper";
        var b = document.createElement("div");
        b.className = "introAlbumCopyWrapper";
        var c = document.createElement("h4");
        c.className = "artistTitle";
        c.innerHTML = data.artistName;
        var e = document.createElement("h5");
        e.className = "songTitle";
        e.innerHTML = data.songTitle;
        b.appendChild(c);
        b.appendChild(e);
        c = document.createElement("div");
        c.className = "introProfileCopyWrapper";
        e = document.createElement("h3");
        e.className = "profileName";
        e.innerHTML = data.firstName + " " + data.lastName;
        var l = document.createElement("h4");
        l.className = "agencyTitle";
        l.innerHTML = data.agency;
        var k = document.createElement("div");
        k.className = "locationHolder";
        var m = document.createElement("div");
        m.className = "locationIcon";
        var n = document.createElement("h5");
        n.className = "location";
        n.innerHTML = data.country;
        this.locationCopyStrEl = n;
        this.locationCopyWrapper = k;
        k.appendChild(m);
        k.appendChild(n);
        c.appendChild(e);
        c.appendChild(l);
        c.appendChild(k);
        a.appendChild(c);
        a.appendChild(b);
        this._container.appendChild(a);
        this.profileCopyWrapper = c;
        this.albumCopyWrapper = b;
        this.copyWrapper = a
    };
    a.onImageLanded = function() {
        console.log("onImageLanded ");
        this._animate(this.particle.albumEl, this.particle.visibleContainer, this.profileCopyWrapper, this.albumCopyWrapper, 1E3);
        this.removeCopy(this.copyWrapper, 4E3)
    };
    a._animate = function(a, b, c, e, l) {
        l = (new TWEEN.Tween({
            value: 0
        })).to({
            value: 1
        }, 2E3).easing(TWEEN.Easing.Exponential.Out).delay(l).onUpdate(function() {
            b.style.opacity =
                this.value;
            a.style.opacity = 1 - this.value;
            c.style.opacity = this.value;
            e.style.opacity = 1 - this.value
        });
        l.start();
        l.onComplete(function() {
            a.style.display = "none"
        });
        this._tweens.push(l)
    };
    a.removeCopy = function(a, b) {
        var c = this,
            h = (new TWEEN.Tween({
                value: 0
            })).to({
                value: 1
            }, 600).easing(TWEEN.Easing.Exponential.Out).delay(b).onUpdate(function() {
                a.style.opacity = 1 - this.value
            });
        h.start();
        h.onComplete(function() {
            c.dispatchCustomEvent(e.ENDED, {
                particle: c.particle
            })
        });
        this._tweens.push(h)
    };
    a.removeAll = function(a) {
        var b =
            this,
            a = (new TWEEN.Tween({
                value: 0
            })).to({
                value: 1
            }, 3E3).easing(TWEEN.Easing.Exponential.Out).delay(a).onUpdate(function() {
                b._container.style.opacity = 1 - this.value
            });
        a.start();
        a.onComplete(function() {
            b.destroy()
        });
        this._tweens.push(a)
    };
    a.destroy = function() {
        this.removeAllTweens();
        this._container.removeChild(this.copyWrapper)
    };
    a.onResize = function() {
        this.size = 2 * window.innerWidth * this.params.centerParticleMultiplier;
        this.copyWrapper.style.marginTop = this.size / 2 + this.params.centerAlbumAdjust / 2 + this.params.intro.copyMargin +
            "px";
        this.locationCopyWrapper.style.marginLeft = -(this.locationCopyStrEl.clientWidth / 2 + 10) + "px"
    };
    a.removeAllTweens = function() {
        for (var a = 0; a < this._tweens.length; a++) null !== this._tweens[a] && this._tweens[a].stop()
    }
});
breelNS.defineClass(breelNS.projectName + ".common.profileParticles.ProfileParticleController", "generic.events.EventDispatcher", function(a, c, e) {
    var b = breelNS.getNamespace(breelNS.projectName + ".common.profileParticles").ProfileParticleRenderer,
        d = breelNS.getNamespace(breelNS.projectName + ".common.profileParticles.particles").CenterParticle,
        f = breelNS.getNamespace(breelNS.projectName + ".common.profileParticles.particles").ProfileParticle,
        g = breelNS.getNamespace(breelNS.projectName + ".common.profileParticles.particles").ColorParticle,
        h = breelNS.getNamespace(breelNS.projectName + ".common.profileParticles").ProfileParticleIntroController,
        l = breelNS.getNamespace("generic.events").ListenerFunctions,
        k;
    e.ON_PROFILE_PARTICLE_CLICK = "profileParticleControllerOnProfileParticleClick";
    e.ON_ALL_ZOOMED_OUT = "profileParticleControllerOnAllZoomedOut";
    e.ON_ALL_ZOMMED_IN = "profileParticleControllerOnAllZoomedIn";
    a.init = function(a) {
        k = breelNS.getNamespace(breelNS.projectName).singletons.siteManager;
        this.el = a;
        this._renderer = new b;
        this._renderer.init(k.scheduler);
        this.params.startRadianPos = [0.2, 0.4, 0.6, 0.8, 1.4];
        this._initMode = !0;
        this.mainModeReady = this._mainMode = this.initModeReady = !1;
        this._triggerCounter = this._endCounter = 0;
        this._particleAnimationsInProgress = !1;
        this.getRandomProfiles();
        this.showNewOnParticleRemove = !0;
        this._onProfileParticleClickBound = l.createListenerFunction(this, this._onProfileParticleClick);
        this._onProfileParticleAnimationEndBound = l.createListenerFunction(this, this._onProfileParticleAnimationEnd);
        this._onProfileParticleTriggerNewBound = l.createListenerFunction(this,
            this._onProfileParticleTriggerNew);
        this._onProfileIntroEndedBound = l.createListenerFunction(this, this._onProfileIntroEnded);
        this.onResize(window.innerWidth, window.innerHeight, !1)
    };
    a.checkStatus = function() {
        this.currentDataLoaded && (this._initMode && this.initModeReady ? this.startIntro() : this._mainMode && this.mainModeReady && this.startAnimation(!0, void 0))
    };
    a.showIntro = function() {
        this.initModeReady = this.initMode = !0;
        this.checkStatus()
    };
    a.startIntro = function() {
        this.initModeReady = !1;
        this.introController = new h;
        this.introController.init(this.params);
        this.introController.addEventListener(h.ENDED, this._onProfileIntroEndedBound);
        var a = this.createCenterParticle(!1, "intro");
        a.createAlbumEl();
        a.el.style.opacity = 1;
        a.albumEl.style.opacity = 1;
        a.detailEl.style.opacity = 0;
        a.visibleContainer.style.opacity = 0;
        this.show();
        this.introController.start(a, this._currentData[0], this.el)
    };
    a._onProfileIntroEnded = function(a) {
        this.startAnimation(!1, a.detail.particle);
        var b = this;
        setTimeout(function() {
            b.introController.destroy();
            b.initModeReady = !1;
            b._initMode = !1;
            b._mainMode = !0
        }, 3E3)
    };
    a._onProfileParticleClick = function(a) {
        this.dispatchCustomEvent(e.ON_PROFILE_PARTICLE_CLICK, a.detail.data)
    };
    a._onProfileParticleTriggerNew = function() {
        this._triggerCounter++;
        if (this._triggerCounter < this._renderer.profileParticles.length) this._renderer.profileParticles[this._triggerCounter].endAnimation = !0
    };
    a._onProfileParticleAnimationEnd = function() {
        this._endCounter++;
        if (this._endCounter == this._renderer.profileParticles.length)
            if (console.log(" new animation !"),
                this.dispatchCustomEvent(e.ON_ALL_ZOOMED_OUT), this._renderer.removeAll(), this._triggerCounter = this._endCounter = 0, this.showNewOnParticleRemove) {
                var a = this;
                setTimeout(function() {
                    if (a._mainMode) a.mainModeReady = !0;
                    else if (a._initMode) a.initModeReady = !0;
                    a.checkStatus()
                }, 1E3)
            } else this.hide()
    };
    a.show = function() {
        this.el.style.display = "block"
    };
    a.hide = function() {
        this.el.style.display = "none"
    };
    a.startAnimation = function(a, b) {
        this._particleAnimationsInProgress = !0;
        this._renderer.removeAll();
        a && this.createCenterParticle(!0,
            "normal");
        if (void 0 !== b) b.startAnimation = !1, b.endAnimation = !1, this._renderer.addProfileChild(b);
        this.createProfileParticles()
    };
    a._addProfileParticle = function(a) {
        var b = (new f).init(this.el, this.params);
        b.setIndex(a);
        b.setData(this._currentData[this._renderer.profileParticles.length]);
        b.positionDetailEl();
        b.setPullMode(!1);
        b.addEventListener(f.ON_CLICK, this._onProfileParticleClickBound);
        b.addEventListener(f.ON_REMOVE, this._onProfileParticleAnimationEndBound);
        b.addEventListener(f.TRIGGER_NEW, this._onProfileParticleTriggerNewBound);
        b.setGravityPoint(this._renderer.profileParticles[this._renderer.profileParticles.length - 1]);
        var d = this.el.clientWidth,
            c = this.el.clientHeight,
            a = this.params.startRadianPos[this._renderer.profileParticles.length - 1],
            e = b.getCenterPoint(),
            d = this.getInitPos({
                w: d - 2 * b.size,
                h: c - 2 * b.size
            }, this.params.initProfileRadius, a * Math.PI);
        b.x = d.x - e.x;
        b.y = d.y - e.y;
        b.isLocked = !0;
        b.radianPos = a;
        b.createColorOverlay();
        this._renderer.addProfileChild(b)
    };
    a._addColorParticle = function(a) {
        var b = (new g).init(this.el, this.params);
        b.setPullMode(!0);
        var d = this._renderer.profileParticles[a];
        b.setGravityPoint(d);
        d.addGravityChild(b);
        var c = this.el.clientWidth,
            e = this.el.clientHeight,
            a = this._renderer.profileParticles[a].startRotateRadian + (-0.3 + 0.6 * Math.random());
        "center" == d.type && (a = this.params.startRadianPos[Math.floor(0 + 4 * Math.random())] + (-0.3 + 0.6 * Math.random()));
        d = b.getCenterPoint();
        c = this.getInitPos({
            w: c,
            h: e
        }, this.params.initColorRadius, a * Math.PI);
        b.x = c.x - d.x;
        b.y = c.y - d.y;
        this._renderer.addColorChild(b)
    };
    a.createCenterParticle =
        function(a, b) {
            var c = (new d).init(this.el, this.params, b);
            c.setIndex(0);
            c.addEventListener(d.ON_CLICK, this._onProfileParticleClickBound);
            c.addEventListener(d.ON_REMOVE, this._onProfileParticleAnimationEndBound);
            c.isLocked = !0;
            c.hoverAdjust = 0;
            c.isCenterProfile = !0;
            c.setData(this._currentData[0]);
            c.visibleContainer.style.opacity = 1;
            c.setRadianDistance(0);
            "intro" != b && (c.createColorOverlay(), this._renderer.addProfileChild(c));
            return c
        };
    a.createProfileParticles = function() {
        var a = this;
        for (i = 0; i < this.params.numProfileParticles; i++) setTimeout(function() {
            a._addProfileParticle(0);
            if (i == a.params.numProfileParticles) a._particleAnimationsInProgress = !1
        }, 200 * (i + 1));
        if (0 == this.params.numProfileParticles) this._particleAnimationsInProgress = !1;
        setTimeout(function() {
            a.dispatchCustomEvent(e.ON_ALL_ZOOMED_IN)
        }, 200 * (this.params.numProfileParticles + 1))
    };
    a.createColorParticles = function() {
        for (var a = 0; a < this._renderer.profileParticles.length - 1; a++)
            for (var b = 0; b < this.params.numParticlesSmall; b++) this._addColorParticle(a);
        for (a = 0; a < this.params.numParticlesCenter; a++) this._addColorParticle(this._renderer.profileParticles.length -
            1)
    };
    a.removeParticlesAndShowNew = function(a) {
        if (void 0 === a) var b = k.model.allUsers,
            a = b[Math.floor(Math.random() * b.length)];
        this.mainModeReady = !1;
        this.showNewOnParticleRemove = !0;
        for (var b = 0, d = [], c = 0; c < this._renderer.profileParticles.length; c++) {
            var e = this._renderer.profileParticles[c]._data;
            this._renderer.profileParticles[c].isCenterProfile && d.push(e)
        }(c = this._renderer.profileParticles[this._endCounter]) ? c.endAnimation = !0: (this.mainModeReady = !0, this.show(), b = 2200);
        var h = this;
        setTimeout(function() {
                h.getProfilesWithId(a)
            },
            b);
        return d
    };
    a.removeParticles = function() {
        this.mainModeReady = this.showNewOnParticleRemove = !1;
        var a = this._renderer.profileParticles[this._endCounter];
        if (a) a.endAnimation = !0
    };
    a.getInitPos = function(a, b, d) {
        var c = {};
        c.x = a.w / 2 + b * Math.cos(d);
        c.y = a.h / 2 + b * Math.sin(d);
        return c
    };
    a.getRandomProfiles = function() {
        var a = k.model.allUsers;
        if (0 == a.length) k.scheduler.next(this, this.getRandomProfiles, []);
        else if (a) a = a[Math.floor(Math.random() * a.length)], this._currentData = [], k.model.getMatchUsers(this, this.onDataBackendResp,
            a.userID);
        else this.onDataBackendResp(k.dummyData.getUserData())
    };
    a.getProfilesWithId = function(a) {
        this._currentData = [];
        k.model.getMatchUsers(this, this.onDataBackendResp, a.userID)
    };
    a.onDataBackendResp = function(a) {
        this._currentData = a.slice();
        this._currentUserLoadIndex = this._currentLoadIndex = 0;
        this._loadUserData()
    };
    a._loadUserData = function() {
        this.currentDataLoaded = !1;
        this._currentLoadIndex == this._currentData.length ? this._onCurrentDataLoaded() : 0 == this._currentUserLoadIndex ? (this._currentData[this._currentLoadIndex].loaded = {}, this._currentData[this._currentLoadIndex].loaded.profile = null, this._currentData[this._currentLoadIndex].loaded.album = null, this.loadImage(this._currentData[this._currentLoadIndex].mediumImg ? this._currentData[this._currentLoadIndex].mediumImg : "/desktop/files/images/1x/common/profile_noimage.png", "profile")) : 1 == this._currentUserLoadIndex && console.log("DO ALBUM ALREADY")
    };
    a.loadImage = function(a, b) {
        var d = new Image,
            c = this;
        d.onload = function() {
            c._currentData[c._currentLoadIndex].loaded[b] = d;
            c._currentUserLoadIndex++;
            if (1 == c._currentUserLoadIndex) c._currentLoadIndex++, c._currentUserLoadIndex = 0;
            c._loadUserData()
        };
        d.onerror = function() {
            console.log("failed to load img: " + a);
            c.loadImage("/desktop/files/images/1x/common/profile_noimage.png", b)
        };
        d.src = a
    };
    a._onCurrentDataLoaded = function() {
        console.log("on data loaded !");
        this.currentDataLoaded = !0;
        this.checkStatus()
    };
    a.onResize = function(a, b, d) {
        this.el.style.height = b + "px";
        this.el.style.width = a + "px";
        this.params.initProfileRadius = a * this.params.centerParticleMultiplier + this.params.profileRadiusAdjust;
        this.params.initColorRadius = b / 4;
        for (var c = this._renderer.particles, e = 0; e < c.length; e++)
            if (c[e].onResize({
                w: a,
                h: b
            }, this.params, d), "profile" == c[e].type) {
                var h = c[e],
                    g = h.getCenterPoint(),
                    f = this.getInitPos({
                        w: a - 2 * h.size,
                        h: b - 2 * h.size
                    }, this.params.initProfileRadius, h.radianPos * Math.PI);
                h.x = f.x - g.x;
                h.y = f.y - g.y
            }
    }
});
breelNS.defineClass(breelNS.projectName + ".canvas.SimpleCamera", "generic.events.EventDispatcher", function(a) {
    a.init = function() {
        this.matrix = mat4.create();
        mat4.identity(this.matrix);
        this.z = this.y = this.x = 0;
        this.target = vec3.create([0, 0, 0]);
        this.up = vec3.create([0, -1, 0]);
        this.eye = vec3.create();
        return this
    };
    a.update = function() {
        mat4.identity(this.matrix);
        this.eye[0] = this.x;
        this.eye[1] = this.y;
        this.eye[2] = this.z;
        return this.matrix = mat4.lookAt(this.eye, this.target, this.up)
    }
});
breelNS.defineClass(breelNS.projectName + ".canvas.HoverCamera", breelNS.projectName + ".canvas.SimpleCamera", function(a, c) {
    var e = breelNS.getNamespace("generic.events").ListenerFunctions,
        b;
    a.init = function(a, c, g) {
        b = breelNS.getNamespace(breelNS.projectName).singletons.siteManager;
        this.radius = this._targetRadius = a;
        this._speed = void 0 == c ? 0.015 : c;
        this.rx = this._tempRX = this._targetRX = 0;
        this._targetRY = -Math.PI / 2;
        this._tempRY = -Math.PI / 2;
        this.ry = -Math.PI / 2;
        this.mouseY = this.mouseX = this._prey = this._prex = this._disty =
            this._distx = 0;
        this._needUpdate = !1;
        this.lockWheel = !0;
        this._isLocked = this.lockRy = this.lockRx = !1;
        this._isInvert = void 0 === g ? !1 : g;
        this._targetYOffset = this._yOffset = this._targetXOffset = this._xOffset = 0;
        this._onMouseDownBound = e.createListenerFunction(this, this._onMouseDown);
        this._onMouseMoveBound = e.createListenerFunction(this, this._onMouseMove);
        this._onMouseUpBound = e.createListenerFunction(this, this._onMouseUp);
        this._onMouseWheelBound = e.createListenerFunction(this, this._onMouseWheel);
        this._onMotionBound =
            e.createListenerFunction(this, this._onMotion);
        this._touchEventsEnabled = !1;
        this.matrix = mat4.create();
        mat4.identity(this.matrix);
        this.z = this.y = this.x = 0;
        this.target = vec3.create([0, 0, 0]);
        this.up = vec3.create([0, -1, 0]);
        this.eye = vec3.create();
        document.addEventListener("mousemove", this._offsetCameraAngle.bind(this));
        return this
    };
    a._offsetCameraAngle = function(a) {
        if (this.respondToMousePos) this._targetXOffset = a.clientX / window.innerWidth - 0.5, this._targetYOffset = a.clientY / window.innerHeight - 0.5
    };
    a._onMotion = function() {
        this._needUpdate = !0;
        this.mouseY = -20 * event.accelerationIncludingGravity.x;
        this.mouseX = 20 * event.accelerationIncludingGravity.z
    };
    a.enableTouchEvents = function() {
        if (!this._touchEventsEnabled) this._touchEventsEnabled = !0, e.addDOMListener(document, "mousedown", this._onMouseDownBound), e.addDOMListener(document, "mouseup", this._onMouseUpBound), e.addDOMListener(document, "mousemove", this._onMouseMoveBound), e.addDOMListener(document, "touchstart", this._onMouseDownBound), e.addDOMListener(document, "touchend", this._onMouseUpBound),
            e.addDOMListener(document, "touchmove", this._onMouseMoveBound), "true" == b.config.enableMouseWheel && (e.addDOMListener(document, "mousewheel", this._onMouseWheelBound), e.addDOMListener(document, "DOMMouseScroll", this._onMouseWheelBound))
    };
    a.disableTouchEvents = function() {
        this._touchEventsEnabled = !1;
        e.removeDOMListener(document, "mousedown", this._onMouseDownBound);
        e.removeDOMListener(document, "mouseup", this._onMouseUpBound);
        e.removeDOMListener(document, "mousemove", this._onMouseMoveBound);
        e.removeDOMListener(document,
            "touchstart", this._onMouseDownBound);
        e.removeDOMListener(document, "touchend", this._onMouseUpBound);
        e.removeDOMListener(document, "touchmove", this._onMouseMoveBound);
        "true" == b.config.enableMouseWheel && (e.removeDOMListener(document, "mousewheel", this._onMouseWheelBound), e.removeDOMListener(document, "DOMMouseScroll", this._onMouseWheelBound))
    };
    a._onMouseDown = function(a) {
        this._needUpdate = !0;
        if (a.clientX) this._prex = a.clientX, this._prey = a.clientY;
        else if (a.touches) this._prex = a.touches[0].pageX, this._prey =
            a.touches[0].pageY;
        else return;
        this._tempRX = this.rx;
        this._tempRY = this.ry
    };
    a._onMouseUp = function() {
        this._needUpdate = !1
    };
    a._onMouseMove = function(a) {
        a.preventDefault();
        if (a.clientX) this.mouseX = a.clientX, this.mouseY = a.clientY;
        else if (a.touches) this.mouseX = a.touches[0].pageX, this.mouseY = a.touches[0].pageY
    };
    a._onMouseWheel = function(a) {
        a.preventDefault();
        if (!this.lockWheel && !this._isLocked) {
            var b = a.wheelDelta,
                a = a.detail,
                c = 0;
            this._targetRadius -= 5 * (a ? b ? 0 < b / a / 40 * a ? 1 : -1 : -a / 3 : b / 120)
        }
    };
    a._updateDistance = function() {
        this._distx =
            (this.mouseY - this._prey) / 200;
        this._disty = (this.mouseX - this._prex) / 200
    };
    a.update = function() {
        if (this._needUpdate) this._updateDistance(), this._targetRX = this._tempRX + this._distx, this._targetRY = this._tempRY + this._disty;
        !this.lockRx && !this._isLocked && (this.rx += (this._targetRX - this.rx) * this._speed);
        !this.lockRy && !this._isLocked && (this.ry += (this._targetRY - this.ry) * this._speed);
        var a = Math.PI / 2 - 0.2;
        if (this.rx > a) this._targetRX = this.rx = a;
        else if (this.rx < -a) this.rx = -a, this._targetRX = -a;
        a = this._isInvert ? -this.ry :
            this.ry;
        this.radius += (this._targetRadius - this.radius) * this._speed;
        this._xOffset += 0.02 * (this._targetXOffset - this._xOffset);
        this._yOffset += 0.02 * (this._targetYOffset - this._yOffset);
        this.x = -Math.cos(this.rx) * Math.cos(a) * this.radius - 1E3 * this._xOffset;
        this.y = -Math.sin(this.rx) * this.radius - 1E3 * this._yOffset;
        this.z = -Math.cos(this.rx) * Math.sin(a) * this.radius;
        return c.update.call(this)
    };
    a.lock = function(a, b) {
        if (void 0 == VisualiserSettings) VisualiserSettings = breelNS.getNamespace("allForThis.visualiser").VisualiserSettings;
        var c = (this._isLocked = a) ? VisualiserSettings.inspectCameraAngleLock : 0;
        void 0 !== b && (c = b);
        (new TWEEN.Tween(this)).to({
            rx: c,
            ry: -Math.PI / 2
        }, 1E3).easing(TWEEN.Easing.Cubic.EaseOut).start();
        this._tempRX = this._targetRX = c;
        this._targetRY = -Math.PI / 2;
        this._tempRY = -Math.PI / 2;
        this.mouseY = this.mouseX = this._prey = this._prex = this._disty = this._distx = 0
    }
});
breelNS.defineClass(breelNS.projectName + ".canvas.Particle", "generic.events.EventDispatcher", function(a, c, e) {
    var b = function(a, b) {
        return a + Math.random() * (b - a)
    };
    breelNS.getNamespace("generic.math");
    var d, f;
    e.DATA_TYPE_COUNTRY = "country";
    e.DATA_TYPE_GENRES = "colorIndex";
    e.DATA_TYPE_AGENCY = "agency";
    e.DATA_TYPE_SPEAKER = "speaker";
    e.DATA_TYPE_PROFESSION = "profession";
    a.init = function(a) {
        d = breelNS.getNamespace(breelNS.projectName).singletons.siteManager;
        colors = d.settings.colors;
        f = d.settings.params;
        this.y = this.x =
            0;
        this.targetZ = b(-f.zRange, f.zRange);
        this.currentZ = this.randomZ = this.z = b(-f.zRange, f.zRange);
        this.alpha = this.ringOffset = this.ax = this.ay = this.az = this.vx = this.vy = this.vz = this.xOffset = this.yOffset = this.zOffset = 0;
        this.targetAlpha = 1;
        this.speedValue = b(0.01, 0.05);
        this.targetSpeed = 1;
        this.rotSpeed = this.speedValue;
        this.theta = b(0, 2 * Math.PI);
        this.radius = f.maxRadius * b(1, 2);
        this.targetThetaOffset = this.thetaOffset = 0;
        this.baseRadius = this.targetRadius = b(f.minRadius, f.maxRadius);
        this.easing = b(0.04, 0.03);
        this.size =
            b(f.baseSize, f.baseSize + f.sizeDifference);
        this.offsetScale = 0;
        this.speedOffset = 1 + (1 - this.targetRadius / f.ratationRadius) * f.speedDifference;
        this.colorIndex = Math.floor(Math.random() * colors.length);
        this.color = colors[this.colorIndex];
        this.scale = 1;
        this.isDying = this.isGlobeParticle = !1;
        this.scaleInDepth = 1;
        this.numConnectDots = this.layerRange = this.layerIndex = 0;
        this.connectDots = [];
        if (a) this.radius = 0.75 * this.baseRadius;
        this.country = Math.floor(b(0, 10));
        this.agency = Math.floor(b(0, 10));
        this.speaker = Math.floor(b(0,
            10));
        this.profession = Math.floor(b(0, 10));
        return this
    };
    a.searchType = function(a, b, d, c) {
        c = void 0 == c ? 0 : c;
        if ("" == a) this.targetZ = this.randomZ, this.targetRadius = this.baseRadius;
        else {
            this.radius = this.baseRadius;
            var e = this[a];
            e == b ? b = 0 : (a = e - b, b = b > e ? b - e - d : b - e + d, b = Math.abs(a) < Math.abs(b) ? a : -b);
            this.layerIndex = b += c;
            this.targetZ = b * f.layerDistance
        }
    };
    a.searchGenre = function(a) {
        this.targetRadius = f.minRadius;
        this.targetZ = 0.4 * (this.colorIndex - 4.5) * f.layerDistance;
        this.targetAlpha = -1 == a ? 1 : a == this.colorIndex ? 1 : 0
    };
    a.resetGenre =
        function() {
            this.targetAlpha = 1;
            this.targetZ = this.randomZ
        };
    a.resetRadius = function() {
        this.targetRadius = this.baseRadius
    };
    a.resetLayerIndex = function() {
        if (!this.isDying) this.ringOffset = 0, this.layerIndex -= 5, this.currentZ = this.targetZ = this.layerIndex * f.layerDistance
    };
    a.update = function() {
        this.vx += this.ax;
        this.vy += this.ay;
        this.vz += this.az;
        this.xOffset += this.vx;
        this.yOffset += this.vy;
        this.zOffset += this.vz;
        var a = f.explosionDecrease;
        this.vx *= a;
        this.vy *= a;
        this.vz *= a;
        this.ax = this.ay = this.az = 0;
        this.xOffset -= this.xOffset *
            this.easing;
        this.yOffset -= this.yOffset * this.easing;
        this.zOffset -= this.zOffset * this.easing
    };
    a.initConnectDots = function(a, b) {
        for (var d = void 0 == b ? 15E3 : b; this.connectDots.length < this.numConnectDots;) {
            var c = a[Math.floor(Math.random() * a.length)];
            this.distanceTo(c) < d && this.connectDots.push(c)
        }
    };
    a.updateConnectDots = function(a) {
        for (var b = this.connectDots.length; b--;) {
            var c = this.connectDots[b];
            15E3 < this.distanceTo(c) && this.connectDots.splice(b, 1)
        }
        for (b = 0; this.connectDots.length < this.numConnectDots && !(100 < b++);) {
            do c =
                Math.floor(Math.random() * a.length); while (c == this.particleIndex);
            c = a[c];
            15E3 > this.distanceTo(c) && this.connectDots.push(c)
        }
    };
    a.getTexture = function() {
        return this._canvas
    };
    a.distanceTo = function(a) {
        return (this.x - a.x) * (this.x - a.x) + (this.y - a.y) * (this.y - a.y) + (this.z - a.z) * (this.z - a.z)
    };
    a.distanceTo3D = function() {};
    a.distanceToPos3D = function(a, b) {
        return Math.sqrt((this.x - a) * (this.x - a) + (this.y - b) * (this.y - b))
    };
    a.distanceToPos = function(a, b) {
        var c = 0.5 * this.size * this.scaleInDepth;
        return void 0 != this.finalPos ? (this.finalPos[0] -
            a + c) * (this.finalPos[0] - a + c) + (this.finalPos[1] - b + c) * (this.finalPos[1] - b + c) : (this.x - a + c) * (this.x - a + c) + (this.y - b + c) * (this.y - b + c)
    };
    a.distanceToPosSqrd = function(a, b) {
        return void 0 != this.finalPos ? Math.sqrt((this.finalPos[0] - a) * (this.finalPos[0] - a) + (this.finalPos[1] - b) * (this.finalPos[1] - b)) : Math.sqrt((this.x - a) * (this.x - a) + (this.y - b) * (this.y - b))
    }
});
breelNS.defineClass(breelNS.projectName + ".canvas.particles.DomParticle", "generic.events.EventDispatcher", function(a) {
    var c;
    a.init = function(a, b) {
        c = breelNS.getNamespace(breelNS.projectName).singletons.siteManager;
        this.ay = this.ax = this.vy = this.vx = this.y = this.x = 0;
        this.vel = 0.1;
        this.decreasing = b.velocityDecreasing;
        this.color = c.settings.colors[Math.floor(Math.random() * c.settings.colors.length)];
        this.isLocked = !1;
        this._innerAdjust = 10;
        this.params = b;
        this.closestGravityChild = this._data = null;
        this._inHoverMode =
            this.pullMode = !1;
        this._index = void 0;
        this.startAnimation = !0;
        this.endAnimation = !1;
        this.relativeParticle = null;
        this.currentRotateRadian = this.startRotateRadian = this.totalRadianDistance = this.currentDistanceToGravity = this.startDistanceToGravity = void 0;
        this.currentScale = 1;
        this.colorOverlay = null;
        this.el = document.createElement("div");
        this.el.className = "particle";
        this.visibleContainer = document.createElement("div");
        this.visibleContainer.className = "visibleContainer";
        this.albumEl = document.createElement("div");
        this.albumEl.className = "albumContainer";
        this.innerEl = document.createElement("div");
        this.innerEl.className = "innerEl";
        this.innerEl.style.borderRadius = "10000px";
        this.bgInnerEl = document.createElement("div");
        this.bgInnerEl.className = "bgInnerEl";
        this.bgInnerEl.style.borderRadius = "10000px";
        this.innerEl.appendChild(this.bgInnerEl);
        this.detailEl = document.createElement("div");
        this.detailEl.className = "detailEl";
        this.detailCopyHolder = document.createElement("div");
        this.detailCopyHolder.className = "detailCopyHolder";
        this.profileName = document.createElement("h3");
        this.profileName.className = "profileName";
        this.lowDetail = document.createElement("h5");
        this.lowDetail.className = "lowDetail";
        this.detailCopyHolder.appendChild(this.profileName);
        this.detailCopyHolder.appendChild(this.lowDetail);
        this.detailEl.appendChild(this.detailCopyHolder);
        this.visibleContainer.appendChild(this.innerEl);
        this.visibleContainer.appendChild(this.detailEl);
        this.el.appendChild(this.albumEl);
        this.el.appendChild(this.visibleContainer);
        this.el.addEventListener("mouseover",
            this._onMouseOver.bind(this), !1);
        this.el.addEventListener("mouseout", this._onMouseOut.bind(this), !1);
        this.el.addEventListener("click", this._onClick.bind(this), !1);
        this.checkPullOnChildren = this.childrenInPullMode = !0;
        this.opacity = this.infoOpacity = this.scale = 0;
        this.innerScale = 1;
        this.offsetScale = 0;
        this.triggered = !1;
        this.offset = {
            x: 0,
            y: 0
        };
        CSS.set(this.el, {
            opacity: 0
        });
        a.appendChild(this.el);
        this.parent = a;
        console.log("INIT PARTICLE");
        return this
    };
    a.createColorOverlay = function() {};
    a._onMouseOver = function() {
        if (!this._inHoverMode) this._inHoverMode = !0, this.checkPullOnChildren = !1
    };
    a._onMouseOut = function() {
        if (this._inHoverMode) this._inHoverMode = !1
    };
    a.setPullMode = function(a) {
        this.pullMode = a
    };
    a.setIndex = function(a) {
        this._index = a
    };
    a.getIndex = function() {
        return this._index
    };
    a.remove = function() {
        this.parent.removeChild(this.el)
    };
    a.getCenterPoint = function() {
        return {
            x: this.parentDims.w / 2 - this.size,
            y: this.parentDims.h / 2 - this.size
        }
    };
    a.setGravityPoint = function(a) {
        this.closestGravityChild = a
    };
    a.getDistanceTo = function(a) {
        return this.distanceTo(a)
    };
    a.checkParticlePull =
        function() {
            dist = Math.sqrt(this.distanceTo(this.closestGravityChild));
            if (void 0 === this.startDistanceToGravity) this.startDistanceToGravity = dist;
            this.currentDistanceToGravity = dist;
            var a = this.size + this.closestGravityChild.size,
                b = this._getNormal(this.closestGravityChild, this, dist),
                c = b.y * (1 - a / dist) * this.acc;
            this.ax += b.x * (1 - a / dist) * this.acc;
            this.ay += c
        };
    a.checkParticle = function(a) {
        this.x == a.x && this.y == a.y && (this.x += 1 + -2 * Math.random(), this.y += -1 + 2 * Math.random());
        dist = Math.sqrt(this.distanceTo(a));
        var b = this.size +
            a.size;
        dist > b && (dist = b);
        var c = this._getNormal(this, a, dist),
            a = c.x * (1 - dist / b) * this.acc,
            b = c.y * (1 - dist / b) * this.acc;
        if (isNaN(a)) debugger;
        this.ax += a;
        this.ay += b
    };
    a.update = function() {
        if (!this.isLocked) {
            this.vx += this.ax;
            this.vy += this.ay;
            this.x += this.vx;
            this.y += this.vy;
            if (isNaN(this.x)) debugger;
            if (!(0 == this.ax && 0 == this.ay)) this.ax = this.ay = 0;
            this.vx *= this.decreasing;
            this.vy *= this.decreasing
        }
    };
    a._getNormal = function(a, b, c) {
        a = {
            x: (a.x - b.x) / c,
            y: (a.y - b.y) / c
        };
        if (isNaN(a.x)) debugger;
        return a
    };
    a.render = function() {
        this.renderedOnce ||
            CSS.set(this.el, {
                opacity: 1
            });
        this.renderedOnce = !0;
        var a = Math.round(100 * this.x) / 100,
            b = Math.round(100 * this.y) / 100,
            c = Math.round(1E3 * this.scale) / 1E3,
            f = Math.round(100 * this.opacity) / 100;
        (this.lastO !== f || this.lastS !== c || this.lastX !== a || this.lastY !== b) && CSS.set(this.el, {
            opacity: f,
            transform: CSS.to3DString("transform", a + this.offset.x, b + this.offset.y) + " " + CSS.to3DString("scale", c, c)
        });
        this.lastO = f;
        this.lastS = c;
        this.lastY = b;
        this.lastX = a;
        c = Math.round(1E3 * this.innerScale) / 1E3;
        this.hoverLastS !== c && CSS.set(this.innerEl, {
            transform: CSS.to3DString("scale", c, c)
        });
        f = Math.round(100 * this.infoOpacity) / 100;
        this.hoverLastO !== f && (CSS.set(this.detailEl, {
            opacity: f
        }), CSS.set(this.bgInnerEl, {
            opacity: f
        }));
        this.hoverLastO = f;
        this.hoverLastS = c
    };
    a.distanceTo = function(a) {
        return (this.x - a.x) * (this.x - a.x) + (this.y - a.y) * (this.y - a.y)
    };
    a.getClosestPointInCircle = function(a, b) {
        var c = b.x - (this.x + b.x),
            f = b.y - (this.y + b.y),
            g = b.x + a * (c / Math.sqrt(Math.pow(c, 2) + Math.pow(f, 2))),
            c = b.y + a * (f / Math.sqrt(Math.pow(c, 2) + Math.pow(f, 2)));
        return {
            x: g,
            y: c
        }
    };
    a.positionDetailEl =
        function() {
            var a = this.profileName.clientHeight + this.lowDetail.clientHeight + 4;
            this.detailCopyHolder.style.height = a + "px";
            this.detailCopyHolder.style.marginTop = -a / 2 + "px"
        }
});
breelNS.defineClass(breelNS.projectName + ".canvas.particles.CenterParticle", breelNS.projectName + ".canvas.particles.DomParticle", function(a, c, e) {
    breelNS.getNamespace("generic.animation");
    e.ON_CLICK = "centerParticleOnClick";
    e.ON_REMOVE = "centerParticleOnRemove";
    a.init = function(a, d, e) {
        breelNS.getNamespace(breelNS.projectName);
        c.init.call(this, a, d);
        this.acc = d.profileAcceleration;
        this.gravityChildren = [];
        this.mode = e;
        this.type = "center";
        this.endAnimationDuration = this.params.centerParticleEndAnimationDuration;
        this.parentDims = {
            h: window.innerHeight,
            w: window.innerWidth
        };
        this.deactivatePullTimer = null;
        $(this.profileName).addClass("big");
        $(this.lowDetail).addClass("big");
        this.onResize(this.parentDims, d);
        return this
    };
    a.createAlbumEl = function() {
        this.albumEl = document.createElement("div");
        this.albumEl.className = "albumContainer";
        this.el.appendChild(this.albumEl);
        this.albumEl.style.backgroundImage = "url(" + this._data.imgAlbum + ")";
        this.onResize(this.parentDims, this.params)
    };
    a.setRadianDistance = function(a) {
        this.totalRadianDistance = -a;
        console.log("totalradiandistance: ", this.totalRadianDistance);
        this.startRotateRadian = a
    };
    a.addGravityChild = function(a) {
        this.gravityChildren.push(a)
    };
    a._onClick = function(a) {
        a.preventDefault();
        this.dispatchCustomEvent(e.ON_CLICK, {
            data: this._data
        })
    };
    a.setData = function(a) {
        if (a) this._data = a, this.innerEl.style.backgroundImage = "url(" + a.loaded.profile.src + ")", this.profileName.innerHTML = a.firstName, a = a.agency, 1 > a.length && (a = "SPEAKER"), this.lowDetail.innerHTML = a, this.lowDetail.innerHTML = a
    };
    a.positionDetailEl =
        function() {
            var a = this.profileName.clientHeight + this.lowDetail.clientHeight + 4;
            this.detailCopyHolder.style.height = a + "px";
            this.detailCopyHolder.style.marginTop = -a / 2 + "px"
        };
    a.render = function() {
        this.currentRotateRadian = 0;
        var a = 0.2,
            d = 0.2,
            f = 1,
            g = 1,
            h = 0;
        this.offsetScale = 0;
        if (this.startAnimation) {
            if (g = f = 1, a = 0.2, 0.99 <= this.scale) this.startAnimation = !1
        } else if (this.endAnimation) {
            if (f = 0.2, g = 0, a = 0.2, 0.01 > this.opacity) this.endAnimation = !1, this.dispatchCustomEvent(e.ON_REMOVE)
        } else if ("intro" == this.mode) this.offsetScale =
            0.2, g = f = 1, a = 0.2;
        this._inHoverMode ? (d = 0.2, h = 0.1) : (d = 0.5, h = 0);
        this.infoOpacity += (h / 0.1 - this.infoOpacity) * d;
        this.innerScale += (1 + h - this.innerScale) * d;
        this.scale += (f + this.offsetScale - this.scale) * a;
        this.opacity += (g - this.opacity) * a;
        c.render.call(this)
    };
    a.onResize = function(a) {
        this.size = Math.round(a.w * this.params.centerParticleMultiplier);
        if (this.size < this.params.centerMinWidth / 2) this.size = this.params.centerMinWidth / 2;
        if ("intro" == this.mode && null !== this.albumEl) this.albumEl.style.height = 2 * this.size + this.params.centerAlbumAdjust +
            "px", this.albumEl.style.width = 2 * this.size + this.params.centerAlbumAdjust + "px", this.albumEl.style.left = -this.params.centerAlbumAdjust / 2 + "px", this.albumEl.style.top = -this.params.centerAlbumAdjust / 2 + "px";
        this.el.style.width = this.el.style.height = 2 * this.size + "px";
        this.el.style.left = 0.5 * a.w - this.size + "px";
        this.el.style.top = 0.5 * a.h - this.size - this.params.topAdjust + "px";
        this.positionDetailEl()
    }
});
breelNS.defineClass(breelNS.projectName + ".canvas.particles.ProfileParticle", breelNS.projectName + ".canvas.particles.DomParticle", function(a, c, e) {
    breelNS.getNamespace("generic.animation");
    breelNS.getNamespace("generic.math");
    e.ON_CLICK = "centerParticleOnClick";
    e.ON_REMOVE = "centerParticleOnRemove";
    e.TRIGGER_NEW = "profileParticleTriggerNew";
    a.init = function(a, d) {
        breelNS.getNamespace(breelNS.projectName);
        c.init.call(this, a, d);
        this.acc = d.profileAcceleration;
        this._rad = 35;
        this.gravityChildren = [];
        this.type = "profile";
        this.endAnimationDuration = this.params.profileParticleEndAnimationDuration;
        this.parentDims = {
            h: a.clientHeight,
            w: a.clientWidth
        };
        this.deactivatePullTimer = null;
        this.onResize(this.parentDims, d);
        return this
    };
    a.setRadianDistance = function(a) {
        this.totalRadianDistance = -a;
        console.log("totalradiandistance: ", this.totalRadianDistance);
        this.startRotateRadian = a
    };
    a.addGravityChild = function(a) {
        this.gravityChildren.push(a)
    };
    a._onClick = function(a) {
        a.preventDefault();
        this.dispatchCustomEvent(e.ON_CLICK, {
            data: this._data
        })
    };
    a.activatePullOnGravityChildren = function() {
        for (var a = 0; a < this.gravityChildren.length; a++) console.log("activate pull"), this.gravityChildren[a].setPullMode(!0);
        this.childrenInPullMode = !0
    };
    a.deactivatePullOnGravityChildren = function() {
        for (var a = 0; a < this.gravityChildren.length; a++) console.log("deactivate pull"), this.gravityChildren[a].setPullMode(!1);
        this.childrenInPullMode = !1
    };
    a.setData = function(a) {
        if (this._data = a) this.innerEl.style.backgroundImage = a ? "url(" + a.loaded.profile.src + ")" : "url(/desktop/files/images/1x/common/profile_noimage.png)",
            this.profileName.innerHTML = a.firstName, a = a.agency, 1 > a.length && (a = "SPEAKER"), this.lowDetail.innerHTML = a
    };
    a.getData = function() {
        return this._data
    };
    a.render = function() {
        this.currentRotateRadian = 0;
        var a = 0.2,
            d = 0.2,
            f = 1,
            g = 1,
            h = 0;
        if (this.startAnimation) {
            if (f = g = 1, a = 0.2, 0.99 <= this.scale) this.startAnimation = !1, this.positionDetailEl()
        } else if (this.endAnimation) {
            f = g = 0;
            a = 0.2;
            if (0.4 > this.scale && !this.triggered) this.dispatchCustomEvent(e.TRIGGER_NEW), this.triggered = !0;
            if (0.1 >= this.scale) this.dispatchCustomEvent(e.ON_REMOVE),
                this.endAnimation = !1, this.el.style.display = "none"
        }
        this._inHoverMode ? h = d = 0.2 : (d = 0.5, h = 0);
        this.infoOpacity += (h / 0.2 - this.infoOpacity) * d;
        this.innerScale += (1 + h - this.innerScale) * d;
        this.scale += (g - this.scale) * a;
        this.opacity += (f - this.opacity) * a;
        c.render.call(this)
    };
    a.onResize = function(a) {
        this.size = Math.round(a.w * this.params.profileParticleMultiplier);
        if (this.size < this.params.profileMinWidth / 2) this.size = this.params.profileMinWidth / 2;
        this.el.style.width = this.el.style.height = 2 * this.size + "px";
        this.el.style.left =
            0.5 * a.w - this.size + "px";
        this.el.style.top = 0.5 * a.h - this.size - this.params.topAdjust + "px";
        this.parentDims = {
            h: this.parent.clientHeight,
            w: this.parent.clientWidth
        };
        this.positionDetailEl()
    }
});
breelNS.defineClass(breelNS.projectName + ".canvas.CanvasRenderer", "generic.events.EventDispatcher", function(a, c, e) {
    breelNS.getNamespace("generic.math");
    var b = breelNS.getNamespace(breelNS.projectName + ".canvas").HoverCamera,
        d = breelNS.getNamespace(breelNS.projectName + ".canvas").Renderer2D,
        f = breelNS.getNamespace(breelNS.projectName + ".canvas").Renderer3D,
        g, h;
    e.ON_PARTICLE_CLICK = "onParticleClick";
    e.ON_PARTICLE_OVER = "onParticleOver";
    a.init = function(a) {
        this.ctx = a;
        g = breelNS.getNamespace(breelNS.projectName).singletons.siteManager;
        h = g.scheduler;
        this.width = this.ctx.canvas.width;
        this.height = this.ctx.canvas.height;
        this.zFar = 3E3;
        this._y = this._x = 0;
        this.childrenList = [];
        this.projection = mat4.create();
        this.camera = mat4.create();
        this.isStarted = !0;
        this.projection = mat4.perspective(90, 1, 0.1, this.zFar);
        this.camera = (new b).init(2E3);
        this.camera._targetRX = 0.25 * -Math.PI;
        this.camera._targetRY = 0.4 * -Math.PI;
        this.cameraGlobe = (new b).init(2E3);
        this.cameraGlobe.enableTouchEvents();
        this.mtx = mat4.create();
        this.mtxGlobe = mat4.create();
        this.efIndex = h.addEF(this,
            this.render, []);
        this.isIn2D = !0;
        this._prestate = this._state = 0;
        this._mouseLocked = !1;
        return this
    };
    a.start = function() {
        if (-1 == this.efIndex) this.efIndex = h.addEF(this, this.render, [])
    };
    a.stop = function() {
        h.removeEF(this.efIndex);
        this.efIndex = -1
    };
    a.render = function() {};
    a.setState = function(a) {
        if (this._state != a) this._preState = this._state, this._state = a
    };
    a.addChild = function(a) {
        this.childrenList.push(a)
    };
    a.removeChild = function(a) {
        -1 != this.childrenList.indexOf(a) && this.childrenList.splice(this.childrenList.indexOf(a),
            1)
    };
    a.removeAll = function() {
        this.childrenList = []
    };
    a.updateChildrenList = function(a) {
        this.childrenList = a
    };
    e.createRenderer = function(a, b) {
        d = breelNS.getNamespace(breelNS.projectName + ".canvas").Renderer2D;
        f = breelNS.getNamespace(breelNS.projectName + ".canvas").Renderer3D;
        console.log("Create Renderer : ", browserName);
        var c = "Safari" == browserName ? "experimental-webgl" : "webgl";
        if (b) this.isIn2D = !0, c = (new d).init(a.getContext("2d")), c.isIn2D = !0;
        else {
            if (!window.WebGLRenderingContext) return c = (new d).init(a.getContext("2d")),
                c.isIn2D = !0, c;
            gl = a.getContext(c);
            if (!gl) return c = (new d).init(a.getContext("2d")), c.isIn2D = !0, c;
            c = (new f).init(a.getContext(c));
            c.isIn2D = !1
        }
        return c
    }
});
breelNS.defineClass(breelNS.projectName + ".canvas.CenterRenderer", breelNS.projectName + ".canvas.CanvasRenderer", function(a, c) {
    a.init = function(a) {
        return c.init.call(this, a)
    };
    a.render = function() {
        var a = this.ctx;
        (new Date).getTime();
        a.clearRect(0, 0, this.width, this.height);
        toDebug = 0.95 < Math.random();
        a.save();
        a.translate(0.5 * this.width + this._x, 0.5 * this.height + this._y);
        for (var b = 0; b < this.childrenList.length; b++) {
            var c = this.childrenList[b];
            if (0 != c.alpha) {
                for (j = 0; j < this.childrenList.length; j++) j != b && c.checkParticle(this.childrenList[j]);
                c.update();
                a.save();
                a.globalAlpha = c.alpha;
                a.translate(c.x, c.y);
                0.01 <= a.globalAlpha && c.render(a);
                a.restore()
            }
        }
        a.restore()
    };
    a.addChild = function(a) {
        this.childrenList.unshift(a)
    }
});
breelNS.defineClass(breelNS.projectName + ".canvas.Renderer2D", breelNS.projectName + ".canvas.CanvasRenderer", function(a, c) {
    var e = breelNS.getNamespace(breelNS.projectName + ".canvas").CanvasRenderer,
        b = breelNS.getNamespace("generic.math").MathUtils,
        d, f;
    a.init = function(a) {
        d = breelNS.getNamespace(breelNS.projectName).singletons.siteManager;
        f = d.settings.params;
        this._isLocked = !1;
        var b = this;
        this.isTouch = !1;
        (this.isTouch = "ontouchstart" in window || navigator.msMaxTouchPoints ? !0 : !1) ? document.body.addEventListener("touchstart",
            function(a) {
                b._onTouchStart(a)
            }): (document.body.addEventListener("click", function(a) {
            b._onClick(a)
        }), document.body.addEventListener("mousemove", function(a) {
            b._onTouchMove(a)
        }));
        return c.init.call(this, a)
    };
    a._onClick = function() {
        if (!("Landing" != d.globalStateManager.getCurrentState() || this._isLocked))
            for (var a = 0; a < this.childrenList.length; a++) {
                var b = this.childrenList[a];
                if (!b.isGlobeParticle && b.mouseLocked) {
                    b.mouseLocked = !1;
                    this.dispatchCustomEvent(e.ON_PARTICLE_CLICK, {
                        particle: b
                    });
                    break
                }
            }
    };
    a._onTouchMove =
        function(a) {
            var b, c;
            if (!("Landing" != d.globalStateManager.getCurrentState() || this._isLocked || this._mouseLocked)) {
                var e;
                a.touches ? (b = a.touches[0].pageX - 0.5 * this.width, c = a.touches[0].pageY - 0.5 * this.height, e = a.touches[0].pageX, a = a.touches[0].pageY) : (b = a.clientX - 0.5 * this.width, c = a.clientY - 0.5 * this.height, e = a.clientX, a = a.clientY);
                b -= this._x;
                c -= this._y;
                for (var f = -1, n = 1E6, o = 0; o < this.childrenList.length; o++) {
                    var p = this.childrenList[o];
                    if (!p.isGlobeParticle) {
                        p.scaleInDepth = 1;
                        var q = 2 * p.size,
                            r = p.distanceToPos(b,
                                c);
                        if (r < q * q && r < n) {
                            if (-1 < f) this.childrenList[f].offsetScale = 0, this.childrenList[f].targetSpeed = 1, this.childrenList[f].mouseLocked = !1;
                            n = r;
                            f = o;
                            p.offsetScale = 1;
                            p.targetSpeed = 0.25;
                            p.mouseLocked = !0;
                            this.dispatchCustomEvent("onParticleOver", {
                                particle: p,
                                x: e,
                                y: a
                            })
                        } else p.offsetScale = 0, p.targetSpeed = 1, p.mouseLocked = !1
                    }
                }
                0 > f && this.dispatchCustomEvent("onParticleOut")
            }
        };
    a._onTouchStart = function(a) {
        if (!("Landing" != d.globalStateManager.getCurrentState() || this._isLocked)) {
            for (var b = a.touches[0].pageX - 0.5 * this.width,
                a = a.touches[0].pageY - 0.5 * this.height, b = b - this._x, a = a - this._y, c = -1, f = 1E6, m = 0; m < this.childrenList.length; m++) {
                var n = this.childrenList[m];
                if (!n.isGlobeParticle) {
                    var o = 2 * n.size * n.scaleInDepth;
                    try {
                        var p = n.distanceToPos(b, a);
                        if (p < o * o && p < f) {
                            console.log("FOUND ONE");
                            if (-1 < c) this.childrenList[c].offsetScale = 0, this.childrenList[c].targetSpeed = 1, n.mouseLocked = !1;
                            f = p;
                            c = m;
                            n.offsetScale = 1;
                            n.targetSpeed = 0.25;
                            n.mouseLocked = !0
                        } else n.offsetScale = 0, n.targetSpeed = 1, n.mouseLocked = !1
                    } catch (q) {
                        console.log("ERROR : ", n)
                    }
                }
            } - 1 <
                c && this.dispatchCustomEvent(e.ON_PARTICLE_CLICK, {
                    particle: this.childrenList[c]
                })
        }
    };
    a.render = function() {
        var a = this.ctx;
        (new Date).getTime();
        a.clearRect(0, 0, this.width, this.height);
        mat4.multiply(this.projection, this.camera.update(), this.mtx);
        mat4.multiply(this.projection, this.cameraGlobe.update(), this.mtxGlobe);
        var c = vec3.create(),
            d = vec3.create(),
            e, m;
        a.save();
        a.translate(0.5 * this.width + this._x, 0.5 * this.height + this._y);
        for (var n = 0; n < this.childrenList.length; n++) {
            var o = this.childrenList[n];
            Math.random();
            if (0 != o.alpha) {
                vec3.set([o.x, o.y, o.z], c);
                o.isGlobeParticle ? mat4.multiplyVec3(this.mtxGlobe, c, d) : mat4.multiplyVec3(this.mtx, c, d);
                e = b.map(d[2], 0, this.zFar, 0, 1);
                m = Math.pow(e, f.sizeDifferenceInDepth);
                a.save();
                d[0] *= e;
                d[1] *= e;
                o.finalPos ? vec3.set(d, o.finalPos) : o.finalPos = vec3.create([d]);
                o.depthScale = e;
                a.translate(d[0], d[1]);
                a.scale(m, m);
                if (!(0.5 > o.size * m) && (a.globalAlpha = o.alpha, 0.01 <= a.globalAlpha)) {
                    if (0 < o.connectDots.length) {
                        a.beginPath();
                        a.globalAlpha = 0.5;
                        for (e = 0; e < o.connectDots.length; e++) {
                            var p = o.connectDots[e];
                            if (void 0 != o.finalPos && void 0 != p.finalPos) o.isGlobeParticle ? (a.moveTo(0, 0), a.strokeStyle = "rgba(255, 255, 255, .25);") : (a.moveTo(0, 0), a.strokeStyle = p.color), a.lineTo((p.finalPos[0] - o.finalPos[0]) / m, (p.finalPos[1] - o.finalPos[1]) / m), a.stroke()
                        }
                    }
                    a.beginPath();
                    a.arc(0, 0, o.size * o.scale, 0, 2 * Math.PI, !1);
                    a.fillStyle = o.isGlobeParticle ? "#fff" : o.color;
                    a.fill()
                }
                a.restore()
            }
        }
        a.restore()
    };
    a.lock = function(a) {
        this._isLocked = a
    };
    a.resize = function(a, b) {
        this.width = a;
        this.height = b;
        this.ctx.canvas.width = this.width;
        this.ctx.canvas.height =
            this.height
    }
});
breelNS.defineClass(breelNS.projectName + ".canvas.Renderer3D", breelNS.projectName + ".canvas.CanvasRenderer", function(a) {
    var c = breelNS.getNamespace(breelNS.projectName + ".canvas").CanvasRenderer,
        e = breelNS.getNamespace(breelNS.projectName + ".canvas").HoverCamera,
        b, d, f;
    a.init = function(a) {
        b = breelNS.getNamespace(breelNS.projectName).singletons.siteManager;
        f = b.settings.colors;
        d = b.scheduler;
        this.gl = a;
        this.width = a.canvas.width;
        this.height = a.canvas.height;
        this.zFar = 4E3;
        this._y = this._x = 0;
        this.childrenList = [];
        this.projection =
            mat4.create();
        this.camera = mat4.create();
        this.isStarted = !0;
        this.matrix = mat4.create();
        mat4.identity(this.matrix);
        this.gl.viewport(0, 0, this.width, this.height);
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.clearColor(0, 0, 0, 0);
        this.gl.enable(this.gl.BLEND);
        this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
        this.projection = mat4.perspective(45, a.canvas.width / a.canvas.height, 1, this.zFar);
        this.camera = (new e).init(2E3, 0.1, !0);
        this.camera._targetRX = 0.25 * -Math.PI;
        this.camera._targetRY = 0.4 * -Math.PI;
        this.camera.target.set([0, 100, 0]);
        this.cameraGlobe = (new e).init(2E3, 0.1, !0);
        this.cameraGlobe.target.set([0, 100, 0]);
        this.cameraGlobe.enableTouchEvents();
        this.mtx = mat4.create();
        this.efIndex = d.addEF(this, this.render, []);
        this.buf = new Uint8Array(4);
        this.isIn2D = !1;
        this._prestate = this._state = 0;
        this._isLocked = !1;
        this._initTextures();
        this._initViews();
        var c = this;
        this.isTouch = !1;
        (this.isTouch = "ontouchstart" in window || navigator.msMaxTouchPoints ? !0 : !1) ? document.body.addEventListener("touchstart", function(a) {
                c._onTouchStart(a)
            }):
            (document.body.addEventListener("click", function(a) {
                c._onClick(a)
            }), document.body.addEventListener("mousemove", function(a) {
                c._onTouchMove(a)
            }));
        return this
    };
    a._onClick = function() {
        if (!("Landing" != b.globalStateManager.getCurrentState() || this._isLocked))
            for (var a = 0; a < this.childrenList.length; a++) {
                var d = this.childrenList[a];
                if (!d.isGlobeParticle && d.mouseLocked) {
                    d.mouseLocked = !1;
                    this.dispatchCustomEvent(c.ON_PARTICLE_CLICK, {
                        particle: d
                    });
                    break
                }
            }
    };
    a._onTouchMove = function(a) {
        if (!("Landing" != b.globalStateManager.getCurrentState() ||
            this._isLocked || this._mouseLocked)) {
            for (var c = vec3.create([a.clientX, this.height - a.clientY, 0]), d = vec3.create([a.clientX, this.height - a.clientY, 1]), e = this.camera.matrix, f = [0, 0, this.width, this.height], c = vec3.unproject(c, e, this.projection, f), d = vec3.unproject(d, e, this.projection, f), e = -1, f = 1E3, n = 0; n < this.childrenList.length; n++) {
                var o = this.childrenList[n];
                if (!o.isGlobeParticle) {
                    var p = (o.z - c[2]) / (d[2] - c[2]),
                        q = 2 * o.size * o.scaleInDepth,
                        p = o.distanceToPos(p * (d[0] - c[0]) + c[0], p * (d[1] - c[1]) + c[1]);
                    if (p < q * q && p < f) {
                        if (-1 <
                            e) this.childrenList[e].offsetScale = 0, this.childrenList[e].targetSpeed = 1, o.mouseLocked = !1;
                        f = p;
                        e = n;
                        o.offsetScale = 1;
                        o.targetSpeed = 0.25;
                        o.mouseLocked = !0
                    } else o.offsetScale = 0, o.targetSpeed = 1, o.mouseLocked = !1
                }
            }
            0 > e ? this.dispatchCustomEvent("onParticleOut") : this.dispatchCustomEvent("onParticleOver", {
                particle: this.childrenList[e],
                x: a.clientX,
                y: a.clientY
            })
        }
    };
    a._onTouchStart = function(a) {
        if (!("Landing" != b.globalStateManager.getCurrentState() || this._isLocked)) {
            for (var d = vec3.create([a.touches[0].pageX, this.height -
                a.touches[0].pageY, 0
            ]), a = vec3.create([a.touches[0].pageX, this.height - a.touches[0].pageY, 1]), e = this.camera.matrix, f = [0, 0, this.width, this.height], d = vec3.unproject(d, e, this.projection, f), a = vec3.unproject(a, e, this.projection, f), e = -1, f = 1E6, m = 0; m < this.childrenList.length; m++) {
                var n = this.childrenList[m];
                if (!n.isGlobeParticle) {
                    var o = (n.z - d[2]) / (a[2] - d[2]),
                        p = o * (a[0] - d[0]) + d[0],
                        o = o * (a[1] - d[1]) + d[1],
                        q = 2 * n.size * n.scaleInDepth;
                    try {
                        var r = n.distanceToPos(p, o);
                        if (r < q * q && r < f) {
                            if (-1 < e) this.childrenList[e].offsetScale =
                                0, this.childrenList[e].targetSpeed = 1, n.mouseLocked = !1;
                            f = r;
                            e = m;
                            n.offsetScale = 1;
                            n.targetSpeed = 0.25;
                            n.mouseLocked = !0
                        } else n.offsetScale = 0, n.targetSpeed = 1, n.mouseLocked = !1
                    } catch (t) {
                        console.log("ERROR : ", n)
                    }
                }
            } - 1 < e && this.dispatchCustomEvent(c.ON_PARTICLE_CLICK, {
                particle: this.childrenList[e]
            })
        }
    };
    a.stop = function() {
        d.removeEF(this.efIndex);
        this.efIndex = -1
    };
    a._initTextures = function() {
        var a = document.createElement("canvas");
        a.width = 512;
        a.height = 512;
        var b = a.getContext("2d"),
            c;
        for (c = 0; c < f.length; c++) {
            var d = c %
                4,
                e = Math.floor(c / 4);
            b.beginPath();
            b.arc(64 + 128 * d, 64 + 128 * e, 60, 0, 2 * Math.PI, !1);
            b.fillStyle = f[c];
            b.fill()
        }
        c = f.length;
        d = c % 4;
        e = Math.floor(c / 4);
        b.beginPath();
        b.arc(64 + 128 * d, 64 + 128 * e, 60, 0, 2 * Math.PI, !1);
        b.fillStyle = "#fff";
        b.fill();
        this.texture = new bongiovi.GLTexture(this.gl, a)
    };
    a._initViews = function() {
        this._vParticles = new ViewParticles(this.gl, !1);
        this._vGlobe = new ViewGlobe(this.gl);
        this._vLines = new ViewLines(this.gl, !1);
        this._vGlobeLines = new ViewGlobeLines(this.gl, !0);
        this._vPicking = new ViewPicking(this.gl)
    };
    a._generateBuffers = function() {
        this._vParticles.updateModel(this.childrenList);
        this._vGlobe.updateModel(this.childrenList);
        this._vLines.updateModel(this.childrenList);
        this._vGlobeLines.updateModel(this.childrenList)
    };
    a.render = function() {
        this._generateBuffers();
        this.matrix = this.camera.update();
        this.matrixGlobe = this.cameraGlobe.update();
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        this._vParticles.isReady && (this._vLines.render(this.matrix, this.projection, this.texture), this._vParticles.render(this.matrix,
            this.projection, this.texture), this._vGlobeLines.render(this.matrixGlobe, this.projection, this.texture), this._vGlobe.render(this.matrixGlobe, this.projection, this.texture))
    };
    a.lock = function(a) {
        this._isLocked = a
    };
    a.resize = function(a, b) {
        this.width = a;
        this.height = b;
        this.gl.canvas.width = this.width;
        this.gl.canvas.height = this.height;
        this.gl.viewport(0, 0, this.width, this.height);
        this.projection = mat4.perspective(45, this.width / this.height, 1, this.zFar)
    }
});
vec3.unproject = function(a, c, e, b, d) {
    d || (d = a);
    var f = mat4.create(),
        g = Array(4);
    g[0] = 2 * (a[0] - b[0]) / b[2] - 1;
    g[1] = 2 * (a[1] - b[1]) / b[3] - 1;
    g[2] = 2 * a[2] - 1;
    g[3] = 1;
    mat4.multiply(e, c, f);
    if (!mat4.inverse(f)) return null;
    mat4.multiplyVec4(f, g);
    if (0 === g[3]) return null;
    d[0] = g[0] / g[3];
    d[1] = g[1] / g[3];
    d[2] = g[2] / g[3];
    return d
};
var shaders = {
    "copy-vs": {
        type: "vertex-shader",
        glsl: ["precision highp float;", "attribute vec3 aVertexPosition;", "attribute vec2 aTextureCoord;", "uniform mat4 uMVMatrix;", "uniform mat4 uPMatrix;", "varying vec2 vTextureCoord;", "void main(void) {", "gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);", "vTextureCoord = aTextureCoord;", "}"]
    },
    "copy-fs": {
        type: "fragment-shader",
        glsl: ["precision mediump float;", "varying vec2 vTextureCoord;", "uniform sampler2D uSampler0;", "void main(void) {", "gl_FragColor = texture2D(uSampler0, vec2(vTextureCoord.s, vTextureCoord.t));",
            "}"
        ]
    },
    "line-vs": {
        type: "vertex-shader",
        glsl: ["precision highp float;", "attribute vec3 aVertexPosition;", "attribute vec2 aTextureCoord;", "attribute vec4 aVertexColor;", "uniform mat4 uMVMatrix;", "uniform mat4 uPMatrix;", "varying vec2 vTextureCoord;", "varying vec4 vVertexColor;", "void main(void) {", "gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);", "vTextureCoord = aTextureCoord;", "vVertexColor = aVertexColor;", "}"]
    },
    "line-fs": {
        type: "fragment-shader",
        glsl: ["precision mediump float;", "varying vec2 vTextureCoord;",
            "varying vec4 vVertexColor;", "uniform sampler2D uSampler0;", "void main(void) {", "gl_FragColor = texture2D(uSampler0, vec2(vTextureCoord.s, vTextureCoord.t));", "gl_FragColor = vVertexColor;", "}"
        ]
    },
    "line-globe-fs": {
        type: "fragment-shader",
        glsl: ["precision mediump float;", "varying vec2 vTextureCoord;", "varying vec4 vVertexColor;", "uniform float globeAlpha;", "uniform sampler2D uSampler0;", "void main(void) {", "gl_FragColor = texture2D(uSampler0, vec2(vTextureCoord.s, vTextureCoord.t));", "gl_FragColor = vVertexColor;",
            "gl_FragColor.a *= globeAlpha;", "}"
        ]
    },
    "shader-vs": {
        type: "vertex-shader",
        glsl: ["precision highp float;", "attribute vec3 aVertexPosition;", "attribute vec2 aTextureCoord;", "attribute vec2 aUVOffset;", "uniform mat4 uMVMatrix;", "uniform mat4 uPMatrix;", "varying vec2 vTextureCoord;", "varying vec2 vUVOffset;", "void main(void) {", "gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);", "vTextureCoord = aTextureCoord;", "vUVOffset = aUVOffset;", "}"]
    },
    "facefront-vs": {
        type: "vertex-shader",
        glsl: ["precision highp float;",
            "attribute vec3 aVertexPosition;", "attribute vec2 aTextureCoord;", "attribute vec3 sizeOffset;", "attribute vec2 aUVOffset;", "uniform mat4 uMVMatrix;", "uniform mat4 uPMatrix;", "uniform mat3 invertCamera;", "varying vec2 vTextureCoord;", "varying vec2 vUVOffset;", "varying float vAlpha;", "varying vec4 V;", "void main(void) {", "vec3 size = vec3(sizeOffset.xy, 0.0);", "vec3 adjustSize = size * invertCamera;", "vec3 pos = aVertexPosition + adjustSize;", "vec4 finalPos = uPMatrix * uMVMatrix * vec4(pos, 1.0);",
            "gl_Position = finalPos;", "V = finalPos;", "vTextureCoord = aTextureCoord;", "vUVOffset = aUVOffset;", "vAlpha = sizeOffset.z;", "}"
        ]
    },
    "particle-fs": {
        type: "fragment-shader",
        glsl: ["precision mediump float;", "varying vec2 vTextureCoord;", "uniform sampler2D uSampler0;", "varying vec2 vUVOffset;", "varying float vAlpha;", "varying vec4 V;", "float map(float value, float sx, float sy, float tx, float ty) {", "float p = (value-sx) / (sy-sx);", "if(p < 0.0) p = 0.0;", "if(p>1.0) p = 1.0;", "return p * ( ty - tx) + tx;",
            "}", "void main(void) {", "vec2 offset = vUVOffset;", "vec2 uv = offset + vTextureCoord*.25;", "gl_FragColor = texture2D(uSampler0, uv);", "float alphaOffset = 1.0;", "gl_FragColor.a *= vAlpha * alphaOffset;", "}"
        ]
    },
    "particle-fs-globe": {
        type: "fragment-shader",
        glsl: ["precision mediump float;", "varying vec2 vTextureCoord;", "uniform sampler2D uSampler0;", "uniform float globeAlpha;", "varying vec2 vUVOffset;", "varying float vAlpha;", "varying vec4 V;", "float map(float value, float sx, float sy, float tx, float ty) {",
            "float p = (value-sx) / (sy-sx);", "if(p < 0.0) p = 0.0;", "if(p>1.0) p = 1.0;", "return p * ( ty - tx) + tx;", "}", "void main(void) {", "vec2 offset = vUVOffset;", "vec2 uv = offset + vTextureCoord*.25;", "gl_FragColor = texture2D(uSampler0, uv);", "gl_FragColor.r /= gl_FragColor.a;", "gl_FragColor.g /= gl_FragColor.a;", "gl_FragColor.b /= gl_FragColor.a;", "gl_FragColor.a *= vAlpha * globeAlpha;", "}"
        ]
    },
    "shader-fs": {
        type: "fragment-shader",
        glsl: ["precision mediump float;", "varying vec2 vTextureCoord;", "uniform sampler2D uSampler0;",
            "varying vec2 vUVOffset;", "void main(void) {", "vec2 offset = vUVOffset;", "vec2 uv = offset + vTextureCoord*.25;", "gl_FragColor = texture2D(uSampler0, uv);", "gl_FragColor.r /= gl_FragColor.a;", "gl_FragColor.g /= gl_FragColor.a;", "gl_FragColor.b /= gl_FragColor.a;", "}"
        ]
    },
    "picking-vs": {
        type: "vertex-shader",
        glsl: ["precision highp float;", "attribute vec3 aVertexPosition;", "attribute vec2 aTextureCoord;", "attribute vec2 sizeOffset;", "attribute vec2 aUVOffset;", "attribute vec3 aVertexColor;", "uniform mat4 uMVMatrix;",
            "uniform mat4 uPMatrix;", "uniform mat3 invertCamera;", "varying vec2 vTextureCoord;", "varying vec2 vUVOffset;", "varying vec3 vVertexColor;", "void main(void) {", "vec3 size = vec3(sizeOffset, 0.0);", "vec3 adjustSize = size * invertCamera;", "vec3 pos = aVertexPosition + adjustSize;", "gl_Position = uPMatrix * uMVMatrix * vec4(pos, 1.0);", "vTextureCoord = aTextureCoord;", "vVertexColor = aVertexColor;", "vUVOffset = aUVOffset;", "}"
        ]
    },
    "picking-fs": {
        type: "fragment-shader",
        glsl: ["precision highp float;", "varying vec2 vTextureCoord;",
            "uniform sampler2D uSampler0;", "varying vec2 vUVOffset;", "varying vec3 vVertexColor;", "void main(void) {", "vec2 offset = vUVOffset;", "vec2 uv = offset + vTextureCoord*.25;", "gl_FragColor = texture2D(uSampler0, uv);", "gl_FragColor.rgb = vVertexColor;", "gl_FragColor.a = gl_FragColor.a == 0.0 ? 0.0 : 1.0;", "}"
        ]
    }
};
(function() {
    var a;
    ViewParticles = function(c, b) {
        if (void 0 != c) a = breelNS.getNamespace(breelNS.projectName).singletons.siteManager, this.isGlobe = b, this._preCount = 0, View.call(this, c, "facefront-vs", "particle-fs")
    };
    var c = ViewParticles.prototype = new View;
    c._init = function() {
        this.isReady = !1
    };
    c.updateModel = function(c) {
        for (var b = [], d = 0; d < c.length; d++) this.isGlobe ? c[d].isGlobeParticle && b.push(c[d]) : c[d].isGlobeParticle || b.push(c[d]);
        if (0 != b.length) {
            b.sort(function(a, b) {
                return b.z - a.z
            });
            c = !1;
            if (void 0 == this.model) this.model =
                new bongiovi.GLModel(this.gl, 7E3), this.model.setAttribute(0, "aUVOffset", 2), this.model.setAttribute(1, "sizeOffset", 3), c = !0;
            for (var f = {
                x: 0,
                y: 0,
                z: 0,
                size: 0,
                scaleInDepth: 0,
                isGlobeParticle: !1,
                colorIndex: 0,
                alpha: 0
            }, g = 0, d = 0; 1750 > d; d++) {
                var h = b[d];
                void 0 == h && (h = f, g++);
                this.model.updateVertex(4 * d + 0, h.x, h.y, h.z);
                this.model.updateVertex(4 * d + 1, h.x, h.y, h.z);
                this.model.updateVertex(4 * d + 2, h.x, h.y, h.z);
                this.model.updateVertex(4 * d + 3, h.x, h.y, h.z);
                this.model.updateTextCoord(4 * d + 0, 0, 0);
                this.model.updateTextCoord(4 * d +
                    1, 1, 0);
                this.model.updateTextCoord(4 * d + 2, 1, 1);
                this.model.updateTextCoord(4 * d + 3, 0, 1);
                var l = a.settings.colors.length;
                if (!h.isGlobeParticle) l = h.colorIndex;
                var k = 0.25 * (l % 4),
                    l = 0.75 - 0.25 * Math.floor(l / 4);
                this.model.updateAttribute(0, 4 * d + 0, [k, l]);
                this.model.updateAttribute(0, 4 * d + 1, [k, l]);
                this.model.updateAttribute(0, 4 * d + 2, [k, l]);
                this.model.updateAttribute(0, 4 * d + 3, [k, l]);
                k = h.alpha;
                this.model.updateAttribute(1, 4 * d + 0, [-h.size * h.scaleInDepth, -h.size * h.scaleInDepth, k]);
                this.model.updateAttribute(1, 4 * d + 1, [h.size *
                    h.scaleInDepth, -h.size * h.scaleInDepth, k
                ]);
                this.model.updateAttribute(1, 4 * d + 2, [h.size * h.scaleInDepth, h.size * h.scaleInDepth, k]);
                this.model.updateAttribute(1, 4 * d + 3, [-h.size * h.scaleInDepth, h.size * h.scaleInDepth, k])
            }
            c ? this.model.generateBuffer() : this.model.updateBuffer();
            this.isReady = !0
        }
    };
    c.render = function(a, b, c) {
        if (this.model) this.invert = mat4.create(a), mat4.inverse(this.invert), this.invertCamera = mat4.toInverseMat3(this.invert), this.model.setTexture(0, c), this.shader.setParameter("invertCamera", "uniformMatrix3fv",
            this.invertCamera), this.model.render(this.shader, a, b)
    }
})();
(function() {
    var a;
    ViewGlobe = function(c) {
        if (void 0 != c) a = breelNS.getNamespace(breelNS.projectName).singletons.siteManager, this._preCount = 0, this._hasModelCreated = !1, this._particles = [], View.call(this, c, "facefront-vs", "particle-fs-globe")
    };
    var c = ViewGlobe.prototype = new View;
    c._init = function() {
        this.isReady = !1
    };
    c.updateModel = function(c) {
        if (!this._hasModelCreated) {
            for (var b = [], d = 0; d < c.length; d++) c[d].isGlobeParticle && b.push(c[d]);
            if (0 != b.length) {
                this._particles = b;
                c = !1;
                if (void 0 == this.model) this.model = new bongiovi.GLModel(this.gl,
                    2E4), this.model.setAttribute(0, "aUVOffset", 2), this.model.setAttribute(1, "sizeOffset", 3), c = !0;
                for (var f = {
                    x: 0,
                    y: 0,
                    z: 0,
                    size: 0,
                    scaleInDepth: 0,
                    isGlobeParticle: !1,
                    colorIndex: 0,
                    alpha: 0
                }, g = 0, d = 0; 5E3 > d; d++) {
                    var h = b[d];
                    void 0 == h && (h = f, g++);
                    this.model.updateVertex(4 * d + 0, h.x, h.y, h.z);
                    this.model.updateVertex(4 * d + 1, h.x, h.y, h.z);
                    this.model.updateVertex(4 * d + 2, h.x, h.y, h.z);
                    this.model.updateVertex(4 * d + 3, h.x, h.y, h.z);
                    this.model.updateTextCoord(4 * d + 0, 0, 0);
                    this.model.updateTextCoord(4 * d + 1, 1, 0);
                    this.model.updateTextCoord(4 *
                        d + 2, 1, 1);
                    this.model.updateTextCoord(4 * d + 3, 0, 1);
                    var l = a.settings.colors.length;
                    if (!h.isGlobeParticle) l = h.colorIndex;
                    var k = 0.25 * (l % 4),
                        l = 0.75 - 0.25 * Math.floor(l / 4);
                    this.model.updateAttribute(0, 4 * d + 0, [k, l]);
                    this.model.updateAttribute(0, 4 * d + 1, [k, l]);
                    this.model.updateAttribute(0, 4 * d + 2, [k, l]);
                    this.model.updateAttribute(0, 4 * d + 3, [k, l]);
                    this.model.updateAttribute(1, 4 * d + 0, [-h.size * h.scaleInDepth, -h.size * h.scaleInDepth, h.targetGlobeAlpha]);
                    this.model.updateAttribute(1, 4 * d + 1, [h.size * h.scaleInDepth, -h.size * h.scaleInDepth,
                        h.targetGlobeAlpha
                    ]);
                    this.model.updateAttribute(1, 4 * d + 2, [h.size * h.scaleInDepth, h.size * h.scaleInDepth, h.targetGlobeAlpha]);
                    this.model.updateAttribute(1, 4 * d + 3, [-h.size * h.scaleInDepth, h.size * h.scaleInDepth, h.targetGlobeAlpha])
                }
                c ? this.model.generateBuffer() : this.model.updateBuffer();
                this._hasModelCreated = this.isReady = !0
            }
        }
    };
    c.render = function(a, b, c) {
        if (this.model && 0 != this._particles[0].alpha) this.invert = mat4.create(a), mat4.inverse(this.invert), this.invertCamera = mat4.toInverseMat3(this.invert), this.model.setTexture(0,
            c), this.shader.setParameter("invertCamera", "uniformMatrix3fv", this.invertCamera), this.shader.setParameter("globeAlpha", "uniform1f", this._particles[0].alpha / 0.25), this.model.render(this.shader, a, b)
    }
})();
(function() {
    ViewLines = function(a, e) {
        if (void 0 != a) this.isGlobe = e, this.modelGenerated = !1, View.call(this, a, "line-vs", "line-fs")
    };
    var a = ViewLines.prototype = new View;
    a._init = function() {
        this.model = new bongiovi.GLModel(this.gl, 4);
        this.model.setAttribute(0, "aVertexColor", 4);
        this.justCreated = this.model.showWireFrame = !0;
        for (var a = [], e = 0; 100 > e; e++) a.push(e);
        this.model.generateIndexBuffer(a)
    };
    a.updateModel = function(a) {
        for (var e = [], b = 0; b < a.length; b++) this.isGlobe ? a[b].isGlobeParticle && e.push(a[b]) : a[b].isGlobeParticle ||
            e.push(a[b]);
        a = [];
        for (b = 0; b < e.length; b++) 0 < e[b].numConnectDots && a.push(e[b]);
        for (b = e = 0; b < a.length; b++)
            for (var d = a[b], f = 0; f < d.connectDots.length; f++) {
                var g = d.connectDots[f],
                    h;
                h = g.color;
                void 0 == h && (h = "#83b601");
                var l = h;
                try {
                    h = h.replace("#", "")
                } catch (k) {
                    console.log(l);
                    debugger
                }
                h = parseInt(h, 16);
                l = {};
                l.r = (h >> 16 & 255) / 255;
                l.g = (h >> 8 & 255) / 255;
                l.b = (h & 255) / 255;
                l.a = 0.25;
                h = l;
                h.a = 0.2 * g.alpha;
                if (g.isGlobeParticle) h.r = h.g = h.b = 1, h.a = 0.1 * g.alpha;
                this.model.updateVertex(e, d.x, d.y, d.z);
                this.model.updateTextCoord(e, 0,
                    0);
                this.model.updateAttribute(0, e, [h.r, h.g, h.b, h.a]);
                e++;
                this.model.updateVertex(e, g.x, g.y, g.z);
                this.model.updateTextCoord(e, 0, 0);
                this.model.updateAttribute(0, e, [h.r, h.g, h.b, h.a]);
                e++
            }
        for (b = e; 100 > b; b++) this.model.updateVertex(b, 0, 0, 0), this.model.updateTextCoord(b, 0, 0), this.model.updateAttribute(0, b, [0, 0, 0, 0]);
        this.justCreated ? this.model.generateBuffer() : this.model.updateBuffer();
        this.justCreated = !1
    };
    a.render = function(a, e, b) {
        this.gl.lineWidth(0.5);
        this.model.setTexture(0, b);
        this.model.render(this.shader,
            a, e)
    }
})();
(function() {
    ViewGlobeLines = function(a) {
        if (void 0 != a) this.modelGenerated = !1, this._lines = [], View.call(this, a, "line-vs", "line-globe-fs")
    };
    var a = ViewGlobeLines.prototype = new View;
    a._init = function() {
        this.model = new bongiovi.GLModel(this.gl, 4);
        this.model.setAttribute(0, "aVertexColor", 4);
        this.justCreated = this.model.showWireFrame = !0;
        for (var a = [], e = 0; 3E3 > e; e++) a.push(e);
        this.model.generateIndexBuffer(a)
    };
    a.updateModel = function(a) {
        if (!this.modelGenerated) {
            this.modelGenerated = !0;
            for (var e = [], b = 0; b < a.length; b++) a[b].isGlobeParticle &&
                e.push(a[b]);
            a = [];
            for (b = 0; b < e.length; b++) 0 < e[b].numConnectDots && a.push(e[b]);
            this._lines = a;
            for (b = e = 0; b < a.length; b++)
                for (var d = a[b], f = 0; f < d.connectDots.length; f++) {
                    var g = d.connectDots[f],
                        h;
                    h = g.color;
                    h = h.replace("#", "");
                    h = parseInt(h, 16);
                    var l = {};
                    l.r = (h >> 16 & 255) / 255;
                    l.g = (h >> 8 & 255) / 255;
                    l.b = (h & 255) / 255;
                    l.a = 0.25;
                    h = l;
                    h.a = 0.2 * g.alpha;
                    if (g.isGlobeParticle) h.r = h.g = h.b = 1, h.a = 0.1 * g.alpha;
                    this.model.updateVertex(e, d.x, d.y, d.z);
                    this.model.updateTextCoord(e, 0, 0);
                    this.model.updateAttribute(0, e, [h.r, h.g, h.b, 0.1]);
                    e++;
                    this.model.updateVertex(e, g.x, g.y, g.z);
                    this.model.updateTextCoord(e, 0, 0);
                    this.model.updateAttribute(0, e, [h.r, h.g, h.b, 0.1]);
                    e++
                }
            for (b = e; 3E3 > b; b++) this.model.updateVertex(b, 0, 0, 0), this.model.updateTextCoord(b, 0, 0), this.model.updateAttribute(0, b, [0, 0, 0, 0]);
            this.justCreated ? this.model.generateBuffer() : this.model.updateBuffer();
            this.justCreated = !1
        }
    };
    a.render = function(a, e, b) {
        0 != this._lines[0].alpha && (this.gl.lineWidth(0.5), this.model.setTexture(0, b), this.shader.setParameter("globeAlpha", "uniform1f",
            this._lines[0].alpha / this._lines[0].targetGlobeAlpha), this.model.render(this.shader, a, e))
    }
})();
(function() {
    ViewPicking = function(a) {
        void 0 != a && View.call(this, a, "picking-vs", "picking-fs")
    };
    var a = ViewPicking.prototype = new View;
    a._init = function() {
        this.isReady = !1
    };
    a.updateModel = function(a) {
        var e = !1;
        if (void 0 == this.model) this.model = new bongiovi.GLModel(this.gl, 4 * a.length), this.model.setAttribute(0, "aUVOffset", 2), this.model.setAttribute(1, "sizeOffset", 2), this.model.setAttribute(2, "aVertexColor", 3), e = !0;
        for (var b = 0; b < a.length; b++) {
            var d = a[b];
            this.model.updateVertex(4 * b + 0, d.x, d.y, d.z);
            this.model.updateVertex(4 *
                b + 1, d.x, d.y, d.z);
            this.model.updateVertex(4 * b + 2, d.x, d.y, d.z);
            this.model.updateVertex(4 * b + 3, d.x, d.y, d.z);
            this.model.updateTextCoord(4 * b + 0, 0, 0);
            this.model.updateTextCoord(4 * b + 1, 1, 0);
            this.model.updateTextCoord(4 * b + 2, 1, 1);
            this.model.updateTextCoord(4 * b + 3, 0, 1);
            var f = 0.25 * (d.colorIndex % 4),
                g = 0.75 - 0.25 * Math.floor(d.colorIndex / 4);
            this.model.updateAttribute(0, 4 * b + 0, [f, g]);
            this.model.updateAttribute(0, 4 * b + 1, [f, g]);
            this.model.updateAttribute(0, 4 * b + 2, [f, g]);
            this.model.updateAttribute(0, 4 * b + 3, [f, g]);
            this.model.updateAttribute(1,
                4 * b + 0, [-d.size, -d.size]);
            this.model.updateAttribute(1, 4 * b + 1, [d.size, -d.size]);
            this.model.updateAttribute(1, 4 * b + 2, [d.size, d.size]);
            this.model.updateAttribute(1, 4 * b + 3, [-d.size, d.size]);
            d = Math.floor(b / 256) / 256;
            f = b % 256 / 256;
            this.model.updateAttribute(2, 4 * b + 0, [0, d, f]);
            this.model.updateAttribute(2, 4 * b + 1, [0, d, f]);
            this.model.updateAttribute(2, 4 * b + 2, [0, d, f]);
            this.model.updateAttribute(2, 4 * b + 3, [0, d, f])
        }
        e ? this.model.generateBuffer() : this.model.updateBuffer();
        this.isReady = !0
    };
    a.render = function(a, e, b) {
        this.invert =
            mat4.create(a);
        mat4.inverse(this.invert);
        this.invertCamera = mat4.toInverseMat3(this.invert);
        this.model.setTexture(0, b);
        this.shader.setParameter("invertCamera", "uniformMatrix3fv", this.invertCamera);
        this.model.render(this.shader, a, e)
    }
})();
breelNS.defineClass(breelNS.projectName + ".page.landing.RingController", "generic.events.EventDispatcher", function(a, c, e) {
    breelNS.getNamespace("generic.events");
    var b = breelNS.getNamespace(breelNS.projectName + ".canvas").Particle,
        d = breelNS.getNamespace(breelNS.projectName + ".page.landing").ParticleController,
        f, g;
    e.ON_SEARCH_ANIM_OVER = "onSearchAnimOver";
    a.init = function(a, b) {
        f = breelNS.getNamespace(breelNS.projectName).singletons.siteManager;
        g = f.settings.params;
        this.particles = a;
        this._renderer = b;
        this._totalRings =
            this._ringIndex = 0;
        this._isTyping = this._isLocked = !1;
        return this
    };
    a.reset = function(a) {
        this._ringIndex = 0;
        this._totalRings = a
    };
    a.shift = function(a) {
        this._ringIndex += a;
        this._totalRings = f.model.numAgencies;
        console.debug("Shift : ", this._ringIndex, this._totalRings);
        this._dir = a;
        if (0 > this._ringIndex) this._ringIndex = this._ringIndex = this._totalRings - 1;
        if (this._ringIndex >= this._totalRings) this._ringIndex = 0;
        for (var b = 0; b < this.particles.length; b++) {
            var c = this.particles[b];
            c.layerRange = 0;
            c.layerIndex -= a;
            if (-2 > c.layerIndex) c.isDying = !0;
            else if (2 < c.layerIndex) c.isDying = !0;
            c.targetAlpha = 0 == c.layerIndex ? 1 : 0;
            c.targetZ = c.layerIndex * g.layerDistance
        }
        f.model.searchForNextAgencyIndex(this._ringIndex, this, this._addShiftData);
        return this._ringIndex
    };
    a._addShiftData = function(a) {
        for (var c = 0; c < a.length; c++) {
            var d = (new b).init();
            d.colorIndex = a[c].genre;
            d.agency = a[c].agencyIndex;
            this.particles.push(d);
            d.layerIndex = 1 == this._dir ? -2 : 2;
            d.targetZ = d.currentZ = d.layerIndex * g.layerDistance;
            d.alpha = d.targetAlpha = 0
        }
    };
    a.search = function(a, b) {
        if (!this._isLocked) {
            this._isLocked = !0;
            this._isTyping = !1;
            this._state = b;
            d = breelNS.getNamespace(breelNS.projectName + ".page.landing").ParticleController;
            this._ringIndex = a;
            for (var c = 0; c < this.particles.length; c++) this.particles[c].isDying = !0;
            console.debug("Search : ", a);
            f.model.searchForAgencyIndexRange(a, this, this._addSearchParticles)
        }
    };
    a._addSearchParticles = function(a) {
        for (var c = [], e = 0; e < a.length; e++) {
            var m = (new b).init();
            m.userObject = a[e];
            m.colorIndex = a[e].songGenresID;
            m.color = f.settings.colors[m.colorIndex];
            m.hasConnections = a[e].hasConnections;
            m.agency = a[e].agencyIndex;
            m.searchType(d.STATES[this._state].type, this._ringIndex, f.model.numAgencies, 5);
            this.particles.push(m);
            if (m.hasConnections) m.numConnectDots = 1 + Math.floor(Math.random() * g.maxConnections), m.particleIndex = e, c.push(m)
        }
        for (e = 0; e < c.length; e++) c[e].initConnectDots(this.particles);
        a = !1;
        for (e = 0; e < this.particles.length; e++)
            if (m = this.particles[e], c = m.layerIndex + 2, m.isDying) m.targetAlpha = m.alpha = 1, (new TWEEN.Tween(this.particles[e])).delay(200 * c).to({
                ringOffset: -5 * g.layerDistance,
                targetAlpha: 0,
                alpha: 0
            }, 1500).easing(TWEEN.Easing.Cubic.InOut).start();
            else if (m.targetAlpha = m.alpha = 0, 5 == m.layerIndex && !a) {
            var n = this,
                a = !0;
            (new TWEEN.Tween(this.particles[e])).delay(200 * c).to({
                ringOffset: -5 * g.layerDistance,
                targetAlpha: 1,
                alpha: 1
            }, 1500).easing(TWEEN.Easing.Cubic.InOut).start().onComplete(function() {
                n._onSearchComplete()
            })
        } else(new TWEEN.Tween(this.particles[e])).delay(200 * c).to({
            ringOffset: -5 * g.layerDistance,
            targetAlpha: 1,
            alpha: 1
        }, 1500).easing(TWEEN.Easing.Cubic.InOut).start()
    };
    a._onSearchComplete =
        function() {
            f.scheduler.delay(this, this._delayResetLayerIndex, [], 500)
        };
    a._delayResetLayerIndex = function() {
        for (var a = !1, b = 0; b < this.particles.length; b++) {
            var c = this.particles[b];
            c.resetLayerIndex();
            if (0 != c.layerIndex)
                if (a)(new TWEEN.Tween(c)).to({
                    layerRange: 500,
                    alpha: 0,
                    targetAlpha: 0
                }, 500).easing(TWEEN.Easing.Cubic.InOut).start();
                else {
                    var d = this;
                    (new TWEEN.Tween(c)).to({
                        layerRange: 500,
                        alpha: 0,
                        targetAlpha: 0
                    }, 400).easing(TWEEN.Easing.Cubic.InOut).start().onComplete(function() {
                        d._searchAnimationOver()
                    });
                    a = !0
                }
        }
        this._isLocked = !1
    };
    a._searchAnimationOver = function() {
        this.dispatchCustomEvent(e.ON_SEARCH_ANIM_OVER)
    };
    a.typing = function() {
        if (!this._isTyping) {
            this._isTyping = !0;
            for (var a = 0; a < this.particles.length; a++) {
                var b = this.particles[a];
                0 != b.layerIndex && (new TWEEN.Tween(b)).to({
                    layerRange: 0,
                    alpha: 1,
                    targetAlpha: 1
                }, 500).easing(TWEEN.Easing.Cubic.Out).start()
            }
        }
    };
    a.getCurrentIndex = function() {
        return this._ringIndex
    };
    a.getData = function() {}
});
breelNS.defineClass(breelNS.projectName + ".page.landing.ParticleController", "generic.events.EventDispatcher", function(a, c, e) {
    var b = breelNS.getNamespace("generic.events").ListenerFunctions,
        d = breelNS.getNamespace(breelNS.projectName + ".canvas").Particle,
        f = breelNS.getNamespace(breelNS.projectName + ".canvas").CanvasRenderer,
        c = breelNS.getNamespace("generic.math").MathUtils,
        g = breelNS.getNamespace(breelNS.projectName + ".page.landing").RingController,
        h = c.random,
        l = c.map,
        k, m, n = [{
            x: -3.277859926223755,
            y: -298.3565673828125,
            z: 31.18675422668457
        }, {
            x: -6.519806861877441,
            y: -293.44427490234375,
            z: 62.03181838989258
        }, {
            x: -9.690321922302246,
            y: -285.31695556640625,
            z: 92.19725036621094
        }, {
            x: -9.690321922302246,
            y: 285.31695556640625,
            z: 92.19725036621094
        }, {
            x: -6.519806861877441,
            y: 293.44427490234375,
            z: 62.03181838989258
        }, {
            x: -6.519806861877441,
            y: -298.3565673828125,
            z: 30.67327880859375
        }, {
            x: -12.968180656433105,
            y: -293.44427490234375,
            z: 61.010498046875
        }, {
            x: -19.274473190307617,
            y: -285.31695556640625,
            z: 90.67927551269531
        }, {
            x: -50.46122360229492,
            y: -176.3355712890625,
            z: 237.4014129638672
        }, {
            x: -54.01704025268555,
            y: -150,
            z: 254.1302032470703
        }, {
            x: -62.03181838989258,
            y: 31.358539581298828,
            z: 291.8367614746094
        }, {
            x: -19.274473190307617,
            y: 285.31695556640625,
            z: 90.67927551269531
        }, {
            x: -9.690321922302246,
            y: -298.3565673828125,
            z: 29.82374382019043
        }, {
            x: -19.27447509765625,
            y: -293.44427490234375,
            z: 59.32073211669922
        }, {
            x: -28.647451400756836,
            y: -285.31695556640625,
            z: 88.16778564453125
        }, {
            x: -37.70656204223633,
            y: -274.0636291503906,
            z: 116.04886627197266
        }, {
            x: -37.70656204223633,
            y: 274.0636291503906,
            z: 116.04886627197266
        }, {
            x: -28.647451400756836,
            y: 285.31695556640625,
            z: 88.16778564453125
        }, {
            x: -12.754667282104492,
            y: -298.3565673828125,
            z: 28.647449493408203
        }, {
            x: -25.369590759277344,
            y: -293.44427490234375,
            z: 56.98103332519531
        }, {
            x: -37.70656204223633,
            y: -285.31695556640625,
            z: 84.69032287597656
        }, {
            x: -49.630409240722656,
            y: -274.0636291503906,
            z: 111.47171783447266
        }, {
            x: -49.630409240722656,
            y: 274.0636291503906,
            z: 111.47171783447266
        }, {
            x: -37.70656204223633,
            y: 285.31695556640625,
            z: 84.69032287597656
        }, {
            x: -15.679269790649414,
            y: -298.3565673828125,
            z: 27.157289505004883
        }, {
            x: -31.186752319335938,
            y: -293.44427490234375,
            z: 54.01704025268555
        }, {
            x: -46.3525505065918,
            y: -285.31695556640625,
            z: 80.28497314453125
        }, {
            x: -61.010498046875,
            y: -274.0636291503906,
            z: 105.67327880859375
        }, {
            x: -150,
            y: 0,
            z: 259.8076171875
        }, {
            x: -75,
            y: 259.8076171875,
            z: 129.90380859375
        }, {
            x: -46.3525505065918,
            y: 285.31695556640625,
            z: 80.28497314453125
        }, {
            x: -18.432086944580078,
            y: -298.3565673828125,
            z: 25.369590759277344
        }, {
            x: -36.662227630615234,
            y: -293.44427490234375,
            z: 50.46123123168945
        }, {
            x: -54.49068832397461,
            y: -285.31695556640625,
            z: 75
        }, {
            x: -71.72213745117188,
            y: -274.0636291503906,
            z: 98.71705627441406
        }, {
            x: -152.71109008789062,
            y: -150,
            z: 210.18878173828125
        }, {
            x: -161.09056091308594,
            y: -122.02099609375,
            z: 221.72213745117188
        }, {
            x: -167.70509338378906,
            y: -92.7051010131836,
            z: 230.82627868652344
        }, {
            x: -176.3355712890625,
            y: 0,
            z: 242.70509338378906
        }, {
            x: -71.72213745117188,
            y: 274.0636291503906,
            z: 98.71705627441406
        }, {
            x: -54.49068832397461,
            y: 285.31695556640625,
            z: 75
        }, {
            x: -36.662227630615234,
            y: 293.44427490234375,
            z: 50.46123123168945
        }, {
            x: -20.982959747314453,
            y: -298.3565673828125,
            z: 23.30393409729004
        }, {
            x: -41.73602294921875,
            y: -293.44427490234375,
            z: 46.3525505065918
        }, {
            x: -62.03181838989258,
            y: -285.31695556640625,
            z: 68.893310546875
        }, {
            x: -81.64797973632812,
            y: -274.0636291503906,
            z: 90.67926025390625
        }, {
            x: -173.84523010253906,
            y: -150,
            z: 193.07469177246094
        }, {
            x: -183.38436889648438,
            y: -122.02099609375,
            z: 203.66896057128906
        }, {
            x: -190.914306640625,
            y: -92.7051010131836,
            z: 212.03179931640625
        }, {
            x: -196.35255432128906,
            y: -62.373504638671875,
            z: 218.0715789794922
        }, {
            x: -199.63951110839844,
            y: -31.358539581298828,
            z: 221.72213745117188
        }, {
            x: -200.7391815185547,
            y: 0,
            z: 222.9434356689453
        }, {
            x: -81.64797973632812,
            y: 274.0636291503906,
            z: 90.67926025390625
        }, {
            x: -62.03181838989258,
            y: 285.31695556640625,
            z: 68.893310546875
        }, {
            x: -41.73602294921875,
            y: 293.44427490234375,
            z: 46.3525505065918
        }, {
            x: -23.30393409729004,
            y: -298.3565673828125,
            z: 20.982959747314453
        }, {
            x: -46.3525505065918,
            y: -293.44427490234375,
            z: 41.73602294921875
        }, {
            x: -68.893310546875,
            y: -285.31695556640625,
            z: 62.03181838989258
        }, {
            x: -90.67926025390625,
            y: -274.0636291503906,
            z: 81.64797973632812
        }, {
            x: -193.07469177246094,
            y: -150,
            z: 173.84523010253906
        }, {
            x: -203.66896057128906,
            y: -122.02099609375,
            z: 183.38436889648438
        }, {
            x: -212.03179931640625,
            y: -92.7051010131836,
            z: 190.914306640625
        }, {
            x: -218.0715789794922,
            y: -62.373504638671875,
            z: 196.35255432128906
        }, {
            x: -222.9434356689453,
            y: 0,
            z: 200.7391815185547
        }, {
            x: -165.67926025390625,
            y: 200.7391815185547,
            z: 149.17828369140625
        }, {
            x: -131.04287719726562,
            y: 242.70509338378906,
            z: 117.99153900146484
        }, {
            x: -111.47171783447266,
            y: 259.8076171875,
            z: 100.36959075927734
        }, {
            x: -90.67926025390625,
            y: 274.0636291503906,
            z: 81.64797973632812
        }, {
            x: -68.893310546875,
            y: 285.31695556640625,
            z: 62.03181838989258
        }, {
            x: -46.3525505065918,
            y: 293.44427490234375,
            z: 41.73602294921875
        }, {
            x: -25.369590759277344,
            y: -298.3565673828125,
            z: 18.432086944580078
        }, {
            x: -50.46123123168945,
            y: -293.44427490234375,
            z: 36.662227630615234
        }, {
            x: -75,
            y: -285.31695556640625,
            z: 54.49068832397461
        }, {
            x: -98.71705627441406,
            y: -274.0636291503906,
            z: 71.72213745117188
        }, {
            x: -221.72213745117188,
            y: -122.02099609375,
            z: 161.09056091308594
        }, {
            x: -230.82627868652344,
            y: -92.7051010131836,
            z: 167.70509338378906
        }, {
            x: -237.4014129638672,
            y: -62.373504638671875,
            z: 172.4822235107422
        }, {
            x: -241.3755340576172,
            y: -31.358539581298828,
            z: 175.3695831298828
        }, {
            x: -241.3755340576172,
            y: 31.358539581298828,
            z: 175.3695831298828
        }, {
            x: -142.65847778320312,
            y: 242.70509338378906,
            z: 103.64745330810547
        }, {
            x: -121.35254669189453,
            y: 259.8076171875,
            z: 88.16778564453125
        }, {
            x: -98.71705627441406,
            y: 274.0636291503906,
            z: 71.72213745117188
        }, {
            x: -75,
            y: 285.31695556640625,
            z: 54.49068832397461
        }, {
            x: -27.157289505004883,
            y: -298.3565673828125,
            z: 15.679269790649414
        }, {
            x: -54.01704025268555,
            y: -293.44427490234375,
            z: 31.186752319335938
        }, {
            x: -80.28497314453125,
            y: -285.31695556640625,
            z: 46.3525505065918
        }, {
            x: -105.67327880859375,
            y: -274.0636291503906,
            z: 61.010498046875
        }, {
            x: -129.90380859375,
            y: -259.8076171875,
            z: 75
        }, {
            x: -237.3460693359375,
            y: -122.02099609375,
            z: 137.0318145751953
        }, {
            x: -247.09173583984375,
            y: -92.7051010131836,
            z: 142.65847778320312
        }, {
            x: -254.1302032470703,
            y: -62.373504638671875,
            z: 146.72213745117188
        }, {
            x: -193.07469177246094,
            y: 200.7391815185547,
            z: 111.47171783447266
        }, {
            x: -173.84523010253906,
            y: 222.9434356689453,
            z: 100.36959075927734
        }, {
            x: -152.71109008789062,
            y: 242.70509338378906,
            z: 88.16778564453125
        }, {
            x: -129.90380859375,
            y: 259.8076171875,
            z: 75
        }, {
            x: -105.67327880859375,
            y: 274.0636291503906,
            z: 61.010498046875
        }, {
            x: -80.28497314453125,
            y: 285.31695556640625,
            z: 46.3525505065918
        }, {
            x: -54.01704025268555,
            y: 293.44427490234375,
            z: 31.186752319335938
        }, {
            x: -28.647449493408203,
            y: -298.3565673828125,
            z: 12.754667282104492
        }, {
            x: -56.98103332519531,
            y: -293.44427490234375,
            z: 25.369590759277344
        }, {
            x: -84.69032287597656,
            y: -285.31695556640625,
            z: 37.70656204223633
        }, {
            x: -111.47171783447266,
            y: -274.0636291503906,
            z: 49.630409240722656
        }, {
            x: -250.3695831298828,
            y: -122.02099609375,
            z: 111.47171783447266
        }, {
            x: -260.6499938964844,
            y: -92.7051010131836,
            z: 116.04885864257812
        }, {
            x: -274.0636291503906,
            y: 0,
            z: 122.02099609375
        }, {
            x: -272.5622863769531,
            y: 31.358539581298828,
            z: 121.35254669189453
        }, {
            x: -260.6499938964844,
            y: 92.7051010131836,
            z: 116.04885864257812
        }, {
            x: -237.3460693359375,
            y: 150,
            z: 105.67327880859375
        }, {
            x: -221.7221221923828,
            y: 176.3355712890625,
            z: 98.71705627441406
        }, {
            x: -203.66896057128906,
            y: 200.7391815185547,
            z: 90.67927551269531
        }, {
            x: -183.38436889648438,
            y: 222.9434356689453,
            z: 81.64797973632812
        }, {
            x: -161.09056091308594,
            y: 242.70509338378906,
            z: 71.72213745117188
        }, {
            x: -137.0318145751953,
            y: 259.8076171875,
            z: 61.010498046875
        }, {
            x: -111.47171783447266,
            y: 274.0636291503906,
            z: 49.630409240722656
        }, {
            x: -84.69032287597656,
            y: 285.31695556640625,
            z: 37.70656204223633
        }, {
            x: -56.98103332519531,
            y: 293.44427490234375,
            z: 25.369590759277344
        }, {
            x: -29.82374382019043,
            y: -298.3565673828125,
            z: 9.690321922302246
        }, {
            x: -59.32073211669922,
            y: -293.44427490234375,
            z: 19.27447509765625
        }, {
            x: -88.16778564453125,
            y: -285.31695556640625,
            z: 28.647451400756836
        }, {
            x: -116.04886627197266,
            y: -274.0636291503906,
            z: 37.70656204223633
        }, {
            x: -142.65847778320312,
            y: -259.8076171875,
            z: 46.3525505065918
        }, {
            x: -271.3525695800781,
            y: -92.7051010131836,
            z: 88.16778564453125
        }, {
            x: -283.75396728515625,
            y: 31.358539581298828,
            z: 92.19725036621094
        }, {
            x: -247.09173583984375,
            y: 150,
            z: 80.28497314453125
        }, {
            x: -230.82627868652344,
            y: 176.3355712890625,
            z: 75
        }, {
            x: -212.03182983398438,
            y: 200.7391815185547,
            z: 68.89331817626953
        }, {
            x: -190.914306640625,
            y: 222.9434356689453,
            z: 62.03181838989258
        }, {
            x: -167.70509338378906,
            y: 242.70509338378906,
            z: 54.49068832397461
        }, {
            x: -142.65847778320312,
            y: 259.8076171875,
            z: 46.3525505065918
        }, {
            x: -116.04886627197266,
            y: 274.0636291503906,
            z: 37.70656204223633
        }, {
            x: -88.16778564453125,
            y: 285.31695556640625,
            z: 28.647451400756836
        }, {
            x: -59.32073211669922,
            y: 293.44427490234375,
            z: 19.27447509765625
        }, {
            x: -30.67327880859375,
            y: -298.3565673828125,
            z: 6.519806861877441
        }, {
            x: -61.010498046875,
            y: -293.44427490234375,
            z: 12.968180656433105
        }, {
            x: -90.67927551269531,
            y: -285.31695556640625,
            z: 19.274473190307617
        }, {
            x: -119.35454559326172,
            y: -274.0636291503906,
            z: 25.369590759277344
        }, {
            x: -293.44427490234375,
            y: 0,
            z: 62.373504638671875
        }, {
            x: -279.08209228515625,
            y: 92.7051010131836,
            z: 59.32072830200195
        }, {
            x: -254.1302032470703,
            y: 150,
            z: 54.01704025268555
        }, {
            x: -237.4014129638672,
            y: 176.3355712890625,
            z: 50.46122360229492
        }, {
            x: -218.0716094970703,
            y: 200.7391815185547,
            z: 46.35254669189453
        }, {
            x: -196.35255432128906,
            y: 222.9434356689453,
            z: 41.73602294921875
        }, {
            x: -172.4822235107422,
            y: 242.70509338378906,
            z: 36.662227630615234
        }, {
            x: -146.72213745117188,
            y: 259.8076171875,
            z: 31.186752319335938
        }, {
            x: -119.35454559326172,
            y: 274.0636291503906,
            z: 25.369590759277344
        }, {
            x: -90.67927551269531,
            y: 285.31695556640625,
            z: 19.274473190307617
        }, {
            x: -61.010498046875,
            y: 293.44427490234375,
            z: 12.968180656433105
        }, {
            x: -30.67327880859375,
            y: 298.3565673828125,
            z: 6.519806861877441
        }, {
            x: -31.18675422668457,
            y: -298.3565673828125,
            z: 3.277859926223755
        }, {
            x: -62.03181838989258,
            y: -293.44427490234375,
            z: 6.519806861877441
        }, {
            x: -92.19725036621094,
            y: -285.31695556640625,
            z: 9.690321922302246
        }, {
            x: -121.35254669189453,
            y: -274.0636291503906,
            z: 12.754667282104492
        }, {
            x: -149.17828369140625,
            y: -259.8076171875,
            z: 15.679269790649414
        }, {
            x: -296.7221374511719,
            y: 31.358539581298828,
            z: 31.18675422668457
        }, {
            x: -291.8367614746094,
            y: 62.373504638671875,
            z: 30.67327880859375
        }, {
            x: -283.75396728515625,
            y: 92.7051010131836,
            z: 29.82374382019043
        }, {
            x: -272.5622863769531,
            y: 122.02099609375,
            z: 28.647451400756836
        }, {
            x: -258.3843688964844,
            y: 150,
            z: 27.15729331970215
        }, {
            x: -241.37554931640625,
            y: 176.3355712890625,
            z: 25.369590759277344
        }, {
            x: -221.72213745117188,
            y: 200.7391815185547,
            z: 23.303937911987305
        }, {
            x: -199.63951110839844,
            y: 222.9434356689453,
            z: 20.982959747314453
        }, {
            x: -175.36959838867188,
            y: 242.70509338378906,
            z: 18.432086944580078
        }, {
            x: -149.17828369140625,
            y: 259.8076171875,
            z: 15.679269790649414
        }, {
            x: -121.35254669189453,
            y: 274.0636291503906,
            z: 12.754667282104492
        }, {
            x: -92.19725036621094,
            y: 285.31695556640625,
            z: 9.690321922302246
        }, {
            x: -62.03181838989258,
            y: 293.44427490234375,
            z: 6.519806861877441
        }, {
            x: -31.18675422668457,
            y: 298.3565673828125,
            z: 3.277859926223755
        }, {
            x: -31.358539581298828,
            y: -298.3565673828125,
            z: -5.760469903951524E-15
        }, {
            x: -62.373504638671875,
            y: -293.44427490234375,
            z: -1.1457826535970182E-14
        }, {
            x: -92.7051010131836,
            y: -285.31695556640625,
            z: -1.7029649920590438E-14
        }, {
            x: -122.02099609375,
            y: -274.0636291503906,
            z: -2.2414892275721306E-14
        }, {
            x: -150,
            y: -259.8076171875,
            z: -2.755455267438884E-14
        }, {
            x: -274.0636291503906,
            y: 122.02099609375,
            z: -5.034467038134843E-14
        }, {
            x: -259.8076171875,
            y: 150,
            z: -4.7725885065795157E-14
        }, {
            x: -242.70509338378906,
            y: 176.3355712890625,
            z: -4.458420259497928E-14
        }, {
            x: -222.9434356689453,
            y: 200.7391815185547,
            z: -4.095404299974542E-14
        }, {
            x: -200.7391815185547,
            y: 222.9434356689453,
            z: -3.687518633542844E-14
        }, {
            x: -176.3355712890625,
            y: 242.70509338378906,
            z: -3.239231867219368E-14
        }, {
            x: -150,
            y: 259.8076171875,
            z: -2.755455267438884E-14
        }, {
            x: -122.02099609375,
            y: 274.0636291503906,
            z: -2.2414892275721306E-14
        }, {
            x: -92.7051010131836,
            y: 285.31695556640625,
            z: -1.7029649920590438E-14
        }, {
            x: -62.373504638671875,
            y: 293.44427490234375,
            z: -1.1457826535970182E-14
        }, {
            x: -31.18675422668457,
            y: -298.3565673828125,
            z: -3.277859926223755
        }, {
            x: -62.03181838989258,
            y: -293.44427490234375,
            z: -6.519806861877441
        }, {
            x: -92.19725036621094,
            y: -285.31695556640625,
            z: -9.690321922302246
        }, {
            x: -121.35254669189453,
            y: -274.0636291503906,
            z: -12.754667282104492
        }, {
            x: -258.3843688964844,
            y: 150,
            z: -27.15729331970215
        }, {
            x: -241.37554931640625,
            y: 176.3355712890625,
            z: -25.369590759277344
        }, {
            x: -221.72213745117188,
            y: 200.7391815185547,
            z: -23.303937911987305
        }, {
            x: -199.63951110839844,
            y: 222.9434356689453,
            z: -20.982959747314453
        }, {
            x: -175.36959838867188,
            y: 242.70509338378906,
            z: -18.432086944580078
        }, {
            x: -149.17828369140625,
            y: 259.8076171875,
            z: -15.679269790649414
        }, {
            x: -121.35254669189453,
            y: 274.0636291503906,
            z: -12.754667282104492
        }, {
            x: -92.19725036621094,
            y: 285.31695556640625,
            z: -9.690321922302246
        }, {
            x: -62.03181838989258,
            y: 293.44427490234375,
            z: -6.519806861877441
        }, {
            x: -30.67327880859375,
            y: -298.3565673828125,
            z: -6.519806861877441
        }, {
            x: -61.010498046875,
            y: -293.44427490234375,
            z: -12.968180656433105
        }, {
            x: -90.67927551269531,
            y: -285.31695556640625,
            z: -19.274473190307617
        }, {
            x: -119.35454559326172,
            y: -274.0636291503906,
            z: -25.369590759277344
        }, {
            x: -268.07470703125,
            y: 122.02099609375,
            z: -56.98103332519531
        }, {
            x: -254.1302032470703,
            y: 150,
            z: -54.01704025268555
        }, {
            x: -237.4014129638672,
            y: 176.3355712890625,
            z: -50.46122360229492
        }, {
            x: -218.0716094970703,
            y: 200.7391815185547,
            z: -46.35254669189453
        }, {
            x: -196.35255432128906,
            y: 222.9434356689453,
            z: -41.73602294921875
        }, {
            x: -172.4822235107422,
            y: 242.70509338378906,
            z: -36.662227630615234
        }, {
            x: -146.72213745117188,
            y: 259.8076171875,
            z: -31.186752319335938
        }, {
            x: -119.35454559326172,
            y: 274.0636291503906,
            z: -25.369590759277344
        }, {
            x: -90.67927551269531,
            y: 285.31695556640625,
            z: -19.274473190307617
        }, {
            x: -61.010498046875,
            y: 293.44427490234375,
            z: -12.968180656433105
        }, {
            x: -29.82374382019043,
            y: -298.3565673828125,
            z: -9.690321922302246
        }, {
            x: -59.32073211669922,
            y: -293.44427490234375,
            z: -19.27447509765625
        }, {
            x: -88.16778564453125,
            y: -285.31695556640625,
            z: -28.647451400756836
        }, {
            x: -116.04886627197266,
            y: -274.0636291503906,
            z: -37.70656204223633
        }, {
            x: -271.3525695800781,
            y: 92.7051010131836,
            z: -88.16778564453125
        }, {
            x: -260.6499938964844,
            y: 122.02099609375,
            z: -84.69032287597656
        }, {
            x: -247.09173583984375,
            y: 150,
            z: -80.28497314453125
        }, {
            x: -230.82627868652344,
            y: 176.3355712890625,
            z: -75
        }, {
            x: -212.03182983398438,
            y: 200.7391815185547,
            z: -68.89331817626953
        }, {
            x: -190.914306640625,
            y: 222.9434356689453,
            z: -62.03181838989258
        }, {
            x: -167.70509338378906,
            y: 242.70509338378906,
            z: -54.49068832397461
        }, {
            x: -142.65847778320312,
            y: 259.8076171875,
            z: -46.3525505065918
        }, {
            x: -116.04886627197266,
            y: 274.0636291503906,
            z: -37.70656204223633
        }, {
            x: -88.16778564453125,
            y: 285.31695556640625,
            z: -28.647451400756836
        }, {
            x: -59.32073211669922,
            y: 293.44427490234375,
            z: -19.27447509765625
        }, {
            x: -28.647449493408203,
            y: -298.3565673828125,
            z: -12.754667282104492
        }, {
            x: -56.98103332519531,
            y: -293.44427490234375,
            z: -25.369590759277344
        }, {
            x: -84.69032287597656,
            y: -285.31695556640625,
            z: -37.70656204223633
        }, {
            x: -111.47171783447266,
            y: -274.0636291503906,
            z: -49.630409240722656
        }, {
            x: -237.3460693359375,
            y: 150,
            z: -105.67327880859375
        }, {
            x: -221.7221221923828,
            y: 176.3355712890625,
            z: -98.71705627441406
        }, {
            x: -203.66896057128906,
            y: 200.7391815185547,
            z: -90.67927551269531
        }, {
            x: -183.38436889648438,
            y: 222.9434356689453,
            z: -81.64797973632812
        }, {
            x: -161.09056091308594,
            y: 242.70509338378906,
            z: -71.72213745117188
        }, {
            x: -137.0318145751953,
            y: 259.8076171875,
            z: -61.010498046875
        }, {
            x: -111.47171783447266,
            y: 274.0636291503906,
            z: -49.630409240722656
        }, {
            x: -84.69032287597656,
            y: 285.31695556640625,
            z: -37.70656204223633
        }, {
            x: -56.98103332519531,
            y: 293.44427490234375,
            z: -25.369590759277344
        }, {
            x: -27.157289505004883,
            y: -298.3565673828125,
            z: -15.679269790649414
        }, {
            x: -54.01704025268555,
            y: -293.44427490234375,
            z: -31.186752319335938
        }, {
            x: -80.28497314453125,
            y: -285.31695556640625,
            z: -46.3525505065918
        }, {
            x: -105.67327880859375,
            y: -274.0636291503906,
            z: -61.010498046875
        }, {
            x: -210.1887664794922,
            y: 176.3355712890625,
            z: -121.35254669189453
        }, {
            x: -193.07469177246094,
            y: 200.7391815185547,
            z: -111.47171783447266
        }, {
            x: -173.84523010253906,
            y: 222.9434356689453,
            z: -100.36959075927734
        }, {
            x: -152.71109008789062,
            y: 242.70509338378906,
            z: -88.16778564453125
        }, {
            x: -129.90380859375,
            y: 259.8076171875,
            z: -75
        }, {
            x: -105.67327880859375,
            y: 274.0636291503906,
            z: -61.010498046875
        }, {
            x: -80.28497314453125,
            y: 285.31695556640625,
            z: -46.3525505065918
        }, {
            x: -25.369590759277344,
            y: -298.3565673828125,
            z: -18.432086944580078
        }, {
            x: -50.46123123168945,
            y: -293.44427490234375,
            z: -36.662227630615234
        }, {
            x: -75,
            y: -285.31695556640625,
            z: -54.49068832397461
        }, {
            x: -98.71705627441406,
            y: -274.0636291503906,
            z: -71.72213745117188
        }, {
            x: -196.35255432128906,
            y: 176.3355712890625,
            z: -142.65847778320312
        }, {
            x: -180.3650360107422,
            y: 200.7391815185547,
            z: -131.04287719726562
        }, {
            x: -162.4014129638672,
            y: 222.9434356689453,
            z: -117.99153137207031
        }, {
            x: -142.65847778320312,
            y: 242.70509338378906,
            z: -103.64745330810547
        }, {
            x: -121.35254669189453,
            y: 259.8076171875,
            z: -88.16778564453125
        }, {
            x: -98.71705627441406,
            y: 274.0636291503906,
            z: -71.72213745117188
        }, {
            x: -75,
            y: 285.31695556640625,
            z: -54.49068832397461
        }, {
            x: -23.30393409729004,
            y: -298.3565673828125,
            z: -20.982959747314453
        }, {
            x: -46.3525505065918,
            y: -293.44427490234375,
            z: -41.73602294921875
        }, {
            x: -68.893310546875,
            y: -285.31695556640625,
            z: -62.03181838989258
        }, {
            x: -90.67926025390625,
            y: -274.0636291503906,
            z: -81.64797973632812
        }, {
            x: -111.47171783447266,
            y: -259.8076171875,
            z: -100.36959075927734
        }, {
            x: -212.03179931640625,
            y: 92.7051010131836,
            z: -190.914306640625
        }, {
            x: -203.66896057128906,
            y: 122.02099609375,
            z: -183.38436889648438
        }, {
            x: -193.07469177246094,
            y: 150,
            z: -173.84523010253906
        }, {
            x: -180.3650360107422,
            y: 176.3355712890625,
            z: -162.4014129638672
        }, {
            x: -165.67926025390625,
            y: 200.7391815185547,
            z: -149.17828369140625
        }, {
            x: -149.17828369140625,
            y: 222.9434356689453,
            z: -134.32073974609375
        }, {
            x: -131.04287719726562,
            y: 242.70509338378906,
            z: -117.99153900146484
        }, {
            x: -111.47171783447266,
            y: 259.8076171875,
            z: -100.36959075927734
        }, {
            x: -90.67926025390625,
            y: 274.0636291503906,
            z: -81.64797973632812
        }, {
            x: -68.893310546875,
            y: 285.31695556640625,
            z: -62.03181838989258
        }, {
            x: -46.3525505065918,
            y: 293.44427490234375,
            z: -41.73602294921875
        }, {
            x: -20.982959747314453,
            y: -298.3565673828125,
            z: -23.30393409729004
        }, {
            x: -41.73602294921875,
            y: -293.44427490234375,
            z: -46.3525505065918
        }, {
            x: -62.03181838989258,
            y: -285.31695556640625,
            z: -68.893310546875
        }, {
            x: -81.64797973632812,
            y: -274.0636291503906,
            z: -90.67926025390625
        }, {
            x: -196.35255432128906,
            y: -62.373504638671875,
            z: -218.0715789794922
        }, {
            x: -196.35255432128906,
            y: 62.373504638671875,
            z: -218.0715789794922
        }, {
            x: -183.38436889648438,
            y: 122.02099609375,
            z: -203.66896057128906
        }, {
            x: -173.84523010253906,
            y: 150,
            z: -193.07469177246094
        }, {
            x: -162.4014129638672,
            y: 176.3355712890625,
            z: -180.3650360107422
        }, {
            x: -149.17828369140625,
            y: 200.7391815185547,
            z: -165.67926025390625
        }, {
            x: -134.32073974609375,
            y: 222.9434356689453,
            z: -149.17828369140625
        }, {
            x: -117.99153900146484,
            y: 242.70509338378906,
            z: -131.04287719726562
        }, {
            x: -100.36959075927734,
            y: 259.8076171875,
            z: -111.47171783447266
        }, {
            x: -81.64797973632812,
            y: 274.0636291503906,
            z: -90.67926025390625
        }, {
            x: -62.03181838989258,
            y: 285.31695556640625,
            z: -68.893310546875
        }, {
            x: -18.432086944580078,
            y: -298.3565673828125,
            z: -25.369590759277344
        }, {
            x: -36.662227630615234,
            y: -293.44427490234375,
            z: -50.46123123168945
        }, {
            x: -54.49068832397461,
            y: -285.31695556640625,
            z: -75
        }, {
            x: -71.72213745117188,
            y: -274.0636291503906,
            z: -98.71705627441406
        }, {
            x: -175.3695831298828,
            y: 31.358539581298828,
            z: -241.3755340576172
        }, {
            x: -172.4822235107422,
            y: 62.373504638671875,
            z: -237.4014129638672
        }, {
            x: -167.70509338378906,
            y: 92.7051010131836,
            z: -230.82627868652344
        }, {
            x: -161.09056091308594,
            y: 122.02099609375,
            z: -221.72213745117188
        }, {
            x: -152.71109008789062,
            y: 150,
            z: -210.18878173828125
        }, {
            x: -142.65847778320312,
            y: 176.3355712890625,
            z: -196.35255432128906
        }, {
            x: -131.04287719726562,
            y: 200.7391815185547,
            z: -180.3650360107422
        }, {
            x: -117.99153137207031,
            y: 222.9434356689453,
            z: -162.4014129638672
        }, {
            x: -103.64745330810547,
            y: 242.70509338378906,
            z: -142.65847778320312
        }, {
            x: -88.16778564453125,
            y: 259.8076171875,
            z: -121.35254669189453
        }, {
            x: -71.72213745117188,
            y: 274.0636291503906,
            z: -98.71705627441406
        }, {
            x: -54.49068832397461,
            y: 285.31695556640625,
            z: -75
        }, {
            x: -15.679269790649414,
            y: -298.3565673828125,
            z: -27.157289505004883
        }, {
            x: -31.186752319335938,
            y: -293.44427490234375,
            z: -54.01704025268555
        }, {
            x: -46.3525505065918,
            y: -285.31695556640625,
            z: -80.28497314453125
        }, {
            x: -61.010498046875,
            y: -274.0636291503906,
            z: -105.67327880859375
        }, {
            x: -146.72213745117188,
            y: -62.373504638671875,
            z: -254.1302032470703
        }, {
            x: -149.17828369140625,
            y: -31.358539581298828,
            z: -258.3843688964844
        }, {
            x: -150,
            y: 0,
            z: -259.8076171875
        }, {
            x: -149.17828369140625,
            y: 31.358539581298828,
            z: -258.3843688964844
        }, {
            x: -146.72213745117188,
            y: 62.373504638671875,
            z: -254.1302032470703
        }, {
            x: -142.65847778320312,
            y: 92.7051010131836,
            z: -247.09173583984375
        }, {
            x: -137.0318145751953,
            y: 122.02099609375,
            z: -237.3460693359375
        }, {
            x: -121.35254669189453,
            y: 176.3355712890625,
            z: -210.1887664794922
        }, {
            x: -111.47171783447266,
            y: 200.7391815185547,
            z: -193.07469177246094
        }, {
            x: -100.36959075927734,
            y: 222.9434356689453,
            z: -173.84523010253906
        }, {
            x: -88.16778564453125,
            y: 242.70509338378906,
            z: -152.71109008789062
        }, {
            x: -75,
            y: 259.8076171875,
            z: -129.90380859375
        }, {
            x: -61.010498046875,
            y: 274.0636291503906,
            z: -105.67327880859375
        }, {
            x: -12.754667282104492,
            y: -298.3565673828125,
            z: -28.647449493408203
        }, {
            x: -25.369590759277344,
            y: -293.44427490234375,
            z: -56.98103332519531
        }, {
            x: -37.70656204223633,
            y: -285.31695556640625,
            z: -84.69032287597656
        }, {
            x: -49.630409240722656,
            y: -274.0636291503906,
            z: -111.47171783447266
        }, {
            x: -111.47171783447266,
            y: -122.02099609375,
            z: -250.3695831298828
        }, {
            x: -116.04885864257812,
            y: -92.7051010131836,
            z: -260.6499938964844
        }, {
            x: -119.35453796386719,
            y: -62.373504638671875,
            z: -268.0746765136719
        }, {
            x: -121.35254669189453,
            y: -31.358539581298828,
            z: -272.5622863769531
        }, {
            x: -122.02099609375,
            y: 0,
            z: -274.0636291503906
        }, {
            x: -121.35254669189453,
            y: 31.358539581298828,
            z: -272.5622863769531
        }, {
            x: -119.35453796386719,
            y: 62.373504638671875,
            z: -268.0746765136719
        }, {
            x: -116.04885864257812,
            y: 92.7051010131836,
            z: -260.6499938964844
        }, {
            x: -111.47171783447266,
            y: 122.02099609375,
            z: -250.3695831298828
        }, {
            x: -105.67327880859375,
            y: 150,
            z: -237.3460693359375
        }, {
            x: -98.71705627441406,
            y: 176.3355712890625,
            z: -221.7221221923828
        }, {
            x: -90.67927551269531,
            y: 200.7391815185547,
            z: -203.66896057128906
        }, {
            x: -71.72213745117188,
            y: 242.70509338378906,
            z: -161.09056091308594
        }, {
            x: -61.010498046875,
            y: 259.8076171875,
            z: -137.0318145751953
        }, {
            x: -49.630409240722656,
            y: 274.0636291503906,
            z: -111.47171783447266
        }, {
            x: -37.70656204223633,
            y: 285.31695556640625,
            z: -84.69032287597656
        }, {
            x: -9.690321922302246,
            y: -298.3565673828125,
            z: -29.82374382019043
        }, {
            x: -19.27447509765625,
            y: -293.44427490234375,
            z: -59.32073211669922
        }, {
            x: -28.647451400756836,
            y: -285.31695556640625,
            z: -88.16778564453125
        }, {
            x: -37.70656204223633,
            y: -274.0636291503906,
            z: -116.04886627197266
        }, {
            x: -84.69032287597656,
            y: -122.02099609375,
            z: -260.6499938964844
        }, {
            x: -88.16778564453125,
            y: -92.7051010131836,
            z: -271.3525695800781
        }, {
            x: -90.67927551269531,
            y: -62.373504638671875,
            z: -279.08209228515625
        }, {
            x: -92.19725036621094,
            y: -31.358539581298828,
            z: -283.75396728515625
        }, {
            x: -92.7051010131836,
            y: 0,
            z: -285.31695556640625
        }, {
            x: -92.19725036621094,
            y: 31.358539581298828,
            z: -283.75396728515625
        }, {
            x: -90.67927551269531,
            y: 62.373504638671875,
            z: -279.08209228515625
        }, {
            x: -88.16778564453125,
            y: 92.7051010131836,
            z: -271.3525695800781
        }, {
            x: -84.69032287597656,
            y: 122.02099609375,
            z: -260.6499938964844
        }, {
            x: -80.28497314453125,
            y: 150,
            z: -247.09173583984375
        }, {
            x: -75,
            y: 176.3355712890625,
            z: -230.82627868652344
        }, {
            x: -62.03181838989258,
            y: 222.9434356689453,
            z: -190.914306640625
        }, {
            x: -54.49068832397461,
            y: 242.70509338378906,
            z: -167.70509338378906
        }, {
            x: -46.3525505065918,
            y: 259.8076171875,
            z: -142.65847778320312
        }, {
            x: -37.70656204223633,
            y: 274.0636291503906,
            z: -116.04886627197266
        }, {
            x: -28.647451400756836,
            y: 285.31695556640625,
            z: -88.16778564453125
        }, {
            x: -9.690321922302246,
            y: 298.3565673828125,
            z: -29.82374382019043
        }, {
            x: -6.519806861877441,
            y: -298.3565673828125,
            z: -30.67327880859375
        }, {
            x: -12.968180656433105,
            y: -293.44427490234375,
            z: -61.010498046875
        }, {
            x: -19.274473190307617,
            y: -285.31695556640625,
            z: -90.67927551269531
        }, {
            x: -25.369590759277344,
            y: -274.0636291503906,
            z: -119.35454559326172
        }, {
            x: -56.98103332519531,
            y: -122.02099609375,
            z: -268.07470703125
        }, {
            x: -59.32072830200195,
            y: -92.7051010131836,
            z: -279.08209228515625
        }, {
            x: -61.010498046875,
            y: -62.373504638671875,
            z: -287.0318298339844
        }, {
            x: -62.03181838989258,
            y: -31.358539581298828,
            z: -291.8367614746094
        }, {
            x: -62.373504638671875,
            y: 0,
            z: -293.44427490234375
        }, {
            x: -62.03181838989258,
            y: 31.358539581298828,
            z: -291.8367614746094
        }, {
            x: -61.010498046875,
            y: 62.373504638671875,
            z: -287.0318298339844
        }, {
            x: -59.32072830200195,
            y: 92.7051010131836,
            z: -279.08209228515625
        }, {
            x: -56.98103332519531,
            y: 122.02099609375,
            z: -268.07470703125
        }, {
            x: -54.01704025268555,
            y: 150,
            z: -254.1302032470703
        }, {
            x: -50.46122360229492,
            y: 176.3355712890625,
            z: -237.4014129638672
        }, {
            x: -36.662227630615234,
            y: 242.70509338378906,
            z: -172.4822235107422
        }, {
            x: -31.186752319335938,
            y: 259.8076171875,
            z: -146.72213745117188
        }, {
            x: -25.369590759277344,
            y: 274.0636291503906,
            z: -119.35454559326172
        }, {
            x: -19.274473190307617,
            y: 285.31695556640625,
            z: -90.67927551269531
        }, {
            x: -6.519806861877441,
            y: 298.3565673828125,
            z: -30.67327880859375
        }, {
            x: -3.277859926223755,
            y: -298.3565673828125,
            z: -31.18675422668457
        }, {
            x: -6.519806861877441,
            y: -293.44427490234375,
            z: -62.03181838989258
        }, {
            x: -9.690321922302246,
            y: -285.31695556640625,
            z: -92.19725036621094
        }, {
            x: -12.754667282104492,
            y: -274.0636291503906,
            z: -121.35254669189453
        }, {
            x: -30.67327880859375,
            y: -62.373504638671875,
            z: -291.8367614746094
        }, {
            x: -31.358539581298828,
            y: 0,
            z: -298.3565673828125
        }, {
            x: -31.18675422668457,
            y: 31.358539581298828,
            z: -296.7221374511719
        }, {
            x: -30.67327880859375,
            y: 62.373504638671875,
            z: -291.8367614746094
        }, {
            x: -29.82374382019043,
            y: 92.7051010131836,
            z: -283.75396728515625
        }, {
            x: -28.647451400756836,
            y: 122.02099609375,
            z: -272.5622863769531
        }, {
            x: -27.15729331970215,
            y: 150,
            z: -258.3843688964844
        }, {
            x: -25.369590759277344,
            y: 176.3355712890625,
            z: -241.37554931640625
        }, {
            x: -20.982959747314453,
            y: 222.9434356689453,
            z: -199.63951110839844
        }, {
            x: -18.432086944580078,
            y: 242.70509338378906,
            z: -175.36959838867188
        }, {
            x: -15.679269790649414,
            y: 259.8076171875,
            z: -149.17828369140625
        }, {
            x: -12.754667282104492,
            y: 274.0636291503906,
            z: -121.35254669189453
        }, {
            x: -9.690321922302246,
            y: 285.31695556640625,
            z: -92.19725036621094
        }, {
            x: 3.8403135516453316E-15,
            y: -298.3565673828125,
            z: -31.358539581298828
        }, {
            x: 7.6385524357017E-15,
            y: -293.44427490234375,
            z: -62.373504638671875
        }, {
            x: 1.1353100229404608E-14,
            y: -285.31695556640625,
            z: -92.7051010131836
        }, {
            x: 1.494326208183617E-14,
            y: -274.0636291503906,
            z: -122.02099609375
        }, {
            x: 3.593656202152164E-14,
            y: 62.373504638671875,
            z: -293.44427490234375
        }, {
            x: 3.4941254262784577E-14,
            y: 92.7051010131836,
            z: -285.31695556640625
        }, {
            x: 3.3563114716942885E-14,
            y: 122.02099609375,
            z: -274.0636291503906
        }, {
            x: 3.181725783990737E-14,
            y: 150,
            z: -259.8076171875
        }, {
            x: 2.972280285936345E-14,
            y: 176.3355712890625,
            z: -242.70509338378906
        }, {
            x: 2.7302699285984035E-14,
            y: 200.7391815185547,
            z: -222.9434356689453
        }, {
            x: 2.1594881373550312E-14,
            y: 242.70509338378906,
            z: -176.3355712890625
        }, {
            x: 1.8369703476991787E-14,
            y: 259.8076171875,
            z: -150
        }, {
            x: 1.494326208183617E-14,
            y: 274.0636291503906,
            z: -122.02099609375
        }, {
            x: 3.277859926223755,
            y: -298.3565673828125,
            z: -31.18675422668457
        }, {
            x: 6.519806861877441,
            y: -293.44427490234375,
            z: -62.03181838989258
        }, {
            x: 9.690321922302246,
            y: -285.31695556640625,
            z: -92.19725036621094
        }, {
            x: 12.754667282104492,
            y: -274.0636291503906,
            z: -121.35254669189453
        }, {
            x: 30.67327880859375,
            y: 62.373504638671875,
            z: -291.8367614746094
        }, {
            x: 29.82374382019043,
            y: 92.7051010131836,
            z: -283.75396728515625
        }, {
            x: 28.647451400756836,
            y: 122.02099609375,
            z: -272.5622863769531
        }, {
            x: 27.15729331970215,
            y: 150,
            z: -258.3843688964844
        }, {
            x: 25.369590759277344,
            y: 176.3355712890625,
            z: -241.37554931640625
        }, {
            x: 23.303937911987305,
            y: 200.7391815185547,
            z: -221.72213745117188
        }, {
            x: 20.982959747314453,
            y: 222.9434356689453,
            z: -199.63951110839844
        }, {
            x: 18.432086944580078,
            y: 242.70509338378906,
            z: -175.36959838867188
        }, {
            x: 15.679269790649414,
            y: 259.8076171875,
            z: -149.17828369140625
        }, {
            x: 6.519806861877441,
            y: -298.3565673828125,
            z: -30.67327880859375
        }, {
            x: 12.968180656433105,
            y: -293.44427490234375,
            z: -61.010498046875
        }, {
            x: 19.274473190307617,
            y: -285.31695556640625,
            z: -90.67927551269531
        }, {
            x: 25.369590759277344,
            y: -274.0636291503906,
            z: -119.35454559326172
        }, {
            x: 61.010498046875,
            y: 62.373504638671875,
            z: -287.0318298339844
        }, {
            x: 59.32072830200195,
            y: 92.7051010131836,
            z: -279.08209228515625
        }, {
            x: 56.98103332519531,
            y: 122.02099609375,
            z: -268.07470703125
        }, {
            x: 54.01704025268555,
            y: 150,
            z: -254.1302032470703
        }, {
            x: 50.46122360229492,
            y: 176.3355712890625,
            z: -237.4014129638672
        }, {
            x: 46.35254669189453,
            y: 200.7391815185547,
            z: -218.0716094970703
        }, {
            x: 41.73602294921875,
            y: 222.9434356689453,
            z: -196.35255432128906
        }, {
            x: 31.186752319335938,
            y: 259.8076171875,
            z: -146.72213745117188
        }, {
            x: 9.690321922302246,
            y: -298.3565673828125,
            z: -29.82374382019043
        }, {
            x: 19.27447509765625,
            y: -293.44427490234375,
            z: -59.32073211669922
        }, {
            x: 28.647451400756836,
            y: -285.31695556640625,
            z: -88.16778564453125
        }, {
            x: 37.70656204223633,
            y: -274.0636291503906,
            z: -116.04886627197266
        }, {
            x: 88.16778564453125,
            y: 92.7051010131836,
            z: -271.3525695800781
        }, {
            x: 84.69032287597656,
            y: 122.02099609375,
            z: -260.6499938964844
        }, {
            x: 80.28497314453125,
            y: 150,
            z: -247.09173583984375
        }, {
            x: 12.754667282104492,
            y: -298.3565673828125,
            z: -28.647449493408203
        }, {
            x: 25.369590759277344,
            y: -293.44427490234375,
            z: -56.98103332519531
        }, {
            x: 37.70656204223633,
            y: -285.31695556640625,
            z: -84.69032287597656
        }, {
            x: 37.70656204223633,
            y: 285.31695556640625,
            z: -84.69032287597656
        }, {
            x: 12.754667282104492,
            y: 298.3565673828125,
            z: -28.647449493408203
        }, {
            x: 15.679269790649414,
            y: -298.3565673828125,
            z: -27.157289505004883
        }, {
            x: 31.186752319335938,
            y: -293.44427490234375,
            z: -54.01704025268555
        }, {
            x: 46.3525505065918,
            y: -285.31695556640625,
            z: -80.28497314453125
        }, {
            x: 46.3525505065918,
            y: 285.31695556640625,
            z: -80.28497314453125
        }, {
            x: 31.186752319335938,
            y: 293.44427490234375,
            z: -54.01704025268555
        }, {
            x: 15.679269790649414,
            y: 298.3565673828125,
            z: -27.157289505004883
        }, {
            x: 18.432086944580078,
            y: -298.3565673828125,
            z: -25.369590759277344
        }, {
            x: 36.662227630615234,
            y: -293.44427490234375,
            z: -50.46123123168945
        }, {
            x: 54.49068832397461,
            y: -285.31695556640625,
            z: -75
        }, {
            x: 36.662227630615234,
            y: 293.44427490234375,
            z: -50.46123123168945
        }, {
            x: 18.432086944580078,
            y: 298.3565673828125,
            z: -25.369590759277344
        }, {
            x: 20.982959747314453,
            y: -298.3565673828125,
            z: -23.30393409729004
        }, {
            x: 41.73602294921875,
            y: -293.44427490234375,
            z: -46.3525505065918
        }, {
            x: 62.03181838989258,
            y: -285.31695556640625,
            z: -68.893310546875
        }, {
            x: 134.32073974609375,
            y: -222.9434356689453,
            z: -149.17828369140625
        }, {
            x: 200.7391815185547,
            y: 0,
            z: -222.9434356689453
        }, {
            x: 62.03181838989258,
            y: 285.31695556640625,
            z: -68.893310546875
        }, {
            x: 41.73602294921875,
            y: 293.44427490234375,
            z: -46.3525505065918
        }, {
            x: 20.982959747314453,
            y: 298.3565673828125,
            z: -23.30393409729004
        }, {
            x: 23.30393409729004,
            y: -298.3565673828125,
            z: -20.982959747314453
        }, {
            x: 46.3525505065918,
            y: -293.44427490234375,
            z: -41.73602294921875
        }, {
            x: 68.893310546875,
            y: -285.31695556640625,
            z: -62.03181838989258
        }, {
            x: 218.0715789794922,
            y: -62.373504638671875,
            z: -196.35255432128906
        }, {
            x: 221.72213745117188,
            y: -31.358539581298828,
            z: -199.63951110839844
        }, {
            x: 222.9434356689453,
            y: 0,
            z: -200.7391815185547
        }, {
            x: 68.893310546875,
            y: 285.31695556640625,
            z: -62.03181838989258
        }, {
            x: 46.3525505065918,
            y: 293.44427490234375,
            z: -41.73602294921875
        }, {
            x: 23.30393409729004,
            y: 298.3565673828125,
            z: -20.982959747314453
        }, {
            x: 25.369590759277344,
            y: -298.3565673828125,
            z: -18.432086944580078
        }, {
            x: 50.46123123168945,
            y: -293.44427490234375,
            z: -36.662227630615234
        }, {
            x: 75,
            y: -285.31695556640625,
            z: -54.49068832397461
        }, {
            x: 230.82627868652344,
            y: -92.7051010131836,
            z: -167.70509338378906
        }, {
            x: 237.4014129638672,
            y: -62.373504638671875,
            z: -172.4822235107422
        }, {
            x: 241.3755340576172,
            y: -31.358539581298828,
            z: -175.3695831298828
        }, {
            x: 242.70509338378906,
            y: 0,
            z: -176.3355712890625
        }, {
            x: 241.3755340576172,
            y: 31.358539581298828,
            z: -175.3695831298828
        }, {
            x: 75,
            y: 285.31695556640625,
            z: -54.49068832397461
        }, {
            x: 50.46123123168945,
            y: 293.44427490234375,
            z: -36.662227630615234
        }, {
            x: 25.369590759277344,
            y: 298.3565673828125,
            z: -18.432086944580078
        }, {
            x: 27.157289505004883,
            y: -298.3565673828125,
            z: -15.679269790649414
        }, {
            x: 54.01704025268555,
            y: -293.44427490234375,
            z: -31.186752319335938
        }, {
            x: 80.28497314453125,
            y: -285.31695556640625,
            z: -46.3525505065918
        }, {
            x: 237.3460693359375,
            y: -122.02099609375,
            z: -137.0318145751953
        }, {
            x: 247.09173583984375,
            y: -92.7051010131836,
            z: -142.65847778320312
        }, {
            x: 254.1302032470703,
            y: -62.373504638671875,
            z: -146.72213745117188
        }, {
            x: 258.3843688964844,
            y: -31.358539581298828,
            z: -149.17828369140625
        }, {
            x: 259.8076171875,
            y: 0,
            z: -150
        }, {
            x: 258.3843688964844,
            y: 31.358539581298828,
            z: -149.17828369140625
        }, {
            x: 254.1302032470703,
            y: 62.373504638671875,
            z: -146.72213745117188
        }, {
            x: 152.71109008789062,
            y: 242.70509338378906,
            z: -88.16778564453125
        }, {
            x: 80.28497314453125,
            y: 285.31695556640625,
            z: -46.3525505065918
        }, {
            x: 54.01704025268555,
            y: 293.44427490234375,
            z: -31.186752319335938
        }, {
            x: 27.157289505004883,
            y: 298.3565673828125,
            z: -15.679269790649414
        }, {
            x: 28.647449493408203,
            y: -298.3565673828125,
            z: -12.754667282104492
        }, {
            x: 56.98103332519531,
            y: -293.44427490234375,
            z: -25.369590759277344
        }, {
            x: 84.69032287597656,
            y: -285.31695556640625,
            z: -37.70656204223633
        }, {
            x: 111.47171783447266,
            y: -274.0636291503906,
            z: -49.630409240722656
        }, {
            x: 137.0318145751953,
            y: -259.8076171875,
            z: -61.010498046875
        }, {
            x: 237.3460693359375,
            y: -150,
            z: -105.67327880859375
        }, {
            x: 250.3695831298828,
            y: -122.02099609375,
            z: -111.47171783447266
        }, {
            x: 260.6499938964844,
            y: -92.7051010131836,
            z: -116.04885864257812
        }, {
            x: 268.0746765136719,
            y: -62.373504638671875,
            z: -119.35453796386719
        }, {
            x: 272.5622863769531,
            y: -31.358539581298828,
            z: -121.35254669189453
        }, {
            x: 274.0636291503906,
            y: 0,
            z: -122.02099609375
        }, {
            x: 272.5622863769531,
            y: 31.358539581298828,
            z: -121.35254669189453
        }, {
            x: 268.0746765136719,
            y: 62.373504638671875,
            z: -119.35453796386719
        }, {
            x: 137.0318145751953,
            y: 259.8076171875,
            z: -61.010498046875
        }, {
            x: 28.647449493408203,
            y: 298.3565673828125,
            z: -12.754667282104492
        }, {
            x: 29.82374382019043,
            y: -298.3565673828125,
            z: -9.690321922302246
        }, {
            x: 59.32073211669922,
            y: -293.44427490234375,
            z: -19.27447509765625
        }, {
            x: 88.16778564453125,
            y: -285.31695556640625,
            z: -28.647451400756836
        }, {
            x: 116.04886627197266,
            y: -274.0636291503906,
            z: -37.70656204223633
        }, {
            x: 142.65847778320312,
            y: -259.8076171875,
            z: -46.3525505065918
        }, {
            x: 212.03182983398438,
            y: -200.7391815185547,
            z: -68.89331817626953
        }, {
            x: 230.82627868652344,
            y: -176.3355712890625,
            z: -75
        }, {
            x: 247.09173583984375,
            y: -150,
            z: -80.28497314453125
        }, {
            x: 260.6499938964844,
            y: -122.02099609375,
            z: -84.69032287597656
        }, {
            x: 271.3525695800781,
            y: -92.7051010131836,
            z: -88.16778564453125
        }, {
            x: 279.08209228515625,
            y: -62.373504638671875,
            z: -90.67927551269531
        }, {
            x: 283.75396728515625,
            y: -31.358539581298828,
            z: -92.19725036621094
        }, {
            x: 285.31695556640625,
            y: 0,
            z: -92.7051010131836
        }, {
            x: 283.75396728515625,
            y: 31.358539581298828,
            z: -92.19725036621094
        }, {
            x: 279.08209228515625,
            y: 62.373504638671875,
            z: -90.67927551269531
        }, {
            x: 260.6499938964844,
            y: 122.02099609375,
            z: -84.69032287597656
        }, {
            x: 167.70509338378906,
            y: 242.70509338378906,
            z: -54.49068832397461
        }, {
            x: 142.65847778320312,
            y: 259.8076171875,
            z: -46.3525505065918
        }, {
            x: 88.16778564453125,
            y: 285.31695556640625,
            z: -28.647451400756836
        }, {
            x: 29.82374382019043,
            y: 298.3565673828125,
            z: -9.690321922302246
        }, {
            x: 30.67327880859375,
            y: -298.3565673828125,
            z: -6.519806861877441
        }, {
            x: 61.010498046875,
            y: -293.44427490234375,
            z: -12.968180656433105
        }, {
            x: 90.67927551269531,
            y: -285.31695556640625,
            z: -19.274473190307617
        }, {
            x: 119.35454559326172,
            y: -274.0636291503906,
            z: -25.369590759277344
        }, {
            x: 196.35255432128906,
            y: -222.9434356689453,
            z: -41.73602294921875
        }, {
            x: 218.0716094970703,
            y: -200.7391815185547,
            z: -46.35254669189453
        }, {
            x: 237.4014129638672,
            y: -176.3355712890625,
            z: -50.46122360229492
        }, {
            x: 254.1302032470703,
            y: -150,
            z: -54.01704025268555
        }, {
            x: 291.8367614746094,
            y: -31.358539581298828,
            z: -62.03181838989258
        }, {
            x: 293.44427490234375,
            y: 0,
            z: -62.373504638671875
        }, {
            x: 291.8367614746094,
            y: 31.358539581298828,
            z: -62.03181838989258
        }, {
            x: 287.0318298339844,
            y: 62.373504638671875,
            z: -61.010498046875
        }, {
            x: 279.08209228515625,
            y: 92.7051010131836,
            z: -59.32072830200195
        }, {
            x: 268.07470703125,
            y: 122.02099609375,
            z: -56.98103332519531
        }, {
            x: 196.35255432128906,
            y: 222.9434356689453,
            z: -41.73602294921875
        }, {
            x: 172.4822235107422,
            y: 242.70509338378906,
            z: -36.662227630615234
        }, {
            x: 146.72213745117188,
            y: 259.8076171875,
            z: -31.186752319335938
        }, {
            x: 119.35454559326172,
            y: 274.0636291503906,
            z: -25.369590759277344
        }, {
            x: 90.67927551269531,
            y: 285.31695556640625,
            z: -19.274473190307617
        }, {
            x: 61.010498046875,
            y: 293.44427490234375,
            z: -12.968180656433105
        }, {
            x: 30.67327880859375,
            y: 298.3565673828125,
            z: -6.519806861877441
        }, {
            x: 31.18675422668457,
            y: -298.3565673828125,
            z: -3.277859926223755
        }, {
            x: 62.03181838989258,
            y: -293.44427490234375,
            z: -6.519806861877441
        }, {
            x: 92.19725036621094,
            y: -285.31695556640625,
            z: -9.690321922302246
        }, {
            x: 298.3565673828125,
            y: 0,
            z: -31.358539581298828
        }, {
            x: 296.7221374511719,
            y: 31.358539581298828,
            z: -31.18675422668457
        }, {
            x: 291.8367614746094,
            y: 62.373504638671875,
            z: -30.67327880859375
        }, {
            x: 272.5622863769531,
            y: 122.02099609375,
            z: -28.647451400756836
        }, {
            x: 258.3843688964844,
            y: 150,
            z: -27.15729331970215
        }, {
            x: 221.72213745117188,
            y: 200.7391815185547,
            z: -23.303937911987305
        }, {
            x: 199.63951110839844,
            y: 222.9434356689453,
            z: -20.982959747314453
        }, {
            x: 175.36959838867188,
            y: 242.70509338378906,
            z: -18.432086944580078
        }, {
            x: 149.17828369140625,
            y: 259.8076171875,
            z: -15.679269790649414
        }, {
            x: 121.35254669189453,
            y: 274.0636291503906,
            z: -12.754667282104492
        }, {
            x: 92.19725036621094,
            y: 285.31695556640625,
            z: -9.690321922302246
        }, {
            x: 62.03181838989258,
            y: 293.44427490234375,
            z: -6.519806861877441
        }, {
            x: 31.18675422668457,
            y: 298.3565673828125,
            z: -3.277859926223755
        }, {
            x: 31.358539581298828,
            y: -298.3565673828125,
            z: 0
        }, {
            x: 62.373504638671875,
            y: -293.44427490234375,
            z: 0
        }, {
            x: 92.7051010131836,
            y: -285.31695556640625,
            z: 0
        }, {
            x: 285.31695556640625,
            y: 92.7051010131836,
            z: 0
        }, {
            x: 242.70509338378906,
            y: 176.3355712890625,
            z: 0
        }, {
            x: 222.9434356689453,
            y: 200.7391815185547,
            z: 0
        }, {
            x: 200.7391815185547,
            y: 222.9434356689453,
            z: 0
        }, {
            x: 176.3355712890625,
            y: 242.70509338378906,
            z: 0
        }, {
            x: 150,
            y: 259.8076171875,
            z: 0
        }, {
            x: 92.7051010131836,
            y: 285.31695556640625,
            z: 0
        }, {
            x: 62.373504638671875,
            y: 293.44427490234375,
            z: 0
        }, {
            x: 31.358539581298828,
            y: 298.3565673828125,
            z: 0
        }, {
            x: 31.18675422668457,
            y: -298.3565673828125,
            z: 3.277859926223755
        }, {
            x: 62.03181838989258,
            y: -293.44427490234375,
            z: 6.519806861877441
        }, {
            x: 92.19725036621094,
            y: -285.31695556640625,
            z: 9.690321922302246
        }, {
            x: 272.5622863769531,
            y: 122.02099609375,
            z: 28.647451400756836
        }, {
            x: 241.37554931640625,
            y: 176.3355712890625,
            z: 25.369590759277344
        }, {
            x: 221.72213745117188,
            y: 200.7391815185547,
            z: 23.303937911987305
        }, {
            x: 199.63951110839844,
            y: 222.9434356689453,
            z: 20.982959747314453
        }, {
            x: 175.36959838867188,
            y: 242.70509338378906,
            z: 18.432086944580078
        }, {
            x: 149.17828369140625,
            y: 259.8076171875,
            z: 15.679269790649414
        }, {
            x: 92.19725036621094,
            y: 285.31695556640625,
            z: 9.690321922302246
        }, {
            x: 62.03181838989258,
            y: 293.44427490234375,
            z: 6.519806861877441
        }, {
            x: 31.18675422668457,
            y: 298.3565673828125,
            z: 3.277859926223755
        }, {
            x: 30.67327880859375,
            y: -298.3565673828125,
            z: 6.519806861877441
        }, {
            x: 61.010498046875,
            y: -293.44427490234375,
            z: 12.968180656433105
        }, {
            x: 90.67927551269531,
            y: -285.31695556640625,
            z: 19.274473190307617
        }, {
            x: 119.35454559326172,
            y: -274.0636291503906,
            z: 25.369590759277344
        }, {
            x: 268.07470703125,
            y: 122.02099609375,
            z: 56.98103332519531
        }, {
            x: 237.4014129638672,
            y: 176.3355712890625,
            z: 50.46122360229492
        }, {
            x: 218.0716094970703,
            y: 200.7391815185547,
            z: 46.35254669189453
        }, {
            x: 196.35255432128906,
            y: 222.9434356689453,
            z: 41.73602294921875
        }, {
            x: 172.4822235107422,
            y: 242.70509338378906,
            z: 36.662227630615234
        }, {
            x: 146.72213745117188,
            y: 259.8076171875,
            z: 31.186752319335938
        }, {
            x: 119.35454559326172,
            y: 274.0636291503906,
            z: 25.369590759277344
        }, {
            x: 90.67927551269531,
            y: 285.31695556640625,
            z: 19.274473190307617
        }, {
            x: 61.010498046875,
            y: 293.44427490234375,
            z: 12.968180656433105
        }, {
            x: 30.67327880859375,
            y: 298.3565673828125,
            z: 6.519806861877441
        }, {
            x: 29.82374382019043,
            y: -298.3565673828125,
            z: 9.690321922302246
        }, {
            x: 59.32073211669922,
            y: -293.44427490234375,
            z: 19.27447509765625
        }, {
            x: 88.16778564453125,
            y: -285.31695556640625,
            z: 28.647451400756836
        }, {
            x: 116.04886627197266,
            y: -274.0636291503906,
            z: 37.70656204223633
        }, {
            x: 260.6499938964844,
            y: 122.02099609375,
            z: 84.69032287597656
        }, {
            x: 247.09173583984375,
            y: 150,
            z: 80.28497314453125
        }, {
            x: 230.82627868652344,
            y: 176.3355712890625,
            z: 75
        }, {
            x: 212.03182983398438,
            y: 200.7391815185547,
            z: 68.89331817626953
        }, {
            x: 190.914306640625,
            y: 222.9434356689453,
            z: 62.03181838989258
        }, {
            x: 167.70509338378906,
            y: 242.70509338378906,
            z: 54.49068832397461
        }, {
            x: 142.65847778320312,
            y: 259.8076171875,
            z: 46.3525505065918
        }, {
            x: 116.04886627197266,
            y: 274.0636291503906,
            z: 37.70656204223633
        }, {
            x: 88.16778564453125,
            y: 285.31695556640625,
            z: 28.647451400756836
        }, {
            x: 59.32073211669922,
            y: 293.44427490234375,
            z: 19.27447509765625
        }, {
            x: 29.82374382019043,
            y: 298.3565673828125,
            z: 9.690321922302246
        }, {
            x: 28.647449493408203,
            y: -298.3565673828125,
            z: 12.754667282104492
        }, {
            x: 56.98103332519531,
            y: -293.44427490234375,
            z: 25.369590759277344
        }, {
            x: 84.69032287597656,
            y: -285.31695556640625,
            z: 37.70656204223633
        }, {
            x: 237.3460693359375,
            y: 150,
            z: 105.67327880859375
        }, {
            x: 221.7221221923828,
            y: 176.3355712890625,
            z: 98.71705627441406
        }, {
            x: 203.66896057128906,
            y: 200.7391815185547,
            z: 90.67927551269531
        }, {
            x: 183.38436889648438,
            y: 222.9434356689453,
            z: 81.64797973632812
        }, {
            x: 161.09056091308594,
            y: 242.70509338378906,
            z: 71.72213745117188
        }, {
            x: 137.0318145751953,
            y: 259.8076171875,
            z: 61.010498046875
        }, {
            x: 111.47171783447266,
            y: 274.0636291503906,
            z: 49.630409240722656
        }, {
            x: 84.69032287597656,
            y: 285.31695556640625,
            z: 37.70656204223633
        }, {
            x: 56.98103332519531,
            y: 293.44427490234375,
            z: 25.369590759277344
        }, {
            x: 27.157289505004883,
            y: -298.3565673828125,
            z: 15.679269790649414
        }, {
            x: 54.01704025268555,
            y: -293.44427490234375,
            z: 31.186752319335938
        }, {
            x: 80.28497314453125,
            y: -285.31695556640625,
            z: 46.3525505065918
        }, {
            x: 210.1887664794922,
            y: 176.3355712890625,
            z: 121.35254669189453
        }, {
            x: 193.07469177246094,
            y: 200.7391815185547,
            z: 111.47171783447266
        }, {
            x: 173.84523010253906,
            y: 222.9434356689453,
            z: 100.36959075927734
        }, {
            x: 152.71109008789062,
            y: 242.70509338378906,
            z: 88.16778564453125
        }, {
            x: 129.90380859375,
            y: 259.8076171875,
            z: 75
        }, {
            x: 105.67327880859375,
            y: 274.0636291503906,
            z: 61.010498046875
        }, {
            x: 80.28497314453125,
            y: 285.31695556640625,
            z: 46.3525505065918
        }, {
            x: 54.01704025268555,
            y: 293.44427490234375,
            z: 31.186752319335938
        }, {
            x: 27.157289505004883,
            y: 298.3565673828125,
            z: 15.679269790649414
        }, {
            x: 25.369590759277344,
            y: -298.3565673828125,
            z: 18.432086944580078
        }, {
            x: 50.46123123168945,
            y: -293.44427490234375,
            z: 36.662227630615234
        }, {
            x: 75,
            y: -285.31695556640625,
            z: 54.49068832397461
        }, {
            x: 180.3650360107422,
            y: 200.7391815185547,
            z: 131.04287719726562
        }, {
            x: 162.4014129638672,
            y: 222.9434356689453,
            z: 117.99153137207031
        }, {
            x: 142.65847778320312,
            y: 242.70509338378906,
            z: 103.64745330810547
        }, {
            x: 121.35254669189453,
            y: 259.8076171875,
            z: 88.16778564453125
        }, {
            x: 98.71705627441406,
            y: 274.0636291503906,
            z: 71.72213745117188
        }, {
            x: 75,
            y: 285.31695556640625,
            z: 54.49068832397461
        }, {
            x: 50.46123123168945,
            y: 293.44427490234375,
            z: 36.662227630615234
        }, {
            x: 23.30393409729004,
            y: -298.3565673828125,
            z: 20.982959747314453
        }, {
            x: 46.3525505065918,
            y: -293.44427490234375,
            z: 41.73602294921875
        }, {
            x: 68.893310546875,
            y: -285.31695556640625,
            z: 62.03181838989258
        }, {
            x: 111.47171783447266,
            y: 259.8076171875,
            z: 100.36959075927734
        }, {
            x: 90.67926025390625,
            y: 274.0636291503906,
            z: 81.64797973632812
        }, {
            x: 68.893310546875,
            y: 285.31695556640625,
            z: 62.03181838989258
        }, {
            x: 20.982959747314453,
            y: -298.3565673828125,
            z: 23.30393409729004
        }, {
            x: 41.73602294921875,
            y: -293.44427490234375,
            z: 46.3525505065918
        }, {
            x: 62.03181838989258,
            y: -285.31695556640625,
            z: 68.893310546875
        }, {
            x: 100.36959075927734,
            y: 259.8076171875,
            z: 111.47171783447266
        }, {
            x: 81.64797973632812,
            y: 274.0636291503906,
            z: 90.67926025390625
        }, {
            x: 62.03181838989258,
            y: 285.31695556640625,
            z: 68.893310546875
        }, {
            x: 18.432086944580078,
            y: -298.3565673828125,
            z: 25.369590759277344
        }, {
            x: 36.662227630615234,
            y: -293.44427490234375,
            z: 50.46123123168945
        }, {
            x: 54.49068832397461,
            y: -285.31695556640625,
            z: 75
        }, {
            x: 71.72213745117188,
            y: 274.0636291503906,
            z: 98.71705627441406
        }, {
            x: 54.49068832397461,
            y: 285.31695556640625,
            z: 75
        }, {
            x: 15.679269790649414,
            y: -298.3565673828125,
            z: 27.157289505004883
        }, {
            x: 31.186752319335938,
            y: -293.44427490234375,
            z: 54.01704025268555
        }, {
            x: 46.3525505065918,
            y: -285.31695556640625,
            z: 80.28497314453125
        }, {
            x: 61.010498046875,
            y: 274.0636291503906,
            z: 105.67327880859375
        }, {
            x: 46.3525505065918,
            y: 285.31695556640625,
            z: 80.28497314453125
        }, {
            x: 12.754667282104492,
            y: -298.3565673828125,
            z: 28.647449493408203
        }, {
            x: 25.369590759277344,
            y: -293.44427490234375,
            z: 56.98103332519531
        }, {
            x: 37.70656204223633,
            y: -285.31695556640625,
            z: 84.69032287597656
        }, {
            x: 49.630409240722656,
            y: 274.0636291503906,
            z: 111.47171783447266
        }, {
            x: 37.70656204223633,
            y: 285.31695556640625,
            z: 84.69032287597656
        }, {
            x: 9.690321922302246,
            y: -298.3565673828125,
            z: 29.82374382019043
        }, {
            x: 19.27447509765625,
            y: -293.44427490234375,
            z: 59.32073211669922
        }, {
            x: 28.647451400756836,
            y: -285.31695556640625,
            z: 88.16778564453125
        }, {
            x: 37.70656204223633,
            y: 274.0636291503906,
            z: 116.04886627197266
        }, {
            x: 28.647451400756836,
            y: 285.31695556640625,
            z: 88.16778564453125
        }, {
            x: 6.519806861877441,
            y: -298.3565673828125,
            z: 30.67327880859375
        }, {
            x: 12.968180656433105,
            y: -293.44427490234375,
            z: 61.010498046875
        }, {
            x: 19.274473190307617,
            y: -285.31695556640625,
            z: 90.67927551269531
        }, {
            x: 25.369590759277344,
            y: 274.0636291503906,
            z: 119.35454559326172
        }, {
            x: 19.274473190307617,
            y: 285.31695556640625,
            z: 90.67927551269531
        }, {
            x: 3.277859926223755,
            y: -298.3565673828125,
            z: 31.18675422668457
        }, {
            x: 6.519806861877441,
            y: -293.44427490234375,
            z: 62.03181838989258
        }, {
            x: 15.679269790649414,
            y: 259.8076171875,
            z: 149.17828369140625
        }, {
            x: 12.754667282104492,
            y: 274.0636291503906,
            z: 121.35254669189453
        }, {
            x: 9.690321922302246,
            y: 285.31695556640625,
            z: 92.19725036621094
        }, {
            x: 0,
            y: -298.3565673828125,
            z: 31.358539581298828
        }, {
            x: 0,
            y: -293.44427490234375,
            z: 62.373504638671875
        }, {
            x: 0,
            y: 285.31695556640625,
            z: 92.7051010131836
        }],
        o = [{
            x: -0.8217157125473022,
            y: -299.5888671875,
            z: 15.679269790649414
        }, {
            x: -1.6411792039871216,
            y: -298.3565673828125,
            z: 31.315561294555664
        }, {
            x: -2.456144094467163,
            y: -296.3065185546875,
            z: 46.866024017333984
        }, {
            x: -3.2643771171569824,
            y: -293.44427490234375,
            z: 62.28802490234375
        }, {
            x: -4.063662528991699,
            y: -289.7777404785156,
            z: 77.53929901123047
        }, {
            x: -5.626658916473389,
            y: 280.0741271972656,
            z: 107.36304473876953
        }, {
            x: -4.851809978485107,
            y: 285.31695556640625,
            z: 92.57804107666016
        }, {
            x: -4.063662528991699,
            y: 289.7777404785156,
            z: 77.53929901123047
        }, {
            x: -1.6411792039871216,
            y: -299.5888671875,
            z: 15.614776611328125
        }, {
            x: -3.277859926223755,
            y: -298.3565673828125,
            z: 31.18675422668457
        }, {
            x: -4.9055562019348145,
            y: -296.3065185546875,
            z: 46.67325210571289
        }, {
            x: -6.519806861877441,
            y: -293.44427490234375,
            z: 62.03181838989258
        }, {
            x: -8.11618709564209,
            y: -289.7777404785156,
            z: 77.2203598022461
        }, {
            x: -25.369590759277344,
            y: -176.3355712890625,
            z: 241.37554931640625
        }, {
            x: -30.290023803710938,
            y: -77.64571380615234,
            z: 288.1903381347656
        }, {
            x: -12.754667282104492,
            y: 274.0636291503906,
            z: 121.35254669189453
        }, {
            x: -11.237895965576172,
            y: 280.0741271972656,
            z: 106.92143249511719
        }, {
            x: -9.690321922302246,
            y: 285.31695556640625,
            z: 92.19725036621094
        }, {
            x: -2.456144094467163,
            y: -299.5888671875,
            z: 15.507484436035156
        }, {
            x: -4.9055562019348145,
            y: -298.3565673828125,
            z: 30.972463607788086
        }, {
            x: -7.341522216796875,
            y: -296.3065185546875,
            z: 46.3525505065918
        }, {
            x: -9.757365226745605,
            y: -293.44427490234375,
            z: 61.6055908203125
        }, {
            x: -12.146465301513672,
            y: -289.7777404785156,
            z: 76.68976593017578
        }, {
            x: -36.47172546386719,
            y: -188.79611206054688,
            z: 230.27340698242188
        }, {
            x: -37.96744155883789,
            y: -176.3355712890625,
            z: 239.7169952392578
        }, {
            x: -39.359092712402344,
            y: -163.39170837402344,
            z: 248.50355529785156
        }, {
            x: -46.866024017333984,
            y: 15.700786590576172,
            z: 295.9004211425781
        }, {
            x: -19.088289260864258,
            y: 274.0636291503906,
            z: 120.51871490478516
        }, {
            x: -16.818328857421875,
            y: 280.0741271972656,
            z: 106.18675994873047
        }, {
            x: -14.50227165222168,
            y: 285.31695556640625,
            z: 91.56375122070312
        }, {
            x: -3.2643771171569824,
            y: -299.5888671875,
            z: 15.357686996459961
        }, {
            x: -6.519806861877441,
            y: -298.3565673828125,
            z: 30.67327880859375
        }, {
            x: -9.757365226745605,
            y: -296.3065185546875,
            z: 45.90480041503906
        }, {
            x: -12.968180656433105,
            y: -293.44427490234375,
            z: 61.010498046875
        }, {
            x: -16.143451690673828,
            y: -289.7777404785156,
            z: 75.948974609375
        }, {
            x: -46.35254669189453,
            y: -200.7391815185547,
            z: 218.0716094970703
        }, {
            x: -48.47332000732422,
            y: -188.79611206054688,
            z: 228.04904174804688
        }, {
            x: -28.316978454589844,
            y: 267.3019714355469,
            z: 133.22091674804688
        }, {
            x: -25.369590759277344,
            y: 274.0636291503906,
            z: 119.35454559326172
        }, {
            x: -22.352664947509766,
            y: 280.0741271972656,
            z: 105.16102600097656
        }, {
            x: -19.274473190307617,
            y: 285.31695556640625,
            z: 90.67927551269531
        }, {
            x: -4.063662528991699,
            y: -299.5888671875,
            z: 15.16579532623291
        }, {
            x: -8.11618709564209,
            y: -298.3565673828125,
            z: 30.290023803710938
        }, {
            x: -12.146465301513672,
            y: -296.3065185546875,
            z: 45.33122634887695
        }, {
            x: -16.143451690673828,
            y: -293.44427490234375,
            z: 60.2481803894043
        }, {
            x: -20.096189498901367,
            y: -289.7777404785156,
            z: 75
        }, {
            x: -27.825735092163086,
            y: -280.0741271972656,
            z: 103.84706115722656
        }, {
            x: -57.70201110839844,
            y: -200.7391815185547,
            z: 215.34683227539062
        }, {
            x: -73.845458984375,
            y: -92.7051010131836,
            z: 275.5950012207031
        }, {
            x: -75.94896697998047,
            y: -62.373504638671875,
            z: 283.4454040527344
        }, {
            x: -35.25041580200195,
            y: 267.3019714355469,
            z: 131.5563507080078
        }, {
            x: -31.581357955932617,
            y: 274.0636291503906,
            z: 117.86322784423828
        }, {
            x: -27.825735092163086,
            y: 280.0741271972656,
            z: 103.84706115722656
        }, {
            x: -23.99384307861328,
            y: 285.31695556640625,
            z: 89.5462417602539
        }, {
            x: -4.851809978485107,
            y: -299.5888671875,
            z: 14.93233585357666
        }, {
            x: -9.690321922302246,
            y: -298.3565673828125,
            z: 29.82374382019043
        }, {
            x: -14.502272605895996,
            y: -296.3065185546875,
            z: 44.63340759277344
        }, {
            x: -19.27447509765625,
            y: -293.44427490234375,
            z: 59.32073211669922
        }, {
            x: -23.993846893310547,
            y: -289.7777404785156,
            z: 73.84546661376953
        }, {
            x: -28.647451400756836,
            y: -285.31695556640625,
            z: 88.16778564453125
        }, {
            x: -33.2225341796875,
            y: -280.0741271972656,
            z: 102.24845123291016
        }, {
            x: -88.16778564453125,
            y: -92.7051010131836,
            z: 271.3525695800781
        }, {
            x: -42.08723449707031,
            y: 267.3019714355469,
            z: 129.53118896484375
        }, {
            x: -37.70656204223633,
            y: 274.0636291503906,
            z: 116.04886627197266
        }, {
            x: -33.2225341796875,
            y: 280.0741271972656,
            z: 102.24845123291016
        }, {
            x: -28.647451400756836,
            y: 285.31695556640625,
            z: 88.16778564453125
        }, {
            x: -5.626658916473389,
            y: -299.5888671875,
            z: 14.657946586608887
        }, {
            x: -11.237895965576172,
            y: -298.3565673828125,
            z: 29.27571678161621
        }, {
            x: -16.818330764770508,
            y: -296.3065185546875,
            z: 43.8132438659668
        }, {
            x: -22.352664947509766,
            y: -293.44427490234375,
            z: 58.230682373046875
        }, {
            x: -27.825735092163086,
            y: -289.7777404785156,
            z: 72.48851776123047
        }, {
            x: -33.2225341796875,
            y: -285.31695556640625,
            z: 86.54766082763672
        }, {
            x: -38.52827453613281,
            y: -280.0741271972656,
            z: 100.36958312988281
        }, {
            x: -53.755191802978516,
            y: 259.8076171875,
            z: 140.0370635986328
        }, {
            x: -48.808692932128906,
            y: 267.3019714355469,
            z: 127.15098571777344
        }, {
            x: -43.72841262817383,
            y: 274.0636291503906,
            z: 113.9164047241211
        }, {
            x: -38.52827453613281,
            y: 280.0741271972656,
            z: 100.36958312988281
        }, {
            x: -33.2225341796875,
            y: 285.31695556640625,
            z: 86.54766082763672
        }, {
            x: -6.386085510253906,
            y: -299.5888671875,
            z: 14.343381881713867
        }, {
            x: -12.754667282104492,
            y: -298.3565673828125,
            z: 28.647449493408203
        }, {
            x: -19.088289260864258,
            y: -296.3065185546875,
            z: 42.87299728393555
        }, {
            x: -25.369590759277344,
            y: -293.44427490234375,
            z: 56.98103332519531
        }, {
            x: -31.581357955932617,
            y: -289.7777404785156,
            z: 70.9328842163086
        }, {
            x: -37.70656204223633,
            y: -285.31695556640625,
            z: 84.69032287597656
        }, {
            x: -43.72841262817383,
            y: -280.0741271972656,
            z: 98.21562194824219
        }, {
            x: -49.630409240722656,
            y: -274.0636291503906,
            z: 111.47171783447266
        }, {
            x: -66.4573974609375,
            y: 251.60116577148438,
            z: 149.2657470703125
        }, {
            x: -61.010498046875,
            y: 259.8076171875,
            z: 137.0318145751953
        }, {
            x: -49.630409240722656,
            y: 274.0636291503906,
            z: 111.47171783447266
        }, {
            x: -43.72841262817383,
            y: 280.0741271972656,
            z: 98.21562194824219
        }, {
            x: -37.70656204223633,
            y: 285.31695556640625,
            z: 84.69032287597656
        }, {
            x: -7.128007888793945,
            y: -299.5888671875,
            z: 13.989503860473633
        }, {
            x: -14.236477851867676,
            y: -298.3565673828125,
            z: 27.940662384033203
        }, {
            x: -21.30592918395996,
            y: -296.3065185546875,
            z: 41.81523895263672
        }, {
            x: -28.316978454589844,
            y: -293.44427490234375,
            z: 55.575199127197266
        }, {
            x: -35.25041580200195,
            y: -289.7777404785156,
            z: 69.1828384399414
        }, {
            x: -42.08723449707031,
            y: -285.31695556640625,
            z: 82.60084533691406
        }, {
            x: -48.808692932128906,
            y: -280.0741271972656,
            z: 95.7924575805664
        }, {
            x: -55.39636993408203,
            y: -274.0636291503906,
            z: 108.72150421142578
        }, {
            x: -136.010498046875,
            y: -15.700786590576172,
            z: 266.93560791015625
        }, {
            x: -80.05467987060547,
            y: 242.70509338378906,
            z: 157.11614990234375
        }, {
            x: -74.17828369140625,
            y: 251.60116577148438,
            z: 145.5830841064453
        }, {
            x: -55.39636993408203,
            y: 274.0636291503906,
            z: 108.72150421142578
        }, {
            x: -48.808692932128906,
            y: 280.0741271972656,
            z: 95.7924575805664
        }, {
            x: -42.08723449707031,
            y: 285.31695556640625,
            z: 82.60084533691406
        }, {
            x: -7.850393295288086,
            y: -299.5888671875,
            z: 13.59727954864502
        }, {
            x: -15.679269790649414,
            y: -298.3565673828125,
            z: 27.157289505004883
        }, {
            x: -23.46516990661621,
            y: -296.3065185546875,
            z: 40.64286422729492
        }, {
            x: -31.186752319335938,
            y: -293.44427490234375,
            z: 54.01704025268555
        }, {
            x: -38.82285690307617,
            y: -289.7777404785156,
            z: 67.24315643310547
        }, {
            x: -46.3525505065918,
            y: -285.31695556640625,
            z: 80.28497314453125
        }, {
            x: -53.755191802978516,
            y: -280.0741271972656,
            z: 93.10672760009766
        }, {
            x: -61.010498046875,
            y: -274.0636291503906,
            z: 105.67327880859375
        }, {
            x: -133.65098571777344,
            y: -136.1971435546875,
            z: 231.4902801513672
        }, {
            x: -137.0318145751953,
            y: -122.02099609375,
            z: 237.3460693359375
        }, {
            x: -149.17828369140625,
            y: -31.358539581298828,
            z: 258.3843688964844
        }, {
            x: -68.09857177734375,
            y: 267.3019714355469,
            z: 117.95018768310547
        }, {
            x: -61.010498046875,
            y: 274.0636291503906,
            z: 105.67327880859375
        }, {
            x: -53.755191802978516,
            y: 280.0741271972656,
            z: 93.10672760009766
        }, {
            x: -46.3525505065918,
            y: 285.31695556640625,
            z: 80.28497314453125
        }, {
            x: -8.551261901855469,
            y: -299.5888671875,
            z: 13.167787551879883
        }, {
            x: -17.079084396362305,
            y: -298.3565673828125,
            z: 26.299484252929688
        }, {
            x: -25.560094833374023,
            y: -296.3065185546875,
            z: 39.359092712402344
        }, {
            x: -33.97105026245117,
            y: -293.44427490234375,
            z: 52.310821533203125
        }, {
            x: -42.28888702392578,
            y: -289.7777404785156,
            z: 65.11917877197266
        }, {
            x: -50.49081802368164,
            y: -285.31695556640625,
            z: 77.74903106689453
        }, {
            x: -58.554351806640625,
            y: -280.0741271972656,
            z: 90.1657943725586
        }, {
            x: -66.4573974609375,
            y: -274.0636291503906,
            z: 102.33541107177734
        }, {
            x: -137.03182983398438,
            y: -163.39170837402344,
            z: 211.010498046875
        }, {
            x: -141.50137329101562,
            y: -150,
            z: 217.89300537109375
        }, {
            x: -145.5830841064453,
            y: -136.1971435546875,
            z: 224.17828369140625
        }, {
            x: -149.26576232910156,
            y: -122.02099609375,
            z: 229.84909057617188
        }, {
            x: -152.539306640625,
            y: -107.51038360595703,
            z: 234.88992309570312
        }, {
            x: -155.39476013183594,
            y: -92.7051010131836,
            z: 239.28692626953125
        }, {
            x: -163.16778564453125,
            y: -15.700786590576172,
            z: 251.25636291503906
        }, {
            x: -74.17828369140625,
            y: 267.3019714355469,
            z: 114.22453308105469
        }, {
            x: -66.4573974609375,
            y: 274.0636291503906,
            z: 102.33541107177734
        }, {
            x: -58.554351806640625,
            y: 280.0741271972656,
            z: 90.1657943725586
        }, {
            x: -50.49081802368164,
            y: 285.31695556640625,
            z: 77.74903106689453
        }, {
            x: -42.28888702392578,
            y: 289.7777404785156,
            z: 65.11917877197266
        }, {
            x: -33.97105026245117,
            y: 293.44427490234375,
            z: 52.310821533203125
        }, {
            x: -9.228691101074219,
            y: -299.5888671875,
            z: 12.702202796936035
        }, {
            x: -18.432086944580078,
            y: -298.3565673828125,
            z: 25.369590759277344
        }, {
            x: -27.5849609375,
            y: -296.3065185546875,
            z: 37.96744155883789
        }, {
            x: -36.662227630615234,
            y: -293.44427490234375,
            z: 50.46123123168945
        }, {
            x: -45.639007568359375,
            y: -289.7777404785156,
            z: 62.81669998168945
        }, {
            x: -54.49068832397461,
            y: -285.31695556640625,
            z: 75
        }, {
            x: -63.19301986694336,
            y: -280.0741271972656,
            z: 86.97772979736328
        }, {
            x: -71.72213745117188,
            y: -274.0636291503906,
            z: 98.71705627441406
        }, {
            x: -137.03848266601562,
            y: -188.79611206054688,
            z: 188.61727905273438
        }, {
            x: -147.887451171875,
            y: -163.39170837402344,
            z: 203.54962158203125
        }, {
            x: -152.71109008789062,
            y: -150,
            z: 210.18878173828125
        }, {
            x: -157.11614990234375,
            y: -136.1971435546875,
            z: 216.2518310546875
        }, {
            x: -161.09056091308594,
            y: -122.02099609375,
            z: 221.72213745117188
        }, {
            x: -164.62344360351562,
            y: -107.51038360595703,
            z: 226.58473205566406
        }, {
            x: -167.70509338378906,
            y: -92.7051010131836,
            z: 230.82627868652344
        }, {
            x: -175.3695831298828,
            y: -31.358539581298828,
            z: 241.3755340576172
        }, {
            x: -176.09390258789062,
            y: -15.700786590576172,
            z: 242.3724822998047
        }, {
            x: -117.99153137207031,
            y: 222.9434356689453,
            z: 162.4014129638672
        }, {
            x: -80.05467987060547,
            y: 267.3019714355469,
            z: 110.18580627441406
        }, {
            x: -71.72213745117188,
            y: 274.0636291503906,
            z: 98.71705627441406
        }, {
            x: -63.19301986694336,
            y: 280.0741271972656,
            z: 86.97772979736328
        }, {
            x: -54.49068832397461,
            y: 285.31695556640625,
            z: 75
        }, {
            x: -45.639007568359375,
            y: 289.7777404785156,
            z: 62.81669998168945
        }, {
            x: -36.662227630615234,
            y: 293.44427490234375,
            z: 50.46123123168945
        }, {
            x: -9.88082504272461,
            y: -299.5888671875,
            z: 12.201803207397461
        }, {
            x: -19.734567642211914,
            y: -298.3565673828125,
            z: 24.370162963867188
        }, {
            x: -29.53421974182129,
            y: -296.3065185546875,
            z: 36.47172546386719
        }, {
            x: -39.2529182434082,
            y: -293.44427490234375,
            z: 48.47332000732422
        }, {
            x: -48.86403274536133,
            y: -289.7777404785156,
            z: 60.3420524597168
        }, {
            x: -58.34120559692383,
            y: -285.31695556640625,
            z: 72.04539489746094
        }, {
            x: -67.65847778320312,
            y: -280.0741271972656,
            z: 83.55126953125
        }, {
            x: -76.79029083251953,
            y: -274.0636291503906,
            z: 94.828125
        }, {
            x: -152.73927307128906,
            y: -176.3355712890625,
            z: 188.61727905273438
        }, {
            x: -158.33773803710938,
            y: -163.39170837402344,
            z: 195.5308380126953
        }, {
            x: -163.5022430419922,
            y: -150,
            z: 201.908447265625
        }, {
            x: -168.21856689453125,
            y: -136.1971435546875,
            z: 207.73263549804688
        }, {
            x: -172.4738311767578,
            y: -122.02099609375,
            z: 212.98745727539062
        }, {
            x: -176.25636291503906,
            y: -107.51038360595703,
            z: 217.6584930419922
        }, {
            x: -179.5557861328125,
            y: -92.7051010131836,
            z: 221.73292541503906
        }, {
            x: -182.36305236816406,
            y: -77.64571380615234,
            z: 225.19961547851562
        }, {
            x: -184.67047119140625,
            y: -62.373504638671875,
            z: 228.04904174804688
        }, {
            x: -186.47171020507812,
            y: -46.93033981323242,
            z: 230.27340698242188
        }, {
            x: -187.76187133789062,
            y: -31.358539581298828,
            z: 231.8666229248047
        }, {
            x: -188.53736877441406,
            y: -15.700786590576172,
            z: 232.8242645263672
        }, {
            x: -110.97157287597656,
            y: 242.70509338378906,
            z: 137.03848266601562
        }, {
            x: -85.71163940429688,
            y: 267.3019714355469,
            z: 105.84506225585938
        }, {
            x: -76.79029083251953,
            y: 274.0636291503906,
            z: 94.828125
        }, {
            x: -67.65847778320312,
            y: 280.0741271972656,
            z: 83.55126953125
        }, {
            x: -58.34120559692383,
            y: 285.31695556640625,
            z: 72.04539489746094
        }, {
            x: -48.86403274536133,
            y: 289.7777404785156,
            z: 60.3420524597168
        }, {
            x: -39.2529182434082,
            y: 293.44427490234375,
            z: 48.47332000732422
        }, {
            x: -10.505877494812012,
            y: -299.5888671875,
            z: 11.66795825958252
        }, {
            x: -20.982959747314453,
            y: -298.3565673828125,
            z: 23.30393409729004
        }, {
            x: -31.40252685546875,
            y: -296.3065185546875,
            z: 34.87603759765625
        }, {
            x: -41.73602294921875,
            y: -293.44427490234375,
            z: 46.3525505065918
        }, {
            x: -51.95512771606445,
            y: -289.7777404785156,
            z: 57.70201110839844
        }, {
            x: -62.03181838989258,
            y: -285.31695556640625,
            z: 68.893310546875
        }, {
            x: -71.93849182128906,
            y: -280.0741271972656,
            z: 79.89578247070312
        }, {
            x: -81.64797973632812,
            y: -274.0636291503906,
            z: 90.67926025390625
        }, {
            x: -168.3540496826172,
            y: -163.39170837402344,
            z: 186.97610473632812
        }, {
            x: -173.84523010253906,
            y: -150,
            z: 193.07469177246094
        }, {
            x: -178.85992431640625,
            y: -136.1971435546875,
            z: 198.64405822753906
        }, {
            x: -183.38436889648438,
            y: -122.02099609375,
            z: 203.66896057128906
        }, {
            x: -187.4061737060547,
            y: -107.51038360595703,
            z: 208.13563537597656
        }, {
            x: -190.914306640625,
            y: -92.7051010131836,
            z: 212.03179931640625
        }, {
            x: -193.89915466308594,
            y: -77.64571380615234,
            z: 215.34683227539062
        }, {
            x: -196.35255432128906,
            y: -62.373504638671875,
            z: 218.0715789794922
        }, {
            x: -199.63951110839844,
            y: -31.358539581298828,
            z: 221.72213745117188
        }, {
            x: -200.46408081054688,
            y: -15.700786590576172,
            z: 222.63790893554688
        }, {
            x: -200.7391815185547,
            y: 0,
            z: 222.9434356689453
        }, {
            x: -156.00364685058594,
            y: 188.79611206054688,
            z: 173.2595977783203
        }, {
            x: -149.17828369140625,
            y: 200.7391815185547,
            z: 165.67926025390625
        }, {
            x: -141.9440460205078,
            y: 212.1320343017578,
            z: 157.6448211669922
        }, {
            x: -109.33039855957031,
            y: 251.60116577148438,
            z: 121.42369842529297
        }, {
            x: -91.13368225097656,
            y: 267.3019714355469,
            z: 101.21420288085938
        }, {
            x: -81.64797973632812,
            y: 274.0636291503906,
            z: 90.67926025390625
        }, {
            x: -71.93849182128906,
            y: 280.0741271972656,
            z: 79.89578247070312
        }, {
            x: -62.03181838989258,
            y: 285.31695556640625,
            z: 68.893310546875
        }, {
            x: -51.95512771606445,
            y: 289.7777404785156,
            z: 57.70201110839844
        }, {
            x: -41.73602294921875,
            y: 293.44427490234375,
            z: 46.3525505065918
        }, {
            x: -11.102132797241211,
            y: -299.5888671875,
            z: 11.102132797241211
        }, {
            x: -22.17383575439453,
            y: -298.3565673828125,
            z: 22.17383575439453
        }, {
            x: -33.18476104736328,
            y: -296.3065185546875,
            z: 33.18476104736328
        }, {
            x: -44.10472869873047,
            y: -293.44427490234375,
            z: 44.10472869873047
        }, {
            x: -54.90380859375,
            y: -289.7777404785156,
            z: 54.90380859375
        }, {
            x: -65.55239868164062,
            y: -285.31695556640625,
            z: 65.55239868164062
        }, {
            x: -76.02132415771484,
            y: -280.0741271972656,
            z: 76.02132415771484
        }, {
            x: -86.28187561035156,
            y: -274.0636291503906,
            z: 86.28187561035156
        }, {
            x: -177.9088897705078,
            y: -163.39170837402344,
            z: 177.9088897705078
        }, {
            x: -183.7117156982422,
            y: -150,
            z: 183.7117156982422
        }, {
            x: -189.0110321044922,
            y: -136.1971435546875,
            z: 189.0110321044922
        }, {
            x: -193.79225158691406,
            y: -122.02099609375,
            z: 193.79225158691406
        }, {
            x: -198.0423126220703,
            y: -107.51038360595703,
            z: 198.0423126220703
        }, {
            x: -201.7495574951172,
            y: -92.7051010131836,
            z: 201.7495574951172
        }, {
            x: -204.90379333496094,
            y: -77.64571380615234,
            z: 204.90379333496094
        }, {
            x: -210.96995544433594,
            y: -31.358539581298828,
            z: 210.96995544433594
        }, {
            x: -211.84130859375,
            y: -15.700786590576172,
            z: 211.84130859375
        }, {
            x: -212.1320343017578,
            y: 0,
            z: 212.1320343017578
        }, {
            x: -164.8575439453125,
            y: 188.79611206054688,
            z: 164.8575439453125
        }, {
            x: -133.49900817871094,
            y: 233.143798828125,
            z: 133.49900817871094
        }, {
            x: -124.68807983398438,
            y: 242.70509338378906,
            z: 124.68807983398438
        }, {
            x: -115.53538513183594,
            y: 251.60116577148438,
            z: 115.53538513183594
        }, {
            x: -106.0660171508789,
            y: 259.8076171875,
            z: 106.0660171508789
        }, {
            x: -96.3059310913086,
            y: 267.3019714355469,
            z: 96.3059310913086
        }, {
            x: -86.28187561035156,
            y: 274.0636291503906,
            z: 86.28187561035156
        }, {
            x: -76.02132415771484,
            y: 280.0741271972656,
            z: 76.02132415771484
        }, {
            x: -65.55239868164062,
            y: 285.31695556640625,
            z: 65.55239868164062
        }, {
            x: -54.90380859375,
            y: 289.7777404785156,
            z: 54.90380859375
        }, {
            x: -44.10472869873047,
            y: 293.44427490234375,
            z: 44.10472869873047
        }, {
            x: -11.66795825958252,
            y: -299.5888671875,
            z: 10.505877494812012
        }, {
            x: -23.30393409729004,
            y: -298.3565673828125,
            z: 20.982959747314453
        }, {
            x: -34.87603759765625,
            y: -296.3065185546875,
            z: 31.40252685546875
        }, {
            x: -46.3525505065918,
            y: -293.44427490234375,
            z: 41.73602294921875
        }, {
            x: -57.70201110839844,
            y: -289.7777404785156,
            z: 51.95512771606445
        }, {
            x: -68.893310546875,
            y: -285.31695556640625,
            z: 62.03181838989258
        }, {
            x: -79.89578247070312,
            y: -280.0741271972656,
            z: 71.93849182128906
        }, {
            x: -90.67926025390625,
            y: -274.0636291503906,
            z: 81.64797973632812
        }, {
            x: -101.21420288085938,
            y: -267.3019714355469,
            z: 91.13368225097656
        }, {
            x: -193.07469177246094,
            y: -150,
            z: 173.84523010253906
        }, {
            x: -198.64405822753906,
            y: -136.1971435546875,
            z: 178.85992431640625
        }, {
            x: -203.66896057128906,
            y: -122.02099609375,
            z: 183.38436889648438
        }, {
            x: -208.13563537597656,
            y: -107.51038360595703,
            z: 187.4061737060547
        }, {
            x: -212.03179931640625,
            y: -92.7051010131836,
            z: 190.914306640625
        }, {
            x: -215.34683227539062,
            y: -77.64571380615234,
            z: 193.89915466308594
        }, {
            x: -218.0715789794922,
            y: -62.373504638671875,
            z: 196.35255432128906
        }, {
            x: -220.19863891601562,
            y: -46.93033981323242,
            z: 198.2677459716797
        }, {
            x: -222.63790893554688,
            y: -15.700786590576172,
            z: 200.46408081054688
        }, {
            x: -222.9434356689453,
            y: 0,
            z: 200.7391815185547
        }, {
            x: -149.17828369140625,
            y: 222.9434356689453,
            z: 134.32073974609375
        }, {
            x: -140.3028564453125,
            y: 233.143798828125,
            z: 126.32926177978516
        }, {
            x: -131.04287719726562,
            y: 242.70509338378906,
            z: 117.99153900146484
        }, {
            x: -121.42369842529297,
            y: 251.60116577148438,
            z: 109.33039855957031
        }, {
            x: -111.47171783447266,
            y: 259.8076171875,
            z: 100.36959075927734
        }, {
            x: -101.21420288085938,
            y: 267.3019714355469,
            z: 91.13368225097656
        }, {
            x: -90.67926025390625,
            y: 274.0636291503906,
            z: 81.64797973632812
        }, {
            x: -79.89578247070312,
            y: 280.0741271972656,
            z: 71.93849182128906
        }, {
            x: -68.893310546875,
            y: 285.31695556640625,
            z: 62.03181838989258
        }, {
            x: -57.70201110839844,
            y: 289.7777404785156,
            z: 51.95512771606445
        }, {
            x: -12.201803207397461,
            y: -299.5888671875,
            z: 9.88082504272461
        }, {
            x: -24.370162963867188,
            y: -298.3565673828125,
            z: 19.734567642211914
        }, {
            x: -36.47172546386719,
            y: -296.3065185546875,
            z: 29.53421974182129
        }, {
            x: -48.47332000732422,
            y: -293.44427490234375,
            z: 39.2529182434082
        }, {
            x: -60.3420524597168,
            y: -289.7777404785156,
            z: 48.86403274536133
        }, {
            x: -72.04539489746094,
            y: -285.31695556640625,
            z: 58.34120559692383
        }, {
            x: -83.55126953125,
            y: -280.0741271972656,
            z: 67.65847778320312
        }, {
            x: -94.828125,
            y: -274.0636291503906,
            z: 76.79029083251953
        }, {
            x: -207.73263549804688,
            y: -136.1971435546875,
            z: 168.21856689453125
        }, {
            x: -212.98745727539062,
            y: -122.02099609375,
            z: 172.4738311767578
        }, {
            x: -217.6584930419922,
            y: -107.51038360595703,
            z: 176.25636291503906
        }, {
            x: -221.73292541503906,
            y: -92.7051010131836,
            z: 179.5557861328125
        }, {
            x: -225.19961547851562,
            y: -77.64571380615234,
            z: 182.36305236816406
        }, {
            x: -228.04904174804688,
            y: -62.373504638671875,
            z: 184.67047119140625
        }, {
            x: -230.27340698242188,
            y: -46.93033981323242,
            z: 186.47171020507812
        }, {
            x: -232.8242645263672,
            y: 15.700786590576172,
            z: 188.53736877441406
        }, {
            x: -188.61727905273438,
            y: 176.3355712890625,
            z: 152.73927307128906
        }, {
            x: -156.00364685058594,
            y: 222.9434356689453,
            z: 126.32925415039062
        }, {
            x: -146.72213745117188,
            y: 233.143798828125,
            z: 118.81324005126953
        }, {
            x: -137.03848266601562,
            y: 242.70509338378906,
            z: 110.97157287597656
        }, {
            x: -126.97920989990234,
            y: 251.60116577148438,
            z: 102.82573699951172
        }, {
            x: -116.5718994140625,
            y: 259.8076171875,
            z: 94.39805603027344
        }, {
            x: -105.84506225585938,
            y: 267.3019714355469,
            z: 85.71163940429688
        }, {
            x: -94.828125,
            y: 274.0636291503906,
            z: 76.79029083251953
        }, {
            x: -83.55126953125,
            y: 280.0741271972656,
            z: 67.65847778320312
        }, {
            x: -72.04539489746094,
            y: 285.31695556640625,
            z: 58.34120559692383
        }, {
            x: -12.702202796936035,
            y: -299.5888671875,
            z: 9.228691101074219
        }, {
            x: -25.369590759277344,
            y: -298.3565673828125,
            z: 18.432086944580078
        }, {
            x: -37.96744155883789,
            y: -296.3065185546875,
            z: 27.5849609375
        }, {
            x: -50.46123123168945,
            y: -293.44427490234375,
            z: 36.662227630615234
        }, {
            x: -62.81669998168945,
            y: -289.7777404785156,
            z: 45.639007568359375
        }, {
            x: -75,
            y: -285.31695556640625,
            z: 54.49068832397461
        }, {
            x: -86.97772979736328,
            y: -280.0741271972656,
            z: 63.19301986694336
        }, {
            x: -98.71705627441406,
            y: -274.0636291503906,
            z: 71.72213745117188
        }, {
            x: -110.18580627441406,
            y: -267.3019714355469,
            z: 80.05467987060547
        }, {
            x: -216.2518310546875,
            y: -136.1971435546875,
            z: 157.11614990234375
        }, {
            x: -221.72213745117188,
            y: -122.02099609375,
            z: 161.09056091308594
        }, {
            x: -226.58473205566406,
            y: -107.51038360595703,
            z: 164.62344360351562
        }, {
            x: -230.82627868652344,
            y: -92.7051010131836,
            z: 167.70509338378906
        }, {
            x: -234.43511962890625,
            y: -77.64571380615234,
            z: 170.32708740234375
        }, {
            x: -237.4014129638672,
            y: -62.373504638671875,
            z: 172.4822235107422
        }, {
            x: -242.70509338378906,
            y: 0,
            z: 176.3355712890625
        }, {
            x: -196.35255432128906,
            y: 176.3355712890625,
            z: 142.65847778320312
        }, {
            x: -188.61727905273438,
            y: 188.79611206054688,
            z: 137.03848266601562
        }, {
            x: -171.61842346191406,
            y: 212.1320343017578,
            z: 124.68807983398438
        }, {
            x: -162.4014129638672,
            y: 222.9434356689453,
            z: 117.99153137207031
        }, {
            x: -152.73927307128906,
            y: 233.143798828125,
            z: 110.97157287597656
        }, {
            x: -142.65847778320312,
            y: 242.70509338378906,
            z: 103.64745330810547
        }, {
            x: -132.18667602539062,
            y: 251.60116577148438,
            z: 96.03923797607422
        }, {
            x: -121.35254669189453,
            y: 259.8076171875,
            z: 88.16778564453125
        }, {
            x: -110.18580627441406,
            y: 267.3019714355469,
            z: 80.05467987060547
        }, {
            x: -98.71705627441406,
            y: 274.0636291503906,
            z: 71.72213745117188
        }, {
            x: -86.97772979736328,
            y: 280.0741271972656,
            z: 63.19301986694336
        }, {
            x: -75,
            y: 285.31695556640625,
            z: 54.49068832397461
        }, {
            x: -62.81669998168945,
            y: 289.7777404785156,
            z: 45.639007568359375
        }, {
            x: -13.167787551879883,
            y: -299.5888671875,
            z: 8.551261901855469
        }, {
            x: -26.299484252929688,
            y: -298.3565673828125,
            z: 17.079084396362305
        }, {
            x: -39.359092712402344,
            y: -296.3065185546875,
            z: 25.560094833374023
        }, {
            x: -52.310821533203125,
            y: -293.44427490234375,
            z: 33.97105026245117
        }, {
            x: -65.11917877197266,
            y: -289.7777404785156,
            z: 42.28888702392578
        }, {
            x: -77.74903106689453,
            y: -285.31695556640625,
            z: 50.49081802368164
        }, {
            x: -90.1657943725586,
            y: -280.0741271972656,
            z: 58.554351806640625
        }, {
            x: -102.33541107177734,
            y: -274.0636291503906,
            z: 66.4573974609375
        }, {
            x: -114.22453308105469,
            y: -267.3019714355469,
            z: 74.17828369140625
        }, {
            x: -224.17828369140625,
            y: -136.1971435546875,
            z: 145.5830841064453
        }, {
            x: -229.84909057617188,
            y: -122.02099609375,
            z: 149.26576232910156
        }, {
            x: -234.88992309570312,
            y: -107.51038360595703,
            z: 152.539306640625
        }, {
            x: -239.28692626953125,
            y: -92.7051010131836,
            z: 155.39476013183594
        }, {
            x: -243.02806091308594,
            y: -77.64571380615234,
            z: 157.8242645263672
        }, {
            x: -246.10308837890625,
            y: -62.373504638671875,
            z: 159.8212127685547
        }, {
            x: -250.22286987304688,
            y: -31.358539581298828,
            z: 162.49664306640625
        }, {
            x: -251.60116577148438,
            y: 0,
            z: 163.39170837402344
        }, {
            x: -246.10308837890625,
            y: 62.373504638671875,
            z: 159.8212127685547
        }, {
            x: -195.5308380126953,
            y: 188.79611206054688,
            z: 126.97920989990234
        }, {
            x: -186.97610473632812,
            y: 200.7391815185547,
            z: 121.4237060546875
        }, {
            x: -177.9088897705078,
            y: 212.1320343017578,
            z: 115.53539276123047
        }, {
            x: -168.35403442382812,
            y: 222.9434356689453,
            z: 109.33039855957031
        }, {
            x: -158.33773803710938,
            y: 233.143798828125,
            z: 102.82573699951172
        }, {
            x: -147.887451171875,
            y: 242.70509338378906,
            z: 96.03923797607422
        }, {
            x: -137.0318145751953,
            y: 251.60116577148438,
            z: 88.98950958251953
        }, {
            x: -125.80058288574219,
            y: 259.8076171875,
            z: 81.69585418701172
        }, {
            x: -114.22453308105469,
            y: 267.3019714355469,
            z: 74.17828369140625
        }, {
            x: -102.33541107177734,
            y: 274.0636291503906,
            z: 66.4573974609375
        }, {
            x: -90.1657943725586,
            y: 280.0741271972656,
            z: 58.554351806640625
        }, {
            x: -77.74903106689453,
            y: 285.31695556640625,
            z: 50.49081802368164
        }, {
            x: -65.11917877197266,
            y: 289.7777404785156,
            z: 42.28888702392578
        }, {
            x: -13.59727954864502,
            y: -299.5888671875,
            z: 7.850393295288086
        }, {
            x: -27.157289505004883,
            y: -298.3565673828125,
            z: 15.679269790649414
        }, {
            x: -40.64286422729492,
            y: -296.3065185546875,
            z: 23.46516990661621
        }, {
            x: -54.01704025268555,
            y: -293.44427490234375,
            z: 31.186752319335938
        }, {
            x: -67.24315643310547,
            y: -289.7777404785156,
            z: 38.82285690307617
        }, {
            x: -80.28497314453125,
            y: -285.31695556640625,
            z: 46.3525505065918
        }, {
            x: -93.10672760009766,
            y: -280.0741271972656,
            z: 53.755191802978516
        }, {
            x: -105.67327880859375,
            y: -274.0636291503906,
            z: 61.010498046875
        }, {
            x: -225,
            y: -150,
            z: 129.90380859375
        }, {
            x: -231.4902801513672,
            y: -136.1971435546875,
            z: 133.65098571777344
        }, {
            x: -237.3460693359375,
            y: -122.02099609375,
            z: 137.0318145751953
        }, {
            x: -242.55130004882812,
            y: -107.51038360595703,
            z: 140.0370635986328
        }, {
            x: -247.09173583984375,
            y: -92.7051010131836,
            z: 142.65847778320312
        }, {
            x: -250.9548797607422,
            y: -77.64571380615234,
            z: 144.8888702392578
        }, {
            x: -258.3843688964844,
            y: -31.358539581298828,
            z: 149.17828369140625
        }, {
            x: -217.89300537109375,
            y: 163.39170837402344,
            z: 125.80058288574219
        }, {
            x: -193.07469177246094,
            y: 200.7391815185547,
            z: 111.47171783447266
        }, {
            x: -183.7117156982422,
            y: 212.1320343017578,
            z: 106.0660171508789
        }, {
            x: -173.84523010253906,
            y: 222.9434356689453,
            z: 100.36959075927734
        }, {
            x: -163.50222778320312,
            y: 233.143798828125,
            z: 94.39805603027344
        }, {
            x: -152.71109008789062,
            y: 242.70509338378906,
            z: 88.16778564453125
        }, {
            x: -141.50137329101562,
            y: 251.60116577148438,
            z: 81.69585418701172
        }, {
            x: -129.90380859375,
            y: 259.8076171875,
            z: 75
        }, {
            x: -117.95018768310547,
            y: 267.3019714355469,
            z: 68.09857177734375
        }, {
            x: -105.67327880859375,
            y: 274.0636291503906,
            z: 61.010498046875
        }, {
            x: -93.10672760009766,
            y: 280.0741271972656,
            z: 53.755191802978516
        }, {
            x: -80.28497314453125,
            y: 285.31695556640625,
            z: 46.3525505065918
        }, {
            x: -67.24315643310547,
            y: 289.7777404785156,
            z: 38.82285690307617
        }, {
            x: -13.989503860473633,
            y: -299.5888671875,
            z: 7.128007888793945
        }, {
            x: -27.940662384033203,
            y: -298.3565673828125,
            z: 14.236477851867676
        }, {
            x: -41.81523895263672,
            y: -296.3065185546875,
            z: 21.30592918395996
        }, {
            x: -55.575199127197266,
            y: -293.44427490234375,
            z: 28.316978454589844
        }, {
            x: -69.1828384399414,
            y: -289.7777404785156,
            z: 35.25041580200195
        }, {
            x: -82.60084533691406,
            y: -285.31695556640625,
            z: 42.08723449707031
        }, {
            x: -95.7924575805664,
            y: -280.0741271972656,
            z: 48.808692932128906
        }, {
            x: -108.72150421142578,
            y: -274.0636291503906,
            z: 55.39636993408203
        }, {
            x: -231.4902801513672,
            y: -150,
            z: 117.95018768310547
        }, {
            x: -238.16778564453125,
            y: -136.1971435546875,
            z: 121.35254669189453
        }, {
            x: -244.19248962402344,
            y: -122.02099609375,
            z: 124.42228698730469
        }, {
            x: -249.54788208007812,
            y: -107.51038360595703,
            z: 127.15099334716797
        }, {
            x: -254.21926879882812,
            y: -92.7051010131836,
            z: 129.53118896484375
        }, {
            x: -265.837646484375,
            y: -31.358539581298828,
            z: 135.4510498046875
        }, {
            x: -266.93560791015625,
            y: -15.700786590576172,
            z: 136.010498046875
        }, {
            x: -267.3019714355469,
            y: 0,
            z: 136.1971435546875
        }, {
            x: -266.93560791015625,
            y: 15.700786590576172,
            z: 136.010498046875
        }, {
            x: -258.1938781738281,
            y: 77.64571380615234,
            z: 131.5563507080078
        }, {
            x: -254.21926879882812,
            y: 92.7051010131836,
            z: 129.53118896484375
        }, {
            x: -238.16778564453125,
            y: 136.1971435546875,
            z: 121.35254669189453
        }, {
            x: -231.4902801513672,
            y: 150,
            z: 117.95018768310547
        }, {
            x: -224.17828369140625,
            y: 163.39170837402344,
            z: 114.22453308105469
        }, {
            x: -216.2518310546875,
            y: 176.3355712890625,
            z: 110.18580627441406
        }, {
            x: -207.73263549804688,
            y: 188.79611206054688,
            z: 105.84506225585938
        }, {
            x: -198.64405822753906,
            y: 200.7391815185547,
            z: 101.21420288085938
        }, {
            x: -189.0110321044922,
            y: 212.1320343017578,
            z: 96.30592346191406
        }, {
            x: -178.85992431640625,
            y: 222.9434356689453,
            z: 91.13367462158203
        }, {
            x: -168.21856689453125,
            y: 233.143798828125,
            z: 85.71163940429688
        }, {
            x: -157.11614990234375,
            y: 242.70509338378906,
            z: 80.05467987060547
        }, {
            x: -145.5830841064453,
            y: 251.60116577148438,
            z: 74.17828369140625
        }, {
            x: -133.65098571777344,
            y: 259.8076171875,
            z: 68.09857177734375
        }, {
            x: -121.35254669189453,
            y: 267.3019714355469,
            z: 61.832210540771484
        }, {
            x: -108.72150421142578,
            y: 274.0636291503906,
            z: 55.39636993408203
        }, {
            x: -95.7924575805664,
            y: 280.0741271972656,
            z: 48.808692932128906
        }, {
            x: -82.60084533691406,
            y: 285.31695556640625,
            z: 42.08723449707031
        }, {
            x: -69.1828384399414,
            y: 289.7777404785156,
            z: 35.25041580200195
        }, {
            x: -14.343381881713867,
            y: -299.5888671875,
            z: 6.386085510253906
        }, {
            x: -28.647449493408203,
            y: -298.3565673828125,
            z: 12.754667282104492
        }, {
            x: -42.87299728393555,
            y: -296.3065185546875,
            z: 19.088289260864258
        }, {
            x: -56.98103332519531,
            y: -293.44427490234375,
            z: 25.369590759277344
        }, {
            x: -70.9328842163086,
            y: -289.7777404785156,
            z: 31.581357955932617
        }, {
            x: -84.69032287597656,
            y: -285.31695556640625,
            z: 37.70656204223633
        }, {
            x: -98.21562194824219,
            y: -280.0741271972656,
            z: 43.72841262817383
        }, {
            x: -111.47171783447266,
            y: -274.0636291503906,
            z: 49.630409240722656
        }, {
            x: -237.3460693359375,
            y: -150,
            z: 105.67327880859375
        }, {
            x: -244.19247436523438,
            y: -136.1971435546875,
            z: 108.72150421142578
        }, {
            x: -250.3695831298828,
            y: -122.02099609375,
            z: 111.47171783447266
        }, {
            x: -255.86044311523438,
            y: -107.51038360595703,
            z: 113.91641235351562
        }, {
            x: -260.6499938964844,
            y: -92.7051010131836,
            z: 116.04885864257812
        }, {
            x: -272.5622863769531,
            y: -31.358539581298828,
            z: 121.35254669189453
        }, {
            x: -273.6880187988281,
            y: 15.700786590576172,
            z: 121.85376739501953
        }, {
            x: -272.5622863769531,
            y: 31.358539581298828,
            z: 121.35254669189453
        }, {
            x: -270.689453125,
            y: 46.93033981323242,
            z: 120.51871490478516
        }, {
            x: -268.0746765136719,
            y: 62.373504638671875,
            z: 119.35453796386719
        }, {
            x: -244.19247436523438,
            y: 136.1971435546875,
            z: 108.72150421142578
        }, {
            x: -237.3460693359375,
            y: 150,
            z: 105.67327880859375
        }, {
            x: -229.84909057617188,
            y: 163.39170837402344,
            z: 102.33541107177734
        }, {
            x: -221.7221221923828,
            y: 176.3355712890625,
            z: 98.71705627441406
        }, {
            x: -212.98744201660156,
            y: 188.79611206054688,
            z: 94.828125
        }, {
            x: -203.66896057128906,
            y: 200.7391815185547,
            z: 90.67927551269531
        }, {
            x: -193.79225158691406,
            y: 212.1320343017578,
            z: 86.28187561035156
        }, {
            x: -183.38436889648438,
            y: 222.9434356689453,
            z: 81.64797973632812
        }, {
            x: -172.4738311767578,
            y: 233.143798828125,
            z: 76.7903060913086
        }, {
            x: -161.09056091308594,
            y: 242.70509338378906,
            z: 71.72213745117188
        }, {
            x: -149.2657470703125,
            y: 251.60116577148438,
            z: 66.4573974609375
        }, {
            x: -137.0318145751953,
            y: 259.8076171875,
            z: 61.010498046875
        }, {
            x: -124.42228698730469,
            y: 267.3019714355469,
            z: 55.3963737487793
        }, {
            x: -111.47171783447266,
            y: 274.0636291503906,
            z: 49.630409240722656
        }, {
            x: -98.21562194824219,
            y: 280.0741271972656,
            z: 43.72841262817383
        }, {
            x: -84.69032287597656,
            y: 285.31695556640625,
            z: 37.70656204223633
        }, {
            x: -70.9328842163086,
            y: 289.7777404785156,
            z: 31.581357955932617
        }, {
            x: -14.657946586608887,
            y: -299.5888671875,
            z: 5.626658916473389
        }, {
            x: -29.27571678161621,
            y: -298.3565673828125,
            z: 11.237895965576172
        }, {
            x: -43.8132438659668,
            y: -296.3065185546875,
            z: 16.818330764770508
        }, {
            x: -58.230682373046875,
            y: -293.44427490234375,
            z: 22.352664947509766
        }, {
            x: -72.48851776123047,
            y: -289.7777404785156,
            z: 27.825735092163086
        }, {
            x: -86.54766082763672,
            y: -285.31695556640625,
            z: 33.2225341796875
        }, {
            x: -100.36958312988281,
            y: -280.0741271972656,
            z: 38.52827453613281
        }, {
            x: -113.9164047241211,
            y: -274.0636291503906,
            z: 43.72841262817383
        }, {
            x: -127.15098571777344,
            y: -267.3019714355469,
            z: 48.808692932128906
        }, {
            x: -255.86044311523438,
            y: -122.02099609375,
            z: 98.21562957763672
        }, {
            x: -261.4717102050781,
            y: -107.51038360595703,
            z: 100.36959075927734
        }, {
            x: -278.53985595703125,
            y: -31.358539581298828,
            z: 106.92143249511719
        }, {
            x: -280.0741271972656,
            y: 0,
            z: 107.51038360595703
        }, {
            x: -279.6903076171875,
            y: 15.700786590576172,
            z: 107.36304473876953
        }, {
            x: -278.53985595703125,
            y: 31.358539581298828,
            z: 106.92143249511719
        }, {
            x: -249.54786682128906,
            y: 136.1971435546875,
            z: 95.7924575805664
        }, {
            x: -242.55130004882812,
            y: 150,
            z: 93.10672760009766
        }, {
            x: -234.88990783691406,
            y: 163.39170837402344,
            z: 90.16580200195312
        }, {
            x: -226.584716796875,
            y: 176.3355712890625,
            z: 86.97772979736328
        }, {
            x: -217.65847778320312,
            y: 188.79611206054688,
            z: 83.55125427246094
        }, {
            x: -208.13563537597656,
            y: 200.7391815185547,
            z: 79.89578247070312
        }, {
            x: -198.0423126220703,
            y: 212.1320343017578,
            z: 76.02132415771484
        }, {
            x: -187.40615844726562,
            y: 222.9434356689453,
            z: 71.93849182128906
        }, {
            x: -176.25636291503906,
            y: 233.143798828125,
            z: 67.65847778320312
        }, {
            x: -164.62344360351562,
            y: 242.70509338378906,
            z: 63.19301986694336
        }, {
            x: -152.539306640625,
            y: 251.60116577148438,
            z: 58.554351806640625
        }, {
            x: -140.0370635986328,
            y: 259.8076171875,
            z: 53.755191802978516
        }, {
            x: -127.15098571777344,
            y: 267.3019714355469,
            z: 48.808692932128906
        }, {
            x: -113.9164047241211,
            y: 274.0636291503906,
            z: 43.72841262817383
        }, {
            x: -100.36958312988281,
            y: 280.0741271972656,
            z: 38.52827453613281
        }, {
            x: -86.54766082763672,
            y: 285.31695556640625,
            z: 33.2225341796875
        }, {
            x: -72.48851776123047,
            y: 289.7777404785156,
            z: 27.825735092163086
        }, {
            x: -14.93233585357666,
            y: -299.5888671875,
            z: 4.851809978485107
        }, {
            x: -29.82374382019043,
            y: -298.3565673828125,
            z: 9.690321922302246
        }, {
            x: -44.63340759277344,
            y: -296.3065185546875,
            z: 14.502272605895996
        }, {
            x: -59.32073211669922,
            y: -293.44427490234375,
            z: 19.27447509765625
        }, {
            x: -73.84546661376953,
            y: -289.7777404785156,
            z: 23.993846893310547
        }, {
            x: -88.16778564453125,
            y: -285.31695556640625,
            z: 28.647451400756836
        }, {
            x: -102.24845123291016,
            y: -280.0741271972656,
            z: 33.2225341796875
        }, {
            x: -116.04886627197266,
            y: -274.0636291503906,
            z: 37.70656204223633
        }, {
            x: -129.53118896484375,
            y: -267.3019714355469,
            z: 42.08723449707031
        }, {
            x: -285.31695556640625,
            y: 0,
            z: 92.7051010131836
        }, {
            x: -284.92596435546875,
            y: 15.700786590576172,
            z: 92.57805633544922
        }, {
            x: -260.6499938964844,
            y: 122.02099609375,
            z: 84.69032287597656
        }, {
            x: -254.21926879882812,
            y: 136.1971435546875,
            z: 82.6008529663086
        }, {
            x: -247.09173583984375,
            y: 150,
            z: 80.28497314453125
        }, {
            x: -239.2869415283203,
            y: 163.39170837402344,
            z: 77.74903869628906
        }, {
            x: -230.82627868652344,
            y: 176.3355712890625,
            z: 75
        }, {
            x: -221.73292541503906,
            y: 188.79611206054688,
            z: 72.04539489746094
        }, {
            x: -212.03182983398438,
            y: 200.7391815185547,
            z: 68.89331817626953
        }, {
            x: -201.7495574951172,
            y: 212.1320343017578,
            z: 65.55240631103516
        }, {
            x: -190.914306640625,
            y: 222.9434356689453,
            z: 62.03181838989258
        }, {
            x: -179.5557861328125,
            y: 233.143798828125,
            z: 58.341209411621094
        }, {
            x: -167.70509338378906,
            y: 242.70509338378906,
            z: 54.49068832397461
        }, {
            x: -155.39476013183594,
            y: 251.60116577148438,
            z: 50.490814208984375
        }, {
            x: -142.65847778320312,
            y: 259.8076171875,
            z: 46.3525505065918
        }, {
            x: -129.53118896484375,
            y: 267.3019714355469,
            z: 42.08723449707031
        }, {
            x: -116.04886627197266,
            y: 274.0636291503906,
            z: 37.70656204223633
        }, {
            x: -102.24845123291016,
            y: 280.0741271972656,
            z: 33.2225341796875
        }, {
            x: -88.16778564453125,
            y: 285.31695556640625,
            z: 28.647451400756836
        }, {
            x: -73.84546661376953,
            y: 289.7777404785156,
            z: 23.993846893310547
        }, {
            x: -59.32073211669922,
            y: 293.44427490234375,
            z: 19.27447509765625
        }, {
            x: -15.16579532623291,
            y: -299.5888671875,
            z: 4.063662528991699
        }, {
            x: -30.290023803710938,
            y: -298.3565673828125,
            z: 8.11618709564209
        }, {
            x: -45.33122634887695,
            y: -296.3065185546875,
            z: 12.146465301513672
        }, {
            x: -60.2481803894043,
            y: -293.44427490234375,
            z: 16.143451690673828
        }, {
            x: -75,
            y: -289.7777404785156,
            z: 20.096189498901367
        }, {
            x: -89.5462417602539,
            y: -285.31695556640625,
            z: 23.99384307861328
        }, {
            x: -103.84706115722656,
            y: -280.0741271972656,
            z: 27.825735092163086
        }, {
            x: -117.86322784423828,
            y: -274.0636291503906,
            z: 31.581357955932617
        }, {
            x: -289.380615234375,
            y: -15.700786590576172,
            z: 77.53929901123047
        }, {
            x: -289.7777404785156,
            y: 0,
            z: 77.64571380615234
        }, {
            x: -279.90380859375,
            y: 77.64571380615234,
            z: 75
        }, {
            x: -275.5950012207031,
            y: 92.7051010131836,
            z: 73.845458984375
        }, {
            x: -258.19384765625,
            y: 136.1971435546875,
            z: 69.1828384399414
        }, {
            x: -250.95489501953125,
            y: 150,
            z: 67.24315643310547
        }, {
            x: -243.02806091308594,
            y: 163.39170837402344,
            z: 65.11917877197266
        }, {
            x: -234.43511962890625,
            y: 176.3355712890625,
            z: 62.81669998168945
        }, {
            x: -225.19961547851562,
            y: 188.79611206054688,
            z: 60.3420524597168
        }, {
            x: -215.34683227539062,
            y: 200.7391815185547,
            z: 57.70201110839844
        }, {
            x: -204.90379333496094,
            y: 212.1320343017578,
            z: 54.90380859375
        }, {
            x: -193.89915466308594,
            y: 222.9434356689453,
            z: 51.95512008666992
        }, {
            x: -182.36305236816406,
            y: 233.143798828125,
            z: 48.86403274536133
        }, {
            x: -170.32708740234375,
            y: 242.70509338378906,
            z: 45.639007568359375
        }, {
            x: -157.8242645263672,
            y: 251.60116577148438,
            z: 42.28888702392578
        }, {
            x: -144.8888702392578,
            y: 259.8076171875,
            z: 38.82285690307617
        }, {
            x: -131.5563507080078,
            y: 267.3019714355469,
            z: 35.25041580200195
        }, {
            x: -117.86322784423828,
            y: 274.0636291503906,
            z: 31.581357955932617
        }, {
            x: -103.84706115722656,
            y: 280.0741271972656,
            z: 27.825735092163086
        }, {
            x: -89.5462417602539,
            y: 285.31695556640625,
            z: 23.99384307861328
        }, {
            x: -75,
            y: 289.7777404785156,
            z: 20.096189498901367
        }, {
            x: -60.2481803894043,
            y: 293.44427490234375,
            z: 16.143451690673828
        }, {
            x: -45.33122634887695,
            y: 296.3065185546875,
            z: 12.146465301513672
        }, {
            x: -15.357686996459961,
            y: -299.5888671875,
            z: 3.2643771171569824
        }, {
            x: -30.67327880859375,
            y: -298.3565673828125,
            z: 6.519806861877441
        }, {
            x: -45.90480041503906,
            y: -296.3065185546875,
            z: 9.757365226745605
        }, {
            x: -61.010498046875,
            y: -293.44427490234375,
            z: 12.968180656433105
        }, {
            x: -75.948974609375,
            y: -289.7777404785156,
            z: 16.143451690673828
        }, {
            x: -90.67927551269531,
            y: -285.31695556640625,
            z: 19.274473190307617
        }, {
            x: -105.16102600097656,
            y: -280.0741271972656,
            z: 22.352664947509766
        }, {
            x: -119.35454559326172,
            y: -274.0636291503906,
            z: 25.369590759277344
        }, {
            x: -293.0421447753906,
            y: -15.700786590576172,
            z: 62.28802490234375
        }, {
            x: -293.44427490234375,
            y: 0,
            z: 62.373504638671875
        }, {
            x: -293.0421447753906,
            y: 15.700786590576172,
            z: 62.28802490234375
        }, {
            x: -287.0318298339844,
            y: 62.373504638671875,
            z: 61.010498046875
        }, {
            x: -283.4454345703125,
            y: 77.64571380615234,
            z: 60.2481803894043
        }, {
            x: -279.08209228515625,
            y: 92.7051010131836,
            z: 59.32072830200195
        }, {
            x: -273.9538269042969,
            y: 107.51038360595703,
            z: 58.230682373046875
        }, {
            x: -268.07470703125,
            y: 122.02099609375,
            z: 56.98103332519531
        }, {
            x: -261.46075439453125,
            y: 136.1971435546875,
            z: 55.575199127197266
        }, {
            x: -254.1302032470703,
            y: 150,
            z: 54.01704025268555
        }, {
            x: -246.10308837890625,
            y: 163.39170837402344,
            z: 52.310821533203125
        }, {
            x: -237.4014129638672,
            y: 176.3355712890625,
            z: 50.46122360229492
        }, {
            x: -228.04904174804688,
            y: 188.79611206054688,
            z: 48.47332000732422
        }, {
            x: -218.0716094970703,
            y: 200.7391815185547,
            z: 46.35254669189453
        }, {
            x: -207.49644470214844,
            y: 212.1320343017578,
            z: 44.10472869873047
        }, {
            x: -196.35255432128906,
            y: 222.9434356689453,
            z: 41.73602294921875
        }, {
            x: -184.67047119140625,
            y: 233.143798828125,
            z: 39.2529182434082
        }, {
            x: -172.4822235107422,
            y: 242.70509338378906,
            z: 36.662227630615234
        }, {
            x: -159.8212127685547,
            y: 251.60116577148438,
            z: 33.971046447753906
        }, {
            x: -146.72213745117188,
            y: 259.8076171875,
            z: 31.186752319335938
        }, {
            x: -133.22091674804688,
            y: 267.3019714355469,
            z: 28.316978454589844
        }, {
            x: -119.35454559326172,
            y: 274.0636291503906,
            z: 25.369590759277344
        }, {
            x: -105.16102600097656,
            y: 280.0741271972656,
            z: 22.352664947509766
        }, {
            x: -90.67927551269531,
            y: 285.31695556640625,
            z: 19.274473190307617
        }, {
            x: -75.948974609375,
            y: 289.7777404785156,
            z: 16.143451690673828
        }, {
            x: -61.010498046875,
            y: 293.44427490234375,
            z: 12.968180656433105
        }, {
            x: -45.90480041503906,
            y: 296.3065185546875,
            z: 9.757365226745605
        }, {
            x: -15.507484436035156,
            y: -299.5888671875,
            z: 2.456144094467163
        }, {
            x: -30.972463607788086,
            y: -298.3565673828125,
            z: 4.9055562019348145
        }, {
            x: -46.3525505065918,
            y: -296.3065185546875,
            z: 7.341522216796875
        }, {
            x: -61.6055908203125,
            y: -293.44427490234375,
            z: 9.757365226745605
        }, {
            x: -76.68976593017578,
            y: -289.7777404785156,
            z: 12.146465301513672
        }, {
            x: -91.56375122070312,
            y: -285.31695556640625,
            z: 14.50227165222168
        }, {
            x: -106.18675994873047,
            y: -280.0741271972656,
            z: 16.818328857421875
        }, {
            x: -120.51871490478516,
            y: -274.0636291503906,
            z: 19.088289260864258
        }, {
            x: -134.5203399658203,
            y: -267.3019714355469,
            z: 21.30592918395996
        }, {
            x: -296.3065185546875,
            y: 0,
            z: 46.93033981323242
        }, {
            x: -295.9004211425781,
            y: 15.700786590576172,
            z: 46.866024017333984
        }, {
            x: -294.6833190917969,
            y: 31.358539581298828,
            z: 46.673248291015625
        }, {
            x: -292.6584777832031,
            y: 46.93033981323242,
            z: 46.35254669189453
        }, {
            x: -286.2101135253906,
            y: 77.64571380615234,
            z: 45.33122634887695
        }, {
            x: -281.8042297363281,
            y: 92.7051010131836,
            z: 44.63340759277344
        }, {
            x: -276.6259460449219,
            y: 107.51038360595703,
            z: 43.8132438659668
        }, {
            x: -270.689453125,
            y: 122.02099609375,
            z: 42.87299728393555
        }, {
            x: -264.0110168457031,
            y: 136.1971435546875,
            z: 41.81523513793945
        }, {
            x: -256.60894775390625,
            y: 150,
            z: 40.64286422729492
        }, {
            x: -248.50355529785156,
            y: 163.39170837402344,
            z: 39.359092712402344
        }, {
            x: -239.7169952392578,
            y: 176.3355712890625,
            z: 37.96744155883789
        }, {
            x: -230.27340698242188,
            y: 188.79611206054688,
            z: 36.47172546386719
        }, {
            x: -220.1986541748047,
            y: 200.7391815185547,
            z: 34.87603759765625
        }, {
            x: -209.5203399658203,
            y: 212.1320343017578,
            z: 33.18476104736328
        }, {
            x: -198.2677459716797,
            y: 222.9434356689453,
            z: 31.402524948120117
        }, {
            x: -186.4717254638672,
            y: 233.143798828125,
            z: 29.53421974182129
        }, {
            x: -174.1645965576172,
            y: 242.70509338378906,
            z: 27.5849609375
        }, {
            x: -161.38009643554688,
            y: 251.60116577148438,
            z: 25.560094833374023
        }, {
            x: -148.15325927734375,
            y: 259.8076171875,
            z: 23.46516990661621
        }, {
            x: -134.5203399658203,
            y: 267.3019714355469,
            z: 21.30592918395996
        }, {
            x: -120.51871490478516,
            y: 274.0636291503906,
            z: 19.088289260864258
        }, {
            x: -106.18675994873047,
            y: 280.0741271972656,
            z: 16.818328857421875
        }, {
            x: -91.56375122070312,
            y: 285.31695556640625,
            z: 14.50227165222168
        }, {
            x: -76.68976593017578,
            y: 289.7777404785156,
            z: 12.146465301513672
        }, {
            x: -61.6055908203125,
            y: 293.44427490234375,
            z: 9.757365226745605
        }, {
            x: -46.3525505065918,
            y: 296.3065185546875,
            z: 7.341522216796875
        }, {
            x: -15.614776611328125,
            y: -299.5888671875,
            z: 1.6411792039871216
        }, {
            x: -31.18675422668457,
            y: -298.3565673828125,
            z: 3.277859926223755
        }, {
            x: -46.67325210571289,
            y: -296.3065185546875,
            z: 4.9055562019348145
        }, {
            x: -62.03181838989258,
            y: -293.44427490234375,
            z: 6.519806861877441
        }, {
            x: -77.2203598022461,
            y: -289.7777404785156,
            z: 8.11618709564209
        }, {
            x: -92.19725036621094,
            y: -285.31695556640625,
            z: 9.690321922302246
        }, {
            x: -106.92143249511719,
            y: -280.0741271972656,
            z: 11.237895965576172
        }, {
            x: -121.35254669189453,
            y: -274.0636291503906,
            z: 12.754667282104492
        }, {
            x: -135.4510498046875,
            y: -267.3019714355469,
            z: 14.236478805541992
        }, {
            x: -297.94769287109375,
            y: 15.700786590576172,
            z: 31.315563201904297
        }, {
            x: -296.7221374511719,
            y: 31.358539581298828,
            z: 31.18675422668457
        }, {
            x: -291.8367614746094,
            y: 62.373504638671875,
            z: 30.67327880859375
        }, {
            x: -288.1903381347656,
            y: 77.64571380615234,
            z: 30.290023803710938
        }, {
            x: -283.75396728515625,
            y: 92.7051010131836,
            z: 29.82374382019043
        }, {
            x: -278.53985595703125,
            y: 107.51038360595703,
            z: 29.275718688964844
        }, {
            x: -272.5622863769531,
            y: 122.02099609375,
            z: 28.647451400756836
        }, {
            x: -265.837646484375,
            y: 136.1971435546875,
            z: 27.940662384033203
        }, {
            x: -258.3843688964844,
            y: 150,
            z: 27.15729331970215
        }, {
            x: -250.22288513183594,
            y: 163.39170837402344,
            z: 26.299484252929688
        }, {
            x: -241.37554931640625,
            y: 176.3355712890625,
            z: 25.369590759277344
        }, {
            x: -231.8666229248047,
            y: 188.79611206054688,
            z: 24.370162963867188
        }, {
            x: -221.72213745117188,
            y: 200.7391815185547,
            z: 23.303937911987305
        }, {
            x: -210.96995544433594,
            y: 212.1320343017578,
            z: 22.17383575439453
        }, {
            x: -199.63951110839844,
            y: 222.9434356689453,
            z: 20.982959747314453
        }, {
            x: -187.76187133789062,
            y: 233.143798828125,
            z: 19.734567642211914
        }, {
            x: -175.36959838867188,
            y: 242.70509338378906,
            z: 18.432086944580078
        }, {
            x: -162.49664306640625,
            y: 251.60116577148438,
            z: 17.079084396362305
        }, {
            x: -149.17828369140625,
            y: 259.8076171875,
            z: 15.679269790649414
        }, {
            x: -135.4510498046875,
            y: 267.3019714355469,
            z: 14.236478805541992
        }, {
            x: -121.35254669189453,
            y: 274.0636291503906,
            z: 12.754667282104492
        }, {
            x: -106.92143249511719,
            y: 280.0741271972656,
            z: 11.237895965576172
        }, {
            x: -92.19725036621094,
            y: 285.31695556640625,
            z: 9.690321922302246
        }, {
            x: -77.2203598022461,
            y: 289.7777404785156,
            z: 8.11618709564209
        }, {
            x: -62.03181838989258,
            y: 293.44427490234375,
            z: 6.519806861877441
        }, {
            x: -15.679269790649414,
            y: -299.5888671875,
            z: 0.8217157125473022
        }, {
            x: -31.315561294555664,
            y: -298.3565673828125,
            z: 1.6411792039871216
        }, {
            x: -46.866024017333984,
            y: -296.3065185546875,
            z: 2.456144094467163
        }, {
            x: -62.28802490234375,
            y: -293.44427490234375,
            z: 3.2643771171569824
        }, {
            x: -77.53929901123047,
            y: -289.7777404785156,
            z: 4.063662528991699
        }, {
            x: -92.57804107666016,
            y: -285.31695556640625,
            z: 4.851809978485107
        }, {
            x: -107.36304473876953,
            y: -280.0741271972656,
            z: 5.626658916473389
        }, {
            x: -121.85376739501953,
            y: -274.0636291503906,
            z: 6.386085510253906
        }, {
            x: -136.010498046875,
            y: -267.3019714355469,
            z: 7.128007888793945
        }, {
            x: -297.94769287109375,
            y: 31.358539581298828,
            z: 15.614775657653809
        }, {
            x: -279.6903076171875,
            y: 107.51038360595703,
            z: 14.657946586608887
        }, {
            x: -273.6880187988281,
            y: 122.02099609375,
            z: 14.343381881713867
        }, {
            x: -266.93560791015625,
            y: 136.1971435546875,
            z: 13.989503860473633
        }, {
            x: -259.4515686035156,
            y: 150,
            z: 13.59727954864502
        }, {
            x: -251.25636291503906,
            y: 163.39170837402344,
            z: 13.167787551879883
        }, {
            x: -242.37246704101562,
            y: 176.3355712890625,
            z: 12.702202796936035
        }, {
            x: -232.8242645263672,
            y: 188.79611206054688,
            z: 12.201802253723145
        }, {
            x: -222.63790893554688,
            y: 200.7391815185547,
            z: 11.66795825958252
        }, {
            x: -211.84130859375,
            y: 212.1320343017578,
            z: 11.102132797241211
        }, {
            x: -200.4640655517578,
            y: 222.9434356689453,
            z: 10.505876541137695
        }, {
            x: -188.53736877441406,
            y: 233.143798828125,
            z: 9.88082504272461
        }, {
            x: -176.09390258789062,
            y: 242.70509338378906,
            z: 9.228690147399902
        }, {
            x: -163.16778564453125,
            y: 251.60116577148438,
            z: 8.551260948181152
        }, {
            x: -149.79443359375,
            y: 259.8076171875,
            z: 7.850393295288086
        }, {
            x: -136.010498046875,
            y: 267.3019714355469,
            z: 7.128007888793945
        }, {
            x: -121.85376739501953,
            y: 274.0636291503906,
            z: 6.386085510253906
        }, {
            x: -107.36304473876953,
            y: 280.0741271972656,
            z: 5.626658916473389
        }, {
            x: -92.57804107666016,
            y: 285.31695556640625,
            z: 4.851809978485107
        }, {
            x: -77.53929901123047,
            y: 289.7777404785156,
            z: 4.063662528991699
        }, {
            x: -62.28802490234375,
            y: 293.44427490234375,
            z: 3.2643771171569824
        }, {
            x: -31.315561294555664,
            y: 298.3565673828125,
            z: 1.6411792039871216
        }, {
            x: -15.700786590576172,
            y: -299.5888671875,
            z: -2.884187631224124E-15
        }, {
            x: -31.358539581298828,
            y: -298.3565673828125,
            z: -5.760469903951524E-15
        }, {
            x: -46.93033981323242,
            y: -296.3065185546875,
            z: -8.620964117816814E-15
        }, {
            x: -62.373504638671875,
            y: -293.44427490234375,
            z: -1.1457826535970182E-14
        }, {
            x: -77.64571380615234,
            y: -289.7777404785156,
            z: -1.4263286054637045E-14
        }, {
            x: -92.7051010131836,
            y: -285.31695556640625,
            z: -1.7029649920590438E-14
        }, {
            x: -107.51038360595703,
            y: -280.0741271972656,
            z: -1.9749337188952436E-14
        }, {
            x: -122.02099609375,
            y: -274.0636291503906,
            z: -2.2414892275721306E-14
        }, {
            x: -293.44427490234375,
            y: 62.373504638671875,
            z: -5.390483795008477E-14
        }, {
            x: -289.7777404785156,
            y: 77.64571380615234,
            z: -5.3231307843614253E-14
        }, {
            x: -274.0636291503906,
            y: 122.02099609375,
            z: -5.034467038134843E-14
        }, {
            x: -267.3019714355469,
            y: 136.1971435546875,
            z: -4.910257110309936E-14
        }, {
            x: -259.8076171875,
            y: 150,
            z: -4.7725885065795157E-14
        }, {
            x: -251.60116577148438,
            y: 163.39170837402344,
            z: -4.6218383260117E-14
        }, {
            x: -242.70509338378906,
            y: 176.3355712890625,
            z: -4.458420259497928E-14
        }, {
            x: -233.143798828125,
            y: 188.79611206054688,
            z: -4.2827818792475283E-14
        }, {
            x: -222.9434356689453,
            y: 200.7391815185547,
            z: -4.095404299974542E-14
        }, {
            x: -212.1320343017578,
            y: 212.1320343017578,
            z: -3.896802178897721E-14
        }, {
            x: -200.7391815185547,
            y: 222.9434356689453,
            z: -3.687518633542844E-14
        }, {
            x: -188.79611206054688,
            y: 233.143798828125,
            z: -3.468128291061329E-14
        }, {
            x: -176.3355712890625,
            y: 242.70509338378906,
            z: -3.239231867219368E-14
        }, {
            x: -163.39170837402344,
            y: 251.60116577148438,
            z: -3.0014571828374664E-14
        }, {
            x: -150,
            y: 259.8076171875,
            z: -2.755455267438884E-14
        }, {
            x: -136.1971435546875,
            y: 267.3019714355469,
            z: -2.5019010368759927E-14
        }, {
            x: -122.02099609375,
            y: 274.0636291503906,
            z: -2.2414892275721306E-14
        }, {
            x: -107.51038360595703,
            y: 280.0741271972656,
            z: -1.9749337188952436E-14
        }, {
            x: -92.7051010131836,
            y: 285.31695556640625,
            z: -1.7029649920590438E-14
        }, {
            x: -77.64571380615234,
            y: 289.7777404785156,
            z: -1.4263286054637045E-14
        }, {
            x: -62.373504638671875,
            y: 293.44427490234375,
            z: -1.1457826535970182E-14
        }, {
            x: -31.358539581298828,
            y: 298.3565673828125,
            z: -5.760469903951524E-15
        }, {
            x: -15.679269790649414,
            y: -299.5888671875,
            z: -0.8217157125473022
        }, {
            x: -31.315561294555664,
            y: -298.3565673828125,
            z: -1.6411792039871216
        }, {
            x: -46.866024017333984,
            y: -296.3065185546875,
            z: -2.456144094467163
        }, {
            x: -62.28802490234375,
            y: -293.44427490234375,
            z: -3.2643771171569824
        }, {
            x: -77.53929901123047,
            y: -289.7777404785156,
            z: -4.063662528991699
        }, {
            x: -92.57804107666016,
            y: -285.31695556640625,
            z: -4.851809978485107
        }, {
            x: -107.36304473876953,
            y: -280.0741271972656,
            z: -5.626658916473389
        }, {
            x: -121.85376739501953,
            y: -274.0636291503906,
            z: -6.386085510253906
        }, {
            x: -266.93560791015625,
            y: 136.1971435546875,
            z: -13.989503860473633
        }, {
            x: -259.4515686035156,
            y: 150,
            z: -13.59727954864502
        }, {
            x: -251.25636291503906,
            y: 163.39170837402344,
            z: -13.167787551879883
        }, {
            x: -242.37246704101562,
            y: 176.3355712890625,
            z: -12.702202796936035
        }, {
            x: -232.8242645263672,
            y: 188.79611206054688,
            z: -12.201802253723145
        }, {
            x: -222.63790893554688,
            y: 200.7391815185547,
            z: -11.66795825958252
        }, {
            x: -211.84130859375,
            y: 212.1320343017578,
            z: -11.102132797241211
        }, {
            x: -200.4640655517578,
            y: 222.9434356689453,
            z: -10.505876541137695
        }, {
            x: -188.53736877441406,
            y: 233.143798828125,
            z: -9.88082504272461
        }, {
            x: -176.09390258789062,
            y: 242.70509338378906,
            z: -9.228690147399902
        }, {
            x: -163.16778564453125,
            y: 251.60116577148438,
            z: -8.551260948181152
        }, {
            x: -149.79443359375,
            y: 259.8076171875,
            z: -7.850393295288086
        }, {
            x: -136.010498046875,
            y: 267.3019714355469,
            z: -7.128007888793945
        }, {
            x: -121.85376739501953,
            y: 274.0636291503906,
            z: -6.386085510253906
        }, {
            x: -107.36304473876953,
            y: 280.0741271972656,
            z: -5.626658916473389
        }, {
            x: -92.57804107666016,
            y: 285.31695556640625,
            z: -4.851809978485107
        }, {
            x: -77.53929901123047,
            y: 289.7777404785156,
            z: -4.063662528991699
        }, {
            x: -62.28802490234375,
            y: 293.44427490234375,
            z: -3.2643771171569824
        }, {
            x: -31.315561294555664,
            y: 298.3565673828125,
            z: -1.6411792039871216
        }, {
            x: -15.614776611328125,
            y: -299.5888671875,
            z: -1.6411792039871216
        }, {
            x: -31.18675422668457,
            y: -298.3565673828125,
            z: -3.277859926223755
        }, {
            x: -46.67325210571289,
            y: -296.3065185546875,
            z: -4.9055562019348145
        }, {
            x: -62.03181838989258,
            y: -293.44427490234375,
            z: -6.519806861877441
        }, {
            x: -77.2203598022461,
            y: -289.7777404785156,
            z: -8.11618709564209
        }, {
            x: -92.19725036621094,
            y: -285.31695556640625,
            z: -9.690321922302246
        }, {
            x: -106.92143249511719,
            y: -280.0741271972656,
            z: -11.237895965576172
        }, {
            x: -121.35254669189453,
            y: -274.0636291503906,
            z: -12.754667282104492
        }, {
            x: -135.4510498046875,
            y: -267.3019714355469,
            z: -14.236478805541992
        }, {
            x: -272.5622863769531,
            y: 122.02099609375,
            z: -28.647451400756836
        }, {
            x: -265.837646484375,
            y: 136.1971435546875,
            z: -27.940662384033203
        }, {
            x: -258.3843688964844,
            y: 150,
            z: -27.15729331970215
        }, {
            x: -250.22288513183594,
            y: 163.39170837402344,
            z: -26.299484252929688
        }, {
            x: -241.37554931640625,
            y: 176.3355712890625,
            z: -25.369590759277344
        }, {
            x: -231.8666229248047,
            y: 188.79611206054688,
            z: -24.370162963867188
        }, {
            x: -221.72213745117188,
            y: 200.7391815185547,
            z: -23.303937911987305
        }, {
            x: -210.96995544433594,
            y: 212.1320343017578,
            z: -22.17383575439453
        }, {
            x: -199.63951110839844,
            y: 222.9434356689453,
            z: -20.982959747314453
        }, {
            x: -187.76187133789062,
            y: 233.143798828125,
            z: -19.734567642211914
        }, {
            x: -175.36959838867188,
            y: 242.70509338378906,
            z: -18.432086944580078
        }, {
            x: -162.49664306640625,
            y: 251.60116577148438,
            z: -17.079084396362305
        }, {
            x: -149.17828369140625,
            y: 259.8076171875,
            z: -15.679269790649414
        }, {
            x: -135.4510498046875,
            y: 267.3019714355469,
            z: -14.236478805541992
        }, {
            x: -121.35254669189453,
            y: 274.0636291503906,
            z: -12.754667282104492
        }, {
            x: -106.92143249511719,
            y: 280.0741271972656,
            z: -11.237895965576172
        }, {
            x: -92.19725036621094,
            y: 285.31695556640625,
            z: -9.690321922302246
        }, {
            x: -77.2203598022461,
            y: 289.7777404785156,
            z: -8.11618709564209
        }, {
            x: -62.03181838989258,
            y: 293.44427490234375,
            z: -6.519806861877441
        }, {
            x: -15.507484436035156,
            y: -299.5888671875,
            z: -2.456144094467163
        }, {
            x: -30.972463607788086,
            y: -298.3565673828125,
            z: -4.9055562019348145
        }, {
            x: -46.3525505065918,
            y: -296.3065185546875,
            z: -7.341522216796875
        }, {
            x: -61.6055908203125,
            y: -293.44427490234375,
            z: -9.757365226745605
        }, {
            x: -76.68976593017578,
            y: -289.7777404785156,
            z: -12.146465301513672
        }, {
            x: -91.56375122070312,
            y: -285.31695556640625,
            z: -14.50227165222168
        }, {
            x: -106.18675994873047,
            y: -280.0741271972656,
            z: -16.818328857421875
        }, {
            x: -120.51871490478516,
            y: -274.0636291503906,
            z: -19.088289260864258
        }, {
            x: -276.6259460449219,
            y: 107.51038360595703,
            z: -43.8132438659668
        }, {
            x: -270.689453125,
            y: 122.02099609375,
            z: -42.87299728393555
        }, {
            x: -264.0110168457031,
            y: 136.1971435546875,
            z: -41.81523513793945
        }, {
            x: -256.60894775390625,
            y: 150,
            z: -40.64286422729492
        }, {
            x: -248.50355529785156,
            y: 163.39170837402344,
            z: -39.359092712402344
        }, {
            x: -239.7169952392578,
            y: 176.3355712890625,
            z: -37.96744155883789
        }, {
            x: -230.27340698242188,
            y: 188.79611206054688,
            z: -36.47172546386719
        }, {
            x: -220.1986541748047,
            y: 200.7391815185547,
            z: -34.87603759765625
        }, {
            x: -209.5203399658203,
            y: 212.1320343017578,
            z: -33.18476104736328
        }, {
            x: -198.2677459716797,
            y: 222.9434356689453,
            z: -31.402524948120117
        }, {
            x: -186.4717254638672,
            y: 233.143798828125,
            z: -29.53421974182129
        }, {
            x: -174.1645965576172,
            y: 242.70509338378906,
            z: -27.5849609375
        }, {
            x: -161.38009643554688,
            y: 251.60116577148438,
            z: -25.560094833374023
        }, {
            x: -148.15325927734375,
            y: 259.8076171875,
            z: -23.46516990661621
        }, {
            x: -134.5203399658203,
            y: 267.3019714355469,
            z: -21.30592918395996
        }, {
            x: -120.51871490478516,
            y: 274.0636291503906,
            z: -19.088289260864258
        }, {
            x: -106.18675994873047,
            y: 280.0741271972656,
            z: -16.818328857421875
        }, {
            x: -91.56375122070312,
            y: 285.31695556640625,
            z: -14.50227165222168
        }, {
            x: -76.68976593017578,
            y: 289.7777404785156,
            z: -12.146465301513672
        }, {
            x: -15.357686996459961,
            y: -299.5888671875,
            z: -3.2643771171569824
        }, {
            x: -30.67327880859375,
            y: -298.3565673828125,
            z: -6.519806861877441
        }, {
            x: -45.90480041503906,
            y: -296.3065185546875,
            z: -9.757365226745605
        }, {
            x: -61.010498046875,
            y: -293.44427490234375,
            z: -12.968180656433105
        }, {
            x: -75.948974609375,
            y: -289.7777404785156,
            z: -16.143451690673828
        }, {
            x: -90.67927551269531,
            y: -285.31695556640625,
            z: -19.274473190307617
        }, {
            x: -105.16102600097656,
            y: -280.0741271972656,
            z: -22.352664947509766
        }, {
            x: -119.35454559326172,
            y: -274.0636291503906,
            z: -25.369590759277344
        }, {
            x: -289.83148193359375,
            y: 46.93033981323242,
            z: -61.60558319091797
        }, {
            x: -287.0318298339844,
            y: 62.373504638671875,
            z: -61.010498046875
        }, {
            x: -273.9538269042969,
            y: 107.51038360595703,
            z: -58.230682373046875
        }, {
            x: -268.07470703125,
            y: 122.02099609375,
            z: -56.98103332519531
        }, {
            x: -261.46075439453125,
            y: 136.1971435546875,
            z: -55.575199127197266
        }, {
            x: -254.1302032470703,
            y: 150,
            z: -54.01704025268555
        }, {
            x: -246.10308837890625,
            y: 163.39170837402344,
            z: -52.310821533203125
        }, {
            x: -237.4014129638672,
            y: 176.3355712890625,
            z: -50.46122360229492
        }, {
            x: -228.04904174804688,
            y: 188.79611206054688,
            z: -48.47332000732422
        }, {
            x: -218.0716094970703,
            y: 200.7391815185547,
            z: -46.35254669189453
        }, {
            x: -207.49644470214844,
            y: 212.1320343017578,
            z: -44.10472869873047
        }, {
            x: -196.35255432128906,
            y: 222.9434356689453,
            z: -41.73602294921875
        }, {
            x: -184.67047119140625,
            y: 233.143798828125,
            z: -39.2529182434082
        }, {
            x: -172.4822235107422,
            y: 242.70509338378906,
            z: -36.662227630615234
        }, {
            x: -159.8212127685547,
            y: 251.60116577148438,
            z: -33.971046447753906
        }, {
            x: -146.72213745117188,
            y: 259.8076171875,
            z: -31.186752319335938
        }, {
            x: -133.22091674804688,
            y: 267.3019714355469,
            z: -28.316978454589844
        }, {
            x: -119.35454559326172,
            y: 274.0636291503906,
            z: -25.369590759277344
        }, {
            x: -105.16102600097656,
            y: 280.0741271972656,
            z: -22.352664947509766
        }, {
            x: -90.67927551269531,
            y: 285.31695556640625,
            z: -19.274473190307617
        }, {
            x: -75.948974609375,
            y: 289.7777404785156,
            z: -16.143451690673828
        }, {
            x: -15.16579532623291,
            y: -299.5888671875,
            z: -4.063662528991699
        }, {
            x: -30.290023803710938,
            y: -298.3565673828125,
            z: -8.11618709564209
        }, {
            x: -45.33122634887695,
            y: -296.3065185546875,
            z: -12.146465301513672
        }, {
            x: -60.2481803894043,
            y: -293.44427490234375,
            z: -16.143451690673828
        }, {
            x: -75,
            y: -289.7777404785156,
            z: -20.096189498901367
        }, {
            x: -89.5462417602539,
            y: -285.31695556640625,
            z: -23.99384307861328
        }, {
            x: -103.84706115722656,
            y: -280.0741271972656,
            z: -27.825735092163086
        }, {
            x: -117.86322784423828,
            y: -274.0636291503906,
            z: -31.581357955932617
        }, {
            x: -283.4454040527344,
            y: 62.373504638671875,
            z: -75.94896697998047
        }, {
            x: -279.90380859375,
            y: 77.64571380615234,
            z: -75
        }, {
            x: -275.5950012207031,
            y: 92.7051010131836,
            z: -73.845458984375
        }, {
            x: -270.53082275390625,
            y: 107.51038360595703,
            z: -72.48851776123047
        }, {
            x: -264.7251281738281,
            y: 122.02099609375,
            z: -70.93289184570312
        }, {
            x: -258.19384765625,
            y: 136.1971435546875,
            z: -69.1828384399414
        }, {
            x: -250.95489501953125,
            y: 150,
            z: -67.24315643310547
        }, {
            x: -243.02806091308594,
            y: 163.39170837402344,
            z: -65.11917877197266
        }, {
            x: -234.43511962890625,
            y: 176.3355712890625,
            z: -62.81669998168945
        }, {
            x: -225.19961547851562,
            y: 188.79611206054688,
            z: -60.3420524597168
        }, {
            x: -215.34683227539062,
            y: 200.7391815185547,
            z: -57.70201110839844
        }, {
            x: -204.90379333496094,
            y: 212.1320343017578,
            z: -54.90380859375
        }, {
            x: -193.89915466308594,
            y: 222.9434356689453,
            z: -51.95512008666992
        }, {
            x: -182.36305236816406,
            y: 233.143798828125,
            z: -48.86403274536133
        }, {
            x: -170.32708740234375,
            y: 242.70509338378906,
            z: -45.639007568359375
        }, {
            x: -157.8242645263672,
            y: 251.60116577148438,
            z: -42.28888702392578
        }, {
            x: -144.8888702392578,
            y: 259.8076171875,
            z: -38.82285690307617
        }, {
            x: -131.5563507080078,
            y: 267.3019714355469,
            z: -35.25041580200195
        }, {
            x: -117.86322784423828,
            y: 274.0636291503906,
            z: -31.581357955932617
        }, {
            x: -103.84706115722656,
            y: 280.0741271972656,
            z: -27.825735092163086
        }, {
            x: -89.5462417602539,
            y: 285.31695556640625,
            z: -23.99384307861328
        }, {
            x: -75,
            y: 289.7777404785156,
            z: -20.096189498901367
        }, {
            x: -14.93233585357666,
            y: -299.5888671875,
            z: -4.851809978485107
        }, {
            x: -29.82374382019043,
            y: -298.3565673828125,
            z: -9.690321922302246
        }, {
            x: -44.63340759277344,
            y: -296.3065185546875,
            z: -14.502272605895996
        }, {
            x: -59.32073211669922,
            y: -293.44427490234375,
            z: -19.27447509765625
        }, {
            x: -73.84546661376953,
            y: -289.7777404785156,
            z: -23.993846893310547
        }, {
            x: -88.16778564453125,
            y: -285.31695556640625,
            z: -28.647451400756836
        }, {
            x: -102.24845123291016,
            y: -280.0741271972656,
            z: -33.2225341796875
        }, {
            x: -116.04886627197266,
            y: -274.0636291503906,
            z: -37.70656204223633
        }, {
            x: -275.59503173828125,
            y: 77.64571380615234,
            z: -89.54625701904297
        }, {
            x: -271.3525695800781,
            y: 92.7051010131836,
            z: -88.16778564453125
        }, {
            x: -266.3663330078125,
            y: 107.51038360595703,
            z: -86.54766845703125
        }, {
            x: -260.6499938964844,
            y: 122.02099609375,
            z: -84.69032287597656
        }, {
            x: -254.21926879882812,
            y: 136.1971435546875,
            z: -82.6008529663086
        }, {
            x: -247.09173583984375,
            y: 150,
            z: -80.28497314453125
        }, {
            x: -239.2869415283203,
            y: 163.39170837402344,
            z: -77.74903869628906
        }, {
            x: -230.82627868652344,
            y: 176.3355712890625,
            z: -75
        }, {
            x: -221.73292541503906,
            y: 188.79611206054688,
            z: -72.04539489746094
        }, {
            x: -212.03182983398438,
            y: 200.7391815185547,
            z: -68.89331817626953
        }, {
            x: -201.7495574951172,
            y: 212.1320343017578,
            z: -65.55240631103516
        }, {
            x: -190.914306640625,
            y: 222.9434356689453,
            z: -62.03181838989258
        }, {
            x: -179.5557861328125,
            y: 233.143798828125,
            z: -58.341209411621094
        }, {
            x: -167.70509338378906,
            y: 242.70509338378906,
            z: -54.49068832397461
        }, {
            x: -155.39476013183594,
            y: 251.60116577148438,
            z: -50.490814208984375
        }, {
            x: -142.65847778320312,
            y: 259.8076171875,
            z: -46.3525505065918
        }, {
            x: -129.53118896484375,
            y: 267.3019714355469,
            z: -42.08723449707031
        }, {
            x: -116.04886627197266,
            y: 274.0636291503906,
            z: -37.70656204223633
        }, {
            x: -102.24845123291016,
            y: 280.0741271972656,
            z: -33.2225341796875
        }, {
            x: -88.16778564453125,
            y: 285.31695556640625,
            z: -28.647451400756836
        }, {
            x: -73.84546661376953,
            y: 289.7777404785156,
            z: -23.993846893310547
        }, {
            x: -14.657946586608887,
            y: -299.5888671875,
            z: -5.626658916473389
        }, {
            x: -29.27571678161621,
            y: -298.3565673828125,
            z: -11.237895965576172
        }, {
            x: -43.8132438659668,
            y: -296.3065185546875,
            z: -16.818330764770508
        }, {
            x: -58.230682373046875,
            y: -293.44427490234375,
            z: -22.352664947509766
        }, {
            x: -72.48851776123047,
            y: -289.7777404785156,
            z: -27.825735092163086
        }, {
            x: -86.54766082763672,
            y: -285.31695556640625,
            z: -33.2225341796875
        }, {
            x: -100.36958312988281,
            y: -280.0741271972656,
            z: -38.52827453613281
        }, {
            x: -113.9164047241211,
            y: -274.0636291503906,
            z: -43.72841262817383
        }, {
            x: -255.86044311523438,
            y: 122.02099609375,
            z: -98.21562957763672
        }, {
            x: -249.54786682128906,
            y: 136.1971435546875,
            z: -95.7924575805664
        }, {
            x: -242.55130004882812,
            y: 150,
            z: -93.10672760009766
        }, {
            x: -234.88990783691406,
            y: 163.39170837402344,
            z: -90.16580200195312
        }, {
            x: -226.584716796875,
            y: 176.3355712890625,
            z: -86.97772979736328
        }, {
            x: -217.65847778320312,
            y: 188.79611206054688,
            z: -83.55125427246094
        }, {
            x: -208.13563537597656,
            y: 200.7391815185547,
            z: -79.89578247070312
        }, {
            x: -198.0423126220703,
            y: 212.1320343017578,
            z: -76.02132415771484
        }, {
            x: -187.40615844726562,
            y: 222.9434356689453,
            z: -71.93849182128906
        }, {
            x: -176.25636291503906,
            y: 233.143798828125,
            z: -67.65847778320312
        }, {
            x: -164.62344360351562,
            y: 242.70509338378906,
            z: -63.19301986694336
        }, {
            x: -152.539306640625,
            y: 251.60116577148438,
            z: -58.554351806640625
        }, {
            x: -140.0370635986328,
            y: 259.8076171875,
            z: -53.755191802978516
        }, {
            x: -127.15098571777344,
            y: 267.3019714355469,
            z: -48.808692932128906
        }, {
            x: -113.9164047241211,
            y: 274.0636291503906,
            z: -43.72841262817383
        }, {
            x: -100.36958312988281,
            y: 280.0741271972656,
            z: -38.52827453613281
        }, {
            x: -86.54766082763672,
            y: 285.31695556640625,
            z: -33.2225341796875
        }, {
            x: -72.48851776123047,
            y: 289.7777404785156,
            z: -27.825735092163086
        }, {
            x: -14.343381881713867,
            y: -299.5888671875,
            z: -6.386085510253906
        }, {
            x: -28.647449493408203,
            y: -298.3565673828125,
            z: -12.754667282104492
        }, {
            x: -42.87299728393555,
            y: -296.3065185546875,
            z: -19.088289260864258
        }, {
            x: -56.98103332519531,
            y: -293.44427490234375,
            z: -25.369590759277344
        }, {
            x: -70.9328842163086,
            y: -289.7777404785156,
            z: -31.581357955932617
        }, {
            x: -84.69032287597656,
            y: -285.31695556640625,
            z: -37.70656204223633
        }, {
            x: -98.21562194824219,
            y: -280.0741271972656,
            z: -43.72841262817383
        }, {
            x: -111.47171783447266,
            y: -274.0636291503906,
            z: -49.630409240722656
        }, {
            x: -244.19247436523438,
            y: 136.1971435546875,
            z: -108.72150421142578
        }, {
            x: -237.3460693359375,
            y: 150,
            z: -105.67327880859375
        }, {
            x: -229.84909057617188,
            y: 163.39170837402344,
            z: -102.33541107177734
        }, {
            x: -221.7221221923828,
            y: 176.3355712890625,
            z: -98.71705627441406
        }, {
            x: -212.98744201660156,
            y: 188.79611206054688,
            z: -94.828125
        }, {
            x: -203.66896057128906,
            y: 200.7391815185547,
            z: -90.67927551269531
        }, {
            x: -193.79225158691406,
            y: 212.1320343017578,
            z: -86.28187561035156
        }, {
            x: -183.38436889648438,
            y: 222.9434356689453,
            z: -81.64797973632812
        }, {
            x: -172.4738311767578,
            y: 233.143798828125,
            z: -76.7903060913086
        }, {
            x: -161.09056091308594,
            y: 242.70509338378906,
            z: -71.72213745117188
        }, {
            x: -149.2657470703125,
            y: 251.60116577148438,
            z: -66.4573974609375
        }, {
            x: -137.0318145751953,
            y: 259.8076171875,
            z: -61.010498046875
        }, {
            x: -124.42228698730469,
            y: 267.3019714355469,
            z: -55.3963737487793
        }, {
            x: -111.47171783447266,
            y: 274.0636291503906,
            z: -49.630409240722656
        }, {
            x: -98.21562194824219,
            y: 280.0741271972656,
            z: -43.72841262817383
        }, {
            x: -84.69032287597656,
            y: 285.31695556640625,
            z: -37.70656204223633
        }, {
            x: -70.9328842163086,
            y: 289.7777404785156,
            z: -31.581357955932617
        }, {
            x: -13.989503860473633,
            y: -299.5888671875,
            z: -7.128007888793945
        }, {
            x: -27.940662384033203,
            y: -298.3565673828125,
            z: -14.236477851867676
        }, {
            x: -41.81523895263672,
            y: -296.3065185546875,
            z: -21.30592918395996
        }, {
            x: -55.575199127197266,
            y: -293.44427490234375,
            z: -28.316978454589844
        }, {
            x: -69.1828384399414,
            y: -289.7777404785156,
            z: -35.25041580200195
        }, {
            x: -82.60084533691406,
            y: -285.31695556640625,
            z: -42.08723449707031
        }, {
            x: -95.7924575805664,
            y: -280.0741271972656,
            z: -48.808692932128906
        }, {
            x: -108.72150421142578,
            y: -274.0636291503906,
            z: -55.39636993408203
        }, {
            x: -231.4902801513672,
            y: 150,
            z: -117.95018768310547
        }, {
            x: -224.17828369140625,
            y: 163.39170837402344,
            z: -114.22453308105469
        }, {
            x: -216.2518310546875,
            y: 176.3355712890625,
            z: -110.18580627441406
        }, {
            x: -207.73263549804688,
            y: 188.79611206054688,
            z: -105.84506225585938
        }, {
            x: -198.64405822753906,
            y: 200.7391815185547,
            z: -101.21420288085938
        }, {
            x: -189.0110321044922,
            y: 212.1320343017578,
            z: -96.30592346191406
        }, {
            x: -178.85992431640625,
            y: 222.9434356689453,
            z: -91.13367462158203
        }, {
            x: -168.21856689453125,
            y: 233.143798828125,
            z: -85.71163940429688
        }, {
            x: -157.11614990234375,
            y: 242.70509338378906,
            z: -80.05467987060547
        }, {
            x: -145.5830841064453,
            y: 251.60116577148438,
            z: -74.17828369140625
        }, {
            x: -133.65098571777344,
            y: 259.8076171875,
            z: -68.09857177734375
        }, {
            x: -121.35254669189453,
            y: 267.3019714355469,
            z: -61.832210540771484
        }, {
            x: -108.72150421142578,
            y: 274.0636291503906,
            z: -55.39636993408203
        }, {
            x: -95.7924575805664,
            y: 280.0741271972656,
            z: -48.808692932128906
        }, {
            x: -82.60084533691406,
            y: 285.31695556640625,
            z: -42.08723449707031
        }, {
            x: -13.59727954864502,
            y: -299.5888671875,
            z: -7.850393295288086
        }, {
            x: -27.157289505004883,
            y: -298.3565673828125,
            z: -15.679269790649414
        }, {
            x: -40.64286422729492,
            y: -296.3065185546875,
            z: -23.46516990661621
        }, {
            x: -54.01704025268555,
            y: -293.44427490234375,
            z: -31.186752319335938
        }, {
            x: -67.24315643310547,
            y: -289.7777404785156,
            z: -38.82285690307617
        }, {
            x: -80.28497314453125,
            y: -285.31695556640625,
            z: -46.3525505065918
        }, {
            x: -93.10672760009766,
            y: -280.0741271972656,
            z: -53.755191802978516
        }, {
            x: -105.67327880859375,
            y: -274.0636291503906,
            z: -61.010498046875
        }, {
            x: -225,
            y: 150,
            z: -129.90380859375
        }, {
            x: -217.89300537109375,
            y: 163.39170837402344,
            z: -125.80058288574219
        }, {
            x: -210.1887664794922,
            y: 176.3355712890625,
            z: -121.35254669189453
        }, {
            x: -201.90843200683594,
            y: 188.79611206054688,
            z: -116.5718994140625
        }, {
            x: -193.07469177246094,
            y: 200.7391815185547,
            z: -111.47171783447266
        }, {
            x: -183.7117156982422,
            y: 212.1320343017578,
            z: -106.0660171508789
        }, {
            x: -173.84523010253906,
            y: 222.9434356689453,
            z: -100.36959075927734
        }, {
            x: -163.50222778320312,
            y: 233.143798828125,
            z: -94.39805603027344
        }, {
            x: -152.71109008789062,
            y: 242.70509338378906,
            z: -88.16778564453125
        }, {
            x: -141.50137329101562,
            y: 251.60116577148438,
            z: -81.69585418701172
        }, {
            x: -129.90380859375,
            y: 259.8076171875,
            z: -75
        }, {
            x: -117.95018768310547,
            y: 267.3019714355469,
            z: -68.09857177734375
        }, {
            x: -105.67327880859375,
            y: 274.0636291503906,
            z: -61.010498046875
        }, {
            x: -93.10672760009766,
            y: 280.0741271972656,
            z: -53.755191802978516
        }, {
            x: -80.28497314453125,
            y: 285.31695556640625,
            z: -46.3525505065918
        }, {
            x: -27.157289505004883,
            y: 298.3565673828125,
            z: -15.679269790649414
        }, {
            x: -13.167787551879883,
            y: -299.5888671875,
            z: -8.551261901855469
        }, {
            x: -26.299484252929688,
            y: -298.3565673828125,
            z: -17.079084396362305
        }, {
            x: -39.359092712402344,
            y: -296.3065185546875,
            z: -25.560094833374023
        }, {
            x: -52.310821533203125,
            y: -293.44427490234375,
            z: -33.97105026245117
        }, {
            x: -65.11917877197266,
            y: -289.7777404785156,
            z: -42.28888702392578
        }, {
            x: -77.74903106689453,
            y: -285.31695556640625,
            z: -50.49081802368164
        }, {
            x: -90.1657943725586,
            y: -280.0741271972656,
            z: -58.554351806640625
        }, {
            x: -102.33541107177734,
            y: -274.0636291503906,
            z: -66.4573974609375
        }, {
            x: -217.89300537109375,
            y: 150,
            z: -141.50137329101562
        }, {
            x: -211.010498046875,
            y: 163.39170837402344,
            z: -137.03182983398438
        }, {
            x: -203.54962158203125,
            y: 176.3355712890625,
            z: -132.18667602539062
        }, {
            x: -195.5308380126953,
            y: 188.79611206054688,
            z: -126.97920989990234
        }, {
            x: -186.97610473632812,
            y: 200.7391815185547,
            z: -121.4237060546875
        }, {
            x: -177.9088897705078,
            y: 212.1320343017578,
            z: -115.53539276123047
        }, {
            x: -168.35403442382812,
            y: 222.9434356689453,
            z: -109.33039855957031
        }, {
            x: -158.33773803710938,
            y: 233.143798828125,
            z: -102.82573699951172
        }, {
            x: -147.887451171875,
            y: 242.70509338378906,
            z: -96.03923797607422
        }, {
            x: -137.0318145751953,
            y: 251.60116577148438,
            z: -88.98950958251953
        }, {
            x: -125.80058288574219,
            y: 259.8076171875,
            z: -81.69585418701172
        }, {
            x: -114.22453308105469,
            y: 267.3019714355469,
            z: -74.17828369140625
        }, {
            x: -102.33541107177734,
            y: 274.0636291503906,
            z: -66.4573974609375
        }, {
            x: -90.1657943725586,
            y: 280.0741271972656,
            z: -58.554351806640625
        }, {
            x: -77.74903106689453,
            y: 285.31695556640625,
            z: -50.49081802368164
        }, {
            x: -52.310821533203125,
            y: 293.44427490234375,
            z: -33.97105026245117
        }, {
            x: -26.299484252929688,
            y: 298.3565673828125,
            z: -17.079084396362305
        }, {
            x: -12.702202796936035,
            y: -299.5888671875,
            z: -9.228691101074219
        }, {
            x: -25.369590759277344,
            y: -298.3565673828125,
            z: -18.432086944580078
        }, {
            x: -37.96744155883789,
            y: -296.3065185546875,
            z: -27.5849609375
        }, {
            x: -50.46123123168945,
            y: -293.44427490234375,
            z: -36.662227630615234
        }, {
            x: -62.81669998168945,
            y: -289.7777404785156,
            z: -45.639007568359375
        }, {
            x: -75,
            y: -285.31695556640625,
            z: -54.49068832397461
        }, {
            x: -86.97772979736328,
            y: -280.0741271972656,
            z: -63.19301986694336
        }, {
            x: -98.71705627441406,
            y: -274.0636291503906,
            z: -71.72213745117188
        }, {
            x: -230.82627868652344,
            y: -92.7051010131836,
            z: -167.70509338378906
        }, {
            x: -221.72213745117188,
            y: 122.02099609375,
            z: -161.09056091308594
        }, {
            x: -216.2518310546875,
            y: 136.1971435546875,
            z: -157.11614990234375
        }, {
            x: -210.18878173828125,
            y: 150,
            z: -152.71109008789062
        }, {
            x: -203.54962158203125,
            y: 163.39170837402344,
            z: -147.887451171875
        }, {
            x: -196.35255432128906,
            y: 176.3355712890625,
            z: -142.65847778320312
        }, {
            x: -188.61727905273438,
            y: 188.79611206054688,
            z: -137.03848266601562
        }, {
            x: -180.3650360107422,
            y: 200.7391815185547,
            z: -131.04287719726562
        }, {
            x: -171.61842346191406,
            y: 212.1320343017578,
            z: -124.68807983398438
        }, {
            x: -162.4014129638672,
            y: 222.9434356689453,
            z: -117.99153137207031
        }, {
            x: -152.73927307128906,
            y: 233.143798828125,
            z: -110.97157287597656
        }, {
            x: -142.65847778320312,
            y: 242.70509338378906,
            z: -103.64745330810547
        }, {
            x: -132.18667602539062,
            y: 251.60116577148438,
            z: -96.03923797607422
        }, {
            x: -121.35254669189453,
            y: 259.8076171875,
            z: -88.16778564453125
        }, {
            x: -110.18580627441406,
            y: 267.3019714355469,
            z: -80.05467987060547
        }, {
            x: -98.71705627441406,
            y: 274.0636291503906,
            z: -71.72213745117188
        }, {
            x: -86.97772979736328,
            y: 280.0741271972656,
            z: -63.19301986694336
        }, {
            x: -50.46123123168945,
            y: 293.44427490234375,
            z: -36.662227630615234
        }, {
            x: -25.369590759277344,
            y: 298.3565673828125,
            z: -18.432086944580078
        }, {
            x: -12.201803207397461,
            y: -299.5888671875,
            z: -9.88082504272461
        }, {
            x: -24.370162963867188,
            y: -298.3565673828125,
            z: -19.734567642211914
        }, {
            x: -36.47172546386719,
            y: -296.3065185546875,
            z: -29.53421974182129
        }, {
            x: -48.47332000732422,
            y: -293.44427490234375,
            z: -39.2529182434082
        }, {
            x: -60.3420524597168,
            y: -289.7777404785156,
            z: -48.86403274536133
        }, {
            x: -72.04539489746094,
            y: -285.31695556640625,
            z: -58.34120559692383
        }, {
            x: -83.55126953125,
            y: -280.0741271972656,
            z: -67.65847778320312
        }, {
            x: -94.828125,
            y: -274.0636291503906,
            z: -76.79029083251953
        }, {
            x: -105.84506225585938,
            y: -267.3019714355469,
            z: -85.71163940429688
        }, {
            x: -225.19961547851562,
            y: 77.64571380615234,
            z: -182.36305236816406
        }, {
            x: -217.6584930419922,
            y: 107.51038360595703,
            z: -176.25636291503906
        }, {
            x: -212.98745727539062,
            y: 122.02099609375,
            z: -172.4738311767578
        }, {
            x: -207.73263549804688,
            y: 136.1971435546875,
            z: -168.21856689453125
        }, {
            x: -201.908447265625,
            y: 150,
            z: -163.5022430419922
        }, {
            x: -195.5308380126953,
            y: 163.39170837402344,
            z: -158.33773803710938
        }, {
            x: -188.61727905273438,
            y: 176.3355712890625,
            z: -152.73927307128906
        }, {
            x: -181.18675231933594,
            y: 188.79611206054688,
            z: -146.72213745117188
        }, {
            x: -173.2595977783203,
            y: 200.7391815185547,
            z: -140.3028564453125
        }, {
            x: -164.85755920410156,
            y: 212.1320343017578,
            z: -133.49900817871094
        }, {
            x: -156.00364685058594,
            y: 222.9434356689453,
            z: -126.32925415039062
        }, {
            x: -146.72213745117188,
            y: 233.143798828125,
            z: -118.81324005126953
        }, {
            x: -137.03848266601562,
            y: 242.70509338378906,
            z: -110.97157287597656
        }, {
            x: -126.97920989990234,
            y: 251.60116577148438,
            z: -102.82573699951172
        }, {
            x: -116.5718994140625,
            y: 259.8076171875,
            z: -94.39805603027344
        }, {
            x: -105.84506225585938,
            y: 267.3019714355469,
            z: -85.71163940429688
        }, {
            x: -94.828125,
            y: 274.0636291503906,
            z: -76.79029083251953
        }, {
            x: -83.55126953125,
            y: 280.0741271972656,
            z: -67.65847778320312
        }, {
            x: -72.04539489746094,
            y: 285.31695556640625,
            z: -58.34120559692383
        }, {
            x: -60.3420524597168,
            y: 289.7777404785156,
            z: -48.86403274536133
        }, {
            x: -24.370162963867188,
            y: 298.3565673828125,
            z: -19.734567642211914
        }, {
            x: -11.66795825958252,
            y: -299.5888671875,
            z: -10.505877494812012
        }, {
            x: -23.30393409729004,
            y: -298.3565673828125,
            z: -20.982959747314453
        }, {
            x: -34.87603759765625,
            y: -296.3065185546875,
            z: -31.40252685546875
        }, {
            x: -46.3525505065918,
            y: -293.44427490234375,
            z: -41.73602294921875
        }, {
            x: -57.70201110839844,
            y: -289.7777404785156,
            z: -51.95512771606445
        }, {
            x: -68.893310546875,
            y: -285.31695556640625,
            z: -62.03181838989258
        }, {
            x: -79.89578247070312,
            y: -280.0741271972656,
            z: -71.93849182128906
        }, {
            x: -90.67926025390625,
            y: -274.0636291503906,
            z: -81.64797973632812
        }, {
            x: -218.0715789794922,
            y: 62.373504638671875,
            z: -196.35255432128906
        }, {
            x: -215.34683227539062,
            y: 77.64571380615234,
            z: -193.89915466308594
        }, {
            x: -212.03179931640625,
            y: 92.7051010131836,
            z: -190.914306640625
        }, {
            x: -208.13563537597656,
            y: 107.51038360595703,
            z: -187.4061737060547
        }, {
            x: -203.66896057128906,
            y: 122.02099609375,
            z: -183.38436889648438
        }, {
            x: -198.64405822753906,
            y: 136.1971435546875,
            z: -178.85992431640625
        }, {
            x: -186.97610473632812,
            y: 163.39170837402344,
            z: -168.3540496826172
        }, {
            x: -180.3650360107422,
            y: 176.3355712890625,
            z: -162.4014129638672
        }, {
            x: -173.2595977783203,
            y: 188.79611206054688,
            z: -156.00364685058594
        }, {
            x: -149.17828369140625,
            y: 222.9434356689453,
            z: -134.32073974609375
        }, {
            x: -140.3028564453125,
            y: 233.143798828125,
            z: -126.32926177978516
        }, {
            x: -131.04287719726562,
            y: 242.70509338378906,
            z: -117.99153900146484
        }, {
            x: -121.42369842529297,
            y: 251.60116577148438,
            z: -109.33039855957031
        }, {
            x: -111.47171783447266,
            y: 259.8076171875,
            z: -100.36959075927734
        }, {
            x: -101.21420288085938,
            y: 267.3019714355469,
            z: -91.13368225097656
        }, {
            x: -90.67926025390625,
            y: 274.0636291503906,
            z: -81.64797973632812
        }, {
            x: -79.89578247070312,
            y: 280.0741271972656,
            z: -71.93849182128906
        }, {
            x: -23.30393409729004,
            y: 298.3565673828125,
            z: -20.982959747314453
        }, {
            x: -11.102132797241211,
            y: -299.5888671875,
            z: -11.102132797241211
        }, {
            x: -22.17383575439453,
            y: -298.3565673828125,
            z: -22.17383575439453
        }, {
            x: -33.18476104736328,
            y: -296.3065185546875,
            z: -33.18476104736328
        }, {
            x: -44.10472869873047,
            y: -293.44427490234375,
            z: -44.10472869873047
        }, {
            x: -54.90380859375,
            y: -289.7777404785156,
            z: -54.90380859375
        }, {
            x: -65.55239868164062,
            y: -285.31695556640625,
            z: -65.55239868164062
        }, {
            x: -76.02132415771484,
            y: -280.0741271972656,
            z: -76.02132415771484
        }, {
            x: -86.28187561035156,
            y: -274.0636291503906,
            z: -86.28187561035156
        }, {
            x: -201.7495574951172,
            y: -92.7051010131836,
            z: -201.7495574951172
        }, {
            x: -204.90379333496094,
            y: -77.64571380615234,
            z: -204.90379333496094
        }, {
            x: -207.49644470214844,
            y: -62.373504638671875,
            z: -207.49644470214844
        }, {
            x: -209.52032470703125,
            y: 46.93033981323242,
            z: -209.52032470703125
        }, {
            x: -207.49644470214844,
            y: 62.373504638671875,
            z: -207.49644470214844
        }, {
            x: -201.7495574951172,
            y: 92.7051010131836,
            z: -201.7495574951172
        }, {
            x: -198.0423126220703,
            y: 107.51038360595703,
            z: -198.0423126220703
        }, {
            x: -193.79225158691406,
            y: 122.02099609375,
            z: -193.79225158691406
        }, {
            x: -189.0110321044922,
            y: 136.1971435546875,
            z: -189.0110321044922
        }, {
            x: -183.7117156982422,
            y: 150,
            z: -183.7117156982422
        }, {
            x: -177.9088897705078,
            y: 163.39170837402344,
            z: -177.9088897705078
        }, {
            x: -171.61842346191406,
            y: 176.3355712890625,
            z: -171.61842346191406
        }, {
            x: -164.8575439453125,
            y: 188.79611206054688,
            z: -164.8575439453125
        }, {
            x: -157.6448211669922,
            y: 200.7391815185547,
            z: -157.6448211669922
        }, {
            x: -150,
            y: 212.1320343017578,
            z: -150
        }, {
            x: -133.49900817871094,
            y: 233.143798828125,
            z: -133.49900817871094
        }, {
            x: -124.68807983398438,
            y: 242.70509338378906,
            z: -124.68807983398438
        }, {
            x: -115.53538513183594,
            y: 251.60116577148438,
            z: -115.53538513183594
        }, {
            x: -106.0660171508789,
            y: 259.8076171875,
            z: -106.0660171508789
        }, {
            x: -96.3059310913086,
            y: 267.3019714355469,
            z: -96.3059310913086
        }, {
            x: -86.28187561035156,
            y: 274.0636291503906,
            z: -86.28187561035156
        }, {
            x: -76.02132415771484,
            y: 280.0741271972656,
            z: -76.02132415771484
        }, {
            x: -65.55239868164062,
            y: 285.31695556640625,
            z: -65.55239868164062
        }, {
            x: -10.505877494812012,
            y: -299.5888671875,
            z: -11.66795825958252
        }, {
            x: -20.982959747314453,
            y: -298.3565673828125,
            z: -23.30393409729004
        }, {
            x: -31.40252685546875,
            y: -296.3065185546875,
            z: -34.87603759765625
        }, {
            x: -41.73602294921875,
            y: -293.44427490234375,
            z: -46.3525505065918
        }, {
            x: -51.95512771606445,
            y: -289.7777404785156,
            z: -57.70201110839844
        }, {
            x: -62.03181838989258,
            y: -285.31695556640625,
            z: -68.893310546875
        }, {
            x: -71.93849182128906,
            y: -280.0741271972656,
            z: -79.89578247070312
        }, {
            x: -81.64797973632812,
            y: -274.0636291503906,
            z: -90.67926025390625
        }, {
            x: -187.4061737060547,
            y: -107.51038360595703,
            z: -208.13563537597656
        }, {
            x: -190.914306640625,
            y: -92.7051010131836,
            z: -212.03179931640625
        }, {
            x: -193.89915466308594,
            y: -77.64571380615234,
            z: -215.34683227539062
        }, {
            x: -199.63951110839844,
            y: 31.358539581298828,
            z: -221.72213745117188
        }, {
            x: -198.2677459716797,
            y: 46.93033981323242,
            z: -220.19863891601562
        }, {
            x: -196.35255432128906,
            y: 62.373504638671875,
            z: -218.0715789794922
        }, {
            x: -190.914306640625,
            y: 92.7051010131836,
            z: -212.03179931640625
        }, {
            x: -187.4061737060547,
            y: 107.51038360595703,
            z: -208.13563537597656
        }, {
            x: -183.38436889648438,
            y: 122.02099609375,
            z: -203.66896057128906
        }, {
            x: -178.85992431640625,
            y: 136.1971435546875,
            z: -198.64405822753906
        }, {
            x: -173.84523010253906,
            y: 150,
            z: -193.07469177246094
        }, {
            x: -168.3540496826172,
            y: 163.39170837402344,
            z: -186.97610473632812
        }, {
            x: -162.4014129638672,
            y: 176.3355712890625,
            z: -180.3650360107422
        }, {
            x: -156.00364685058594,
            y: 188.79611206054688,
            z: -173.2595977783203
        }, {
            x: -149.17828369140625,
            y: 200.7391815185547,
            z: -165.67926025390625
        }, {
            x: -141.9440460205078,
            y: 212.1320343017578,
            z: -157.6448211669922
        }, {
            x: -134.32073974609375,
            y: 222.9434356689453,
            z: -149.17828369140625
        }, {
            x: -126.32926177978516,
            y: 233.143798828125,
            z: -140.3028564453125
        }, {
            x: -117.99153900146484,
            y: 242.70509338378906,
            z: -131.04287719726562
        }, {
            x: -109.33039855957031,
            y: 251.60116577148438,
            z: -121.42369842529297
        }, {
            x: -100.36959075927734,
            y: 259.8076171875,
            z: -111.47171783447266
        }, {
            x: -91.13368225097656,
            y: 267.3019714355469,
            z: -101.21420288085938
        }, {
            x: -81.64797973632812,
            y: 274.0636291503906,
            z: -90.67926025390625
        }, {
            x: -71.93849182128906,
            y: 280.0741271972656,
            z: -79.89578247070312
        }, {
            x: -9.88082504272461,
            y: -299.5888671875,
            z: -12.201803207397461
        }, {
            x: -19.734567642211914,
            y: -298.3565673828125,
            z: -24.370162963867188
        }, {
            x: -29.53421974182129,
            y: -296.3065185546875,
            z: -36.47172546386719
        }, {
            x: -39.2529182434082,
            y: -293.44427490234375,
            z: -48.47332000732422
        }, {
            x: -48.86403274536133,
            y: -289.7777404785156,
            z: -60.3420524597168
        }, {
            x: -58.34120559692383,
            y: -285.31695556640625,
            z: -72.04539489746094
        }, {
            x: -67.65847778320312,
            y: -280.0741271972656,
            z: -83.55126953125
        }, {
            x: -76.79029083251953,
            y: -274.0636291503906,
            z: -94.828125
        }, {
            x: -188.53736877441406,
            y: 15.700786590576172,
            z: -232.8242645263672
        }, {
            x: -187.76187133789062,
            y: 31.358539581298828,
            z: -231.8666229248047
        }, {
            x: -186.47171020507812,
            y: 46.93033981323242,
            z: -230.27340698242188
        }, {
            x: -184.67047119140625,
            y: 62.373504638671875,
            z: -228.04904174804688
        }, {
            x: -182.36305236816406,
            y: 77.64571380615234,
            z: -225.19961547851562
        }, {
            x: -176.25636291503906,
            y: 107.51038360595703,
            z: -217.6584930419922
        }, {
            x: -172.4738311767578,
            y: 122.02099609375,
            z: -212.98745727539062
        }, {
            x: -168.21856689453125,
            y: 136.1971435546875,
            z: -207.73263549804688
        }, {
            x: -163.5022430419922,
            y: 150,
            z: -201.908447265625
        }, {
            x: -158.33773803710938,
            y: 163.39170837402344,
            z: -195.5308380126953
        }, {
            x: -152.73927307128906,
            y: 176.3355712890625,
            z: -188.61727905273438
        }, {
            x: -146.72213745117188,
            y: 188.79611206054688,
            z: -181.18675231933594
        }, {
            x: -140.3028564453125,
            y: 200.7391815185547,
            z: -173.2595977783203
        }, {
            x: -133.49900817871094,
            y: 212.1320343017578,
            z: -164.85755920410156
        }, {
            x: -126.32925415039062,
            y: 222.9434356689453,
            z: -156.00364685058594
        }, {
            x: -118.81324005126953,
            y: 233.143798828125,
            z: -146.72213745117188
        }, {
            x: -110.97157287597656,
            y: 242.70509338378906,
            z: -137.03848266601562
        }, {
            x: -102.82573699951172,
            y: 251.60116577148438,
            z: -126.97920989990234
        }, {
            x: -94.39805603027344,
            y: 259.8076171875,
            z: -116.5718994140625
        }, {
            x: -85.71163940429688,
            y: 267.3019714355469,
            z: -105.84506225585938
        }, {
            x: -76.79029083251953,
            y: 274.0636291503906,
            z: -94.828125
        }, {
            x: -67.65847778320312,
            y: 280.0741271972656,
            z: -83.55126953125
        }, {
            x: -9.228691101074219,
            y: -299.5888671875,
            z: -12.702202796936035
        }, {
            x: -18.432086944580078,
            y: -298.3565673828125,
            z: -25.369590759277344
        }, {
            x: -27.5849609375,
            y: -296.3065185546875,
            z: -37.96744155883789
        }, {
            x: -36.662227630615234,
            y: -293.44427490234375,
            z: -50.46123123168945
        }, {
            x: -45.639007568359375,
            y: -289.7777404785156,
            z: -62.81669998168945
        }, {
            x: -54.49068832397461,
            y: -285.31695556640625,
            z: -75
        }, {
            x: -63.19301986694336,
            y: -280.0741271972656,
            z: -86.97772979736328
        }, {
            x: -172.4822235107422,
            y: -62.373504638671875,
            z: -237.4014129638672
        }, {
            x: -174.1645965576172,
            y: -46.93033981323242,
            z: -239.7169952392578
        }, {
            x: -175.3695831298828,
            y: -31.358539581298828,
            z: -241.3755340576172
        }, {
            x: -176.09390258789062,
            y: -15.700786590576172,
            z: -242.3724822998047
        }, {
            x: -176.3355712890625,
            y: 0,
            z: -242.70509338378906
        }, {
            x: -176.09390258789062,
            y: 15.700786590576172,
            z: -242.3724822998047
        }, {
            x: -175.3695831298828,
            y: 31.358539581298828,
            z: -241.3755340576172
        }, {
            x: -174.1645965576172,
            y: 46.93033981323242,
            z: -239.7169952392578
        }, {
            x: -172.4822235107422,
            y: 62.373504638671875,
            z: -237.4014129638672
        }, {
            x: -170.32708740234375,
            y: 77.64571380615234,
            z: -234.43511962890625
        }, {
            x: -167.70509338378906,
            y: 92.7051010131836,
            z: -230.82627868652344
        }, {
            x: -164.62344360351562,
            y: 107.51038360595703,
            z: -226.58473205566406
        }, {
            x: -161.09056091308594,
            y: 122.02099609375,
            z: -221.72213745117188
        }, {
            x: -157.11614990234375,
            y: 136.1971435546875,
            z: -216.2518310546875
        }, {
            x: -152.71109008789062,
            y: 150,
            z: -210.18878173828125
        }, {
            x: -147.887451171875,
            y: 163.39170837402344,
            z: -203.54962158203125
        }, {
            x: -142.65847778320312,
            y: 176.3355712890625,
            z: -196.35255432128906
        }, {
            x: -137.03848266601562,
            y: 188.79611206054688,
            z: -188.61727905273438
        }, {
            x: -131.04287719726562,
            y: 200.7391815185547,
            z: -180.3650360107422
        }, {
            x: -117.99153137207031,
            y: 222.9434356689453,
            z: -162.4014129638672
        }, {
            x: -110.97157287597656,
            y: 233.143798828125,
            z: -152.73927307128906
        }, {
            x: -103.64745330810547,
            y: 242.70509338378906,
            z: -142.65847778320312
        }, {
            x: -96.03923797607422,
            y: 251.60116577148438,
            z: -132.18667602539062
        }, {
            x: -88.16778564453125,
            y: 259.8076171875,
            z: -121.35254669189453
        }, {
            x: -80.05467987060547,
            y: 267.3019714355469,
            z: -110.18580627441406
        }, {
            x: -71.72213745117188,
            y: 274.0636291503906,
            z: -98.71705627441406
        }, {
            x: -8.551261901855469,
            y: -299.5888671875,
            z: -13.167787551879883
        }, {
            x: -17.079084396362305,
            y: -298.3565673828125,
            z: -26.299484252929688
        }, {
            x: -25.560094833374023,
            y: -296.3065185546875,
            z: -39.359092712402344
        }, {
            x: -33.97105026245117,
            y: -293.44427490234375,
            z: -52.310821533203125
        }, {
            x: -42.28888702392578,
            y: -289.7777404785156,
            z: -65.11917877197266
        }, {
            x: -50.49081802368164,
            y: -285.31695556640625,
            z: -77.74903106689453
        }, {
            x: -58.554351806640625,
            y: -280.0741271972656,
            z: -90.1657943725586
        }, {
            x: -66.4573974609375,
            y: -274.0636291503906,
            z: -102.33541107177734
        }, {
            x: -157.8242645263672,
            y: -77.64571380615234,
            z: -243.02806091308594
        }, {
            x: -159.8212127685547,
            y: -62.373504638671875,
            z: -246.10308837890625
        }, {
            x: -161.38009643554688,
            y: -46.93033981323242,
            z: -248.5035400390625
        }, {
            x: -162.49664306640625,
            y: -31.358539581298828,
            z: -250.22286987304688
        }, {
            x: -163.16778564453125,
            y: -15.700786590576172,
            z: -251.25636291503906
        }, {
            x: -163.39170837402344,
            y: 0,
            z: -251.60116577148438
        }, {
            x: -163.16778564453125,
            y: 15.700786590576172,
            z: -251.25636291503906
        }, {
            x: -162.49664306640625,
            y: 31.358539581298828,
            z: -250.22286987304688
        }, {
            x: -161.38009643554688,
            y: 46.93033981323242,
            z: -248.5035400390625
        }, {
            x: -159.8212127685547,
            y: 62.373504638671875,
            z: -246.10308837890625
        }, {
            x: -157.8242645263672,
            y: 77.64571380615234,
            z: -243.02806091308594
        }, {
            x: -155.39476013183594,
            y: 92.7051010131836,
            z: -239.28692626953125
        }, {
            x: -152.539306640625,
            y: 107.51038360595703,
            z: -234.88992309570312
        }, {
            x: -149.26576232910156,
            y: 122.02099609375,
            z: -229.84909057617188
        }, {
            x: -141.50137329101562,
            y: 150,
            z: -217.89300537109375
        }, {
            x: -137.03182983398438,
            y: 163.39170837402344,
            z: -211.010498046875
        }, {
            x: -132.18667602539062,
            y: 176.3355712890625,
            z: -203.54962158203125
        }, {
            x: -126.97920989990234,
            y: 188.79611206054688,
            z: -195.5308380126953
        }, {
            x: -121.4237060546875,
            y: 200.7391815185547,
            z: -186.97610473632812
        }, {
            x: -115.53539276123047,
            y: 212.1320343017578,
            z: -177.9088897705078
        }, {
            x: -102.82573699951172,
            y: 233.143798828125,
            z: -158.33773803710938
        }, {
            x: -96.03923797607422,
            y: 242.70509338378906,
            z: -147.887451171875
        }, {
            x: -88.98950958251953,
            y: 251.60116577148438,
            z: -137.0318145751953
        }, {
            x: -81.69585418701172,
            y: 259.8076171875,
            z: -125.80058288574219
        }, {
            x: -74.17828369140625,
            y: 267.3019714355469,
            z: -114.22453308105469
        }, {
            x: -66.4573974609375,
            y: 274.0636291503906,
            z: -102.33541107177734
        }, {
            x: -50.49081802368164,
            y: 285.31695556640625,
            z: -77.74903106689453
        }, {
            x: -7.850393295288086,
            y: -299.5888671875,
            z: -13.59727954864502
        }, {
            x: -15.679269790649414,
            y: -298.3565673828125,
            z: -27.157289505004883
        }, {
            x: -23.46516990661621,
            y: -296.3065185546875,
            z: -40.64286422729492
        }, {
            x: -31.186752319335938,
            y: -293.44427490234375,
            z: -54.01704025268555
        }, {
            x: -38.82285690307617,
            y: -289.7777404785156,
            z: -67.24315643310547
        }, {
            x: -46.3525505065918,
            y: -285.31695556640625,
            z: -80.28497314453125
        }, {
            x: -53.755191802978516,
            y: -280.0741271972656,
            z: -93.10672760009766
        }, {
            x: -61.010498046875,
            y: -274.0636291503906,
            z: -105.67327880859375
        }, {
            x: -137.0318145751953,
            y: -122.02099609375,
            z: -237.3460693359375
        }, {
            x: -140.0370635986328,
            y: -107.51038360595703,
            z: -242.55130004882812
        }, {
            x: -142.65847778320312,
            y: -92.7051010131836,
            z: -247.09173583984375
        }, {
            x: -144.8888702392578,
            y: -77.64571380615234,
            z: -250.9548797607422
        }, {
            x: -146.72213745117188,
            y: -62.373504638671875,
            z: -254.1302032470703
        }, {
            x: -148.15325927734375,
            y: -46.93033981323242,
            z: -256.60894775390625
        }, {
            x: -149.17828369140625,
            y: -31.358539581298828,
            z: -258.3843688964844
        }, {
            x: -149.79443359375,
            y: -15.700786590576172,
            z: -259.4515686035156
        }, {
            x: -150,
            y: 0,
            z: -259.8076171875
        }, {
            x: -149.79443359375,
            y: 15.700786590576172,
            z: -259.4515686035156
        }, {
            x: -149.17828369140625,
            y: 31.358539581298828,
            z: -258.3843688964844
        }, {
            x: -148.15325927734375,
            y: 46.93033981323242,
            z: -256.60894775390625
        }, {
            x: -146.72213745117188,
            y: 62.373504638671875,
            z: -254.1302032470703
        }, {
            x: -144.8888702392578,
            y: 77.64571380615234,
            z: -250.9548797607422
        }, {
            x: -142.65847778320312,
            y: 92.7051010131836,
            z: -247.09173583984375
        }, {
            x: -140.0370635986328,
            y: 107.51038360595703,
            z: -242.55130004882812
        }, {
            x: -137.0318145751953,
            y: 122.02099609375,
            z: -237.3460693359375
        }, {
            x: -133.65098571777344,
            y: 136.1971435546875,
            z: -231.4902801513672
        }, {
            x: -129.90380859375,
            y: 150,
            z: -225
        }, {
            x: -125.80058288574219,
            y: 163.39170837402344,
            z: -217.89300537109375
        }, {
            x: -116.5718994140625,
            y: 188.79611206054688,
            z: -201.90843200683594
        }, {
            x: -111.47171783447266,
            y: 200.7391815185547,
            z: -193.07469177246094
        }, {
            x: -106.0660171508789,
            y: 212.1320343017578,
            z: -183.7117156982422
        }, {
            x: -94.39805603027344,
            y: 233.143798828125,
            z: -163.50222778320312
        }, {
            x: -88.16778564453125,
            y: 242.70509338378906,
            z: -152.71109008789062
        }, {
            x: -81.69585418701172,
            y: 251.60116577148438,
            z: -141.50137329101562
        }, {
            x: -75,
            y: 259.8076171875,
            z: -129.90380859375
        }, {
            x: -68.09857177734375,
            y: 267.3019714355469,
            z: -117.95018768310547
        }, {
            x: -61.010498046875,
            y: 274.0636291503906,
            z: -105.67327880859375
        }, {
            x: -53.755191802978516,
            y: 280.0741271972656,
            z: -93.10672760009766
        }, {
            x: -46.3525505065918,
            y: 285.31695556640625,
            z: -80.28497314453125
        }, {
            x: -7.128007888793945,
            y: -299.5888671875,
            z: -13.989503860473633
        }, {
            x: -14.236477851867676,
            y: -298.3565673828125,
            z: -27.940662384033203
        }, {
            x: -21.30592918395996,
            y: -296.3065185546875,
            z: -41.81523895263672
        }, {
            x: -28.316978454589844,
            y: -293.44427490234375,
            z: -55.575199127197266
        }, {
            x: -35.25041580200195,
            y: -289.7777404785156,
            z: -69.1828384399414
        }, {
            x: -42.08723449707031,
            y: -285.31695556640625,
            z: -82.60084533691406
        }, {
            x: -48.808692932128906,
            y: -280.0741271972656,
            z: -95.7924575805664
        }, {
            x: -55.39636993408203,
            y: -274.0636291503906,
            z: -108.72150421142578
        }, {
            x: -121.35254669189453,
            y: -136.1971435546875,
            z: -238.16778564453125
        }, {
            x: -124.42228698730469,
            y: -122.02099609375,
            z: -244.19248962402344
        }, {
            x: -127.15099334716797,
            y: -107.51038360595703,
            z: -249.54788208007812
        }, {
            x: -129.53118896484375,
            y: -92.7051010131836,
            z: -254.21926879882812
        }, {
            x: -131.5563507080078,
            y: -77.64571380615234,
            z: -258.1938781738281
        }, {
            x: -133.22091674804688,
            y: -62.373504638671875,
            z: -261.46075439453125
        }, {
            x: -134.5203399658203,
            y: -46.93033981323242,
            z: -264.0110168457031
        }, {
            x: -135.4510498046875,
            y: -31.358539581298828,
            z: -265.837646484375
        }, {
            x: -136.010498046875,
            y: -15.700786590576172,
            z: -266.93560791015625
        }, {
            x: -136.1971435546875,
            y: 0,
            z: -267.3019714355469
        }, {
            x: -136.010498046875,
            y: 15.700786590576172,
            z: -266.93560791015625
        }, {
            x: -135.4510498046875,
            y: 31.358539581298828,
            z: -265.837646484375
        }, {
            x: -134.5203399658203,
            y: 46.93033981323242,
            z: -264.0110168457031
        }, {
            x: -133.22091674804688,
            y: 62.373504638671875,
            z: -261.46075439453125
        }, {
            x: -131.5563507080078,
            y: 77.64571380615234,
            z: -258.1938781738281
        }, {
            x: -129.53118896484375,
            y: 92.7051010131836,
            z: -254.21926879882812
        }, {
            x: -127.15099334716797,
            y: 107.51038360595703,
            z: -249.54788208007812
        }, {
            x: -124.42228698730469,
            y: 122.02099609375,
            z: -244.19248962402344
        }, {
            x: -121.35254669189453,
            y: 136.1971435546875,
            z: -238.16778564453125
        }, {
            x: -117.95018768310547,
            y: 150,
            z: -231.4902801513672
        }, {
            x: -114.22453308105469,
            y: 163.39170837402344,
            z: -224.17828369140625
        }, {
            x: -105.84506225585938,
            y: 188.79611206054688,
            z: -207.73263549804688
        }, {
            x: -101.21420288085938,
            y: 200.7391815185547,
            z: -198.64405822753906
        }, {
            x: -91.13367462158203,
            y: 222.9434356689453,
            z: -178.85992431640625
        }, {
            x: -85.71163940429688,
            y: 233.143798828125,
            z: -168.21856689453125
        }, {
            x: -80.05467987060547,
            y: 242.70509338378906,
            z: -157.11614990234375
        }, {
            x: -74.17828369140625,
            y: 251.60116577148438,
            z: -145.5830841064453
        }, {
            x: -68.09857177734375,
            y: 259.8076171875,
            z: -133.65098571777344
        }, {
            x: -61.832210540771484,
            y: 267.3019714355469,
            z: -121.35254669189453
        }, {
            x: -55.39636993408203,
            y: 274.0636291503906,
            z: -108.72150421142578
        }, {
            x: -48.808692932128906,
            y: 280.0741271972656,
            z: -95.7924575805664
        }, {
            x: -42.08723449707031,
            y: 285.31695556640625,
            z: -82.60084533691406
        }, {
            x: -6.386085510253906,
            y: -299.5888671875,
            z: -14.343381881713867
        }, {
            x: -12.754667282104492,
            y: -298.3565673828125,
            z: -28.647449493408203
        }, {
            x: -19.088289260864258,
            y: -296.3065185546875,
            z: -42.87299728393555
        }, {
            x: -25.369590759277344,
            y: -293.44427490234375,
            z: -56.98103332519531
        }, {
            x: -31.581357955932617,
            y: -289.7777404785156,
            z: -70.9328842163086
        }, {
            x: -37.70656204223633,
            y: -285.31695556640625,
            z: -84.69032287597656
        }, {
            x: -43.72841262817383,
            y: -280.0741271972656,
            z: -98.21562194824219
        }, {
            x: -105.67327880859375,
            y: -150,
            z: -237.3460693359375
        }, {
            x: -108.72150421142578,
            y: -136.1971435546875,
            z: -244.19247436523438
        }, {
            x: -111.47171783447266,
            y: -122.02099609375,
            z: -250.3695831298828
        }, {
            x: -113.91641235351562,
            y: -107.51038360595703,
            z: -255.86044311523438
        }, {
            x: -116.04885864257812,
            y: -92.7051010131836,
            z: -260.6499938964844
        }, {
            x: -117.86322784423828,
            y: -77.64571380615234,
            z: -264.7251281738281
        }, {
            x: -119.35453796386719,
            y: -62.373504638671875,
            z: -268.0746765136719
        }, {
            x: -120.51871490478516,
            y: -46.93033981323242,
            z: -270.689453125
        }, {
            x: -121.35254669189453,
            y: -31.358539581298828,
            z: -272.5622863769531
        }, {
            x: -121.85376739501953,
            y: -15.700786590576172,
            z: -273.6880187988281
        }, {
            x: -122.02099609375,
            y: 0,
            z: -274.0636291503906
        }, {
            x: -121.85376739501953,
            y: 15.700786590576172,
            z: -273.6880187988281
        }, {
            x: -121.35254669189453,
            y: 31.358539581298828,
            z: -272.5622863769531
        }, {
            x: -120.51871490478516,
            y: 46.93033981323242,
            z: -270.689453125
        }, {
            x: -119.35453796386719,
            y: 62.373504638671875,
            z: -268.0746765136719
        }, {
            x: -117.86322784423828,
            y: 77.64571380615234,
            z: -264.7251281738281
        }, {
            x: -116.04885864257812,
            y: 92.7051010131836,
            z: -260.6499938964844
        }, {
            x: -113.91641235351562,
            y: 107.51038360595703,
            z: -255.86044311523438
        }, {
            x: -111.47171783447266,
            y: 122.02099609375,
            z: -250.3695831298828
        }, {
            x: -108.72150421142578,
            y: 136.1971435546875,
            z: -244.19247436523438
        }, {
            x: -105.67327880859375,
            y: 150,
            z: -237.3460693359375
        }, {
            x: -102.33541107177734,
            y: 163.39170837402344,
            z: -229.84909057617188
        }, {
            x: -90.67927551269531,
            y: 200.7391815185547,
            z: -203.66896057128906
        }, {
            x: -86.28187561035156,
            y: 212.1320343017578,
            z: -193.79225158691406
        }, {
            x: -81.64797973632812,
            y: 222.9434356689453,
            z: -183.38436889648438
        }, {
            x: -76.7903060913086,
            y: 233.143798828125,
            z: -172.4738311767578
        }, {
            x: -71.72213745117188,
            y: 242.70509338378906,
            z: -161.09056091308594
        }, {
            x: -66.4573974609375,
            y: 251.60116577148438,
            z: -149.2657470703125
        }, {
            x: -61.010498046875,
            y: 259.8076171875,
            z: -137.0318145751953
        }, {
            x: -49.630409240722656,
            y: 274.0636291503906,
            z: -111.47171783447266
        }, {
            x: -43.72841262817383,
            y: 280.0741271972656,
            z: -98.21562194824219
        }, {
            x: -37.70656204223633,
            y: 285.31695556640625,
            z: -84.69032287597656
        }, {
            x: -5.626658916473389,
            y: -299.5888671875,
            z: -14.657946586608887
        }, {
            x: -11.237895965576172,
            y: -298.3565673828125,
            z: -29.27571678161621
        }, {
            x: -16.818330764770508,
            y: -296.3065185546875,
            z: -43.8132438659668
        }, {
            x: -22.352664947509766,
            y: -293.44427490234375,
            z: -58.230682373046875
        }, {
            x: -27.825735092163086,
            y: -289.7777404785156,
            z: -72.48851776123047
        }, {
            x: -33.2225341796875,
            y: -285.31695556640625,
            z: -86.54766082763672
        }, {
            x: -38.52827453613281,
            y: -280.0741271972656,
            z: -100.36958312988281
        }, {
            x: -93.10672760009766,
            y: -150,
            z: -242.55130004882812
        }, {
            x: -95.7924575805664,
            y: -136.1971435546875,
            z: -249.54786682128906
        }, {
            x: -98.21562957763672,
            y: -122.02099609375,
            z: -255.86044311523438
        }, {
            x: -100.36959075927734,
            y: -107.51038360595703,
            z: -261.4717102050781
        }, {
            x: -102.24845123291016,
            y: -92.7051010131836,
            z: -266.3663024902344
        }, {
            x: -103.84706115722656,
            y: -77.64571380615234,
            z: -270.53082275390625
        }, {
            x: -105.16102600097656,
            y: -62.373504638671875,
            z: -273.9538269042969
        }, {
            x: -106.18675231933594,
            y: -46.93033981323242,
            z: -276.6259460449219
        }, {
            x: -106.92143249511719,
            y: -31.358539581298828,
            z: -278.53985595703125
        }, {
            x: -107.36304473876953,
            y: -15.700786590576172,
            z: -279.6903076171875
        }, {
            x: -107.51038360595703,
            y: 0,
            z: -280.0741271972656
        }, {
            x: -107.36304473876953,
            y: 15.700786590576172,
            z: -279.6903076171875
        }, {
            x: -106.92143249511719,
            y: 31.358539581298828,
            z: -278.53985595703125
        }, {
            x: -106.18675231933594,
            y: 46.93033981323242,
            z: -276.6259460449219
        }, {
            x: -105.16102600097656,
            y: 62.373504638671875,
            z: -273.9538269042969
        }, {
            x: -103.84706115722656,
            y: 77.64571380615234,
            z: -270.53082275390625
        }, {
            x: -102.24845123291016,
            y: 92.7051010131836,
            z: -266.3663024902344
        }, {
            x: -100.36959075927734,
            y: 107.51038360595703,
            z: -261.4717102050781
        }, {
            x: -98.21562957763672,
            y: 122.02099609375,
            z: -255.86044311523438
        }, {
            x: -95.7924575805664,
            y: 136.1971435546875,
            z: -249.54786682128906
        }, {
            x: -93.10672760009766,
            y: 150,
            z: -242.55130004882812
        }, {
            x: -90.16580200195312,
            y: 163.39170837402344,
            z: -234.88990783691406
        }, {
            x: -76.02132415771484,
            y: 212.1320343017578,
            z: -198.0423126220703
        }, {
            x: -71.93849182128906,
            y: 222.9434356689453,
            z: -187.40615844726562
        }, {
            x: -67.65847778320312,
            y: 233.143798828125,
            z: -176.25636291503906
        }, {
            x: -63.19301986694336,
            y: 242.70509338378906,
            z: -164.62344360351562
        }, {
            x: -58.554351806640625,
            y: 251.60116577148438,
            z: -152.539306640625
        }, {
            x: -53.755191802978516,
            y: 259.8076171875,
            z: -140.0370635986328
        }, {
            x: -48.808692932128906,
            y: 267.3019714355469,
            z: -127.15098571777344
        }, {
            x: -43.72841262817383,
            y: 274.0636291503906,
            z: -113.9164047241211
        }, {
            x: -38.52827453613281,
            y: 280.0741271972656,
            z: -100.36958312988281
        }, {
            x: -33.2225341796875,
            y: 285.31695556640625,
            z: -86.54766082763672
        }, {
            x: -16.818330764770508,
            y: 296.3065185546875,
            z: -43.8132438659668
        }, {
            x: -4.851809978485107,
            y: -299.5888671875,
            z: -14.93233585357666
        }, {
            x: -9.690321922302246,
            y: -298.3565673828125,
            z: -29.82374382019043
        }, {
            x: -14.502272605895996,
            y: -296.3065185546875,
            z: -44.63340759277344
        }, {
            x: -19.27447509765625,
            y: -293.44427490234375,
            z: -59.32073211669922
        }, {
            x: -23.993846893310547,
            y: -289.7777404785156,
            z: -73.84546661376953
        }, {
            x: -28.647451400756836,
            y: -285.31695556640625,
            z: -88.16778564453125
        }, {
            x: -33.2225341796875,
            y: -280.0741271972656,
            z: -102.24845123291016
        }, {
            x: -80.28497314453125,
            y: -150,
            z: -247.09173583984375
        }, {
            x: -82.6008529663086,
            y: -136.1971435546875,
            z: -254.21926879882812
        }, {
            x: -84.69032287597656,
            y: -122.02099609375,
            z: -260.6499938964844
        }, {
            x: -86.54766845703125,
            y: -107.51038360595703,
            z: -266.3663330078125
        }, {
            x: -88.16778564453125,
            y: -92.7051010131836,
            z: -271.3525695800781
        }, {
            x: -89.54625701904297,
            y: -77.64571380615234,
            z: -275.59503173828125
        }, {
            x: -90.67927551269531,
            y: -62.373504638671875,
            z: -279.08209228515625
        }, {
            x: -91.56375122070312,
            y: -46.93033981323242,
            z: -281.8042297363281
        }, {
            x: -92.19725036621094,
            y: -31.358539581298828,
            z: -283.75396728515625
        }, {
            x: -92.57805633544922,
            y: -15.700786590576172,
            z: -284.92596435546875
        }, {
            x: -92.7051010131836,
            y: 0,
            z: -285.31695556640625
        }, {
            x: -92.57805633544922,
            y: 15.700786590576172,
            z: -284.92596435546875
        }, {
            x: -92.19725036621094,
            y: 31.358539581298828,
            z: -283.75396728515625
        }, {
            x: -91.56375122070312,
            y: 46.93033981323242,
            z: -281.8042297363281
        }, {
            x: -90.67927551269531,
            y: 62.373504638671875,
            z: -279.08209228515625
        }, {
            x: -89.54625701904297,
            y: 77.64571380615234,
            z: -275.59503173828125
        }, {
            x: -88.16778564453125,
            y: 92.7051010131836,
            z: -271.3525695800781
        }, {
            x: -86.54766845703125,
            y: 107.51038360595703,
            z: -266.3663330078125
        }, {
            x: -84.69032287597656,
            y: 122.02099609375,
            z: -260.6499938964844
        }, {
            x: -82.6008529663086,
            y: 136.1971435546875,
            z: -254.21926879882812
        }, {
            x: -80.28497314453125,
            y: 150,
            z: -247.09173583984375
        }, {
            x: -77.74903869628906,
            y: 163.39170837402344,
            z: -239.2869415283203
        }, {
            x: -75,
            y: 176.3355712890625,
            z: -230.82627868652344
        }, {
            x: -68.89331817626953,
            y: 200.7391815185547,
            z: -212.03182983398438
        }, {
            x: -65.55240631103516,
            y: 212.1320343017578,
            z: -201.7495574951172
        }, {
            x: -62.03181838989258,
            y: 222.9434356689453,
            z: -190.914306640625
        }, {
            x: -58.341209411621094,
            y: 233.143798828125,
            z: -179.5557861328125
        }, {
            x: -54.49068832397461,
            y: 242.70509338378906,
            z: -167.70509338378906
        }, {
            x: -50.490814208984375,
            y: 251.60116577148438,
            z: -155.39476013183594
        }, {
            x: -42.08723449707031,
            y: 267.3019714355469,
            z: -129.53118896484375
        }, {
            x: -33.2225341796875,
            y: 280.0741271972656,
            z: -102.24845123291016
        }, {
            x: -28.647451400756836,
            y: 285.31695556640625,
            z: -88.16778564453125
        }, {
            x: -14.502272605895996,
            y: 296.3065185546875,
            z: -44.63340759277344
        }, {
            x: -4.063662528991699,
            y: -299.5888671875,
            z: -15.16579532623291
        }, {
            x: -8.11618709564209,
            y: -298.3565673828125,
            z: -30.290023803710938
        }, {
            x: -12.146465301513672,
            y: -296.3065185546875,
            z: -45.33122634887695
        }, {
            x: -16.143451690673828,
            y: -293.44427490234375,
            z: -60.2481803894043
        }, {
            x: -20.096189498901367,
            y: -289.7777404785156,
            z: -75
        }, {
            x: -23.99384307861328,
            y: -285.31695556640625,
            z: -89.5462417602539
        }, {
            x: -27.825735092163086,
            y: -280.0741271972656,
            z: -103.84706115722656
        }, {
            x: -67.24315643310547,
            y: -150,
            z: -250.95489501953125
        }, {
            x: -69.1828384399414,
            y: -136.1971435546875,
            z: -258.19384765625
        }, {
            x: -70.93289184570312,
            y: -122.02099609375,
            z: -264.7251281738281
        }, {
            x: -72.48851776123047,
            y: -107.51038360595703,
            z: -270.53082275390625
        }, {
            x: -73.845458984375,
            y: -92.7051010131836,
            z: -275.5950012207031
        }, {
            x: -75,
            y: -77.64571380615234,
            z: -279.90380859375
        }, {
            x: -75.94896697998047,
            y: -62.373504638671875,
            z: -283.4454040527344
        }, {
            x: -76.68976593017578,
            y: -46.93033981323242,
            z: -286.2101135253906
        }, {
            x: -77.2203598022461,
            y: -31.358539581298828,
            z: -288.1903076171875
        }, {
            x: -77.53929901123047,
            y: -15.700786590576172,
            z: -289.380615234375
        }, {
            x: -77.64571380615234,
            y: 0,
            z: -289.7777404785156
        }, {
            x: -77.53929901123047,
            y: 15.700786590576172,
            z: -289.380615234375
        }, {
            x: -77.2203598022461,
            y: 31.358539581298828,
            z: -288.1903076171875
        }, {
            x: -76.68976593017578,
            y: 46.93033981323242,
            z: -286.2101135253906
        }, {
            x: -75.94896697998047,
            y: 62.373504638671875,
            z: -283.4454040527344
        }, {
            x: -75,
            y: 77.64571380615234,
            z: -279.90380859375
        }, {
            x: -73.845458984375,
            y: 92.7051010131836,
            z: -275.5950012207031
        }, {
            x: -72.48851776123047,
            y: 107.51038360595703,
            z: -270.53082275390625
        }, {
            x: -70.93289184570312,
            y: 122.02099609375,
            z: -264.7251281738281
        }, {
            x: -69.1828384399414,
            y: 136.1971435546875,
            z: -258.19384765625
        }, {
            x: -67.24315643310547,
            y: 150,
            z: -250.95489501953125
        }, {
            x: -65.11917877197266,
            y: 163.39170837402344,
            z: -243.02806091308594
        }, {
            x: -51.95512008666992,
            y: 222.9434356689453,
            z: -193.89915466308594
        }, {
            x: -48.86403274536133,
            y: 233.143798828125,
            z: -182.36305236816406
        }, {
            x: -45.639007568359375,
            y: 242.70509338378906,
            z: -170.32708740234375
        }, {
            x: -42.28888702392578,
            y: 251.60116577148438,
            z: -157.8242645263672
        }, {
            x: -38.82285690307617,
            y: 259.8076171875,
            z: -144.8888702392578
        }, {
            x: -35.25041580200195,
            y: 267.3019714355469,
            z: -131.5563507080078
        }, {
            x: -31.581357955932617,
            y: 274.0636291503906,
            z: -117.86322784423828
        }, {
            x: -27.825735092163086,
            y: 280.0741271972656,
            z: -103.84706115722656
        }, {
            x: -23.99384307861328,
            y: 285.31695556640625,
            z: -89.5462417602539
        }, {
            x: -12.146465301513672,
            y: 296.3065185546875,
            z: -45.33122634887695
        }, {
            x: -3.2643771171569824,
            y: -299.5888671875,
            z: -15.357686996459961
        }, {
            x: -6.519806861877441,
            y: -298.3565673828125,
            z: -30.67327880859375
        }, {
            x: -9.757365226745605,
            y: -296.3065185546875,
            z: -45.90480041503906
        }, {
            x: -12.968180656433105,
            y: -293.44427490234375,
            z: -61.010498046875
        }, {
            x: -16.143451690673828,
            y: -289.7777404785156,
            z: -75.948974609375
        }, {
            x: -19.274473190307617,
            y: -285.31695556640625,
            z: -90.67927551269531
        }, {
            x: -22.352664947509766,
            y: -280.0741271972656,
            z: -105.16102600097656
        }, {
            x: -25.369590759277344,
            y: -274.0636291503906,
            z: -119.35454559326172
        }, {
            x: -56.98103332519531,
            y: -122.02099609375,
            z: -268.07470703125
        }, {
            x: -58.230682373046875,
            y: -107.51038360595703,
            z: -273.9538269042969
        }, {
            x: -59.32072830200195,
            y: -92.7051010131836,
            z: -279.08209228515625
        }, {
            x: -60.2481803894043,
            y: -77.64571380615234,
            z: -283.4454345703125
        }, {
            x: -61.010498046875,
            y: -62.373504638671875,
            z: -287.0318298339844
        }, {
            x: -61.60558319091797,
            y: -46.93033981323242,
            z: -289.83148193359375
        }, {
            x: -62.03181838989258,
            y: -31.358539581298828,
            z: -291.8367614746094
        }, {
            x: -62.28802490234375,
            y: -15.700786590576172,
            z: -293.0421447753906
        }, {
            x: -62.373504638671875,
            y: 0,
            z: -293.44427490234375
        }, {
            x: -62.28802490234375,
            y: 15.700786590576172,
            z: -293.0421447753906
        }, {
            x: -62.03181838989258,
            y: 31.358539581298828,
            z: -291.8367614746094
        }, {
            x: -61.60558319091797,
            y: 46.93033981323242,
            z: -289.83148193359375
        }, {
            x: -61.010498046875,
            y: 62.373504638671875,
            z: -287.0318298339844
        }, {
            x: -60.2481803894043,
            y: 77.64571380615234,
            z: -283.4454345703125
        }, {
            x: -59.32072830200195,
            y: 92.7051010131836,
            z: -279.08209228515625
        }, {
            x: -58.230682373046875,
            y: 107.51038360595703,
            z: -273.9538269042969
        }, {
            x: -56.98103332519531,
            y: 122.02099609375,
            z: -268.07470703125
        }, {
            x: -55.575199127197266,
            y: 136.1971435546875,
            z: -261.46075439453125
        }, {
            x: -54.01704025268555,
            y: 150,
            z: -254.1302032470703
        }, {
            x: -52.310821533203125,
            y: 163.39170837402344,
            z: -246.10308837890625
        }, {
            x: -50.46122360229492,
            y: 176.3355712890625,
            z: -237.4014129638672
        }, {
            x: -44.10472869873047,
            y: 212.1320343017578,
            z: -207.49644470214844
        }, {
            x: -41.73602294921875,
            y: 222.9434356689453,
            z: -196.35255432128906
        }, {
            x: -39.2529182434082,
            y: 233.143798828125,
            z: -184.67047119140625
        }, {
            x: -36.662227630615234,
            y: 242.70509338378906,
            z: -172.4822235107422
        }, {
            x: -33.971046447753906,
            y: 251.60116577148438,
            z: -159.8212127685547
        }, {
            x: -31.186752319335938,
            y: 259.8076171875,
            z: -146.72213745117188
        }, {
            x: -28.316978454589844,
            y: 267.3019714355469,
            z: -133.22091674804688
        }, {
            x: -25.369590759277344,
            y: 274.0636291503906,
            z: -119.35454559326172
        }, {
            x: -22.352664947509766,
            y: 280.0741271972656,
            z: -105.16102600097656
        }, {
            x: -19.274473190307617,
            y: 285.31695556640625,
            z: -90.67927551269531
        }, {
            x: -9.757365226745605,
            y: 296.3065185546875,
            z: -45.90480041503906
        }, {
            x: -2.456144094467163,
            y: -299.5888671875,
            z: -15.507484436035156
        }, {
            x: -4.9055562019348145,
            y: -298.3565673828125,
            z: -30.972463607788086
        }, {
            x: -7.341522216796875,
            y: -296.3065185546875,
            z: -46.3525505065918
        }, {
            x: -9.757365226745605,
            y: -293.44427490234375,
            z: -61.6055908203125
        }, {
            x: -12.146465301513672,
            y: -289.7777404785156,
            z: -76.68976593017578
        }, {
            x: -14.50227165222168,
            y: -285.31695556640625,
            z: -91.56375122070312
        }, {
            x: -16.818328857421875,
            y: -280.0741271972656,
            z: -106.18675994873047
        }, {
            x: -45.33122634887695,
            y: -77.64571380615234,
            z: -286.2101135253906
        }, {
            x: -45.9047966003418,
            y: -62.373504638671875,
            z: -289.83148193359375
        }, {
            x: -46.866024017333984,
            y: -15.700786590576172,
            z: -295.9004211425781
        }, {
            x: -46.93033981323242,
            y: 0,
            z: -296.3065185546875
        }, {
            x: -46.866024017333984,
            y: 15.700786590576172,
            z: -295.9004211425781
        }, {
            x: -46.673248291015625,
            y: 31.358539581298828,
            z: -294.6833190917969
        }, {
            x: -46.35254669189453,
            y: 46.93033981323242,
            z: -292.6584777832031
        }, {
            x: -45.9047966003418,
            y: 62.373504638671875,
            z: -289.83148193359375
        }, {
            x: -45.33122634887695,
            y: 77.64571380615234,
            z: -286.2101135253906
        }, {
            x: -44.63340759277344,
            y: 92.7051010131836,
            z: -281.8042297363281
        }, {
            x: -43.8132438659668,
            y: 107.51038360595703,
            z: -276.6259460449219
        }, {
            x: -42.87299728393555,
            y: 122.02099609375,
            z: -270.689453125
        }, {
            x: -41.81523513793945,
            y: 136.1971435546875,
            z: -264.0110168457031
        }, {
            x: -40.64286422729492,
            y: 150,
            z: -256.60894775390625
        }, {
            x: -39.359092712402344,
            y: 163.39170837402344,
            z: -248.50355529785156
        }, {
            x: -37.96744155883789,
            y: 176.3355712890625,
            z: -239.7169952392578
        }, {
            x: -33.18476104736328,
            y: 212.1320343017578,
            z: -209.5203399658203
        }, {
            x: -31.402524948120117,
            y: 222.9434356689453,
            z: -198.2677459716797
        }, {
            x: -29.53421974182129,
            y: 233.143798828125,
            z: -186.4717254638672
        }, {
            x: -27.5849609375,
            y: 242.70509338378906,
            z: -174.1645965576172
        }, {
            x: -25.560094833374023,
            y: 251.60116577148438,
            z: -161.38009643554688
        }, {
            x: -23.46516990661621,
            y: 259.8076171875,
            z: -148.15325927734375
        }, {
            x: -21.30592918395996,
            y: 267.3019714355469,
            z: -134.5203399658203
        }, {
            x: -19.088289260864258,
            y: 274.0636291503906,
            z: -120.51871490478516
        }, {
            x: -16.818328857421875,
            y: 280.0741271972656,
            z: -106.18675994873047
        }, {
            x: -1.6411792039871216,
            y: -299.5888671875,
            z: -15.614776611328125
        }, {
            x: -3.277859926223755,
            y: -298.3565673828125,
            z: -31.18675422668457
        }, {
            x: -4.9055562019348145,
            y: -296.3065185546875,
            z: -46.67325210571289
        }, {
            x: -6.519806861877441,
            y: -293.44427490234375,
            z: -62.03181838989258
        }, {
            x: -8.11618709564209,
            y: -289.7777404785156,
            z: -77.2203598022461
        }, {
            x: -9.690321922302246,
            y: -285.31695556640625,
            z: -92.19725036621094
        }, {
            x: -11.237895965576172,
            y: -280.0741271972656,
            z: -106.92143249511719
        }, {
            x: -31.315563201904297,
            y: 15.700786590576172,
            z: -297.94769287109375
        }, {
            x: -31.18675422668457,
            y: 31.358539581298828,
            z: -296.7221374511719
        }, {
            x: -30.972463607788086,
            y: 46.93033981323242,
            z: -294.6833190917969
        }, {
            x: -30.67327880859375,
            y: 62.373504638671875,
            z: -291.8367614746094
        }, {
            x: -30.290023803710938,
            y: 77.64571380615234,
            z: -288.1903381347656
        }, {
            x: -29.82374382019043,
            y: 92.7051010131836,
            z: -283.75396728515625
        }, {
            x: -29.275718688964844,
            y: 107.51038360595703,
            z: -278.53985595703125
        }, {
            x: -28.647451400756836,
            y: 122.02099609375,
            z: -272.5622863769531
        }, {
            x: -27.940662384033203,
            y: 136.1971435546875,
            z: -265.837646484375
        }, {
            x: -27.15729331970215,
            y: 150,
            z: -258.3843688964844
        }, {
            x: -26.299484252929688,
            y: 163.39170837402344,
            z: -250.22288513183594
        }, {
            x: -25.369590759277344,
            y: 176.3355712890625,
            z: -241.37554931640625
        }, {
            x: -24.370162963867188,
            y: 188.79611206054688,
            z: -231.8666229248047
        }, {
            x: -23.303937911987305,
            y: 200.7391815185547,
            z: -221.72213745117188
        }, {
            x: -22.17383575439453,
            y: 212.1320343017578,
            z: -210.96995544433594
        }, {
            x: -20.982959747314453,
            y: 222.9434356689453,
            z: -199.63951110839844
        }, {
            x: -19.734567642211914,
            y: 233.143798828125,
            z: -187.76187133789062
        }, {
            x: -18.432086944580078,
            y: 242.70509338378906,
            z: -175.36959838867188
        }, {
            x: -17.079084396362305,
            y: 251.60116577148438,
            z: -162.49664306640625
        }, {
            x: -15.679269790649414,
            y: 259.8076171875,
            z: -149.17828369140625
        }, {
            x: -14.236478805541992,
            y: 267.3019714355469,
            z: -135.4510498046875
        }, {
            x: -12.754667282104492,
            y: 274.0636291503906,
            z: -121.35254669189453
        }, {
            x: -0.8217157125473022,
            y: -299.5888671875,
            z: -15.679269790649414
        }, {
            x: -1.6411792039871216,
            y: -298.3565673828125,
            z: -31.315561294555664
        }, {
            x: -2.456144094467163,
            y: -296.3065185546875,
            z: -46.866024017333984
        }, {
            x: -3.2643771171569824,
            y: -293.44427490234375,
            z: -62.28802490234375
        }, {
            x: -4.063662528991699,
            y: -289.7777404785156,
            z: -77.53929901123047
        }, {
            x: -4.851809978485107,
            y: -285.31695556640625,
            z: -92.57804107666016
        }, {
            x: -5.626658916473389,
            y: -280.0741271972656,
            z: -107.36304473876953
        }, {
            x: -15.507484436035156,
            y: 46.93033981323242,
            z: -295.9004211425781
        }, {
            x: -15.357686042785645,
            y: 62.373504638671875,
            z: -293.0421142578125
        }, {
            x: -15.16579532623291,
            y: 77.64571380615234,
            z: -289.380615234375
        }, {
            x: -14.93233585357666,
            y: 92.7051010131836,
            z: -284.9259338378906
        }, {
            x: -14.657946586608887,
            y: 107.51038360595703,
            z: -279.6903076171875
        }, {
            x: -14.343381881713867,
            y: 122.02099609375,
            z: -273.6880187988281
        }, {
            x: -13.989503860473633,
            y: 136.1971435546875,
            z: -266.93560791015625
        }, {
            x: -13.59727954864502,
            y: 150,
            z: -259.4515686035156
        }, {
            x: -13.167787551879883,
            y: 163.39170837402344,
            z: -251.25636291503906
        }, {
            x: -12.702202796936035,
            y: 176.3355712890625,
            z: -242.37246704101562
        }, {
            x: -12.201802253723145,
            y: 188.79611206054688,
            z: -232.8242645263672
        }, {
            x: -10.505876541137695,
            y: 222.9434356689453,
            z: -200.4640655517578
        }, {
            x: -9.88082504272461,
            y: 233.143798828125,
            z: -188.53736877441406
        }, {
            x: -9.228690147399902,
            y: 242.70509338378906,
            z: -176.09390258789062
        }, {
            x: -8.551260948181152,
            y: 251.60116577148438,
            z: -163.16778564453125
        }, {
            x: -7.128007888793945,
            y: 267.3019714355469,
            z: -136.010498046875
        }, {
            x: 1.922791895321574E-15,
            y: -299.5888671875,
            z: -15.700786590576172
        }, {
            x: 3.8403135516453316E-15,
            y: -298.3565673828125,
            z: -31.358539581298828
        }, {
            x: 5.747309553050034E-15,
            y: -296.3065185546875,
            z: -46.93033981323242
        }, {
            x: 7.6385524357017E-15,
            y: -293.44427490234375,
            z: -62.373504638671875
        }, {
            x: 9.508857087413714E-15,
            y: -289.7777404785156,
            z: -77.64571380615234
        }, {
            x: 1.1353100229404608E-14,
            y: -285.31695556640625,
            z: -92.7051010131836
        }, {
            x: 1.3166225074979273E-14,
            y: -280.0741271972656,
            z: -107.51038360595703
        }, {
            x: 3.593656202152164E-14,
            y: 62.373504638671875,
            z: -293.44427490234375
        }, {
            x: 3.5487539691786765E-14,
            y: 77.64571380615234,
            z: -289.7777404785156
        }, {
            x: 3.4941254262784577E-14,
            y: 92.7051010131836,
            z: -285.31695556640625
        }, {
            x: 3.429918973623866E-14,
            y: 107.51038360595703,
            z: -280.0741271972656
        }, {
            x: 3.3563114716942885E-14,
            y: 122.02099609375,
            z: -274.0636291503906
        }, {
            x: 3.273505191957529E-14,
            y: 136.1971435546875,
            z: -267.3019714355469
        }, {
            x: 3.181725783990737E-14,
            y: 150,
            z: -259.8076171875
        }, {
            x: 3.081226002425372E-14,
            y: 163.39170837402344,
            z: -251.60116577148438
        }, {
            x: 2.972280285936345E-14,
            y: 176.3355712890625,
            z: -242.70509338378906
        }, {
            x: 2.855188145373805E-14,
            y: 188.79611206054688,
            z: -233.143798828125
        }, {
            x: 2.7302699285984035E-14,
            y: 200.7391815185547,
            z: -222.9434356689453
        }, {
            x: 2.5978683451405998E-14,
            y: 212.1320343017578,
            z: -212.1320343017578
        }, {
            x: 2.4583460945084082E-14,
            y: 222.9434356689453,
            z: -200.7391815185547
        }, {
            x: 2.3120856967808086E-14,
            y: 233.143798828125,
            z: -188.79611206054688
        }, {
            x: 2.1594881373550312E-14,
            y: 242.70509338378906,
            z: -176.3355712890625
        }, {
            x: 0.8217157125473022,
            y: -299.5888671875,
            z: -15.679269790649414
        }, {
            x: 1.6411792039871216,
            y: -298.3565673828125,
            z: -31.315561294555664
        }, {
            x: 2.456144094467163,
            y: -296.3065185546875,
            z: -46.866024017333984
        }, {
            x: 3.2643771171569824,
            y: -293.44427490234375,
            z: -62.28802490234375
        }, {
            x: 4.063662528991699,
            y: -289.7777404785156,
            z: -77.53929901123047
        }, {
            x: 4.851809978485107,
            y: -285.31695556640625,
            z: -92.57804107666016
        }, {
            x: 5.626658916473389,
            y: -280.0741271972656,
            z: -107.36304473876953
        }, {
            x: 15.507484436035156,
            y: 46.93033981323242,
            z: -295.9004211425781
        }, {
            x: 15.357686042785645,
            y: 62.373504638671875,
            z: -293.0421142578125
        }, {
            x: 15.16579532623291,
            y: 77.64571380615234,
            z: -289.380615234375
        }, {
            x: 14.93233585357666,
            y: 92.7051010131836,
            z: -284.9259338378906
        }, {
            x: 14.657946586608887,
            y: 107.51038360595703,
            z: -279.6903076171875
        }, {
            x: 14.343381881713867,
            y: 122.02099609375,
            z: -273.6880187988281
        }, {
            x: 13.989503860473633,
            y: 136.1971435546875,
            z: -266.93560791015625
        }, {
            x: 13.59727954864502,
            y: 150,
            z: -259.4515686035156
        }, {
            x: 13.167787551879883,
            y: 163.39170837402344,
            z: -251.25636291503906
        }, {
            x: 12.702202796936035,
            y: 176.3355712890625,
            z: -242.37246704101562
        }, {
            x: 12.201802253723145,
            y: 188.79611206054688,
            z: -232.8242645263672
        }, {
            x: 11.66795825958252,
            y: 200.7391815185547,
            z: -222.63790893554688
        }, {
            x: 11.102132797241211,
            y: 212.1320343017578,
            z: -211.84130859375
        }, {
            x: 10.505876541137695,
            y: 222.9434356689453,
            z: -200.4640655517578
        }, {
            x: 9.88082504272461,
            y: 233.143798828125,
            z: -188.53736877441406
        }, {
            x: 9.228690147399902,
            y: 242.70509338378906,
            z: -176.09390258789062
        }, {
            x: 8.551260948181152,
            y: 251.60116577148438,
            z: -163.16778564453125
        }, {
            x: 1.6411792039871216,
            y: -299.5888671875,
            z: -15.614776611328125
        }, {
            x: 3.277859926223755,
            y: -298.3565673828125,
            z: -31.18675422668457
        }, {
            x: 4.9055562019348145,
            y: -296.3065185546875,
            z: -46.67325210571289
        }, {
            x: 6.519806861877441,
            y: -293.44427490234375,
            z: -62.03181838989258
        }, {
            x: 8.11618709564209,
            y: -289.7777404785156,
            z: -77.2203598022461
        }, {
            x: 9.690321922302246,
            y: -285.31695556640625,
            z: -92.19725036621094
        }, {
            x: 11.237895965576172,
            y: -280.0741271972656,
            z: -106.92143249511719
        }, {
            x: 30.972463607788086,
            y: 46.93033981323242,
            z: -294.6833190917969
        }, {
            x: 30.67327880859375,
            y: 62.373504638671875,
            z: -291.8367614746094
        }, {
            x: 30.290023803710938,
            y: 77.64571380615234,
            z: -288.1903381347656
        }, {
            x: 29.82374382019043,
            y: 92.7051010131836,
            z: -283.75396728515625
        }, {
            x: 29.275718688964844,
            y: 107.51038360595703,
            z: -278.53985595703125
        }, {
            x: 28.647451400756836,
            y: 122.02099609375,
            z: -272.5622863769531
        }, {
            x: 27.940662384033203,
            y: 136.1971435546875,
            z: -265.837646484375
        }, {
            x: 27.15729331970215,
            y: 150,
            z: -258.3843688964844
        }, {
            x: 26.299484252929688,
            y: 163.39170837402344,
            z: -250.22288513183594
        }, {
            x: 25.369590759277344,
            y: 176.3355712890625,
            z: -241.37554931640625
        }, {
            x: 23.303937911987305,
            y: 200.7391815185547,
            z: -221.72213745117188
        }, {
            x: 22.17383575439453,
            y: 212.1320343017578,
            z: -210.96995544433594
        }, {
            x: 19.734567642211914,
            y: 233.143798828125,
            z: -187.76187133789062
        }, {
            x: 18.432086944580078,
            y: 242.70509338378906,
            z: -175.36959838867188
        }, {
            x: 17.079084396362305,
            y: 251.60116577148438,
            z: -162.49664306640625
        }, {
            x: 15.679269790649414,
            y: 259.8076171875,
            z: -149.17828369140625
        }, {
            x: 2.456144094467163,
            y: -299.5888671875,
            z: -15.507484436035156
        }, {
            x: 4.9055562019348145,
            y: -298.3565673828125,
            z: -30.972463607788086
        }, {
            x: 7.341522216796875,
            y: -296.3065185546875,
            z: -46.3525505065918
        }, {
            x: 9.757365226745605,
            y: -293.44427490234375,
            z: -61.6055908203125
        }, {
            x: 12.146465301513672,
            y: -289.7777404785156,
            z: -76.68976593017578
        }, {
            x: 14.50227165222168,
            y: -285.31695556640625,
            z: -91.56375122070312
        }, {
            x: 16.818328857421875,
            y: -280.0741271972656,
            z: -106.18675994873047
        }, {
            x: 46.35254669189453,
            y: 46.93033981323242,
            z: -292.6584777832031
        }, {
            x: 45.9047966003418,
            y: 62.373504638671875,
            z: -289.83148193359375
        }, {
            x: 45.33122634887695,
            y: 77.64571380615234,
            z: -286.2101135253906
        }, {
            x: 44.63340759277344,
            y: 92.7051010131836,
            z: -281.8042297363281
        }, {
            x: 43.8132438659668,
            y: 107.51038360595703,
            z: -276.6259460449219
        }, {
            x: 42.87299728393555,
            y: 122.02099609375,
            z: -270.689453125
        }, {
            x: 41.81523513793945,
            y: 136.1971435546875,
            z: -264.0110168457031
        }, {
            x: 40.64286422729492,
            y: 150,
            z: -256.60894775390625
        }, {
            x: 39.359092712402344,
            y: 163.39170837402344,
            z: -248.50355529785156
        }, {
            x: 37.96744155883789,
            y: 176.3355712890625,
            z: -239.7169952392578
        }, {
            x: 36.47172546386719,
            y: 188.79611206054688,
            z: -230.27340698242188
        }, {
            x: 34.87603759765625,
            y: 200.7391815185547,
            z: -220.1986541748047
        }, {
            x: 33.18476104736328,
            y: 212.1320343017578,
            z: -209.5203399658203
        }, {
            x: 25.560094833374023,
            y: 251.60116577148438,
            z: -161.38009643554688
        }, {
            x: 23.46516990661621,
            y: 259.8076171875,
            z: -148.15325927734375
        }, {
            x: 3.2643771171569824,
            y: -299.5888671875,
            z: -15.357686996459961
        }, {
            x: 6.519806861877441,
            y: -298.3565673828125,
            z: -30.67327880859375
        }, {
            x: 9.757365226745605,
            y: -296.3065185546875,
            z: -45.90480041503906
        }, {
            x: 12.968180656433105,
            y: -293.44427490234375,
            z: -61.010498046875
        }, {
            x: 16.143451690673828,
            y: -289.7777404785156,
            z: -75.948974609375
        }, {
            x: 19.274473190307617,
            y: -285.31695556640625,
            z: -90.67927551269531
        }, {
            x: 22.352664947509766,
            y: -280.0741271972656,
            z: -105.16102600097656
        }, {
            x: 61.60558319091797,
            y: 46.93033981323242,
            z: -289.83148193359375
        }, {
            x: 61.010498046875,
            y: 62.373504638671875,
            z: -287.0318298339844
        }, {
            x: 60.2481803894043,
            y: 77.64571380615234,
            z: -283.4454345703125
        }, {
            x: 59.32072830200195,
            y: 92.7051010131836,
            z: -279.08209228515625
        }, {
            x: 58.230682373046875,
            y: 107.51038360595703,
            z: -273.9538269042969
        }, {
            x: 56.98103332519531,
            y: 122.02099609375,
            z: -268.07470703125
        }, {
            x: 55.575199127197266,
            y: 136.1971435546875,
            z: -261.46075439453125
        }, {
            x: 54.01704025268555,
            y: 150,
            z: -254.1302032470703
        }, {
            x: 52.310821533203125,
            y: 163.39170837402344,
            z: -246.10308837890625
        }, {
            x: 50.46122360229492,
            y: 176.3355712890625,
            z: -237.4014129638672
        }, {
            x: 46.35254669189453,
            y: 200.7391815185547,
            z: -218.0716094970703
        }, {
            x: 44.10472869873047,
            y: 212.1320343017578,
            z: -207.49644470214844
        }, {
            x: 33.971046447753906,
            y: 251.60116577148438,
            z: -159.8212127685547
        }, {
            x: 4.063662528991699,
            y: -299.5888671875,
            z: -15.16579532623291
        }, {
            x: 8.11618709564209,
            y: -298.3565673828125,
            z: -30.290023803710938
        }, {
            x: 12.146465301513672,
            y: -296.3065185546875,
            z: -45.33122634887695
        }, {
            x: 16.143451690673828,
            y: -293.44427490234375,
            z: -60.2481803894043
        }, {
            x: 20.096189498901367,
            y: -289.7777404785156,
            z: -75
        }, {
            x: 23.99384307861328,
            y: -285.31695556640625,
            z: -89.5462417602539
        }, {
            x: 27.825735092163086,
            y: -280.0741271972656,
            z: -103.84706115722656
        }, {
            x: 75.94896697998047,
            y: 62.373504638671875,
            z: -283.4454040527344
        }, {
            x: 75,
            y: 77.64571380615234,
            z: -279.90380859375
        }, {
            x: 73.845458984375,
            y: 92.7051010131836,
            z: -275.5950012207031
        }, {
            x: 72.48851776123047,
            y: 107.51038360595703,
            z: -270.53082275390625
        }, {
            x: 70.93289184570312,
            y: 122.02099609375,
            z: -264.7251281738281
        }, {
            x: 69.1828384399414,
            y: 136.1971435546875,
            z: -258.19384765625
        }, {
            x: 67.24315643310547,
            y: 150,
            z: -250.95489501953125
        }, {
            x: 4.851809978485107,
            y: -299.5888671875,
            z: -14.93233585357666
        }, {
            x: 9.690321922302246,
            y: -298.3565673828125,
            z: -29.82374382019043
        }, {
            x: 14.502272605895996,
            y: -296.3065185546875,
            z: -44.63340759277344
        }, {
            x: 19.27447509765625,
            y: -293.44427490234375,
            z: -59.32073211669922
        }, {
            x: 23.993846893310547,
            y: -289.7777404785156,
            z: -73.84546661376953
        }, {
            x: 28.647451400756836,
            y: -285.31695556640625,
            z: -88.16778564453125
        }, {
            x: 33.2225341796875,
            y: -280.0741271972656,
            z: -102.24845123291016
        }, {
            x: 89.54625701904297,
            y: 77.64571380615234,
            z: -275.59503173828125
        }, {
            x: 88.16778564453125,
            y: 92.7051010131836,
            z: -271.3525695800781
        }, {
            x: 86.54766845703125,
            y: 107.51038360595703,
            z: -266.3663330078125
        }, {
            x: 84.69032287597656,
            y: 122.02099609375,
            z: -260.6499938964844
        }, {
            x: 82.6008529663086,
            y: 136.1971435546875,
            z: -254.21926879882812
        }, {
            x: 33.2225341796875,
            y: 280.0741271972656,
            z: -102.24845123291016
        }, {
            x: 9.690321922302246,
            y: 298.3565673828125,
            z: -29.82374382019043
        }, {
            x: 5.626658916473389,
            y: -299.5888671875,
            z: -14.657946586608887
        }, {
            x: 11.237895965576172,
            y: -298.3565673828125,
            z: -29.27571678161621
        }, {
            x: 16.818330764770508,
            y: -296.3065185546875,
            z: -43.8132438659668
        }, {
            x: 22.352664947509766,
            y: -293.44427490234375,
            z: -58.230682373046875
        }, {
            x: 27.825735092163086,
            y: -289.7777404785156,
            z: -72.48851776123047
        }, {
            x: 33.2225341796875,
            y: -285.31695556640625,
            z: -86.54766082763672
        }, {
            x: 38.52827453613281,
            y: 280.0741271972656,
            z: -100.36958312988281
        }, {
            x: 22.352664947509766,
            y: 293.44427490234375,
            z: -58.230682373046875
        }, {
            x: 16.818330764770508,
            y: 296.3065185546875,
            z: -43.8132438659668
        }, {
            x: 11.237895965576172,
            y: 298.3565673828125,
            z: -29.27571678161621
        }, {
            x: 6.386085510253906,
            y: -299.5888671875,
            z: -14.343381881713867
        }, {
            x: 12.754667282104492,
            y: -298.3565673828125,
            z: -28.647449493408203
        }, {
            x: 19.088289260864258,
            y: -296.3065185546875,
            z: -42.87299728393555
        }, {
            x: 25.369590759277344,
            y: -293.44427490234375,
            z: -56.98103332519531
        }, {
            x: 31.581357955932617,
            y: -289.7777404785156,
            z: -70.9328842163086
        }, {
            x: 37.70656204223633,
            y: -285.31695556640625,
            z: -84.69032287597656
        }, {
            x: 43.72841262817383,
            y: 280.0741271972656,
            z: -98.21562194824219
        }, {
            x: 25.369590759277344,
            y: 293.44427490234375,
            z: -56.98103332519531
        }, {
            x: 19.088289260864258,
            y: 296.3065185546875,
            z: -42.87299728393555
        }, {
            x: 12.754667282104492,
            y: 298.3565673828125,
            z: -28.647449493408203
        }, {
            x: 7.128007888793945,
            y: -299.5888671875,
            z: -13.989503860473633
        }, {
            x: 14.236477851867676,
            y: -298.3565673828125,
            z: -27.940662384033203
        }, {
            x: 21.30592918395996,
            y: -296.3065185546875,
            z: -41.81523895263672
        }, {
            x: 28.316978454589844,
            y: -293.44427490234375,
            z: -55.575199127197266
        }, {
            x: 35.25041580200195,
            y: -289.7777404785156,
            z: -69.1828384399414
        }, {
            x: 42.08723449707031,
            y: -285.31695556640625,
            z: -82.60084533691406
        }, {
            x: 129.53118896484375,
            y: 92.7051010131836,
            z: -254.21926879882812
        }, {
            x: 48.808692932128906,
            y: 280.0741271972656,
            z: -95.7924575805664
        }, {
            x: 42.08723449707031,
            y: 285.31695556640625,
            z: -82.60084533691406
        }, {
            x: 35.25041580200195,
            y: 289.7777404785156,
            z: -69.1828384399414
        }, {
            x: 28.316978454589844,
            y: 293.44427490234375,
            z: -55.575199127197266
        }, {
            x: 21.30592918395996,
            y: 296.3065185546875,
            z: -41.81523895263672
        }, {
            x: 14.236477851867676,
            y: 298.3565673828125,
            z: -27.940662384033203
        }, {
            x: 7.850393295288086,
            y: -299.5888671875,
            z: -13.59727954864502
        }, {
            x: 15.679269790649414,
            y: -298.3565673828125,
            z: -27.157289505004883
        }, {
            x: 23.46516990661621,
            y: -296.3065185546875,
            z: -40.64286422729492
        }, {
            x: 31.186752319335938,
            y: -293.44427490234375,
            z: -54.01704025268555
        }, {
            x: 38.82285690307617,
            y: -289.7777404785156,
            z: -67.24315643310547
        }, {
            x: 88.16778564453125,
            y: -242.70509338378906,
            z: -152.71109008789062
        }, {
            x: 46.3525505065918,
            y: 285.31695556640625,
            z: -80.28497314453125
        }, {
            x: 38.82285690307617,
            y: 289.7777404785156,
            z: -67.24315643310547
        }, {
            x: 31.186752319335938,
            y: 293.44427490234375,
            z: -54.01704025268555
        }, {
            x: 23.46516990661621,
            y: 296.3065185546875,
            z: -40.64286422729492
        }, {
            x: 15.679269790649414,
            y: 298.3565673828125,
            z: -27.157289505004883
        }, {
            x: 8.551261901855469,
            y: -299.5888671875,
            z: -13.167787551879883
        }, {
            x: 17.079084396362305,
            y: -298.3565673828125,
            z: -26.299484252929688
        }, {
            x: 25.560094833374023,
            y: -296.3065185546875,
            z: -39.359092712402344
        }, {
            x: 33.97105026245117,
            y: -293.44427490234375,
            z: -52.310821533203125
        }, {
            x: 42.28888702392578,
            y: -289.7777404785156,
            z: -65.11917877197266
        }, {
            x: 50.49081802368164,
            y: 285.31695556640625,
            z: -77.74903106689453
        }, {
            x: 42.28888702392578,
            y: 289.7777404785156,
            z: -65.11917877197266
        }, {
            x: 33.97105026245117,
            y: 293.44427490234375,
            z: -52.310821533203125
        }, {
            x: 25.560094833374023,
            y: 296.3065185546875,
            z: -39.359092712402344
        }, {
            x: 17.079084396362305,
            y: 298.3565673828125,
            z: -26.299484252929688
        }, {
            x: 9.228691101074219,
            y: -299.5888671875,
            z: -12.702202796936035
        }, {
            x: 18.432086944580078,
            y: -298.3565673828125,
            z: -25.369590759277344
        }, {
            x: 27.5849609375,
            y: -296.3065185546875,
            z: -37.96744155883789
        }, {
            x: 36.662227630615234,
            y: -293.44427490234375,
            z: -50.46123123168945
        }, {
            x: 45.639007568359375,
            y: -289.7777404785156,
            z: -62.81669998168945
        }, {
            x: 54.49068832397461,
            y: 285.31695556640625,
            z: -75
        }, {
            x: 45.639007568359375,
            y: 289.7777404785156,
            z: -62.81669998168945
        }, {
            x: 36.662227630615234,
            y: 293.44427490234375,
            z: -50.46123123168945
        }, {
            x: 27.5849609375,
            y: 296.3065185546875,
            z: -37.96744155883789
        }, {
            x: 18.432086944580078,
            y: 298.3565673828125,
            z: -25.369590759277344
        }, {
            x: 9.88082504272461,
            y: -299.5888671875,
            z: -12.201803207397461
        }, {
            x: 19.734567642211914,
            y: -298.3565673828125,
            z: -24.370162963867188
        }, {
            x: 29.53421974182129,
            y: -296.3065185546875,
            z: -36.47172546386719
        }, {
            x: 39.2529182434082,
            y: -293.44427490234375,
            z: -48.47332000732422
        }, {
            x: 48.86403274536133,
            y: -289.7777404785156,
            z: -60.3420524597168
        }, {
            x: 118.81324005126953,
            y: -233.143798828125,
            z: -146.72213745117188
        }, {
            x: 187.76187133789062,
            y: -31.358539581298828,
            z: -231.8666229248047
        }, {
            x: 188.53736877441406,
            y: -15.700786590576172,
            z: -232.8242645263672
        }, {
            x: 67.65847778320312,
            y: 280.0741271972656,
            z: -83.55126953125
        }, {
            x: 58.34120559692383,
            y: 285.31695556640625,
            z: -72.04539489746094
        }, {
            x: 48.86403274536133,
            y: 289.7777404785156,
            z: -60.3420524597168
        }, {
            x: 39.2529182434082,
            y: 293.44427490234375,
            z: -48.47332000732422
        }, {
            x: 29.53421974182129,
            y: 296.3065185546875,
            z: -36.47172546386719
        }, {
            x: 19.734567642211914,
            y: 298.3565673828125,
            z: -24.370162963867188
        }, {
            x: 10.505877494812012,
            y: -299.5888671875,
            z: -11.66795825958252
        }, {
            x: 20.982959747314453,
            y: -298.3565673828125,
            z: -23.30393409729004
        }, {
            x: 31.40252685546875,
            y: -296.3065185546875,
            z: -34.87603759765625
        }, {
            x: 41.73602294921875,
            y: -293.44427490234375,
            z: -46.3525505065918
        }, {
            x: 51.95512771606445,
            y: -289.7777404785156,
            z: -57.70201110839844
        }, {
            x: 193.89915466308594,
            y: -77.64571380615234,
            z: -215.34683227539062
        }, {
            x: 196.35255432128906,
            y: -62.373504638671875,
            z: -218.0715789794922
        }, {
            x: 198.2677459716797,
            y: -46.93033981323242,
            z: -220.19863891601562
        }, {
            x: 199.63951110839844,
            y: -31.358539581298828,
            z: -221.72213745117188
        }, {
            x: 200.46408081054688,
            y: -15.700786590576172,
            z: -222.63790893554688
        }, {
            x: 200.7391815185547,
            y: 0,
            z: -222.9434356689453
        }, {
            x: 71.93849182128906,
            y: 280.0741271972656,
            z: -79.89578247070312
        }, {
            x: 62.03181838989258,
            y: 285.31695556640625,
            z: -68.893310546875
        }, {
            x: 51.95512771606445,
            y: 289.7777404785156,
            z: -57.70201110839844
        }, {
            x: 41.73602294921875,
            y: 293.44427490234375,
            z: -46.3525505065918
        }, {
            x: 31.40252685546875,
            y: 296.3065185546875,
            z: -34.87603759765625
        }, {
            x: 20.982959747314453,
            y: 298.3565673828125,
            z: -23.30393409729004
        }, {
            x: 11.102132797241211,
            y: -299.5888671875,
            z: -11.102132797241211
        }, {
            x: 22.17383575439453,
            y: -298.3565673828125,
            z: -22.17383575439453
        }, {
            x: 33.18476104736328,
            y: -296.3065185546875,
            z: -33.18476104736328
        }, {
            x: 44.10472869873047,
            y: -293.44427490234375,
            z: -44.10472869873047
        }, {
            x: 54.90380859375,
            y: -289.7777404785156,
            z: -54.90380859375
        }, {
            x: 201.7495574951172,
            y: -92.7051010131836,
            z: -201.7495574951172
        }, {
            x: 204.90379333496094,
            y: -77.64571380615234,
            z: -204.90379333496094
        }, {
            x: 207.49644470214844,
            y: -62.373504638671875,
            z: -207.49644470214844
        }, {
            x: 209.52032470703125,
            y: -46.93033981323242,
            z: -209.52032470703125
        }, {
            x: 210.96995544433594,
            y: -31.358539581298828,
            z: -210.96995544433594
        }, {
            x: 211.84130859375,
            y: -15.700786590576172,
            z: -211.84130859375
        }, {
            x: 212.1320343017578,
            y: 0,
            z: -212.1320343017578
        }, {
            x: 86.28187561035156,
            y: 274.0636291503906,
            z: -86.28187561035156
        }, {
            x: 76.02132415771484,
            y: 280.0741271972656,
            z: -76.02132415771484
        }, {
            x: 65.55239868164062,
            y: 285.31695556640625,
            z: -65.55239868164062
        }, {
            x: 54.90380859375,
            y: 289.7777404785156,
            z: -54.90380859375
        }, {
            x: 44.10472869873047,
            y: 293.44427490234375,
            z: -44.10472869873047
        }, {
            x: 33.18476104736328,
            y: 296.3065185546875,
            z: -33.18476104736328
        }, {
            x: 22.17383575439453,
            y: 298.3565673828125,
            z: -22.17383575439453
        }, {
            x: 11.66795825958252,
            y: -299.5888671875,
            z: -10.505877494812012
        }, {
            x: 23.30393409729004,
            y: -298.3565673828125,
            z: -20.982959747314453
        }, {
            x: 34.87603759765625,
            y: -296.3065185546875,
            z: -31.40252685546875
        }, {
            x: 46.3525505065918,
            y: -293.44427490234375,
            z: -41.73602294921875
        }, {
            x: 57.70201110839844,
            y: -289.7777404785156,
            z: -51.95512771606445
        }, {
            x: 212.03179931640625,
            y: -92.7051010131836,
            z: -190.914306640625
        }, {
            x: 215.34683227539062,
            y: -77.64571380615234,
            z: -193.89915466308594
        }, {
            x: 218.0715789794922,
            y: -62.373504638671875,
            z: -196.35255432128906
        }, {
            x: 220.19863891601562,
            y: -46.93033981323242,
            z: -198.2677459716797
        }, {
            x: 221.72213745117188,
            y: -31.358539581298828,
            z: -199.63951110839844
        }, {
            x: 222.63790893554688,
            y: -15.700786590576172,
            z: -200.46408081054688
        }, {
            x: 222.9434356689453,
            y: 0,
            z: -200.7391815185547
        }, {
            x: 101.21420288085938,
            y: 267.3019714355469,
            z: -91.13368225097656
        }, {
            x: 90.67926025390625,
            y: 274.0636291503906,
            z: -81.64797973632812
        }, {
            x: 79.89578247070312,
            y: 280.0741271972656,
            z: -71.93849182128906
        }, {
            x: 68.893310546875,
            y: 285.31695556640625,
            z: -62.03181838989258
        }, {
            x: 57.70201110839844,
            y: 289.7777404785156,
            z: -51.95512771606445
        }, {
            x: 46.3525505065918,
            y: 293.44427490234375,
            z: -41.73602294921875
        }, {
            x: 34.87603759765625,
            y: 296.3065185546875,
            z: -31.40252685546875
        }, {
            x: 23.30393409729004,
            y: 298.3565673828125,
            z: -20.982959747314453
        }, {
            x: 12.201803207397461,
            y: -299.5888671875,
            z: -9.88082504272461
        }, {
            x: 24.370162963867188,
            y: -298.3565673828125,
            z: -19.734567642211914
        }, {
            x: 36.47172546386719,
            y: -296.3065185546875,
            z: -29.53421974182129
        }, {
            x: 48.47332000732422,
            y: -293.44427490234375,
            z: -39.2529182434082
        }, {
            x: 60.3420524597168,
            y: -289.7777404785156,
            z: -48.86403274536133
        }, {
            x: 212.98745727539062,
            y: -122.02099609375,
            z: -172.4738311767578
        }, {
            x: 217.6584930419922,
            y: -107.51038360595703,
            z: -176.25636291503906
        }, {
            x: 221.73292541503906,
            y: -92.7051010131836,
            z: -179.5557861328125
        }, {
            x: 225.19961547851562,
            y: -77.64571380615234,
            z: -182.36305236816406
        }, {
            x: 228.04904174804688,
            y: -62.373504638671875,
            z: -184.67047119140625
        }, {
            x: 230.27340698242188,
            y: -46.93033981323242,
            z: -186.47171020507812
        }, {
            x: 231.8666229248047,
            y: -31.358539581298828,
            z: -187.76187133789062
        }, {
            x: 232.8242645263672,
            y: -15.700786590576172,
            z: -188.53736877441406
        }, {
            x: 233.143798828125,
            y: 0,
            z: -188.79611206054688
        }, {
            x: 232.8242645263672,
            y: 15.700786590576172,
            z: -188.53736877441406
        }, {
            x: 94.828125,
            y: 274.0636291503906,
            z: -76.79029083251953
        }, {
            x: 83.55126953125,
            y: 280.0741271972656,
            z: -67.65847778320312
        }, {
            x: 72.04539489746094,
            y: 285.31695556640625,
            z: -58.34120559692383
        }, {
            x: 60.3420524597168,
            y: 289.7777404785156,
            z: -48.86403274536133
        }, {
            x: 48.47332000732422,
            y: 293.44427490234375,
            z: -39.2529182434082
        }, {
            x: 36.47172546386719,
            y: 296.3065185546875,
            z: -29.53421974182129
        }, {
            x: 24.370162963867188,
            y: 298.3565673828125,
            z: -19.734567642211914
        }, {
            x: 12.702202796936035,
            y: -299.5888671875,
            z: -9.228691101074219
        }, {
            x: 25.369590759277344,
            y: -298.3565673828125,
            z: -18.432086944580078
        }, {
            x: 37.96744155883789,
            y: -296.3065185546875,
            z: -27.5849609375
        }, {
            x: 50.46123123168945,
            y: -293.44427490234375,
            z: -36.662227630615234
        }, {
            x: 62.81669998168945,
            y: -289.7777404785156,
            z: -45.639007568359375
        }, {
            x: 216.2518310546875,
            y: -136.1971435546875,
            z: -157.11614990234375
        }, {
            x: 221.72213745117188,
            y: -122.02099609375,
            z: -161.09056091308594
        }, {
            x: 226.58473205566406,
            y: -107.51038360595703,
            z: -164.62344360351562
        }, {
            x: 230.82627868652344,
            y: -92.7051010131836,
            z: -167.70509338378906
        }, {
            x: 234.43511962890625,
            y: -77.64571380615234,
            z: -170.32708740234375
        }, {
            x: 237.4014129638672,
            y: -62.373504638671875,
            z: -172.4822235107422
        }, {
            x: 239.7169952392578,
            y: -46.93033981323242,
            z: -174.1645965576172
        }, {
            x: 241.3755340576172,
            y: -31.358539581298828,
            z: -175.3695831298828
        }, {
            x: 242.3724822998047,
            y: -15.700786590576172,
            z: -176.09390258789062
        }, {
            x: 242.70509338378906,
            y: 0,
            z: -176.3355712890625
        }, {
            x: 242.3724822998047,
            y: 15.700786590576172,
            z: -176.09390258789062
        }, {
            x: 241.3755340576172,
            y: 31.358539581298828,
            z: -175.3695831298828
        }, {
            x: 98.71705627441406,
            y: 274.0636291503906,
            z: -71.72213745117188
        }, {
            x: 86.97772979736328,
            y: 280.0741271972656,
            z: -63.19301986694336
        }, {
            x: 75,
            y: 285.31695556640625,
            z: -54.49068832397461
        }, {
            x: 62.81669998168945,
            y: 289.7777404785156,
            z: -45.639007568359375
        }, {
            x: 50.46123123168945,
            y: 293.44427490234375,
            z: -36.662227630615234
        }, {
            x: 37.96744155883789,
            y: 296.3065185546875,
            z: -27.5849609375
        }, {
            x: 25.369590759277344,
            y: 298.3565673828125,
            z: -18.432086944580078
        }, {
            x: 13.167787551879883,
            y: -299.5888671875,
            z: -8.551261901855469
        }, {
            x: 26.299484252929688,
            y: -298.3565673828125,
            z: -17.079084396362305
        }, {
            x: 39.359092712402344,
            y: -296.3065185546875,
            z: -25.560094833374023
        }, {
            x: 52.310821533203125,
            y: -293.44427490234375,
            z: -33.97105026245117
        }, {
            x: 65.11917877197266,
            y: -289.7777404785156,
            z: -42.28888702392578
        }, {
            x: 217.89300537109375,
            y: -150,
            z: -141.50137329101562
        }, {
            x: 224.17828369140625,
            y: -136.1971435546875,
            z: -145.5830841064453
        }, {
            x: 229.84909057617188,
            y: -122.02099609375,
            z: -149.26576232910156
        }, {
            x: 234.88992309570312,
            y: -107.51038360595703,
            z: -152.539306640625
        }, {
            x: 239.28692626953125,
            y: -92.7051010131836,
            z: -155.39476013183594
        }, {
            x: 243.02806091308594,
            y: -77.64571380615234,
            z: -157.8242645263672
        }, {
            x: 246.10308837890625,
            y: -62.373504638671875,
            z: -159.8212127685547
        }, {
            x: 248.5035400390625,
            y: -46.93033981323242,
            z: -161.38009643554688
        }, {
            x: 250.22286987304688,
            y: -31.358539581298828,
            z: -162.49664306640625
        }, {
            x: 251.25636291503906,
            y: -15.700786590576172,
            z: -163.16778564453125
        }, {
            x: 251.60116577148438,
            y: 0,
            z: -163.39170837402344
        }, {
            x: 251.25636291503906,
            y: 15.700786590576172,
            z: -163.16778564453125
        }, {
            x: 250.22286987304688,
            y: 31.358539581298828,
            z: -162.49664306640625
        }, {
            x: 248.5035400390625,
            y: 46.93033981323242,
            z: -161.38009643554688
        }, {
            x: 158.33773803710938,
            y: 233.143798828125,
            z: -102.82573699951172
        }, {
            x: 90.1657943725586,
            y: 280.0741271972656,
            z: -58.554351806640625
        }, {
            x: 77.74903106689453,
            y: 285.31695556640625,
            z: -50.49081802368164
        }, {
            x: 65.11917877197266,
            y: 289.7777404785156,
            z: -42.28888702392578
        }, {
            x: 52.310821533203125,
            y: 293.44427490234375,
            z: -33.97105026245117
        }, {
            x: 39.359092712402344,
            y: 296.3065185546875,
            z: -25.560094833374023
        }, {
            x: 26.299484252929688,
            y: 298.3565673828125,
            z: -17.079084396362305
        }, {
            x: 13.59727954864502,
            y: -299.5888671875,
            z: -7.850393295288086
        }, {
            x: 27.157289505004883,
            y: -298.3565673828125,
            z: -15.679269790649414
        }, {
            x: 40.64286422729492,
            y: -296.3065185546875,
            z: -23.46516990661621
        }, {
            x: 54.01704025268555,
            y: -293.44427490234375,
            z: -31.186752319335938
        }, {
            x: 67.24315643310547,
            y: -289.7777404785156,
            z: -38.82285690307617
        }, {
            x: 129.90380859375,
            y: -259.8076171875,
            z: -75
        }, {
            x: 217.89300537109375,
            y: -163.39170837402344,
            z: -125.80058288574219
        }, {
            x: 225,
            y: -150,
            z: -129.90380859375
        }, {
            x: 231.4902801513672,
            y: -136.1971435546875,
            z: -133.65098571777344
        }, {
            x: 237.3460693359375,
            y: -122.02099609375,
            z: -137.0318145751953
        }, {
            x: 242.55130004882812,
            y: -107.51038360595703,
            z: -140.0370635986328
        }, {
            x: 247.09173583984375,
            y: -92.7051010131836,
            z: -142.65847778320312
        }, {
            x: 250.9548797607422,
            y: -77.64571380615234,
            z: -144.8888702392578
        }, {
            x: 254.1302032470703,
            y: -62.373504638671875,
            z: -146.72213745117188
        }, {
            x: 256.60894775390625,
            y: -46.93033981323242,
            z: -148.15325927734375
        }, {
            x: 258.3843688964844,
            y: -31.358539581298828,
            z: -149.17828369140625
        }, {
            x: 259.4515686035156,
            y: -15.700786590576172,
            z: -149.79443359375
        }, {
            x: 259.8076171875,
            y: 0,
            z: -150
        }, {
            x: 259.4515686035156,
            y: 15.700786590576172,
            z: -149.79443359375
        }, {
            x: 258.3843688964844,
            y: 31.358539581298828,
            z: -149.17828369140625
        }, {
            x: 256.60894775390625,
            y: 46.93033981323242,
            z: -148.15325927734375
        }, {
            x: 163.50222778320312,
            y: 233.143798828125,
            z: -94.39805603027344
        }, {
            x: 152.71109008789062,
            y: 242.70509338378906,
            z: -88.16778564453125
        }, {
            x: 141.50137329101562,
            y: 251.60116577148438,
            z: -81.69585418701172
        }, {
            x: 54.01704025268555,
            y: 293.44427490234375,
            z: -31.186752319335938
        }, {
            x: 40.64286422729492,
            y: 296.3065185546875,
            z: -23.46516990661621
        }, {
            x: 27.157289505004883,
            y: 298.3565673828125,
            z: -15.679269790649414
        }, {
            x: 13.989503860473633,
            y: -299.5888671875,
            z: -7.128007888793945
        }, {
            x: 27.940662384033203,
            y: -298.3565673828125,
            z: -14.236477851867676
        }, {
            x: 41.81523895263672,
            y: -296.3065185546875,
            z: -21.30592918395996
        }, {
            x: 55.575199127197266,
            y: -293.44427490234375,
            z: -28.316978454589844
        }, {
            x: 69.1828384399414,
            y: -289.7777404785156,
            z: -35.25041580200195
        }, {
            x: 82.60084533691406,
            y: -285.31695556640625,
            z: -42.08723449707031
        }, {
            x: 95.7924575805664,
            y: -280.0741271972656,
            z: -48.808692932128906
        }, {
            x: 108.72150421142578,
            y: -274.0636291503906,
            z: -55.39636993408203
        }, {
            x: 121.35254669189453,
            y: -267.3019714355469,
            z: -61.832210540771484
        }, {
            x: 133.65098571777344,
            y: -259.8076171875,
            z: -68.09857177734375
        }, {
            x: 216.2518310546875,
            y: -176.3355712890625,
            z: -110.18580627441406
        }, {
            x: 224.17828369140625,
            y: -163.39170837402344,
            z: -114.22453308105469
        }, {
            x: 231.4902801513672,
            y: -150,
            z: -117.95018768310547
        }, {
            x: 238.16778564453125,
            y: -136.1971435546875,
            z: -121.35254669189453
        }, {
            x: 244.19248962402344,
            y: -122.02099609375,
            z: -124.42228698730469
        }, {
            x: 249.54788208007812,
            y: -107.51038360595703,
            z: -127.15099334716797
        }, {
            x: 254.21926879882812,
            y: -92.7051010131836,
            z: -129.53118896484375
        }, {
            x: 258.1938781738281,
            y: -77.64571380615234,
            z: -131.5563507080078
        }, {
            x: 261.46075439453125,
            y: -62.373504638671875,
            z: -133.22091674804688
        }, {
            x: 264.0110168457031,
            y: -46.93033981323242,
            z: -134.5203399658203
        }, {
            x: 265.837646484375,
            y: -31.358539581298828,
            z: -135.4510498046875
        }, {
            x: 266.93560791015625,
            y: -15.700786590576172,
            z: -136.010498046875
        }, {
            x: 267.3019714355469,
            y: 0,
            z: -136.1971435546875
        }, {
            x: 266.93560791015625,
            y: 15.700786590576172,
            z: -136.010498046875
        }, {
            x: 265.837646484375,
            y: 31.358539581298828,
            z: -135.4510498046875
        }, {
            x: 264.0110168457031,
            y: 46.93033981323242,
            z: -134.5203399658203
        }, {
            x: 261.46075439453125,
            y: 62.373504638671875,
            z: -133.22091674804688
        }, {
            x: 157.11614990234375,
            y: 242.70509338378906,
            z: -80.05467987060547
        }, {
            x: 145.5830841064453,
            y: 251.60116577148438,
            z: -74.17828369140625
        }, {
            x: 41.81523895263672,
            y: 296.3065185546875,
            z: -21.30592918395996
        }, {
            x: 27.940662384033203,
            y: 298.3565673828125,
            z: -14.236477851867676
        }, {
            x: 14.343381881713867,
            y: -299.5888671875,
            z: -6.386085510253906
        }, {
            x: 28.647449493408203,
            y: -298.3565673828125,
            z: -12.754667282104492
        }, {
            x: 42.87299728393555,
            y: -296.3065185546875,
            z: -19.088289260864258
        }, {
            x: 56.98103332519531,
            y: -293.44427490234375,
            z: -25.369590759277344
        }, {
            x: 70.9328842163086,
            y: -289.7777404785156,
            z: -31.581357955932617
        }, {
            x: 84.69032287597656,
            y: -285.31695556640625,
            z: -37.70656204223633
        }, {
            x: 98.21562194824219,
            y: -280.0741271972656,
            z: -43.72841262817383
        }, {
            x: 111.47171783447266,
            y: -274.0636291503906,
            z: -49.630409240722656
        }, {
            x: 124.42228698730469,
            y: -267.3019714355469,
            z: -55.3963737487793
        }, {
            x: 221.7221221923828,
            y: -176.3355712890625,
            z: -98.71705627441406
        }, {
            x: 229.84909057617188,
            y: -163.39170837402344,
            z: -102.33541107177734
        }, {
            x: 237.3460693359375,
            y: -150,
            z: -105.67327880859375
        }, {
            x: 244.19247436523438,
            y: -136.1971435546875,
            z: -108.72150421142578
        }, {
            x: 250.3695831298828,
            y: -122.02099609375,
            z: -111.47171783447266
        }, {
            x: 255.86044311523438,
            y: -107.51038360595703,
            z: -113.91641235351562
        }, {
            x: 260.6499938964844,
            y: -92.7051010131836,
            z: -116.04885864257812
        }, {
            x: 264.7251281738281,
            y: -77.64571380615234,
            z: -117.86322784423828
        }, {
            x: 268.0746765136719,
            y: -62.373504638671875,
            z: -119.35453796386719
        }, {
            x: 270.689453125,
            y: -46.93033981323242,
            z: -120.51871490478516
        }, {
            x: 272.5622863769531,
            y: -31.358539581298828,
            z: -121.35254669189453
        }, {
            x: 273.6880187988281,
            y: -15.700786590576172,
            z: -121.85376739501953
        }, {
            x: 274.0636291503906,
            y: 0,
            z: -122.02099609375
        }, {
            x: 273.6880187988281,
            y: 15.700786590576172,
            z: -121.85376739501953
        }, {
            x: 272.5622863769531,
            y: 31.358539581298828,
            z: -121.35254669189453
        }, {
            x: 270.689453125,
            y: 46.93033981323242,
            z: -120.51871490478516
        }, {
            x: 268.0746765136719,
            y: 62.373504638671875,
            z: -119.35453796386719
        }, {
            x: 183.38436889648438,
            y: 222.9434356689453,
            z: -81.64797973632812
        }, {
            x: 161.09056091308594,
            y: 242.70509338378906,
            z: -71.72213745117188
        }, {
            x: 149.2657470703125,
            y: 251.60116577148438,
            z: -66.4573974609375
        }, {
            x: 137.0318145751953,
            y: 259.8076171875,
            z: -61.010498046875
        }, {
            x: 98.21562194824219,
            y: 280.0741271972656,
            z: -43.72841262817383
        }, {
            x: 42.87299728393555,
            y: 296.3065185546875,
            z: -19.088289260864258
        }, {
            x: 28.647449493408203,
            y: 298.3565673828125,
            z: -12.754667282104492
        }, {
            x: 14.657946586608887,
            y: -299.5888671875,
            z: -5.626658916473389
        }, {
            x: 29.27571678161621,
            y: -298.3565673828125,
            z: -11.237895965576172
        }, {
            x: 43.8132438659668,
            y: -296.3065185546875,
            z: -16.818330764770508
        }, {
            x: 58.230682373046875,
            y: -293.44427490234375,
            z: -22.352664947509766
        }, {
            x: 72.48851776123047,
            y: -289.7777404785156,
            z: -27.825735092163086
        }, {
            x: 86.54766082763672,
            y: -285.31695556640625,
            z: -33.2225341796875
        }, {
            x: 100.36958312988281,
            y: -280.0741271972656,
            z: -38.52827453613281
        }, {
            x: 113.9164047241211,
            y: -274.0636291503906,
            z: -43.72841262817383
        }, {
            x: 127.15098571777344,
            y: -267.3019714355469,
            z: -48.808692932128906
        }, {
            x: 198.0423126220703,
            y: -212.1320343017578,
            z: -76.02132415771484
        }, {
            x: 208.13563537597656,
            y: -200.7391815185547,
            z: -79.89578247070312
        }, {
            x: 217.65847778320312,
            y: -188.79611206054688,
            z: -83.55125427246094
        }, {
            x: 226.584716796875,
            y: -176.3355712890625,
            z: -86.97772979736328
        }, {
            x: 234.88990783691406,
            y: -163.39170837402344,
            z: -90.16580200195312
        }, {
            x: 242.55130004882812,
            y: -150,
            z: -93.10672760009766
        }, {
            x: 249.54786682128906,
            y: -136.1971435546875,
            z: -95.7924575805664
        }, {
            x: 255.86044311523438,
            y: -122.02099609375,
            z: -98.21562957763672
        }, {
            x: 261.4717102050781,
            y: -107.51038360595703,
            z: -100.36959075927734
        }, {
            x: 266.3663024902344,
            y: -92.7051010131836,
            z: -102.24845123291016
        }, {
            x: 270.53082275390625,
            y: -77.64571380615234,
            z: -103.84706115722656
        }, {
            x: 273.9538269042969,
            y: -62.373504638671875,
            z: -105.16102600097656
        }, {
            x: 276.6259460449219,
            y: -46.93033981323242,
            z: -106.18675231933594
        }, {
            x: 278.53985595703125,
            y: -31.358539581298828,
            z: -106.92143249511719
        }, {
            x: 279.6903076171875,
            y: -15.700786590576172,
            z: -107.36304473876953
        }, {
            x: 280.0741271972656,
            y: 0,
            z: -107.51038360595703
        }, {
            x: 279.6903076171875,
            y: 15.700786590576172,
            z: -107.36304473876953
        }, {
            x: 278.53985595703125,
            y: 31.358539581298828,
            z: -106.92143249511719
        }, {
            x: 276.6259460449219,
            y: 46.93033981323242,
            z: -106.18675231933594
        }, {
            x: 273.9538269042969,
            y: 62.373504638671875,
            z: -105.16102600097656
        }, {
            x: 261.4717102050781,
            y: 107.51038360595703,
            z: -100.36959075927734
        }, {
            x: 187.40615844726562,
            y: 222.9434356689453,
            z: -71.93849182128906
        }, {
            x: 176.25636291503906,
            y: 233.143798828125,
            z: -67.65847778320312
        }, {
            x: 164.62344360351562,
            y: 242.70509338378906,
            z: -63.19301986694336
        }, {
            x: 152.539306640625,
            y: 251.60116577148438,
            z: -58.554351806640625
        }, {
            x: 140.0370635986328,
            y: 259.8076171875,
            z: -53.755191802978516
        }, {
            x: 113.9164047241211,
            y: 274.0636291503906,
            z: -43.72841262817383
        }, {
            x: 100.36958312988281,
            y: 280.0741271972656,
            z: -38.52827453613281
        }, {
            x: 43.8132438659668,
            y: 296.3065185546875,
            z: -16.818330764770508
        }, {
            x: 29.27571678161621,
            y: 298.3565673828125,
            z: -11.237895965576172
        }, {
            x: 14.93233585357666,
            y: -299.5888671875,
            z: -4.851809978485107
        }, {
            x: 29.82374382019043,
            y: -298.3565673828125,
            z: -9.690321922302246
        }, {
            x: 44.63340759277344,
            y: -296.3065185546875,
            z: -14.502272605895996
        }, {
            x: 59.32073211669922,
            y: -293.44427490234375,
            z: -19.27447509765625
        }, {
            x: 73.84546661376953,
            y: -289.7777404785156,
            z: -23.993846893310547
        }, {
            x: 88.16778564453125,
            y: -285.31695556640625,
            z: -28.647451400756836
        }, {
            x: 102.24845123291016,
            y: -280.0741271972656,
            z: -33.2225341796875
        }, {
            x: 116.04886627197266,
            y: -274.0636291503906,
            z: -37.70656204223633
        }, {
            x: 179.5557861328125,
            y: -233.143798828125,
            z: -58.341209411621094
        }, {
            x: 190.914306640625,
            y: -222.9434356689453,
            z: -62.03181838989258
        }, {
            x: 201.7495574951172,
            y: -212.1320343017578,
            z: -65.55240631103516
        }, {
            x: 212.03182983398438,
            y: -200.7391815185547,
            z: -68.89331817626953
        }, {
            x: 221.73292541503906,
            y: -188.79611206054688,
            z: -72.04539489746094
        }, {
            x: 230.82627868652344,
            y: -176.3355712890625,
            z: -75
        }, {
            x: 239.2869415283203,
            y: -163.39170837402344,
            z: -77.74903869628906
        }, {
            x: 247.09173583984375,
            y: -150,
            z: -80.28497314453125
        }, {
            x: 254.21926879882812,
            y: -136.1971435546875,
            z: -82.6008529663086
        }, {
            x: 260.6499938964844,
            y: -122.02099609375,
            z: -84.69032287597656
        }, {
            x: 266.3663330078125,
            y: -107.51038360595703,
            z: -86.54766845703125
        }, {
            x: 271.3525695800781,
            y: -92.7051010131836,
            z: -88.16778564453125
        }, {
            x: 275.59503173828125,
            y: -77.64571380615234,
            z: -89.54625701904297
        }, {
            x: 279.08209228515625,
            y: -62.373504638671875,
            z: -90.67927551269531
        }, {
            x: 281.8042297363281,
            y: -46.93033981323242,
            z: -91.56375122070312
        }, {
            x: 283.75396728515625,
            y: -31.358539581298828,
            z: -92.19725036621094
        }, {
            x: 284.92596435546875,
            y: -15.700786590576172,
            z: -92.57805633544922
        }, {
            x: 285.31695556640625,
            y: 0,
            z: -92.7051010131836
        }, {
            x: 284.92596435546875,
            y: 15.700786590576172,
            z: -92.57805633544922
        }, {
            x: 283.75396728515625,
            y: 31.358539581298828,
            z: -92.19725036621094
        }, {
            x: 281.8042297363281,
            y: 46.93033981323242,
            z: -91.56375122070312
        }, {
            x: 279.08209228515625,
            y: 62.373504638671875,
            z: -90.67927551269531
        }, {
            x: 275.59503173828125,
            y: 77.64571380615234,
            z: -89.54625701904297
        }, {
            x: 190.914306640625,
            y: 222.9434356689453,
            z: -62.03181838989258
        }, {
            x: 179.5557861328125,
            y: 233.143798828125,
            z: -58.341209411621094
        }, {
            x: 167.70509338378906,
            y: 242.70509338378906,
            z: -54.49068832397461
        }, {
            x: 155.39476013183594,
            y: 251.60116577148438,
            z: -50.490814208984375
        }, {
            x: 142.65847778320312,
            y: 259.8076171875,
            z: -46.3525505065918
        }, {
            x: 116.04886627197266,
            y: 274.0636291503906,
            z: -37.70656204223633
        }, {
            x: 102.24845123291016,
            y: 280.0741271972656,
            z: -33.2225341796875
        }, {
            x: 88.16778564453125,
            y: 285.31695556640625,
            z: -28.647451400756836
        }, {
            x: 44.63340759277344,
            y: 296.3065185546875,
            z: -14.502272605895996
        }, {
            x: 29.82374382019043,
            y: 298.3565673828125,
            z: -9.690321922302246
        }, {
            x: 15.16579532623291,
            y: -299.5888671875,
            z: -4.063662528991699
        }, {
            x: 30.290023803710938,
            y: -298.3565673828125,
            z: -8.11618709564209
        }, {
            x: 45.33122634887695,
            y: -296.3065185546875,
            z: -12.146465301513672
        }, {
            x: 60.2481803894043,
            y: -293.44427490234375,
            z: -16.143451690673828
        }, {
            x: 75,
            y: -289.7777404785156,
            z: -20.096189498901367
        }, {
            x: 89.5462417602539,
            y: -285.31695556640625,
            z: -23.99384307861328
        }, {
            x: 103.84706115722656,
            y: -280.0741271972656,
            z: -27.825735092163086
        }, {
            x: 117.86322784423828,
            y: -274.0636291503906,
            z: -31.581357955932617
        }, {
            x: 182.36305236816406,
            y: -233.143798828125,
            z: -48.86403274536133
        }, {
            x: 193.89915466308594,
            y: -222.9434356689453,
            z: -51.95512008666992
        }, {
            x: 204.90379333496094,
            y: -212.1320343017578,
            z: -54.90380859375
        }, {
            x: 215.34683227539062,
            y: -200.7391815185547,
            z: -57.70201110839844
        }, {
            x: 225.19961547851562,
            y: -188.79611206054688,
            z: -60.3420524597168
        }, {
            x: 234.43511962890625,
            y: -176.3355712890625,
            z: -62.81669998168945
        }, {
            x: 243.02806091308594,
            y: -163.39170837402344,
            z: -65.11917877197266
        }, {
            x: 283.4454040527344,
            y: -62.373504638671875,
            z: -75.94896697998047
        }, {
            x: 286.2101135253906,
            y: -46.93033981323242,
            z: -76.68976593017578
        }, {
            x: 288.1903076171875,
            y: -31.358539581298828,
            z: -77.2203598022461
        }, {
            x: 289.380615234375,
            y: -15.700786590576172,
            z: -77.53929901123047
        }, {
            x: 289.7777404785156,
            y: 0,
            z: -77.64571380615234
        }, {
            x: 289.380615234375,
            y: 15.700786590576172,
            z: -77.53929901123047
        }, {
            x: 288.1903076171875,
            y: 31.358539581298828,
            z: -77.2203598022461
        }, {
            x: 286.2101135253906,
            y: 46.93033981323242,
            z: -76.68976593017578
        }, {
            x: 283.4454040527344,
            y: 62.373504638671875,
            z: -75.94896697998047
        }, {
            x: 279.90380859375,
            y: 77.64571380615234,
            z: -75
        }, {
            x: 270.53082275390625,
            y: 107.51038360595703,
            z: -72.48851776123047
        }, {
            x: 204.90379333496094,
            y: 212.1320343017578,
            z: -54.90380859375
        }, {
            x: 193.89915466308594,
            y: 222.9434356689453,
            z: -51.95512008666992
        }, {
            x: 182.36305236816406,
            y: 233.143798828125,
            z: -48.86403274536133
        }, {
            x: 170.32708740234375,
            y: 242.70509338378906,
            z: -45.639007568359375
        }, {
            x: 157.8242645263672,
            y: 251.60116577148438,
            z: -42.28888702392578
        }, {
            x: 144.8888702392578,
            y: 259.8076171875,
            z: -38.82285690307617
        }, {
            x: 131.5563507080078,
            y: 267.3019714355469,
            z: -35.25041580200195
        }, {
            x: 103.84706115722656,
            y: 280.0741271972656,
            z: -27.825735092163086
        }, {
            x: 89.5462417602539,
            y: 285.31695556640625,
            z: -23.99384307861328
        }, {
            x: 75,
            y: 289.7777404785156,
            z: -20.096189498901367
        }, {
            x: 45.33122634887695,
            y: 296.3065185546875,
            z: -12.146465301513672
        }, {
            x: 30.290023803710938,
            y: 298.3565673828125,
            z: -8.11618709564209
        }, {
            x: 15.357686996459961,
            y: -299.5888671875,
            z: -3.2643771171569824
        }, {
            x: 30.67327880859375,
            y: -298.3565673828125,
            z: -6.519806861877441
        }, {
            x: 45.90480041503906,
            y: -296.3065185546875,
            z: -9.757365226745605
        }, {
            x: 61.010498046875,
            y: -293.44427490234375,
            z: -12.968180656433105
        }, {
            x: 75.948974609375,
            y: -289.7777404785156,
            z: -16.143451690673828
        }, {
            x: 90.67927551269531,
            y: -285.31695556640625,
            z: -19.274473190307617
        }, {
            x: 105.16102600097656,
            y: -280.0741271972656,
            z: -22.352664947509766
        }, {
            x: 196.35255432128906,
            y: -222.9434356689453,
            z: -41.73602294921875
        }, {
            x: 207.49644470214844,
            y: -212.1320343017578,
            z: -44.10472869873047
        }, {
            x: 218.0716094970703,
            y: -200.7391815185547,
            z: -46.35254669189453
        }, {
            x: 287.0318298339844,
            y: -62.373504638671875,
            z: -61.010498046875
        }, {
            x: 289.83148193359375,
            y: -46.93033981323242,
            z: -61.60558319091797
        }, {
            x: 291.8367614746094,
            y: -31.358539581298828,
            z: -62.03181838989258
        }, {
            x: 293.0421447753906,
            y: -15.700786590576172,
            z: -62.28802490234375
        }, {
            x: 293.44427490234375,
            y: 0,
            z: -62.373504638671875
        }, {
            x: 293.0421447753906,
            y: 15.700786590576172,
            z: -62.28802490234375
        }, {
            x: 291.8367614746094,
            y: 31.358539581298828,
            z: -62.03181838989258
        }, {
            x: 289.83148193359375,
            y: 46.93033981323242,
            z: -61.60558319091797
        }, {
            x: 287.0318298339844,
            y: 62.373504638671875,
            z: -61.010498046875
        }, {
            x: 268.07470703125,
            y: 122.02099609375,
            z: -56.98103332519531
        }, {
            x: 218.0716094970703,
            y: 200.7391815185547,
            z: -46.35254669189453
        }, {
            x: 207.49644470214844,
            y: 212.1320343017578,
            z: -44.10472869873047
        }, {
            x: 196.35255432128906,
            y: 222.9434356689453,
            z: -41.73602294921875
        }, {
            x: 184.67047119140625,
            y: 233.143798828125,
            z: -39.2529182434082
        }, {
            x: 172.4822235107422,
            y: 242.70509338378906,
            z: -36.662227630615234
        }, {
            x: 159.8212127685547,
            y: 251.60116577148438,
            z: -33.971046447753906
        }, {
            x: 146.72213745117188,
            y: 259.8076171875,
            z: -31.186752319335938
        }, {
            x: 133.22091674804688,
            y: 267.3019714355469,
            z: -28.316978454589844
        }, {
            x: 105.16102600097656,
            y: 280.0741271972656,
            z: -22.352664947509766
        }, {
            x: 90.67927551269531,
            y: 285.31695556640625,
            z: -19.274473190307617
        }, {
            x: 75.948974609375,
            y: 289.7777404785156,
            z: -16.143451690673828
        }, {
            x: 30.67327880859375,
            y: 298.3565673828125,
            z: -6.519806861877441
        }, {
            x: 15.507484436035156,
            y: -299.5888671875,
            z: -2.456144094467163
        }, {
            x: 30.972463607788086,
            y: -298.3565673828125,
            z: -4.9055562019348145
        }, {
            x: 46.3525505065918,
            y: -296.3065185546875,
            z: -7.341522216796875
        }, {
            x: 61.6055908203125,
            y: -293.44427490234375,
            z: -9.757365226745605
        }, {
            x: 76.68976593017578,
            y: -289.7777404785156,
            z: -12.146465301513672
        }, {
            x: 91.56375122070312,
            y: -285.31695556640625,
            z: -14.50227165222168
        }, {
            x: 294.6833190917969,
            y: -31.358539581298828,
            z: -46.673248291015625
        }, {
            x: 295.9004211425781,
            y: -15.700786590576172,
            z: -46.866024017333984
        }, {
            x: 296.3065185546875,
            y: 0,
            z: -46.93033981323242
        }, {
            x: 295.9004211425781,
            y: 15.700786590576172,
            z: -46.866024017333984
        }, {
            x: 294.6833190917969,
            y: 31.358539581298828,
            z: -46.673248291015625
        }, {
            x: 292.6584777832031,
            y: 46.93033981323242,
            z: -46.35254669189453
        }, {
            x: 289.83148193359375,
            y: 62.373504638671875,
            z: -45.9047966003418
        }, {
            x: 276.6259460449219,
            y: 107.51038360595703,
            z: -43.8132438659668
        }, {
            x: 270.689453125,
            y: 122.02099609375,
            z: -42.87299728393555
        }, {
            x: 264.0110168457031,
            y: 136.1971435546875,
            z: -41.81523513793945
        }, {
            x: 256.60894775390625,
            y: 150,
            z: -40.64286422729492
        }, {
            x: 230.27340698242188,
            y: 188.79611206054688,
            z: -36.47172546386719
        }, {
            x: 220.1986541748047,
            y: 200.7391815185547,
            z: -34.87603759765625
        }, {
            x: 209.5203399658203,
            y: 212.1320343017578,
            z: -33.18476104736328
        }, {
            x: 198.2677459716797,
            y: 222.9434356689453,
            z: -31.402524948120117
        }, {
            x: 186.4717254638672,
            y: 233.143798828125,
            z: -29.53421974182129
        }, {
            x: 174.1645965576172,
            y: 242.70509338378906,
            z: -27.5849609375
        }, {
            x: 161.38009643554688,
            y: 251.60116577148438,
            z: -25.560094833374023
        }, {
            x: 134.5203399658203,
            y: 267.3019714355469,
            z: -21.30592918395996
        }, {
            x: 120.51871490478516,
            y: 274.0636291503906,
            z: -19.088289260864258
        }, {
            x: 106.18675994873047,
            y: 280.0741271972656,
            z: -16.818328857421875
        }, {
            x: 91.56375122070312,
            y: 285.31695556640625,
            z: -14.50227165222168
        }, {
            x: 76.68976593017578,
            y: 289.7777404785156,
            z: -12.146465301513672
        }, {
            x: 46.3525505065918,
            y: 296.3065185546875,
            z: -7.341522216796875
        }, {
            x: 30.972463607788086,
            y: 298.3565673828125,
            z: -4.9055562019348145
        }, {
            x: 15.614776611328125,
            y: -299.5888671875,
            z: -1.6411792039871216
        }, {
            x: 31.18675422668457,
            y: -298.3565673828125,
            z: -3.277859926223755
        }, {
            x: 46.67325210571289,
            y: -296.3065185546875,
            z: -4.9055562019348145
        }, {
            x: 62.03181838989258,
            y: -293.44427490234375,
            z: -6.519806861877441
        }, {
            x: 77.2203598022461,
            y: -289.7777404785156,
            z: -8.11618709564209
        }, {
            x: 92.19725036621094,
            y: -285.31695556640625,
            z: -9.690321922302246
        }, {
            x: 297.94769287109375,
            y: -15.700786590576172,
            z: -31.315563201904297
        }, {
            x: 291.8367614746094,
            y: 62.373504638671875,
            z: -30.67327880859375
        }, {
            x: 265.837646484375,
            y: 136.1971435546875,
            z: -27.940662384033203
        }, {
            x: 258.3843688964844,
            y: 150,
            z: -27.15729331970215
        }, {
            x: 250.22288513183594,
            y: 163.39170837402344,
            z: -26.299484252929688
        }, {
            x: 241.37554931640625,
            y: 176.3355712890625,
            z: -25.369590759277344
        }, {
            x: 231.8666229248047,
            y: 188.79611206054688,
            z: -24.370162963867188
        }, {
            x: 221.72213745117188,
            y: 200.7391815185547,
            z: -23.303937911987305
        }, {
            x: 210.96995544433594,
            y: 212.1320343017578,
            z: -22.17383575439453
        }, {
            x: 199.63951110839844,
            y: 222.9434356689453,
            z: -20.982959747314453
        }, {
            x: 187.76187133789062,
            y: 233.143798828125,
            z: -19.734567642211914
        }, {
            x: 175.36959838867188,
            y: 242.70509338378906,
            z: -18.432086944580078
        }, {
            x: 92.19725036621094,
            y: 285.31695556640625,
            z: -9.690321922302246
        }, {
            x: 77.2203598022461,
            y: 289.7777404785156,
            z: -8.11618709564209
        }, {
            x: 62.03181838989258,
            y: 293.44427490234375,
            z: -6.519806861877441
        }, {
            x: 46.67325210571289,
            y: 296.3065185546875,
            z: -4.9055562019348145
        }, {
            x: 31.18675422668457,
            y: 298.3565673828125,
            z: -3.277859926223755
        }, {
            x: 15.679269790649414,
            y: -299.5888671875,
            z: -0.8217157125473022
        }, {
            x: 31.315561294555664,
            y: -298.3565673828125,
            z: -1.6411792039871216
        }, {
            x: 46.866024017333984,
            y: -296.3065185546875,
            z: -2.456144094467163
        }, {
            x: 62.28802490234375,
            y: -293.44427490234375,
            z: -3.2643771171569824
        }, {
            x: 77.53929901123047,
            y: -289.7777404785156,
            z: -4.063662528991699
        }, {
            x: 92.57804107666016,
            y: -285.31695556640625,
            z: -4.851809978485107
        }, {
            x: 293.0421142578125,
            y: 62.373504638671875,
            z: -15.357686042785645
        }, {
            x: 289.380615234375,
            y: 77.64571380615234,
            z: -15.16579532623291
        }, {
            x: 284.9259338378906,
            y: 92.7051010131836,
            z: -14.93233585357666
        }, {
            x: 251.25636291503906,
            y: 163.39170837402344,
            z: -13.167787551879883
        }, {
            x: 242.37246704101562,
            y: 176.3355712890625,
            z: -12.702202796936035
        }, {
            x: 232.8242645263672,
            y: 188.79611206054688,
            z: -12.201802253723145
        }, {
            x: 222.63790893554688,
            y: 200.7391815185547,
            z: -11.66795825958252
        }, {
            x: 211.84130859375,
            y: 212.1320343017578,
            z: -11.102132797241211
        }, {
            x: 200.4640655517578,
            y: 222.9434356689453,
            z: -10.505876541137695
        }, {
            x: 188.53736877441406,
            y: 233.143798828125,
            z: -9.88082504272461
        }, {
            x: 176.09390258789062,
            y: 242.70509338378906,
            z: -9.228690147399902
        }, {
            x: 163.16778564453125,
            y: 251.60116577148438,
            z: -8.551260948181152
        }, {
            x: 121.85376739501953,
            y: 274.0636291503906,
            z: -6.386085510253906
        }, {
            x: 107.36304473876953,
            y: 280.0741271972656,
            z: -5.626658916473389
        }, {
            x: 92.57804107666016,
            y: 285.31695556640625,
            z: -4.851809978485107
        }, {
            x: 77.53929901123047,
            y: 289.7777404785156,
            z: -4.063662528991699
        }, {
            x: 62.28802490234375,
            y: 293.44427490234375,
            z: -3.2643771171569824
        }, {
            x: 46.866024017333984,
            y: 296.3065185546875,
            z: -2.456144094467163
        }, {
            x: 31.315561294555664,
            y: 298.3565673828125,
            z: -1.6411792039871216
        }, {
            x: 15.700786590576172,
            y: -299.5888671875,
            z: 0
        }, {
            x: 31.358539581298828,
            y: -298.3565673828125,
            z: 0
        }, {
            x: 46.93033981323242,
            y: -296.3065185546875,
            z: 0
        }, {
            x: 62.373504638671875,
            y: -293.44427490234375,
            z: 0
        }, {
            x: 77.64571380615234,
            y: -289.7777404785156,
            z: 0
        }, {
            x: 92.7051010131836,
            y: -285.31695556640625,
            z: 0
        }, {
            x: 289.7777404785156,
            y: 77.64571380615234,
            z: 0
        }, {
            x: 285.31695556640625,
            y: 92.7051010131836,
            z: 0
        }, {
            x: 274.0636291503906,
            y: 122.02099609375,
            z: 0
        }, {
            x: 242.70509338378906,
            y: 176.3355712890625,
            z: 0
        }, {
            x: 233.143798828125,
            y: 188.79611206054688,
            z: 0
        }, {
            x: 222.9434356689453,
            y: 200.7391815185547,
            z: 0
        }, {
            x: 212.1320343017578,
            y: 212.1320343017578,
            z: 0
        }, {
            x: 176.3355712890625,
            y: 242.70509338378906,
            z: 0
        }, {
            x: 163.39170837402344,
            y: 251.60116577148438,
            z: 0
        }, {
            x: 122.02099609375,
            y: 274.0636291503906,
            z: 0
        }, {
            x: 107.51038360595703,
            y: 280.0741271972656,
            z: 0
        }, {
            x: 77.64571380615234,
            y: 289.7777404785156,
            z: 0
        }, {
            x: 62.373504638671875,
            y: 293.44427490234375,
            z: 0
        }, {
            x: 46.93033981323242,
            y: 296.3065185546875,
            z: 0
        }, {
            x: 31.358539581298828,
            y: 298.3565673828125,
            z: 0
        }, {
            x: 15.679269790649414,
            y: -299.5888671875,
            z: 0.8217157125473022
        }, {
            x: 31.315561294555664,
            y: -298.3565673828125,
            z: 1.6411792039871216
        }, {
            x: 46.866024017333984,
            y: -296.3065185546875,
            z: 2.456144094467163
        }, {
            x: 62.28802490234375,
            y: -293.44427490234375,
            z: 3.2643771171569824
        }, {
            x: 77.53929901123047,
            y: -289.7777404785156,
            z: 4.063662528991699
        }, {
            x: 92.57804107666016,
            y: -285.31695556640625,
            z: 4.851809978485107
        }, {
            x: 284.9259338378906,
            y: 92.7051010131836,
            z: 14.93233585357666
        }, {
            x: 279.6903076171875,
            y: 107.51038360595703,
            z: 14.657946586608887
        }, {
            x: 273.6880187988281,
            y: 122.02099609375,
            z: 14.343381881713867
        }, {
            x: 251.25636291503906,
            y: 163.39170837402344,
            z: 13.167787551879883
        }, {
            x: 242.37246704101562,
            y: 176.3355712890625,
            z: 12.702202796936035
        }, {
            x: 232.8242645263672,
            y: 188.79611206054688,
            z: 12.201802253723145
        }, {
            x: 222.63790893554688,
            y: 200.7391815185547,
            z: 11.66795825958252
        }, {
            x: 211.84130859375,
            y: 212.1320343017578,
            z: 11.102132797241211
        }, {
            x: 200.4640655517578,
            y: 222.9434356689453,
            z: 10.505876541137695
        }, {
            x: 188.53736877441406,
            y: 233.143798828125,
            z: 9.88082504272461
        }, {
            x: 176.09390258789062,
            y: 242.70509338378906,
            z: 9.228690147399902
        }, {
            x: 163.16778564453125,
            y: 251.60116577148438,
            z: 8.551260948181152
        }, {
            x: 149.79443359375,
            y: 259.8076171875,
            z: 7.850393295288086
        }, {
            x: 107.36304473876953,
            y: 280.0741271972656,
            z: 5.626658916473389
        }, {
            x: 92.57804107666016,
            y: 285.31695556640625,
            z: 4.851809978485107
        }, {
            x: 77.53929901123047,
            y: 289.7777404785156,
            z: 4.063662528991699
        }, {
            x: 62.28802490234375,
            y: 293.44427490234375,
            z: 3.2643771171569824
        }, {
            x: 46.866024017333984,
            y: 296.3065185546875,
            z: 2.456144094467163
        }, {
            x: 31.315561294555664,
            y: 298.3565673828125,
            z: 1.6411792039871216
        }, {
            x: 15.614776611328125,
            y: -299.5888671875,
            z: 1.6411792039871216
        }, {
            x: 31.18675422668457,
            y: -298.3565673828125,
            z: 3.277859926223755
        }, {
            x: 46.67325210571289,
            y: -296.3065185546875,
            z: 4.9055562019348145
        }, {
            x: 62.03181838989258,
            y: -293.44427490234375,
            z: 6.519806861877441
        }, {
            x: 77.2203598022461,
            y: -289.7777404785156,
            z: 8.11618709564209
        }, {
            x: 92.19725036621094,
            y: -285.31695556640625,
            z: 9.690321922302246
        }, {
            x: 283.75396728515625,
            y: 92.7051010131836,
            z: 29.82374382019043
        }, {
            x: 278.53985595703125,
            y: 107.51038360595703,
            z: 29.275718688964844
        }, {
            x: 250.22288513183594,
            y: 163.39170837402344,
            z: 26.299484252929688
        }, {
            x: 241.37554931640625,
            y: 176.3355712890625,
            z: 25.369590759277344
        }, {
            x: 231.8666229248047,
            y: 188.79611206054688,
            z: 24.370162963867188
        }, {
            x: 221.72213745117188,
            y: 200.7391815185547,
            z: 23.303937911987305
        }, {
            x: 210.96995544433594,
            y: 212.1320343017578,
            z: 22.17383575439453
        }, {
            x: 199.63951110839844,
            y: 222.9434356689453,
            z: 20.982959747314453
        }, {
            x: 187.76187133789062,
            y: 233.143798828125,
            z: 19.734567642211914
        }, {
            x: 175.36959838867188,
            y: 242.70509338378906,
            z: 18.432086944580078
        }, {
            x: 162.49664306640625,
            y: 251.60116577148438,
            z: 17.079084396362305
        }, {
            x: 149.17828369140625,
            y: 259.8076171875,
            z: 15.679269790649414
        }, {
            x: 121.35254669189453,
            y: 274.0636291503906,
            z: 12.754667282104492
        }, {
            x: 106.92143249511719,
            y: 280.0741271972656,
            z: 11.237895965576172
        }, {
            x: 92.19725036621094,
            y: 285.31695556640625,
            z: 9.690321922302246
        }, {
            x: 62.03181838989258,
            y: 293.44427490234375,
            z: 6.519806861877441
        }, {
            x: 46.67325210571289,
            y: 296.3065185546875,
            z: 4.9055562019348145
        }, {
            x: 31.18675422668457,
            y: 298.3565673828125,
            z: 3.277859926223755
        }, {
            x: 15.507484436035156,
            y: -299.5888671875,
            z: 2.456144094467163
        }, {
            x: 30.972463607788086,
            y: -298.3565673828125,
            z: 4.9055562019348145
        }, {
            x: 46.3525505065918,
            y: -296.3065185546875,
            z: 7.341522216796875
        }, {
            x: 61.6055908203125,
            y: -293.44427490234375,
            z: 9.757365226745605
        }, {
            x: 76.68976593017578,
            y: -289.7777404785156,
            z: 12.146465301513672
        }, {
            x: 91.56375122070312,
            y: -285.31695556640625,
            z: 14.50227165222168
        }, {
            x: 106.18675994873047,
            y: -280.0741271972656,
            z: 16.818328857421875
        }, {
            x: 276.6259460449219,
            y: 107.51038360595703,
            z: 43.8132438659668
        }, {
            x: 248.50355529785156,
            y: 163.39170837402344,
            z: 39.359092712402344
        }, {
            x: 239.7169952392578,
            y: 176.3355712890625,
            z: 37.96744155883789
        }, {
            x: 230.27340698242188,
            y: 188.79611206054688,
            z: 36.47172546386719
        }, {
            x: 220.1986541748047,
            y: 200.7391815185547,
            z: 34.87603759765625
        }, {
            x: 209.5203399658203,
            y: 212.1320343017578,
            z: 33.18476104736328
        }, {
            x: 198.2677459716797,
            y: 222.9434356689453,
            z: 31.402524948120117
        }, {
            x: 186.4717254638672,
            y: 233.143798828125,
            z: 29.53421974182129
        }, {
            x: 174.1645965576172,
            y: 242.70509338378906,
            z: 27.5849609375
        }, {
            x: 161.38009643554688,
            y: 251.60116577148438,
            z: 25.560094833374023
        }, {
            x: 148.15325927734375,
            y: 259.8076171875,
            z: 23.46516990661621
        }, {
            x: 134.5203399658203,
            y: 267.3019714355469,
            z: 21.30592918395996
        }, {
            x: 120.51871490478516,
            y: 274.0636291503906,
            z: 19.088289260864258
        }, {
            x: 106.18675994873047,
            y: 280.0741271972656,
            z: 16.818328857421875
        }, {
            x: 91.56375122070312,
            y: 285.31695556640625,
            z: 14.50227165222168
        }, {
            x: 76.68976593017578,
            y: 289.7777404785156,
            z: 12.146465301513672
        }, {
            x: 61.6055908203125,
            y: 293.44427490234375,
            z: 9.757365226745605
        }, {
            x: 46.3525505065918,
            y: 296.3065185546875,
            z: 7.341522216796875
        }, {
            x: 30.972463607788086,
            y: 298.3565673828125,
            z: 4.9055562019348145
        }, {
            x: 15.357686996459961,
            y: -299.5888671875,
            z: 3.2643771171569824
        }, {
            x: 30.67327880859375,
            y: -298.3565673828125,
            z: 6.519806861877441
        }, {
            x: 45.90480041503906,
            y: -296.3065185546875,
            z: 9.757365226745605
        }, {
            x: 61.010498046875,
            y: -293.44427490234375,
            z: 12.968180656433105
        }, {
            x: 75.948974609375,
            y: -289.7777404785156,
            z: 16.143451690673828
        }, {
            x: 90.67927551269531,
            y: -285.31695556640625,
            z: 19.274473190307617
        }, {
            x: 105.16102600097656,
            y: -280.0741271972656,
            z: 22.352664947509766
        }, {
            x: 273.9538269042969,
            y: 107.51038360595703,
            z: 58.230682373046875
        }, {
            x: 268.07470703125,
            y: 122.02099609375,
            z: 56.98103332519531
        }, {
            x: 261.46075439453125,
            y: 136.1971435546875,
            z: 55.575199127197266
        }, {
            x: 254.1302032470703,
            y: 150,
            z: 54.01704025268555
        }, {
            x: 246.10308837890625,
            y: 163.39170837402344,
            z: 52.310821533203125
        }, {
            x: 237.4014129638672,
            y: 176.3355712890625,
            z: 50.46122360229492
        }, {
            x: 228.04904174804688,
            y: 188.79611206054688,
            z: 48.47332000732422
        }, {
            x: 218.0716094970703,
            y: 200.7391815185547,
            z: 46.35254669189453
        }, {
            x: 207.49644470214844,
            y: 212.1320343017578,
            z: 44.10472869873047
        }, {
            x: 196.35255432128906,
            y: 222.9434356689453,
            z: 41.73602294921875
        }, {
            x: 184.67047119140625,
            y: 233.143798828125,
            z: 39.2529182434082
        }, {
            x: 172.4822235107422,
            y: 242.70509338378906,
            z: 36.662227630615234
        }, {
            x: 159.8212127685547,
            y: 251.60116577148438,
            z: 33.971046447753906
        }, {
            x: 146.72213745117188,
            y: 259.8076171875,
            z: 31.186752319335938
        }, {
            x: 133.22091674804688,
            y: 267.3019714355469,
            z: 28.316978454589844
        }, {
            x: 119.35454559326172,
            y: 274.0636291503906,
            z: 25.369590759277344
        }, {
            x: 105.16102600097656,
            y: 280.0741271972656,
            z: 22.352664947509766
        }, {
            x: 90.67927551269531,
            y: 285.31695556640625,
            z: 19.274473190307617
        }, {
            x: 75.948974609375,
            y: 289.7777404785156,
            z: 16.143451690673828
        }, {
            x: 61.010498046875,
            y: 293.44427490234375,
            z: 12.968180656433105
        }, {
            x: 45.90480041503906,
            y: 296.3065185546875,
            z: 9.757365226745605
        }, {
            x: 15.16579532623291,
            y: -299.5888671875,
            z: 4.063662528991699
        }, {
            x: 30.290023803710938,
            y: -298.3565673828125,
            z: 8.11618709564209
        }, {
            x: 45.33122634887695,
            y: -296.3065185546875,
            z: 12.146465301513672
        }, {
            x: 60.2481803894043,
            y: -293.44427490234375,
            z: 16.143451690673828
        }, {
            x: 75,
            y: -289.7777404785156,
            z: 20.096189498901367
        }, {
            x: 89.5462417602539,
            y: -285.31695556640625,
            z: 23.99384307861328
        }, {
            x: 103.84706115722656,
            y: -280.0741271972656,
            z: 27.825735092163086
        }, {
            x: 270.53082275390625,
            y: 107.51038360595703,
            z: 72.48851776123047
        }, {
            x: 264.7251281738281,
            y: 122.02099609375,
            z: 70.93289184570312
        }, {
            x: 258.19384765625,
            y: 136.1971435546875,
            z: 69.1828384399414
        }, {
            x: 250.95489501953125,
            y: 150,
            z: 67.24315643310547
        }, {
            x: 243.02806091308594,
            y: 163.39170837402344,
            z: 65.11917877197266
        }, {
            x: 234.43511962890625,
            y: 176.3355712890625,
            z: 62.81669998168945
        }, {
            x: 225.19961547851562,
            y: 188.79611206054688,
            z: 60.3420524597168
        }, {
            x: 215.34683227539062,
            y: 200.7391815185547,
            z: 57.70201110839844
        }, {
            x: 204.90379333496094,
            y: 212.1320343017578,
            z: 54.90380859375
        }, {
            x: 193.89915466308594,
            y: 222.9434356689453,
            z: 51.95512008666992
        }, {
            x: 182.36305236816406,
            y: 233.143798828125,
            z: 48.86403274536133
        }, {
            x: 170.32708740234375,
            y: 242.70509338378906,
            z: 45.639007568359375
        }, {
            x: 157.8242645263672,
            y: 251.60116577148438,
            z: 42.28888702392578
        }, {
            x: 144.8888702392578,
            y: 259.8076171875,
            z: 38.82285690307617
        }, {
            x: 131.5563507080078,
            y: 267.3019714355469,
            z: 35.25041580200195
        }, {
            x: 117.86322784423828,
            y: 274.0636291503906,
            z: 31.581357955932617
        }, {
            x: 103.84706115722656,
            y: 280.0741271972656,
            z: 27.825735092163086
        }, {
            x: 89.5462417602539,
            y: 285.31695556640625,
            z: 23.99384307861328
        }, {
            x: 75,
            y: 289.7777404785156,
            z: 20.096189498901367
        }, {
            x: 45.33122634887695,
            y: 296.3065185546875,
            z: 12.146465301513672
        }, {
            x: 14.93233585357666,
            y: -299.5888671875,
            z: 4.851809978485107
        }, {
            x: 29.82374382019043,
            y: -298.3565673828125,
            z: 9.690321922302246
        }, {
            x: 44.63340759277344,
            y: -296.3065185546875,
            z: 14.502272605895996
        }, {
            x: 59.32073211669922,
            y: -293.44427490234375,
            z: 19.27447509765625
        }, {
            x: 73.84546661376953,
            y: -289.7777404785156,
            z: 23.993846893310547
        }, {
            x: 88.16778564453125,
            y: -285.31695556640625,
            z: 28.647451400756836
        }, {
            x: 260.6499938964844,
            y: 122.02099609375,
            z: 84.69032287597656
        }, {
            x: 254.21926879882812,
            y: 136.1971435546875,
            z: 82.6008529663086
        }, {
            x: 247.09173583984375,
            y: 150,
            z: 80.28497314453125
        }, {
            x: 239.2869415283203,
            y: 163.39170837402344,
            z: 77.74903869628906
        }, {
            x: 230.82627868652344,
            y: 176.3355712890625,
            z: 75
        }, {
            x: 221.73292541503906,
            y: 188.79611206054688,
            z: 72.04539489746094
        }, {
            x: 212.03182983398438,
            y: 200.7391815185547,
            z: 68.89331817626953
        }, {
            x: 201.7495574951172,
            y: 212.1320343017578,
            z: 65.55240631103516
        }, {
            x: 190.914306640625,
            y: 222.9434356689453,
            z: 62.03181838989258
        }, {
            x: 179.5557861328125,
            y: 233.143798828125,
            z: 58.341209411621094
        }, {
            x: 167.70509338378906,
            y: 242.70509338378906,
            z: 54.49068832397461
        }, {
            x: 155.39476013183594,
            y: 251.60116577148438,
            z: 50.490814208984375
        }, {
            x: 142.65847778320312,
            y: 259.8076171875,
            z: 46.3525505065918
        }, {
            x: 129.53118896484375,
            y: 267.3019714355469,
            z: 42.08723449707031
        }, {
            x: 116.04886627197266,
            y: 274.0636291503906,
            z: 37.70656204223633
        }, {
            x: 102.24845123291016,
            y: 280.0741271972656,
            z: 33.2225341796875
        }, {
            x: 88.16778564453125,
            y: 285.31695556640625,
            z: 28.647451400756836
        }, {
            x: 73.84546661376953,
            y: 289.7777404785156,
            z: 23.993846893310547
        }, {
            x: 44.63340759277344,
            y: 296.3065185546875,
            z: 14.502272605895996
        }, {
            x: 14.657946586608887,
            y: -299.5888671875,
            z: 5.626658916473389
        }, {
            x: 29.27571678161621,
            y: -298.3565673828125,
            z: 11.237895965576172
        }, {
            x: 43.8132438659668,
            y: -296.3065185546875,
            z: 16.818330764770508
        }, {
            x: 58.230682373046875,
            y: -293.44427490234375,
            z: 22.352664947509766
        }, {
            x: 72.48851776123047,
            y: -289.7777404785156,
            z: 27.825735092163086
        }, {
            x: 86.54766082763672,
            y: -285.31695556640625,
            z: 33.2225341796875
        }, {
            x: 249.54786682128906,
            y: 136.1971435546875,
            z: 95.7924575805664
        }, {
            x: 242.55130004882812,
            y: 150,
            z: 93.10672760009766
        }, {
            x: 234.88990783691406,
            y: 163.39170837402344,
            z: 90.16580200195312
        }, {
            x: 226.584716796875,
            y: 176.3355712890625,
            z: 86.97772979736328
        }, {
            x: 217.65847778320312,
            y: 188.79611206054688,
            z: 83.55125427246094
        }, {
            x: 208.13563537597656,
            y: 200.7391815185547,
            z: 79.89578247070312
        }, {
            x: 198.0423126220703,
            y: 212.1320343017578,
            z: 76.02132415771484
        }, {
            x: 187.40615844726562,
            y: 222.9434356689453,
            z: 71.93849182128906
        }, {
            x: 176.25636291503906,
            y: 233.143798828125,
            z: 67.65847778320312
        }, {
            x: 164.62344360351562,
            y: 242.70509338378906,
            z: 63.19301986694336
        }, {
            x: 152.539306640625,
            y: 251.60116577148438,
            z: 58.554351806640625
        }, {
            x: 140.0370635986328,
            y: 259.8076171875,
            z: 53.755191802978516
        }, {
            x: 127.15098571777344,
            y: 267.3019714355469,
            z: 48.808692932128906
        }, {
            x: 113.9164047241211,
            y: 274.0636291503906,
            z: 43.72841262817383
        }, {
            x: 100.36958312988281,
            y: 280.0741271972656,
            z: 38.52827453613281
        }, {
            x: 86.54766082763672,
            y: 285.31695556640625,
            z: 33.2225341796875
        }, {
            x: 72.48851776123047,
            y: 289.7777404785156,
            z: 27.825735092163086
        }, {
            x: 58.230682373046875,
            y: 293.44427490234375,
            z: 22.352664947509766
        }, {
            x: 14.343381881713867,
            y: -299.5888671875,
            z: 6.386085510253906
        }, {
            x: 28.647449493408203,
            y: -298.3565673828125,
            z: 12.754667282104492
        }, {
            x: 42.87299728393555,
            y: -296.3065185546875,
            z: 19.088289260864258
        }, {
            x: 56.98103332519531,
            y: -293.44427490234375,
            z: 25.369590759277344
        }, {
            x: 70.9328842163086,
            y: -289.7777404785156,
            z: 31.581357955932617
        }, {
            x: 84.69032287597656,
            y: -285.31695556640625,
            z: 37.70656204223633
        }, {
            x: 244.19247436523438,
            y: 136.1971435546875,
            z: 108.72150421142578
        }, {
            x: 237.3460693359375,
            y: 150,
            z: 105.67327880859375
        }, {
            x: 229.84909057617188,
            y: 163.39170837402344,
            z: 102.33541107177734
        }, {
            x: 221.7221221923828,
            y: 176.3355712890625,
            z: 98.71705627441406
        }, {
            x: 212.98744201660156,
            y: 188.79611206054688,
            z: 94.828125
        }, {
            x: 203.66896057128906,
            y: 200.7391815185547,
            z: 90.67927551269531
        }, {
            x: 193.79225158691406,
            y: 212.1320343017578,
            z: 86.28187561035156
        }, {
            x: 183.38436889648438,
            y: 222.9434356689453,
            z: 81.64797973632812
        }, {
            x: 172.4738311767578,
            y: 233.143798828125,
            z: 76.7903060913086
        }, {
            x: 161.09056091308594,
            y: 242.70509338378906,
            z: 71.72213745117188
        }, {
            x: 149.2657470703125,
            y: 251.60116577148438,
            z: 66.4573974609375
        }, {
            x: 137.0318145751953,
            y: 259.8076171875,
            z: 61.010498046875
        }, {
            x: 124.42228698730469,
            y: 267.3019714355469,
            z: 55.3963737487793
        }, {
            x: 111.47171783447266,
            y: 274.0636291503906,
            z: 49.630409240722656
        }, {
            x: 98.21562194824219,
            y: 280.0741271972656,
            z: 43.72841262817383
        }, {
            x: 84.69032287597656,
            y: 285.31695556640625,
            z: 37.70656204223633
        }, {
            x: 70.9328842163086,
            y: 289.7777404785156,
            z: 31.581357955932617
        }, {
            x: 56.98103332519531,
            y: 293.44427490234375,
            z: 25.369590759277344
        }, {
            x: 42.87299728393555,
            y: 296.3065185546875,
            z: 19.088289260864258
        }, {
            x: 13.989503860473633,
            y: -299.5888671875,
            z: 7.128007888793945
        }, {
            x: 27.940662384033203,
            y: -298.3565673828125,
            z: 14.236477851867676
        }, {
            x: 41.81523895263672,
            y: -296.3065185546875,
            z: 21.30592918395996
        }, {
            x: 55.575199127197266,
            y: -293.44427490234375,
            z: 28.316978454589844
        }, {
            x: 69.1828384399414,
            y: -289.7777404785156,
            z: 35.25041580200195
        }, {
            x: 82.60084533691406,
            y: -285.31695556640625,
            z: 42.08723449707031
        }, {
            x: 231.4902801513672,
            y: 150,
            z: 117.95018768310547
        }, {
            x: 224.17828369140625,
            y: 163.39170837402344,
            z: 114.22453308105469
        }, {
            x: 216.2518310546875,
            y: 176.3355712890625,
            z: 110.18580627441406
        }, {
            x: 207.73263549804688,
            y: 188.79611206054688,
            z: 105.84506225585938
        }, {
            x: 198.64405822753906,
            y: 200.7391815185547,
            z: 101.21420288085938
        }, {
            x: 189.0110321044922,
            y: 212.1320343017578,
            z: 96.30592346191406
        }, {
            x: 178.85992431640625,
            y: 222.9434356689453,
            z: 91.13367462158203
        }, {
            x: 168.21856689453125,
            y: 233.143798828125,
            z: 85.71163940429688
        }, {
            x: 157.11614990234375,
            y: 242.70509338378906,
            z: 80.05467987060547
        }, {
            x: 145.5830841064453,
            y: 251.60116577148438,
            z: 74.17828369140625
        }, {
            x: 133.65098571777344,
            y: 259.8076171875,
            z: 68.09857177734375
        }, {
            x: 121.35254669189453,
            y: 267.3019714355469,
            z: 61.832210540771484
        }, {
            x: 108.72150421142578,
            y: 274.0636291503906,
            z: 55.39636993408203
        }, {
            x: 95.7924575805664,
            y: 280.0741271972656,
            z: 48.808692932128906
        }, {
            x: 82.60084533691406,
            y: 285.31695556640625,
            z: 42.08723449707031
        }, {
            x: 69.1828384399414,
            y: 289.7777404785156,
            z: 35.25041580200195
        }, {
            x: 55.575199127197266,
            y: 293.44427490234375,
            z: 28.316978454589844
        }, {
            x: 41.81523895263672,
            y: 296.3065185546875,
            z: 21.30592918395996
        }, {
            x: 13.59727954864502,
            y: -299.5888671875,
            z: 7.850393295288086
        }, {
            x: 27.157289505004883,
            y: -298.3565673828125,
            z: 15.679269790649414
        }, {
            x: 40.64286422729492,
            y: -296.3065185546875,
            z: 23.46516990661621
        }, {
            x: 54.01704025268555,
            y: -293.44427490234375,
            z: 31.186752319335938
        }, {
            x: 67.24315643310547,
            y: -289.7777404785156,
            z: 38.82285690307617
        }, {
            x: 80.28497314453125,
            y: -285.31695556640625,
            z: 46.3525505065918
        }, {
            x: 210.1887664794922,
            y: 176.3355712890625,
            z: 121.35254669189453
        }, {
            x: 201.90843200683594,
            y: 188.79611206054688,
            z: 116.5718994140625
        }, {
            x: 193.07469177246094,
            y: 200.7391815185547,
            z: 111.47171783447266
        }, {
            x: 183.7117156982422,
            y: 212.1320343017578,
            z: 106.0660171508789
        }, {
            x: 173.84523010253906,
            y: 222.9434356689453,
            z: 100.36959075927734
        }, {
            x: 163.50222778320312,
            y: 233.143798828125,
            z: 94.39805603027344
        }, {
            x: 152.71109008789062,
            y: 242.70509338378906,
            z: 88.16778564453125
        }, {
            x: 141.50137329101562,
            y: 251.60116577148438,
            z: 81.69585418701172
        }, {
            x: 129.90380859375,
            y: 259.8076171875,
            z: 75
        }, {
            x: 117.95018768310547,
            y: 267.3019714355469,
            z: 68.09857177734375
        }, {
            x: 105.67327880859375,
            y: 274.0636291503906,
            z: 61.010498046875
        }, {
            x: 93.10672760009766,
            y: 280.0741271972656,
            z: 53.755191802978516
        }, {
            x: 80.28497314453125,
            y: 285.31695556640625,
            z: 46.3525505065918
        }, {
            x: 67.24315643310547,
            y: 289.7777404785156,
            z: 38.82285690307617
        }, {
            x: 54.01704025268555,
            y: 293.44427490234375,
            z: 31.186752319335938
        }, {
            x: 40.64286422729492,
            y: 296.3065185546875,
            z: 23.46516990661621
        }, {
            x: 13.167787551879883,
            y: -299.5888671875,
            z: 8.551261901855469
        }, {
            x: 26.299484252929688,
            y: -298.3565673828125,
            z: 17.079084396362305
        }, {
            x: 39.359092712402344,
            y: -296.3065185546875,
            z: 25.560094833374023
        }, {
            x: 52.310821533203125,
            y: -293.44427490234375,
            z: 33.97105026245117
        }, {
            x: 65.11917877197266,
            y: -289.7777404785156,
            z: 42.28888702392578
        }, {
            x: 77.74903106689453,
            y: -285.31695556640625,
            z: 50.49081802368164
        }, {
            x: 195.5308380126953,
            y: 188.79611206054688,
            z: 126.97920989990234
        }, {
            x: 186.97610473632812,
            y: 200.7391815185547,
            z: 121.4237060546875
        }, {
            x: 177.9088897705078,
            y: 212.1320343017578,
            z: 115.53539276123047
        }, {
            x: 168.35403442382812,
            y: 222.9434356689453,
            z: 109.33039855957031
        }, {
            x: 158.33773803710938,
            y: 233.143798828125,
            z: 102.82573699951172
        }, {
            x: 147.887451171875,
            y: 242.70509338378906,
            z: 96.03923797607422
        }, {
            x: 137.0318145751953,
            y: 251.60116577148438,
            z: 88.98950958251953
        }, {
            x: 125.80058288574219,
            y: 259.8076171875,
            z: 81.69585418701172
        }, {
            x: 114.22453308105469,
            y: 267.3019714355469,
            z: 74.17828369140625
        }, {
            x: 102.33541107177734,
            y: 274.0636291503906,
            z: 66.4573974609375
        }, {
            x: 90.1657943725586,
            y: 280.0741271972656,
            z: 58.554351806640625
        }, {
            x: 77.74903106689453,
            y: 285.31695556640625,
            z: 50.49081802368164
        }, {
            x: 65.11917877197266,
            y: 289.7777404785156,
            z: 42.28888702392578
        }, {
            x: 12.702202796936035,
            y: -299.5888671875,
            z: 9.228691101074219
        }, {
            x: 25.369590759277344,
            y: -298.3565673828125,
            z: 18.432086944580078
        }, {
            x: 37.96744155883789,
            y: -296.3065185546875,
            z: 27.5849609375
        }, {
            x: 50.46123123168945,
            y: -293.44427490234375,
            z: 36.662227630615234
        }, {
            x: 62.81669998168945,
            y: -289.7777404785156,
            z: 45.639007568359375
        }, {
            x: 75,
            y: -285.31695556640625,
            z: 54.49068832397461
        }, {
            x: 180.3650360107422,
            y: 200.7391815185547,
            z: 131.04287719726562
        }, {
            x: 171.61842346191406,
            y: 212.1320343017578,
            z: 124.68807983398438
        }, {
            x: 162.4014129638672,
            y: 222.9434356689453,
            z: 117.99153137207031
        }, {
            x: 152.73927307128906,
            y: 233.143798828125,
            z: 110.97157287597656
        }, {
            x: 142.65847778320312,
            y: 242.70509338378906,
            z: 103.64745330810547
        }, {
            x: 132.18667602539062,
            y: 251.60116577148438,
            z: 96.03923797607422
        }, {
            x: 121.35254669189453,
            y: 259.8076171875,
            z: 88.16778564453125
        }, {
            x: 110.18580627441406,
            y: 267.3019714355469,
            z: 80.05467987060547
        }, {
            x: 98.71705627441406,
            y: 274.0636291503906,
            z: 71.72213745117188
        }, {
            x: 86.97772979736328,
            y: 280.0741271972656,
            z: 63.19301986694336
        }, {
            x: 75,
            y: 285.31695556640625,
            z: 54.49068832397461
        }, {
            x: 62.81669998168945,
            y: 289.7777404785156,
            z: 45.639007568359375
        }, {
            x: 12.201803207397461,
            y: -299.5888671875,
            z: 9.88082504272461
        }, {
            x: 24.370162963867188,
            y: -298.3565673828125,
            z: 19.734567642211914
        }, {
            x: 36.47172546386719,
            y: -296.3065185546875,
            z: 29.53421974182129
        }, {
            x: 48.47332000732422,
            y: -293.44427490234375,
            z: 39.2529182434082
        }, {
            x: 60.3420524597168,
            y: -289.7777404785156,
            z: 48.86403274536133
        }, {
            x: 72.04539489746094,
            y: -285.31695556640625,
            z: 58.34120559692383
        }, {
            x: 137.03848266601562,
            y: 242.70509338378906,
            z: 110.97157287597656
        }, {
            x: 126.97920989990234,
            y: 251.60116577148438,
            z: 102.82573699951172
        }, {
            x: 116.5718994140625,
            y: 259.8076171875,
            z: 94.39805603027344
        }, {
            x: 105.84506225585938,
            y: 267.3019714355469,
            z: 85.71163940429688
        }, {
            x: 94.828125,
            y: 274.0636291503906,
            z: 76.79029083251953
        }, {
            x: 83.55126953125,
            y: 280.0741271972656,
            z: 67.65847778320312
        }, {
            x: 72.04539489746094,
            y: 285.31695556640625,
            z: 58.34120559692383
        }, {
            x: 11.66795825958252,
            y: -299.5888671875,
            z: 10.505877494812012
        }, {
            x: 23.30393409729004,
            y: -298.3565673828125,
            z: 20.982959747314453
        }, {
            x: 34.87603759765625,
            y: -296.3065185546875,
            z: 31.40252685546875
        }, {
            x: 46.3525505065918,
            y: -293.44427490234375,
            z: 41.73602294921875
        }, {
            x: 57.70201110839844,
            y: -289.7777404785156,
            z: 51.95512771606445
        }, {
            x: 68.893310546875,
            y: -285.31695556640625,
            z: 62.03181838989258
        }, {
            x: 121.42369842529297,
            y: 251.60116577148438,
            z: 109.33039855957031
        }, {
            x: 111.47171783447266,
            y: 259.8076171875,
            z: 100.36959075927734
        }, {
            x: 101.21420288085938,
            y: 267.3019714355469,
            z: 91.13368225097656
        }, {
            x: 90.67926025390625,
            y: 274.0636291503906,
            z: 81.64797973632812
        }, {
            x: 79.89578247070312,
            y: 280.0741271972656,
            z: 71.93849182128906
        }, {
            x: 68.893310546875,
            y: 285.31695556640625,
            z: 62.03181838989258
        }, {
            x: 11.102132797241211,
            y: -299.5888671875,
            z: 11.102132797241211
        }, {
            x: 22.17383575439453,
            y: -298.3565673828125,
            z: 22.17383575439453
        }, {
            x: 33.18476104736328,
            y: -296.3065185546875,
            z: 33.18476104736328
        }, {
            x: 44.10472869873047,
            y: -293.44427490234375,
            z: 44.10472869873047
        }, {
            x: 54.90380859375,
            y: -289.7777404785156,
            z: 54.90380859375
        }, {
            x: 65.55239868164062,
            y: -285.31695556640625,
            z: 65.55239868164062
        }, {
            x: 115.53538513183594,
            y: 251.60116577148438,
            z: 115.53538513183594
        }, {
            x: 106.0660171508789,
            y: 259.8076171875,
            z: 106.0660171508789
        }, {
            x: 96.3059310913086,
            y: 267.3019714355469,
            z: 96.3059310913086
        }, {
            x: 86.28187561035156,
            y: 274.0636291503906,
            z: 86.28187561035156
        }, {
            x: 76.02132415771484,
            y: 280.0741271972656,
            z: 76.02132415771484
        }, {
            x: 65.55239868164062,
            y: 285.31695556640625,
            z: 65.55239868164062
        }, {
            x: 10.505877494812012,
            y: -299.5888671875,
            z: 11.66795825958252
        }, {
            x: 20.982959747314453,
            y: -298.3565673828125,
            z: 23.30393409729004
        }, {
            x: 31.40252685546875,
            y: -296.3065185546875,
            z: 34.87603759765625
        }, {
            x: 41.73602294921875,
            y: -293.44427490234375,
            z: 46.3525505065918
        }, {
            x: 51.95512771606445,
            y: -289.7777404785156,
            z: 57.70201110839844
        }, {
            x: 62.03181838989258,
            y: -285.31695556640625,
            z: 68.893310546875
        }, {
            x: 100.36959075927734,
            y: 259.8076171875,
            z: 111.47171783447266
        }, {
            x: 91.13368225097656,
            y: 267.3019714355469,
            z: 101.21420288085938
        }, {
            x: 81.64797973632812,
            y: 274.0636291503906,
            z: 90.67926025390625
        }, {
            x: 71.93849182128906,
            y: 280.0741271972656,
            z: 79.89578247070312
        }, {
            x: 62.03181838989258,
            y: 285.31695556640625,
            z: 68.893310546875
        }, {
            x: 9.88082504272461,
            y: -299.5888671875,
            z: 12.201803207397461
        }, {
            x: 19.734567642211914,
            y: -298.3565673828125,
            z: 24.370162963867188
        }, {
            x: 29.53421974182129,
            y: -296.3065185546875,
            z: 36.47172546386719
        }, {
            x: 39.2529182434082,
            y: -293.44427490234375,
            z: 48.47332000732422
        }, {
            x: 48.86403274536133,
            y: -289.7777404785156,
            z: 60.3420524597168
        }, {
            x: 58.34120559692383,
            y: -285.31695556640625,
            z: 72.04539489746094
        }, {
            x: 85.71163940429688,
            y: 267.3019714355469,
            z: 105.84506225585938
        }, {
            x: 76.79029083251953,
            y: 274.0636291503906,
            z: 94.828125
        }, {
            x: 67.65847778320312,
            y: 280.0741271972656,
            z: 83.55126953125
        }, {
            x: 58.34120559692383,
            y: 285.31695556640625,
            z: 72.04539489746094
        }, {
            x: 9.228691101074219,
            y: -299.5888671875,
            z: 12.702202796936035
        }, {
            x: 18.432086944580078,
            y: -298.3565673828125,
            z: 25.369590759277344
        }, {
            x: 27.5849609375,
            y: -296.3065185546875,
            z: 37.96744155883789
        }, {
            x: 36.662227630615234,
            y: -293.44427490234375,
            z: 50.46123123168945
        }, {
            x: 45.639007568359375,
            y: -289.7777404785156,
            z: 62.81669998168945
        }, {
            x: 54.49068832397461,
            y: -285.31695556640625,
            z: 75
        }, {
            x: 80.05467987060547,
            y: 267.3019714355469,
            z: 110.18580627441406
        }, {
            x: 71.72213745117188,
            y: 274.0636291503906,
            z: 98.71705627441406
        }, {
            x: 63.19301986694336,
            y: 280.0741271972656,
            z: 86.97772979736328
        }, {
            x: 54.49068832397461,
            y: 285.31695556640625,
            z: 75
        }, {
            x: 8.551261901855469,
            y: -299.5888671875,
            z: 13.167787551879883
        }, {
            x: 17.079084396362305,
            y: -298.3565673828125,
            z: 26.299484252929688
        }, {
            x: 25.560094833374023,
            y: -296.3065185546875,
            z: 39.359092712402344
        }, {
            x: 33.97105026245117,
            y: -293.44427490234375,
            z: 52.310821533203125
        }, {
            x: 42.28888702392578,
            y: -289.7777404785156,
            z: 65.11917877197266
        }, {
            x: 74.17828369140625,
            y: 267.3019714355469,
            z: 114.22453308105469
        }, {
            x: 66.4573974609375,
            y: 274.0636291503906,
            z: 102.33541107177734
        }, {
            x: 58.554351806640625,
            y: 280.0741271972656,
            z: 90.1657943725586
        }, {
            x: 50.49081802368164,
            y: 285.31695556640625,
            z: 77.74903106689453
        }, {
            x: 7.850393295288086,
            y: -299.5888671875,
            z: 13.59727954864502
        }, {
            x: 15.679269790649414,
            y: -298.3565673828125,
            z: 27.157289505004883
        }, {
            x: 23.46516990661621,
            y: -296.3065185546875,
            z: 40.64286422729492
        }, {
            x: 31.186752319335938,
            y: -293.44427490234375,
            z: 54.01704025268555
        }, {
            x: 38.82285690307617,
            y: -289.7777404785156,
            z: 67.24315643310547
        }, {
            x: 146.72213745117188,
            y: -62.373504638671875,
            z: 254.1302032470703
        }, {
            x: 68.09857177734375,
            y: 267.3019714355469,
            z: 117.95018768310547
        }, {
            x: 61.010498046875,
            y: 274.0636291503906,
            z: 105.67327880859375
        }, {
            x: 53.755191802978516,
            y: 280.0741271972656,
            z: 93.10672760009766
        }, {
            x: 46.3525505065918,
            y: 285.31695556640625,
            z: 80.28497314453125
        }, {
            x: 7.128007888793945,
            y: -299.5888671875,
            z: 13.989503860473633
        }, {
            x: 14.236477851867676,
            y: -298.3565673828125,
            z: 27.940662384033203
        }, {
            x: 21.30592918395996,
            y: -296.3065185546875,
            z: 41.81523895263672
        }, {
            x: 28.316978454589844,
            y: -293.44427490234375,
            z: 55.575199127197266
        }, {
            x: 35.25041580200195,
            y: -289.7777404785156,
            z: 69.1828384399414
        }, {
            x: 61.832210540771484,
            y: 267.3019714355469,
            z: 121.35254669189453
        }, {
            x: 55.39636993408203,
            y: 274.0636291503906,
            z: 108.72150421142578
        }, {
            x: 48.808692932128906,
            y: 280.0741271972656,
            z: 95.7924575805664
        }, {
            x: 42.08723449707031,
            y: 285.31695556640625,
            z: 82.60084533691406
        }, {
            x: 6.386085510253906,
            y: -299.5888671875,
            z: 14.343381881713867
        }, {
            x: 12.754667282104492,
            y: -298.3565673828125,
            z: 28.647449493408203
        }, {
            x: 19.088289260864258,
            y: -296.3065185546875,
            z: 42.87299728393555
        }, {
            x: 25.369590759277344,
            y: -293.44427490234375,
            z: 56.98103332519531
        }, {
            x: 31.581357955932617,
            y: -289.7777404785156,
            z: 70.9328842163086
        }, {
            x: 61.010498046875,
            y: 259.8076171875,
            z: 137.0318145751953
        }, {
            x: 55.3963737487793,
            y: 267.3019714355469,
            z: 124.42228698730469
        }, {
            x: 49.630409240722656,
            y: 274.0636291503906,
            z: 111.47171783447266
        }, {
            x: 43.72841262817383,
            y: 280.0741271972656,
            z: 98.21562194824219
        }, {
            x: 37.70656204223633,
            y: 285.31695556640625,
            z: 84.69032287597656
        }, {
            x: 5.626658916473389,
            y: -299.5888671875,
            z: 14.657946586608887
        }, {
            x: 11.237895965576172,
            y: -298.3565673828125,
            z: 29.27571678161621
        }, {
            x: 16.818330764770508,
            y: -296.3065185546875,
            z: 43.8132438659668
        }, {
            x: 22.352664947509766,
            y: -293.44427490234375,
            z: 58.230682373046875
        }, {
            x: 27.825735092163086,
            y: -289.7777404785156,
            z: 72.48851776123047
        }, {
            x: 98.21562957763672,
            y: 122.02099609375,
            z: 255.86044311523438
        }, {
            x: 53.755191802978516,
            y: 259.8076171875,
            z: 140.0370635986328
        }, {
            x: 48.808692932128906,
            y: 267.3019714355469,
            z: 127.15098571777344
        }, {
            x: 43.72841262817383,
            y: 274.0636291503906,
            z: 113.9164047241211
        }, {
            x: 38.52827453613281,
            y: 280.0741271972656,
            z: 100.36958312988281
        }, {
            x: 33.2225341796875,
            y: 285.31695556640625,
            z: 86.54766082763672
        }, {
            x: 4.851809978485107,
            y: -299.5888671875,
            z: 14.93233585357666
        }, {
            x: 9.690321922302246,
            y: -298.3565673828125,
            z: 29.82374382019043
        }, {
            x: 14.502272605895996,
            y: -296.3065185546875,
            z: 44.63340759277344
        }, {
            x: 19.27447509765625,
            y: -293.44427490234375,
            z: 59.32073211669922
        }, {
            x: 23.993846893310547,
            y: -289.7777404785156,
            z: 73.84546661376953
        }, {
            x: 42.08723449707031,
            y: 267.3019714355469,
            z: 129.53118896484375
        }, {
            x: 37.70656204223633,
            y: 274.0636291503906,
            z: 116.04886627197266
        }, {
            x: 33.2225341796875,
            y: 280.0741271972656,
            z: 102.24845123291016
        }, {
            x: 28.647451400756836,
            y: 285.31695556640625,
            z: 88.16778564453125
        }, {
            x: 4.063662528991699,
            y: -299.5888671875,
            z: 15.16579532623291
        }, {
            x: 8.11618709564209,
            y: -298.3565673828125,
            z: 30.290023803710938
        }, {
            x: 12.146465301513672,
            y: -296.3065185546875,
            z: 45.33122634887695
        }, {
            x: 16.143451690673828,
            y: -293.44427490234375,
            z: 60.2481803894043
        }, {
            x: 20.096189498901367,
            y: -289.7777404785156,
            z: 75
        }, {
            x: 35.25041580200195,
            y: 267.3019714355469,
            z: 131.5563507080078
        }, {
            x: 31.581357955932617,
            y: 274.0636291503906,
            z: 117.86322784423828
        }, {
            x: 27.825735092163086,
            y: 280.0741271972656,
            z: 103.84706115722656
        }, {
            x: 23.99384307861328,
            y: 285.31695556640625,
            z: 89.5462417602539
        }, {
            x: 3.2643771171569824,
            y: -299.5888671875,
            z: 15.357686996459961
        }, {
            x: 6.519806861877441,
            y: -298.3565673828125,
            z: 30.67327880859375
        }, {
            x: 9.757365226745605,
            y: -296.3065185546875,
            z: 45.90480041503906
        }, {
            x: 12.968180656433105,
            y: -293.44427490234375,
            z: 61.010498046875
        }, {
            x: 28.316978454589844,
            y: 267.3019714355469,
            z: 133.22091674804688
        }, {
            x: 25.369590759277344,
            y: 274.0636291503906,
            z: 119.35454559326172
        }, {
            x: 22.352664947509766,
            y: 280.0741271972656,
            z: 105.16102600097656
        }, {
            x: 2.456144094467163,
            y: -299.5888671875,
            z: 15.507484436035156
        }, {
            x: 4.9055562019348145,
            y: -298.3565673828125,
            z: 30.972463607788086
        }, {
            x: 7.341522216796875,
            y: -296.3065185546875,
            z: 46.3525505065918
        }, {
            x: 9.757365226745605,
            y: -293.44427490234375,
            z: 61.6055908203125
        }, {
            x: 25.560094833374023,
            y: 251.60116577148438,
            z: 161.38009643554688
        }, {
            x: 21.30592918395996,
            y: 267.3019714355469,
            z: 134.5203399658203
        }, {
            x: 16.818328857421875,
            y: 280.0741271972656,
            z: 106.18675994873047
        }, {
            x: 1.6411792039871216,
            y: -299.5888671875,
            z: 15.614776611328125
        }, {
            x: 3.277859926223755,
            y: -298.3565673828125,
            z: 31.18675422668457
        }, {
            x: 4.9055562019348145,
            y: -296.3065185546875,
            z: 46.67325210571289
        }, {
            x: 6.519806861877441,
            y: -293.44427490234375,
            z: 62.03181838989258
        }, {
            x: 12.754667282104492,
            y: 274.0636291503906,
            z: 121.35254669189453
        }, {
            x: 11.237895965576172,
            y: 280.0741271972656,
            z: 106.92143249511719
        }, {
            x: 0.8217157125473022,
            y: -299.5888671875,
            z: 15.679269790649414
        }, {
            x: 1.6411792039871216,
            y: -298.3565673828125,
            z: 31.315561294555664
        }, {
            x: 2.456144094467163,
            y: -296.3065185546875,
            z: 46.866024017333984
        }, {
            x: 3.2643771171569824,
            y: -293.44427490234375,
            z: 62.28802490234375
        }, {
            x: 5.626658916473389,
            y: 280.0741271972656,
            z: 107.36304473876953
        }, {
            x: 0,
            y: -299.5888671875,
            z: 15.700786590576172
        }, {
            x: 0,
            y: -298.3565673828125,
            z: 31.358539581298828
        }, {
            x: 0,
            y: -296.3065185546875,
            z: 46.93033981323242
        }, {
            x: 0,
            y: -293.44427490234375,
            z: 62.373504638671875
        }, {
            x: 0,
            y: 280.0741271972656,
            z: 107.51038360595703
        }],
        p;
    e.ON_STATE_CHANGED = "onStateChanged";
    e.ON_SEARCH_RESULT = "onSearchResult";
    e.ON_TRANSITION_START = "onTransitionStart";
    e.ON_PARTICLE_ROLLOVER = "onParticleOver";
    e.ON_PARTICLE_ROLLOUT =
        "onParticleOut";
    e.ON_NEW_CLOUDS = "onNewClouds";
    var q = [{
        cameraX: 0.9 * -Math.PI,
        cameraY: 0.5 * -Math.PI,
        type: "",
        cameraRadius: 2E3
    }, {
        cameraX: 0,
        cameraY: -Math.PI / 2,
        type: "",
        cameraRadius: 2E3
    }, {
        cameraX: 0,
        cameraY: -Math.PI / 2,
        type: "",
        cameraRadius: 2E3
    }, {
        cameraX: 0,
        cameraY: -Math.PI,
        type: d.DATA_TYPE_AGENCY,
        cameraRadius: 2500
    }, {
        cameraX: 0,
        cameraY: -Math.PI / 2,
        type: "",
        cameraRadius: 2E3
    }, {
        cameraX: 0.25 * -Math.PI,
        cameraY: 0.4 * -Math.PI,
        type: d.DATA_TYPE_GENRES,
        cameraRadius: 2E3
    }, {
        cameraX: 0,
        cameraY: -Math.PI / 2,
        type: "",
        cameraRadius: 2E3
    }];
    e.STATES = q;
    a.init = function(a) {
        k = breelNS.getNamespace(breelNS.projectName).singletons.siteManager;
        debugger;
        m = k.settings.params;
        this._efIndex = k.scheduler.addEF(this, this.update, []);
        this._renderer = a;
        p = this._renderer.isIn2D ? n : o;
        this._currState = -1;
        this.particles = [];
        this._hasTyped = this._isRollover = this._isLocked = !1;
        this._ringController = (new g).init(this.particles);
        this.initGlobeParticles();
        this._renderer.cameraGlobe.disableTouchEvents();
        if (a) this._onParticleBound = b.createListenerFunction(this, this._onParticle),
            this._renderer.addEventListener(f.ON_PARTICLE_CLICK, this._onParticleBound), this._onParticleOverBound = b.createListenerFunction(this, this._onParticleOver), this._renderer.addEventListener("onParticleOver", this._onParticleOverBound), this._onParticleOutBound = b.createListenerFunction(this, this._onParticleOut), this._renderer.addEventListener("onParticleOut", this._onParticleOutBound);
        this._onSearchAnimOverBound = b.createListenerFunction(this, this._onSearchAnimOver);
        this._ringController.addEventListener(g.ON_SEARCH_ANIM_OVER,
            this._onSearchAnimOverBound);
        this.initialParticlesLenght = 0;
        this._global = {
            offsetRad: 0,
            x: 0,
            y: 0
        };
        return this
    };
    a.initGlobeParticles = function() {
        this.particleGlobes = [];
        for (var a = [], b = this._renderer.isIn2D ? 1 : -1, c = 0; c < p.length; c++) {
            var e = (new d).init();
            e.size = 1.5;
            e.x = p[c].x * b;
            e.y = p[c].y * b;
            e.z = p[c].z;
            e.targetAlpha = 0;
            e.isGlobeParticle = !0;
            e.targetGlobeAlpha = 0.25;
            if (0.8 < Math.random() && 260 > Math.abs(e.y)) e.size = 3, e.numConnectDots = 2 + Math.floor(3 * Math.random()), a.push(e);
            if (0.95 < Math.random() && 260 > Math.abs(e.y)) e.size +=
                5 * Math.random(), e.targetGlobeAlpha = 1;
            this._renderer.addChild(e);
            this.particleGlobes.push(e)
        }
        for (c = 0; c < a.length; c++) a[c].initConnectDots(this.particleGlobes, this._renderer.isIn2D ? 2E3 : 500)
    };
    a.setState = function(a) {
        if (a != this._currState) {
            this.dispatchCustomEvent(e.ON_TRANSITION_START, {
                state: a
            });
            this.lock(!0);
            0 != this._currState && -1 != this._currState && k.scheduler.delay(this, this.lock, [!1], 1E3);
            if (1 !== a) this._renderer.camera._targetRX = q[a].cameraX, this._renderer.camera._targetRY = q[a].cameraY, this._renderer.camera._targetRadius =
                q[a].cameraRadius, this._renderer.camera.lockRx = !1, this._renderer.camera.lockRy = !1;
            this._renderer.setState(a);
            4 !== a && k.globalStateManager.getPage("Stats") && k.globalStateManager.getPage("Stats").close();
            this._renderer._mouseLocked = 5 === a ? !0 : !1;
            switch (a) {
                case 0:
                    this._renderer.camera.respondToMousePos = !1;
                    this._global.y = 500;
                    break;
                case 1:
                    this._renderer.camera.respondToMousePos = !0;
                    this._renderer.camera.lockRx = !0;
                    this._renderer.camera.lockRy = !0;
                    (new TWEEN.Tween(this._global)).to({
                        y: 0
                    }, 1E3).easing(TWEEN.Easing.Cubic.InOut).start();
                    (new TWEEN.Tween(this._renderer.camera)).to({
                        ry: q[a].cameraY,
                        rx: q[a].cameraX
                    }, 1E3).easing(TWEEN.Easing.Cubic.InOut).start();
                    if (5 == this._currState)
                        for (var b = 0; b < this.particles.length; b++) {
                            var c = this.particles[b];
                            c.resetGenre(-1)
                        } else 0 != this._currState && this.removeFlowParticles();
                    this.showGlobe(!1);
                    this._renderer.cameraGlobe.disableTouchEvents();
                    0 != this._currState && 5 != this._currState && this.initParticles();
                    0 != this._currState && k.globalStateManager.getPage("Stats").fetch({
                        type: 0
                    });
                    break;
                case 2:
                    this.removeFlowParticles();
                    this.showGlobe(!0);
                    this.searchForCountry();
                    break;
                case 3:
                    if (4 != this._currState) this.removeFlowParticles(), b = Math.floor(Math.random() * k.model.numAgencies), k.scheduler.delay(k.model, k.model.searchForAgencyIndexRange, [0, this, this.addParticles], 100), this._hasTyped = !1;
                    this.showGlobe(!1);
                    this._renderer.cameraGlobe.disableTouchEvents();
                    break;
                case 5:
                    this.showGlobe(!1);
                    1 != this._currState ? (this.removeFlowParticles(), k.scheduler.delay(k.model, k.model.getInitUsers, [this, this.addParticles], 100), k.scheduler.delay(this,
                        this.filterGenre, [-1], 200)) : this.filterGenre(-1);
                    this.dispatchCustomEvent(e.ON_NEW_CLOUDS);
                    break;
                case 6:
                    this.showGlobe(!1), this._renderer.cameraGlobe.disableTouchEvents()
            }
            if (5 == this._currState)
                for (b = 0; b < this.particles.length; b++) c = this.particles[b], c.resetRadius();
            console.error(a);
            this._currState = a
        }
    };
    a.initParticles = function() {
        k.model.getInitUsers(this, this.addParticles)
    };
    a.search = function(a) {
        k.globalStateManager.getPage("Stats").fetch({
            type: 1,
            extra: k.model.getAgencyIndexWithPosIndex(a)
        });
        this._ringController.search(a,
            this._currState)
    };
    a.searchForCountry = function(a) {
        var b = !!a,
            a = void 0 == a ? "United Kingdom" : a,
            c = k.model.getCountry(a);
        this.removeFlowParticles();
        k.scheduler.delay(k.model, k.model.searchForCountry, [c.name, this, this.addParticles], 100);
        k.scheduler.delay(this._renderer.cameraGlobe, this._renderer.cameraGlobe.enableTouchEvents, [], 100);
        console.log("Search for country : ", a, c);
        this._renderer.cameraGlobe.disableTouchEvents();
        this._renderer.cameraGlobe._targetRX = c.lat / 180 * Math.PI;
        this._renderer.cameraGlobe._targetRY = -c.lng / 180 * Math.PI - Math.PI / 2;
        console.warn(b);
        b && k.globalStateManager.getPage("Stats").fetch({
            type: 2,
            extra: c.name
        });
        this.dispatchCustomEvent(e.ON_NEW_CLOUDS)
    };
    a.searchForPeople = function(a) {
        console.log("Search for People ", a);
        this.removeFlowParticles();
        k.scheduler.delay(k.model, k.model.searchForPeople, [void 0 == a ? 0 : a, this, this.addParticles], 100);
        k.globalStateManager.getPage("Stats").fetch({
            type: 3,
            extra: a
        });
        this.dispatchCustomEvent(e.ON_NEW_CLOUDS)
    };
    a.filterGenre = function(a) {
        for (var b = 0; b < this.particles.length; b++) {
            var c =
                this.particles[b];
            c.isDying || c.searchGenre(a)
        }
    };
    a.typing = function() {
        if (3 == this._currState && !this._hasTyped) {
            this._hasTyped = !0;
            for (var a = 0; a < this.particles.length; a++) {
                var b = this.particles[a];
                "" != q[this._currState].type && b.searchType(q[this._currState].type, 0, k.model.numAgencies)
            }
        }
        4 == this._currState && (this.setState(3), this._ringController.typing())
    };
    a.shift = function(a) {
        if (4 != this._currState) console.log("Not in the right view ");
        else return this._ringController.shift(a)
    };
    a.showGlobe = function(a) {
        for (var b =
            0; b < this.particleGlobes.length; b++) this.particleGlobes[b].targetAlpha = a ? this.particleGlobes[b].targetGlobeAlpha : 0
    };
    a.removeFlowParticles = function() {
        for (var a = this.particles.length - 1; 0 <= a; a--) {
            var b = this.particles[a];
            if (!b.isGlobeParticle) b.isDying = !0, b.targetRadius = m.maxRadius * h(1, 2), b.targetAlpha = 0
        }
    };
    a.addParticles = function(a, b) {
        for (var c = [], e = 0.5 * -Math.random() * Math.PI, f = 0; f < a.length; f++) {
            var g = (new d).init();
            g.userObject = a[f];
            g.colorIndex = a[f].songGenresID;
            g.color = k.settings.colors[g.colorIndex];
            g.hasConnections = a[f].hasConnections;
            g.agency = a[f].agencyIndex;
            this.particles.push(g);
            if (g.hasConnections) g.numConnectDots = 1 + Math.floor(Math.random() * m.maxConnections), g.particleIndex = f, c.push(g);
            if (0 == this._currState) Math.min(this.particles.length / this.initialParticlesLenght, 1), g.alpha = 0, g.xOffset = b[f].origin.x, g.theta = 0 < g.xOffset ? h(Math.PI, 2 * Math.PI) : h(0, Math.PI), g.randomR = m.maxRadius * h(0.75, 1), g.randomZ = h(-m.zRange, m.zRange), g.targetRadius = g.radius = 0, g.currentZ = g.targetZ = 0, g.alpha = 1;
            else if (2 ==
                this._currState) g.thetaOffset = -g.theta * h(0.5, 0.75) + h(-1, 0) + e, g.radius = 2 * g.targetRadius, (new TWEEN.Tween(g)).to({
                thetaOffset: 0,
                alpha: 1,
                targetAlpha: 1
            }, 2E3 + h(0, 500)).easing(TWEEN.Easing.Cubic.InOut).start()
        }
        for (f = 0; f < c.length; f++) c[f].initConnectDots(this.particles)
    };
    a.addPutBackParticles = function(a) {
        a.length = 1;
        console.debug("Add Put back particles : ", a.length, this.particles.length);
        for (var b = [], c = 0.5 * -Math.random() * Math.PI, e = 0; e < a.length; e++) {
            var f = (new d).init();
            f.userObject = a[e];
            f.colorIndex = a[e].genre;
            f.colorIndex = k.genres.indexOf(a[e].songGenres);
            f.color = k.settings.colors[f.colorIndex];
            f.hasConnections = a[e].hasConnections;
            f.agency = a[e].agencyIndex;
            this.particles.push(f);
            if (f.hasConnections) f.numConnectDots = 1 + Math.floor(Math.random() * m.maxConnections), f.particleIndex = e, b.push(f);
            if (2 == this._currState) f.alpha = 0, f.targetAlpha = 0, f.thetaOffset = -f.theta * h(0.5, 0.75) + h(-1, 0) + c, f.radius = 2 * f.targetRadius, (new TWEEN.Tween(f)).to({
                thetaOffset: 0,
                alpha: 1,
                targetAlpha: 1
            }, 2E3 + h(0, 500)).easing(TWEEN.Easing.Cubic.InOut).start();
            f.radius = f.targetRadius = f.alpha = f.targetAlpha = 0;
            f.radius = f.targetRadius = 0.5 * f.baseRadius;
            var g = f.rotSpeed;
            f.rotSpeed = 2 * g;
            f.theta = Math.PI / 2 - 0.8 + 0.2 * e;
            (new TWEEN.Tween(f)).delay(500).to({
                rotSpeed: g
            }, 1500).easing(TWEEN.Easing.Cubic.In).start();
            (new TWEEN.Tween(f)).to({
                targetAlpha: 1,
                radius: f.baseRadius,
                targetRadius: f.baseRadius
            }, 2E3).easing(TWEEN.Easing.Back.Out).start()
        }
        for (e = 0; e < b.length; e++) b[e].initConnectDots(this.particles);
        console.log("After add : ", this.particles.length)
    };
    a.postInitParticles =
        function() {
            console.debug("Post Init Particles");
            m = k.settings.params;
            for (var a = 0; a < this.particles.length; a++) {
                var b = this.particles[a];
                b.randomZ = b.targetZ = h(-m.zRange, m.zRange)
            }
        };
    a._updateParticles = function() {
        for (var a = 0; a < this.particles.length; a++) {
            var b = this.particles[a],
                c = 0 === b.offsetScale ? 0.05 : 0.2;
            b.rotSpeed += (b.targetSpeed - b.rotSpeed) * c;
            b.theta += b.rotSpeed * b.speedValue * m.speed;
            b.radius += (b.targetRadius - b.radius) * b.easing;
            b.alpha += 8 * (b.targetAlpha - b.alpha) * b.easing;
            b.x = Math.cos(b.theta + b.thetaOffset) *
                b.radius + b.xOffset;
            b.y = Math.sin(b.theta + b.thetaOffset) * b.radius + b.yOffset;
            b.scaleInDepth = l(b.y, -1E3, 1E3, 0.5, 1, !0);
            b.scale += (1 + b.offsetScale - b.scale) * c;
            b.scaleInDepth *= b.scale;
            b.currentZ += (b.targetZ - b.currentZ) * b.easing;
            b.z = this._global.y + b.currentZ + b.zOffset + b.ringOffset + (0 == b.layerIndex ? 0 : 0 < b.layerIndex ? 1 : -1) * b.layerRange;
            b.update();
            0 < b.numConnectDots && !b.isGlobeParticle && b.updateConnectDots(this.particles)
        }
    };
    a.offsetGlobalRadius = function() {};
    a.resetGlobalRadius = function() {};
    a._updateParticles_intro =
        function() {
            for (var a = this.particles.length, b = Math.min(a / this.initialParticlesLenght, 1), c = 0; c < a; c++) {
                var d = this.particles[c];
                d.targetZ = b * d.randomZ;
                d.targetRadius = b * d.randomR;
                d.rotSpeed += (50 * d.targetSpeed * b - d.rotSpeed) * d.easing;
                d.theta += d.rotSpeed * d.speedValue * m.speed;
                d.radius += (d.targetRadius - d.radius) * d.easing;
                d.alpha += 8 * (d.targetAlpha - d.alpha) * d.easing;
                d.currentZ += (d.targetZ - d.currentZ) * d.easing;
                d.x = Math.cos(d.theta + d.thetaOffset) * d.radius + d.xOffset;
                d.y = Math.sin(d.theta + d.thetaOffset) * d.radius + d.yOffset;
                d.scaleInDepth = l(d.y, -1E3, 1E3, 0.5, 1, !0);
                d.z = this._global.y + d.currentZ + d.zOffset + d.ringOffset + (0 == d.layerIndex ? 0 : 0 < d.layerIndex ? 1 : -1) * d.layerRange;
                d.update();
                0 < d.numConnectDots && !d.isGlobeParticle && d.updateConnectDots(this.particles)
            }
        };
    a.update = function() {
        if (void 0 != this.particles) {
            0 === this._currState ? this._updateParticles_intro() : this._updateParticles();
            for (var a = 0; a < this.particleGlobes.length; a++) {
                var b = this.particleGlobes[a];
                b.alpha += 0.1 * (b.targetAlpha - b.alpha)
            }
            for (a = this.particles.length; a--;) b =
                this.particles[a], 0.0050 > b.alpha && b.isDying && this.particles.splice(a, 1);
            b = this.particles.concat();
            a = this.particleGlobes.concat();
            b = b.concat(a);
            this._renderer.updateChildrenList(b)
        }
    };
    a._onParticle = function(a) {
        if (!(this._isLocked || 5 == this._currState)) {
            this.lock(!0);
            a = a.detail.particle;
            a.isDying = !0;
            (new TWEEN.Tween(a)).to({
                targetRadius: 0,
                rotSpeed: 0.05,
                size: 50
            }, 800).easing(TWEEN.Easing.Cubic.In).start();
            (new TWEEN.Tween(a)).delay(600).to({
                targetAlpha: 0
            }, 200).easing(TWEEN.Easing.Cubic.In).start();
            for (var b =
                m.explosionRadius, c = m.explosionForce, b = b * b, d = 0; d < this.particles.length; d++) {
                var e = this.particles[d];
                e.targetSpeed = 1;
                e.offsetScale = 0;
                e.mouseLocked = !1;
                if (a != e) {
                    var f = a.distanceTo(e);
                    if (f < b) {
                        var g = vec3.create([e.x - a.x, e.y - a.y, e.z - a.z]);
                        vec3.normalize(g);
                        vec3.create();
                        f = 1 - f / b;
                        f *= c;
                        vec3.scale(g, f);
                        e.ax = g[0];
                        e.ay = g[1];
                        e.az = g[2]
                    }
                }
            }
        }
    };
    a._onParticleOver = function(a) {
        if (!(this._isLocked || 5 == this._currState)) this._isRollover = !0, this.dispatchCustomEvent(e.ON_PARTICLE_ROLLOVER, {
            x: a.detail.x,
            y: a.detail.y
        })
    };
    a._onParticleOut =
        function() {
            if (this._isRollover) this._isRollover = !1, this.dispatchCustomEvent(e.ON_PARTICLE_ROLLOUT)
        };
    a._onSearchAnimOver = function() {
        this.setState(4)
    };
    a.stop = function() {
        k.scheduler.removeEF(this._efIndex);
        this._efIndex = -1
    };
    a.start = function() {
        if (0 > this._efIndex) this._efIndex = k.scheduler.addEF(this, this.update, [])
    };
    a.lock = function(a) {
        this._isLocked = a;
        this._renderer.lock(a)
    };
    a.unlockRenderer = function() {};
    a.getState = function() {
        return this._currState
    }
});
