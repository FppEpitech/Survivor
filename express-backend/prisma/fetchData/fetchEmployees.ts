import fetch from 'node-fetch';
import {PrismaClient} from '@prisma/client';
import fs from 'fs';
import path from 'path';
import {v4 as uuidv4} from 'uuid';

const prisma = new PrismaClient();

async function fetchEmployees(access_token : string) {
    try {

        let id = 1;
        let moreEmployees = true;

        while (moreEmployees) {

            const existingEmployee = await prisma.employee.findFirst({
                where: {old_id: id},
            });

            if (!existingEmployee) {
                const EmployeesResponse = await fetch(`${process.env.SOULCONNECTION_PROD_API_URL}/api/employees/${id}`, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'X-Group-Authorization': process.env.GROUP_AUTHO as string,
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${access_token}`,
                    },
                });

                const employee = await EmployeesResponse.json();

                if (EmployeesResponse.ok) {

                    const imageResponse = await fetch(`${process.env.SOULCONNECTION_PROD_API_URL}/api/employees/${id}/image`, {
                        method: 'GET',
                        headers: {
                            'Accept': 'image/png',
                            'X-Group-Authorization': process.env.GROUP_AUTHO as string,
                            'Authorization': `Bearer ${access_token}`,
                        },
                    });

                    if (imageResponse.ok) {
                        const arrayBuffer = await imageResponse.arrayBuffer();
                        const buffer = Buffer.from(arrayBuffer);
                        const fileName = `${uuidv4()}.png`;
                        const filePath = path.join(__dirname, "../..", 'assets', fileName);
                        fs.writeFileSync(filePath, buffer);

                        await prisma.employee.create({
                            data: {
                                old_id: employee.id,
                                email: employee.email,
                                name: employee.name,
                                surname: employee.surname,
                                birth_date: employee.birth_date,
                                gender: employee.gender,
                                work: employee.work,
                                hashed_password: "",
                                image_url: `assets/${fileName}`
                            },
                        });
                        console.log(`Employee with id ${id} has been created.`);
                    }
                } else if (EmployeesResponse.status === 404) {
                    moreEmployees = false;
                } else {
                    throw new Error(`Failed to fetch clothes with ID ${id}. Status: ${EmployeesResponse.status}`);
                }
            } else {
                console.log(`Employee with id ${id} already exists.`);
            }

            id++;
        }
    } catch (error) {
        console.error('Error fetching and storing data:', error);
    }
}


export default fetchEmployees;
