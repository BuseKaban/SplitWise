import { IonButton, IonContent, IonDatetime, IonHeader, IonLabel, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import { Chart as ChartJS, ArcElement, Legend, Tooltip } from 'chart.js';
import { Chart } from 'react-chartjs-2';
import TransactionModal from '../components/Modal/TransactionModal';
import { GetTransactionTypes, currentUser, setCurrentUser } from '../utils/Users';
import { useHistory } from 'react-router';

const Tab4: React.FC = () => {
  const history = useHistory();
  ChartJS.register(ArcElement, Tooltip, Legend);

  const data = {
    labels: [] as string[],
    datasets: [
      {
        label: '# of Votes',
        data: [6, 19, 3, 5, 2, 3],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  GetTransactionTypes().forEach(element => {

    data.labels.push(element);
  });

  function Logout(): void {
    history.push("/login")
    setCurrentUser(undefined);
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Hesabım</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Tab 4</IonTitle>
          </IonToolbar>
        </IonHeader>
        <Chart type='doughnut' data={data}></Chart>
        <IonButton mode='ios' onClick={(e) => Logout()}>Default</IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Tab4;
