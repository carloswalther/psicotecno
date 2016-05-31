


angular.module('ExamEditModule').controller('ExamEditController',
        ['$scope', "$http", function ($scope, $http) {
                $scope.newExam = {};
                $scope.exams = appVars.exams;
                $scope.examFilterName = "";
                $scope.creaateExam = function () {
                    io.socket.post("/exam/create", {order: $scope.newExam.order,
                        name: $scope.newExam.name,
                        cost: $scope.newExam.cost,
                        particularCost: $scope.newExam.particularCost}, function (exam) {
                        if (exam) {
                            console.log(exam);
                            $scope.newExam = {};
                            $scope.getAllExams();
                            msg("Examen creado exitosamente", "", "success");
                        } else {
                            msg("No se pudo crear el examen", "", "danger");
                        }

                    });

                };

                $scope.editExam = function (examen, refresh) {
                    console.log("editando", examen);
                    io.socket.put("/exam/" + examen.id, examen, function (exam) {
                        if (exam) {
                            console.log("editado", exam);
                            if (refresh) {
                                $scope.getAllExams();
                            }
                            //$scope.exams.push(exam);
                            msg("Examen editado exitosamente", "", "success");
                        } else {
                            msg("No se pudo crear el examen", "", "danger");
                        }
                    });

                };
                $scope.deleteExam = function (exam) {
                    io.socket.delete("/exam/" + exam.id, function (exam) {
                        if (exam) {
                            console.log(exam);
                            $scope.getAllExams();
                            msg("Examen borrado exitosamente", "", "success");
                        } else {
                            msg("No se pudo crear el examen", "", "danger");
                        }
                    });

                };
                $scope.getAllExams = function () {
                    io.socket.get("/exam/getAll", function (exam) {
                        if (exam) {
                            //$scope.exams.push(exam);
                            $scope.exams = exam;
                            $scope.$apply($scope.exams);
                            $("#createExamModal").modal("hide");
                        } else {
                            msg("No se pudo obtener listado de examenes", "", "danger");
                        }
                    });
                };

                $scope.openNewExam = function () {
                    $scope.newExam = {};
                    $("#createExamModal").modal("show");
                };

                $scope.filterName = function (exam) {
                    if ($scope.examFilterName.trim() === "")
                        return true;
                    var find = $scope.examFilterName.toLowerCase();
                    return (exam.name).toLowerCase().indexOf(find) !== -1;
                };


            }]);

