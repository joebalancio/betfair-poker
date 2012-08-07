package com.betfair.poker.game;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.Set;
import java.util.TreeMap;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.betfair.poker.deck.Card;
import com.betfair.poker.deck.Deck;
import com.betfair.poker.deck.Rank;
import com.betfair.poker.deck.Suit;
import com.betfair.poker.hand.CommunityCards;
import com.betfair.poker.hand.Hand;
import com.betfair.poker.hand.HandValue;
import com.betfair.poker.hand.HoleCards;
import com.betfair.poker.player.Action;
import com.betfair.poker.player.Player;
import com.betfair.poker.table.Seat;

/**
 * A single poker game.
 */
public class Game {
    public static final Log log = LogFactory.getLog(Game.class);
    
    private final Deck deck;
    private boolean isPlaying;
    private boolean isHandCompleted;
    private boolean isGameCompleted;
    private List<Seat> seats;
    private int pot;
    private int bet;
    private final int SMALL_BLIND = 2;
    private final int BIG_BLIND = 4;
    private int minBet;
    private CommunityCards communityCards = new CommunityCards();
    private GameStatus status;
    int playersToAct = 0;
    // int MAX_RAISES = 4;
    int smallBlindIdx = 0;
    int bigBlindIdx = 0;

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
        this.deck.shuffle();
        minBet = BIG_BLIND;
        status = GameStatus.DEAL;
        bet = minBet;
        this.isPlaying = true;
        int dealerIndx = 0;
        playersToAct = getSeatSize();
        
        for (int i = 0; i < getSeatSize(); i++) {
            if (seats.get(i).isDealer()) {
                dealerIndx = i;

            }
        }
        log.debug("dealerIndex " + dealerIndx);
        int nextTurnIdx = 0;
        if (dealerIndx == getSeatSize() - 1) {
            smallBlindIdx = 0;
            bigBlindIdx = 1;
        } else {
            log.debug("in here ");
            smallBlindIdx = dealerIndx + 1;
            
            if  (smallBlindIdx == getSeatSize() -1) {
                bigBlindIdx = 0;
            } else {
                bigBlindIdx = smallBlindIdx + 1;
            }
        }
        log.debug("smallBlindIdx " + smallBlindIdx);
        log.debug("bigBlindIdx " + bigBlindIdx);
        // sub small & big blind
        Seat smallBlind = seats.get(smallBlindIdx);
        smallBlind.setSmallBlind(true);
        smallBlind.getPlayer().postSmallBlind(SMALL_BLIND);

        Seat bigBlind = seats.get(bigBlindIdx);
        bigBlind.setBigBlind(true);
        bigBlind.getPlayer().postBigBlind(BIG_BLIND);
        
        this.pot += SMALL_BLIND;
        this.pot += BIG_BLIND;
        
        // mark next person to bb as isturn =true
        if (bigBlindIdx == getSeatSize() - 1) {
            nextTurnIdx = 0;
        } else {
            nextTurnIdx = bigBlindIdx + 1;
        }
        
        seats.get(nextTurnIdx).setTurn(true);

