const API_BASE_URL = 'http://localhost:3002/items';

// Function to create a new item
function createItem() {
    const itemName = $('#itemName').val();
    const itemSerialNumber = $('#itemSerialNumber').val();
    const itemDescription = $('#itemDescription').val();

    $.ajax({
        type: 'POST',
        url: API_BASE_URL,
        data: JSON.stringify({ itemName, itemSerialNumber, itemDescription }),
        contentType: 'application/json',
        success: function(response) {
            console.log('Item created:', response);
            // Perform actions after successful item creation, if needed
        },
        error: function(error) {
            console.error('Error creating item:', error);
            // Handle error if item creation fails
        }
    });
}

// Function to update an existing item
function editItem(itemId) {
    const itemName = $('#editItemName').val();
    const itemSerialNumber = $('#editSerialNumber').val();
    const itemDescription = $('#editDescription').val();

    $.ajax({
        type: 'PUT',
        url: `${API_BASE_URL}/${itemId}`,
        data: JSON.stringify({ itemName, itemSerialNumber, itemDescription }),
        contentType: 'application/json',
        success: function(response) {
            console.log('Item updated:', response);
            // Perform actions after successful item update, if needed
        },
        error: function(error) {
            console.error('Error updating item:', error);
            // Handle error if item update fails
        }
    });
}

// Function to delete an item
function deleteItem(itemId) {
    $.ajax({
        type: 'DELETE',
        url: `${API_BASE_URL}/${itemId}`,
        success: function(response) {
            console.log('Item deleted:', response);
            // Perform actions after successful item deletion, if needed
        },
        error: function(error) {
            console.error('Error deleting item:', error);
            // Handle error if item deletion fails
        }
    });
}

// Function to get all items
function getAllItems() {
    $.ajax({
        type: 'GET',
        url: API_BASE_URL,
        success: function(response) {
            console.log('All items:', response);
            // Handle all items data received from the API, if needed
        },
        error: function(error) {
            console.error('Error fetching items:', error);
            // Handle error if fetching items fails
        }
    });
}
