'use strict';
//require('shelljs/global');

var path = require('path');
var _ = require('lodash');

var exec = require("child_process").exec;

// Get list of uploads
exports.index = function(req, res) {
  res.json([]);
};

exports.create = function (req, res, next) {
  var data = _.pick(req.body, 'type')
    , uploadPath = path.normalize('./uploads')
    , file = req.files.file;
 
  console.log(file.name); //original name (ie: sunset.png)
  console.log(file.path); //tmp path (ie: /tmp/12345-xyaz.png)
  console.log(uploadPath); //uploads directory: (ie: /home/user/data/uploads)

  // exec ('pwd', function (err, stdout, stderr){
  //   console.log('error:' + err);
  //   console.log('sttdout: ' + stdout);
  // })

  exec('git pull origin master', function (err, stdout, stderr) {
    console.log('error:' + err);
    console.log('sttdout: ' + stdout);
  
    exec('ruby tod_configs.rb ' + file.path, function (err, stdout, stderr) {
      console.log('error:' + err);
      console.log('sttdout: ' + stdout);
      
      exec('git add .', function (err, stdout, stderr){
        console.log('error:' + err);
        console.log('sttdout: ' + stdout);

        exec('git commit -m "update"', function (err, stdout, stderr){
          console.log('error:' + err);
          console.log('sttdout: ' + stdout);
          
          exec('git push origin master', function (err, stdout, stderr){
            console.log('error:' + err);
            console.log('sttdout: ' + stdout);
            res.status(200).end();
          });
        });
      });
      //res.status(200).end();
      //git add ., commit, push
    });
  });
};
