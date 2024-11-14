/* eslint-disable camelcase */
exports.up = (pgm) => {
  pgm.createTable("threads", {
    id: {
      type: "VARCHAR(50)",
      primaryKey: true,
    },
    title: {
      type: "TEXT",
      notNull: true,
    },
    body: {
      type: "TEXT",
      notNull: false,
    },
    owner: {
      type: "VARCHAR(50)",
      notNull: true,
      references: '"users"',
      onDelete: "cascade",
    },
    created_at: {
      type: "TEXT",
      notNull: false,
    },
    updated_at: {
      type: "TEXT",
      notNull: false,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable("threads");
};
