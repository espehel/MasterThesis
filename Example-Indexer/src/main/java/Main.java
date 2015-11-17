import database.MySQLApi;
import index.ElasticIndexer;
import index.ElasticSearchIndexable;
import index.LuceneIndexer;
import models.Example;
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
        //get from database
        System.out.println("Fetching examples");
        List<ElasticSearchIndexable> examples = MySQLApi.getExamples();
        System.out.println("Fetched " + examples.size() + " examples");
        MySQLApi.close();

        //index
        ElasticIndexer elasticIndexer = new ElasticIndexer();
        System.out.println("indexing pages");
        elasticIndexer.init();
        System.out.println("initiated");
        elasticIndexer.index(examples);
        System.out.println("Pages indexed");
        elasticIndexer.shutdown();

    }
}
