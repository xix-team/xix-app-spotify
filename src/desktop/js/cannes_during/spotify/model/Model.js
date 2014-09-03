// Model.js


breelNS.defineClass(breelNS.projectName+".model.Model", "generic.events.EventDispatcher", function(p, s, Model) {
	var ServiceID         = breelNS.getNamespace("spotify.common.model.backendmanager").ServiceID;
	var UserDataSend      = breelNS.getNamespace("spotify.common.model.data.userdata").UserDataSend;
	var PeopleSeachSend   = breelNS.getNamespace("spotify.common.model.data.userdata").PeopleSeachSend;
	var CountrySearchSend = breelNS.getNamespace("spotify.common.model.data.userdata").CountrySearchSend;
	var GetMatchSend 	  = breelNS.getNamespace("spotify.common.model.data.userdata").GetMatchSend;
	var AgencySearchSend  = breelNS.getNamespace("spotify.common.model.data.userdata").AgencySearchSend;
	var CannesSearchSend  = breelNS.getNamespace("spotify.common.model.data.userdata").CannesSearchSend;
	var UserObject        = breelNS.getNamespace(breelNS.projectName + ".model").UserObject;
	var ListenerFunctions = breelNS.getNamespace("generic.events").ListenerFunctions;
	var GenresData        = breelNS.getNamespace("spotify.common.utils.genresdata").GenresData;
	var genres            = undefined;
	var alphabet          = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
	var siteManager, params;

	p.init = function() {
		siteManager          	= breelNS.getNamespace(breelNS.projectName).singletons.siteManager;
		params               	= siteManager.settings.params;
		this._target 		 	= undefined;
		this._callback			= undefined;
		this._searchIndex		= -1;
		this._agencyData		= [];
		this._completeCount     = 0;
		this._totalCount 		= 5;
		this._saveData			= false;
		this.allUsers 			= [];
		this.countries			= [];
		this.baseHeight 		= 1280;
		this._search_successHandlerBinded      = this._search_successHandler.bind(this);
		this._agency_successHandlerBinded      = this._agency_successHandler.bind(this);
		this._match_successHandlerBinded       = this._match_successHandler.bind(this);
		this._agencyList_successHandlerBinded  = this._agencyList_successHandler.bind(this);
		this._countryList_successHandlerBinded = this._countryList_successHandler.bind(this);
		this._search_errorHandlerBinded        = this._search_errorHandler.bind(this);

		this.getTotalAmountOfAgencies();
		this.getAllCountries();
		this.getInitUsers(undefined, undefined, siteManager.settings.params.numParticles);

		this.numScale = 1;
		var isiPad = navigator.userAgent.match(/iPad/i) != null;
		if(isiPad) this.numScale = .5;

		console.log( "Number Scale : ", this.numScale );
		console.log( "Number Scale : ", this.numScale );
		console.log( "Number Scale : ", this.numScale );
		console.log( "Number Scale : ", this.numScale );
		console.log( "Number Scale : ", this.numScale );

		return this;
	};


	p.getInitUsers = function(target, callback, amount) {
		if(this.allUsers.length != 0 ) {
			console.log( "All user data exist" );
			callback.call(target, this.allUsers);
			return;
		}
		this._saveData = true;
		this._target = target;
		this._callback = callback;
		console.debug( "Get INIT USERS" );
		amount = amount == undefined ? params.numParticles : amount;
		var data = new UserDataSend(0, amount);
		siteManager.backendManager.load(ServiceID.GET_ALL_USERS, data, this._search_successHandlerBinded, this._search_errorHandlerBinded);
		// siteManager.backendManager.load(ServiceID.GET_RANDOM_DATA, data, this._search_successHandlerBinded, this._search_errorHandlerBinded);
	};


	p.getMatchUsers = function(target, callback, userID) {
		this._target = target;
		this._callback = callback;

		userID = userID == undefined ? "5396f47bbbd1a1351ed97242" : userID;
		var data = new GetMatchSend(userID);
		console.debug( "Get MATCH USERS", data );
		siteManager.backendManager.load(ServiceID.GET_MATCH, data, this._match_successHandlerBinded, this._search_errorHandlerBinded);
	};

	/*
	p.searchForAgencyIndex = function(index, target, callback) {
		this._target = target;
		this._callback = callback;
		this._searchIndex = index;
		var data = new AgencySearchSend(index, 300);
		console.debug( "Get search result for Agencies", data );
		siteManager.backendManager.load(ServiceID.SEARCH_PEOPLE, data, this._search_successHandlerBinded, this._search_errorHandlerBinded);
	};
	*/

	p.searchForAgencyIndexRange = function(index, target, callback) {
		this._target = target;
		this._callback = callback;
		this._agencyData = [];
		this._completeCount = 0;
		this._searchIndex = index;

		if(this.numAgencies < 5) {
			this._totalCount = this.numAgencies;
			for(var i =0; i<this.agencies.length; i++) {
				this.searchForAgencyIndex(i);
			}
		} else {
			this._totalCount = 5;
			for(var i=index-2; i<=index+2; i++) {
				this.searchForAgencyIndex(i);
			}
		}

		// this._searchIndex = index;
		// var data = new UserDataSend(index, 60);
		// console.log( "Search for range :", data );
		// siteManager.backendManager.load(ServiceID.GET_USERS, data, this._agency_successHandlerBinded, this._search_errorHandlerBinded);

	};

	p.searchForAgencyIndex = function(index) {
		if(index < 0) index = index + this.numAgencies;
		else if (index >= this.numAgencies) index -= this.numAgencies;
		var agyIndex = this.getAgencyIndexWithPosIndex(index);
		console.debug( "Search for agency : ", index, agyIndex );
		var data = new AgencySearchSend(agyIndex, 60*this.numScale);
		// console.log( "Search for Agency : ", data );
		siteManager.backendManager.load(ServiceID.SEARCH_PEOPLE, data, this._agency_successHandlerBinded, this._search_errorHandlerBinded);

	};


	p.searchForNextAgencyIndex = function(index, target, callback) {
		this._target = target;
		this._callback = callback;
		var agyIndex = this.getAgencyIndexWithPosIndex(index);
		console.debug( "Get search result for Next/Pre Agencies", agyIndex );
		var data = new AgencySearchSend(agyIndex, 60*this.numScale);
		siteManager.backendManager.load(ServiceID.SEARCH_PEOPLE, data, this._search_successHandlerBinded, this._search_errorHandlerBinded);
		// siteManager.backendManager.load(ServiceID.GET_USERS, data, this._search_successHandlerBinded, this._search_errorHandlerBinded);
	};


	p.searchForCountry = function(strCountry, target, callback) {
		this._target = target;
		this._callback = callback;
		var data = new CountrySearchSend(strCountry, 300*this.numScale);
		console.debug( "Get search result for Country", strCountry, data.getParams() );
		siteManager.backendManager.load(ServiceID.SEARCH_PEOPLE, data, this._search_successHandlerBinded, this._search_errorHandlerBinded);
	};


	p.searchForPeople = function(index, target, callback) {
		this._target = target;
		this._callback = callback;
		console.debug( "Get search result for People", index);
		if(index == -1) {
			var data = new CannesSearchSend(params.numParticles);
			siteManager.backendManager.load(ServiceID.SEARCH_PEOPLE, data, this._search_successHandlerBinded, this._search_errorHandlerBinded);
		} else {
			var data = new PeopleSeachSend(index, params.numParticles)
			siteManager.backendManager.load(ServiceID.SEARCH_PEOPLE, data, this._search_successHandlerBinded, this._search_errorHandlerBinded);
		}
		
		
	};


	p.getTotalAmountOfAgencies = function() {
		var data = new PeopleSeachSend(0, 0)
		siteManager.backendManager.load(ServiceID.GET_AGENCIES_LIST, data, this._agencyList_successHandlerBinded, this._search_errorHandlerBinded);
	};


	p.getAllCountries = function() {
		var data = new PeopleSeachSend(0, 0)
		siteManager.backendManager.load(ServiceID.GET_COUNTRY_LIST, data, this._countryList_successHandlerBinded, this._search_errorHandlerBinded);
	};


	p._agency_successHandler = function(data) {
		if (data.status.isOK) {
			if(data.data.users) this._processAgencyData(data.data.users);
			else this._processAgencyData(data.data);
		} else {
			// TODO: Display different error messages
			console.warn(data.status);
		}
	};

	p._match_successHandler = function(data) {
		if (data.status.isOK) {
			if(this._target && this._callback) {

				var users = [];
				for(var i=0; i<data.data.users.length; i++) {

					var vo = data.data.users[i];
					var usr = {};
					usr.firstName = vo.user.name.first;
					usr.lastName = vo.user.name.last
					for (var s in vo.user) {
						usr[s] = vo.user[s];
					}


				if(vo.user.smallPictureUrl && vo.user.smallPictureUrl != "" && vo.user.smallPictureUrl != "undefined")
					usr.smallImg = vo.user.smallPictureUrl;
				else
					usr.smallImg = "/desktop/files/images/1x/common/profile_noimage.png";

				if(vo.user.mediumPictureUrl && vo.user.mediumPictureUrl != "" && vo.user.mediumPictureUrl != "undefined")
					usr.mediumImg = vo.user.mediumPictureUrl;
				else
					usr.mediumImg = "/desktop/files/images/1x/common/profile_noimage.png";

				if(vo.user.largePictureUrl && vo.user.largePictureUrl != "" && vo.user.largePictureUrl != "undefined")
					usr.largeImg = vo.user.largePictureUrl;
				else
					usr.largeImg = "/desktop/files/images/1x/common/profile_noimage.png";

					usr.imgAlbum = vo.song.coverURL;
					usr.songTitle = vo.song.name;
					usr.songGenres = genres[vo.song.genreID];
					usr.songGenre = genres[vo.song.genreID];
					usr.genre = genres[vo.song.genreID];
					usr.songGenresID = vo.song.genreID;
					usr.userID = vo.user.id;
					usr.spotifyID = vo.song.id;
					usr.artistName = vo.song.artist;
					users.push(usr);
				}

				this._callback.call(this._target, users);
				this._target = undefined;
				this._callback = undefined;
				this._searchIndex = -1;
			}
		} else {
			// TODO: Display different error messages
			console.warn(data.status);
		}
	};


	p._search_successHandler = function(data) {
		if (data.status.isOK) {
			if(this._saveData) {
				if(data.data.users) this._processData(data.data.users);
				else this._processData(data.data);
			} else {
				if(this._target && this._callback) {
					if(data.data.users) this._processData(data.data.users);
					else this._processData(data.data);
				}
			}

		} else {
			// TODO: Display different error messages
			console.warn(data.status);
		}
	};


	p._countryList_successHandler = function(data) {
		this.countryList = {"#":[]};
		if (data.status.isOK) {
			this.countries = data.data.countries;
			// console.debug( 'Countries : ', this.countries );
			for (var i=0; i<this.countries.length; i++) {
				var strAgy = this.countries[i].name;
				this.countries[i].lat =  this.countries[i].coords[0];
				this.countries[i].lng =  this.countries[i].coords[1];
				if(strAgy == '' || strAgy == ' ') continue;
				strAgy = strAgy.substring(0, 1).toUpperCase();
				if(alphabet.indexOf(strAgy) > -1 ) {
					if(this.countryList[strAgy] == undefined) this.countryList[strAgy] = [];
					this.countryList[strAgy].push(this.countries[i].name);
				} else {
					this.countryList["#"].push(this.countries[i].name);
				}
			}



		} else {
			// TODO: Display different error messages
			console.warn(data.status);
		}
	}


	p._agencyList_successHandler = function(data) {
		this.agencyList = {"#":[]};
		if (data.status.isOK) {
			this.numAgencies = data.data.agencies.length;
			this.agencies = data.data.agencies;
			for (var i=0; i<this.agencies.length; i++) {
				var strAgy = this.agencies[i].name;
				this.agencies[i].index = i;
				if(strAgy == '' || strAgy == ' ') continue;
				strAgy = strAgy.substring(0, 1).toUpperCase();
				if(alphabet.indexOf(strAgy) > -1 ) {
					if(this.agencyList[strAgy] == undefined) this.agencyList[strAgy] = [];
					this.agencyList[strAgy].push(this.agencies[i].name);
				} else {
					this.agencyList["#"].push(this.agencies[i].name);
				}
			}
		} else {
			// TODO: Display different error messages
			console.warn(data.status);
		}
	}

	p.getAgencyIndex = function(str) {
		for(var i=0; i<this.agencies.length; i++) {
			if(this.agencies[i].name == str) return this.agencies[i].agencyIndex;
		}
		return -1;
	};


	p.getAgencyIndexWithPosIndex = function(index) {
		if(!this.agencies[index]) return -1;
		else return this.agencies[index].agencyIndex;
	};


	p.getAgencyNameWithPosIndex = function(index) {
		if(!this.agencies[index]) return -1;
		else return this.agencies[index].name;
	};

	p.getAgencyNameWithIndex = function(index) {
		for(var i in this.agencies){
			if(this.agencies[i].agencyIndex === index) return this.agencies[i].name.toLowerCase();
		}
		return -1;
	};


	p.getPosIndexWithAgyIndex = function(index) {
		for(var i=0; i<this.agencies.length; i++) {
			if(this.agencies[i].agencyIndex == index) return i;
		}
		return -1;
	}

	p.getAgencyPositionIndex = function(str) {
		for(var i=0; i<this.agencies.length; i++) {
			if(this.agencies[i].name == str) return i;
		}
		return -1;
	};


	p.getCountry = function(str) {
		var strLower = str.slice();
		strLower = strLower.toLowerCase();
		var countryName;
		for(var i=0; i<this.countries.length; i++) {
			countryName = this.countries[i].name.slice();
			countryName = countryName.toLowerCase();
			if(countryName == strLower) {
				return this.countries[i];
			}
		}

		return null;
	};

	p._search_errorHandler = function(error) {	console.warn("_onSearch_errorHandler", error);	};


	p._processData = function(data) {
		genres = siteManager.genres;
		var ary = [];

		for (var i=0; i<data.length; i++) {
			var vo;
			var agyIndex = -1;
			vo = new UserObject().init();
			var d = data[i];
			for ( var s in d) {
				vo[s] = d[s];
				if(s == "genre") {
					vo["songGenresID"] = d[s];
					vo["songGenres"] = genres[d[s]];
					vo["songGenre"] = genres[d[s]];
				}
				
				if(s == "songGenre") {
					vo["songGenresID"] = d[s];
					vo["songGenres"] = genres[d[s]];
					vo["songGenre"] = genres[d[s]];
				}
			}

			if(agyIndex != -1) vo.setAgency(agyIndex);
			ary.push(vo);
		}
		if(this._callback) this._callback.call(this._target, ary);
		this._target = undefined;
		this._callback = undefined;

		if(this._saveData) {
			this.allUsers = ary;
			this._saveData = false;
		}
	};


	p._processAgencyData = function(data) {
		this._completeCount ++;
		console.log( "Complete calls : ", this._completeCount );

		// Set genres data
		

		for (var i=0; i<data.length; i++) {
			var vo;
			var agyIndex = this._searchIndex + this._completeCount-3;
			if(agyIndex< 0) agyIndex += this.numAgencies;
			else if(agyIndex >= this.numAgencies ) agyIndex -= this.numAgencies;
			vo = new UserObject().init();
			var d = data[i];
			for ( var s in d) {
				vo[s] = d[s];
				if(s == "genre") {
					vo["songGenresID"] = d[s];
					vo["songGenres"] = genres[d[s]];
				}

				if(s == "songGenre") {
					vo["songGenresID"] = d[s];
					vo["songGenres"] = genres[d[s]];
					vo["songGenre"] = genres[d[s]];
				}
			}
			vo.setAgency(agyIndex);
			this._agencyData.push(vo);
		}
		if(this._completeCount == this._totalCount) {
			this._callback.call(this._target, this._agencyData);
			this._target = undefined;
			this._callback = undefined;
		}

		// this._searchIndex = -1;
	};
});
