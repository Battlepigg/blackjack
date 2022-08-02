const messages = document.querySelector('#messages')
const table = document.querySelector('.table')

const buttons = table.querySelector('#buttons')
const dealHit = buttons.querySelector('.deal-hit')
const standButton = buttons.querySelector('#stand-button')

const betInput = buttons.querySelector ('#bet')
const money = buttons.querySelector('#money')
const minBet = 20

const player = table.querySelector('#player-hand')
const dealer = table.querySelector('#dealer-hand')

const playerPoints = table.querySelector('#player-points')
const dealerPoints = table.querySelector('#dealer-points')

const imageArr = [
    'ace_of_',
    '2_of_',
    '3_of_',
    '4_of_',
    '5_of_',
    '6_of_',
    '7_of_',
    '8_of_',
    '9_of_',
    '10_of_',
    'jack_of_',
    'queen_of_',
    'king_of_',
]

class Card {
    constructor(suit, value){
        this.suit = suit
        this.value = value
        this.image = imageArr[value - 1] + suit + '.png'
        // this.ponts = this.points()
    }

    // ponts(){

    //     switch(this.value){
    //         case 1:
    //             this.ponts += 11
    //             this.points += 1
    //             break

    //         case 11:
    //         case 12:
    //         case 13:
    //             this.points += 10
    //             break

    //         default:
    //             this.points += this.value
    //             break
    //     }
    // }
}

class Deck {
    cards = []
    aces = 0
    value = 0

    count(card){

        // this.value += card.points

        switch(card.value){
            case 1:
                this.value += 11
                this.aces += 1
                break

            case 11:
            case 12:
            case 13:
                this.value += 10
                break

            default:
                this.value += card.value
                break
        }

        updatePoints()

        if (this.value === 21){
            messages.textContent = 'BlackJack!'
            player.money += (player.bet * 2)
            reset()
        }else

        if(this.value > 21){
            if(this.aces > 0){
                console.log('changing ace value');
                this.value -= 10
                this.aces -= 1
                updatePoints()
            }
            else{
                messages.textContent = 'Bust!'
                reset()
            }
        } 
    }

    fill(){
        for(let i = 1; i <= 13; i ++){
            let hearts = new Card('hearts', i)
            let spades = new Card('spades', i)
            let clubs = new Card('clubs', i)
            let diamonds = new Card('diamonds', i)
            this.cards.push(hearts, spades, clubs, diamonds)
        }
    }

    shuffle(){
        for(let i = (this.cards.length - 1); i > 0; i --){
            let num1 = Math.floor((i+1)*Math.random(i));
            let swapCard = this.cards[num1]
            this.cards[num1] = this.cards[i]
            this.cards[i] = swapCard
        }
    }

    hit(player){
        let card = table.hand.cards.shift()
        this.cards.push(card)
        this.count(card)
        displayCards(player)
    }

    split(){
        if (this.cards[0].value == this.cards[1].value){
            console.log('split');
        }
    }
}

//End of deck class

const deal = () => {
    player.bet = parseInt(betInput.value)
    messages.textContent = ''

    if(table.hand.cards.length < 10){
        newDeck()
    }

    if(player.money == 0){
        messages.textContent = "Sorry! You're out of money. There's an ATM down the block"
    }else

    if(player.bet <= player.money){
        player.money -= player.bet

        dealHit.id = 'hit-button'
        dealHit.textContent = 'Hit'

        standButton.disabled = false
        betInput.value = `Your bet is $${player.bet}`
        betInput.disabled = true

        player.innerHTML = ''
        dealer.innerHTML = ''

        player.hand = new Deck()
        dealer.hand = new Deck()

        player.hand.hit(player)
        
        player.hand.hit(player)
        dealer.hand.hit(dealer)
        player.hand.split()
    }else
    if(player.bet > player.money){
        messages.textContent = "Bet too high"
    }
    else{
        messages.textContent = "You need to place a bet to play the game!"
    }

}

const stand = () => {
    standButton.disabled = true

    while (dealer.hand.value < 17){
        dealer.hand.hit(dealer)
    }

    if(dealer.hand.value > 21 || (player.hand.value > dealer.hand.value)){
        messages.textContent = 'You win!'
        player.money += (player.bet * 2)
        reset()
    }else

    if(dealer.hand.value === player.hand.value){
        messages.textContent = "Tie, you don't lose or gain money"
        player.money += player.bet
        reset()
    }

    else{
        messages.textContent = 'You lose!'
        reset()
    }
}

const newDeck = () => {
        table.hand = new Deck()
        let deck = table.hand

        deck.fill()
        deck.shuffle()
        console.log(deck);

        messages.textContent = 'A new deck was shuffled'
}

const displayCards = (player) => {
    lastIdx = player.hand.cards.length - 1
    let cardImg = document.createElement('img')
    cardImg.src = 'images/' + player.hand.cards[lastIdx].image
    player.append(cardImg)
}

const updatePoints = () => {
    playerPoints.textContent = player.hand.value
    dealerPoints.textContent = dealer.hand.value
}

const reset = () => {
    dealHit.id = 'deal-button'
    dealHit.textContent = 'Deal'

    betInput.value = player.bet
    betInput.disabled = false
    standButton.disabled = true

    money.textContent = `You have $${player.money}`
}

//! Main Loop

const game = () => {
    newDeck()
    player.money = 500

    buttons.addEventListener('click', event => {
        switch(event.target.id){
            case 'deal-button':
                deal()
                break

            case 'hit-button':
                player.hand.hit(player)
                break

            case 'stand-button':
                stand()
                break
        }
    })

    document.addEventListener('keydown', event => {
        switch(event.key){
            case 'ArrowUp':
            case (' '):
                if(dealHit.textContent === 'Deal'){
                    deal()
                }else
                if(dealHit.textContent === 'Hit'){
                    player.hand.hit(player)
                }
                break

            case 'ArrowDown':
                if(standButton.disabled === false){
                    stand()
                }
                break

            case 'ArrowLeft':
                if(betInput.disabled === false){
                    if(betInput.value == 0){
                        betInput.value = minBet
                    }
                    else{
                        betInput.value = parseInt(betInput.value) - 10
                    }
                }
                break

            case 'ArrowRight':
                if(betInput.disabled === false){
                    if(betInput.value == 0){
                        betInput.value = minBet
                    }
                    else{
                        betInput.value = parseInt(betInput.value) + 10
                    }
                }
                break
        }
    })
}

game()