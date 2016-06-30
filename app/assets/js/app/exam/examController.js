


angular.module('ExamModule').controller('ExamController',
        ['$scope', 'Upload', "$timeout", "$http", function ($scope, Upload, $timeout, $http) {
                $scope.filter = "";
                $scope.newPatient = {};
                $scope.historics = [];
                $scope.date = new Date();
                $scope.newHistoric = {};
                $scope.newHistoric.patient = {};
                $scope.newHistoric.company = {};
                $scope.newHistoric.exam = {};
                $scope.newHistoric.registerDate = new Date();
                //file section
                $scope.files = [];
                $scope.fileId = "";
                $scope.patientId = null;

                //multiple exams
                $scope.examsToRegister = [];

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
                                $scope.getHistorics();
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
                    $scope.editHistoric.type = "single";

                    $('#createResultModal').modal("show");
                    //$scope.isSaving = false
                };
                $scope.openNewResultMultiple = function () {
                    $scope.editHistoric = {};
                    $scope.editHistoric.type = "multiple";
                    $scope.editHistoric.ids = $scope.examsToRegister;

                    $('#createResultModal').modal("show");
                    //$scope.isSaving = false
                };

                $scope.filterName = function (historic) {
                    if ($scope.filter.trim() === "")
                        return true;
                    var find = $scope.filter.toLowerCase();
                    var searchFrace = historic.patientName + " "
                    searchFrace += _.isUndefined(historic.patientSecondName) ? "" : " " + historic.patientSecondName;
                    searchFrace += _.isUndefined(historic.patientLastName) ? "" : " " + historic.patientLastName;
                    searchFrace += _.isUndefined(historic.patientSecondLastName) ? "" : " " + historic.patientSecondLastName;
                    searchFrace = searchFrace.toLowerCase();
                    console.log(searchFrace);
                    return (searchFrace.indexOf(find) !== -1);
                };

                //file section

                $scope.openFiles = function (patient) {
                    console.log("patinet", patient)
                    $scope.getFiles(patient.id);
                    $('#file').modal("show");
                    $scope.isSaving = false
                };

                $scope.getFiles = function (patientId) {
                    $scope.files = [];
                    $scope.patientId = patientId;
                    io.socket.get("/archivo", {patient: patientId}, function (files) {
                        $scope.files = files;
                        console.log(files);
                        $scope.$apply($scope.files);
                    });
                };

                $scope.download = function (id) {
                    $scope.fileId = id;
                    $("#patientId").val(id);
                    $("#downloadFile").submit();

                    //$scope.$apply($scope.fileId);

                };
                $scope.picFile = null;
                $scope.uploadPic = function (file) {
                    file.upload = Upload.upload({
                        url: '/patient/uploadFile',
                        method: 'POST',
                        data: {patient: $scope.patientId, file: file},
                    });

                    file.upload.then(function (response) {
                        $timeout(function () {
                            file.result = response.data;
                            $scope.files.push($.extend({}, response.data));
                            $scope.$apply($scope.files);
                        });
                    }, function (response) {
                        if (response.status > 0)
                            $scope.errorMsg = response.status + ': ' + response.data;
//                        else {
//                            console.log("archivo subido", response);
//                            $scope.files.push($.extend({}, response.data));
//                            $scope.$apply($scope.files);
//                        }
                    }, function (evt) {
                        // Math.min is to fix IE which reports 200% sometimes
                        file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));

                    });
                };
                $scope.getRowClass = function (historic) {
                    if (!_.isNull(historic.edad) && !_.isNull(historic.conclusion)) {
                        if (historic.conclusion === "Conclusión Pendiente")
                            return "warning";
                        return "success";
                    }
                    if (!_.isNull(historic.edad)) {
                        return "warning";
                    }
                    return;
                };
            }
        ]);

