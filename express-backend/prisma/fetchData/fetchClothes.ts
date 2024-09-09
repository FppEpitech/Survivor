import {PrismaClient} from '@prisma/client';
import {v4 as uuidv4} from 'uuid';

const prisma = new PrismaClient();

async function fetchClothes(access_token : string) {
    try {
        let id = 1;
        let moreClothes = true;

        while (moreClothes) {

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
            } else {
                console.log(`Clothe with id ${id} already exists.`);
            }

            id++;
        }

    } catch (error) {
        console.error('Error fetching and storing data:', error);
    }
}

export default fetchClothes;
