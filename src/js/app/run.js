/**
 * ANATWINE PORTAL v2
 *
 */

function run($rootScope, $state, User, translationService, $httpBackend, MockApiService, ENDPOINT_URI) {
  var langKey;
  var regexUrl;
  var regexUrlSearchOptions;
  var regexUrlTierOptions;
  //var lang = PersistenceService.getProperty('ngStorage-user','lang');

  /*if (lang)
    langKey = lang;
  else if ($window.navigator.language === 'en')
    langKey = 'en-us';
  else
    langKey = $filter('lowercase')($window.navigator.language);*/
  langKey = 'en-us';
  
  translationService.changeLanguage(langKey);

  $rootScope.$on('$stateChangeSuccess', function rootScopeOnStateChangeSuccess(event, toState, toParams, fromState) {
    $state.previous = fromState;
  });

  $rootScope.$state = $state;

  // Client-side security. Server-side framework MUST add it's
  // own security as well since client-based security is easily hacked
  $rootScope.$on('$stateChangeStart', function rootScopeOnStateChangeStart(event, next) {
    var currentUser = User.getCurrentUser();

    if (next && next.private) {
      if (!currentUser) {
        event.preventDefault();
        $state.go('errors.error401');
      } else if (next.brand && !currentUser.brand) {
        event.preventDefault();
        $state.go('errors.error401');
      } else if (next.retailer && !currentUser.retailer) {
        event.preventDefault();
        $state.go('errors.error401');
      } else if (next.integration && !currentUser.integration) {
        event.preventDefault();
        $state.go('errors.error401');
      }
    }

    $rootScope.$on('unsavedChanges', function rootScopeOn(event) {
      event.preventDefault();
    });

  });

  $httpBackend.whenGET(ENDPOINT_URI + '/retailer/products/vendors?').respond(function interceptAPIGetProductsVendors() {
    return MockApiService.getProductsVendors();
  });

  $httpBackend.whenGET(ENDPOINT_URI + '/retailer/orders/vendors?').respond(function interceptAPIGetOrdersVendors() {
    return MockApiService.getOrdersVendors();
  });

  /**
   * PLEASE NOTE THAT THIS IS AN INTERCEPTOR FOR REAL API CALLS.
   * YOU WILL NEED TO PUT ALL YOUR INTERCEPTOR CALLS BEFORE THE CATCH
   * ALL SITUATIONS BELOW. I.E. THE LAST TWO PARAMETERLESS LINES FOR
   * whenGET & whenPOST. YOU COULD ADD YOURS ABOVE HERE.
   *
   * Implements the MockApiService, calling the relevant method to GET or POST data to it.
   *
   */

  /*regexUrl = new RegExp('^' + ENDPOINT_URI.replace(/\//g, "\\/") + '/retailer/vendors/live/'.replace(/\//g, "\\/") + '[\\?.*]?');
  $httpBackend.whenGET(regexUrl).respond(function interceptGetApiVendorLive(method,url) {
    return MockApiService.getVendor(parseInt(url.substring(url.lastIndexOf('/') + 1,url.length),10));
  });*/

  /****** END SETTINGS PACKING SLIPS ******/

  /****** BEGIN VENDORS INTEGRATION ******/
  regexUrlSearchOptions = new RegExp('^' + ENDPOINT_URI.replace(/\//g, "\\/") + '/retailer/vendors/integration/specialist-options'.replace(/\//g, "\\/") + '[\\?.*]?');
    $httpBackend.whenGET(regexUrlSearchOptions).respond(function interceptGetApiVendorIntegration(method,url) {
        if (url.indexOf('specialist-options') > 0)
            return MockApiService.getV2CSpecialistOptions();

        return MockApiService.getVendorIntegration(parseInt(url.substring(url.lastIndexOf('/') + 1,url.length),10));
    });

    regexUrlTierOptions = new RegExp('^' + ENDPOINT_URI.replace(/\//g, "\\/") + '/retailer/vendors/integration/tier-options'.replace(/\//g, "\\/") + '[\\?.*]?');
    $httpBackend.whenGET(regexUrlTierOptions).respond(function interceptGetApiVendorIntegration(method,url) {
        if (url.indexOf('tier-options') > 0)
            return MockApiService.getTierOptions();

        return MockApiService.getVendorIntegration(parseInt(url.substring(url.lastIndexOf('/') + 1,url.length),10));
    });

    // regexUrlPackingOptions = new RegExp('^' + ENDPOINT_URI.replace(/\//g, "\\/") + '/retailer/vendors/integration/packing-slip-options'.replace(/\//g, "\\/") + '[\\?.*]?');
    // $httpBackend.whenGET(regexUrlPackingOptions).respond(function interceptGetApiVendorIntegration(method,url) {
    //     if (url.indexOf('packing-slip-options') > 0)
    //         return MockApiService.getPackingSlipOptions();
    //
    //     return MockApiService.getVendorIntegration(parseInt(url.substring(url.lastIndexOf('/') + 1,url.length),10));
    // });

  regexUrl = new RegExp('^' + ENDPOINT_URI.replace(/\//g, "\\/") + '/retailer/vendors/integration/filters'.replace(/\//g, "\\/") + '[\\?.*]?');
  $httpBackend.whenGET(regexUrl).respond(function interceptGetApiVendorIntegration(method,url) {

    if (url.indexOf('vendorids') > 0)
      return MockApiService.getVendorsIntegrationVendorIds();

    if (url.indexOf('statuses') > 0)
      return MockApiService.getVendorsIntegrationStatuses();

    if (url.indexOf('stages') > 0)
      return MockApiService.getVendorsIntegrationStages();

    return MockApiService.getVendorIntegration(parseInt(url.substring(url.lastIndexOf('/') + 1,url.length),10));
  });

  /****** END VENDORS INTEGRATION ******/

  /* uncomment when ANE001-406 is implemented
   $httpBackend.whenGET(ENDPOINT_URI + '/retailer/orders/status/export').respond(function interceptGetApiExportOrders() {
   return MockApiService.exportOrders();
   });*/
  
  // Requests for everything else are handled by whatever the ui code does already.
  // E.g. If its using dummy objects it will do so and if it is communicating with
  // the real server it will go to the server unless you have added interceptors above.
  $httpBackend.whenGET().passThrough(function interceptGetPassThrough() { console.log("Pass through all other GET calls"); });
  // All other POST Requests are handled by whatever the api is doing already
  $httpBackend.whenPOST().passThrough(function interceptPostPassThrough() { console.log("Pass through all other POST calls"); });
  // All other DELETE Requests are handled by whatever the api is doing already
  $httpBackend.whenDELETE().passThrough(function interceptPostPassThrough() { console.log("Pass through all other DELETE calls"); });
  $httpBackend.whenPUT().passThrough(function interceptPostPassThrough() { console.log("Pass through all other DELETE calls"); });

}

run.$inject = ['$rootScope', '$state', 'User', 'translationService', '$httpBackend', 'MockApiService', 'ENDPOINT_URI'];

angular
.module('anatwine')
.run(run);
