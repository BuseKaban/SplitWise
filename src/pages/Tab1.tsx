import { IonAvatar, IonCol, IonContent, IonGrid, IonHeader, IonItem, IonLabel, IonList, IonPage, IonReorder, IonReorderGroup, IonRow, IonSearchbar, IonTitle, IonToolbar, ItemReorderEventDetail } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import './Tab1.css';
import GroupListItem from '../components/GroupListItem/GroupListItem';

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

  function handleReorder(event: CustomEvent<ItemReorderEventDetail>) {
    // The `from` and `to` properties contain the index of the item
    // when the drag started and ended, respectively
    console.log('Dragged from index', event.detail.from, 'to', event.detail.to);

    // Finish the reorder and position the item in the DOM based on
    // where the gesture ended. This method can also be called directly
    // by the reorder group
    event.detail.complete();
  }
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>My Groups</IonTitle>
        </IonToolbar>
        <IonToolbar>
          <IonSearchbar></IonSearchbar>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonSearchbar></IonSearchbar>
          </IonToolbar>
        </IonHeader>
        <IonList>
          <IonReorderGroup disabled={false} onIonItemReorder={handleReorder}>
            {
              groupSummaries.map(groupSummary =>
                <IonReorder>
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
