
var results = []

function exploreExample(id) {
    $.ajax({
        type: "POST",
        url: "examples/" + id,
        data: JSON.stringify(results),//{results: results},
        success: function (res) {
            document.write(res);
         },
         error: function (err) {
         console.log("err");
         console.log(err);
         },
    });
    /*var request = new XMLHttpRequest();
    request.open('POST', 'examples/' + id, true);
    request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    request.send(JSON.stringify(results));*/
}

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

            tableContent += '<tr>';
            tableContent += '<td><a href="' + this._source.url + '">' + this._source.title + '</a>' + '</td>';//+ ': ' + '<a href="' + this._source.url + '#' + this._source.header + '">' + this._source.header + '</a>' + '</td>';
            tableContent += '<td>'+this._score+'</td>';
            tableContent += '<td>'+ '<a href="examples/' + this._source.id + '?x=1' + '">Explore Example</a><br/>' +this._source.html+'</td>';
            //tableContent += '<td>' + '<input type="button" value="Explore example" onclick="exploreExample(' + this._source.id + ');" </input><br/>' +this._source.html+'</td>';
            tableContent += '<td>'+this._source.categories.join(', ')+'</td>';
            tableContent += '</tr>';
        });

        // Inject the whole content string into our existing HTML table
        $('#examples').find('table tbody').html(tableContent);
    });
}

// search
$('#search').on('click', getExamples);

//searcfield
$("#searchField").bind("keypress", function(event) {
    if(event.which == 13) {
        event.preventDefault();
        getExamples();
    }
});
