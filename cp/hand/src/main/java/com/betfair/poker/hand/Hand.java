package com.betfair.poker.hand;


import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import com.betfair.poker.deck.Card;

/**
 * A single poker hand.
 */
public class Hand {
    private CommunityCards communityCards;
    private HoleCards holeCards;
    
    public Hand() {

    }
	
    public CommunityCards getCommunityCards() {
		return communityCards;
	}
	
	public void setCommunityCards(CommunityCards communityCards) {
		this.communityCards = communityCards;
	}
	
	public HoleCards getHoleCards() {
		return holeCards;
	}
	
	public void setHoleCards(HoleCards holeCards) {
		this.holeCards = holeCards;
	}
    
	public Card[] getCards()
	{
		List<Card> cards = new ArrayList<Card>();
		cards.addAll(communityCards.list());
		cards.addAll(holeCards.list());
		Collections.sort(cards);
		Card[] temp = new Card[cards.size()];
		Card[] result = cards.toArray(temp);
		return result;
	}
	
	public synchronized void addCard(Card card)
	{
		if(this.holeCards == null)
		{
			this.holeCards = new HoleCards();
		}
		this.holeCards.add(card);
	}
}