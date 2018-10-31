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
    'TERM': 'term',
    'YEARS': ' (years)',
    'MONTHS': ' (months)',
    'FIXED_RATE': 'fixed rate',
    'FIXED_TERM': 'fixed term',
    'REMAINING_RATE': 'remaining rate',
    'VALUATION_FEE': 'valuation fee',
    'BOOKING_FEE': 'booking fee',
    'MONTHLY_EARLY_REPAYMENTS': 'monthly early repayments amount',
    
    'KPI': 'kpi',
    'CHARTS': 'charts',
    'MORTGAGE_SUMMARY': 'mortgage summary',
    'MORTGAGE_SUMMARY_SM': 'mortgage sum.',
    'INITIAL_TERM': 'initial term',
    'REMAINING_TERM': 'remaing term',
    'BREAKDOWNS': 'breakdowns',
    'WHOLE_TERM': 'whole term',
    'MONTHLY_PAYMENT': 'monthly payment',
    'MONTHLY_PAYMENT_SUB_INFO': 'Initial {{fixedTermTerm}} months at {{fixedTermRate}}%',
    'COST': 'cost',
    'COST_SUB_INFO': 'Including Interest and Fees',
    'TOTAL_PAID': 'total paid',
    'COST_PER_1_POUND': 'Cost per £1 borrowed',
    'TOTAL_AMOUNT_BORROWED': 'total amount borrowed',
    'PAYMENTS': 'payments',
    'INTERESTS': 'interests',
    'CAPITAL_GAIN': 'capital gain',
    'TERM_SUMMARY': 'term summary',
    'TERM_SUMMARY_SM': 'term sum.',
    'TERM_SUMMARY_INITIAL_MONTHS': 'Initial {{fixedTermTerm}} months',
    'TERM_SUMMARY_REMAINING_MONTHS': 'Remaining {{remainingTermTerm}} months',
    'RATE': 'rate',
    'MONTHLY_RATE': 'monthly rate',
    'NPER': 'nper',
    'MORTGAGE_BALANCE': 'mortgage balance',
    'MONTHLY_PAYMENTS': 'monthly payments',
    'MONTHS_SM': 'm.',
    'BALANCE': 'balance',
    'YEARLY_INTEREST': 'yearly interest',
    'MONTHLY_INTEREST': 'monthly interest',
    'MONTHLY_CAPITAL_GAIN': 'monthly capital gain',
    
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
