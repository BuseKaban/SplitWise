import { IonButton, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { Chart as ChartJS, ArcElement, Legend, Tooltip } from 'chart.js';
import { Chart } from 'react-chartjs-2';
import { GetAllTransactions, setCurrentUser } from '../utils/Users';
import { useHistory } from 'react-router';
import { useState, useEffect } from 'react';

const Tab4: React.FC = () => {
  const history = useHistory();
  ChartJS.register(ArcElement, Tooltip, Legend);

  const [chartValues, setChartValues] = useState(new Map<string, number>);

  const data = {
    labels: Array.from(chartValues).map(value => value[0]),
    datasets: [
      {
        label: '# of Votes',
        data: Array.from(chartValues).map(value => value[1]),
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



  useEffect(() => {

  }, [])

  GetAllTransactions().then(results => {
    const typeWithValues = new Map<string, number>();

    results.forEach(transaction => {
      //   data.datasets[0].data = [transaction.amount, transaction.amount];
      //   data.labels.push(transaction.type);
      const value = typeWithValues.get(transaction.type);
      if (value)
        typeWithValues.set(transaction.type, value + transaction.amount);
      else
        typeWithValues.set(transaction.type, transaction.amount);
    })

    // data.datasets[0].data = [];
    setChartValues(typeWithValues);
  })


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
        <Chart key={"test"} id='test' type='doughnut' data={data}></Chart>
        <IonButton mode='ios' onClick={(e) => Logout()}>Default</IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Tab4;
