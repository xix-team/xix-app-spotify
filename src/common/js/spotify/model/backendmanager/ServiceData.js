(function() {

	var namespace = breelNS.getNamespace("spotify.common.model.backendmanager");

	if (!namespace.ServiceData) {

		var ServiceID = breelNS.getNamespace("spotify.common.model.backendmanager").ServiceID;

		var ServiceData = {};

		// Special success functions

		ServiceData.getSpotifyCoverSuccess = function(loadID, data, status, xhr, callback) {
			if (status === "success") {
				try {
					data = {
						status: {
							isOK: true,
							errorCode: 0,
							errorMsg: "no error"
						},
						data: {
							coverURL: data.thumbnail_url
						}
					};
				} catch (error) {
					status = "Can't parse \"thumbnail_url\" from data";
				}
			}
			callback(loadID, data, status, xhr);
		}

		ServiceData.searchSuccess = function(loadID, data, status, xhr, callback) {
			if (status === "success") {

				var i, len, artistLen, artistStr, j;

				// Artists
				try {
					len = Math.min(data.artists.items.length, 3);
				} catch (error)  {
					len = 0;
				}

				var artists;
				if (len > 0) artists = [];
				for (i = 0; i < len; i++) {
					artists[i] = {};
					// ID
					try {
						artists[i].id = data.artists.items[i].id;
					} catch (error) {
						console.warn(error);
						status = "Can't parse \"id\" from artists data";
						callback(loadID, data, status, xhr);
						return;
					}
					// Name
					try {
						artists[i].name = data.artists.items[i].name;
					} catch (error) {
						console.warn(error);
						status = "Can't parse \"name\" from artists data";
						callback(loadID, data, status, xhr);
						return;
					}
					// Image
					try {
						if (data.artists.items[i].images && data.artists.items[i].images.length > 0) {
							artists[i].imageURL = data.artists.items[i].images[0].url;
						} else {
							artists[i].imageURL = undefined;
						}
					} catch (error) {
						console.warn(error);
						status = "Can't parse \"image url\" from artists data";
						callback(loadID, data, status, xhr);
						return;
					}
				}

				// Tracks
				try {
					len = Math.min(data.tracks.items.length, 20);
				} catch (error) {
					len = 0;
				}

				var tracks;
				if (len > 0) tracks = [];
				for (i = 0; i < len; i++) {
					tracks[i] = {};
					// ID
					try {
						tracks[i].id = data.tracks.items[i].id;
					} catch (error) {
						console.warn(error);
						status = "Can't parse \"id\" from tracks data";
						callback(loadID, data, status, xhr);
						return;
					}
					// Name
					try {
						tracks[i].name = data.tracks.items[i].name;
					} catch (error) {
						console.warn(error);
						status = "Can't parse \"name\" from tracks data";
						callback(loadID, data, status, xhr);
						return;
					}
					// Artist(s)
					try {
						if (data.tracks.items[i].artists) {
							artistLen = data.tracks.items[i].artists.length;
						} else {
							artistLen = 0;
						}
						artistStr = "";
						for (j = 0; j < artistLen; j++) {
							artistStr += data.tracks.items[i].artists[j].name;
							if (j < artistLen - 1) {
								artistStr += ", ";
							}
						}
						tracks[i].artist = artistStr;
					} catch (error) {
						console.warn(error);
						status = "Can't parse \"artist\" from tracks data";
						callback(loadID, data, status, xhr);
						return;
					}
					// Image
					try {
						if (data.tracks.items[i].album && data.tracks.items[i].album.images && data.tracks.items[i].album.images.length > 0) {
							tracks[i].imageURL = data.tracks.items[i].album.images[0].url;
						} else {
							tracks[i].imageURL = undefined;
						}
					} catch (error) {
						console.warn(error);
						status = "Can't parse \"image url\" from tracks data";
						callback(loadID, data, status, xhr);
						return;
					}
				}

				// Build response object
				var responseData = {
					artists: artists,
					tracks: tracks
				};
				data = {
					status: {
						isOK: true,
						errorCode: 0,
						errorMsg: "no error"
					},
					data: responseData
				};

			}

			// Callback
			callback(loadID, data, status, xhr);
		}

		// Mode
		// ServiceData.mode = "";
		ServiceData.mode = "";

		// Base urls
		ServiceData.baseURL = "";
		ServiceData.baseURLDummyData = "";

		// SERVICES
		ServiceData[ServiceID.LOGIN_FACEBOOK] = {
			url: "/api/auth/facebook?callback=spotify_loginCallback",
			callback: "spotify_loginCallback"
		};
		ServiceData[ServiceID.LOGIN_LINKEDIN] = {
			url: "/api/authentication/linkedin"
		};
		ServiceData[ServiceID.LOGIN_EMAIL] = {
			url: "/api/auth/email",
			type: "POST",
			dataType: "json",
			addCachebuster: false
		};
		ServiceData[ServiceID.UPDATE_USER] = {
			url: "/api/users/update",
			urlDummyData: "backenddummydata/updateuser.json",
			type: "POST",
			dataType: "json",
			addCachebuster: true
		};
		ServiceData[ServiceID.SEARCH] = {
			url: "https://api.spotify.com/v1/search?q={search}&type={type}",
			urlDummyData: "https://api.spotify.com/v1/search?q={search}&type={type}",
			type: "GET",
			dataType: "json",
			addCachebuster: false,
			onSuccess: ServiceData.searchSuccess
		};
		ServiceData[ServiceID.SUBMIT_SONG] = {
			url: "/api/songs/submit",
			urlDummyData: "backenddummydata/submitsong.json",
			type: "POST",
			dataType: "json",
			addCachebuster: true
		};
		ServiceData[ServiceID.MATCH_SONG] = {
			url: "/api/users/match.json",
			urlDummyData: "backenddummydata/matchsong.json",
			type: "get",
			dataType: "json",
			addCachebuster: true
		};
		ServiceData[ServiceID.CREATE_PLAYLIST] = {
			url: "/api/playlists/create",
			urlDummyData: "backenddummydata/createplaylist.json",
			type: "POST",
			dataType: "json",
			addCachebuster: true
		};
		ServiceData[ServiceID.GET_SPOTIFY_COVER] = {
			url: "https://embed.spotify.com/oembed/?url=spotify%3a{type}:{id}",
			urlDummyData: "https://embed.spotify.com/oembed/?url=spotify%3a{type}:{id}",
			type: "GET",
			dataType: "JSONP",
			addCachebuster: false,
			onSuccess: ServiceData.getSpotifyCoverSuccess
		};
		ServiceData[ServiceID.GET_AGENCIES] = {
			url: "/api/agencies.json",
			urlDummyData: "backenddummydata/getagencies.json",
			type: "GET",
			dataType: "json",
			addCachebuster: false
		};
		ServiceData[ServiceID.DELETE_ACCOUNT] = {
			url: "/api/users/delete",
			urlDummyData: "backenddummydata/deleteaccount.json",
			type: "GET",
			dataType: "json",
			addCachebuster: false
		};
		ServiceData[ServiceID.SIGNOUT] = {
			url: "/api/auth/signout",
			urlDummyData: "backenddummydata/signout.json",
			type: "GET",
			dataType: "json",
			addCachebuster: false
		};
		ServiceData[ServiceID.UPLOAD_PROFILE_IMAGE] = {
			url: "/api/users/update-image",
			urlDummyData: "backenddummydata/uploadimage.json",
			type: "POST",
			dataType: "json",
			addCachebuster: true,
			processData: false,
			contentType: false
		};
		ServiceData[ServiceID.DELETE_PROFILE_IMAGE] = {
			url: "/api/users/remove-image",
			urlDummyData: "backenddummydata/deleteimage.json",
			type: "GET",
			dataType: "json",
			addCachebuster: true
		};
		ServiceData[ServiceID.LOAD_USER] = {
			url: "/api/users/me",
			urlDummyData: "backenddummydata/loaduser.json",
			type: "GET",
			dataType: "json",
			addCachebuster: true
		};
		ServiceData[ServiceID.MATCH] = {
			url: "/api/songs/match",
			urlDummyData: "backenddummydata/match_{type}.json",
			type: "GET",
			dataType: "json",
			addCachebuster: true
		};
		ServiceData[ServiceID.PLAYLIST] = {
			url: "/api/playlists/create",
			urlDummyData: "backenddummydata/playlist.json",
			type: "POST",
			dataType: "json",
			addCachebuster: true
		};

		//	DESKTOP_DURING
		ServiceData[ServiceID.GET_USERS] = {
			url: "/api/data/users.json",
			urlDummyData: "backenddummydata/match_{type}.json",
			type: "GET",
			dataType: "json",
			addCachebuster: true
		};
		ServiceData[ServiceID.SEARCH_PEOPLE] = {
			url: "/api/data/search.json",
			urlDummyData: "backenddummydata/match_{type}.json",
			type: "GET",
			dataType: "json",
			addCachebuster: true
		};
		ServiceData[ServiceID.GET_AGENCIES_LIST] = {
			url: "/api/data/agencies.json",
			urlDummyData: "backenddummydata/match_{type}.json",
			type: "GET",
			dataType: "json",
			addCachebuster: true
		};
		ServiceData[ServiceID.GET_COUNTRY_LIST] = {
			url: "/api/data/countries.json",
			urlDummyData: "backenddummydata/match_{type}.json",
			type: "GET",
			dataType: "json",
			addCachebuster: true
		};
		ServiceData[ServiceID.GET_RANDOM_DATA] = {
			url: "/api/data/random",
			urlDummyData: "backenddummydata/match_{type}.json",
			type: "GET",
			dataType: "json",
			addCachebuster: true
		};
		ServiceData[ServiceID.GET_MATCH] = {
			url: "/api/data/match.json",
			urlDummyData: "backenddummydata/match_{type}.json",
			type: "GET",
			dataType: "json",
			addCachebuster: true
		};
		ServiceData[ServiceID.GET_ALL_USERS] = {
			url: "/api/data/users.json",
			urlDummyData: "backenddummydata/match_{type}.json",
			type: "GET",
			dataType: "json",
			addCachebuster: true
		};
		ServiceData[ServiceID.GET_STATISTICS] = {
			url: "/api/data/statistics.json",
			urlDummyData: "",
			type: "GET",
			dataType: "json",
			addCachebuster: true
		};
		ServiceData[ServiceID.GET_STATISTICS_LIST] = {
			url: "/api/data/toplist.json",
			urlDummyData: "",
			type: "GET",
			dataType: "json",
			addCachebuster: true
		};

		ServiceData.getData = function(id) {
			var obj = this[id];

			var url = obj["url" + this.mode];
			var baseURL = this["baseURL" + this.mode];

			if (url.indexOf("http://") === -1 && url.indexOf("https://") === -1) {
				url = baseURL + url;
			}

			var n = {
				url: url,
				type: obj.type,
				dataType: obj.dataType,
				addCachebuster: obj.addCachebuster,
				onSuccess: obj.onSuccess,
				processData: obj.processData,
				contentType: obj.contentType
			};
			
			return n;
		};

		namespace.ServiceData = ServiceData;
	}

})();