const app = angular.module('app', []);

app.controller('appController', function appController($scope, $http) {
	$scope.magazines = [];
	$scope.years = [];
	$scope.state = "lista";
	$scope.selectedMagIndex = null;
	$scope.selectedMagKlik = null;
	$scope.details = [];
	$scope.areDetailsOn = false;

	$scope.wrocDoListy = () => {
		$scope.state = "lista";
		$scope.areDetailsOn = false;
	}

	$scope.pokazRokWszystkie = () =>{
		$scope.areDetailsOn = true;
		$http({
			type: "GET",
			params:{name: $scope.magazines[$scope.selectedMagIndex].klik, year: 'any'},
			url:`getYear`
		}).then((response)=>{
			$scope.details = response.data;

			console.log($scope.details)

			for(let detail in $scope.details){
				if(detail != "$" && $scope.details[detail].nazwa){
					$scope.details[detail].nazwaZUnderscore = $scope.details[detail].nazwa.replace(new RegExp(" ","g"),"_");
				}
			}
		});
		return;
	}

	$scope.pokazRok = (event) =>{
		$scope.areDetailsOn = true;
		$http({
			type: "GET",
			params:{name: $scope.magazines[$scope.selectedMagIndex].klik, year: event.target.innerHTML},
			url:`getYear`
		}).then((response)=>{
			$scope.details = response.data;
			for(let detail in $scope.details){
				if(detail != "$" && $scope.details[detail].nazwa){
					$scope.details[detail].nazwaZUnderscore = $scope.details[detail].nazwa.replace(new RegExp(" ","g"),"_");
				}
			}
		});

		console.log($scope.magazines[$scope.selectedMagIndex])
	}

	$scope.getMagazineDetails = (index) =>{
		const name = $scope.magazines[index].klik;
		$scope.selectedMagIndex = index;
		$scope.selectedMagKlik = $scope.magazines[$scope.selectedMagIndex].klik;
		$scope.state = "lata";
		$http({
			type: "GET",
			params:{name},
			url:`getMagazineDetails`
		}).then((response)=>{
			for(let name in response.data){
				$scope.years = response.data[name].split(",");
			}
		});
	}

	// request magazine list on load:

	$http({
		type: "GET",
		params:null, 
		url:"getMagazines"
	}).then((response)=>{
		for(let mag in response.data){
			$scope.magazines.push(response.data[mag]);
		}
	});

});













// routing:
// app.config(function($routeProvider) {
//     $routeProvider
//     .when("/", {
//         templateUrl : "./components/list-of-magazines/list-of-magazines.template.html"
//     })
//     .when("/m", {
//         templateUrl : "./components/list-of-magazines/list-of-magazines.template.html"
//     })
//     .when("/green", {
//         templateUrl : "green.htm"
//     })
//     .when("/blue", {
//         templateUrl : "blue.htm"
//     });
// });

// routing od vlada

// app.run(($rootScope) => {
//   $rootScope.showList = true;
//   $rootScope.showMagazine = false;
// });
// app.config(($routeProvider) => {
//   $routeProvider
//   .when("/", {
//       templateUrl : "main.html",
//       controller: "magazinesList"
//   })
//   .when("/magazine/:magazineName", {
//       templateUrl : "magazine.html",
//       controller: "magazine"
//   });
// });