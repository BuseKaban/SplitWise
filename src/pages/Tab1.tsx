import { IonContent, IonFab, IonFabButton, IonHeader, IonIcon, IonList, IonPage, IonReorder, IonReorderGroup, IonSearchbar, IonTitle, IonToolbar, ItemReorderEventDetail, SearchbarInputEventDetail } from '@ionic/react';
import './Tab1.css';
import GroupListItem from '../components/GroupListItem/GroupListItem';
import { IonSearchbarCustomEvent } from '@ionic/core';
import { useEffect, useState } from 'react';
import { GetSummary, GroupSummary } from '../utils/Users';
import { useHistory } from 'react-router';
import { addOutline, chevronUpCircle } from 'ionicons/icons';
import Modal from '../components/Modal/Modal';


//burdayız
const Tab1: React.FC = () => {
  useEffect(() => {
    GetSummary("C4HRflhAi8gLJiTu4uuK").then((result) => {
      setResults([result]);
    })
  }, []);


  const history = useHistory();

  let groupSummaries = [

  ] as GroupSummary[]

  let [results, setResults] = useState(groupSummaries);

  function handleSearch(ev: IonSearchbarCustomEvent<SearchbarInputEventDetail>): void {
    setResults(groupSummaries.filter(group => group.GroupName.toLowerCase().includes(ev.target.value!.toLowerCase())));
  }


  function handleReorder(event: CustomEvent<ItemReorderEventDetail>) {
    console.log('Dragged from index', event.detail.from, 'to', event.detail.to);
    event.detail.complete();
  }


  function navToDetail(group: GroupSummary) {
    history.push("/groups/detail/" + group.GroupID, group);
  }
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>My Groups</IonTitle>
        </IonToolbar>
        <IonToolbar>
          <IonSearchbar mode='ios' onIonInput={(ev) => handleSearch(ev)}></IonSearchbar>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonSearchbar onIonInput={(ev) => handleSearch(ev)}></IonSearchbar>
          </IonToolbar>
        </IonHeader>
        <IonList>
          <IonReorderGroup disabled={true} onIonItemReorder={handleReorder}>
            {
              results.map(groupSummary =>
                <IonReorder key={groupSummary.GroupID}>
                  <GroupListItem
                    onClickItem={() => { navToDetail(groupSummary) }}
                    imagePath={''}
                    groupName={groupSummary.GroupName}
                    totalOwe={groupSummary.SummaryAmount}
                    details={groupSummary.Details} />
                </IonReorder>
              )
            }
          </IonReorderGroup>
        </IonList>

        <Modal></Modal>
      </IonContent>
    </IonPage>
  );
};

export default Tab1;