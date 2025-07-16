import PropTypes from 'prop-types';
import Drawer from '@mui/material/Drawer';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import { useState, useRef, useEffect } from 'react';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Iconify from 'src/components/iconify';
import ReactMarkdown from 'react-markdown';

function getCurrentDateString() {
  return new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

function formatProjectData(project) {
  if (!project) return '';
  return `\nProject Name: ${project.name || '-'}\nName:${project.contact?.fullName || '-'}\nType: ${project.type || '-'}\nContact: ${project.contact?.contact || '-'}\nStart Date: ${project.startDate || '-'}\nEnd Date: ${project.endDate || '-'}\nTimezone: ${project.timezone || '-'}\nLead Source: ${project.leadSource || '-'}\n`.trim();
}

const defaultPrompt = (project) =>
  `Based on all communication, files, and notes in Demo, draft an email that summarizes the project’s key points. Include a subject line optimized for high open rates and avoiding spam filters. Match the email to my tone of voice.`;

export default function DraftEmailDialog({ open, onClose, project, forceEmptyPrompt }) {
  const [chat, setChat] = useState([]); // {role: 'user'|'ai', text: string, date: string}
  const [input, setInput] = useState(forceEmptyPrompt ? '' : defaultPrompt(project));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);
  useEffect(() => {
    if (open) {
      setChat([]);
      setInput(forceEmptyPrompt ? '' : defaultPrompt(project));
      setError('');
      // Auto-generate draft if not forceEmptyPrompt
      if (!forceEmptyPrompt) {
        const prompt = `${defaultPrompt(project)}\n\nProject Details:\n${formatProjectData(project)}`;
        // Simulate user message and auto-send
        setChat([{ role: 'user', text: defaultPrompt(project), date: getCurrentDateString() }]);
        (async () => {
          setLoading(true);
          try {
            const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
            const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' + apiKey, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
            });
            const data = await response.json();
            let aiText = '';
            if (data && data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
              aiText = data.candidates[0].content.parts[0].text;
            } else {
              aiText = 'Failed to generate draft. Please try again.';
            }
            setChat([
              { role: 'user', text: defaultPrompt(project), date: getCurrentDateString() },
              { role: 'ai', text: aiText, date: getCurrentDateString() },
            ]);
          } catch (err) {
            setError('Error contacting Gemini AI: ' + (err.message || err));
          } finally {
            setLoading(false);
            setInput('');
          }
        })();
      }
    }
  }, [open, project, forceEmptyPrompt]);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chat, loading]);

  // Focus the input after AI response
  useEffect(() => {
    if (!loading && input === '' && inputRef.current) {
      inputRef.current.focus();
    }
  }, [loading, input]);

  const handleSend = async () => {
    if (!input.trim()) return;
    setError('');
    const userMessage = { role: 'user', text: input, date: getCurrentDateString() };
    setChat((prev) => [...prev, userMessage]);
    setLoading(true);
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      // Use the latest input as the prompt
      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' + apiKey, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: input }] }] }),
      });
      const data = await response.json();
      let aiText = '';
      if (data && data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
        aiText = data.candidates[0].content.parts[0].text;
      } else {
        aiText = 'Failed to generate draft. Please try again.';
      }
      setChat((prev) => [
        ...prev,
        { role: 'ai', text: aiText, date: getCurrentDateString() },
      ]);
    } catch (err) {
      setError('Error contacting Gemini AI: ' + (err.message || err));
    } finally {
      setLoading(false);
      setInput('');
    }
  };

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !loading) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: '100%', sm: 420, md: 440 },
          maxWidth: '100vw',
          borderTopLeftRadius: 16,
          borderBottomLeftRadius: 16,
          boxShadow: 24,
          height: '100vh',
          overflow: 'hidden',
          p: 0,
        },
      }}
    >
      <Box sx={{ position: 'relative', borderTopLeftRadius: 16, borderBottomLeftRadius: 16, height: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#fff' }}>
        {/* Sticky header */}
        <Box sx={{ p: 2, pb: 1, borderBottom: '1px solid #ececec', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 2, bgcolor: '#fff' }}>
          <DialogTitle sx={{ p: 0, fontSize: 18, fontWeight: 600, flex: 1 }}>Draft Email with Gemini AI</DialogTitle>
          <IconButton
            onClick={onClose}
            sx={{
              color: 'text.secondary',
              ml: 1,
            }}
            aria-label="Close"
          >
            <Iconify icon="eva:close-fill" width={22} height={22} />
          </IconButton>
        </Box>
        <Divider sx={{ m: 0 }} />
        <DialogContent sx={{ p: 0, flex: 1, minHeight: 0 }}>
          <Box sx={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', background: '#f7f8fa' }}>
            <Box
              sx={{
                flex: 1,
                minHeight: 0,
                overflowY: 'auto',
                px: 2,
                py: 3,
                display: 'flex',
                flexDirection: 'column',
                gap: 2.5,
                background: '#f7f8fa',
              }}
            >
              {chat.length === 0 && (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 2 }}>
                  Start by editing the prompt below and pressing <b>Enter</b> or clicking <b>Send</b>.
                </Typography>
              )}
              {chat.map((msg, idx) => (
                <Box
                  key={idx}
                  sx={{
                    display: 'flex',
                    flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                    alignItems: 'flex-end',
                  }}
                >
                  <Box
                    sx={{
                      maxWidth: '80%',
                      bgcolor: msg.role === 'user' ? 'primary.100' : '#fff',
                      color: msg.role === 'user' ? 'primary.dark' : 'text.primary',
                      borderRadius: 3.5,
                      p: 2,
                      boxShadow: msg.role === 'ai' ? 1 : 0,
                      border: msg.role === 'ai' ? '1px solid #ececec' : 'none',
                      ml: msg.role === 'user' ? 2 : 0,
                      mr: msg.role === 'ai' ? 2 : 0,
                      position: 'relative',
                      mb: 0.5,
                      fontSize: 15,
                    }}
                  >
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                      {msg.role === 'ai' && <Chip label="AI" size="small" color="primary" />}
                      <Typography variant="caption" color="text.secondary">{msg.date}</Typography>
                    </Stack>
                    {msg.role === 'ai' ? (
                      <Box
                        sx={{
                          fontSize: 15,
                          lineHeight: 1.7,
                          '& pre': {
                            whiteSpace: 'pre-wrap',
                            wordBreak: 'break-word',
                            background: '#f5f5f5',
                            borderRadius: 1,
                            p: 1,
                            fontSize: 13,
                            overflowX: 'auto',
                          },
                          '& code': {
                            whiteSpace: 'pre-wrap',
                            wordBreak: 'break-word',
                            fontFamily: 'monospace',
                            fontSize: 13,
                          },
                        }}
                      >
                        <ReactMarkdown>{msg.text}</ReactMarkdown>
                      </Box>
                    ) : (
                      <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>{msg.text}</Typography>
                    )}
                  </Box>
                </Box>
              ))}
              {loading && (
                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                  <Box sx={{ bgcolor: '#fff', borderRadius: 3.5, p: 2, boxShadow: 1, border: '1px solid #ececec', maxWidth: '80%' }}>
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                      <Chip label="AI" size="small" color="primary" />
                      <Typography variant="caption" color="text.secondary">{getCurrentDateString()}</Typography>
                    </Stack>
                    <Typography variant="body2" color="text.secondary">Generating...</Typography>
                  </Box>
                </Box>
              )}
              <div ref={chatEndRef} />
            </Box>
          </Box>
        </DialogContent>
        <Divider sx={{ m: 0, borderColor: '#ececec' }} />
        <Box sx={{ p: 2, bgcolor: '#fff' }}>
          <Stack direction="row" spacing={1.5} alignItems="flex-end">
            <TextField
              variant="outlined"
              placeholder="Type your message"
              multiline
              minRows={1}
              maxRows={4}
              fullWidth
              inputRef={inputRef}
              sx={{
                background: '#f7f8fa',
                borderRadius: 3.5,
                boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3.5,
                  paddingRight: '48px', // space for the button
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#e0e3e7',
                },
              }}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleInputKeyDown}
              disabled={loading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Iconify icon="solar:lightbulb-bold" sx={{ color: '#bdbdbd', fontSize: 22 }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end" sx={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', zIndex: 2 }}>
                    <IconButton
                      onClick={handleSend}
                      color="primary"
                      disabled={loading || !input.trim()}
                      sx={{
                        bgcolor: '#1976d2',
                        color: '#fff',
                        width: 40,
                        height: 40,
                        minWidth: 40,
                        minHeight: 40,
                        boxShadow: '0 2px 8px rgba(25, 118, 210, 0.15)',
                        border: '2px solid #fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.18s cubic-bezier(.4,0,.2,1)',
                        borderRadius: '50% !important',
                        // mr: '-8px',
                        '&:hover': {
                          bgcolor: '#1565c0',
                          transform: 'scale(1.08)',
                          boxShadow: '0 4px 16px rgba(21, 101, 192, 0.18)',
                        },
                        '&:active': {
                          transform: 'scale(0.98)',
                        },
                        '&.Mui-disabled': {
                          bgcolor: '#e3e3e3',
                          color: '#bdbdbd',
                          boxShadow: 'none',
                          border: '2px solid #f5f5f5',
                        },
                      }}
                    >
                      <Iconify icon="solar:arrow-up-linear" sx={{ fontSize: 22 }} />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Stack>
          {error && <Typography color="error" variant="body2" sx={{ mt: 1 }}>{error}</Typography>}
        </Box>
      </Box>
    </Drawer>
  );
}

DraftEmailDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  project: PropTypes.object,
  forceEmptyPrompt: PropTypes.bool,
};
