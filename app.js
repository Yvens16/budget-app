var budgetController = (function() {
  
  var Expense = function (id, description, value){
    this.id= id;
    this.description = description;
    this.value = value;
  };

  Expense.prototype.calcPercentage = function(totalIncome){
    
    if (totalIncome > 0){
      this.percentage = Math.round((this.value / totalIncome) * 100);
    }else {
      this.percentage = -1;
    }   
  };

  Expense.prototype.getPercentage = function() {
    return this.percentage;
  };

  var Income = function(id, description, value){
    this.id = id;
    this.description = description;
    this.value = value;
  };

  var calculateTotal = function(type){
    var sum = 0;

    data.allItems[type].forEach(function(current) {
      sum += current.value;
    });
    data.totals[type] = sum;
  };

  var data = {
    allItems:{
      exp:[],
      inc: [],
    },

    totals: { 
      exp: 0,
      inc: 0
    },
    budget: 0,
    percentage: -1,
  };

  //Here return the public data 
  return{
    addItem: function(type, des, val){
      var newItem, ID;

      //Create new ID
      if (data.allItems[type].length > 0){
        ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
      } else {
        ID = 0;
      }

      //Create new item based on 'inc' or 'exp' type
            if(type === 'exp'){
        newItem = new Expense(ID, des, val);
      }else if (type === 'inc'){
        newItem = new Income(ID, des, val);
      }
      //Push it into our data structure
      data.allItems[type].push(newItem);

      //Return the new element
      return newItem;
    },

    deleteItem: function(type, id){
      var ids, index;
      
      ids = data.allItems[type].map(function(current) {
        return current.id;
      });

      index = ids.indexOf(id);

      if(index !== -1){
        data.allItems[type].splice(index, 1);
      }
    },


    calculateBudget: function() {

      //calculate total income and expense 
      calculateTotal('exp');
      calculateTotal('inc');
      //calculate the budget: income - expense 
      data.budget = data.totals.inc - data.totals.exp;

      if (data.totals.inc > 0){
        //calculate the percentage of income that we spent 
        data.percentage = Math.round( (data.totals.exp / data.totals.inc) * 100 );
      } else {
        data.percentage = -1 // -1 means it is non-existant
      }

    },

    calculatePercentage: function() {
      data.allItems.exp.forEach(function(curr) {
        curr.calcPercentage(data.totals.inc);
      })
    },

    getPercentages: function() {
      var allPerc = data.allItems.exp.map(function(curr){
        return curr.getPercentage();
      })
      return allPerc;
    },

    getBudget: function(){
      return{
        budget: data.budget,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
        percentagte: data.percentage
      }
    },
    
    testing: function(){
      console.log(data);
    },
  }
} )();














