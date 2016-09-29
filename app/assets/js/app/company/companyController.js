


angular.module('CompanyModule').controller('CompanyController',
        ['$scope', "$timeout", "$http", function ($scope, $timeout, $http) {
                $scope.newCompany = {};
                $scope.company = null;
                $scope.isSaving = false;
                $scope.companies = [];
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

                io.socket.post("/company/getAll", {}, function (data) {
                    $scope.companies = data;
                    $scope.$apply($scope.companies);
                });

                $scope.openNewCompany = function () {

                    $('#createCompanyModal').modal("show");

                };

                $scope.saveCompany = function () {

                    $scope.isSaving = true;
                    io.socket.post("/company/create", {company: $scope.newCompany}, function (data) {

                        $scope.isSaving = false;
                        if (data) {
                            $scope.company = $.extend({}, data);
                            $scope.company.centralPayment = $scope.company.centralPayment ? 1 : 0;
                            $scope.$apply($scope.company)
                            msg("Empresa creada exitosamente", "", "success");
                            $('#createCompanyModal').modal("hide");
                            $scope.newCompany = {};
                            $scope.newCompany.error = false
                        } else {
                            $scope.newCompany.error = true;
                            $scope.$apply($scope.newCompany)
                            //msg("Empresa no se pudo creear", "", "danger");
                        }


                    });
                };

            $scope.delete = function (company) {

                $scope.isSaving = true;
                var lComp = _.findWhere($scope.companies,{id:company.id});
                var index = $scope.companies.indexOf(lComp);
                console.log("index company",index);
                io.socket.delete("/company/"+company.id, function (data,jwRes) {
                    if (jwRes.statusCode === 200){
                        msg("Empresa "+data.nombre," eliminada con exito","success");

                        if (index !== -1) {
                            $scope.companies.splice(index, index + 1);
                            $scope.company = null;
                            $scope.$apply();

                        }
                    }else{
                        msg("Fallo al borrar","No se pudo borrar el registro","warning");
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

