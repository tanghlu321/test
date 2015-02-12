'use strict';

var path = require('path');
var _ = require('lodash');
var config = require('../../config/environment');

var exec = require("child_process").exec;

exports.index = function(req, res) {
  res.json([]);
};

var printLogs = function(message, err, stdout, stderr){
  console.log(message + JSON.stringify(err));
  console.log('stdout: ' + stdout);
  console.log('stderr: ' + stderr);
}

var afterGitFetchOrigin = function(err, stdout, stderr, file, callback){
  printLogs('git fetch origin error:', err, stdout, stderr);
  if (err !== null)
    return callback(err);
  exec(config.git_reset_origin, function(err, stdout, stderr){
    afterGitResetOrigin(err, stdout, stderr, file, callback);
  });
}

var afterGitResetOrigin = function(err, stdout, stderr, file, callback){
  printLogs('git reset origin error:', err, stdout, stderr);
  if (err !== null)
    return callback(err);
  exec(config.git_pull, function(err, stdout, stderr){
      afterPullMaster(err, stdout, stderr, file, callback);
  });
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
  
    exec(config.git_add, function(err, stdout, stderr){
    afterGitAdd(err, stdout, stderr, callback);
  });
}

var afterGitAdd = function(err, stdout, stderr, callback){
  printLogs('git add error:', err, stdout, stderr);
  if (err !== null){
    return callback(err);
  }
  exec(config.git_commit, function(err, stdout, stderr){
    afterGitCommit(err, stdout, stderr, callback);
  });
}

var afterGitCommit = function(err, stdout,stderr, callback){
  printLogs('git commit error:', err, stdout, stderr);
  if (err !== null){

   return callback(new Error('Unable to commit. ' + stdout));
  }

  exec(config.git_push, function(err, stdout, stderr){
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

  //res.status(202).end();
  exec(config.git_fetch_origin, function(err, stdout, stderr){
    afterGitFetchOrigin(err, stdout, stderr, file, function(err){
      if (err === null)
        res.status(200).send({Github url: config.git_url});
      else
        res.status(500).send({Error: err.message});
    });
  });
};





