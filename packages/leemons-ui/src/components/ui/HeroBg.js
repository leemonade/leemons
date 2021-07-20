import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';

function HeroBg({ className, color, type, animate, decay, speed }) {
  const colorClass = color ? `herobg-${color}` : '';
  const classes = className || '';
  const [currentType, setCurrentType] = useState(null);
  const animationRef = useRef(0);

  const lg = (
    <svg
      className={[colorClass, classes].join(' ')}
      width="1601"
      height="882"
      viewBox="0 0 1601 882"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Y = 0 */}
      <rect width="229" height="147" fill="currentColor" />
      <rect x="457" width="229" height="147" fill="currentColor" />
      <rect x="686" width="228" height="147" fill="currentColor" />
      <rect x="1143" width="229" height="147" fill="currentColor" />
      <rect x="1372" width="229" height="147" fill="currentColor" />

      {/* Y = 147 */}
      <rect y="147" width="229" height="147" fill="currentColor" />
      <rect x="229" y="147" width="228" height="147" fill="currentColor" />
      <rect x="457" y="147" width="229" height="147" fill="currentColor" />
      <rect x="686" y="147" width="228" height="147" fill="currentColor" />
      <rect x="914" y="147" width="229" height="147" fill="currentColor" />
      <rect x="1143" y="147" width="229" height="147" fill="currentColor" />
      <rect x="1372" y="147" width="229" height="147" fill="currentColor" />

      {/* Y= 441 */}
      <rect x="229" y="441" width="228" height="147" fill="currentColor" />
      <rect x="457" y="441" width="229" height="147" fill="currentColor" />
      <rect x="686" y="441" width="228" height="147" fill="currentColor" />
      <rect x="914" y="441" width="229" height="147" fill="currentColor" />
      <rect x="1143" y="441" width="229" height="147" fill="currentColor" />
      <rect x="1372" y="441" width="229" height="147" fill="currentColor" />

      {/* Y = 588 */}
      <rect x="2" y="588" width="226" height="144" stroke="currentColor" strokeWidth="3" />
      <rect x="229" y="588" width="228" height="147" fill="currentColor" />
      <rect x="457" y="588" width="229" height="147" fill="currentColor" />
      <rect x="686" y="588" width="228" height="147" fill="currentColor" />
      <rect x="914" y="588" width="229" height="147" fill="currentColor" />
      <rect x="1143" y="588" width="229" height="147" fill="currentColor" />

      {/* Y = 735 */}
      <rect y="735" width="229" height="147" fill="white" />
      <rect x="457" y="735" width="229" height="147" fill="currentColor" />
      <rect x="1143" y="735" width="231" height="148" fill="white" />
      <rect x="1372" y="735" width="231" height="148" fill="white" />

      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M200.43 514.502C190.571 472.233 155.807 441 114.43 441C73.0522 441 38.2882 472.233 28.4297 514.502C38.2882 556.767 73.0522 588 114.43 588C155.807 588 190.571 556.767 200.43 514.502Z"
        fill="currentColor"
      />

      <path
        d="M230.072 736.5H310.144C390 736.5 454.831 800.833 455.636 880.5H230.072V736.5Z"
        stroke="currentColor"
        strokeWidth="3"
      />

      <path
        d="M726.285 819L726.285 819.001C734.711 855.176 764.422 881.908 799.785 881.908C835.149 881.908 864.86 855.176 873.285 819.001L873.285 819H726.285Z"
        fill="#F8FA7D"
      />

      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1114.71 73.5016C1104.86 31.2335 1070.09 -2.08605e-06 1028.71 -4.02039e-06C987.337 -5.95474e-06 952.573 31.2335 942.715 73.5016C952.573 115.767 987.337 147 1028.71 147C1070.09 147 1104.86 115.767 1114.71 73.5016Z"
        fill="currentColor"
      />

      <path d="M914 735H1143C1143 816.186 1077.04 882 995.857 882H914V735Z" fill="currentColor" />

      <path
        d="M1412 672L1412 672.001C1420.43 708.176 1450.14 734.908 1485.5 734.908C1520.86 734.908 1550.57 708.176 1559 672.001L1559 672H1412Z"
        fill="currentColor"
      />
    </svg>
  );

  const xMD = (
    <svg
      className={[colorClass, classes].join(' ')}
      width="687"
      height="1024"
      viewBox="0 0 687 1024"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Y = 0 */}
      <rect width="229" height="171" fill="currentColor" />
      <rect x="229" width="229" height="171" fill="currentColor" />

      {/* Y = 171 */}
      <rect y="171" width="229" height="171" fill="currentColor" />
      <rect x="229" y="171" width="229" height="171" fill="currentColor" />
      <rect x="458" y="171" width="229" height="171" fill="currentColor" />

      {/* Y = 512 */}
      <rect y="512" width="229" height="171" fill="currentColor" />
      <rect x="229" y="512" width="229" height="171" fill="currentColor" />
      <rect x="458" y="512" width="229" height="171" fill="currentColor" />

      {/* Y = 683 */}
      <rect y="683" width="229" height="171" fill="currentColor" />
      <rect x="229" y="683" width="229" height="171" fill="currentColor" />
      <rect x="458" y="683" width="229" height="171" fill="currentColor" />

      {/* Y = 853 */}
      <rect y="853" width="229" height="171" fill="currentColor" />
      <rect x="229" y="853" width="230" height="171" fill="white" />
      <rect x="458" y="853" width="231" height="173" fill="white" />

      <path
        transform="translate(458 0)"
        d="M 0 0 L 0 0 C 0 96.543 78.624 171 171 171 L 0 171 Z"
        fill="white"
      />

      <path
        d="M230.071 854.833H286.476C379.404 854.833 454.831 929.763 455.636 1022.5H230.071V854.833Z"
        stroke="#FEFF8C"
        strokeWidth="3"
      />
      <path
        d="M685.714 0H457.143C457.143 94.2566 533.553 170.667 627.809 170.667H685.714V0Z"
        fill="currentColor"
      />
      <path
        d="M457.143 853.333H685.714C685.714 947.59 609.304 1024 515.048 1024H457.143V853.333Z"
        fill="#FEFF8C"
      />
    </svg>
  );

  const xSM = (
    <svg
      className={[colorClass, classes].join(' ')}
      width="458"
      height="1024"
      viewBox="0 0 458 1024"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Y = 0 */}
      <rect x="229" width="229" height="171" fill="currentColor" />

      {/* Y = 171 */}
      <rect y="171" width="229" height="171" fill="currentColor" />
      <rect x="229" y="171" width="229" height="171" fill="currentColor" />

      {/* Y = 512 */}
      <rect y="512" width="229" height="171" fill="currentColor" />
      <rect x="229" y="512" width="229" height="171" fill="currentColor" />

      {/* Y = 683 */}
      <rect y="683" width="229" height="171" fill="currentColor" />
      <rect x="229" y="683" width="229" height="171" fill="currentColor" />

      {/* Y = 853 */}
      <rect y="853" width="230" height="171" fill="white" />
      <rect x="229" y="853" width="231" height="173" fill="white" />

      <path d="M 0 0 L 0 0 C 0 96.543 78.624 171 171 171 L 0 171 Z" fill="white" />

      <path
        transform="translate(-458 0)"
        d="M 686 0 H 458 C 458 95 534 171 628 171 H 686 V0Z"
        fill="currentColor"
      />

      <path
        transform="translate(-230 0)"
        d="M230.071 854.833H286.476C379.404 854.833 454.831 929.763 455.636 1022.5H230.071V854.833Z"
        stroke="#FEFF8C"
        strokeWidth="3"
      />

      <path
        transform="translate(-230 0)"
        d="M457.143 853.333H685.714C685.714 947.59 609.304 1024 515.048 1024H457.143V853.333Z"
        fill="#FEFF8C"
      />
    </svg>
  );

  const TYPES = { lg, 'x-md': xMD, 'x-sm': xSM };

  const getSVGNodes = (node) => {
    let nodes = [];
    if (node) {
      if (node.type === 'svg') {
        return getSVGNodes(node.props.children);
      }
      nodes = React.Children.toArray(node);
    }
    return nodes;
  };

  const doAnimation = (firstTime) => {
    const nodes = getSVGNodes(currentType || TYPES[type]);
    let yValues = [];
    nodes.forEach(
      (node) =>
        (node.props.fill === 'currentColor' || node.props.stroke === 'currentColor') &&
        yValues.push(node.props.y || '0')
    );
    yValues = [...new Set(yValues)];
    // console.log(yValues);

    const yCount = yValues.length;
    const xCount = Math.floor(nodes.length / yCount);

    // console.log('yCount:', yCount);
    // console.log('xCount:', xCount);
    // console.log('nodes:', nodes.length);

    const animStyles = [];

    for (let y = -yCount / 2; y < yCount / 2; y++) {
      const _y = y / (yCount / 2);
      for (let x = 0; x < xCount; x++) {
        animStyles.push({
          opacity: (_y ** 2 / decay) * Math.random(),
          transition: `opacity ${speed}ms`,
        });
      }
    }

    animStyles.reverse();

    const currentNodes = [];
    nodes.forEach((node) => currentNodes.push(node));

    // Order by Y position. In case of path, send it to front (y = 1000)
    currentNodes.sort(
      (a, b) =>
        parseFloat(a.props.y || a.type === 'path' ? '1000' : '0') -
        parseFloat(b.props.y || b.type === 'path' ? '1000' : '0')
    );

    for (let i = 0, l = currentNodes.length; i < l; i++) {
      const currentNode = currentNodes[i];
      if (
        currentNode.props.fill === 'currentColor' ||
        currentNode.props.stroke === 'currentColor'
      ) {
        currentNodes[i] = React.cloneElement(currentNode, {
          style:
            currentNode.type === 'path'
              ? { opacity: Math.random() / 3, transition: 'opacity 3s' }
              : animStyles[i],
        });
      } else {
        currentNodes[i] = React.cloneElement(currentNode);
      }
    }

    if (firstTime || (!firstTime && animationRef.current > 0)) {
      setCurrentType(React.cloneElement(TYPES[type], { children: currentNodes }));
    }
  };

  const initAnimation = () => {
    doAnimation(true);
    if (animate) {
      animationRef.current = setInterval(() => doAnimation(), speed * 2);
    }
  };

  useEffect(() => {
    initAnimation();
    return () => clearInterval(animationRef.current);
  }, []);

  return currentType;
}

HeroBg.defaultProps = { type: 'lg', animate: true, decay: 1, speed: 500 };

HeroBg.propTypes = {
  children: PropTypes.any,
  className: PropTypes.string,
  color: PropTypes.oneOf([
    'primary',
    'secondary',
    'accent',
    'ghost',
    'info',
    'warning',
    'success',
    'error',
  ]),
  type: PropTypes.oneOf(['lg', 'x-md', 'x-sm']),
  decay: PropTypes.number,
  animate: PropTypes.bool,
  speed: PropTypes.number,
};

export default HeroBg;
