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
    private final String header;
    private String content_plaintext;
    private String content_markup;
    private List<String> categories;

    public Example(long id, String title, long pageId, String url, String introduction, String header, String content_plaintext, String content_markup) {
        this.id = id;
        this.title = title;
        this.pageId = pageId;
        this.url = url;
        this.introduction = introduction;
        this.header = header;
        this.content_plaintext = content_plaintext;
        this.content_markup = content_markup;
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
                    .field("header", header)
                    .field("content", content_plaintext)
                    .field("markup", content_markup)
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
                ", introduction='" + introduction + '\'' +
                ", header='" + header + '\'' +
                ", content_plaintext='" + content_plaintext + '\'' +
                ", content_markup='" + content_markup + '\'' +
                ", categories=" + categories +
                '}';
    }
}
