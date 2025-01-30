$(document).ready(function () {
    const expensesContainer = $('#expensesList');
    const noDataMessage = $('#noDataMessage');
    const toggleViewButton = $('#toggleView');
    let expenses = [];
    let groupByCategory = true; // Default grouping by category

    // Retrieve expenses from localStorage
    let storedData = localStorage.getItem('expenses');
    if (storedData) {
        try {
            expenses = JSON.parse(storedData);
        } catch (error) {
            console.log('Error parsing expenses data:', error);
        }
    }

    // Show or hide "No data" message
    if (expenses.length === 0) {
        noDataMessage.removeClass('hidden');
        expensesContainer.empty();
        return;
    }

    // Initially show expenses grouped by category
    showExpenses();

    // Toggle between showing by category or by month
    toggleViewButton.click(function () {
        groupByCategory = !groupByCategory;
        showExpenses();
        toggleViewButton.text(groupByCategory ? 'Filter by Month' : 'Filter by Category');
    });

    function showExpenses() {
        expensesContainer.empty(); // Clear previous content
        if (groupByCategory) {
            showExpensesByCategory();
        } else {
            showExpensesByMonth();
        }
    }

    function showExpensesByCategory() {
        let categories = {};
        let grandTotal = 0;

        // Group expenses by category and calculate the total for each category
        expenses.forEach((expense, index) => {
            if (!categories[expense.category]) {
                categories[expense.category] = { total: 0, expenses: [] };
            }
            categories[expense.category].expenses.push({ ...expense, index });
            categories[expense.category].total += parseInt(expense.amount);
        });
        console.log(categories);
        // Display grouped by category
        Object.keys(categories).forEach(category => {
            const categorySection = $('<div></div>').addClass('bg-white p-4 rounded-lg shadow-md');
            const categoryTitle = $('<h3></h3>').addClass('text-xl font-semibold text-blue-800').text(category);
            categorySection.append(categoryTitle);

            const expenseList = $('<ul></ul>').addClass('space-y-2');
            categories[category].expenses.forEach(expense => {
                const expenseItem = $('<li></li>').addClass('flex justify-between items-center p-2 bg-gray-100 rounded-lg');

                // Expense text
                const expenseText = $('<span></span>').text(`${expense.description} - ${expense.amount} RS`);

                // Delete button
                const deleteButton = $('<button></button>')
                    .addClass('ml-4 bg-red-500 text-white px-2 py-1 rounded')
                    .text('Delete')
                    .click(() => deleteExpense(expense.index));

                expenseItem.append(expenseText);
                expenseItem.append(deleteButton);
                expenseList.append(expenseItem);
            });

            // Display the total for this category
            const categoryTotal = $('<div></div>').addClass('mt-2 font-semibold text-blue-800')
                .text(`Total: ${categories[category].total} RS`);
            categorySection.append(expenseList);
            categorySection.append(categoryTotal);

            expensesContainer.append(categorySection);

            // Add to grand total
            grandTotal += categories[category].total;
        });

        // Display the grand total
        const grandTotalSection = $('<div></div>').addClass('bg-white p-4 rounded-lg shadow-md');
        const grandTotalTitle = $('<h3></h3>').addClass('text-xl font-semibold text-blue-800').text('Grand Total');
        const grandTotalAmount = $('<p></p>').addClass('text-lg font-bold').text(`${grandTotal} RS`);
        grandTotalSection.append(grandTotalTitle);
        grandTotalSection.append(grandTotalAmount);
        expensesContainer.append(grandTotalSection);
    }

    function showExpensesByMonth() {
        let months = {};
        let grandTotal = 0;

        // Group expenses by month and calculate the total for each month
        expenses.forEach((expense, index) => {
            const month = new Date(expense.date).toLocaleString('default', { month: 'long', year: 'numeric' });
            if (!months[month]) {
                months[month] = { total: 0, expenses: [] };
            }
            months[month].expenses.push({ ...expense, index });
            months[month].total += parseInt(expense.amount);
        });

        // Display grouped by month
        Object.keys(months).forEach(month => {
            const monthSection = $('<div></div>').addClass('bg-white p-4 rounded-lg shadow-md');
            const monthTitle = $('<h3></h3>').addClass('text-xl font-semibold text-blue-800').text(month);
            monthSection.append(monthTitle);

            const expenseList = $('<ul></ul>').addClass('space-y-2');
            months[month].expenses.forEach(expense => {
                const expenseItem = $('<li></li>').addClass('flex justify-between items-center p-2 bg-gray-100 rounded-lg');

                // Expense text
                const expenseText = $('<span></span>').text(`${expense.description} - ${expense.amount} RS`);

                // Delete button
                const deleteButton = $('<button></button>')
                    .addClass('ml-4 bg-red-500 text-white px-2 py-1 rounded')
                    .text('Delete')
                    .click(() => deleteExpense(expense.index));

                expenseItem.append(expenseText);
                expenseItem.append(deleteButton);
                expenseList.append(expenseItem);
            });

            // Display the total for this month
            const monthTotal = $('<div></div>').addClass('mt-2 font-semibold text-green-600')
                .text(`Total: ${months[month].total} RS`);
            monthSection.append(expenseList);
            monthSection.append(monthTotal);

            expensesContainer.append(monthSection);

            // Add to grand total
            grandTotal += months[month].total;
        });

        // Display the grand total
        const grandTotalSection = $('<div></div>').addClass('bg-white p-4 rounded-lg shadow-md');
        const grandTotalTitle = $('<h3></h3>').addClass('text-xl font-semibold text-blue-800').text('Grand Total');
        const grandTotalAmount = $('<p></p>').addClass('text-lg font-bold text-green-600').text(`${grandTotal} RS`);
        grandTotalSection.append(grandTotalTitle);
        grandTotalSection.append(grandTotalAmount);
        expensesContainer.append(grandTotalSection);
    }

    function deleteExpense(index) {
        console.log(index)
        // Remove the selected expense
        expenses.splice(index, 1);

        // Update localStorage
        localStorage.setItem('expenses', JSON.stringify(expenses));

        // Refresh the display
        showExpenses();
    }
});
