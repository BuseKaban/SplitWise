import { IonItem, IonGrid, IonRow, IonLabel, IonText, IonIcon, IonButton, useIonAlert } from '@ionic/react';
import { currentUser } from '../../utils/Users';
import { Transaction } from 'firebase/firestore';
import { amountFormatter, getUserNameById } from '../../utils/Utils';
import { cashOutline, trashBin } from 'ionicons/icons';

interface ContainerProps {
    transactionName: string;
    oweAmount: number;
    date: Date;
    transactionOwnerID: string;
    totalAmount: number;
    onClick: () => void;
}

const TransactionListItem: React.FC<ContainerProps> = (props) => {

    function getTitle() {
        if (props.transactionOwnerID == currentUser!.id)
            return <IonLabel>{amountFormatter(props.totalAmount)} ödedin </IonLabel>;
        else
            return <IonLabel>{getUserNameById(props.transactionOwnerID)} {amountFormatter(props.totalAmount)} ödedi</IonLabel>;
    }

    function getDetail() {
        if (props.oweAmount == 0) return;

        if (props.transactionOwnerID == currentUser!.id)
            return <IonRow className='text-size'> <IonText color="success">&nbsp;{amountFormatter(props.oweAmount)}&nbsp;</IonText> alacaklısın</IonRow>
        else
            return <IonRow className='text-size'> <IonText color="danger">&nbsp;{amountFormatter(props.oweAmount)}&nbsp;</IonText> borçlusun</IonRow>
    }



    return (
        <IonItem style={{ "--padding-start": "0px", "--inner-padding-end": "0px" }}>
            <IonIcon className='bg-green-100 p-3 rounded-full mr-4' slot='start' icon={cashOutline} size="large" color="primary"></IonIcon>

            <IonGrid>
                <IonRow className='title-text'>{props.transactionName}</IonRow>
                <IonRow>{getTitle()}</IonRow>
                {getDetail()}
            </IonGrid>

            <IonButton fill='clear' className='w-12 h-12' color="danger" onClick={props.onClick}>
                <IonIcon slot='icon-only' icon={trashBin} size="small" color="danger"></IonIcon>
            </IonButton>

        </IonItem>
    );
};

export default TransactionListItem;
