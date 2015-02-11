'use strict';

var path = require('path');
var _ = require('lodash');

var exec = require("child_process").exec;

// Get list of uploads
exports.index = function(req, res) {
  res.json([]);
};

var printLogs = function(message, err, stdout, stderr){
  console.log(message + JSON.stringify(err));
  console.log('stdout: ' + stdout);
  console.log('stderr: ' + stderr);
}

var afterPullMaster = function(err, stdout, stderr, file, callback){
  printLogs('git pull error:', err, stdout, stderr);
  if (err !== null){
    return callback(err);
  }
  exec('ruby tod_configs.rb ' + file.path, function(err, stdout, stderr){
    afterExecRuby(err, stdout, stderr, callback);
  });
}

var afterExecRuby = function(err, stdout, stderr, callback){
  printLogs('update .yaml files error:', err, stdout, stderr);
  if (err !== null){
    return callback(err);
  } 
  exec('cd /Users/kaiwang/Projects/test && git add .', function(err, stdout, stderr){
    afterGitAdd(err, stdout, stderr, callback);
  });
}

var afterGitAdd = function(err, stdout, stderr, callback){
  printLogs('git add error:', err, stdout, stderr);
  if (err !== null){
    return callback(err);
  } 
  exec('git commit -m "Updating TOD ymls cr=sparta"', function(err, stdout, stderr){
    afterGitCommit(err, stdout, stderr, callback);
  });
}

var afterGitCommit = function(err, stdout,stderr, callback){
  printLogs('git commit error:', err, stdout, stderr); 
  
  exec('git push origin master', function(err, stdout, stderr){
    afterGitPush(err, stdout, stderr, callback);
  });
}

function afterGitPush(err, stdout, stderr, callback){
  printLogs('git push error:', err, stdout, stderr);
  return callback(err);
}

exports.create = function (req, res, next) {
  var data = _.pick(req.body, 'type')
    , uploadPath = path.normalize('./uploads')
    , file = req.files.file;

  exec('cd /Users/kaiwang/Projects/test && git pull origin master', function(err, stdout, stderr){
    afterPullMaster(err, stdout, stderr, file, function(err){
      if (err === null)
        res.status(200).end();
      else
        res.status(500).send({Error: err.message});
    });
  });
};
