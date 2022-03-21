@servers(['web' => 'forge@bitrix-external-app.medeqstars.com'])

@task('deploy')
    cd /home/forge/bitrix-external-app.medeqstars.com
    git reset --hard && git clean -df
    git pull origin master
    npm install
    npm run build
@endtask
