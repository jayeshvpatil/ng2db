var gulp= require('gulp');
var args=require('yargs').argv;
var browserSync=require('browser-sync');
var config=require('./gulp.config')();
var series= require('stream-series');
var del= require('del');
var port = process.env.PORT || config.defaultPort;

var $=require('gulp-load-plugins')({lazy:true});

gulp.task('help',$.taskListing);
gulp.task('default',['help']);


//javascript and code style check
gulp.task('vet',function(){
  log('Analyzing source with JSHint & JSCS');
  return gulp.src(config.alljs)
    .pipe($.if(args.verbose,$.print()))
    .pipe($.jscs())
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish',{verbose:true}))
    .pipe($.jshint.reporter('fail'));

});

// compile css..plumber - error handling ...autoprefixer
gulp.task('styles',['clean-styles'], function(){
  log('Compiling less --> css');
  return gulp
    .src(config.less)
    .pipe($.plumber())
    .pipe($.less())
    // 	.on('error', errorLogger)
    .pipe($.autoprefixer({browsers:['last 2 version','> 5%']}))
    .pipe(gulp.dest(config.temp));
});


gulp.task('clean', function(){
  var delConfig=[].concat(config.build,config.temp);
  log('Cleaning : '+ $.util.colors.blue(delConfig));
  del(delConfig);

});

gulp.task('clean-fonts', function(){
  var files=config.build + 'font/**/*.css';
  clean(files);
});
gulp.task('clean-images', function(){
  var files=config.build + 'images/**/*.css';
  clean(files);
});

gulp.task('clean-styles', function(){
  var files=config.temp + '**/*.css';
  clean(files);
});

gulp.task('clean-code', function(){
  var files=[].concat(
    config.temp + '**/*.js',
    config.build+'**/*.html',
    config.build+'js/**/*.js');
  clean(files);
});
/*
gulp.task('fonts',['clean-fonts'],function(){
  log('Copying fonts');
  return gulp.src(config.fonts)
    .pipe(gulp.dest(config.build+'fonts'));
});*/

gulp.task('images',['clean-images'],function(){
  log('Copying & compressing images');
  return gulp.src(config.images)
    .pipe($.imagemin({optimizationLevel:4}))
    .pipe(gulp.dest(config.build+'images'));
});


gulp.task('fonts',['clean-fonts'],function(){
  log('Copying fonts');
  return gulp.src(config.fonts)
    .pipe(gulp.dest(config.build+'fonts'));
});


/*


//watch if less file changes, calls styles
gulp.task('less-watcher',function(){
  gulp.watch([config.less],['styles']);
});
*/

gulp.task('templatecache',['clean-code'], function(){
  log('Creating Angular js $templatecache');
  return gulp
    .src([config.htmltemplates])
    .pipe($.minifyHtml({empty:true}))
    .pipe($.angularTemplatecache(
      config.templateCache.file,
      config.templateCache.options
    ))
    .pipe(gulp.dest(config.temp));
});


//wiredep bower dependencies..except app css
gulp.task('wiredep',['templatecache'],function(){
  log('Wireup bower css js and App js into index html');
  var templateCache = gulp.src(config.temp+ config.templateCache.file, {read: false});
  var configjs= gulp.src(config.js, {read: false});
  var options= config.getWiredepDefaultOptions();
  var wiredep = require('wiredep').stream;
  return gulp
    .src(config.index) //todo index.html
    .pipe(wiredep(options))
    .pipe($.inject(series(configjs, templateCache)))
    .pipe(gulp.dest(config.client));
});

// runs wiredep first then styles, and then inject runs to include app.css in index.html
gulp.task('inject',['wiredep','styles'],function(){
  log('Wireup app css js into index html and call wiredep');
 var extcss=  gulp.src(config.ext_modules_css, {read: false});
  var appcss= gulp.src(config.appcss,{read:false});
  var widgetcss= gulp.src(config.widgetcss,{read:false});
  return gulp
    .src(config.index)
    .pipe($.inject(series(appcss,widgetcss,extcss)))
    .pipe(gulp.dest(config.client));
});


//useref parse build blocks and concatenates file.used on wiredep/inject
//wiredep is for bower dependencies
//gulp inject is for our custom lib files



