export class Suit {
    name: string;
    symbol: string;
    color: string;

    constructor(name: string, symbol: string, color: string){
        this.name = name;
        this.symbol = symbol;
        this.color = color;
    }
}

export class CardFace {
    name: string;
    symbol: string;

    constructor(name: string, symbol: string){
        this.name = name;
        this.symbol = symbol;
    }
}

export class Card {
    symbol: string;
    name: string;
    suit: string;
    value: number;
    color: string;
    suitSymbol: string;
    hidden: boolean = false;

    constructor(suit: Suit, cardFace: CardFace, value: number){
        this.symbol = cardFace.symbol;
        this.name = cardFace.name;
        this.suit = suit.name;
        this.value = value;
        this.color = suit.color;
        this.suitSymbol = suit.symbol;
    }
}

const suits: Suit[] = [
    new Suit('hearts', '♥', 'red'),
    new Suit ('spades', '♠', 'black'),
    new Suit('dimonds', '♦', 'red'),
    new Suit('clubs', '♣', 'black'),
];

const cardFaces: CardFace[] = [
    new CardFace('two', '2'),
    new CardFace('three', '3'),
    new CardFace('four', '4'),
    new CardFace('five', '5'),
    new CardFace('six', '6'),
    new CardFace('seven', '7'),
    new CardFace('eight', '8'),
    new CardFace('nine', '9'),
    new CardFace('ten', '10'),
    new CardFace('jack', 'J'),
    new CardFace('quin', 'Q'),
    new CardFace('king', 'K'),
    new CardFace('ace', 'A'),
];

const cardComponents = {
    suits: suits,
    cardFaces: cardFaces,
}

export default cardComponents;