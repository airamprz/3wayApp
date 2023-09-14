const Message = require('../models/message.model'); 
const mongoose = require('mongoose');

module.exports.doMessage = (req, res, next) => {
    const { title, description } = req.body;
    const productId = req.params.id;
    

    Message.create({
        title,
        description,
        user: req.user.id,
        product: productId
    })
        .then(() => res.redirect('/products/' + productId))
        .catch((error) => {
            if (error instanceof mongoose.Error.ValidationError) {
                res.render('messages/messages', {
                    message: req.body,
                    errors: error.errors
                })
            } else {
                next(error);
            }
        })
}

