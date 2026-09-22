// Server Component — queries TeamMember from DB, cached for 60s
import ClientTeamPage from './ClientTeamPage';
import dbConnect from '@/lib/mongodb';
import TeamMember from '@/models/TeamMember';
import { getPageContent } from '@/lib/pageContent';

export const revalidate = 60;

const DEFAULT_TEAM = [
  { id: 'rishikesh', name: 'Mr. Rishikesh Panvelkar', role: 'Founder & Chairman', image: 'https://raw.githubusercontent.com/satyasakhafoundation-max/Satyasaksha-foundation/fe9c435bc4021946d6ba26dc13765e8571d51611/WhatsApp%20Image%202026-09-11%20at%2010.06.29%20AM.jpeg' },
  { id: 'ashutosh', name: 'Mr. Ashutosh', role: 'Project Manager', image: 'https://raw.githubusercontent.com/satyasakhafoundation-max/Satyasaksha-foundation/fe9c435bc4021946d6ba26dc13765e8571d51611/ashutosh.jpeg' },
  { id: 'sneha', name: 'Ms. Sneha', role: 'Project Coordinator', image: 'https://raw.githubusercontent.com/satyasakhafoundation-max/Satyasaksha-foundation/fe9c435bc4021946d6ba26dc13765e8571d51611/WhatsApp%20Image%202026-09-13%20at%2010.18.40%20PM.jpeg' },
];

async function getTeamMembers() {
  try {
    await dbConnect();
    const members = await TeamMember.find({ isVisible: true }).sort({ order: 1 }).lean();
    if (members.length > 0) {
      return members.map((m) => ({ ...m, _id: m._id.toString() }));
    }
    return DEFAULT_TEAM;
  } catch {
    return DEFAULT_TEAM;
  }
}

export const metadata = {
  title: 'Our Team | Satyasaksha Foundation',
  description: 'Meet the people driving Satyasaksha Foundation’s mission forward.',
};

export default async function TeamPage() {
  const [members, content] = await Promise.all([getTeamMembers(), getPageContent('team')]);
  return <ClientTeamPage members={members} content={content} />;
}
