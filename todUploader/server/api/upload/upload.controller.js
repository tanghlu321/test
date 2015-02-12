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
  var yml = '\.yml$';
  //exec('cd /Users/kaiwang/Projects/test/ && git ls-files /Users/kaiwang/Projects/test/batch_intl | grep yml | xargs git add', function(err, stdout, stderr){
    exec('cd /Users/kaiwang/Projects/test/ && git add .', function(err, stdout, stderr){
    afterGitAdd(err, stdout, stderr, callback);
  });
}

var afterGitAdd = function(err, stdout, stderr, callback){
  printLogs('git add error:', err, stdout, stderr);
  if (err !== null){
    return callback(err);
  }
  exec('cd /Users/kaiwang/Projects/test/ && git commit -m "Updating TOD ymls cr=sparta"', function(err, stdout, stderr){
    afterGitCommit(err, stdout, stderr, callback);
  });
}

var afterGitCommit = function(err, stdout,stderr, callback){
  printLogs('git commit error:', err, stdout, stderr);
  if (err !== null){

   return callback(new Error('Unable to commit. ' + err.message));
  }

  exec('cd /Users/kaiwang/Projects/test/ && git push origin dev/improve', function(err, stdout, stderr){
    afterGitPush(err, stdout, stderr, callback);
  });
}

function afterGitPush(err, stdout, stderr, callback){
  printLogs('git push error:', err, stdout, stderr);
  if (err !== null){
    exec('git reset --hard HEAD~1', function(err, stdout, stderr){
      return callback(new Error('Unable to Git push, reset the repo. Please try again'));
    });
  }
  return callback(null);
}

exports.create = function (req, res, next) {
  var data = _.pick(req.body, 'type')
    , uploadPath = path.normalize('./uploads')
    , file = req.files.file;

  //add git reset to origin master
  exec('cd /Users/kaiwang/Projects/test/ && git pull origin dev/improve', function(err, stdout, stderr){
    afterPullMaster(err, stdout, stderr, file, function(err){
      if (err === null)
        res.status(200).end();
      //add the sha
      else
        res.status(500).send({Error: err.message});
    });
  });
};





