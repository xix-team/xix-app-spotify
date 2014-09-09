// AssetManager.js

(function() {
	// IMPORTS
	var namespace = breelNS.getNamespace("generic.core");
	var EventDispatcher = breelNS.getNamespace("generic.events").EventDispatcher;
	var core;

	if(!namespace.AssetManager) {
		var AssetManager = function() {
			this.assets = {};
			this._queue = [];
			this._nAssetToLoad = 0;
			this._nAssetLoaded = 0;
			this._imagesFolder = "files/images";
			this._imagesFolder = breelNS.dirRoot + this._imagesFolder;
			this._currentPixelDensity = "1x";
			this._req = null;
			this._parser = new DOMParser();
			this._requestOnReadyStateChangeBound = this._requestOnReadyStateChange.bind(this);
			this._currentAsset = null;
			this.combinedSequence = {};
			this._combinedSequenceLoaded = [];
		}


		AssetManager.ALL_COMPLETE = "allComplete";
		AssetManager.PROGRESS = "onProgress";
		AssetManager.ERROR = "assetManagerError";
		AssetManager.LOADED = "assetManagerLoaded";

		AssetManager.TEMPLATE_IMAGES = "assetManagerImageLoading";

		namespace.AssetManager = AssetManager;
		var p = AssetManager.prototype = new EventDispatcher();


		p.init = function(aImageRoute) {
			// console.log("aImageRoute : ", aImageRoute);
			if(aImageRoute !== undefined) this._imagesFolder = aImageRoute;
			core = breelNS.getNamespace(breelNS.projectName).singletons.siteManager;
			var pixelDensity = window.devicePixelRatio;
			this._currentPixelDensity = "1x";
			if (pixelDensity) {
				if (pixelDensity >= 2) this._currentPixelDensity = "2x";
			}
		};


		p.enqueue = function(id, type, url) {
			if (type=="sequence") {

				function pad (str, max) {
				  return str.length < max ? pad("0" + str, max) : str;
				}

				var n = url.lastIndexOf("_");
				var m = url.lastIndexOf(".");
				var stStart = url.substring(0,n+1);
				var stEnd = url.substring(m,url.length);
				var numSeq = url.substring(n+1,m);

				for (var i=0; i<numSeq; i++) {
					var nid = pad(i.toString(), numSeq.length);
					var nurl = stStart + nid + stEnd;
					// //console.log(id+i);
					this._queue.push(	{id:(id+i), type:type, url:nurl});
				}
			}
			else {

				this._queue.push(	{id:id, type:type, url:url}	);
			}
		};


		p.startLoading = function() {
			this._nAssetToLoad = this._queue.length;
			this._nAssetLoaded = 0;
			this._loadNext();
		};


		p._loadNext = function() {
			if(this._queue.length == 0) {
				this._onAllAssetLoaded();
				return;
			}

			var asset = this._queue.shift();
			this._currentAsset = asset;
			var type = asset.type;

			if(this.hasAsset(asset.id)) {
				//console.log( "Asset With ID : ", asset.id , " already exist, move on to next asset." );
				this._loadNext();
				return;
			}
		

			switch(type) {
				case "sequenceCombined" :
					this._req = new XMLHttpRequest();
					this._req.onreadystatechange = this._requestOnReadyStateChangeBound;
					this._req.open("GET", breelNS.dirRoot+asset.url, true);
					this._req.send(null);
					break;
				case "audio" :
					var that = this;
					var audio = new Audio();

					audio.addEventListener("canplaythrough", function() {
						that._onProgress();
					});
					audio.src = breelNS.dirRoot+asset.url;
					audio.load();
					break;
				case "template" :
					this._req = new XMLHttpRequest();
					this._req.onreadystatechange = this._requestOnReadyStateChangeBound;
					this._req.open("GET", breelNS.dirRoot+asset.url, true);
					this._req.send(null);
					// this._onProgress();
					break;
				case "image" : 
				case "svg" : 
				case "sequence":
					var that = this;
					var newImage = new Image();
					var src = this.getImageSrc(asset.url);
					newImage.onload = function() {
						that.assets[asset.id] = this;
						that._onProgress();
					}

					newImage.onerror = function() {
						console.error("ERROR loading image asset : " + src);
						that._loadNext();
					}

					newImage.src = src;
					break;
				default : 
					this._onProgress();
					break;
			}
			
		};


		p._onProgress = function() {

			this._nAssetLoaded ++;
			//console.log( "on Progress : ", this._currentAsset.id, " : ",  this._nAssetLoaded, "/",  this._nAssetToLoad );
			this.dispatchCustomEvent(AssetManager.PROGRESS, {loaded:this._nAssetLoaded, total:this._nAssetToLoad} );
			this._loadNext();
		};


		p._onAllAssetLoaded = function() {
			this.dispatchCustomEvent(AssetManager.ALL_COMPLETE, null);
		};


		p.getImageSrc = function(aPath) {
			var svgsupport = true;

			if (aPath == "" || aPath == null) return aPath;				

			var pathPrefix = "";
			if (this._pathContainsSVG(aPath)) {
				if(!this.supportsSVG()) {
					//console.log("Browser does not support SVG");
					svgsupport = false;
				}
				pathPrefix = this._imagesFolder + "/svgs";
			} else {
				pathPrefix = this._imagesFolder + "/" + this._currentPixelDensity;
			}

			if (aPath.indexOf(pathPrefix) == -1 && aPath.indexOf("/singlequality/") == -1)
				aPath = pathPrefix + "/" + aPath;

			if(!svgsupport) {
				var svgParts = aPath.split('/');
				var fileName = svgParts[4].split('.');
				fileName = fileName[0];
				var aPath = svgParts[0]+"/"+svgParts[1]+"/"+svgParts[2]+"/svgFallback/"+fileName+'.png';
			}

			return aPath;
		};


		p.getPixelDensityInt = function() {
			switch(this._currentPixelDensity)
			{
				case "1x": 
					return 1;
				break;
				case "2x":
					return 2;
				break;
				default:
					return 1;
				break;
			}
		};


		p._pathContainsSVG = function(aPath) {	
			if(aPath == undefined) return false;
			return aPath.indexOf(".svg") !== -1;	
		};
		p.getAsset = function(id) {	return this.assets[id];	};
		p.hasAsset = function(id) {	return !(this.assets[id] == undefined);	}
		p.removeAsset = function(id) {};


		p.supportsSVG = function() {
			var passed = true;
			var checkOne = !!document.createElementNS && !!document.createElementNS('http://www.w3.org/2000/svg', "svg").createSVGRect;
			if(!checkOne) {
				passed = false;
				var checkTwo = document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure", "1.1");
				if(checkTwo)
					passed = true;
			}
			return passed;
		};


		p.updateAllStyleSheetsForPixelDensity = function() {
			debugger;
			for (var i = 0; i < document.styleSheets.length; i++ ){
				this.updateImageSrcInCSSSheet(document.styleSheets[i]);
			}
		};
		

		p.updateImageSrcInCSSSheet = function(aStyleSheet) {
			debugger;
			var ruleList = aStyleSheet.cssRules || aStyleSheet.rules || new Array();
			for (var i= 0; i < ruleList.length; i++)
			{
				var rule = ruleList[i];				
				
				if(rule.cssRules) {
					
					for (var j = 0; j< rule.cssRules.length; j++) {
						var newRule = rule.cssRules[j];
						if (newRule.style) {
							if (newRule.style.backgroundImage != "") {
								var newBackgroundImagePath = "";
								if (this._pathContainsSVG(newRule.style.backgroundImage, ".svg"))
									newBackgroundImagePath = newRule.style.backgroundImage.replace(/\/xx\//g, "/svg/");
								else
									newBackgroundImagePath = newRule.style.backgroundImage.replace(/\/xx\//g, "/" + this._currentPixelDensity + "/");
									newRule.style.backgroundImage = newBackgroundImagePath;
									// //console.log("updated background image in newRule : ", newRule, " to ",  newBackgroundImagePath);
							}
						}
					}

				} else {
				
					if (rule.style) {
						try {
							if (rule.style.backgroundImage != "") {
							var newBackgroundImagePath = "";
							if (this._pathContainsSVG(rule.style.backgroundImage, ".svg"))
								newBackgroundImagePath = rule.style.backgroundImage.replace(/\/xx\//g, "/svg/");
							else
								newBackgroundImagePath = rule.style.backgroundImage.replace(/\/xx\//g, "/" + this._currentPixelDensity + "/");
							rule.style.backgroundImage = newBackgroundImagePath;
							// //console.log("updated background image in rule : ", rule, " to ",  newBackgroundImagePath);
							}
						} catch(e) {
							// console.error(e);
						}
						
					}

				}
					
			}

		};


		p._requestOnReadyStateChange = function() {
			switch(this._req.readyState) {
			case 0: //Uninitialized
				case 1: //Set up
				case 2: //Sent
				case 3: //Partly done
					// DO NOTHING
					break;
				case 4: //Done
				debugger;
					if(this._req.status < 400) {
					//console.log( "Get ready event from : ", this._currentAsset.id );	
						if(this._currentAsset.type == "template") this._templateLoadCallback(this._req.responseText);
						else if ( this._currentAsset.type == "sequenceCombined") {
							if(this._combinedSequenceLoaded.indexOf(this._currentAsset.id) != -1) return;
							this._combinedSequenceLoaded.push(this._currentAsset.id);
							this._loadCombinedImageSequence(this._req.responseText);
						} else {
							//console.log( "FROM XML HTTP REQUEST : ", this._req.responseText );
						}
					} else  {
						this.dispatchCustomEvent(AssetManager.ERROR, "Error loading template from ", this._currentlyLoadingTemplate,  " status : ", this._req.status);	
					}
					break;
			}
		};


		p._loadCombinedImageSequence = function(frameData) {
			this.frameData = JSON.parse(frameData);
			this.imageSequenceCount = 0;
			this.frames = this.frameData.frames.concat();
			this._nAssetToLoad += this.frameData.totalImages;
			var o = {};
			this.combinedSequence[this.frameData.name] = o;
			o.imageSequences = [];
			//console.log( "Start Loading combined image sequences:" );
			//console.log( this.frameData );
			this._loadNextCombinedImage();
		};
 
 
		p._loadNextCombinedImage = function() {
			if(this.imageSequenceCount == this.frameData.totalImages) {
				this._createImageSequenceAssets();
				return;
			}
 
			var id = this.frameData.name + "_" + this.imageSequenceCount;
 
			var path = "../files/sequences/" + this.frameData.name + "/" + this.frameData.name + "_" + this.imageSequenceCount + ".jpg";
			if(core.useCompressedAssets) {
				path = "../files/sequences/ie/" + this.frameData.name + "/" + this.frameData.name + "_" + this.imageSequenceCount + ".jpg";	
			}
			var img = new Image();
			var that = this;

			img.onerror = function(){
				console.log( "Error Loading image : ", path );
			}
			//console.log( "Loading : ", path );
			img.onload = function() {
				//console.log( "on load : ", path );
				var str = this.src.substring(this.src.lastIndexOf("_")+1);
				var seqIndex = parseInt(str.substring(0, str.indexOf(".")) );
				// that.combinedSequence[that.frameData.name].imageSequences.push(this);
				that.combinedSequence[that.frameData.name].imageSequences[seqIndex] = this;
				that.imageSequenceCount++;
				that._updateCombinedImageProgress();
				that._loadNextCombinedImage();
			}
			img.src = path;
		}


		p._updateCombinedImageProgress = function() {
			this._nAssetLoaded ++;
			// console.log( this._nAssetLoaded, this._nAssetToLoad );
			this.dispatchCustomEvent(AssetManager.PROGRESS, {loaded:this._nAssetLoaded, total:this._nAssetToLoad} );
			// this.dispatchCustomEvent(AssetManager.PROGRESS, {loaded:this._nAssetLoaded, total:this._nAssetToLoad} );
		}
 
 
		p._createImageSequenceAssets = function() {
			this.assets[this._currentAsset.id] = this.frameData;
			this._onProgress();
		}


		p.getCombinedSequence = function(id) {
			return this.combinedSequence[id];
		};


		p._templateLoadCallback = function(aTemplateXML) {
			// //console.log( aTemplateXML );
			var templateDoc = this._parser.parseFromString(aTemplateXML, "text/xml");

			var templatesInXML = templateDoc.querySelectorAll("*[data-type='template']");

			for (var i = 0; i < templatesInXML.length; i++){
				var templateNode = templatesInXML[i];
				var templateId = templateNode.getAttribute("id");
				templateNode = this._updateImagesInTemplate(templateNode);

				var attrs = templateNode.attributes;
				var result = undefined;
				for(var z = 0; z < attrs.length; z++) {
					if (attrs[z] !== undefined) {
						if(attrs[z].nodeName == 'data-template-id') {
							result = attrs[z].nodeValue;
						}
				  	}
				}
				if (result !== undefined) templateId = result;

				// templateId = (templateNode.getAttribute('data-template-id') === null) ? templateId : templateNode.getAttribute('data-template-id');
				// templateId = (templateNode.dataset['templateId'] === undefined) ? templateId : templateNode.dataset['templateId'];
				this._getAllImagesInTemplate(templateNode);
				this._updateCopyInTemplate(templateNode);
				//添加到template
				// this._templates[templateId] = templateNode;			
				this.assets[templateId] = templateNode;
			}

			this._onProgress();
		};



		p._updateImagesInTemplate = function(aTemplate) {
			var imageCollection = aTemplate.querySelectorAll("img");

			for (var i= 0; i < imageCollection.length; i++)
			{
				var img = imageCollection[i];
				var imgSrc = img.getAttribute('src');
				if (imgSrc) {
					img.setAttribute('src', this.getImageSrc(imgSrc));
				}
					
			}

			return aTemplate;

		};

		p._getAllImagesInTemplate = function(aTemplate) {
			var childNodes = aTemplate.querySelectorAll("*");
			var imagesInTemplate = [];
			for (var i=0;i<childNodes.length;i++){
				var childNode = childNodes[i];
				for (var j = 0; j < childNode.attributes.length; j++)
				{
					var attributeValue = childNode.attributes[j].value;
					if (attributeValue.match(/(.png)/))
					{
						imagesInTemplate.push(attributeValue);	
					}
						

				}
				// if (childNode.hasAttribute('src'))
				// 	imagesInTemplate.push(childNode.getAttribute('src'));
				
			}
			if (imagesInTemplate.length > 0)
				this.dispatchCustomEvent(AssetManager.TEMPLATE_IMAGES, imagesInTemplate);

		};

		p._updateCopyInTemplate = function(aTemplate) {
			
			var copyCollection = aTemplate.querySelectorAll("*[data-type='copy']");

			for (var i = 0; i < copyCollection.length; i++){
				var copyNode = copyCollection[i];
				var copyId = copyNode.getAttribute("data-copyId");
				copyId=copyId?copyId:copyNode.getAttribute("data-copyid");
				// //console.log(copyId, copyNode, copyNode.innerHTML);
				try {
					copyNode.innerHTML = core.copyManager.getCopy(copyId);
				} catch(e) {
				}
				
			}

		};
	}
	
})();