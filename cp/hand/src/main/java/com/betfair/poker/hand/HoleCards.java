package com.betfair.poker.hand;

import java.util.ArrayList;
import java.util.List;

import com.betfair.poker.deck.Card;

public class HoleCards extends AbstractCardsList<Card> {
    private static final long serialVersionUID = -5496955843456754846L;
    private static final int MAX_SIZE = 2;

    public HoleCards() {
        setList(new ArrayList<Card>());
    }

    public List<Card> getCards() {
        return new ArrayList<Card>(list());
    }
    
    public void addCard(Card card) {
        if (card == null) {
            throw new IllegalArgumentException("Null card");
        }
        if (size() > MAX_SIZE) {
            throw new IllegalArgumentException("Too many cards");
        }
        this.add(card);
    }
    
    public void addCards(List<Card> cards) {
        if (cards == null || cards.isEmpty()) {
            throw new IllegalArgumentException("Null card");
        }
        if (size()  + cards.size() > MAX_SIZE) {
            throw new IllegalArgumentException("Too many cards");
        }
        this.addAll(cards);
    }
}
