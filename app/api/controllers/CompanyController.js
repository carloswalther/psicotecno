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
    getAll: function (req, res) {
        Company.find().sort("name ASC").exec(function (err, companies) {
            sails.log(companies)
            return res.send(companies);
        });
    },
    create: function (req, res) {
        sails.log(req.body.company);
        Company.create(req.body.company).exec(function (err, data) {
            if (err) {
                return res.send(false);
            } else {
                return res.send(data);
            }
        });
    },
    index: function (req, res) {
        return res.view();
    },
    edit: function (req, res) {
        Company.update(req.body.company.id, req.body.company).exec(function (err, data) {
            if (err) {
                return res.send(false);
            } else {
                return res.send(true);
            }
        });
    }
};

