/* eslint-disable camelcase */
exports.up = (pgm) => {
  pgm.createTable("comments", {
    id: {
      type: "VARCHAR(50)",
      primaryKey: true,
    },
    content: {
      type: "TEXT",
      notNull: true,
    },
    owner: {
      type: "VARCHAR(50)",
      notNull: true,
      references: '"users"',
      onDelete: "cascade",
    },
    threadId: {
      type: "VARCHAR(50)",
      notNull: false,
      references: '"threads"',
    },
    created_at: {
      type: "TEXT",
      notNull: false,
    },
    updated_at: {
      type: "TEXT",
      notNull: false,
    },
    deleted_at: {
      type: "TEXT",
      notNull: false,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable("comments");
};
