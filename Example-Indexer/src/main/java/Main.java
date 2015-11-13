import com.sun.org.apache.bcel.internal.generic.NEW;
import database.MySQLApi;
import index.ElasticIndexer;
import index.LuceneIndexer;
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
        LuceneIndexer luceneIndexer = new LuceneIndexer();
        ElasticIndexer elasticIndexer = new ElasticIndexer();
        System.out.println("indexing pages");
        //luceneIndexer.index(pages);
        elasticIndexer.init();
        System.out.println("initiated");
        elasticIndexer.index(pages);
        System.out.println("Pages indexed");
    }
}
