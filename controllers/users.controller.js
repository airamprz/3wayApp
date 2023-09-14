const User = require('../models/user.model');
const mongoose = require('mongoose');
const moment = require('moment/moment'); // 


module.exports.register = (req, res, next) => res.render('users/register');

module.exports.doRegister = (req, res, next) => {
    User.findOne({ username: req.body.username})
    .then((user) => {
        if (user) {
            res.render('users/register', {
                user: req.body,
                errors: {
                username: 'Username already exists'
                }
            })
        } else {
            return User.create(req.body)
            .then(() => {
              //req.flash('data', JSON.stringify({ info: 'Please login in'}));
              res.redirect('/login')
            })
        }
    })
    .catch((error) => {
        console.error(error);
        if (error instanceof mongoose.Error.ValidationError) {
            res.render('users/register', { user: req.body, errors: error.errors })
        } else {
            next(error);
        }       
    })
    User.create(req.body)
    .then((user) => res.redirect('/login'))
}


module.exports.login = (req, res, next) => res.render('users/login');

module.exports.doLogin = (req, res, next) => {

    function renderInvalidUsername() {
        res.render('users/login', { 
            user: req.body,
            errors: {
                password: 'Invalid username or password'
            }})
    }

    User.findOne({ username: req.body.username })
    .then((user) => {
        if (user) {
            return user.checkPassword(req.body.password)
            .then((match) => {
                if (match) {
                    req.session.userId = user.id;
                    res.redirect('/');
                } else {
                    renderInvalidUsername();
                }
            })
        } else {
            renderInvalidUsername();
        }
    })
    .catch((error) => next(error));
}

module.exports.logout = (req, res, next) => {
    req.session.destroy();
    res.redirect('/login');
}
module.exports.profile = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        const user = await User.findById(userId);
  
        if (!user) {
            // Manejar el caso en el que el usuario no se encuentra
            return res.status(404).send('Usuario no encontrado');
        }

        const formattedDate = moment(user.createdAt).format('DD/MM/YYYY');
  
        // Renderiza la vista de perfil de usuario con los datos del usuario y followingCount
        res.render('users/profile', { user: req.user, formattedDate });
    } catch (error) {
        console.error(error);
        // Manejar errores apropiadamente
        res.status(500).send('Error interno del servidor');
    }
  };