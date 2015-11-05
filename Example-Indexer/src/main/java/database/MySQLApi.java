package database;

import models.Page;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * Created by espen on 04/11/15.
 */
public class MySQLApi {

    public static List<Page> getPages() {
        List<Page> pages = new ArrayList<>();
        try {
            Statement statement = DBConnection.createStatement();
            ResultSet rs = statement.executeQuery("SELECT * FROM `pages`");

            while (rs.next()) {
                Page page = new Page(rs.getLong("id"),
                        rs.getString("title"),
                        new Date(rs.getTimestamp("timestamp").getTime()),
                        rs.getLong("wiki_id"),
                        rs.getString("url"),
                        rs.getString("introduction"));
                pages.add(page);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return pages;
    }
}
