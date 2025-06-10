const {MercadoPagoConfig, Preference} = require('mercadopago');

const client = new MercadoPagoConfig({accessToken: process.env.MP_TOKEN});
const preference = new Preference(client);

const INSTALLMENTS = 12;

const mpapi = {
    nuevo(id, precio) {
        return preference.create({
            body: {
                external_reference: id,
                statement_descriptor: 'Fletes Pro',
                payment_methods: {
                    excluded_payment_methods: [],
                    excluded_payment_types: [],
                    installments: INSTALLMENTS
                },
                items: [
                    {
                        title: 'Envio Fletes PRO ' + id,
                        quantity: 1,
                        unit_price: precio,
                        currency_id: 'CLP',
                    }
                ],
                auto_return: "approved",
                back_urls: {
                    success: process.env.APP_URL_SUCCESS,
                    failure: process.env.APP_URL_FAILURE,
                    pending: process.env.APP_URL_PENDING,
                },
            }
        })
    },
};

module.exports = mpapi