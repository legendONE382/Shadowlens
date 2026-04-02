export type ApprovalStatus = 'approved' | 'pending' | 'unapproved';
export type Sensitivity = 'low' | 'medium' | 'high';

export type UsageEvent = {
  timestamp: string;
  tool: string;
  category: string;
  department: string;
  device: string;
  status: ApprovalStatus;
  sensitivity: Sensitivity;
};

export type ToolAggregate = {
  tool: string;
  category: string;
  status: ApprovalStatus;
  departments: string[];
  events: number;
  riskScore: number;
  riskLevel: 'High' | 'Medium' | 'Low';
};
