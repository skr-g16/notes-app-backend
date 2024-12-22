const autoBind = require('auto-bind');
class ExportHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
    autoBind(this);
  }

  async postExportPlaylistHandler(request, h) {
    this._validator.validateExportPayload(request.payload);
    const message = {
      userId: request.auth.credentials.id,
      targetEmail: request.payload.targetEmail,
    };
    await this._service.sendMessage('export:notes', JSON.stringify(message));
    const response = h.response({
      status: 'success',
      message: 'Permintaan Anda dalam antrean',
    });
    response.code(201);
    return response;
  }
}
module.exports = ExportHandler;
