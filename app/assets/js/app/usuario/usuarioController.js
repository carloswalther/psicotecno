


angular.module('UsuarioModule').controller('UsuarioController',
        ['$scope', "$http", function ($scope, $http) {
                $scope.newUsuario = {};
                $scope.usuarios = [];
                $scope.userFilterName = "";


                //$scope.exams = appVars.exams;


                io.socket.post("/usuario/list", {}, function (data) {
                    if (data) {
                        console.log(data);
                        $scope.usuarios = data;

                    } else {
                        msg('Problema al cargar historico', '', 'warning');
                    }
                    $scope.$apply();
                });


                $scope.openNewUsuario = function () {

                    $('#createUsuarioModal').modal("show");
                    $scope.isSaving = false
                };
                $scope.edit = function (usuario) {
                    io.socket.post("/usuario/edit", {usuario: usuario}, function (data) {
                        delete usuario.password;
                        if (data) {

                            msg('Usuario editado exitosamente', '', 'success');
                        } else {
                            msg('Problema al cargar historico', '', 'warning');
                        }
                        $scope.$apply();
                    });
                };
                $scope.delete = function (usuario) {
                    if (confirm("Estás seguro de eliminar al usuario:" + usuario.nombre)) {
                        io.socket.post("/usuario/delete", {usuario: usuario}, function (data) {
                            if (data) {
                                msg('Usuario eliminado exitosamente', '', 'success');
                                var indice = $scope.usuarios.indexOf(usuario);
                                $scope.usuarios.splice(indice);
                                $scope.$apply($scope.usuarios);
                            } else {
                                msg('Problema al cargar historico', '', 'warning');
                            }

                        });
                    }

                };


                $scope.saveUsuario = function () {
                    $scope.isSaving = true
                    io.socket.post("/usuario/create", {usuario: $scope.newUsuario}, function (data) {
                        if (data) {
                            delete data.password;
                            var usuario = $.extend({}, data);
                            msg("Usuario creado exitosamente", "", "success");
                            $scope.usuarios.push(usuario);
                            $scope.$apply($scope.usuarios);
                            $('#createUsuarioModal').modal("hide");
                            $scope.isSaving = false
                        } else {
                            $scope.newPatient.error = true;
                            $scope.$apply($scope.usuarios)
                            //msg("Paciente no se pudo creear", "", "danger");
                        }

                    });
                };

                $scope.filterName = function (user) {
                    if ($scope.userFilterName.trim() === "")
                        return true;
                    var find = $scope.userFilterName.toLowerCase();
                    return (user.nombre + " " + user.apellido).toLowerCase().indexOf(find) !== -1;
                };



            }
        ]);

