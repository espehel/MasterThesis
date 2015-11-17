package models;

import index.ElasticSearchIndexable;
import org.elasticsearch.common.xcontent.XContentBuilder;

import java.util.List;

import static org.elasticsearch.common.xcontent.XContentFactory.jsonBuilder;

public class Example implements ElasticSearchIndexable {

    private long id;
    private String title;
    private long pageId;
    private String url;
    private String introduction;
    private String content_plaintext;
    private List<String> categories;

    public Example(long id, String title, long pageId, String url, String introduction, String content_plaintext) {
        this.id = id;
        this.title = title;
        this.pageId = pageId;
        this.url = url;
        this.introduction = introduction;
        this.content_plaintext = content_plaintext;
    }

    public long getId() {
        return id;
    }

    @Override
    public XContentBuilder toJson() {
        try {
            return jsonBuilder()
                    .startObject()
                    .field("id", id)
                    .field("title", title)
                    .field("pageId", pageId)
                    .field("content", content_plaintext)
                    .field("url", url)
                    .field("introduction", introduction)
                    .field("categories", categories)
                    .endObject();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    public long getPageId() {
        return pageId;
    }

    public void setCategories(List<String> categories) {
        this.categories = categories;
    }

    @Override
    public String toString() {
        return "Example{" +
                "id=" + id +
                ", title='" + title + '\'' +
                ", pageId=" + pageId +
                ", url='" + url + '\'' +
                ", introduction='" + introduction + '\'' + "\n" +
                ", content_plaintext='" + content_plaintext + '\'' + "\n" +
                ", categories=" + categories.toString() +
                '}';
    }
}
