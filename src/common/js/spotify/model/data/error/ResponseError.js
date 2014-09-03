(function() {

	var namespace = breelNS.getNamespace("spotify.common.model.data.error");

	if(!namespace.ResponseError) {

		var ResponseError = function(status, errorThrown, loadObj) {
			this.status = status;
			this.errorThrown = errorThrown;
			this.loadObj = loadObj;
		}

		namespace.ResponseError = ResponseError;
		
	}
})();