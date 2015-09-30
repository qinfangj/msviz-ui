'use strict';

/* Controllers */
 google.load('visualization', '1', {
  packages: ['corechart']
});

 //google.setOnLoadCallback(function () {
  //angular.bootstrap(document.body, ['qcSummary-chart']);
//});

angular.module('qcSummary-chart', ['thirdparties', 'environment'])

  .controller('QcSummaryChartCtrl', function($scope,$routeParams) {


    $scope.chartId = $routeParams.chartId;
    console.log('chartId='+ $scope.chartId);
    //var summaryMS=[];
    var summaries = JSON.parse($routeParams.data);
    console.log('summaries='+ summaries);
    if ($scope.chartId ==='MS') {
      var groupSummary = _.groupBy(summaries, function(value){
        return value.rawfileInfomation.Date;
      });
      var dataMS = _.map(groupSummary, function(g){
        return {
          date: g[0].rawfileInfomation.Date,
          MS: _.pluck(g, 'MS'),
          len:_.pluck(g, 'MS').length,
          avg: _.reduce(_.pluck(g, 'MS'), function(memo, num) {return memo + num;}, 0) / (_.pluck(g, 'MS').length === 0 ? 1 : _.pluck(g, 'MS').length)
        };
      });


      var maxLen= _.max(_.pluck(dataMS, 'len'));
      $scope.maxLen=maxLen.toString();
      //console.log(maxLen);

      _.map(dataMS,function(elm,dataMS){
        for (var j=elm.len;j<maxLen;j++){
          elm.MS.push(null);
        }
        elm.MS.push(elm.avg);
        return dataMS;
      });
      var zipData=_.zip(_.pluck(dataMS,'date'),(_.pluck(dataMS,'MS')));
      console.log(zipData);

      var dataPre= _.map(zipData,function(s){
        console.log(_.flatten(s));
        return _.flatten(s);
      });
      //console.log(_.values(dataPre));


      var msHeadArr=[];

      msHeadArr[0]='Date';
      for (var i=1;i<=maxLen;i++)
      {msHeadArr[i]='val'+i;}
      msHeadArr[maxLen+1]='avg';


      var newArray = [];
      newArray.push(msHeadArr);
      console.log(newArray);

      _.map(dataPre,function(value){
        newArray.push(value);

      });
      //$scope.newArray=newArray;
    }


      //var data = google.visualization.arrayToDataTable([
        //['Month', 'val1', 'val2', 'val3','Average'],
        //['150507',  165,      938,         522,      541.6],
        //['150520',  135,      1120,        ,      627],
        //['150525',  200,  ,, 200]
      //]);
    var data = google.visualization.arrayToDataTable(newArray);

      var options = {
        title : 'Quality Control by Date',
        vAxis: {title: $scope.chartId},
        hAxis: {title: 'Dates'},
        seriesType: 'scatter',
        series: {4: {type: 'line'}}
      };


      var chart = new google.visualization.ComboChart(document.getElementById('chartdiv'));
      chart.draw(data, options);



  });
