


angular.module('dailyReportModule').controller('dailyReportController',
        ['$scope', "$http", function ($scope, $http) {
                $scope.filter = {
                    from: new Date(),
                    to: new Date(),
                };
                $scope.lastFilter = $.extend({}, $scope.filter);
                $scope.patient = {};
                $scope.historics = [];

                /**
                 *
                 * @param {type} selected objeto seleccionado
                 * @returns {undefined}
                 */
                $scope.addPatient = function (selected) {
                    // verifica que elevento sea el de capturar un elemento
                    if (!_.isUndefined(selected)) {
                        $scope.patient = $.extend({}, selected.originalObject)
                        //$scope.itemSelected = selected.originalObject;
                    }
                };

                $scope.findHistoricByPatient = function () {
                    io.socket.post("/historic/getHistoricByPatient", {patient: $scope.patient}, function (data) {
                        if (data) {
                            $scope.historics = data;
                            $scope.$apply($scope.historics)
                        } else {
                            $scope.historics = [];
                            $scope.$apply($scope.historics)
                            msg("No se obtuvieron datos de este paciente", "", "warning");
                        }
                    });
                }

                io.socket.post("/historic/report", {filter: $scope.filter}, function (data) {
                    if (data) {
                        $scope.historics = data;
                    } else {
                        msg('Problema al cargar historico', '', 'warning');
                    }
                    $scope.$apply();
                });


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

                $scope.deleteIfEmpty = function () {
                    if ($("#company_value").val() === "") {
                        console.log("borrando objeto company");
                        $scope.clarAll();
                    }
                };

                $scope.clarAll = function () {

                    delete $scope.filter.company;

                };

            }
        ]);

