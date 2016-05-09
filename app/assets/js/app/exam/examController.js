


angular.module('ExamModule').controller('ExamController',
        ['$scope', "$http", function ($scope, $http) {
                $scope.newPatient = {};
                $scope.historics = [];
                $scope.date = new Date();
                $scope.newHistoric = {};
                $scope.newHistoric.patient = {};
                $scope.newHistoric.company = {};
                $scope.newHistoric.exam = {};
                $scope.newHistoric.registerDate = new Date();

                $scope.editHistoric = {};



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

                $scope.saveHistoric = function (valid) {
                    // verifica que elevento sea el de capturar un elemento
                    if (valid) {
                        $scope.editHistoric.processed = true;
                        io.socket.post("/historic/edit", {historic: $scope.editHistoric}, function (data) {
                            if (data) {
                                $scope.editHistoric = {};
                                msg("Exito al guardar los resultados", "", "success");
                                $(createResultModal).modal("hide");
                                $scope.$apply();
                            } else {
                                msg("No se pudo editar", "", "warning");
                            }
                        });
                    } else {
                        alert("Hay campos que no son validos o faltan en el formulario");
                    }

                };
                $scope.getHistorics = function () {
                    console.log("getHistorics");
                    io.socket.post("/historic/getAll", {date: $scope.date}, function (data) {
                        console.log(data);
                        if (data.err) {
                            msg('Problema al cargar historico', '', 'warning');
                        } else {
                            $scope.historics = data;
                        }
                        $scope.$apply();
                    });
                };
                //obteniendo listado del día
                $scope.getHistorics();


                $scope.validateHistoric = function () {
                    var state = true;
                    if (!(_.isEmpty($scope.newHistoric.patient)
                            || _.isEmpty($scope.newHistoric.exam)
                            || _.isEmpty($scope.newHistoric.company))) {
                        state = false;
                    }

                    return state;
                }

                $scope.openNewResult = function (historic) {
                    $scope.editHistoric = historic;
                    $('#createResultModal').modal("show");
                    //$scope.isSaving = false
                };

                $scope.filterName = function (historic) {
                    if ($scope.filter.trim() === "")
                        return true;
                    var find = $scope.filter.toLowerCase();
                    return (historic.patient.name + " " + historic.patient.lastName).toLowerCase().indexOf(find) !== -1;
                }
            }
        ]);

