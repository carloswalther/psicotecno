


angular.module('HistoricModule').controller('HistoricController',
        ['$scope', "$http", function ($scope, $http) {
                $scope.newPatient = {};
                $scope.historics = [];

                $scope.newHistoric = {};
                $scope.newHistoric.patient = {};
                $scope.newHistoric.company = {};
                $scope.newHistoric.exam = {};
                $scope.newHistoric.registerDate = new Date();


                $scope.exams = appVars.exams;


                io.socket.post("/historic/getAll", {date: new Date()}, function (data) {
                    if (data.err) {
                        msg('Problema al cargar historico', '', 'warning');
                    } else {
                        $scope.historics = data;
                    }
                    $scope.$apply();
                });


                /**
                 *
                 * @param {type} selected objeto seleccionado
                 * @returns {undefined}
                 */
                $scope.addPatient = function (selected) {
                    // verifica que elevento sea el de capturar un elemento
                    if (!_.isUndefined(selected)) {
                        $scope.newHistoric.patient = $.extend({}, selected.originalObject)
                        //$scope.itemSelected = selected.originalObject;
                    }
                };
                /**
                 *
                 * @param {type} selected objeto seleccionado compañia de la lista
                 * @returns {undefined}
                 */
                $scope.addCompany = function (selected) {
                    // verifica que elevento sea el de capturar un elemento
                    if (!_.isUndefined(selected)) {
                        $scope.newHistoric.company = $.extend({}, selected.originalObject)
                        //$scope.itemSelected = selected.originalObject;
                    }
                };

                $scope.saveHistoric = function () {
                    // verifica que elevento sea el de capturar un elemento
                    if (!_.isEmpty($scope.newHistoric.patient)
                            && !_.isEmpty($scope.newHistoric.exam)
                            && !_.isEmpty($scope.newHistoric.company)) {

                        io.socket.post("/historic/create", {historic: $scope.newHistoric}, function (data) {
                            if (data) {
                                var historic = $.extend(data, $scope.newHistoric);
                                $scope.historics.push(historic);
                                $scope.clarAll();
                                $scope.$apply();
                            } else {
                                msg("No se pudo crear", "", "warning");
                            }
                        });
                    } else {
                        msg("Hay campos obligatorios que no se han llenador", "", "warning");
                    }

                };
                $scope.clarAll = function () {
                    delete $scope.newHistoric.respApplication;
                    delete $scope.newHistoric.cc;
                    $scope.newHistoric.patient = {};
                    $scope.newHistoric.company = {};
                    $scope.newHistoric.exam = {};
                    $("#patient_value").val("");
                    $("#company_value").val("");
                };
                $scope.getHistorics = function () {
                    console.log("getHistorics");
                    io.socket.post("/historic/getAll", {date: $scope.newHistoric.registerDate}, function (data) {
                        console.log(data);
                        if (data.err) {
                            msg('Problema al cargar historico', '', 'warning');
                        } else {
                            $scope.historics = data;
                        }
                        $scope.$apply();
                    });
                };



                $scope.openNewPatient = function () {

                    $('#createPatientModal').modal("show");
                };

                $scope.savePatient = function () {


                    io.socket.post("/patient/create", {patient: $scope.newPatient}, function (data) {
                        if (data) {
                            $scope.newHistoric.patient = $.extend($scope.newPatient, data);
                            $("#patient_value").val(data.name + " " + data.lastName);
                            msg("Paciente creado exitosamente", "", "success");
                            $('#createPatientModal').modal("hide");
                            $scope.newPatient.error = false

                        } else {
                            $scope.newPatient.error = true;
                            $scope.$apply($scope.newPatient)
                            //msg("Paciente no se pudo creear", "", "danger");
                        }

                    });
                };
                //Validation of all form for quitation
                $scope.validateHistoric = function () {
                    var state = true;
                    if (!(_.isEmpty($scope.newHistoric.patient)
                            || _.isEmpty($scope.newHistoric.exam)
                            || _.isEmpty($scope.newHistoric.company))) {
                        state = false;
                    }

                    return state;
                }
            }
        ]);

