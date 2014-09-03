(function() {

	var namespace = breelNS.getNamespace("spotify.common.model.data.updateuser");

	if(!namespace.UpdateUserSend) {

		var UpdateUserSend = function(firstname, surname, agency, profession, country) {
			this.firstname = firstname;
			this.surname = surname;
			this.agency = agency;
			this.profession = profession;
			this.country = country;
		};

		UpdateUserSend.prototype.getParams = function() {
			return {
				name: {
					first: this.firstname,
					last: this.surname
				},
				agency: this.agency,
				profession: this.profession,
				country: this.country
			};
		};

		namespace.UpdateUserSend = UpdateUserSend;

	}
})();
