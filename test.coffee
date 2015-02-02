github = require('octonode');
require('shelljs/global');

exec 'git add .', (code)->
  if code is not 0
    console.log "Error: Git add failed" 
    exit 1
  exec 'git commit -m "change"', (code)->
    if code is not 0
      console.log "Error: Git commit failed" 
      exit 1
    exec 'git push origin master', (code)->
      if code is not 0
        console.log "Error: Git push failed" 
        exit 1

# if (!which('git')) {
#   echo('Sorry, this script requires git');
#   exit(1);
# }
# if (exec 'git add .').code != 0
#   echo 'Error: Git commit failed'
#   exit 1

# if (exec 'git commit -am "Auto-commit"').code != 0
#   echo 'Error: Git commit failed'
#   exit 1
#ghme = client.me()

# client = github.client({
#   username: 'kaiwang.sunysb@gmail.com',
#   password: '198781asdf'
# })



#client.requestDefaults['proxy'] = 'https://myproxy.com:1085'


# client.get '/user', {}, (err, status, body, headers)->
#   console.log body

# ghme = client.me();

# ghme.info (err, data, headers)->
#   console.log("error: " + err);
#   console.log("data: " + data);
#   console.log("headers:" + headers);

# ghrepo = client.repo('tanghlu321/test')
# ghrepo.info (err, infom)->
#   console.log("error: " + err)
#   # infom = JSON.parse infom
#   #console.log("info: " + infom)

# ghrepo.collaborators (err, collaborators)->
#   console.log collaborators


# ghrepo.createContents 'lib/index.js', 'making a commit', './file.txt', (err, path)->
#   console.log err
#   console.log path

# ghrepo.commits (err, commits)->
#   console.log commits
