package index;

import org.elasticsearch.common.xcontent.XContentBuilder;

public interface ElasticSearchIndexable {
    long getId();
    XContentBuilder toJson();
}
