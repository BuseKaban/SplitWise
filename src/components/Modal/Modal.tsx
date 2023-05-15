import { IonItem, IonAvatar, IonLabel, IonContent, IonImg, IonList, IonModal, IonSearchbar, IonFab, IonFabButton, IonIcon } from '@ionic/react';
import { addOutline } from 'ionicons/icons';

import { useRef } from 'react';




const Modal: React.FC = () => {
  const modal = useRef<HTMLIonModalElement>(null);
  return (

    <>
      <IonFab slot="fixed" vertical="bottom" horizontal="end">
        <IonFabButton id="open-modal" color={"success"}>
          <IonIcon icon={addOutline}></IonIcon>
        </IonFabButton>
      </IonFab>
      <IonModal ref={modal} trigger="open-modal" initialBreakpoint={0.75} breakpoints={[0, 0.75]}>
        <IonContent className="ion-padding">

        </IonContent>
      </IonModal>
    </>
  );

};

export default Modal;
