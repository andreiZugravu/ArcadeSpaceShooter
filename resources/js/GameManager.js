function GameManager()
{
	GameManager.won = false;

	this.background = "";

	this.xmlResourcesPath = "resources/xml/resources.xml";

	var fullyLoaded = false;

	this.addLoadingScreen = function()
	{
		container = document.createElement("div");
		container.setAttribute("id", "container");

		body = document.getElementsByTagName("BODY")[0];
		body.appendChild(container);

		GameManager.loader = new Loader();
		GameManager.loader.parseResources(this.xmlResourcesPath);

		$( document ).ajaxComplete(function() { //don't forget to unbind after happening once ( in this case, this is the desired behavior )
			fullyLoaded = true;
		});

		var loadingText = document.createElement("div");
		loadingText.classList.add("loadingText");

		container.appendChild(loadingText);

		loadingText.innerHTML = "Please wait while the game is loading :)";

		loadingText.style.top = "40vh";
		loadingText.style.left = "36.5vw";

		var loadingContainer = document.createElement("div");
		loadingContainer.classList.add("loadingContainer");

		container.appendChild(loadingContainer);

		var toLoad = document.createElement("div");
		toLoad.classList.add("toLoad");

		loadingContainer.appendChild(toLoad);

		loadingContainer.style.top = "45vh";
		loadingContainer.style.left = "40vw";

		loadingScreenInterval = setInterval(function() {
			var w = toLoad.style.width;
			var i = 0;
			var res = 0;
			while(i < w.length && w[i] >= '0' && w[i] <= '9')
				res = res * 10 + (w[i++] - '0');
			
			if(res < 200)
				toLoad.style.width = res + 2 + "px";
			else
			{
				if(fullyLoaded === false)
					toLoad.style.width = "0px";
				else
				{
					clearInterval(loadingScreenInterval);

					//destroy what was used before
					toLoad.parentNode.removeChild(toLoad);
					loadingContainer.parentNode.removeChild(loadingContainer);
					loadingText.parentNode.removeChild(loadingText);
					var del_btn;
					var aut_btn;
					var new_btn;
					//add what saved game he wants to return to
					if(localStorage.getItem("lastCompletedLevelNumber_deliberately") || localStorage.getItem("lastCompletedLevelNumber_automatically"))
					{
						var saves = document.createElement("div");
						saves.innerHTML = "Do you want to continue from where you left from or start a new game?";
						saves.id = "saves";
						container.appendChild(saves);

						if(localStorage.getItem("lastCompletedLevelNumber_deliberately"))
						{
							del_btn = document.createElement("button");
							del_btn.innerHTML = "Where you chose to save. Last completed level number : " + 
												localStorage.getItem("lastCompletedLevelNumber_deliberately") + "/" + GameManager.nrLevels;
							del_btn.id = "del_btn";
							container.appendChild(del_btn);

							del_btn.onclick = function(e)
							{
								container.removeChild(del_btn);
								if(aut_btn !== undefined)
									container.removeChild(aut_btn);
								container.removeChild(new_btn);
								container.removeChild(saves);

								GameManager.nrLivesChosen = parseInt(localStorage.getItem("nrLivesChosen"));
								GameManager.username = localStorage.getItem("username");
								GameManager.displayHP = (localStorage.getItem("displayHP") === "true" ? true : false);
								GameManager.displayDamage = (localStorage.getItem("displayHP") === "true" ? true : false);
								GameManager.enemiesColor = localStorage.getItem("enemiesColor");
								GameManager.difficulty = localStorage.getItem("difficulty");
								GameManager.powerupShipUpgrade = localStorage.getItem("powerupShipUpgrade");
								GameManager.powerupBonusHP = localStorage.getItem("powerupBonusHP");
								GameManager.powerupBonusDamage = localStorage.getItem("powerupBonusDamage");
								GameManager.motto = localStorage.getItem("motto");

								GameManager.levelNumber = parseInt(localStorage.getItem("lastCompletedLevelNumber_deliberately")) + 1;
								GameManager.init();
							};
						}

						if(localStorage.getItem("lastCompletedLevelNumber_automatically"))
						{
							aut_btn = document.createElement("button");
							aut_btn.innerHTML = "Where the game automatically saved. Last completed level number : " + 
												localStorage.getItem("lastCompletedLevelNumber_automatically") + "/" + GameManager.nrLevels;
							aut_btn.id = "aut_btn";
							container.appendChild(aut_btn);

							aut_btn.onclick = function(e)
							{
								if(del_btn !== undefined)
									container.removeChild(del_btn);
								container.removeChild(aut_btn);
								container.removeChild(new_btn);
								container.removeChild(saves);
								
								GameManager.nrLivesChosen = parseInt(localStorage.getItem("nrLivesChosen"));
								GameManager.username = localStorage.getItem("username");
								GameManager.displayHP = (localStorage.getItem("displayHP") === "true" ? true : false);
								GameManager.displayDamage = (localStorage.getItem("displayHP") === "true" ? true : false);
								GameManager.enemiesColor = localStorage.getItem("enemiesColor");
								GameManager.difficulty = localStorage.getItem("difficulty");
								GameManager.powerupShipUpgrade = localStorage.getItem("powerupShipUpgrade");
								GameManager.powerupBonusHP = localStorage.getItem("powerupBonusHP");
								GameManager.powerupBonusDamage = localStorage.getItem("powerupBonusDamage");
								GameManager.motto = localStorage.getItem("motto");

								GameManager.levelNumber = parseInt(localStorage.getItem("lastCompletedLevelNumber_automatically")) + 1;
								GameManager.init();
							};
						}

						new_btn = document.createElement("button");
						new_btn.innerHTML = "clear all and start a new game?";
						new_btn.id = "new_btn";
						container.appendChild(new_btn);

						new_btn.onclick = function(e)
						{
							if(del_btn !== undefined)
								container.removeChild(del_btn);
							if(aut_btn !== undefined)
								container.removeChild(aut_btn);
							container.removeChild(new_btn);
							container.removeChild(saves);
							var aux_highscores = localStorage.getItem("highscores");
							localStorage.clear();
							localStorage.setItem("highscores", aux_highscores);
							GameManager.addSettingsScreen();
						}
					}
					else
						GameManager.addSettingsScreen();	
				}
			}

			//container.innerHTML = (res + 1) / 2 + "%";

		}, 25);
	}

	this.update = function() //updates everything
	{
		if(GameManager.paused)
			return;

		//increase portal sizes
		var portals = document.querySelectorAll(".portal");
		var incr = 5;
		for(var i = 0 ; i < portals.length ; i++)
		{
			var size = parseInt(portals[i].style.width.substring(0, portals[i].style.width.length - "px".length));
			if(size >= 100)
				continue;

			size += incr;

			portals[i].style.width = size + "px";
			portals[i].style.height = size + "px";
		}

		//shoot enemy missiles
		var ready_enemies = document.getElementsByClassName("ready_Enemy");
		for(var i = 0 ; i < ready_enemies.length ; i++)
		{
			if(ready_enemies[i] === undefined)
				continue;

			if(Date.now() - GameManager.enemies[ready_enemies[i].id].lastShoot <= 2000)
				continue;
			else
				GameManager.enemies[ready_enemies[i].id].lastShoot = Date.now();

			var readyEnemyTop = parseInt(ready_enemies[i].style.top.substring(0, ready_enemies[i].style.top.length - 2));
			var readyEnemyLeft = parseInt(ready_enemies[i].style.left.substring(0, ready_enemies[i].style.left.length - 2));
			var readyEnemyWidth = parseInt(ready_enemies[i].style.width.substring(0, ready_enemies[i].style.width.length - 2));
			var readyEnemyHeight = parseInt(ready_enemies[i].style.height.substring(0, ready_enemies[i].style.height.length - 2));

			var missileResource = GameManager.loader.getMissileResource(1);

			var missileLeft = new missile(missileResource['src'], missileResource['width'], missileResource['height'], missileResource['damage'], 'enemy');
			var missileRight = new missile(missileResource['src'], missileResource['width'], missileResource['height'], missileResource['damage'], 'enemy');

			GameManager.missiles[missileLeft.htmlElement.id] = missileLeft;
			GameManager.missiles[missileRight.htmlElement.id] = missileRight;

			missileLeft.htmlElement.style.top = readyEnemyTop + readyEnemyHeight;
			missileLeft.htmlElement.style.left = readyEnemyLeft + 20;

			missileRight.htmlElement.style.top = readyEnemyTop + readyEnemyHeight;
			missileRight.htmlElement.style.left = readyEnemyLeft + readyEnemyWidth - 20;
		}

		//move missiles
		var missiles = document.getElementsByClassName("missile");
		for(var i = 0 ; i < missiles.length ; i++)
		{
			var value = parseInt(missiles[i].style.top.substring(0, missiles[i].style.top.length - 2));
			var prag;
			var increment;

			if(GameManager.missiles[missiles[i].id].origin == "player")
			{
				prag = 0;
				increment = -50;
			}
			else
			{
				prag = 1000;
				increment = 50;
			}

			if((prag == 0 && value <= prag) || (prag == 1000 && value >= prag))
			{
				missiles[i].parentNode.removeChild(missiles[i]);
			}
			else
			{
				missiles[i].style.top = parseInt(missiles[i].style.top) + increment;
			}
		}

		//check collisions
		//between enemies and player missiles
		var enemies = document.getElementsByClassName("enemy"); //get all enemies
		var missiles_player = document.getElementsByClassName("missile_player"); //get all missiles
		for(var i = 0 ; i < enemies.length ; i++) //for each enemy
		{
			if(enemies[i] === undefined)
				continue;

			var enemy_box = enemies[i].getBoundingClientRect();
			for(var j = 0 ; j < missiles_player.length ; j++) //and for each missile
			{
				if(missiles_player[j] === undefined)
					continue;

				var missile_box = missiles_player[j].getBoundingClientRect();
				if(test_coliziune(window.scrollY + enemy_box.top, window.scrollX + enemy_box.left, enemy_box.height, enemy_box.width, //check if they collide
						  window.scrollY + missile_box.top,  window.scrollX + missile_box.left,   missile_box.height,  missile_box.width))
				{
					if(enemies[i] === undefined || missiles[j] === undefined)
						continue;

					missiles_player[j].parentNode.removeChild(missiles_player[j]);

					GameManager.enemies[enemies[i].id].HP -= GameManager.player.damage;

					var enemy_hit_audio = GameManager.audios['shipHit'].cloneNode();
					if(GameManager.audiosReady == GameManager.audios.length)
						enemy_hit_audio.play();

					if(GameManager.enemies[enemies[i].id].HP <= 0)
					{
						GameManager.score += 10;
						GameManager.enemies[enemies[i].id].unload();
						enemies[i].parentNode.removeChild(enemies[i]);
						var expl = document.createElement("div");
						expl.classList.add("explosion");
						
						expl.style.top = window.scrollY + enemy_box.top;
						expl.style.left = window.scrollX + enemy_box.left;
						container.appendChild(expl);

						var explTimeout = setTimeout(function() {
							expl.parentNode.removeChild(expl);
						}, 300);

						if(expl === undefined)
							clearTimeout(explTimeout);
					}
				}
			}
		}

		//between portals and player missiles
		for(var i = 0 ; i < portals.length ; i++) //for each portal
		{
			if(portals[i] === undefined)
				continue;

			var size = parseInt(portals[i].style.width.substring(0, portals[i].style.width.length - "px".length));
			if(size < 100)
				continue;

			var portal_box = portals[i].getBoundingClientRect();
			for(var j = 0 ; j < missiles_player.length ; j++) //and for each missile
			{
				if(missiles_player[j] === undefined)
					continue;

				var missile_box = missiles_player[j].getBoundingClientRect();
				if(test_coliziune(window.scrollY + portal_box.top, window.scrollX + portal_box.left, portal_box.height, portal_box.width, //check if they collide
						  window.scrollY + missile_box.top,  window.scrollX + missile_box.left,   missile_box.height,  missile_box.width))
				{
					if(portals[i] === undefined || missiles_player[j] === undefined)
						continue;

					missiles_player[j].parentNode.removeChild(missiles_player[j]);
					GameManager.portals[portals[i].id].HP -= GameManager.player.damage;

					if(GameManager.portals[portals[i].id].HP <= 0)
					{
						GameManager.score += 50;
						portals[i].parentNode.removeChild(portals[i]);
					}
				}
			}
		}

		//between player and enemy missiles
		var missiles_enemy = document.getElementsByClassName("missile_enemy");
		var player_box = GameManager.player.htmlElement.getBoundingClientRect();
		for(var j = 0 ; j < missiles_enemy.length ; j++)
		{
			if(missiles_enemy[j] === undefined)
				continue;

			var missile_box = missiles_enemy[j].getBoundingClientRect();
			if(test_coliziune(window.scrollY + player_box.top, window.scrollX + player_box.left, player_box.height, player_box.width, //check if they collide
					  window.scrollY + missile_box.top,  window.scrollX + missile_box.left,   missile_box.height,  missile_box.width))
			{
				if(missiles_enemy[j] === undefined)
					continue;

				missiles_enemy[j].parentNode.removeChild(missiles_enemy[j]);
				GameManager.player.HP -= GameManager.missiles[missiles_enemy[j].id].damage;

				if(GameManager.player.HP <= 0)
				{
					if(GameManager.player.nrLives == 1)
					{
						GameManager.endGame();
						return;
					}
					else
					{
						GameManager.player.nrLives--;
						var playerResource = GameManager.loader.getPlayerResource(GameManager.player.src[GameManager.player.src.length - 5]);
						GameManager.player.HP = playerResource['HP'];
						if(GameManager.displayHP == true)
						{
							var hpText = document.getElementById("hpText");
							hpText.innerHTML = GameManager.player.HP;
						}
					}
				}
			}
		}

		//between player and enemies
		for(var i = 0 ; i < enemies.length ; i++)
		{
			if(enemies[i] === undefined)
				continue;

			var enemy_box = enemies[i].getBoundingClientRect();
			if(test_coliziune(window.scrollY + player_box.top, window.scrollX + player_box.left, player_box.height, player_box.width, //check if they collide
					window.scrollY + enemy_box.top,  window.scrollX + enemy_box.left,   enemy_box.height,  enemy_box.width))
			{
				if(enemies[i] === undefined)
					continue;

				enemies[i].parentNode.removeChild(enemies[i]);
				if(GameManager.player.nrLives == 1)
				{
					GameManager.endGame();
					return;
				}
				else
				{
					GameManager.player.nrLives--;
					var playerResource = GameManager.loader.getPlayerResource(GameManager.player.src[GameManager.player.src.length - 5]);
					GameManager.player.HP = playerResource['HP'];
					if(GameManager.displayHP == true)
					{
						var hpText = document.getElementById("hpText");
						hpText.innerHTML = GameManager.player.HP;
					}
				}
			}
		}

		//between player and portals
		for(var i = 0 ; i < portals.length ; i++)
		{
			if(portals[i] === undefined)
				continue;

			var portal_box = portals[i].getBoundingClientRect();
			if(test_coliziune(window.scrollY + player_box.top, window.scrollX + player_box.left, player_box.height, player_box.width, //check if they collide
					window.scrollY + portal_box.top,  window.scrollX + portal_box.left,   portal_box.height,  portal_box.width))
			{
				if(portals[i] === undefined)
					continue;

				portals[i].parentNode.removeChild(portals[i]);
				if(GameManager.player.nrLives == 1)
				{
					GameManager.endGame();
					return;
				}
				else
				{
					GameManager.player.nrLives--;
					var playerResource = GameManager.loader.getPlayerResource(GameManager.player.src[GameManager.player.src.length - 5]);
					GameManager.player.HP = playerResource['HP'];
					if(GameManager.displayHP == true)
					{
						var hpText = document.getElementById("hpText");
						hpText.innerHTML = GameManager.player.HP;
					}
				}
			}
		}

		//between player and powerups
		var powerups = document.querySelectorAll(".powerup");
		for(var i = 0 ; i < powerups.length ; i++)
		{
			if(powerups[i] === undefined)
				continue;

			var powerup_box = powerups[i].getBoundingClientRect();
			if(test_coliziune(window.scrollY + player_box.top, window.scrollX + player_box.left, player_box.height, player_box.width, //check if they collide
					window.scrollY + powerup_box.top,  window.scrollX + powerup_box.left,   powerup_box.height,  powerup_box.width))
			{
				if(powerups[i] === undefined)
					continue;

				GameManager.powerups[powerups[i].id].act();
				powerups[i].parentNode.removeChild(powerups[i]);
			}
		}

		//move recently spawned enemies
		var spawned_Enemies = document.querySelectorAll(".spawned_Enemy");
		for(var i = 0 ; i < spawned_Enemies.length ; i++)
		{
			if(spawned_Enemies[i] === undefined)
				continue;

			var spawnedEnemyTop = parseInt(spawned_Enemies[i].style.top.substring(0, spawned_Enemies[i].style.top.length - 2));
			var spawnedEnemyLeft = parseInt(spawned_Enemies[i].style.left.substring(0, spawned_Enemies[i].style.left.length - 2));

			spawnedEnemyTop += GameManager.enemies[spawned_Enemies[i].id].topIncrement;
			spawnedEnemyLeft += GameManager.enemies[spawned_Enemies[i].id].leftIncrement;

			spawned_Enemies[i].style.top = spawnedEnemyTop + "px";
			spawned_Enemies[i].style.left = spawnedEnemyLeft + "px";

			var pragTop = parseInt(GameManager.enemies[spawned_Enemies[i].id].top.substring(0, GameManager.enemies[spawned_Enemies[i].id].top.length - 2));
			if(spawnedEnemyTop >= pragTop)
			{
				spawned_Enemies[i].classList.remove("spawned_Enemy");
				spawned_Enemies[i].classList.add("ready_Enemy");
			}
		}

		//move powerups
		powerups = document.querySelectorAll(".powerup");
		for(var i = 0 ; i < powerups.length ; i++)
		{
			var powerupTop = parseInt(powerups[i].style.top.substring(0, powerups[i].style.top.length - 2));
			var powerupLeft = parseInt(powerups[i].style.left.substring(0, powerups[i].style.left.length - 2));

			if(GameManager.powerups[powerups[i].id].orientationTop == 1)
			{
				powerupTop -= POWERUP_MOVE_TOP;
				if(powerupTop <= 0)
					GameManager.powerups[powerups[i].id].orientationTop = -1;
			}
			else
			{
				powerupTop += POWERUP_MOVE_TOP;
				if(powerupTop >= window.innerHeight)
					GameManager.powerups[powerups[i].id].orientationTop = 1;
			}

			if(GameManager.powerups[powerups[i].id].orientationLeft== 1)
			{
				powerupLeft += POWERUP_MOVE_LEFT;
				if(powerupLeft >= window.innerWidth)
					GameManager.powerups[powerups[i].id].orientationLeft = -1;
			}
			else
			{
				powerupLeft -= POWERUP_MOVE_LEFT;
				if(powerupLeft <= 0)
					GameManager.powerups[powerups[i].id].orientationLeft = 1;
			}

			powerups[i].style.top = powerupTop + "px";
			powerups[i].style.left = powerupLeft + "px";
		}

		//update HP, damage and nrLives text
		if(GameManager.displayHP == true)
		{
			var hpText = document.getElementById("hpText");
			if(hpText)
				hpText.innerHTML = GameManager.player.HP;
		}

		if(GameManager.displayDamage == true)
		{
			var damageText = document.getElementById("damageText");
			if(damageText)
				damageText.innerHTML = GameManager.player.damage;
		}

		var nrLivesText = document.getElementById("nrLivesText");
		if(nrLivesText)
			nrLivesText.innerHTML = GameManager.player.nrLives;
	};

	this.end = function() //ends the game
	{

	};
}

