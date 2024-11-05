const CURRENCY = 'руб.';
const STATUS_IN_LIMIT = 'все хорошо';
const STATUS_OUT_OF_LIMIT = 'все плохо';
const STATUS_OUT_OF_LIMIT_CLASSNAME = 'status_red';
const STORAGE_LABEL_LIMIT = 'limit';
const STORAGE_LABEL_EXPENSES = 'expenses';
const STORAGE_LABEL_STATUS = 'status';

const inputNode = document.querySelector('.js-input');
const buttonNode = document .querySelector('.js-add-button');
const historyNode = document.querySelector('.js-history');
const sumNode = document.querySelector('.js-sum');
const limitNode = document.querySelector('.js-limit');
const statusNode = document.querySelector('.js-status');
const resetButton = document.querySelector('.js-reset-btn');
const categorySelect = document.querySelector('.js-categorySelect');
const changeLimitButton = document.querySelector('.js-changeLimitButton')

let limit = 10000;
let expenses = [];


function initLimit() {
    const limitFromStorage = parseInt(localStorage.getItem(STORAGE_LABEL_LIMIT))
    if (!limitFromStorage) {
        return;
    }
    limit = limitFromStorage;
    limitNode.innerText = limit;
}

initLimit();

function initExpenses() {
    const expensesFromStorage = localStorage.getItem(STORAGE_LABEL_EXPENSES);
    const expensesFromUser = JSON.parse(expensesFromStorage);
    if (Array.isArray(expensesFromUser)) {
        expenses = expensesFromUser;
    }
}



initExpenses();
render(expenses);
renderStatus(calculateExpenses(expenses))

init(expenses);

buttonNode.addEventListener('click', function() {
   const expense = getExpensesFromUser();
   const currentCategory = getCategoryFromUser();

   if (currentCategory === 'Категория'){
    alert ('Выберите категорию')
        return;
   }
    
   if (!expense) {
        return;
   }

   const newExpenses = {amount: expense, category: currentCategory}
   console.log(newExpenses)

   trackExpenses(newExpenses);
   saveExpensesToStorage();

   render(expenses);

   clearInput(inputNode);
})

resetButton.addEventListener('click', function() {
    expenses = [];
    render(expenses);
})

changeLimitButton.addEventListener('click', function() {
    const newLimit = prompt('Новый лимит');

    const newLimitValue = parseInt(newLimit);

    if(!newLimitValue) {
        return;
    }

    limitNode.innerText = newLimitValue;
    limit = newLimitValue;
    localStorage.setItem(STORAGE_LABEL_LIMIT, newLimitValue)

    render(expenses);
})

function init(expenses) {
    initStatus();
    limitNode.innerText = limit;
    sumNode.innerText = calculateExpenses(expenses);
}

function trackExpenses(expense) {
    expenses.push(expense);
}

function getExpensesFromUser() {
    if(!inputNode.value) {
        return null;
    }

    const expense = parseInt(inputNode.value);

    return expense;
}

function getCategoryFromUser() {
    const category = categorySelect.value;

    return category;
}

function clearInput(input) {
    input.value = '';
}

function saveExpensesToStorage() {
    const expensesString = JSON.stringify(expenses);
    localStorage.setItem(STORAGE_LABEL_EXPENSES, expensesString);
}

function calculateExpenses(expenses) {
    let sum = 0;

    expenses.forEach(element => {
        sum += element.amount;
    });

    return sum;
}


function render(expenses) {
    const sum = calculateExpenses(expenses);

    renderHistory();
    renderSum(sum);
    renderStatus(sum);
}

function renderHistory() {
    let expensesHTML = '';
    
    expenses.forEach(element => {
        const elementHtml = `<li class="history-item">${element.category} - ${element.amount}${CURRENCY}</li>`;
        expensesHTML += elementHtml;
    });
    
    historyNode.innerHTML = `<ol class="history-items">${expensesHTML}</ol>`;
}

function renderSum(sum) {
    sumNode.innerText = sum;
}

function renderStatus(sum) {
    if (sum <= limit) {
        statusNode.innerText = STATUS_IN_LIMIT;
        statusNode.classList.remove(STATUS_OUT_OF_LIMIT_CLASSNAME);
        localStorage.setItem(STORAGE_LABEL_STATUS, STATUS_IN_LIMIT);
    } else {
        statusNode.innerText = `${STATUS_OUT_OF_LIMIT} (${limit - sum} руб.)`;
        statusNode.classList.add(STATUS_OUT_OF_LIMIT_CLASSNAME);
        localStorage.setItem(STORAGE_LABEL_STATUS, STATUS_OUT_OF_LIMIT);
    }
}

function initStatus() {
    const savedStatus = localStorage.getItem(STORAGE_LABEL_STATUS);
    if (savedStatus === STATUS_OUT_OF_LIMIT) {
        statusNode.innerText = `${STATUS_OUT_OF_LIMIT} (${limit - calculateExpenses(expenses)} руб.)`;
        statusNode.classList.add(STATUS_OUT_OF_LIMIT_CLASSNAME);
    } else {
        statusNode.innerText = STATUS_IN_LIMIT;
        statusNode.classList.remove(STATUS_OUT_OF_LIMIT_CLASSNAME);
    }
}

