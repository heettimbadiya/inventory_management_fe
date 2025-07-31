import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
} from '@mui/material';
import { Icon } from '@iconify/react';

const CreateCard = ({
  onNewContact,
  onNewProject,
  onNewInvoice,
  onNewMeeting,
  onNewLeadForm,
  sx = {}
}) => (
  <Card
    sx={{
      borderRadius: 0,
      boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
      p: 3,
      backgroundColor: '#fafafa',
      height: '400px',
      ...sx
    }}
  >
    <CardContent sx={{ p: 0 }}>
      <Typography
        variant="subtitle1"
        fontWeight="bold"
        sx={{ mb: 2, pl: 0.5 }}
      >
        Create
      </Typography>

      <Stack spacing={1.5}>
        <Button
          variant="outlined"
          fullWidth
          startIcon={<Icon icon="mdi:account-plus" width="20" height="20" />}
          onClick={onNewContact}
          sx={buttonStyle}
        >
          New contact
        </Button>

        <Button
          variant="outlined"
          fullWidth
          startIcon={<Icon icon="mdi:briefcase-plus" width="20" height="20" />}
          onClick={onNewProject}
          sx={buttonStyle}
        >
          New project
        </Button>

        <Button
          variant="outlined"
          fullWidth
          startIcon={<Icon icon="mdi:file-document-edit" width="20" height="20" />}
          onClick={onNewInvoice}
          sx={buttonStyle}
        >
          New invoice
        </Button>

        {/*<Button*/}
        {/*  variant="outlined"*/}
        {/*  fullWidth*/}
        {/*  startIcon={<Icon icon="mdi:calendar-plus" width="20" height="20" />}*/}
        {/*  onClick={onNewMeeting}*/}
        {/*  sx={buttonStyle}*/}
        {/*>*/}
        {/*  New meeting*/}
        {/*</Button>*/}

        {/*<Button*/}
        {/*  variant="outlined"*/}
        {/*  fullWidth*/}
        {/*  startIcon={<Icon icon="mdi:form-select" width="20" height="20" />}*/}
        {/*  onClick={onNewLeadForm}*/}
        {/*  sx={buttonStyle}*/}
        {/*>*/}
        {/*  New lead form*/}
        {/*</Button>*/}
      </Stack>
    </CardContent>
  </Card>
);

const buttonStyle = {
  justifyContent: 'flex-start',
  paddingY: '10px',
  borderRadius: 1,
  textTransform: 'none',
  fontWeight: 500,
  color: '#212121',
  borderColor: '#e0e0e0',
  '&:hover': {
    backgroundColor: '#f5f5f5',
    borderColor: '#cfcfcf',
  },
};

export default CreateCard;
