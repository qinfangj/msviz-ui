'use strict';
angular.module('qcSummary-delete', ['thirdparties', 'environment'])
/**
 * @ngdoc service
 * @name service:QcSummaryDelete
 * @description
 * Delete qcSummaryEntries
 *
 */
  .config(['$httpProvider', function($httpProvider) {
    $httpProvider.defaults.useXDomain = true;
    //delete $httpProvider.defaults.headers.common['X-Requested-With'];
    //$httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
  }])
  .service('QcSummaryDelete', function ($http) {

    /**
     * @ngdoc method
     * @name matches.service:QcSummaryDelete#deleteAllBtw2Date
     * @methodOf service:QcSummaryDelete
     * @description delete all qcSummaries bewteen 2 dates
     * @returns success or error
     */


    this.deleteQcSummaryBtw2Date = function (dateFrom,dateTo) {
      console.log('go to httpProxy====');

      $http.delete('http://localhost:9000/qc/summary' + '/'+ dateFrom + '/' + dateTo
      ).success(function(resp){
        console.log('Success', resp);
      })
        .error(function(resp){
          console.log('fail', resp);
        });
    };

  }

)

  .controller('QcSummaryDeleteCtrl', function($scope, QcSummaryDelete){

    $scope.deleteQcSummary = function(dateFrom,dateTo) {

      if (dateFrom !=='' && dateTo !==''){
        //console.log('dateFrom='+dateFrom +' dateTo='+ dateTo);

        QcSummaryDelete.deleteQcSummaryBtw2Date(dateFrom, dateTo);


      }
    };


});

