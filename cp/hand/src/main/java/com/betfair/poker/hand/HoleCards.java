package com.betfair.poker.hand;

import java.util.ArrayList;

import com.betfair.poker.deck.Card;

public class HoleCards extends AbstractCardsList<Card>{
	private static final long serialVersionUID = -5496955843456754846L;
	private static final int MAX_SIZE=2;
	
	public HoleCards(){
		setList(new ArrayList<Card>());
	}
	
	public void addCard(Card card)
	{
		if (card == null) {
		    throw new IllegalArgumentException("Null card");
		}
		if (size() > MAX_SIZE) {
		    throw new IllegalArgumentException("Too many cards");
		}
		this.add(card);
	}	
}
