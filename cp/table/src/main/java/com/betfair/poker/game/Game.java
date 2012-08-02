package com.betfair.poker.game;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Random;
import java.util.Set;

import com.betfair.poker.deck.Card;
import com.betfair.poker.deck.Deck;
import com.betfair.poker.deck.Rank;
import com.betfair.poker.deck.Suit;
import com.betfair.poker.hand.CommunityCards;
import com.betfair.poker.hand.Hand;
import com.betfair.poker.hand.HoleCards;
import com.betfair.poker.player.Action;
import com.betfair.poker.player.Player;
import com.betfair.poker.table.Seat;

/**
 * A single poker game.
 */
public class Game {
    private final Deck deck;
    private boolean isPlaying;
    private boolean isHandCompleted;
    private List<Seat> seats;
    private int pot;
    private int bet;
    private final int SMALL_BLIND = 2;
    private final int BIG_BLIND = 4;
    private int minBet;
    private List<Player> activePlayers;
    private CommunityCards communityCards = new CommunityCards();
    private final GameStatus status = GameStatus.DEAL;

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

    public void initGame() {
        minBet = BIG_BLIND;
        bet = minBet;
        this.isPlaying = true;
        int dealerIndx = 0;

        for (int i = 0; i < seats.size(); i++) {
            if (seats.get(i).isDealer()) {
                dealerIndx = i;

            }
        }
        int smallBlindIdx = 0;
        int bigBlindIdx = 0;

        if (dealerIndx == seats.size() - 1) {
            smallBlindIdx = 0;
            bigBlindIdx = 1;
        } else {
            smallBlindIdx = dealerIndx++;
            bigBlindIdx = smallBlindIdx++;
        }

        // sub small & big blind
        Seat smallBlind = seats.get(smallBlindIdx);
        smallBlind.setSmallBlind(true);
        smallBlind.getPlayer().postSmallBlind(SMALL_BLIND);

        Seat bigBlind = seats.get(bigBlindIdx);
        bigBlind.setBigBlind(true);
        bigBlind.getPlayer().postBigBlind(BIG_BLIND);
        // mark next person to bb as isturn =true
        // deal the cards
        dealCards();
    }

    public void playHand(int seatId, Action action, int currentBet) {
        Seat currentSeat = getSeat(seatId);
        if (currentSeat.isTurn()) {
            Set<Action> allowedActions = getAllowedActions(currentSeat
                    .getPlayer());
            if (!allowedActions.contains(action)) {
                String msg = String.format(
                        "Illegal action (%s) from player %s!", action,
                        currentSeat.getPlayer());
                throw new IllegalStateException(msg);
            }
            switch (action) {
            case CHECK:
                // Do nothing.
                break;
            case CALL:
                pot += currentBet;
                currentSeat.getPlayer().act(action, bet, currentBet);
                break;
            case BET:
                bet = minBet;
                pot += currentBet;
                currentSeat.getPlayer().act(action, bet, currentBet);
                break;
            case RAISE:
                bet += minBet;
                pot += currentBet;
                currentSeat.getPlayer().act(action, bet, currentBet);
                break;
            case FOLD:
                seats.get(seatId).removePlayer();
                seats.remove(seatId);
                break;
            default:
                throw new IllegalStateException("Invalid action: " + action);
       	}
    	if (currentSeat.getPlayer().isAllIn()) {
    		currentSeat.getPlayer().setAllInPot(pot);
            }
        }
    }

    public int getPot() {
        return this.pot;
    }

    public Set<Action> getAllowedActions(Player player) {
        int playerBet = player.getBet();
        Set<Action> actions = new HashSet<Action>();
        if (bet == 0) {
            actions.add(Action.CHECK);
            actions.add(Action.BET);
        } else {
            if (playerBet < bet) {
                actions.add(Action.CALL);
                actions.add(Action.RAISE);
            } else {
                actions.add(Action.CHECK);
                actions.add(Action.RAISE);
            }
        }
        actions.add(Action.FOLD);
        return actions;
    }

    public void reset() {
        // reset fields to start a new game
        this.isPlaying = false;
        this.isHandCompleted = false;
        this.seats = new ArrayList<Seat>();
        this.deck.shuffle();
    }