gulp.task('optimize',['inject','fonts','images'], function(){
  log('Optimizing the javascript, css and html');
  var cssFilter= '**/*.css';
  var jsAppFilter='**/'+ config.optimized.app;
  var jsLibFilter='**/'+ config.optimized.lib;
  return gulp
    .src(config.index)
    .pipe($.plumber())
    .pipe($.useref({ searchPath: './' })) // search file and concatenate
    .pipe($.if(cssFilter,$.csso()))  // css optimizer to minify css
    .pipe($.if(jsLibFilter,$.uglify()))
    .pipe($.if(jsAppFilter,$.ngAnnotate())) //app files annotate for any missing injections and then uglify
    .pipe($.if(jsAppFilter,	$.uglify()))
    .pipe($.if(jsAppFilter,$.rev()))
    .pipe($.if(jsLibFilter,$.rev()))
    .pipe($.if(cssFilter,$.rev()))
    .pipe($.revReplace())
    .pipe(gulp.dest(config.build))
    .pipe($.rev.manifest())
    .pipe(gulp.dest(config.build));

});
/**
 * --type=pre will bump the prelease version *.*.*-x
 * --type=patch or no flag with bump the patch version *.*.x
 * --type=minor will bump the minor version *.x.*
 * --type=major will bump the major version x.*.*
 * --type=version=1.2.3 will bump to a specific version and ignore any flags
 */

gulp.task('bump', function(){
  var msg='Bumping versions';
  var type= args.type;
  var version = args.version;
  var options={};
  if(version)
  {
    options.version=version;
    msg += ' to '+ version;
  }
  else{
    options.type=type;
    msg += ' for a '+ type;
  }
  log(msg);
  return gulp
    .src(config.packages)
    .pipe($.print())
    .pipe($.bump(options))
    .pipe(gulp.dest(config.root));

});

gulp.task('serve-build',['optimize'],function(){
  serve(false); /* isDev*/
});


gulp.task('serve-dev',['inject'],function(){
  serve(true); /* isDev*/
});

/////////////////////


function serve(isDev){

  var nodeOptions= {
    script: config.nodeServer,
    delayTime:1,
    env:{
      'PORT':port,
      'NODE_ENV': isDev? 'dev': 'build'
    },
    watch:[config.server]
  };
  return $.nodemon(nodeOptions)
    .on('restart',['vet'],function(ev){
      log('*** nodemon restarted');
      log('files changes on restart :\n'+ ev);
      setTimeout(function(){
        browserSync.notify('reloading now...');
        browserSync.reload({stream:false});
      },config.browserReloadDelay);
    })
    .on('start',function(){
      log('*** nodemon started');
      startBrowserSync();
    })
    .on('crash',function(){
      log('*** nodemon crashed : script crashed');
    })
    .on('exit',function(){
      log('*** nodemon exited cleanly');
    });

}

function changeEvent(event){
  var srcPattern= new RegExp('/.*(?=/'+ config.source+')/');
  log('File '+ event.path.replace(srcPattern,'')+ ' '+ event.type);

}

function startBrowserSync(){
  if(args.nosync || browserSync.active){
    return;
  }


  log('Starting browser-sync on port'+ port);

  gulp.watch([config.less],['styles'])
    .on('change',function(event){
      changeEvent(event);
    });

  var options={
    proxy:'localhost:'+port,
    port:3000,
    files:[config.client+'**/*.*',
      '!'+config.less,
      config.temp+'**/*.css'
    ],
    ghostMode:{
      clicks:true,
      location:false,
      forms:true,
      scroll:true
    },
    injectChanges:true,
    logFileChanges:true,
    logLevel:'debug',
    logPrefix:'gulp-patterns',
    notify:true,
    reloadDelay:1000

  };

  browserSync(options);
}
function errorLogger(error){
  log('*** Start of error ****');
  log(error);
  log('*** End of error ****');
  this.emit('end');
}


function clean(path){
  log('Cleaning: '+ $.util.colors.blue(path));
  del(path);
}

function log(msg){
  if(typeof(msg)==='object'){
    for(var item in msg){
      if(msg.hasOwnProperty(item)){
        $.util.log($.util.colors.blue(msg[item]));
      }
    }
  } else{
    $.util.log($.util.colors.blue(msg));
  }
}



