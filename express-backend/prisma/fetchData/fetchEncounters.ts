import fetch from 'node-fetch';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const BATCH_SIZE = 10; // Nombre de requêtes parallèles

async function fetchEncounterById(id: number, access_token: string) {
  const existingEncounter = await prisma.encounter.findFirst({
    where: {old_id: id},
  });

  if (!existingEncounter) {
    const EncountersResponse = await fetch(`${process.env.SOULCONNECTION_PROD_API_URL}/api/encounters/${id}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'X-Group-Authorization': process.env.GROUP_AUTHO as string,
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${access_token}`,
      },
    });

    if (!EncountersResponse.ok) {
      if (EncountersResponse.status === 404)
      throw new Error(`Failed to fetch encounter with ID ${id}. Status: ${EncountersResponse.status}`);
    }

    const encounter = await EncountersResponse.json();

    const customer = await prisma.customer.findFirst({
      where: {old_id: encounter.customer_id},
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
    console.log(`Encounter with id ${id} already exists.`);
  }
}

async function fetchEncounters(access_token: string) {
  try {
    let id = 1;
    let moreEncounters = true;

    while (moreEncounters) {
      const tasks = [];
      for (let i = 0; i < BATCH_SIZE; i++) {
        tasks.push(fetchEncounterById(id + i, access_token));
      }

      const results = await Promise.all(tasks);

      if (results.some(result => result === null)) {
        moreEncounters = false;
      }

      id += BATCH_SIZE;
    }
  } catch (error) {
    console.error('Error fetching and storing data:', error);
  }
}

export default fetchEncounters;
