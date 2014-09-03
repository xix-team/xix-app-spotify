
// Request animation frame polyfill

if(window.requestAnimFrame == undefined) {
	window.requestAnimFrame = (function(){
        return  window.requestAnimationFrame       || 
        window.webkitRequestAnimationFrame || 
        window.mozRequestAnimationFrame    || 
        window.oRequestAnimationFrame      || 
        window.msRequestAnimationFrame     || 
        function( callback ){
        window.setTimeout(callback, 1000 / 60);
        };
    })();
}

// Console grouping polyfill

if(window.console == undefined) {
        var console = new Object();
        window.console = console;
        console.dir = function(){};     
        console.debug = function(){};
        console.info = function(){};
        console.warn = function(){};
        console.log = function() {};
        console.trace = function(){};
        console.group = function(){};
        console.groupCollapsed = function(){};
        console.timeStamp = function() {};
        console.profile = function() {};
        console.profileEnd = function() {};
        console.error = function() {};
}

if(window.console.debug === undefined) {
    console.debug = function(){};
}



