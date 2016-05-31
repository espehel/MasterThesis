package filtering;

import models.Example;

/**
 * Created by espen on 28/05/16.
 */
public class ExampleFilterer extends Filterer {
    @Override
    public boolean filter(Example example) {
        return whitelist.contains(String.valueOf(example.getId()));
    }
}
