import { TimeSlot } from './types';

// TODO: thay bằng dữ liệu thật từ @vcb/http-access/customer/models khi lib đó được tạo
const LabelByTimeSlotId: Record<number, string> = {
  1: '07:00 - 08:00',
  2: '08:00 - 09:00',
  3: '09:00 - 10:00',
  4: '10:00 - 11:00',
  5: '13:00 - 14:00',
  6: '14:00 - 15:00',
  7: '15:00 - 16:00',
  8: '16:00 - 17:00',
};

export const TimeSlots: TimeSlot[] = [
  { value: 1, label: LabelByTimeSlotId[1] },
  { value: 2, label: LabelByTimeSlotId[2] },
  { value: 3, label: LabelByTimeSlotId[3] },
  { value: 4, label: LabelByTimeSlotId[4] },
  { value: 5, label: LabelByTimeSlotId[5] },
  { value: 6, label: LabelByTimeSlotId[6] },
  { value: 7, label: LabelByTimeSlotId[7] },
  { value: 8, label: LabelByTimeSlotId[8] },
];
