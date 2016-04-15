/**
 * HistoricController
 *
 * @description :: Server-side logic for managing historics
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    index: function (req, res) {
        return res.view();
    },
    getAll: function (req, res) {
        Historic.find()
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

