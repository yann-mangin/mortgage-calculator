function StorageService(store) {
  
  var storageService = this;

  storageService.getMaxDealId = function(){
    var id = 1;
    var deals = storageService.getDeals();

    if (deals && deals.length > 0) {
      id = Math.max.apply(Math, deals.map(function(deal) {
        return deal.id + 1;
      }));
    }
    return id;
  };

  storageService.getDeals = function(){
    return store.get('deals');
  };
  
  storageService.setItem = function(name, value){
    return store.set(name, value);
  };
  
  storageService.getItem = function(name){
    return store.get(name);
  };
  
  storageService.removeItem = function(name){
    return store.remove(name);
  };
  
  storageService.setDeals = function(deals){
    return store.set('deals',deals);
  };

  storageService.getDeal = function(id){
    var deals = storageService.getDeals();

    if (!deals)
      return false;

    var deal = deals.filter(function(deal){
      return deal.id === id;
    });

    return (deal.length === 1) ? deal[0] : false;
  };

  storageService.setDeal = function(newDeal){
    var deals = storageService.getDeals;
    if (!deals)
      deals = [];
    deals.push(newDeal);

    store.set('deals',deals);
  };

  storageService.deleteDeals = function(){
    store.remove('deals');
  };
  
  storageService.deleteDeal = function(id){
    var deals = storageService.getDeals();
  
    if (!deals)
      return false;
  
    var index;
    var deal = deals.filter(function(deal, key){
      index = key;
      console.log('keyId', index);
      return deal.id === id;
    });
  
    deals.splice(index, 1);
    return this.setDeals(deals) ? index : false;
  };

  storageService.getComparedDeals = function(){
    return store.get('comparedDeals');
  };

  storageService.setComparedDeals = function(deals){
    return store.set('comparedDeals',deals);
  };

  storageService.deleteComparedDeals = function(){
    store.remove('comparedDeals');
  };
}

StorageService.$inject = ['store'];

angular
.module('mortgageCalculator')
.service('StorageService', StorageService);