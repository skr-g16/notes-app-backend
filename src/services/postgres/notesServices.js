const { nanoid } = require('nanoid');
const invariantError = require('../../exceptions/invariantError');
const notFoundError = require('../../exceptions/notFoundError');
const authorizationError = require('../../exceptions/authorizationError');
const { Pool } = require('pg');
const { mapDBToModel } = require('../../utils');

class notesService {
  constructor(CollaborationsServices, cacheSevices) {
    this._pool = new Pool();
    this._collaborationsServices = CollaborationsServices;
    this._cacheSevices = cacheSevices;
  }

  async addNote({ title, body, tags, owner }) {
    const id = nanoid(16);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const query = {
      text: 'INSERT INTO notes VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id',
      values: [id, title, body, tags, createdAt, updatedAt, owner],
    };

    const result = await this._pool.query(query);
    if (!result.rows[0].id) {
      throw new invariantError('Catatan gagal ditambahkan');
    }
    await this._cacheSevices.delete(`notes:${owner}`);
    return result.rows[0].id;
  }

  async getNotes(owner) {
    try {
      // mendapatkan catatan dari cache
      const result = await this._cacheSevices.set(`notes:${owner}`);
      return JSON.parse(result);
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      // bila gagal, diteruskan dengan mendapatkan catatan dari database
      const query = {
        text: `SELECT notes.* FROM notes
        LEFT JOIN collaborations ON collaborations.note_id = notes.id
        WHERE notes.owner = $1 OR collaborations.user_id = $1
        GROUP BY notes.id`,
        values: [owner],
      };
      const result = await this._pool.query(query);
      const mappedResult = result.rows.map(mapDBToModel);
      // catatan akan disimpan pada cache sebelum fungsi getNotes dikembalikan
      await this._cacheSevices.set(
        `notes:${owner}`,
        JSON.stringify(mappedResult),
      );
      return mappedResult;
    }
  }

  async getNotesById(id) {
    const query = {
      text: `SELECT notes.*, users.username
    FROM notes
    LEFT JOIN users ON users.id = notes.owner
    WHERE notes.id = $1`,
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
      throw new notFoundError('Catatan gagal diubah, id tidak ditemukan');
    }
    const { owner } = result.rows[0];
    await this._cacheSevices.delete(`notes:${owner}`);
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
    const { owner } = result.rows[0];
    await this._cacheSevices.delete(`notes:${owner}`);
  }

  async verifyNoteOwner(id, owner) {
    const query = {
      text: 'SELECT * FROM notes WHERE id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new notFoundError('Catatan tidak ditemukan');
    }
    const note = result.rows[0];
    if (note.owner !== owner) {
      throw new authorizationError('Anda tidak berhak mengakses resource ini');
    }
  }

  async verifyNoteAccess(noteId, userId) {
    try {
      await this.verifyNoteOwner(noteId, userId);
    } catch (error) {
      if (error instanceof notFoundError) {
        throw error;
      }
      try {
        await this._collaborationsServices.verifyCollaboration(noteId, userId);
      } catch {
        throw error;
      }
    }
  }
}

module.exports = notesService;
