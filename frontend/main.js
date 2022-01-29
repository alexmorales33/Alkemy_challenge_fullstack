const API_URL = 'http://localhost:3500/';


let balance = document.querySelector("#balance");
let expense = document.querySelector("#expense");
let budget = document.querySelector("#budget");
let warningBudget = document.querySelector(".warning-budget");
let warningExpense = document.querySelector(".warning-expense");
let budgetNameField = document.querySelector("#budget-name-field");
let budgetValueField = document.querySelector("#budget-value-field");
let budgetDateField = document.querySelector("#budget-date-field")
let expenseNameField = document.querySelector("#expense-name-field");
let expenseValueField = document.querySelector("#expense-value-field");
let expenseDateField = document.querySelector("#expense-date-field")
let calculateBtn = document.querySelector("#calculate-btn");
let addExpBtn = document.querySelector("#add-expense-btn");
let expenseList = document.querySelector(".expenses");

var totalBudget;
var totalExpense;
var totalBalance;

$('document').ready(function () {

   renderTransacciones();

   $("#add-expense-btn").submit(function(e){
      e.preventDefault();
    });
    $("#add-budget-btn").submit(function(e){
      e.preventDefault();
    });

})


function renderTransacciones()
{  
   $('.expenses-item').each(function () {
      $(this).remove();
   });
   totalBudget = 0.0;
   totalExpense = 0.0;
   totalBalance = 0.0;
   $.getJSON( API_URL+'getTransactions', function( data ) {

      const tpl = data.map(transaction => {
         if (transaction.id) { 
            let ul = document.createElement("ul");
            ul.innerHTML = `
               <li>${transaction.type}</li>
               <li>${dateToStr(transaction.date)}</li>
               <li>${transaction.name}</li>
               <li>${toDec(transaction.amt)}</li>
               <li>
                  <button class="btn-edit" onclick="editItem(${transaction.id})">
                  <i class="fas fa-edit"></i>
                  </button>
                  <button class="btn-trash" onclick="deleteItem(${transaction.id})">
                  <i class="fas fa-trash-alt"></i>
                  </button>
               </li>
               `;
            ul.className = 'expenses-item';
            if (transaction.type == 'Ingreso')
            {
               totalBudget += transaction.amt;
               totalBalance += transaction.amt;
            }       
            else if (transaction.type == 'Egreso')
            {
               totalExpense += transaction.amt;
               totalBalance -= transaction.amt;
            }

               
            expenseList.appendChild(ul);
            $('#expenseList li:gt(2)').remove();

         } else { console.log("Error") }
      });

      $('#budget').html('$'+toDec(totalBudget));
      $('#expense').html('$'+toDec(totalExpense));
      $('#balance').html('$'+toDec(totalBalance));
    });

}

   
function deleteItem(id) {
   $.ajax({
      url: API_URL+id,
      type: 'DELETE',
      success: function(result) {
         renderTransacciones();
      }
   });
} 

function editItem(id)
{
   $.getJSON( API_URL+id, function( data ) {
      console.log(data);
      
      if (data.type == 'Ingreso')
      {
         $('#budget-id').val(data.id);
         $('#budget-date-field').val(dateToStr(data.date));
         $('#budget-name-field').val(data.name);
         $('#budget-value-field').val(toDec(data.amt));
      }
      else if (data.type == 'Egreso')
      {
         $('#expense-id').val(data.id);
         $('#expense-date-field').val(dateToStr(data.date));
         $('#expense-name-field').val(data.name);
         $('#expense-value-field').val(toDec(data.amt));
      } else {
         console.log('error')
      }
   });
}

function saveBudget () {
   id = $('#budget-id').val();

   var data = {}; 
   data.date = strToDate($('#budget-date-field').val());
   data.name = $('#budget-name-field').val();
   data.amt  = $('#budget-value-field').val();
   data.type = 'Ingreso';
           
   var strType = (id ? 'PUT' : 'POST');
   $.ajax({
      type: strType,
      url: API_URL+id,
      contentType: 'application/json',
      data: JSON.stringify(data),
      success: function(data) {
         resetForm();
         renderTransacciones();
      }
   }); 
}

function saveExpense() {
   id = $('#expense-id').val();

   var data = {}; 
   data.date = strToDate($('#expense-date-field').val());
   data.name = $('#expense-name-field').val();
   data.amt  = $('#expense-value-field').val();
   data.type = 'Egreso';
              
   var strType = (id ? 'PUT' : 'POST');
   $.ajax({
      type: strType,
      url: API_URL+id,
      contentType: 'application/json',
      data: JSON.stringify(data),
      success: function(data) {
         resetForm();
         renderTransacciones();
      }
   }); 
}

function resetForm()
{
   $('#expense-id').val('');
   $('#expense-date-field').val('');
   $('#expense-name-field').val('');
   $('#expense-value-field').val('');

   $('#budget-id').val('');
   $('#budget-date-field').val('');
   $('#budget-name-field').val('');
   $('#budget-value-field').val('');
}



function dateToStr(str){
   str = str.substring(0, 10);
   return str.replace(/^(\d{4})-(\d{2})-(\d{2})$/g,'$3/$2/$1');
}

function strToDate(str){
   return str.replace(/^(\d{2})\/(\d{2})\/(\d{4})$/g,'$3/$2/$1');
}

function toDec(num)
{
    return format_number(num,2);
}

function format_number(x,n)
{
    x = parseFloat(x);
    return x.toFixed(n);
}


