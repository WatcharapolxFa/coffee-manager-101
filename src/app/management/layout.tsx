import { AppHeader, TabBar } from '@/components/AppNav';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AppHeader />
      <main className="mx-auto max-w-3xl px-4 pt-4 pb-32">{children}</main>
      <TabBar />
    </>
  );
}
