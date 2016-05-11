/**
 * HistoricController
 *
 * @description :: Server-side logic for managing historics
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    index: function (req, res) {
        Exam.find().exec(function (err, exams) {
            return res.view({exams: exams});
        })
    },
    create: function (req, res) {
        var newHistoric = req.body.historic;
        newHistoric.companyName = newHistoric.company.name;
        newHistoric.companyRut = newHistoric.company.rut;
        newHistoric.centralPayment = newHistoric.company.centralPayment;

        newHistoric.patientRut = newHistoric.patient.rut;
        newHistoric.patientName = newHistoric.patient.name;
        newHistoric.patientSecondName = newHistoric.patient.secondName;
        newHistoric.patientLastName = newHistoric.patient.lastName;
        newHistoric.patientSecondLastName = newHistoric.patient.secondLastName;

        newHistoric.examName = newHistoric.exam.name;
        newHistoric.examCost = newHistoric.exam.cost;
        newHistoric.examParticularCost = newHistoric.exam.particularCost;

        Historic.create(req.body.historic).exec(function (err, historic) {
            if (err) {
                return res.send(false)
            } else {
                sails.log("New Historic:", historic);
                return res.send(historic);
            }
        });
    },
    edit: function (req, res) {
        sails.log("a guardar: ", req.body.historic)
        Historic.update({id: req.body.historic.id}, req.body.historic).exec(function (err, historic) {
            if (err) {
                return res.send(false)
            } else {
                sails.log("Edit Historic:", historic);
                return res.send(historic);
            }
        });
    },
    getAll: function (req, res) {
        var moment = require("moment");
        var q = {};
        //sails.log("DAte", req.body.date);
        var formatedStartDate = moment(req.body.date);
        var begin = moment(moment(req.body.date).format("YYYY-MM-DD")).toISOString();
        var end = moment(moment(req.body.date).format("YYYY-MM-DD")).add(1, 'days').toISOString();
        var queryObj = {registerDate: {'>=': begin, '<': end}};
        sails.log(queryObj)
        Historic.find(queryObj)
                .populateAll()
                .exec(function (err, data) {
                    if (err) {
                        return res.send("err");
                    } else {
                        return res.send(data);
                    }
                })
    },
    reportIndex: function (req, res) {

        return res.view();

    },
    report: function (req, res) {
        var moment = require("moment");
        var _ = require("underscore");
        var filter = req.body.filter;


        var begin = moment(moment(filter.from).format("YYYY-MM-DD")).toISOString();
        var end = moment(moment(filter.to).format("YYYY-MM-DD")).add(1, 'days').toISOString();
        var q = {registerDate: {'>=': begin, '<=': end}};
        if (!_.isUndefined(filter.company)) {
            q.company = filter.company.id;
        }
        if (!_.isUndefined(filter.mutual)) {
            if (filter.mutual !== "MutualParticular")
                q.mutual = filter.mutual;
        }
        if (!_.isUndefined(filter.centralPayment)) {
            if (filter.centralPayment !== "centralNoCentral")
                q.centralPayment = (filter.centralPayment === "true") ? true : false;
        }
        sails.log(q);
        Historic.find(q)
                .exec(function (err, historics) {
                    if (err) {
                        return res.send(false);
                    } else {
                        return res.send(historics);
                    }
                })
    },
    excelConPaciente: function (req, res) {

        var excel = require('excel-export');
        sails.log(req.body);

        var moment = require("moment");
        var _ = require("underscore");
        var filter = JSON.parse(req.body.filter);


        var begin = moment(moment(filter.from).format("YYYY-MM-DD")).toISOString();
        var end = moment(moment(filter.to).format("YYYY-MM-DD")).add(1, 'days').toISOString();
        var q = {registerDate: {'>=': begin, '<=': end}};
        if (!_.isUndefined(filter.company)) {
            q.company = filter.company.id;
        }
        if (!_.isUndefined(filter.mutual)) {
            if (filter.mutual !== "MutualParticular")
                q.mutual = filter.mutual;
        }
        if (!_.isUndefined(filter.centralPayment)) {
            if (filter.centralPayment !== "centralNoCentral")
                q.centralPayment = (filter.centralPayment === "true") ? true : false;
        }
        sails.log(q);

        Historic.find(q)
                .exec(function (err, historics) {
                    if (err) {
                        sails.log("false");
                    } else {
                        sails.log("HISTORICS", historics);
                        var totalGeneral = 0;
                        var heading = [
                            {caption: "RUT_EMPRESA", type: "number"},
                            {caption: "RAZON_SOCIAL.", type: "string"},
                            {caption: "MES", type: "number"},
                            {caption: "SERVICIO", type: "number"},
                            {caption: "SUCURSAL", type: "number"},
                            {caption: "APELLIDO_PATERNO", type: "number"},
                            {caption: "APELLIDO_MATERNO", type: "number"},
                            {caption: "APELLIDO_NOMBRES", type: "number"},
                            {caption: "RUT_TRABAJADOR", type: "number"},
                            {caption: "SOL_CENTRO_COSTO", type: "number"},
                            {caption: "RESPONSABLE_SOLICITUD", type: "number"},
                            {caption: "FECHA_EVALUACION", type: "number"},
                            {caption: "BATERIAS", type: "number"},
                            {caption: "EXAMEN_ADICIONALES", type: "number"},
                            {caption: "TARIFA PSICOSENSOMETRICOS", type: "number"},
                            {caption: "TOTAL_GENERAL", type: "number"},
                            {caption: "OBS", type: "number"}, ];


                        var rows = [];

                        historics.forEach(function (historic) {
                            var row =
                                    row.push(historic.companyRut);
                            row.push(historic.companyName);


                        });



                        var conf = {};

                        conf.name = "Detalle";
                        conf.cols = heading;
                        conf.rows = rows;
                        sails.log("CONF", conf);

                        var result = excel.execute(conf);

                        res.setHeader('Content-Type', 'application/vnd.openxmlformats');
                        res.setHeader("Content-Disposition", "attachment; filename=" + "Report.xlsx");
                        res.end(result, 'binary');
                    }
                });
    },
    excelCobro: function (req, res) {

        var excel = require('excel-export');
        sails.log(req.body);

        var moment = require("moment");
        var _ = require("underscore");
        var filter = JSON.parse(req.body.filter);


        var begin = moment(moment(filter.from).format("YYYY-MM-DD")).toISOString();
        var end = moment(moment(filter.to).format("YYYY-MM-DD")).add(1, 'days').toISOString();
        var q = {registerDate: {'>=': begin, '<=': end}};
        if (!_.isUndefined(filter.company)) {
            q.company = filter.company.id;
        }
        if (!_.isUndefined(filter.mutual)) {
            if (filter.mutual !== "MutualParticular")
                q.mutual = filter.mutual;
        }
        if (!_.isUndefined(filter.centralPayment)) {
            if (filter.centralPayment !== "centralNoCentral")
                q.centralPayment = (filter.centralPayment === "true") ? true : false;
        }
        sails.log(q);
        Exam.find().exec(function (err, exams) {
            Historic.find(q)
                    .exec(function (err, historics) {
                        if (err) {
                            sails.log("false");
                        } else {
                            sails.log("HISTORICS", historics);
                            var totalGeneral = 0;
                            var heading = [{caption: "CANT.", type: "number"},
                                {caption: "CATEGORIA.", type: "string"},
                                {caption: "VALOR EXAMEN", type: "number"},
                                {caption: "TOTAL", type: "number"}];
                            var rows = [];
                            exams.forEach(function (exam) {
                                exam.count = 0;
                                exam.total = 0;
                            });
                            historics.forEach(function (historic) {
                                var exam = _.findWhere(exams, {id: historic.exam});
                                if (!_.isUndefined(exam)) {
                                    exam.count++;
                                    exam.total += (historic.centralPayment) ? historic.examCost : historic.examParticularCost;
                                    totalGeneral += (historic.centralPayment) ? historic.examCost : historic.examParticularCost;
                                }

                            });
                            sails.log("EXAMS", exams);
                            exams.forEach(function (exam) {
                                var row = [];
                                row.push(exam.count);
                                row.push(exam.name);
                                row.push(exam.cost);
                                row.push(exam.total);
                                rows.push(row);
                            });

                            var conf = {};

                            conf.name = "Detalle";
                            conf.cols = heading;
                            conf.rows = rows;
                            sails.log("CONF", conf);

                            var result = excel.execute(conf);

                            res.setHeader('Content-Type', 'application/vnd.openxmlformats');
                            res.setHeader("Content-Disposition", "attachment; filename=" + "Report.xlsx");
                            res.end(result, 'binary');
                        }
                    });
        });
    },
    excelDetalle: function (req, res) {

        var excelDos = require('excel-export');
        sails.log(req.body);

        var moment = require("moment");
        var _ = require("underscore");
        var filter = JSON.parse(req.body.filter);


        var begin = moment(moment(filter.from).format("YYYY-MM-DD")).toISOString();
        var end = moment(moment(filter.to).format("YYYY-MM-DD")).add(1, 'days').toISOString();
        var q = {registerDate: {'>=': begin, '<=': end}};
        if (!_.isUndefined(filter.company)) {
            q.company = filter.company.id;
        }
        if (!_.isUndefined(filter.mutual)) {
            if (filter.mutual !== "MutualParticular")
                q.mutual = filter.mutual;
        }
        if (!_.isUndefined(filter.centralPayment)) {
            if (filter.centralPayment !== "centralNoCentral")
                q.centralPayment = (filter.centralPayment === "true") ? true : false;
        }
        sails.log(q);
        Exam.find().exec(function (err, exams) {
            Historic.find(q)
                    .exec(function (err, historics) {
                        if (err) {
                            sails.log("false");
                        } else {

                            var allHeadingTxt = [{caption: "Centralizada", type: "string", width: 40}, {caption: "Empresa", type: "string"}, {caption: "Rut", type: "string"}];
                            var allCompanies = []; //para almacenar compañias completas
                            var refHeading = ["CENTRALIZADA", "EMPRESA", "RUT"];

                            var companyArray = {};
                            exams.forEach(function (exam) {
                                exam.count = 0;
                                exam.total = 0;

                                refHeading.push(exam.id + "Count");
                                allHeadingTxt.push({caption: exam.name, type: "number",
                                    beforeCellWrite: function () {
                                        return function (row, cellData, eOpt) {
                                            if (cellData === 0) {
                                                eOpt.cellType = 'string';
                                                return '';
                                            } else {
                                                return cellData;
                                            }
                                        }
                                    }()});

                            });
                            exams.forEach(function (exam) {

                                refHeading.push(exam.id + "Price");
                                allHeadingTxt.push({caption: exam.name, type: "number",
                                    beforeCellWrite: function () {
                                        return function (row, cellData, eOpt) {
                                            if (cellData === 0) {
                                                eOpt.cellType = 'string';
                                                return '';
                                            } else {
                                                return cellData;
                                            }
                                        }
                                    }()});
                            });
                            refHeading.push("Total");
                            allHeadingTxt.push({caption: "Total", type: "number",
                                beforeCellWrite: function () {
                                    return function (row, cellData, eOpt) {
                                        if (cellData === 0) {
                                            eOpt.cellType = 'string';
                                            return '';
                                        } else {
                                            return cellData;
                                        }
                                    }
                                }()});
                            historics.forEach(function (historic) {

                                company = _.findWhere(allCompanies, {Empresa: historic.companyName})
                                sails.log("COMPANY", company);
                                if (_.isUndefined(company)) {
                                    allCompanies.push({Empresa: historic.companyName});
                                    var newRow = [];
                                    newRow.push(historic.centralPayment ? "SI" : "NO");
                                    newRow.push(historic.companyName);
                                    newRow.push(historic.companyRut);
                                    for (i = 3; i < refHeading.length; i++) {
                                        newRow.push(0);
                                    }
                                    companyArray[historic.companyName] = newRow;
                                    var countIndex = _.indexOf(refHeading, historic.exam + "Count");
                                    var priceIndex = _.indexOf(refHeading, historic.exam + "Price");
                                    var totalIndex = _.indexOf(refHeading, "Total");
                                    companyArray[historic.companyName][countIndex] += 1;
                                    companyArray[historic.companyName][priceIndex] += (historic.mutual === "Mutual") ? historic.examCost : historic.examParticularCost;
                                    companyArray[historic.companyName][totalIndex] += (historic.mutual === "Mutual") ? historic.examCost : historic.examParticularCost;

                                } else {
                                    var countIndex = _.indexOf(refHeading, historic.exam + "Count");
                                    var priceIndex = _.indexOf(refHeading, historic.exam + "Price");
                                    var totalIndex = _.indexOf(refHeading, "Total");
                                    companyArray[historic.companyName][countIndex] += 1;
                                    companyArray[historic.companyName][priceIndex] += (historic.mutual === "Mutual") ? historic.examCost : historic.examParticularCost;
                                    companyArray[historic.companyName][totalIndex] += (historic.mutual === "Mutual") ? historic.examCost : historic.examParticularCost;
                                }
                            });
//
                            sails.log("CompanyArray", companyArray);




                            var conf = {};
                            var mainTotal = [];
                            conf.name = "mysheet";
                            conf.cols = allHeadingTxt;
                            conf.rows = _.values(companyArray);

                            sails.log("CONF", conf);

                            for (i = 0; i < conf.cols.length; i++) {
                                mainTotal.push(0);
                            }
                            for (i = 0; i < conf.rows.length; i++) {
                                for (j = 3; j < conf.rows[0].length; j++) {
                                    mainTotal[j] += conf.rows[i][j];
                                }
                            }
                            mainTotal[0] = "";
                            mainTotal[1] = "";
                            mainTotal[2] = "TOTAL";
                            conf.rows.push(mainTotal);
                            sails.log("CONF", conf);
                            var result = excelDos.execute(conf);

                            res.setHeader('Content-Type', 'application/vnd.openxmlformats');
                            res.setHeader("Content-Disposition", "attachment; filename=" + "Report.xlsx");
                            res.end(result, 'binary');
                        }
                    });
        });
    }

};

