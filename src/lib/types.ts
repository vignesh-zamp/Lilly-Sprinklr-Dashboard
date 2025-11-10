import type { LucideIcon } from 'lucide-react';

export type Agent = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
};

export type Message = {
  id: string;
  author: string;
  avatarUrl: string;
  text: string;
  timestamp: string;
};

export const caseStatuses = [
  'Assigned to Pace',
  'All Demo - Awaiting',
  'Demo - Mentions',
  'All Assigned',
  'All Awaiting response',
  'All closed',
] as const;

export type CaseStatus = (typeof caseStatuses)[number];

export type CaseSource = 'Twitter' | 'Meta' | 'Email' | 'Chat' | 'Unknown' | 'Instagram' | 'TikTok';

export type CaseProperties = {
  status: 'Open' | 'Pending' | 'Resolved' | 'Closed';
  priority: 'low' | 'medium' | 'high' | 'very high';
  slaStatus: 'On Track' | 'At Risk' | 'Breached';
  report_type: string;
  lilly_products: string | string[];
  language: 'English' | 'Spanish' | 'French';
  tags: string[];
  country: string;
  associated_messages: number;
  customStatus: 'new' | 'assigned' | 'in progress' | 'closed';
  corporate?: string[];
  audience?: string[];
  compliance?: string[];
  therapeuticArea?: string[];
  topicGeneral?: string[];
  brand?: string[];
  lillyHealthApp?: string[];
  // New properties from image
  channel: string;
  region: string;
  issueType: string;
  themeMatches: string;
  topicMatches: string;
  topicGroupMatches: string;
  sourcedFromListening: string;
  sourcedFromCTM: string;
  ctmAdId: string;
  initialMessagePrivacy: string;
  hcpType: string;
  patientGender: string;
  patientAge: string;
  contactedPoster: string;
  posterConsent: string;
  posterContactInfo: string;
  lotControlNumber: string;
};


export type Case = {
  id: string;
  uniqueId?: string; // For handling repeated cases in different columns
  title: string;
  preview: string;
  status: CaseStatus;
  assignee?: Agent;
  createdAt: string;
  source: string; // From channel
  user: {
    name: string;
    handle: string;
    avatarUrl: string;
  };
  conversation: Message[];
  properties: CaseProperties;
};

export type RawCase = {
    case_id: string;
    extraction_timestamp: string;
    channel: string;
    lilly_agent_assigned: string;
    reporter_information: string;
    receipt_date: string;
    lilly_products: string;
    respondent_type: string;
    hcp_type: string;
    patient_gender: string;
    patient_age: string;
    ae_pc_details: string;
    report_type: string;
    contacted_poster: string;
    poster_consent: string;
    poster_contact_info: string;
    lot_control_number: string;
};


export const propertyOptions = {
  status: ['Open', 'Pending', 'Resolved', 'Closed'],
  priority: ['low', 'medium', 'high', 'very high'],
  slaStatus: ['On Track', 'At Risk', 'Breached'],
  language: ['English', 'Spanish', 'French'],
  corporate: [
    'Corporate A', 
    'Corporate B', 
    'Corporate C'
  ],
  audience: [
    "Consumer-General",
    "Health Care Provider",
    "Media/Press",
    "Academia",
    "Advocacy",
    "Business Partner/Provider",
    "Careers-Graduate",
    "Careers-Intern",
    "Careers-IT"
  ],
  productLilly: [
    "Mounjaro",
    "Trulicity",
    "Taltz",
    "Verzenio",
    "Jardiance",
    "Tempo",
    "Trials",
    "Zepbound",
    "Zepbound Vial",
    "Basaglar",
    "Cyramza",
    "Humalog"
  ],
  compliance: [
    "AE",
    "AE and PC",
    "PC",
    "Compounding",
    "Dosage Manipulation",
    "Fraud/Counterfeit",
    "None"
  ],
  therapeuticArea: [
    "Cancer-Colorectal",
    "Cancer-Early Breast Cancer (EBC)",
    "Cancer-Esophageal",
    "Cancer-Gastric",
    "Cancer-Gastrointestinal",
    "Cancer-General",
    "Diabetes",
    "Immunology"
  ],
  topicGeneral: [
    "Product-Experience-P",
    "Medfinder-P",
    "Side Effects",
    "Dosage Questions"
  ],
  brand: [
    "Brand A",
    "Brand B",
    "Brand C"
  ],
  lillyHealthApp: [
    "App Feature",
    "Technical Issue",
    "General Inquiry"
  ]
} as const;
    