const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const invariantError = require('../../exceptions/invariantError');
const { mapDBToModel } = require('../../utils');
const notFoundError = require('../../exceptions/notFoundError');
class notesService {
  constructor() {
    this._pool = new Pool();
  }
  async addNote({ title, body, tags }) {
    const id = nanoid(16);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;
    const query = {
      text: 'INSERT INTO notes VALUES($1, $2, $3, $4, $5, $6) RETURNING id',
      values: [id, title, body, tags, createdAt, updatedAt],
    };
    const result = await this._pool.query(query);
    if (!result.rows[0].id) {
      throw new invariantError('Catatan gagal ditambahkan');
    }
    return result.rows[0].id;
  }

  async getNotes() {
    const result = await this._pool.query('SELECT * FROM notes');
    return result.rows.map(mapDBToModel);
  }

  async getNotesById(id) {
    const query = {
      text: 'SELECT * FROM notes WHERE id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new notFoundError('Catatan tidak ditemukan');
    }
    return result.rows.map(mapDBToModel)[0];
  }

  async editNotesById(id, { title, body, tags }) {
    const updatedAt = new Date().toISOString();
    const query = {
      text: 'UPDATE notes SET title = $1, body = $2, tags = $3, updated_at = $4 WHERE id = $5 RETURNING id',
      values: [title, body, tags, updatedAt, id],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new notFoundError('Gagal memperbarui Catatan, id tidak ditemukan');
    }
  }

  async deleteNotesById(id) {
    const query = {
      text: 'DELETE FROM notes WHERE id = $1 RETURNING id',
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new notFoundError('Catatan gagal dihapus, id tidak ditemukan');
    }
  }
}
module.exports = notesService;
