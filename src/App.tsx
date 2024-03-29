import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { ellipse, people, peopleCircleSharp, peopleOutline, peopleSharp, person, personCircleSharp, receipt, square, triangle } from 'ionicons/icons';
import Tab1 from './pages/Tab1';
import Tab2 from './pages/Tab2';
import Tab3 from './pages/Tab3';
import Tab4 from './pages/Tab4';
import Login from './components/Login/Login'

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

import './App.css';

/* Theme variables */
import './theme/variables.css';
import GroupDetailPage from './pages/GroupDetailPage';
import { currentUser } from './utils/Users';


setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <Route
        path={"/login"}>
        <Login></Login>
      </Route>
      <Route
        path="/tabs"
        render={() => (currentUser != undefined ?
          <IonTabs>
            <IonRouterOutlet>

              <Route path="/tabs/groups/detail/:id" component={GroupDetailPage} />

              <Route exact path="/tabs/groups">
                <Tab1 />
              </Route>

              <Route path="/tabs/friends">
                <Tab2 />
              </Route>

              <Route path="/tabs/activity">
                <Tab3 />
              </Route>
              <Route path="/tabs/account">
                <Tab4 />
              </Route>

            </IonRouterOutlet>
            <IonTabBar slot="bottom">
              <IonTabButton tab="tab1" href="/tabs/groups">
                <IonIcon aria-hidden="true" icon={peopleSharp} />
                <IonLabel>Gruplar</IonLabel>
              </IonTabButton>
              <IonTabButton tab="tab2" href="/tabs/friends">
                <IonIcon aria-hidden="true" icon={person} />
                {/* icon üstü yazı */}
                <IonLabel>Arkadaşlar</IonLabel>
              </IonTabButton>
              <IonTabButton tab="tab3" href="/tabs/activity">
                <IonIcon aria-hidden="true" icon={receipt} />
                <IonLabel>Detaylar</IonLabel>
              </IonTabButton>
              <IonTabButton tab="tab4" href="/tabs/account">
                <IonIcon aria-hidden="true" icon={personCircleSharp} />
                <IonLabel>Hesabım</IonLabel>
              </IonTabButton>

            </IonTabBar>
          </IonTabs>
          : <Redirect to="/login" />)}
      />
      <Route exact path="/">
        <Redirect to="/login" />
      </Route>
    </IonReactRouter>
  </IonApp>
);

export default App;
