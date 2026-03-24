// Re-export everything from the new modular structure
export type { Career, RoadmapStep } from "./careers/index";
export {
  levelColor,
  getCareers,
  getLevelLabels,
  getCareerBySlug,
} from "./careers/index";
