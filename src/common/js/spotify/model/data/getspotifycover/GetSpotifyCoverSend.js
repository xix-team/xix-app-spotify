(function() {

	var namespace = breelNS.getNamespace("spotify.common.model.data.getspotifycover");

	if(!namespace.GetSpotifyCoverSend) {

		var GetSpotifyCoverSend = function(type, id) {
			this.type = type;
			this.id = id;
		}

		GetSpotifyCoverSend.TYPE_ARTIST = "artist";
		GetSpotifyCoverSend.TYPE_ALBUM = "album";
		GetSpotifyCoverSend.TYPE_TRACK = "track";

		GetSpotifyCoverSend.prototype.getParams = function() {
			return undefined
		}

		GetSpotifyCoverSend.prototype.modifyURL = function(url) {
			url = url.split("{type}").join(this.type)
			return url.split("{id}").join(this.id);
		}

		namespace.GetSpotifyCoverSend = GetSpotifyCoverSend;
		
	}
})();