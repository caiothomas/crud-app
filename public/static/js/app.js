var app = angular.module('myApp', ['ngRoute', 'ui.bootstrap']);
var pageSize = 15;

app.filter('pagination', function() {
    return function(input, start) {
        if (!input || !input.length) { return; }
        start = +start;
        return input.slice(start);
    };
});

app.factory("services", ['$http', function($http) {
  var serviceBase = 'http://localhost:8080/api/'
    var obj = {};
    
    obj.getClientes = function(){
        return $http.get(serviceBase + 'clients');
    };
    
    obj.getCliente = function(postId){
        return $http.get(serviceBase + 'client/' + postId);
    };
 
    obj.insertCliente = function (post, callback) {
      
      $http.post(serviceBase + 'client', post).then(function (data, status) {
        callback(null, data, status);
      });
    };
 
    obj.updateCliente = function (id, cliente) {
        return $http.put(serviceBase + 'client/'+id, cliente).then(function (status) {
            return status.data;
        });
    };
 
    obj.deleteCliente = function (id) {
        return $http.delete(serviceBase + 'client/' + id).then(function (status) {
            return status.data;
        });
    };
    
    //produto
    obj.getProdutos = function(){
        return $http.get(serviceBase + 'products');
    };     
    
    obj.getProduto = function(postId){
        return $http.get(serviceBase + 'product/' + postId);
    };    
    
    obj.insertProduto = function (post, callback) {      
      $http.post(serviceBase + 'product', post).then(function (data, status) {
        callback(null, data, status);
      });
    };    
    
    obj.deleteProduto = function (id) {
        return $http.delete(serviceBase + 'product/' + id).then(function (status) {
            return status.data;
        });
    };    
    
    obj.updateProduto = function (id, produto) {
        return $http.put(serviceBase + 'product/'+id, produto).then(function (status) {
            return status.data;
        });
    };
  
    obj.updateProdutoQtd = function (produto, callback) {
        $http.post(serviceBase + 'productQtd', produto).then(function (data, status) {
            callback(null, data, status);
        });
    };      
    
    //estoque
    obj.getEstoques = function(){
        return $http.get(serviceBase + 'estoques');
    };     
    
    obj.getEstoque = function(postId){
        return $http.get(serviceBase + 'estoque/' + postId);
    };    
        
   obj.insertEstoque = function (post, callback) {      
      $http.post(serviceBase + 'estoque', post).then(function (data, status) {
        callback(null, data, status);
      });
    };    
     
    obj.updateEstoque = function (id, estoque) {
        return $http.put(serviceBase + 'estoque/'+id, estoque).then(function (status) {
            return status.data;
        });
    };      
    
    obj.deleteEstoque = function (id) {
        return $http.delete(serviceBase + 'estoque/' + id).then(function (status) {
            return status.data;
        });
    };    
      
    //vendas    
    obj.getVendas = function(){
        return $http.get(serviceBase + 'vendas');
    };   
    
    obj.insertVenda = function (venda, callback) {
      $http.post(serviceBase + 'venda', venda).then(function (data, status) {
        callback(null, data, status);
      });      
    };      
    
    
    return obj;   
}]);


app.controller('vendasList', function ($scope, services, $location) {
    $scope.curPage = 0;
    $scope.pageSize = pageSize;
    
    services.getVendas().then(function(data){
        $scope.venda = data.data;            
        $scope.numberOfPages = function() {
        return Math.ceil($scope.venda.length / $scope.pageSize);
        };
    });                 
});
 
app.controller('listCtrl', function ($scope, services, $location) {

    $scope.curPage = 0;
    $scope.pageSize = pageSize;
    
    services.getClientes().then(function(data){
        $scope.cliente = data.data;            
        $scope.numberOfPages = function() {
        return Math.ceil($scope.cliente.length / $scope.pageSize);
        };
    });    
    
    $scope.removeAll = function(){
        var newDataList= [];
        $scope.cliente.forEach(function(cliente) {
            console.log("cliente ", cliente)
            if(cliente.ischecked){
                if(confirm("Tem certeza de deletar?\n"+cliente.nome)==true)
                    services.deleteCliente(cliente._id);
                //newDataList.push(post);        
            }  
        });   

        services.getClientes().then(function(data){
            $scope.cliente = data.data;
        });             
        //$scope.posts=newDataList;
    };

    
    $scope.ToggleSelectAll = function () {
        if ($scope.selectedAll) {
            $scope.selectedAll = true;
        } else {
            $scope.selectedAll = false;
        }        
        
        $scope.cliente.forEach(function(cliente) {
                   cliente.ischecked = $scope.selectedAll;            
        });   
    };
     
    $scope.remove = function (index, cliente) {
        if(confirm("Tem certeza de deletar?\n"+cliente.nome)==true){
            services.deleteCliente(cliente._id);
            //$scope.posts.splice(index, 1);            
            services.getClientes().then(function(data){
                $scope.cliente = data.data;
            });            
        }        
    };  
  
  $scope.edit = function(id){
        $location.path('/#/cliente-insert');
  }
});


