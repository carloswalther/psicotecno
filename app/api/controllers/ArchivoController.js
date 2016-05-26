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
    }

};

