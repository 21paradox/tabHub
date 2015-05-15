module.exports = function (grunt) {
  var browsers = [{
    browserName: 'googlechrome',
    platform: 'XP'
  }, {
    browserName: 'internet explorer',
    platform: 'WIN7',
    version: '8'
  }, {
    browserName: 'internet explorer',
    platform: 'WIN8.1',
    version: '11'
  }];

  //browsers = [{
  //    browserName: 'googlechrome',
  //    platform: 'WIN7',
  //    version: 'dev'
  //}, {
  //    browserName: 'googlechrome',
  //    platform: 'WIN7',
  //    version: 'beta'
  //}, {
  //    browserName: 'googlechrome',
  //    platform: 'WIN7',
  //    version: '42'
  //}, {
  //    browserName: 'googlechrome',
  //    platform: 'WIN7',
  //    version: '41'
  //}, {
  //    browserName: 'googlechrome',
  //    platform: 'WIN8.1',
  //    version: 'dev'
  //}];

  browsers = [];

  //  CHROME
      
  ['42', '28'].forEach(function (version) {

    ['WIN7', 'WIN8.1', 'WIN8', 'XP'].forEach(function (platform) {

      browsers.push({
        browserName: 'googlechrome',
        platform: platform,
        version: version
      });

    });
  });


  ['11', '10', '9', '8'].forEach(function (val) {
    browsers.push({
      browserName: 'internet explorer',
      platform: 'WIN7',
      version: val
    });
  });

  browsers = browsers.concat([

    {
      browserName: 'internet explorer',
      platform: 'WIN8.1',
      version: '11'
    },

    {
      browserName: 'internet explorer',
      platform: 'WIN8',
      version: '10'
    },

    {
      browserName: 'internet explorer',
      platform: 'XP',
      version: '8'
    },

    {
      browserName: 'safari',
      platform: 'OS X 10.10',
      version: '8.0'
    },

    {
      browserName: 'firefox',
      platform: 'WIN7',
      version: 37
    },

    {
      browserName: 'firefox',
      platform: 'WIN8',
      version: 37
    },

    {
      browserName: 'firefox',
      platform: 'WIN8.1',
      version: 37
    }

  ]);

 
//   ['7','6'].forEach(function (val) {
//      browsers.push({
//          browserName: 'internet explorer',
//          platform: 'XP',
//          version: val
//      });
//  });


  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    connect: {
      server: {
        options: {
          base: '',
          port: 9999
        }
      }
    },

    'saucelabs-jasmine': {
      all: {
        options: {
          username: '21paradox_test', // if not provided it'll default to ENV SAUCE_USERNAME (if applicable)
          key: 'ff8739e5-04bd-489e-9b56-f4e35032c5fa', // if 
          urls: [
            'http://127.0.0.1:9999/spec_1page.html',
            'http://127.0.0.1:9999/spec_2page.html',
            'http://127.0.0.1:9999/spec_2.1page.html'
          ],
          browsers: browsers,
          build: process.env.TRAVIS_JOB_ID,
          testname: 'tabHub tests',
          throttled: 3,
          sauceConfig: {
            'video-upload-on-pass': false
          },
         pollInterval: 20000,
         statusCheckAttempts: 100
        }
      }
    },
    watch: {}
  });

  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-saucelabs');

  grunt.registerTask('default', ['connect', 'saucelabs-jasmine']);
};