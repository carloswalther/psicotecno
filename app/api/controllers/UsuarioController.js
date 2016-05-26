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

            if (_.isUndefined(data.userName) || _.isUndefined(data.password)) {
                console.log("no viene usuario y pass");
                req.session.msg = {res: false, msg: "No tiene usuario y/o contraseña", style: "watning", obj: []};
                return res.view({layout: "layout_login", msg: {res: false, msg: "No tiene usuario y/o contraseña", style: "watning", obj: []}});
            }

            Usuario.findOne({userName: data.userName}).exec(function (err, user) {
                var _ = require("underscore");
                if (err)
                    return res.view({layout: "layout_login"});
                if (!user) {
                    console.log("usuario no existe");
                    return res.view({layout: "layout_login"});
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
                            return res.redirect("/historic/reportIndex");
                        }
                        if (user.rol === "Secretaria") {
                            return res.redirect("/historic");
                        }
                        if (user.rol === "Tecnico") {
                            return res.redirect("/exam");
                        }
                    }
                });
            });
        }
    },
    logout: function (req, res) {
        delete req.session.usuario;
        req.session.authenticated = false;
        return res.redirect("/usuario/login");
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
    list: function (req, res) {
        sails.log("obteniendo usuarios")
        Usuario.find().sort("nombre ASC").exec(function (err, usuarios) {
            if (err) {
                return res.send(false);
            } else {
                usuarios.forEach(function (usuario) {
                    delete usuario.password;
                })
                sails.log(usuarios);
                return res.send(usuarios);

            }
        });
    },
    /**
     *
     * @param {usuario} req
     * @param {type} res
     * @returns {undefined}
     * @description Crea un usuario, asociando privilegio y contraseña encriptada
     */
    create: function (req, res) {
        {
            Usuario.create(req.body.usuario).exec(function (err, usuario) {
                if (err) {
                    sails.log(err);
                    return res.send(false);
                } else {
                    return res.send(usuario);
                }

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
    edit: function (req, res) {
        Usuario.update(req.body.usuario.id, req.body.usuario).exec(function (err, usuarios) {
            if (err) {
                return res.send(false);
            } else {
                return res.send(true);
            }
        });

    },
    /**
     *
     * @param {type} req
     * @param {type} res
     * @returns {undefined}
     * @description Elimina el usuario
     * BLANDO: si tiene asociada alguna Torre de la cual es Lider
     */
    delete: function (req, res) {
        Usuario.destroy(req.body.usuario.id).exec(function (err, usuario) {
            if (err) {
                sails.log(err)
                return res.send(false);
            } else {
                sails.log(usuario);
                return res.send(true);
            }
        })
    }

};

