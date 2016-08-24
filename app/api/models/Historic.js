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
    patientName: "string",
    patientSecondName: "string",
    patientLastName: "string",
    patientSecondLastName: "string",
    patientRut: "string",
    exam: {
      model: "exam"
    },
    examName: "string",
    examCost: "integer",
    examParticularCost: "integer",
    company: {
      model: "company"
    },
    companyName: "string",
    companyRut: "string",
    processed: {
      type: "boolean",
      defaultsTo: false
    },
    cc: "string",
    respApplication: "string",
    pooc: "string",
    position: "string",
    registerDate: "date",
    //Sección de resutados
    maritalStatus: "string",
    alert: "integer",
    edad: "integer",
    estudios: "string",
    aniosEstudio: "integer",
    raven: "integer",
    epqN: "integer",
    epqQ: "integer",
    epworth: "integer",
    reactimetro: "float",
    palanca: "integer",
    punteo: "integer",
    encandilamiento: "integer",
    lentesCerca: "string",
    lentesLejos: "string",
    conclusion: "string",
    observacion: "string",
    centralPayment: "boolean", //detectar empresas centralizadas
    mutual: "string"
  }
};

