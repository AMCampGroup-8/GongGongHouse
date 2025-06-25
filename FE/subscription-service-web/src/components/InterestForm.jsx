import React, { useState } from 'react';
import { createInterest } from '../api/interest';

const InterestForm = () => {
  const [announcementId, setAnnouncementId] = useState('');
  const [alarmBeforeDays, setAlarmBeforeDays] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createInterest({ announcementId: Number(announcementId), alarmBeforeDays: Number(alarmBeforeDays) });
    alert('등록 완료!');
    setAnnouncementId('');
    setAlarmBeforeDays('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="number"
        placeholder="공고 ID"
        value={announcementId}
        onChange={(e) => setAnnouncementId(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="알림 일수"
        value={alarmBeforeDays}
        onChange={(e) => setAlarmBeforeDays(e.target.value)}
        required
      />
      <button type="submit">등록</button>
    </form>
  );
};

export default InterestForm;
