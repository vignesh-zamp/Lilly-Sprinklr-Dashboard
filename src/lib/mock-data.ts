
import type { Agent, Case, RawCase } from './types';
import { formatDistanceToNow } from 'date-fns';
import rawData from './cases.json';

export const agents: Agent[] = [
  { id: '1', name: 'Pace', email: 'pace@zamp.ai', avatarUrl: 'https://picsum.photos/seed/pace/40/40' },
  { id: '2', name: 'Sherina Espinoza', email: 'sherina.espinoza@lilly.com', avatarUrl: 'https://picsum.photos/seed/sherina/40/40' },
  { id: '3', name: 'Kunal Test', email: 'kunal.test@lilly.com', avatarUrl: 'https://picsum.photos/seed/kunal/40/40' },
  { id: '4', name: 'Sarah Johnson', email: 'sarah.johnson@lilly.com', avatarUrl: 'https://picsum.photos/seed/sarah/40/40' },
  { id: '5', name: 'Emma Wilson', email: 'emma.wilson@lilly.com', avatarUrl: 'https://picsum.photos/seed/emma/40/40' },
  { id: '6', name: 'Mike Chen', email: 'mike.chen@lilly.com', avatarUrl: 'https://picsum.photos/seed/mike/40/40' },
  { id: '7', name: 'David Lee', email: 'david.lee@lilly.com', avatarUrl: 'https://picsum.photos/seed/david/40/40' },
  { id: '8', name: 'HR Team', email: 'careers@lilly.com', avatarUrl: 'https://picsum.photos/seed/hr/40/40' },
  { id: '9', name: 'Medical Affairs', email: 'medical.affairs@lilly.com', avatarUrl: 'https://picsum.photos/seed/medaffairs/40/40' },
  { id: '10', name: 'Quality Assurance', email: 'qa@lilly.com', avatarUrl: 'https://picsum.photos/seed/qa/40/40' },
  { id: '11', name: 'Patient Support', email: 'patient.support@lilly.com', avatarUrl: 'https://picsum.photos/seed/support/40/40' },
  { id: '12', name: 'Scientific Affairs', email: 'scientific.affairs@lilly.com', avatarUrl: 'https://picsum.photos/seed/sci-affairs/40/40' },
  { id: '13', name: 'Lisa Brown', email: 'lisa.brown@lilly.com', avatarUrl: 'https://picsum.photos/seed/lisa/40/40' },
  { id: '14', name: 'Community Manager', email: 'community@lilly.com', avatarUrl: 'https://picsum.photos/seed/community/40/40' },
  { id: '15', name: 'Patient Advocacy', email: 'patient.advocacy@lilly.com', avatarUrl: 'https://picsum.photos/seed/advocacy/40/40' },
  { id: '16', name: 'Medical Information', email: 'med.info@lilly.com', avatarUrl: 'https://picsum.photos/seed/medinfo/40/40' },
  { id: '17', name: 'John Doe', email: 'john.doe@example.com', avatarUrl: 'https://picsum.photos/seed/john/40/40' },
  { id: '18', name: 'Jane Smith', email: 'jane.smith@example.com', avatarUrl: 'https://picsum.photos/seed/jane/40/40' },
];

export const getAgent = (name: string): Agent | undefined => {
    if (name.includes('Not specified')) return undefined;
    const agentName = name.split('\n')[0].trim();
    return agents.find(a => a.name === agentName);
}

const parseReporter = (reporter: string) => {
    const match = reporter.match(/(.*) \((.*)\)/);
    if (match) {
        return { name: match[1], handle: match[2] };
    }
    return { name: reporter, handle: `@${reporter.toLowerCase().replace(/\s/g, '_')}` };
};

const casePropertiesMap: { [key: string]: Partial<Case['properties']> } = {
    '49': { priority: 'medium', country: 'FRANCE', associated_messages: 1, customStatus: 'assigned', region: 'FRANCE' },
    '56': { priority: 'very high', country: 'FRANCE', associated_messages: 1, customStatus: 'new', region: 'FRANCE', topicGeneral: ["Side Effects", "Patient Access"] },
    '57': { priority: 'medium', country: 'FRANCE', associated_messages: 2, customStatus: 'assigned', region: 'FRANCE' },
    '127001': { priority: 'high', country: 'US', associated_messages: 1, customStatus: 'assigned', region: 'US' },
    '127002': { priority: 'very high', country: 'US', associated_messages: 1, customStatus: 'new', region: 'US', audience: ["Health Care Provider"] },
    '127003': { priority: 'medium', country: 'UK', associated_messages: 2, customStatus: 'in progress', region: 'UK', topicGeneral: ["Device Issue"] },
    '127004': { priority: 'very high', country: 'CA', associated_messages: 1, customStatus: 'assigned', region: 'CA' },
    '127005': { priority: 'medium', country: 'FR', associated_messages: 3, customStatus: 'assigned', region: 'FR' },
    '127006': { priority: 'low', country: 'US', associated_messages: 1, customStatus: 'assigned', region: 'US' },
    '127007': { priority: 'medium', country: 'CA', associated_messages: 4, customStatus: 'closed', region: 'CA', lilly_products: ["Alimta"] },
    '127008': { priority: 'high', country: 'US', associated_messages: 2, customStatus: 'assigned', region: 'US' },
    '127009': { priority: 'low', country: 'US', associated_messages: 1, customStatus: 'assigned', region: 'US', audience: ["Careers-Graduate"] },
    '127010': { priority: 'high', country: 'US', associated_messages: 5, customStatus: 'in progress', region: 'US', audience: ["Business Partner/Provider"] },
    '127011': { priority: 'very high', country: 'UK', associated_messages: 2, customStatus: 'assigned', region: 'UK', lilly_products: ["Cyramza"] },
    '127012': { priority: 'low', country: 'CA', associated_messages: 1, customStatus: 'closed', region: 'CA', topicGeneral: ["Testimonial"] },
    '127013': { priority: 'very high', country: 'US', associated_messages: 3, customStatus: 'assigned', region: 'US', lilly_products: ["Humalog"], compliance: ["PC", "Broken Seal"] },
    '127014': { priority: 'low', country: 'US', associated_messages: 1, customStatus: 'assigned', region: 'US' },
    '127015': { priority: 'medium', country: 'US', associated_messages: 2, customStatus: 'assigned', region: 'US' },
    '127016': { priority: 'medium', country: 'US', associated_messages: 6, customStatus: 'closed', region: 'US', topicGeneral: ["Pricing"] },
    '127017': { priority: 'high', country: 'CA', associated_messages: 2, customStatus: 'closed', region: 'CA', lilly_products: ["Retevmo"] },
};

