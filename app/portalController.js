portalApp
    .controller('container', ['$scope', '$log', 'global', '$location','localStorageService',
        function ($scope, $log, global, $location,localStorageService) {
            
           
        }])
    .controller('addmovie', ['$scope', '$http', '$log', 'global', '$location', 'localStorageService','chunks',
        function ($scope, $http, $log, global, $location, localStorageService, chunks) {
            $scope.successMessage = '';
            $scope.errorMessage = '';
            
            if (global.movieData != undefined) {

                $scope.data = global.movieData;
                global.movieData = {};
                console.log($scope.data)
                $scope.image = $scope.data.poster;
            } else {
                $scope.data = {
                    "movie_name": "",
                    "plot": "",
                    "producer": {},
                    "producer_id": "",
                    "Actors": [],
                    "year_of_release": "",
                }
            }
            $scope.actorData = {
                "name": "",
                "sex": "",
                "date_of_birth": "",
                "bio": ""
            } 
            $scope.years = global.years;
            //$scope.producerList = global.producerList;
            //$scope.actorList = global.actorList;
            $http.get(global.url + "api/Producer").then(function (response) {
                console.log(response);
                $scope.producerList = response.data;
            })
            $http.get(global.url + "api/Actor").then(function (response) {
                console.log(response);
                $scope.actorList = response.data;
            })
            console.log(global.years);
            console.log(global.producerList);
            
            $scope.Validation = {
                "name": true,
                "plot": true,
                "year_of_release": true,
                "poster": true,
                "producer": true,
                "Actors": true
            }

            $scope.submit = function () {
                $scope.Validation = {
                    "name": angular.isDefined($scope.data.movie_name) && $scope.data.movie_name != '',
                    "plot": angular.isDefined($scope.data.plot) && $scope.data.plot != '',
                    "year_of_release": angular.isDefined($scope.data.year_of_release) && $scope.data.year_of_release != '',
                    "poster": angular.isDefined($scope.data.poster) && $scope.data.poster != '',
                    "producer": "name" in $scope.data.producer,
                    "Actors": $scope.data.Actors.length > 0
                }
                console.log($scope.Validation);
                $scope.validData = $scope.Validation.name && $scope.Validation.plot && $scope.Validation.year_of_release && $scope.Validation.producer && $scope.Validation.Actors && $scope.Validation.poster;
                if ($scope.validData) {
                    if (global.movieEdit) {
                        $scope.data.producer_id = $scope.data.producer.producer_id;
                        console.log($scope.data)
                        $http({
                            url: global.url + "api/movies?movieId=" + global.movie_id,
                            data: $scope.data,
                            method: "POST"
                        }).then(function () {
                            //global.movieId = "/";
                            $location.url()
                            console.log("Success");
                        }, function () {
                            console.log("failed");
                        });
                    }
                    else {
                        $scope.data.producer_id = $scope.data.producer.producer_id;
                        //$scope.image = $scope.data.poster;
                        console.log($scope.data)
                        $http({
                            url: global.url + "api/movies",
                            data: $scope.data,
                            method: "PUT"
                        }).then(function (response) {
                            $scope.errorMessage = '';
                            $scope.successMessage = "Movie added Successfully to Database"
                            $location.url("/");
                            console.log("Success");
                        }, function (response, error) {
                            console.log(response)
                            $scope.successMessage = '';
                            $scope.errorMessage = "Failed to add movie to list : " + error;
                            console.log("failed");
                        });
                    }
                }
            }

            $scope.uploadFile = function (input) {

                if (input.files && input.files[0]) {
                    var reader = new FileReader();
                    reader.onload = function (e) {
                        //Sets the Old Image to new New Image
                        $('#photo-id').attr('src', e.target.result);
                        $scope.data.poster = e.target.result.replace(/data:image\/jpeg;base64,/g, '');
                    }

                    //Renders Image on Page
                    reader.readAsDataURL(input.files[0]);
                }
            };

            $scope.addActor = function (actorData) {
                $http.put(global.url + "api/Actor", actorData).then(function (response) {
                    $scope.successMessage = "Actor Detail Successfully Addded "
                    $scope.actorData = {
                        "name": "",
                        "sex": "",
                        "date_of_birth": "",
                        "bio": ""
                    }
                    $http.get(global.url + "api/Actor").then(function (response) {
                        $scope.actorList = response.data;
                    })

                })
            }

            $scope.addProducer = function (actorData) {
                $http.put(global.url + "api/Producer", actorData).then(function (response) {
                    $scope.successMessage = "Producer Detail Successfully Addded "
                    $scope.actorData = {
                        "name": "",
                        "sex": "",
                        "date_of_birth": "",
                        "bio": ""
                    }
                    $http.get(global.url + "api/producer").then(function (response) {
                        $scope.producerList = response.data;
                        //$('.modal').style.display = "none";
                    })

                })
            }
            
        }])
    .controller('movie', ['$scope', '$http', '$log', 'global', '$location', 'localStorageService', 'chunks',
        function ($scope, $http, $log, global, $location, localStorageService, chunks) {
            $scope.redirect = function () {
                $location.url("/addmovie");
            }
            $scope.dataList = global.mivieList;
            //if (!global.movieList.length > 0) {
                $http.get(global.url + "api/Movies").then(
                    function (response) {
                        console.log(response);
                        $scope.dataList = response.data;
                        $scope.image = response.data.poster;
                        global.movieList = $scope.dataList;
                    }, function (response) {
                        console.log(response)
                    })
            //} else {
             //   $scope.dataList = global.movieList;
           // }
            
            $scope.editData = {
                "name": "",
                "sex": "",
                "date_of_birth": new Date(),
                "bio": "",
                "Role": ""
            }
            $scope.displayInfo = "display : none";
            $scope.displayEdit = "display : none";
            $scope.redirectProducerEdit = function (data) {
                console.log(data)
                $scope.editData.name = data.name;
                $scope.editData.sex = data.sex;
                $scope.editData.date_of_birth = new Date(data.date_of_birth);
                $scope.editData.bio = data.bio;
                global.Role = "producer";
                global.producer_id = data.producer_id;
                global.editData = $scope.editData;
                $location.url("/Info");
            }
            $scope.redirectEditActor = function (data) {
                console.log(data)
                $scope.editData.name = data.name;
                $scope.editData.sex = data.sex;
                $scope.editData.date_of_birth = new Date(data.date_of_birth);
                $scope.editData.bio = data.bio;
                global.Role = "actor"
                global.actor_id = data.actor_Id;
                global.editData = $scope.editData;
                $location.url("/Info");
            }
            $scope.deleteMovie = function (data) {
                    var url = global.url +  "api/Movies?movieId=" + data.movie_id;
                    $http.delete(url).then(function (response) {
                        $http.get(global.url + "api/Movies").then(function (response) {
                            $scope.dataList = response.data;
                            global.movieList = $scope.dataList;
                        })
                        $scope.successMessage = "Deleted a Movie Successfully";
                    });
            }
            $scope.redirectEdit = function (data) {
                global.movieData = data;
                global.movieEdit = true;
                global.movie_id = data.movie_id;
                console.log(data)
                $location.url("/addmovie");

            }

        }])
    .controller('Info', ['$scope', '$http', '$log', 'global', '$location', 'localStorageService', 'chunks',
        function ($scope, $http, $log, global, $location, localStorageService, chunks) {
            $scope.editData = global.editData;
            global.editData = {

            }
            console.log($scope.editData);
            $scope.doEdit = function () {
                global.editData = $scope.editData;
                $location.url("/update");
            }
            $scope.DeleteRole = function (data) {
                if (global.Role == "producer") {
                    var url = global.url + "api/producer" + "?producerId=" + global.producer_id;
                    $http.delete(url).then(function (response) {
                        $scope.successMessage = "Deleted a producer Successfully";
                    });
                } else {
                    {
                        var url = global.url + "api/actor" + "?actorId=" + global.actor_id;
                        $http.delete(url).then(function (response) {
                            $scope.successMessage = "Deleted a actor Successfully";
                        });
                    }
                }
            }

        }])
    .controller('update', ['$scope', '$http', '$log', 'global', '$location', 'localStorageService', 'chunks',
        function ($scope, $http, $log, global, $location, localStorageService, chunks) {
            $scope.editData = global.editData
            $scope.data = {
                "name": "",
                "sex": "",
                "bio": "",
                "date_of_birth": ""
            }
            $scope.data.name = $scope.editData.name
            $scope.data.sex = $scope.editData.sex;
            $scope.data.date_of_birth = new Date($scope.editData.date_of_birth);
            $scope.data.bio = $scope.editData.bio;
            $scope.Submit = function () {
                console.log(global.actor_id)
                if (global.Role == "producer")
                    var url = global.url + "api/producer" + "?producerId=" + global.producer_id;
                else
                    var url = global.url + "api/actor" + "?actorId=" + global.actor_id;
                if (global.Role == "producer") {
                    $http.post(url, $scope.data).then(function () {
                        $scope.successMessage = "Successfully added producer";
                        $location.url("/")
                    }, function () {
                        $scope.ErrorMessage = "failed to add Data"
                    })
                } else {
                    $http.post(url, $scope.data).then(function () {
                        $scope.successMessage = "Successfully added producer";
                        $location.url("/")
                    }, function () {
                        $scope.ErrorMessage = "failed to add Data"
                    })
                }
            }
        }])
    .controller('AddActor', ['$scope', '$http', '$log', 'global', '$location', 'localStorageService', 'chunks',
        function ($scope, $http, $log, global, $location, localStorageService, chunks) {
            $scope.actorData = {
                "name": "",
                "sex": "",
                "date_of_birth": "",
                "bio": ""
            }
            $scope.addActor = function (actorData) {
                $http.put(global.url + "api/actor", actorData).then(function (response) {
                    $scope.successMessage = "actor Detail Successfully Addded "
                    $scope.actorData = {
                        "name": "",
                        "sex": "",
                        "date_of_birth": "",
                        "bio": ""
                    }
                    $http.get(global.url + "api/actor").then(function (response) {
                        global.acterList = response.data;
                        //$('.modal').style.display = "none";
                    })

                })
            }
        }])
    .controller('AddProducer', ['$scope', '$http', '$log', 'global', '$location', 'localStorageService', 'chunks',
        function ($scope, $http, $log, global, $location, localStorageService, chunks) {
            $scope.actorData = {
                "name": "",
                "sex": "",
                "date_of_birth": "",
                "bio": ""
            }
            $http.get(global.url + "api/Producer").then(function (response) {
                console.log(response);
                $scope.producerList = response.data;
            })
            $scope.addproducer = function (actorData) {
                $http.put(global.url + "api/producer", actorData).then(function (response) {
                    $scope.successMessage = "producer Detail Successfully Addded "
                    $scope.actorData = {
                        "name": "",
                        "sex": "",
                        "date_of_birth": "",
                        "bio": ""
                    }
                    $http.get(global.url + "api/Actor").then(function (response) {
                        $scope.actorList = response.data;
                    })

                })
            }
        }])