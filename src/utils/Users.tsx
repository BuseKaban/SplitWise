import { DocumentSnapshot, Firestore, Timestamp, addDoc, collection, deleteDoc, doc, getDoc, getDocs, onSnapshot, query, updateDoc, where } from "firebase/firestore";
import { firestore, storage } from "../firebase";
import { getUserNameById } from "./Utils";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { UserPhoto } from "../hooks/PhotoGallery";
import { Photo } from "@capacitor/camera";
import { FirebaseError } from "firebase/app";

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
    Base64Image?: string;
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

export const setCurrentUser = (user: User | undefined) => { currentUser = user };

//dahas onra
export let currentUser: User | undefined = undefined;

export const GetGroupsKeys = () => {
    return new Promise<string[]>((resolve, reject) => {
        const docRef = doc(firestore, "users", currentUser!.id);
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

                    const isCurrentUserOwner = transactionOwner == currentUser!.id;
                    if (isCurrentUserOwner) {
                        const owe = transactionAmount / splitters.length * (splitters.length - 1);
                        amount += owe;
                        splitters.filter(splitter => splitter != currentUser!.id).forEach(splitter => {

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
            }).then(() =>
                DownloadImage(groupID).then(data => {
                    resolve({
                        Details: owes,
                        GroupID: groupID,
                        GroupName: result.get("name"),
                        SummaryAmount: amount,
                        Base64Image: data
                    });
                }));
        });

    })
}

export const GetFriends = () => {
    return new Promise<Friend[]>((resolve, reject) => {
        //firebase linki veriyor gibi düşün
        const userDocRef = doc(firestore, "users", currentUser!.id);
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

export const GetGroupUsers = (groupID: string) => {
    return new Promise<Friend[]>((resolve, reject) => {
        //firebase linki veriyor gibi düşün
        const groupDocRef = doc(firestore, "groups", groupID);
        //onSnapshot(collection(firestore, "groups"), (doc) => console.log(doc))
        getDoc(groupDocRef).then((groupData) => {
            const friendsKeys = groupData.get("users") as string[];
            const friends = friendsKeys.filter(key => key != currentUser!.id).map(key => {
                return {
                    id: key,
                    username: getUserNameById(key)
                } as Friend
            });

            resolve(friends);
        });

    })
}

export const AddGroup = (groupName: string, friends: Friend[], photo: UserPhoto) => {
    const groupUsers = [currentUser!.id, ...friends.map(f => f.id)]

    const groupColRef = collection(firestore, "groups");
    addDoc(groupColRef, { name: groupName, users: groupUsers, transactions: [] as string[] }).then(groupData => {
        groupUsers.forEach(user => {
            const userDocRef = doc(firestore, "users", user);
            getDoc(userDocRef).then((userData) => {
                const groups = userData.get("groups") as string[];
                updateDoc(userDocRef, { "groups": [...groups, groupData.id] });
            });
        })
        if (photo?.base64String)
            UploadImage(photo.base64String, groupData.id)

    })

}

export const onCurrentUserGroupListChanged = (handler: any) => {
    onSnapshot(doc(firestore, "users", currentUser!.id), { includeMetadataChanges: true }, (doc) => {
        if (doc.metadata.hasPendingWrites) return
        handler()
    })
}

export const onGroupsChanged = (handler: any) => {
    const groupsColRef = collection(firestore, "groups");
    const userGroupsQuery = query(groupsColRef, where("users", "array-contains", currentUser!.id));

    onSnapshot(userGroupsQuery, { includeMetadataChanges: true }, (changes) => {
        if (changes.metadata.hasPendingWrites) return
        handler();
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
    addDoc(groupColRef, transaction).then(addedTransction => {
        const groupDocRef = doc(firestore, "groups", transaction.groupID)
        getDoc(groupDocRef).then(groupData => {
            const transactions = groupData.get("transactions") as string[];
            updateDoc(groupDocRef, { transactions: [...transactions, addedTransction.id] });
        })
    });
}

export const RemoveTransaction = (transaction: Transaction) => {
    const transactionDocRef = doc(firestore, "transactions", transaction.id);
    const groupDocRef = doc(firestore, "groups", transaction.groupID);

    getDoc(groupDocRef).then((groupData) => {
        const transactions = groupData.get("transactions") as string[];
        updateDoc(groupDocRef, { transactions: transactions.filter(t => t != transaction.id) }).then(
            () => deleteDoc(transactionDocRef)
        );
    });
}

export const GetTransactionTypes = () => {
    return ["Fatura", "Kira", "Market", "Sağlık", "Eğitim", "Ulaşım", "Diğer"];
}

export const GetAllTransactions = () => {
    return new Promise<Transaction[]>((resolve, reject) => {
        const transactionsColRef = collection(firestore, "transactions");
        const userTransactionsQuery = query(transactionsColRef, where("splitters", "array-contains", currentUser!.id));

        const groupsColRef = collection(firestore, "groups");
        const userGroupsQuery = query(groupsColRef, where("users", "array-contains", currentUser!.id));

        let groups = new Map<string, string>();
        getDocs(userGroupsQuery).then(groupsSnapshot => {
            groupsSnapshot.forEach(groupData => {
                groups.set(groupData.id, groupData.get("name"))
            });

            const transactionList: Transaction[] = []
            getDocs(userTransactionsQuery).then(transactionsSnapshot => {
                transactionsSnapshot.forEach(transactionData => transactionList.push(
                    {
                        id: transactionData.id,
                        amount: transactionData.get("amount"),
                        date: transactionData.get("date").toDate(),
                        name: transactionData.get("name"),
                        owner: transactionData.get("owner"),
                        splitters: transactionData.get("splitters"),
                        type: transactionData.get("type"),
                        groupID: transactionData.get("groupID"),
                        groupName: groups.get(transactionData.get("groupID"))
                    } as Transaction
                ))

                resolve(transactionList);
            });
        });
    });
}


export const UploadImage = (base64: string, name: string) => {
    const storageRef = ref(storage, 'images/' + name);

    uploadString(storageRef, base64, "data_url").then((snapshot) => {
        console.log(base64);
    });
}

export const DownloadImage = (groupId: string) => {
    return new Promise<string | undefined>((resolve, reject) => {
        const storageRef = ref(storage, 'images/' + groupId);

        getDownloadURL(storageRef).then((data) => {
            resolve(data);
        }).catch((e: FirebaseError) => { resolve(undefined); });
    });
}
