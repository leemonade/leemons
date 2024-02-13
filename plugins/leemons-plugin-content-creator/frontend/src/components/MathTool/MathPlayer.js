import React, { useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { NodeViewWrapper } from '@bubbles-ui/editors';
import katex from 'katex';
import { MathPlayerStyles } from './MathPlayer.styles';

const MathPlayer = ({ node }) => {
  const [view, setView] = useState('latex');
  const { classes } = MathPlayerStyles({});
  const { latex } = node.attrs;

  const wrapperRef = useRef(null);
  const editorRef = useRef(null);

  useEffect(() => {
    const handleFocus = (e) => {
      setView('latex');
    };

    const handleBlur = (e) => {
      setView('formula');
    };

    const currentRef = wrapperRef.current;
    if (currentRef) {
      currentRef.addEventListener('focus', handleFocus, true); // Use capture phase for focus
      currentRef.addEventListener('blur', handleBlur, true); // Use capture phase for blur
    }
    // Don't remove this setView. Without it, the editor will not register the changes in latex formulas
    setView('formula');

    return () => {
      if (currentRef) {
        currentRef.removeEventListener('focus', handleFocus, true);
        currentRef.removeEventListener('blur', handleBlur, true);
      }
    };
  }, []);

  useEffect(() => {
    const handleChange = () => {
      node.attrs = { ...node.attrs, latex: editorRef.current.innerHTML };
    };

    const currentRef = editorRef.current;
    if (currentRef) {
      currentRef.addEventListener('input', handleChange, true); // Use capture phase for blur
    }

    return () => {
      if (currentRef) {
        currentRef.removeEventListener('input', handleChange, true);
      }
    };
  }, []);

  const formatText = useMemo(() => {
    try {
      return katex.renderToString(`${latex}`);
    } catch (e) {
      return latex;
    }
  }, [latex]);

  const content = useMemo(
    () =>
      view !== 'latex' ? (
        <span contentEditable={true} dangerouslySetInnerHTML={{ __html: formatText }}></span>
      ) : (
        <span contentEditable={true} ref={editorRef}>
          {latex}
        </span>
      ),
    [latex, formatText, view]
  );

  return (
    <NodeViewWrapper
      ref={wrapperRef}
      className={view === 'latex' ? classes.wrapperLatex : classes.wrapperMath}
    >
      <div>{content}</div>
    </NodeViewWrapper>
  );
};

MathPlayer.propTypes = {
  node: PropTypes.object.isRequired,
};

export { MathPlayer };
