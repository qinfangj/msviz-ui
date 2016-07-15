'use strict';
angular.module('eliteMonitorInfo', ['thirdparties', 'environment'])

/**
 * @ngdoc service
 * @name service:eliteMonitorInfoService
 * @description
 * Access to eliteMonitorInfo
 *
 */
  .service('EliteMonitorInfoService', function (httpProxy) {

    var EliteMonitorInfoService = function () {
      return this;
    };

    /**
     * @ngdoc method
     * @name matches.service:eliteMonitorInfoService
     * @methodOf service:EliteMonitorInfoService
     * @description get the list of all elite monitor infomation
     * @returns {httpPromise} of an array of string
     */

    EliteMonitorInfoService.prototype.list = function () {

      return httpProxy.get('/qc/eliteMonitorInfo' );
    };
    EliteMonitorInfoService.prototype.addEliteMonitorInfo = function (eliteMonitorInfo) {

      return httpProxy.post('/qc/deviceInfo', eliteMonitorInfo,{headers: {'Content-Type': undefined}});
    };

    EliteMonitorInfoService.prototype.find = function (monitorDate) {

      return httpProxy.delete('/qc/eliteMonitorInfo' + '/'+ monitorDate);
    };

    EliteMonitorInfoService.prototype.delete = function (monitorDate,monitorIndex) {

      return httpProxy.delete('/qc/eliteMonitorInfo' + '/'+ monitorDate + '/' + monitorIndex);
    };

    EliteMonitorInfoService.prototype.updateEliteMonitorInfo = function (eliteMonitorInfo) {

      return httpProxy.put('/qc/eliteMonitorInfo', eliteMonitorInfo, {headers: {'Content-Type': undefined}});
    };

    return new EliteMonitorInfoService();
  })

  .controller('EliteMonitorInfoCtrl', function($scope,$route,$window, EliteMonitorInfoService) {
    $scope.divShow = 'info';
    EliteMonitorInfoService.list().then(function(data){
      $scope.eliteMonitorInfos = data;

    });

    $scope.show = function(arg) {
      $scope.divShow = arg;
    };



    EliteMonitorInfoService.delEliteMonitorInfo=function(monitorDate,monitorIndex){
      EliteMonitorInfoService.delete(monitorDate, monitorIndex).success(function () {
        var status = 'Elite Monitor Infomation on \'' + monitorDate + '\' : \'' + monitorIndex + '\' was deleted successfully';
        //console.log('delete messege=' + $scope.status);

        $window.alert(status);
      }).error(function (error) {
          console.log('failed=', error);
        });

    };

    EliteMonitorInfoService.addMonitorInfo=function(monitorDate,multiplier1,multiplier2,comment){

      //var existList = EliteMonitorInfoService.find(monitorDate).then(function(data){
      //  console.log('existList=', data);
      //});
      var eiliteMonitorInfo={'monitorDate':monitorDate,'monitorIndex':'1','Multplier1':multiplier1,'Multplier2':multiplier2,'Comment':comment};
      EliteMonitorInfoService.addEliteMonitorInfo(eiliteMonitorInfo).success(function (resp) {
        console.log('add elite monitor Info successfully=', resp);
        $route.reload();

      }).error(function (error) {
        console.log('add elite monitor Info failed=', error);
      });

    };

  });
