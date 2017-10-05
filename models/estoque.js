var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var Estoque = new Schema({

  nome:    {
    type    : String,
    require : true
  },  
  fornecedor: {
    type: String, 
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
    type    : String,
    default : 0    
  },
  fabricacao: {
    type    : Date,
  },  
  vencimento: {
    type    : Date,
  },
  modified: {
    type    : Date,
    default : Date.now
  }
});

module.exports = mongoose.model('Estoque', Estoque);