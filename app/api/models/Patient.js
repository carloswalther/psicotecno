/**
 * Patient.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
    migrate: "alter",
    attributes: {
        name: "string",
        secondName: "string",
        rut: {
            unique: true,
            type: "string"},
        lastName: "string",
        secondLastName: "string",
        historics: {
            collection: "historic",
            via: "patient"
        },
        archivos: {
            collection: "archivo",
            via: "patient"
        }
    }
};

