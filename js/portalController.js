portalApp
    .controller('container', ['$scope', '$log', 'global', '$location','localStorageService',
        function ($scope, $log, global, $location,localStorageService) {
            
           
        }])
    .controller('addmovie', ['$scope', '$http', '$log', 'global', '$location', 'localStorageService','chunks',
        function ($scope, $http, $log, global, $location, localStorageService, chunks) {
            $scope.successMessage = '';
            $scope.data = {
                "movie_name": "",
                "plot": "",
                "producer": {},
                "producer_id": "",
                "actors": [],
                "year_of_release": "",
                "poster": ""
            }
            if (global.movieData != undefined) {
                
                $scope.data = global.movieData;
                console.log($scope.data)
                $scope.image = $scope.data.poster;
                global.data = {};
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
            

            $scope.submit = function () {
                if (global.movieEdit) {
                    $scope.data.producer_id = $scope.data.producer.producer_id;
                    console.log($scope.data)
                    $http({
                        url: global.url + "api/movies?movieId=" + global.movie_id,
                        data: $scope.data,
                        method: "POST"
                    }).then(function () {
                        global.movieId = "/";
                        $location.url()
                        console.log("Success");
                    }, function () {
                        console.log("failed");
                    });
                }
                else {
                    $scope.data.producer_id = $scope.data.producer.producer_id;
                    console.log($scope.data)
                    $http({
                        url: global.url + "api/movies",
                        data: $scope.data,
                        method: "PUT"
                    }).then(function () {
                        console.log("Success");
                    }, function () {
                        console.log("failed");
                    });
                }
                
            }

            $scope.uploadFile = function (input) {

                if (input.files && input.files[0]) {
                    var reader = new FileReader();
                    reader.onload = function (e) {

                        //Sets the Old Image to new New Image
                        $('#photo-id').attr('src', e.target.result);

                        //Create a canvas and draw image on Client Side to get the byte[] equivalent
                        var canvas = document.createElement("canvas");
                        var imageElement = document.createElement("img");

                        imageElement.setAttribute('src', e.target.result);
                        canvas.width = imageElement.width;
                        canvas.height = imageElement.height;
                        var context = canvas.getContext("2d");
                        context.drawImage(imageElement, 0, 0);
                        var base64Image = canvas.toDataURL("image/jpeg");
                        console.log(base64Image);
                        $scope.data.poster = base64Image.replace(/data:image\/jpeg;base64,/g, '');
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
                        $('.modal').style.display = "none";
                    })

                })
            }
            
        }])
    .controller('movie', ['$scope', '$http', '$log', 'global', '$location', 'localStorageService', 'chunks',
        function ($scope, $http, $log, global, $location, localStorageService, chunks) {
            $scope.redirect = function () {
                $location.url("/addmovie");
            }
            $http.get(global.url + "api/Movies").then(
                function (response) {
                    console.log(response);
                    $scope.dataList = response.data;
                    $scope.dataArray = chunks.divide($scope.dataList, 3);
                    console.log($scope.dataArray);
                    $scope.image = response.data.poster;
                }, function (response) {
                    console.log(response)
                })
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
                if (global.Role == "producer") {
                    var url = global.url +  "api/Movies?movieId=" + data.movie_id;
                    $http.delete(url).then(function (response) {
                        $http.get(global.url + "api/Movies").then(function (response) {
                            $$scope.dataList = response.data;
                        })
                        $scope.successMessage = "Deleted a Movie Successfully";
                    });
                }
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
