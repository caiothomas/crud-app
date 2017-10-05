var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var Client = new Schema({

  nome:    {
    type    : String,
    require : true
  },  
  email: {
    type: String, 
  },
  telefone: {
    type    : String,
  },  
  modified: {
    type    : Date,
    default : Date.now
  }
});

module.exports = mongoose.model('Client', Client);