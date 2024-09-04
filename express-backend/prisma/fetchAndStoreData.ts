import fetch from 'node-fetch';
import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

async function fetchDataAndStore() {
    try {
        const response = await fetch(`${process.env.SOULCONNECTION_PROD_API_URL}/api/employees/login`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'X-Group-Authorization': process.env.GROUP_AUTHO as string,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: process.env.API_EMAIL,
                password: process.env.API_PASSWORD
            })
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        const tipsResponse = await fetch(`${process.env.SOULCONNECTION_PROD_API_URL}/api/tips`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'X-Group-Authorization': process.env.GROUP_AUTHO as string,
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${data.access_token}`,
            },
        });

        if (!tipsResponse.ok) {
            throw new Error(`HTTP error! status: ${tipsResponse.status}`);
        }

        const tips = await tipsResponse.json();

        // Parcourir les données et insérer les nouveaux éléments
        for (const tip of tips) {
            console.log(tip);
            const existingTip = await prisma.tip.findUnique({
                where: {id: tip.id},
            });
        }
        console.log('Data fetched and stored successfully.');
    } catch (error) {
        console.error('Error fetching and storing data:', error);
    }
}

// Appel initial de la fonction
fetchDataAndStore();

