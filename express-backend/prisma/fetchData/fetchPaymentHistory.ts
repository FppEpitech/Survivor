import { PrismaClient, Customer } from '@prisma/client';

const prisma = new PrismaClient();

async function fetchPaymentHistoryByCustomerId(customer: Customer, access_token: string) {

    const PaymentHistoryResponse = await fetch(`${process.env.SOULCONNECTION_PROD_API_URL}/api/customers/${customer.old_id}/payments_history`, {
        method: 'GET',
        headers: {
        'Accept': 'application/json',
        'X-Group-Authorization': process.env.GROUP_AUTHO as string,
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${access_token}`,
        },
    });

    if (!PaymentHistoryResponse.ok) {
        throw new Error(`Failed to fetch payment history for customer ID ${customer.id}. Status: ${PaymentHistoryResponse.status}`);
    }

    const paymentHistories = await PaymentHistoryResponse.json();

    const paymentIds: number[] = [];

    for (const payment of paymentHistories) {

        const createdPayment = await prisma.paymentHistory.create({
        data: {
            old_id: payment.id,
            date: payment.date,
            payment_method: payment.payment_method,
            amount: payment.amount,
            comment: payment.comment,
            customer_id: customer.id,
        },
        });
        paymentIds.push(createdPayment.id);
    }

    await prisma.customer.update({
        where: { id: customer.id },
        data: {payment_ids: paymentIds},
    });

    console.log(`Payment histories for customer ID ${customer.id} have been stored.`);
}

async function fetchPaymentHistory(access_token: string) {
    try {
        const customers = await prisma.customer.findMany();

        for (const customer of customers) {
            await fetchPaymentHistoryByCustomerId(customer, access_token);
        }
    } catch (error) {
        console.error('Error fetching and storing payment histories:', error);
    }
}

export default fetchPaymentHistory;