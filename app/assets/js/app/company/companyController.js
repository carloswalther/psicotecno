


angular.module('CompanyModule').controller('CompanyController',
        ['$scope', "$timeout", "$http", function ($scope, $timeout, $http) {
                $scope.newCompany = {};
                $scope.company = {};
                $scope.isSaving = false;

                /**
                 *
                 * @param {type} selected objeto seleccionado compañia de la lista
                 * @returns {undefined}
                 */
                $scope.addCompany = function (selected) {
                    // verifica que elevento sea el de capturar un elemento
                    if (!_.isUndefined(selected)) {
                        $scope.company = $.extend({}, selected.originalObject);
                        $scope.company.centralPayment = $scope.company.centralPayment ? 1 : 0;
                        //$scope.itemSelected = selected.originalObject;
                    }
                };


                $scope.openNewCompany = function () {

                    $('#createCompanyModal').modal("show");

                };

                $scope.saveCompany = function () {

                    $scope.isSaving = true;
                    io.socket.post("/company/create", {company: $scope.newCompany}, function (data) {

                        $scope.isSaving = false;
                        if (data) {
                            $scope.company = $.extend($scope.newCompany, data);
                            msg("Empresa creada exitosamente", "", "success");
                            $('#createCompanyModal').modal("hide");
                            $scope.newCompany.error = false
                        } else {
                            $scope.newCompany.error = true;
                            $scope.$apply($scope.newCompany)
                            //msg("Empresa no se pudo creear", "", "danger");
                        }


                    });
                };



                $scope.savePatient = function () {
                    $scope.isSaving = true;
                    io.socket.post("/patient/create", {patient: $scope.newPatient}, function (data) {
                        if (data) {
                            $scope.newHistoric.patient = $.extend($scope.newPatient, data);
                            msg("Paciente creado exitosamente", "", "success");
                            $('#createPatientModal').modal("hide");
                            $scope.newPatient.error = false
                        } else {
                            $scope.newPatient.error = true;
                            //msg("Paciente no se pudo creear", "", "danger");
                        }

                    });
                };

                $scope.editCompany = function () {
                    $scope.isSaving = true;
                    io.socket.post("/company/edit", {company: $scope.company}, function (data) {
                        if (data) {
                            msg("Empresa editada exitosamente", "", "success");
                        } else {
                            msg("Error al editar empresa", "", "danger");

                        }

                    });
                };

            }
        ]);

