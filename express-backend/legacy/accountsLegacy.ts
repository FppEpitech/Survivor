let fs = require('fs')
import path from 'path'
import { v4 } from 'uuid'

async function accountExistsLegacy(email : string, password : string) {
    try {
        const response = await fetch(`${process.env.SOULCONNECTION_PROD_API_URL}/api/employees/login`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'X-Group-Authorization': process.env.GROUP_AUTHO as string,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                password: password,
            }),
        });
        if (response.ok) {
            const data = await response.json();
            return data.access_token;
        } else {
            return undefined;
        }
    } catch (error) {
        return undefined;
    }
}

async function getLegacyProfile(access_token: string) {
    try {
        const response = await fetch(`${process.env.SOULCONNECTION_PROD_API_URL}/api/employees/me`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'X-Group-Authorization': process.env.GROUP_AUTHO as string,
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access_token}`,
            },
        });
        if (response.ok) {
            const data = await response.json();
            const legacyImage = await getMyLegacyImage(access_token, data.id)
            data.image_url = legacyImage;
            return data;
        } else {
            return undefined;
        }
    } catch (error) {
        console.log(error)
        return undefined;
    }
}


async function getMyLegacyImage(access_token: string, id : number) {
    try {
        const response = await fetch(`${process.env.SOULCONNECTION_PROD_API_URL}/api/employees/${id}/image`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'X-Group-Authorization': process.env.GROUP_AUTHO as string,
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access_token}`,
            },
        });
        if (response.ok) {
            const arrayBuffer = await response.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            const fileName = `${await v4()}.png`
            const filePath = await path.join(__dirname, "..", 'assets', fileName);
            fs.writeFileSync(filePath, buffer);
            return `assets/${fileName}`
        } else {
            return undefined;
        }
    } catch (error) {
        console.log(error)
        return undefined;
    }
}

export {
    accountExistsLegacy,
    getLegacyProfile
}
