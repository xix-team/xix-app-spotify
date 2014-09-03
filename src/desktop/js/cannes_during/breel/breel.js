(function(aGlobalObject) {
	if(aGlobalObject.breelNS) {
		console.warn("全局对象aGlobalObject已经存在");
		return;
	}
	var breelNS = {};
	//注册命名空间函数
	aGlobalObject.breelNS = breelNS;
	//基本参数配置
	breelNS.projectName = "spotify";
	//访问目录
	breelNS.dirRoot = "desktop/";
	//js目录
	breelNS.javascriptRoot = "";
	//要加载的数组
	breelNS.javascriptToLoad = new Array();
	breelNS.productionMode = false;
	breelNS.fallback = false;
	//生产模式
	if(breelNS.productionMode) {
		breelNS.dirRoot = "/";
	}
	breelNS.javascriptRoot = breelNS.dirRoot + breelNS.javascriptRoot;

	//获得命名空间  参数路径
	breelNS.getNamespace = function(aPackagePath) {

		var currentObject = this;

		var currentArray = aPackagePath.split(".");
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentName = currentArray[i];
			if(currentObject[currentName] === undefined) {
				currentObject[currentName] = {};
			}
			currentObject = currentObject[currentName];
		}

		return currentObject;
	};
	//获得类名路径
	breelNS.getClass = function(aClassPath) {

		var lastSplitPosition = aClassPath.lastIndexOf(".");
		var packagePath = aClassPath.substring(0, lastSplitPosition);
		var className = aClassPath.substring(lastSplitPosition+1, aClassPath.length);
		
		var packageObject = this.getNamespace(packagePath);
		if(packageObject[className] === undefined) {
			//console.error("Class " + aClassPath + " doesn't exist.");
			return null;
		}
		return packageObject[className];
	};

	//定义类
	breelNS.defineClass = function(aClassPath, aSuperClassPath, aDefinitionFunction) {
		var lastSplitPosition = aClassPath.lastIndexOf(".");
		var packagePath = aClassPath.substring(0, lastSplitPosition);
		var className = aClassPath.substring(lastSplitPosition+1, aClassPath.length);
		
		var packageObject = this.getNamespace(packagePath);
		if(packageObject[className] !== undefined) {
			//console.warning("Can't define class " + aClassPath + " as it already exist.");
			return packageObject[className];
		}
		
		var SuperClass = Object;
		if(aSuperClassPath !== null) {
			SuperClass = this.getClass(aSuperClassPath);
			if(SuperClass === null) {
				//console.error("Can't define class " + aClassPath + " as super class " + aSuperClassPath + " doesn't exist.");
				return null;
			}
		}
		
		var ClassConstructor = function() {
			SuperClass.apply(this, arguments);
		};
		ClassConstructor.prototype = new SuperClass();
		packageObject[className] = ClassConstructor;
		
		aDefinitionFunction.call(null, ClassConstructor.prototype, SuperClass.prototype, ClassConstructor);
		
		return ClassConstructor;
	};
    //添加要加载的js路径
	breelNS.addJS = function(aPath) {
		breelNS.javascriptToLoad.push(aPath);
	};
	//加载Js文件
	breelNS.loadJS = function() {
		if(breelNS.fallback) return;
		
		var head= document.getElementsByTagName('head')[0];
		var script= document.createElement('script');

		var path = breelNS.javascriptToLoad.shift();
		
		// console.log("path : ", path);

		script.type= 'text/javascript';
		script.addEventListener("load", loadComplete, false);
		script.src= breelNS.javascriptRoot+path;

		head.insertBefore(script, null);
	};

	//加载网站图标
	breelNS.addFavicon = function() {
		var fav = document.createElement("link");
		fav.rel 	= "shortcut icon";
		fav.href 	= "[url]/favicon.ico";
		var head= document.getElementsByTagName('head')[0];
		head.insertBefore(fav, null);
	}
	//js加载完成回调函数
	function loadComplete() {
		if(breelNS.javascriptToLoad.length > 0) {
			breelNS.loadJS();
		}
	};
	
	breelNS.singletons = new Object();
	
	
})(window);


