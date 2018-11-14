/* eslint-disable max-len */
const table = 'Articles';
const column = 'searchVectors';

export default {
  up: (queryInterface) => {
    const { sequelize } = queryInterface;
    const searchFields = ['title', 'content'];

    return sequelize
      .query(`ALTER TABLE ${table} ADD COLUMN ${column} TSVECTOR`)
      .then(() => sequelize
        .query(`UPDATE ${table} SET ${column} = to_tsvector('english', title || ' ' || content )`)
        .then(() => sequelize
          .query(`CREATE INDEX searchIndex ON ${table} (${column});`)
          .then(() => sequelize
            .query(`CREATE TRIGGER updateSearchIndex BEFORE INSERT OR UPDATE ON ${table} FOR EACH ROW EXECUTE PROCEDURE tsvector_update_trigger(${column}, 'pg_catalog.english', ${searchFields.join(', ')})`))));
  },

  down: (queryInterface) => {
    const { sequelize } = queryInterface;

    return sequelize
      .query(`DROP TRIGGER updateSearchIndex ON ${table}`)
      .then(() => sequelize
        .query('DROP INDEX searchIndex'))
      .then(() => sequelize
        .query(`ALTER TABLE ${table} DROP COLUMN ${column}`));
  },
};
