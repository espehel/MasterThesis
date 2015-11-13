package models;

import org.apache.lucene.document.*;
import org.elasticsearch.common.xcontent.XContentBuilder;

import java.util.Date;

import static org.elasticsearch.common.xcontent.XContentFactory.jsonBuilder;

/**
 * Created by espen on 05/11/15.
 */
public class Page {

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

    public PageJsonWrapper toJson() {
        try {
            PageJsonWrapper wrapper = new PageJsonWrapper(String.valueOf(id), jsonBuilder()
                    .startObject()
                    .field("id", id)
                    .field("title", title)
                    .field("timestamp", timestamp)
                    .field("wikiId", wikiId)
                    .field("url", url)
                    .field("introduction", introduction)
                    .endObject());
            return wrapper;
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

    public void setId(long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Date getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Date timestamp) {
        this.timestamp = timestamp;
    }

    public long getWikiId() {
        return wikiId;
    }

    public void setWikiId(long wikiId) {
        this.wikiId = wikiId;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getIntroduction() {
        return introduction;
    }

    public void setIntroduction(String introduction) {
        this.introduction = introduction;
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

    public class PageJsonWrapper {
        public final String id;
        public final XContentBuilder json;

        public PageJsonWrapper(String id, XContentBuilder json) {
            this.id = id;
            this.json = json;
        }
    }
}
