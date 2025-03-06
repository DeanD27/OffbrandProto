import React, { useState } from 'react';
import { 
  IonCard, IonCardContent, IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonSelect, 
  IonSelectOption, IonItem, IonLabel, IonList, IonCheckbox, IonRadioGroup, IonRadio } from '@ionic/react';
import './RiskPage.css';

const RiskAssessment: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [assessment, setAssessment] = useState<string | null>(null);
  const [answers, setAnswers] = useState<{ [key: string]: any }>({});

  const industries = ['Finance', 'Healthcare', 'Technology', 'Manufacturing', 'Other'];
  const countries = ['United States', 'United Kingdom', 'Canada', 'Germany', 'India', 'China', 'Other'];


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

  const handleAnswerChange = (questionId: string, value: any) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = async () => {
    console.log(answers)
    const response = await fetch("http://127.0.0.1:5000/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ responses: answers }), // Send responses to backend
    });
  
    const data = await response.json();
    console.log(data)
    setAssessment(data.risk_analysis); // Display AI-generated risk summary
  };
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Risk Assessment Questionnaire</IonTitle>
        </IonToolbar>
      </IonHeader>
      
      <IonContent className="ion-padding">
        <IonList>

          {/* Industry Selection */}
          <IonItem>
            <IonLabel>What is your organization’s primary industry?</IonLabel>
            <IonSelect 
              placeholder="Select Industry" 
              onIonChange={(e) => handleAnswerChange('industry', e.detail.value)}
            >
              {industries.map((industry) => (
                <IonSelectOption key={industry} value={industry}>{industry}</IonSelectOption>
              ))}
            </IonSelect>
          </IonItem>

          {/* Headquarters Selection */}
          <IonItem>
            <IonLabel>Where is your organization headquartered?</IonLabel>
            <IonSelect 
              placeholder="Select Country" 
              onIonChange={(e) => handleAnswerChange('headquarters', e.detail.value)}
            >
              {countries.map((country) => (
                <IonSelectOption key={country} value={country}>{country}</IonSelectOption>
              ))}
            </IonSelect>
          </IonItem>

          {/* Multi-Select Operating Countries */}
          <IonItem>
            <IonLabel>In which countries does your organization operate?</IonLabel>
          </IonItem>
          {countries.map((country) => (
            <IonItem key={country}>
              <IonLabel>{country}</IonLabel>
              <IonCheckbox 
                slot="start" 
                onIonChange={(e) => {
                  const selected = answers.operatingCountries || [];
                  handleAnswerChange('operatingCountries', e.detail.checked 
                    ? [...selected, country] 
                    : selected.filter((c: string) => c !== country)
                  );
                }} 
              />
            </IonItem>
          ))}

          {/* Employee Size */}
          <IonItem>
            <IonLabel>What is the size of your organization in terms of employees?</IonLabel>
          </IonItem>
          <IonRadioGroup onIonChange={(e) => handleAnswerChange('employeeSize', e.detail.value)}>
            {['Less than 50', '50–250', '250–1000', 'More than 1000'].map((size) => (
              <IonItem key={size}>
                <IonLabel>{size}</IonLabel>
                <IonRadio slot="start" value={size} />
              </IonItem>
            ))}
          </IonRadioGroup>

          {/* Yes/No Questions */}
          {[
            { id: 'highRiskRegion', text: 'Does your organization operate in high-risk regions for corruption or compliance violations?' },
            { id: 'thirdPartyRisk', text: 'Does your organization engage with third parties in high-risk jurisdictions?' },
            { id: 'dataMonitoring', text: 'Does your organization have processes in place to monitor data privacy and security risks?' },
            { id: 'leaderTraining', text: 'Are senior leaders involved in ethics and compliance training?' }
          ].map((q) => (
            <IonItem key={q.id}>
              <IonLabel>{q.text}</IonLabel>
              <IonRadioGroup onIonChange={(e) => handleAnswerChange(q.id, e.detail.value)}>
                <IonItem><IonLabel>Yes</IonLabel><IonRadio slot="start" value="Yes" /></IonItem>
                <IonItem><IonLabel>No</IonLabel><IonRadio slot="start" value="No" /></IonItem>
              </IonRadioGroup>
            </IonItem>
          ))}

          {/* Sanctions Risk Question */}
          <IonItem>
            <IonLabel>Are you aware of any potential exposure to sanctions risks?</IonLabel>
            <IonRadioGroup onIonChange={(e) => handleAnswerChange('sanctionsRisk', e.detail.value)}>
              {['Yes', 'No', 'Not Sure'].map((option) => (
                <IonItem key={option}>
                  <IonLabel>{option}</IonLabel>
                  <IonRadio slot="start" value={option} />
                </IonItem>
              ))}
            </IonRadioGroup>
          </IonItem>

          {/* ESG Risk Confidence Scale */}
          <IonItem>
            <IonLabel>How confident are you in your organization’s ESG policies? (1 = Not Confident, 5 = Very Confident)</IonLabel>
          </IonItem>
          <IonRadioGroup onIonChange={(e) => handleAnswerChange('esgConfidence', e.detail.value)}>
            {[1, 2, 3, 4, 5].map((num) => (
              <IonItem key={num}>
                <IonLabel>{num}</IonLabel>
                <IonRadio slot="start" value={num} />
              </IonItem>
            ))}
          </IonRadioGroup>

          {/* Code of Conduct Agreement */}
          <IonItem>
            <IonLabel>Does your organization have a formal Code of Conduct?</IonLabel>
          </IonItem>
          <IonRadioGroup onIonChange={(e) => handleAnswerChange('codeOfConduct', e.detail.value)}>
            {['Strongly Agree', 'Agree', 'Neutral', 'Disagree', 'Strongly Disagree'].map((option) => (
              <IonItem key={option}>
                <IonLabel>{option}</IonLabel>
                <IonRadio slot="start" value={option} />
              </IonItem>
            ))}
          </IonRadioGroup>

          {/* Code of Conduct Update Frequency */}
          <IonItem>
            <IonLabel>How frequently is the Code of Conduct updated?</IonLabel>
            <IonSelect placeholder="Select Frequency" onIonChange={(e) => handleAnswerChange('codeUpdateFrequency', e.detail.value)}>
              {['Annually', 'Bi-Annually', 'As Needed', 'Never'].map((option) => (
                <IonSelectOption key={option} value={option}>{option}</IonSelectOption>
              ))}
            </IonSelect>
          </IonItem>

          {/* Ethics & Compliance Training Frequency */}
          <IonItem>
            <IonLabel>Does your organization provide regular training on ethics and compliance?</IonLabel>
            <IonSelect placeholder="Select Frequency" onIonChange={(e) => handleAnswerChange('ethicsTraining', e.detail.value)}>
              {['Annually', 'Bi-Annually', 'Less Frequently', 'Never'].map((option) => (
                <IonSelectOption key={option} value={option}>{option}</IonSelectOption>
              ))}
            </IonSelect>
          </IonItem>

        </IonList>

        {/* Submit Button */}
        <IonButton expand="full" onClick={handleSubmit}>Submit Responses</IonButton>

        {assessment && (
          <IonCard className="assessment-card">
            <IonCardContent>
              <h2>Risk Assessment Result:</h2>
              <p>{assessment}</p> {/* ✅ Display AI-generated risk summary */}
            </IonCardContent>
          </IonCard>
        )}

      </IonContent>
    </IonPage>
  );
};
export default RiskAssessment;