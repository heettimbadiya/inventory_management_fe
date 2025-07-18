import React, { useRef, useState } from 'react';
import { Card, CardContent, Typography, Button, Box, Stack, Alert, CircularProgress } from '@mui/material';
import { Icon } from '@iconify/react';
import axiosInstance from '../../utils/axios.js';

const SAMPLE_FILE_URL = '/sample_contacts.csv'; // Place your sample file in public/

const BulkImportContacts = ({modelClose}) => {
  const fileInputRef = useRef();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError('');
    setSuccess('');
  };

  const handleImport = async () => {
    if (!file) {
      setError('Please select a file.');
      return;
    }
    setLoading(true);
    setError('');
    setSuccess('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      await axiosInstance.post('/api/contact/import', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setSuccess('Contacts imported successfully!');
      modelClose()
    } catch (err) {
      setError('Failed to import contacts.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadSample = () => {
    const link = document.createElement('a');
    link.href = SAMPLE_FILE_URL;
    link.setAttribute('download', 'sample_contacts.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    modelClose()
  };

  return (
    <Card sx={{ maxWidth: 480, mx: 'auto', mt: 4, p: 2 }}>
      <CardContent>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
          <Icon icon="mdi:upload" width={24} height={24} color="#1a73e8" />
          <Typography variant="h6" fontWeight={700}>Bulk Import Contacts</Typography>
        </Stack>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Import contacts in bulk using a CSV or Excel file. Download the sample file to see the required format.
        </Typography>
        <Button
          variant="outlined"
          component="label"
          sx={{ mb: 2, textTransform: 'none' }}
        >
          <Icon icon="mdi:file-upload-outline" width={20} height={20} style={{ marginRight: 8 }} />
          Select File (.csv, .xlsx)
          <input
            type="file"
            accept=".csv, .xlsx"
            hidden
            ref={fileInputRef}
            onChange={handleFileChange}
          />
        </Button>
        {file && (
          <Typography variant="caption" sx={{ display: 'block', mb: 1 }}>
            Selected: {file.name}
          </Typography>
        )}
        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleImport}
            disabled={loading}
            startIcon={<Icon icon="mdi:cloud-upload" width={20} height={20} />}
          >
            {loading ? <CircularProgress size={20} /> : 'Import'}
          </Button>
          <Button
            variant="text"
            color="primary"
            onClick={handleDownloadSample}
            startIcon={<Icon icon="mdi:download" width={20} height={20} />}
          >
            Download Sample File
          </Button>
        </Stack>
        {error && <Alert severity="error" sx={{ mb: 1 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 1 }}>{success}</Alert>}
      </CardContent>
    </Card>
  );
};

export default BulkImportContacts;