var UIController = (function(){

  var DOMstrings = {
    inputType: '.add__type',
    inputDescription:'.add__description',
    inputValue: '.add__value',
    inputBtn: '.add__btn',
    incomeContainer: '.income__list',
    expensesContainer: '.expenses__list',
    budgetLabel: '.budget__value',
    incomeLabel:'.budget__income--value',
    expensesLabel:'.budget__expenses--value',
    percentageLabel: '.budget__expenses--percentage',
    container: '.container',
    expensesPercLabel: '.item__percentage',
    dateLabel: '.budget__title--month',

  };

  var formatNumber = function(num, type){
    var numSplit, int, dec;

    num = Math.abs(num);
    num = num.toFixed(2);

    numSplit = num.split('.');

    int = numSplit[0];
    if(int.length > 3){
     int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3); //substr return a part of a string 1st param is the index at which it start and the 2nd one is how many numbers you wanna keep example: input 23450 ---> output 2,3450
    }

    dec = numSplit[1];
    return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;
  };

  var nodeListForEach = function(list, callback) {
    for(var i = 0; i < list.length; i++){
      callback(list[i], i);
    }
  };

  return {//this "return" what's in the UIController to the public 

    getInput: function(){
      return { //this "return the 3 properties as an object an object"
        type: document.querySelector(DOMstrings.inputType).value, //Will be either inc or exp
        description: document.querySelector(DOMstrings.inputDescription).value,
        value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
      };
    },

    addListItem: function(obj, type){
      var html, newHtml, element;
      //Create HTML with placeholder text
      if (type === 'inc'){

        element = DOMstrings.incomeContainer;

        html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div>';
      } else if (type === 'exp'){ 

        element = DOMstrings.expensesContainer;

        html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      }

      //Replace the placeholder text with some actual data
      newHtml = html.replace('%id%', obj.id);
      newHtml = newHtml.replace('%description%', obj.description);
      newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));

      //Insert the HTML into the DOM
      document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
    },

    deleteListItem: function(selectorID){
      var el =  document.getElementById(selectorID);
      el.parentNode.removeChild(el);
    },

    clearFields: function(){
      var fields;

      fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);
      fieldsArr = Array.prototype.slice.call(fields);

      fieldsArr.forEach(function(current, index, array) {
        current.value= "";
      })
      fieldsArr[0].focus();
    },

    dislpayBudget: function(obj) {
      var type;
      obj.budget > 0 ? type = 'inc' : type = 'exp';

      document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);
      document.querySelector(DOMstrings.incomeLabel).textContent =formatNumber (obj.totalInc, 'inc');
      document.querySelector(DOMstrings.expensesLabel).textContent = formatNumber( obj.totalExp, 'exp');

      if(obj.percentagte > 0){
        document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage;
      } else {
        document.querySelector(DOMstrings.percentageLabel).textContent = '---';
      }
    },

    displayPercentages: function(percentages){

      var fields = document.querySelectorAll(DOMstrings.expensesPercLabel);

      nodeListForEach(fields, function(current, index){
        if(percentages[index] > 0){
          current.textContent =  percentages[index] + '%';
        } else {
          current.textContent = '---';
        }

      })
    },

    displayMonth: function(){
      var now, months, month, year;

      now = new Date();

      months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

      month = now.getMonth();
      console.log('month', month);

      year= now.getFullYear();

      document.querySelector(DOMstrings.dateLabel).textContent = months[month] + ' ' + year;
    },

    changedType: function(){
      var fields = document.querySelectorAll(
        DOMstrings.inputType + ',' +
        DOMstrings.inputDescription + ',' +
        DOMstrings.inputValue);

        nodeListForEach(fields, function(cur){
          cur.classList.toggle('red-focus');
        })

        document.querySelector(DOMstrings.inputBtn).classList.toggle('red');
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

  document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);

  document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changedType)
  };


  var updateBudget = function() {
     //1. Calculate the budget 
     budgetCtrl.calculateBudget();

    //2. return the budget
    var budget = budgetCtrl.getBudget();

    //3. Display the budget to the UI
    UICtrl.dislpayBudget(budget);
  };

  var updatePercentages = function(){
    //1. Calculate percentages
    budgetCtrl.calculatePercentage();

    //2. Read percentages from the budget controller
    var percentages = budgetCtrl.getPercentages();

    //3. Update the UI with the new percentages
    UICtrl.displayPercentages(percentages);
  };

  var ctrlAddItem = function(){
    var input, newItem;

    //1. Get the filed input data 
     input = UICtrl.getInput(); //Here we get the object containing the 3 input value of the User from the UIController 
    console.log(input);

    if (input.description !== "" && !isNaN(input.value) && input.value > 0 ){
    //2. Add the item to the budget controller
     newItem = budgetCtrl.addItem(input.type, input.description, input.value);

    //3. Add the item to the UI
    UICtrl.addListItem(newItem, input.type);

    //4 clear the fields
    UICtrl.clearFields();
    }

    //5. Calculate and update the budget
   updateBudget();

   //6. Calculate and update percentages
   updatePercentages();

  };

  var ctrlDeleteItem = function(event) {
    var itemID, splitID, type, ID;

    itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

    if(itemID){

     //inc-1 the split method will create an array with each element separated by the dash 
     splitID = itemID.split('-');
     type = splitID[0];
     ID = parseInt(splitID[1]);

     //1. Delete the item from the data sturcture
      budgetCtrl.deleteItem(type, ID);
     //2. Delete the item from UI
     UICtrl.deleteListItem(itemID);

     //Update and show the new budget
     updateBudget();

    }
  };

  return {
    init: function(){
      console.log('Application has started.');
      UICtrl.displayMonth();
      UICtrl.dislpayBudget({
        budget: 0,
        totalInc: 0,
        totalExp: 0,
        percentage: -1
      });
      setupEventListeners();
    }
  }

  
})(budgetController, UIController);

//We have to call it here since it is not in the IIFE anymore and it is a function not a method that needs to run at the start of the application.
controller.init();