GameManager.missiles = {};
GameManager.portals = {};
GameManager.enemies = {};
GameManager.powerups = {};

GameManager.audios = {};
GameManager.videos = {};

GameManager.audiosReady = 0;

GameManager.prototype.loader = "";
GameManager.prototype.player = "";

GameManager.pauseScreen = "";

GameManager.init = function() //displays the form. starts the loader. starts the game
{
	//add the player
	document.getElementsByTagName("HTML")[0].style.cursor = "none";
	var playerResource = GameManager.loader.getPlayerResource(1);
	GameManager.player = new Player(playerResource['src'], playerResource['width'], playerResource['height'], 
		playerResource['HP'], playerResource['damage'], GameManager.nrLivesChosen);

	//add text, if requested for
	if(GameManager.displayHP == true)
	{
		var hpText = document.createElement("div");
		hpText.id = "hpText";
		hpText.innerHTML = playerResource['HP'];
		container.appendChild(hpText);
	}

	if(GameManager.displayDamage == true)
	{
		var damageText = document.createElement("div");
		damageText.id = "damageText";
		damageText.innerHTML = playerResource['damage'];
		container.appendChild(damageText);
	}

	//add nrLives text
	var nrLivesText = document.createElement("div");
	nrLivesText.id = "nrLivesText";
	nrLivesText.innerHTML = GameManager.nrLivesChosen;
	container.appendChild(nrLivesText);

	//add the instructions
	var instructions = document.createElement("div");
	instructions.id = "instructions";
	instructions.innerHTML = "To fire : press 'a' <br/> Move with your mouse <br/> Don't collide with enemies, you'll lose one life. <br/> Down are displayed number of lives, hp and damage. <br/> Press 'space' to pause.";
	container.appendChild(instructions);

	//create the pause screen, but don't add it, just hold it
	var _pauseScreen = document.createElement("div");
	_pauseScreen.id = "pauseScreen";
	_pauseScreen.innerHTML = "Game paused. Press space again to unpause";
	GameManager.pauseScreen = _pauseScreen;

	//add save button
	var saveButton = document.createElement("button");
	saveButton.id = "saveButton";
	saveButton.innerHTML = "save progress";
	container.appendChild(saveButton);

	saveButton.onclick = function()
	{
		localStorage.setItem("lastCompletedLevelNumber_deliberately", GameManager.levelNumber - 1);
		if(!localStorage.getItem("highscores"))
		{
			localStorage.setItem("highscores", GameManager.username + "," + GameManager.score + ";");
		}
		else
		{
			localStorage.setItem("highscores", localStorage.getItem("highscores") + GameManager.username + "," + GameManager.score + ";");
		}

		localStorage.setItem("nrLivesChosen", GameManager.nrLivesChosen);
		localStorage.setItem("username", GameManager.username);
		localStorage.setItem("displayHP", GameManager.displayHP);
		localStorage.setItem("displayDamage", GameManager.displayDamage);
		localStorage.setItem("enemiesColor", GameManager.enemiesColor);
		localStorage.setItem("difficulty", GameManager.difficulty);
		localStorage.setItem("powerupShipUpgrade", GameManager.powerupShipUpgrade);
		localStorage.setItem("powerupBonusHP", GameManager.powerupBonusHP);
		localStorage.setItem("powerupBonusDamage", GameManager.powerupBonusDamage);
		localStorage.setItem("motto", GameManager.motto);
	};

	//start the level
	GameManager.startLevel(GameManager.levelNumber);
};

