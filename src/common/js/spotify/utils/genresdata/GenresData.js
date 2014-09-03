(function() {

	var namespace = breelNS.getNamespace("spotify.common.utils.genresdata");

	if (!namespace.GenresData) {

		var GenresData = {};

		GenresData["id_0"] = {
			id: "id_0",
			backendID: 0,
			copyID: "common.genres.id_0",
			color: "#83b601"
		};

		GenresData["id_1"] = {
			id: "id_1",
			backendID: 1,
			copyID: "common.genres.id_1",
			color: "#039568"
		};

		GenresData["id_2"] = {
			id: "id_2",
			backendID: 2,
			copyID: "common.genres.id_2",
			color: "#3bb1e3"
		};

		GenresData["id_3"] = {
			id: "id_3",
			backendID: 3,
			copyID: "common.genres.id_3",
			color: "#116275"
		};

		GenresData["id_4"] = {
			id: "id_4",
			backendID: 4,
			copyID: "common.genres.id_4",
			color: "#b7e2f5"
		};

		GenresData["id_5"] = {
			id: "id_5",
			backendID: 5,
			copyID: "common.genres.id_5",
			color: "#f7d363"
		};

		GenresData["id_6"] = {
			id: "id_6",
			backendID: 6,
			copyID: "common.genres.id_6",
			color: "#ff8a6e"
		};

		GenresData["id_7"] = {
			id: "id_7",
			backendID: 7,
			copyID: "common.genres.id_7",
			color: "#98ceb7"
		};

		GenresData["id_8"] = {
			id: "id_8",
			backendID: 8,
			copyID: "common.genres.id_8",
			color: "#fae6db"
		};

		GenresData["id_9"] = {
			id: "id_9",
			backendID: 9,
			copyID: "common.genres.id_9",
			color: "#ec607b"
		};

		GenresData.list = [
			GenresData["id_0"],
			GenresData["id_1"],
			GenresData["id_2"],
			GenresData["id_3"],
			GenresData["id_4"],
			GenresData["id_5"],
			GenresData["id_6"],
			GenresData["id_7"],
			GenresData["id_8"],
			GenresData["id_9"]
		];

		GenresData.genreIdToClassName  = function(id) {
			if (id===0) {return 'pop';}
			else if (id===1) {return 'dance';}
			else if (id===2) {return 'hiphop';}
			else if (id===3) {return 'rock';}
			else if (id===4) {return 'jazz';}
			else if (id===5) {return 'country';}
			else if (id===6) {return 'latin';}
			else if (id===7) {return 'reggae';}
			else if (id===8) {return 'screen';}
			else if (id===9) {return 'world';}
		};

		GenresData.getItemFromProp = function(prop, search) {
			var len = GenresData.list.length;
			for (var i = 0; i < len; i++) {
				if (GenresData.list[i][prop] === search) return GenresData.list[i];
			}
			return undefined;
		};

		namespace.GenresData = GenresData;

	}
})();
