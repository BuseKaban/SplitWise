import { IonContent, IonHeader, IonPage,IonTitle, IonToolbar } from '@ionic/react';
import { doc, getDoc } from 'firebase/firestore';
import React from 'react';
import { RouteComponentProps } from 'react-router';
import { firestore } from '../firebase';
import { User } from '../interfaces/User';
import { GetGroupsByUser } from '../utils/Users';


interface GroupDetailPageProps
  extends RouteComponentProps<{
    id: string;
  }> {}


const GroupDetailPage: React.FC<GroupDetailPageProps> = ({ match }) => {
 
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>GroupDetailPage</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">Group {match.params.id}
       
      </IonContent>
    </IonPage>
  );
};
export default GroupDetailPage;