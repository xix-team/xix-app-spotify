(function() {
	breelNS.addFavicon();

	// DEV START   
	breelNS.addJS("../common/js/breel/abstract/InitObject.js");
	breelNS.addJS("../common/js/breel/events/ListenerFunctions.js");
	breelNS.addJS("../common/js/breel/events/EventDispatcher.js");
	breelNS.addJS("../common/js/breel/math/MathUtils.js");
	breelNS.addJS("../common/js/breel/math/SimpleTrig.js");
	breelNS.addJS("../common/js/breel/math/BinaryTree.js");
	breelNS.addJS("../common/js/breel/utils/UrlFunctions.js");
	breelNS.addJS("../common/js/breel/utils/ComplexKeyDictionary.js");
	breelNS.addJS("../common/js/breel/utils/GestureDetector.js");
	breelNS.addJS("../common/js/breel/utils/FullscreenAPI.js");
	breelNS.addJS("../common/js/breel/utils/Scheduler.js");
	breelNS.addJS("../common/js/breel/utils/Utils.js");
	breelNS.addJS("../common/js/breel/utils/FormValidation.js");
	breelNS.addJS("../common/js/breel/utils/NumberFunctions.js");
	breelNS.addJS("../common/js/breel/utils/LevenshteinDistance.js");
	breelNS.addJS("../common/js/breel/utils/ColorBlender.js");
	breelNS.addJS("../common/js/breel/utils/MultipleCallLock.js");
	breelNS.addJS("../common/js/breel/utils/StringFormat.js");
	breelNS.addJS("../common/js/breel/utils/ProfanityCheck.js");
	breelNS.addJS("../common/js/breel/htmldom/DomElementCreator.js");
	breelNS.addJS("../common/js/breel/htmldom/ElementUtils.js");
	breelNS.addJS("../common/js/breel/htmldom/PositionFunctions.js");
	breelNS.addJS("../common/js/breel/svg/SvgFactory.js");
	breelNS.addJS("../common/js/breel/canvas/CanvasFactory.js");
	breelNS.addJS("../common/js/breel/canvas/Drawing.js");
	breelNS.addJS("../common/js/breel/animation/AnimationManager.js");
	breelNS.addJS("../common/js/breel/animation/TweenDelay.js");
	breelNS.addJS("../common/js/breel/animation/DomElementOpacityTween.js");
	breelNS.addJS("../common/js/breel/animation/DomElementPositionTween.js");
	breelNS.addJS("../common/js/breel/animation/DomElementScaleTween.js");
	breelNS.addJS("../common/js/breel/animation/TweenHelper.js");
	breelNS.addJS("../common/js/breel/animation/EaseFunctions.js");
	breelNS.addJS("../common/js/breel/copy/XmlNodeTypes.js");
	breelNS.addJS("../common/js/breel/copy/XmlChildRetreiver.js");
	breelNS.addJS("../common/js/breel/copy/XmlCreator.js");
	breelNS.addJS("../common/js/breel/copy/XmlModifier.js");
	breelNS.addJS("../common/js/breel/copy/ExportedXmlCopyDocument.js");
	breelNS.addJS("../common/js/breel/copy/TextConverterChain.js");
	breelNS.addJS("../common/js/breel/copy/CopyManager.js");
	breelNS.addJS("../common/js/breel/loading/JsonLoader.js");
	breelNS.addJS("../common/js/breel/loading/XmlLoader.js");
	breelNS.addJS("../common/js/breel/analytics/AnalyticsManager.js");
	breelNS.addJS("../common/js/breel/analytics/AdriverTracking.js");
	breelNS.addJS("../common/js/breel/sound/SoundLogger.js");
	breelNS.addJS("../common/js/breel/music/Metronome.js");
	breelNS.addJS("../common/js/breel/music/MusicalSound.js");
	breelNS.addJS("../common/js/breel/sound/SoundObject.js");
	breelNS.addJS("../common/js/breel/sound/SoundLoader.js");
	breelNS.addJS("../common/js/breel/sound/flash/SoundPlayerFlashLink.js");
	breelNS.addJS("../common/js/breel/sound/flash/FlashSoundObject.js");
	breelNS.addJS("../common/js/breel/sound/flash/FlashSoundLoader.js");
	breelNS.addJS("../common/js/breel/sound/html5/Html5SoundObject.js");
	breelNS.addJS("../common/js/breel/sound/html5/Html5SoundLoader.js");
	breelNS.addJS("../common/js/breel/sound/webAudio/WebAudioSoundObject.js");
	breelNS.addJS("../common/js/breel/sound/webAudio/WebAudioSoundLoader.js");
	breelNS.addJS("../common/js/breel/sound/SoundLibrary.js");
	breelNS.addJS("../common/js/breel/video/VideoPlayer.js");
	breelNS.addJS("../common/js/breel/core/AssetManager.js");
	breelNS.addJS("../common/js/breel/core/HistoryStateManager.js");
	breelNS.addJS("../common/js/breel/core/GlobalStateManager.js");
	breelNS.addJS("../common/js/breel/core/StateManager.js");
	breelNS.addJS("../common/js/breel/core/StateManagerGenerator.js");
	breelNS.addJS("../common/js/breel/core/ConfigSite.js");
	breelNS.addJS("../common/js/breel/core/Core.js");
	breelNS.addJS("../common/js/breel/templates/ButtonGenerator.js");
	breelNS.addJS("../common/js/breel/templates/ButtonAttacher.js");
	breelNS.addJS("../common/js/breel/templates/BasicPage.js");
	breelNS.addJS("../common/js/breel/templates/BasicState.js");
	breelNS.addJS("../common/js/breel/templates/LoaderPage.js");
	breelNS.addJS("../common/js/breel/controllers/MouseMoveController.js");
	breelNS.addJS("../common/js/breel/sharing/SharingManager.js");
	breelNS.addJS("../common/js/breel/backend/BackendHttpRequest.js");
	breelNS.addJS("../common/js/breel/controllers/KeyboardController.js");
	breelNS.addJS("../common/js/breel/controllers/MicrophoneController.js");

	// Utils
	breelNS.addJS("../common/js/spotify/utils/genresdata/GenresData.js");

	// Model / backend manager
	breelNS.addJS("../common/js/spotify/model/data/createplaylist/CreatePlaylistSend.js");
	breelNS.addJS("../common/js/spotify/model/data/error/ResponseError.js");
	breelNS.addJS("../common/js/spotify/model/data/search/SearchSend.js");
	//	SEARCHING NEED APIS
	breelNS.addJS("../common/js/spotify/model/data/userdata/UserDataSend.js");
	breelNS.addJS("../common/js/spotify/model/data/userdata/PeopleSeachSend.js");
	breelNS.addJS("../common/js/spotify/model/data/userdata/CountrySearchSend.js");
	breelNS.addJS("../common/js/spotify/model/data/userdata/AgencySearchSend.js");
	breelNS.addJS("../common/js/spotify/model/data/userdata/CannesSearchSend.js");
	breelNS.addJS("../common/js/spotify/model/data/userdata/GetMatchSend.js");

	breelNS.addJS("../common/js/spotify/model/data/submitsong/SubmitSongSend.js");
	breelNS.addJS("../common/js/spotify/model/data/updateuser/UpdateUserSend.js");
	breelNS.addJS("../common/js/spotify/model/data/getspotifycover/GetSpotifyCoverSend.js");
	breelNS.addJS("../common/js/spotify/model/data/getagencies/GetAgenciesSend.js");
	breelNS.addJS("../common/js/spotify/model/data/statistics/StatisticsDataSend.js");

	breelNS.addJS("../common/js/spotify/model/backendmanager/ServiceID.js");
	breelNS.addJS("../common/js/spotify/model/backendmanager/ServiceData.js");
	breelNS.addJS("../common/js/spotify/model/backendmanager/BackendManager.js");


	breelNS.addJS("../common/js/spotify/pages/common/loader/LoaderAnim.js");



	breelNS.addJS("../common/js/spotify/pages/common/profileParticles/expandedProfile/ExpandedProfileStartView.js");
	breelNS.addJS("../common/js/spotify/pages/common/profileParticles/expandedProfile/ExpandedProfileBottomView.js");
	//breelNS.addJS("../common/js/spotify/pages/common/profileParticles/ExpandedProfileController.js");

	breelNS.addJS("../common/js/spotify/pages/common/profileParticles/particles/DomParticle.js");
	breelNS.addJS("../common/js/spotify/pages/common/profileParticles/particles/ColorParticle.js");
	breelNS.addJS("../common/js/spotify/pages/common/profileParticles/particles/ProfileParticle.js");
	breelNS.addJS("../common/js/spotify/pages/common/profileParticles/particles/CenterParticle.js");
	breelNS.addJS("../common/js/spotify/pages/common/profileParticles/ProfileParticleRenderer.js");
	breelNS.addJS("../common/js/spotify/pages/common/profileParticles/ProfileParticleIntroController.js");
	breelNS.addJS("../common/js/spotify/pages/common/profileParticles/ProfileParticleController.js");



	breelNS.addJS("js/cannes_during/spotify/canvas/SimpleCamera.js");
	breelNS.addJS("js/cannes_during/spotify/canvas/HoverCamera.js");
	breelNS.addJS("js/cannes_during/spotify/canvas/Particle.js");

	breelNS.addJS("js/cannes_during/spotify/canvas/particles/DomParticle.js");
	breelNS.addJS("js/cannes_during/spotify/canvas/particles/CenterParticle.js");
	breelNS.addJS("js/cannes_during/spotify/canvas/particles/ProfileParticle.js");

	breelNS.addJS("js/cannes_during/spotify/canvas/CanvasRenderer.js");
	breelNS.addJS("js/cannes_during/spotify/canvas/CenterRenderer.js");
	breelNS.addJS("js/cannes_during/spotify/canvas/Renderer2D.js");
	breelNS.addJS("js/cannes_during/spotify/canvas/Renderer3D.js");
	breelNS.addJS("js/cannes_during/spotify/canvas/3d/Shaders.js");
	breelNS.addJS("js/cannes_during/spotify/canvas/3d/ViewParticles.js");
	breelNS.addJS("js/cannes_during/spotify/canvas/3d/ViewGlobe.js");
	breelNS.addJS("js/cannes_during/spotify/canvas/3d/ViewLines.js");
	breelNS.addJS("js/cannes_during/spotify/canvas/3d/ViewGlobeLines.js");
	breelNS.addJS("js/cannes_during/spotify/canvas/3d/ViewPicking.js");
	breelNS.addJS("js/cannes_during/spotify/pages/landing/RingController.js");
	breelNS.addJS("js/cannes_during/spotify/pages/landing/ParticleController.js");
	breelNS.addJS("js/cannes_during/spotify/pages/landing/FallingImages.js");

	breelNS.addJS("js/cannes_during/spotify/pages/landing/ProfileParticleIntroController.js");
	//breelNS.addJS("js/cannes_during/spotify/pages/landing/ProfileParticleController.js");



	breelNS.addJS("js/cannes_during/spotify/pages/landing/ExpandedProfile/ExpandedProfileStartView.js");
	breelNS.addJS("js/cannes_during/spotify/pages/landing/ExpandedProfile/ExpandedProfileBottomView.js");
	//breelNS.addJS("js/cannes_during/spotify/pages/landing/ExpandedProfileController.js");



	breelNS.addJS("js/cannes_during/spotify/pages/loaders/MainLoaderPage.js");
	breelNS.addJS("js/cannes_during/spotify/pages/loaders/SmallLoaderPage.js");
	breelNS.addJS("js/cannes_during/spotify/pages/landing/GenresFilter.js");
	breelNS.addJS("js/cannes_during/spotify/pages/landing/PeopleSelect.js");
	breelNS.addJS("js/cannes_during/spotify/pages/landing/SearchPanel.js");
	


	breelNS.addJS("js/cannes_during/spotify/pages/home/HomePage.js");
	breelNS.addJS("js/cannes_during/spotify/pages/landing/LandingPage.js");
	breelNS.addJS("js/cannes_during/spotify/pages/HeaderPage.js");
	breelNS.addJS("js/cannes_during/spotify/pages/FooterPage.js");
	breelNS.addJS("js/cannes_during/spotify/pages/AboutPage.js");

	breelNS.addJS("js/cannes_during/spotify/pages/stats/StatsPage.js");
	breelNS.addJS("js/cannes_during/spotify/pages/stats/widgets/TempoStatsWidget.js");
	breelNS.addJS("js/cannes_during/spotify/pages/stats/widgets/GenresStatsWidget.js");
	breelNS.addJS("js/cannes_during/spotify/pages/stats/widgets/MoodStatsWidget.js");
	breelNS.addJS("js/cannes_during/spotify/pages/stats/widgets/MainstreamStatsWidget.js");
	breelNS.addJS("js/cannes_during/spotify/pages/stats/widgets/EnergyStatsWidget.js");
	breelNS.addJS("js/cannes_during/spotify/pages/stats/widgets/ExtendedStatsWidget.js");


	breelNS.addJS("js/cannes_during/spotify/model/UserObject.js");
	breelNS.addJS("js/cannes_during/spotify/model/Model.js");
	breelNS.addJS("js/cannes_during/spotify/model/DummyData.js");
	breelNS.addJS("js/cannes_during/spotify/model/GlobalSettings.js");

	// main starting files
	breelNS.addJS("js/cannes_during/spotify/SiteManager.js");
	breelNS.addJS("js/cannes_during/spotify/Index.js");
	 /*  DEV END */

	/* LIVE START */
	//breelNS.addJS("js/cannes_during/compiled/spotifyCompiled.js"+"?cacheBuster="+globals.cacheBuster+Math.random());
	//主要业务逻辑
	//breelNS.addJS("js/cannes_during/compiled/main.js"+"?cacheBuster="+globals.cacheBuster+Math.random());
	 /*LIVE END */
	breelNS.loadJS();

})();