/**
 * PatientController
 *
 * @description :: Server-side logic for managing patients
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    findAll: function (req, res) {
        var s = req.param('s');
        var q = {or: [{name: {contains: s}}, {lastName: {contains: s}}, {rut: {contains: s}}]};
        Patient.find(q).exec(function (err, patients) {
            return res.send(patients);
        });

    },
    create: function (req, res) {
        sails.log(req.body.patient);
        Patient.create(req.body.patient).exec(function (err, data) {
            if (err) {
                return res.send(false);
            } else {
                return res.send(data);
            }
        });
    }
};

