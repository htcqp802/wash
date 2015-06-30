'use strict';

/**
 * @ngdoc overview
 * @name washApp
 * @description
 * # washApp
 *
 * Main module of the application.
 */
angular
  .module('washApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'washAppControllers',
    'washAppDirectors'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/home.html',
        controller: 'HomeCtrl'
      }).when('/login',{
        templateUrl:'views/login.html',
        controller:'LoginCtrl'
      })
      .when('/detail/:flag',{
        templateUrl:'views/detail.html',
        controller:'DetailCtrl'
      })
      .when('/buy',{
        templateUrl:'views/buy.html',
        controller:'BuyCtrl'
      }).when('/coupan',{
        templateUrl:'views/coupan.html'
      }).when('/orderDetail/:orderDetail',{
        templateUrl:'views/orderDetail.html',
        controller:'OrderDetailCtrl'
      }).when('/myOrder',{
        templateUrl:'views/my_order.html',
        controller:'MyOrderCtrl'
      }).when('/pay',{
        templateUrl:'views/pay.html',
        controller:'PayCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
