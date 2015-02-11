'use strict';

// Development specific configuration
// ==================================
module.exports = {
	
  giturl: "git@github.groupondev.com:Push/tod_automation_test_tempory.git",

  // Server port
  port:     process.env.OPENSHIFT_NODEJS_PORT ||
            process.env.PORT ||
            9000
};
