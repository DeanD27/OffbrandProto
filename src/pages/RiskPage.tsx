import React, { useState } from 'react';
import {
  IonCard, IonCardContent, IonPage, IonHeader, IonToolbar, IonTitle,
  IonContent, IonButton, IonSelect, IonSelectOption, IonItem, IonLabel,
  IonList, IonCheckbox, IonRadioGroup, IonRadio, IonSpinner
} from '@ionic/react';
import './RiskPage.css';

const RiskAssessment: React.FC = () => {
  const [mistralAssessment, setMistralAssessment] = useState<string | null>(null);
  const [gemmaJudgment, setGemmaJudgment] = useState<string | null>(null);
  const [answers, setAnswers] = useState<{ [key: string]: any }>({});
  const [loading, setLoading] = useState<boolean>(false);

  const industries = ['Finance', 'Healthcare', 'Technology', 'Manufacturing', 'Other'];
  const countries = ['United States', 'United Kingdom', 'Canada', 'Germany', 'India', 'China', 'Other'];

  const handleAnswerChange = (questionId: string, value: any) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setMistralAssessment(null);
      setGemmaJudgment(null);

      const response = await fetch("http://127.0.0.1:5000/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ responses: answers }),
      });

      const data = await response.json();
      console.log("Backend response:", data);

      setMistralAssessment(data.mistral_analysis);
      setGemmaJudgment(data.gemma_judgment);
    } catch (error) {
      console.error("Submission failed:", error);
      alert("There was an error submitting your responses.");
    } finally {
      setLoading(false);
    }
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
          {/* Industry */}
          <IonItem>
            <IonLabel>Primary Industry</IonLabel>
            <IonSelect placeholder="Select Industry" onIonChange={(e) => handleAnswerChange('industry', e.detail.value)}>
              {industries.map(industry => (
                <IonSelectOption key={industry} value={industry}>{industry}</IonSelectOption>
              ))}
            </IonSelect>
          </IonItem>

          {/* Headquarters */}
          <IonItem>
            <IonLabel>Headquarters Country</IonLabel>
            <IonSelect placeholder="Select Country" onIonChange={(e) => handleAnswerChange('headquarters', e.detail.value)}>
              {countries.map(country => (
                <IonSelectOption key={country} value={country}>{country}</IonSelectOption>
              ))}
            </IonSelect>
          </IonItem>

          {/* Operating Countries */}
          <IonItem><IonLabel>Operating Countries</IonLabel></IonItem>
          {countries.map(country => (
            <IonItem key={country}>
              <IonLabel>{country}</IonLabel>
              <IonCheckbox
                slot="start"
                onIonChange={(e) => {
                  const selected = answers.operatingCountries || [];
                  handleAnswerChange(
                    'operatingCountries',
                    e.detail.checked
                      ? [...selected, country]
                      : selected.filter((c: string) => c !== country)
                  );
                }}
              />
            </IonItem>
          ))}

          {/* Employee Size */}
          <IonItem><IonLabel>Employee Size</IonLabel></IonItem>
          <IonRadioGroup onIonChange={(e) => handleAnswerChange('employeeSize', e.detail.value)}>
            {['Less than 50', '50–250', '250–1000', 'More than 1000'].map(size => (
              <IonItem key={size}>
                <IonLabel>{size}</IonLabel>
                <IonRadio slot="start" value={size} />
              </IonItem>
            ))}
          </IonRadioGroup>

          {/* Yes/No Questions */}
          {[
            { id: 'highRiskRegion', text: 'Operate in high-risk regions for corruption?' },
            { id: 'thirdPartyRisk', text: 'Engage with third parties in risky areas?' },
            { id: 'dataMonitoring', text: 'Have data privacy monitoring processes?' },
            { id: 'leaderTraining', text: 'Do leaders get ethics training?' }
          ].map(q => (
            <IonItem key={q.id}>
              <IonLabel>{q.text}</IonLabel>
              <IonRadioGroup onIonChange={(e) => handleAnswerChange(q.id, e.detail.value)}>
                <IonItem><IonLabel>Yes</IonLabel><IonRadio slot="start" value="Yes" /></IonItem>
                <IonItem><IonLabel>No</IonLabel><IonRadio slot="start" value="No" /></IonItem>
              </IonRadioGroup>
            </IonItem>
          ))}

          {/* Sanctions Risk */}
          <IonItem><IonLabel>Exposure to sanctions risk?</IonLabel></IonItem>
          <IonRadioGroup onIonChange={(e) => handleAnswerChange('sanctionsRisk', e.detail.value)}>
            {['Yes', 'No', 'Not Sure'].map(option => (
              <IonItem key={option}>
                <IonLabel>{option}</IonLabel>
                <IonRadio slot="start" value={option} />
              </IonItem>
            ))}
          </IonRadioGroup>

          {/* ESG Confidence */}
          <IonItem><IonLabel>Confidence in ESG policies? (1–5)</IonLabel></IonItem>
          <IonRadioGroup onIonChange={(e) => handleAnswerChange('esgConfidence', e.detail.value)}>
            {[1, 2, 3, 4, 5].map(num => (
              <IonItem key={num}>
                <IonLabel>{num}</IonLabel>
                <IonRadio slot="start" value={num} />
              </IonItem>
            ))}
          </IonRadioGroup>

          {/* Code of Conduct Agreement */}
          <IonItem><IonLabel>Formal Code of Conduct?</IonLabel></IonItem>
          <IonRadioGroup onIonChange={(e) => handleAnswerChange('codeOfConduct', e.detail.value)}>
            {['Strongly Agree', 'Agree', 'Neutral', 'Disagree', 'Strongly Disagree'].map(option => (
              <IonItem key={option}>
                <IonLabel>{option}</IonLabel>
                <IonRadio slot="start" value={option} />
              </IonItem>
            ))}
          </IonRadioGroup>

          {/* Code Update Frequency */}
          <IonItem>
            <IonLabel>Code of Conduct Update Frequency</IonLabel>
            <IonSelect placeholder="Select Frequency" onIonChange={(e) => handleAnswerChange('codeUpdateFrequency', e.detail.value)}>
              {['Annually', 'Bi-Annually', 'As Needed', 'Never'].map(option => (
                <IonSelectOption key={option} value={option}>{option}</IonSelectOption>
              ))}
            </IonSelect>
          </IonItem>

          {/* Training Frequency */}
          <IonItem>
            <IonLabel>Ethics Training Frequency</IonLabel>
            <IonSelect placeholder="Select Frequency" onIonChange={(e) => handleAnswerChange('ethicsTraining', e.detail.value)}>
              {['Annually', 'Bi-Annually', 'Less Frequently', 'Never'].map(option => (
                <IonSelectOption key={option} value={option}>{option}</IonSelectOption>
              ))}
            </IonSelect>
          </IonItem>
        </IonList>

        {/* Submit */}
        <IonButton expand="full" onClick={handleSubmit} disabled={loading}>
          {loading ? <IonSpinner name="dots" /> : "Submit Responses"}
        </IonButton>

        {/* Mistral Analysis Output */}
        {mistralAssessment && (
          <IonCard className="assessment-card">
            <IonCardContent>
              <h2>Mistral Risk Analysis:</h2>
              <p style={{ whiteSpace: 'pre-line' }}>{mistralAssessment}</p>
            </IonCardContent>
          </IonCard>
        )}

        {/* Gemma Judgment Output */}
        {gemmaJudgment && (
          <IonCard className="assessment-card">
            <IonCardContent>
              <h2>Gemma's Judgment:</h2>
              <p style={{ whiteSpace: 'pre-line' }}>{gemmaJudgment}</p>
            </IonCardContent>
          </IonCard>
        )}
      </IonContent>
    </IonPage>
  );
};

export default RiskAssessment;
