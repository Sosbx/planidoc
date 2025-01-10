export interface PlanningConfig {
  startDate: Date;
  endDate: Date;
  deadline: Date;
  primaryDesiderataLimit: number;
  secondaryDesiderataLimit: number;
  isConfigured: boolean;
}

export const defaultConfig: PlanningConfig = {
  startDate: new Date(),
  endDate: new Date(),
  deadline: new Date(),
  primaryDesiderataLimit: 0,
  secondaryDesiderataLimit: 0,
  isConfigured: false,
};