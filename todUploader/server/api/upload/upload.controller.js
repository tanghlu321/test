'use strict';
//require('shelljs/global');

var path = require('path');
var _ = require('lodash');

var exec = require("child_process").exec;

// Get list of uploads
exports.index = function(req, res) {
  res.json([]);
};

var printLogs = function(message, err, stdout, stderr){
  console.log(message + err);
  console.log('stdout: ' + stdout);
  console.log('stderr: ' + stderr);
}

var checkin = function(callback){
  exec('git add .', function (err, stdout, stderr){
    printLogs('git add error:', err, stdout, stderr);

    exec('git commit -m "Updating TOD ymls cr=sparta"', function (err, stdout, stderr){
      printLogs('git commit error:', err, stdout, stderr);
      
      exec('git push origin master', function (err, stdout, stderr){
        printLogs('git push error:', err, stdout, stderr);
        if (err !== null){
          return callback(err);
        } 
      });
    });
    return callback(null);
  });
};

exports.create = function (req, res, next) {
  var data = _.pick(req.body, 'type')
    , uploadPath = path.normalize('./uploads')
    , file = req.files.file;
 
  console.log(file.name); //original name (ie: sunset.png)
  console.log(file.path); //tmp path (ie: /tmp/12345-xyaz.png)
  console.log(uploadPath); //uploads directory: (ie: /home/user/data/uploads)

  var f = function(){
    exec('cd /Users/kaiwang/Projects/test && git pull origin master', function (err, stdout, stderr) {
      printLogs('git pull error:', err, stdout, stderr);
    
      exec('ruby tod_configs.rb ' + file.path, function (err, stdout, stderr) {
        printLogs('update .yaml files error:', err, stdout, stderr);
        
        checkin (function (err){
          if (err !== null){
            exec('git reset --hard HEAD', function (err, stdout, stderr){
              f ();
            });
          }
          res.status(200).end();
        });
      });
    });
  };
  f();
};
