import { Card } from './CardComponents';
import cardComponents from './CardComponents';

const deck: Card[] = [];
cardComponents.suits.forEach(suit => {
    let value = 2;
    cardComponents.cardFaces.forEach(cardFace => {
        deck.push(new Card(suit, cardFace, value));
        value++;
    });
});

export default deck;