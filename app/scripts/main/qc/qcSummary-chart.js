'use strict';

/* Controllers */
angular.module('qcSummary-chart', ['thirdparties', 'environment'])

  .controller('QcSummaryChartCtrl', function($scope,$routeParams) {

    $scope.chartId = $routeParams.chartId;
    console.log('chartId=' + $scope.chartId);
    //var summaryMS=[];
    var summaries = JSON.parse($routeParams.data);
    //console.log('summaries=' + summaries);
    if ($scope.chartId === 'MS') {
      //select MS data per entry
      $scope.scatterData= _.map(summaries, function (s) {
        return {
          date: s.rawfileInfomation.Date,
          ms: s.MS
        };
      });
      //console.log('msData=' + $scope.scatterData);
      //get avg Ms data per date
      var groupSummary = _.groupBy(summaries, function (value) {
        return value.rawfileInfomation.Date;
      });
      $scope.lineData = _.map(groupSummary, function (g) {
        return {
          date: g[0].rawfileInfomation.Date,
          avg: _.reduce(_.pluck(g, 'MS'), function (memo, num) {
            return memo + num;
          }, 0) / (_.pluck(g, 'MS').length === 0 ? 1 : _.pluck(g, 'MS').length)
        };
      });
      //console.log('avgMsData=' + $scope.lineData);
    }
  })
  .directive('comboChart',function(){
    return {

      restrict: 'E',
      template: "<svg width='960' height='500'></svg>",
      link: function (scope, elem, attrs) {
        console.log('scatterData2='+scope.lineData);
        var scatterData=scope[attrs.scatterData];
        var lineData=scope[attrs.lineData];
        console.log('scatterData='+lineData);

        //var d3 = $window.d3;
        var rawSvg=elem.find('svg');
        //var svg = d3.select(rawSvg[0]);

        //Define the margin,width,height
        var margin = {top: 30, right: 20, bottom: 70, left: 80},
          width = 960 - margin.left - margin.right,
          height = 500 - margin.top - margin.bottom;

        //var xValue = function(d) { return d.date;};// data -> value
        //var xValue = function(d) { return d.date;};// data -> value

        // Set the ranges x
        var x = d3.scale.ordinal();

        // Define the axes
        var xAxis = d3.svg.axis().scale(x)
          .scale(x)
          .orient('bottom');


        //var yValue = function(d) { return d.close;};// data -> value

        // Scale the range of the data Y
        var y = d3.scale.linear().range([height, 0]);

        var yAxis = d3.svg.axis().scale(y)
          .orient('left').ticks(5);

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

        // Scale the range of the data X,Y
        x.domain(scope.scatterData.map(function (d) {
          return d.date;
        }))
          .rangePoints([width, 0]);
        y.domain([d3.min(scatterData, function (d) {
          return d.ms;
        }) - 50, d3.max(scatterData, function (d) {
          return d.ms;
        })]);
        console.log('max ms ' + d3.max(scatterData, function (d) {
            return d.ms;
          }));


        svg.append('line')          // attach a line
          .style('stroke', 'red')  // colour the line
          .attr('x1', 0)     // x position of the first end of the line
          .attr('y1', y(8000))      // y position of the first end of the line
          .attr('x2', width)     // x position of the second end of the line
          .attr('y2', y(8000));    // y position of the second end of the line

        svg.append('line')          // attach a line
          .style('stroke', 'red')  // colour the line
          .attr('x1', 0)     // x position of the first end of the line
          .attr('y1', y(6000))      // y position of the first end of the line
          .attr('x2', width)     // x position of the second end of the line
          .attr('y2', y(6000));    // y position of the second end of the line

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
            return y(d.ms);
          })
          .attr('fill', 'orange')
          .on('mouseover', function (d) {
            tooltip.transition()
              .duration(200)
              .style('opacity', 0.9);
            tooltip.html('Value' + '<br/> (' + d.date + ',' + d.ms + ')')
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
          .attr('class', 'label')
          .attr('x', width / 2)
          .attr('y', height + margin.bottom)
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
          .text('MS');

      }
  };

});

