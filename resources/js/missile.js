function missile(src, width, height, damage, origin)
{
	this.src = src;
	this.width = width;
	this.height = height;
	this.damage = damage;

	this.origin = origin; //who fired the bullet

	this.class = "missile";
	this.htmlContainer = "div";
	this.htmlElement = "";

	this.audioElement = "";

	if(typeof missile.id == 'undefined')
		missile.id = 1;
	else
		missile.id++;

	this.load = function()
	{
		var container = document.getElementById("container");
		var thisMissile = document.createElement(this.htmlContainer);

		container.appendChild(thisMissile);

		thisMissile.classList.add(this.class);
		thisMissile.classList.add(this.class + '_' + this.origin);

		thisMissile.style.width = this.width;
		thisMissile.style.height = this.height;

		thisMissile.style.backgroundImage = "url('" + this.src + "')";

		thisMissile.id = this.class + missile.id;

		this.audioElement = GameManager.audios['missileShoot'].cloneNode();
		if(missile.id % 2 == 1)
			this.audioElement.play();

		this.htmlElement = thisMissile;
	}

	this.unload = function()
	{
		this.htmlElement.parentNode.removeChild(this.htmlElement);
	}

	//call load function on creation
	this.load();
}