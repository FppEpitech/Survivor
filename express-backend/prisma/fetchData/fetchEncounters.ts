import fetch from 'node-fetch';
import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

async function fetchEncounters(access_token : string) {
    try {

        let id = 1;
        let moreEncounters = true;

        while (moreEncounters) {

            const existingCustomer = await prisma.encounter.findFirst({
                where: {old_id: id},
            });

            if (!existingCustomer) {
                const EncountersResponse = await fetch(`${process.env.SOULCONNECTION_PROD_API_URL}/api/encounters/${id}`, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'X-Group-Authorization': process.env.GROUP_AUTHO as string,
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${access_token}`,
                    },
                });

                const encounter = await EncountersResponse.json();

                if (EncountersResponse.ok) {
                    const customer = await prisma.customer.findUnique({
                        where: { old_id: encounter.customer_id },
                    });

                    if (customer) {
                        await prisma.encounter.create({
                            data: {
                                old_id: encounter.id,
                                customer_id: customer.id,
                                date: encounter.date,
                                rating: encounter.rating,
                                comment: encounter.comment,
                                source: encounter.source,
                            },
                        });
                        console.log(`Encounter with id ${id} has been created.`);
                    } else {
                        console.error(`Customer with old_id ${encounter.customer_id} not found.`);
                    }

                } else {
                    throw new Error(`Invalid format for clothes data for Encounter ID ${id}`);
                }
            } else {
                console.log(`Encounter with id ${id} already exists.`);
            }

            id++;
        }
    } catch (error) {
        console.error('Error fetching and storing data:', error);
    }
}


export default fetchEncounters;
