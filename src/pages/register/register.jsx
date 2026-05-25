import React, { useState } from 'react';
import { Box, Button, Container, Paper, TextField, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import CloudQueueIcon from '@mui/icons-material/CloudQueue';
import NightlightIcon from '@mui/icons-material/Nightlight';
import FavoriteIcon from '@mui/icons-material/Favorite';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import { createUser } from '../../apis';
function Register() {
  const Navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    checkRegister();
  };

  const checkRegister = async () => {
    try {
      const res = await createUser(formData);
      if (res.status === 201) {
        Navigate('/login');
      }
    }
    catch (error) {
      console.error("Register error:", error)
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        py: 4,
        background: 'linear-gradient(180deg, #b3e5fc 0%, #e1f5fe 45%, #fff3e0 100%)',
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={0}
          sx={{
            position: 'relative',
            overflow: 'hidden',
            borderRadius: '36px',
            border: '10px solid white',
            bgcolor: '#fff9f0',
            px: { xs: 3, sm: 5 },
            py: { xs: 4, sm: 5 },
            boxShadow: '0 18px 45px rgba(0, 0, 0, 0.08)',
            fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: -30,
              right: -20,
              width: 130,
              height: 130,
              borderRadius: '50%',
              bgcolor: 'rgba(242, 142, 82, 0.12)',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              bottom: -40,
              left: -30,
              width: 150,
              height: 150,
              borderRadius: '50%',
              bgcolor: 'rgba(3, 169, 244, 0.10)',
            }}
          />

          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 1,
                  bgcolor: '#f28e52',
                  color: 'white',
                  px: 2.5,
                  py: 0.6,
                  borderRadius: '999px',
                  fontWeight: 'bold',
                  fontSize: '0.85rem',
                  boxShadow: '0 8px 18px rgba(242, 142, 82, 0.25)',
                }}
              >
                <FavoriteIcon sx={{ fontSize: 16 }} />
                NamGino
              </Box>

              <Typography
                variant="h4"
                sx={{
                  mt: 3,
                  fontWeight: 900,
                  color: '#1a1a1a',
                  lineHeight: 1.15,
                }}
              >
                Tạo tài khoản mới
              </Typography>

              <Typography
                sx={{
                  mt: 1.5,
                  color: '#6d4c41',
                  fontSize: '0.95rem',
                  fontWeight: 500,
                }}
              >
                Đăng ký để lưu tiến độ học, xem lại từ vựng và tiếp tục các bài học mỗi ngày.
              </Typography>

              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1.5, mt: 2 }}>
                <Box sx={{ bgcolor: '#ffccbc', px: 1.5, py: 0.5, borderRadius: '999px', fontSize: '0.72rem', fontWeight: 'bold', color: '#5d4037' }}>
                  <CloudQueueIcon sx={{ fontSize: 15, mr: 0.5, verticalAlign: 'text-bottom', color: '#03a9f4' }} />
                  Khởi đầu mới
                </Box>
                <Box sx={{ bgcolor: '#ffccbc', px: 1.5, py: 0.5, borderRadius: '999px', fontSize: '0.72rem', fontWeight: 'bold', color: '#5d4037' }}>
                  <NightlightIcon sx={{ fontSize: 15, mr: 0.5, verticalAlign: 'text-bottom', color: '#f06292' }} />
                  Học đều mỗi ngày
                </Box>
              </Box>
            </Box>

            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{
                display: 'grid',
                gap: 2,
                background: 'rgba(255, 255, 255, 0.72)',
                border: '1px solid #ffd7c2',
                borderRadius: '24px',
                p: { xs: 2.5, sm: 3 },
                backdropFilter: 'blur(6px)',
              }}
            >
              <Box>
                <Typography sx={{ mb: 1, fontSize: '0.8rem', fontWeight: 'bold', color: '#5d4037' }}>
                  Họ và tên
                </Typography>
                <TextField
                  fullWidth
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Tên của bạn"
                  variant="outlined"
                  size="small"
                  InputProps={{
                    sx: {
                      borderRadius: '16px',
                      bgcolor: 'white',
                    },
                  }}
                />
              </Box>

              <Box>
                <Typography sx={{ mb: 1, fontSize: '0.8rem', fontWeight: 'bold', color: '#5d4037' }}>
                  Email
                </Typography>
                <TextField
                  fullWidth
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="example@gmail.com"
                  variant="outlined"
                  size="small"
                  InputProps={{
                    sx: {
                      borderRadius: '16px',
                      bgcolor: 'white',
                    },
                  }}
                />
              </Box>

              <Box>
                <Typography sx={{ mb: 1, fontSize: '0.8rem', fontWeight: 'bold', color: '#5d4037' }}>
                  Mật khẩu
                </Typography>
                <TextField
                  fullWidth
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Tạo mật khẩu"
                  variant="outlined"
                  size="small"
                  InputProps={{
                    sx: {
                      borderRadius: '16px',
                      bgcolor: 'white',
                    },
                  }}
                />
              </Box>

              <Box>
                <Typography sx={{ mb: 1, fontSize: '0.8rem', fontWeight: 'bold', color: '#5d4037' }}>
                  Xác nhận mật khẩu
                </Typography>
                <TextField
                  fullWidth
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Nhập lại mật khẩu"
                  variant="outlined"
                  size="small"
                  InputProps={{
                    sx: {
                      borderRadius: '16px',
                      bgcolor: 'white',
                    },
                  }}
                />
              </Box>

              <Button
                type="submit"
                variant="contained"
                sx={{
                  mt: 1,
                  py: 1.2,
                  borderRadius: '16px',
                  bgcolor: '#f28e52',
                  fontWeight: 'bold',
                  fontSize: '0.95rem',
                  boxShadow: '0 10px 20px rgba(242, 142, 82, 0.25)',
                  '&:hover': {
                    bgcolor: '#e97c3f',
                  },
                }}
              >
                Đăng ký
              </Button>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
                <Box sx={{ display: 'flex'}}>
                <Typography sx={{fontSize: '0.85rem'}}>Đã có tài khoản ?</Typography>
                <Typography
                component={RouterLink}
                  to="/login"
                  sx={{
                    color: '#f28e52',
                    fontWeight: 'bold',
                    textDecoration: 'none',
                    '&:hover': {
                      textDecoration: 'underline',
                    },
                    fontSize: '0.85rem',
                    ml: 0.5
                  }}
                >
                 Vào trang đăng nhập.
                </Typography>
                </Box>
                <Typography sx={{ fontSize: '0.85rem', color: '#c2185b', fontWeight: 'bold', cursor: 'pointer' }}>
                  Điều khoản sử dụng
                </Typography>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default Register;