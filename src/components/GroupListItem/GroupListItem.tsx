import { IonItem, IonAvatar, IonGrid, IonRow, IonLabel, IonText } from '@ionic/react';
import { GroupSummaryDetail } from '../../pages/Tab1';
import './GroupListItem.scss'

interface ContainerProps {
    imagePath: string;
    groupName: string;
    totalOwe: number;
    details?: GroupSummaryDetail[];
}

const GroupListItem: React.FC<ContainerProps> = (props) => {

    function summaryTitle(totalOwe: number) {
        if (totalOwe > 0)
            return <IonLabel color='danger'>{totalOwe} kadar borcun var</IonLabel>;
        else if (totalOwe < 0)
            return <IonLabel color='success'>{totalOwe} kadar alacaklısın</IonLabel>;
        else
            return null
    }

    function showDetails() {
        if (props.totalOwe == 0)
            return "Borç yok";

        return props.details?.map(item => {
            if (item.OweAmount > 0)
                return <IonRow className='text-size'>{item.SplitterName} arkadaşına <IonText color="danger">&nbsp;{item.OweAmount}&nbsp;</IonText> borcun var</IonRow>
            else
                return <IonRow className='text-size'>{item.SplitterName} arkadaşının sana <IonText color="success">&nbsp;{item.OweAmount}&nbsp;</IonText> borcu var</IonRow>
        })
    }

    return (
        <IonItem button>
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
