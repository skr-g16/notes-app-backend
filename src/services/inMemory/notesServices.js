const { nanoid } = require('nanoid');
const invariantError = require('../../exceptions/invariantError');
const notFoundError = require('../../exceptions/notFoundError');
class notesService {
  constructor() {
    this._notes = [];
  }
  addNote({ title, body, tags }) {
    const id = nanoid(16);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const newNote = {
      title,
      tags,
      body,
      id,
      createdAt,
      updatedAt,
    };
    this._notes.push(newNote);
    const isSuccess = this._notes.filter((note) => note.id === id).length > 0;
    if (!isSuccess) {
      return new invariantError('Catatan gagal ditambahkan');
    }
    return id;
  }
  getNotes() {
    return this._notes;
  }
  getNotesById(id) {
    const note = this._notes.filter((n) => n.id === id)[0];
    if (!note) {
      throw new notFoundError('Catatan tidak ditemukan');
    }
    return note;
  }

  editNotesById(id, { title, body, tags }) {
    const index = this._notes.findIndex((note) => note.id === id);
    if (index === -1) {
      throw new notFoundError('Gagal memperbarui Catatan, id tidak ditemukan');
    }
    const updatedAt = new Date().toISOString();
    this._notes[index] = {
      ...this._notes[index],
      title,
      body,
      tags,
      updatedAt,
    };
  }

  deleteNotesById(id) {
    const index = this._notes.findIndex((note) => note.id === id);
    if (index === -1) {
      throw new notFoundError('Catatan gagal dihapus, id tidak ditemukan');
    }
    this._notes.splice(index, 1);
  }
}

module.exports = notesService;
