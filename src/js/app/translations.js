'use strict';

/**
 * Mortgage Calculator
 * @param $translateProvider
 */
function translationConfig($translateProvider) {
  $translateProvider
  .translations('en-gb', {
    'MORTGAGE_CALCULATOR': 'morgage calculator',
    'HOME_WELCOME_MESSAGE': 'What do you want to do?',
    'START_NEW_DEAL': 'start new deal',
    'MANAGE_DEALS': 'manage deals',
    'COMPARE_DEALS': 'compare deals',
    'COPYRIGHT': ' 2018 Yann Mangin',
    
    'MORTGAGE_AMOUNT': 'mortgage amount',
    'TERM_YEARS': 'term (years)',
    'TERM_MONTHS': 'term (months)',
    'FIXED_RATE': 'fixed rate',
    'FIXED_TERM': 'fixed term (months)',
    'REMAINING_RATE': 'remaining rate',
    'VALUATION_FEE': 'valuation fee',
    'BOOKING_FEE': 'bookingfee',
    'MONTHLY_EARLY_REPAYMENTS': 'monthly early repayments amount',
    
    'SAVE_DEAL': 'save deal',
    'DEALS_NAME_LABEL': 'Deal\'s name',
    'DEALS_NAME_PLACEHOLDER': 'ex: Deal 1',
    
    'DELETE_DEAL': 'delete deal',
    'DELETE_MODAL_SENTENCE': 'Are you sure you wish to delete the following deal?',
    
    'CALCULATE': 'calculate',
    'COMPARE': 'compare',
    'SAVE': 'save',
    'DELETE': 'delete',
    'EDIT': 'edit',
    'CANCEL': 'cancel',
    
    'ERROR_DEAL_DOES_NOT_EXIST': 'The deal requested does not exist.',
  })
  .translations('en-us', {})
  .translations('fr', {})
  .preferredLanguage('en-us')
  .fallbackLanguage('en-gb')
  .useSanitizeValueStrategy('escape');
}

translationConfig.$inject = ['$translateProvider'];

angular
.module('mortgageCalculator')
.config(translationConfig);
