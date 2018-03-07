portalApp.config(function ($routeProvider, $locationProvider) {
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: true,
        base : "/"
    })
    $routeProvider
        .when('/',{
            templateUrl: "pages/movie.html",
            controller: "movie"
        })
        .when('/addmovie', {
            templateUrl: "pages/AddMovie.html",
            controller: "addmovie"
        })
        .when('/Info',{
            templateUrl: "pages/Info.html",
            controller: "Info"
        })
        .when('/update', {
            templateUrl: "pages/update.html",
            controller: "update"
        })
        .when('/AddActor', {
            templateUrl: "pages/AddActor.html",
            controller: "AddActor"
        })
        .when('/AddProducer', {
            templateUrl: "pages/AddProducer.html",
            controller: "AddProducer"
        })
        .otherwise({
            templateUrl: "pages/movie.html",
            controller: "movie"
        })

})