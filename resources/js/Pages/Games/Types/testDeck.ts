import { Card, CardFace, Suit } from "./CardComponents";
import deck from "@/Pages/Games/Blackjack/Ts/Deck";

const testDeck: Card[] = [];
testDeck.push(new Card(new Suit('hearts', '♥', 'red'), new CardFace('nine', '9'), 9));
testDeck.push(new Card(new Suit('dimonds', '♦', 'red'), new CardFace('three', '3'), 3));
testDeck.push(new Card(new Suit('spades', '♠', 'black'), new CardFace('nine', '9'), 9));
testDeck.push(new Card(new Suit('hearts', '♥', 'red'), new CardFace('five', '5'), 5));
testDeck.push(new Card(new Suit('clubs', '♣', 'black'), new CardFace('two', '2'), 2));
testDeck.push(new Card(new Suit('spades', '♠', 'black'), new CardFace('ten', '10'), 10));
testDeck.push(new Card(new Suit('clubs', '♣', 'black'), new CardFace('nine', '9'), 9));
deck.sort(() => Math.random() - 0.5);
deck.forEach(card => {
    testDeck.push(card);
});
export default testDeck;