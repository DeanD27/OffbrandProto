
import React, { useState } from 'react';
import {
  IonCard, IonCardContent, IonPage, IonHeader, IonToolbar, IonTitle,
  IonContent, IonButton, IonSelect, IonSelectOption, IonItem, IonLabel,
  IonList, IonCheckbox, IonRadioGroup, IonRadio, IonSpinner, IonInput
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
      setMistralAssessment(data.mistral_analysis);
      setGemmaJudgment(data.gemma_judgment);
    } catch (error) {
      console.error("Submission failed:", error);
      alert("There was an error submitting your responses.");
    } finally {
      setLoading(false);
    }
  };

  const checkboxList = (options: string[], answerKey: string) =>
    options.map(option => (
      <IonItem key={option}>
        <IonLabel>{option}</IonLabel>
        <IonCheckbox
          slot="start"
          checked={answers[answerKey]?.includes(option)}
          onIonChange={(e) => {
            const selected = answers[answerKey] || [];
            handleAnswerChange(
              answerKey,
              e.detail.checked
                ? [...selected, option]
                : selected.filter((item: string) => item !== option)
            );
          }}
        />
      </IonItem>
    ));

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Risk Assessment Questionnaire</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonList>
          {/* Section 1: Organization Profile */}
          <IonItem>
            <IonLabel>Primary Industry</IonLabel>
            <IonSelect placeholder="Select Industry" onIonChange={(e) => handleAnswerChange('industry', e.detail.value)}>
              {industries.map(industry => (
                <IonSelectOption key={industry} value={industry}>{industry}</IonSelectOption>
              ))}
            </IonSelect>
          </IonItem>

          <IonItem>
            <IonLabel>Headquarters Country</IonLabel>
            <IonSelect placeholder="Select Country" onIonChange={(e) => handleAnswerChange('headquarters', e.detail.value)}>
              {countries.map(country => (
                <IonSelectOption key={country} value={country}>{country}</IonSelectOption>
              ))}
            </IonSelect>
          </IonItem>

          <IonItem><IonLabel>Operating Countries</IonLabel></IonItem>
          {checkboxList(countries, 'operatingCountries')}

          <IonItem><IonLabel>Employee Size</IonLabel></IonItem>
          <IonRadioGroup onIonChange={(e) => handleAnswerChange('employeeSize', e.detail.value)}>
            {['Less than 50', '50–250', '250–1000', 'More than 1000'].map(size => (
              <IonItem key={size}>
                <IonLabel>{size}</IonLabel>
                <IonRadio slot="start" value={size} />
              </IonItem>
            ))}
          </IonRadioGroup>

          <IonItem><IonLabel>Annual Revenue</IonLabel></IonItem>
          <IonRadioGroup onIonChange={(e) => handleAnswerChange('annualRevenue', e.detail.value)}>
            {['Less than $10 million', '$10–50 million', '$50–500 million', 'More than $500 million'].map(rev => (
              <IonItem key={rev}>
                <IonLabel>{rev}</IonLabel>
                <IonRadio slot="start" value={rev} />
              </IonItem>
            ))}
          </IonRadioGroup>

          <IonItem><IonLabel>Motivation for Assessment</IonLabel></IonItem>
          {checkboxList([
            'Requirement from a joint venture partner',
            'Recent ethics and compliance event',
            'Requirement from the board',
            'Motivated by recent scandals or headlines',
            'Other'
          ], 'assessmentMotivation')}

          {answers.assessmentMotivation?.includes('Other') && (
            <IonItem>
              <IonLabel position="stacked">Please specify</IonLabel>
              <IonInput onIonChange={(e) => handleAnswerChange('assessmentMotivationOther', e.detail.value!)} />
            </IonItem>
          )}

          {/* Section 2: Exposure to Risks */}
          {[
            ['highRiskRegion', 'Operate in high-risk regions for corruption?'],
            ['thirdPartyRisk', 'Engage with third parties in risky areas?'],
            ['sanctionsRisk', 'Exposure to sanctions risk?', ['Yes', 'No', 'Not Sure']],
            ['dataMonitoring', 'Have data privacy monitoring processes?'],
            ['modernSlaveryDueDiligence', 'Due diligence for modern slavery laws?']
          ].map(([id, text, opts]) => (
            <IonItem key={id}>
              <IonLabel>{text}</IonLabel>
              <IonRadioGroup onIonChange={(e) => handleAnswerChange(id, e.detail.value)}>
                {(opts || ['Yes', 'No']).map(opt => (
                  <IonItem key={opt}><IonLabel>{opt}</IonLabel><IonRadio slot="start" value={opt} /></IonItem>
                ))}
              </IonRadioGroup>
            </IonItem>
          ))}

          <IonItem><IonLabel>Confidence in ESG policies? (1–5)</IonLabel></IonItem>
          <IonRadioGroup onIonChange={(e) => handleAnswerChange('esgConfidence', e.detail.value)}>
            {[1, 2, 3, 4, 5].map(num => (
              <IonItem key={num}>
                <IonLabel>{num}</IonLabel>
                <IonRadio slot="start" value={num} />
              </IonItem>
            ))}
          </IonRadioGroup>

          {/* Section 3: Ethics & Compliance */}
          <IonItem><IonLabel>Formal Code of Conduct?</IonLabel></IonItem>
          <IonRadioGroup onIonChange={(e) => handleAnswerChange('codeOfConduct', e.detail.value)}>
            {['Strongly Agree', 'Agree', 'Neutral', 'Disagree', 'Strongly Disagree'].map(opt => (
              <IonItem key={opt}><IonLabel>{opt}</IonLabel><IonRadio slot="start" value={opt} /></IonItem>
            ))}
          </IonRadioGroup>

          <IonItem>
            <IonLabel>Code Update Frequency</IonLabel>
            <IonSelect placeholder="Select" onIonChange={(e) => handleAnswerChange('codeUpdateFrequency', e.detail.value)}>
              {['Annually', 'Bi-Annually', 'As Needed', 'Never'].map(opt => (
                <IonSelectOption key={opt} value={opt}>{opt}</IonSelectOption>
              ))}
            </IonSelect>
          </IonItem>

          <IonItem>
            <IonLabel>Ethics Training Frequency</IonLabel>
            <IonSelect placeholder="Select" onIonChange={(e) => handleAnswerChange('ethicsTraining', e.detail.value)}>
              {['Annually', 'Bi-Annually', 'Less Frequently', 'Never'].map(opt => (
                <IonSelectOption key={opt} value={opt}>{opt}</IonSelectOption>
              ))}
            </IonSelect>
          </IonItem>

          <IonItem><IonLabel>Are senior leaders involved in training?</IonLabel></IonItem>
          <IonRadioGroup onIonChange={(e) => handleAnswerChange('leaderTraining', e.detail.value)}>
            {['Yes', 'No'].map(opt => (
              <IonItem key={opt}><IonLabel>{opt}</IonLabel><IonRadio slot="start" value={opt} /></IonItem>
            ))}
          </IonRadioGroup>

          {/* Submit */}
          <IonButton expand="full" onClick={handleSubmit} disabled={loading}>
            {loading ? <IonSpinner name="dots" /> : "Submit Responses"}
          </IonButton>

          {/* Outputs */}
          {mistralAssessment && (
            <IonCard className="assessment-card">
              <IonCardContent>
                <h2>Mistral Risk Analysis:</h2>
                <p style={{ whiteSpace: 'pre-line' }}>{mistralAssessment}</p>
              </IonCardContent>
            </IonCard>
          )}
          {gemmaJudgment && (
            <IonCard className="assessment-card">
              <IonCardContent>
                <h2>Gemma's Judgment:</h2>
                <p style={{ whiteSpace: 'pre-line' }}>{gemmaJudgment}</p>
              </IonCardContent>
            </IonCard>
          )}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default RiskAssessment;
