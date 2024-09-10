import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const BATCH_SIZE = 10;

async function fetchEventsById(id: number, access_token: string) {
    const existingEvent = await prisma.event.findFirst({
        where: {old_id: id},
    });

    if (!existingEvent) {
        const EventResponse = await fetch(`${process.env.SOULCONNECTION_PROD_API_URL}/api/events/${id}`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'X-Group-Authorization': process.env.GROUP_AUTHO as string,
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${access_token}`,
        },
        });

        if (!EventResponse.ok) {
            if (EventResponse.status === 404)
                throw new Error(`Failed to fetch event with ID ${id}. Status: ${EventResponse.status}`);
        }

        const event = await EventResponse.json();

        await prisma.event.create({
            data: {
            old_id: event.id,
            name: event.name,
            date: event.date,
            max_participants: event.max_participants,
            location_x: event.location_x,
            location_y: event.location_y,
            type: event.type,
            employee_id: event.employee_id,
            location_name: event.location_name,
            },
        });
        console.log(`Event with id ${id} has been created.`);
    } else {
        console.log(`Event with id ${id} already exists.`);
    }
}

async function fetchEvents(access_token: string) {
  try {
    let id = 1;
    let moreEncounters = true;

    while (moreEncounters) {
      const tasks = [];
      for (let i = 0; i < BATCH_SIZE; i++) {
        tasks.push(fetchEventsById(id + i, access_token));
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

export default fetchEvents;
