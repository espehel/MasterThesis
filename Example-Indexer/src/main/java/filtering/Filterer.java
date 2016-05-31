package filtering;

import models.Example;

import java.io.IOException;
import java.net.URISyntaxException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.stream.Collectors;

/**
 * Created by espen on 28/05/16.
 */
public abstract class Filterer {

    protected Whitelist whitelist = new Whitelist();


    public void loadWhitelistCollection(String... whitelistFileCollection){

        //System.out.println(getClass().getResource("/whitelistv4.txt"));

        for (String fileName: whitelistFileCollection) {
            try {
                whitelist.add(Files.lines(Paths.get(getClass()
                        .getResource(fileName)
                        .toURI()))
                        .map(String::toLowerCase)
                        .collect(Collectors.toList()));
            } catch (IOException e) {
                e.printStackTrace();
            } catch (URISyntaxException e) {
                e.printStackTrace();
            }
        }
    }

    @Override
    public String toString() {
        return "CategoryFilterer{" +
                "whitelist=" + whitelist +
                '}';
    }

    public abstract boolean filter(Example example);
}
