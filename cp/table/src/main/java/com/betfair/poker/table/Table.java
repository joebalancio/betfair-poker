package com.betfair.poker.table;

import java.util.List;
import java.util.Random;
import java.util.ArrayList;

import com.betfair.poker.deck.Card;
import com.betfair.poker.deck.Deck;
import com.betfair.poker.deck.Suit;
import com.betfair.poker.deck.Rank;

/**
 * A single poker table.
 */
public class Table {
    private final Deck deck;
    private List<Seat> seats;

    public Table() {
        ArrayList<Card> cards = new ArrayList<Card>();

        for (Suit suit : Suit.values()) {
            for (Rank rank : Rank.values()) {
                cards.add(new Card(rank, suit));
            }
        }

        this.deck = new Deck(cards, new Random());
        this.seats = new ArrayList<Seat>();
        
    }

    public Table(final Deck deck, final  List<Seat> seats) {
        this.deck = deck;
        this.seats = seats;
    }
    
   }