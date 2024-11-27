const autoBind = require('auto-bind');
class collaborationsHandler {
  constructor(collaborationsServices, notesServices, validator) {
    this._collaborationsServices = collaborationsServices;
    this._notesServices = notesServices;
    this._validator = validator;
    autoBind(this);
  }

  async addCollaborationHandler(request, h) {
    this._validator.validatePostCollaborationPayload(request.payload);
    const { id: credentialId } = request.auth.credentials;
    const { noteId, userId } = request.payload;

    await this._notesServices.verifyNoteAccess(noteId, credentialId);
    const collaborationId = await this._collaborationsServices.addCollaboration(
      noteId,
      userId,
    );
    const response = h.response({
      status: 'success',
      message: 'Kolaborasi berhasil ditambahkan',
      data: {
        collaborationId,
      },
    });
    response.code(201);
    return response;
  }

  async deleteCollaborationHandler(request) {
    this._validator.validatePostCollaborationPayload(request.payload);
    const { id: credentialId } = request.auth.credentials;
    const { noteId, userId } = request.payload;
    await this._notesServices.verifyNoteAccess(noteId, credentialId);
    await this._collaborationsServices.deleteCollaboration(noteId, userId);
    return {
      status: 'success',
      message: 'Kolaborasi berhasil dihapus',
    };
  }
}

module.exports = collaborationsHandler;
