export type ReportTargetType = 'USER' | 'EVENT';

export interface ReportItem {
    id: number;
    reporterId: number;
    reporterName: string;
    targetType: ReportTargetType;
    targetId: number;
    targetName: string;
    reason: string;
    details?: string;
    createdAt?: string;
    hasImage?: boolean;
    imageUrl?: string | null;
}
