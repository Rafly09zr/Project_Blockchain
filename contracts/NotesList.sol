pragma solidity ^0.5.0;

contract NotesList {
 uint public notesCount = 0;
    
 struct Notes {
    uint id;
    string content;
    bool completed;
 }

 mapping(uint => Notes) public notes;

constructor()public {
    createNotes("Please add some notes");
}

 function createNotes(string memory _content) public {
    notesCount++;
    notes[notesCount] = Notes(notesCount, _content, false);
 }

}
