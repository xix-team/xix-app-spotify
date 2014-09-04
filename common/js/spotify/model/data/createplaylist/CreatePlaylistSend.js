(function() {

	var namespace = breelNS.getNamespace("spotify.common.model.data.createplaylist");

	if(!namespace.CreatePlaylistSend) {

		var CreatePlaylistSend = function(playlistName, songIDs) {
			this.playlistName = playlistName;
			this.songIDs = songIDs;
		}

		CreatePlaylistSend.prototype.getParams = function() {
			return {
				playlistName: this.playlistName, 
				songIDs: this.songIDs.join(", ")
			};
		}

		namespace.CreatePlaylistSend = CreatePlaylistSend;
		
	}
})();