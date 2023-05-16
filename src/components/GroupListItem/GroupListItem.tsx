import { IonItem, IonAvatar, IonGrid, IonRow, IonLabel, IonText } from '@ionic/react';
import './GroupListItem.scss'
import { Transaction, users } from '../../utils/Users';
import { amountFormatter } from '../../utils/Utils';
import { useHistory } from 'react-router';

interface ContainerProps {
    imagePath: string;
    groupName: string;
    totalOwe: number;
    details: Map<string, number>;
    onClickItem?: () => void;
}

const GroupListItem: React.FC<ContainerProps> = (props) => {


    function summaryTitle(totalOwe: number) {
        if (totalOwe > 0)
            return <IonLabel color='success'>{amountFormatter(totalOwe)} alacaklısın</IonLabel>;
        else if (totalOwe < 0)
            return <IonLabel color='danger'>{amountFormatter(totalOwe)} borcun var</IonLabel>;
        else
            return null
    }

    function showDetails() {
        if (props.totalOwe == 0 || !props.details)
            return "Borç yok";

        return Array.from(props.details).map(([key, value]) => {
            if (value > 0)
                return <IonRow key={key} className='text-size'>{users.find((User) => User.id == key)?.username} arkadaşına <IonText color="success">&nbsp;{amountFormatter(value)}&nbsp;</IonText> borcun var</IonRow>
            else
                return <IonRow key={key} className='text-size'>{users.find((User) => User.id == key)?.username} arkadaşının sana <IonText color="danger">&nbsp;{amountFormatter(value)}&nbsp;</IonText> borcu var</IonRow>
        })
    }

    return (
        <IonItem onClick={props.onClickItem} button>
            <IonAvatar slot="start">
                <img alt="Group Icon" src={props.imagePath} />
            </IonAvatar>
            <IonGrid>
                <IonRow className='title-text'>{props.groupName}</IonRow>
                <IonRow>{summaryTitle(props.totalOwe)}</IonRow>
                {showDetails()}
            </IonGrid>
        </IonItem>
    );
};

export default GroupListItem;
