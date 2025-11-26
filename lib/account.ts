import prisma from "@/lib/prisma";

/**
 * Generates a unique 9-digit bank account number.
 * It ensures the generated number does not already exist in the database.
 * @returns {Promise<string>} The unique 9-digit account number string.
 */
export async function generateUniqueAccount(): Promise<string> {
    const min = 100000000; 
    const max = 999999999; 
    let accountNumber: string;
    let exists = true;

    // Loop until a unique number is generated
    while (exists) {
        // Generate a random 9-digit number
        const number = Math.floor(Math.random() * (max - min + 1)) + min;
        accountNumber = number.toString();

        // Check if it exists in the database
        const existingAccount = await prisma.bankAccount.findUnique({
            where: { accountNumber: accountNumber },
            select: { accountNumber: true },
        });

        if (!existingAccount) {
            exists = false;
        }
    }

    return accountNumber!;
}