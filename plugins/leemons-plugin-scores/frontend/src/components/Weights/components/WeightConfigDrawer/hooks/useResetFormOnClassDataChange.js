import { useEffect } from 'react';

export default function useResetFormOnClassDataChange({ weight, class: klass, form }) {
  useEffect(() => {
    let formData;

    if (weight && weight?.class === klass?.id) {
      formData = {
        type: weight.type,
        weights: { weight: weight.weights, applySameValue: weight.applySameValue },
        explanation: weight.explanation,
      };
      form.reset(formData);
    } else {
      formData = {
        type: 'averages',
        weights: { weight: [], applySameValue: true },
        explanation: '',
      };
      form.reset(formData);
    }
  }, [weight, klass?.id, form]);
}
