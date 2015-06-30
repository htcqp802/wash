var washAppDirector = angular.module("washAppDirectors", []);

washAppDirector.directive("menu", function ($window) {
  return {
    restrict: 'E',
    templateUrl: 'views/menu.html',
    link: function (scope, ele, attr) {
      ele.children()[0].lastElementChild.style.height = $window.innerHeight + 'px';
    }
  }
})
washAppDirector.directive("menulink", function ($window) {
  return {
    restrict: 'AE',
    //template: '<div class="title index-title"><a href ng-click="toggle()" class="title-left"></a><i class="front-text"></i>洗呗</div>',
    link: function (scope, ele, attr) {
      scope.showMenu = false;
      scope.toggle = function () {
        if(localStorage.getItem("isLogin") == "true" && localStorage.getItem("user")){
          scope.user = JSON.parse(localStorage.getItem("user"));
          scope.showMenu = !scope.showMenu;
          if (scope.showMenu) {
            ele.parent()[0].style.height = $window.innerHeight + 'px';
          } else {
            ele.parent()[0].style.height = 'auto';
          }
        }else{
            $window.location.href = "#/login";
        }

      }
    }
  }
})

washAppDirector.directive("backbtn", function () {
  return {
    restrict: 'AE',
    link: function (scope, ele, attr) {
      ele.bind('click', function () {
        history.back();
      })
    }
  }
})

washAppDirector.directive("winheight", function ($window) {
  return {
    restrict: "AE",
    link: function (scope, ele, attr) {
      ele[0].style.height = $window.innerHeight + 'px'
    }
  }
})

washAppDirector.directive("winwidth", function ($window) {
  return {
    restrict: "AE",
    link: function (scope, ele, attr) {
      ele[0].style.width = $window.innerWidth + 'px';
    }
  }
})

washAppDirector.directive("star", function ($window) {
  return {
    restrict: "AE",
    link: function (scope, ele, attr) {
      for (var i = 0; i < ele.children().length; i++) {
        ele.children()[i].index = i;
      }
      ele.children().bind('click', function () {
        var that = this;
        for (var i = 0; i < ele.children().length; i++) {
          if (ele.children()[i].index <= that.index) {
            angular.element(ele.children()[i]).children("img").attr("src", "images/star_2.png")
          } else {
            angular.element(ele.children()[i]).children("img").attr("src", "images/star_1.png")
          }
        }
      })
    }
  }
})

washAppDirector.directive("logout",function(){
  return{
    restrict:"AE",
    link:function(scope,ele,attr){
      ele.bind("click",function(){
        localStorage.removeItem("order");
        localStorage.removeItem("user");
        localStorage.removeItem("shop");
        localStorage.setItem("isLogin",true);
        location.href = "#/";
      })
    }
  }
})

washAppDirector.directive("timer",function($interval,$http){
  return{
    restrict:"AE",
    link:function(scope,ele,attr){
      if(localStorage.getItem("phone")){
        scope.phone = parseInt(localStorage.getItem("phone"));
      }
      scope.checkCode = "获取验证码";
      var time = 60;
      var timer =  function(){
        time--;
        scope.checkCode = "重新发送("+ time +"S)"
        localStorage.setItem("time",time);
        if(time <= 0){
          time = 60;
          localStorage.removeItem("time");
          $interval.cancel(timer);
          scope.checkCode ="重新发送";
          return;
        }
      };
      if(localStorage.getItem("time")){
          time = parseInt(localStorage.getItem("time"));
        $interval(timer,1000,time);
      }
        ele.bind("click",function(){
          if(!localStorage.getItem("time") && scope.phone){
            localStorage.setItem("phone",scope.phone);
            localStorage.removeItem("time");
            time = 60;
              $http.get("http://112.126.72.187:8088/v1/api/vipUser/vipUserLoginSendSMSByPhone?vipPhone="+ scope.phone +"&api_key=cXdlOmFzZDp6eGM%3D")
            $interval(timer,1000,time);
          }
        })
    }
  }
})


washAppDirector.directive("pickdate",function($window,$filter){
  return{
    restrict:"AE",
    link:function(scope,ele,attr){
      ele.children().bind("click",function(){
        ele.children().removeClass("active");
        var p = angular.element(this);
        p.addClass("active");
        var d = new Date();
        d = +d+1000*60*60*24*parseInt(p.text());
        scope.$apply(function(){
          scope.error = null;
          scope.endDate = $filter('date')(new Date(d),'yyyy年MM月dd日');
        });
      })
    }
  }
})

