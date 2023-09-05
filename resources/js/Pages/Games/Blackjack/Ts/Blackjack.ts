import { Card } from '@/Pages/Games/Types/CardComponents';
import { router, usePage } from '@inertiajs/vue3';
import { delay } from '@/Pages/Games/Types/Delay';

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

class Bid{
    winnings: number;
    amount: number;
    handsBids: number[] = [];
    insurance = {
        value: 0,
        mesaage: '',
    };
    error: string = '';
    
    constructor(bidAmount: number){
        this.amount = bidAmount;
        this.winnings = bidAmount;
    }
}

export class Game {
    deck: Card[];
    activeGame: boolean = false;
    disableButton: boolean = false;
    insuranceForm: boolean = false;
    doubleButton: boolean = false;
    doubleHandsId: number[] = [];
    playerHands: Hand[] = [];
    dealerHand: Hand = new Hand(0, false);
    activeHandId: number = 0;
    nextCard: number = 0;
    splitHandCount: number = 0;
    message: string = 'Place your bet!';
    balance: number = usePage().props.auth.user.balance;
    averageWinnings: number = 0;
    bid: Bid = new Bid(0);

    constructor(deck: Card[]){
        this.deck = deck;
    }

    async start(bidAmount: number) {
        if (bidAmount < 2){
            this.bid.error = 'You can\'t bet les than 2$!'
            return;
        };
        if (bidAmount > this.balance){
            this.bid.error = 'Not enough money!'
            return;
        };
        if (bidAmount > 500){
            this.bid.error = 'You can\'t bet more than 500$!'
            return;
        }
        this.disableButton = true;
        this.activeGame = true;
        this.bid = new Bid(bidAmount);
        this.bid.handsBids.push(bidAmount);
        this.message = '';        
        this.deck[3].hidden = false;
        this.deck.sort(() => Math.random() - 0.5);
        this.nextCard = 0;
        this.activeHandId = 0;
        this.splitHandCount = 0;
        this.doubleHandsId = []; 
        this.playerHands = [];
        this.dealerHand = new Hand(0, false);
        this.playerHands.push(new Hand(0, false));
        const activeHand: Hand = this.playerHands[this.activeHandId];
        await delay(100);
        this.dealCard(activeHand);
        await delay(500);
        this.dealCard(this.dealerHand);
        await delay(500);
        this.dealCard(activeHand);
        this.deck[this.nextCard].hidden = true;
        await delay(500);
        this.dealCard(this.dealerHand);
        if (this.dealerHand.value == 11){
            this.insuranceForm = true;
            this.disableButton = false;
            return;
        }
        this.continue(0);          
    }

    continue(insurance: number){
        if (insurance > this.bid.amount/2){
            this.bid.error = 'You can\'t insure more than half bet (' +  this.bid.amount/2 + '$)!';
            return;
        }
        if (insurance > this.balance - this.bid.winnings){
            this.bid.error = 'Not enough money!';
            return;
        }
        this.disableButton = true;
        this.bid.error = '';
        this.bid.insurance.mesaage = 'Insurance: ' + insurance + '$';
        this.insuranceForm = false;
        this.bid.insurance.value = insurance;
        const activeHand: Hand = this.playerHands[this.activeHandId];
        this.checkIfNaturals(activeHand);
        this.checkIfCanSplit(activeHand);
        this.checkIfCanDouble(activeHand);
        this.disableButton = false;
    }

    async double(hand: Hand){
        if (this.bid.amount > this.balance - this.bid.winnings){
            this.bid.error = 'Not enough money to double bet!';
            hand.canSplit = false;
            return;
        }
        hand.canSplit = false;
        this.disableButton = true;
        this.doubleButton = false;
        this.doubleHandsId.push(hand.id);
        this.bid.handsBids[hand.id] = 2*this.bid.amount;
        this.bid.winnings += this.bid.amount;
        this.deck[this.nextCard].hidden = true;
        await delay(100);
        this.dealCard(hand);
        if (hand.value == 21){
            hand.message = 'Blackjack';
        }
        this.nextHand(hand);
        this.disableButton = false;
    }

    async split(hand: Hand){
        if (this.bid.amount > this.balance - this.bid.winnings){
            this.bid.error = 'Not enough money to split hand!';
            hand.canSplit = false;
            return;
        }
        this.disableButton = true;
        this.doubleButton = false;
        hand.canSplit = false;
        this.bid.handsBids.push(this.bid.amount);
        this.bid.winnings += this.bid.amount;
        this.bid.error = '';
        this.splitHandCount++;
        this.playerHands.push(new Hand(this.splitHandCount, false, [hand.cards[0]]));
        const splitedHand: Hand = this.playerHands[this.splitHandCount];
        hand.cards.shift();
        this.setValue(hand);
        this.setValue(splitedHand);
        hand.active = true;
        await delay(500);
        this.dealCard(hand);
        if (hand.value == 21){
            hand.message = 'Blackjack';
            this.nextHand(hand);
        }
        this.checkIfCanSplit(hand);
        this.checkIfCanDouble(hand);
        this.disableButton = false;
    }

