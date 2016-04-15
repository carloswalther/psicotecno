/**
 * PatientController
 *
 * @description :: Server-side logic for managing patients
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    findAll: function (req, res) {
        var s = req.param('s');
        var q = {or: [{name: {contains: s}}, {lastName: {contains: s}}]};
        Patient.find(q).exec(function (err, patients) {
            return res.send(patients);
        });

    },
};

