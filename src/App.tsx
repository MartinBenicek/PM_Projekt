import { Redirect, Route, useLocation } from "react-router-dom";
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { settingsOutline } from "ionicons/icons";
import charactersSvg from "./svg/characters.svg";
import scrollSvg from "./svg/scroll.svg";
import Tab1 from "./pages/Tab1";
import Tab2 from "./pages/Tab2";
import Tab3 from "./pages/Tab3";
import Tab1Spells from "./pages/Tab1Spells";
import Tab1Character from "./pages/Tab1Character";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

import "./theme/variables.css";
/* import '@ionic/react/css/palettes/dark.always.css'; */
import "@ionic/react/css/palettes/dark.class.css";
//import "@ionic/react/css/palettes/dark.system.css";

/* Theme variables */
import "./theme/variables.css";
import useStorage from "./services/storage";
import { useEffect } from "react";
setupIonicReact();

const App: React.FC = () => {
  const { store } = useStorage();

  const toggleDarkMode = (enabled: boolean) => {
    document.documentElement.classList.toggle("ion-palette-dark", enabled);
  };

  const initializeDarkMode = async () => {
    const darkMode = await store?.get("dark-mode");
    toggleDarkMode(darkMode === true);
  };

  useEffect(() => {
    initializeDarkMode();
  }, [[], store]);

  return (
    <IonApp>
      <IonReactRouter>
        <Main />
      </IonReactRouter>
    </IonApp>
  );
};

const Main: React.FC = () => {
  const location = useLocation(); // This is now inside IonReactRouter
  return (
    <IonTabs>
      <IonRouterOutlet animated={false}>
        {/* Main tabs */}
        <Route exact path="/tab1" component={Tab1} />
        <Route exact path="/tab2" component={Tab2} />
        <Route exact path="/tab3" component={Tab3} />

        {/* Sub-tabs under Tab1 */}
        <Route exact path="/tab1/character/:id" component={Tab1Character} />
        <Route exact path="/tab1/spells/:id" component={Tab1Spells} />

        <Route exact path="/">
          <Redirect to="/tab1" />
        </Route>
      </IonRouterOutlet>

      {/* Main Tab Bar */}
      <IonTabBar
        slot="bottom"
        hidden={
          location.pathname.startsWith("/tab1/character") ||
          location.pathname.startsWith("/tab1/spells")
        }
      >
        <IonTabButton tab="tab1" href="/tab1">
          <IonIcon aria-hidden="true" icon={charactersSvg} />
          <IonLabel>Tab 1</IonLabel>
        </IonTabButton>
        <IonTabButton tab="tab2" href="/tab2">
          <IonIcon aria-hidden="true" icon={scrollSvg} />
          <IonLabel>Tab 2</IonLabel>
        </IonTabButton>
        <IonTabButton tab="tab3" href="/tab3">
          <IonIcon aria-hidden="true" icon={settingsOutline} />
          <IonLabel>Tab 3</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};

export default App;
