import { IonItem, IonAvatar, IonGrid, IonRow, IonLabel, IonText } from '@ionic/react';

import { currentUser, users } from '../../utils/Users';
import { Transaction } from 'firebase/firestore';

interface ContainerProps {
    imagePath: string;
    transactionName: string;
    oweAmount: number;
    date: Date;
    transactionOwnerID: string;
}

const GroupListItem: React.FC<ContainerProps> = (props) => {

    function getTitle() {
        if (props.transactionOwnerID == currentUser.id)
            return <IonLabel>{props.oweAmount} ödedin </IonLabel>;
        else
            return <IonLabel>{props.transactionOwnerID} {props.oweAmount} ödedi</IonLabel>;
    }

    function getDetail() {

        if (props.transactionOwnerID == currentUser.id)
            return <IonRow className='text-size'> <IonText color="success">&nbsp;{props.oweAmount}&nbsp;</IonText> alacaklısın</IonRow>
        else
            return <IonRow className='text-size'> <IonText color="danger">&nbsp;{props.oweAmount}&nbsp;</IonText> borçlusun</IonRow>

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
