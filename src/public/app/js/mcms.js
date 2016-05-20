$(function(){
    var sampleTags = ['c++', 'java', 'php', 'coldfusion', 'javascript', 'asp', 'ruby','python', 'c', 'scala', 'groovy', 'haskell', 'perl', 'erlang', 'apl', 'cobol', 'go', 'lua'];


    $('#ArticleKeywords').tagit({
        availableTags: sampleTags
    });



});

$(function() {
    $( "#IssueDate" ).datepicker();
    $( "#IssueDate" ).datepicker("option", "dateFormat", "yy-mm-dd");
});


$(document).ready(function(){

    $("#serialize_button").hide();


    $("#parseArticle").click(function(event){
        event.preventDefault();
        $('#ArticleKeywords').tagit('removeAll');
        var article_url=$("#ArticleURL").val();
        article_url = article_url.substring(0, article_url.indexOf('?'));
        var originSource = $('input[name=whatOrigin]:checked').val()

        if (article_url.length > 0){
            var workaroundurl = 'http://whateverorigin.org/get?url=' + encodeURIComponent(article_url) + '&callback=?'
            if (originSource == 'edemo')
            {
                workaroundurl = 'http://edemo.phiresearchlab.org/whatorigin/get?url=' + encodeURIComponent(article_url) + '&callback=?'
            }
            // console.log(article_url);
            $.getJSON(workaroundurl,
                function(data){
                    if(data.contents){
                        // pageContents = data.results[0];
                        pageContents = data.contents;
                        var htmlDoc = $.parseHTML(pageContents);
                        $html = $(htmlDoc);
                        $title = $html.filter("title");
                        //alert($title.text());
                        $("#IssueTitle").val($html.filter("title").text());
                        $("#IssueDate").val($html.filter("meta[name=\"Date\"]").attr("content"));
                        $("#IssueVolume").val($html.filter("meta[name=\"Volume\"]").attr("content"));
                        $("#IssueNumber").val($html.filter("meta[name=\"Issue\"]").attr("content"));
                        if($("#IssueVolume").val()== "")
                        {
                            //article in post 2016 format
                            var dateLine = $html.find(".dateline").text()
                            var dateTxt = dateLine.split('/')[1];
                            var articleDate = new Date(dateTxt);
                            var yyyy = articleDate.getFullYear().toString();
                            var mm = (articleDate.getMonth()+1).toString(); // getMonth() is zero-based
                            var dd  = articleDate.getDate().toString();
                            var dateString = yyyy + '-' + (mm[1]?mm:"0"+mm[0]) + '-' + (dd[1]?dd:"0"+dd[0]); // padding
                            var init = dateLine.indexOf('(');
                            var fin = dateLine.indexOf(')');
                            $("#IssueVolume").val($html.filter("meta[name=\"citation_volume\"]").attr("content"));
                            $("#IssueDate").val(dateString);
                            $("#IssueNumber").val(dateLine.substr(init+1,fin-init-1));
                            $("#IssueTitle").val($html.filter("meta[name=\"citation_title\"]").attr("content"));
                        }
                        var summaryText = $html.find(".module-typeC").html();
                        var summaryTextHTML = $.parseHTML(summaryText);
                        $summaryTextHTML = $(summaryTextHTML);
                        var firstSummary = $summaryTextHTML.find('p:eq(0)').text();
                        //console.log(firstSummary + ';;;' +summaryText);
                        $("#AlreadyKnownInfo").val($summaryTextHTML.find('p:eq(0)').text());
                        $("#AddedInfo").val($summaryTextHTML.find('p:eq(1)').text());
                        $("#Implications").val($summaryTextHTML.find('p:eq(2)').text());
                        if($("#AlreadyKnownInfo").val()== "")
                        {
                            $("#AlreadyKnownInfo").val($html.find(".Summary-Box-Text:eq(0)").text());
                            $("#AddedInfo").val($html.find(".Summary-Box-Text:eq(1)").text());
                            $("#Implications").val($html.find(".Summary-Box-Text:eq(2)").text());
                            if($("#AlreadyKnownInfo").val()== "")
                            {
                                $("#AlreadyKnownInfo").val($html.find(".fb-answer:eq(0)").text());
                                $("#AddedInfo").val($html.find(".fb-answer:eq(1)").text());
                                $("#Implications").val($html.find(".fb-answer:eq(2)").text());
                                if($("#AlreadyKnownInfo").val()== "")
                                {
                                    $("#AlreadyKnownInfo").val("Summary not available.\nView Full Article for more information.");
                                    $("#AddedInfo").val("Summary not available.\nView Full Article for more information.");
                                    $("#Implications").val("Summary not available.\nView Full Article for more information.");
                                }
                            }
                        }
                        showButtonIfFilled();
                    } else {
                        var errormsg = "Error: could not load the page.";
                        //output to firebug's console
                        //use alert() for other browsers/setups
                        // console.log(errormsg);
                        alert(errormsg);
                    }
                }
            );
        }
    }   );

    function showButtonIfFilled()
    {
        if( $("#AlreadyKnownInfo").val().length >0 &&
            $("#AddedInfo").val().length >0 &&
            $("#Implications").val().length >0)
        {
            //alert("trying to show serialize button");
            $("#serialize_button").show();
        }
        else
            $("#serialize_button").hide();

    }
    $("#AlreadyKnownInfo").on('input',function(){
        showButtonIfFilled();
    });
    $("#AddedInfo").on('input',function(){
        showButtonIfFilled();
    });
    $("#Implications").on('input',function(){
        showButtonIfFilled();
    });



    $("#clearArticle").click(function(article){
        $("#ArticleURL").val("");
        $('#ArticleKeywords').tagit('removeAll');
        $("#IssueTitle").val("");
        $("#IssueDate").val("");
        $("#IssueVolume").val("");
        $("#IssueNumber").val("");
        $("#AlreadyKnownInfo").val("");
        $("#AddedInfo").val("");
        $("#Implications").val("");
    }   );



    $("#serializeButton").click(function(){
        //var JSONArticle = "poo";
        var issueNumber = $("#IssueNumber").val();
        var issue = $("#IssueDate").val() + " / Vol. " + $("#IssueVolume").val()
            + " / No. "+  issueNumber;
        if (issueNumber == null || issueNumber == "" )
        {
            alert("There is no issue number.  Please provide one even if this is an Early Release.");
        }

        var tagstring = $("#ArticleKeywords").val();
        var tagarray = [];
        if (tagstring.length >0)
        {
            tagarray = tagstring.split(",");
            var tagbuilder = [];
            var counter = 0;
            while (counter < tagarray.length)
            {
                var capTagString = tagarray[counter].toString().substring(0,1).toUpperCase() + tagarray[counter].toString().substring(1);
                var tag = {"tag":capTagString};
                tagbuilder[counter] = tag;
                counter++;
            }
        }
        var tags = JSON.stringify(tagbuilder)
        var JSONArticle = {
            "issue-date":$("#IssueDate").val(),
            "issue-vol":$("#IssueVolume").val(),
            "issue-no":$("#IssueNumber").val(),
            "title":$("#IssueTitle").val(),
            "already_known":$("#AlreadyKnownInfo").val(),
            "added_by_report":$("#AddedInfo").val(),
            "implications":$("#Implications").val(),
            "tags":tagbuilder,
            "url":$("#ArticleURL").val(),
            "content-ver":"1",
            "schema-ver":"1",
            "command":"add",};
        //var JSONArticle = {"issue":issue,
        //                  "articles":[article],
        //                  "ver":1};
        $("#JSONBlurb").val(JSON.stringify(JSONArticle));
        $("#JSONBlurb").select();
        $("#serialize_message").show();

        //  };
    });

    $("#enableArticleEdit").click(function(){
        //var JSONArticle = "poo";
        $("#IssueDate").attr('contenteditable','true');
        $("#IssueVolume").attr('contenteditable','true');
        $("#IssueNumber").attr('contenteditable','true');
        $("#IssueTitle").attr('contenteditable','true');
        $("#AlreadyKnownInfo").attr('contenteditable','true');
        $("#AddedInfo").attr('contenteditable','true');
        $("#Implications").attr('contenteditable','true');

    });

});