const getComplianceTag = (reportType: string): string[] => {
    if (reportType === "AE" || reportType === "PC" || reportType === "AE and PC") {
        return [reportType];
    }
    return [];
};


export const getCasesForSeeding = (): Case[] => {
    const allCases: Case[] = (rawData.cases as RawCase[]).map((rawCase) => {
        const { name, handle } = parseReporter(rawCase.reporter_information);
        const assignedAgent = getAgent(rawCase.lilly_agent_assigned);
        const extraProps = casePropertiesMap[rawCase.case_id] || {};

        let channel = rawCase.channel;
        if (rawCase.channel === 'Unknown') {
            channel = 'Twitter';
        } else if (rawCase.channel === 'Facebook') {
            channel = 'Meta';
        }

        const initialAudience = rawCase.respondent_type ? (rawCase.respondent_type === "HCP" ? ["Health Care Provider"] : [rawCase.respondent_type]) : [];

        let status: Case['status'] = 'All Assigned';
        if (extraProps.customStatus === 'closed') {
            status = 'All closed';
        } else if (assignedAgent?.email === 'pace@zamp.ai') {
            status = 'Assigned to Pace';
        }

        return {
            id: rawCase.case_id,
            title: rawCase.ae_pc_details.substring(0, 50) + '...',
            preview: rawCase.ae_pc_details,
            status: status,
            assignee: assignedAgent,
            createdAt: formatDistanceToNow(new Date(rawCase.receipt_date), { addSuffix: true }),
            source: channel,
            user: {
                name: name,
                handle: handle,
                avatarUrl: `https://picsum.photos/seed/user${rawCase.case_id}/40/40`,
            },
            conversation: [
                { id: 'msg1', author: name, avatarUrl: `https://picsum.photos/seed/user${rawCase.case_id}/40/40`, text: rawCase.ae_pc_details, timestamp: formatDistanceToNow(new Date(rawCase.receipt_date), { addSuffix: true }) },
            ],
            properties: {
                status: 'Open',
                priority: 'medium',
                slaStatus: 'On Track',
                report_type: rawCase.report_type,
                lilly_products: rawCase.lilly_products !== 'Unknown' ? [rawCase.lilly_products] : [],
                audience: initialAudience,
                compliance: getComplianceTag(rawCase.report_type),
                language: 'English',
                tags: [],
                country: 'Unknown',
                associated_messages: 1,
                customStatus: 'assigned',
                channel: channel,
                region: 'FRANCE',
                issueType: 'Click to Add',
                themeMatches: 'Click to Add',
                topicMatches: 'Click to Add',
                topicGroupMatches: 'Click to Add',
                sourcedFromListening: 'No',
                sourcedFromCTM: 'No',
                ctmAdId: 'Click to Add',
                initialMessagePrivacy: 'Click to Add',
                hcpType: rawCase.hcp_type,
                patientGender: rawCase.patient_gender,
                patientAge: rawCase.patient_age,
                contactedPoster: rawCase.contacted_poster,
                posterConsent: rawCase.poster_consent,
                posterContactInfo: rawCase.poster_contact_info,
                lotControlNumber: `#${rawCase.lot_control_number} (Unknown)`,
                ...extraProps,
                audience: Array.from(new Set([...initialAudience, ...extraProps.audience || []])),
                lilly_products: Array.from(new Set([...(rawCase.lilly_products !== 'Unknown' ? [rawCase.lilly_products] : []), ...Array.isArray(extraProps.lilly_products) ? extraProps.lilly_products : (extraProps.lilly_products ? [extraProps.lilly_products] : [])])),
                topicGeneral: extraProps.topicGeneral || [],
            },
        };
    });
    return allCases;
}
    
export const getCaseById = (id: string): Case | undefined => {
    // This is now a simplified lookup, not ideal for production but fine for this context
    const allCases = getCasesForSeeding();
    return allCases.find(c => c.id === id);
};
