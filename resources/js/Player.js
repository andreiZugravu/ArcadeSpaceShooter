function Player(src, width, height, HP, damage, nrLives)
{
	this.src = src;
	this.width = width;
	this.height = height;
	this.HP = HP;
	this.damage = damage;

	this.nrLives = nrLives;

	this.id = "player";
	this.htmlContainer = "div";
	this.htmlElement = "";

	this.load = function()
	{
		var container = document.getElementById("container");
		var thisPlayer = document.createElement(this.htmlContainer);

		container.appendChild(thisPlayer);

		thisPlayer.style.backgroundImage = "url('" + this.src + "')";

		thisPlayer.style.width = this.width;
		thisPlayer.style.height = this.height;

		thisPlayer.setAttribute("id", "player");

		this.htmlElement = thisPlayer;
	};

	this.unload = function() //end, actually
	{

	};

	this.upgradeShip = function()
	{
		if(this.src[this.src.length - 5] < 5)
		{
			var shipResource = GameManager.loader.getPlayerResource(parseInt(this.src[this.src.length - 5]) + 1);
			this.src = shipResource['src'];
			this.width = shipResource['width'];
			this.height = shipResource['height'];
			this.HP = shipResource['HP'];
			this.damage = shipResource['damage'];

			this.htmlElement.style.backgroundImage = "url('" + this.src + "')";
			this.htmlElement.style.width = this.width;
			this.htmlElement.style.height = this.height;
		}
	};

	this.load();
}