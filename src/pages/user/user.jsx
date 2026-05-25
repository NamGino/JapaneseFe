import React, { useMemo, useState } from 'react';
import {
	Box,
	IconButton,
	List,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	Paper,
	Tooltip,
	Typography,
} from '@mui/material';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import MenuOpenRoundedIcon from '@mui/icons-material/MenuOpenRounded';
import AutoFixHighRoundedIcon from '@mui/icons-material/AutoFixHighRounded';
import StyleRoundedIcon from '@mui/icons-material/StyleRounded';
import LinkRoundedIcon from '@mui/icons-material/LinkRounded';
import EditNoteRoundedIcon from '@mui/icons-material/EditNoteRounded';
import QuizRoundedIcon from '@mui/icons-material/QuizRounded';
import BoltRoundedIcon from '@mui/icons-material/BoltRounded';
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import { useNavigate } from 'react-router-dom';
import NavbarLogin from '../../components/navbar/navbarLogin.jsx';
import { useSelector } from 'react-redux'
const WEEK_DAYS = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

const sidebarItems = [
	{
		label: 'Học thông minh',
		description: 'Học ngắt quãng SRS, ưu tiên sửa lỗi sai.',
		icon: <AutoFixHighRoundedIcon />,
	},
	{
		label: 'Flashcard',
		description: 'Lật thẻ ghi nhớ, tối đa 20 từ ngẫu nhiên.',
		icon: <StyleRoundedIcon />,
	},
	{
		label: 'Game nối từ',
		description: 'Nối từ vựng với nghĩa đúng.',
		icon: <LinkRoundedIcon />,
	},
	{
		label: 'Game điền nghĩa',
		description: 'Tự gõ nghĩa của từ.',
		icon: <EditNoteRoundedIcon />,
	},
	{
		label: 'Trắc nghiệm',
		description: 'Chọn 1 trong 4 đáp án, luyện phản xạ nhanh.',
		icon: <QuizRoundedIcon />,
	},
	{
		label: 'Game đúng/sai',
		description: 'Đọc nhanh, chọn màu.',
		icon: <BoltRoundedIcon />,
	},
];

function formatYmd(date) {
	const y = date.getFullYear();
	const m = String(date.getMonth() + 1).padStart(2, '0');
	const d = String(date.getDate()).padStart(2, '0');
	return `${y}-${m}-${d}`;
}

