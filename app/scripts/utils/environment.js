'use strict';
angular.module('environment', ['angularytics'])

/**
 * @ngdoc function
 * @name environment.service:EnvConfig
 * @description
 * # EnvConfig
 * configure handler with backendUrl pointer. For the moment, the url is either set to localhost or swissqt depending on the current page location
 */
  .config(function (AngularyticsProvider) {
    AngularyticsProvider.setEventHandlers(['Console', 'GoogleUniversal']);

  })
  .service('EnvConfig', function ($location, Angularytics) {
    var isProd = $location.$$port === 80;
    if (isProd) {
      return {
        isProd: true,
        backendUrl: 'http://ptppc4.epfl.ch/backend'
      };
    } else {
      return {
        isProd: false,
        backendUrl: 'http://localhost:9000'
      };
    }


      Angularytics.init();
  }).config(['$httpProvider', function($httpProvider) {

    $httpProvider.defaults.useXDomain = true;

    delete $httpProvider.defaults.headers.common['X-Requested-With'];
    //$httpProvider.defaults.headers.common['Access-Control-Allow-Headers'] = '*';

  }])
/**
 * @ngdoc service
 * @name environment.service:httpProxy
 * @description wrap common call (GET ...) to the backend , prefixing backendUrl and getting data out of response
 */
  .service('httpProxy', function($http, EnvConfig){
      var HttpProxy = function(){
        return this;
      };
    /**
     * @ngdoc method
     * @name environment.service:httpProxy#get
     * @methodOf environment.service:httpProxy
     * @description wrap GET call
     * @param {String} uri the absolute uri to pass to the backend
     * @param {Object} opts options to pass to $http.get
     * @return {httpPromise} of the returned response.data
     */

    HttpProxy.prototype.get = function(uri, opts){
      return $http.get(EnvConfig.backendUrl+uri, opts)
        .then(function(resp){
          return resp.data;
        });
    };
    /**
     * @ngdoc method
     * @name environment.service:httpProxy#delete
     * @methodOf environment.service:httpProxy
     * @description wrap DELETE call
     * @param {String} uri the absolute uri to pass to the backend
     * @param {Object} opts options to pass to $http.delete
     * @return {httpPromise} of the returned boolean
     */

    HttpProxy.prototype.delete=function(uri,opts){
      console.log('url=' + EnvConfig.backendUrl+ uri );
      console.log('opts=' + opts );
      return $http.delete(EnvConfig.backendUrl+uri, opts);
    };

   HttpProxy.prototype.put=function(uri,data,opts){
      console.log('url=' + EnvConfig.backendUrl+ uri );
      console.log(opts );
      return $http.put(EnvConfig.backendUrl+uri,data,opts);
    };

    HttpProxy.prototype.post=function(uri,data,opts){
      console.log('url=' + EnvConfig.backendUrl+ uri );
      console.log(opts );
      return $http.post(EnvConfig.backendUrl+uri,data,opts);
    };

    return new HttpProxy();
  })

  .directive('swaggerDoc', function (EnvConfig) {
    return {
      restrict: 'EA',
      template: '<a href="' + EnvConfig.backendUrl + '/docs/index.html">backend REST doc</a>'
    };
  })
;
