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

let totalBudget = 0.0;
let totalExpense = 0.0;
let totalBalance = 0.0;

$('document').ready(function () {

   renderTransacciones();
 
})


function renderTransacciones()
{
   $.getJSON( API_URL+'getTransactions', function( data ) {

      const tpl = data.map(transaction => {
         if (transaction.id) { 
            let ul = document.createElement("ul");
            ul.innerHTML = `
               <li>${transaction.type}</li>
               <li>${transaction.date}</li>
               <li>${transaction.name}</li>
               <li>${transaction.amt}</li>
               <li>
                  <button class="btn-edit">
                  <i class="fas fa-edit"></i>
                  </button>
                  <button class="btn-trash" onclick="deleteItem(${transaction.id})">
                  <i class="fas fa-trash-alt"></i>
                  </button>
               </li>
               `;
            
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

            } else { console.log("Error") }
      });
    });

    console.log('totalBudget: '+totalBudget);
    console.log('totalExpense: '+totalExpense);
    console.log('totalBalance: '+totalBalance);

}


   
   function updateExpAmt(amt) {
      state.amount.balanceAmt = state.amount.balanceAmt-amt;
      state.amount.expenseAmt = state.amount.expenseAmt+amt;
     
      
   }

   function updateBudAmt(amt) {
      state.amount.balanceAmt = state.amount.balanceAmt+amt;
      state.amount.budgetAmt = state.amount.budgetAmt+amt;

      
      
   }

   function updateBudget(e) {

      e.preventDefault();
      if (!budgetNameField.value) {
         warningBudget.classList.remove("d-none");
         setTimeout(() => {
            warningBudget.classList.add("d-none");
         }, 1500);
      } else {
         //updating state
         state.list.push({
            id: randomNum(),
            type: "Ingreso",
            date: budgetDateField.value,
            name: budgetNameField.value,
            amt: parseInt(budgetValueField.value) || 0
         });

         updateBudAmt(parseInt(budgetValueField.value));

         //resetting entry fields
         budgetDateField.value = "";
         budgetNameField.value = "";
         budgetValueField.value = "";

         //render updated amount and expenses
         renderAmounts();
         renderList();

      }

      const json = JSON.stringify(state.list[state.list.length - 1]);
      fetch(API_URL, {
         method: "POST",
         headers: {"Content-Type": "application/json"},
         body: json,
      })
  
   }


   function updateExpenses(e) {

      e.preventDefault();
      if (!expenseNameField.value) {
         warningExpense.classList.remove("d-none");
         setTimeout(() => {
            warningExpense.classList.add("d-none");
         }, 1500);
      } else {
         //updating state
         state.list.push({
            id: randomNum(),
            type: "Egreso",
            date: expenseDateField.value,
            name: expenseNameField.value,
            amt: parseInt(expenseValueField.value) || 0
         });

         updateExpAmt(parseInt(expenseValueField.value));

         //resetting entry fields
         expenseDateField.value = "";
         expenseNameField.value = "";
         expenseValueField.value = "";

         //render updated amount and expenses
         renderAmounts();
         renderList();

      }

      const json = JSON.stringify(state.list[state.list.length - 1]);
      fetch(API_URL, {
         method: "POST",
         headers: {"Content-Type": "application/json"},
         body: json,
      })
   }

   addExpBtn.addEventListener("click", updateExpenses);
   calculateBtn.addEventListener("click", updateBudget);

   //edit and delete button functionality

     function deleteItem(id) {
     
      fetch(API_URL+'/'+id, {
         method: "DELETE",
         headers: {"Content-Type": "application/json"},
         
      })
  
   } 

    /* function editItem(id) {
      let newList = state.list.filter(obj => obj.id !== id);
      let item = state.list.filter(obj => obj.id == id)[0];

      expenseDateField.value = item.date;
      expenseNameField.value = item.name;
      expenseValueField.value = item.amt;

      state.list = newList;
      updateBudAmt();
      updateExpAmt();
      renderAmounts();
      renderExpenses();
      renderBudget();
   }   */

   //function render

   function renderList () {
        while (expenseList.childNodes.length > 10) {
         expenseList.removeChild(expenseList.childNodes(1));
      } ;  

      state.list.forEach (obj => {
         if (obj.type === obj.type) { 
            let ul = document.createElement("ul");
            let li = document.createElement("li");
            ul.innerHTML = `
               <li>${obj.type}</li>
               <li>${obj.date}</li>
               <li>${obj.name}</li>
               <li>${obj.amt}</li>
               <li>
                  <button class="btn-edit">
                  <i class="fas fa-edit"></i>
                  </button>
                  <button class="btn-trash" id=${obj.id} onclick="greetings()">
                  <i class="fas fa-trash-alt"></i>
                  </button>
               </li>
               `;

            ul.querySelector(".btn-trash").onclick = () => deleteItem(obj.id);
            ul.querySelector(".btn-edit").onclick = () => editItem(obj.id);
            expenseList.appendChild(ul);
            } else { console.log("Error") }
      })

   }
   

   function renderAmounts() {
      budget.childNodes[1].nodeValue = state.amount.budgetAmt;
      expense.childNodes[1].nodeValue = state.amount.expenseAmt;
      state.amount.balanceAmt =
         state.amount.budgetAmt - state.amount.expenseAmt;
      balance.childNodes[1].nodeValue = state.amount.balanceAmt;

   }

   
   renderList();
   renderAmounts();
   console.log(state.list)

   //--------utility function------------------------------------------------
   function randomNum() {
      return Math.random() * 1000;
   }




