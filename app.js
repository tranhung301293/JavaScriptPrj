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

	var data = {
		allItem: {
			inc: [],
			exp: [],
		},
		totals: {
			exp: 0,
			inc: 0,
		},
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
	};

	// Some code
	return {
		getInput: function () {
			return {
				type: document.querySelector(DOMStrings.inputType).value, // Will be either inc or exp
				description: document.querySelector(DOMStrings.inputDescription).value,
				value: document.querySelector(DOMStrings.inputValue).value,
			};
		},

		addListItem: (obj, type) => {
			var html, newHMTL, element;

			// Create HTML string with placeholder text
			if (type === 'inc') {
				element = DOMStrings.incomeContainer;
				html =
					'<div class="item clearfix" id="income-0"> <div class="item__description">Salary</div> <div class="right clearfix"> <div class="item__value">+ 2,100.00</div> <div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
			} else if (type === 'exp') {
				element = DOMStrings.expensesContainer;
				html =
					'<div class="item clearfix" id="expense-0"><div class="item__description">Apartment rent</div><div class="right clearfix"> <div class="item__value">- 900.00</div><div class="item__percentage">21%</div> <div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div> </div></div>';
			}
			// Replace the placeholde text with some actual code
			newHMTL = html.replace('%id%', obj.id);
			newHMTL = html.replace('%description%', obj.description);
			newHMTL = html.replace('%value%', obj.value);
			// Insert HTML string into DOM
			document.querySelector(element).insertAdjacentHTML('beforeend', newHMTL);
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

	var ctrlAddItem = function () {
		var input, newItem;

		// 1. Get the field input data
		input = UIController.getInput();

		// 2. Add the item to the budget controller
		newItem = budgetCtrl.addItem(input.type, input.description, input.value);

		// 3. Add item to the UI

		UICtrl.addListItem(newItem, input.type);

		// 4. Calculate the budget

		// 5. Display the budget on the UI
	};

	return {
		init: function () {
			console.log('APplication has started.');
			setupEventListener();
		},
	};
})(budgetController, UIController);

controller.init();
