import React, { useState } from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonInput } from '@ionic/react';
import './RiskPage.css';

const RiskAssessment: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [assessment, setAssessment] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert('Please upload a file first.');
      return;
    }
    // Read the file content
    const reader = new FileReader();
    reader.onload = async (event) => {
      const content = event.target?.result;
      if (typeof content === 'string') {
        // Send content to the backend for risk assessment
        const response = await fetch('http://127.0.0.1:5000/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ csv: content }),
        });

        const data = await response.json();
        setAssessment(data.result); // Update with backend result
      }
    };
    reader.readAsText(file);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Offbrand</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <div className="top-right-container">
        <h5 className="instruction-text">
            Upload your internal risk data to generate a detailed risk assessment output.
          </h5>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="file-input"
          />
          <IonButton onClick={handleUpload}>
            Generate Risk Assessment
          </IonButton>
        </div>
        <div className="center-text">
          {assessment && <p>Risk Assessment: {assessment}</p>}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default RiskAssessment;
