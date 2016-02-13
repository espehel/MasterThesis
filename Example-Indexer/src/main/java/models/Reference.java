package models;

/**
 * Created by espen on 11/02/16.
 */
public class Reference {

    final String pageName;
    final long sectionId;

    public Reference(String pageName, long sectionId) {
        this.pageName = pageName;
        this.sectionId = sectionId;
    }
}
