import type { WorkflowSummary } from '@/types/workflow';
import { getStatusConfig } from '@/config/statusStyles';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { ExternalLinkIcon } from 'lucide-react';

interface WorkflowCardProps {
  workflow: WorkflowSummary;
}

export function WorkflowCard({ workflow }: WorkflowCardProps) {
  const statusConfig = getStatusConfig(workflow.status);
  const StatusIcon = statusConfig.icon;
  const statusColor = statusConfig.iconColor;
  const lastRunTime = formatDistanceToNow(new Date(workflow.last_run_time), { addSuffix: true });

  return (
    <a
      className="hover:scale-[1.02] transition-all duration-200"
      href={workflow.html_url}
      target="_blank"
      rel="noopener noreferrer"
    >
      <Card
        className={`w-full ${statusConfig.borderColor} bg-[#0e121b]`}
        style={{ boxShadow: statusConfig.glowColor }}
      >
        <CardHeader className="text-white">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <StatusIcon
                className={
                  workflow.status === 'running' ? `${statusColor} animate-spin` : statusColor
                }
              />
              <Badge className={`text-base ${statusConfig.badgeBgColor}`}>
                {statusConfig.label}
              </Badge>
            </div>
            <ExternalLinkIcon className="text-gray-400" size={16} />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg font-bold">{workflow.workflow_name}</p>
          <p className="text-gray-400">{workflow.repo_name}</p>
          <p className="text-gray-400">{workflow.branch}</p>
          <p className="text-sm mt-10">@{workflow.triggered_by}</p>
          <p className="text-sm">
            {lastRunTime} &#x2022; Run #{workflow.run_number}
          </p>
        </CardContent>
      </Card>
    </a>
  );
}
