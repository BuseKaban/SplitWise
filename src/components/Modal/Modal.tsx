import { IonItem, IonContent, IonImg, IonList, IonModal, IonSearchbar, IonFab, IonFabButton, IonIcon, IonButton, IonInput, IonFooter, IonLabel } from '@ionic/react';
import { addOutline, close } from 'ionicons/icons';

import { useCallback, useEffect, useRef, useState } from 'react';
import { UserPhoto } from '../../hooks/PhotoGallery';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

import { AddGroup, Friend, GetFriends } from '../../utils/Users';


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
  const [filterText, setFilterText] = useState("");
  const [groupName, setGroupName] = useState("");

  const modal = useRef<HTMLIonModalElement>(null);

  const [filteredFriends, setFilteredFriends] = useState([] as Friend[]);
  const [allFriends, setAllFriends] = useState([] as Friend[]);
  const [selectedFriends, setSelectedFriends] = useState([] as Friend[]);


  useEffect(() => {
    GetFriends().then((friends) => {
      setAllFriends(friends)
      setFilteredFriends(friends)
    }
    )
  }, []);

  useEffect(() => {
    if (filterText && filterText.length > 0) {
      setFilteredFriends(allFriends.filter((friend) => friend.username.toLowerCase().includes(filterText)))
    }
    else
      setFilteredFriends(allFriends)
  }, [filterText]);

  function handleFilteredFriendSelection(eventFriend: Friend): void {
    setSelectedFriends([...selectedFriends, eventFriend])
    setFilteredFriends([...filteredFriends.filter(friend => friend.id != eventFriend.id)])
    setAllFriends([...allFriends.filter(friend => friend.id != eventFriend.id)])
  }

  function handleSelectedFriendSelection(eventFriend: Friend): void {
    setFilteredFriends([eventFriend, ...filteredFriends])
    setSelectedFriends([...selectedFriends.filter(friend => friend.id != eventFriend.id)])
    setAllFriends([eventFriend, ...allFriends])
  }

  function CreateGroup(): void {
    if (groupName.length > 0 && selectedFriends.length > 0) {
      //create group
      AddGroup(groupName, selectedFriends);

      modal.current?.dismiss();
    }
    else {
      //uyarı ver
    }
  }

  return (

    <>
      <IonFab slot="fixed" vertical="bottom" horizontal="end">
        <IonFabButton id="open-modal" color={"primary"}>
          <IonIcon icon={addOutline}></IonIcon>
        </IonFabButton>
      </IonFab>
      <IonModal ref={modal} trigger="open-modal" initialBreakpoint={0.80} breakpoints={[0, 0.80]}>
        <div className="ion-padding pt-8 flex flex-col h-4/5 justify-start items-center">

          <IonItem className='w-28 h-28' onClick={takePhoto}>
            <IonImg className='w-28 h-28' src={photo?.webviewPath ?? "https://ionicframework.com/docs/img/demos/avatar.svg"} />
          </IonItem>

          <IonInput
            id="groupname"
            label="Enter group name"
            labelPlacement="floating"
            counter={true}
            color="primary"
            maxlength={20}
            mode='ios'
            className='w-64 m-4'
            errorText='deneme'
            counterFormatter={(inputLength, maxLength) => `${maxLength - inputLength} characters remaining`}
            onIonChange={(e) => setGroupName(e.detail.value ?? "")}
          ></IonInput>


          <IonSearchbar
            className='ion-no-padding ion-no-border pb-4'
            showClearButton="focus"
            onIonInput={(ev) => setFilterText(ev.detail.value?.toLowerCase() ?? '')}

          >
          </IonSearchbar>

          {
            selectedFriends.length > 0 ?
              <IonList className='w-full mb-4 ion-no-padding'>
                {selectedFriends.map((friend) => (
                  <IonItem button color="primary" className='selected-friend' onClick={() => handleSelectedFriendSelection(friend)} key={friend.id}>
                    {friend.username}
                    <IonIcon slot='end' icon={close}></IonIcon>
                  </IonItem>
                ))}
              </IonList> : null
          }


          <IonList className='w-full' >
            {filteredFriends.length > 0 ?
              filteredFriends.map((friend) => (
                <IonItem button onClick={() => handleFilteredFriendSelection(friend)} key={friend.id}>
                  {friend.username}
                </IonItem>
              )) : <IonLabel>Hiç arkadaşın kalmadı :(</IonLabel>}
          </IonList>


          <div className='w-full h-14 flex flex-row justify-between mt-auto' >
            <IonButton className='w-1/2 h-12 ' fill='clear' color="danger" onClick={(e) => modal.current?.dismiss()} >İptal Et</IonButton>
            <IonButton className='w-1/2 h-12 ' color="primary" onClick={() => CreateGroup()}>Oluştur</IonButton>
          </div>
        </div>

      </IonModal>
    </>
  );

};

export default Modal;
