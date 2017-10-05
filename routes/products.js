
var Product = require('../models/products.js'),
    Isemail = require('isemail'),
    moment = require('moment');    

module.exports = function(app) {

  /**
   * Find and retrieves all Products
   * @param {Object} req HTTP request object.
   * @param {Object} res HTTP response object.
   */
  findAll = function(req, res) {
    console.log("GET - /api/products");
    return Product.find(function(err, products) {
      if(!err) {
        return res.send(products);
      } else {
        res.statusCode = 500;
        console.log('Internal error(%d): %s',res.statusCode,err.message);
        return res.send({ error: 'Server error' });
      }
    });
  };

  findById = function(req, res) {

    console.log("GET - /api/product/:id");
    return Product.findById(req.params.id, function(err, product) {

      if(!product) {
        res.statusCode = 404;
        return res.send({ error: 'Not found' });
      }

      if(!err) {
        return res.send({ status: 'OK', product:product });
      } else {

        res.statusCode = 500;
        console.log('Internal error(%d): %s', res.statusCode, err.message);
        return res.send({ error: 'Server error' });
      }
    });
  };

  addProduct = function(req, res) {

    console.log('POST - /api/product');
    console.log("email ", req.body)

    if(req.body && req.body.product){
      var fab = null;
      var ven = null;

      try{
        if(req.body.product.fabricacao)
          fab = moment(req.body.product.fabricacao, 'DD/MM/YYYY', true).toDate();
        if(req.body.product.vencimento)
          ven = moment(req.body.product.vencimento, 'DD/MM/YYYY', true).toDate();

        var product = new Product({
          nome:    req.body.product.nome,
          descricao: req.body.product.descricao,
          fabricacao:  fab,
          vencimento: ven,
          qtd:  req.body.product.qtd,
          venda: req.body.product.venda,
          custo: req.body.product.custo,   
          maoobra: req.body.product.maoobra  
        });        
      } catch(e){
          console.log('Error while saving Product: ' + err);
          res.statusCode = 500;            
          return  res.send({ status: 'Error while saving Product.'});        
      }
      
      product.save(function(err) {
        if(err) {
          console.log('Error while saving Product: ' + err);
          res.send({ error:err });
          return;
        } else {
          console.log("Product created");
          return res.send({ status: 'OK', product:product });

        }

      });
    } else {
      res.send({ error: { "message": "Error to get values from product.", "name": "Error get values."}});
      return;      
    } 
  };


  updateQtd = function(req, res) {

    console.log('POST - /api/productQtd');
    console.log("email ", req.body)

    if(req.body){      
      req.body.forEach(function (item) {
        Product.findById(item._id, function(err, product) {
          try{
              product.qtd = product.qtd - item.quantidade; 
          } catch(e){
              console.log('Error ao atualizar a quantidade do produto:' + err);            
              res.statusCode = 500;            
              return  res.send({ status: 'Error ao atualizar a quantidade do produto'});
          }
          product.save(function(err) {
            if(err) {
              console.log('Error ao atualizar a quantidade do produto:' + err);
            } else {
              console.log("Atualizacao da quantidade no produto.");
            }
          });             
        });
      });        
    };
    res.send({ status: 'OK'});
  };

  updateProduct = function(req, res) {

    console.log("PUT - /api/client/:id");
    console.log("req.body", req.body);

    return Product.findById(req.params.id, function(err, product) {

      if(!product) {
        res.statusCode = 404;
        return res.send({ error: 'Not found' });
      }      

      try{        
          var fab = null;
          var ven = null;

          if(req.body.fabricacao)
            fab = moment(req.body.fabricacao, 'DD/MM/YYYY', true).toDate();
          if(req.body.vencimento)
            ven = moment(req.body.vencimento, 'DD/MM/YYYY', true).toDate();

          if (req.body.nome != null) product.nome = req.body.nome;
          if (req.body.descricao != null) product.descricao = req.body.descricao;
          if (req.body.fabricacao != null) product.fabricacao = fab;
          if (req.body.vencimento != null) product.vencimento = ven;
          if (req.body.custo!= null) product.custo = req.body.custo;
          if (req.body.qtd != null) product.qtd = req.body.qtd;
          if (req.body.venda != null) product.venda = req.body.venda;
          if (req.body.maoobra != null) product.maoobra = req.body.maoobra;
      } catch(e){
          console.log("Error in product find:"+e);
          res.statusCode = 500;
          return res.send({ error: 'Server error' });        
      }

      console.log("product", product)
      return product.save(function(err) {
        if(!err) {
          console.log('Updated');
          return res.send({ status: 'OK', product:product });
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

        res.send(product);

      });
    });
  };

deleteProduct = function(req, res) {

    console.log("DELETE - /api/product/:id");

    return Product.findById(req.params.id, function(err, product) {
      if(!product) {
        res.statusCode = 404;
        return res.send({ error: 'Not found' });
      }

      return product.remove(function(err) {
        if(!err) {
          console.log('Removed product');
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
  app.get('/api/products', findAll);
  app.get('/api/product/:id', findById);
  app.post('/api/product', addProduct);
  app.post('/api/productQtd', updateQtd);  
  app.put('/api/product/:id', updateProduct);
  app.delete('/api/product/:id', deleteProduct);
}