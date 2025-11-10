import type { Agent, Case, RawCase } from './types';
import { formatDistanceToNow } from 'date-fns';
import rawData from './cases.json';

export const agents: Agent[] = [
  { id: '1', name: 'Pace', email: 'pace@zamp.ai', avatarUrl: 'https://picsum.photos/seed/pace/40/40' },
  { id: '2', name: 'Sherina Espinoza', email: 'sherina@example.com', avatarUrl: 'https://picsum.photos/seed/sherina/40/40' },
  { id: '3', name: 'John Doe', email: 'john.doe@example.com', avatarUrl: 'https://picsum.photos/seed/john/40/40' },
  { id: '4', name: 'Jane Smith', email: 'jane.smith@example.com', avatarUrl: 'https://picsum.photos/seed/jane/40/40' },
  { id: '5', name: 'Kunal Test', email: 'kunal@example.com', avatarUrl: 'https://picsum.photos/seed/kunal/40/40' },
  { id: '6', name: 'Sarah Johnson', email: 'sarah.j@example.com', avatarUrl: 'https://picsum.photos/seed/sarah/40/40' },
  { id: '7', name: 'Emma Wilson', email: 'emma.w@example.com', avatarUrl: 'https://picsum.photos/seed/emma/40/40' },
  { id: '8', name: 'Mike Chen', email: 'mike.c@example.com', avatarUrl: 'https://picsum.photos/seed/mike/40/40' },
  { id: '9', name: 'Lisa Brown', email: 'lisa.b@example.com', avatarUrl: 'https://picsum.photos/seed/lisa/40/40' },
  { id: '10', name: 'David Lee', email: 'david.l@example.com', avatarUrl: 'https://picsum.photos/seed/david/40/40' },
];

const getAgentByName = (name: string): Agent | undefined => {
    if (name.includes('Not specified')) return undefined;
    const agentName = name.split('\n')[0];
    return agents.find(a => a.name.toLowerCase() === agentName.toLowerCase());
}

const parseReporter = (reporter: string) => {
    const match = reporter.match(/(.*) \((.*)\)/);
    if (match) {
        return { name: match[1], handle: match[2] };
    }
    return { name: reporter, handle: '' };
};

const allCases: Case[] = (rawData.cases as RawCase[]).map((rawCase, index) => {
    const { name, handle } = parseReporter(rawCase.reporter_information);
    const assignedAgent = getAgentByName(rawCase.lilly_agent_assigned);
    
    // Distribute cases as requested
    let status: Case['status'] = 'All Assigned';
    if (index < 4) {
      status = 'All closed';
    } else if (index < 12) { // 8 cases
      status = 'All Demo - Awaiting';
    } else if (index < 16) { // 4 cases, total 12 will be in demo mentions
        // continue as all assigned, but logic in page will put it in demo mentions
    }
    
    return {
        id: rawCase.case_id,
        title: rawCase.ae_pc_details.substring(0, 50) + '...',
        preview: rawCase.ae_pc_details,
        status: status,
        assignee: assignedAgent,
        createdAt: formatDistanceToNow(new Date(rawCase.receipt_date), { addSuffix: true }),
        source: rawCase.channel,
        user: {
            name: name,
            handle: handle,
            avatarUrl: `https://picsum.photos/seed/user${rawCase.case_id}/40/40`,
        },
        conversation: [
            { id: 'msg1', author: name, avatarUrl: `https://picsum.photos/seed/user${rawCase.case_id}/40/40`, text: rawCase.ae_pc_details, timestamp: formatDistanceToNow(new Date(rawCase.receipt_date), { addSuffix: true }) },
        ],
        properties: {
            status: 'Open', // default
            priority: 'Medium', // default
            slaStatus: 'On Track', // default
            report_type: rawCase.report_type,
            lilly_products: rawCase.lilly_products,
            language: 'English', // default
            tags: rawCase.lilly_products !== 'Unknown' ? [rawCase.lilly_products] : [],
        },
    };
});


// "Add 16 to all Assigned"
const allAssignedCases = allCases.slice(4); // 20 - 4 = 16 cases

// "a subset of size 12 of those to Demo Mentioned"
const demoMentionsCases = allAssignedCases.slice(0, 12).map(c => ({...c, status: 'Demo - Mentions' as const}));

// "a subset of 8 of those exact to Demo - Awaiting"
const demoAwaitingCases = demoMentionsCases.slice(0, 8).map(c => ({...c, status: 'All Demo - Awaiting' as const}));

// "and 4 to closed"
const closedCases = allCases.slice(0, 4).map(c => ({...c, status: 'All closed' as const}));

// Combine them, avoiding duplicates
// Start with allAssigned, then overwrite with more specific statuses
const caseMap = new Map<string, Case>();

allAssignedCases.forEach(c => caseMap.set(c.id, c));
demoMentionsCases.forEach(c => caseMap.set(c.id, c));
demoAwaitingCases.forEach(c => caseMap.set(c.id, c));
closedCases.forEach(c => caseMap.set(c.id, c));

export const initialCases: Case[] = Array.from(caseMap.values());


export const getCaseById = (id: string): Case | undefined => {
  return initialCases.find(c => c.id === id);
};
