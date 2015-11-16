package database;

import com.mysql.jdbc.authentication.MysqlClearPasswordPlugin;
import models.Example;
import models.Page;

import java.security.PublicKey;
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

    public static List<Example> getExamples() {

        List<Example> examples = new ArrayList<>();
        try {
            Statement statement = DBConnection.createStatement();
            ResultSet rs = statement.executeQuery("SELECT * FROM `examples`");

            while (rs.next()) {
                Example example = new Example(rs.getLong("id"),
                        rs.getString("title"),
                        rs.getLong("page_id"),
                        rs.getString("url"),
                        rs.getString("introduction"),
                        rs.getString("content_plaintext"));
                example.setCategories(getCategories(example.getPage_id()));
                examples.add(example);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }

        return examples;
    }

    public static List<String> getCategories(long pageId) {
        List<String> categories = new ArrayList<>();

        try {
            Statement statement = DBConnection.createStatement();
            ResultSet rs = statement.executeQuery("SELECT `name` FROM `page_id_categories` WHERE `page_id` = " + pageId);

            while (rs.next()) {
                categories.add(rs.getString("name"));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return categories;
    }

    public static void close() {
        DBConnection.close();
    }
}
