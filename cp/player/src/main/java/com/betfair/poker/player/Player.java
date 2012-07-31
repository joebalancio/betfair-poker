package com.betfair.poker.player;

import com.betfair.poker.hand.Hand;

/**
 * A single poker player.
 */
public class Player {
    private final String name;
    private Status status;
    private Hand hand;
    private int cash;
    private int bet;
    private boolean isAllIn = false;
    private int betIncrement;
    private int raises;

    public Player(String name, int cash) {
        this.name = name;
        this.cash = cash;
        this.hand = new Hand();
        this.status = Status.CONTINUE;
        resetHand();
    }

    public void resetHand() {
        resetBet();
        isAllIn = false;
    }

    public void resetBet() {
        bet = 0;
        status = Status.CONTINUE;
        betIncrement = 0;
        raises = 0;
    }

    public void postSmallBlind(int blind) {
        status = Status.SMALL_BLIND;
        cash -= blind;
        bet += blind;
    }

    public void postBigBlind(int blind) {
        status = Status.BIG_BLIND;
        cash -= blind;
        bet += blind;
    }

    public Status act(Status status, int minBet, int currentBet) {
        switch (status) {
        case CHECK:
            break;
        case CALL:
            betIncrement = currentBet - bet;
            if (betIncrement > cash) {
                betIncrement = cash;
            }
            cash -= betIncrement;
            bet += betIncrement;
            isAllIn = (cash == 0);
            break;
        case BET:
            betIncrement = minBet;
            if (betIncrement > cash) {
                betIncrement = cash;
            }
            cash -= betIncrement;
            bet += betIncrement;
            raises++;
            isAllIn = (cash == 0);
            break;
        case RAISE:
            currentBet += minBet;
            betIncrement = currentBet - bet;
            if (betIncrement > cash) {
                betIncrement = cash;
            }
            cash -= betIncrement;
            bet += betIncrement;
            raises++;
            isAllIn = (cash == 0);
            break;
        case FOLD:
            // hand.removeAllCards();
            break;
        }
        return status;
    }

    public void win(int pot) {
        cash += pot;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public Hand getHand() {
        return hand;
    }

    public void setHand(Hand hand) {
        this.hand = hand;
    }

    public int getBet() {
        return bet;
    }

    public void setBet(int bet) {
        this.bet = bet;
    }

    public String getName() {
        return name;
    }

    public int getCash() {
        return cash;
    }

    public boolean isAllIn() {
        return isAllIn;
    }

    public void setAllIn(boolean isAllIn) {
        this.isAllIn = isAllIn;
    }

    @Override
    public String toString() {
        return name;
    }

}