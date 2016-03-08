package index;

import org.elasticsearch.action.index.IndexResponse;
import org.elasticsearch.client.Client;
import org.elasticsearch.client.transport.TransportClient;
import org.elasticsearch.common.settings.Settings;
import org.elasticsearch.common.transport.InetSocketTransportAddress;
import org.elasticsearch.common.xcontent.XContentBuilder;
import org.elasticsearch.node.Node;

import java.net.InetAddress;
import java.net.UnknownHostException;
import java.util.List;


public class ElasticIndexer {

    Node node;
    Client client;

    public void init(){

        /*node = nodeBuilder()
                .clusterName("wiki_cluster")
                .client(true)
                .settings(Settings.settingsBuilder().put("http.enabled", false))
                .node();
        client = node.client();*/

        try {
            Settings settings = Settings.settingsBuilder()
                    .put("cluster.name", "wiki_cluster").build();
            client = TransportClient.builder().settings(settings).build()
                    .addTransportAddress(new InetSocketTransportAddress(InetAddress.getByName("127.0.0.1"), 9300));
        } catch (UnknownHostException e) {
            e.printStackTrace();
        }

    }

    public void index(List<ElasticSearchIndexable> elements) {

        /*elements.stream()
                .map(page1 -> page1.toJson())
                .map(page -> client.prepareIndex("wikipedia","elements", page.id).setSource(page.json))
                .map(IndexRequestBuilder::get);*/


        for (ElasticSearchIndexable element : elements) {
            XContentBuilder json = element.toJson();
            IndexResponse response = client.prepareIndex("wikipedia", "example", String.valueOf(element.getId())).setSource(json).get();
        }

    }



    public void shutdown() {
        if (node != null) {
            node.close();
        }
        if (client != null) {
            client.close();
        }
    }
}
