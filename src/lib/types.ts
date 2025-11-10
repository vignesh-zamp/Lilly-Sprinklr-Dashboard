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

export type CaseSource = 'Twitter' | 'Facebook' | 'Email' | 'Chat';

export type Case = {
  id: string;
  title: string;
  preview: string;
  status: CaseStatus;
  assignee?: Agent;
  createdAt: string;
  source: CaseSource;
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
    customStatus: string;
    language: 'English' | 'Spanish' | 'French';
    tags: string[];
  };
};

export const propertyOptions = {
  status: ['Open', 'Pending', 'Resolved', 'Closed'],
  priority: ['Low', 'Medium', 'High', 'Urgent'],
  slaStatus: ['On Track', 'At Risk', 'Breached'],
  customStatus: ['Status 1', 'Status 2', 'Status 3'],
  language: ['English', 'Spanish', 'French'],
};
