// AgencySearchSend.js

(function() {

	var namespace = breelNS.getNamespace("spotify.common.model.data.userdata");

	if(!namespace.AgencySearchSend) {

		var AgencySearchSend = function(index, qty) {
			this.type = 1;
			this.index = 0;
			this.qty = qty;
			this.search = index;
		}

		AgencySearchSend.prototype.getParams = function() {
			return {type:this.type, index:this.index, qty:this.qty, search:this.search, agencyIndex:this.search};
		}


		namespace.AgencySearchSend = AgencySearchSend;
		
	}
})();