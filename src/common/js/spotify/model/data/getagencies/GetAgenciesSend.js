(function() {

	var namespace = breelNS.getNamespace("spotify.common.model.data.getagencies");

	if(!namespace.GetAgenciesSend) {

		var GetAgenciesSend = function() {
		}

		GetAgenciesSend.prototype.getParams = function() {
			return undefined;
		}

		namespace.GetAgenciesSend = GetAgenciesSend;
		
	}
})();