(function() {
	console.log( "Namespace : ", breelNS.projectName );
	var SiteManager = breelNS.getNamespace(breelNS.projectName).SiteManager;
	debugger;
	var siteManager = SiteManager.createSingleton();
	// siteManager.load(breelNS.dirRoot+"files/xml/config_cannes_during.xml", breelNS.dirRoot+"files/xml/copy.xml");
	// siteManager.load(breelNS.dirRoot+"files/xml/config_cannes_during.xml", breelNS.dirRoot+"files/xml/copy.json");
	siteManager.load(breelNS.dirRoot+"files/xml/config_cannes_during.xml", "common/files/copy/cannes/en_in.json");

	document.body.addEventListener('touchmove', function (ev) { 
  		ev.preventDefault();
	});


/*
	var stats = new Stats();
	document.body.appendChild(stats.domElement);
	stats.domElement.style.position = "absolute";
	siteManager.scheduler.addEF(stats, stats.update, []);

	*/
/*
	var fallback = document.getElementById("fallback");
	if(shouldShowFullSite || shouldShowUpgradeSite) {
		if(fallback) fallback.parentNode.removeChild(fallback);

		var siteManager = SiteManager.createSingleton();
		siteManager.load(breelNS.dirRoot+"frontend/files/xml/config.xml", breelNS.dirRoot+"frontend/files/xml/copy.xml");
	} else {
		isFallback = true;
		fallback.style.display = "block";
		try{
			if(document.body !== undefined || document.body !== null) document.body.style.overflow = "hidden";
		} catch(e){
		}
	}
*/
})();