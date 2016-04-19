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
        Historic.create(req.body.historic).exec(function (err, historic) {
            if (err) {
                return res.send(false)
            } else {
                sails.log("New Historic:", historic);
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
    }

};

