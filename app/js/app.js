angular.module('usermgmt', ['ui.router', 'ui.bootstrap'])
    .config(function($stateProvider, $urlRouterProvider) {

        $stateProvider.state('login', {
            url: "/login",
            templateUrl: 'templates/login.html',
            controller: 'LoginCtrl',
        })

        .state('app', {
            url: "/app",
            templateUrl: 'templates/app.html',
            controller: 'AppCtrl'
        })

        .state('app.users', {
            url: "/users",
            controller: 'UsersCtrl',
            templateUrl: 'templates/users.html'
        })

        .state('app.mode', {
            url: "/:mode",
            controller: 'AddEditUserCtrl',
            templateUrl: 'templates/addEditUser.html'
        })
    })


.service('UserService', function($http, $q) {

    this.userEdit = null;


    this.getUsers = function() {
        return $http.get('/users').then(function(response) {
            return response.data;
        })
    }

    this.addUser = function(User) {
        return $http.post('/user', {
            user: User
        }).then(function(response) {
            return response.data;
        })
    }

    this.deleteUser = function(id) {
        return $http.delete('/user/' + id).then(function(response) {
            return response.data;
        })
    }

    this.updateUser = function(id, User) {
        return $http.put('/user/' + id, {
            user: User
        }).then(function(response) {
            return response.data;
        })
    }

    this.getUser = function(id) {
        return $http.get('/user/' + id).then(function(response) {
            return response.data;
        })
    }

    this.login = function(){
        return $http.post('/login', {}).then(function(response){
            return response.data;
        })
    }
})

.controller('AppCtrl', function($scope) {
    console.log('hello AppCtrl')
})

.controller('LoginCtrl', function($scope, UserService) {
    $scope.showModal = true;

    $scope.doLogin = function(){
        UserService.login();
    }
})


.controller('AddEditUserCtrl', function($scope, $stateParams, $location, UserService) {

    console.log('heheheheeheh')
    $scope.mode = $stateParams.mode;

    function init() {

        if ($scope.mode == 'edit' && UserService.userEdit) {
            $scope.user = angular.copy(UserService.userEdit);
        } else if ($scope.mode == 'edit' && !UserService.userEdit) {
            $location.path('/app/users');

        }
    }

    init();

    $scope.addUser = function(user) {
        UserService.addUser(angular.copy(user)).then(function(user) {
            $scope.user = {};
        });
    }

    $scope.updateUser = function(user) {
        UserService.updateUser(user._id, angular.copy(user)).then(function(user) {
            $scope.user = {};
        });
    }


})

.controller('UsersCtrl', function($scope, $location, UserService) {


    $scope.users = [];

    UserService.getUsers().then(function(data) {
        $scope.users = data;
    })

    $scope.gotoAddUser = function() {
        $location.path('/app/users/add');
    }

    $scope.editUser = function(user, index) {

        UserService.userEdit = angular.copy(user);
        $location.path('/app/edit');

    }

    $scope.deleteUser = function(id, index) {
        UserService.deleteUser(id).then(function(res) {
            $scope.users.splice(index, 1);
        })
    }


})
