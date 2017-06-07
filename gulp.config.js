module.exports= function(){
  var client='./app/';
  var clientApp= client +'vzdashboard/';
  var root='./';
  var server='./server/';
  var temp='./.tmp/';
  var config=
  {
    /*
     File Paths
     */
    alljs:['./app/**/*.js',
      './*.js'
    ],
    build: './build/',

    client: client,
    index :  './index.html',
    js: [
      clientApp+'**/*.js',
      '!'+ clientApp+'**/*.spec.js'
    ],
    //css: temp +'styles.css',
    appcss: './styles.css',//temp pointing to app.css after sass, it should point to temp folder after compilation widgetcss: clientApp + 'vzWidgets/**/*.css',//temp pointing to app.css after sass, it should point to temp folder after compilation
    htmltemplates:client+'**/*.html',
    images:  './img/**/*.*',
    less:clientApp + 'styles.less',
    root:root,
    server: server,
    temp:temp,
    /**
     *  Optimized files
     **/
    optimized:{
      app:'app.js',
      lib:'lib.js'
    },

    /**
     * Template Cache
     **/
    templateCache:{
      file: 'template.js',
      options:{
        module:'vzERGApp',
        standAlone:false,
        root:'app/'
      }
    },

    // Browser Sync
    browserReloadDelay:1000,
    /**
     * Bower and NPM locations
     **/
    bower:{
      json: require('./bower.json'),
      directory:'./bower_components',
      ignorePath:'..'
    },
    packages:['package.json', 'bower.json'],

    /** Node settings**/
    defaultPort:7203,
    nodeServer : server+ 'app.js'
  };

  config.getWiredepDefaultOptions =function(){
    var options={
      bowerJson:config.bower.json,
      directory:config.bower.directory,
      ignorePath: config.bower.ignorePath

    };
    return options;

  };
  return config;


};
