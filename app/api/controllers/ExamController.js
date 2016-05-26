/**
 * ExamController
 *
 * @description :: Server-side logic for managing exams
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    index: function (req, res) {
        Exam.find().sort("order DESC").exec(function (err, exams) {
            return res.view({exams: exams});
        })
    },
    edit: function (req, res) {
        Exam.find().sort("order ASC").exec(function (err, exams) {
            return res.view({exams: exams});
        })
    },
    getAll: function (req, res) {
        Exam.find().sort("order ASC").exec(function (err, exams) {
            return res.send(exams);
        })
    },
    create: function (req, res) {
        sails.log(req.body);
        Exam.create(req.body).exec(function (err, exams) {
            if (err)
                return res.send(false)
            return res.send(exams);
        });
    },
};

