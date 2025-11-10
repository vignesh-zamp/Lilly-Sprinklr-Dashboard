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

export type CaseSource = 'Twitter' | 'Facebook' | 'Email' | 'Chat' | 'Unknown' | 'Instagram' | 'TikTok';

export type Case = {
  id: string;
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
  properties: {
    status: 'Open' | 'Pending' | 'Resolved' | 'Closed';
    priority: 'Low' | 'Medium' | 'High' | 'Urgent';
    slaStatus: 'On Track' | 'At Risk' | 'Breached';
    report_type: string;
    lilly_products: string;
    language: 'English' | 'Spanish' | 'French';
    tags: string[];
  };
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
  priority: ['Low', 'Medium', 'High', 'Urgent'],
  slaStatus: ['On Track', 'At Risk', 'Breached'],
  language: ['English', 'Spanish', 'French'],
};
