const redis = require('redis');
class CacheServices {
  constructor() {
    this._client = redis.createClient({
      socket: {
        host: process.env.REDIS_SERVER,
      },
    });
    this._client.on('error', (error) => {
      console.log(error);
    });
    this._client.connect();
  }

  async set(key, value, expiration = 3600) {
    await this._client.set(key, value, {
      EX: expiration,
    });
  }

  async get(key) {
    const result = await this._client.get(key);
    if (!result) {
      throw new Error('Cache tidak ditemukan');
    }
    return result;
  }

  async delete(key) {
    await this._client.del(key);
  }
}

module.exports = CacheServices;
