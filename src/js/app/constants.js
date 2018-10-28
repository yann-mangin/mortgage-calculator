angular
.module("mortgageCalculator")
.constant("DEAL_CONFIG", {
  newDeal: {
    id: 0,
    name: "New Deal",
    mortgageAmount: 83089,
    mortgageTermYears: 12,
    mortgageTermMonths: 0,
    initialTermTerm: 24,
    initialTermRate: 1.59,
    remainingTermRate: 3.74,
    valuationFee:0,
    bookingFee:0,
    earlyRepayments:0
  },
  lsNewDealName: 'newDeal'
});