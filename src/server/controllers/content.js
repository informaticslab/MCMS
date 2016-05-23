var db = require('../lib/mySQLConnection');

exports.getContentByAppId = function(req,res) {
    var formattedRows =[];
    var appId = req.params.appId;
    var internal = req.url.indexOf('internal');
    if(true){
        db.query('SELECT * FROM mmwr_express order by issue_date desc, issue_vol desc, issue_no desc',function(err,rows){
            if(err) {
                console.log(err);
                res.send(err);
            }
            else {
               if (rows.length != 0) {
                    formattedRows = reformatRows(rows,internal);
                    res.send(formattedRows);
                }
            }
        });
    }
    else
    {
        console.log("DB connection failed");
    }
//	connection.end();
}
exports.getContentByAppIdDate = function(req,res) {

    var appId = req.params.appId;
    var issueDate = req.params.issueDate;
    var reformat = req.params.reformat;
    var formattedRows =[];
    if(true){
        db.query('SELECT * FROM mmwr_express where issue_date = "'+ issueDate + '"',function(err,rows){
            if(err) {
                res.send(err);
            }
            else {
                if (rows.length > 0) {
                    if (!reformat) {
                        formattedRows = reformatRows(rows)
                    }
                    else {
                        formattedRows = rows;
                    }
                    res.send(formattedRows);
                }
                else {
                    res.send({'message':'no records found'});
                }
            }
        });
    }
    else
    {
        console.log("DB connection failed");
    }
//	connection.end();
}
exports.getContentByAppIdLastUpdate = function(req,res) {

    var appId = req.params.appId;
    var lastUpdate = req.params.updatedDate;
    var formattedRows =[];
    if(true){
        db.query('SELECT * FROM mmwr_express where date_updated > "'+ lastUpdate + '"',function(err,rows){
            if(err) {
                res.send(err);
            }
            else {
                if (rows.length > 0) {
                    formattedRows = reformatRows(rows)
                    res.send(formattedRows);
                }
                else {
                    res.send({'message':'no records found'});
                }
            }
        });
    }
    else
    {
        console.log("DB connection failed");
    }
//	connection.end();
}
exports.saveContent = function(req,res) {
    console.log('save content called');
    var appId = req.params.appId;
    var content = req.body;
    var content_id = content.content_id;
    //console.log(content);

    content.content_ver = '1';
    content.schema_ver = '1';
    content.command = 'add';
    content.tags = serialize(content.tags);
    //db.query('insert into mmwr_express set ? on duplicate key update ?',[content,content],function(err,result){
    db.query('insert into mmwr_express set ? ',[content],function(err,result){
        if(err) {
            console.log(err);
            res.send(err);
        }
        else {
            res.send({'success':'content added','contentId': result.insertId});
        }
    })

}
exports.getContentByAppIdArticleId = function(req,res) {
    var formattedRows =[];
    var appId = req.params.appId;
    var article_id = req.params.articleId;
    var internal = req.url.indexOf('internal');
    console.log(appId);
    if(true){
        db.query('SELECT * FROM '+ appId + ' where content_id = ? order by issue_date desc, issue_vol desc, issue_no desc',[article_id],function(err,rows){
            if(err) {
                console.log(err);
                res.send(err);
            }
            else {
                if (rows.length != 0) {
                        formattedRows = reformatRows(rows,internal);
                        res.send(formattedRows);

                }

            }
        });
    }
    else
    {
        console.log("DB connection failed");
    }
//	connection.end();
}
exports.updateContent = function(req,res) {
    console.log('update content called');
    var appId = req.params.appId;
    var content = req.body;
    var content_id = content.content_id;
    content.tags = serialize(content.tags);
    // setup a transaction to make sure that all db operation completed with no error
    db.query('update ' + appId + ' set ? where content_id = ?;',[content,content_id],function(err,updateResult){
            if (err) {
                console.log(err);
                res.send(err);
            }
            else {
                res.send({'success':'content update'});
            }
    });
}

function reformatRows(rows,internal){
    var newRows = [];
    var replaceList = {'issue_date':'issue-date','issue_vol': 'issue-vol','issue_no' : 'issue-no'};

    for (var i = 0; i < rows.length; i ++) {
        tempObj = {};
        tempObj = rows[i];
        tempObj.tags = deSerialize(rows[i].tags,'tag');
        if (internal == -1) {
            tempObj = JSON.stringify(rows[i]);
            replaceTerms = Object.keys(replaceList);
            for (var j = 0; j < replaceTerms.length; j++) {
                tempObj = tempObj.replace(replaceTerms[j], replaceList[replaceTerms[j]]);
            }
            tempObj = JSON.parse(tempObj);

            //tempObj['issue-date'] = tempObj.issue_date;
            //tempObj['issue-vol'] = tempObj.issue_vol.toString();
            //tempObj['issue-no'] = tempObj.issue_no.toString();
            //delete tempObj.issue_date;
            //delete tempObj.issue_vol;
            //delete tempObj.issue_no;
            delete tempObj.date_created;
            delete tempObj.user_created;
        }
        newRows.push(tempObj);
    }
    return newRows;
}

function serialize(myArray){
    var keywords = [];
    for (var i = 0; i < myArray.length; i++) {
        if (myArray[i].hasOwnProperty('tag')) {
            var value = myArray[i]['tag'];
            keywords.push(value);
        }

    }
    serializedTokens = '"' +keywords.join('","') + '"';
    console.log(serializedTokens);
    return serializedTokens;
}
function deSerialize(myArray, tagText){
    var mytags = [];
    var tagsArray =   myArray;
    var keywords = tagsArray.split(',');
    for (var j=0; j < keywords.length; j++) {
        // build tag object here
        var onetag = {};
        onetag[tagText] = keywords[j].replace(/"/g,'');
        mytags.push(onetag);
    }
    return mytags;
}