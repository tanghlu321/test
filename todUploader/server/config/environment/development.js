'use strict';

module.exports = {
	
  git_url: "https://github.com/tanghlu321/test.git",
  git_branch: "dev/improve",
  git_fetch_origin: "cd /Users/kaiwang/Projects/test/batch_intl/ && git fetch origin",
  git_reset_origin: "cd /Users/kaiwang/Projects/test/batch_intl/ && git reset --hard origin/master",
  git_pull: 'cd /Users/kaiwang/Projects/test/batch_intl/ && git pull origin master', 
  git_add: 'cd /Users/kaiwang/Projects/test/batch_intl/ && git ls-files /Users/kaiwang/Projects/test/batch_intl | grep "\.yml$" | xargs git add',
  git_commit: 'cd /Users/kaiwang/Projects/test/batch_intl/ && git commit -m "Updating TOD ymls cr=sparta"',
  git_push: 'cd /Users/kaiwang/Projects/test/batch_intl/ && git push origin master',
  port:     process.env.OPENSHIFT_NODEJS_PORT ||
            process.env.PORT ||
            9000
};
aaa
