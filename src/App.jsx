import { useState } from 'react';
import './App.css'
import HunterApi from './services/HunterApi';

function App() {
  const [result, setResult] = useState("");
  const [personData, setPersonData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [domain, setDomain] = useState("");
  const [email, setEmail] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      const textResponse = await new Promise((resolve) => {
        chrome.tabs.sendMessage(tab.id, { action: "fetchText" }, (response) => {
          resolve(response);
        });
      });

      const organizationName = textResponse?.text || "Not found";
      
      if (organizationName === "Not found") {
        setResult("Organization name not found on the page");
        setLoading(false);
        return;
      }

      setResult(organizationName)

      const nameResponse = await new Promise((resolve) => {
        chrome.tabs.sendMessage(tab.id, { action: "fetchName" }, (response) => {
          resolve(response);
        });
      });

      const fullName = nameResponse?.name || "Not found";
      
      if (fullName === "Not found") {
        setResult("Name not found on the page");
        setLoading(false);
        return;
      }

      setName(fullName);

      const nameParts = fullName.trim().split(' ');
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(' ');

      const discoverResponse = await HunterApi.discover(organizationName);
      const domain = discoverResponse.data?.[0]?.domain;
      setDomain(domain);
      console.log("doman response", domain);

      if (!domain) {
        setResult(`Domain not found for ${organizationName}`);
        setLoading(false);
        return;
      }

      const emailResponse = await HunterApi.emailFinder(domain, firstName, lastName);
      const email = emailResponse.data?.email;

      if (!email) {
        setResult("Email not found for the person");
        setLoading(false);
        return;
      }
      setEmail(email);

      const combinedResponse = await HunterApi.combinedFind(email);
      
      const person = combinedResponse.data?.person;
      const company = combinedResponse.data?.company;

      if (person) {
        setPersonData({
          fullName: person.name?.fullName || fullName,
          email: person.email || email,
          organization: company?.name || "Unknown",
          designation: person.employment?.title || "Unknown"
        });
        setResult("Person data fetched successfully!");
      } else {
        setPersonData(null);
        setResult("No data found");
      }

    } catch (error) {
      console.error("Error fetching person data:", error);
      setResult(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', minWidth: '300px' }}>
      <h2>Observe Now</h2>
      <p>{result}</p>
      <p>{name}</p>
      <p>{domain}</p>
      <p>{email }</p>
      <div style={{ marginBottom: '20px' }}>
        <button onClick={fetchData} disabled={loading}>
          {loading ? 'Loading...' : 'Fetch Data'}
        </button>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <p><strong>Status:</strong> {result}</p>
        {personData && (
          <p><strong>Organization Found:</strong> {personData.organization}</p>
        )}
      </div>

      {personData ? (
        <div style={{ 
          border: '1px solid #ccc', 
          padding: '15px', 
          borderRadius: '5px',
          backgroundColor: '#f9f9f9'
        }}>
          <h3>Person Information</h3>
          <p><strong>Full Name:</strong> {personData.fullName}</p>
          <p><strong>Email:</strong> {personData.email}</p>
          <p><strong>Organization:</strong> {personData.organization}</p>
          <p><strong>Designation:</strong> {personData.designation}</p>
        </div>
      ) : result === "No data found" && (
        <div style={{ 
          border: '1px solid #ff6b6b', 
          padding: '15px', 
          borderRadius: '5px',
          backgroundColor: '#ffe0e0',
          color: '#d63031'
        }}>
          <h3>No Data Found</h3>
          <p>Unable to find person information for this profile.</p>
        </div>
      )}
    </div>
  )
}

export default App
