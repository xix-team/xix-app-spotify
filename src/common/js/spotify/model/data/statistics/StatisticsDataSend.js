// UserDataSend.js

(function() {

	var namespace = breelNS.getNamespace("spotify.common.model.data.statistics");

	if(!namespace.StatisticsDataSend) {

		var StatisticsDataSend = function(params) {
			if(params){
				this.type = params.type;
				this.extra = params.extra;
			}
		}

		StatisticsDataSend.prototype.getParams = function() {
			switch(this.type){
				// all
				case 0:
					return {
						type: 0
					}
					break;
				// Agencies
				case 1:
					return {
						type: 1,
						agencyIndex: this.extra
					}
					break;
				// World / Countries
				case 2:
					return {
						type: 2,
						country: this.extra
					}
					break;
				// Professions
				case 3:

					return {
						type: this.extra === -1 ? 0 : 3,
						profession: this.extra
					}
					break;
			}
		}


		namespace.StatisticsDataSend = StatisticsDataSend;
		
	}
})();