package com.betfair.poker.hand;

import java.util.ArrayList;
import java.util.List;

import com.betfair.poker.deck.Card;

public class CommunityCards extends AbstractCardsList<Card> {
    private static final long serialVersionUID = -5496955843456754845L;
    private static final int MAX_SIZE = 5;

    public CommunityCards() {
        setList(new ArrayList<Card>());
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
        if (size() + cards.size() > MAX_SIZE) {
            throw new IllegalArgumentException("Too many cards");
        }
        this.addCards(cards);
    }
}
