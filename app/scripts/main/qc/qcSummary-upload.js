'use strict';
angular.module('qcSummary-upload', ['thirdparties', 'environment'])

  .config(['$httpProvider', function($httpProvider) {
    //$httpProvider.defaults.useXDomain = true;
    //delete $httpProvider.defaults.headers.common['X-Requested-With'];
    //$httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
  }])
/**
 * @ngdoc control
 * @name qcSummaryLoadCtrl
 * @description
 * restore text file to mongodb qc.Summary
 *
 */
  .directive('fileModel', ['$parse', function ($parse) {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        var model = $parse(attrs.fileModel);
        var modelSetter = model.assign;

        element.bind('change', function(){
          scope.$apply(function(){
            modelSetter(scope, element[0].files[0]);
          });
        });

      },
      template: '<svg width="960" height="500"></svg>'
    };
  }])
  .service('fileUpload', ['$http', function ($http) {
    this.uploadFileToUrl = function(file, uploadUrl){
      var fd = new FormData();
      fd.append('file', file);
        //var objFile={title:'why'};
        $http.post(uploadUrl, file, {
        //withCredentials: true,
        transformRequest: angular.identity,
        headers: {'Content-Type': 'text/plain'}
      })
        .success(function(resp){
            console.log('Success', resp);
        })
        .error(function(resp){
            console.log('fail', resp);
        });
    };
  }])
  .controller('QcSummaryLoadCtrl', ['$scope', 'fileUpload', function($scope, fileUpload){

    $scope.uploadFile = function(){
      var file = $scope.myFile;
      console.log('file is ' );
      console.dir(file);
      var uploadUrl = 'http://localhost:9000/qc/summaryLoad';
      fileUpload.uploadFileToUrl(file, uploadUrl);
    };

  }]);
