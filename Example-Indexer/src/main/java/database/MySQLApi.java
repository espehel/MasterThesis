package database;

import index.ElasticSearchIndexable;
import models.Example;
import models.Page;
import models.Reference;
import org.springframework.aop.framework.ReflectiveMethodInvocation;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.*;


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

    public static List<ElasticSearchIndexable> getExamples() {

        System.out.println(new Date() + ": Fetching refIn");
       // Map<String, Integer> refIn = getRefIn();
        System.out.println(new Date() + ": Fetching refOut");
        //Map<Long, Integer> refOut = getRefOut();

        List<ElasticSearchIndexable> examples = new ArrayList<>();
        try {
            Statement statement = DBConnection.createStatement();
            System.out.println(new Date() + ": Fetching examples");
            ResultSet rs = statement.executeQuery("SELECT * FROM `examples`");

            System.out.println("Creating exmaple objects");
            while (rs.next()) {
                Example example = new Example(rs.getLong("id"),
                        rs.getString("title"),
                        rs.getLong("page_id"),
                        rs.getString("url"),
                        rs.getString("introduction"),
                        rs.getString("header"),
                        rs.getString("content_plaintext"),
                        rs.getString("content_markup"));
                example.setCategories(getCategories(example.getPageId()));
                //example.setRefIn(refIn.get(example.title.toLowerCase()));
                //example.setRefOut(refOut.get(example.id));
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

    public static List<Reference> getReferences() {
        List<Reference> references = new ArrayList<>();

        try {
            Statement statement = DBConnection.createStatement();
            ResultSet rs = statement.executeQuery("SELECT `page_name`, `section_id` FROM `page_references`");

            while (rs.next()) {
                references.add(new Reference(
                        rs.getString("page_name"),
                        rs.getLong("section_id")));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return references;
    }

    public static Map<String, Integer> getRefIn() {
        Map<String, Integer> refIn = new HashMap<>();

        try {
            Statement statement = DBConnection.createStatement();
            ResultSet rs = statement.executeQuery("SELECT `page_name`, COUNT(`page_name`) AS ref_in FROM `page_references` GROUP BY `page_name`;");

            while (rs.next()) {
                refIn.put(
                        rs.getString("page_name").toLowerCase(),
                        rs.getInt("ref_in"));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return refIn;
    }
    public static Map<Long, Integer> getRefOut() {
        Map<Long, Integer> refOut = new HashMap<>();

        try {
            Statement statement = DBConnection.createStatement();
            ResultSet rs = statement.executeQuery("SELECT `r`.`section_id` AS `id`, COUNT(`r`.`section_id`) AS `ref_out` " +
                    "FROM `page_references` `r` " +
                    "WHERE `r`.`page_name` IN (SELECT `p`.`title` FROM `pages` `p`)" +
                    "GROUP BY `r`.`section_id`;");
            while (rs.next()) {
                refOut.put(
                        rs.getLong("id"),
                        rs.getInt("ref_out"));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return refOut;
    }

    public static void close() {
        DBConnection.close();
    }
}
