/**
 * Created by qjolliet on 25/07/16.
 */
'use strict';
angular.module('qexTransInfo', ['thirdparties', 'environment'])

/**
 * @ngdoc service
 * @name service:eliteMonitorInfoService
 * @description
 * Access to eliteMonitorInfo
 *
 */
  .service('QexTransInfoService', function (httpProxy) {

    var QexTransInfoService = function () {
      return this;
    };

    /**
     * @ngdoc method
     * @name matches.service:eliteMonitorInfoService
     * @methodOf service:EliteMonitorInfoService
     * @description get the list of all elite monitor infomation
     * @returns {httpPromise} of an array of string
     */

    QexTransInfoService.prototype.list = function () {

      return httpProxy.get('/qc/qexTransInfo');
    };
    QexTransInfoService.prototype.addQexTransInfo = function (qexTransInfo) {

      return httpProxy.post('/qc/qexTransInfo', qexTransInfo,{headers: {'Content-Type': undefined}});
    };

    QexTransInfoService.prototype.find = function (transDate) {

      return httpProxy.get('/qc/qexTransInfo' + '/'+ transDate);
    };

    QexTransInfoService.prototype.findAllBtw2Date = function (transDate1,transDate2) {

      return httpProxy.get('/qc/qexTransInfo' + '/'+ transDate1 + '/'+transDate2);
    };

    QexTransInfoService.prototype.delete = function (transDate,transIndex) {

      return httpProxy.delete('/qc/qexTransInfo' + '/'+ transDate + '/' + transIndex);
    };

    QexTransInfoService.prototype.updateQexTransInfo = function (qexTransInfo) {

      return httpProxy.put('/qc/qexTransInfo', qexTransInfo, {headers: {'Content-Type': undefined}});
    };

    return new QexTransInfoService();

  })

  .service('QexHFTransInfoService', function (httpProxy) {

    var QexHFTransInfoService = function () {
      return this;
    };

    /**
     * @ngdoc method
     * @name matches.service:QexHFTransInfoService
     * @methodOf service:QexHFTransInfoService
     * @description get the list of all elite monitor infomation
     * @returns {httpPromise} of an array of string
     */

    QexHFTransInfoService.prototype.list = function () {

      return httpProxy.get('/qc/qexHFTransInfo');
    };
    QexHFTransInfoService.prototype.addQexTransInfo = function (qexTransInfo) {

      return httpProxy.post('/qc/qexHFTransInfo', qexTransInfo,{headers: {'Content-Type': undefined}});
    };

    QexHFTransInfoService.prototype.find = function (transDate) {

      return httpProxy.get('/qc/qexHFTransInfo' + '/'+ transDate);
    };

    QexHFTransInfoService.prototype.findAllBtw2Date = function (transDate1,transDate2) {

      return httpProxy.get('/qc/qexHFTransInfo' + '/'+ transDate1 + '/'+transDate2);
    };

    QexHFTransInfoService.prototype.delete = function (transDate,transIndex) {

      return httpProxy.delete('/qc/qexHFTransInfo' + '/'+ transDate + '/' + transIndex);
    };

    QexHFTransInfoService.prototype.updateQexTransInfo = function (qexTransInfo) {

      return httpProxy.put('/qc/qexHFTransInfo', qexTransInfo, {headers: {'Content-Type': undefined}});
    };

    return new QexHFTransInfoService();

  })

  .controller('QexTransInfoCtrl', function($scope,$route,$window, QexTransInfoService) {

    $scope.title='Qex Transmission Infomation';
    $scope.ctlName = 'QexTransInfoCtrl';
    $scope.reDate = /^[0-9]{8}$/;
    $scope.reNumber = /\d*\.?\d+/;


    QexTransInfoService.list().then(function(data){
      $scope.qexTransInfos = data;
      //$scope.qexData= _.map($scope.qexTransInfos, function (s) {
        //return {
          //date: s.transDate +'_' +  s.transIndex,
          //val1: s.TransResult,
          //comment: s.Comment
        //};
      //});

    });


    $scope.delQexTransInfo=function(transDate,transIndex){
      QexTransInfoService.delete(transDate, transIndex).success(function () {
        var status = 'Qex Transmission Infomation on \'' + transDate + '\' : \'' + transIndex + '\' was deleted successfully';
        console.log('delete messege=' + status);

        //$window.alert(status);
        $route.reload();
      }).error(function (error) {
        console.log('failed=', error);
      });

    };

    $scope.addQexTransInfo=function(transDate,TransResult,comment) {

      if (transDate!== undefined && TransResult !== undefined ) {
        if(comment === undefined){ comment = '';}
        QexTransInfoService.find(transDate).then(function (data) {
          console.log('existList=', data);
          //var existList = data;
          var transIndex;
          if (data.length === 0) {
            transIndex = '1';
          } else {
            var maxTransIndex = _.max(_.map(data,function(d){return d.transIndex;}));
            transIndex = (parseInt(maxTransIndex) + 1).toString();
            console.log('transIndex=',transIndex);
          }

          var qexTransInfo = {
            'transDate': transDate,
            'transIndex': transIndex,
            'TransResult': TransResult,
            'Comment': comment
          };
          //console.log('eiliteMonitorInfo=', eiliteMonitorInfo);

          QexTransInfoService.addQexTransInfo(qexTransInfo).success(function (resp) {
            console.log('add qex transmission Info successfully=', resp);
            $route.reload();

          }).error(function (error) {
            console.log('add qex transmission Info failed=', error);
          });


        });

      }
    };

    $scope.showChart = function(dateFrom,dateTo) {

      if (dateFrom===undefined || dateFrom===''){
        QexTransInfoService.list().then(function(data){
          console.log('dateFrom=' + dateFrom);
          console.log('data=' +  data.length);
          var qexData= _.map(data, function (s) {
            return {
              date: s.transDate +'_' +  s.transIndex,
              val1: s.TransResult,
              comment: s.Comment
            };
          });
          $window.location.href= '#/qexTransInfo/'+ angular.toJson(qexData);

        });
      }else {

        QexTransInfoService.findAllBtw2Date(dateFrom, dateTo).then(function (data) {
          console.log('dateFrom=' + dateFrom);
          var qexData= _.map(data, function (s) {
            return {
              date: s.transDate +'_' +  s.transIndex,
              val1: s.TransResult,
              comment: s.Comment
            };
          });
          $window.location.href= '#/qexTransInfo/' + angular.toJson(qexData);
        });
      }
      //$scope.status ='';
    };

  })
  .controller('QexHFTransInfoCtrl', function($scope,$route,$window, QexHFTransInfoService) {

    $scope.title='QexHF Transmission Infomation';
    $scope.ctlName = 'QexHFTransInfoCtrl';
    $scope.reDate = /^[0-9]{8}$/;
    $scope.reNumber = /\d*\.?\d+/;


    QexHFTransInfoService.list().then(function(data){
      $scope.qexTransInfos = data;
      //$scope.qexData= _.map($scope.qexTransInfos, function (s) {
      //return {
      //date: s.transDate +'_' +  s.transIndex,
      //val1: s.TransResult,
      //comment: s.Comment
      //};
      //});

    });


    $scope.delQexTransInfo=function(transDate,transIndex){
      QexHFTransInfoService.delete(transDate, transIndex).success(function () {
        var status = 'Qex Transmission Infomation on \'' + transDate + '\' : \'' + transIndex + '\' was deleted successfully';
        console.log('delete messege=' + status);

        //$window.alert(status);
        $route.reload();
      }).error(function (error) {
        console.log('failed=', error);
      });

    };

    $scope.addQexTransInfo=function(transDate,TransResult,comment) {

      if (transDate!== undefined && TransResult !== undefined ) {
        if(comment === undefined){ comment = '';}
        QexHFTransInfoService.find(transDate).then(function (data) {
          console.log('existList=', data);
          //var existList = data;
          var transIndex;
          if (data.length === 0) {
            transIndex = '1';
          } else {
            var maxTransIndex = _.max(_.map(data,function(d){return d.transIndex;}));
            transIndex = (parseInt(maxTransIndex) + 1).toString();
            console.log('transIndex=',transIndex);
          }

          var qexTransInfo = {
            'transDate': transDate,
            'transIndex': transIndex,
            'TransResult': TransResult,
            'Comment': comment
          };
          //console.log('eiliteMonitorInfo=', eiliteMonitorInfo);

          QexHFTransInfoService.addQexTransInfo(qexTransInfo).success(function (resp) {
            console.log('add qex transmission Info successfully=', resp);
            $route.reload();

          }).error(function (error) {
            console.log('add qex transmission Info failed=', error);
          });


        });

      }
    };

    $scope.showChart = function(dateFrom,dateTo) {

      if (dateFrom===undefined || dateFrom===''){
        QexHFTransInfoService.list().then(function(data){
          console.log('dateFrom=' + dateFrom);
          console.log('data=' +  data.length);
          var qexData= _.map(data, function (s) {
            return {
              date: s.transDate +'_' +  s.transIndex,
              val1: s.TransResult,
              comment: s.Comment
            };
          });
          $window.location.href= '#/qexHFTransInfo/'+ angular.toJson(qexData);

        });
      }else {

        QexHFTransInfoService.findAllBtw2Date(dateFrom, dateTo).then(function (data) {
          console.log('dateFrom=' + dateFrom);
          var qexData= _.map(data, function (s) {
            return {
              date: s.transDate +'_' +  s.transIndex,
              val1: s.TransResult,
              comment: s.Comment
            };
          });
          $window.location.href= '#/qexHFTransInfo/' + angular.toJson(qexData);
        });
      }
      //$scope.status ='';
    };

  });
