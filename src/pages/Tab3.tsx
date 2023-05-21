import { IonAvatar, IonContent, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { useEffect, useState } from 'react';
import { GetAllTransactions, GetGroupsKeys, GetTransactions, Transaction, currentUser } from '../utils/Users';
import { amountFormatter, getUserNameById } from '../utils/Utils';
import { format, set } from 'date-fns';
import "./Tab3.scss";
import { peopleOutline } from 'ionicons/icons';
import { DownloadImage } from '../utils/Users';

const Tab3: React.FC = () => {

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [photos, setGroupPhotos] = useState<{ key: string, dataUrl: string }[]>([]);
  const currentYear = new Date().getUTCFullYear();

  useEffect(() => {
    GetAllTransactions().then(results => {

      const groupKeys = new Set(results.map(t => t.groupID));

      groupKeys.forEach(key => DownloadImage(key).then((value) => value ? setGroupPhotos([...photos, { key: key, dataUrl: value }]) : null))

      const sortedList = results.sort((transactionA, transactionB) => { return transactionA.date < transactionB.date ? 1 : -1 })
      setTransactions(sortedList);
    })
  }, [])

  function isOwner(userId: string) {
    if (currentUser) {
      return currentUser.id == userId
    }

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
          <IonTitle>Detaylar</IonTitle>
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
            <IonItem key={transaction.id} className={isOwner(transaction.owner) ? "owner" : "nonowner"} routerLink={"/tabs/groups/detail/" + transaction.groupID}>
              {photos.find(photo => photo.key == transaction.groupID) ?
                <IonAvatar slot="start" className='group-list-item-avatar'>
                  <img alt="Group Icon" src={photos.find(photo => photo.key == transaction.groupID)?.dataUrl} />
                </IonAvatar>
                :
                <IonIcon className='bg-green-100 p-3 rounded-2xl mr-4 group-list-item-icon' slot='start' icon={peopleOutline} color="primary"></IonIcon>
              }
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
