const mariadb = require("mariadb");

module.exports = {
  async getByID(req, res) {
    const { id } = req.query;
    try {
      var connection = await mariadb.createConnection({
        host: process.env.HOST,
        user: process.env.USER,
        password: process.env.PASSWORD,
      });
      var rows = await connection.query(
        `SELECT * FROM thia1892_bomsono.Invoice WHERE invoice_id=${id}`
      );
    } catch (err) {
      var rows = err;
    }

    connection.destroy();

    res.json(rows);
  },

  async getAll(req, res) {
    try {
      var connection = await mariadb.createConnection({
        host: process.env.HOST,
        user: process.env.USER,
        password: process.env.PASSWORD,
      });
      var rows = await connection.query(
        "SELECT * FROM thia1892_bomsono.Invoice"
      );
    } catch (err) {
      var rows = err;
    }

    connection.destroy();

    res.json(rows);
  },

  async post(req, res) {
    const { payment_method, total, date, accomm } = req.body;
    try {
      var connection = await mariadb.createConnection({
        host: process.env.HOST,
        user: process.env.USER,
        password: process.env.PASSWORD,
      });
      var rows = await connection.query(
        `INSERT INTO thia1892_bomsono.Invoice (payment_method, total, date, accomm) VALUES (?,?,?,?)`,
        [payment_method, total, date, accomm]
      );
    } catch (err) {
      var rows = err;
    }

    connection.destroy();

    res.json(rows);
  },

  async patch(req, res) {
    const { id } = req.query;
    const { payment_method, total, date, accomm } = req.body;
    try {
      var connection = await mariadb.createConnection({
        host: process.env.HOST,
        user: process.env.USER,
        password: process.env.PASSWORD,
      });
      var rows = await connection.query(
        `
            UPDATE thia1892_bomsono.Invoice 
            SET payment_method = ${payment_method}, total = ${total}, date = ${date}, accomm = ${accomm}
            WHERE invoice_id = ${id};`
        );
        } catch(err) {
            var rows = err;
        }

        connection.destroy();
        
        res.json(rows);
    },

    async delete(req, res) {
        const {id} = req.query;
        try {
            var connection = await mariadb.createConnection({host: process.env.HOST, user: process.env.USER, password: process.env.PASSWORD});
            var rows = await connection.query(`DELETE FROM thia1892_bomsono.Invoice WHERE invoice_id=${id}`);        
        } catch(err) {
            var rows = err;
        }

        connection.destroy();
        
        res.json(rows);
    },

  async generateInvoice(req, res) {
    const { accomm, payment_method } = req.body;
    try {
      var connection = await mariadb.createConnection({
        host: process.env.HOST,
        user: process.env.USER,
        password: process.env.PASSWORD,
      });
      var date = new Date(Date.now());
      var rows =
        await connection.query(`INSERT INTO thia1892_bomsono.Invoice (payment_method, total, date, accomm) VALUES
            ("${payment_method}", (SELECT SUM(price)
            FROM thia1892_bomsono.Consumption as C
            WHERE C.accomm = ${accomm}), "${
          date.toISOString().split("T")[0]
        }", ${accomm});`);
    } catch (err) {
      var rows = err;
    }
    connection.destroy();

    res.json(rows);
  },
};
