pragma solidity ^0.5.0;

contract NotesList {
 uint public notesCount = 0;
    
 struct Notes {
    uint id;
    string content;
    bool completed;
 }

 mapping(uint => Notes) public notes;

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
