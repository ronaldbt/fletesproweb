const pool = require('../utils/db');

const notificaciones = {
    async guardar(id, external_reference, data) {
        const sql = `INSERT INTO notificaciones
                            (mp_id, external_reference, raw)
                              VALUES (?, ?, ?)
                            `;

        await pool.execute(sql, [id, external_reference, JSON.stringify(data)]);
    },

    async buscarPorIdMercadoPago(mp_id) {
        const [rows] = await pool.execute(
            'SELECT * FROM notificaciones WHERE mp_id = ?',
            [mp_id]
        );
        return rows[0];
    },
    async buscarPorIdExterno(id) {
        const [rows] = await pool.execute(
            'SELECT * FROM notificaciones WHERE external_reference = ?',
            [id]
        );
        return rows[0];
    }
};

module.exports = notificaciones;
