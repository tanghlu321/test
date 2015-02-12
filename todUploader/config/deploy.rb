require 'capistrano/ext/multistage'

set :stages, %w(production)
set :default_stage, 'staging'

set :application, "tod_experiment_automation"
set :scm, :git
set :repository, "https://github.com/tanghlu321/test.git"
set :branch, "master"
set :deploy_to, "/var/groupon/www/#{application}"
set :deploy_via, :copy
set :copy_cache, "/tmp/caches/#{application}"
set :copy_exclude, [".git", "packages/*gz"]
set :copy_remote_dir, "/tmp"
set :keep_releases, 3

default_run_options[:pty] = true
default_run_options[:shell] = "/usr/bin/sudo -E /bin/sh"

before :deploy, "deploy:clean_cache"
before "deploy:restart", "deploy:install"
after :deploy, "deploy:cleanup"

namespace :deploy do
  task :clean_cache, :on_error => :continue do
    run_locally "rm -rf /tmp/caches/#{application}"
  end

  desc "Stop Forever"
  task :stop, :on_error => :continue do
    run "/usr/bin/pkill -f app.coffee"
  end

  desc "Start Forever"
  task :start do
    run "cd #{current_path} && (nohup sudo -E coffee ./app.coffee &) && sleep 2"
  end

  desc "Restart Forever"
  task :restart do
    stop
    sleep 5
    start
  end

  desc "Check required packages and install if packages are not installed"
  task :install do
    run "npm config set registry http://npm-registry.snc1"
    run "cd #{current_path} && npm install"
  end
end
