import database.MySQLApi;
import indexer.IndexData;
import models.Page;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;

import java.util.List;

/**
 * Created by espen on 04/11/15.
 */
public class Main implements CommandLineRunner{

    public static void main(String[] args) {
        SpringApplication.run(Main.class, args);
    }

    @Override
    public void run(String... strings) throws Exception {
        System.out.println("Fetching pages");
        List<Page> pages = MySQLApi.getPages();
        System.out.println(pages);
        IndexData indexer = new IndexData();
        System.out.println("indexing pages");
        indexer.startIndexing(pages);
        System.out.println("Pages indexed");
    }
}
