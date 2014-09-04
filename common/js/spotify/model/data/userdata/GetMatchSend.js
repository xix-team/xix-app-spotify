// GetMatchSend.js

(function() {

	var namespace = breelNS.getNamespace("spotify.common.model.data.userdata");

	if(!namespace.GetMatchSend) {

		var GetMatchSend = function(userID) {
			this.userID = userID;
		}

		GetMatchSend.prototype.getParams = function() {
			console.log( "User ID : ", this.userID );
			return {userID:this.userID};
		}


		namespace.GetMatchSend = GetMatchSend;
		
	}
})();