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

function getCurrentDateString() {
  return new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

const defaultPrompt = (project) =>
  `Write a ready-to-send project summary email (with subject line and body) for the project "${project?.name || 'this project'}". If you lack real data, invent plausible details. Do not ask for more information, do not include instructions, and do not provide templates—just output the draft email.`;

function parseGeminiEmail(text) {
  if (!text) return { subject: '', body: '' };
  const subjectMatch = text.match(/Subject\s*:?\s*(.*)/i);
  let subject = subjectMatch ? subjectMatch[1].trim() : '';
  let body = text;
  if (subjectMatch) {
    body = text.replace(subjectMatch[0], '').trim();
  }
  return { subject, body };
}

export default function DraftEmailDialog({ open, onClose, project }) {
  const [chat, setChat] = useState([]); // {role: 'user'|'ai', text: string, date: string}
  const [input, setInput] = useState(defaultPrompt(project));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (open) {
      setChat([]);
      setInput(defaultPrompt(project));
      setError('');
    }
  }, [open, project]);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chat, loading]);

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
      <Box sx={{ position: 'relative', borderTopLeftRadius: 16, borderBottomLeftRadius: 16, overflow: 'hidden', height: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#fff' }}>
        <Box sx={{ p: 2, pb: 1, borderBottom: '1px solid #ececec', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
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
        <DialogContent sx={{ p: 0, flex: 1, minHeight: 0 }}>
          <Box sx={{
            flex: 1,
            minHeight: 0,
            display: 'flex',
            flexDirection: 'column',
            height: 'calc(100vh - 120px)', // header + input bar
            background: '#f7f8fa',
            overflow: 'hidden',
          }}>
            <Box
              sx={{
                flex: 1,
                overflowY: 'auto',
                px: 2,
                py: 3,
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
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
                      borderRadius: 3,
                      p: 2,
                      boxShadow: msg.role === 'ai' ? 1 : 0,
                      border: msg.role === 'ai' ? '1px solid #ececec' : 'none',
                      ml: msg.role === 'user' ? 2 : 0,
                      mr: msg.role === 'ai' ? 2 : 0,
                      position: 'relative',
                      mb: 0.5,
                    }}
                  >
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                      {msg.role === 'ai' && <Chip label="AI" size="small" color="primary" />}
                      <Typography variant="caption" color="text.secondary">{msg.date}</Typography>
                    </Stack>
                    {msg.role === 'ai' ? (
                      (() => {
                        const { subject, body } = parseGeminiEmail(msg.text);
                        return (
                          <>
                            {subject && (
                              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                                Subject: {subject}
                              </Typography>
                            )}
                            <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>{body}</Typography>
                          </>
                        );
                      })()
                    ) : (
                      <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>{msg.text}</Typography>
                    )}
                  </Box>
                </Box>
              ))}
              {loading && (
                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                  <Box sx={{ bgcolor: '#fff', borderRadius: 3, p: 2, boxShadow: 1, border: '1px solid #ececec', maxWidth: '80%' }}>
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
        <Divider />
        <Box sx={{ p: 2, bgcolor: '#fff' }}>
          <Stack direction="row" spacing={1} alignItems="flex-end">
            <TextField
              variant="outlined"
              placeholder="Type your message"
              multiline
              minRows={1}
              maxRows={4}
              fullWidth
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleInputKeyDown}
              disabled={loading}
              sx={{
                background: '#f7f8fa',
                borderRadius: 3,
                boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                  paddingRight: 0,
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#e0e3e7',
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Iconify icon="solar:lightbulb-bold" sx={{ color: '#bdbdbd', fontSize: 22 }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleSend}
                      color="primary"
                      disabled={loading || !input.trim()}
                      sx={{ bgcolor: '#e3f2fd', borderRadius:"50px", ml: 1 }}
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
};
