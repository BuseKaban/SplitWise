import { IonBackButton, IonButtons, IonContent, IonHeader, IonList, IonPage, IonTitle, IonToolbar, useIonAlert } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router';
import { GetSummary, GetTransactions, GroupSummary, RemoveTransaction, Transaction, currentUser, onGroupsChanged } from '../utils/Users';
import TransactionListItem from '../components/TransactionListItem/TransactionListItem';
import GroupListItem from '../components/GroupListItem/GroupListItem';
import TransactionModal from '../components/Modal/TransactionModal';

import "./GroupDetailPage.scss"


interface GroupDetailPageProps
  extends RouteComponentProps<{
    id: string;
  }> { }


const GroupDetailPage: React.FC<GroupDetailPageProps> = ({ match }) => {

  const [results, setResults] = useState([] as Transaction[]);
  const [summary, setSummary] = useState<GroupSummary>()

  useEffect(() => {
    onGroupsChanged(() => {
      GetSummary(match.params.id).then((result) => {
        setSummary(result);
      })

      GetTransactions(match.params.id).then((result) => {
        setResults(result);
      })
    })

  }, []);

  const [presentAlert] = useIonAlert();

  function confirmDeletion(transaction: Transaction): void {
    presentAlert({
      mode: "ios",
      header: 'Ödemeyi Temizle',
      message: 'Bu ödemeyi bölüştüyseniz veya ödeme yanlış bilgiler içeriyorsa ödemeyi temizleyin.',
      buttons: [
        {
          id: "test2",
          text: "Temizle",
          role: "destructive",
          handler: () => RemoveTransaction(transaction)
        },
      ],
    })
  }

  function getOweAmount(transaction: Transaction): number {

    if (transaction.owner == currentUser!.id) {
      return transaction.amount / transaction.splitters.length * (transaction.splitters.length - 1);
    } else if (transaction.splitters.find(user => user == currentUser!.id)) {
      return transaction.amount / transaction.splitters.length;
    } else {
      return 0;
    }
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot='start'>
            <IonBackButton defaultHref="#"></IonBackButton>
            <IonTitle>Grup Detayları</IonTitle>
          </IonButtons>
        </IonToolbar>

      </IonHeader>
      <IonContent className="ion-padding">
        {summary?.GroupName &&
          <>
            <GroupListItem
              className='group-summary-header'
              lines='full'
              groupName={summary?.GroupName}
              totalOwe={summary?.SummaryAmount}
              details={summary?.Details}
              imagePath={summary?.Base64Image}
            ></GroupListItem>
            <IonList className='p-0 pt-4'>
              {
                results.map(transaction =>
                  <TransactionListItem key={transaction.id}
                    date={transaction.date}
                    transactionName={transaction.name}
                    totalAmount={transaction.amount}
                    oweAmount={getOweAmount(transaction)}
                    transactionOwnerID={transaction.owner}
                    onClick={() => confirmDeletion(transaction)}
                  />
                )
              }
            </IonList>
          </>
        }

        <TransactionModal groupId={match.params.id}></TransactionModal>

      </IonContent>
    </IonPage>
  );
};
export default GroupDetailPage;
