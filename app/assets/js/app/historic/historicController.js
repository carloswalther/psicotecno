


angular.module('HistoricModule').controller('HistoricController',
        ['$scope', "$http", function ($scope, $http) {
                $scope.newPatient = {};
                $scope.historics = [];

                $scope.newHistoric = {};
                $scope.newHistoric.patient = {};
                $scope.newHistoric.company = {};
                $scope.newHistoric.exam = {};
                $scope.newHistoric.registerDate = new Date();


                $scope.exams = appVars.exams;


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

                $scope.saveHistoric = function () {
                    // verifica que elevento sea el de capturar un elemento
                    if (!_.isEmpty($scope.newHistoric.patient)
                            && !_.isEmpty($scope.newHistoric.exam)
                            && !_.isEmpty($scope.newHistoric.company)) {

                        io.socket.post("/historic/create", {historic: $scope.newHistoric}, function (data) {
                            if (data) {
                                var historic = $.extend(data, $scope.newHistoric);
                                $scope.historics.push(historic);
                                $scope.clarAll();
                                $scope.$apply();
                            } else {
                                msg("No se pudo crear", "", "warning");
                            }
                        });
                    } else {
                        msg("Hay campos obligatorios que no se han llenador", "", "warning");
                    }

                };
                $scope.clarAll = function () {
                    delete $scope.newHistoric.respApplication;
                    delete $scope.newHistoric.cc;
                    $scope.newHistoric.patient = {};
                    $scope.newHistoric.company = {};
                    $scope.newHistoric.exam = {};
                    $("#patient_value").val("");
                    $("#company_value").val("");
                };
                $scope.getHistorics = function () {
                    console.log("getHistorics");
                    io.socket.post("/historic/getAll", {date: $scope.newHistoric.registerDate}, function (data) {
                        console.log(data);
                        if (data.err) {
                            msg('Problema al cargar historico', '', 'warning');
                        } else {
                            $scope.historics = data;
                        }
                        $scope.$apply();
                    });
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



                $scope.openNewCompany = function () {

                    $('#createCompanyModal').modal("show");
                };

                $scope.saveCompany = function () {


                    io.socket.post("/company/create", {company: $scope.newCompany}, function (data) {
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
                $scope.validateQuotation = function () {
                    var state = false;
                    if (_.isEmpty($scope.services > 0)) {
                        state = true;
                    }
                    console.log(state);
                    return state;
                }

                // TEMPLATE
                $scope.openTemplates = function () {
                    $('#selectTemplateModal').modal("show");
                };
                $scope.getTemplates = function () {
                    io.socket.get("/template", function (data) {
                        $scope.templates = data;
                        console.log("template", data)
                        $scope.$apply();
                        //msg("hola", "chao", "success");
                    });
                }
                $scope.getTemplates();

                $scope.chargeTemplate = function (lTemplate) {
                    console.log("ID:", lTemplate);
                    $scope.products = lTemplate.json.products;
                    $scope.services = lTemplate.json.services;
                    $scope.supplies = lTemplate.json.supplies;
                    //$scope.kit = _.findWhere($scope.kits, {id: $scope.kitSelectedId});
                    msg(lTemplate.name, "Cargada exitosamente", "success");
                };
                $scope.openSaveTemplate = function () {
                    $("#newTemplateModal").modal("show");
                };
                $scope.openProductDetail = function () {
                    $("#productDetail").modal("show");
                };
                $scope.saveTemplate = function () {
                    //debugger;
                    $scope.template.json.products = $scope.products;
                    $scope.template.json.services = $scope.services;
                    $scope.template.json.supplies = $scope.supplies;
                    io.socket.post("/template/create", {template: $scope.template}, function (data) {
                        if (data.res) {
                            console.log("Template Creado:", data.obj);
                            msg("Template creado exitosamente", data.obj.name, "success");
                            $scope.getTemplates();
                        } else {
                            msg("Template no se pudo creear", data.msg, "danger");
                        }

                    });
                };
//                io.socket.get("/quotation/getLast", function (years) {
//                    $scope.$apply();
//                });
            }
        ]);

