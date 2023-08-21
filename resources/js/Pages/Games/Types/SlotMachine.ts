import { Card } from './CardComponents';
import { router, usePage } from '@inertiajs/vue3';

export class Game{
    deck: Card[];
    line: Card[];
    winningHand: string = '';
    balance = {
        value: 0,
        error: '',
    };
    bid = {
        amount: 0,
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

    async spin(bidAmount: number){
        if (bidAmount < 1){
            this.bid.error = 'You can\'t bid les than 1$!'
            return;
        };
        if (bidAmount > this.balance.value){
            this.bid.error = 'Not enough money!'
            return;
        };
        this.disableButton = true;
        this.balance.value -= bidAmount;
        this.bid.winnings = 0;
        this.bid.error = '';
        this.bid.amount = bidAmount;
        this.line = [];
        this.deck.sort(() => Math.random() - 0.5);
        for(let i=0; i<5; i++){
            this.line.push(this.deck[i]);
        }
        let line = [... this.line];
        line.sort((a,b) => {
            return a.value - b.value;
        });
        let straight = true;
        let flush = true;
        let fourOfCaind = false;
        let threeOfCaind = false;
        let twoPairs = false;
        let pair = false;
        let sameCards: {[key: string]: number} = {};
        line.forEach((card, index) => {
            if (index != 0 ){
                if (card.value != line[index-1].value + 1){
                    straight = false;
                };
                if (card.suit != line[index-1].suit){
                    flush = false
                };
                if (card.name == line[index-1].name){
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
        if (straight && flush){
            if (line[4].value == 14){
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
            this.bid.winnings = bidAmount * 30;
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
        this.balance.value += this.bid.winnings;
        this.disableButton = false;
    };

    insert(amount: number){
        if (amount < 1){
            this.balance.error = 'You can\'t insert les than 1$!'
            return;
        };
        if (amount > usePage().props.auth.user.balance){
            this.balance.error = 'Not enough money!'
            return;
        };
        this.balance.value += amount;
    }

    withdraw(){
        this.balance.value = 0;
    }
};