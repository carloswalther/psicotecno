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

    index: function (req,res){
        return res.view();
    }
};

