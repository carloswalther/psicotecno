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
            q.mutual = filter.mutual;
        }
        if (!_.isUndefined(filter.centralPayment)) {
            q.centralPayment = filter.centralPayment;
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
    excelCobro: function (req, res) {
        var excel = require('node-excel-export');
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
        if (filter.pooc !== "pooc") {
            q.pooc = filter.pooc;
        }
        sails.log(q);
        Exam.find().exec(function (err, exams) {
            Historic.find(q)
                    .populate("exam")
                    .populate("patient")
                    .populate("company")
                    .exec(function (err, historics) {
                        if (err) {
                            sails.log("false");
                        } else {
                            var totalGeneral = 0;
                            exams.forEach(function (exam) {
                                exam.count = 0;
                                exam.total = 0;
                            });
                            historics.forEach(function (historic) {
                                var exam = _.findWhere(exams, {id: historic.exam.id})
                                if (!_.isUndefined(exam)) {
                                    exam.count++;
                                    exam.total = exam.count * exam.cost;
                                    totalGeneral += exam.cost
                                }
                                historic.txtName = historic.patient.name + " " + historic.patient.lastName;
                                historic.txtPatientRut = historic.patient.rut;
                                historic.txtExamName = historic.exam.name;
                            });

                            var dataset = exams;
                            dataset.push({count: "", name: "", cost: "Total", total: totalGeneral});



//Array of objects representing heading rows (very top)
                            var heading = [
                                ['CANT.', 'CATEGORIA', 'VALOR EXAMEN', 'TOTAL'] // <-- It can be only values
                            ];

//Here you specify the export structure
                            var specification = {
                                count: {// <- the key should match the actual data key

                                    width: 120 // <- width in pixels
                                },
                                name: {
                                    width: '10' // <- width in chars (when the number is passed as string)
                                },
                                cost: {
                                    width: "10"
                                },
                                total: {
                                    width: "10"
                                }
                            }

// The data set should have the following shape (Array of Objects)
// The order of the keys is irrelevant, it is also irrelevant if the
// dataset contains more fields as the report is build based on the
// specification provided above. But you should have all the fields
// that are listed in the report specification


// Create the excel report.
// This function will return Buffer
                            var report = excel.buildExport(
                                    [// <- Notice that this is an array. Pass multiple sheets to create multi sheet report
                                        {
                                            name: 'Resumen', // <- Specify sheet name (optional)
                                            heading: heading, // <- Raw heading array (optional)
                                            specification: specification, // <- Report specification
                                            data: dataset // <-- Report data
                                        }
                                    ]
                                    );

// You can then return this straight
                            res.attachment("report.xlsx"); // This is sails.js specific (in general you need to set headers)
                            return res.send(report);
                        }
                    });
        });
    },
    excelTodo: function (req, res) {

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
        if (filter.centralPayment !== "centralPayment") {
            q.pooc = filter.pooc;
        }
        sails.log(q);
        Exam.find().exec(function (err, exams) {
            Historic.find(q)
                    .populate("exam")
                    .populate("patient")
                    .populate("company", {centralPayment: true})
                    .exec(function (err, historics) {
                        if (err) {
                            sails.log("false");
                        } else {

                            var allHeadingTxt = [{caption: "Centralizada", type: "string", width: 40}, {caption: "Empresa", type: "string"}, {caption: "Rut", type: "string"}];
                            var allCompanies = [];
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

                                company = _.findWhere(allCompanies, {Empresa: historic.company.name})
                                sails.log("COMPANY", company);
                                if (_.isUndefined(company)) {
                                    allCompanies.push({Empresa: historic.company.name});
                                    var newRow = [];
                                    newRow.push(historic.company.centralPayment ? "SI" : "NO");
                                    newRow.push(historic.company.name);
                                    newRow.push(historic.company.rut);
                                    for (i = 3; i < refHeading.length; i++) {
                                        newRow.push(0);
                                    }
                                    companyArray[historic.company.name] = newRow;
                                    var countIndex = _.indexOf(refHeading, historic.exam.id + "Count");
                                    var priceIndex = _.indexOf(refHeading, historic.exam.id + "Price");
                                    var totalIndex = _.indexOf(refHeading, "Total");
                                    companyArray[historic.company.name][countIndex] += 1;
                                    companyArray[historic.company.name][priceIndex] += historic.exam.cost;
                                    companyArray[historic.company.name][totalIndex] += historic.exam.cost;

                                } else {
                                    var countIndex = _.indexOf(refHeading, historic.exam.id + "Count");
                                    var priceIndex = _.indexOf(refHeading, historic.exam.id + "Price");
                                    var totalIndex = _.indexOf(refHeading, "Total");
                                    companyArray[historic.company.name][countIndex] += 1;
                                    companyArray[historic.company.name][priceIndex] += historic.exam.cost;
                                    companyArray[historic.company.name][totalIndex] += historic.exam.cost;

                                }
                            });
//                            companyArray.foreEach(function(arr){
//                                var acumulador = 0;
//                                for (i=)
//                            })
                            sails.log("CompanyArray", companyArray);



                            var conf = {};

                            conf.name = "mysheet";
                            conf.cols = allHeadingTxt;
                            conf.rows = _.values(companyArray);

                            var result = excelDos.execute(conf);

                            res.setHeader('Content-Type', 'application/vnd.openxmlformats');
                            res.setHeader("Content-Disposition", "attachment; filename=" + "Report.xlsx");
                            res.end(result, 'binary');
                        }
                    });
        });
    }

};

