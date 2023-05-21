import { IonItem, IonList, IonModal, IonSearchbar, IonFab, IonFabButton, IonIcon, IonButton, IonInput, IonLabel, IonSelect, IonSelectOption, IonDatetime, IonDatetimeButton } from '@ionic/react';
import { addOutline, close } from 'ionicons/icons';

import { useEffect, useRef, useState } from 'react';

import { AddTransaction, Friend, GetFriends, GetGroupUsers, GetTransactionTypes, Transaction } from '../../utils/Users';

import './TransactionModal.scss';
import { amountFormatter } from '../../utils/Utils';
import { currentUser } from '../../utils/Users';

interface TransactionModalInputs {
  groupId: string,
}

const TransactionModal: React.FC<TransactionModalInputs> = (props) => {
  const [filterText, setFilterText] = useState("");
  const [transactionName, setTransactionName] = useState("");
  const [transactionAmount, setTransactionAmount] = useState(0);
  const [transactionType, setTransactionType] = useState("");
  const [transactionDate, setTransactionDate] = useState(new Date());

  const modal = useRef<HTMLIonModalElement>(null);

  const [filteredFriends, setFilteredFriends] = useState([] as Friend[]);
  const [allFriends, setAllFriends] = useState([] as Friend[]);
  const [selectedFriends, setSelectedFriends] = useState([] as Friend[]);

  useEffect(() => {
    GetGroupUsers(props.groupId).then((friends) => {
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



  function CreateTransaction() {
    AddTransaction({
      amount: transactionAmount,
      date: transactionDate,
      name: transactionName,
      owner: currentUser!.id,
      splitters: [currentUser!.id, ...selectedFriends.map(f => f.id)],
      type: transactionType,
      groupID: props.groupId
    } as Transaction);
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
          <IonList className='w-72'>
            <IonItem>
              <IonInput
                id="transactionname"
                label="İsim :"
                placeholder="İsim girin"
                color="primary"
                className='text-right'
                onIonChange={(e) => setTransactionName((e.detail.value ?? ""))}
              ></IonInput>
            </IonItem>
            <IonItem mode='ios'>
              <IonSelect label="Tür :" placeholder='Tür seçin' interface='action-sheet' onIonChange={(e) => setTransactionType(e.detail.value ?? "")}>
                {GetTransactionTypes().map(type =>
                  <IonSelectOption key={type} value={type}>{type}</IonSelectOption>
                )}
              </IonSelect>
            </IonItem>
            <IonItem>
              <IonInput
                type='number'
                id="groupname"
                label="Tutar :"
                placeholder={amountFormatter(0)}
                color="primary"
                className='text-right'
                onIonChange={(e) => setTransactionAmount((e.detail.value ?? 0) as number)}
              ></IonInput>
            </IonItem>
            <IonItem>
              <IonLabel>Tarih: </IonLabel>
              <IonDatetimeButton mode='ios' datetime="datetime" ></IonDatetimeButton>
              <IonModal keepContentsMounted={true}>
                <IonDatetime mode='ios' onSelect={(e) => setTransactionDate(new Date(e.timeStamp))} presentation='date-time' id='datetime'></IonDatetime>
              </IonModal>
            </IonItem>
          </IonList>

          <IonSearchbar
            className='ion-no-padding ion-no-border pb-4 pt-4'
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
                <IonItem lines='full' button onClick={() => handleFilteredFriendSelection(friend)} key={friend.id}>
                  {friend.username}
                </IonItem>
              )) : <IonLabel>Hiç arkadaşın kalmadı :(</IonLabel>}
          </IonList>


          <div className='w-full h-14 flex flex-row justify-between mt-auto' >
            <IonButton className='w-1/2 h-12 ' fill='clear' color="danger" onClick={(e) => modal.current?.dismiss()} >İptal Et</IonButton>
            <IonButton className='w-1/2 h-12 ' color="primary" onClick={() => { CreateTransaction(); modal.current?.dismiss(); }}>Oluştur</IonButton>
          </div>
        </div>

      </IonModal>
    </>
  );

};

export default TransactionModal;
