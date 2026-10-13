import { useState } from 'react';

function DailyReportModal({ shiftLog, onClose, onSuccess }) {
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleFinalSubmit = async () => {
    if (shiftLog.length === 0) {
      setErrorMessage("No sales logged for today yet!");
      return;
    }

    setSubmitting(true);
    setErrorMessage('');

    try {
      const response = await fetch('http://localhost:5000/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          submittedBy: 'Sales Staff',
          itemsSold: shiftLog
        })
      });

      if (!response.ok) {
        throw new Error('Failed to submit shift report.');
      }

      const data = await response.json();
      console.log('Report submitted successfully:', data);
      
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Submission error:', error);
      setErrorMessage(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" style={modalStyles.overlay}>
      <div className="modal-content" style={modalStyles.content}>
        <h2 style={{ color: '#222', marginTop: 0 }}> End-of-Day (EOD) Shift Review</h2>
        <p>Please review your accumulated sales below before submitting them for admin approval.</p>

        {errorMessage && <div style={{ color: 'red', marginBottom: '10px' }}>{errorMessage}</div>}

        {shiftLog.length === 0 ? (
          <p style={{ fontStyle: 'italic', color: '#666' }}>Your today shift log is currently empty.</p>
        ) : (
          <div style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '20px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #ddd', textAlign: 'left' }}>
                  <th style={{ padding: '8px' }}>Title</th>
                  <th style={{ padding: '8px' }}>5x7 (S)</th>
                  <th style={{ padding: '8px' }}>8x10 (M)</th>
                  <th style={{ padding: '8px' }}>11x14 (L)</th>
                </tr>
              </thead>
              <tbody>
                {shiftLog.map((item, index) => (
                  <tr key={index} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '8px' }}>{item.title}</td>
                    <td style={{ padding: '8px' }}>{item.sold.small}</td>
                    <td style={{ padding: '8px' }}>{item.sold.medium}</td>
                    <td style={{ padding: '8px' }}>{item.sold.large}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button onClick={onClose} style={modalStyles.cancelBtn}>Cancel</button>
          <button 
            onClick={handleFinalSubmit} 
            disabled={submitting || shiftLog.length === 0}
            style={modalStyles.submitBtn}
          >
            {submitting ? 'Submitting...' : 'Submit to Admin Queue'}
          </button>
        </div>
      </div>
    </div>
  );
}

const modalStyles = {
  overlay: {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
  },
  content: {
    backgroundColor: '#fff', padding: '25px', borderRadius: '8px', width: '600px', maxWidth: '90%', boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
  },
  cancelBtn: {
    padding: '8px 16px', backgroundColor: '#e0e0e0', border: 'none', borderRadius: '4px', cursor: 'pointer'
  },
  submitBtn: {
    padding: '8px 16px', backgroundColor: '#2e7d32', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer'
  }
};

export default DailyReportModal;