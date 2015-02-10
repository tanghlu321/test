'use strict';

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

var checkin = function(fileName, callback){
  exec('cd /Users/kaiwang/Projects/test && git add .', function (err, stdout, stderr){
    printLogs('git add error:', err, stdout, stderr);
    if (err !== null){
      return callback(err);
    } 

    // include the source CVS file name and the user who is making the upload
    // this will help diagnoze issues with a given checkin
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

  var tryCount = 0;
  var update = function(){
    exec('cd /Users/kaiwang/Projects/test && git pull origin master', function (err, stdout, stderr) {
      printLogs('git pull error:', err, stdout, stderr);
      if (err !== null){
        res.status(500).send({Error: "Git pull error " + err.message});
        return next();
      } 
    
      exec('ruby tod_configs.rb ' + file.path, function (err, stdout, stderr) {
        printLogs('update .yaml files error:', err, stdout, stderr);
        if (err !== null){
          res.status(400).send({Error: "when updating .yml files " + err.message});
          return next();
        } 
        
        checkin (file.name, function (err){
          if (err !== null){
            if (tryCount > 5){
              res.status(500).send({Error: "Git checkin error: " + err});
              return next();
            }
    
            tryCount++;
            exec('git reset --hard HEAD~1', function (err, stdout, stderr){
              update();
            });
          }
          else 
            res.status(200).end();
        });
      });
    });
  };
  update();
};
