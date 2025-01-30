$(document).ready(function () {
    let category = ['Food', 'Transport', 'Loans', 'Entertainment', 'Shopping'];
    
    // Adding options to select tag
    category.forEach(function (item) {
        $('#category').append($('<option>', {
            value: item,
            text: item
        }));
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
        let storedData = localStorage.getItem('expenses')||[];
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


    //showing data on button click
    $("#showLocalData").click(function () {
        showData();
    });
    //Deleting data on button click
    $("#deleteLocalData").click(function () {
        deleteData();
    });


    // function to show data

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
    

    //function to clear form
    function clearForm() {
        $('#amount').val('');
        $('#description').val('');
        $('#category').val('');
        $('#date').val('');

    }

    //function to delete data from localstorage
    function deleteData(){
        localStorage.removeItem('expenses');
    }
});