GameManager.nrLivesChosen = "";
GameManager.username = "";
GameManager.displayHP = "";
GameManager.displayDamage = "";
GameManager.enemiesColor = "";
GameManager.difficulty = "";
GameManager.powerupShipUpgrade = "";
GameManager.powerupBonusHP = "";
GameManager.powerupBonusDamage = "";
GameManager.motto = "";

GameManager.addSettingsScreen = function() //sets up the settings screen
{
	//prepare
	var textSpan = document.createElement("span");
	textSpan.innerHTML = "Complete this form and proceed to the game!";
	textSpan.style.position = "relative";
	textSpan.style.left = "40vw";
	textSpan.style.fontSize = "20px";
	container.appendChild(textSpan);

	var br1 = document.createElement("br");
	container.appendChild(br1);

	//input range
	//select nr lives
	var rangeLabel = document.createElement("label");
	rangeLabel.innerHTML = "Choose number of lives";
	rangeLabel.for = "nrLivesInput";
	container.appendChild(rangeLabel);

	var brLabelRange = document.createElement("br");
	container.appendChild(brLabelRange);

	var spanRangeMin = document.createElement("span");
	var spanRangeMax = document.createElement("span");

	container.appendChild(spanRangeMin);
	spanRangeMin.innerHTML = 3;

	var rangeInput = document.createElement("input");
	rangeInput.id = "nrLivesInput";
	rangeInput.type = "range";
	rangeInput.min = 3;
	rangeInput.max = 5;
	rangeInput.value = 3;
	rangeInput.step = 1;
	rangeInput.onchange = actualize;
	container.appendChild(rangeInput);

	container.appendChild(spanRangeMax);
	spanRangeMax.innerHTML = 5;

	var brRangeInput = document.createElement("br");
	container.appendChild(brRangeInput);

	var rangeInputTextValue = document.createElement("span");
	rangeInputTextValue.id = "rangeInputTextValue";
	rangeInputTextValue.innerHTML = "Current : 3";
	container.appendChild(rangeInputTextValue);

	var delimAfterRange1 = document.createElement("br");
	container.appendChild(delimAfterRange1);
	var delimAfterRange2 = document.createElement("br");
	container.appendChild(delimAfterRange2);

	//input text
	var textLabel = document.createElement("label");
	textLabel.innerHTML = "Enter a username";
	textLabel.for = "usernameInput";
	container.appendChild(textLabel);

	var brLabelText = document.createElement("br");
	container.appendChild(brLabelText);

	var textInput = document.createElement("input");
	textInput.id = "usernameInput";
	textInput.type = "text";
	textInput.value = "";
	container.appendChild(textInput);

	var delimAfterLabelText1 = document.createElement("br");
	container.appendChild(delimAfterLabelText1);
	var delimAfterLabelText2 = document.createElement("br");
	container.appendChild(delimAfterLabelText2);

	//input checkbox
	var checkboxLabel = document.createElement("label");
	checkboxLabel.innerHTML = "Which of the following do you want to be displayed during play time?";
	checkboxLabel.for = "whatToDisplayInput";
	container.appendChild(checkboxLabel);

	var brLabeLCheckbox = document.createElement("br");
	container.appendChild(brLabeLCheckbox);

	var checkboxInputHP = document.createElement("input");
	var checkboxInputDamage = document.createElement("input");

	checkboxInputHP.type = "checkbox";
	checkboxInputHP.id = "whatToDisplayHP";

	checkboxInputDamage.type = "checkbox";
	checkboxInputDamage.id = "whatToDisplayDamage";

	var spanHP = document.createElement("span");
	spanHP.innerHTML = "HP";

	var spanDamage = document.createElement("span");
	spanDamage.innerHTML = "Damage";

	container.appendChild(spanHP);
	container.appendChild(checkboxInputHP);
	container.appendChild(spanDamage);
	container.appendChild(checkboxInputDamage);

	var delimAfterCheckbox1 = document.createElement("br");
	container.appendChild(delimAfterCheckbox1);
	var delimAfterCheckbox2 = document.createElement("br");
	container.appendChild(delimAfterCheckbox2);

	//input radio
	var radioLabel = document.createElement("label");
	radioLabel.innerHTML = "Pick color of your enemies";
	radioLabel.for = "enemiesColorInput";
	container.appendChild(radioLabel);

	var brLabelRadio = document.createElement("br");
	container.appendChild(brLabelRadio);
	var possibleEnemiesColors = [ "black", "blue", "green", "orange" ];	
	for(var i = 0 ; i < 4 ; i++)
	{
		var span = document.createElement("span");
		span.innerHTML = possibleEnemiesColors[i];
		container.appendChild(span);

		var radioInput = document.createElement("input");
		radioInput.classList.add("enemiesColorInput");
		radioInput.type = "radio";
		radioInput.name = "enemiesColorInput";
		radioInput.value = possibleEnemiesColors[i];
		container.appendChild(radioInput);

		span.style.color = possibleEnemiesColors[i];
	}

	var delimAfterRadio1 = document.createElement("br");
	container.appendChild(delimAfterRadio1);
	var delimAfterRadio2 = document.createElement("br");
	container.appendChild(delimAfterRadio2);

	//input select simple
	var labelSelectSimple = document.createElement("label");
	labelSelectSimple.innerHTML = "Pick a difficulty";
	labelSelectSimple.for = "difficultyInput";
	container.appendChild(labelSelectSimple);

	var brLabeLSelectSimple = document.createElement("br");
	container.appendChild(brLabeLSelectSimple);

	var selectSimple = document.createElement("select");
	selectSimple.id = "selectSimple";
	container.appendChild(selectSimple);
	var difficulties = [ "easy", "normal", "hard" ];
	for(var i = 0 ; i < 3 ; i++)
	{
		var selectSimpleOption = document.createElement("option");
		selectSimpleOption.innerHTML = difficulties[i];
		selectSimpleOption.value = difficulties[i];
		selectSimple.appendChild(selectSimpleOption);
	}

	var delimAfterSelectSimple1 = document.createElement("br");
	container.appendChild(delimAfterSelectSimple1);
	var delimAfterSelectSimple2 = document.createElement("br");
	//container.appendChild(delimAfterSelectSimple2);

	//input select multiple
	var labelSelectMultiple = document.createElement("label");
	labelSelectMultiple.innerHTML = "Pick possible powerups";
	labelSelectMultiple.for = "powerupsInput";
	container.appendChild(labelSelectMultiple);
	container.insertBefore(delimAfterSelectSimple2, labelSelectMultiple);

	var brLabelSelectMultiple = document.createElement("br");
	container.appendChild(brLabelSelectMultiple);

	var selectMultiple = document.createElement("select");
	selectMultiple.multiple = "true";
	selectMultiple.id = "selectMultiple";
	container.appendChild(selectMultiple);
	var possiblePowerups = [ "ship upgrade", "bonus HP", "bonus damage" ];
	for(var i = 0 ; i < 3 ; i++)
	{
		var selectMultipleOption = document.createElement("option");
		selectMultipleOption.innerHTML = possiblePowerups[i];
		selectMultipleOption.value = possiblePowerups[i];
		selectMultiple.appendChild(selectMultipleOption);
	}

	var delimAfterSelectMultiple1 = document.createElement("br");
	container.appendChild(delimAfterSelectMultiple1);
	var delimAfterSelectMultiple2 = document.createElement("br");
	container.appendChild(delimAfterSelectMultiple2);

	//input textarea
	var labelTextarea = document.createElement("label");
	labelTextarea.innerHTML = "Finally, pick a motto";
	labelTextarea.for = "motto";
	container.appendChild(labelTextarea);

	var brLabelTextarea = document.createElement("br");
	container.appendChild(brLabelTextarea);

	var textarea = document.createElement("textarea");
	container.appendChild(textarea);

	var delimAfterTextarea1 = document.createElement("br");
	container.appendChild(delimAfterTextarea1);
	var delimAfterTextarea2 = document.createElement("br");
	container.appendChild(delimAfterTextarea2);

	//add the button, finally
	var submitButton = document.createElement("button");
	submitButton.onclick = verify;
	submitButton.innerHTML = "Submit";
	submitButton.style.width = "70px";
	submitButton.style.height = "50px";
	submitButton.style.fontSize = "16px";
	container.appendChild(submitButton);

	var delimAfterSubmitButton = document.createElement("br");
	container.appendChild(delimAfterSubmitButton);

	var textNode = document.createTextNode("(don't worry - you'll have the chance to change these later)");
	container.appendChild(textNode);

	//add highscores
	var highscores = document.createElement("div");
	highscores.id = "highscores";
	container.appendChild(highscores);
	var val;
	var res = "Highscores<br/>";
	if((val = localStorage.getItem("highscores")) !== null)
	{
		var entities = val.split(";");
		var scores = [];
		for(var i = 1 ; i <= entities.length - 1 ; i++)
		{
			var value = entities[i - 1].split(",");
			var usr = value[0];
			var scor = value[1];
			scores[i - 1] = { 
				username : usr,
				score : scor
			};
		}
		scores.sort(function(a, b) { //ordonam descrescator dupa scor
			return -(a.score - b.score);
		});

		for(var i = 0 ; i < scores.length && i < 10 ; i++)
		{
			var usr = scores[i].username;
			var scor = scores[i].score;
			res += ((i + 1) + ". " + scor + " (" + usr + ")<br/>");
		}

		var i = scores.length;
		while(i < 10)
		{
			res += ((i + 1) + ".<br/>");
			i++;
		}
	}
	else
	{
		for(var i = 1 ; i <= 10 ; i++)
			res += (i + ".<br/>");
	}
	highscores.innerHTML = res;
};

