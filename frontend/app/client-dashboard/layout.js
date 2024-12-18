import '@/app/_styles/globals.css';

import Header from '../_components/client-dashboard-components/Header';

export const metadata = {
  title: {
    template: '%s WEflance',
    default: 'Welcom/ WEflance',
  },
  description: 'Freelance web developer Platform',
};

export default function RootLayout({ children }) {
  return (
    <div className='flex flex-col h-screen '>
      <Header />
      <main
        className='h-full overflow-hidden relative
      bg-gradient-to-r from-white via-[#f7f9fc] to-[#e9f3ff]'
      >
        {children}
      </main>
    </div>
  );
}
