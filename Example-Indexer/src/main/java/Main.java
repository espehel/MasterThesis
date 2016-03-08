import database.MySQLApi;
import filtering.CategoryFilterer;
import index.ElasticIndexer;
import index.ElasticSearchIndexable;
import index.LuceneIndexer;
import models.Example;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.ui.ExtendedModelMap;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

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
        //load whitelist
        CategoryFilterer filterer = new CategoryFilterer();
        filterer.loadWhitelistCollection("/whitelistV4.txt", "/whitelistV2.txt");

        //get from database
        System.out.println(new Date() + ": Retreiving from database");
        List<ElasticSearchIndexable> examples = MySQLApi.getExamples();
        System.out.println(new Date() + ": Fetched " + examples.size() + " examples");
        MySQLApi.close();

        //filter examples
        int before = examples.size();
        System.out.println(new Date() + ": Filtering examples");
        examples = examples.stream()
                .map(Example.class::cast)
                .filter(filterer::filter)
                .collect(Collectors.toList());
        int after = examples.size();
        System.out.println(new Date() + ": Filtered out " + (before - after) + " examples");

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
