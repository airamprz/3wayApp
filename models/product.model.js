const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema ({
    title: {
        type: String,
        trim: true,
        text: true,
        required: 'Title is required'
      },
    description: {
        type: String,
        trim: true,
        required: 'Description is required'
      },
    price: {
        type: String,
        trim: true,
        required: 'Price is required'
    },
    /* productImage: {
        type: String,
        trim: true,
        required: 'Product image is required'
    }, */
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    category: {
        type: String
    },
    image: {
        type: String,
    },
}, { timestamps: true });

productSchema.virtual('messages', {
    ref: 'Message', // Nombre del modelo 
    localField: '_id', // Campo con el que se identifica
    foreignField: 'product', // Nombre del campo del modelo a enlazar
    limit: 10 // Número máximo de mensajes por producto
  })

const Product = mongoose.model('Product', productSchema);
module.exports = Product;