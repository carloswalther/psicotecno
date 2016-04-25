


angular.module('PatientModule').controller('PatientController',
        ['$scope', "$http", function ($scope, $http) {
                $scope.newPatient = {};
                $scope.historics = [];

                $scope.newHistoric = {};
                $scope.newHistoric.patient = {};
                $scope.newHistoric.company = {};
                $scope.newHistoric.exam = {};
                $scope.newHistoric.registerDate = new Date();


                //$scope.exams = appVars.exams;


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
            

                $scope.openNewPatient = function () {

                    $('#createPatientModal').modal("show");
                    $scope.isSaving = false
                };

                $scope.savePatient = function () {
                    $scope.isSaving = true
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



            }
        ]);

