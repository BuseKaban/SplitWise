import { IonAvatar, IonContent, IonHeader, IonItem, IonLabel, IonList, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import { useEffect, useState } from 'react';
import { GetGroupsKeys, GetTransactions, Transaction, currentUser } from '../utils/Users';
import { amountFormatter, getUserNameById } from '../utils/Utils';
import { format } from 'date-fns';
import "./Tab3.scss";

const Tab3: React.FC = () => {

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const currentYear = new Date().getUTCFullYear();

  useEffect(() => {
    GetGroupsKeys().then((groupKeys) => {
      groupKeys.forEach((groupKey) => {

        const transactionPromiseList = [];
        transactionPromiseList.push(GetTransactions(groupKey));

        const transactionList = [] as Transaction[]
        Promise.all(transactionPromiseList).then(transactionResult => {

          transactionResult.forEach(result => transactionList.push(...result));

          transactionList.sort((transactionA, transactionB) => { return transactionA.date < transactionB.date ? 1 : -1 })
          setTransactions(transactionList);
        })
      })
    })
  }, [])

  function isOwner(userId: string) {
    return userId == currentUser.id;
  }

  function getDateLabel(transaction: Transaction) {
    return (transaction.date.getUTCFullYear() > currentYear - 1) ?
      <IonLabel slot='end' className='ion-text-center font-extrabold'>
        <p>{format(transaction.date, 'dd')}</p>
        <p>{format(transaction.date, 'LLLL')}</p>
      </IonLabel>
      :
      <IonLabel slot='end' className='ion-text-center font-extrabold'>
        <p>{format(transaction.date, 'dd MMM yyyy')}</p>
      </IonLabel>
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Activity</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Tab 3</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonList>
          {transactions.map(transaction =>
            <IonItem key={transaction.id} className={transaction.owner == currentUser.id ? "owner" : "nonowner"}>
              <IonAvatar slot="start">
                <img alt="Silhouette of a person's head" src="https://ionicframework.com/docs/img/demos/avatar.svg" />
              </IonAvatar>
              <IonLabel>
                <h3>{isOwner(transaction.owner) ? "Sen" : getUserNameById(transaction.owner)} / {transaction.groupName}</h3>
                <p className='amount'>{amountFormatter(transaction.amount)} ödendi</p>
              </IonLabel>
              {
                getDateLabel(transaction)
              }
            </IonItem>
          )}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Tab3;
