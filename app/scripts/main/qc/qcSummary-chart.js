'use strict';

/* Controllers */
angular.module('qcSummary-chart', ['thirdparties', 'environment'])

  .controller('QcSummaryChartCtrl', function($scope,$routeParams) {

    $scope.$back = function() {
      window.history.back();
    };

    var summaries = JSON.parse($routeParams.data);
    var devInfos = JSON.parse($routeParams.dev);
    console.log(devInfos);
    //var groupSummary;
    //console.log('summaries=' + summaries);
    var title,colName,max,min;
    if ($routeParams.chartId === 'MS') {
      title='MS';
      colName='MS';
    }else if ($routeParams.chartId === 'MMS'){
      title='MS/MS';
      colName='MMS';
    }else if ($routeParams.chartId === 'MmsIdentify'){
      title='MS/MS Identified';
      colName='MmsIdentify';
    }else if ($routeParams.chartId === 'PeptideSeq'){
      title='Peptide Sequences Identified';
      colName='PeptideSeq';
    }else if ($routeParams.chartId === 'MMSIdentifyPtg'){
      title='MS/MS Identified [%]';
      colName='MMSIdentifyPtg';
    }else if ($routeParams.chartId === 'PkRepSeqPtg'){
      title='Peaks Repeatedly Sequenced [%]';
      max=7.0;
      min=5.0;
      colName='PkRepSeqPtg';
    }

    var getChartInfo=function(title,colName,data,dev,maxLimit,minLimit){
      $scope.chartId = title;
      $scope.maxLimit=maxLimit;
      $scope.minLimit=minLimit;
      $scope.devInfos=dev;
      $scope.scatterData= _.map(data, function (s) {
        return {
          rawfileName: s.rawfileInfomation.proteinName + '_'+ s.rawfileInfomation.pQuantity + '_' + s.rawfileInfomation.machineName +
          '_' + s.rawfileInfomation.columnType +'_'+s.rawfileInfomation.Date + '_' + s.rawfileInfomation.Index,
          date: s.rawfileInfomation.Date,
          val: s[colName]
        };
      });
      var groupSummary = _.groupBy(data, function (value) {
        return value.rawfileInfomation.Date;
      });

    //Get average value array per day
      $scope.lineData = _.map(groupSummary, function (g) {
        return {
          date: g[0].rawfileInfomation.Date,
          avg: _.reduce(_.pluck(g, colName), function (memo, num) {
            return memo + num;
          }, 0) / (_.pluck(g, colName).length === 0 ? 1 : _.pluck(g, colName).length)
        };
      });
    };

    getChartInfo(title,colName,summaries,devInfos,max,min);
    console.log('title=' + title);
    console.log('colName=' + colName);
    //console.log('devInfos='+$scope.devInfos);
  })
  .directive('comboChart',function(d3){
    return {

      restrict: 'E',
      template: '<svg width="1100" height="600"></svg>',
      link: function (scope, elem, attrs) {
        //console.log('scatterData2='+scope.lineData);
        var devInfos=scope.devInfos;
        var scatterData=scope[attrs.scatterData];
        var lineData=scope[attrs.lineData];
        //console.log('devInfos='+devInfos);

        var rawSvg=elem.find('svg');
        //var svg = d3.select(rawSvg[0]);

        //Define the margin,width,height
        var margin = {top: 30, right: 150, bottom: 70, left: 80},
          width = 1100 - margin.left - margin.right,
          height = 600 - margin.top - margin.bottom;

        // Set the ranges x
        var x = d3.scale.ordinal();

        // Define the axes
        var xAxis = d3.svg.axis()
          .scale(x)
          .orient('bottom');


        //var yValue = function(d) { return d.close;};// data -> value

        // Scale the range of the data Y
        var y = d3.scale.linear().range([height, 0]);

        var yAxis = d3.svg.axis().scale(y)
          .orient('left').ticks(7);

        //var svg = d3.select('body').append('svg')
        var svg = d3.select(rawSvg[0])
          .attr('width', width + margin.left + margin.right)
          .attr('height', height + margin.top + margin.bottom)
          .append('g')
          .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

        // add the tooltip area to the webpage
        var tooltip = d3.select('body').append('div')
          .attr('class', 'tooltip')
          .style('opacity', 0);

        var domainX= scatterData.map(function (d) {
          return d.date;
        }).concat(devInfos.map(function(i){return i.devDate;}));

        console.log(domainX);
        // Scale the range of the data X,Y
        x.domain(_.sortBy(domainX,function(num){return num;}))
          .rangePoints([0, width]);

        y.domain([d3.min(scatterData, function (d) {
          return d.val;
        })*0.9, d3.max(scatterData, function (d) {
          return d.val;
        })*1.1]);
        console.log('max val ' + d3.max(scatterData, function (d) {
            return d.val;
          }));


        //svg.append('line')          // attach a line
        //  .style('stroke', 'red')  // colour the line
        //  .attr('x1', 0)     // x position of the first end of the line
        //  .attr('y1', y(scope.maxLimit))      // y position of the first end of the line
        //  .attr('x2', width)     // x position of the second end of the line
        //  .attr('y2', y(scope.maxLimit));    // y position of the second end of the line

        //svg.append('line')          // attach a line
        //  .style('stroke', 'red')  // colour the line
        //  .attr('x1', 0)     // x position of the first end of the line
        //  .attr('y1', y(scope.minLimit))      // y position of the first end of the line
        //  .attr('x2', width)     // x position of the second end of the line
        //  .attr('y2', y(scope.minLimit));    // y position of the second end of the line

/*
        //gradient setting
        svg.append('linearGradient')
          .attr('id', 'dot-gradient')
          .attr('gradientUnits', 'userSpaceOnUse')
          .attr('x1', 0).attr('y1', y(7600))
          .attr('x2', 0).attr('y2', y(8050))
          .selectAll('stop')
          .data([
            {offset: '0%', color: 'black'},
            {offset: '50%', color: 'black'},
            {offset: '50%', color: 'red'},
            {offset: '100%', color: 'red'}
          ])
          .enter().append('stop')
          .attr('offset', function (d) {
            return d.offset;
          })
          .attr('stop-color', function (d) {
            return d.color;
          });
*/

        // Add the valueline path.
        var lineFunc = d3.svg.line()
          .x(function (d) {
            return x(d.date);
          })
          .y(function (d) {
            return y(d.avg);
          })
          .interpolate('linear');
        svg.append('path')
          //.attr("class", "line")
          .attr('d', lineFunc(lineData))
          .attr('stroke', 'black')
          .attr('stroke-width', 2)
          .attr('fill', 'none');

        // draw dots
        svg.selectAll('.dot')
          .data(scatterData)
          .enter().append('circle')
          .attr('class', 'dot')
          .attr('r', 4)
          .attr('cx', function (d) {
            return x(d.date);
          })
          .attr('cy', function (d) {
            return y(d.val);
          })
          .attr('fill', 'orange')
          .on('mouseover', function (d) {
            tooltip.transition()
              .duration(200)
              .style('opacity', 0.9);
            tooltip.html(d.rawfileName + '<br/>'+ scope.chartId +':' + d.val )
              .style('left', (d3.event.pageX + 5) + 'px')
              .style('top', (d3.event.pageY - 28) + 'px');
          })
          .on('mouseout', function () {
            tooltip.transition()
              .duration(500)
              .style('opacity', 0);
          });


        // Add the X Axis
        svg.append('g')
          .attr('class', 'x axis')
          .attr('transform', 'translate(0,' + height + ')')
          .call(xAxis)

          .selectAll('text')

          .style('text-anchor', 'end')

          .attr('dx', '-.10em')

          .attr('dy', '.15em')

          .attr('transform', function () {

            return 'rotate(-30)';

          });

        // Add the Y Axis
        svg.append('g')
          .attr('class', 'y axis')
          .call(yAxis);


        _.map(devInfos,function(info){

           svg.append('line')          // attach a line
          .style('stroke', 'green')  // colour the line
          .attr('stroke-width', 2)
          .attr('x1', x(info.devDate))     // x position of the first end of the line
          .attr('y1', 0)            // y position of the first end of the line
          .attr('x2', x(info.devDate))        // x position of the second end of the line
          .attr('y2', height)
             .on('mouseover', function () {
               tooltip.transition()
                 .duration(200)
                 .style('opacity', 1.0);
               tooltip.html('Device '+ info.devType +' Information:<br>'+ info.devInfo  )
                 .style('left', (d3.event.pageX) + 'px')
                 .style('top', (d3.event.pageY - 30) + 'px')
               ;})
             .on('mouseout', function () {
               tooltip.transition()
                 .duration(500)
                 .style('opacity', 0);
             });

        });   // y position of the second end of the line


        if (scope.chartId==='Peaks Repeatedly Sequenced [%]'){
          svg.append('line')          // attach a line
            .style('stroke', 'red')  // colour the line
            .attr('x1', 0)     // x position of the first end of the line
            .attr('y1', y(scope.maxLimit))      // y position of the first end of the line
            .attr('x2', width)     // x position of the second end of the line
            .attr('y2', y(scope.maxLimit));    // y position of the second end of the line

          svg.append('line')          // attach a line
            .style('stroke', 'pink')  // colour the line
            .attr('x1', 0)     // x position of the first end of the line
            .attr('y1', y(scope.minLimit))      // y position of the first end of the line
            .attr('x2', width)     // x position of the second end of the line
            .attr('y2', y(scope.minLimit));    // y position of the second end of the line
        }else {
          var lineStatistic = d3.svg.line()
            .x(function (d) {
              return x(d.date);
            })
            .y(function (d) {
              return y(d.val);
            });

          var medianValue = d3.median(scatterData.map(function (d) {
            return d.val;
          }));
          console.log('medianValue=' + medianValue);

          var deviationValue = d3.deviation(scatterData.map(function (d) {
            return d.val;
          }));
          console.log('deviationValue=' + deviationValue);

          var medianData = [{date: scatterData[0].date, val: medianValue},
            {date: scatterData[scatterData.length - 1].date, val: medianValue}];

          svg.append('path')
            .datum(medianData)
            .attr('class', 'meanline')
            .attr('d', lineStatistic);

          var sdMaxData = [{date: scatterData[0].date, val: medianValue + deviationValue},
            {date: scatterData[scatterData.length - 1].date, val: medianValue + deviationValue}];

          svg.append('path')
            .datum(sdMaxData)
            .attr('class', 'sdline max')
            .attr('d', lineStatistic);

          var sdMinData = [{date: scatterData[0].date, val: medianValue - deviationValue},
            {date: scatterData[scatterData.length - 1].date, val: medianValue - deviationValue}];
          // svg.select(".min").data([sdMinData]).attr("d", lineStatistic);

          svg.append('path')
            .datum(sdMinData)
            .attr('class', 'sdline min')
            .attr('d', lineStatistic);

          svg.append('text')
            .attr('x', width)
            .attr('y', y(medianValue))
            .attr('dy', '.35em')
            .attr('class', 'meanline-label')
            .text('Median: ' + medianValue.toFixed(2) );

          svg.append('text')
            .attr('x', width)
            .attr('y', y(medianValue + deviationValue))
            .attr('dy', '.35em')
            .attr('class', 'sdline-label')
            .text('+1 SD: ' + (medianValue + deviationValue).toFixed(2) );

          svg.append('text')
            .attr('x', width)
            .attr('y', y(medianValue - deviationValue))
            .attr('dy', '.35em')
            .attr('class', 'sdline-label')
            .text('-1 SD: ' + (medianValue - deviationValue).toFixed(2) );
        }



        //set X axis label
        svg.append('text')
          //.attr('class', 'label')
          .attr('x', width / 2)
          .attr('y', height + margin.bottom)
          //.attr('dx', '1em')
          //.style("font-size", "16px")
          .style('text-anchor', 'middle')
          .text('Dates');

        //set Y axis label
        svg.append('text')
          .attr('transform', 'rotate(-90)')
          .attr('y', 0 - margin.left)
          .attr('x', 0 - (height / 2))
          .attr('dy', '1em')
          .style('text-anchor', 'middle')
          .text(scope.chartId);

      }
  };

});


