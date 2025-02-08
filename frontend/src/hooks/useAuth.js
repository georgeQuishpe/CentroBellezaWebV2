// frontend/src/hooks/useAuth.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export const useAuth = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const checkAuth = () => {
            try {
                const userData = localStorage.getItem('user');
                if (userData) {
                    const parsed = JSON.parse(userData);
                    if (parsed.token) {
                        setUser(parsed);
                    } else {
                        router.push('/login');
                    }
                } else {
                    router.push('/login');
                }
            } catch (error) {
                console.error('Error checking auth:', error);
                router.push('/login');
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, [router]);




    const refreshToken = async () => {
        try {
            const currentRefreshToken = localStorage.getItem('refreshToken');
            const response = await fetch('http://localhost:5000/api/v1/auth/refresh-token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ refreshToken: currentRefreshToken })
            });

            const data = await response.json();
            if (data.token) {
                localStorage.setItem('token', data.token);
                return data.token;
            }
        } catch (error) {
            console.error('Error refreshing token:', error);
            return null;
        }
    };
    return { user, loading, refreshToken };

};