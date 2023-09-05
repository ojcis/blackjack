import { Card, CardFace, Suit } from '@/Pages/Games/Types/CardComponents';
import cardComponents from '@/Pages/Games/Types/CardComponents';

const deck: Card[] = [];
cardComponents.suits.forEach(suit => {
    let value = 2;
    cardComponents.cardFaces.forEach(cardFace => {
        deck.push(new Card(suit, cardFace, value));
        value++;
    });
});
for (let i=0; i<10; i++){
    deck.push(new Card(new Suit('', '★', 'black'), new CardFace('joker', '☆'), 0));
}

export default deck;