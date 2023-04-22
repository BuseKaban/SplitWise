import { GroupSummaryDetail } from "./GroupSummaryDetail";

export interface GroupSummary {
  GroupID: number,
  GroupName: string,
  SummaryAmount: number,
  Details: GroupSummaryDetail[],
}
