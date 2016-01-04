'use strict';


angular
  .module('msvizUiApp', [
    'ngAnimate',
    'ngCookies',
    'ngMessages',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ui.select',
    'thirdparties',
    'environment',
    'fishtones-wrapper',
    'matches-psms',
    'matches-basket',
    'matches-psms-list',
    'matches-protein',
    'searches-list',
    'qcSummary-list',
    'qcSummary-chart',
    'qcSummary-allcharts',
    'qcSummary-upload',
    'matches-modif-filter',
    'multi-searches',
    'psms-alignment',
    'ssm',
    'sequences',
    'experimental',
    'xic',
    'xic-services'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        redirectTo: '/qcSummary'
      })
      .when('/searches', {
        templateUrl: 'scripts/main/searches/searches-list.html',
        controller: 'SearchListCtrl'
      })
      .when('/qcSummary', {
        templateUrl: 'scripts/main/qc/qcSummary-list.html',
        controller: 'QcSummaryListCtrl'
      })
      .when('/qcSummary/:chartId', {
        templateUrl: 'scripts/main/qc/qcSummary-chart.html',
        controller: 'QcSummaryChartCtrl'
      })
      .when('/qcSummaryLoad', {
        templateUrl: 'scripts/main/qc/qcSummary-upload.html',
        //controller: 'QcSummaryLoadCtrl'
      })
      .when('/qcSummaryAllCharts', {
        templateUrl: 'scripts/main/qc/qcSummary-allcharts.html',
        controller: 'QcSummaryAllChartsCtrl'
      })
      .when('/proteins/:searchId', {
        templateUrl: 'scripts/main/searches/proteinsID-list.html',
        controller: 'ProteinIDsListCtrl'
      })
      .when('/compare/:searchIds', {
        templateUrl: 'scripts/main/compare/searches/multi-searches.html',
        controller: 'MultiSearchListCtrl'
      })

     .when('/compare/:searchIds/protein/:proteinAC', {
        templateUrl: 'scripts/main/compare/protein/compare-protein.html',
        controller: 'PsmsAlignmentCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  }).config(['$httpProvider', function($httpProvider) {
    $httpProvider.defaults.useXDomain = true;

    delete $httpProvider.defaults.headers.common['X-Requested-With'];


  }]);
