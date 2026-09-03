'use server';

// import { objectToText } from "@/utils/other";

const N8N_EMAILER_WEBHOOK_URL = process.env.N8N_EMAILER_WEBHOOK_URL || process.env.N8N_WEBHOOK_URL;
const N8N_EMAILER_API_KEY = process.env.N8N_EMAILER_API_KEY;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

export const sendEmailServer = async (data = '') => {
    try {
        // console.log('sendEmailServer: ', data);
        if (!N8N_EMAILER_WEBHOOK_URL) {
            throw new Error('N8N_EMAILER_WEBHOOK_URL is not defined');
        }
        const response = await fetch(N8N_EMAILER_WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': N8N_EMAILER_API_KEY
            },
            body: JSON.stringify({
                subject: 'Contact Form',
                sendTo: ADMIN_EMAIL,
                data: data
            }),
        });
        console.log('response.ok: ', response.ok);


        if (!response.ok) {
            throw new Error(`Error sendEmailServer: ${response.statusText}`);
        }
        console.log('Email sent successfully');

    } catch (error) {
        console.error('Error sendEmailServer:', error);

    }
};