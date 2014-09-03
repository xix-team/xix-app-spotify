// CountrySearchSend.js

(function() {

	var namespace = breelNS.getNamespace("spotify.common.model.data.userdata");

	if(!namespace.CountrySearchSend) {

		var CountrySearchSend = function(strCountry, qty) {
			this.type = 2;
			this.index = 0;
			this.qty = qty;
			this.search = strCountry;
		}

		CountrySearchSend.prototype.getParams = function() {
			return {type:this.type, index:this.index, qty:this.qty, search:this.search};
		}


		namespace.CountrySearchSend = CountrySearchSend;
		
	}
})();