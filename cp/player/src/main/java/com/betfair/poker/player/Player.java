package com.betfair.poker.player;

import com.betfair.poker.hand.Hand;

/**
 * A single poker player.
 */
public class Player {
    private static final int DEFAULT_CASH = 10000;
    private static int sequence = 1;
    private String name;
    private Status status;
    private Action action;
    private Hand hand;
    private int cash = DEFAULT_CASH;
    private int bet;
    private boolean isAllIn = false;
    private int betIncrement;
    private int raises;
    private int allInPot;
    private int id;
    private String avatar;

    public Player(String name) {
        this.name = name;
        this.id = sequence++;
        this.hand = new Hand();
        this.status = Status.CONTINUE;
        this.action = Action.CONTINUE;
        reset();
    }

    public void reset() {
        resetBet();
        this.hand = new Hand();
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

    public Action act(Action action, int minBet, int currentBet) {
        switch (action) {
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
            hand.setHoleCards(null);
            hand.setCommunityCards(null);
            break;
        }
        return action;
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

    public Action getAction() {
        return action;
    }

    public void setAction(Action action) {
        this.action = action;
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

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getAvatar() {
        return avatar;
    }

    public void setAvatar(String avatar) {
        this.avatar = avatar;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getCash() {
        return cash;
    }

    public void setCash(int cash) {
        this.cash = cash;
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

    public int getRaises() {
        return raises;
    }

    public void setAllInPot(int allInPot) {
        this.allInPot = allInPot;
    }

    public int getAllInPot() {
        return allInPot;
    }

}