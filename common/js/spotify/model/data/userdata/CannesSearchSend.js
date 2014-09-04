// CannesSearchSend.js

(function() {

	var namespace = breelNS.getNamespace("spotify.common.model.data.userdata");

	if(!namespace.CannesSearchSend) {

		var CannesSearchSend = function(qty) {
			this.type = 0;
			this.index = 0;
			this.qty = qty;
			this.search = 0;
		}

		CannesSearchSend.prototype.getParams = function() {
			return {type:this.type, index:this.index, qty:this.qty, search:this.search, agencyIndex:this.search};
		}


		namespace.CannesSearchSend = CannesSearchSend;
		
	}
})();