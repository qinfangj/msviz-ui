'use strict';
angular.module('qcDevInfo-edit', ['thirdparties', 'environment'])

/**
 * @ngdoc service
 * @name service:QcDevInfoService
 * @description
 * Access to qcDeviceInfo
 *
 */
  .service('QcDevInfoService', function (httpProxy) {
    var QcDevInfoService = function () {
      return this;
    };
    QcDevInfoService.prototype.addDeviceInfo = function (deviceInfo) {

      return httpProxy.post('/qc/deviceInfo', deviceInfo,{headers: {'Content-Type': undefined}});
    };

    QcDevInfoService.prototype.list = function () {

      return httpProxy.get('/qc/deviceInfo' );
    };

    QcDevInfoService.prototype.delete = function (devDate,devType) {

      return httpProxy.delete('/qc/deviceInfo' + '/'+ devDate + '/' + devType);
    };

    QcDevInfoService.prototype.findDevInfoBtw2Date = function (dateFrom,dateTo) {

      return httpProxy.get('/qc/deviceInfo' + '/'+ dateFrom + '/' + dateTo);
    };

    return new QcDevInfoService();
  })
  .controller('QcDeviceInfoEditCtrl',  function($scope,$route,QcDevInfoService){
    //share the parent window's data "machineGrp"
    $scope.parentWindow = window.opener.$windowScope;
    $scope.machineGrp=$scope.parentWindow.machineGrp;

    $scope.addDevInfo=function(devDate,devType,devInfo){

      if ((devDate !== undefined && devDate !=='') && (devType!== undefined && devType !=='')) {


        var deviceInfo={'devDate':devDate,'devType':devType,'devInfo':(devInfo===undefined?'':devInfo)};

        QcDevInfoService.addDeviceInfo(deviceInfo).success(function (resp) {
          console.log('add device Info successfully=', resp);
          $route.reload();
        }).error(function (error) {
          console.log('add device Info failed=', error);
        });

      }

    };

    QcDevInfoService.list().then(function(data){
      $scope.devInfos = data;


    });


    $scope.delDevInfo=function(devDate,devType) {
      console.log('delete device infomation=');
      QcDevInfoService.delete(devDate, devType).success(function () {
        $route.reload();
      }).error(function (error) {
        console.log('failed=', error);
      });

    };

    $scope.setDevInfo=function(){

      window.opener.$windowScope.devInfos=$scope.devInfos;
      window.opener.$windowScope.$apply();

      window.close();

    };
  });

