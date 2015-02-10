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

// var checkin = function(fileName, callback){
//   exec('cd /Users/kaiwang/Projects/test && git add .', function (err, stdout, stderr){
//     printLogs('git add error:', err, stdout, stderr);
//     if (err !== null){
//       return callback(err);
//     } 

//     exec('git commit -m "Updating TOD ymls cr=sparta"', function (err, stdout, stderr){
//       printLogs('git commit error:', err, stdout, stderr); 
      
//       exec('git push origin master', function (err, stdout, stderr){
//         printLogs('git push error:', err, stdout, stderr);
//         if (err !== null){
//           return callback(err);
//         } 
//       });
//     });
//     return callback(null);
//   });
// };

var afterPullMaster = function(err, stdout, stderr, file, res){
  printLogs('git pull error:', err, stdout, stderr);
  if (err !== null){
    res.status(500).send({Error: "Git pull error " + err.message});
    return next();
  }
  exec('ruby tod_configs.rb ' + file.path, function(err, stdout, stderr){
    afterExecRuby(err, stdout, stderr, res);
  });
}

var afterExecRuby = function(err, stdout, stderr, res){
  printLogs('update .yaml files error:', err, stdout, stderr);
  if (err !== null){
    res.status(500).send({Error: "when updating .yml files " + err.message});
    return next();
  } 
  exec('cd /Users/kaiwang/Projects/test && git add .', function(err, stdout, stderr){
    afterGitAdd(err, stdout, stderr, res);
  });
}

var afterGitAdd = function(err, stdout, stderr, res){
  printLogs('git add error:', err, stdout, stderr);
  if (err !== null){
    res.status(500).send({Error: "Git add error " + err.message});
    return next();
  } 
  exec('git commit -m "Updating TOD ymls cr=sparta"', function(err, stdout, stderr){
    afterGitCommit(err, stdout, stderr, res);
  });
}

var afterGitCommit = function(err, stdout,stderr, res){
  printLogs('git commit error:', err, stdout, stderr); 
  if (err !== null){
    res.status(500).send({Error: "Git commit error " + err.message});
    return next();
  } 
  exec('git push origin master', function(err, stdout, stderr){
    afterGitPush(err, stdout, stderr);
  });
}

function afterGitPush(err, stdout, stderr, res){
  printLogs('git push error:', err, stdout, stderr);
}

exports.create = function (req, res, next) {
  var data = _.pick(req.body, 'type')
    , uploadPath = path.normalize('./uploads')
    , file = req.files.file;

  exec('cd /Users/kaiwang/Projects/test && git pull origin master', function(err, stdout, stderr){
    afterPullMaster(err, stdout, stderr, file, res, function(err){
      res.status(200).end();
    });
  });
};
