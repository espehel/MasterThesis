import database.MySQLApi;
import index.ElasticIndexer;
import index.ElasticSearchIndexable;
import index.LuceneIndexer;
import models.Example;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;

import java.util.Date;
import java.util.List;

/**
 * Created by espen on 04/11/15.
 */
public class Main implements CommandLineRunner{

    public static void main(String[] args) {
        //SpringApplication.run(Main.class, args);
        try {
            new Main().run(args);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    public void run(String... strings) throws Exception {
        //get from database
        System.out.println(new Date() + ": Retreiving from database");
        List<ElasticSearchIndexable> examples = MySQLApi.getExamples();
        System.out.println(new Date() + ": Fetched " + examples.size() + " examples");
        MySQLApi.close();

        //index
        ElasticIndexer elasticIndexer = new ElasticIndexer();
        System.out.println(new Date() + ": indexing pages");
        elasticIndexer.init();
        System.out.println(new Date() + ": initiated");
        elasticIndexer.index(examples);
        System.out.println(new Date() + ": Pages indexed");
        elasticIndexer.shutdown();

    }
}
