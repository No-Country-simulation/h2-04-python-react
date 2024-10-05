import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';

import { router } from './router/AppRouter';

import { ThemeProvider } from '@/components/shared/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import './index.css';

createRoot(document.getElementById('root')).render(
	<StrictMode>
		<ThemeProvider
			defaultTheme='light'
			storageKey='vite-ui-theme'>
			<RouterProvider router={router}>
				<Toaster />
			</RouterProvider>
		</ThemeProvider>
	</StrictMode>,
);
