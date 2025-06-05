const mpapi = require("../utils/mpapi");

const notificaciones = require("../models/notificationes.model");
const {MercadoPagoConfig, Payment} = require('mercadopago');

const client = new MercadoPagoConfig({accessToken: process.env.MP_TOKEN});
const payment = new Payment(client);

const paymentsController = {
    recibirNotificaciones: async (req, res) => {
        try {
            console.log(req.body)
            const payment_id = req.body.data.id;
            const notification_id = req.body.id;
            const notificacion = await notificaciones.guardar(payment_id, notification_id, req.body);

            console.log(payment_id);
            console.log(notification_id);

            console.log(req.body.action);
            switch (req.body.action) {
                case "payment.created":
                case "payment.updated":
                    payment.get({id: payment_id})
                        .then((payment) => {
                            //actualizarReservaPago(payment, notification_id)
                            //    .then((updatedShipping) => {
                            //        mailer.send_receipt(updatedShipping);
                            //    })
                            //    .catch(err => console.log("Error sending email " + payment_id, err));
                            console.log(payment);
                        }).catch((err2) => console.log("Error updating status " + payment_id, err2));
                    break;
            }

        } catch (err) {
            console.log(err);
        }

        return res.status(200).json({
            status: "success",
            timestamp: Date.now(),
        });
    }
}

module.exports = paymentsController
