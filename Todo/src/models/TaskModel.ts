import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';
import { AttachmentModel } from './AttachmentModel';

export interface TaskModel {
  id?: string;
  title: string;
  description: string;
  dueDate?: FirebaseFirestoreTypes.Timestamp | any;
  start: FirebaseFirestoreTypes.Timestamp | any;
  end: FirebaseFirestoreTypes.Timestamp | any;
  uids: string[];
  color?: string;
  attachment: AttachmentModel[];
  progress?: number | any;
  createdAt?: number;
  updatedAt?: number; 
  isUrgent?: boolean;
}

export interface SubTask {
  createdAt: number
  description: string
  id: string
  isCompleted: boolean
  taskId: string
  title: string
  updatedAt: number
  editable?: boolean;
}
