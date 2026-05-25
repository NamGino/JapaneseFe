import React, { useEffect, useMemo, useState, useRef } from 'react';
import { Box, Container, Typography, Paper, Grid, Checkbox, Button, TextField, IconButton } from '@mui/material';
import CloudQueueIcon from '@mui/icons-material/CloudQueue';
import NightlightIcon from '@mui/icons-material/Nightlight';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import NavbarLogin from '../../components/navbar/navbarLogin.jsx';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  addDiaryTask,
  addDiaryVocabulary,
  suggestVocabulary,
  deleteDiaryVocabulary,
  getDiaryEntry,
  updateDiaryTaskDone,
  updateDiaryVocabulary,
  upsertDiaryEntry,
  updateDiaryMood,
  getDiaryStats,
} from '../../apis/index.js';
function Daily() {
const vocabularyFontStyle = {
  fontFamily: '"Nunito", sans-serif',
  fontStyle: 'normal',
  fontWeight: 400
};

const nameFontStyle = {
  fontFamily: '"Great Vibes", cursive',
  fontStyle: 'normal',
  fontWeight: 400, 
};

const contentFontStyle = {
  fontFamily: '"Nunito", sans-serif',
  fontStyle: 'normal',
  fontWeight: 400,
};
	const location = useLocation();
	const params = new URLSearchParams(location.search);
  const currentUser = useSelector((state) => state.user?.user);

	const date = params.get("date") || new Date().toISOString().slice(0, 10);
  const [diaryData, setDiaryData] = useState({
    entry: null,
    tasks: [],
    vocabularies: [],
    moods: [],
    taskTemplates: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkedItems, setCheckedItems] = useState({});
  const [vocabularyEntries, setVocabularyEntries] = useState([]);
  const [nextVocabularyId, setNextVocabularyId] = useState(1);
  const suggestionTimers = useRef({});
  const [selectedMoodId, setSelectedMoodId] = useState(null);
  const [streakDays, setStreakDays] = useState(0);
  const [totalStudyDays, setTotalStudyDays] = useState(0);

  const loadDiaryData = async () => {
    if (!date) return;

    try {
      setIsLoading(true);
      const res = await getDiaryEntry(date);
      setDiaryData(res);
      setSelectedMoodId(res?.entry?.moodId || null);

      const mappedVocabularies = (res?.vocabularies || []).map((item, index) => ({
        id: item._id || `vocab-${index + 1}`,
        serverVocabularyId: item._id || null,
        jp: item.jp || '',
        vi: item.vi || '',
        saved: true,
        editing: false,
        isFromServer: Boolean(item._id),
        originalJp: item.jp || '',
        originalVi: item.vi || '',
        suggestionVi: '',
      }));
      setVocabularyEntries(mappedVocabularies);

      // Sync checkedItems theo taskTemplates (UI đang dùng key = templateId)
      const nextCheckedItems = {};
      if (res?.taskTemplates && res.taskTemplates.length > 0) {
        res.taskTemplates.forEach((tpl, index) => {
          const key = tpl._id || `template-${index}`;
          nextCheckedItems[key] = Boolean(tpl.isDone);
        });
      }
      setCheckedItems(nextCheckedItems);
      setNextVocabularyId((res?.vocabularies?.length || 0) + 1);
      // load stats
      try {
        const stats = await getDiaryStats();
        setStreakDays(stats?.streakDays || 0);
        setTotalStudyDays(stats?.totalStudyDays || 0);
      } catch (err) {
        console.error('Failed to load diary stats', err);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDiaryData();
  }, [date]);

  // cleanup suggestion timers on unmount
  useEffect(() => {
    return () => {
      Object.values(suggestionTimers.current || {}).forEach((t) => {
        try { clearTimeout(t); } catch (e) {}
      });
      suggestionTimers.current = {};
    };
  }, []);

  const ensureDiaryEntry = async () => {
    if (diaryData?.entry?._id) {
      return diaryData.entry;
    }
    
    const createdEntry = await upsertDiaryEntry(date, {
      moodId: null,
      gratitudeNote: '',
      tomorrowGoal: '',
    });
    
    setDiaryData((prev) => ({
      ...prev,
      entry: createdEntry,
    }));
    
    return createdEntry;
  };
  const tabHeaderStyle = {
    bgcolor: '#f28e52',
    color: 'white',
    px: 2,
    py: 1,
    borderRadius: '6px',
    fontSize: '0.9rem',
    fontWeight: 'bold',
    width: 'fit-content',
    position: 'relative',
    border: '1.5px solid #ffe0b2',
    zIndex: 1,
    ...contentFontStyle,
  };

  const sectionHeaderWrapStyle = {
    display: 'flex',
    justifyContent: 'center',
    mb: '-14px',
    position: 'relative',
    zIndex: 2,
  };

  const contentBoxStyle = {
    bgcolor: 'white',
    borderRadius: '15px',
    border: '1px solid #ffe0b2',
    p: 2,
    pt: 3,
    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)'
  };

  const handleVocabularyChange = (id, field, value) => {
    setVocabularyEntries((current) =>
      current.map((entry) =>
        entry.id === id
          ? {
              ...entry,
              [field]: value,
            }
          : entry
      )
    );
    // when jp changes and entry is being edited, schedule suggestion
    if (field === 'jp') {
      // schedule suggestion debounce
      const jpValue = value;
      // clear previous timer
      if (suggestionTimers.current[id]) {
        clearTimeout(suggestionTimers.current[id]);
      }
      if (!jpValue || jpValue.trim() === '') return;
      suggestionTimers.current[id] = setTimeout(async () => {
        try {
          const res = await suggestVocabulary(jpValue.trim());
          const suggestion = res?.suggestion;
          if (!suggestion) return;
          const viSuggestion = (suggestion.meaningsVi && suggestion.meaningsVi.length) ? suggestion.meaningsVi[0] : '';
          setVocabularyEntries((current) =>
            current.map((entry) => {
              if (entry.id !== id) return entry;
              if (entry.jp !== jpValue) return entry;
              // set suggestion only, don't overwrite user's vi
              return { ...entry, suggestionVi: viSuggestion || '' };
            })
          );
        } catch (e) {
          // ignore
        } finally {
          delete suggestionTimers.current[id];
        }
      }, 3000);
    }
  };

  const handleAddVocabularyRow = () => {
    setVocabularyEntries((current) => [
      ...current,
      {
        id: nextVocabularyId,
        serverVocabularyId: null,
        jp: '',
        vi: '',
        saved: false,
        editing: true,
        isFromServer: false,
        originalJp: '',
        originalVi: '',
        suggestionVi: '',
      },
    ]);
    setNextVocabularyId((current) => current + 1);
  };

  const extractMongoResultId = (result) => {
    return result?.value?._id || result?.insertedId || result?._id || null;
  };

  const handleSaveVocabulary = async (id) => {
    const targetEntry = vocabularyEntries.find((entry) => entry.id === id);
    if (!targetEntry) return;

    if (!targetEntry.jp?.trim()) return;

    try {
      // clear pending suggestion
      if (suggestionTimers.current[id]) {
        clearTimeout(suggestionTimers.current[id]);
        delete suggestionTimers.current[id];
      }
      setIsSubmitting(true);
      await ensureDiaryEntry();
      
      const isEditingExisting = Boolean(targetEntry.isFromServer && targetEntry.serverVocabularyId);
      
      // For create: include date. For update: don't include date
      const baseData = {
        jp: targetEntry.jp.trim(),
        vi: targetEntry.vi?.trim() || '',
        example: '',
        order: vocabularyEntries.findIndex((entry) => entry.id === id),
      };

      if (isEditingExisting) {
        await updateDiaryVocabulary(targetEntry.serverVocabularyId, baseData);
      } else {
        const createPayload = { date, ...baseData };
        const created = await addDiaryVocabulary(createPayload);
        const createdId = extractMongoResultId(created);

        setVocabularyEntries((current) =>
          current.map((entry) =>
            entry.id === id
              ? {
                  ...entry,
                  serverVocabularyId: createdId || entry.serverVocabularyId,
                }
              : entry
          )
        );
      }

      setVocabularyEntries((current) =>
        current.map((entry) =>
          entry.id === id
            ? {
                ...entry,
                saved: true,
                editing: false,
                isFromServer: true,
                originalJp: targetEntry.jp.trim(),
                originalVi: targetEntry.vi?.trim() || '',
                isFromServer: true,
              }
            : entry
        )
      );
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditVocabulary = (id) => {
    setVocabularyEntries((current) =>
      current.map((entry) =>
        entry.id === id
          ? {
              ...entry,
              originalJp: entry.jp,
              originalVi: entry.vi,
              editing: true,
            }
          : entry
      )
    );
  };

  const handleCancelVocabulary = async (id) => {
    const targetEntry = vocabularyEntries.find((entry) => entry.id === id);
    if (!targetEntry) return;

    // clear pending suggestion
    if (suggestionTimers.current[id]) {
      clearTimeout(suggestionTimers.current[id]);
      delete suggestionTimers.current[id];
    }
    if (!targetEntry.isFromServer) {
      setVocabularyEntries((current) => current.filter((entry) => entry.id !== id));
      return;
    }

    setVocabularyEntries((current) =>
      current.map((entry) =>
        entry.id === id
          ? {
              ...entry,
              jp: entry.originalJp ?? entry.jp,
              vi: entry.originalVi ?? entry.vi,
              saved: true,
              editing: false,
            }
          : entry
      )
    );
  };

  const handleDeleteVocabulary = (id) => {
    const targetEntry = vocabularyEntries.find((entry) => entry.id === id);
    if (!targetEntry) return;

    if (!targetEntry.isFromServer || !targetEntry.serverVocabularyId) {
      setVocabularyEntries((current) => current.filter((entry) => entry.id !== id));
      return;
    }

    setIsSubmitting(true);
    deleteDiaryVocabulary(targetEntry.serverVocabularyId)
      .then(() => {
        setVocabularyEntries((current) => current.filter((entry) => entry.id !== id));
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  const isMongoId = (value) => /^[a-f\d]{24}$/i.test(String(value));

  const extractTaskId = (result) => {
    return result?.value?._id || result?.insertedId || result?._id || null;
  };

  const handleMoodClick = async (moodEmoji) => {
    try {
      setIsSubmitting(true);
      // Tạo moodId đơn giản từ emoji
      const moodId = moodEmoji;
      setSelectedMoodId(moodId);
      setDiaryData((prev) => ({
        ...prev,
        entry: prev.entry
          ? { ...prev.entry, moodId }
          : { moodId },
      }));
      await updateDiaryMood(date, moodId);
    } catch (error) {
      console.error('Error updating mood:', error);
      setSelectedMoodId(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTaskChecked = async (groupName, item, nextChecked) => {
    const itemKey = item.id;

    setCheckedItems((prev) => ({
      ...prev,
      [itemKey]: nextChecked,
    }));

    try {
      setIsSubmitting(true);

      if (item.serverTaskId) {
        await updateDiaryTaskDone(item.serverTaskId, nextChecked);

        if (!nextChecked) {
          // Task bị uncheck thì backend sẽ xóa task khỏi DB
          setDiaryData((prev) => ({
            ...prev,
            taskTemplates: (prev.taskTemplates || []).map((template) =>
              (template._id || template.id) === item.templateId
                ? {
                    ...template,
                    isDone: false,
                    serverTaskId: null,
                    doneAt: null,
                  }
                : template
            ),
          }));
          return;
        }

        setDiaryData((prev) => ({
          ...prev,
          taskTemplates: (prev.taskTemplates || []).map((template) =>
            (template._id || template.id) === item.templateId
              ? {
                  ...template,
                  isDone: true,
                  serverTaskId: item.serverTaskId,
                }
              : template
          ),
        }));
        return;
      }

      // Nếu task được liên kết với template nhưng chưa có serverTaskId
      if (nextChecked) {
        // Tạo task mới với templateId
        await ensureDiaryEntry();
        const payload = {
          date,
          groupName,
          title: item.title,
          order: 0,
          isDone: true,
        };
        if (item.templateId) payload.templateId = item.templateId;
        const createdTask = await addDiaryTask(payload);
        const createdTaskId = extractTaskId(createdTask);

        setDiaryData((prev) => ({
          ...prev,
          taskTemplates: (prev.taskTemplates || []).map((template) =>
            (template._id || template.id) === item.templateId
              ? {
                  ...template,
                  isDone: true,
                  serverTaskId: createdTaskId || template.serverTaskId || null,
                  doneAt: Date.now(),
                }
              : template
          ),
        }));
        return;
      } else {
        // Nếu uncheck mà không có serverTaskId, task chưa được lưu trên server
        // Chỉ cần reset state local về unchecked
        setCheckedItems((prev) => {
          const next = { ...prev };
          delete next[itemKey];
          return next;
        });
        return;
      }
    } catch (error) {
      console.error(error);
      setCheckedItems((prev) => ({
        ...prev,
        [itemKey]: !nextChecked,
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Use server-provided task templates only (no client-side fallback)
  const taskGroups = useMemo(() => {
    const groups = {};
    (diaryData?.taskTemplates || []).forEach((tpl, idx) => {
      const group = tpl.groupName || 'Default';
      if (!groups[group]) groups[group] = [];
      groups[group].push({
        id: tpl._id || `template-${idx}`,
        templateId: tpl._id || null,
        title: tpl.title,
        isDone: Boolean(tpl.isDone),
        serverTaskId: tpl.serverTaskId || null,
        defaultOrder: tpl.defaultOrder || 0,
        isFromServer: true,
      });
    });

    return Object.keys(groups).map((groupName) => ({
      category: groupName,
      items: groups[groupName].sort((a, b) => (a.defaultOrder || 0) - (b.defaultOrder || 0)),
    }));
  }, [diaryData?.taskTemplates]);

  const displayName =
    currentUser?.name ||
    currentUser?.fullName ||
    currentUser?.username ||
    'Bạn';

  const formattedDate = useMemo(() => {
    if (!date) return '';
    const parsedDate = new Date(date);
    if (Number.isNaN(parsedDate.getTime())) return date;
    return parsedDate.toLocaleDateString('vi-VN');
  }, [date]);

  const weekdayLabel = useMemo(() => {
    if (!date) return '';
    const parsedDate = new Date(date);
    if (Number.isNaN(parsedDate.getTime())) return '';
    return parsedDate.toLocaleDateString('vi-VN', { weekday: 'long' });
  }, [date]);

  const dayLabel = useMemo(() => {
    if (totalStudyDays && Number.isFinite(totalStudyDays)) {
      return `Ngày ${totalStudyDays}`;
    }
    if (!date) return 'Ngày học';
    const parsedDate = new Date(date);
    if (Number.isNaN(parsedDate.getTime())) return 'Ngày học';
    return `Ngày ${parsedDate.getDate()}`;
  }, [date, totalStudyDays]);

  // const handleTest = async () => {
  //   try {      const res = await test();
  //     console.log('Test API response:', res);
  //   } catch (error) {
  //     console.error('Test API error:', error);
  //   }
  // }


  return (
    <>
      <NavbarLogin streakDays={streakDays} totalStudyDays={totalStudyDays} />
      <Box sx={{
        bgcolor: '#b3e5fc',
        minHeight: '100vh',
        py: 4,
        display: 'flex',
        alignItems: 'center',
      }}>
        <Container maxWidth="md">
          <Box sx={{
            display: 'flex',
            width: 'fit-content',
            bgcolor: '#f28e52',
            color: 'white',
            px: 3, py: 1.8,
            borderRadius: '15px 15px 5px 5px',
            fontWeight: 'bold',
            fontSize: '1.5rem',
            mb: '-20px',
            ml: '50px',
            position: 'relative',
            zIndex: 3,
            ...contentFontStyle,
            transform: 'rotate(-5deg)',
            boxShadow: '0 6px 14px rgba(0, 0, 0, 0.18)',
            '&::before': {
              content: '""',
              position: 'absolute',
              inset: 0,
              borderRadius: '15px 15px 5px 5px',
              bgcolor: '#ffb082',
              transform: 'translate(6px, 5px) rotate(2deg)',
              zIndex: -1,
            }
          }}>
            {dayLabel}
          </Box>
          <Paper
            elevation={0}
            sx={{
              borderRadius: '40px',
              bgcolor: '#fff9f0',
              border: '10px solid white',
              p: 4,
              position: 'relative',
              ...contentFontStyle,
            }}
          >
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#1a1a1a', mb: 2 }}>
                Hôm nay bạn đã "tắm"?
              </Typography>

              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2, mb: 4 }}>
                <Typography sx={{ fontSize: '0.9rem', fontWeight: 'bold', ...contentFontStyle }}>Tên của mình là:</Typography>
                <Typography sx={{
                  ...nameFontStyle,
                  fontSize: '2.2rem',
                  color: '#d81b60',
                  borderBottom: '2px dotted #f48fb1',
                  px: 6,
                  lineHeight: 1
                }}>
                  {displayName}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
                <Box sx={{ bgcolor: '#ffccbc', px: 2, py: 0.5, borderRadius: '8px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                  Ngày: {formattedDate || date}
                </Box>
                <Box sx={{ bgcolor: '#ffccbc', px: 2, py: 0.5, borderRadius: '8px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                  Thứ: {weekdayLabel || 'đang cập nhật'}
                </Box>
                <Box sx={{ bgcolor: '#ffccbc', px: 2, py: 0.5, borderRadius: '8px', fontSize: '0.75rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
                  Thời tiết: {diaryData?.entry?.weather?.temperature ?? '--'}°C - {diaryData?.entry?.weather?.text || 'Chưa cập nhật'}
                  <CloudQueueIcon sx={{ fontSize: 16, color: '#03a9f4' }} /> <NightlightIcon sx={{ fontSize: 16, color: '#f06292' }} />
                </Box>
              </Box>
            </Box>

            {isLoading && (
              <Typography sx={{ fontSize: '0.82rem', color: '#5d4037', mb: 2, textAlign: 'center' }}>
                Đang tải dữ liệu nhật ký...
              </Typography>
            )}

            <Grid container spacing={3}
              sx={{
                display: 'flex',
                justifyContent: 'space-between'
              }}>
              <Grid
                item
                xs={12}
                md={12}
                sx={{
                  flexBasis: { md: '51%' },
                  maxWidth: { md: '51%' },
                  position: 'relative'
                }}
              >
                <Box sx={sectionHeaderWrapStyle}>
                  <Box sx={tabHeaderStyle}>Từ vựng + mẫu câu đã học được</Box>
                </Box>
                <Box sx={{ ...contentBoxStyle, minHeight: '450px' }}>
                  {vocabularyEntries.map((item, i) => {
                    const isSaved = item.saved && !item.editing;

                    return (
                      <Box
                        key={item.id}
                        sx={{
                          mb: 1.5,
                          borderBottom: '1px dotted #e0e0e0',
                          pb: isSaved ? 0.5 : 1.2,
                          display: 'grid',
                          gridTemplateColumns: '36px minmax(0, 1fr) auto',
                          gap: 1,
                          alignItems: 'center',
                        }}
                      >
                        <Typography sx={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#333', textAlign: 'center' }}>
                          {i + 1}.
                        </Typography>

                        <Box sx={{ display: 'grid', gap: isSaved ? '5px' : 0.8, minWidth: 0 }}>
                          <TextField
                            value={item.jp}
                            onChange={(event) => handleVocabularyChange(item.id, 'jp', event.target.value)}
                            disabled={isSaved}
                            placeholder="Nhập từ vựng"
                            size="small"
                            fullWidth
                            variant="outlined"
                            multiline
                            minRows={1}
                            maxRows={4}
                            sx={{
                              '& .css-szkf5z-MuiInputBase-root-MuiOutlinedInput-root': {
                                padding: isSaved ? '0 !important' : '5.5px 6px',
                              },
                              '& .MuiOutlinedInput-root': {
                                padding: isSaved ? '0 !important' : '5.5px 6px',
                                borderRadius: '5px',
                                alignItems: 'flex-start',
                                '& fieldset': {
                                  border: isSaved ? '0 !important' : '1px solid #ffd9b8',
                                },
                                '&:hover fieldset': {
                                  border: isSaved ? '0 !important' : '1px solid #f28e52',
                                },
                                '&.Mui-focused fieldset': {
                                  border: isSaved ? '0 !important' : '1px solid #f28e52',
                                },
                                '&.Mui-disabled': {
                                  bgcolor: 'transparent',
                                },
                                '&.Mui-disabled fieldset': {
                                  border: '0 !important',
                                },
                              },
                              '& .MuiOutlinedInput-input': {
                                padding: '0 !important',
                                whiteSpace: 'normal',
                                wordBreak: 'break-word',
                                overflowWrap: 'anywhere',
                                ...vocabularyFontStyle,
                                fontWeight: 400,
                                color: '#222',
                              },
                              '& .MuiOutlinedInput-input.Mui-disabled': {
                                color: '#222 !important',
                                WebkitTextFillColor: '#222 !important',
                              },
                            }}
                          />

                          <TextField
                            value={item.vi}
                            onChange={(event) => handleVocabularyChange(item.id, 'vi', event.target.value)}
                            disabled={isSaved}
                            placeholder={item.vi || item.suggestionVi || "Nhập nghĩa"}
                            size="small"
                            fullWidth
                            variant="outlined"
                            multiline
                            minRows={1}
                            maxRows={4}
                            sx={{
                                '& .css-szkf5z-MuiInputBase-root-MuiOutlinedInput-root': {
                                  padding: isSaved ? '0 !important' : '5.5px 6px',
                                },
                              '& .MuiOutlinedInput-root': {
                                  padding: isSaved ? '0 !important' : '5.5px 6px',
                                borderRadius: '5px',
                                alignItems: 'flex-start',
                                '& fieldset': {
                                  border: isSaved ? '0 !important' : '1px solid #ffd9b8',
                                },
                                '&:hover fieldset': {
                                  border: isSaved ? '0 !important' : '1px solid #f28e52',
                                },
                                '&.Mui-focused fieldset': {
                                  border: isSaved ? '0 !important' : '1px solid #f28e52',
                                },
                                '&.Mui-disabled': {
                                  bgcolor: 'transparent',
                                },
                                '&.Mui-disabled fieldset': {
                                  border: '0 !important',
                                },
                              },
                              '& .MuiOutlinedInput-input': {
                                padding: '0 !important',
                                whiteSpace: 'normal',
                                wordBreak: 'break-word',
                                overflowWrap: 'anywhere',
                                ...contentFontStyle,
                                fontWeight: 400,
                                color: isSaved ? '#d81b60' : '#333',
                              },
                              '& .MuiOutlinedInput-input.Mui-disabled': {
                                color: `${isSaved ? '#d81b60' : '#333'} !important`,
                                WebkitTextFillColor: `${isSaved ? '#d81b60' : '#333'} !important`,
                              },
                            }}
                          />
                        </Box>

                        <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end', flexDirection: 'column' }}>
                          {!isSaved ? (
                            <>
                              <IconButton
                                size="small"
                                onClick={() => handleSaveVocabulary(item.id)}
                                disabled={isSubmitting}
                                sx={{ color: '#4caf50', bgcolor: 'rgba(76, 175, 80, 0.1)' }}
                              >
                                <SaveRoundedIcon fontSize="small" />
                              </IconButton>
                              <IconButton
                                size="small"
                                onClick={() => handleCancelVocabulary(item.id)}
                                disabled={isSubmitting}
                                sx={{ color: '#607d8b', bgcolor: 'rgba(96, 125, 139, 0.1)' }}
                              >
                                <CancelRoundedIcon fontSize="small" />
                              </IconButton>
                            </>
                          ) : (
                            <>
                              <IconButton
                                size="small"
                                onClick={() => handleEditVocabulary(item.id)}
                                disabled={isSubmitting}
                                sx={{ color: '#f28e52', bgcolor: 'rgba(242, 142, 82, 0.1)' }}
                              >
                                <EditRoundedIcon fontSize="small" />
                              </IconButton>
                              <IconButton
                                size="small"
                                onClick={() => handleDeleteVocabulary(item.id)}
                                disabled={isSubmitting}
                                sx={{ color: '#d81b60', bgcolor: 'rgba(216, 27, 96, 0.1)' }}
                              >
                                <DeleteOutlineRoundedIcon fontSize="small" />
                              </IconButton>
                            </>
                          )}
                        </Box>
                      </Box>
                    );
                  })}

                  <Button
                    variant="contained"
                    size="small"
                    onClick={handleAddVocabularyRow}
                    disabled={isSubmitting}
                    sx={{ bgcolor: '#4caf50', borderRadius: '20px', fontSize: '0.6rem', mt: 1 }}
                  >
                    + Thêm từ mới
                  </Button>
                </Box>
              </Grid>

              <Grid
                item
                xs={12}
                md={12}
                sx={{
                  flexBasis: { md: '45%' },
                  maxWidth: { md: '45%' }
                }}
              >
                {/* Mood Section */}
                <Box sx={{ mb: 3 }}>
                  <Box sx={sectionHeaderWrapStyle}>
                    <Box sx={tabHeaderStyle}>Tâm trạng</Box>
                  </Box>
                  <Box sx={{ ...contentBoxStyle, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1, textAlign: 'center' }}>
                    {['😊', '😆', '😍', '😇', '☹️', '😫', '😨', '😡', '🧐', '😴', '🤩', '🥳'].map((emoji, i) => (
                      <Box
                        key={i}
                        onClick={() => handleMoodClick(emoji)}
                        sx={{
                          border: selectedMoodId === emoji ? '3px solid #f48fb1' : '2px solid transparent',
                          bgcolor: selectedMoodId === emoji ? '#fce4ec' : 'transparent',
                          borderRadius: '8px',
                          fontSize: '1.4rem',
                          cursor: 'pointer',
                          p: 0.8,
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            transform: 'scale(1.15)',
                            borderColor: '#f48fb1',
                          }
                        }}
                      >
                        {emoji}
                      </Box>
                    ))}
                  </Box>
                </Box>

                {taskGroups.map((group, idx) => (
                  <Box key={idx} sx={{ mb: 2 }}>
                    <Box sx={sectionHeaderWrapStyle}>
                      <Box sx={tabHeaderStyle}>{group.category}</Box>
                    </Box>
                    <Box sx={contentBoxStyle}>
                      {group.items.map((item, i) => {
                        const itemKey = item.id;
                        const isChecked = itemKey in checkedItems ? checkedItems[itemKey] : item.isDone;
                        return (
                          <Box key={i} sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                            <Checkbox
                              checked={isChecked}
                              onChange={(e) => {
                                const nextChecked = e.target.checked;
                                handleTaskChecked(group.category, item, nextChecked);
                              }}
                              size="small"
                              sx={{ color: '#f06292', p: 0.5 }}
                            />
                            <Typography sx={{ fontSize: '0.7rem', fontWeight: 'bold', color: '#444' }}>{item.title}</Typography>
                          </Box>
                        );
                      })}
                    </Box>
                  </Box>
                ))}

                <Box sx={{ textAlign: 'center', mt: 3 }}>
                  <Typography sx={{ fontWeight: 900, color: '#f28e52', fontSize: '1.4rem', mb: -0.5 }}>NamGino</Typography>
                  <Typography sx={{ fontSize: '0.7rem', color: '#999' }}>Code</Typography>
                </Box>
              </Grid>
            </Grid>

            {/* Footer Sections */}
            <Box sx={{ mt: 4 }}>
              <Box sx={sectionHeaderWrapStyle}>
                <Box sx={tabHeaderStyle}>Điều thú vị / thấy biết ơn</Box>
              </Box>
              <Box sx={{ ...contentBoxStyle, borderStyle: 'dotted', borderWidth: '2px', borderColor: '#ffccbc' }}>
                <Typography sx={{ fontSize: '0.8rem', fontStyle: 'italic', color: '#1a237e', fontWeight: 500 }}>
                  {diaryData?.entry?.gratitudeNote || 'Chưa có nội dung biết ơn cho ngày này.'}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ mt: 4, pt: 2, borderTop: '2px dotted #f48fb1', textAlign: 'center' }}>
              <Typography sx={{ color: '#d81b60', fontSize: '0.85rem', fontWeight: 'bold', mb: 1 }}>
                ✿ Điều mình sẽ cố gắng ngày mai ✿
              </Typography>
              <Typography sx={{ color: '#0d47a1', fontSize: '0.8rem', fontWeight: 'bold' }}>
                {diaryData?.entry?.tomorrowGoal || 'Chưa đặt mục tiêu cho ngày mai.'}
              </Typography>
            </Box>
          </Paper>
        </Container>
      </Box>
      {/* <button onClick={handleTest}>Test API</button> */}
    </>
  );
};

export default Daily;