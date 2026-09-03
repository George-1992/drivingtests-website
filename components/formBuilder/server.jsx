'use server';

import { sendEmailServer } from "@/actions/main";

export const formHandler = async (formData) => {
    // console.log('Received form data: ', formData);
    sendEmailServer(formData);
};