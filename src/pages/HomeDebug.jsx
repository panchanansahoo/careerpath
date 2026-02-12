import React from 'react';

export default function HomeDebug() {
    return (
        <div style={{ background: 'red', color: 'black', height: '100vh', padding: '50px', fontSize: '30px', fontWeight: 'bold' }}>
            <h1>DEBUG: VISIBILITY TEST</h1>
            <p>If you see this red screen, React is rendering content correctly.</p>
        </div>
    );
}
