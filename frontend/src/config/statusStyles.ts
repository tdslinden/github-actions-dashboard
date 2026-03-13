import { 
  CheckCircle2, 
  XCircle, 
  Loader2, 
  Clock, 
  AlertCircle, 
  SkipForward, 
  HelpCircle 
} from 'lucide-react';
import type { WorkflowStatus } from '@/types/workflow';

export const STATUS_CONFIG = {
  succeeded: {
    label: 'Succeeded',
    icon: CheckCircle2,
    borderColor: 'border-green-500',
    bgColor: 'bg-green-50',
    textColor: 'text-green-700',
    iconColor: 'text-green-500',
    glowColor: '0 0 12px 2px rgba(34,197,94,0.5)',
    badgeBgColor: 'bg-green-900/40 text-green-400',
  },
  failed: {
    label: 'Failed',
    icon: XCircle,
    borderColor: 'border-red-500',
    bgColor: 'bg-red-50',
    textColor: 'text-red-700',
    iconColor: 'text-red-500',
    glowColor: '0 0 12px 2px rgba(239,68,68,0.5)',
    badgeBgColor: 'bg-red-900/40 text-red-400',
  },
  running: {
    label: 'Running',
    icon: Loader2,
    borderColor: 'border-blue-500',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-700',
    iconColor: 'text-blue-500',
    glowColor: '0 0 12px 2px rgba(59,130,246,0.5)',
    badgeBgColor: 'bg-blue-900/40 text-blue-400',
  },
  queued: {
    label: 'Queued',
    icon: Clock,
    borderColor: 'border-orange-500',
    bgColor: 'bg-orange-50',
    textColor: 'text-orange-700',
    iconColor: 'text-orange-500',
    glowColor: '0 0 12px 2px rgba(249,115,22,0.5)',
    badgeBgColor: 'bg-orange-900/40 text-orange-400',
  },
  cancelled: {
    label: 'Cancelled',
    icon: AlertCircle,
    borderColor: 'border-gray-500',
    bgColor: 'bg-gray-50',
    textColor: 'text-gray-700',
    iconColor: 'text-gray-500',
    glowColor: '0 0 12px 2px rgba(107,114,128,0.4)',
    badgeBgColor: 'bg-gray-800/60 text-gray-400',
  },
  skipped: {
    label: 'Skipped',
    icon: SkipForward,
    borderColor: 'border-yellow-500',
    bgColor: 'bg-yellow-50',
    textColor: 'text-yellow-700',
    iconColor: 'text-yellow-500',
    glowColor: '0 0 12px 2px rgba(234,179,8,0.5)',
    badgeBgColor: 'bg-yellow-900/40 text-yellow-400',
  },
  waiting: {
    label: 'Waiting',
    icon: Clock,
    borderColor: 'border-purple-500',
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-700',
    iconColor: 'text-purple-500',
    glowColor: '0 0 12px 2px rgba(168,85,247,0.5)',
    badgeBgColor: 'bg-purple-900/40 text-purple-400',
  },
  unknown: {
    label: 'Unknown',
    icon: HelpCircle,
    borderColor: 'border-purple-500',
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-700',
    iconColor: 'text-purple-500',
    glowColor: '0 0 12px 2px rgba(168,85,247,0.5)',
    badgeBgColor: 'bg-purple-900/40 text-purple-400',
  },
} as const;

export function getStatusConfig(status: WorkflowStatus) {
  return STATUS_CONFIG[status] || STATUS_CONFIG.unknown;
}