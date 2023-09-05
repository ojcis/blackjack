import { Card, CardFace, Suit } from "./CardComponents";

const testDeck: Card[] = [];
for (let i=0; i<5; i++){
    testDeck.push(new Card(new Suit('hearts', '♥', 'red'), new CardFace('ace', 'A'), 11));
    testDeck.push(new Card(new Suit('hearts', '♥', 'red'), new CardFace('ten', '10'), 10));
    testDeck.push(new Card(new Suit('hearts', '♥', 'red'), new CardFace('four', '4'), 4));
}

export default testDeck;