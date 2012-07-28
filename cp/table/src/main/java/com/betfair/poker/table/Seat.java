package com.betfair.poker.table;

import java.util.Random;
import java.util.ArrayList;

import com.betfair.poker.deck.Card;
import com.betfair.poker.deck.Deck;
import com.betfair.poker.deck.Suit;
import com.betfair.poker.deck.Rank;

/**
 * A single poker table.
 */
public class Seat {
    
	private final int position;
	
    public int getPosition() {
		return position;
	}
    
	public Seat(int position) {
    	this.position = position;
       
    }
    
    
}