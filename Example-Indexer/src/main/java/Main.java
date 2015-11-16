import database.MySQLApi;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;

/**
 * Created by espen on 04/11/15.
 */
public class Main implements CommandLineRunner{

    public static void main(String[] args) {
        SpringApplication.run(Main.class, args);
    }

    @Override
    public void run(String... strings) throws Exception {
        /*System.out.println("Fetching pages");
        List<Page> pages = MySQLApi.getPages();
        MySQLApi.close();
        System.out.println(pages);
        LuceneIndexer luceneIndexer = new LuceneIndexer();
        ElasticIndexer elasticIndexer = new ElasticIndexer();
        System.out.println("indexing pages");
        //luceneIndexer.index(pages);
        elasticIndexer.init();
        System.out.println("initiated");
        elasticIndexer.index(pages);
        System.out.println("Pages indexed");
        */

        System.out.println(MySQLApi.getExamples().get(1));
    }
}
