


angular.module('PatientModule').controller('PatientController',
        ['$scope', 'Upload', "$timeout", "$http", function ($scope, Upload, $timeout, $http) {
                $scope.newPatient = {};
                $scope.patient = null;
                $scope.files = [];
                $scope.fileId = "";

                /**
                 *
                 * @param {type} selected objeto seleccionado
                 * @returns {undefined}
                 */
                $scope.addPatient = function (selected) {
                    // verifica que elevento sea el de capturar un elemento
                    if (!_.isUndefined(selected)) {
                        $scope.patient = $.extend({}, selected.originalObject);
                        //$scope.itemSelected = selected.originalObject;
                    }
                };


                $scope.openNewPatient = function () {

                    $('#createPatientModal').modal("show");
                    $scope.isSaving = false
                };




                $scope.savePatient = function () {
                    $scope.isSaving = true;

                    io.socket.post("/patient/create", {patient: $scope.newPatient}, function (data) {
                        if (data) {
                            $scope.patient = $.extend({}, data);
                            $scope.$apply($scope.patient);
                            msg("Paciente creado exitosamente", "", "success");
                            $('#createPatientModal').modal("hide");
                            $scope.newPatient = {};
                            $scope.newPatient.error = false
                        } else {

                            $scope.newPatient.error = true;
                            $scope.$apply($scope.newPatient)
                            //msg("Paciente no se pudo creear", "", "danger");
                        }
                    });
                };
                $scope.isNull = function (obj) {
                    if (_.isNull(obj))
                        return true;
                    else
                        return false;
                }
                $scope.editPatient = function () {
                    $scope.isSaving = true;
                    io.socket.post("/patient/edit", {patient: $scope.patient}, function (data) {
                        if (data) {
                            msg("Paciente editado exitosamente", "", "success");
                        } else {
                            msg("Error al editar paciente", "", "danger");

                        }

                    });
                };
                $scope.validatePatient = function () {
                    if (!_.isEmpty($scope.newPatient.name) ||
                            !_.isEmpty($scope.newPatient.lastName) ||
                            !_.isEmpty($scope.newPatient.rut)) {
                        return true;
                    } else {
                        return false;
                    }
                };

                $scope.openFiles = function () {
                    $scope.getFiles();
                    $('#file').modal("show");
                    $scope.isSaving = false
                };
                $scope.getFiles = function () {
                    $scope.files = [];
                    io.socket.get("/archivo", {patient: $scope.patient.id}, function (files) {
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
                $scope.deleteFile = function (file) {
                    if (confirm("seguro que deseas eliminar ", file.name)) {
                        io.socket.post("/archivo/deleteFile", {file: file}, function (res) {
                            if (res) {
                                var index = $scope.files.indexOf(file);
                                if (index === 0) {
                                    $scope.files.shift();
                                } else {
                                    $scope.files.splice(index);
                                }
                                $scope.$apply($scope.files);
                            } else {
                                console.log("no se pudo eliminar")
                            }
                        });
                    }

                };

                $scope.picFile = null;
                $scope.uploadPic = function (file) {
                    file.upload = Upload.upload({
                        url: '/patient/uploadFile',
                        method: 'POST',
                        data: {patient: $scope.patient.id, file: file}
                    });

                    file.upload.then(function (response) {
                        $timeout(function () {
                            file.result = response.data;
                            $scope.files.push($.extend({}, response.data));
                            $scope.$apply($scope.files)
                        });
                    }, function (response) {
                        if (response.status > 0)
                            $scope.errorMsg = response.status + ': ' + response.data;
                    }, function (evt) {
                        // Math.min is to fix IE which reports 200% sometimes
                        file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                    });
                };
            }
        ]);

