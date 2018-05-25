function Enemy(src, width, height, HP, damage, top, left, portalTop, portalLeft)
{
	this.src = src;
	this.width = width;
	this.height = height;
	this.HP = HP;
	this.damage = damage;
	this.top = top;
	this.left = left;
	this.portalTop = portalTop;
	this.portalLeft = portalLeft;

	this.topIncrement = 0;
	this.leftIncrement = 0;

	this.lastShoot = 0;

	this.class = "enemy";
	this.htmlContainer = "div";
	this.htmlElement = "";

	this.audioElement = "";

	if(typeof Enemy.id == 'undefined')
		Enemy.id = 1;
	else
	{
		console.log(portal.id);
		Enemy.id++;
	}

	this.load = function()
	{
		var container = document.getElementById("container");
		var thisEnemy = document.createElement(this.htmlContainer);

		container.appendChild(thisEnemy);

		thisEnemy.classList.add(this.class);

		thisEnemy.style.width = this.width;
		thisEnemy.style.height = this.height;

		thisEnemy.style.top = this.portalTop;
		thisEnemy.style.left = this.portalLeft;

		this.topIncrement = ( parseInt(top.substring(0, top.length - 2)) - parseInt(portalTop.substring(0, portalTop.length - 2)) ) / 10;
		this.leftIncrement = ( parseInt(left.substring(0, left.length - 2)) - parseInt(portalLeft.substring(0, portalLeft.length - 2)) ) / 10;

		thisEnemy.classList.add("spawned_Enemy");

		thisEnemy.style.backgroundImage = "url('" + this.src + "')";
		
		thisEnemy.id = 'Enemy' + Enemy.id;

		this.audioElement = GameManager.audios['shipExplode'].cloneNode();

		this.htmlElement = thisEnemy;
	}

	this.unload = function()
	{
		this.audioElement.play();
	}

	//call load function on creation
	this.load();
}