import { Card } from '@/Pages/Games/Types/CardComponents';
import { router, usePage } from '@inertiajs/vue3';
import { delay } from '@/Pages/Games/Types/Delay';

export class Game{
    deck: Card[];
    line: Card[];
    freeDeals: number = 0;
    speed: number = 500;
    winningHand: string = '';
    balance = usePage().props.auth.user.balance;
    bid = {
        winnings: 0,
        error: '',       
    }
    disableButton: boolean = false;

    constructor(deck: Card[]){
        this.deck = deck;
        this.line = [];
        for (let i=8; i<13; i++){
            this.line.push(deck[i]);
        }
    };

    async deal(bidAmount: number){
        if(this.freeDeals > 0){
            this.freeDeals--;
        } else {
            if (bidAmount < 1){
                this.bid.error = 'You can\'t bid les than 1$!'
                return;
            };
            if (bidAmount > this.balance){
                this.bid.error = 'Not enough money!'
                return;
            };
            router.post('/balance/update', {
                amount: bidAmount*(-1),
            })
            this.balance -= bidAmount;
        }
        this.winningHand = '';
        this.disableButton = true;
        this.bid.winnings = 0;
        this.bid.error = '';
        this.line = [];
        this.deck.sort(() => Math.random() - 0.5);

        for(let i=0; i<5; i++){
            this.deck[i].hidden = true;
            this.line.push(this.deck[i]);
        }
        for(let i=0; i<5; i++){
            await delay(this.speed);
            this.deck[i].hidden = false;
        }

        let sortedLine = [... this.line].sort((a,b) => {
            return a.value - b.value;
        });
        let jokerCount = 0;
        let straight = true;
        let flush = true;
        let fourOfCaind = false;
        let threeOfCaind = false;
        let twoPairs = false;
        let pair = false;
        let sameCards: {[key: string]: number} = {};

        sortedLine.forEach((card, index) => {
            if (card.name == 'joker'){
                jokerCount++;
            } else if (index != 0 ){
                if (straight && card.value == 14 && sortedLine[0].value == 2){
                }else if (straight && card.value != sortedLine[index-1].value + 1){
                    straight = false;
                };
                if (flush && card.suit != sortedLine[index-1].suit){
                    flush = false
                };
                if (card.name == sortedLine[index-1].name && card.name != 'joker'){
                    if (card.name in sameCards){
                        sameCards[card.name]++;
                    } else {
                        sameCards[card.name] = 2;
                    }
                };
            };
        });

        Object.values(sameCards).forEach(cardCount => {
            if (cardCount == 4){
                fourOfCaind = true;
            };
            if (cardCount == 3){
                threeOfCaind = true;
            };
            if (cardCount == 2){
                if (pair){
                    twoPairs = true;
                } else {
                    pair = true;
                }
            }
        });
 
        if (jokerCount == 5){
            this.winningHand = 'five jokers: 50 free spins';
            this.bid.winnings = bidAmount * 100;
            this.freeDeals += 50;
        } else if (jokerCount == 4){
            this.winningHand = 'four jokers: 20 free spins';
            this.bid.winnings = bidAmount * 50;
            this.freeDeals += 20;
        } else if (jokerCount == 3){
            this.winningHand = 'three jokers: 10 free spins';
            this.bid.winnings = bidAmount * 5;
            this.freeDeals += 10;
        }else {
            if (straight && flush){
                if (sortedLine[0].value == 10){
                    this.winningHand = 'royal straight flush';
                    this.bid.winnings = bidAmount * 1000;
                } else {
                    this.winningHand = 'straight flush';
                    this.bid.winnings = bidAmount * 500;
                };
            } else if (fourOfCaind){
                this.winningHand = 'for of caind';
                this.bid.winnings = bidAmount * 100;
            } else if (threeOfCaind && pair){
                this.winningHand = 'full house';
                this.bid.winnings = bidAmount * 50;
            } else if (flush){
                this.winningHand = 'flush';
                this.bid.winnings = bidAmount * 25;
            } else if (straight){
                this.winningHand = 'straight';
                this.bid.winnings = bidAmount * 20;
            } else if (threeOfCaind){
                this.winningHand = 'three of caind';
                this.bid.winnings = bidAmount * 10;
            } else if (twoPairs){
                this.winningHand = 'two pairs';
                this.bid.winnings = bidAmount * 3;
            } else if (pair){
                this.winningHand = 'pair';
                this.bid.winnings = bidAmount;
            } else {
                this.winningHand = 'maybe next time!';
            };
        }
        this.balance += this.bid.winnings;
        router.post('/balance/update', {
            amount: this.bid.winnings,
        })
        this.disableButton = false;
    };
};