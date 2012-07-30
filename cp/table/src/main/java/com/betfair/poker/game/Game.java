package com.betfair.poker.game;

import java.util.ArrayList;
import java.util.Random;

import com.betfair.poker.deck.Card;
import com.betfair.poker.deck.Deck;
import com.betfair.poker.deck.Rank;
import com.betfair.poker.deck.Suit;

/**
 * A single poker game.
 */
public class Game {
    private final Deck deck;
    private boolean isPlaying;
    private boolean isHandCompleted;

    public Game() {
        ArrayList<Card> cards = new ArrayList<Card>();

        for (Suit suit : Suit.values()) {
            for (Rank rank : Rank.values()) {
                cards.add(new Card(rank, suit));
            }
        }

        this.deck = new Deck(cards, new Random());
    }

    public Game(final Deck deck) {
        this.deck = deck;
    }
    
    public boolean isPlaying() {
        return this.isPlaying;
    }
    
    public void playHand() {
        this.isPlaying = true;
    }
    
    public void reset() {
        // reset fields to start a new game
    }
    
    public void payPots() {
        // pay out pots to winners
        // will need to evaluate hands
    }
    
    /**
     * This will return true when there is only one player left
     * or all cards have been dealt and all bets placed.  
     */
    public boolean isHandCompleted() {
        return this.isHandCompleted;
    }
}