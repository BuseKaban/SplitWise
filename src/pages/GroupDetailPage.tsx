import { IonBackButton, IonButtons, IonContent, IonHeader, IonList, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { RouteComponentProps, useHistory, useLocation } from 'react-router';
import { GetTransactions, GroupSummary, Transaction } from '../utils/Users';
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
  const history = useHistory<GroupSummary>();

  useEffect(() => {
    GetTransactions(match.params.id).then((result) => {
      setResults(result);
    })
  }, []);


  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot='start'>
            <IonBackButton defaultHref="#"></IonBackButton>
          </IonButtons>
        </IonToolbar>
        <GroupListItem
          className='group-summary-header'
          lines='none'
          imagePath={'https://ionicframework.com/docs/img/demos/avatar.svg'}
          groupName={history.location.state?.GroupName}
          totalOwe={history.location.state?.SummaryAmount}
          details={history.location.state?.Details}
        ></GroupListItem>
      </IonHeader>
      <IonContent className="ion-padding">

        <IonList>
          {

            results.map(transaction =>

              <TransactionListItem key={transaction.id}
                //routerLink={"/groups/detail/" + transaction.GroupID}
                date={transaction.date}
                imagePath={''}
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
