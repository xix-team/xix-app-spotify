(function() {

	var namespace = breelNS.getNamespace("spotify.common.model.data.search");

	if(!namespace.SearchSend) {

		var SearchSend = function(str, type) {
			this.str = str;
			this.type = type;
		}

		SearchSend.TYPE_DEFAULT = "default";
		SearchSend.TYPE_ARTIST = "artist";

		SearchSend.prototype.getParams = function() {
			var obj = {};
			if (this.type === SearchSend.TYPE_ARTIST) {
				obj.artistID = this.str;
			} else {
				obj.search = this.str;
			}
			return obj;
		}

		SearchSend.prototype.modifyURL = function(url) {
			var searchType;
			if (this.type === SearchSend.TYPE_DEFAULT) {
				searchType = "artist,track";
			} else {
				searchType = "track";
			}
			url = url.split("{type}").join(searchType);
			return url.split("{search}").join(this.str);
		}

		namespace.SearchSend = SearchSend;
		
	}
})();