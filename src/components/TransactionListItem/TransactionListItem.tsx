import { IonItem, IonAvatar, IonGrid, IonRow, IonLabel, IonText } from '@ionic/react';

import { currentUser, users } from '../../utils/Users';
import { Transaction } from 'firebase/firestore';
import { amountFormatter, getUserNameById } from '../../utils/Utils';

interface ContainerProps {
    imagePath: string;
    transactionName: string;
    oweAmount: number;
    date: Date;
    transactionOwnerID: string;
    totalAmount: number;
}

const GroupListItem: React.FC<ContainerProps> = (props) => {

    function getTitle() {
        if (props.transactionOwnerID == currentUser.id)
            return <IonLabel>{amountFormatter(props.totalAmount)} ödedin </IonLabel>;
        else
            return <IonLabel>{getUserNameById(props.transactionOwnerID)} {amountFormatter(props.totalAmount)} ödedi</IonLabel>;
    }

    function getDetail() {

        if (props.transactionOwnerID == currentUser.id)
            return <IonRow className='text-size'> <IonText color="success">&nbsp;{amountFormatter(props.oweAmount)}&nbsp;</IonText> alacaklısın</IonRow>
        else
            return <IonRow className='text-size'> <IonText color="danger">&nbsp;{amountFormatter(props.oweAmount)}&nbsp;</IonText> borçlusun</IonRow>

    }

    return (
        <IonItem button>
            <IonAvatar slot="start">
                <img alt="Group Icon" src={props.imagePath} />
            </IonAvatar>
            <IonGrid>
                <IonRow className='title-text'>{props.transactionName}</IonRow>
                <IonRow>{getTitle()}</IonRow>
                {getDetail()}
            </IonGrid>
        </IonItem>
    );
};

export default GroupListItem;
