import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import RegisterForm from '../components/RegisterForm';
import LoginForm from '../components/LoginForm';

export const AuthPage = () => {
	const [activeTab, setActiveTab] = useState('login');

	const handleSwitchToLogin = () => {
		setActiveTab('login');
	};

	return (
		<div className='container mx-auto h-screen mt-24 px-2'>
			<Tabs
				value={activeTab}
				onValueChange={setActiveTab}
				className='w-[400px]'>
				<TabsList className='grid w-full grid-cols-2'>
					<TabsTrigger value='login'>Iniciar Sesión</TabsTrigger>
					<TabsTrigger value='register'>Registrarse</TabsTrigger>
				</TabsList>
				<TabsContent value='login'>
					<LoginForm />
				</TabsContent>
				<TabsContent value='register'>
					<RegisterForm onSwitchToLogin={handleSwitchToLogin} />
				</TabsContent>
			</Tabs>
		</div>
	);
};
