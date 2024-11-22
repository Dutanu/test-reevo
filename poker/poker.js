const RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
const SUITS = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];

class Card {
    constructor(rank, suit) {
        this.rank = rank;
        this.suit = suit;
    }
}

class Deck {
    constructor() {
        this.cards = [];
        this.initializeDeck();
    }

    initializeDeck() {
        for (let suit of SUITS) {
            for (let rank of RANKS) {
                this.cards.push(new Card(rank, suit));
            }
        }
    }

    shuffle() {
        let array = this.cards;
        for (let i = array.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    drawCards(number) {
        if (number > this.cards.length) {
            throw new Error('Nu există suficiente cărți în pachet.');
        }
        return this.cards.splice(0, number);
    }
}

function isFlush(cards) {
    if (cards.length === 0) return false;
    const suit = cards[0].suit;
    for (let card of cards) {
        if (card.suit !== suit) {
            return false;
        }
    }
    return true;
}

function isStraight(cards) {
    if (cards.length !== 5) return false;

    const rankValues = {
        'A': [1, 14],
        '2': [2],
        '3': [3],
        '4': [4],
        '5': [5],
        '6': [6],
        '7': [7],
        '8': [8],
        '9': [9],
        '10': [10],
        'J': [11],
        'Q': [12],
        'K': [13]
    };

    let possibleHands = [[]];

    for (let card of cards) {
        let values = rankValues[card.rank];
        let newHands = [];
        for (let value of values) {
            for (let hand of possibleHands) {
                newHands.push([...hand, value]);
            }
        }
        possibleHands = newHands;
    }

    for (let hand of possibleHands) {
        hand.sort((a, b) => a - b);
        let isSequence = true;
        for (let i = 0; i < hand.length - 1; i++) {
            if (hand[i + 1] - hand[i] !== 1) {
                isSequence = false;
                break;
            }
        }
        if (isSequence) {
            return true;
        }
    }
    return false;
}