
var Vendas = require('../models/vendas.js'),
    Client = require('../models/clients.js'),
    Isemail = require('isemail'),
    moment = require('moment');    

module.exports = function(app) {

  findAll = function(req, res) {
    console.log("GET - /api/vendas");
    return Vendas.aggregate([
      {
        $lookup:
        {
          from: "clients",
          localField: "cliente",
          foreignField: "_id",
          as: "clientes"
        },
      }, {$unwind: "$clientes"}      
    ],function(err, vendas) {
      if(!err) {        
        return res.send(vendas);
      } else {
        res.statusCode = 500;
        console.log('Internal error(%d): %s',res.statusCode,err.message);
        return res.send({ error: 'Server error' });
      }
    })    
    /*
    return Vendas.find(function(err, vendas) {
      if(!err) {        
        return res.send(vendas);
      } else {
        res.statusCode = 500;
        console.log('Internal error(%d): %s',res.statusCode,err.message);
        return res.send({ error: 'Server error' });
      }
    });*/
  };

  /**
   * Find and retrieves a single tshirt by its ID
   * @param {Object} req HTTP request object.
   * @param {Object} res HTTP response object.
   */
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


  addVenda = function(req, res) {

    console.log('POST - /api/venda');
    console.log("email ", req.body)

    if(req.body && req.body.produtos){           
      var client = null;

      if(req.body.cliente && req.body.cliente._id)
        client = new Client({_id: req.body.cliente._id})

        var venda = new Vendas({
          cliente:  client,
          tipo: req.body.tipo,
          produtos: req.body.produtos,        
          total:  req.body.total,          
        });

      venda.save(function(err) {
        if(err) {
          console.log('Erro ao salvar vendas.' + err);
          res.send({ error:err });
          return;
        } else {
          console.log("Venda realizada com sucess.");
          return res.send({ status: 'OK', venda:venda });
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
  app.get('/api/vendas', findAll);
  app.get('/api/venda/:id', findById);
  app.post('/api/venda', addVenda);
  app.put('/api/venda/:id', updateEstoque);
  app.delete('/api/venda/:id', deleteEstoque);

}