import fetch from 'node-fetch';
import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

async function fetchCustomers(access_token : string) {
    try {

        let id = 1;
        let moreCustomers = true;

        while (moreCustomers) {

            const existingCustomer = await prisma.customer.findFirst({
                where: {old_id: id},
            });

            if (!existingCustomer) {
                const CustomersResponse = await fetch(`${process.env.SOULCONNECTION_PROD_API_URL}/api/customers/${id}`, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'X-Group-Authorization': process.env.GROUP_AUTHO as string,
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${access_token}`,
                    },
                });

                const customer = await CustomersResponse.json();

                if (CustomersResponse.ok) {

                    const CustomersClotheResponse = await fetch(`${process.env.SOULCONNECTION_PROD_API_URL}/api/customers/${id}/clothes`, {
                        method: 'GET',
                        headers: {
                            'Accept': 'application/json',
                            'X-Group-Authorization': process.env.GROUP_AUTHO as string,
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${access_token}`,
                        },
                    });

                    const customersClothe = await CustomersClotheResponse.json();

                    if (Array.isArray(customersClothe) || typeof customersClothe === 'object') {
                        await prisma.customer.create({
                            data: {
                                old_id: customer.id,
                                email: customer.email,
                                name: customer.name,
                                surname: customer.surname,
                                birth_date: customer.birth_date,
                                gender: customer.gender,
                                description: customer.description,
                                astrological_sign: customer.astrological_sign,
                                coach_id: -1,
                                clothes: customersClothe,
                            },
                        });

                        console.log(`Customer with id ${id} has been created.`);
                    } else {
                        throw new Error(`Invalid format for clothes data for customer ID ${id}`);
                    }
                } else if (CustomersResponse.status === 404) {
                    moreCustomers = false;
                } else {
                    throw new Error(`Failed to fetch clothes with ID ${id}. Status: ${CustomersResponse.status}`);
                }
            } else {
                console.log(`Customer with id ${id} already exists.`);
            }

            id++;
        }
    } catch (error) {
        console.error('Error fetching and storing data:', error);
    }
}


export default fetchCustomers;
