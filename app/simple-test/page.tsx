"use client";

export default function SimpleTestPage() {
  const testAPI = async () => {
    try {
      const response = await fetch('/api/impact-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employeeId: 'tm-1',
          startDate: '2024-01-29',
          endDate: '2024-02-02'
        })
      });
      
      const data = await response.json();
      console.log('API Result:', data);
      alert(`Sarah Chen Impact Score: ${data.analysis.impactScore}/100`);
    } catch (error) {
      console.error('Error:', error);
      alert('Error: ' + error);
    }
  };

  const testTom = async () => {
    try {
      const response = await fetch('/api/impact-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employeeId: 'tm-4',
          startDate: '2024-01-29',
          endDate: '2024-02-02'
        })
      });
      
      const data = await response.json();
      console.log('Tom Result:', data);
      alert(`Tom Rodriguez Impact Score: ${data.analysis.impactScore}/100`);
    } catch (error) {
      console.error('Error:', error);
      alert('Error: ' + error);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">🚀 Impact Analysis Test</h1>
      <p className="mb-6 text-gray-600">
        Test our AI algorithm with different team members. 
        Sarah should have HIGH impact, Tom should have LOWER impact.
      </p>
      
      <div className="space-x-4">
        <button 
          onClick={testAPI}
          className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 font-medium"
        >
          Test Sarah Chen (Should be HIGH)
        </button>
        
        <button 
          onClick={testTom}
          className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 font-medium"
        >
          Test Tom Rodriguez (Should be LOWER)
        </button>
      </div>
      
      <div className="mt-8 p-4 bg-gray-100 rounded">
        <h3 className="font-bold">Expected Results:</h3>
        <p>• Sarah Chen: ~100/100 (Critical - she has unique Payment Systems skill)</p>
        <p>• Tom Rodriguez: ~57/100 (Medium - junior developer, common skills)</p>
      </div>
    </div>
  );
}