GameManager.levelsPath = "resources/xml/levels";
GameManager.levelNumber = 1;
GameManager.gameStart = false;
GameManager.score = 0;

GameManager.startLevel = function(levelNumber)
{
	GameManager.gameStart = true;
	if(levelNumber > GameManager.nrLevels)
	{
		GameManager.checkForLevelComplete();
		return;
	}
	
	var xml_path = GameManager.levelsPath + "/" + GameManager.difficulty + "/" + "level" + levelNumber + "_" + GameManager.difficulty + ".xml";
	GameManager.loader.parseLevelResources(xml_path);
	$( document ).ajaxComplete(function() {
		//load independent portals
		var independentPortalsResource = GameManager.loader.getIndependentPortalsResource();
		var independentPortalDetails = GameManager.loader.getPortalResource(independentPortalsResource['portalId']);
		
		var independentPortalsInterval = setInterval(function() {

			if(GameManager.paused)
				return;

			var independentPortal = new portal(independentPortalDetails['src'], independentPortalDetails['width'], independentPortalDetails['height'], 
				independentPortalDetails['HP'], independentPortalsResource['nrEnemies'], 'enemy_' + GameManager.enemiesColor + '_' + independentPortalsResource['enemyIdNumber']);
			GameManager.portals[independentPortal.htmlElement.id] = independentPortal;

		}, independentPortalsResource['interval'] * 1000); //transform to seconds

		//load scheduled portals
		//and powerups
		var timeBetweenPortalsGroup = GameManager.loader.getTimeBetweenPortalsGroup();
		var nrPortals = GameManager.loader.getNrPortals();
		var nrPortalsGroups = GameManager.loader.getNrPortalsGroups();
		var portalsGroupResource;
		var portalGroupIndex = -1;
		var scheduledPortalsInterval = setInterval(function() { //careful about the possibility of nrPortalsGroups being 0...should never be though ! makes no sense

			if(GameManager.paused)
				return;

			if(GameManager.gameEnded == true)
			{
				clearInterval(scheduledPortalsInterval);
				clearInterval(independentPortalsInterval);
				return;
			}

			portalGroupIndex++;
			if(portalGroupIndex == nrPortalsGroups)
			{
				clearInterval(scheduledPortalsInterval);
				clearInterval(independentPortalsInterval);
				GameManager.checkForLevelComplete();
				return;
			}

			portalsGroupResource = GameManager.loader.getPortalsGroupResource(portalGroupIndex);
			var scheduledPowerupResource = GameManager.loader.getScheduledPowerupResource(portalGroupIndex + 1);

			for(var i = 0 ; i < portalsGroupResource['nrPortalsInGroup'] ; i++)
			{
				var portalResource = GameManager.loader.getPortalResource(portalsGroupResource['portal' + i]['portalId']);
				var scheduledPortal = new portal(portalResource['src'], portalResource['width'], portalResource['height'], portalResource['HP'],
					portalsGroupResource['portal' + i]['nrEnemies'], 'enemy_' + GameManager.enemiesColor + '_' + portalsGroupResource['portal' + i]['enemyIdNumber']);
				GameManager.portals[scheduledPortal.htmlElement.id] = scheduledPortal;
			}

			if(scheduledPowerupResource !== undefined)
			{
				if((scheduledPowerupResource['type'] === 'shipUpgrade' && GameManager.powerupShipUpgrade === true) ||
				   (scheduledPowerupResource['type'] === 'bonusHP' && GameManager.powerupBonusHP === true) ||
				   (scheduledPowerupResource['type'] === 'bonusDamage' && GameManager.powerupBonusDamage === true) && powerupTypes.indexOf(scheduledPowerupResource['type']))
				{
					var powerupResource = GameManager.loader.getPowerupResource(scheduledPowerupResource['type']);
					var _powerupTop = Math.floor(Math.random() * window.innerHeight) % window.innerHeight;
					var _powerupLeft = Math.ceil(Math.random() * window.innerWidth) % window.innerWidth;
					var _powerup = new powerup(powerupResource['src'], powerupResource['width'], powerupResource['height'], scheduledPowerupResource['type'], _powerupTop, _powerupLeft);
					GameManager.powerups[_powerup.htmlElement.id] = _powerup;
				}
			}
		}, timeBetweenPortalsGroup * 1000);
	});
}

