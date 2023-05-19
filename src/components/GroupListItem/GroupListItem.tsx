import { IonItem, IonAvatar, IonGrid, IonRow, IonLabel, IonText, IonIcon } from '@ionic/react';
import './GroupListItem.scss'
import { users } from '../../utils/Users';
import { amountFormatter } from '../../utils/Utils';
import { cashOutline, peopleCircleOutline, peopleOutline } from 'ionicons/icons';

interface ContainerProps {
    imagePath?: string;
    lines?: "full" | "inset" | "none";
    className?: string;
    groupName?: string;
    totalOwe?: number;
    details?: Map<string, number>;
    onClickItem?: () => void;
}

const GroupListItem: React.FC<ContainerProps> = (props) => {
    function summaryTitle(totalOwe: number | undefined) {
        if (!totalOwe)
            return null

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
        <IonItem className={props.className} lines={props.lines ?? "full"} onClick={props.onClickItem} button={props.onClickItem != undefined}>
            {props.imagePath ?
                <IonAvatar slot="start" className='group-list-item-avatar'>
                    <img alt="Group Icon" src={props.imagePath} />
                </IonAvatar>
                :
                <IonIcon className='bg-green-100 p-3 rounded-2xl mr-4 group-list-item-avatar' slot='start' icon={peopleOutline} color="primary"></IonIcon>
            }
            <IonGrid className='group-list-item-grid'>
                <IonRow className='group-list-item-text title-text'>{props.groupName}</IonRow>
                <IonRow>{summaryTitle(props.totalOwe)}</IonRow>
                {showDetails()}
            </IonGrid>
        </IonItem>
    );
};

export default GroupListItem;
