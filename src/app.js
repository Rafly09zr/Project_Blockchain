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
        //Create a Javascript version of the smart contract
        const notesList = await $.getJSON('NotesList.json')
        App.contracts.NotesList = TruffleContract(notesList)
        App.contracts.NotesList.setProvider(App.web3Provider)
        
        //hydrate the smart contract with values from the blockchain
        App.notesList = await App.contracts.NotesList.deployed()
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
      }
}

$(() => {
    $(window).load(() => {
      App.load()
    })
  })