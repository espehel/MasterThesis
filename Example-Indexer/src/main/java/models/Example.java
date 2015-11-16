package models;

import java.util.List;

/**
 * Created by espen on 16/11/15.
 */
public class Example {

    private long id;
    private String title;
    private long page_id;
    private String url;
    private String introduction;
    private String content_plaintext;
    private List<String> categories;

    public Example(long id, String title, long page_id, String url, String introduction, String content_plaintext) {
        this.id = id;
        this.title = title;
        this.page_id = page_id;
        this.url = url;
        this.introduction = introduction;
        this.content_plaintext = content_plaintext;
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

    public long getPage_id() {
        return page_id;
    }

    public void setPage_id(long page_id) {
        this.page_id = page_id;
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

    public String getContent_plaintext() {
        return content_plaintext;
    }

    public void setContent_plaintext(String content_plaintext) {
        this.content_plaintext = content_plaintext;
    }


    public void setCategories(List<String> categories) {
        this.categories = categories;
    }

    public List<String> getCategories() {
        return categories;
    }

    @Override
    public String toString() {
        return "Example{" +
                "id=" + id +
                ", title='" + title + '\'' +
                ", page_id=" + page_id +
                ", url='" + url + '\'' +
                ", introduction='" + introduction + '\'' + "\n" +
                ", content_plaintext='" + content_plaintext + '\'' + "\n" +
                ", categories=" + categories.toString() +
                '}';
    }
}
