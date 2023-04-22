import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import React from 'react';
import { RouteComponentProps } from 'react-router';

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
      <IonContent className="ion-padding">Group {match.params.id}</IonContent>
    </IonPage>
  );
};
export default GroupDetailPage;