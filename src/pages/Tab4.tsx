import { IonButton, IonCol, IonContent, IonDatetime, IonDatetimeButton, IonGrid, IonHeader, IonIcon, IonItem, IonLabel, IonModal, IonPage, IonRow, IonText, IonTitle, IonToolbar, useIonAlert } from '@ionic/react';
import { Chart as ChartJS, ArcElement, Legend, Tooltip, ChartData, DoughnutController } from 'chart.js';
import { Chart, Doughnut } from 'react-chartjs-2';
import { GetAllTransactions, Transaction, currentUser, onGroupsChanged, setCurrentUser } from '../utils/Users';
import { useHistory } from 'react-router';
import { useState, useEffect } from 'react';
import BarGraph from '../components/BarGraph/BarGraph';
import "./Tab4.scss";
import { add, format, isSameMonth, isSameYear, isThisMonth, setDefaultOptions } from 'date-fns';
import { arrowDown, arrowUp, options } from 'ionicons/icons';
import { tr } from 'date-fns/locale';
import { amountFormatter } from '../utils/Utils';
const Tab4: React.FC = () => {
  const history = useHistory();
  ChartJS.register(ArcElement, Tooltip, Legend, DoughnutController);

  const [chartValues, setChartValues] = useState(new Map<string, number>);
  const [toDate, setToDate] = useState(new Date());
  const [toDateAmounts, setToDateAmounts] = useState(new Map<string, number>());

  const [fromDate, setFromDate] = useState(add(toDate, { months: -1 }));
  const [fromDateAmounts, setFromDateAmounts] = useState(new Map<string, number>());

  const [transactions, setTransactions] = useState([] as Transaction[]);

  const data = {
    labels: Array.from(chartValues).map(value => value[0]),
    datasets: [
      {
        label: 'Ödenen miktar',
        data: Array.from(chartValues).map(value => value[1]),
        backgroundColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(255, 205, 86, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  } as ChartData<"doughnut", number[], string>;

  useEffect(() => {
    onGroupsChanged(() =>
      GetAllTransactions().then(results => {
        const typeTotals = new Map<string, number>();

        results.forEach(transaction => {
          if (isThisMonth(transaction.date)) {
            const value = typeTotals.get(transaction.type);
            if (value)
              typeTotals.set(transaction.type, value + (transaction.amount / transaction.splitters.length));
            else
              typeTotals.set(transaction.type, transaction.amount / transaction.splitters.length);
          }
        })

        setChartValues(typeTotals);
        setTransactions(results);
      })
    )
  }, [])

  useEffect(() => {
    const toDateTypeAmounts = new Map<string, number>();
    const fromDateTypeAmounts = new Map<string, number>();

    transactions.forEach(transaction => {
      if (isSameMonth(transaction.date, toDate) && isSameYear(transaction.date, toDate)) {
        const value = toDateTypeAmounts.get(transaction.type);
        if (value)
          toDateTypeAmounts.set(transaction.type, value + (transaction.amount / transaction.splitters.length));
        else
          toDateTypeAmounts.set(transaction.type, transaction.amount / transaction.splitters.length);
      }
      else if (isSameMonth(transaction.date, fromDate) && isSameYear(transaction.date, fromDate)) {
        const value = fromDateTypeAmounts.get(transaction.type);
        if (value)
          fromDateTypeAmounts.set(transaction.type, value + (transaction.amount / transaction.splitters.length));
        else
          fromDateTypeAmounts.set(transaction.type, transaction.amount / transaction.splitters.length);
      }
    })

    setToDateAmounts(toDateTypeAmounts);
    setFromDateAmounts(fromDateTypeAmounts);
  }, [transactions, toDate, fromDate])


  const [logoutAlert] = useIonAlert();

  function confirmExit(): void {
    logoutAlert({
      mode: "ios",
      header: 'Çıkış yap',
      message: 'Çıkış yapmak istediğinden emin misin?',
      buttons: [
        {
          id: "exit",
          text: "İptal",
        },
        {
          id: "exit",
          text: "Çık",
          role: "destructive",
          handler: () => Logout()
        }
      ],
    })
  }

  function Logout(): void {
    history.push("/login")
    setCurrentUser(undefined);
  }

  function displayMonthlyDifference() {
    const keysMap = new Map([...toDateAmounts.entries(), ...fromDateAmounts.entries()])

    return Array.from(keysMap).map((key, index) => {
      const fromAmount = fromDateAmounts.get(key[0]) ?? 0;
      const toAmount = toDateAmounts.get(key[0]) ?? 0;

      const perc = (toAmount - fromAmount) / fromAmount * 100;
      const color = data.datasets[0].backgroundColor as string[];

      return (

        <IonRow key={key[0]}>
          <IonCol>
            <IonRow className='p-2 pl-4 rounded-lg' style={{ color: "white", background: color[index % color.length] }}>
              <p>{key[0]}</p>
            </IonRow>
            <IonRow>
              <IonCol size='4' >
                <p> {amountFormatter(fromAmount)} </p>
              </IonCol>
              <IonCol size='4' className='ion-text-center'>

                {Number.isFinite(perc) ?
                  <div className={"flex justify-center " + (perc > 0 ? "negative-perc" : "positive-perc")}>
                    <IonIcon icon={perc > 0 ? arrowUp : arrowDown}></IonIcon>
                    <p >%{Math.abs(perc).toFixed(0)}</p>
                  </div> :
                  <IonIcon className={perc > 0 ? "negative-perc" : "positive-perc"} icon={perc > 0 ? arrowUp : arrowDown}></IonIcon>
                }
              </IonCol>
              <IonCol size='4' className='ion-text-end'>
                <p> {amountFormatter(toAmount)} </p>
              </IonCol>
            </IonRow>
          </IonCol>
        </IonRow>


      )
    });
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Hesabım</IonTitle>
          <IonButton slot='end' mode='ios' fill='clear' onClick={(e) => confirmExit()}>Çıkış yap</IonButton>

        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className='ion-padding'>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Tab 4</IonTitle>
          </IonToolbar>
        </IonHeader>



        <IonItem lines='none' className='ion-no-padding pl-3'>
          <IonText className='text-lg font-semibold account-label'>Net Durum</IonText>
        </IonItem>
        <BarGraph></BarGraph>

        <IonItem lines='none' className='ion-no-padding pl-3 mt-4'>
          <IonText className='text-lg font-semibold account-label'>Harcamalar</IonText>
        </IonItem>
        <Chart type='doughnut' className='mb-6' data={data}></Chart>

        <IonItem lines='none' className='ion-no-padding pl-3'>
          <IonText className='text-lg font-semibold account-label'>Aylık Kıyaslama</IonText>
        </IonItem>
        <div className=' rounded-lg'>
          <div className='flex justify-between p-1 mb-2'>
            <IonDatetimeButton className='account-date-button' mode='ios' datetime="fromDatetime"></IonDatetimeButton>
            <IonModal id='13' keepContentsMounted={true}>
              <IonDatetime value={fromDate.toISOString()} onIonChange={(e) => setFromDate(new Date(e.detail!.value as string))} mode='ios' presentation='month-year' id='fromDatetime'></IonDatetime>
            </IonModal>


            <IonDatetimeButton className='account-date-button' mode='ios' datetime="toDatetime"></IonDatetimeButton>
            <IonModal id='12' keepContentsMounted={true}>
              <IonDatetime value={toDate.toISOString()} onIonChange={(e) => setToDate(new Date(e.detail!.value as string))} mode='ios' presentation='month-year' id='toDatetime'></IonDatetime>
            </IonModal>
          </div>
          <IonGrid>
            {
              displayMonthlyDifference()
            }
          </IonGrid>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Tab4;
