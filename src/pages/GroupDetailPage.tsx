import { IonBackButton, IonButtons, IonContent, IonHeader, IonList, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { RouteComponentProps, useHistory, useLocation } from 'react-router';
import { GetSummary, GetTransactions, GroupSummary, Transaction } from '../utils/Users';
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
    GetTransactions(match.params.id).then((result) => {
      setResults(result);
    })

    GetSummary(match.params.id).then((result) => {
      setSummary(result);
    })
  }, []);


  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot='start'>
            <IonBackButton defaultHref="#"></IonBackButton>
            <IonTitle>Grup Detayları</IonTitle>
          </IonButtons>
        </IonToolbar>
        <GroupListItem
          className='group-summary-header'
          lines='none'
          groupName={summary?.GroupName}
          totalOwe={summary?.SummaryAmount}
          details={summary?.Details}
        ></GroupListItem>
      </IonHeader>
      <IonContent className="ion-padding">

        <IonList className='p-0'>
          {
            results.map(transaction =>
              <TransactionListItem key={transaction.id}
                //routerLink={"/groups/detail/" + transaction.GroupID}
                date={transaction.date}
                imagePath={'https://ionicframework.com/docs/img/demos/avatar.svg'}
                transactionName={transaction.name}
                totalAmount={transaction.amount}
                oweAmount={transaction.amount / transaction.splitters.length}
                transactionOwnerID={transaction.owner} />
            )
          }
        </IonList>
        <TransactionModal></TransactionModal>

      </IonContent>
    </IonPage>
  );
};
export default GroupDetailPage;
