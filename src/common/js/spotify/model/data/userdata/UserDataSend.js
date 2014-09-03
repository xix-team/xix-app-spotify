// UserDataSend.js

(function() {

	var namespace = breelNS.getNamespace("spotify.common.model.data.userdata");

	if(!namespace.UserDataSend) {

		var UserDataSend = function(index, qty) {
			this.index = index;
			this.qty = qty;
		}

		UserDataSend.prototype.getParams = function() {
			return {index:this.index, qty:this.qty};
		}


		namespace.UserDataSend = UserDataSend;
		
	}
})();