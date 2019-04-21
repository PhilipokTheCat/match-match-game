class Game{
	constructor(){
		this.timeNode = document.getElementById('time');
		this.time = 0;
		this.timer = undefined;
		this.gameField = document.getElementById('gameField');
        this.profileInputs = document.querySelectorAll('.main-content__input');
		this.descriptionField = document.getElementById('descriptionField');
		this.isRunning = false;
		this.cardbackSrc = "./images/card-skirts/card-skirt-1.png";
		this.cardsCount = 0;
		this.difficulty = [5, 2];
		this.cardChecklist = [];
		this.cardValues = [
		"./images/cards/card-1.jpg",
		"./images/cards/card-2.jpg",
		"./images/cards/card-3.jpg",
		"./images/cards/card-4.jpg",
		"./images/cards/card-5.jpg",
		"./images/cards/card-6.jpg",
		"./images/cards/card-7.jpg",
		"./images/cards/card-8.jpg",
		"./images/cards/card-9.jpg",
		"./images/cards/card-10.jpg",
		"./images/cards/card-11.jpg",
		"./images/cards/card-12.jpg",
		"./images/cards/card-13.jpg"];
		this.cardbacksNode = document.getElementById('cardbacks');
		this.cardbacksNode.onclick = function(event){
			let target = event.target.parentNode;
			if (target.tagName !== 'BUTTON') return;
			let cardbacksList = [];
			for(let i=1; i<4; i++) cardbacksList.push(this.cardbacksNode.children[i]);
			for(let i=0; i<3; i++){
				if (cardbacksList[i] === target){
					if (!cardbacksList[i].classList.contains('clicked')) {
						cardbacksList[i].classList.add('clicked');
						this.cardbackSrc = cardbacksList[i].lastElementChild.src;
					}
				}
				else cardbacksList[i].classList.remove('clicked');
			}
		}.bind(this);
		this.difficultyNode = document.getElementById('difficulty');
		this.difficultyNode.onclick = function(event){
			let target = event.target;
			if (target.tagName !== 'BUTTON') return;
			let difficultyList = [];
			for(let i=1; i<4; i++) difficultyList.push(this.difficultyNode.children[i]);
			for(let i=0; i<3; i++){
				if (difficultyList[i] === target){
					if (!difficultyList[i].classList.contains('clicked')) {
						difficultyList[i].classList.add('clicked');
						this.difficulty = difficultyList[i].innerHTML.split(' x ');
					}
				}
				else difficultyList[i].classList.remove('clicked');
			}
		}.bind(this);
	}

	static createRandomCardlist(count, cardValues){
		let resultList = [];
		let tempList = [];
		let tempIndex, generatedValue;
		for (let i=0; i<count/2; i++) {
			tempIndex = parseInt(Math.random() * count);
			while (true){
				if (resultList[tempIndex] === undefined) {
					generatedValue = parseInt(Math.random() * cardValues.length);
					resultList[tempIndex] = generatedValue;
					tempList.push(generatedValue);
					break;
				}
				else tempIndex === count ? tempIndex = 0 : tempIndex++;
			};
		};
		for (let i=0; i<count/2; i++){
			tempIndex = parseInt(Math.random() * count);
			while (true){
				if (resultList[tempIndex] === undefined) {
					resultList[tempIndex] = tempList[i];
					break;
				}
				else tempIndex === count-1 ? tempIndex = 0 : tempIndex++;
			};
		};
		return resultList;
	}

	static validateEmail(email){
		let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  		return re.test(email);
	}

	static applyProfile(inputs){
		if ((inputs[0].value.length === 0) && (inputs[1].value.length === 0) && (!Game.validateEmail(inputs[2].value))) {
            alert('Data in profile fields is invalid!');
            return false;
		}
		let profile = [];
		for (let i of inputs) profile.push(i.value);
		window.localStorage.setItem('profile', [profile[0], profile[1], profile[2]]);
		return true;
	}

	start(){
        if (!Game.applyProfile(this.profileInputs, this.profile)) return false;
		this.cardsCount = this.difficulty[0] * this.difficulty[1];
		while (this.gameField.firstChild) {
    		this.gameField.removeChild(this.gameField.firstChild);
		}
		this.cardChecklist = [];
		let difficultyMode = this.cardsCount === 10 ? 'easy' : this.cardsCount === 18 ? 'medium' : 'hard';
		let currentCardlist = Game.createRandomCardlist(this.cardsCount, this.cardValues);
		this.gameField.insertAdjacentHTML('afterbegin', currentCardlist.reduce((sum, elem, i)=>{
			let cardHtml = `<div class="container ${difficultyMode}">\n<div class="card">\n<div class="front">\n<img src="${this.cardbackSrc}" class="img">\n
			</div>\n<div class="back">\n<img src="${this.cardValues[elem]}" class="img">\n</div>\n</div>\n</div>\n`
			return sum + cardHtml}, ''));
		this.isRunning = true;
		this.time = 0;
		this.gameField.onclick = function(event){
			if (!this.isRunning) return;
			let target = event.target.parentNode.parentNode;
			if (target.classList.contains('flipped') || !target.classList.contains('card')) return;
			target.classList.add('flipped');
			this.cardChecklist.push(target);
			Game.check.call(this);
		}.bind(this);
		clearInterval(this.timer);
		this.timeNode.innerHTML = 0;
		this.timer = setInterval(function(){this.time += 1; this.timeNode.innerHTML = this.time;}.bind(this), 1000);
	}

	static check(){
		if (this.cardChecklist.length < 2) return;
		if (this.cardChecklist[0].lastElementChild.lastElementChild.src === this.cardChecklist[1].lastElementChild.lastElementChild.src){
			this.cardsCount -= 2;
			let backflipCardFirst = this.cardChecklist[0];
			let backflipCardSecond = this.cardChecklist[1];
			setTimeout(function(firstCard, secondCard){
				firstCard.lastElementChild.classList.add('hidden');
				secondCard.lastElementChild.classList.add('hidden');
			}.bind(this, backflipCardFirst, backflipCardSecond), 900)
			this.cardChecklist.length = 0;
			if (this.cardsCount === 0) setTimeout(Game.end.bind(this), 1000);
		}
		else {
			let backflipCardFirst = this.cardChecklist[0];
			let backflipCardSecond = this.cardChecklist[1];
			this.cardChecklist.length = 0;
			setTimeout(function(){
				backflipCardFirst.classList.remove('flipped');
				backflipCardSecond.classList.remove('flipped');
		}.bind(this), 1000);
		}	
	}

	static end(){
		clearInterval(this.timer);
		this.isRunning = false;
		let difficulty = this.difficulty.reduce((acc, el) => acc * el, 1);
		difficulty = difficulty === 10 ? 'topEasy' : difficulty === 18 ? 'topMedium' : 'topHard';
		let topList = window.localStorage.getItem(difficulty) === null ? [] : JSON.parse(window.localStorage.getItem(difficulty));
		let profile = window.localStorage.getItem('profile').split(',');
		let isProfileFound = false;
		profile.push(this.time);
		if (topList.length === 0) {topList.push(profile); isProfileFound = true}
		else for (let i of topList){
			if ((i[0] === profile[0]) && (i[1] === profile[1]) && (i[2] === profile[2]))
				if (i[3] > profile[3]) {i[3] = profile[3]; isProfileFound = true; break}
				else {isProfileFound = true; break;}
		}
		if (!isProfileFound) topList.push(profile);
		topList.sort((a, b) => a[3] - b[3]);
		window.localStorage.setItem(difficulty, JSON.stringify(topList));
		let result = 'You win, ' + profile[0] + ' ' + profile[1] + ' ' + profile[2] + '!\nElapsed time: ';
		result += this.time + '\n ___________________________\nTop 10 in ';
		result += difficulty === 'topEasy' ? 'Easy' : difficulty === 'topMedium' ? 'Medium' : 'Hard';
		result += ' mode:\n';
		for (let i = 0; i < 10; i++) {
			if (topList[i] === undefined) {result += (i+1) + ' - Empty\n'; continue;};
			result += (i+1) + ' - ' + topList[i][3] + ' sec. - ' + topList[i][0] + ' ' + topList[i][1] + ' ' + topList[i][2] + '\n';
		};
		alert(result);
	}
}



const game = new Game();

document.getElementById('start').onclick = game.start.bind(game);
