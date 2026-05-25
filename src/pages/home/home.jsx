import React from 'react';
import {
    Box,
    Container,
    Typography,
    Paper,
    Grid,
    Checkbox,
    FormControlLabel,
    Button,
    Divider
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloudQueueIcon from '@mui/icons-material/CloudQueue';
import NightlightRoundIcon from '@mui/icons-material/NightlightRound';
import Navbar from '../../components/navbar/navbar.jsx';

function Home() {
    return (
        <>
            <Navbar />
            <Box
                sx={{
                    minHeight: 'calc(100vh - 70px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'linear-gradient(180deg, #b3e5fc 0%, #e1f5fe 45%, #fff3e0 100%)',
                    overflow: 'hidden',
                }}
            >
                <style>{`
                    @keyframes scale-in-out {
                        0%, 100% {
                            transform: scale(1);
                            opacity: 1;
                        }
                        50% {
                            transform: scale(1.15);
                            opacity: 0.95;
                        }
                    }
                `}</style>
                <Box
                    sx={{
                        px: { xs: 2, sm: 4, md: 6 },
                        py: { xs: 3, sm: 5, md: 7 },
                        animation: 'scale-in-out 2.5s ease-in-out infinite',
                    }}
                >
                    <Typography
                        sx={{
                            fontSize: { xs: '2rem', sm: '3.5rem', md: '5rem' },
                            fontWeight: 900,
                            color: '#f28e52',
                            textAlign: 'center',
                            fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
                            letterSpacing: '1px',
                            lineHeight: 1.2,
                            WebkitTextStroke: '2px #ffe0b2',
                        }}
                    >
                        Welcome to
                    </Typography>
                    <Typography
                        sx={{
                            fontSize: { xs: '2rem', sm: '3.5rem', md: '5rem' },
                            fontWeight: 900,
                            color: '#f28e52',
                            textAlign: 'center',
                            fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
                            letterSpacing: '1px',
                            WebkitTextStroke: '2px #ffe0b2',
                        }}
                    >
                        Learning Diary
                    </Typography>
                </Box>
            </Box>
        </>
    );
}

export default Home;