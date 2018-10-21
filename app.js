var budgetController = (function() {
  
} )();


var UIController = (function(){

  var DOMstrings = {
    inputType: '.add__type',
    inputDescription:'.add__description',
    inputValue: '.add__value',
    inputBtn: '.add__btn',

  };

  return {//this "return" return the what's in the UIController to the public 

    getInput: function(){
      return { //this "return the 3 properties as an object an object"
        type: document.querySelector(DOMstrings.inputType).value, //Will be either inc or exp
        description: document.querySelector(DOMstrings.inputDescription).value,
        value: document.querySelector(DOMstrings.inputValue).value
      };

    },

    getDOMstrings: function(){
      return DOMstrings;
    }

  };

})();

var controller = (function(budgetCtrl, UICtrl){

  var setupEventListeners = function(){
    var DOM = UICtrl.getDOMstrings();

    //don't need to add the parenthesis (call operator) to the ctrlAddItem because as a callback function the addEventListener will call it for us 
    document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
  
    document.addEventListener('keypress', function(event){
      if(event.keyCode === 13 || event.which === 13){
        ctrlAddItem();
      }
  });
  };



  var ctrlAddItem = function(){
    //1. Get the filed input data 
    var input = UICtrl.getInput(); //Here we get the object containing the 3 input value of the User from the UIController 
    console.log(input);


    //2. Add the item to the budget controller

    //3. Add the item to the Ui

    //4. Calculate thue budget 

    //5. Display the budget on the UI

  };

  return {
    init: function(){
      console.log('Application has started.');
      setupEventListeners();
    }
  }

  
})(budgetController, UIController);

//We have to call it here since it is not in the IIFE anymore and it is a function not a method that needs to run at the start of the application.
controller.init();