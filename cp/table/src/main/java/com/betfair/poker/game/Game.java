package com.betfair.poker.game;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.Iterator;
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
import com.betfair.poker.player.Status;
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
        Seat bigBlind = seats.get(bigBlindIdx);
        smallBlind.getPlayer().setStatus(Status.SMALL_BLIND);
        bigBlind.getPlayer().postSmallBlind(SMALL_BLIND);
        bigBlind.getPlayer().setStatus(Status.BIG_BLIND);
        bigBlind.getPlayer().postBigBlind(BIG_BLIND);
        // mark next person to bb as isturn =true
        // deal the cards
        dealCards();
    }

    public void playHand(int seatId, Action action, int currentBet) {
        Seat currentPlayer = seats.get(seatId);
        Set<Action> allowedActions = getAllowedActions(currentPlayer
                .getPlayer());
        if (!allowedActions.contains(action)) {
            String msg = String.format("Illegal action (%s) from player %s!",
                    action, currentPlayer.getPlayer());
            throw new IllegalStateException(msg);
        }
        switch (action) {
        case CHECK:
            // Do nothing.
            break;
        case CALL:
            pot += currentBet;
            currentPlayer.getPlayer().act(action, bet, currentBet);
            break;
        case BET:
            bet = minBet;
            pot += currentBet;
            currentPlayer.getPlayer().act(action, bet, currentBet);
            break;
        case RAISE:
            bet += minBet;
            pot += currentBet;
            currentPlayer.getPlayer().act(action, bet, currentBet);
            break;
        case FOLD:
            seats.get(seatId).removePlayer();
            break;
        default:
            throw new IllegalStateException("Invalid action: " + action);
        }
        if (currentPlayer.getPlayer().isAllIn()) {
            // currentPlayer.getPlayer().setInAllPot(pot);
        }
    }

    private Set<Action> getAllowedActions(Player player) {
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

        // evaluating hands and determine the winner
        List<Seat> winningSeats = new ArrayList<Seat>();
        int handValue = 0;
        for (Seat seat : seats) {
            int playerHand = seat.getPlayer().getHand().getHandValue();
            if (playerHand > handValue) {
                winningSeats.clear();
                winningSeats.add(seat);
            } else if (playerHand == handValue) {
                winningSeats.add(seat);
            }
        }

        for (Seat seat : seats) {
            for (Seat winningseat : winningSeats) {
                if (seat.equals(winningseat)) {
                    int cash = seat.getPlayer().getCash();
                    // split it among
                    cash += this.pot / winningSeats.size();
                    seat.getPlayer().setCash(cash);
                }
            }
        }
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

    public void dealCards() {
        // Burn the first card
        deck.dealCard();

        // Deal 2 cards to each player at the start
        Iterator<Seat> iterator = seats.iterator();
        while (iterator.hasNext()) {
            Seat seat = iterator.next();
            Hand hand = new Hand();
            HoleCards holeCards = new HoleCards();
            holeCards.addCards(deck.dealCard(2));
            hand.setHoleCards(holeCards);
            seat.getPlayer().setHand(hand);
        }
    }

    public void flop() {
        // Burn the first card
        deck.dealCard();

        // Deal 2 cards to each player at the start
        CommunityCards comCards = new CommunityCards();
        comCards.addCards(deck.dealCard(3));
        for (Seat seat : seats) {
            Hand hand = seat.getPlayer().getHand();
            if (null == hand)//
                hand = new Hand();
            hand.setCommunityCards(comCards);
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
            if (null == hand)
                hand = new Hand();
            hand.getCommunityCards().addCard(commCard);
            seat.getPlayer().setHand(hand);
        }
    }
}