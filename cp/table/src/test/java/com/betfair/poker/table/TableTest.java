package com.betfair.poker.table;

import org.testng.Assert;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;

public class TableTest {
    @Test
    public void defaulConstructorTest() throws Exception {
        Table table = new Table();
        Assert.assertNotNull(table);
        //Assert.assertEquals("Heart", card.getSuit());
    }
}
