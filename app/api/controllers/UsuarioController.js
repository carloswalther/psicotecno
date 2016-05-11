/**
 * UsuarioController
 *
 * @description :: Server-side logic for managing usuarios
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    /**
     *
     * @param {type} req
     * @param {type} res
     * @returns {} dependiendo del caso redirecciona a distintas rutas del sistema.
     * @description Realia la validación de usuario y contraseña y carga en objeto session
     * los datos del usuario para validaciones y registro de quien realiza operaciones
     */
    login: function (req, res) {
        var bcrypt = require("bcrypt");
        var _ = require("underscore");
        var data = req.body;

        sails.log("POST:", req.body);
        sails.log("SESSION:", req.session);
        // verifica a donde redireccionar según el privilegio del usuario logeado
        if (!_.isUndefined(req.session.usuario)) {
            if (req.session.usuario.rol === "Administrador") {
                return res.redirect("/historic");
            }
            if (req.session.usuario.rol === "Secretaria") {

            }
            if (req.session.usuario.rol === "Tecnico") {

            }
        }
        if (_.isUndefined(data)) {
            return res.view({layout: "layout_login"})
        } else {

            if (_.isUndefined(data.email) || _.isUndefined(data.password)) {
                console.log("no viene usuario y pass");
                req.session.msg = {res: false, msg: "No tiene usuario y/o contraseña", style: "watning", obj: []};
                return res.view({layout: "layout_login", msg: {res: false, msg: "No tiene usuario y/o contraseña", style: "watning", obj: []}});
            }

            Usuario.findOne({userName: data.email}).exec(function (err, user) {
                var _ = require("underscore")
                if (err)
                    return res.view({layout: "layout_login", msg: {res: false, msg: "Error al consultar en la base de datos", style: "danger", obj: [err]}});
                if (!user) {
                    console.log("usuario no existe");
                    req.session.msg = {res: false, msg: "Usuario no existe", style: "warning", obj: []};
                    return res.view({layout: "layout_login", msg: {res: false, msg: "Error al consultar en la base de datos", style: "danger", obj: [err]}});
                }
                bcrypt.compare(data.password, user.password, function (err, valid) {
                    if (err) {
                        return res.view({layout: "layout_login", msg: {res: false, msg: "Error al consultar en la base de datos", style: "danger", obj: [err]}});
                    }
                    if (!valid) {
                        sails.log.warn("password no coniside")

                        req.session.msg = {res: false, msg: "Password incorrecto", style: "danger", obj: [err]};
                        return res.view({layout: "layout_login", msg: {res: false, msg: "Password incorrecto", style: "danger", obj: [err]}});
                    } else {
                        req.session.authenticated = true;
                        sails.log("usuario:", user);
                        req.session.usuario = user;
                        sails.log("password correcto");
                        if (user.rol === "Administrador") {
                            return res.redirect("/historic");
                        }
                        if (user.rol === "Secretaria") {
                            return res.redirect("/historic");
                        }
                        if (user.rol === "Tecnico") {
                            return res.redirect("/historic");
                        }
                    }
                });
            });
        }
    },
    /**
     *
     * @param {stirng} req.body.password string de contraseña sin encriptar
     * @param {type} res
     * @returns {unresolved} objeto de respuesta true / false según corresponda
     */
    setPassword: function (req, res) {
        var _ = require("underscore");
        if (_.isUndefined(req.body)) {
            return res.send(
                    {
                        res: false,
                        msg: "No viene password para setear",
                        style: "danger",
                        obj: []
                    });
        } else {
            if (_.isUndefined(req.body.password)) {
                return res.send(
                        {res: false,
                            msg: "No viene password para setear",
                            style: "danger",
                            obj: []
                        });
            } else {
                Usuario.update({id: req.session.usuario.id}, {password: password},
                        function (err, usuario) {
                            if (err) {
                                return res.send(
                                        {
                                            res: false,
                                            msg: "Error al cambiar contraseña",
                                            style: "danger",
                                            obj: [err]
                                        });
                            } else {
                                delete usuario.password;
                                return res.send(
                                        {
                                            res: true,
                                            msg: "Cambio Exitoso",
                                            style: "success",
                                            obj: [usuario]
                                        });
                            }
                        });
            }
        }

    },
    /**
     *
     * @param {type} req
     * @param {type} res
     * @returns {undefined}
     * @description vista base de usuarios sin objetos pre cargados
     */
    index: function (req, res) {
        res.view();
    },
    /**
     *
     * @param {objeto paginacion} req
     * @param {type} res
     * @returns [Usuario]
     * @description Soicita lista par adesplegar en paginación, esta lleva atributos
     * utiles para una correcta paginación.
     */
    /*list: function (req, res) {
        var search = req.body.searchPhrase;
        var current = req.body.current;
        var rowCount = req.body.rowCount;
        var sort = req.body.sort;

        var w = {
            or: [
                {nombre: {'contains': search}},
                {userName: {'contains': search}},
                {rol: {'contains': search}}
            ]
        };



        //Sorts
        var sortTxt = "eliminado ASC id DESC";
        for (var col in sort) { //nombre[ASC]
            sortTxt = col + " " + sort[col]; // nombre ASC
        }
        ;
        var QL = {};
        QL.where = w;
        QL.sort = sortTxt;
        if (!(rowCount === '-1')) {
            QL.skip = (current - 1) * rowCount;
            QL.limit = rowCount;
        }

        Usuario.find(QL).exec(function (err, usuarios) {
            if (err) {
                sails.log(err);
            }

            for (var i = 0; i < usuarios.length; i++) {
                if (usuarios[i].eliminado)
                    usuarios[i].status = 3;

            }
            ;

            Usuario.count(w, function (err, count) {
                if (err) {
                    sails.log(err);
                }
                var json = {rows: usuarios, current: current * 1, rowCount: rowCount * 1, total: count};

                return res.json(json);
            });

        });
    },
    /**
     *
     * @param {usuario} req
     * @param {type} res
     * @returns {undefined}
     * @description Crea un usuario, asociando privilegio y contraseña encriptada
     */
    crear: function (req, res) {
        if (req.method.toUpperCase() == "GET") {
            var rolesArr = ["Administrador", "Secretaria", "Tecnico"];
            res.view({roles: rolesArr});
        } else {
            Usuario.create(req.body).exec(function (err, usuario) {
                if (err) {
                    sails.log(err);
                    req.session.msg = {msg: "Error al crear el Usuario, correo electrónico ya está en uso", style: "danger", obj: [err]};
                } else {
                    req.session.msg = {msg: "Usuario creado correctamente", style: "success"};
                }

                return res.redirect("/usuario/");

            });
        }
    },
    /**
     *
     * @param {Usuario} req
     * @param {type} res
     * @returns [Usuario] retorna a pagina de mantenedor 'lista'
     * @description Modifica todos los datos de un objeto usuario y guarda en la
     * base de datos
     */
    editar: function (req, res) {
        if (req.method.toUpperCase() == "GET") {
            var id = req.param("id");
            Usuario.findOne(id).exec(function (err, usr) {
                if (err)
                    sails.log(err);
                var rolesArr = ["Administrador", "Lider Torre", "Lider Pais"];
                res.view({roles: rolesArr, usuario: usr});
            });
        } else {
            if (req.body.password == "")
                delete req.body.password;

            Usuario.update(req.body.id, req.body).exec(function (err, usuarios) {
                if (err) {
                    sails.log(err);
                    req.session.msg = {msg: "Error al editar el Usuario, correo electrónico ya está en uso", style: "danger", obj: [err]};
                } else {
                    req.session.msg = {msg: "Usuario editado correctamente", style: "success"};
                }

                return res.redirect("/usuario/");

            });
        }
    },
    /**
     *
     * @param {type} req
     * @param {type} res
     * @returns {undefined}
     * @description Elimina el usuario
     * BLANDO: si tiene asociada alguna Torre de la cual es Lider
     */
    /*eliminar: function (req, res) {
        var id = req.param("id");
        Torre.count({jefeDeTorre: id}).exec(function (err, countT) {
            if (countT != 0) {
                Usuario.update(id, {eliminado: true}).exec(function (err, usuarios) {
                    if (err) {
                        sails.log(err);
                        req.session.msg = {msg: "Error al eliminar el Usuario", style: "danger", obj: [err]};
                    } else {
                        req.session.msg = {msg: "Usuario eliminado correctamente de forma 'blanda'", style: "success"};
                    }
                    return res.redirect("/usuario/");
                });
            } else {
                Usuario.destroy(id).exec(function (err, usuarios) {
                    if (err) {
                        sails.log(err);
                        req.session.msg = {msg: "Error al eliminar el Usuario", style: "danger", obj: [err]};
                    } else {
                        req.session.msg = {msg: "Usuario eliminado correctamente de forma 'dura'", style: "success"};
                    }
                    return res.redirect("/usuario/");
                });
            }
        });

    }*/
};

