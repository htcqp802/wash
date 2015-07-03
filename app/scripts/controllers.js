/**
 * Created by zhangpeibin on 2015/5/4.
 */
var washAppControllers = angular.module('washAppControllers', []);

washAppControllers.controller('IndexCtrl', function ($rootScope, $window) {
  //$rootScope.height = $window.innerHeight;
});

/**
 * 首页控制器
 */
washAppControllers.controller('HomeCtrl', function ($scope, $window, commodities, order) {
//if(localStorage.getItem("isLogin") == "true"){
//    $scope.user = localStorage.getItem("user");
//    console.log()
//  }
  $scope.logout = function(){
    localStorage.removeItem("order");
    localStorage.removeItem("user");
    localStorage.removeItem("shop");
    localStorage.setItem("isLogin",false);
    location.href = "#/login";
  }




  localStorage.removeItem("order");
  var order_ = order.getOrder("order") || {orderSons: []};
  //初始化总价
  $scope.total = order_.payablePrice || 0;


  /**
   * 获取数据
   */
  commodities.getData().then(function (data) {
    $scope.shoses = [];
    $scope.bags = [];
    $scope.safas = [];
    $scope.coats = [];

    //如果本地已有订单，那么加载订单内的
    angular.forEach(data, function (obj) {
      angular.forEach(order_.orderSons, function (o) {
        if (obj.id == o.clothingServiceId) {
          obj.count = o.count;
        }
      })
      switch (obj.type) {
        case 1:
          $scope.shoses.push(obj);
          break;
        case 2:
          $scope.bags.push(obj);
          break;
        case 3:
          $scope.safas.push(obj);
          break;
        case 4:
          $scope.coats.push(obj);
          break;
      }
    });
  })


  /**
   * 添加商品个数，计算总和
   * @param type 商品对象
   */
  $scope.add = function (type) {
    if(order.getOrder("user")){
      type.count++;
      $scope.total = $scope.total + type.itemMoney;
    }else{
      $window.location.href = "#/login";
    }

  }

  /**
   * 减少商品个数，计算总和
   * @param type 商品对象
   */
  $scope.sub = function (type) {
    if(order.getOrder("user")){
      if (type.count > 0) {
        $scope.total = $scope.total - type.itemMoney;
        type.count--;
      }
    }else{
      $window.location.href = "#/login";
    }

  }

  /**
   * 初始化swiper
   * @type {Swiper}
   */
  var mySwiper = new Swiper('.swiper-container', {
    autoplay: 5000,
    pagination: '.swiper-pagination'
  });
  $scope.img = {
    width: $window.innerWidth + 'px'
  }


  /**
   * 向订单添加商品对象
   * @param sons 商品对象
   */
  var setOrderSon = function (sons) {
    var user = JSON.parse(localStorage.getItem("user"));
          var shop = JSON.parse(localStorage.getItem("shop"));
        angular.forEach(sons, function (o) {
          if (o.count > 0) {
            var orderSon = {
              "shopId": shop.id,
              "vipId": user.id,
          "shopName": shop.shopName,
          "shopTel1": shop.shopTel1,
          "shopTel2": shop.shopTel2 | "",
          "shopAddress": shop.shopAddress,
          "vipName": user.vipName,
          "vipMobile": user.vipPhone,
          "vipAddress": user.vipAddress,
          "clothingServiceId": o.id,
          "clothingName": o.clothingName,
          "serviceName": o.itemName,
          "count": o.count,
          "unitPrice": o.itemMoney,
          "state": 1
        }

        order_.orderSons.push(orderSon);
      }
    });
  }

  /**
   * 检查是否登录，并保存订单
   */

  $scope.islogin = function () {
    if (localStorage.getItem("isLogin")) {
      if($scope.total >= 38){
        setOrderSon($scope.shoses);
        setOrderSon($scope.bags);
        setOrderSon($scope.safas);
        setOrderSon($scope.coats);
        order_.payablePrice = $scope.total;
        order.setOrder('order', order_);
        $window.location.href = "#/buy";

    }else{
        $scope.message = "至少38元才可在线下单";
        $scope.showMessage = true;
      }
    }else {
      $window.location.href = "#/login";
    }
  }

});


