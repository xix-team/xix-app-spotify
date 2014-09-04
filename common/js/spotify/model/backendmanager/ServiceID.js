(function() {

	var namespace = breelNS.getNamespace("spotify.common.model.backendmanager");

	if(!namespace.ServiceID) {

		var ServiceID = {
			LOGIN_FACEBOOK: 		"login_facebook",
			LOGIN_LINKEDIN: 		"login_linkedin",
			LOGIN_DELEGATE: 		"login_delegate",
			LOGIN_EMAIL: 			"login_email",
			UPDATE_USER: 			"update_user",
			SEARCH: 				"search",
			SUBMIT_SONG: 			"submit_song",
			MATCH_SONG: 			"match_song",
			CREATE_PLAYLIST: 		"create_playlist",
			GET_SPOTIFY_COVER:  	"get_spoitfy_cover",
			GET_AGENCIES:  			"get_agencies",
			DELETE_ACCOUNT:     	"delete_account",
			SIGNOUT:     			"signout",
			UPLOAD_PROFILE_IMAGE: 	"upload_profile_image",
			DELETE_PROFILE_IMAGE: 	"delete_profile_image",
			LOAD_USER: 				"load_user", 
			MATCH: 				    "match",
			PLAYLIST: 				"playlist",


			//	DESKTOP DURING CANNES
			GET_ALL_USERS: 			"get_all_users",
			GET_USERS: 				"data_users",
			GET_AGENCIES_LIST: 		"get_agencies_list",
			GET_COUNTRY_LIST: 		"get_country_list",
			GET_RANDOM_DATA: 		"get_random_data",
			SEARCH_PEOPLE: 			"search_people",
			GET_MATCH: 				"get_match",
			GET_STATISTICS: 		"get_statistics",
			GET_STATISTICS_LIST: 	"get_statistics_list"
		};

		namespace.ServiceID = ServiceID;

	}
})();
 