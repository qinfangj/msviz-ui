'use strict';
angular.module('eliteMonitorInfo', ['thirdparties', 'environment'])

/**
 * @ngdoc service
 * @name service:eliteMonitorInfoService
 * @description
 * Access to eliteMonitorInfo
 *
 */
  .service('popupService',['$window',function($window){
    this.showPopup=function(message){
      return $window.confirm(message); //Ask the users if they really want to delete
    };
  }])
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

      return httpProxy.post('/qc/eliteMonitorInfo', eliteMonitorInfo,{headers: {'Content-Type': undefined}});
    };

    EliteMonitorInfoService.prototype.find = function (monitorDate) {

      return httpProxy.get('/qc/eliteMonitorInfo' + '/'+ monitorDate);
    };

    EliteMonitorInfoService.prototype.findAllBtw2Date = function (monitorDate1,monitorDate2) {

      return httpProxy.get('/qc/eliteMonitorInfo' + '/'+ monitorDate1 + '/' + monitorDate2);
    };

    EliteMonitorInfoService.prototype.delete = function (monitorDate,monitorIndex) {

      return httpProxy.delete('/qc/eliteMonitorInfo' + '/'+ monitorDate + '/' + monitorIndex);
    };

    EliteMonitorInfoService.prototype.updateEliteMonitorInfo = function (eliteMonitorInfo) {

      return httpProxy.put('/qc/eliteMonitorInfo', eliteMonitorInfo, {headers: {'Content-Type': undefined}});
    };

    return new EliteMonitorInfoService();
  })
  .service('LumosMonitorInfoService', function (httpProxy) {

    var LumosMonitorInfoService = function () {
      return this;
    };

    /**
     * @ngdoc method
     * @name matches.service:lumosMonitorInfoService
     * @methodOf service:LumosMonitorInfoService
     * @description get the list of all elite monitor infomation
     * @returns {httpPromise} of an array of string
     */

    LumosMonitorInfoService.prototype.list = function () {

      return httpProxy.get('/qc/lumosMonitorInfo' );
    };
    LumosMonitorInfoService.prototype.addEliteMonitorInfo = function (lumosMonitorInfo) {

      return httpProxy.post('/qc/lumosMonitorInfo', lumosMonitorInfo,{headers: {'Content-Type': undefined}});
    };

    LumosMonitorInfoService.prototype.find = function (monitorDate) {

      return httpProxy.get('/qc/lumosMonitorInfo' + '/'+ monitorDate);
    };

    LumosMonitorInfoService.prototype.findAllBtw2Date = function (monitorDate1,monitorDate2) {

      return httpProxy.get('/qc/lumosMonitorInfo' + '/'+ monitorDate1 + '/' + monitorDate2);
    };

    LumosMonitorInfoService.prototype.delete = function (monitorDate,monitorIndex) {

      return httpProxy.delete('/qc/lumosMonitorInfo' + '/'+ monitorDate + '/' + monitorIndex);
    };

    LumosMonitorInfoService.prototype.updateLumosMonitorInfo = function (lumosMonitorInfo) {

      return httpProxy.put('/qc/lumosMonitorInfo', lumosMonitorInfo, {headers: {'Content-Type': undefined}});
    };

    return new LumosMonitorInfoService();
  })
  .controller('EliteMonitorInfoEditCtrl', function($scope,$window,$route,$routeParams,EliteMonitorInfoService) {

    $scope.title = 'Edit Elite Monitor Infomation';
    $scope.mtpNm1 = 'Multiplier1';
    $scope.mtpNm2 = 'Multiplier2';

    $scope.monitorDate = $routeParams.date;
    $scope.monitorIndex = $routeParams.index;
    $scope.Multiplier1= $routeParams.multiplier1;
    $scope.Multiplier2 = $routeParams.multiplier2;
    $scope.Comment = $routeParams.comment;

    $scope.edit = function() {
      console.log('comment =' +$scope.Comment);
      var eiliteMonitorInfo = {
        'monitorDate': $scope.monitorDate,
        'monitorIndex': $scope.monitorIndex,
        'Multplier1': $scope.Multiplier1,
        'Multplier2': $scope.Multiplier2,
        'Comment': $scope.Comment
      };
      EliteMonitorInfoService.updateEliteMonitorInfo(eiliteMonitorInfo).success(function(resp){
        console.log('update successfully=', resp);


        $window.location.href= '#/eliteMonitorInfo/';

      }).error(function (error) {
        console.log('failed=', error);
      });
    };

  })
  .controller('LumosMonitorInfoEditCtrl', function($scope,$window,$route,$routeParams,LumosMonitorInfoService) {
    $scope.title = 'Edit Lumos Monitor Infomation';
    $scope.mtpNm1 = 'Multiplier';
    $scope.mtpNm2 = 'Transmission';


    $scope.monitorDate = $routeParams.date;
    $scope.monitorIndex = $routeParams.index;
    $scope.Multiplier1= $routeParams.multiplier;
    $scope.Transmission = $routeParams.transmission;
    $scope.Comment = $routeParams.comment;

    $scope.edit = function() {
      console.log('multiplier1 =' +$scope.Multiplier1);
      console.log('Transmission =' +$scope.Transmission);
      console.log('comment =' +$scope.Comment);
      var lumoseMonitorInfo = {
        'monitorDate': $scope.monitorDate,
        'monitorIndex': $scope.monitorIndex,
        'Multplier': $scope.Multiplier1,
        'Transmission': $scope.Transmission,
        'Comment': $scope.Comment
      };
      LumosMonitorInfoService.updateLumosMonitorInfo(lumoseMonitorInfo).success(function(resp){
        console.log('update successfully=', resp);


        $window.location.href= '#/lumosMonitorInfo/';

      }).error(function (error) {
        console.log('failed=', error);
      });
    };

  })
  .controller('EliteMonitorInfoCtrl', function($scope,$route,$rootScope,popupService,$window,EliteMonitorInfoService,QcSummaryService,QcDevInfoService) {

    $scope.title ='Elite Monitor Infomation';

    $scope.mtpNm1 = 'Multiplier1';
    $scope.mtpNm2 = 'Multiplier2';


    $scope.reDate = /^[0-9]{8}$/;
    $scope.reNumber = /\d*\.?\d+/;

    EliteMonitorInfoService.list().then(function(data){
      $scope.eliteMonitorInfos = data;
      //$scope.eliteData= _.map($scope.eliteMonitorInfos, function (s) {
        //return {
          //date: s.monitorDate +'_' +  s.monitorIndex,
          //val1: s.Multplier1,
          //val2: s.Multplier2,
          //comment: s.Comment
        //};
      //});

    });



    $scope.delEliteMonitorInfo=function(monitorDate,monitorIndex){
      if (popupService.showPopup('Really delete this?')) {
        EliteMonitorInfoService.delete(monitorDate, monitorIndex).success(function () {
          var status = 'Elite Monitor Infomation on \'' + monitorDate + '\' : \'' + monitorIndex + '\' was deleted successfully';
          console.log('delete messege=' + status);

          //$window.alert(status);
          $route.reload();
        }).error(function (error) {
          console.log('failed=', error);
        });
      }

    };
    $scope.go=function(monitorDate,monitorIndex,multiplier1,multiplier2,comment){

      $window.location.href='#/eliteMonitorInfo/edit?date='+ monitorDate + '&index=' + monitorIndex + '&multiplier1=' + multiplier1 + '&multiplier2=' + multiplier2 + '&comment=' + comment;


    };

    $scope.addMonitorInfo=function(monitorDate,multiplier1,multiplier2,comment) {

      if (monitorDate!== undefined && multiplier1 !== undefined && multiplier2 !== undefined) {
        if(comment === undefined){ comment = '';}
        EliteMonitorInfoService.find(monitorDate).then(function (data) {
          console.log('existList=', data);
          //var existList = data;
          var monitorIndex;
          if (data.length === 0) {
            monitorIndex = '1';
          } else {
            var maxMonitorIndex = _.max(_.map(data,function(d){return d.monitorIndex;}));
            monitorIndex = (parseInt(maxMonitorIndex) + 1).toString();
            console.log('monitorIndex=',monitorIndex);
          }

          var eiliteMonitorInfo = {
            'monitorDate': monitorDate,
            'monitorIndex': monitorIndex,
            'Multplier1': multiplier1,
            'Multplier2': multiplier2,
            'Comment': comment
          };
          //console.log('eiliteMonitorInfo=', eiliteMonitorInfo);

          EliteMonitorInfoService.addEliteMonitorInfo(eiliteMonitorInfo).success(function (resp) {
            console.log('add elite monitor Info successfully=', resp);
            $route.reload();

          }).error(function (error) {
            console.log('add elite monitor Info failed=', error);
          });


        });

      }
    };

    $scope.showChart = function(dateFrom,dateTo) {

      if (dateFrom===undefined || dateFrom===''){
        EliteMonitorInfoService.list().then(function(data){
          console.log('dateFrom=' + dateFrom);
          console.log('data=' +  data.length);
          //get eliteData without dates restrict
          var eliteData= _.map(data, function (s) {
            return {
              date: s.monitorDate +'_' +  s.monitorIndex,
              val1: s.Multplier1,
              val2: s.Multplier2,
              comment: s.Comment
            };
          });
          $rootScope.eliteData = eliteData;
        });
        QcSummaryService.list().then(function(summaries){

          $rootScope.summaries = summaries;

        });
        QcDevInfoService.list().then(function(devInfo){

          $rootScope.devInfo = devInfo;

        });

      }else {

        EliteMonitorInfoService.findAllBtw2Date(dateFrom, dateTo).then(function (data) {
          console.log('dateFrom=' + dateFrom);
          var eliteData= _.map(data, function (s) {
            return {
              date: s.monitorDate +'_' +  s.monitorIndex,
              val1: s.Multplier1,
              val2: s.Multplier2,
              comment: s.Comment
            };
          });
          $rootScope.eliteData = eliteData;
        });
        QcSummaryService.findAllBtw2Date(dateFrom,dateTo).then(function(summaries){

          $rootScope.summaries = summaries;

        });
        QcDevInfoService.findDevInfoBtw2Date(dateFrom,dateTo).then(function(devInfo){

          $rootScope.devInfo = devInfo;

        });
      }
      $window.location.href= '#/eliteMonitorInfo/chart';
    };

  })
  .controller('LumosMonitorInfoCtrl', function($scope,$route,popupService, $window,LumosMonitorInfoService) {

    $scope.title ='Lumos Monitor Infomation';


    $scope.reDate = /^[0-9]{8}$/;
    $scope.reNumber = /\d*\.?\d+/;

    LumosMonitorInfoService.list().then(function(data){
      //$scope.lumosMonitorInfos = data;
      $scope.lumosMonitorInfos= _.map(data, function (s) {
      return {
        'monitorDate': s.monitorDate,
        'monitorIndex': s.monitorIndex,
        'Multplier': s.Multplier,
        'Transmission': s.Transmission ,
        'Comment': $scope.Comment
      };
      });

    });



    $scope.delEliteMonitorInfo=function(monitorDate,monitorIndex){
      if (popupService.showPopup('Really delete this?')) {
        LumosMonitorInfoService.delete(monitorDate, monitorIndex).success(function () {
          var status = 'Elite Monitor Infomation on \'' + monitorDate + '\' : \'' + monitorIndex + '\' was deleted successfully';
          console.log('delete messege=' + status);

          //$window.alert(status);
          $route.reload();
        }).error(function (error) {
          console.log('failed=', error);
        });
      }

    };

    $scope.go=function(monitorDate,monitorIndex,multiplier,transmission,comment){

      $window.location.href='#/lumosMonitorInfo/edit?date='+ monitorDate + '&index=' + monitorIndex + '&multiplier=' + multiplier + '&transmission=' + transmission + '&comment=' + comment;


    };

    $scope.addMonitorInfo=function(monitorDate,multiplier,transmission,comment) {

      if (monitorDate!== undefined && multiplier !== undefined && transmission !== undefined) {
        if(comment === undefined){ comment = '';}
        LumosMonitorInfoService.find(monitorDate).then(function (data) {
          console.log('existList=', data);
          //var existList = data;
          var monitorIndex;
          if (data.length === 0) {
            monitorIndex = '1';
          } else {
            var maxMonitorIndex = _.max(_.map(data,function(d){return d.monitorIndex;}));
            monitorIndex = (parseInt(maxMonitorIndex) + 1).toString();
            console.log('monitorIndex=',monitorIndex);
          }

          var eiliteMonitorInfo = {
            'monitorDate': monitorDate,
            'monitorIndex': monitorIndex,
            'Multplier': multiplier,
            'Transmission': transmission,
            'Comment': comment
          };
          console.log('eiliteMonitorInfo=', eiliteMonitorInfo);

          LumosMonitorInfoService.addEliteMonitorInfo(eiliteMonitorInfo).success(function (resp) {
            console.log('add elite monitor Info successfully=', resp);
            $route.reload();

          }).error(function (error) {
            console.log('add elite monitor Info failed=', error);
          });


        });

      }
    };

    $scope.showChart = function(dateFrom,dateTo) {

      if (dateFrom===undefined || dateFrom===''){
        LumosMonitorInfoService.list().then(function(data){
          console.log('dateFrom=' + dateFrom);
          console.log('data=' +  data.length);
          var lumosData= _.map(data, function (s) {
            return {
              date: s.monitorDate +'_' +  s.monitorIndex,
              val1: s.Multplier,
              val2: s.Transmission,
              comment: s.Comment
            };
          });
          $window.location.href= '#/lumosMonitorInfo/'+ angular.toJson(lumosData);
        });
      }else {

        LumosMonitorInfoService.findAllBtw2Date(dateFrom, dateTo).then(function (data) {
          console.log('dateFrom=' + dateFrom);
          var lumosData= _.map(data, function (s) {
            return {
              date: s.monitorDate +'_' +  s.monitorIndex,
              val1: s.Multplier,
              val2: s.Transmission,
              comment: s.Comment
            };
          });
          $window.location.href= '#/lumosMonitorInfo/' + angular.toJson(lumosData);
        });
      }
    };

  });
