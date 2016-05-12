var db = require('../lib/mySQLConnection');

exports.getContentByAppId = function(req,res) {

    var appId = req.params.appId;

    if(true){
        db.query('SELECT a.* FROM ? a order by issue-date desc',[appId],function(err,rows){
            if(err) {
                res.send(err);
            }
            else {
               if (rows.length != 0) {
               objects = [];
                   for (var i = 0; i < rows.length(); i ++) {
                       tempObj = {};
                       tempObj= rows[i];
                       objects.push(tempObj);
                   }
                   res.send(objects);
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

    if(true){
        db.query('SELECT a.* FROM ? a where issue-date = ?',[appId,issueDate],function(err,rows){
            if(err) {
                res.send(err);
            }
            else {

                res.send(rows);
            }
        });
    }
    else
    {
        console.log("DB connection failed");
    }
//	connection.end();
}
exports.createContent = function(req,res) {
    var content = req.body;
    var content_id = content.content_id;
    var currentId= content.replaceCurrent;
    delete content.replaceCurrent;
    db.query('insert into ? set ?',[appId,content],function(err,result){
        if(err) {
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
        db.query('update ? set ? where content_id = ?',[appId,content,content_id],function(err,updateResult){
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