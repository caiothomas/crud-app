var mongoose = require('mongoose');
var client = require('./clients');
var Schema = mongoose.Schema;

var produtos = new mongoose.Schema({
  nome:    {
    type    : String,
    require : true
  },
  quantidade :   {
    type    : Number,
    default : 0    
  },  
  venda :   {
    type    : String    
  }
})

var Vendas = new Schema({

  cliente: {
    type: Schema.Types.ObjectId, 
    ref: 'Client'
  },  
  tipo:   {
    type    : String,
    default : 1    
  },    
  total:   {
    type    : String,
    default : 0       
  },  
  produtos: [produtos],  
  modified: {
    type    : Date,
    default : Date.now
  }
});

module.exports = mongoose.model('Vendas', Vendas);