import { IonBackButton, IonButtons, IonContent, IonHeader, IonList, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { RouteComponentProps, useHistory, useLocation } from 'react-router';
import { GetTransactions, GroupSummary, Transaction } from '../utils/Users';
import TransactionListItem from '../components/TransactionListItem/TransactionListItem';
import GroupListItem from '../components/GroupListItem/GroupListItem';


interface GroupDetailPageProps
  extends RouteComponentProps<{
    id: string;
  }> { }


const GroupDetailPage: React.FC<GroupDetailPageProps> = ({ match }) => {

  const [results, setResults] = useState([] as Transaction[]);
  const history = useHistory<GroupSummary>();

  useEffect(() => {
    GetTransactions("C4HRflhAi8gLJiTu4uuK").then((result) => {
      setResults(result);
    })
  }, []);


  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="#"></IonBackButton>
          </IonButtons>
          <GroupListItem
            imagePath={''} groupName={history.location.state?.GroupName} totalOwe={history.location.state?.SummaryAmount} details={history.location.state?.Details}></GroupListItem>
        </IonToolbar>
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

      </IonContent>
    </IonPage>
  );
};
export default GroupDetailPage;
