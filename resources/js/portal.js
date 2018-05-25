function portal(src, width, height, HP, nrEnemies, enemy_id)
{
	this.src = src;
	this.width = width;
	this.height = height;
	this.HP = HP;
	this.nrEnemies = nrEnemies;
	this.enemy_id = enemy_id;

	this.class = "portal";
	this.htmlContainer = "div";
	this.htmlElement = "";

	if(typeof portal.id == 'undefined')
		portal.id = 1;
	else
		portal.id++;

	this.load = function()
	{
		var container = document.getElementById("container");
		var thisPortal = document.createElement(this.htmlContainer);

		container.appendChild(thisPortal);

		//thisPortal.classList.add(this.class);
		thisPortal.className = this.class;
		
		var enemyResource = GameManager.loader.getEnemyResource(this.enemy_id);
		var enemyWidth = parseInt(enemyResource['width'].substring(0, enemyResource['width'].length - 2));
		var enemyHeight = parseInt(enemyResource['height'].substring(0, enemyResource['height'].length - 2));
		var offset = enemyWidth + spaceBetween;
		var maximumWidthOffset = Math.floor(nrEnemies / 2) * offset;
		var maximumHeightOffsetDown = parseInt(this.height.substring(0, this.height.length - 2)) + enemyHeight + spacePortalDown;
		thisPortal.style.top = (Math.floor((Math.random() * (window.innerHeight - maximumHeightOffsetDown)) % (window.innerHeight - maximumHeightOffsetDown))) + "px";
		var portLeft = Math.floor((Math.random() * (window.innerWidth - maximumWidthOffset)) % (window.innerWidth - maximumWidthOffset));

		if(portLeft + maximumWidthOffset >= window.innerWidth)
			thisPortal.style.left = (portLeft - maximumWidthOffset) + "px";
		else if(portLeft - maximumWidthOffset <= 0)
			thisPortal.style.left = (portLeft + maximumWidthOffset) + "px";
		else
			thisPortal.style.left = portLeft + "px";
		
		thisPortal.style.width = "0px"; //this.width;
		thisPortal.style.height = "0px"; //this.height; //not those, because we want to increase the size for a nice animation ! :)

		thisPortal.style.backgroundImage = "url('" + this.src + "')";

		thisPortal.id = 'portal' + portal.id;

		this.htmlElement = thisPortal;

		//add the enemies
		setTimeout(function() {
			var i = 0;
			var tops = [];
			var lefts = [];

			for(var j = 0 ; j < nrEnemies ; j++)
			{
				tops[j] = (parseInt(thisPortal.style.top.substring(0, thisPortal.style.top.length - 2)) + 
						  parseInt(thisPortal.style.height.substring(0, thisPortal.style.height.length - 2)) + spaceBetween) + "px";
				lefts[j] = 0;
			}

			var portalLeft = parseInt(thisPortal.style.left.substring(0, thisPortal.style.left.length - 2));
			var firstLeft = portalLeft - Math.floor(nrEnemies / 2) * offset;

			if(nrEnemies % 2 == 0)
				firstLeft += (enemyWidth / 2);

			for(var j = 0 ; j < nrEnemies ; j++)
			{
				lefts[j] = firstLeft + "px";
				firstLeft += offset;
			}

			var addEnemiesFromPortalInterval = setInterval(function() {

				if(GameManager.paused)
					return;
				
				var enemy = new Enemy(enemyResource['src'], enemyResource['width'], enemyResource['height'], enemyResource['HP'], enemyResource['damage'], tops[i], lefts[i], 
									  thisPortal.style.top, thisPortal.style.left);
				GameManager.enemies[enemy.htmlElement.id] = enemy;

				i++;
				if(i == nrEnemies)
					clearInterval(addEnemiesFromPortalInterval);
			}, 300); //TODO : make constant
		}, 1000); //todo : make constant / derive it
	}

	this.unload = function()
	{
		this.htmlElement.parentNode.removeChild(this.htmlElement);	
	}

	this.load();
}

function test(x)
{
	this.x = x;
	alert("works");
}