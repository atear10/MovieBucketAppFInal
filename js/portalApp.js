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
  $http.get("http://localhost:60011/api/Producer").then(function (response) {
        console.log(response);
        self.producerList = response.data;
    })
     $http.get("http://localhost:60011/api/Actor").then(function (response) {
        console.log(response);
        self.actorList = response.data;
    })
    for(var i = 2018; i >= 1950; i--) {
        self.years.push(i);
    }
    self.url = "http://moviebucketwebapi.apphb.com/"
}]);


