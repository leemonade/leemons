import React, { useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { NodeViewWrapper } from '@bubbles-ui/editors';
import katex from 'katex';
import { MathPlayerStyles } from './MathPlayer.styles';

const MathPlayer = ({ node, editor }) => {
  const [view, setView] = useState('latex');
  const { classes } = MathPlayerStyles({});
  const { latex } = node.attrs;

  const wrapperRef = useRef(null);
  const editorRef = useRef(null);

  useEffect(() => {
    const currentRef = wrapperRef.current;

    const handleBlur = () => {
      setView('formula');
      if (currentRef) {
        currentRef.removeEventListener('blur', handleBlur, true);
      }
    };
    const handleFocus = () => {
      setView('latex');
      currentRef.focus();
      if (currentRef) {
        setTimeout(() => currentRef.addEventListener('blur', handleBlur, true), 300);
      }
    };

    // Don't remove this setView. Without it, the editor will not register the changes in latex formulas
    setView('formula');

    if (currentRef && editor && editor.isEditable) {
      currentRef.addEventListener('focus', handleFocus, true);
    }

    return () => {
      if (currentRef) {
        currentRef.removeEventListener('focus', handleFocus, true);
      }
    };
  }, []);

  useEffect(() => {
    const handleChange = () => {
      node.attrs = { ...node.attrs, latex: editorRef.current.innerHTML };
    };

    const currentRef = editorRef.current;
    if (currentRef && editor && editor.isEditable) {
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
  editor: PropTypes.object.isRequired,
};

export { MathPlayer };
