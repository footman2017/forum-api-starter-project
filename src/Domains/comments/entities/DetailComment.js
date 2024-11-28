class DetailComment {
  constructor(payload) {
    this._verifyPayload(payload);

    const { id, username, date, content, deleted_at } = payload;

    this.id = id;
    this.username = username;
    this.date = date;
    this.content = deleted_at ? "**komentar telah dihapus**" : content;
    this.deleted_at = deleted_at;
  }

  _verifyPayload({ id, username, date, content }) {
    if (!id || !username || !date || !content) {
      throw new Error("DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY");
    }

    if (typeof id !== "string" || typeof username !== "string" || typeof date !== "string" || typeof content !== "string") {
      throw new Error("DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION");
    }
  }
}
module.exports = DetailComment;
