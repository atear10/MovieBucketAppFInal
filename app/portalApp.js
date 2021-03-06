var portalApp = angular.module("portal", ["ngRoute", "ngAnimate", "angularUtils.directives.dirPagination", 'LocalStorageModule', 'angularjs-dropdown-multiselect']).run(function ($rootScope) {


});


portalApp.factory("chunks", function () {

    var oChunk = {};
    oChunk.divide = (function (arr, size) {
        var newArr = [];
        for (var i = 0; i < arr.length; i += size) {
            newArr.push(arr.slice(i, i + size));
        }
        return newArr;
    });
    return oChunk;
});

portalApp.service('global', ['$http',function ($http) {
    var self = this;
    self.years = [];
    //self.url = "http://localhost:60011/"
    self.url = "http://moviebucketwebapi.apphb.com/"
  $http.get(self.url + "api/Producer").then(function (response) {
        console.log(response);
        self.producerList = response.data;
    })
     $http.get(self.url + "api/Actor").then(function (response) {
        console.log(response);
        self.actorList = response.data;
  })
     self.movieList = [];
    for(var i = 2018; i >= 1950; i--) {
        self.years.push(i);
     }
    self.isFirstLoad = true;
    
}]);