    public void payPots() {
        // pay out pots to winners
        // will need to evaluate hands
    	List<Seat> winningSeats = getWinners();
    	int tempPot = pot;
    	for(Seat seat: seats)
    	{
    		for(Seat winningseat: winningSeats)
    		{
    			if(seat.equals(winningseat))
    			{
    				// Determine the player's share of the pot.
    	            int potShare = seat.getPlayer().getAllInPot();
    	            if (potShare == 0) {
    	                // Player is not all-in, so he competes for the whole pot.
    	                potShare = pot / winningSeats.size();
    	            }
    	            // Give the player his share of the pot.
    	            seat.getPlayer().win(potShare);
    	            tempPot -= potShare;
    	            // If there is no more pot to divide, we're done.
    	            if (tempPot == 0) {
    	                break;
    	            }
    			}
    		}
    	}
    }
    
    /*private Map<HandValue, List<Player>> getRankedPlayers()
    {
    	Map<HandValue, List<Player>> winners = new TreeMap<HandValue, List<Player>>();
    	for (Seat seat : seats) {
                // Create a hand with the community cards and the player's hole cards.
                Hand hand = new Hand();
                hand.setHoleCards(seat.getPlayer().getHand().getHoleCards());
                hand.setCommunityCards(seat.getPlayer().getHand().getCommunityCards());
                // Store the player together with other players with the same hand value.
                HandValue handValue = new HandValue(hand);
                List<Player> playerList = winners.get(handValue);
                if (playerList == null) {
            	playerList = new LinkedList<Player>();
                }
                playerList.add(seat.getPlayer());
                winners.put(handValue, playerList);
    	}
    	return winners;
    }
    */
    private List<Seat> getWinners()
    {
    	//evaluating hands and determine the winner
    	List<Seat> winningSeats = new ArrayList<Seat>();
    	int handValue = 0;
    	for(Seat seat: seats)
    	{
    		int playerHand = seat.getPlayer().getHand().getHandValue(); 
    		if(playerHand > handValue)
    		{
    			winningSeats.clear();
    			winningSeats.add(seat);
    		}
    		else if (playerHand == handValue)
    		{
    			winningSeats.add(seat);
    		}
    	}
    	return winningSeats;
    }

    /**
     * This will return true when there is only one player left or all cards
     * have been dealt and all bets placed.
     */
    public boolean isHandCompleted() {
        return this.isHandCompleted;
    }

    public void setActiveSeats(List<Seat> seats) {
        this.seats = new ArrayList<Seat>(seats);
    }

    public List<Seat> getActiveSeats() {
        return new ArrayList<Seat>(seats);
    }

    public Seat getSeat(int position) {
        return seats.get(position);
    }

    public void dealCards() {
        // Burn the first card
        deck.dealCard();

        // Deal 2 cards to each player at the start
        for (Seat seat : seats) {
            Hand hand = new Hand();
            HoleCards holeCards = new HoleCards();
            holeCards.addCards(deck.dealCards(2));
            hand.setHoleCards(holeCards);
            seat.getPlayer().setHand(hand);
        }
    }

    public CommunityCards getCommunityCards() {
        return this.communityCards;
    }

    public void flop() {
        // Burn the first card
        deck.dealCard();

        // Deal 2 cards to each player at the start
        this.communityCards = new CommunityCards();
        communityCards.addCards(deck.dealCards(3));

        for (Seat seat : seats) {
            Hand hand = seat.getPlayer().getHand();
            if (null == hand)//
                hand = new Hand();
            hand.setCommunityCards(communityCards);
            seat.getPlayer().setHand(hand);
        }
    }

    public void turnOrRiver() {
        // Burn the first card
        deck.dealCard();

        // Deal 2 cards to each player at the start
        Card commCard = deck.dealCard();
        for (Seat seat : seats) {
            Hand hand = seat.getPlayer().getHand();

            if (null == hand) {
                hand = new Hand();
            }

            hand.getCommunityCards().addCard(commCard);
            seat.getPlayer().setHand(hand);
        }
    }

    public GameStatus getStatus() {
        return this.status;
    }
    
    public void removeSeat(int position) {
        List<Seat> seats = new ArrayList<Seat>();
        
        for (Seat seat : seats) {
            if (seat.getPosition() != position) {
                seats.add(seat);
            }
        }
        
        this.seats = seats;
    }
}