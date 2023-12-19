import {
  PluginScoresBasicIcon,
  PluginFeedbackIcon,
  PunctuableIcon,
  NonEvaluableIcon,
} from '@bubbles-ui/icons/outline';

export default function getEvaluationTypesIcons() {
  return {
    calificable: PluginScoresBasicIcon,
    punctuable: PunctuableIcon,
    feedbackOnly: PluginFeedbackIcon,
    nonEvaluable: NonEvaluableIcon,
  };
}
