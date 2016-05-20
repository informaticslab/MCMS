//references to controllers go here
var index = require('../controllers/index');
//var users = require('../controllers/users');
//var admin = require('../controllers/admin');
//var media = require('../controllers/media');
var content = require('../controllers/content');
//var auth = require('./auth');
//var mongoose = require('mongoose'),
//    User = mongoose.model('User');



module.exports = function(app) {

  //app.get('/api/users', users.getUsers);
  //app.post('/api/users', users.createUser);
  //app.put('/api/users', users.updateRole);
  //app.post('/api/users/remove', users.removeUser);

  //app.post('/api/fileUpload', media.uploadFile);
  //app.get('/api/fileUpload/:id', media.getFile);
  //app.post('/api/fileUpload/delete', media.deleteFile);
  //app.post('/api/fileUpload/update', media.updateFileChecked);
  app.get('/api/content/:appId', content.getContentByAppId);
  app.get('/api/content/internal/:appId', content.getContentByAppId);
  app.get('/api/content/:appId/:issueDate', content.getContentByAppIdDate);
  app.get('/api/content/:appId/lastUpdate/:updatedDate', content.getContentByAppIdLastUpdate);
  app.get('/api/content/internal/:appId/:articleId',content.getContentByAppIdArticleId);
  app.post('/api/content/save/:appId', content.saveContent);


  app.get('/partials/*', function(req, res) {
    res.render('../../public/app/views/' + req.params);
  });

  //app.post('/login', auth.authenticate);
  //
  //app.post('/logout', function(req, res) {
  //  req.logout();
  //  res.end();
  //});

  app.all('/api/*', function(req, res) {
    res.send(404);
  });

  //catchall for everything not defined above
  app.get('/*', index.index);
}