
var Estoque = require('../models/estoque.js'),
    Isemail = require('isemail'),
    moment = require('moment');    

module.exports = function(app) {
  
  findAll = function(req, res) {
    console.log("GET - /api/estoques");
    return Estoque.find(function(err, estoque) {
      if(!err) {
        return res.send(estoque);
      } else {
        res.statusCode = 500;
        console.log('Internal error(%d): %s',res.statusCode,err.message);
        return res.send({ error: 'Server error' });
      }
    });
  };

  findById = function(req, res) {

    console.log("GET - /api/estoque/:id");
    return Estoque.findById(req.params.id, function(err, estoque) {

      if(!estoque) {
        res.statusCode = 404;
        return res.send({ error: 'Not found' });
      }

      if(!err) {
        return res.send({ status: 'OK', estoque:estoque });
      } else {

        res.statusCode = 500;
        console.log('Internal error(%d): %s', res.statusCode, err.message);
        return res.send({ error: 'Server error' });
      }
    });
  };

  addEstoque = function(req, res) {

    console.log('POST - /api/estoque');
    console.log("email ", req.body)

    if(req.body && req.body.estoque){
      var fab = null;
      var ven = null;

      if(req.body.estoque.fabricacao)
        fab = moment(req.body.estoque.fabricacao, 'DD/MM/YYYY', true).toDate();
      if(req.body.estoque.vencimento)
        ven = moment(req.body.estoque.vencimento, 'DD/MM/YYYY', true).toDate();

      var estoque = new Estoque({
        nome:    req.body.estoque.nome,
        descricao: req.body.estoque.descricao,
        fornecedor: req.body.estoque.fornecedor,        
        fabricacao:  fab,
        vencimento: ven,
        qtd:  req.body.estoque.qtd,
        venda: req.body.estoque.venda,
        custo: req.body.estoque.custo,   
        maoobra: req.body.estoque.maoobra  
      });

      estoque.save(function(err) {
        if(err) {
          console.log('Erro ao salvar produto de estoque: ' + err);
          res.send({ error:err });
          return;
        } else {
          console.log("Produto inserido no estoque.");
          return res.send({ status: 'OK', estoque:estoque });

        }

      });
    } else {
      res.send({ error: { "message": "Erro ao recuperar valores de produto de estoque.", "name": "Error get values."}});
      return;      
    } 
  };

  updateEstoque = function(req, res) {

    console.log("PUT - /api/estoque/:id");
    console.log("req.body", req.body);

    return Estoque.findById(req.params.id, function(err, estoque) {

      if(!estoque) {
        res.statusCode = 404;
        return res.send({ error: 'Not found' });
      }      

      var fab = null;
      var ven = null;

      if(req.body.fabricacao)
        fab = moment(req.body.fabricacao, 'DD/MM/YYYY', true).toDate();
      if(req.body.vencimento)
        ven = moment(req.body.vencimento, 'DD/MM/YYYY', true).toDate();

      if (req.body.nome != null) estoque.nome = req.body.nome;
      if (req.body.descricao != null) estoque.descricao = req.body.descricao;
      if (req.body.fornecedor != null) estoque.fornecedor = req.body.fornecedor;      
      if (req.body.fabricacao != null) estoque.fabricacao = fab;
      if (req.body.vencimento != null) estoque.vencimento = ven;
      if (req.body.custo!= null) estoque.custo = req.body.custo;
      if (req.body.qtd != null) estoque.qtd = req.body.qtd;
      if (req.body.venda != null) estoque.venda = req.body.venda;
      if (req.body.maoobra != null) estoque.maoobra = req.body.maoobra;

      console.log("estoque", estoque)
      return estoque.save(function(err) {
        if(!err) {
          console.log('Updated');
          return res.send({ status: 'OK', estoque:estoque });
        } else {
          if(err.nome == 'ValidationError') {
            res.statusCode = 400;
            res.send({ error: 'Validation error' });
          } else {
            res.statusCode = 500;
            res.send({ error: 'Server error' });
          }
          console.log('Internal error(%d): %s',res.statusCode,err.message);
        }

        res.send(estoque);

      });
    });
  };

  deleteEstoque = function(req, res) {

    console.log("DELETE - /api/estoque/:id");
    return Estoque.findById(req.params.id, function(err, estoque) {
      if(!estoque) {
        res.statusCode = 404;
        return res.send({ error: 'Not found' });
      }

      return estoque.remove(function(err) {
        if(!err) {
          console.log('Removedo Estoque.');
          return res.send({ status: 'OK' });
        } else {
          res.statusCode = 500;
          console.log('Internal error(%d): %s',res.statusCode,err.message);
          return res.send({ error: 'Server error' });
        }
      })
    });
  }

  //Link routes and actions
  app.get('/api/estoques', findAll);
  app.get('/api/estoque/:id', findById);
  app.post('/api/estoque', addEstoque);
  app.put('/api/estoque/:id', updateEstoque);
  app.delete('/api/estoque/:id', deleteEstoque);
}