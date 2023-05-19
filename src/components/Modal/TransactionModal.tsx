import { IonItem, IonContent, IonImg, IonList, IonModal, IonSearchbar, IonFab, IonFabButton, IonIcon, IonButton, IonInput, IonFooter, IonLabel, IonSelect, IonSelectOption } from '@ionic/react';
import { addOutline, close } from 'ionicons/icons';

import { useCallback, useEffect, useRef, useState } from 'react';
import { UserPhoto } from '../../hooks/PhotoGallery';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

import { AddGroup, Friend, GetFriends } from '../../utils/Users';

import './transactionModal.scss';
import { amountFormatter } from '../../utils/Utils';

const TransactionModal: React.FC = () => {

  const [filterText, setFilterText] = useState("");
  const [transactionName, setTransactionName] = useState("");
  const [transactionAmount, setTransactionAmount] = useState(0);

  const modal = useRef<HTMLIonModalElement>(null);

  const [filteredFriends, setFilteredFriends] = useState([] as Friend[]);
  const [allFriends, setAllFriends] = useState([] as Friend[]);
  const [selectedFriends, setSelectedFriends] = useState([] as Friend[]);

  const options = {
    cssClass: 'my-custom-interface',
  }

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
    // if (groupName.length > 0 && selectedFriends.length > 0) {
    //   //create group
    //   AddGroup(groupName, selectedFriends);

    //   modal.current?.dismiss();
    // }
    // else {
    //   //uyarı ver
    // }
  }

  return (

    <>
      <IonFab slot="fixed" vertical="bottom" horizontal="end">
        <IonFabButton id="open-transaction-modal" color={"primary"}>
          <IonIcon icon={addOutline}></IonIcon>
        </IonFabButton>
      </IonFab>
      <IonModal className='modal' ref={modal} trigger="open-transaction-modal" initialBreakpoint={0.80} breakpoints={[0, 0.80]}>
        <div className="ion-padding pt-8 flex flex-col h-4/5 justify-start items-center">

          <IonInput
            type='number'
            id="groupname"
            label="Enter group name"
            placeholder={amountFormatter(0)}
            labelPlacement="floating"
            counter={true}
            color="primary"
            maxlength={20}
            mode='ios'
            className='w-64 m-4'
            errorText='deneme'
            onIonChange={(e) => setTransactionAmount((e.detail.value ?? 0) as number)}
          ></IonInput>

          <IonItem className='item' mode='ios'>
            <IonSelect className="selection" aria-label="expense type" interface="action-sheet" placeholder="Harcama Tipi">
              <IonSelectOption value="fatura">Fatura</IonSelectOption>
              <IonSelectOption value="kira">Kira</IonSelectOption>
              <IonSelectOption value="market">Market</IonSelectOption>
              <IonSelectOption value="saglik">Sağlık</IonSelectOption>
              <IonSelectOption value="egitim">Eğitim</IonSelectOption>
              <IonSelectOption value="ulasim">Ulaşım</IonSelectOption>
              <IonSelectOption value="diger">Diğer</IonSelectOption>
            </IonSelect>
          </IonItem>


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

export default TransactionModal;