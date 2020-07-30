// BUDGET CONTROLLER
var budgetController = (function () {
	//Some code
	var Expense = function (id, description, value) {
		this.id = id;
		this.description = description;
		this.value = value;
	};

	var Income = function (id, description, value) {
		this.id = id;
		this.description = description;
		this.value = value;
	};

	var calculateTotal = function (type) {
		var sum = 0;
		data.allItem[type].forEach(function (current) {
			sum += current.value;
		});
		data.totals[type] = sum;
	};

	var data = {
		allItem: {
			inc: [],
			exp: [],
		},
		totals: {
			exp: 0,
			inc: 0,
		},
		budget: 0,
		percentage: -1,
	};

	return {
		addItem: function (type, des, val) {
			var newItem, ID;

			//Create new ID
			if (data.allItem[type].length > 0) {
				ID = data.allItem[type][data.allItem[type].length - 1].id + 1;
			} else {
				ID = 0;
			}

			if (type === 'exp') {
				newItem = new Expense(ID, des, val);
			} else if (type === 'inc') {
				newItem = new Income(ID, des, val);
			}

			//Push it into our data structure
			data.allItem[type].push(newItem);

			return newItem;
		},

		calculateBudget: function () {
			// Total income and expenses
			calculateTotal('exp');
			calculateTotal('inc');

			// Income - Expense
			data.budget = data.totals.inc - data.totals.exp;

			// Percentage of income that spent
			if (data.totals.inc > 0) {
				data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
			} else {
				data.percentage = -1;
			}
		},

		getBudget: function () {
			return {
				budget: data.budget,
				totalInc: data.totals.inc,
				totalExp: data.totals.exp,
				percentage: data.percentage,
			};
		},

		testing: function () {
			console.log(data);
		},
	};
})();

// UI CONTROLLER
var UIController = (function () {
	// DOM String
	var DOMStrings = {
		inputType: '.add__type',
		inputDescription: '.add__description',
		inputValue: '.add__value',
		inputBtn: '.add__btn',
		incomeContainer: '.income__list',
		expensesContainer: '.expenses__list',
		budgetLabel: '.budget__value',
		incomeLabel: '.budget__income--value',
		expenseLabel: '.budget__expenses--value',
		expensePercentageLabel: '.budget__expenses--percentage',
	};

	// Some code
	return {
		getInput: function () {
			return {
				type: document.querySelector(DOMStrings.inputType).value, // Will be either inc or exp
				description: document.querySelector(DOMStrings.inputDescription).value,
				value: parseFloat(document.querySelector(DOMStrings.inputValue).value),
			};
		},

		addListItem: (obj, type) => {
			var html, newHMTL, element;

			// Create HTML string with placeholder text
			if (type === 'exp') {
				element = DOMStrings.expensesContainer;
				html =
					'<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">- %value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
			} else if (type === 'inc') {
				element = DOMStrings.incomeContainer;
				html =
					'<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">+ %value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
			}
			// Replace the placeholde text with some actual code
			newHMTL = html.replace('%id%', obj.id);
			newHMTL = newHMTL.replace('%description%', obj.description);
			newHMTL = newHMTL.replace('%value%', obj.value);
			// Insert HTML string into DOM
			document.querySelector(element).insertAdjacentHTML('beforeend', newHMTL);
		},

		clearField: () => {
			var field, fieldArray;
			field = document.querySelectorAll(DOMStrings.inputDescription + ', ' + DOMStrings.inputValue);
			fieldArray = Array.prototype.slice.call(field);
			fieldArray.forEach(function (current, index, array) {
				current.value = '';
			});
		},

		displayBudget: function (data) {
			document.querySelector(DOMStrings.budgetLabel).textContent =
				(data.budget > 0 ? '+ ' : '') + data.budget + 'đ';
			document.querySelector(DOMStrings.incomeLabel).textContent = data.totalInc;
			document.querySelector(DOMStrings.expenseLabel).textContent = data.totalExp;
			if (data.percentage !== -1) {
				document.querySelector(DOMStrings.expensePercentageLabel).textContent = data.percentage + '%';
			} else {
				document.querySelector(DOMStrings.expensePercentageLabel).textContent = '---';
			}
		},

		getDOMStrings: function () {
			return DOMStrings;
		},
	};
})();

// GLOBAL CONTROLLER
var controller = (function (budgetCtrl, UICtrl) {
	var setupEventListener = function () {
		var DOM = UICtrl.getDOMStrings();

		document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

		document.addEventListener('keypress', function (event) {
			if (event.keyCode === 13 || event.which === 13) {
				ctrlAddItem();
			}
		});
	};

	var updateBudget = function () {
		// Calculate the budget
		budgetCtrl.calculateBudget();
		// Return the budget
		var budget = budgetCtrl.getBudget();
		// Display budget
		UICtrl.displayBudget(budget);
		//console.log(budget);
	};

	var ctrlAddItem = function () {
		var input, newItem;

		// 1. Get the field input data
		input = UIController.getInput();

		if (input.description !== '' && !isNaN(input.value) && input.value > 0) {
			// 2. Add the item to the budget controller
			newItem = budgetCtrl.addItem(input.type, input.description, input.value);

			// 3. Add item to the UI
			UICtrl.addListItem(newItem, input.type);

			// Clear field
			UICtrl.clearField();

			// 4. Calculate the budget
			updateBudget();

			// 5. Display the budget on the UI
		}
	};

	return {
		init: function () {
			console.log('APplication has started.');
			UICtrl.displayBudget({
				budget: 0,
				totalInc: 0,
				totalExp: 0,
				percentage: -1,
			});
			setupEventListener();
		},
	};
})(budgetController, UIController);

controller.init();