/**
 * 商品详情页控制器
 */
washAppControllers.controller('DetailCtrl', function ($scope, $routeParams, commodities) {
  $scope.commodity = {
    "name": "洗鞋",
    "flag": "shoes",
    "type": [
      {
        "name": "<30cm",
        "price": 20,
        "url": "images/shoes.png"
      },
      {
        "name": ">30cm",
        "price": 30,
        "url": "images/shoes2.png"
      }
    ],
    "beforeImg": "images/before_shoes.jpg",
    "afterImg": "images/after_shoes.jpg"
  }

})


/**
 * 下单页控制器
 */
washAppControllers.controller('BuyCtrl', function ($scope,$window, $filter, $http, order) {
  $scope.dates = [];
var d = new Date();
switch (d.getDay()){
  case 0:
  $scope.week = "周一";
  case 1:
  $scope.week = "周二";
  case 5:
  $scope.week = "周五"
}
  for(var i = 0;i < 7;i++){
    d = +d+1000*60*60*24;
    $scope.dates.push(d);
    // $scope.ymd.push($filter('date')(new Date()))
  }


  order.checkUser();
  $scope.endTime = "10:00-12:00";
  if(order.getOrder("order")){
      if(parseInt(order.getOrder("order").payablePrice) <= 50){
        $window.location.href = "#/";
      }
  }else{
    $window.location.href = "#/"
  }
  $scope.shadow = true;
  var user = JSON.parse(localStorage.getItem("user"));
  var shop = JSON.parse(localStorage.getItem("shop"));
  $scope.order = {
    "shopId": shop.id,
    "vipId": user.id,
    "shopName": shop.shopName,
    "shopTel1": shop.shopTel1,
    "shopTel2": shop.shopTel2 | "",
    "shopAddress": shop.shopAddress,
    "vipName": user.vipName,
    "vipMobile": user.vipPhone,
    "vipAddress": user.vipAddress,
    "createDate": $filter('date')(new Date(), 'yyyy年MM月dd日 HH:mm:ss'),
    "normalEndDate": "null",
    "payablePrice": order.getOrder("order").payablePrice,
    "realPrice": order.getOrder("order").payablePrice,
    "orderNo":"null",
    "couponId": 0,
    "couponCode": "null",
    "couponType": 0,
    "couponDesc": "null",
    "payState": 0,
    "orderType": 1,
    "orderText": "null",
    "orderSons": order.getOrder("order").orderSons,
    "orderImgs": [],
    "buyType": 1,
    "state": 6
  };
  $scope.makeOrder = function () {
    $scope.endDate = $filter('date')(new Date(),'yyyy年MM月dd日')
    if($scope.endDate == undefined || $scope.endTime == undefined){
      $scope.error = "请选择取单时间";
      return;
    }
    $scope.shadow = false;
    var order_ = $scope.order;
    order_.endDate = $scope.endDate+" "+$scope.endTime;
    $http.post("http://112.126.72.187:8088/v1/api/order?api_key=cXdlOmFzZDp6eGM%3D", order_).success(function (data) {
      $scope.shadow = true;
      if (data.result) {
        localStorage.removeItem("order");
        order.setOrder("order", data.content);
        location.href = "#/myOrder"
      }
    }).error(function (err) {
      $scope.message = err.message;
      $scope.showMessage = true;
      angular.element($window.document.getElementsByClassName("shadow")[0]).removeClass("loading");
    })
  }
})

/**
 * 登录页控制器
 */
washAppControllers.controller('LoginCtrl', function ($scope,login) {
  $scope.togglemess = "通过账号密码登录";
$scope.toggle = function(){
  $scope.byPhone = !$scope.byPhone;
  if($scope.byPhone){
    $scope.togglemess = "通过手机验证码登录";
  }else{
    $scope.togglemess = "通过账号密码登录";
  }
}
  $scope.login = function () {
    login.getShop().then(function (data) {
      localStorage.setItem("shop", JSON.stringify(data));
    })
    if($scope.byPhone){
      login.getUserByName($scope.user).then(function(data){
        localStorage.setItem("user", JSON.stringify(data));
        localStorage.setItem("isLogin", true);
        history.back();
      },function(err){
        $scope.err = err;
      })
    }else{
      login.getUser($scope.phone,$scope.code).then(function (data) {
        localStorage.setItem("user", JSON.stringify(data[0]));
        localStorage.setItem("isLogin", true);
        history.back();
      }, function (err) {
        $scope.err = err;
      });
    }


  }

});

