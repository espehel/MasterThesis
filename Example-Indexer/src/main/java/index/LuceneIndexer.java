package index;

import models.Page;
import org.apache.lucene.analysis.Analyzer;
import org.apache.lucene.analysis.standard.StandardAnalyzer;
import org.apache.lucene.document.*;
import org.apache.lucene.index.IndexWriter;
import org.apache.lucene.index.IndexWriterConfig;
import org.apache.lucene.index.Term;
import org.apache.lucene.store.Directory;
import org.apache.lucene.store.FSDirectory;

import java.io.IOException;
import java.nio.file.*;
import java.util.Date;
import java.util.List;

public class LuceneIndexer {

    public LuceneIndexer() {

    }

    /** Index all text files under a directory. */
    public void index(List<Page> pages) {

        String indexPath = "index";

        Date start = new Date();
        try {
            System.out.println("Indexing to directory '" + indexPath + "'...");

            Directory dir = FSDirectory.open(Paths.get(indexPath));
            Analyzer analyzer = new StandardAnalyzer();
            IndexWriterConfig iwc = new IndexWriterConfig(analyzer);

            boolean create = true;
            if (create) {
                // Create a new index in the directory, removing any
                // previously indexed documents:
                iwc.setOpenMode(IndexWriterConfig.OpenMode.CREATE);
            } else {
                // Add new documents to an existing index:
                iwc.setOpenMode(IndexWriterConfig.OpenMode.CREATE_OR_APPEND);
            }

            // Optional: for better indexing performance, if you
            // are indexing many documents, increase the RAM
            // buffer.  But if you do this, increase the max heap
            // size to the JVM (eg add -Xmx512m or -Xmx1g):
            //
            // iwc.setRAMBufferSizeMB(256.0);

            IndexWriter writer = new IndexWriter(dir, iwc);
            indexDocs(writer, pages);

            // NOTE: if you want to maximize search performance,
            // you can optionally call forceMerge here.  This can be
            // a terribly costly operation, so generally it's only
            // worth it when your index is relatively static (ie
            // you're done adding documents to it):
            //
            // writer.forceMerge(1);

            writer.close();

            Date end = new Date();
            System.out.println(end.getTime() - start.getTime() + " total milliseconds");

        } catch (IOException e) {
            System.out.println(" caught a " + e.getClass() +
                    "\n with message: " + e.getMessage());
        }
    }

    /**
     * Indexes the given file using the given writer, or if a directory is given,
     * recurses over files and directories found under the given directory.
     *
     * NOTE: This method indexes one document per input file.  This is slow.  For good
     * throughput, put multiple documents into your input file(s).  An example of this is
     * in the benchmark module, which can create "line doc" files, one document per line,
     * using the
     * <a href="../../../../../contrib-benchmark/org/apache/lucene/benchmark/byTask/tasks/WriteLineDocTask.html"
     * >WriteLineDocTask</a>.
     *
     * @param writer Writer to the index where the given file/dir info will be stored
     * @param pages The file to index, or the directory to recurse into to find files to index
     * @throws IOException If there is a low-level I/O error
     */
    static void indexDocs(final IndexWriter writer, List<Page> pages) throws IOException {
        pages.stream()
                .forEach(page -> indexDoc(writer, page, System.currentTimeMillis()));
    }

    /** Indexes a single document */
    static void indexDoc(IndexWriter writer, Page page, long lastModified) {
        // make a new, empty document
        Document doc = page.toDocument();

        // Add the last modified date of the file a field named "modified".
        // Use a LongField that is indexed (i.e. efficiently filterable with
        // NumericRangeFilter).  This indexes to milli-second resolution, which
        // is often too fine.  You could instead create a number based on
        // year/month/day/hour/minutes/seconds, down the resolution you require.
        // For example the long value 2011021714 would mean
        // February 17, 2011, 2-3 PM.
        doc.add(new LongField("modified", lastModified, Field.Store.NO));
        try {

            if (writer.getConfig().getOpenMode() == IndexWriterConfig.OpenMode.CREATE) {
                // New index, so we just add the document (no old document can be there):
                System.out.println("adding " + page);
                writer.addDocument(doc);
            } else {
                // Existing index (an old copy of this document may have been indexed) so
                // we use updateDocument instead to replace the old one matching the exact
                // path, if present:
                System.out.println("updating " + page);
                writer.updateDocument(new Term("id", String.valueOf(page.getId())), doc);

            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}




