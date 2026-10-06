import { redirect } from 'next/navigation';

// The site root is the storefront menu; the back office lives under /management.
export default function Home() {
  redirect('/menu');
}