app.controller('listProdutos', function ($scope, services, $location) {

    $scope.curPage = 0;
    $scope.pageSize = pageSize;
    
    services.getProdutos().then(function(data){
        $scope.produto = data.data;            
        $scope.numberOfPages = function() {
        return Math.ceil($scope.produto.length / $scope.pageSize);
        };
    });    
    
    $scope.removeAll = function(){
        var newDataList= [];
        $scope.produto.forEach(function(produto) {
            console.log("produto ", produto)
            if(produto.ischecked){
                if(confirm("Tem certeza de deletar?\n"+produto.nome)==true)
                    services.deleteProduto(produto._id);
                //newDataList.push(post);        
            }  
        });   

        services.getProdutos().then(function(data){
            $scope.produto = data.data;
        });             
        //$scope.posts=newDataList;
    };

    
    $scope.ToggleSelectAll = function () {
        if ($scope.selectedAll) {
            $scope.selectedAll = true;
        } else {
            $scope.selectedAll = false;
        }        
        
        $scope.produto.forEach(function(produto) {
                   produto.ischecked = $scope.selectedAll;            
        });   
    };
     
    $scope.remove = function (index, produto) {
        if(confirm("Tem certeza de deletar?\n"+produto.nome)==true){
            services.deleteProduto(produto._id);
            //$scope.posts.splice(index, 1);            
            services.getProdutos().then(function(data){
                $scope.produto = data.data;
            });            
        }        
    };  
  
  $scope.edit = function(id){
        $location.path('/#/produto-insert');
  }
});


app.controller('listEstoque', function ($scope, services, $location) {

    $scope.curPage = 0;
    $scope.pageSize = pageSize;
    
    services.getEstoques().then(function(data){
        $scope.estoque = data.data;            
        $scope.numberOfPages = function() {
        return Math.ceil($scope.estoque.length / $scope.pageSize);
        };
    });    
    
    $scope.removeAll = function(){
        var newDataList= [];
        $scope.estoque.forEach(function(estoque) {
            console.log("estoque ", estoque)
            if(estoque.ischecked){
                if(confirm("Tem certeza de deletar?\n"+estoque.nome)==true)
                    services.deleteEstoque(estoque._id);
                //newDataList.push(post);        
            }  
        });   

        services.getEstoques().then(function(data){
            $scope.estoque = data.data;
        });             
        //$scope.posts=newDataList;
    };

    
    $scope.ToggleSelectAll = function () {
        if ($scope.selectedAll) {
            $scope.selectedAll = true;
        } else {
            $scope.selectedAll = false;
        }        
        
        $scope.estoque.forEach(function(estoque) {
              estoque.ischecked = $scope.selectedAll;            
        });   
    };
     
    $scope.remove = function (index, estoque) {
        if(confirm("Tem certeza de deletar?\n"+estoque.nome)==true){
            services.deleteEstoque(estoque._id);
            //$scope.posts.splice(index, 1);            
            services.getEstoques().then(function(data){
                $scope.estoque = data.data;
            });            
        }        
    };  
  
  $scope.edit = function(id){
        $location.path('/#/estoque-insert');
  }
});


app.controller ('estoqueInsert',function ($scope, $rootScope, $http,  $location, $routeParams, services) {    
    $scope.buttonText = 'Registrar';
    $scope.post = {};

    $scope.save = function(post) {
        services.insertEstoque(post, function(data, status){
            if(status.data.error){
              $scope.error = status.data.error.message;
            } else {                
              $location.path('estoque');                          
            }
        });        
    };
});


app.controller('estoqueEdit', function ($scope, $rootScope, $location, $routeParams, $filter, services, post) {
    $rootScope.title = 'Editar';
    $scope.buttonText = 'Registrar';
    console.log("post", post)
    if(post.data.estoque.vencimento)
        post.data.estoque.vencimento = $filter('date')(new Date(post.data.estoque.vencimento), 'dd/MM/yyyy');    
    if(post.data.estoque.fabricacao)
    post.data.estoque.fabricacao = $filter('date')(new Date(post.data.estoque.fabricacao), 'dd/MM/yyyy');
    $scope.post = post.data;    
    
    var original = post.data;
    $scope.post = angular.copy(original);
 
    $scope.isClean = function() {
        return angular.equals(original, $scope.post);
    }
      
    $scope.save = function(post) {
        console.log("post", post);
        services.updateEstoque(post.estoque._id, $scope.post.estoque);        
        $location.path('estoque');
    };
});

