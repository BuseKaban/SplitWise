import { IonContent, IonHeader, IonList, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router';
import { GetTransactions, Transaction } from '../utils/Users';
import TransactionListItem from '../components/TransactionListItem/TransactionListItem';


interface GroupDetailPageProps
  extends RouteComponentProps<{
    id: string;
  }> { }


const GroupDetailPage: React.FC<GroupDetailPageProps> = ({ match }) => {

  let [results, setResults] = useState([] as Transaction[]);


  useEffect(() => {
    GetTransactions("C4HRflhAi8gLJiTu4uuK").then((result) => {
      setResults(result);
    })
  }, []);


  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>GroupDetailPage</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">Group {match.params.id}
        <IonList>
          {
            results.map(transaction =>

              <TransactionListItem key={transaction.id}
                //routerLink={"/groups/detail/" + transaction.GroupID}
                date ={transaction.date}
                imagePath={''}
                transactionName={transaction.name}
                oweAmount={transaction.amount}
                transactionOwnerID={transaction.owner}/>

            )
          }
        </IonList>
      </IonContent>
    </IonPage>
  );
};
export default GroupDetailPage;
