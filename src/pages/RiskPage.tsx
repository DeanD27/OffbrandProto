import React, { useState } from 'react';
import {
  IonCard, IonCardContent, IonPage, IonHeader, IonToolbar, IonTitle,
  IonContent, IonButton, IonSelect, IonSelectOption, IonItem, IonLabel,
  IonList, IonCheckbox, IonRadioGroup, IonRadio, IonSpinner, IonItemDivider, IonTextarea
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

      const response = await fetch("http://127.0.0.1:5000/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ responses: answers }),
      });

      const data = await response.json();
      console.log("Backend response:", data);

      setMistralAssessment(data.mistral_analysis);
    } catch (error) {
      console.error("Submission failed:", error);
      alert("There was an error submitting your responses.");
    } finally {
      setLoading(false);
    }
  };

  const yesNoOptions = ['Yes', 'No'];
  const agreeScale = ['Strongly Agree', 'Agree', 'Neutral', 'Disagree', 'Strongly Disagree'];
  const trustScale = ['Always', 'Usually', 'Sometimes', 'Rarely', 'Never'];
  const frequencyScale = ['Annually', 'Bi-Annually', 'As Needed', 'Never'];
  const agilityScale = ['1', '2', '3', '4', '5'];

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Risk Assessment Questionnaire</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonList>
          <IonItemDivider>Section 1: Organizational Context</IonItemDivider>

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

          <IonItem><IonLabel>Employee Size</IonLabel></IonItem>
          <IonRadioGroup onIonChange={(e) => handleAnswerChange('employeeSize', e.detail.value)}>
            {['Less than 50', '50–250', '250–1000', 'More than 1000'].map(size => (
              <IonItem key={size}>
                <IonLabel>{size}</IonLabel>
                <IonRadio slot="start" value={size} />
              </IonItem>
            ))}
          </IonRadioGroup>

          <IonItem>
            <IonLabel>Annual Revenue</IonLabel>
            <IonSelect placeholder="Select Revenue" onIonChange={(e) => handleAnswerChange('annualRevenue', e.detail.value)}>
              {['Less than $10 million', '$10–50 million', '$50–500 million', 'More than $500 million'].map(rev => (
                <IonSelectOption key={rev} value={rev}>{rev}</IonSelectOption>
              ))}
            </IonSelect>
          </IonItem>

          <IonItemDivider>Motivation for Conducting Assessment</IonItemDivider>
          {[ 'Requirement from a joint venture partner', 'Recent ethics and compliance event', 'Requirement from the board', 'Motivated by recent scandals or headlines', 'Other'].map((reason) => (
            <IonItem key={reason}>
              <IonLabel>{reason}</IonLabel>
              <IonCheckbox
                slot="start"
                onIonChange={(e) => {
                  const selected = answers.assessmentMotivation || [];
                  handleAnswerChange('assessmentMotivation', e.detail.checked ? [...selected, reason] : selected.filter((r: string) => r !== reason));
                }}
              />
            </IonItem>
          ))}

          {answers.assessmentMotivation?.includes('Other') && (
            <IonItem>
              <IonLabel position="stacked">Please specify</IonLabel>
              <IonTextarea onIonChange={(e) => handleAnswerChange('assessmentMotivationOther', e.detail.value)} />
            </IonItem>
          )}

          <IonItemDivider>Section 2: Exposure to Risks</IonItemDivider>
          <IonItem>
            <IonLabel>Due diligence on modern slavery compliance?</IonLabel>
            <IonRadioGroup onIonChange={(e) => handleAnswerChange('modernSlaveryDueDiligence', e.detail.value)}>
              {yesNoOptions.map(val => (
                <IonItem key={val}><IonLabel>{val}</IonLabel><IonRadio slot="start" value={val} /></IonItem>
              ))}
            </IonRadioGroup>
          </IonItem>

          {/* Assessment Motivation (Multi-select with 'Other') */}
          <IonItem><IonLabel>What motivated your organization to conduct this risk assessment?</IonLabel></IonItem>
          {[
            'Requirement from a joint venture partner',
            'Recent ethics and compliance event',
            'Requirement from the board',
            'Motivated by recent scandals or headlines',
            'Other'
          ].map((reason) => (
            <IonItem key={reason}>
              <IonLabel>{reason}</IonLabel>
              <IonCheckbox
                slot="start"
                onIonChange={(e) => {
                  const selected = answers.assessmentMotivation || [];
                  handleAnswerChange(
                    'assessmentMotivation',
                    e.detail.checked
                      ? [...selected, reason]
                      : selected.filter((r: string) => r !== reason)
                  );
                }}
              />
            </IonItem>
          ))}

          {answers.assessmentMotivation?.includes('Other') && (
            <IonItem>
              <IonLabel position="stacked">Please specify</IonLabel>
              <IonTextarea
                placeholder="Enter other motivation"
                onIonChange={(e) => handleAnswerChange('assessmentMotivationOther', e.detail.value)}
              />
            </IonItem>
          )}

          {/* Modern Slavery Due Diligence */}
          <IonItem><IonLabel>Have you conducted due diligence to identify risks related to compliance with modern slavery laws?</IonLabel></IonItem>
          <IonRadioGroup onIonChange={(e) => handleAnswerChange('modernSlaveryDueDiligence', e.detail.value)}>
            {yesNoOptions.map(opt => (
              <IonItem key={opt}><IonLabel>{opt}</IonLabel><IonRadio slot="start" value={opt} /></IonItem>
            ))}
          </IonRadioGroup>

          {/* Board Review Frequency */}
          <IonItem><IonLabel>How frequently does the board review reports on ethics and compliance performance?</IonLabel></IonItem>
          <IonRadioGroup onIonChange={(e) => handleAnswerChange('boardReviewFrequency', e.detail.value)}>
            {frequencyScale.map(opt => (
              <IonItem key={opt}><IonLabel>{opt}</IonLabel><IonRadio slot="start" value={opt} /></IonItem>
            ))}
          </IonRadioGroup>

          {/* Leader Accountability */}
          <IonItem><IonLabel>Are senior leaders held accountable for compliance violations or ethical breaches?</IonLabel></IonItem>
          <IonRadioGroup onIonChange={(e) => handleAnswerChange('leaderAccountability', e.detail.value)}>
            {trustScale.map(opt => (
              <IonItem key={opt}><IonLabel>{opt}</IonLabel><IonRadio slot="start" value={opt} /></IonItem>
            ))}
          </IonRadioGroup>

          {/* Leadership Ethics Communication */}
          <IonItem><IonLabel>Does senior leadership communicate the importance of ethical behavior across all levels of the organization?</IonLabel></IonItem>
          <IonRadioGroup onIonChange={(e) => handleAnswerChange('leadershipEthicsCommunication', e.detail.value)}>
            {trustScale.map(opt => (
              <IonItem key={opt}><IonLabel>{opt}</IonLabel><IonRadio slot="start" value={opt} /></IonItem>
            ))}
          </IonRadioGroup>

          <IonItemDivider>Third-Party Risk, Whistleblowing, and Emerging Risk Management</IonItemDivider>

          <IonItem><IonLabel>Do third-party contracts include clauses related to sanctions compliance and anti-corruption?</IonLabel></IonItem>
          <IonRadioGroup onIonChange={(e) => handleAnswerChange('thirdPartySanctionsClauses', e.detail.value)}>
            {yesNoOptions.map(opt => (
              <IonItem key={opt}><IonLabel>{opt}</IonLabel><IonRadio slot="start" value={opt} /></IonItem>
            ))}
          </IonRadioGroup>

          <IonItem><IonLabel>Does your organization provide training to third parties on your Code of Conduct and relevant compliance expectations?</IonLabel></IonItem>
          <IonRadioGroup onIonChange={(e) => handleAnswerChange('thirdPartyTraining', e.detail.value)}>
            {yesNoOptions.map(opt => (
              <IonItem key={opt}><IonLabel>{opt}</IonLabel><IonRadio slot="start" value={opt} /></IonItem>
            ))}
          </IonRadioGroup>

          <IonItem><IonLabel>Does your organization use data analytics or AI tools to monitor third-party supply chain risks?</IonLabel></IonItem>
          <IonRadioGroup onIonChange={(e) => handleAnswerChange('aiSupplyRiskMonitoring', e.detail.value)}>
            {yesNoOptions.map(opt => (
              <IonItem key={opt}><IonLabel>{opt}</IonLabel><IonRadio slot="start" value={opt} /></IonItem>
            ))}
          </IonRadioGroup>

          <IonItem><IonLabel>Does your organization track and report on the outcomes of ethics and compliance investigations?</IonLabel></IonItem>
          <IonRadioGroup onIonChange={(e) => handleAnswerChange('trackComplianceOutcomes', e.detail.value)}>
            {yesNoOptions.map(opt => (
              <IonItem key={opt}><IonLabel>{opt}</IonLabel><IonRadio slot="start" value={opt} /></IonItem>
            ))}
          </IonRadioGroup>

          <IonItem><IonLabel>How frequently does senior leadership review reports on whistleblowing cases or internal investigations?</IonLabel></IonItem>
          <IonRadioGroup onIonChange={(e) => handleAnswerChange('whistleReviewFrequency', e.detail.value)}>
            {frequencyScale.map(opt => (
              <IonItem key={opt}><IonLabel>{opt}</IonLabel><IonRadio slot="start" value={opt} /></IonItem>
            ))}
          </IonRadioGroup>

          <IonItem><IonLabel>Does your organization’s whistleblowing mechanism allow for anonymous reporting?</IonLabel></IonItem>
          <IonRadioGroup onIonChange={(e) => handleAnswerChange('whistleAnonymousAllowed', e.detail.value)}>
            {yesNoOptions.map(opt => (
              <IonItem key={opt}><IonLabel>{opt}</IonLabel><IonRadio slot="start" value={opt} /></IonItem>
            ))}
          </IonRadioGroup>

          <IonItem><IonLabel>Does your organization monitor supply chain risks related to sanctions, labor laws, or environmental compliance?</IonLabel></IonItem>
          <IonRadioGroup onIonChange={(e) => handleAnswerChange('supplyChainRiskMonitoring', e.detail.value)}>
            {yesNoOptions.map(opt => (
              <IonItem key={opt}><IonLabel>{opt}</IonLabel><IonRadio slot="start" value={opt} /></IonItem>
            ))}
          </IonRadioGroup>

          <IonItem><IonLabel>Does your organization take measures to ensure no retaliation occurs against whistleblowers?</IonLabel></IonItem>
          <IonRadioGroup onIonChange={(e) => handleAnswerChange('noWhistleRetaliation', e.detail.value)}>
            {yesNoOptions.map(opt => (
              <IonItem key={opt}><IonLabel>{opt}</IonLabel><IonRadio slot="start" value={opt} /></IonItem>
            ))}
          </IonRadioGroup>

          <IonItem><IonLabel>How much do you trust that accountability is enforced at all levels of your organization?</IonLabel></IonItem>
          <IonRadioGroup onIonChange={(e) => handleAnswerChange('accountabilityTrustLevel', e.detail.value)}>
            {agreeScale.map(opt => (
              <IonItem key={opt}><IonLabel>{opt}</IonLabel><IonRadio slot="start" value={opt} /></IonItem>
            ))}
          </IonRadioGroup>

          <IonItem><IonLabel>Does your organization benchmark its management of emerging risks against industry peers or global best practices?</IonLabel></IonItem>
          <IonRadioGroup onIonChange={(e) => handleAnswerChange('benchmarkEmergingRisks', e.detail.value)}>
            {yesNoOptions.map(opt => (
              <IonItem key={opt}><IonLabel>{opt}</IonLabel><IonRadio slot="start" value={opt} /></IonItem>
            ))}
          </IonRadioGroup>

          <IonItem><IonLabel>How often does your organization conduct scenario planning for potential ESG, sanctions, or compliance failures?</IonLabel></IonItem>
          <IonRadioGroup onIonChange={(e) => handleAnswerChange('scenarioPlanningFrequency', e.detail.value)}>
            {frequencyScale.map(opt => (
              <IonItem key={opt}><IonLabel>{opt}</IonLabel><IonRadio slot="start" value={opt} /></IonItem>
            ))}
          </IonRadioGroup>

          <IonItemDivider>Emerging Risk, AI Use, and Ethical Culture</IonItemDivider>

          <IonItem><IonLabel>How agile is your organization in adapting to new and emerging risks?</IonLabel></IonItem>
          <IonRadioGroup onIonChange={(e) => handleAnswerChange('riskAgilityLevel', e.detail.value)}>
            {agilityScale.map(opt => (<IonItem key={opt}><IonLabel>{opt}</IonLabel><IonRadio slot="start" value={opt} /></IonItem>))}
          </IonRadioGroup>

          <IonItem><IonLabel>Does your organization utilize AI tools to enhance ethics and compliance processes?</IonLabel></IonItem>
          <IonRadioGroup onIonChange={(e) => handleAnswerChange('useAIForCompliance', e.detail.value)}>
            {yesNoOptions.map(opt => (<IonItem key={opt}><IonLabel>{opt}</IonLabel><IonRadio slot="start" value={opt} /></IonItem>))}
          </IonRadioGroup>

          <IonItem><IonLabel>Does your organization have processes in place to monitor emerging risks such as AI ethics?</IonLabel></IonItem>
          <IonRadioGroup onIonChange={(e) => handleAnswerChange('aiEthicsMonitoring', e.detail.value)}>
            {yesNoOptions.map(opt => (<IonItem key={opt}><IonLabel>{opt}</IonLabel><IonRadio slot="start" value={opt} /></IonItem>))}
          </IonRadioGroup>

          <IonItem><IonLabel>Are AI tools used for ongoing monitoring of transactions to identify anomalies or potential compliance breaches?</IonLabel></IonItem>
          <IonRadioGroup onIonChange={(e) => handleAnswerChange('aiTransactionMonitoringOngoing', e.detail.value)}>
            {yesNoOptions.map(opt => (<IonItem key={opt}><IonLabel>{opt}</IonLabel><IonRadio slot="start" value={opt} /></IonItem>))}
          </IonRadioGroup>

          <IonItem><IonLabel>Does your organization leverage data analytics for predictive risk assessments?</IonLabel></IonItem>
          <IonRadioGroup onIonChange={(e) => handleAnswerChange('predictiveRiskAnalytics', e.detail.value)}>
            {yesNoOptions.map(opt => (<IonItem key={opt}><IonLabel>{opt}</IonLabel><IonRadio slot="start" value={opt} /></IonItem>))}
          </IonRadioGroup>

          <IonItem><IonLabel>How often does your organization evaluate the performance of AI tools in managing risks?</IonLabel></IonItem>
          <IonRadioGroup onIonChange={(e) => handleAnswerChange('aiPerformanceEvaluationFreq', e.detail.value)}>
            {frequencyScale.map(opt => (<IonItem key={opt}><IonLabel>{opt}</IonLabel><IonRadio slot="start" value={opt} /></IonItem>))}
          </IonRadioGroup>

          <IonItem><IonLabel>Does the organization’s leadership visibly demonstrate a commitment to ethical behavior?</IonLabel></IonItem>
          <IonRadioGroup onIonChange={(e) => handleAnswerChange('leadershipEthicsVisible', e.detail.value)}>
            {trustScale.map(opt => (<IonItem key={opt}><IonLabel>{opt}</IonLabel><IonRadio slot="start" value={opt} /></IonItem>))}
          </IonRadioGroup>

          <IonItem><IonLabel>Are employees encouraged to take ownership of ethical decision-making and risk management responsibilities?</IonLabel></IonItem>
          <IonRadioGroup onIonChange={(e) => handleAnswerChange('employeeEthicsOwnership', e.detail.value)}>
            {agreeScale.map(opt => (<IonItem key={opt}><IonLabel>{opt}</IonLabel><IonRadio slot="start" value={opt} /></IonItem>))}
          </IonRadioGroup>

          <IonItem><IonLabel>Does your organization have a mechanism to gather employee feedback on E&C culture regularly?</IonLabel></IonItem>
          <IonRadioGroup onIonChange={(e) => handleAnswerChange('employeeFeedbackECCulture', e.detail.value)}>
            {yesNoOptions.map(opt => (<IonItem key={opt}><IonLabel>{opt}</IonLabel><IonRadio slot="start" value={opt} /></IonItem>))}
          </IonRadioGroup>

          <IonItem><IonLabel>How confident are you that your organization promotes trust and accountability at all levels?</IonLabel></IonItem>
          <IonRadioGroup onIonChange={(e) => handleAnswerChange('trustAccountabilityConfidence', e.detail.value)}>
            {agilityScale.map(opt => (<IonItem key={opt}><IonLabel>{opt}</IonLabel><IonRadio slot="start" value={opt} /></IonItem>))}
          </IonRadioGroup>

          <IonItem><IonLabel>Are ethical principles integrated into the organization’s performance evaluation and reward systems?</IonLabel></IonItem>
          <IonRadioGroup onIonChange={(e) => handleAnswerChange('ethicsInPerformanceEvaluation', e.detail.value)}>
            {yesNoOptions.map(opt => (<IonItem key={opt}><IonLabel>{opt}</IonLabel><IonRadio slot="start" value={opt} /></IonItem>))}
          </IonRadioGroup>

          <IonItem><IonLabel>Does your organization encourage open dialogue about risk management challenges and successes?</IonLabel></IonItem>
          <IonRadioGroup onIonChange={(e) => handleAnswerChange('riskDialogueEncouraged', e.detail.value)}>
            {agreeScale.map(opt => (<IonItem key={opt}><IonLabel>{opt}</IonLabel><IonRadio slot="start" value={opt} /></IonItem>))}
          </IonRadioGroup>

          <IonItem><IonLabel>Is there a process to regularly communicate the importance of shared responsibility for risk management across all departments?</IonLabel></IonItem>
          <IonRadioGroup onIonChange={(e) => handleAnswerChange('sharedRiskResponsibilityComm', e.detail.value)}>
            {yesNoOptions.map(opt => (<IonItem key={opt}><IonLabel>{opt}</IonLabel><IonRadio slot="start" value={opt} /></IonItem>))}
          </IonRadioGroup>


        </IonList>

        <IonButton expand="full" onClick={handleSubmit} disabled={loading}>
          {loading ? <IonSpinner name="dots" /> : "Submit Responses"}
        </IonButton>

        {mistralAssessment && (
          <IonCard className="assessment-card">
            <IonCardContent>
              <h2>Mistral Risk Analysis:</h2>
              <p style={{ whiteSpace: 'pre-line' }}>{mistralAssessment}</p>
            </IonCardContent>
          </IonCard>
        )}

      </IonContent>
    </IonPage>
  );
};

export default RiskAssessment;
