import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();
const BATCH_SIZE = 10;

async function fetchCustomersById(id: number, access_token: string) {
    try {
            const existingCustomer = await prisma.customer.findFirst({
                where: { old_id: id },
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

                    const imageResponse = await fetch(`${process.env.SOULCONNECTION_PROD_API_URL}/api/customers/${id}/image`, {
                        method: 'GET',
                        headers: {
                            'Accept': 'image/png',
                            'X-Group-Authorization': process.env.GROUP_AUTHO as string,
                            'Authorization': `Bearer ${access_token}`,
                        },
                    });

                    let imageUrl = "";

                    if (imageResponse.ok) {
                        const arrayBuffer = await imageResponse.arrayBuffer();
                        const buffer = await Buffer.from(arrayBuffer);
                        const uuid = await uuidv4();
                        const savedImage = await prisma.image.create({
                            data: {
                                uuid: uuid,
                                data: buffer,
                            },
                        });
                        imageUrl = `assets/${savedImage.uuid}`;
                    } else {
                        console.log(`Image not available for customer ID ${id}, proceeding with an empty URL.`);
                    }

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
                                image_url: imageUrl,
                                payment_ids: [],
                                clothes: customersClothe,
                                phone_number: customer.phone_number,
                                address: customer.address,
                            },
                        });

                        console.log(`Customer with id ${id} has been created.`);
                    } else {
                        throw new Error(`Invalid format for clothes data for customer ID ${id}`);
                    }

                } else {
                    throw new Error(`Failed to fetch customer with ID ${id}. Status: ${CustomersResponse.status}`);
                }
            } else {
                console.log(`Customer with id ${id} already exists.`);
            }
    } catch (error) {
        console.error('Error fetching and storing data:', error);
    }
}

async function fetchCustomers(access_token: string) {
    try {
      let id = 1;
      let moreCustomers = true;

      while (moreCustomers) {
        const tasks = [];
        for (let i = 0; i < BATCH_SIZE; i++) {
          tasks.push(fetchCustomersById(id + i, access_token));
        }

        const results = await Promise.all(tasks);

        if (results.some(result => result === null)) {
          moreCustomers = false;
        }

        id += BATCH_SIZE;
      }
    } catch (error) {
      console.error('Error fetching and storing data:', error);
    }
  }

export default fetchCustomers;
