App = {
    loading: false,
    contracts: {},

    load: async() => {
        await App.loadWeb3()
        await App.loadAccount()
        await App.loadContract()
        await App.render()
    },

    // https://medium.com/metamask/https-medium-com-metamask-breaking-change-injecting-web3-7722797916a8
    loadWeb3: async () => {
        if (typeof web3 !== 'undefined') {
        App.web3Provider = web3.currentProvider
        web3 = new Web3(web3.currentProvider)
        } else {
        window.alert("Please connect to Metamask.")
        }
        // Modern dapp browsers...
        if (window.ethereum) {
            window.web3 = new Web3(ethereum)
            try {
                // Request account access if needed
                await ethereum.enable()
                // Acccounts now exposed
                web3.eth.sendTransaction({/* ... */})
            } catch (error) {
                // User denied account access...
            }
        }
        // Legacy dapp browsers...
        else if (window.web3) {
            App.web3Provider = web3.currentProvider
            window.web3 = new Web3(web3.currentProvider)
            // Acccounts always exposed
            web3.eth.sendTransaction({/* ... */})
        }
        // Non-dapp browsers...
        else {
            console.log('Non-Ethereum browser detected. You should consider trying MetaMask!')
        }
    },

    loadAccount: async () => {
        // Set the current blockchain account
        App.account = web3.eth.accounts[0]
    },

    loadContract: async () => {
        try {
            const notesList = await $.getJSON('NotesList.json');
            console.log("NotesList object:", notesList);
    
            App.contracts.NotesList = TruffleContract(notesList);
            console.log("NotesList TruffleContract:", App.contracts.NotesList);
    
            App.contracts.NotesList.setProvider(App.web3Provider);
            
            // Hydrate the smart contract with values from the blockchain
            App.notesList = await App.contracts.NotesList.deployed();
            console.log("Deployed NotesList contract:", App.notesList);
        } catch (error) {
            console.error("Error in loadContract:", error);
        }
    },
    

    render: async () => {
        // Prevent double render
        if (App.loading) {
            return
        }
        
        // Update app loading state
        App.setLoading(true)

        // Render Account
        $('#account').html(App.account)

        // Render Notes
        await App.renderNotes()

        // Render Items
        await App.renderItems();

        // Update loading state
        App.setLoading(false)
    },

    renderNotes: async () => {
        // Load the total notes count from the blockchain
        const notesCount = await App.notesList.notesCount()
        const $notesTemplate = $('.notesTemplate')

        // Render out each note with a new note template
        for (var i = 1; i <= notesCount; i++) {
            // Fetch the task data from the blockchain
            const notes = await App.notesList.notes(i)
            const notesId = notes[0].toNumber()
            const notesContent = notes[1]
            const notesCompleted = notes[2]

            // Create the html for the task
            const $newNotesTemplate = $notesTemplate.clone()
            $newNotesTemplate.find('.content').html(notesContent)
            $newNotesTemplate.find('input')
                            .prop('name', notesId)
                            .prop('checked', notesCompleted)
                            .on('click', App.toggleCompleted)
            
            // Put the task in the correct list
            if (notesCompleted) {
                $('#completedNotesList').append($newNotesTemplate)
            } else {
                $('#notesList').append($newNotesTemplate)
            }

            // Show the note
            $newNotesTemplate.show()
        }
    },

    createNotes: async () => {
        App.setLoading(true)
        const content = $('#newNotes').val()
        await App.notesList.createNotes(content)
        window.location.reload()
      },

      toggleCompleted: async (e) => {
        App.setLoading(true)
        const notesId = e.target.name
        await App.notesList.toggleCompleted(notesId)
        window.location.reload()
      },

    setLoading: (boolean) => {
        App.loading = boolean
        const loader = $('#loader')
        const content = $('#content')
        if (boolean) {
          loader.show()
          content.hide()
        } else {
          loader.hide()
          content.show()
        }
      },

      createItem: async () => {
        App.setLoading(true);
        const itemName = $('#itemName').val();
        const serialNumber = $('#itemSerialNumber').val(); // Menggunakan itemSerialNumber
        const description = $('#itemDescription').val(); // Menggunakan itemDescription
    
        console.log("Item Name:", itemName);
        console.log("Serial Number:", serialNumber);
        console.log("Description:", description);
    
        await App.notesList.createItem(itemName, serialNumber, description);
        window.location.reload();
    },
    
    editItem: async (id) => {
        try {
            App.setLoading(true);
    
            // Mendapatkan nilai dari form edit
            const itemName = prompt("Masukkan nama barang baru:");
            const serialNumber = prompt("Masukkan nomor seri baru:");
            const description = prompt("Masukkan deskripsi baru:");
    
            console.log('Editing Item with ID:', id); // Log ID item yang akan diubah
            console.log('New Item Name:', itemName); // Log nama baru item
            console.log('New Serial Number:', serialNumber); // Log nomor seri baru
            console.log('New Description:', description); // Log deskripsi baru
    
            await App.notesList.editItem(id, itemName, serialNumber, description);
    
            // Mengupdate tampilan item setelah edit tanpa perlu me-refresh halaman
            // Implementasikan logika untuk menampilkan kembali item yang telah diubah
            // Pastikan Anda memiliki fungsi untuk menampilkan item di dalam tabel atau div yang sesuai dengan ID item
            // Contoh: App.renderEditedItem(id, itemName, serialNumber, description);
            window.location.reload();
        } catch (error) {
            console.error("Error editing item:", error);
        } finally {
            App.setLoading(false);
        }
    },
    
    deleteItem: async (id) => {
        App.setLoading(true);

        console.log('Deleting Item with ID:', id); // Log ID item yang akan dihapus

        await App.notesList.deleteItem(id);
        window.location.reload();
    },

    renderItems: async () => {
        try {
            const itemsCount = await App.notesList.itemsCount();
            console.log("Items Count:", itemsCount);
    
            const $itemList = $('#itemList'); // Dapatkan elemen tabel
    
            for (let i = 1; i <= itemsCount; i++) {
                const item = await App.notesList.items(i);
                console.log("Item:", item);
    
                const itemId = item[0].toNumber();
                const itemName = item[1];
                const itemSerialNumber = item[2];
                const itemDescription = item[3];
    
                // Tambahkan logika untuk memeriksa entri yang kosong sebelum menambahkan ke daftar
                if (itemName !== '' && itemSerialNumber !== '' && itemDescription !== '') {
                    const $newRow = $('<tr>'); // Buat baris baru
    
                    $newRow.append($('<td>').text(itemId)); // Tambahkan kolom ID
                    $newRow.append($('<td>').text(itemName)); // Tambahkan kolom Nama Barang
                    $newRow.append($('<td>').text(itemSerialNumber)); // Tambahkan kolom Nomor Seri
                    $newRow.append($('<td>').text(itemDescription)); // Tambahkan kolom Deskripsi
    
                    // Tambahkan tombol Edit dan Delete
                    const $editButton = $('<button class="btn btn-warning editButton">Edit</button>').click(() => App.editItem(itemId));
                    const $deleteButton = $('<button class="btn btn-danger deleteButton">Delete</button>').click(() => App.deleteItem(itemId));
                    const $actionCell = $('<td>');
                    $actionCell.append($editButton);
                    $actionCell.append($deleteButton);
                    $newRow.append($actionCell); // Tambahkan sel aksi ke baris
    
                    $itemList.append($newRow); // Tambahkan baris ke tabel
                }
            }
        } catch (error) {
            console.error("Error in rendering items:", error);
        }
    },
    
}

$(() => {
    $(window).load(() => {
      App.load()
    })
  })