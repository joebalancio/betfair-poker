package com.betfair.poker.table;

import java.util.ArrayList;
import java.util.List;

import com.betfair.poker.game.Game;
import com.betfair.poker.player.Player;

/**
 * A single poker table.
 */
public class Table {
    private static final int DEFAULT_NUMBER_OF_SEATS = 4;
    private static final int DEFAULT_BIG_BLIND = 50;
    private int dealer = 0;
    private int numberOfSeats = DEFAULT_NUMBER_OF_SEATS;
    private final List<Seat> seats;
    private int bigBlind = DEFAULT_BIG_BLIND;
    private final Game game;

    public Table() {
        this(DEFAULT_NUMBER_OF_SEATS, DEFAULT_BIG_BLIND);
    }

    public Table(final int numberOfSeats, final int bigBlind) {
        this.numberOfSeats = numberOfSeats;
        this.bigBlind = bigBlind;
        this.seats = new ArrayList<Seat>();

        for (int i = 0; i < numberOfSeats; i++) {
            Seat seat = new Seat(i);
            seats.add(seat);
        }
        
        this.game = new Game();
    }

    public void start() {
        while (true) {
            if (game.isHandCompleted()) {
                game.payPots();
                game.reset();
                setSeatDealer();
            }
            
            if (!game.isPlaying()) {
                List<Seat> activeSeats = new ArrayList<Seat>();
                
                for (Seat seat : getSeats()) {
                    if (!seat.isEmpty()) {
                        final Player player = seat.getPlayer();

                        if (player.getCash() >= bigBlind) {
                            activeSeats.add(seat);
                        }
                    }
                }

                if (activeSeats.size() > 1) {
                    game.setActiveSeats(seats);
                    game.initGame();
                }
            }
        }
    }

    public List<Seat> getSeats() {
        return new ArrayList<Seat>(seats);
    }

    public void addPlayer(final Player player, final int position) {
        final Seat seat = getSeat(position);

        if (seat != null) {
            if ((seat.getPosition() == position) && (seat.isEmpty())) {
                seat.addPlayer(player);
            }
        }
    }

    public void removePlayer(final int position) {
        final Seat seat = getSeat(position);

        if (seat != null) {
            seat.removePlayer();
        }
    }

    private Seat getSeat(final int position) {
        final Seat seat = getSeats().get(position);

        return seat;
    }

    private void setSeatDealer() {
        Seat seat = getSeat(dealer);

        if (seat.isEmpty()) {
            changeDealer();

            if (getNumberOfSeatsOccupied() > 0) {
                setSeatDealer();
            }
        } else {
            seat.setDealer(true);
        }
    }

    private void changeDealer() {
        if (dealer < (numberOfSeats - 1)) {
            dealer++;
        } else {
            dealer = 0;
        }
    }

    private int getNumberOfSeatsOccupied() {
        int num = 0;
        for (Seat seat : getSeats()) {
            if (!seat.isEmpty()) {
                num++;
            }
        }

        return num;
    }
}