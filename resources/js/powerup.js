function powerup(src, width, height, type, top, left)
{
	this.src = src;
	this.width = width;
	this.height = height;
	this.type = type;
	this.top = top;
	this.left = left;

	this.orientationTop = ((Math.floor(Math.random() * 2) % 2) == 1 ? 1 : -1);
	this.orientationLeft = ((Math.floor(Math.random() * 2) % 2) == 1 ? 1 : -1);

	this.class = "powerup";
	this.htmlContainer = "div";
	this.htmlElement = "";

	this.audioElement = "";

	if(typeof powerup.id == 'undefined')
		powerup.id = 1;
	else
		powerup.id++;

	this.load = function()
	{
		var container = document.getElementById("container");
		var thisPowerup = document.createElement(this.htmlContainer);

		container.appendChild(thisPowerup);

		thisPowerup.classList.add(this.class);

		thisPowerup.style.width = this.width;
		thisPowerup.style.height = this.height;

		thisPowerup.style.top = this.top;
		thisPowerup.style.left = this.left;

		thisPowerup.style.backgroundImage = "url('" + this.src + "')";
		
		thisPowerup.id = 'powerup' + powerup.id;

		this.audioElement = GameManager.audios['powerupPickup'].cloneNode();

		this.htmlElement = thisPowerup;
	};

	this.unload = function()
	{

	};

	this.act = function()
	{
		this.audioElement.play();
		switch(this.type)
		{
			case 'shipUpgrade' :
				GameManager.player.upgradeShip();
				break;

			case 'bonusHP' :
				GameManager.player.HP += 100;
				break;

			case 'bonusDamage' :
				GameManager.player.damage += 10;
				break;

			default :
				alert("Error occured : Unknown type of powerup");
				break;
		}
	};

	this.load();
}