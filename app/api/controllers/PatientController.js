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
    },
    edit: function (req, res) {
        Patient.update(req.body.patient.id, req.body.patient).exec(function (err, data) {
            if (err) {
                return res.send(false);
            } else {
                return res.send(true);
            }
        });
    },
    index: function (req, res) {
        return res.view();
    },
    uploadFile: function (req, res) {
        sails.log(req.file);
        sails.log(req.body);
        req.file('file').upload({
            // don't allow the total upload size to exceed ~10MB
            maxBytes: 10000000,
            //dirname: './assets/images'
        }, function whenDone(err, uploadedFiles) {
            if (err) {
                sails.log("error al subir");
                return res.negotiate(err);
            }

            // If no files were uploaded, respond with an error.
            if (uploadedFiles.length === 0) {
                sails.log("arreglo con 0 al subir")
                return res.badRequest('No file was uploaded');
            }
            var archivo = {};
            archivo.filename = uploadedFiles[0].filename;
            archivo.path = uploadedFiles[0].fd;
            archivo.patient = req.body.patient;

            Archivo.create(archivo).exec(function (err, file) {
                if (err) {
                    return res.send(false);
                } else {
                    return res.ok(file);
                }
            });

            //return res.ok();
        }


        // Save the "fd" and the url where the avatar for a user can be accessed

        );
    },
};

