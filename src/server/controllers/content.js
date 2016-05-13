var db = require('../lib/mySQLConnection');

exports.getContentByAppId = function(req,res) {
    var formattedRows =[];
    var appId = req.params.appId;
    if(true){
        db.query('SELECT * FROM mmwr_express order by issue_date desc, issue_vol desc, issue_no desc',function(err,rows){
            if(err) {
                console.log(err);
                res.send(err);
            }
            else {
               if (rows.length != 0) {

               formattedRows = reformatRows(rows);
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
    var formattedRows =[];
    if(true){
        db.query('SELECT * FROM mmwr_express where issue_date = "'+ issueDate + '"',function(err,rows){
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
    var appId = req.params.appId;
    var content = req.body;
    var content_id = content.content_id;
    console.log(content);

    db.query('insert into mmwr_express set ?',[appId,content],function(err,result){
        if(err) {
            console.log(err);
            res.send(err);
        }
        else {
            res.send({'message':'content added','contentId': result.insertId});
        }
    })

}

exports.updateContent = function(req,res) {
    var content = req.body;
    var currentId = content.replaceCurrent;
    delete content.replaceCurrent;

    var content_id = content.content_id;
    // setup a transaction to make sure that all db operation completed with no error
    db.beginTransaction(function(err) {
        if (err) { throw err; }
        db.query('update ? set ? where content_id = ?;',[appId,content,content_id],function(err,updateResult){
            if (err) {
                throw err;
                return db.rollback(function() {

                });
            }
            else {
                res.send({'success':true});
            }

        });
    });

}

function reformatRows(rows){
    var newRows = [];
    for (var i = 0; i < rows.length; i ++) {
        tempObj = {};
        tempObj= rows[i];
        var keywords = tempObj.tags.split(',');
        var tags = [];
        for (var j=0; j < keywords.length; j++) {
            // build tag object here
            var onetag = {};
            onetag['tag'] = keywords[j].replace(/"/g,'');
            tags.push(onetag);
        }
        tempObj.tags = tags;
        tempObj['issue-date'] = tempObj.issue_date;
        tempObj['issue-vol'] = tempObj.issue_vol.toString();
        tempObj['issue-no'] = tempObj.issue_no.toString();
        delete tempObj.issue_date;
        delete tempObj.issue_vol;
        delete tempObj.issue_no;
        delete tempObj.date_created;
        delete tempObj.date_updated;
        delete tempObj.user_created;
        delete tempObj.content_id;
        newRows.push(tempObj);
    }
    return newRows;
}