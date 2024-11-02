const LIMIT = 10000;
const CURRENCY = 'руб.';
const STATUS_IN_LIMIT = 'все хорошо';
const STATUS_OUT_OF_LIMIT = 'все плохо';
const STATUS_OUT_OF_LIMIT_CLASSNAME = 'status_red';

const inputNode = document.querySelector('.js-input');
const buttonNode = document .querySelector('.js-add-button');
const historyNode = document.querySelector('.js-history');
const sumNode = document.querySelector('.js-sum');
const limitNode = document.querySelector('.js-limit');
const statusNode = document.querySelector('.js-status')

const expenses = [];

init(expenses);

buttonNode.addEventListener('click', function() {
   const expense = getExpensesFromUser();
    
   if (!expense) {
        return;
   }

   trackExpenses(expense);

   render(expenses);

})

function init(expenses) {
    limitNode.innerText = LIMIT;
    statusNode.innerText = STATUS_IN_LIMIT;
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

    clearInput();

    return expense;
}

function clearInput() {
    inputNode.value = '';
}

function calculateExpenses(expenses) {
    let sum = 0;

    expenses.forEach(element => {
        sum += element;
    });

    return sum;
}


function render(expenses) {
    const sum = calculateExpenses(expenses);

    renderHistory(expenses);
    renderSum(sum);
    renderStatus(sum);
}

function renderHistory(expenses) {
    let expensesHTML = '';
    
    expenses.forEach(element => {
        const elementHtml = `<li class="history-item">${element}${CURRENCY}</li>`;
        expensesHTML += elementHtml;
    });
    
    historyNode.innerHTML = `<ol class="history-items">${expensesHTML}</ol>`;
}

function renderSum(sum) {
    sumNode.innerText = sum;
}

function renderStatus(sum) {
    if (sum <= LIMIT) {
        statusNode.innerText = STATUS_IN_LIMIT;
    } else {
        statusNode.innerText = STATUS_OUT_OF_LIMIT;
        statusNode.classList.add(STATUS_OUT_OF_LIMIT_CLASSNAME)
    }
}