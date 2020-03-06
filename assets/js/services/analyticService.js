(function(){
  'use strict';

  var serviceId = 'AnalyticService';

  angular.module('inspinia').factory(serviceId, ['$http', '$q', '$window', 'HttpService', AnalyticService]);

  function AnalyticService($http, $q, $window, HttpService){
    

    /**
     * GET /v1/Account/<authid>/Analytic/statAvg
     *
     * Retrieves the average hearing statistics for this user
     */
    var getAvgStatData = function(data){
      var deferred = $q.defer();

      var baseUrl = HttpService.getBaseUrl();

      var authId = 'dars';

      var url = baseUrl + '/v1/Account/' + authId + '/Analytic/statAvg';

      $http.get(url,data).then(
        function(success){
          console.log(success);
          deferred.resolve(success.data);
        },
        function(error){
          console.log(error);
          deferred.reject(error);
        }
      )

      return deferred.promise;
    };


    function encodeQueryData(data) {
      let queryData = [];
      for (let d in data)
      queryData.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]));
      return queryData.join('&');
    }

    /**
     * GET /v1/Accounts/<authid>/Report/hearing
     *
     * Retrieves the list of hearing for this user
     *
     * Filter is an object that contains:
     * {
     *    role: 'user'                // only option
     *    site_location: 'TLH'        // only option
     *    scheduled_dt: 'yyyy-mm-dd'
     *    docket_number: #######
     * }
     */
    var getReportData = function(filter){
      var deferred = $q.defer();

      var baseUrl = HttpService.getBaseUrl();

      var authId = 'dars';

      var url = baseUrl + '/v1/Account/' + authId + '/Analytic/adherence';

      var queryString = encodeQueryData(filter);

      url += '?' + queryString;

      $http.get(url).then(
        function(success){
          console.log(success);
          $window.localStorage.setItem('hearingList', JSON.stringify(success.data));
          deferred.resolve(success.data);
        },
        function(error){
          console.log(error);
          deferred.reject(error);
        }
      )

      return deferred.promise;
    };

    var getPolarOptions = function(){

      /**
       * Options for Polar chart
       */
      var options = {
        scaleShowLabelBackdrop : true,
        scaleBackdropColor : "rgba(255,255,255,0.75)",
        scaleBeginAtZero : true,
        scaleBackdropPaddingY : 1,
        scaleBackdropPaddingX : 1,
        scaleShowLine : true,
        segmentShowStroke : true,
        segmentStrokeColor : "#fff",
        segmentStrokeWidth : 2,
        animationSteps : 100,
        animationEasing : "easeOutBounce",
        animateRotate : true,
        animateScale : false
      };

      return options;
    };

    var getFlotOptions = function(){

      var options = {
          series: {
              lines: {
                  show: false,
                  fill: true
              },
              splines: {
                  show: true,
                  tension: 0.4,
                  lineWidth: 1,
                  fill: 0.4
              },
              points: {
                  radius: 0,
                  show: true
              },
              shadowSize: 2,
              grow: {stepMode:"linear",stepDirection:"up",steps:80}
          },
          grow: {stepMode:"linear",stepDirection:"up",steps:80},
          grid: {
              hoverable: true,
              clickable: true,
              tickColor: "#d5d5d5",
              borderWidth: 1,
              color: '#d5d5d5'
          },
          colors: ["#1ab394", "#1C84C6"],
          xaxis: {
          },
          yaxis: {
              ticks: 4
          },
          tooltip: true
        };

      return options;
    };

    return {
      getAvgStatData: getAvgStatData,
      getReportData: getReportData,
      getFlotOptions: getFlotOptions,
      getPolarOptions: getPolarOptions
    };
  }
}());