        // deal the cards
        dealCards();
    }

    public void playHand(int seatId, Action action, int currentBet) {
        Seat currentSeat = getSeat(seatId);
 
        if (currentSeat.isTurn()) {
            Set<Action> allowedActions = getAllowedActions(currentSeat
                    .getPlayer());
            if (!allowedActions.contains(action)) {
                log.debug("Allowed Actions " + allowedActions);
                String msg = String.format(
                        "Illegal action (%s) from player %s!", action,
                        currentSeat.getPlayer());
                throw new IllegalStateException(msg);
            }
            playersToAct--;
            switch (action) {
            case CHECK:
                // Do nothing.
                break;
            case CALL:
                this.pot += bet - currentSeat.getPlayer().getBet();
                currentSeat.getPlayer().act(action, currentBet, bet);
                break;
            case BET:
                this.bet = minBet;
                this.pot += currentBet;
                currentSeat.getPlayer().act(action, currentBet, bet);
                playersToAct = getSeatSize();
                break;
            case RAISE:
                this.bet += minBet;
                this.pot += currentBet;
                currentSeat.getPlayer().act(action, currentBet, bet);
                playersToAct = getSeatSize() - 1;
                break;
            case FOLD:
                seats.get(seatId).removePlayer();
                seats.get(seatId).getPlayer();
                // seats.remove(seatId);
                if (getSeatSize() == 1) {
                    final Seat seat = seats.get(0);
                    // The player left wins.
                    seat.setWinner(true);
                    playerWins(seat.getPlayer());
                    playersToAct = 0;
                    isGameCompleted = true;
                }
                break;
            default:
                throw new IllegalStateException("Invalid action: " + action);
            }

            log.debug("Players to act " + playersToAct);
            if (null != currentSeat.getPlayer()
                    && currentSeat.getPlayer().isAllIn()) {
                currentSeat.getPlayer().setAllInPot(pot);
            }
            seats.get(seatId).setTurn(false);
            if (playersToAct == 0) {
                isHandCompleted = true;
                if (GameStatus.DEAL.equals(status)) {
                    for (Seat seat : seats) {
                        if (null != seat.getPlayer())
                            seat.getPlayer().setBet(0);
                    }
                    flop();
                } else if (GameStatus.FLOP.equals(status)
                        || GameStatus.TURN.equals(status)) {
                    for (Seat seat : seats) {
                        if (null != seat.getPlayer())
                            seat.getPlayer().setBet(0);
                    }
                    turnOrRiver();
                } else if (GameStatus.RIVER.equals(status)) {
                    for (Seat seat : seats) {
                        if (null != seat.getPlayer())
                            seat.getPlayer().setBet(0);
                    }
                    status = GameStatus.SHOWDOWN;
                    bet = 0;
                    isGameCompleted = true;
                    log.debug("Game is complete ");
                    payPots();
                }
            } else {
                int newSeat = seatId;
                log.debug("Seat id " + newSeat);
                while (newSeat >= 0) {
                    if (newSeat == seats.size() - 1) {
                        newSeat = -1;
                    }
                    if (null != seats.get(newSeat + 1).getPlayer()) {
                        log.debug("Next turn is for seatID "
                                + (newSeat + 1));
                        seats.get(newSeat + 1).setTurn(true);
                        break;
                    }
                    newSeat++;
                }
            }

        } else {
            String msg = String.format("Illegal action (%s) from player %s!",
                    action, currentSeat.getPlayer());
            throw new IllegalStateException(msg);
        }
    }

    private void playerWins(Player player) {
        player.win(this.pot);
        this.pot = 0;
        this.bet = 0;
    }

    public int getPot() {
        return this.pot;
    }

    public Set<Action> getAllowedActions(Player player) {
        int playerBet = player.getBet();
        log.debug("player bet " + playerBet);
        log.debug("table bet " + bet);
        Set<Action> actions = new HashSet<Action>();
        log.debug("Value of Min Bet " + bet);
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
        this.isGameCompleted = false;
        this.seats = new ArrayList<Seat>();
        this.deck.shuffle();
        this.pot = 0;
        this.bet = 0;
        
    }

    /*
     * public void payPots() { // pay out pots to winners // will need to
     * evaluate hands List<Seat> winningSeats = getWinners(); int tempPot = pot;
     * for(Seat seat: seats) { for(Seat winningseat: winningSeats) {
     * if(seat.equals(winningseat)) { // Determine the player's share of the
     * pot. int potShare = seat.getPlayer().getAllInPot(); if (potShare == 0) {
     * // Player is not all-in, so he competes for the whole pot. potShare = pot
     * / winningSeats.size(); } // Give the player his share of the pot.
     * seat.getPlayer().win(potShare); tempPot -= potShare; // If there is no
     * more pot to divide, we're done. if (tempPot == 0) { break; } } } } }
     */

    private Map<HandValue, List<Seat>> getRankedPlayers() {
        Map<HandValue, List<Seat>> winners = new TreeMap<HandValue, List<Seat>>();
        for (Seat seat : seats) {
            // Create a hand with the community cards and the player's hole
            // cards.
            if (null != seat.getPlayer()) {
                Hand hand = new Hand();
                hand.setHoleCards(seat.getPlayer().getHand().getHoleCards());
                hand.setCommunityCards(seat.getPlayer().getHand()
                        .getCommunityCards());
                // Store the player together with other players with the same
                // hand value.
                HandValue handValue = new HandValue(hand);
                log.debug("Value for player "
                        + seat.getPlayer().getName() + " Is "
                        + handValue.getValue() + " and type "
                        + handValue.getType());
                List<Seat> winnerSeatList = winners.get(handValue);
                if (winnerSeatList == null) {
                    winnerSeatList = new LinkedList<Seat>();
                }
                winnerSeatList.add(seat);
                winners.put(handValue, winnerSeatList);
            }
        }
        return winners;
    }

    public void payPots() {
        log.debug("Total Pot Value " + pot);
        // Look at each hand value, sorted from highest to lowest.
        Map<HandValue, List<Seat>> rankedPlayers = getRankedPlayers();
        log.debug("total ranks" + rankedPlayers.size());
        for (HandValue handValue : rankedPlayers.keySet()) {
            // Get players with winning hand value.
            List<Seat> winners = rankedPlayers.get(handValue);
            log.debug("winners are " + winners.size());
            if (winners.size() == 1) {
                // Single winner.
                Seat winner = winners.get(0);
                winner.setWinner(true);
                winner.getPlayer().win(pot);
                this.pot = 0;
                this.bet = 0;
                break;
            } else {
                // Tie; share the pot amongst winners.
                int tempPot = pot;
                // StringBuilder sb = new StringBuilder("Tie: ");
                for (Seat seat : winners) {
                    // Determine the player's share of the pot.
                    log.debug("Hole Cards "
                            + seat.getPlayer().getHand().getHoleCards()
                                    .toString());
                    log.debug("Community Cards "
                            + seat.getPlayer().getHand().getCommunityCards()
                                    .toString());

                    int potShare = seat.getPlayer().getAllInPot();
                    if (potShare == 0) {
                        // Player is not all-in, so he competes for the whole
                        // pot.
                        potShare = pot / winners.size();
                    }
                    // Give the player his share of the pot.
                    for (Seat origSeat : seats) {
                        if (origSeat.equals(seat)) {
                            origSeat.setWinner(true);
                            origSeat.getPlayer().win(potShare);
                        }
                    }
                    tempPot -= potShare;
                    // If there is no more pot to divide, we're done.
                    if (tempPot == 0) {
                        this.pot = 0;
                        this.bet = 0;
                        break;
                    }
                }
                if (tempPot > 0) {
                    throw new IllegalStateException(
                            "Pot not empty after sharing between winners");
                }
                break;
            }
        }
    }

    /*
     * private List<Seat> getWinners() { //evaluating hands and determine the
     * winner List<Seat> winningSeats = new ArrayList<Seat>(); int handValue =
     * 0; for(Seat seat: seats) { int playerHand =
     * seat.getPlayer().getHand().getHandValue(); if(playerHand > handValue) {
     * winningSeats.clear(); winningSeats.add(seat); } else if (playerHand ==
     * handValue) { winningSeats.add(seat); } } return winningSeats; }
     */
    public int getPlayersToAct() {
        return this.playersToAct;
    }

    /**
     * This will return true when there is only one player left or all cards
     * have been dealt and all bets placed.
     */
    public boolean isHandCompleted() {
        return this.isHandCompleted;
    }

    public boolean isGameCompleted() {
        return this.isGameCompleted;
    }

    public void setActiveSeats(List<Seat> seats) {
        this.seats = new ArrayList<Seat>(seats);
    }

    public List<Seat> getActiveSeats() {
        return new ArrayList<Seat>(seats);
    }

    public Seat getSeat(int position) {
        for (Seat seat : getActiveSeats()) {
            if (seat.getPosition() == position) {
                return seat;
            }
        }
        
        return null;
    }

    public void dealCards() {
        // Burn the first card
        deck.dealCard();
        log.debug("seat size " + getSeatSize());
        
        // Deal first card to each player at the start
        for (Seat seat : seats) {
            Hand hand = new Hand();
            HoleCards holeCards = new HoleCards();
            holeCards.addCard(deck.dealCard());
            hand.setHoleCards(holeCards);
            seat.getPlayer().setHand(hand);
        }

        // Deal second card to each player at the start
        for (Seat seat : seats) {
            HoleCards holeCards = seat.getPlayer().getHand().getHoleCards();
            holeCards.addCard(deck.dealCard());
        }
    }

    public CommunityCards getCommunityCards() {
        return this.communityCards;
    }

    public void flop() {
        log.debug("Called!!!");
        setPlayerTurn();
        isHandCompleted = false;
        // Burn the first card
        deck.dealCard();

        // Deal 3 flop cards
        this.communityCards = new CommunityCards();
        communityCards.addCards(deck.dealCards(3));

        for (Seat seat : seats) {
            if (null != seat.getPlayer()) {
                Hand hand = seat.getPlayer().getHand();
                if (null == hand)//
                    hand = new Hand();
                hand.setCommunityCards(communityCards);
                seat.getPlayer().setHand(hand);
            }
        }
        playersToAct = getSeatSize();
        status = GameStatus.FLOP;
        bet = 0;
    }

    private void setPlayerTurn() {
        if (null != seats.get(smallBlindIdx).getPlayer()) {
            seats.get(smallBlindIdx).setTurn(true);
        } else if (null != seats.get(bigBlindIdx).getPlayer()) {
            seats.get(bigBlindIdx).setTurn(true);
        } else {
            int nextTurnIdx = bigBlindIdx + 1;
            if (bigBlindIdx == seats.size() - 1) {
                nextTurnIdx = bigBlindIdx + 1;
            }
            log.debug("Whose turn is next ?? " + nextTurnIdx);
            seats.get(nextTurnIdx).setTurn(true);
        }
    }

    public void turnOrRiver() {
        setPlayerTurn();
        isHandCompleted = false;
        // Burn the first card
        deck.dealCard();

        // Deal turn or river card
        communityCards.addCards(deck.dealCards(1));
 
        for (int i = 0; i < seats.size(); i++) {
            Seat seat = seats.get(i);
            if (null != seat.getPlayer()) {
                // Hand hand = seat.getPlayer().getHand();
                log.debug("Com card size "
                                + seat.getPlayer().getHand()
                                        .getCommunityCards().size());
                // hand.getCommunityCards().addCard(commCard);
                seat.getPlayer().getHand().setCommunityCards(communityCards);

            }
        }
        
        playersToAct = getSeatSize();
        
        if (GameStatus.FLOP.equals(status)) {
            status = GameStatus.TURN;
            bet = 0;
        } else if (GameStatus.TURN.equals(status)) {
            status = GameStatus.RIVER;
            bet = 0;
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

    private int getSeatSize() {
        int seatSize = 0;
        for (Seat seat : seats) {
            if (null != seat.getPlayer()) {
                seatSize++;
            }
        }
        return seatSize;
    }
}