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
    'checklist-model',
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
    'qcDevInfo-edit',
    'eliteMonitorInfo',
    'eliteMonitorChart',
    'qexTransInfo',
    'qexTransChart',
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
        templateUrl: 'scripts/main/qc/qcSummary-upload.html'
        //controller: 'QcSummaryLoadCtrl'
      })
      .when('/eliteMonitorInfo', {
        templateUrl: 'scripts/main/qc/eliteMonitorInfo.html',
        controller: 'EliteMonitorInfoCtrl'
      })
      .when('/eliteMonitorInfo/edit', {
        templateUrl: 'scripts/main/qc/eliteMonitorInfoEdit.html',
        controller: 'EliteMonitorInfoEditCtrl'
      })
      .when('/eliteMonitorInfo/chart', {
        templateUrl: 'scripts/main/qc/eliteMonitorChart.html',
        controller: 'EliteMonitorChartCtrl'
      })
      .when('/lumosMonitorInfo', {
        templateUrl: 'scripts/main/qc/lumosMonitorInfo.html',
        controller: 'LumosMonitorInfoCtrl'
      })
      .when('/lumosMonitorInfo/edit', {
        templateUrl: 'scripts/main/qc/eliteMonitorInfoEdit.html',
        controller: 'LumosMonitorInfoEditCtrl'
      })
      .when('/lumosMonitorInfo/:data', {
        templateUrl: 'scripts/main/qc/lumosMonitorChart.html',
        controller: 'LumosMonitorChartCtrl'
      })
      .when('/qexTransInfo', {
        templateUrl: 'scripts/main/qc/qexTransInfo.html',
        controller: 'QexTransInfoCtrl'
      })
      .when('/qexTransInfo/chart', {
        templateUrl: 'scripts/main/qc/qexTransChart.html',
        controller: 'QexTransChartCtrl'
      })
      //.when('/qexTransInfo/chart', {
      //  templateUrl: 'scripts/main/qc/qexTransChart.html',
      //  controller: 'QexTransChartCtrl'
      //})
      .when('/qexHFTransInfo', {
        templateUrl: 'scripts/main/qc/qexTransInfo.html',
        controller: 'QexHFTransInfoCtrl'
      })
      .when('/qexHFTransInfo/:data', {
        templateUrl: 'scripts/main/qc/qexTransChart.html',
        controller: 'QexHFTransChartCtrl'
      })
      .when('/qcDeviceInfoEdit', {
        templateUrl: 'scripts/main/qc/qcDevInfo-edit.html',
        controller: 'QcDeviceInfoEditCtrl'
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
