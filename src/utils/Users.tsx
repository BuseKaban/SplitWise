import { doc, getDoc } from "firebase/firestore";
import { firestore } from "../firebase";

interface User {
    id: string,
    username: string,
    password: string,
}

interface Group {
    name: string,
    transactions: Transaction[],
    users: User[]
}

interface Transaction {
    date: Date,
    name: string,
    owner: string,
    splitters: string[],
    type: string
}

interface GroupSummary {
    GroupID: string,
    GroupName: string,
    SummaryAmount: number,
    Details: Map<string, number>
}

export const users: User[]= [
    {
        id: "DSuSrhD3OwmwgWNtLznz",
        username: "eftelya",
        password: "1",
    },
    {
        id: "gtL8uFDNi6or9gikZCqE",
        username: "baran",
        password: "1",
    }
]

export const GetGroupsByUser = () => {
    return new Promise<string[]>((resolve, reject) => {
        const docRef = doc(firestore, "users", users[0].id);
        getDoc(docRef).then((result)=> {
            console.log(result.get("groups"));
            resolve(result.get("groups"));
        });
    })
}

export const GetSummary = (groupID: string) => {
    return new Promise<GroupSummary>((resolve, reject) => {
        const groupsDocRef = doc(firestore, "groups", groupID);
        getDoc(groupsDocRef).then((result)=> {
            let amount = 0;
            let owes = new Map<string, number>();
            
            const resolvedPromisesArray: Promise<any>[] = [];

            const transactions = result.get("transactions");
            transactions.forEach((transaction: string) => {
                const transactionDocRef = doc(firestore, "transactions", transaction);
                resolvedPromisesArray.push( getDoc(transactionDocRef));
            });

            Promise.all(resolvedPromisesArray).then((values) => {
                values.forEach((result) => {
                        const transactionAmount = result.get("amount") as number;
                        const transactionOwner = result.get("owner") as string;
                        const splitters = result.get("splitters") as string[];
    
                        const isCurrentUserOwner = transactionOwner == users[0].id;
                        if(isCurrentUserOwner) {
                            amount += transactionAmount
                            splitters.forEach(splitter => {
                                const owe = transactionAmount / splitters.length;
                                const oweAmount = owes.get(splitter) ?? 0;
                                owes.set(splitter, oweAmount - owe);
                            })
                        } else {
                            const owe = transactionAmount / splitters.length;
                            amount -= owe;
                            
                            const oweAmount = owes.get(transactionOwner) ?? 0;
                            owes.set(transactionOwner, oweAmount + owe);
                        }
    
                });
            }).then(() => {
                resolve({
                    Details: owes,
                    GroupID: groupID,
                    GroupName: result.get("name"),
                    SummaryAmount: amount,
                });
            });


        
         
        });
        
    })
}
