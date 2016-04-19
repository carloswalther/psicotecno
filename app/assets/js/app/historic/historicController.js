


angular.module('HistoricModule').controller('HistoricController',
        ['$scope', "$http", function ($scope, $http) {
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


                $scope.deleteItem = function (item) {
                    if (confirm("Estas seguro de querer eliminar " + item.name)) {
                        switch (item.type) {
                            case "product":
                                {
                                    var index = $scope.products.indexOf(item);
                                    $scope.products.splice(index, 1);
                                }
                                break;
                            case "service":
                                {
                                    var index = $scope.services.indexOf(item);
                                    $scope.services.splice(index, 1);
                                }
                                break;
                            case "supply":
                                {
                                    var index = $scope.supplies.indexOf(item);
                                    $scope.supplies.splice(index, 1);
                                }
                                break;
                            case "workforce":
                                {
                                    var index = $scope.worksforeces.indexOf(item);
                                    $scope.worksforeces.splice(index, 1);
                                }
                                break;
                            case "otherProduct":
                                {
                                    var index = $scope.otherProducts.indexOf(item);
                                    $scope.otherProducts.splice(index, 1);
                                }
                                break;
                        }
                    }

                };
                $scope.addCustomer = function (selected) {
                    // verifica que elevento sea el de capturar un elemento
                    if (!_.isUndefined(selected)) {
                        $scope.customer = $.extend(true, $scope.customer, selected.originalObject);
                    }
                };
                $scope.addService = function (selected) {
                    // verifica que elevento sea el de capturar un elemento
                    if (!_.isUndefined(selected)) {
                        var newObject = $.extend({}, selected.originalObject);
                        if (_.isEmpty(_.findWhere($scope.services, {id: newObject.id}))) {
                            $scope.services.push(newObject);
                            $scope.duesOptions = _.union($scope.duesOptions, [newObject.dues]);
                            $scope.duesOptions.sort();
                            var tempDues = _.map($scope.duesOptions, function (due) {
                                if (due >= newObject.dues) {
                                    return due;
                                }
                            });
                            $scope.duesOptions = _.compact(tempDues);
                            console.log("tempDues", $scope.duesOptions)


                            $scope.quotation.dues = _.first($scope.duesOptions);

                        } else {
                            msg("Ya está agregado este Servicio", "", "warning");
                        }

                    }
                };
                $scope.addServiceKit = function (service) {
                    // verifica que elevento sea el de capturar un elemento

                    service.forEach(function (serv) {
                        $scope.servicesKit.push(serv);
                    })
//                    $scope.duesOptions = [service.dues]
//                    $scope.quotation.dues = service.dues;
                };
                /**
                 *
                 * @returns {Number}
                 * @description Sumatoria del total de precios de producto
                 */
                $scope.getProductTotal = function () {
                    var total = 0;
                    for (var i = 0; i < $scope.products.length; i++) {
                        var product = $scope.products[i];
                        total += (product.price * product.quantity);
                    }
                    return total;
                };
                $scope.getServiceTotal = function () {
                    var total = 0;
                    for (var i = 0; i < $scope.services.length; i++) {
                        var product = $scope.services[i];
                        total += product.price;
                    }
                    for (var i = 0; i < $scope.servicesKit.length; i++) {
                        var product = $scope.servicesKit[i];
                        total += product.price;
                    }
                    return total;
                };
                $scope.getSupplyTotal = function () {
                    var total = 0;
                    for (var i = 0; i < $scope.supplies.length; i++) {
                        var product = $scope.supplies[i];
                        total += (product.price * product.quantity);
                    }
                    return total;
                };
                $scope.getWorkforceTotal = function () {
                    var total = 0;
                    for (var i = 0; i < $scope.workforces.length; i++) {
                        var product = $scope.workforces[i];
                        total += (product.price * product.quantity);
                    }
                    return total;
                };
                $scope.getOtherProductsTotal = function () {
                    var total = 0;
                    for (var i = 0; i < $scope.otherProducts.length; i++) {
                        var product = $scope.otherProducts[i];
                        total += (product.price * product.quantity);
                    }
                    return total;
                };

                $scope.getTotal = function () {
                    var total = 0;
                    total += $scope.getProductTotal();
                    total += $scope.getSupplyTotal();
                    total += $scope.getWorkforceTotal();
                    total += $scope.getOtherProductsTotal();
                    total += $scope.kit.price;
                    return total;
                };

                $scope.getTotalCost = function () {
                    var total = 0;
                    for (var i = 0; i < $scope.products.length; i++) {
                        var product = $scope.products[i];
                        total += (product.cost * product.quantity);
                    }
                    for (var i = 0; i < $scope.services.length; i++) {
                        var service = $scope.services[i];
                        total += (service.cost * service.quantity);
                    }
                    for (var i = 0; i < $scope.supplies.length; i++) {
                        var supply = $scope.supplies[i];
                        total += (supply.cost * supply.quantity);
                    }
                    return total;
                };
                $scope.getServiceCost = function () {
                    var total = 0;
                    for (var i = 0; i < $scope.services.length; i++) {
                        var product = $scope.services[i];
                        total += product.cost;
                    }
                    for (var i = 0; i < $scope.servicesKit.length; i++) {
                        var product = $scope.servicesKit[i];
                        total += product.cost;
                    }

                    return total;
                };

                $scope.calculateIncidentals = function () {
                    return $scope.getTotal() * ($scope.params.incidentals / 100);
                };
                $scope.calculateCommission = function () {
                    var total = 0;
                    total += $scope.getProductTotal();
                    total += $scope.getSupplyTotal();
                    total += $scope.getWorkforceTotal();
                    return total * ($scope.params.commission / 100);
                };

                $scope.calculateProfit = function () {
                    var total = 0;
                    total += $scope.getProductTotal();
                    total += $scope.getSupplyTotal();
                    total += $scope.getWorkforceTotal();
                    total += $scope.getOtherProductsTotal();
                    return (total * ($scope.params.percentProfit / 100));
                };
                $scope.calculateProfitAfterDiscount = function () {
                    var profit = $scope.calculateProfit();
                    var discount = $scope.discount();
                    var totalNeto = $scope.getProductTotal();
                    totalNeto += $scope.getSupplyTotal();
                    totalNeto += $scope.getWorkforceTotal();
                    totalNeto += $scope.getOtherProductsTotal();
                    if (totalNeto == 0) {
                        return 0;
                    } else {
                        return (100 * (profit + discount)) / totalNeto;
                    }

                };
                $scope.calculateProfitAfterDiscountMoney = function () {
                    var total = 0;
                    total += $scope.getProductTotal();
                    total += $scope.getSupplyTotal();
                    total += $scope.getWorkforceTotal();
                    total += $scope.getOtherProductsTotal();
                    return (total * ($scope.calculateProfitAfterDiscount() / 100));
                };
                $scope.calculateEnableCost = function () {

                    var duesProfitService = (($scope.getServiceTotal() - $scope.getServiceCost())
                            * $scope.quotation.roiDues)
                            * $scope.uf;

                    var totalCosts = $scope.getOtherProductsTotal();
                    totalCosts += $scope.getWorkforceTotal();
                    totalCosts += $scope.getProductTotal();
                    totalCosts += $scope.getSupplyTotal();
                    totalCosts += $scope.calculateCommission();
                    totalCosts += $scope.calculateIncidentals();
                    totalCosts += $scope.calculateProfit();

                    totalCosts -= duesProfitService;
                    //$scope.quotation.enableCost = (totalCosts - duesProfitService);
                    return totalCosts;

                };
                $scope.assignManualMargin = function () {
                    $scope.quotation.enableCostManual = $scope.calculateEnableCost()
                };
                $scope.reCalculateRoiDue = function (obj) {
                    if ($scope.services.length > 0) {
                        var duesProfitService = ($scope.getServiceTotal() - $scope.getServiceCost())
                        duesProfitService *= $scope.uf;
                        var totalCosts = $scope.getOtherProductsTotal();
                        totalCosts += $scope.getWorkforceTotal();
                        totalCosts += $scope.getProductTotal();
                        totalCosts += $scope.getSupplyTotal();
                        totalCosts += $scope.calculateCommission();
                        totalCosts += $scope.calculateIncidentals();
                        totalCosts += $scope.calculateProfit();

                        totalCosts -= $scope.quotation.enableCostManual;

                        $scope.quotation.roiDues = totalCosts / duesProfitService;
                    } else {
                        $scope.quotation.enableCostManual = 0;
                        msg("No hay servicios", " Debes seleccionar un servicio antes de ingresar una monto de habilitación manual", "danger")
                    }

                };
                $scope.totalImplememtation = function () {
                    var totalCosts = $scope.getOtherProductsTotal();
                    totalCosts += $scope.getWorkforceTotal();
                    totalCosts += $scope.getProductTotal();
                    totalCosts += $scope.getSupplyTotal();
                    totalCosts += $scope.calculateCommission();
                    totalCosts += $scope.calculateIncidentals();
                    totalCosts += $scope.calculateProfit();


                    return totalCosts + $scope.discount();
                };
                $scope.calculateDuePriceCLP = function () {
                    return $scope.uf * $scope.getServiceTotal();
                };
                $scope.calculateDuePriceUF = function () {
                    return $scope.getServiceTotal();
                };
                $scope.calculateVentaCiclo = function () {
                    var total = 0;
                    total = $scope.calculateDuePriceCLP() * $scope.quotation.dues
                    return total;
                };
                $scope.calculateCostoCiclo = function () {
                    var total = 0;
                    total = $scope.getServiceCost() * $scope.quotation.dues * $scope.uf;
                    return total;
                };

                $scope.calculateTotalCosto = function () {
                    var total = 0;
                    total += $scope.calculateCommission();
                    total += $scope.calculateIncidentals();
                    total += $scope.getTotal();
                    return total;
                };

                $scope.calculateTotalNeto = function () {
                    var total = 0;
                    total += $scope.calculateTotalCosto();
                    total += $scope.calculateProfit();



                    return total;
                };


                $scope.discount = function () {
                    var total = $scope.getTotal();
                    total += $scope.calculateProfit();
                    total += $scope.calculateIncidentals();
                    total += $scope.calculateCommission();

                    total = total * (-1 * $scope.quotation.discount / 100);
                    return total;
                };
                $scope.getPaymentPeriod = function () {
                    var inicial = $scope.quotation.initialPayment;
                    var cuota = $scope.quotation.dueValue;
                    var cost = $scope.getTotalCost();
                    if (cost <= inicial) {
                        return 0;
                    } else {
                        return ((cost - inicial) / cuota);
                    }
                };
                $scope.emptyAll = function () {
                    if (confirm("Estas seguro de limpiar la cotización")) {
                        $scope.products = [];
                        $scope.supplies = [];
                        $scope.services = [];
                        $scope.workforces = [];
                        $scope.otherProducts = [];
                        $scope.customer = null;
                    }

                };

                /**
                 * Sección de KITS
                 */
                $scope.getKits = function () {
                    io.socket.get("/kit", function (data) {
                        $scope.kits = data;
                        console.log("kits", data)
                        $scope.$apply();
                        //msg("hola", "chao", "success");
                    });
                }
                $scope.getKits();
                $scope.openKits = function () {

                    $('#selectKitModal').modal("show");
                };

                $scope.chargeKit = function (lKit) {
                    console.log("ID:", lKit);
                    $scope.kit = lKit;
                    $scope.productsKit = lKit.json.products;
                    $scope.addServiceKit(lKit.json.services);
                    $scope.suppliesKit = lKit.json.supplies;
                    $scope.workforcesKit = lKit.json.workforces;
                    $scope.otherProductsKit = lKit.json.otherProducts;
                    $scope.duesOptions = [lKit.dues]
                    $scope.quotation.dues = lKit.dues
                    //$scope.kit = _.findWhere($scope.kits, {id: $scope.kitSelectedId});
                    msg(lKit.name, "Cargado exitosamente", "success");
                };
                $scope.openSaveKit = function () {
                    $scope.newKit.dues = $scope.quotation.dues;
                    $scope.newKit.enableCostManual = $scope.quotation.enableCostManual;
                    $scope.newKit.profit = $scope.calculateProfit();
                    $scope.newKit.profitAfterDiscount = $scope.calculateProfitAfterDiscountMoney();
                    $scope.newKit.price = $scope.totalImplememtation();
                    $("#newKitModal").modal("show");
                };
                $scope.saveKit = function () {
                    //debugger;
                    $scope.newKit.json.products = $scope.products;
                    $scope.newKit.json.services = $scope.services;
                    $scope.newKit.json.supplies = $scope.supplies;
                    $scope.newKit.json.workforces = $scope.supplies;
                    $scope.newKit.json.otherProducts = $scope.otherProducts;
                    $scope.newKit.dues = $scope.quotation.dues;
                    $scope.newKit.enableCostManual = $scope.quotation.enableCostManual;
                    $scope.newKit.profit = $scope.calculateProfit();
                    $scope.newKit.profitAfterDiscount = $scope.calculateProfitAfterDiscountMoney();
                    $scope.newKit.price = $scope.totalImplememtation();

                    io.socket.post("/kit/create", {kit: $scope.newKit}, function (data) {
                        if (data.res) {
                            console.log("Kit Creado:", data.obj);
                            msg("Kit creado exitosamente", data.obj.name, "success");
                            $scope.getKits();
                        } else {
                            msg("Kit no se pudo creear", data.msg, "danger");
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