app.controller('editCtrl', function ($scope, $rootScope, $location, $routeParams, services, post) {
    $rootScope.title = 'Editar';
    $scope.buttonText = 'Registrar';
    $scope.post = post.data;
    services.getAllCategorias().then(function(data){
        $scope.categorias = data.data;
    });
    
    services.getAllAuthors().then(function(data){
        $scope.authors = data.data;
    });    
    
    var original = post.data;
    $scope.post = angular.copy(original);
 
    $scope.isClean = function() {
        return angular.equals(original, $scope.post);
    }
      
    $scope.deletePost = function(post) {
        $location.path('/');
        if(confirm("Tem certeza de deletar? "+$scope.post.title)==true)
            services.deletePost(post.id);
    };
 
    $scope.saveCliente = function(post) {
        $location.path('/');
        services.updatePost(post.id, post);        
    };
});

app.controller ('clienteInsert',function ($scope, $rootScope, $http,  $location, $routeParams, services) {    
    $scope.buttonText = 'Registrar';
    $scope.post = {};
         
    $scope.saveCliente = function(post) {
        services.insertCliente(post, function(data, status){
            if(status.data.error){
              console.log("status", status.data.status);                                                              
              console.log("status", status.data.error.message);                                              
              $scope.error = status.data.error.message;
            }else {
              $location.path('/');                          
            }
        });        
    };
});


app.controller ('produtoInsert',function ($scope, $rootScope, $http,  $location, $routeParams, services) {    
    $scope.buttonText = 'Registrar';
    $scope.post = {};

    $scope.saveProduct = function(post) {
        services.insertProduto(post, function(data, status){
            if(status.data.error){
              $scope.error = status.data.error.message;
            } else {                
              $location.path('listProdutos');                          
            }
        });        
    };
});

app.controller('produtoEdit', function ($scope, $rootScope, $location, $routeParams, $filter, services, post) {
    $rootScope.title = 'Editar';
    $scope.buttonText = 'Registrar';
    post.data.product.vencimento = $filter('date')(new Date(post.data.product.vencimento), 'dd/MM/yyyy');    
    post.data.product.fabricacao = $filter('date')(new Date(post.data.product.fabricacao), 'dd/MM/yyyy');
    $scope.post = post.data;    
    
    var original = post.data;
    $scope.post = angular.copy(original);
 
    $scope.isClean = function() {
        return angular.equals(original, $scope.post);
    }
      
    $scope.saveProduct = function(post) {
        console.log("post", post);
        services.updateProduto(post.product._id, $scope.post.product);        
        $location.path('listProdutos');
    };
});

app.controller('clientEdit', function ($scope, $rootScope, $location, $routeParams, services, post) {
    $rootScope.title = 'Editar';
    $scope.buttonText = 'Registrar';
    $scope.post = post.data;    
    
    var original = post.data;
    $scope.post = angular.copy(original);
 
    $scope.isClean = function() {
        return angular.equals(original, $scope.post);
    }
      
    $scope.deleteCliente = function(post) {
        $location.path('/');
        if(confirm("Tem certeza de deletar? "+$scope.post.client.nome)==true)
            services.deleteCliente(post.client._id);
    };
 
    $scope.saveCliente = function(post) {
        console.log("post", post);
        services.updateCliente(post.client._id, $scope.post.client);        
        $location.path('/');
    };
});

