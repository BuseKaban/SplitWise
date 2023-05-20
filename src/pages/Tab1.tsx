import { IonContent, IonHeader, IonList, IonPage, IonReorder, IonReorderGroup, IonSearchbar, IonTitle, IonToolbar, ItemReorderEventDetail, SearchbarInputEventDetail } from '@ionic/react';
import './Tab1.css';
import GroupListItem from '../components/GroupListItem/GroupListItem';
import { IonSearchbarCustomEvent } from '@ionic/core';
import { useEffect, useState } from 'react';
import { GetAllSummaries, GroupSummary, onGroupsChanged } from '../utils/Users';
import { useHistory } from 'react-router';
import Modal from '../components/Modal/Modal';


//burdayız
const Tab1: React.FC = () => {
  useEffect(() => {

    onGroupsChanged(() =>
      GetAllSummaries().then((result) => {
        setOriginalSummaries(result)
        setSummaries(result);
      }))
  }, []);


  const history = useHistory();

  let groupSummaries = [
  ] as GroupSummary[]


  const [originalSummaries, setOriginalSummaries] = useState(groupSummaries);

  const [summaries, setSummaries] = useState(groupSummaries);

  function handleSearch(ev: IonSearchbarCustomEvent<SearchbarInputEventDetail>): void {
    setSummaries(originalSummaries.filter(group => group.GroupName.toLowerCase().includes(ev.target.value!.toLowerCase())));
  }




  function navToDetail(group: GroupSummary) {
    history.push("/groups/detail/" + group.GroupID, group);
  }

  return (
    <IonPage className='tab1'>
      <IonHeader>
        <IonToolbar>
          <IonTitle className='mt-[13px]'>Gruplarım</IonTitle>
          <IonSearchbar className='mt-3  search-bar' placeholder='Gruplarını ara' mode='ios' onIonInput={(ev) => handleSearch(ev)}></IonSearchbar>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className='ion-padding'>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonSearchbar onIonInput={(ev) => handleSearch(ev)}></IonSearchbar>
          </IonToolbar>
        </IonHeader>
        <IonList className='ion-no-padding'>
          {
            summaries.map(groupSummary =>
              <GroupListItem
                key={groupSummary.GroupID}
                onClickItem={() => { navToDetail(groupSummary) }}
                groupName={groupSummary.GroupName}
                totalOwe={groupSummary.SummaryAmount}
                details={groupSummary.Details}
                imagePath={groupSummary.Base64Image} />
            )
          }
        </IonList>

        <Modal></Modal>
      </IonContent>
    </IonPage >
  );
};

export default Tab1;