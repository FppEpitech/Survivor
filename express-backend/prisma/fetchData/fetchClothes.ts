import {PrismaClient} from '@prisma/client';
import {v4 as uuidv4} from 'uuid';

const prisma = new PrismaClient();

async function fetchClothes(access_token: string) {
    const MAX_RETRIES = 3;

    try {
        let id = 1;
        let moreClothes = true;

        while (moreClothes) {
            let retries = 0;
            let success = false;

            while (retries < MAX_RETRIES && !success) {
                try {
                    const existingClothe = await prisma.clothe.findFirst({
                        where: {old_id: id},
                    });

                    if (!existingClothe) {
                        const clothesResponse = await fetch(`${process.env.SOULCONNECTION_PROD_API_URL}/api/clothes/${id}/image`, {
                            method: 'GET',
                            headers: {
                                'Accept': 'image/png',
                                'X-Group-Authorization': process.env.GROUP_AUTHO as string,
                                'Authorization': `Bearer ${access_token}`,
                            },
                        });

                        if (clothesResponse.ok) {
                            const arrayBuffer = await clothesResponse.arrayBuffer();
                            const buffer = await Buffer.from(arrayBuffer);
                            const uuid = await uuidv4();
                            const savedImage = await prisma.image.create({
                                data: {
                                    uuid: uuid,
                                    data: buffer,
                                },
                            });

                            await prisma.clothe.create({
                                data: {
                                    old_id: id,
                                    type: `assets/${savedImage.uuid}`,
                                },
                            });
                            console.log(`Image ${id} saved as assets/${savedImage.uuid}`);
                        } else if (clothesResponse.status === 404) {
                            moreClothes = false;
                        } else {
                            throw new Error(`Failed to fetch clothes with ID ${id}. Status: ${clothesResponse.status}`);
                        }
                    }
                } catch (error) {
                    retries++;
                    if (retries >= MAX_RETRIES) {
                        console.error(`Failed to fetch clothes with ID ${id} after ${MAX_RETRIES} retries.`);
                        break;
                    } else {
                        console.warn(`Retrying fetch for clothes with ID ${id} (attempt ${retries + 1})...`);
                    }
                }
            }

            id++;
        }
    } catch (error) {
        console.error('Error fetching and storing data:', error);
    }
}


export default fetchClothes;
