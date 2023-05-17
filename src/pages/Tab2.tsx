import { IonContent, IonHeader, IonItem, IonList, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import './Tab2.css';
import { useEffect, useState } from 'react';
import { Friend, GetFriends } from '../utils/Users';


const Tab2: React.FC = () => {

  const [friends, setFriends] = useState<Friend[]>([])

  useEffect(() => {
    GetFriends().then((allfriends) => {
      setFriends(allfriends)
    }
    )
  }, []);

  return (

    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Friends</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Tab 2</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonList>
          {friends.map((friend) =>
            <IonItem>{friend.username}</IonItem>
          )}
        </IonList>
        <ExploreContainer name="Arkadaş listesi yapılacak" />
      </IonContent>
    </IonPage>
  );
};

export default Tab2;
