package com.betfair.poker.pot;

import java.util.ArrayList;
import java.util.List;
import com.betfair.poker.player.Player;

/**
 * A single poker pot.
 */
public class Pot {

	private int bet = 0;
	private List<Player> players;
	
	public Pot() {
    	players = new ArrayList<Player>();
    }
    public Pot(Player player, int bet) {
    	this.bet = bet;
    	players = new ArrayList<Player>();
    	players.add(player);
    }
    
    public void addPlayer(Player player, int bet){
    	this.bet += bet;
    	players.add(player);
    }
    
    public  Pot split(List<Player> players, int  partialBet) {
        Pot pot = new  Pot();
        pot.bet = partialBet;
        pot.players = players;
        return  pot;
    }
}