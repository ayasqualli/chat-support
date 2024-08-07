'use client' // Client Component

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import styles from './LoadingSpinner.module.css';

const Login = dynamic(() => import('./login'), { ssr: false });

export default function LoginPage() {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.loadingSpinner}></div>
                <p>Loading...</p>
            </div>
        );
    }

    return <Login />;
}