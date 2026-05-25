import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
	Avatar,
	Badge,
	Box,
	Container,
	IconButton,
	Typography,
} from '@mui/material';
import NotificationsNoneRoundedIcon from '@mui/icons-material/NotificationsNoneRounded';
import { Link as RouterLink } from 'react-router-dom';
import { useSelector } from 'react-redux'
function NavbarLogin({ streakDays = 0, totalStudyDays = 0 }) {
	const user = useSelector((state) => state.user.user)
	const [menuOpen, setMenuOpen] = useState(false);
	const [notificationOpen, setNotificationOpen] = useState(false);
	const closeTimerRef = useRef(null);
	const notificationWrapRef = useRef(null);

	const notifications = [
		{ title: 'Nhac hoc tu vung', content: 'Ban con 12 tu moi chua on tap hom nay.' },
		{ title: 'Diem danh ngay moi', content: 'Hoan thanh check-in de giu streak lien tuc.' },
		{ title: 'Bai hoc de xuat', content: 'Co 1 video nghe moi phu hop voi trinh do cua ban.' },
	];

	const avatarLetters = useMemo(() => {
		const cleaned = user?.name.trim();
		if (!cleaned) {
			return 'U';
		}

		return cleaned
			.split(' ')
			.filter(Boolean)
			.slice(0, 2)
			.map((part) => part[0].toUpperCase())
			.join('');
	}, [user?.name]);

	const clearCloseTimer = () => {
		if (closeTimerRef.current) {
			clearTimeout(closeTimerRef.current);
			closeTimerRef.current = null;
		}
	};

	const handleAvatarEnter = (event) => {
		clearCloseTimer();
		setMenuOpen(true);
	};

	const scheduleCloseMenu = () => {
		clearCloseTimer();
		closeTimerRef.current = setTimeout(() => {
			setMenuOpen(false);
		}, 140);
	};

	const handleMenuEnter = () => {
		clearCloseTimer();
	};

	const handleMenuClose = () => {
		clearCloseTimer();
		setMenuOpen(false);
	};

	const handleLogout = () => {
		handleMenuClose();
		if (onLogout) {
			onLogout();
		}
	};

	const toggleNotifications = () => {
		setNotificationOpen((current) => !current);
	};

	useEffect(() => {
		return () => {
			clearCloseTimer();
		};
	}, []);

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (
				notificationWrapRef.current &&
				!notificationWrapRef.current.contains(event.target)
			) {
				setNotificationOpen(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	return (
		<Box
			sx={{
				bgcolor: '#fff9f0',
				borderBottom: '2px solid #ffe0b2',
				boxShadow: '0 2px 10px rgba(0, 0, 0, 0.06)',
				position: 'sticky',
				top: 0,
				zIndex: 100,
			}}
		>
			<Container maxWidth="lg" sx={{ py: 1.2 }}>
				<Box
					sx={{
						display: 'grid',
						gridTemplateColumns: { xs: '1fr', md: '1.3fr 1fr 1fr' },
						alignItems: 'center',
						gap: { xs: 1.2, md: 2 },
					}}
				>
					<Box sx={{ justifySelf: { md: 'start' }, textAlign: { xs: 'center', md: 'left' } }}>
						<Typography
							component={RouterLink}
							to="/user"
							sx={{
								textDecoration: 'none',
								fontWeight: 900,
								fontSize: { xs: '1.05rem', md: '1.2rem' },
								color: '#f28e52',
								lineHeight: 1.1,
							}}
						>
							{user?.name} Learning Daily
						</Typography>
					</Box>

					<Box
						sx={{
							justifySelf: 'center',
							display: 'flex',
							flexWrap: 'wrap',
							justifyContent: 'center',
							alignItems: 'center',
							gap: 1,
						}}
					>
						<Box
							sx={{
								bgcolor: '#ffccbc',
								borderRadius: '999px',
								px: 1.6,
								py: 0.45,
								fontWeight: 'bold',
								color: '#5d4037',
								fontSize: '0.8rem',
								whiteSpace: 'nowrap',
							}}
						>
							{'🔥 Streak: '}
							{streakDays}
							{' ngày'}
						</Box>
						<Box
							sx={{
								bgcolor: '#ffccbc',
								borderRadius: '999px',
								px: 1.6,
								py: 0.45,
								fontWeight: 'bold',
								color: '#5d4037',
								fontSize: '0.8rem',
								whiteSpace: 'nowrap',
							}}
						>
							{'📈 Tổng số ngày học: '}
							{totalStudyDays}
						</Box>
					</Box>

					<Box
						sx={{
							justifySelf: 'end',
							display: 'flex',
							justifyContent: { xs: 'center', md: 'flex-end' },
							alignItems: 'center',
							gap: 1.2,
						}}
					>
						<Box
							ref={notificationWrapRef}
							sx={{
								position: 'relative',
								display: 'flex',
								alignItems: 'center',
							}}
						>
							<IconButton
								aria-label="notifications"
								onClick={toggleNotifications}
								sx={{
									color: '#f28e52',
									bgcolor: 'rgba(242, 142, 82, 0.1)',
									'&:hover': { bgcolor: 'rgba(242, 142, 82, 0.2)' },
								}}
							>
								<Badge  color="error">
									<NotificationsNoneRoundedIcon />
								</Badge>
							</IconButton>

							<Box
								sx={{
									position: 'absolute',
									top: 'calc(100% + 10px)',
									right: -10,
									width: 320,
									maxWidth: '80vw',
									border: '1px solid #ffe0b2',
									borderRadius: '12px',
									bgcolor: '#ffffff',
									boxShadow: '0 12px 28px rgba(0, 0, 0, 0.14)',
									overflow: 'visible',
									opacity: notificationOpen ? 1 : 0,
									transform: notificationOpen ? 'translateY(0)' : 'translateY(-6px)',
									pointerEvents: notificationOpen ? 'auto' : 'none',
									transition: 'opacity 180ms ease, transform 180ms ease',
									zIndex: 220,
									'&::before': {
										content: '""',
										position: 'absolute',
										top: -7,
										right: 22,
										width: 12,
										height: 12,
										bgcolor: '#ffffff',
										borderTop: '1px solid #ffe0b2',
										borderLeft: '1px solid #ffe0b2',
										transform: 'rotate(45deg)',
									},
								}}
							>

								{notifications.map((item, index) => (
									<Box
										key={item.title}
										sx={{
											px: 1.6,
											py: 1,
											borderBottom: index === notifications.length - 1 ? 'none' : '1px solid #ffe8cc',
											'&:hover': {
												bgcolor: 'rgba(242, 142, 82, 0.1)',
											},
										}}
									>
										<Typography sx={{ fontSize: '0.88rem', fontWeight: 700, color: '#333', lineHeight: 1.25 }}>
											{item.title}
										</Typography>
										<Typography sx={{ fontSize: '0.78rem', color: '#6d4c41', mt: 0.3, lineHeight: 1.35 }}>
											{item.content}
										</Typography>
									</Box>
								))}
							</Box>
						</Box>

						<Box
							onMouseEnter={handleAvatarEnter}
							onMouseLeave={scheduleCloseMenu}
							sx={{
								position: 'relative',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								borderRadius: '50%',
							}}
						>
							<Avatar
								sx={{
									width: 38,
									height: 38,
									bgcolor: '#f28e52',
									color: 'white',
									fontWeight: 'bold',
									fontSize: '0.9rem',
									cursor: 'pointer',
								}}
							>
								{avatarLetters}
							</Avatar>
							<Box
								onMouseEnter={handleMenuEnter}
								onMouseLeave={scheduleCloseMenu}
								sx={{
									position: 'absolute',
									top: 'calc(100% + 10px)',
									right: -6,
									minWidth: 180,
									border: '1px solid #ffe0b2',
									borderRadius: '12px',
									bgcolor: '#ffffff',
									boxShadow: '0 12px 28px rgba(0, 0, 0, 0.14)',
									overflow: 'visible',
									opacity: menuOpen ? 1 : 0,
									transform: menuOpen ? 'translateY(0)' : 'translateY(-6px)',
									pointerEvents: menuOpen ? 'auto' : 'none',
									transition: 'opacity 180ms ease, transform 180ms ease',
									zIndex: 200,
									'&::before': {
										content: '""',
										position: 'absolute',
										top: -7,
										right: 19,
										width: 12,
										height: 12,
										bgcolor: '#ffffff',
										borderTop: '1px solid #ffe0b2',
										borderLeft: '1px solid #ffe0b2',
										transform: 'rotate(45deg)',
									},
								}}
							>
								<Typography
									component={RouterLink}
									to="/profile"
									onClick={handleMenuClose}
									sx={{
										display: 'block',
										px: 1.6,
										py: 1,
										textDecoration: 'none',
										color: '#333',
										fontSize: '0.9rem',
										fontWeight: 700,
										borderBottom: '1px solid #ffe8cc',
										'&:hover': {
											bgcolor: 'rgba(242, 142, 82, 0.12)',
										},
									}}
								>
									Profile
								</Typography>

								<Typography
									component="button"
									onClick={handleLogout}
									sx={{
										width: '100%',
										border: 0,
										bgcolor: 'transparent',
										textAlign: 'left',
										px: 1.6,
										py: 1,
										cursor: 'pointer',
										color: '#d81b60',
										fontSize: '0.9rem',
										fontWeight: 700,
										fontFamily: 'inherit',
										borderBottomLeftRadius: '12px',
										borderBottomRightRadius: '12px',
										'&:hover': {
											bgcolor: 'rgba(216, 27, 96, 0.1)',
										},
									}}
								>
									Dang xuat
								</Typography>
							</Box>
						</Box>
					</Box>
				</Box>
			</Container>
		</Box>
	);
}

export default NavbarLogin;
