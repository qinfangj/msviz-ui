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
  .controller('EliteMonitorInfoEditCtrl', function($scope,$window,$routeParams,EliteMonitorInfoService) {

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
  .controller('LumosMonitorInfoEditCtrl', function($scope,$window,$routeParams,LumosMonitorInfoService) {
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
  .controller('EliteMonitorInfoCtrl', function($scope,$route,popupService,$window,EliteMonitorInfoService,QcSummaryService,QcDevInfoService) {
    $scope.showDiv='list';
    $scope.title ='Elite Monitor Infomation';

    $scope.mtpNm1 = 'Multiplier1';
    $scope.mtpNm2 = 'Multiplier2';


    $scope.reDate = /^[0-9]{8}$/;
    $scope.reNumber = /\d*\.?\d+/;

    EliteMonitorInfoService.list().then(function(data){
      $scope.eliteMonitorInfos = data;

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
      $scope.showDiv= 'chart';
      $scope.figLen= window.outerWidth*0.45;

      if (dateFrom===undefined || dateFrom===''){
        EliteMonitorInfoService.list().then(function(data){
          console.log('dateFrom=' + dateFrom);
          // console.log('data=' +  data.length);
          //get eliteData without dates restrict
          var eliteData= _.map(data, function (s) {
            return {
              date: s.monitorDate +'_' +  s.monitorIndex,
              val1: s.Multplier1,
              val2: s.Multplier2,
              comment: s.Comment
            };
          });
          $scope.eliteData = eliteData;

        });

        QcSummaryService.list().then(function(data){

          var summaries = _.filter(data,function(o){
            return (o.rawfileInfomation.machineName ==='Elite' && o.selFlg === true);
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
        });
        QcDevInfoService.list().then(function(dev){
          $scope.devInfos = dev;

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
          $scope.eliteData = eliteData;
        });

        var dateFromForQc = dateFrom.slice(2);
        var dateToForQc = dateTo.slice(2);
        console.log(dateFromForQc);
        console.log(dateToForQc);

        QcSummaryService.findAllBtw2Date(dateFromForQc,dateToForQc).then(function(data){
          var summaries = _.filter(data,function(o){
            return (o.rawfileInfomation.machineName ==='Elite' && o.selFlg === true);
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

        });
        QcDevInfoService.findDevInfoBtw2Date(dateFromForQc,dateToForQc).then(function(dev){

          $scope.devInfos = dev;

        });
      }
      //$window.location.href= '#/eliteMonitorInfo/chart';
    };


    $scope.$back = function() {
      $scope.showDiv='list';
      $window.location.href= '#/eliteMonitorInfo';
    };


  })
  .directive('eliteChart',function(d3){
    //console.log('aa=' + 'hello' );

    return{
      restrict: 'E',
      template: '<svg width="1100" height="600"></svg>',
      link: function (scope,elem,attrs) {
        console.log('figLen=' + scope.figLen);
        var eliteData = [];

        scope.$watch(attrs.eliteData, function (newValue) {
          if (newValue) {
            eliteData = newValue;
            //console.log('eliteData=' + newValue);

            var rawSvg = elem.find('svg');
            //var svg = d3.select(rawSvg[0]);

            //Define the margin,width,height
            var margin = {top: 30, right: 150, bottom: 70, left: 80},
            //width = 1100 - margin.left - margin.right,
              width = scope.figLen - margin.left - margin.right,
              height = 600 - margin.top - margin.bottom;

            // Set the ranges x


            var x = d3.scale.ordinal();
            var domainX = eliteData.map(function (d) {
              return d.date;
            });

            x.domain(_.sortBy(domainX, function (num) {
              return num;
            }))
              .rangePoints([0, width]);
            //.domain(d3.range(eliteData.length))
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

            y.domain([d3.min(eliteData, function (d) {
              return d.val1;
            }) * 0.9, d3.max(eliteData, function (d) {
              return d.val1;
            }) * 1.1]);
            console.log('max val ' + d3.max(eliteData, function (d) {
                return d.val1;
              }));
            var yAxis = d3.svg.axis().scale(y)
              .orient('left').ticks(7);

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
            color.domain(d3.keys(eliteData[0]).filter(function (key) {
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
            var line2 = d3.svg.line()
              .x(function (d) {
                return x(d.date);
              })
              .y(function (d) {
                return y(d.val2);
              });

            var pathContainers = svg.selectAll('g.line')
              .data(eliteData);

            pathContainers.enter().append('g')
              .attr('class', 'line');

            pathContainers.selectAll('path')
              .data(function (d) {
                return [d];
              }) // continues the data from the pathContainer
              .enter().append('path')
              .attr('d', line1(eliteData))
              .attr('fill', 'none')
              .attr('stroke', 'blue');

            pathContainers.selectAll('.dot')
              .data(eliteData)
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
                tooltip.html('<table><tr><td style="font-weight: bold;text-underline;" >' + d.date.slice(0, 8) + '</td></tr><tr><td>#multiplier1' + ':' + d.val1 + '</td></tr></table>')
                  .style('left', (d3.event.pageX + 5) + 'px')
                  .style('top', (d3.event.pageY - 28) + 'px');

              })
              .on('mouseout', function () {
                tooltip.transition()
                  .duration(500)
                  .style('opacity', 0);
              });

            pathContainers.enter().append('g')
              .attr('class', 'line');

            pathContainers.selectAll('path')
              .data(function (d) {
                return [d];
              }) // continues the data from the pathContainer
              .enter().append('path')
              .attr('d', line2(eliteData))
              .attr('fill', 'none')
              .attr('stroke', 'red');

            pathContainers.selectAll('.dot')
              .data(eliteData)
              .enter().append('circle')
              .attr('class', 'dot')
              .attr('r', 4)
              .attr('cx', function (d) {
                return x(d.date);
              })
              .attr('cy', function (d) {
                return y(d.val2);
              })
              .attr('fill', 'orange')
              .on('mouseover', function (d) {
                tooltip.transition()
                  .duration(200)
                  .style('opacity', 0.8);
                tooltip.html('<table><tr><td style="font-weight: bold;text-underline;" >' + d.date.slice(0, 8) + '</td></tr><tr><td>#multiplier2' + ':' + d.val2 + '</td></tr></table>')
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
              .text(function (d) {
                return d === 'val1' ? 'multiplier1' : 'multiplier2';
              });

            _.map(eliteData, function (d) {

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
                    tooltip.html('Device Elite Information:<br>' + d.comment)
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
  })
  .controller('LumosMonitorInfoCtrl', function($scope,$route,popupService, $window,LumosMonitorInfoService,QcSummaryService,QcDevInfoService) {

    $scope.showDiv='list';
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
      $scope.showDiv= 'chart';
      $scope.figLen= window.outerWidth*0.45;

      if (dateFrom===undefined || dateFrom===''){
        LumosMonitorInfoService.list().then(function(data){
          console.log('dateFrom=' + dateFrom);
          var lumosData= _.map(data, function (s) {
            return {
              date: s.monitorDate +'_' +  s.monitorIndex,
              val1: s.Multplier,
              val2: s.Transmission,
              comment: s.Comment
            };
          });
          $scope.lumosData = lumosData;
          //$window.location.href= '#/lumosMonitorInfo/'+ angular.toJson(lumosData);
        });

        QcSummaryService.list().then(function(data){

          var summaries = _.filter(data,function(o){
            return (o.rawfileInfomation.machineName ==='Lumos' && o.selFlg === true);
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
        });

        QcDevInfoService.list().then(function(dev){
          $scope.devInfos = dev;

          //$window.location.href= '#/eliteMonitorInfo/chart';
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
          $scope.lumosData= lumosData;
          //$window.location.href= '#/lumosMonitorInfo/' + angular.toJson(lumosData);
        });

        var dateFromForQc = dateFrom.slice(2);
        var dateToForQc = dateTo.slice(2);

        QcSummaryService.findAllBtw2Date(dateFromForQc,dateToForQc).then(function(data){
          var summaries = _.filter(data,function(o){
            return (o.rawfileInfomation.machineName ==='Lumos' && o.selFlg === true);
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


        });
        QcDevInfoService.findDevInfoBtw2Date(dateFromForQc,dateToForQc).then(function(dev){

          $scope.devInfos = dev;

        });
      }
    };

    $scope.$back = function() {
      $scope.showDiv='list';
      $window.location.href= '#/eliteLumosInfo';
    };

  })
  .directive('lumosChart',function(d3){
    //console.log('aa=' + 'hello' );

    return{
      restrict: 'E',
      template: '<svg width="1100" height="600"></svg>',
      link: function (scope,elem,attrs) {
        console.log('figLen=' + scope.figLen);
        var lumosData = [];

        scope.$watch(attrs.lumosData, function (newValue) {
          if (newValue) {
            lumosData = newValue;
            //console.log('lumosData=' + newValue);

            var rawSvg = elem.find('svg');
            //var svg = d3.select(rawSvg[0]);

            //Define the margin,width,height
            var margin = {top: 30, right: 150, bottom: 70, left: 80},
            //width = 1100 - margin.left - margin.right,
              width = scope.figLen - margin.left - margin.right,
              height = 600 - margin.top - margin.bottom;

            // Set the ranges x


            var x = d3.scale.ordinal();
            var domainX = lumosData.map(function (d) {
              return d.date;
            });

            x.domain(_.sortBy(domainX, function (num) {
              return num;
            }))
              .rangePoints([0, width]);
            //.domain(d3.range(lumosData.length))
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

            y.domain([d3.min(lumosData, function (d) {
              return d.val1;
            }) * 0.9, d3.max(lumosData, function (d) {
              return d.val1;
            }) * 1.1]);
            console.log('max val ' + d3.max(lumosData, function (d) {
                return d.val1;
              }));
            var yAxis = d3.svg.axis().scale(y)
              .orient('left').ticks(7);

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
            color.domain(d3.keys(lumosData[0]).filter(function (key) {
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
            var line2 = d3.svg.line()
              .x(function (d) {
                return x(d.date);
              })
              .y(function (d) {
                return y(d.val2);
              });

            var pathContainers = svg.selectAll('g.line')
              .data(lumosData);

            pathContainers.enter().append('g')
              .attr('class', 'line');

            pathContainers.selectAll('path')
              .data(function (d) {
                return [d];
              }) // continues the data from the pathContainer
              .enter().append('path')
              .attr('d', line1(lumosData))
              .attr('fill', 'none')
              .attr('stroke', 'blue');

            pathContainers.selectAll('.dot')
              .data(lumosData)
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
                tooltip.html('<table><tr><td style="font-weight: bold;text-underline;" >' + d.date.slice(0, 8) + '</td></tr><tr><td>#multiplier1' + ':' + d.val1 + '</td></tr></table>')
                  .style('left', (d3.event.pageX + 5) + 'px')
                  .style('top', (d3.event.pageY - 28) + 'px');

              })
              .on('mouseout', function () {
                tooltip.transition()
                  .duration(500)
                  .style('opacity', 0);
              });

            pathContainers.enter().append('g')
              .attr('class', 'line');

            pathContainers.selectAll('path')
              .data(function (d) {
                return [d];
              }) // continues the data from the pathContainer
              .enter().append('path')
              .attr('d', line2(lumosData))
              .attr('fill', 'none')
              .attr('stroke', 'red');

            pathContainers.selectAll('.dot')
              .data(lumosData)
              .enter().append('circle')
              .attr('class', 'dot')
              .attr('r', 4)
              .attr('cx', function (d) {
                return x(d.date);
              })
              .attr('cy', function (d) {
                return y(d.val2);
              })
              .attr('fill', 'orange')
              .on('mouseover', function (d) {
                tooltip.transition()
                  .duration(200)
                  .style('opacity', 0.8);
                tooltip.html('<table><tr><td style="font-weight: bold;text-underline;" >' + d.date.slice(0, 8) + '</td></tr><tr><td>#multiplier2' + ':' + d.val2 + '</td></tr></table>')
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
              .text(function (d) {
                return d === 'val1' ? 'multiplier1' : 'multiplier2';
              });

            _.map(lumosData, function (d) {

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
                    tooltip.html('Device Elite Information:<br>' + d.comment)
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
