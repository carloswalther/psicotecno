/**
 * ExamController
 *
 * @description :: Server-side logic for managing exams
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

	index: function (req, res) {
        Exam.find().exec(function (err, exams) {
            return res.view({exams: exams});
        })
    }
	
};

