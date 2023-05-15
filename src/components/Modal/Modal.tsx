import { IonItem, IonAvatar, IonLabel, IonContent, IonImg, IonList, IonModal, IonSearchbar, IonFab, IonFabButton, IonIcon, IonButton, IonInput } from '@ionic/react';
import { addOutline } from 'ionicons/icons';

import { useRef, useState } from 'react';
import { UserPhoto, usePhotoGallery } from '../../hooks/PhotoGallery';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';





const Modal: React.FC = () => {
  const [photo, setPhoto] = useState<UserPhoto>();

  const takePhoto = async () => {
    const photo = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100,
    });

    const fileName = new Date().getTime() + ".jpeg";
    const newPhoto = {
      filepath: fileName,
      webviewPath: photo.webPath
    }
    setPhoto(newPhoto);
  };
  const modal = useRef<HTMLIonModalElement>(null);
  const data = [
    'Amsterdam',
    'Buenos Aires',
    'Cairo',
    'Geneva',
    'Hong Kong',
    'Istanbul',
    'London',
    'Madrid',
    'New York',
    'Panama City',
  ];

  let [results, setResults] = useState([...data]);

  const handleInput = (ev: Event) => {
    let query = '';
    const target = ev.target as HTMLIonSearchbarElement;
    if (target) query = target.value!.toLowerCase();

    setResults(data.filter((d) => d.toLowerCase().indexOf(query) > -1));
  };
  return (

    <>
      <IonFab slot="fixed" vertical="bottom" horizontal="end">
        <IonFabButton id="open-modal" color={"success"}>
          <IonIcon icon={addOutline}></IonIcon>
        </IonFabButton>
      </IonFab>
      <IonModal ref={modal} trigger="open-modal" initialBreakpoint={0.75} breakpoints={[0, 0.75]}>
        <IonContent className="ion-padding">
          <IonButton onClick={takePhoto}>take photo</IonButton>
          <IonImg src={photo?.webviewPath} />
          <IonInput
            id="custom-input"
            label="Custom Counter Format"
            labelPlacement="floating"
            counter={true}
            maxlength={20}
            counterFormatter={(inputLength, maxLength) => `${maxLength - inputLength} characters remaining`}
          ></IonInput>

          <IonSearchbar showClearButton="focus" onIonInput={(ev) => handleInput(ev)}></IonSearchbar>

          <IonList>
            {results.map((result) => (
              <IonItem>{result}</IonItem>
            ))}
          </IonList>
        </IonContent>
      </IonModal>
    </>
  );

};

export default Modal;
