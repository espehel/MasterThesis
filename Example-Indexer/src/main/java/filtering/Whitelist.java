package filtering;


import java.util.ArrayList;
import java.util.List;

/**
 * Created by espen on 08/03/16.
 */
public class Whitelist {
    private List<List<String>> whitelistCollection = new ArrayList<>();

    public void add(List<String> whitelist) {
        whitelistCollection.add(whitelist);
    }
    public boolean contains(String word) {
        for (List<String> list: whitelistCollection) {
            if(list.contains(word)) {
                return true;
            }
        }
        return false;
    }

    @Override
    public String toString() {
        return "Whitelist{" +
                "whitelistCollection=" + whitelistCollection +
                '}';
    }
}
