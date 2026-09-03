import { TimeSlot } from './types';

// TODO: thay bằng dữ liệu thật từ @vcb/http-access/customer/models khi lib đó được tạo
const LabelByTimeSlotIdGold: Record<number, string> = {
  3: '09:00 - 10:00',
  4: '10:00 - 11:00',
  5: '11:00 - 12:00',
  6: '13:00 - 14:00',
  7: '14:00 - 15:00',
  8: '15:00 - 16:00',
  9: '16:00 - 17:00',
  10: '17:00 - 18:00',
};

export const MorningSlots: TimeSlot[] = [
  // { value: 1, label: LabelByTimeSlotIdGold[1] },
  // { value: 2, label: LabelByTimeSlotIdGold[2] },
  { value: 3, label: LabelByTimeSlotIdGold[3] },
  { value: 4, label: LabelByTimeSlotIdGold[4] },
  { value: 5, label: LabelByTimeSlotIdGold[5] },
];

export const AfternoonSlots: TimeSlot[] = [
  { value: 6, label: LabelByTimeSlotIdGold[6] },
  { value: 7, label: LabelByTimeSlotIdGold[7] },
  { value: 8, label: LabelByTimeSlotIdGold[8] },
  { value: 9, label: LabelByTimeSlotIdGold[9] },
  { value: 10, label: LabelByTimeSlotIdGold[10] },
];

export const TimeSlots: TimeSlot[] = [...MorningSlots, ...AfternoonSlots];
