import { Card } from './CardComponents';
import cardComponents from './CardComponents';

const deck: Card[] = [];
cardComponents.suits.forEach(suit => {
    let value = 2;
    cardComponents.cardFaces.forEach(cardFace => {
        let cardValue = value;
        if (value == 14) {
            cardValue = 11;
        } else if (value > 10) {
            cardValue = 10;
        }
        deck.push(new Card(suit, cardFace, cardValue));
        value++;
    });
});

export default deck;