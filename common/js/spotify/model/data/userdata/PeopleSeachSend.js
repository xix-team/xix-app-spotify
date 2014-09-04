// PeopleSeachSend.js

(function() {

	var namespace = breelNS.getNamespace("spotify.common.model.data.userdata");

	if(!namespace.PeopleSeachSend) {

		var PeopleSeachSend = function(index, qty) {
			this.type = 3;
			this.index = 0;
			this.qty = qty;
			this.search = index;
		}

		PeopleSeachSend.prototype.getParams = function() {
			return {type:this.type, index:this.index, qty:this.qty, search:this.search};
		}


		namespace.PeopleSeachSend = PeopleSeachSend;
		
	}
})();