GameManager.nrLevels = 1;
GameManager.gameEnded = false;

GameManager.checkForLevelComplete = function(level_number)
{
	var checkForLevelCompleteInterval = setInterval(function() {

		if(GameManager.gameEnded === true)
		{
			clearInterval(checkForLevelCompleteInterval);
			return;
		}

		var portals = document.querySelectorAll(".portal");
		var enemies = document.querySelectorAll(".enemy");

		if(portals.length == 0 && enemies.length == 0)
		{
			clearInterval(checkForLevelCompleteInterval);
			alert("Level completed!");
			if(GameManager.nrLevels <= GameManager.levelNumber)
			{
				GameManager.won = true;
				alert("You win!");
				var answer = window.prompt("Are you ready for a 'congratulations' video?");
				if(answer)
					answer = answer.toLowerCase();
				confirmText = "";
				if(answer == "no" || answer == "nop" || answer == "nope" || answer == "neah")
					confirmText = "I DONT'T CARE! I WILL ASK AGAIN!!";
				else if(answer == "yes" || answer == "yea" || answer == "yeah" || answer == "yee" || answer == "y" || answer == "ye" || answer == "yep")
					confirmText = "AWESOME! BUT ... ARE YOU SURE??";
				else
					confirmText = "I DIDN'T GET YOU, BUT I DON'T CARE!";

				window.confirm(confirmText + " (it does not matter what you answer XD)");

				//remove texts
				if(GameManager.displayHP)
				{
					var hpText = document.getElementById("hpText");
					if(hpText !== null)
						hpText.parentNode.removeChild(hpText);
				}

				if(GameManager.displayDamage)
				{
					var damageText = document.getElementById("damageText");
					if(damageText !== null)
						damageText.parentNode.removeChild(damageText);
				}

				var nrLivesText = document.getElementById("nrLivesText");
				if(nrLivesText !== null)
					nrLivesText.parentNode.removeChild(nrLivesText);

				// var saveButton = document.getElementById("saveButton");
				// if(saveButton !== null)
				// 	saveButton.parentNode.removeChild(saveButton);

				var instructions = document.getElementById("instructions");
				if(instructions !== null)
					instructions.parentNode.removeChild(instructions);

				//add the video
				container.appendChild(GameManager.videos['gameVideo']);
				GameManager.videos['gameVideo'].play();
				return;
			}
			GameManager.levelNumber++;
			GameManager.startLevel(GameManager.levelNumber);
			return;
		}
	}, 1000); //checks every 1 second
}

