/**
 * ArchivoController
 *
 * @description :: Server-side logic for managing archivoes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    /**
     * Returns this model's attributes as...
     *
     * @method download
     * @return {Object} Archivo
     */
    download: function (req, res) {
        sails.log(req.param("id"));
        Archivo.findOne({id: req.param("id")}).exec(function (err, file) {
            if (err) {
                sails.log(err);
            }
// return res.attachment(file.path);

            var SkipperDisk = require('skipper-disk');
            var fileAdapter = SkipperDisk();
            sails.log("file", file);
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader("Content-Disposition", "attachment; filename=" + file.filename);
            //res.end(result, 'binary');
            fileAdapter.read(file.path)
                    .on('error', function (err) {
                        sails.log(err);
                        return res.serverError(err);
                    })
                    .pipe(res);
        });
    },
    deleteFile: function (req, res) {
        var _ = require("underscore");
        sails.log(req.body.file);
        if (!_.isUndefined(req.body.file)) {
            var path = req.body.file.path;
            var id = req.body.file.id;
            var fs = require('fs');
            sails.log(path);
            fs.unlink(path, function (err) {
                if (err) {
                    sails.log(err);
                    return res.send(false);

                } else {

                    Archivo.destroy({id: id}).exec(function (err) {
                        if (err)
                            return res.send(false);
                        sails.log('successfully deleted', path);
                        return res.send(true);
                    });
                }

            });
        } else {
            return res.send(false);
        }


    },
    readExcel: function (req, res) {
        var XLS = require('xlsjs');
        var _ = require("underscore");
        var wb = XLS.readFile('/Users/carloswalther/Documents/proyectos/psicotecno/docs/FACTURACIONHISTORICA.xls');
        var historics = [];
        for (var i = 1; i <= wb.Sheets.Hoja1["!range"].e.r; i++) {
            var dateArray = wb.Sheets.Hoja1["A" + i].w.split("/");
            //sails.log(dateArray);
            var newHistoric = {};

            newHistoric.registerDate = new Date(1 * ("20" + dateArray[2]), 1 * dateArray[0] - 1, dateArray[1] * 1);
            newHistoric.patientName = wb.Sheets.Hoja1["B" + i].w;
            if (!_.isUndefined(wb.Sheets.Hoja1["C" + i])) {
                newHistoric.patientRut = wb.Sheets.Hoja1["C" + i].w.replace(".", "").replace(".", "").replace("-", "");
            }
            if (!_.isUndefined(wb.Sheets.Hoja1["D" + i])) {
                newHistoric.examName = wb.Sheets.Hoja1["D" + i].w;
            }
            if (!_.isUndefined(wb.Sheets.Hoja1["E" + i])) {
                newHistoric.companyName = wb.Sheets.Hoja1["E" + i].w;
            }
            historics.push(newHistoric);
            sails.log(historics.length);
        }
        Historic.create(historics).exec(function (err, created) {
            if (err) {
                sails.log(err);
            } else {
                return res.send(true);
            }
        });
//        sails.log("Rango", wb.Sheets.Hoja1["!range"]);
//        sails.log(wb.Sheets.Hoja1["A1"].w.split("/"));
//        sails.log(wb.Sheets.Hoja1["B1"].w);
//        sails.log(wb.Sheets.Hoja1["C1"].w);
//        sails.log(wb.Sheets.Hoja1["D1"].w);
//        sails.log(wb.Sheets.Hoja1["E1"].w);
        //return res.ok();
    }

};

