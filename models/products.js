var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Products = new Schema({

  nome:    {
    type    : String,
    require : true
  },  
  descricao: {
    type: String, 
  },
  custo :   {
    type    : String,
    default : 0.0    
  },
  venda :   {
    type    : String,
    default : 0.0        
  },
  maoobra:   {
    type    : String,
    default : 0.0        
  },
  qtd :   {
    type    : Number,
    default : 0    
  },
  fabricacao: {
    type    : Date,
  },  
  vencimento: {
    type    : Date,
  },
/*
  style:    {
    type    : String,
    enum    :  ['Casual', 'Vintage', 'Alternative'],
    require : true
  },
  size:     {
    type    : Number,
    enum    : [36, 38, 40, 42, 44, 46],
    require : true
  },
  color:   {
    type: String
  },
  price :   {
    type    : Number,
    require : true
  },*/
  modified: {
    type    : Date,
    default : Date.now
  }
});

module.exports = mongoose.model('Products', Products);