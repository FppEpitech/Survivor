import fetchTips from './fetchTips';
import fetchClothes from './fetchClothes';
import fetchCustomers from './fetchCustomers';
import fetchEmployees from './fetchEmployees';

async function get_token() {
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
        const token = data.access_token
        return token
    } catch (error) {
        console.log(error)
    };
}

async function main() {
    let token = await get_token();
    // await fetchTips(token);
    // await fetchClothes(token);
    await fetchCustomers(token);
    // await fetchEmployees(token);
}

main()
