package models;

import index.ElasticSearchIndexable;
import org.apache.lucene.document.*;
import org.elasticsearch.common.xcontent.XContentBuilder;

import java.util.Date;

import static org.elasticsearch.common.xcontent.XContentFactory.jsonBuilder;

/**
 * Created by espen on 05/11/15.
 */
public class Page implements ElasticSearchIndexable{

    private long id;
    private String title;
    private Date timestamp;
    private long wikiId;
    private String url;
    private String introduction;

    public Page(long id, String title, Date timestamp, long wikiId, String url, String introduction) {
        this.id = id;
        this.title = title;
        this.timestamp = timestamp;
        this.wikiId = wikiId;
        this.url = url;
        this.introduction = introduction;
    }

    public XContentBuilder toJson() {
        try {
            return jsonBuilder()
                    .startObject()
                    .field("id", id)
                    .field("title", title)
                    .field("timestamp", timestamp)
                    .field("wikiId", wikiId)
                    .field("url", url)
                    .field("introduction", introduction)
                    .endObject();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    public Document toDocument() {

        Document document = new Document();
        document.add(new LongField("id",id, Field.Store.YES));
        document.add(new StringField("title", title, Field.Store.YES));
        document.add(new StringField("timestamp", DateTools.dateToString(timestamp, DateTools.Resolution.SECOND), Field.Store.YES));
        document.add(new LongField("wikiId",wikiId, Field.Store.YES));
        document.add(new StringField("url", url, Field.Store.YES));
        document.add(new TextField("introduction",introduction, Field.Store.YES));

        return document;
    }

    public long getId() {
        return id;
    }

    @Override
    public String toString() {
        return "Page{" +
                "id=" + id +
                ", title='" + title + '\'' +
                ", timestamp=" + timestamp +
                ", wikiId=" + wikiId +
                ", url='" + url + '\'' +
                ", introduction='" + introduction + '\'' +
                '}';
    }
}
