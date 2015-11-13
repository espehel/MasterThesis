package index;

import models.Page;
import org.elasticsearch.action.index.IndexRequestBuilder;
import org.elasticsearch.action.index.IndexResponse;
import org.elasticsearch.client.Client;
import org.elasticsearch.client.transport.TransportClient;
import org.elasticsearch.common.settings.Settings;
import org.elasticsearch.common.transport.InetSocketTransportAddress;
import org.elasticsearch.node.Node;

import java.io.IOException;
import java.net.InetAddress;
import java.net.UnknownHostException;
import java.util.Date;
import java.util.List;

import static org.elasticsearch.common.xcontent.XContentFactory.jsonBuilder;

/**
 * Created by espen on 11/11/15.
 */
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

    public void index(List<Page> pages) {

        /*pages.stream()
                .map(page1 -> page1.toJson())
                .map(page -> client.prepareIndex("wikipedia","pages", page.id).setSource(page.json))
                .map(IndexRequestBuilder::get);*/


        for (Page page : pages) {
            Page.PageJsonWrapper wrapper = page.toJson();
            IndexResponse respone = client.prepareIndex("wikipedia", "pages", wrapper.id).setSource(wrapper.json).get();
            System.out.println(respone);
        }

    }



    public void shutdown() {
        node.close();
    }
}
