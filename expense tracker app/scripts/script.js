$(document).ready(function () {
    let category = JSON.parse(localStorage.getItem('categories')) || ['Food', 'Transport', 'Loans', 'Entertainment', 'Shopping'];

    // Function to update the category select options
    function updateCategorySelect() {
        $('#category').empty(); // Clear existing options
        category.forEach(function (item) {
            $('#category').append($('<option>', {
                value: item,
                text: item
            }));
        });
        console.log(category)
    }

    // Update the select dropdown initially
    updateCategorySelect();

    // Toggle the visibility of the New Category input field
    $('#toggleCategoryInput').click(function () {
        $('#newCategoryContainer').toggle(); // Toggle visibility of the input container
    });

    // Adding new category to the list
    $(document).on('click', '#addCategory', function () {
        console.log("Add btn clicked")
        let newCategory = $('#newCategory').val().trim();

        if (newCategory && !category.includes(newCategory)) {
            category.push(newCategory); // Add new category to the list
            localStorage.setItem('categories', JSON.stringify(category)); // Store updated categories in localStorage
            $('#newCategory').val(''); // Clear the input field

            // Update the category dropdown
            updateCategorySelect();
            showToast('New category added successfully!', 1);
        } else if (!newCategory) {
            showToast('Please enter a category name.', 0);
        } else {
            showToast('Category already exists!', 0);
        }
    });

    var total = 0;

    // Adding data on click of submit button
    $('#btnSubmit').click(function (event) {
        event.preventDefault();
        addExpense();
    });

    // Function to add expense
    function addExpense() {
        let amount = $('#amount').val().trim();
        let description = $('#description').val().trim();
        let category = $('#category').val().trim();
        let date = $('#date').val();

        if (!amount || isNaN(amount)) {
            showToast('Invalid amount', 0);
            return;
        }

        total += parseInt(amount);

        let temp = {
            amount: amount,
            description: description,
            category: category,
            date: date
        };

        // Fix: Ensure correct parsing before storing data
        let expenses = [];
        let storedData = localStorage.getItem('expenses') || [];
        if (storedData) {
            try {
                expenses = JSON.parse(storedData);
                if (!Array.isArray(expenses)) {
                    expenses = []; // Reset if data is incorrect
                }
            } catch (error) {
                expenses = []; // Reset if data is corrupted
            }
        }

        // Push new data into the array
        expenses.push(temp);

        // Store updated array back to localStorage
        localStorage.setItem('expenses', JSON.stringify(expenses));

        console.log(localStorage.getItem('expenses'));

        $('#totalAmount').text(total + ": RS").addClass('text-success text-2xl font-bold');

        showToast('Expense added successfully', 1);
        clearForm();
    }

    function showToast(message, type = 1) {
        const toast = $('<div></div>')
            .addClass(`px-4 py-2 rounded-lg shadow-md text-white text-sm transition-opacity duration-500 opacity-100`)
            .text(message);

        // Apply color based on type
        if (type == 1) {
            toast.addClass('bg-green-500');
        } else if (type == 0) {
            toast.addClass('bg-red-500');
        } else {
            toast.addClass('bg-gray-500');
        }

        // Append toast to container
        $('#toastContainer').append(toast);

        // Remove toast after 3 seconds
        setTimeout(() => {
            toast.fadeOut(500, function () {
                $(this).remove();
            });
        }, 3000);
    }

    // Showing data on button click
    $("#showLocalData").click(function () {
        showData();
    });

    // Deleting data on button click
    $("#deleteLocalData").click(function () {
        deleteData();
    });

    // Function to show data
    function showData() {
        let storedData = localStorage.getItem('expenses');

        if (!storedData) {
            $('#expenses').text("No data available. Add some expenses!").addClass('text-gray-500 italic');
            return;
        }

        // If data exists, format and show it
        let parsedData = JSON.parse(storedData);
        $('#expenses').text(JSON.stringify(parsedData)).removeClass('text-gray-500 italic text-red-500');
    }

    // Function to clear form
    function clearForm() {
        $('#amount').val('');
        $('#description').val('');
        $('#category').val('');
        $('#date').val('');
    }

    // Function to delete data from localStorage
    function deleteData() {
        localStorage.removeItem('expenses');
    }
});