/**
 * 我的订单
 */
washAppControllers.controller('MyOrderCtrl', function ($scope,$http,$window,order) {
  order.checkUser();
  // $http.get("http://112.126.72.187:8088/v1/api/order/getOrderByPayState/"+order.getOrder("shop").id+"/1?api_key=cXdlOmFzZDp6eGM%3D").success(function(data){

  //   var content = data.content;
  //   $scope.orderDone = [];
  //   angular.forEach(content,function(obj){
  //     if(obj.vipId == order.getOrder("user").id){
  //       $scope.orderDone.push(obj);
  //     }
  //   })
  // }).error(function(err){
  //   console.log(err);
  // });
var phone = order.getOrder('user').vipPhone.substring(0,7);
  $http.get("http://112.126.72.187:8088/v1/api/order?vipPhone="+ phone +"&api_key=cXdlOmFzZDp6eGM%3D").success(function(data){
    var content = data.content;
    $scope.orderBeing = [];
    $scope.orderDone = [];
    angular.forEach(content,function(obj){
      if(obj.state != 5){
        $scope.orderBeing.push(obj);
      }
      if(obj.state == 4){
        $scope.orderDone.push(obj);
      }
    })
  }).error(function(err){
    console.log(err);
  });

  $scope.pay = function(obj){
    localStorage.removeItem("order");
    order.setOrder("order",obj);
    location.href = "#/pay";
  }

  $scope.tab = function (bool) {
    if (bool) {
      $scope.isActive = true;
    } else {
      $scope.isActive = false;
    }
  }

  $scope.toOrderDetail = function(orderNo){
    location.href = "#/orderDetail/"+orderNo;
  }
  $scope.cancelOrder = function(order){
    order.state = 5;
    console.log(order.state);
    $http({
      url:"http://112.126.72.187:8088/v1/api/order/updateOrder?api_key=cXdlOmFzZDp6eGM%3D",
      method:"put",
      data:order
    }).success(function(obj){
        if(obj.result){
          console.log(11)
          $window.location.href = "#/myOrder";
        }
    }).error(function(error){
        console.log(error);
    });
  }
})


/**
 * 付款
 */
washAppControllers.controller('PayCtrl', function ($scope, $http, order) {
  order.checkUser();
  $scope.shadow = true;
  $scope.order = order.getOrder("order");
  $scope.pay = function () {
    $scope.shadow = false;
    $http.put("http://112.126.72.187:8088/v1/api/order/updateOrderState/"+ order.getOrder("shop").id +"/"+ order.getOrder("user").id +"/"+ $scope.order.orderNo +"/6/1/洗吧?api_key=cXdlOmFzZDp6eGM%3D").success(function (data) {
     $http.get("http://112.126.72.187:8088/v1/api/vipUser?vipCard="+ order.getOrder("user").vipPhone +"&vipPhone="+ order.getOrder("user").vipPhone +"&api_key=cXdlOmFzZDp6eGM%3D").success(function(data){
       order.setOrder("user",data.content[0]);
       location.href = "#/myOrder"
     }).error(function(){
       console.log(err);
     })
    }).error(function (err) {
      console.log(err);
    })
  }
});

washAppControllers.controller('OrderDetailCtrl',function($scope,$routeParams,$http,order){
  order.checkUser();
  var orderNo = $routeParams.orderDetail;
  $http.get("http://112.126.72.187:8088/v1/api/order?orderNo="+ orderNo +"&vipPhone="+ orderNo +"&api_key=cXdlOmFzZDp6eGM%3D").success(function(data){
     $scope.order = data.content[0];
  })
})