app.controller('vendas', function ($scope, $rootScope, $location, $routeParams, $filter, services) {

    $scope.total = 0;
    $scope.curPage = 0;
    $scope.pageSize = pageSize;
    $scope.post = { vendas: {cliente: null, tipo: "1"}};
    
    services.getProdutos().then(function(data){
        $scope.produto = data.data;            
        $scope.numberOfPages = function() {
        return Math.ceil($scope.produto.length / $scope.pageSize);
        };
    });    
    
    services.getClientes().then(function(data){
        $scope.cliente = data.data;            
    });        

    $scope.cart = [];
    
    function getTotal(){
        var soma =0;
        for(var i=0; i < $scope.cart.length; i++){
            soma += $scope.cart[i].subtotal;
        }
        return soma;
    }
  
    $scope.add = function(item) {        
      var elem = $filter('filter')($scope.cart, {_id: item._id}, true);              
      if (elem.length >= 1) {
          console.log("quantidade", item.qtd, elem[0].quantidade)
          if (item.qtd > 0){                  
              elem[0].quantidade += 1;
              item.qtd--;                  
              elem[0].subtotal = parseFloat(elem[0].venda.replace('.','').replace(',','.'))  * parseFloat(elem[0].quantidade);            
          } else {
              $scope.error = "Quantidade insuficiente para o item: " + item.nome;
          }
      } else {
            item.quantidade = 1;      
            item.qtd--;                            
            item.subtotal = parseFloat(item.venda.replace('.','').replace(',','.')) * parseFloat(item.quantidade);
            $scope.cart.push(item);//adiciona                                
      }              
        $scope.total = getTotal();
    };

    $scope.remove = function(item){				
        var index = -1;		
        var elem = null;
        var comArr = eval( $scope.cart);
        for( var i = 0; i < comArr.length; i++ ) {
            if( comArr[i]._id === item._id) {                
                index = i;
                elem = comArr[i];
                break;
            }
        }
        if( index === -1 ) {
              $scope.error = "Error para remover ";
        }
        $scope.cart.splice( index, 1 );
        if(elem){
            var prod = $filter('filter')($scope.produto, {_id: elem._id}, true);   
            console.log("elem", elem)
            console.log("prd", prod)
            prod[0].qtd += elem.quantidade;            
        }
        $scope.total = getTotal();        
    };  
      
    $scope.save = function(post) {
      console.log("post", post);          
      var venda = {
        cliente:  (post.vendas && post.vendas.cliente) ? post.vendas.cliente : null,
        tipo: post.vendas.tipo,
        produtos: $scope.cart,        
        total:  getTotal()
      };
      
      services.insertVenda(venda, function(data, status){
            if(status.data.error){
              $scope.error = status.data.error.message;
            }else {
                console.log("status ", data)
              //remove a quantidade dos produtos em produtos
                services.updateProdutoQtd($scope.cart, function(data, status){
                    console.log("Atualiza a quantidade dos produtos!")
                    if(status.data.error)
                        $scope.error = status.data.error.message;
                    else 
                        $location.path('vendas-list');
                    console.log("finalizando..")
                });    
            }
      });

    };
});
     
app.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.when('/', {
            title: 'Cliente',
            templateUrl: 'partials/clientes.html',
            controller: 'listCtrl'
      }).when('/cliente-insert', {
            title: 'Adicionar',
            templateUrl: 'partials/clientes-edit.html',
            controller: 'clienteInsert'      
      }).when('/cliente-edit/:id', {
            title: 'Editar',
            templateUrl: 'partials/clientes-edit.html',
            controller: 'clientEdit',
            resolve: {
                post: function(services, $route){
                    var id = $route.current.params.id;
                    return services.getCliente(id);
                }
            }
      }).when('/listProdutos', {
            title: 'Produto',
            templateUrl: 'partials/produtos.html',
            controller: 'listProdutos'
      }).when('/produto-insert', {
            title: 'Adicionar',
            templateUrl: 'partials/produtos-edit.html',
            controller: 'produtoInsert'      
      }).when('/produto-edit/:id', {
            title: 'Editar',
            templateUrl: 'partials/produtos-edit.html',
            controller: 'produtoEdit',
            resolve: {
                post: function(services, $route){
                    var id = $route.current.params.id;
                    return services.getProduto(id);
                }
            }        
      }).when('/estoque', {
            templateUrl: 'partials/estoque.html',
            controller: 'listEstoque'                    
      }).when('/estoque-insert', {
            title: 'Adicionar',
            templateUrl: 'partials/estoque-edit.html',
            controller: 'estoqueInsert'      
      }).when('/estoque-edit/:id', {
            title: 'Editar',
            templateUrl: 'partials/estoque-edit.html',
            controller: 'estoqueEdit',
            resolve: {
                post: function(services, $route){
                    var id = $route.current.params.id;
                    console.log("services.getEstoque(id)", services.getEstoque(id))
                    return services.getEstoque(id);
                }
            }        
      }).when('/vendas', {
            templateUrl: 'partials/vendas.html',
            controller: 'vendas'                    
      }).when('/vendas-list', {
            templateUrl: 'partials/vendas-list.html',
            controller: 'vendasList'                    
      }).otherwise({
            redirectTo: '/'
      });
}]);

app.run(['$location', '$rootScope', function($location, $rootScope) {
    $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
            $rootScope.title = current.$$route.title;
    });
}]);