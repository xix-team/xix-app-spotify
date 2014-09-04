(function() {

	var namespace = breelNS.getNamespace("spotify.common.model.data.submitsong");

	if(!namespace.SubmitSongSend) {

		var SubmitSongSend = function(songID, coverURL, song, artist) {
			this.songID = songID;
			this.coverURL = coverURL;
			this.song = song;
			this.artist = artist;
		}

		SubmitSongSend.prototype.getParams = function() {
			return {
				songID: this.songID, 
				coverURL: this.coverURL,
				song: this.song,
				artist: this.artist
			};
		}

		namespace.SubmitSongSend = SubmitSongSend;
		
	}
})();