import { IonAvatar, IonCol, IonContent, IonGrid, IonHeader, IonItem, IonLabel, IonList, IonPage, IonReorder, IonReorderGroup, IonRow, IonSearchbar, IonTitle, IonToolbar, ItemReorderEventDetail, SearchbarInputEventDetail } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import './Tab1.css';
import GroupListItem from '../components/GroupListItem/GroupListItem';
import { IonSearchbarCustomEvent } from '@ionic/core';
import { useState } from 'react';

export interface GroupSummaryDetail {
  SplitterName: string,
  OweAmount: number
}

export interface GroupSummary {
  GroupID: number,
  GroupName: string,
  SummaryAmount: number,
  Details: GroupSummaryDetail[],
}


const Tab1: React.FC = () => {
  const groupSummaries = [
    {
      GroupID: 1,
      GroupName: "Evque",
      SummaryAmount: 100,
      Details: [
        { SplitterName: "Baran", OweAmount: 20 },
        { SplitterName: "Doğukan", OweAmount: 80 }
      ]
    },
    {
      GroupID: 2,
      GroupName: "Gezmece",
      SummaryAmount: -220,
      Details: [
        { SplitterName: "Baran", OweAmount: -300 },
        { SplitterName: "Doğukan", OweAmount: 80 }
      ]
    }
  ] as GroupSummary[]

  let [results, setResults] = useState([...groupSummaries]);

  function handleSearch(ev: IonSearchbarCustomEvent<SearchbarInputEventDetail>): void {
    setResults(groupSummaries.filter(group => group.GroupName.toLowerCase().includes(ev.target.value!.toLowerCase())));
  }
  
  function handleReorder(event: CustomEvent<ItemReorderEventDetail>) {
    console.log('Dragged from index', event.detail.from, 'to', event.detail.to);

    event.detail.complete();
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>My Groups</IonTitle>
        </IonToolbar>
        <IonToolbar>
          <IonSearchbar onIonInput={(ev) => handleSearch(ev)}></IonSearchbar>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonSearchbar  onIonInput={(ev) => handleSearch(ev)}></IonSearchbar>
          </IonToolbar>
        </IonHeader>
        <IonList>
          <IonReorderGroup disabled={true} onIonItemReorder={handleReorder}>
            {
              results.map(groupSummary =>
                <IonReorder key={groupSummary.GroupID}>
                  <GroupListItem imagePath={''} groupName={groupSummary.GroupName} totalOwe={groupSummary.SummaryAmount} details={groupSummary.Details}></GroupListItem>
                </IonReorder>
              )
            }
          </IonReorderGroup>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Tab1;
