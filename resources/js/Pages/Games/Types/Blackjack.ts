import { Card } from './CardComponents';
import { router, usePage } from '@inertiajs/vue3';

export class Hand{
    id: number;
    cards: Card[];
    value: number = 0;
    message: string = '';
    canSplit: boolean = false;
    active: boolean;

    constructor(id: number, active: boolean, cards?: Card[]){
        this.id = id;
        this.active = active;
        this.cards = cards || [];
    }
}

export class Game {
    deck: Card[];
    activeGame: boolean = false;
    disableButton: boolean = false;
    canSplit: boolean = false;
    playerHands: Hand[] = [];
    houseHand: Hand = new Hand(0, false);
    activeHandId: number = 0;
    nextCard: number = 0;
    splitHandCount: number = 0;
    message: string = 'Place your bet!';
    balance: number = usePage().props.auth.user.balance;
    averageWinnings: number = 0;
    bid = {
        winnings: 0,
        amount: 0,
        error: '',
    }

    constructor(deck: Card[]){
        this.deck = deck;
    }

    async start(bidAmount: number) {
        if (bidAmount < 1){
            this.bid.error = 'You can\'t bid les than 1$!'
            return;
        };
        if (bidAmount > this.balance){
            this.bid.error = 'Not enough money!'
            return;
        };
        this.bid.amount = bidAmount;
        this.bid.winnings = bidAmount;
        this.bid.error = '';
        this.message = 'Your bid: ' + this.bid.amount + '$';
        this.disableButton = true;
        this.activeGame = true;
        this.canSplit = false;
        this.deck[3].hidden = false;
        this.deck.sort(() => Math.random() - 0.5);
        this.nextCard = 0;
        this.activeHandId = 0;
        this.splitHandCount = 0; 
        this.playerHands = [];
        this.houseHand = new Hand(0, false);
        this.playerHands.push(new Hand(0, false));
        const activeHand: Hand = this.playerHands[this.activeHandId];
        await delay(100);
        this.dealCard(activeHand);
        await delay(500);
        this.dealCard(this.houseHand);
        await delay(500);
        this.dealCard(activeHand);
        this.deck[this.nextCard].hidden = true;
        await delay(500);
        this.dealCard(this.houseHand);
        this.checkIfCanSplit();
        this.disableButton = false;           
    }

    async split(hand: Hand){
        if (this.bid.amount > this.balance - this.bid.winnings){
            this.bid.error = 'Not enough money to split hand!'
            return;
        }
        this.disableButton = true;
        this.bid.winnings += this.bid.amount;
        this.bid.error = '';
        this.canSplit = false;
        this.splitHandCount++;
        this.playerHands.push(new Hand(this.splitHandCount, false, [hand.cards[0]]));
        const splitedHand: Hand = this.playerHands[this.splitHandCount];
        hand.cards.shift();
        this.setValue(hand);
        this.setValue(splitedHand);
        await delay(500);
        this.dealCard(hand);
        await delay(500);
        this.dealCard(splitedHand);
        this.checkIfCanSplit();
        this.playerHands[0].active = true;
        this.disableButton = false;
    }

    async hit(hand: Hand){
        this.disableButton = true;
        this.bid.error = '';
        this.canSplit = false;
        await delay(100);
        this.dealCard(hand);
        if (hand.value>21){
            hand.message = 'Burned';
            this.bid.winnings -= 2*this.bid.amount;
            if (hand.id < this.splitHandCount){
                hand.active = false;
                this.activeHandId ++;
                this.playerHands[this.activeHandId].active = true
            } else {
                hand.active = false;
                await this.endGame();
                this.activeGame = false;
            }
        }
        this.disableButton = false
    }

    async stay(hand: Hand){
        this.disableButton = true;
        this.bid.error = '';
        this.canSplit = false;
        if (hand.id < this.splitHandCount){
            hand.active = false;
            this.activeHandId ++;
            this.playerHands[this.activeHandId].active = true
        } else {
            hand.active = false;
            await this.endGame();
            this.activeGame = false;
        }
        this.disableButton = false
    }

    protected async endGame(){
        let lostAll = true;
        this.playerHands.forEach(hand => {
            if (hand.message == ''){
                lostAll = false;
            }
        });
        if (lostAll){
            this.message = 'You lost! ' + this.bid.winnings + '$';
            router.post('/balance/update', {
                amount: this.bid.winnings,
            });
            this.balance += this.bid.winnings;
            this.averageWinnings += this.bid.winnings;
            return;
        };
        let biggestValue = 0;
        this.playerHands.forEach(hand => {
            if (hand.value <= 21 && hand.value > biggestValue){
                biggestValue = hand.value;
            };
        });
        await delay(500);
        this.houseHand.cards[1].hidden = false;
        this.setValue(this.houseHand);
        this.playerHands.forEach(hand => {
            if (hand.message == ''){
                if (hand.value < this.houseHand.value){
                    hand.message = 'Lost';
                    this.bid.winnings -= 2 * this.bid.amount;
                };
                if (hand.value == this.houseHand.value){
                    hand.message = 'Push';
                    this.bid.winnings -= this.bid.amount;
                };
            };
        });
        while(this.houseHand.value < biggestValue){
            await delay(1000);
            this.dealCard(this.houseHand);
            if (this.houseHand.value > 21){
                this.playerHands.forEach(hand => {
                    if (hand.message == ''){
                        hand.message = 'Won'
                    }
                });
            } else {
                this.playerHands.forEach(hand => {
                    if (hand.message == ''){
                        if (hand.value < this.houseHand.value){
                            hand.message = 'Lost';
                            this.bid.winnings -= 2 * this.bid.amount;
                        };
                        if (hand.value == this.houseHand.value){
                            hand.message = 'Push';
                            this.bid.winnings -= this.bid.amount;
                        };
                    };
                });
            }
        }
        if (this.bid.winnings > 0){
            this.message = 'YOU WON! +' + this.bid.winnings + '$';
        } else if (this.bid.winnings < 0){
            this.message = 'YOU LOST! ' + this.bid.winnings + '$';
        } else {
            this.message = 'You won nothing!';
        }
        this.balance += this.bid.winnings;
        if (this.bid.winnings != 0){
            router.post('/balance/update', {
                amount: this.bid.winnings,
            })
        }
        this.averageWinnings += this.bid.winnings;
    }


    protected dealCard(hand: Hand) {
        hand.cards.push(this.deck[this.nextCard]);
        this.setValue(hand);
        this.nextCard++;
    }

    protected setValue(hand: Hand) {
        let value = 0;
        let aceCount = 0;
        hand.cards.forEach(card => {
            if (!card.hidden){
                if (card.value == 11){
                    aceCount++;
                };
                value += card.value;
            };
            });
            if (value>21){
                for (let i=0; i<aceCount; i++){
                    value -= 10;
                    if (value<=21){
                        break;
                    }
                }
            }
        hand.value = value;
    }

    protected checkIfCanSplit() {
        this.playerHands.forEach(hand => {
            if (hand.cards.length == 2 && hand.cards[0].name == hand.cards[1].name){
                this.canSplit = true;
                hand.canSplit = true;
            }else {
                hand.canSplit = false;
            }            
        });
    }
}

function delay(ms: number): Promise<void> {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}