window.onbeforeunload = function(e) {
	if(GameManager.gameStart == true)
	{
		localStorage.setItem("lastCompletedLevelNumber_automatically", (GameManager.levelNumber == (GameManager.nrLevels + 1) ? GameManager.levelNumber - 1 : (GameManager.won ? GameManager.levelNumber : GameManager.levelNumber - 1)));

		if(!localStorage.getItem("highscores"))
		{
			localStorage.setItem("highscores", GameManager.username + "," + GameManager.score + ";");
		}
		else
		{
			localStorage.setItem("highscores", localStorage.getItem("highscores") + GameManager.username + "," + GameManager.score + ";");
		}

		localStorage.setItem("nrLivesChosen", GameManager.nrLivesChosen);
		localStorage.setItem("username", GameManager.username);
		localStorage.setItem("displayHP", GameManager.displayHP);
		localStorage.setItem("displayDamage", GameManager.displayDamage);
		localStorage.setItem("enemiesColor", GameManager.enemiesColor);
		localStorage.setItem("difficulty", GameManager.difficulty);
		localStorage.setItem("powerupShipUpgrade", GameManager.powerupShipUpgrade);
		localStorage.setItem("powerupBonusHP", GameManager.powerupBonusHP);
		localStorage.setItem("powerupBonusDamage", GameManager.powerupBonusDamage);
		localStorage.setItem("motto", GameManager.motto);
	}

  	var dialogText = 'Dialog text here';
  	e.returnValue = dialogText;
  	return dialogText;
};

