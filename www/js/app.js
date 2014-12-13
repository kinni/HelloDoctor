// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic'])

.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            StatusBar.styleDefault();
        }
    });
})

.controller('MainCtrl', function($scope, $ionicModal, $http, $ionicScrollDelegate) {
    $scope.appTitle = "Hello Dr. MEW";

    var myDisplayName = "Dr. MEW";

    var SERVER_URL = "http://106.186.125.119/hellodoctor/mobiles/";
    var KEY = "123";

    $scope.displayName = myDisplayName;
    $scope.queryData = {};
    $scope.replyData = {};

    $scope.refresh = function() {
        $http.get(SERVER_URL + 'getPost/' + KEY).success(function(data) {
            console.log(data.posts);
            $scope.loadData(data.posts);
            $ionicScrollDelegate.scrollTop();
        });
    }

    $scope.loadData = function(data) {
        var displayItems = [];
        angular.forEach(data, function(item) {
            var item = item.Post;
            if (item.replied_at != null) {
                item.displayName = myDisplayName;
                item.displayTime = item.replied_at;
                item.avatar = "me.jpg";
            } else {
                item.displayName = item.name;
                item.displayTime = item.asked_at;
                item.avatar = "anonymous.jpg";
            }

            displayItems.push(item);
        });

        $scope.displayItems = displayItems;
    };

    $scope.refresh();


    $ionicModal.fromTemplateUrl('templates/askModal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.askModal = modal;
    });

    $scope.openAskModal = function() {
        $scope.askModal.show();
    }

    $scope.closeAskModal = function() {
        $scope.askModal.hide();
    }

    $scope.submitQuery = function() {
        $scope.queryData.asked_at = Date.now();

        $http.post(SERVER_URL + "addPost/" + KEY, $scope.queryData).success(function(data) {
            console.log(data);
            $scope.closeAskModal();
            $scope.queryData = {};
            $scope.refresh();
        });
    }

    $ionicModal.fromTemplateUrl('templates/replyModal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.replyModal = modal;
    });

    $scope.openReplyModal = function(item) {
        $scope.replyData.id = item.id;
        $scope.replyData.question = item.question;
        $scope.replyData.reply = item.reply;
        $scope.replyData.replied_at = Date.now();
        $scope.replyModal.show();
    }

    $scope.closeReplyModal = function() {
        $scope.replyModal.hide();
    }

    $scope.submitReply = function() {
        console.log($scope.replyData);
        $http.post(SERVER_URL + "updatePost/" + KEY, $scope.replyData).success(function(data) {
            console.log(data);
            $scope.closeReplyModal();
            $scope.replyData = {};
            $scope.refresh();
        });
    }


})
