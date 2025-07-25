import { AppProviders } from '@/components/providers';
import './globals.css';

export const metadata = {
  title: 'Zentryx-all in one Payrol',
  description: 'An awesome app',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AppProviders>
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
