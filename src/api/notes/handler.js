const autoBind = require('auto-bind');
class notesHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
    autoBind(this);
  }

  async postNoteHandler(request, h) {
    this._validator.validateNotePayload(request.payload);
    const { title = 'untitled', tags, body } = request.payload;
    const { id: credentialID } = request.auth.credentials;
    const noteId = await this._service.addNote({
      title,
      tags,
      body,
      owner: credentialID,
    });

    const response = h.response({
      status: 'success',
      message: 'Catatan berhasil ditambahkan',
      data: {
        noteId,
      },
    });
    response.code(201);
    return response;
  }

  async getNotesHandler(request) {
    const { id: credentialId } = request.auth.credentials;
    const notes = await this._service.getNotes(credentialId);
    return {
      status: 'success',
      data: {
        notes,
      },
    };
  }

  async getNoteByIdHandler(request) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;
    await this._service.verifyNoteAccess(id, credentialId);
    const note = await this._service.getNotesById(id);
    return {
      status: 'success',
      data: {
        note,
      },
    };
  }

  async putNoteByIdHandler(request) {
    this._validator.validateNotePayload(request.payload);
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;
    await this._service.verifyNoteAccess(id, credentialId);
    await this._service.editNotesById(id, request.payload);
    return {
      status: 'success',
      message: 'Catatan berhasil diperbarui',
    };
  }

  async deleteNoteByIdHandler(request) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;
    await this._service.verifyNoteOwner(id, credentialId);
    await this._service.deleteNotesById(id);
    return {
      status: 'success',
      message: 'Catatan berhasil dihapus',
    };
  }
}

module.exports = notesHandler;
