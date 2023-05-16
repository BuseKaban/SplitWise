import { users } from "./Users"

export const getUserNameById = (id: string) => {
    return users.find(user => user.id == id)?.username ?? "User Doesnt Exist";
}

export const amountFormatter = (amount: number, minimumFractionDigits = 2, maximumFractionDigits = minimumFractionDigits) => {
    return new Intl.NumberFormat(
        'tr-TR',
        {
            style: 'currency',
            currency: "TRY",
            maximumFractionDigits: maximumFractionDigits,
            minimumFractionDigits: minimumFractionDigits
        }).format(amount);
}

