/**
 * CompanyController
 *
 * @description :: Server-side logic for managing companies
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    findAll: function (req, res) {
        var s = req.param('s');
        var q = {or: [{name: {contains: s}}, {rut: {contains: s}}]};
        Company.find(q).exec(function (err, patients) {
            return res.send(patients);
        });

    },
};

