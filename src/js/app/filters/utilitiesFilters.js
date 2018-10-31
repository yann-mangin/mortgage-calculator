'use strict';

function sortArray() {
  return function sort(array, property) {
    var sortProperty;
    if (property)
      sortProperty = property;
    else
      sortProperty = "label";

    return array.sort(function alphanumericSort(a, b) {
      var val = 0;
      if (a[sortProperty] > b[sortProperty])
        val = 1;
      else if (b[sortProperty] > a[sortProperty])
        val = -1;
      return val;
    });
  }
}

function returnProperty(){
  return function returnPropertyFn(value,array,returnedProperty,evalProperty){
    var rProperty;
    var eProperty;
    var propValue = null;
    var i;

    if (!angular.isArray(array))
      return propValue;

    rProperty = returnedProperty || "label";
    eProperty = evalProperty || "id";

    for (i = 0; i < array.length; i = i + 1){
      if ((array[i][eProperty] === value) && (!angular.isUndefined(array[i][rProperty]))){
        propValue = array[i][rProperty];
        break;
      }
    }
    
    return propValue;
  }
}

function dotless() {
  return function replaceDots(input) {
    return input.replace(/\./g, ' ');
  };
}

function capitalize() {
  return function capitalizeString(input){
    return input.replace( /(^|\s)([a-z])/g , function calculate(m,p1,p2){ return p1+p2.toUpperCase(); } );
  };
}

function checkFileTypeValid() {
  return function getFileExtension(input, validFileTypes){
    var extension = input.substr(input.lastIndexOf('.') + 1).toLowerCase();
    return validFileTypes.indexOf(extension) !== -1;
  }
}

function priceReformat() {
  return function getPriceReformat(input){
    return input/100;
  }
}

function fileExtension() {
  return function getFileExtension(input){
    return input.substr(input.lastIndexOf('.') + 1).toLowerCase();
  }
}

function dunsNumber(DUNS_NUMBER_LENGTH) {
  return function checkDunsNumberFormat(input){
    var missingChars = (input && input.length !== DUNS_NUMBER_LENGTH) ? DUNS_NUMBER_LENGTH - input.length : false;
    return missingChars ? '0'.repeat(missingChars) + input : input;
  }
}

dunsNumber.$inject = ['DUNS_NUMBER_LENGTH'];

function highlightSearchTerm($sce) {
  return function(input, searchTerm) {
    if (!searchTerm)
      return $sce.trustAsHtml(input);
    
    return $sce.trustAsHtml(input.replace(new RegExp(searchTerm, 'gi'), '<span class="text-highlight">$&</span>'));
  };
}

highlightSearchTerm.$inject = ['$sce'];

function trustAsResourceUrl($sce){
  return function(val) {
    return $sce.trustAsResourceUrl(val);
  };
}

function formatDate() {
  return function getFormattedDate(date){
  
    if(!(date instanceof Date)) {
      return '';
    }
    
    var dd = date.getDate();
    var mm = date.getMonth()+1;
    var yyyy = date.getFullYear();
    if(dd < 10){
      dd = '0' + dd;
    }
    if(mm < 10){
      mm = '0' + mm;
    }
    return mm + '-' + dd + '-' + yyyy;
  }
}

trustAsResourceUrl.$inject = ['$sce'];

function dropdownOption($filter) {
  return function dropdownOptionFn(options, input, property, translate) {
    var filteredArray = [];
    var optionLabel;
    var optionLabelLowerCase;
    var inputLowerCase;

    if (angular.isUndefined(input) || input === null)
      return options;

    console.log('options',options);
    console.log('input',input);
    console.log('property',property);
    console.log('translate',translate);

    angular.forEach(options,function(option){
      optionLabel = (translate) ? $filter('translate')(option[property]) : option[property];
      optionLabelLowerCase = angular.copy(optionLabel.toLowerCase());
      inputLowerCase = input[property].toLowerCase();

      if (optionLabelLowerCase.indexOf(inputLowerCase) >= 0 )
        filteredArray.push(option);
    });
    return filteredArray;
  }
}

dropdownOption.$inject = ['$filter'];

angular
.module('mortgageCalculator')
.filter('sortArray', sortArray)
.filter('returnProperty', returnProperty)
.filter('dotless', dotless)
.filter('capitalize', capitalize)
.filter('checkFileTypeValid', checkFileTypeValid)
.filter('priceReformat', priceReformat)
.filter('fileExtension', fileExtension)
.filter('dunsNumber', dunsNumber)
.filter('highlightSearchTerm', highlightSearchTerm)
.filter('trustAsResourceUrl', trustAsResourceUrl)
.filter('formatDate', formatDate)
.filter('dropdownOption', dropdownOption);