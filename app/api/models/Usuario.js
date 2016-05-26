/**
 * Usuario.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
    attributes: {
        rol: {
            type: "string",
            enum: ["Secretaria", "Tecnico", "Administrador"]
        },
        nombre: "string",
        apellido: "string",
        userName: {
            type: "string",
            unique: true
        },
        password: "string"


                /*getFullNombre: function () {
                 return this.nombre;
                 }*/
    },
    beforeCreate: function (values, next) {
        console.log(values);
        require('bcrypt').hash(values.password, 10, function (err, password) {
            if (err)
                return next(err);
            values.password = password;
            next();
        });
    },
    beforeUpdate: function (values, next) {
        console.log(values);
        if (typeof values.password !== "undefined") {
            require('bcrypt').hash(values.password, 10, function (err, password) {
                if (err)
                    return next(err);
                values.password = password;
                next();
            });
        } else {
            next();
        }
    },
    toJSON: function () {
        var obj = this.toObject();
        delete obj.password;
        return obj;
    }

};

