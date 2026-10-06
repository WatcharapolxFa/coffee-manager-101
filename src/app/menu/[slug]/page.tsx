import { redirect } from 'next/navigation';

// Per-category links (/menu/coffee) jump to that category on the scrolling menu.
export default async function CategoryLink({ params }: PageProps<'/menu/[slug]'>) {
  redirect(`/menu#${encodeURIComponent((await params).slug)}`);
}
