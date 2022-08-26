@servers(['web' => 'root@bitrix.medeqstars.com'])

@task('deploy')
  cd /home/extwww/ext_www/test-bitrix.medeqstars.com/local/js/vue-app2
  git reset --hard && git clean -df
  git pull origin dev
  npm install
  npm run build
@endtask

@task('deploy:production')
  cd /home/bitrix/www/local/js/vue-app
  git reset --hard && git clean -df
  git pull origin master
  npm install
  npm run build
@endtask
