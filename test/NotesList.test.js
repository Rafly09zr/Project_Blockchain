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
})