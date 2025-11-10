import type { Agent, Case } from './types';

export const agents: Agent[] = [
  { id: '1', name: 'Pace', email: 'pace@zamp.ai', avatarUrl: 'https://picsum.photos/seed/pace/40/40' },
  { id: '2', name: 'Sherina', email: 'sherina@example.com', avatarUrl: 'https://picsum.photos/seed/sherina/40/40' },
  { id: '3', name: 'John Doe', email: 'john.doe@example.com', avatarUrl: 'https://picsum.photos/seed/john/40/40' },
  { id: '4', name: 'Jane Smith', email: 'jane.smith@example.com', avatarUrl: 'https://picsum.photos/seed/jane/40/40' },
];

const paceAgent = agents.find(a => a.email === 'pace@zamp.ai')!;
const sherinaAgent = agents.find(a => a.email === 'sherina@example.com')!;


export const initialCases: Case[] = [
  {
    id: '240509-000451',
    title: 'Is there a patient access program that covers the cost...',
    preview: 'Hi, I was wondering if there is a patient access program that covers the cost of Trulicity for uninsured patients.',
    status: 'All Demo - Awaiting',
    createdAt: 'a day ago',
    source: 'Twitter',
    user: { name: 'PatientInquiry', handle: '@patientinquiry', avatarUrl: 'https://picsum.photos/seed/user1/40/40' },
    properties: { status: 'Open', priority: 'Medium', slaStatus: 'On Track', customStatus: 'Inquiry', language: 'English', tags: ['Trulicity', 'Cost'] },
    conversation: [
      { id: 'msg1', author: 'PatientInquiry', avatarUrl: 'https://picsum.photos/seed/user1/40/40', text: 'Hi, I was wondering if there is a patient access program that covers the cost of Trulicity for uninsured patients.', timestamp: 'a day ago' },
    ],
  },
  {
    id: '240509-000450',
    title: 'How can I manage my side effects from Mounjaro?',
    preview: 'I just started Mounjaro and am experiencing some nausea. Any tips on how to manage this? #mounjaro #sideeffects',
    status: 'Demo - Mentions',
    createdAt: 'a day ago',
    source: 'Twitter',
    user: { name: 'NewUser', handle: '@newuser', avatarUrl: 'https://picsum.photos/seed/user2/40/40' },
    properties: { status: 'Open', priority: 'Low', slaStatus: 'On Track', customStatus: 'Inquiry', language: 'English', tags: ['Mounjaro', 'Side Effects'] },
    conversation: [
        { id: 'msg1', author: 'NewUser', avatarUrl: 'https://picsum.photos/seed/user2/40/40', text: 'I just started Mounjaro and am experiencing some nausea. Any tips on how to manage this? #mounjaro #sideeffects', timestamp: 'a day ago' },
    ],
  },
  {
    id: '240509-000449',
    title: 'Thank you for the quick response and help!',
    preview: 'Just wanted to say thanks to the support team for helping me with my prescription issue. Great service!',
    status: 'All closed',
    assignee: sherinaAgent,
    createdAt: '2 days ago',
    source: 'Facebook',
    user: { name: 'HappyCustomer', handle: 'HappyCustomer', avatarUrl: 'https://picsum.photos/seed/user3/40/40' },
    properties: { status: 'Closed', priority: 'Low', slaStatus: 'On Track', customStatus: 'Feedback', language: 'English', tags: ['Positive Feedback'] },
    conversation: [
        { id: 'msg1', author: 'HappyCustomer', avatarUrl: 'https://picsum.photos/seed/user3/40/40', text: 'Just wanted to say thanks to the support team for helping me with my prescription issue. Great service!', timestamp: '2 days ago' },
        { id: 'msg2', author: 'Sherina', avatarUrl: sherinaAgent.avatarUrl, text: 'You are very welcome! We are happy we could help.', timestamp: '2 days ago' },
    ],
  },
  {
    id: '240508-000448',
    title: 'Urgent: Issue with my insulin pen delivery.',
    preview: 'My delivery of Baqsimi has been delayed and I need it urgently. Can someone please help me track my order?',
    status: 'All Assigned',
    assignee: sherinaAgent,
    createdAt: '3 days ago',
    source: 'Email',
    user: { name: 'UrgentNeed', handle: 'urgent@need.com', avatarUrl: 'https://picsum.photos/seed/user4/40/40' },
    properties: { status: 'Pending', priority: 'Urgent', slaStatus: 'At Risk', customStatus: 'Escalated', language: 'English', tags: ['Delivery', 'Baqsimi'] },
    conversation: [
        { id: 'msg1', author: 'UrgentNeed', avatarUrl: 'https://picsum.photos/seed/user4/40/40', text: 'My delivery of Baqsimi has been delayed and I need it urgently. Can someone please help me track my order?', timestamp: '3 days ago' },
        { id: 'msg2', author: 'Sherina', avatarUrl: sherinaAgent.avatarUrl, text: 'I am looking into this right now for you. I will get back to you with an update shortly.', timestamp: '3 days ago' },
    ],
  },
  {
    id: '240507-000447',
    title: 'Question about Jardiance dosage.',
    preview: 'Can you please clarify the correct dosage for Jardiance? My doctor told me one thing but the packaging says another.',
    status: 'Assigned to Pace',
    assignee: paceAgent,
    createdAt: '4 days ago',
    source: 'Chat',
    user: { name: 'ConfusedPatient', handle: 'ConfusedPatient', avatarUrl: 'https://picsum.photos/seed/user5/40/40' },
    properties: { status: 'Open', priority: 'High', slaStatus: 'On Track', customStatus: 'Inquiry', language: 'English', tags: ['Jardiance', 'Dosage'] },
    conversation: [
      { id: 'msg1', author: 'ConfusedPatient', avatarUrl: 'https://picsum.photos/seed/user5/40/40', text: 'Can you please clarify the correct dosage for Jardiance? My doctor told me one thing but the packaging says another.', timestamp: '4 days ago' },
      { id: 'msg2', author: 'Pace', avatarUrl: paceAgent.avatarUrl, text: 'Let me help you with that. Can you please provide the details from your prescription?', timestamp: '4 days ago' },
    ],
  },
    {
    id: '240506-000446',
    title: 'Feedback on website usability',
    preview: 'The new website design is not very intuitive. I am having trouble finding the information I need. #feedback',
    status: 'Demo - Mentions',
    createdAt: '5 days ago',
    source: 'Twitter',
    user: { name: 'WebUser', handle: '@webuser', avatarUrl: 'https://picsum.photos/seed/user6/40/40' },
    properties: { status: 'Open', priority: 'Low', slaStatus: 'On Track', customStatus: 'Feedback', language: 'English', tags: ['Website', 'Usability'] },
    conversation: [
        { id: 'msg1', author: 'WebUser', avatarUrl: 'https://picsum.photos/seed/user6/40/40', text: 'The new website design is not very intuitive. I am having trouble finding the information I need. #feedback', timestamp: '5 days ago' },
    ],
  },
  {
    id: '240505-000445',
    title: 'Is Emgality available in Canada?',
    preview: 'I will be traveling to Canada next month and need to know if I can get my Emgality prescription filled there.',
    status: 'All Demo - Awaiting',
    createdAt: '6 days ago',
    source: 'Facebook',
    user: { name: 'Traveler', handle: 'Traveler', avatarUrl: 'https://picsum.photos/seed/user7/40/40' },
    properties: { status: 'Open', priority: 'Medium', slaStatus: 'On Track', customStatus: 'Inquiry', language: 'English', tags: ['Emgality', 'Availability'] },
    conversation: [
      { id: 'msg1', author: 'Traveler', avatarUrl: 'https://picsum.photos/seed/user7/40/40', text: 'I will be traveling to Canada next month and need to know if I can get my Emgality prescription filled there.', timestamp: '6 days ago' },
    ],
  }
];

export const getCaseById = (id: string): Case | undefined => {
  return initialCases.find(c => c.id === id);
};
