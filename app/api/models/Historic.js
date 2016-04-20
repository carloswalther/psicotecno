/**
 * Historic.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
    attributes: {
        patient: {
            model: "patient"
        },
        exam: {
            model: "exam"
        },
        company: {
            model: "company"
        },
        cc: "string",
        respApplication: "string",
        registerDate: "date",
        //Sección de resutados
        edad: "integer",
        estudios: "string",
        aniosEstudio: "string",
        // aqui se guardara [{licencia:"una licencia",anios:0,meses:6},{...}]
        licencia: "json"
    }
};

