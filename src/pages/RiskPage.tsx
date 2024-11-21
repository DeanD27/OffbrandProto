import React, { useState } from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonInput } from '@ionic/react';

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
        <h2>Upload CSV for Risk Assessment</h2>
        <input type="file" accept=".csv" onChange={handleFileChange} />
        <IonButton expand="block" onClick={handleUpload}>
          Generate Risk Assessment
        </IonButton>
        {assessment && <p>Risk Assessment: {assessment}</p>}
      </IonContent>
    </IonPage>
  );
};

export default RiskAssessment;
