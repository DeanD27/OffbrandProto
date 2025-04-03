import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
  IonIcon
} from '@ionic/react';
import './Home.css';
import { logInOutline } from 'ionicons/icons';

const Tab1: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Offbrand</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <div className="center-text">
          <h1>SME Risk Assessment</h1>
          <p>
            Offbrand uses AI models like Mistral and Gemma to analyze business risks across
            finance, compliance, cybersecurity, HR, and more — tailored for small & medium enterprises.
          </p>
          <IonButton
            color="primary"
            href="/viz"
            target="_blank"
            rel="noopener noreferrer"
          >
            <IonIcon icon={logInOutline} slot="start" />
            View LLM Log Dashboard
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Tab1;

