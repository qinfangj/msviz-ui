
/**
 * Created by qjolliet on 25/07/16.
 */
'use strict';
/* Controllers */
angular.module('qexTransChart', ['thirdparties', 'environment'])

  .controller('QexTransChartCtrl',function($scope,$routeParams,$rootScope,$window) {

    $scope.title = 'Qex Transmission Chart';

    //console.log(qexData);

    $scope.qex = $rootScope.qexData;

    //filter summaries using 'Elite' machine
    var summaries = _.filter($rootScope.summaries,function(o){
      return (o.rawfileInfomation.machineName ==='Qex'&& o.selFlg === true);
    });

    console.log('summaries=' + summaries);
    //device cleaning infomation
    $scope.devInfos=_.filter($rootScope.devInfo,function(d){
      return d.devType ==='Qex';
    });

    $scope.pepseqidfScatData = _.map(summaries, function (s) {
      return {
        rawfileName: s.rawfileInfomation.proteinName + '_' + s.rawfileInfomation.pQuantity + '_' + s.rawfileInfomation.machineName +
        '_' + s.rawfileInfomation.columnType + '_' + s.rawfileInfomation.Date + '_' + s.rawfileInfomation.Index,
        date: s.rawfileInfomation.Date,
        val: s.PeptideSeq
      };
    });
    var groupSummary = _.groupBy(summaries, function (value) {
      return value.rawfileInfomation.Date;
    });

    //Get average value array per day
    $scope.pepseqidfLineData = _.map(groupSummary, function (g) {
      return {
        date: g[0].rawfileInfomation.Date,
        avg: _.reduce(_.pluck(g, 'PeptideSeq'), function (memo, num) {
          return memo + num;
        }, 0) / (_.pluck(g, 'PeptideSeq').length === 0 ? 1 : _.pluck(g, 'PeptideSeq').length)
      };
    });

    $scope.figLen = window.outerWidth*0.45;

    $scope.$back = function() {
      $window.location.href= '#/qexTransInfo';
    };
  })
  .controller('QexHFTransChartCtrl', function($scope,$routeParams,$window) {
    $scope.title = 'QexHF Transmission Chart';

    var qexData = JSON.parse($routeParams.data);
    $scope.qexData = qexData;
    //console.log(qexData);

    $scope.$back = function() {
      $window.location.href= '#/qexHFTransInfo';
    };
  })
  .directive('qexChart',function(d3) {
    return {
      restrict: 'E',
      template: '<svg width="1100" height="600"></svg>',
      link: function (scope, elem, attrs) {

        var qexData;
        var figLen = scope.figLen;
        scope.$watch('qex', function (value) {
          if (value) {
            console.log(value);
            qexData = value;
            console.log(value.length);

            var rawSvg = elem.find('svg');
            //var svg = d3.select(rawSvg[0]);

            //Define the margin,width,height
            var margin = {top: 30, right: 150, bottom: 70, left: 80},
              width = figLen - margin.left - margin.right,
              height = 600 - margin.top - margin.bottom;

            // Set the ranges x


            var x = d3.scale.ordinal();
            var domainX = qexData.map(function (d) {
              return d.date;
            });

            x.domain(_.sortBy(domainX, function (num) {
              return num;
            }))
              .rangePoints([0, width]);
            //.domain(d3.range(qexData.length))
            //.rangeRoundBands([0, width], 0.05);

            // Define the axes
            var xAxis = d3.svg.axis()
              .scale(x)
              .tickFormat(function (d) {
                return d.slice(0, 8);
              })
              .orient('bottom');

            // Scale the range of the data Y
            var y = d3.scale.linear().range([height, 0]);

            y.domain([d3.min(qexData, function (d) {
              return d.val1;
            }) * 0.9, d3.max(qexData, function (d) {
              return d.val1;
            }) * 1.1]);
            console.log('max val ' + d3.max(qexData, function (d) {
                return d.val1;
              }));
            var yAxis = d3.svg.axis().scale(y)
              .orient('left')
              .tickFormat(function (d) {
                return d * 100 + '%';
              })
              .ticks(7);

            //var svg = d3.select('body').append('svg')
            // Create SVG element
            var svg = d3.select(rawSvg[0])
              .attr('width', width + margin.left + margin.right)
              .attr('height', height + margin.top + margin.bottom)
              .append('g')
              .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

            // add the tooltip area to the webpage
            var tooltip = d3.select('body').append('div')
              .attr('class', 'tooltip')
              .style('opacity', 0);

            var color = d3.scale.ordinal()
              .range(['blue', 'red']);
            color.domain(d3.keys(qexData[0]).filter(function (key) {
              return key !== 'date' && key !== 'comment';
            }));
            console.log('color domain' + color.domain().slice());

            // Define lines
            var line1 = d3.svg.line()
              .x(function (d) {
                return x(d.date);
              })
              .y(function (d) {
                return y(d.val1);
              });

            var pathContainers = svg.selectAll('g.line')
              .data(qexData);

            pathContainers.enter().append('g')
              .attr('class', 'line');

            pathContainers.selectAll('path')
              .data(function (d) {
                return [d];
              }) // continues the data from the pathContainer
              .enter().append('path')
              .attr('d', line1(qexData))
              .attr('fill', 'none')
              .attr('stroke', 'blue');

            pathContainers.selectAll('.dot')
              .data(qexData)
              .enter().append('circle')
              .attr('class', 'dot')
              .attr('r', 4)
              .attr('cx', function (d) {
                return x(d.date);
              })
              .attr('cy', function (d) {
                return y(d.val1);
              })
              .attr('fill', 'orange')
              .on('mouseover', function (d) {
                tooltip.transition()
                  .duration(200)
                  .style('opacity', 0.8);
                tooltip.html('<table><tr><td style="font-weight: bold;text-underline;" >' + d.date.slice(0, 8) + '</td></tr><tr><td>#Transmission Result' + ': ' + d.val1 * 100 + '%</td></tr></table>')
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
              .text('Values');

            // add legend
            var legend = svg.selectAll('.legend')
              .data(color.domain().slice().reverse())
              .enter().append('g')
              .attr('class', 'legend')
              .attr('transform', function (d, i) {
                return 'translate(0,' + i * 20 + ')';
              });

            legend.append('rect')
              .attr('x', width + 10)
              .attr('y', 25)
              .attr('width', 10)
              .attr('height', 10)
              .style('fill', color);

            legend.append('text')
              .attr('x', width + 25)
              .attr('y', 33)
              .attr('height', 30)
              .attr('width', 100)
              .text('Transmission Result');

            _.map(qexData, function (d) {

              if (d.comment !== '' && d.comment !== undefined) {
                svg.append('line')          // attach a line
                  .style('stroke', 'green')  // colour the line
                  .attr('stroke-width', 2)
                  .attr('x1', x(d.date))     // x position of the first end of the line
                  .attr('y1', 0)            // y position of the first end of the line
                  .attr('x2', x(d.date))        // x position of the second end of the line
                  .attr('y2', height)
                  .on('mouseover', function () {
                    tooltip.transition()
                      .duration(200)
                      .style('opacity', 1.0);
                    tooltip.html('Qex Tranmission Infomation:<br>' + d.comment)
                      .style('left', (d3.event.pageX) + 'px')
                      .style('top', (d3.event.pageY - 30) + 'px')
                    ;
                  })
                  .on('mouseout', function () {
                    tooltip.transition()
                      .duration(500)
                      .style('opacity', 0);
                  });

              }

            });

          }
        });
      }
    };
  });
