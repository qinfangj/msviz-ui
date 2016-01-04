'use strict';
angular.module('qcSummary-upload', ['thirdparties', 'environment'])

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
  .service('FileUpload', function (httpProxy) {
    //this.uploadFileToUrl = function(file, uploadUrl){
    //  var fd = new FormData();
    //  fd.append('file', file);
    //
    //  //var objFile={title:'why'};
    //  return $http.post(uploadUrl, file, {
    //    //withCredentials: true,
    //    transformRequest: angular.identity,
    //    headers: {'Content-Type': 'text/plain'}
    //  });
    //};
    var FileUpload = function () {
      return this;
    };
    FileUpload.prototype.loadQcSummary = function (file) {

      return httpProxy.post('/qc/summary', file, {
        transformRequest: angular.identity,
        headers: {'Content-Type': 'text/plain'}});
    };

    return new FileUpload();
  })
  .controller('QcSummaryLoadCtrl',  function($window, $scope, FileUpload){

    $scope.uploadFile = function(){
      var file = $scope.myFile;
      console.log('file is ' );
      console.dir(file);
      //var uploadUrl = 'http://localhost:9000/qc/summaryLoad';
      FileUpload.loadQcSummary(file)
        .success(function (resp) {
          //$scope.status= file.name+' was uploaded successfully!!!';
          $window.alert(file.name+' was uploaded successfully!!!');
          console.log('Success', resp);
        }).error(function (error) {
          $scope.status='failed'+error.message;
          $window.alert('failed'+error.message);
          console.log('fail', error);
        });

    };

  });

