import { redirect } from 'next/navigation';

const SANITY_PROJECT_ID = 'pfm6u125';

export default function StudioPage() {
  redirect(`https://www.sanity.io/manage/personal/project/${SANITY_PROJECT_ID}`);
}
