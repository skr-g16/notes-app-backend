const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const invariantError = require('../../exceptions/invariantError');
class collaborationsServices {
  constructor() {
    this._pool = new Pool();
  }

  async addCollaboration(noteId, userId) {
    const id = `collab-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO collaborations VALUES($1, $2, $3) RETURNING id',
      values: [id, noteId, userId],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new invariantError('Kolaborasi gagal ditambahkan');
    }
    return result.rows[0].id;
  }

  async deleteCollaboration(noteId, userId) {
    const query = {
      text: 'DELETE FROM collaborations WHERE note_id = $1 AND user_id = $2 RETURNING id',
      values: [noteId, userId],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new invariantError('Kolaborasi gagal dihapus');
    }
  }

  async verifyCollaboration(noteId, userId) {
    const query = {
      text: 'SELECT * FROM collaborations WHERE note_id = $1 AND user_id = $2',
      values: [noteId, userId],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new invariantError('Kolaborasi gagal diverifikasi');
    }
  }
}
module.exports = collaborationsServices;
