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
import { documentTextOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';

const Tab1: React.FC = () => {
  const history = useHistory();

  const goToQuestionnaire = () => {
    history.push('/RiskPage'); // <-- this is your questionnaire route
  };

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
          <IonButton color="primary" onClick={goToQuestionnaire}>
            <IonIcon icon={documentTextOutline} slot="start" />
            Start Questionnaire
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Tab1;


