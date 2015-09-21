angular.module('usermgmt', ['ngRoute'])
    .config(function($routeProvider) {
        $routeProvider

        .when('/app/users',{
    		controller: 'UsersCtrl',
    		templateUrl: 'templates/users.html'
        })

        .when('/app/users/add',{
    		controller: 'AddUserCtrl',
    		templateUrl: 'templates/addUser.html'
        })

        .otherwise('/app/users')

    })

    .service('UserService', function($http, $q){



    	this.getUsers = function(){
    		return $http.get('/users').then(function(response){
    			return response.data;
    		})
    	}

    	this.addUser = function(User){
    		return $http.post('/user', {user:User}).then(function(response){
    			return response.data;
    		})
    	}

    	this.deleteUser = function(id){
    		return $http.delete('/user/'+id).then(function(response){
    			return response.data;
    		})	
    	}

    	this.getUser = function(id){
    		return $http.get('/user/'+id).then(function(response){
    			return response.data;
    		})	
    	}
    })

    .controller('AppCtrl', function($scope) {
    	console.log('here');
    
    })

    .controller('AddUserCtrl', function($scope, UserService){

    	$scope.addUser = function(user){
    		UserService.addUser(angular.copy(user)).then(function(user){
    			$scope.user = {};
    			
    		});
    	}
    })

    .controller('UsersCtrl', function($scope, $location, UserService){
    	//console.log('user cnontroller');

    	$scope.users = [];

    	UserService.getUsers().then(function(data){
    		console.log(data)
    		$scope.users = data;
    	})

    	$scope.gotoAddUser = function(){
    		$location.path('/app/users/add');
    	}

    	$scope.deleteUser = function(id, index){
    		UserService.deleteUser(id).then(function(res){
                $scope.users.splice(index,1);
    		})
    	}

    	console.log()
    })
