import { IonItem, IonAvatar, IonGrid, IonRow, IonLabel, IonText } from '@ionic/react';
import './GroupListItem.scss'
import { users } from '../../utils/Users';

interface ContainerProps {
    imagePath: string;
    groupName: string;
    totalOwe: number;
    details?:  Map<string, number>;
    routerLink: string;
}

const GroupListItem: React.FC<ContainerProps> = (props) => {

    function summaryTitle(totalOwe: number) {
        if (totalOwe > 0)
            return <IonLabel color='success'>{totalOwe} kadar alacaklısn</IonLabel>;
        else if (totalOwe < 0)
            return <IonLabel color='danger'>{totalOwe} kadar borcun var</IonLabel>;
        else
            return null
    }

    function showDetails() {
        if (props.totalOwe == 0)
            return "Borç yok";

        return Array.from( props.details! ).map(([key, value]) => {
            if (value > 0)
                return <IonRow key={key} className='text-size'>{users.find((User)=>User.id == key)?.username} arkadaşına <IonText color="success">&nbsp;{value}&nbsp;</IonText> borcun var</IonRow>
            else
                return <IonRow key={key} className='text-size'>{users.find((User)=>User.id == key)?.username} arkadaşının sana <IonText color="danger">&nbsp;{value}&nbsp;</IonText> borcu var</IonRow>
        })
    }

    return (
        <IonItem routerLink={props.routerLink} button>
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