function User() {
	const user = useSelector((state) => state.user.user)
	const navigate = useNavigate();
	const [sidebarOpen, setSidebarOpen] = useState(true);
	const [monthCursor, setMonthCursor] = useState(() => {
		const today = new Date();
		return new Date(today.getFullYear(), today.getMonth(), 1);
	});

	const todayKey = formatYmd(new Date());

	const monthLabel = useMemo(() => {
		return `Month ${monthCursor.getMonth() + 1}/${monthCursor.getFullYear()}`;
	}, [monthCursor]);

	const calendarCells = useMemo(() => {
		const year = monthCursor.getFullYear();
		const month = monthCursor.getMonth();
		const firstDay = new Date(year, month, 1);
		const firstIndex = (firstDay.getDay() + 6) % 7;
		const cells = [];

		for (let offset = 0; offset < 42; offset += 1) {
			const cellDate = new Date(year, month, offset - firstIndex + 1);
			cells.push({
				date: cellDate,
				inCurrentMonth: cellDate.getMonth() === month,
				dateKey: formatYmd(cellDate),
			});
		}

		return cells;
	}, [monthCursor]);

	const goPrevMonth = () => {
		setMonthCursor((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
	};

	const goNextMonth = () => {
		setMonthCursor((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
	};

	const handleDateClick = (dateKey) => {
		navigate(`/daily?date=${dateKey}`);
	};

	console.log(user._id,)
	return (
		<>
			<NavbarLogin />
			<Box
				sx={{
					display: 'flex',
					minHeight: 'calc(100vh - 72px)',
					background: 'linear-gradient(180deg, #b3e5fc 0%, #e1f5fe 45%, #fff3e0 100%)',
				}}
			>
				<Box
					sx={{
						width: sidebarOpen ? 320 : 78,
						transition: 'width 260ms ease',
						bgcolor: '#fff9f0',
						borderRight: '2px solid #ffe0b2',
						boxShadow: '4px 0 18px rgba(0, 0, 0, 0.06)',
						p: 1.2,
						overflow: 'hidden',
					}}
				>
					<Box
						sx={{
							display: 'flex',
							alignItems: 'center',
							justifyContent: sidebarOpen ? 'space-between' : 'none',
							px: sidebarOpen ? 1 : 0,
							mb: 0.8,
						}}
					>
						{sidebarOpen && (
							<Typography sx={{ fontWeight: 900, color: '#f28e52', fontSize: '0.95rem' }}>
								Cong cu hoc
							</Typography>
						)}
						<IconButton
							onClick={() => setSidebarOpen((prev) => !prev)}
							sx={{
								color: '#f28e52',
								bgcolor: 'rgba(242, 142, 82, 0.12)',
								'&:hover': { bgcolor: 'rgba(242, 142, 82, 0.2)' },
							}}
						>
							{sidebarOpen ? <MenuOpenRoundedIcon /> : <MenuRoundedIcon />}
						</IconButton>
					</Box>

					<List sx={{ p: 0.3, display: 'grid', gap: 0.5 }}>
						{sidebarItems.map((item) => (
							<Tooltip
								key={item.label}
								title={sidebarOpen ? '' : item.label}
								placement="right"
								arrow
							>
								<ListItemButton
									sx={{
										borderRadius: '14px',
										alignItems: 'flex-start',
										px: sidebarOpen ? 1.2 : 0.8,
										py: 1,
										gap: 1,
										'&:hover': {
											bgcolor: 'rgba(242, 142, 82, 0.12)',
										},
									}}
								>
									<ListItemIcon
										sx={{
											minWidth: sidebarOpen ? 32 : 'auto',
											color: '#f28e52',
											mt: 0.2,
										}}
									>
										{item.icon}
									</ListItemIcon>
									{sidebarOpen && (
										<ListItemText
											primary={item.label}
											secondary={item.description}
											primaryTypographyProps={{
												sx: { fontSize: '0.88rem', fontWeight: 800, color: '#3e2723' },
											}}
											secondaryTypographyProps={{
												sx: { fontSize: '0.75rem', color: '#6d4c41', mt: 0.15, lineHeight: 1.3 },
											}}
										/>
									)}
								</ListItemButton>
							</Tooltip>
						))}
					</List>
				</Box>

				<Box sx={{ flex: 1, p: { xs: 1.2, sm: 2.2 }, display: 'flex' }}>
					<Paper
						elevation={0}
						sx={{
							width: '100%',
							borderRadius: '30px',
							bgcolor: '#fff9f0',
							border: '8px solid white',
							p: { xs: 1.2, sm: 2.2 },
							display: 'flex',
							flexDirection: 'column',
							minHeight: 'calc(100vh - 110px)',
						}}
					>
						<Box
							sx={{
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'space-between',
								gap: 1,
								mb: 1.5,
							}}
						>
							<IconButton
								onClick={goPrevMonth}
								sx={{ color: '#f28e52', bgcolor: 'rgba(242, 142, 82, 0.12)' }}
							>
								<ChevronLeftRoundedIcon />
							</IconButton>

							<Typography sx={{ fontWeight: 900, color: '#f28e52', fontSize: { xs: '1.05rem', sm: '1.3rem' } }}>
								{monthLabel}
							</Typography>

							<IconButton
								onClick={goNextMonth}
								sx={{ color: '#f28e52', bgcolor: 'rgba(242, 142, 82, 0.12)' }}
							>
								<ChevronRightRoundedIcon />
							</IconButton>
						</Box>

						<Box
							sx={{
								display: 'grid',
								gridTemplateColumns: 'repeat(7, 1fr)',
								gap: 0.9,
								mb: 0.8,
							}}
						>
							{WEEK_DAYS.map((day) => (
								<Typography
									key={day}
									sx={{
										textAlign: 'center',
										fontWeight: 900,
										color: '#6d4c41',
										fontSize: { xs: '0.75rem', sm: '0.9rem' },
									}}
								>
									{day}
								</Typography>
							))}
						</Box>

						<Box
							sx={{
								display: 'grid',
								gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
								gridTemplateRows: 'repeat(6, minmax(72px, 1fr))',
								gap: 0.9,
								flex: 1,
							}}
						>
							{calendarCells.map((cell) => {
								const isToday = cell.dateKey === todayKey;
								const isFuture = cell.dateKey > todayKey;
								return (
									<Box
										key={cell.dateKey}
										onClick={() => !isFuture && handleDateClick(cell.dateKey)}
										sx={{
											borderRadius: '14px',
											border: isToday ? '2px solid #ec407a' : '1px solid #ffe0b2',
											bgcolor: cell.inCurrentMonth ? '#ffffff' : '#fff3e0',
											color: cell.inCurrentMonth ? '#333' : '#b0a08f',
											p: { xs: 0.8, sm: 1 },
											cursor: isFuture ? 'not-allowed' : 'pointer',
											opacity: isFuture ? 0.6 : 1,
											transition: 'transform 150ms ease, box-shadow 150ms ease, border-color 150ms ease',
											boxShadow: isToday ? '0 6px 14px rgba(236, 64, 122, 0.2)' : 'none',
											'&:hover': isFuture ? {} : {
												transform: 'translateY(-2px)',
												borderColor: '#f28e52',
												boxShadow: '0 8px 16px rgba(242, 142, 82, 0.15)',
											},
										}}
									>
										<Typography sx={{ fontWeight: 800, fontSize: { xs: '0.85rem', sm: '1rem' } }}>
											{cell.date.getDate()}
										</Typography>
									</Box>
								);
							})}
						</Box>
					</Paper>
				</Box>
			</Box>
		</>
	);
}

export default User;
