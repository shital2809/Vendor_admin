// const pool = require("../config/db");

// class VendorAdminModel {
//   static async findByEmail(email) {
//     const result = await pool.query("SELECT * FROM admins WHERE email = $1", [
//       email,
//     ]);
//     return result.rows[0];
//   }

//   // static async create(name, email, hashedPassword) {
//   //     const result = await pool.query(
//   //         'INSERT INTO admins (name, email, password) VALUES ($1, $2, $3) RETURNING *',
//   //         [name, email, hashedPassword]
//   //     );
//   //     return result.rows[0];
//   // }
//   static async findByEmail(email) {
//     const result = await pool.query(
//       "SELECT * FROM admins WHERE email = $1 AND role = $2",
//       [email, "vendor-admin"]
//     );
//     return result.rows[0];
//   }
// }

// module.exports = VendorAdminModel;

const pool = require('../config/db');

class VendorAdminModel {
    static async findByEmail(email) {
        const result = await pool.query('SELECT * FROM admins WHERE email = $1', [email]);
        return result.rows[0];
    }

    static async create(name, email, hashedPassword) {
        const result = await pool.query(
            'INSERT INTO admins (name, email, password) VALUES ($1, $2, $3) RETURNING *',
            [name, email, hashedPassword]
        );
        return result.rows[0];
    }
}

module.exports = VendorAdminModel;
