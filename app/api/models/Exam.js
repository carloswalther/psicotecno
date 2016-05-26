/**
 * Exam.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
    attributes: {
        order: "integer",
        name: "string",
        cost: "integer",
        particularCost: "integer",
        historics: {
            collection: "historic",
            via: "exam"
        }
    }
};

