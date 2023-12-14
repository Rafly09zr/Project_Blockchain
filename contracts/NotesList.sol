pragma solidity ^0.5.0;

contract NotesList {
 uint public notesCount = 0;
 uint public itemsCount = 0; // Menambah counter untuk barang
    
 struct Notes {
    uint id;
    string content;
    bool completed;
 }


   struct Item {
      uint id;
      string itemName;
      string serialNumber;
      string description;
   }

 mapping(uint => Notes) public notes;
 mapping(uint => Item) public items; // Mapping untuk menyimpan data barang

    // Event untuk informasi item yang ditambahkan
    event ItemAdded(
        uint id,
        string itemName,
        string serialNumber,
        string description
    );

        event LogItemDetails(
        uint indexed id,
        string itemName,
        string serialNumber,
        string description
    );

    // Fungsi untuk menambahkan item baru
    function createItem(string memory _itemName, string memory _serialNumber, string memory _description) public {
        itemsCount++;
        items[itemsCount] = Item(itemsCount, _itemName, _serialNumber, _description);
        emit ItemAdded(itemsCount, _itemName, _serialNumber, _description);

          // Tambahkan log untuk memeriksa nilai-nilai yang diterima dari antarmuka pengguna
          emit LogItemDetails(itemsCount, _itemName, _serialNumber, _description);
    }

    // Fungsi untuk mengedit informasi item
    function editItem(uint _id, string memory _itemName, string memory _serialNumber, string memory _description) public {
        Item storage currentItem = items[_id];
        currentItem.itemName = _itemName;
        currentItem.serialNumber = _serialNumber;
        currentItem.description = _description;
    }

    // Fungsi untuk menghapus item
    function deleteItem(uint _id) public {
        delete items[_id];
    }

 event NotesCreated(
   uint id,
   string content,
   bool completed
 );

  event NotesCompleted(
   uint id,
   bool completed
  );

constructor()public {
    createNotes("Please add some notes");
}

 function createNotes(string memory _content) public {
    notesCount++;
    notes[notesCount] = Notes(notesCount, _content, false);
    emit NotesCreated(notesCount, _content, false);
 }

 function toggleCompleted(uint _id) public {
    Notes memory _notes = notes[_id];
    _notes.completed = !_notes.completed;
    notes[_id] = _notes;
    emit NotesCompleted(_id, _notes.completed);
 }

}
