$(document).ready(function(){
	// wait for the dom js
	// blackjack deal function
	// create dek function
	// shuffle deck function
	// Add card[0] and card[2] to player hand, 1 and 3 to dealer
	// place card function
	// push card onto player's array



	// global variables:

	var playersHand = [];      
	var dealersHand = [];
	var numPlayers = 2;

	const freshDeck	= createDeck();
 
	//stateFlag: 0 is no game underway, 1 = hit button, 2 = stand button
	var stateFlag = 0;
	// whoWon: 0 = no one yet 1 = player wins, 2 = dealer wins 3 = tie
	var whoWon = 0;  
	// pTotal is player's Total. dTotal is dealer's total
	var pTotal = 0;
	var dTotal = 0;
	//console.log(freshDeck);

	var theDeck = freshDeck.slice();

	//*******************************************************************    


	$('.deal-button').click(()=>{                    // begin deal button handler

		resetHands();
		console.log("playersHand", playersHand);
		console.log("dealersHand", dealersHand);
		console.log("whoWon", whoWon);

		// theDeck = freshDeck.slice();
		// theDeck = shuffleDeck(theDeck);

		//console.log(theDeck);
		//console.log(theDeck[0]);
		// console.log(theDeck.length);
		var firstCard = theDeck.shift();		// 
		// console.log(theDeck.length);
		// console.log(firstCard);

		for (let i = 0; i < numPlayers; i++){
			dealCard(firstCard, playersHand);
			placeCard('player',i + 1,playersHand[i]);
			firstCard = theDeck.shift();
			dealCard(firstCard, dealersHand);
			placeCard('dealer',i + 1,dealersHand[i]);
			firstCard = theDeck.shift();
		}


		// playersHand.push(firstCard);	// give player 1 card

		// firstCard = theDeck.shift();
		// dealersHand.push(firstCard);	// give dealer 1 card

		// firstCard = theDeck.shift();		// 
		// playersHand.push(firstCard);	// give player 2nd card

		// firstCard = theDeck.shift();
		// dealersHand.push(firstCard);	// give dealer 2nd card

		//console.log(playersHand);
	//	console.log(dealersHand);

		// placeCard('player',1,playersHand[0]);
		// placeCard('dealer',1,dealersHand[0]);
		// placeCard('player',2,playersHand[1]);
		// placeCard('dealer',2,dealersHand[1]);
		pTotal = calculateTotal(playersHand, 'player');
		console.log("calculated player total", pTotal)

		printScore('player', pTotal);

		dTotal = calculateTotal(dealersHand, 'dealer');
		console.log("calculated dealer total", dTotal)

		printScore('dealer', dTotal);
		
		whoWon = checkWin(stateFlag);

	});                                                 // end of deal button handler

	//*******************************************************************    


	$('.hit-button').click(()=>{                       // begin hit button handler
		// get top card
		// push it onto the player's hand
		// put the card in the dom
		// calculate the new total
		if ((whoWon == 0) && (pTotal < 21)){
			var topCard = theDeck.shift();
			console.log(topCard);
			playersHand.push(topCard);
			placeCard('player',playersHand.length, topCard);
			pTotal = calculateTotal(playersHand,'player');
			console.log("calculated total", pTotal)
			printScore('player', pTotal);
			stateFlag = 1;
			whoWon = checkWin(stateFlag);
			}
	});                                                 // end of hit button handler

	//****************************************************************

	$('.stand-button').click(()=>{                     // begin stand button handler
		// player does nothing
		// control passes to dealer
		// dealer's rules:
		// if I have < 17, dealer must hit
		// if i have 17 or more, i can't hit.
		if (whoWon == 0){

			// call calculateTotal() for dealer
			dTotal = calculateTotal(dealersHand, 'dealer');
			while(dTotal < 17){		// will not run if < 17, will keep running until
				var topCard = theDeck.shift();
				dealersHand.push(topCard);
				placeCard('dealer',dealersHand.length, topCard);
				// call calculateTotal() for dealer
				dTotal = calculateTotal(dealersHand, 'dealer');
			}

			console.log("calculated total", dTotal)
			printScore('dealer', dTotal);
			stateFlag = 2;
			whoWon = checkWin(stateFlag);
	} 
		
	});                                                 // end of stand button handler  

	//*******************************************************************    

	function dealCard(whichCard, whichHand){            // begin function dealCard()
		whichHand.push(whichCard);
		return whichHand;
	}                                                   // end function dealCard()

	//*******************************************************************    


	function checkWin(whatPointInGame){                               // begin function checkWin()

		// call calculateTotal() for player
		pTotal = calculateTotal(playersHand, 'player');
		console.log("checkwin ptotal", pTotal)
		// call calculateTotal() for dealer
		dTotal = calculateTotal(dealersHand, 'dealer');
		console.log("checkwin dtotal", dTotal)
		var winner = 0;

		if ((whatPointInGame == 0) || (whatPointInGame == 1)){
			if((playersHand.length == 2) && (pTotal == 21)){
				console.log("player blackjack");
				winner = 1;
			}else if((playersHand.length == 2) && (dTotal == 21)){
				console.log("dealer blackjack");
				winner = 2;
			}else if (pTotal > 21){
				console.log("dealer wins");
				winner = 2;
			}
		}else if(whatPointInGame == 2){
			if (pTotal > 21){
				console.log("dealer wins");
				winner = 2;
			}else if(dTotal > 21){
				console.log("player wins");
				winner = 1;
			}else if((pTotal == 21) && (dTotal != 21)){
				console.log("player wins")
				winner = 1;
			}else if((dTotal == 21) && (pTotal != 21)){
				console.log("dealer wins")
				winner = 2;
			}else if(pTotal > dTotal){
				console.log("player wins");
				winner = 1;
			}else if(dTotal > pTotal){
				console.log("dealer wins")
				winner = 2;
			}else{
				console.log("tie");
				winner = 3;
			}
		}

		return winner;

		// rules to win:
		// if player has > 21, player loses
		// if dealer has > 21, dealer loses
		// if playersHand.length == 2 AND playerTotal == 21 ... BLACKJACK
		// if dealersHand.length == 2 AND playerTotal == 21 ... BLACKJACK
		// if player > dealer, player wins
		// if dealer > player, dealer wins
		// else push - (tie)

	}                                                  // end of function checkWin()

	//*******************************************************************    


	function calculateTotal(hand, who){               // begin function calculateTotal()
		// purpose:
		// 1. find out the number and return it
		// 2. update the dom with the right number for the right player
		var handTotal = 0;
		var ace = false;
		// as we loop thru the hand we need a var for each card's value
		var thisCardsValue = 0;
		for (let i = 0; i < hand.length; i++){
			thisCardsValue = Number(hand[i].slice(0,-1));
			// console.log("thiscardsvalue",thisCardsValue);
			if (thisCardsValue > 10){
				thisCardsValue = 10;
			}else if(thisCardsValue == 1){
				ace = true;
			}

			// console.log("handTotal", handTotal, "thisCardsValue", thisCardsValue)
			handTotal += thisCardsValue;
			// console.log(handTotal, "handTotal")
			

		}
		if((ace) && (handTotal < 21) && ((handTotal + 10) < 22)){
				handTotal += 10;
		}
				// ask if the player would like to use 1 or 11 for the ace.&&&&&&&&&&&&&&&&&&&&&&&&&&
		// printScore(who,handTotal)

		// new on 10/9/17`
		var classSelector = `.${who}-total`;
		$(classSelector).html(handTotal);

		//console.log(handTotal);
		return handTotal;
	}                                                  // end of function calculateTotal()

	//*******************************************************************    


	function printScore(whoseScore, thisHandTotal){        // begin function printScore()
		var capWho = `${whoseScore}`;
		capWho = titleCase(capWho);
		console.log(capWho);
		var playerWithTotal = `${capWho} Total: ${thisHandTotal}`
		var classSelector = `.${whoseScore}-total`;
		$(classSelector).html(playerWithTotal);
	}                                                       // end of function printScore()

	//*******************************************************************    


	function titleCase(string) {                            // begin function titleCase()
		return string.charAt(0).toUpperCase() + string.slice(1);
	}                                                            // end of function titleCase()

	//*******************************************************************    



	function placeCard(who, whereToPutCard, whichCardToPlace){
		var classSelector = `.${who}-cards .card-${whereToPutCard}`;
		// dealer-cards .card-1 example
		// set the HTML of the div with .who-cards .card-where with the image
		$(classSelector).html('<img src="images/cards/'+whichCardToPlace+'.png" />')

	}                                                       // end of function placeCard()

	//*******************************************************************    



	function createDeck(){
		// local var per js scope, local
		var newDeck = [];

		// card is suit + value
		// suits is a constant.
		const suits = ['h', 's', 'd', 'c'];

		// outer loop for suite
		// inner loop for number

		// suits.map((s)=>{

		// })
		for (let s = 0; s < suits.length; s++){
			for (let c = 1; c <= 13; c++){
			newDeck.push(c + suits[s]);
			}
		}

		//console.log(newDeck);
		return newDeck;

	}                                                       // end of function createDeck()

	//*******************************************************************    


	function shuffleDeck(aDeckToBeShuffled){
		// loop alot. 
		// each time thru the loop we'll switch two indices. (cards). when the loop is done, the array (deck) will be shuffled. 
		let card1ToSwap;
		for (let i = 0; i < 50000; i++){
			var rand1 = Math.floor(Math.random() * aDeckToBeShuffled.length);
			var rand2 = Math.floor(Math.random() * aDeckToBeShuffled.length);
			// switch aDeckToBeShuffled[rand1] with aDeckToBeShuffled[rand2]
			card1ToSwap = aDeckToBeShuffled[rand1];
			aDeckToBeShuffled[rand1] = aDeckToBeShuffled[rand2];
			aDeckToBeShuffled[rand2] = card1ToSwap;
		}
		return aDeckToBeShuffled;
	}					                                   //	end of function shuffleDeck()

	//*******************************************************************    



	function resetHands(){
		pTotal = 0;
		dTotal = 0;
		whoWon = 0;
		stateFlag = 0;
		playersHand = [];
		dealersHand = [];
		printScore('player', 0);
		printScore('dealer', 0);
		theDeck = freshDeck.slice();
		theDeck = shuffleDeck(theDeck);
		console.log("playershand", playersHand);
		console.log("dealersHand", dealersHand);
		var classSelector = `.player-cards .card-1`;
		for (let i = 1; i < 7; i++){
		classSelector = `.player-cards .card-${i}`;
		$(classSelector).html('-')
		classSelector = `.dealer-cards .card-${i}`;
		$(classSelector).html('-')
		}
		return theDeck;

	}                                                      // end of function resetHands()

});





