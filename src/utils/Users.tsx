import { DocumentSnapshot, Firestore, Timestamp, addDoc, collection, doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { firestore } from "../firebase";
import { getUserNameById } from "./Utils";

interface User {
    id: string,
    username: string,
    password: string,
}

export interface Friend {
    id: string,
    username: string,
}

interface Group {
    name: string,
    transactions: Transaction[],
    users: User[]
}


export interface Transaction {
    groupID: string;
    id: string,
    date: Date,
    name: string,
    owner: string,
    splitters: string[],
    type: string,
    amount: number,
    groupName: string
}

export interface GroupSummary {
    GroupID: string,
    GroupName: string,
    SummaryAmount: number,
    Details: Map<string, number>
}

export const users: User[] = [
    {
        id: "DSuSrhD3OwmwgWNtLznz",
        username: "eftelya",
        password: "1",
    },
    {
        id: "gtL8uFDNi6or9gikZCqE",
        username: "baran",
        password: "1",
    },
    {
        id: "7PoyHeON9BwJUi7PnGVh",
        username: "yigit",
        password: "1"

    }
]
export const setCurrentUser = (user: User) => { currentUser = user };
//dahas onra
export let currentUser = users[0];

export const GetGroupsKeys = () => {
    return new Promise<string[]>((resolve, reject) => {
        const docRef = doc(firestore, "users", currentUser.id);
        getDoc(docRef).then((result) => {
            //console.log(result.get("groups"));
            resolve(result.get("groups"));
        });
    })
}

export const GetTransactions = (groupID: string) => {
    return new Promise<Transaction[]>((resolve, reject) => {
        //firebase linki veriyor gibi düşün
        const groupsDocRef = doc(firestore, "groups", groupID);
        getDoc(groupsDocRef).then((groupData) => {
            const transactionsKeys = groupData.get("transactions");
            const groupName = groupData.get("name");

            const promiseArray: Promise<DocumentSnapshot>[] = [];

            transactionsKeys.forEach((element: string) => {
                const transactionDocRef = doc(firestore, "transactions", element);
                promiseArray.push(getDoc(transactionDocRef));
            });

            Promise.all(promiseArray).then((transactionArray) => {
                const transactions = transactionArray.map(transactionSnapshot => {
                    return {
                        id: transactionSnapshot.id,
                        amount: transactionSnapshot.get("amount"),
                        date: transactionSnapshot.get("date").toDate(),
                        name: transactionSnapshot.get("name"),
                        owner: transactionSnapshot.get("owner"),
                        splitters: transactionSnapshot.get("splitters"),
                        type: transactionSnapshot.get("type"),
                        groupName: groupName,
                        groupID: groupID
                    } as Transaction
                })
                resolve(transactions);
            });
        });

    })
}

export const GetSummary = (groupID: string) => {
    return new Promise<GroupSummary>((resolve, reject) => {
        const groupsDocRef = doc(firestore, "groups", groupID);
        getDoc(groupsDocRef).then((result) => {
            let amount = 0;
            let owes = new Map<string, number>();

            const resolvedPromisesArray: Promise<any>[] = [];

            const transactions = result.get("transactions");
            transactions.forEach((transaction: string) => {
                const transactionDocRef = doc(firestore, "transactions", transaction);
                resolvedPromisesArray.push(getDoc(transactionDocRef));
            });

            Promise.all(resolvedPromisesArray).then((values) => {
                values.forEach((result) => {
                    const transactionAmount = result.get("amount") as number;
                    const transactionOwner = result.get("owner") as string;
                    const splitters = result.get("splitters") as string[];

                    const isCurrentUserOwner = transactionOwner == currentUser.id;
                    if (isCurrentUserOwner) {
                        const owe = transactionAmount / splitters.length;
                        amount += owe;
                        splitters.filter(splitter => splitter != currentUser.id).forEach(splitter => {

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

export const GetFriends = () => {
    return new Promise<Friend[]>((resolve, reject) => {
        //firebase linki veriyor gibi düşün
        const userDocRef = doc(firestore, "users", currentUser.id);
        //onSnapshot(collection(firestore, "groups"), (doc) => console.log(doc))
        getDoc(userDocRef).then((userData) => {
            const friendsKeys = userData.get("friends") as string[];
            const friends = friendsKeys.map(key => {
                return {
                    id: key,
                    username: getUserNameById(key)
                } as Friend
            });

            resolve(friends);
        });

    })
}

export const AddGroup = (groupName: string, friends: Friend[]) => {
    const groupUsers = [currentUser.id, ...friends.map(f => f.id)]

    const groupColRef = collection(firestore, "groups");
    addDoc(groupColRef, { name: groupName, users: groupUsers, transactions: [] as string[] }).then(groupData => {
        groupUsers.forEach(user => {
            const userDocRef = doc(firestore, "users", user);
            getDoc(userDocRef).then((userData) => {
                const groups = userData.get("groups") as string[];
                updateDoc(userDocRef, { "groups": [...groups, groupData.id] });
            });
        })

    })

}

export const onGroupsChanged = (handler: any) => {
    onSnapshot(doc(firestore, "users", currentUser.id), { includeMetadataChanges: true }, (doc) => {
        if (doc.metadata.hasPendingWrites) return
        handler()
    })

}


export const GetAllSummaries = () => {

    return new Promise<GroupSummary[]>((resolve, reject) => {

        GetGroupsKeys().then(keys => {
            const allSummaryPromiseList: Promise<GroupSummary>[] = [];
            keys.forEach(anahtar => allSummaryPromiseList.push(GetSummary(anahtar)));
            Promise.all(allSummaryPromiseList).then(groupSummaryList => resolve(groupSummaryList));
        });
    });
}

export const AddTransaction = (transaction: Transaction) => {

    const groupColRef = collection(firestore, "transactions");
    addDoc(groupColRef, transaction);


}
