import { PluginScoresBasicIcon, PluginFeedbackIcon } from '@bubbles-ui/icons/outline';

import { PunctuableIcon, NonEvaluableIcon } from '@bubbles-ui/icons/solid';

export default function getEvaluationTypesIcons() {
  return {
    calificable: PluginScoresBasicIcon,
    punctuable: PunctuableIcon,
    feedbackOnly: PluginFeedbackIcon,
    nonEvaluable: NonEvaluableIcon,
  };
}