GameManager.endGame = function()
{
	GameManager.gameEnded = true;
	while(container.children.length > 0)
	{
		container.removeChild(container.firstChild);
	}
	setTimeout(function(){
		while(container.children.length > 0)
	{
		container.removeChild(container.firstChild);
	}
}, 2000);
	alert("You lost! :(");
};

window.onresize = function()
{
	alert("This game is meant to play on full screen. I suggest not playing it otherwise");
};

GameManager.paused = false;

GameManager.pauseOrResume = function()
{
	if(GameManager.paused)
	{
		GameManager.paused = false;
		document.body.style.webkitAnimationPlayState = 'running';
		document.body.removeChild(GameManager.pauseScreen);
	}
	else
	{
		GameManager.paused = true;
		document.body.style.webkitAnimationPlayState = 'paused';
		document.body.appendChild(GameManager.pauseScreen);
	}
};

window.onmousemove = function(e)
{
	if(GameManager.paused)
		return;

	if(GameManager.player === undefined) //rezolvam cu ajax complete
		return;

	//preiau coordonatele mouse-ului
	e = e || window.event;

	var pageX = e.pageX;
	var pageY = e.pageY;

	// IE 8
	if (pageX === undefined) {
		pageX = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
		  pageY = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
	}

	//updatez nava
	GameManager.player.htmlElement.style.top = pageY - 25;
	GameManager.player.htmlElement.style.left = pageX - 17.5;
}

