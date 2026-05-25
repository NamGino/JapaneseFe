import React from 'react';
import { Box, Button, Container, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

function Navbar() {
  return (
    <Box
      sx={{
        bgcolor: '#fff9f0',
        borderBottom: '2px solid #ffe0b2',
        py: 1.5,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          {/* Left: Website Name */}
          <Typography
            component={RouterLink}
            to="/"
            sx={{
              fontSize: '1.4rem',
              fontWeight: 900,
              color: '#f28e52',
              textDecoration: 'none',
              fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
              '&:hover': {
                opacity: 0.8,
              },
            }}
          >
            Learning Diary
          </Typography>

          {/* Right: Login & Register Buttons */}
          <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
            <Button
              component={RouterLink}
              to="/login"
              variant="text"
              sx={{
                color: '#f28e52',
                fontWeight: 'bold',
                fontSize: '0.9rem',
                textTransform: 'none',
                '&:hover': {
                  bgcolor: 'rgba(242, 142, 82, 0.1)',
                },
              }}
            >
              Đăng nhập
            </Button>

            <Button
              component={RouterLink}
              to="/register"
              variant="contained"
              sx={{
                bgcolor: '#f28e52',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '0.9rem',
                textTransform: 'none',
                borderRadius: '20px',
                px: 2.5,
                py: 0.7,
                boxShadow: '0 6px 16px rgba(242, 142, 82, 0.25)',
                '&:hover': {
                  bgcolor: '#e97c3f',
                  boxShadow: '0 8px 20px rgba(242, 142, 82, 0.35)',
                },
              }}
            >
              Đăng ký
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default Navbar;
