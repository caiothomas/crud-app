
var Client = require('../models/clients.js'),
    Isemail = require('isemail');

module.exports = function(app) {

  /**
   * Find and retrieves all Clients
   * @param {Object} req HTTP request object.
   * @param {Object} res HTTP response object.
   */
  findAllClients = function(req, res) {
    console.log("GET - /api/clients");
    return Client.find(function(err, tshirts) {
      if(!err) {
        return res.send(tshirts);
      } else {
        res.statusCode = 500;
        console.log('Internal error(%d): %s',res.statusCode,err.message);
        return res.send({ error: 'Server error' });
      }
    });
  };

  /**
   * Find and retrieves a single tshirt by its ID
   * @param {Object} req HTTP request object.
   * @param {Object} res HTTP response object.
   */
  findById = function(req, res) {

    console.log("GET - /api/client/:id");
    return Client.findById(req.params.id, function(err, client) {

      if(!client) {
        res.statusCode = 404;
        return res.send({ error: 'Not found' });
      }

      if(!err) {
        return res.send({ status: 'OK', client:client });
      } else {

        res.statusCode = 500;
        console.log('Internal error(%d): %s', res.statusCode, err.message);
        return res.send({ error: 'Server error' });
      }
    });
  };


  /**
   * Creates a new tshirt from the data request
   * @param {Object} req HTTP request object.
   * @param {Object} res HTTP response object.
   */
  addClient = function(req, res) {

    console.log('POST - /api/client');
    console.log("email ", req.body)
    if(req.body && req.body.client && req.body.client.email && !Isemail.validate(req.body.client.email)){        
      res.send({ error: { "message": "Validation error: Email", "name": "ValidationError"}});
      return;      
    }

    if(req.body && req.body.client){
      var client = new Client({
        nome:    req.body.client.nome,
        telefone:    req.body.client.telefone,
        email: req.body.client.email,
      });

      client.save(function(err) {

        if(err) {
          console.log('Error while saving Client: ' + err);
          res.send({ error:err });
          return;
        } else {
          console.log("Client created");
          return res.send({ status: 'OK', client:client });

        }

      });
    } else {
      res.send({ error: { "message": "Error to get values from client.", "name": "Error get values."}});
      return;      
    } 
  };


  /**
   * Update a tshirt by its ID
   * @param {Object} req HTTP request object.
   * @param {Object} res HTTP response object.
   */
  updateClient = function(req, res) {

    console.log("PUT - /api/client/:id");
    console.log("req.body", req.body);

    return Client.findById(req.params.id, function(err, client) {

      if(!client) {
        res.statusCode = 404;
        return res.send({ error: 'Not found' });
      }      

      if (req.body.nome != null) client.nome = req.body.nome;
      if (req.body.email != null) client.email = req.body.email;
      if (req.body.telefone != null) client.telefone = req.body.telefone;

      console.log("client", client)
      return client.save(function(err) {
        if(!err) {
          console.log('Updated');
          return res.send({ status: 'OK', client:client });
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

        res.send(client);

      });
    });
  };


  /**
   * Delete a tshirt by its ID
   * @param {Object} req HTTP request object.
   * @param {Object} res HTTP response object.
   */
  deleteClient = function(req, res) {

    console.log("DELETE - /api/client/:id");
    return Client.findById(req.params.id, function(err, client) {
      if(!client) {
        res.statusCode = 404;
        return res.send({ error: 'Not found' });
      }

      return client.remove(function(err) {
        if(!err) {
          console.log('Removed client');
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
  app.get('/api/clients', findAllClients);
  app.get('/api/client/:id', findById);
  app.post('/api/client', addClient);
  app.put('/api/client/:id', updateClient);
  app.delete('/api/client/:id', deleteClient);

}