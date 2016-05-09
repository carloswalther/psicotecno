


angular.module('HistoricReportModule').controller('HistoricReportController',
        ['$scope', "$http", function ($scope, $http) {
                $scope.filter = {
                    from: new Date(),
                    to: new Date(),
                    pooc: "pooc"
                };
                $scope.lastFilter = $.extend({}, $scope.filter);
                $scope.newPatient = {};
                $scope.historics = [];
                $scope.nameFilter = "";
                $scope.newHistoric = {};
                $scope.newHistoric.patient = {};
                $scope.newHistoric.company = {};
                $scope.newHistoric.exam = {};
                $scope.newHistoric.pooc = "PO";
                $scope.newHistoric.registerDate = new Date();


                io.socket.post("/historic/report", {filter: $scope.filter}, function (data) {
                    if (data) {
                        $scope.historics = data;
                    } else {

                        msg('Problema al cargar historico', '', 'warning');
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
                        $scope.filter.company = $.extend({}, selected.originalObject)
                    }
                };

                $scope.searchReport = function () {
                    // verifica que elevento sea el de capturar un elemento


                    io.socket.post("/historic/report", {filter: $scope.filter}, function (data) {
                        if (data) {
                            $scope.historics = data;
                            $scope.lastFilter = $.extend({}, $scope.filter);
                            $scope.$apply();
                        } else {
                            msg("No se pudo crear", "", "warning");
                        }
                    });
                };

                $scope.userFilter = function (user) {
                    if ($scope.nameFilter.trim() === "")
                        return true;
                    var find = $scope.nameFilter.toLowerCase();
                    return (user.patientName + " " + user.patientSecondName + " " + user.patientLastName + " " + user.patientSecondLasttName).toLowerCase().indexOf(find) !== -1;
                };
                $scope.companyFilter = function (user) {
                    if ($scope.companyFilter.trim() === "")
                        return true;
                    var find = $scope.companyFilter.toLowerCase();
                    return (user.patientName + " " + user.patientSecondName + " " + user.patientLastName + " " + user.patientSecondLasttName).toLowerCase().indexOf(find) !== -1;
                };

                $scope.clarAll = function () {

                    delete $scope.filter.company;
                    $("#company_value").val("");
                };
                $scope.getTotalCost = function () {
                    var total = 0;
                    for (i = 0; i < $scope.historics.length; i++) {
                        total += $scope.historics[i].exam.cost;
                    }
                    return total;
                };


                $scope.validateHistoric = function () {
                    var state = true;
                    if (!(_.isEmpty($scope.newHistoric.patient)
                            || _.isEmpty($scope.newHistoric.exam)
                            || _.isEmpty($scope.newHistoric.company))) {
                        state = false;
                    }

                    return state;
                }

                $scope.openNewPatient = function () {

                    $('#createPatientModal').modal("show");

                };

                $scope.savePatient = function () {
                    $scope.isSaving = true
                    io.socket.post("/patient/create", {patient: $scope.newPatient}, function (data) {
                        $scope.isSaving = false;
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



                $scope.openNewCompany = function () {

                    $('#createCompanyModal').modal("show");

                };

                $scope.saveCompany = function () {

                    $scope.isSaving = true;
                    io.socket.post("/company/create", {company: $scope.newCompany}, function (data) {

                        $scope.isSaving = false;
                        if (data) {
                            $scope.newHistoric.company = $.extend($scope.newCompany, data);
                            $("#company_value").val(data.name + " " + data.rut);
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

