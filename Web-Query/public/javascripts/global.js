

function getExamples() {
    //console.log("click");

    // Empty content string
    var tableContent = '';
    var search = $('#searchField').val();
    //var search = document.getElementById('searchField').value;
    //console.log(search);
    // jQuery AJAX call for JSON
    $.getJSON( '/examples?search=' + search, function( data ) {

        //console.log(data);

        // For each item in our JSON, add a table row and cells to the content string
        $.each(data.examples, function(){
          //  console.log(this);
            tableContent += '<tr>';
            tableContent += '<td><a href="' + this._source.url + '">' + this._source.title+'</a></td>';
            tableContent += '<td>'+this._source.html+'</td>';
            tableContent += '<td>'+this._source.categories.join(', ')+'</td>';
            tableContent += '</tr>';
        });

        // Inject the whole content string into our existing HTML table
        $('#examples table tbody').html(tableContent);
    });
};

// search
$('#search').on('click', getExamples);

//searcfield
$("#searchField").bind("keypress", function(event) {
    if(event.which == 13) {
        event.preventDefault();
        getExamples();
    }
});