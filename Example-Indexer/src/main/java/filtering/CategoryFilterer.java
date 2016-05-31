package filtering;

import index.ElasticSearchIndexable;
import models.Example;

import java.io.IOException;
import java.net.URISyntaxException;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.stream.Collectors;

/**
 * Created by espen on 08/03/16.
 */
public class CategoryFilterer extends Filterer{


    public boolean filter(Example example) {
        for(String category: example.getCategories()) {
            if(whitelist.contains(category.toLowerCase())) {
                return true;
            }
        }
        return false;
    }
}
