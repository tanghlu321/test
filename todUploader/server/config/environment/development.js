'use strict';

module.exports = {
	
  git_url: "https://github.com/tanghlu321/test.git",
  git_branch: "dev/improve",
  path: "/Users/kaiwang/Projects/test/",
  port:     process.env.OPENSHIFT_NODEJS_PORT ||
            process.env.PORT ||
            9000
};
