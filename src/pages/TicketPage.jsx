import React from 'react';
import { useLocation } from 'react-router-dom';

const TicketPage = () => {
    const location = useLocation();
    const ticketData = location.state?.ticketData;

    if (!ticketData) return <h2 className="text-white text-center mt-20">No Ticket Found!</h2>;

    return (
        <div className="min-h-screen bg-[#0f0f13] flex items-center justify-center p-4">
            <div style={{ border: '2px dashed #333', padding: '20px', maxWidth: '400px', width: '100%', margin: '0 auto', textAlign: 'center', backgroundColor: '#1a1a20', borderRadius: '12px' }}>
                <h1 style={{ color: '#E50914', fontSize: '24px', fontWeight: 'bold', marginBottom: '10px' }}>🎟️ FILMINGO TICKET</h1>
                <h2 style={{ color: '#fff', fontSize: '20px', marginBottom: '15px' }}>Confirmed!</h2>
                <div style={{ color: '#a1a1aa', fontSize: '14px', lineHeight: '1.6', textAlign: 'left', background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '8px', marginBottom: '15px' }}>
                    <p><strong>Transaction ID:</strong> {ticketData.transaction_id}</p>
                    <p><strong>Movie / Match ID:</strong> {ticketData.movie_id}</p>
                    <p><strong>Seats:</strong> {ticketData.seats.join(', ')}</p>
                    <p><strong>Total Paid:</strong> ₹{ticketData.amount_paid}</p>
                </div>
                <hr style={{ borderColor: '#333', margin: '20px 0' }} />
                <div style={{ padding: '20px', background: '#eee', display: 'inline-block', borderRadius: '8px', marginBottom: '15px' }}>
                    {/* A fake QR code box for visual effect during the demo */}
                    <p style={{ color: '#000', fontWeight: 'bold', fontSize: '12px', margin: 0 }}>[ QR CODE SCANNED AT GATE ]</p>
                </div>
                <p style={{ color: '#71717a', fontSize: '12px' }}>Show this screen at the cinema/stadium.</p>
            </div>
        </div>
    );
};

export default TicketPage;
