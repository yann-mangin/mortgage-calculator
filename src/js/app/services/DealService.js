'use strict';

function DealService($rootScope, $state, $filter, $timeout, $uibModal, StorageService, notify, DEAL_CONFIG) {
  
  var dealService = this;
  
  notify.config({
                  startTop: -10,
    duration: 300000
                });

  dealService.calculate = function(deal){
    var chartLineData = {
      labels: [],
      payments: [],
      interests: [],
      capitalGain: []
    };

    var dealRes = {
      details: deal,
      summary: {
        payments: {},
        interests: {},
        valuationFee: {},
        bookingFee: {},
        cost: {},
        capitalGain: {}
      }
    };

    ////////////////////////////////////////
    /*** fixedTerm ***/

    dealRes.fixedTerm = {};
    dealRes.fixedTerm.term = deal.initialTermTerm;
    dealRes.fixedTerm.rate = deal.initialTermRate;
    dealRes.fixedTerm.monthlyRate = dealRes.fixedTerm.rate / 12;
    dealRes.fixedTerm.nper = parseInt(12 * deal.mortgageTermYears) + parseInt(deal.mortgageTermMonths);
    dealRes.fixedTerm.mortgageBalance = parseFloat(deal.mortgageAmount);
    var x = (dealRes.fixedTerm.rate / 100) / 12;
    var n = dealRes.fixedTerm.nper;
    var comp = Math.pow((x + 1),n);
    dealRes.fixedTerm.monthlyPayments = dealRes.fixedTerm.mortgageBalance * ((x * comp) / (comp - 1));
    dealRes.fixedTerm.table = [];

    var balance = dealRes.fixedTerm.mortgageBalance;
    var rate = dealRes.fixedTerm.rate;
    var monthlyPayment = dealRes.fixedTerm.monthlyPayments;
    var payments = 0;
    var interests = 0;
    var capitalGain = 0;
    var installmentCount = 0;

    for (var i = 1; i <= dealRes.fixedTerm.term; i++){
      var yearlyInterest = (balance * rate) / 100;
      var monthlyInterest = yearlyInterest / 12;
      var monthlyCapitalGain = monthlyPayment - monthlyInterest + parseInt(deal.earlyRepayments);
      var installment = {
        balance: balance,
        rate: rate,
        yearlyInterest: yearlyInterest,
        monthlyInterest: monthlyInterest,
        monthlyPayment: monthlyPayment,
        monthlyCapitalGain: monthlyCapitalGain
      };

      dealRes.fixedTerm.table.push(installment);
      balance = balance - monthlyCapitalGain;

      payments += monthlyPayment;
      interests += monthlyInterest;
      capitalGain += monthlyCapitalGain;
      installmentCount += 1;

      chartLineData.labels.push(installmentCount);
      chartLineData.payments.push(Math.round(monthlyPayment * 100) / 100);
      chartLineData.interests.push(Math.round(monthlyInterest * 100) / 100);
      chartLineData.capitalGain.push(Math.round(monthlyCapitalGain * 100) / 100);
    }

    dealRes.summary.payments.fixedTerm = payments;
    dealRes.summary.interests.fixedTerm = interests;
    dealRes.summary.valuationFee.fixedTerm = deal.valuationFee;
    dealRes.summary.bookingFee.fixedTerm = deal.bookingFee;
    dealRes.summary.cost.fixedTerm = dealRes.summary.interests.fixedTerm + dealRes.summary.valuationFee.fixedTerm + dealRes.summary.bookingFee.fixedTerm;
    dealRes.summary.capitalGain.fixedTerm = capitalGain;

    ////////////////////////////////////////
    /*** remainingTerm ***/

    dealRes.remainingTerm = {};
    dealRes.remainingTerm.term = (parseInt(12 * deal.mortgageTermYears) + parseInt(deal.mortgageTermMonths)) - dealRes.fixedTerm.term;
    dealRes.remainingTerm.rate = deal.remainingTermRate;
    dealRes.remainingTerm.monthlyRate = dealRes.remainingTerm.rate / 12;
    dealRes.remainingTerm.nper = dealRes.remainingTerm.term;
    dealRes.remainingTerm.mortgageBalance = balance;
    var x = (dealRes.remainingTerm.rate / 100) / 12;
    var n = dealRes.remainingTerm.nper;
    var comp = Math.pow((x + 1),n);
    dealRes.remainingTerm.monthlyPayments = dealRes.remainingTerm.mortgageBalance * ((x * comp) / (comp - 1));
    dealRes.remainingTerm.table = [];		dealRes.remainingTerm.mortgageBalance = balance;

    rate = dealRes.remainingTerm.rate;
    monthlyPayment = dealRes.remainingTerm.monthlyPayments;
    interests = 0;
    payments = 0;
    capitalGain = 0;

    dealRes.remainingTerm.table = [];
    for (var i = 1; i <= dealRes.remainingTerm.term; i++){
      var yearlyInterest = (balance * rate) / 100;
      var monthlyInterest = yearlyInterest / 12;
      var monthlyCapitalGain = monthlyPayment - monthlyInterest + parseInt(deal.earlyRepayments);
      var installment = {
        balance: balance,
        rate: rate,
        yearlyInterest: yearlyInterest,
        monthlyInterest: monthlyInterest,
        monthlyPayment: monthlyPayment,
        monthlyCapitalGain: monthlyCapitalGain
      };

      dealRes.remainingTerm.table.push(installment);
      balance = balance - monthlyCapitalGain;

      payments += monthlyPayment;
      interests += monthlyInterest;
      capitalGain += monthlyCapitalGain;
      installmentCount += 1;

      chartLineData.labels.push(installmentCount);
      chartLineData.payments.push(Math.round(monthlyPayment * 100) / 100);
      chartLineData.interests.push(Math.round(monthlyInterest * 100) / 100);
      chartLineData.capitalGain.push(Math.round(monthlyCapitalGain * 100) / 100);

      if (balance < 0){
        dealRes.remainingTerm.table[i-1].monthlyPayment = dealRes.remainingTerm.table[i-1].balance + dealRes.remainingTerm.table[i-1].monthlyInterest;
        dealRes.remainingTerm.table[i-1].monthlyCapitalGain = dealRes.remainingTerm.table[i-1].balance + dealRes.remainingTerm.table[i-1].monthlyInterest;
        break;
      }
    }

    dealRes.summary.payments.remainingTerm = payments;
    dealRes.summary.interests.remainingTerm = interests;
    dealRes.summary.valuationFee.remainingTerm = 0;
    dealRes.summary.bookingFee.remainingTerm = 0;
    dealRes.summary.cost.remainingTerm = dealRes.summary.interests.remainingTerm + dealRes.summary.valuationFee.remainingTerm + dealRes.summary.bookingFee.remainingTerm;
    dealRes.summary.capitalGain.remainingTerm = capitalGain;

    dealRes.summary.payments.wholeTerm = dealRes.summary.payments.fixedTerm + dealRes.summary.payments.remainingTerm;
    dealRes.summary.interests.wholeTerm = dealRes.summary.interests.fixedTerm + dealRes.summary.interests.remainingTerm;
    dealRes.summary.valuationFee.wholeTerm = dealRes.summary.valuationFee.fixedTerm + dealRes.summary.valuationFee.remainingTerm;
    dealRes.summary.bookingFee.wholeTerm = dealRes.summary.bookingFee.fixedTerm + dealRes.summary.bookingFee.remainingTerm;
    dealRes.summary.cost.wholeTerm = dealRes.summary.cost.fixedTerm + dealRes.summary.cost.remainingTerm;
    dealRes.summary.capitalGain.wholeTerm = deal.mortgageAmount;

    dealRes.chartDoughnut = dealService.setChartDoughnutData(dealRes);

    dealRes.chartLine = dealService.setChartLineData(chartLineData);

    console.log('dealRes',dealRes);
    return dealRes;
  };
  
  dealService.setChartDoughnutData = function(dealRes) {
    return {
      labels: ['Capital Gain','Interest','Fees'],
      data: [
        Math.round(dealRes.summary.capitalGain.fixedTerm * 100) / 100,
        Math.round(dealRes.summary.interests.fixedTerm * 100) / 100,
        Math.round((dealRes.summary.valuationFee.fixedTerm + dealRes.summary.bookingFee.fixedTerm) * 100) / 100
      ],
      colors: ['#00C6CA', '#e40b63', '#66dc66'],
      options: {
        elements: {
          arc: {
            borderWidth: 0
          }
        },
        legend: {
          display: true
        },
        tooltips: {
          callbacks: {
            label: function(tooltipItem, data) {
              var allData = data.datasets[tooltipItem.datasetIndex].data;
              var tooltipLabel = data.labels[tooltipItem.index];
              var tooltipData = allData[tooltipItem.index];
              var total = 0;
              for (var i in allData) {
                total += allData[i];
              }
              var tooltipPercentage = Math.round((tooltipData / total) * 100);
              return tooltipLabel + ': £' + $filter('number')(tooltipData, 2) + ' (' + tooltipPercentage + '%)';
            }
          }
        }
      }
    }
  };
  
  dealService.delete = function(deletedDeal){
    var modalInstance = $uibModal.open(
      {
        animation: true,
        //backdrop: 'static',
        templateUrl: 'views/app/modals/delete-modal.html',
        controller: 'DealDeleteModalCtrl',
        controllerAs: 'modal',
        //openedClass: 'show',
        //windowClass: 'show',
        //windowTopClass: 'show',
        backdropClass: 'show',
        resolve: {
          deal: function() {
            return deletedDeal;
          }
        }
      }
    );
  
    return modalInstance;
  };
  
  dealService.deleteInstance = function(vm, deletedDeal) {
    deletedDeal.deleted = true;
  
    $timeout(function(){
      vm.deals = vm.deals.filter(function(deal){
        return deletedDeal.id !== deal.id;
      });
    
      StorageService.setDeals(vm.deals);
      $rootScope.$broadcast('update-nav');
    
      if (vm.deals.length === 0) {
        StorageService.deleteDeals();
        $state.go('home');
      }
    
    },700);
  
    notify({message: "'" + deletedDeal.name + "'" + " removed from your saved deals", templateUrl: 'views/common/notify.html'} );
  };
  
  dealService.save = function(savedDeal){
    var deal = angular.copy(savedDeal);
    if (deal.id === 0)
      deal.id = StorageService.getMaxDealId();

    if (StorageService.getDeal(deal.id)){
      dealService.saveExisting(deal);
    }else{
      dealService.saveNew(deal);
    }
  };
  
  dealService.saveNew = function(deal) {
    var modalInstance = $uibModal.open(
      {
        animation: true,
        templateUrl: 'views/app/modals/save-modal.html',
        controller: 'DealSaveModalCtrl',
        controllerAs: 'modal',
        backdropClass: 'show'
     });
  
    modalInstance.result.then(function(response) {
      if (response.dealName){
      
        var deals = StorageService.getDeals();
        if (!deals)
          deals = [];
      
        deal.name = response.dealName;
        deals.push(deal);
      
        StorageService.setDeals(deals);
        StorageService.removeItem('newDeal');
        $rootScope.$broadcast('update-nav');
      
        notify({ message: "'" + deal.name + "'" + " added to your saved deals", templateUrl: 'views/common/notify.html'} );
        $state.go('manage');
      }
    });
  }
  
  dealService.saveExisting = function(deal) {
    var deals = StorageService.getDeals();
    
    for (var key in deals){
      if (deals[key].id === deal.id) {
        deals[key] = deal;
        break;
      }
    }
    StorageService.setDeals(deals);
    notify({ message: "'" + deal.name + "'" + " saved successfully", templateUrl: 'views/common/notify.html'} );
    $state.go('manage');
    
  }

  dealService.setChartLineData = function(chartLineData){
    return {
      labels: chartLineData.labels,
      series: ['Payments','Interests','Capital Gain'],
      data: [
        chartLineData.payments,
        chartLineData.interests,
        chartLineData.capitalGain
      ],
      colors: ['#ffd015', '#e40b63', '#00C6CA'],
      options: {
        elements: {
          line: {
            fill: false
          }
        }
      }
    };
  };
}

DealService.$inject = ['$rootScope', '$state', '$filter', '$timeout', '$uibModal','StorageService', 'notify', 'DEAL_CONFIG'];

angular
.module('mortgageCalculator')
.service('DealService', DealService);