    async hit(hand: Hand){
        this.disableButton = true;
        this.doubleButton = false;
        this.bid.error = '';
        hand.canSplit = false;
        await delay(100);
        this.dealCard(hand);
        if (hand.value > 20){
            if (hand.value > 21){
                hand.message = 'Busted';
                this.bid.winnings -= 2*this.bid.amount;
            } else {
                hand.message = 'Blackjack';
                await delay(500);
            }
            await this.nextHand(hand);
        }
        this.disableButton = false;
    }

    async stand(hand: Hand){
        this.disableButton = true;
        this.doubleButton = false;
        this.bid.error = '';
        hand.canSplit = false;
        await this.nextHand(hand);
        this.disableButton = false;
    }

    protected async endGame(){
        let lostAll = true;
        this.playerHands.forEach(hand => {
            if (hand.message != 'Busted'){
                lostAll = false;
            }
        });
        if (lostAll){
            this.updateBalance();
            return;
        };
        await delay(500);
        this.dealerHand.cards[1].hidden = false;
        this.setValue(this.dealerHand);
        while(this.dealerHand.value < 17){
            await delay(1000);
            this.dealCard(this.dealerHand);
        }
        if (this.dealerHand.value == 21){
            this.dealerHand.message = 'Blackjack';
        }
        if (this.dealerHand.value > 21){
            this.dealerHand.message = 'Busted';
            this.playerHands.forEach(hand => {
                if (hand.cards.length == 3 && hand.cards[2].hidden){
                    hand.cards[2].hidden = false;
                    this.setValue(hand);
                }
                if (hand.message == ''){
                    hand.message = 'Won'
                }
            });
        } else {
            for (const hand of this.playerHands){
                if (hand.cards.length == 3 && hand.cards[2].hidden){
                    await delay(1000);
                    hand.cards[2].hidden = false;
                    this.setValue(hand);
                    if (hand.value == 21){
                        hand.message = 'Blackjack';
                    }
                }
                if (hand.message == '' || hand.message == 'Blackjack'){
                    if (hand.value < this.dealerHand.value){
                        hand.message = 'Lost';
                        if (this.doubleHandsId.includes(hand.id)){
                            this.bid.winnings -= 4 * this.bid.amount;
                        } else {
                            this.bid.winnings -= 2 * this.bid.amount;
                        }
                    } else if (hand.value == this.dealerHand.value){
                        hand.message = 'Push';
                        if (this.doubleHandsId.includes(hand.id)){
                            this.bid.winnings -= 2 * this.bid.amount;
                        } else {
                            this.bid.winnings -= this.bid.amount;
                        }
                    } else if (hand.message == ''){
                        hand.message = 'Won';
                    }
                }
            }
        }
        this.updateBalance();
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

    protected checkIfNaturals(playerHand: Hand) {
        if (this.dealerHand.cards[1].value + this.dealerHand.value == 21) {
            this.dealerHand.cards[1].hidden = false;
            this.setValue(this.dealerHand);
            this.dealerHand.message = 'Blackjack';
            this.bid.winnings += 3 * this.bid.insurance.value;
            if (playerHand.value == 21) {
                playerHand.message = 'Blackjack';
                this.bid.winnings -= this.bid.amount;
                this.updateBalance();
            } else {
                this.bid.winnings -= 2 * this.bid.amount;
                this.updateBalance();
            }
            this.activeGame = false;
            return;
        }else {
            this.bid.winnings -= this.bid.insurance.value;
        }
        if (playerHand.value == 21){
            this.bid.winnings += 0.5 * this.bid.amount;
            playerHand.message = 'Blackjack';
            this.updateBalance();
            this.activeGame = false;
        }

    }

    protected checkIfCanSplit(hand: Hand){
        if (!this.activeGame){
            return;
        }
        if (hand.cards.length == 2 && hand.cards[0].name == hand.cards[1].name){
            hand.canSplit = true;
        }else {
            hand.canSplit = false;
        }
    }

    protected checkIfCanDouble(hand: Hand){
        if (!this.activeGame){
            return;
        }
        if (hand.value > 8 && hand.value < 12){
            this.doubleButton = true;
        }
    }

    protected async nextHand(currentHand: Hand){
        currentHand.active = false;
        if (currentHand.id < this.splitHandCount){
            this.activeHandId ++;
            const activeHand: Hand = this.playerHands[this.activeHandId];
            activeHand.active = true;
            await delay(500);
            this.dealCard(activeHand);
            this.checkIfCanSplit(activeHand);
            this.checkIfCanDouble(activeHand);
            if (activeHand.value == 21){
                activeHand.message = 'Blackjack';
                await delay(500);
                this.nextHand(activeHand);
            }
        } else {
            await this.endGame();
            this.activeGame = false;
        }
    }

    protected updateBalance() {
        if (this.bid.winnings > 0){
            this.message = 'YOU WON! +' + this.bid.winnings + '$';
        } else if (this.bid.winnings < 0){
            this.message = 'YOU LOST! ' + this.bid.winnings + '$';
        } else {
            this.message = 'You won nothing!';
        }
        this.balance += this.bid.winnings;
        this.averageWinnings += this.bid.winnings;
        if (this.bid.winnings != 0){
            router.post('/balance/update', {
                amount: this.bid.winnings,
            })
        }
    }
}

