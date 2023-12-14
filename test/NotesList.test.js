const NotesList = artifacts.require('./NotesList.sol')

contract('NotesList', (account) => {
    before(async () => {
        this.notesList = await NotesList.deployed()
    })

    it('deploys successfully', async () => {
        const address = await this.notesList.address
        assert.notEqual(address, 0x0)
        assert.notEqual(address, '')
        assert.notEqual(address, null)
        assert.notEqual(address, undefined)
    })

    it('lists notes', async () => {
        const notesCount = await this.notesList.notesCount()
        const notes = await this.notesList.notes(notesCount)
        assert.equal(notes.id.toNumber(), notesCount.toNumber())
        assert.equal(notes.content, 'Please add some notes')
        assert.equal(notes.completed, false)
        assert.equal(notesCount.toNumber(), 1)
      })

      it('creates notes', async () => {
        const result = await this.notesList.createNotes('A new notes')
        const notesCount = await this.notesList.notesCount()
        assert.equal(notesCount, 2)
        const event = result.logs[0].args
        assert.equal(event.id.toNumber(), 2)
        assert.equal(event.content, 'A new notes')
        assert.equal(event.completed, false)
      })

      it('toggles notes completion', async () => {
        const result = await this.notesList.toggleCompleted(1)
        const notes = await this.notesList.notes(1)
        assert.equal(notes.completed, true)
        const event = result.logs[0].args
        assert.equal(event.id.toNumber(), 1)
        assert.equal(event.completed, true)
      })

        // Test case untuk menambahkan item baru
  it('creates new item', async () => {
    const itemName = 'New Item';
    const serialNumber = '12345';
    const description = 'Description for the new item';

    const result = await this.notesList.createItem(itemName, serialNumber, description);

    const event = result.logs[0].args;
    assert.equal(event.id.toNumber(), 1); // Mengganti angka sesuai dengan id item yang diperoleh saat membuat item pertama kali
    assert.equal(event.itemName, itemName);
    assert.equal(event.serialNumber, serialNumber);
    assert.equal(event.description, description);

    // Pastikan itemsCount bertambah setelah item ditambahkan
    const itemsCount = await this.notesList.itemsCount();
    assert.equal(itemsCount, 1);
  });

  // Test case untuk mengedit item
  it('edits an item', async () => {
    const newItemName = 'Updated Item Name';
    const newSerialNumber = '54321';
    const newDescription = 'Updated description for the item';

    const itemId = 1; // ID item yang ingin diubah
    await this.notesList.editItem(itemId, newItemName, newSerialNumber, newDescription);

    const editedItem = await this.notesList.items(itemId);
    assert.equal(editedItem.itemName, newItemName);
    assert.equal(editedItem.serialNumber, newSerialNumber);
    assert.equal(editedItem.description, newDescription);
  });

  // Test case untuk menghapus item
  it('deletes an item', async () => {
    const itemId = 1; // ID item yang ingin dihapus

    await this.notesList.deleteItem(itemId);
    const itemsCount = await this.notesList.itemsCount();
    assert.equal(itemsCount, 0); // Pastikan itemsCount berkurang setelah item dihapus
  });
})