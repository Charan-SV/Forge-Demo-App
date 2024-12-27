import React, { useEffect, useState } from 'react';
import ForgeReconciler, { Text, Button } from '@forge/react';
import { invoke } from '@forge/bridge';
import api, { route } from "@forge/api";

const App = () => {
  const [data, setData] = useState(null);
  const [issueKey, setIssueKey] = useState(''); // Store the Jira issue key for testing

  useEffect(() => {
    invoke('getText', { example: 'my-invoke-variable' }).then(setData);
  }, []);

  // Function to handle the button click
  const handleClick = async () => {
    try {
      // Fetch Jira issue details using the provided issue key
      const response = await api.asUser().requestJira(route`/rest/api/3/issue/${issueKey}`, {
        headers: {
          'Accept': 'application/json'
        }
      });

      const issue = await response.json();

      if (response.ok) {
        // Get the desired fields from the issue response
        const issueData = {
          issueKey: issue.key,
          assignee: issue.fields.assignee ? issue.fields.assignee.displayName : 'Unassigned',
          summary: issue.fields.summary,
          reporter: issue.fields.reporter ? issue.fields.reporter.displayName : 'Unknown',
        };

        // Generate CSV
        const csv = generateCSV([issueData]);

        // Trigger download
        downloadCSV(csv);
      } else {
        console.error(`Error fetching issue: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error fetching Jira issue:', error);
    }
  };

  // Function to generate CSV from JSON data
  const generateCSV = (data) => {
    const header = Object.keys(data[0]);
    const rows = data.map(item => header.map(fieldName => item[fieldName]).join(','));

    return [header.join(','), ...rows].join('\n');
  };

  // Function to download CSV
  const downloadCSV = (csv) => {
    const blob = new Blob([csv], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'jira_issue_data.csv';
    link.click();
  };

  return (
    <>
      <Text>DevTools.</Text>
      <Text>{data ? data : 'Loading...'}</Text>
      <Button appearance="primary" onClick={handleClick}>
        Primary Button
      </Button>
    </>
  );
};

ForgeReconciler.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
