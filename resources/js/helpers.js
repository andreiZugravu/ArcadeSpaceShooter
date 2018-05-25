function test_coliziune(top1,left1,h1,w1,top2,left2,h2,w2) {
	if(left1 < left2 + w2 &&
		left1 + w1 > left2 &&
		top1 < top2 + h2 &&
		top1 + h1 > top2)
	{
		return true;
	}	
}

function actualize()
{
	var rangeInput = document.getElementById("nrLivesInput");

	var rangeInputTextValue = document.getElementById("rangeInputTextValue");
	rangeInputTextValue.innerHTML = "Current : " + rangeInput.value;
}

function verify()
{
	var allOk = true;

	//verify nrLives
	var nrLivesRegExp = new RegExp("^[0-9]+$");
	GameManager.nrLivesChosen = parseInt(document.getElementById("nrLivesInput").value);
	if(nrLivesRegExp.test(document.getElementById("nrLivesInput").value) == false)
		allOk = false;

	//verify username
	var usernameRegExp = new RegExp("^[a-zA-Z]+$");
	GameManager.username = document.getElementById("usernameInput").value;
	if(usernameRegExp.test(document.getElementById("usernameInput").value) == false)
		allOk = false;

	//verify what he wants to be displayed
	GameManager.displayHP = document.getElementById("whatToDisplayHP").checked;
	GameManager.displayDamage = document.getElementById("whatToDisplayDamage").checked;

	//verify the color of the enemies
	var radios = document.getElementsByClassName("enemiesColorInput");
	var atLeastOne = false;
	for(var i = 0 ; i < radios.length ; i++)
	{
		if(radios[i].checked === true)
		{
			GameManager.enemiesColor = radios[i].value;
			atLeastOne = true;
			break;
		}
	}

	if(atLeastOne == false)
		allOk = false;

	//verify the difficulty
	var selectSimple = document.getElementById("selectSimple");
	var options = selectSimple.options;
	for(var i = 0 ; i < options.length ; i++)
	{
		if(options[i].selected)
		{
			GameManager.difficulty = options[i].value;
			break;
		}
	}

	//verify the powerups
	var selectMultiple = document.getElementById("selectMultiple");
	var options = selectMultiple.options;
	GameManager.powerupShipUpgrade = options[0].selected;
	GameManager.powerupBonusHP = options[1].selected;
	GameManager.powerupBonusDamage = options[2].selected;

	//verify the motto
	var mottoRegExp = new RegExp("^[ a-zA-Z0-9.!?]+$");
	GameManager.motto = document.getElementsByTagName("TEXTAREA")[0].value;
	if(mottoRegExp.test(document.getElementsByTagName("TEXTAREA")[0].value) == false)
		allOk = false;

	//update the textNode
	for(var i = 0 ; i < container.childNodes.length ; i++)
	{
		if(container.childNodes[i].nodeType === 3 && container.childNodes[i].tagName === undefined)
		{
			container.childNodes[i].textContent = "you can try again";
		}
	}

	//remove everything if it's all ok
	if(allOk == true)
	{
		while(container.firstChild != undefined)
		{
			container.removeChild(container.firstChild);
		}

		//can start playing the game! :)
		GameManager.init();
	}
	else
	{
		alert("Some fields are not completed correctly. Correct them and submit again.");
	}
}

function adauga_eveniment(elem, numeEveniment, fct) {
	//ideea cu prefixe e preluata de la https://www.sitepoint.com/css3-animation-javascript-event-handlers/
	var prefixe=["","moz","MS","o","webkit"];
	/*
	o - pt opera
	MS - pt IE
	moz - pt mozilla firefox
	webkit - pt Chrome/Safari
	*/
	for (var i=0;i<prefixe.length;i++)
		elem.addEventListener(prefixe[i]+numeEveniment,fct,false);
}