window.onkeydown = function(e)
{
	if(GameManager.gameStart == false)
		return;

	var cod_tasta = e.charCode ? e.charCode : e.keyCode;

	if(cod_tasta != FIRE_KEY)
	{
		if(cod_tasta == PAUSE_KEY)
		{
			GameManager.pauseOrResume();
			return;
		}

		if(e.altKey && e.ctrlKey && e.shiftKey)
		{
			alert("You found a cheat! Bonus damage for you!");
			GameManager.player.damage = 99999;
		}

		return;
	}

	if(GameManager.paused)
		return;

	var initialPositionX = window.getComputedStyle(player, null).left;
	var initialPositionY = window.getComputedStyle(player, null).top;

	var missileResource = GameManager.loader.getMissileResource(1);

	var missileLeft = new missile(missileResource['src'], missileResource['width'], missileResource['height'], missileResource['damage'], 'player');
	var missileRight = new missile(missileResource['src'], missileResource['width'], missileResource['height'], missileResource['damage'], 'player');

	GameManager.missiles[missileLeft.htmlElement.id] = missileLeft;
	GameManager.missiles[missileRight.htmlElement.id] = missileRight;

	missileLeft.htmlElement.style.top = parseInt(initialPositionY) - 40;
	missileLeft.htmlElement.style.left = parseInt(initialPositionX) + 15;

	missileRight.htmlElement.style.top = parseInt(initialPositionY) - 40;
	missileRight.htmlElement.style.left = parseInt(initialPositionX) + 40;
}