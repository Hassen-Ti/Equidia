import React, { useState } from 'react';

export default function RiderApp({ onExit }) {
    return (
        <div className="p-20 text-center">
            <h1 className="text-2xl font-bold">RiderApp Debug Mode</h1>
            <button onClick={onExit} className="mt-4 p-2 bg-gray-200">Retour</button>
        </div>
    );
}
