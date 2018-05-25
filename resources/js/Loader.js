function Loader()
{
	/* static resources. these resources will never change throughout the game */
	var backgrounds = [];
	var enemies = [];
	var missiles = [];
	var portals = [];
	var powerups = [];
	var ships = [];
	var audios = [];
	var videos = [];

	/* dynamic resources. these resources will change from one level to another. they are used for levels configuration */
	var independentPortals = []; //will have properties : interval, nrEnemies, portalId, enemyId
	var timeBetweenPortalsGroup;
	var nrPortals;
	var nrPortalsGroups;
	var portalsGroups = [];
	var scheduledPowerups = [];

	this.parseResources = function(xml)
	{
		$( document ).ready(function() {

			$.ajax({
				url: xml,
				type: "GET",
				dataType: "xml",
				success: function(xml)
				{
					//get xml content
					$xml = $(xml);

					//get backgrounds
					$backgrounds = $xml.find("background");
					$backgrounds.each(function(i) {
						backgrounds[$(this).attr("id")] = {
							'src' : $(this).contents().get(0).nodeValue.trim(),
							'width' : $(this).attr("width"),
							'height' : $(this).attr("height"),
						};
					}); //end of $backgrounds.each

					//get enemies
					$enemies = $xml.find("enemy");
					$enemies.each(function(i) {
						enemies[$(this).attr("id")] = {
							'src' : $(this).contents().get(0).nodeValue.trim(),
							'width' : $(this).attr("width"),
							'height' : $(this).attr("height"),
							'HP' : $(this).attr("HP"),
							'damage' : $(this).attr("damage")
						};
					}); //end of $enemies.each

					//get missiles
					$missiles = $xml.find("missile");
					$missiles.each(function(i) {
						missiles[$(this).attr("id")] = {
							'src' : $(this).contents().get(0).nodeValue.trim(),
							'width' : $(this).attr('width'),
							'height' : $(this).attr('height'),
							'damage' : $(this).attr("damage")
						};
					}); //end of $missiles.each

					//get portals
					$portals = $xml.find("portal");
					$portals.each(function(i) {
						portals[$(this).attr("id")] = {
							'src' : $(this).contents().get(0).nodeValue.trim(),
							'width' : $(this).attr('width'),
							'height' : $(this).attr('height'),
							'HP' : $(this).attr("HP"),
							'nrEnemies' : $(this).attr("nrEnemies")
						};
					}); //end of $portals.each

					//get powerups
					$powerups = $xml.find("powerup");
					$powerups.each(function(i) {
						powerups[$(this).attr("id")] = {
							'src' : $(this).contents().get(0).nodeValue.trim(),
							'width' : $(this).attr('width'),
							'height' : $(this).attr('height')
						};
					}); //end of $powerups.each

					//get ships
					$ships = $xml.find("ship");
					$ships.each(function(i) {
						ships[$(this).attr("id")] = {
							'src' : $(this).contents().get(0).nodeValue.trim(), // TRIM !!!!!!! (remove spaces from left and right) cause nodeValue returns those as well
							'width' : $(this).attr('width'),
							'height' : $(this).attr('height'),
							'HP' : parseInt($(this).attr("HP")),
							'damage' : parseInt($(this).attr("damage"))
						};
					}); //end of $ships.each

					//get audios
					$audios = $xml.find("audio");
					$audios.each(function(i) {
						audios[i] = {
							'src' : $(this).contents().get(0).nodeValue.trim()
						};
						var id = $(this).attr("id");
						GameManager.audios[id] = document.createElement("audio");
						GameManager.audios[id].setAttribute("src", audios[i]['src']);
						GameManager.audios[id].addEventListener("loadeddata",function(){ GameManager.audiosReady++; }); //ar trebui sa crestem ceva, vedem
					}); //end of $audios.each

					//get videos
					$videos = $xml.find("video");
					$videos.each(function(i) {
						videos[i] = {
							'src' : $(this).contents().get(0).nodeValue.trimLeft().trimRight()
						};
						var id = $(this).attr("id");
						GameManager.videos[id] = document.createElement("video");
						GameManager.videos[id].src = videos[i]['src'];
						GameManager.videos[id].autoPlay = true;
						GameManager.videos[id].loop = true;
						GameManager.videos[id].classList.add("gameVideo");
					});
				}, //end of success
				error: function(err)
				{
					alert("Error : " + err);
				} //end of error
			});
		}); //end of document . ready
	};

	this.parseLevelResources = function(xml)
	{
		$( document ).ready(function() {

			$.ajax({
				url: xml,
				type: "GET",
				dataType: "xml",
				success: function(xml)
				{
					//get xml content
					$xml = $(xml);
					
					//get independent portals configurations
					$independentPortals = $xml.find("independentPortals");
					independentPortals = {
						'interval' : parseInt($independentPortals.find("interval").text().trim()),
						'nrEnemies' : parseInt($independentPortals.find("nrEnemies").text().trim()),
						'portalId' : $independentPortals.find("portalId").text().trim(),
						'enemyIdNumber' : $independentPortals.find("enemyIdNumber").text().trim()
					};

					//get scheduled portals configurations
					$scheduledPortals = $xml.find("scheduledPortals");

					timeBetweenPortalsGroup = parseInt($scheduledPortals.find("timeBetweenPortalsGroup").text().trim());
					nrPortals = parseInt($scheduledPortals.find("nrPortals").text().trim());
					nrPortalsGroups = parseInt($scheduledPortals.find("nrPortalsGroups").text().trim());

					$portalsGroups = $scheduledPortals.find("portalsGroup");
					$portalsGroups.each(function(i) {
						portalsGroups[i] = {
						 'nrPortalsInGroup' : parseInt($(this).find("nrPortalsInGroup").text().trim())
						};
						$portals = $(this).find("portal");
						$portals.each(function(j) {
							portalsGroups[i]['portal' + j] = {
								'nrEnemies' : parseInt($(this).find("nrEnemies").text().trim()),
								'portalId' : $(this).find("portalId").text().trim(),
								'enemyIdNumber' : $(this).find("enemyIdNumber").text().trim()
							};
						}); //end of $portals.each
					}); //end of $portalsGroups.each

					$scheduledPowerups = $xml.find("powerup");
					$nr = [];
					$max = 0;
					$scheduledPowerups.each(function(i) {
						scheduledPowerups[parseInt($(this).find('correspondingPortalsGroupNumber').text().trim())] = {
							'type' : $(this).find('type').text().trim()
						};
					}); //end of $scheduledPowerups.each
				}, //end of success
				error: function(err)
				{
					alert("Error : " + err);
				} //end of error
			});
		}); //end of document . ready
	}

	this.getPlayerResource = function(ship_number)
	{
		return ships["ship_" + ship_number];
	};

	this.getMissileResource = function(missile_number)
	{
		return missiles["missile_laser_blue_" + missile_number];
	};

	this.getEnemyResource = function(enemy_id)
	{
		return enemies[enemy_id];
	};

	this.getPortalResource = function(portal_id)
	{
		return portals[portal_id];
	};

	this.getIndependentPortalsResource = function()
	{
		return independentPortals;
	};

	this.getTimeBetweenPortalsGroup = function()
	{
		return timeBetweenPortalsGroup;
	};

	this.getNrPortals = function()
	{
		return nrPortals;
	};

	this.getNrPortalsGroups = function()
	{
		return nrPortalsGroups;
	};

	this.getPortalsGroupResource = function(portals_group_number)
	{
		return portalsGroups[portals_group_number];
	};

	this.getPowerupResource = function(powerup_id)
	{
		return powerups[powerup_id];
	};

	this.getScheduledPowerupResource = function(powerup_number)
	{
		return scheduledPowerups[powerup_number];
	};

	this.getAudiosResources = function()
	{
		return audios;
	};
}
