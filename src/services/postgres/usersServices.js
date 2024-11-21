const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const invariantError = require('../../exceptions/invariantError');
const notFoundError = require('../../exceptions/notFoundError');
const authenticationError = require('../../exceptions/authenticationError');
const bcrypt = require('bcrypt');

class UsersService {
  constructor() {
    this._pool = new Pool();
  }

  async addUser({ username, password, fullname }) {
    await this.verifyNewUsername(username);
    const id = `user-${nanoid(16)}`;
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = {
      text: 'INSERT INTO users VALUES($1, $2, $3, $4) RETURNING id',
      values: [id, username, hashedPassword, fullname],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new invariantError('User gagal ditambahkan');
    }
    return result.rows[0].id;
  }

  async verifyNewUsername(username) {
    const query = {
      text: 'SELECT username FROM users WHERE username = $1',
      values: [username],
    };

    const result = await this._pool.query(query);

    if (result.rows.length > 0) {
      throw new invariantError(
        'Gagal menambahkan user. Username sudah digunakan.',
      );
    }
  }
  async getUserById(id) {
    const query = {
      text: 'SELECT id, username, fullname FROM users WHERE id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new notFoundError('User tidak ditemukan');
    }
    return result.rows[0];
  }

  async verifyUserCredential(username, password) {
    const query = {
      text: 'SELECT id, password FROM users WHERE username = $1',
      values: [username],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new authenticationError('Kredensial yang Anda berikan salah');
    }
    const { id, password: hashedPassword } = result.rows[0];
    const match = await bcrypt.compare(password, hashedPassword);
    if (!match) {
      throw new authenticationError('Kredensial yang Anda berikan salah');
    }
    return id;
  }
}

module.exports = UsersService;
