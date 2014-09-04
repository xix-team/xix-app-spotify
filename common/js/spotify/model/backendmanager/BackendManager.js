(function() {

	var namespace = breelNS.getNamespace("spotify.common.model.backendmanager");

	if(!namespace.BackendManager) {

		var BackendManager = function BackendManager() {

			var ServiceID = breelNS.getNamespace("spotify.common.model.backendmanager").ServiceID;
			var ServiceData = breelNS.getNamespace("spotify.common.model.backendmanager").ServiceData;
			var ResponseError = breelNS.getNamespace("spotify.common.model.data.error").ResponseError;
			var AlertMessageID = breelNS.getNamespace("spotify.common.pages.alertmessage").AlertMessageID;

			var isLoading = false;
			var loadQueue = [];
			var currentLoadObj;
			var currentLoadID = -1;
			var timeoutID;
			var startTimeMs;
			var ref = this;

			this.load = function(serviceID, params, callbackSuccess, callbackError) {
				if (!serviceID) 		throw new Error("Argument \"serviceID\" is missing");
				if (!callbackSuccess) 	throw new Error("Argument \"callbackSuccess\" is missing");
				if (!callbackError) 	throw new Error("Argument \"callbackError\" is missing");

				var loadObj = createLoadObj(serviceID, params, callbackSuccess, callbackError);
				loadQueue.push(loadObj);
				if (isLoading) {
					return;
				}
				loadNextInQueue();
			};

			var loadNextInQueue = function() {
				if (isLoading) return;

				enableBlocker();

				isLoading = true;
				currentLoadObj = loadQueue.shift();
				var serviceData = geServiceDataFromServiceID(currentLoadObj.serviceID);
				currentLoadObj.url = serviceData.url;
				startTimeMs = new Date().getTime();

				if (currentLoadObj.url) {

					try {
						currentLoadObj.paramsObj = currentLoadObj.params.getParams();
					} catch (error) {
						currentLoadObj.paramsObj = currentLoadObj.params;
					}

					try {
						currentLoadObj.url = currentLoadObj.params.modifyURL(currentLoadObj.url);
					} catch (error) {
					}

					// If no success or fail after 20 sec, auto call fail via timeout
					currentLoadID++;
					var loadID = currentLoadID;
					if (serviceData.type === "JSONP") {
						timeoutID = setTimeout(function(){loadTimeout(loadID)}, 20000);
					}	

					// Call
					$.ajax(
						{
							url: currentLoadObj.url,
							data: currentLoadObj.paramsObj,
							type: serviceData.type,
							dataType: serviceData.dataType,
							processData: serviceData.processData,
							contentType: serviceData.contentType,
							success: function (data, status, xhr) {
								if (serviceData.onSuccess) {
									serviceData.onSuccess(loadID, data, status, xhr, loadSuccessHandler);
								} else {
									loadSuccessHandler(loadID, data, status, xhr);
								}
							}
						}
					).fail(function(jqXHR, textStatus, errorThrown) {
						console.log( "ERROR" );
						loadErrorHandler(loadID, jqXHR, textStatus, errorThrown);
					}.bind(this));

				}

			}

			var createLoadObj = function(serviceID, params, callbackSuccess, callbackError) {
				return {
					serviceID: serviceID,
					params: params,
					callbackSuccess: callbackSuccess,
					callbackError: callbackError
				};
			};

			var geServiceDataFromServiceID = function(serviceID) {
				var serviceData = ServiceData.getData(serviceID);
				if (serviceData) {
					if (serviceData.addCachebuster) {
						serviceData.url = addCachBusterToURL(serviceData.url);
					}
					return serviceData;
				} else {
					console.error("Can't find serviceID \"" + serviceID + "\".", currentLoadObj);
				}
				return undefined;
			}

			var addCachBusterToURL = function(url) {
				return url + ((/\?/).test(url) ? "&" : "?") + (new Date()).getTime();
			};

			var loadSuccessHandler = function(loadID, data, status, xhr) {
				if (loadID !== currentLoadID || !isLoading) return;

				currentLoadObj.loadTimeMs = new Date().getTime() - startTimeMs;
				if (status === "success") {
					if (data && data.status) {
						// Check for critical errors
						var isCriticalError = checkIfCriticalError(data.status);
						if (isCriticalError) {
							showPageRestartAlert(data.status);
						} else {
							// Call callback
							currentLoadObj.callbackSuccess(data);
						}

					} else {
						console.warn(data);
						currentLoadObj.callbackError(new ResponseError("error", "Invalid \"data.status\" object", currentLoadObj));
					}

				} else {
					currentLoadObj.callbackError(new ResponseError(status, undefined, currentLoadObj));
				}
				afterLoad();
			};

			var loadErrorHandler = function(loadID, jqXHR, textStatus, errorThrown) {
				if (loadID !== currentLoadID || !isLoading) return;

				currentLoadObj.loadTimeMs = new Date().getTime() - startTimeMs;
				currentLoadObj.callbackError(new ResponseError(textStatus, errorThrown, currentLoadObj));
				afterLoad();
			}

			var loadTimeout = function(loadID) {
				loadErrorHandler(loadID, undefined, "timeout", undefined);
			};

			var afterLoad = function() {
				clearTimeout(timeoutID);

				// Clean up
				delete currentLoadObj.params;
				delete currentLoadObj.callbackError;
				delete currentLoadObj.callbackSuccess;
				currentLoadObj = undefined;

				// Set as not loading
				isLoading = false;

				disableBlocker();

				// Check load queue
				if (loadQueue.length > 0) {
					loadNextInQueue();
				}
			};

			var enableBlocker = function() {
				if(breelNS.getNamespace(breelNS.projectName).singletons.siteManager.globalStateManager._blocker)
					breelNS.getNamespace(breelNS.projectName).singletons.siteManager.globalStateManager._blocker.style.display = "block";
			};

			var disableBlocker = function() {
				if(breelNS.getNamespace(breelNS.projectName).singletons.siteManager.globalStateManager._blocker)
					breelNS.getNamespace(breelNS.projectName).singletons.siteManager.globalStateManager._blocker.style.display = "none";
			};

			var checkIfCriticalError = function(status) {
				if (!status.isOK) {
					if (status.errorCode === undefined || status.errorCode === 1 || status.errorCode === 4) {
						return true;
					}
				}
				return false;
			};

			var showPageRestartAlert = function(status) {
				console.warn("PAGE RESTART", status);
				disableBlocker();
				// Show alert
				var params = {
					id: AlertMessageID.PAGE_RESTART,
					from: "callback_directly",
					callbackRef: ref,
					callbackOK: ref.showPageRestartAlert_callbackOKHandler,
					callbackOKParams: ["error_page_restart"]
				};
				breelNS.getNamespace(breelNS.projectName).singletons.siteManager.globalStateManager.setPage("AlertMessage", params);
			}

			this.showPageRestartAlert_callbackOKHandler = function(param) {
				location.reload();
			};

		}

		namespace.BackendManager = BackendManager;
	}
})();
