import _css from '@emotion/css';
import _extends from '@babel/runtime/helpers/extends';
import _objectWithoutPropertiesLoose from '@babel/runtime/helpers/objectWithoutPropertiesLoose';
import { jsx } from '@emotion/core';
import { useRef } from 'react';

function getClientPosition(e) {
  var touches = e.touches;

  if (touches && touches.length) {
    var finger = touches[0];
    return {
      x: finger.clientX,
      y: finger.clientY
    };
  }

  return {
    x: e.clientX,
    y: e.clientY
  };
}

var track = {
  position: 'relative',
  display: 'inline-block',
  backgroundColor: '#ddd',
  borderRadius: 5,
  userSelect: 'none',
  boxSizing: 'border-box'
};
var active = {
  position: 'absolute',
  backgroundColor: '#5e72e4',
  borderRadius: 5,
  userSelect: 'none',
  boxSizing: 'border-box'
};
var thumb = {
  position: 'relative',
  display: 'block',
  content: '""',
  width: 18,
  height: 18,
  backgroundColor: '#fff',
  borderRadius: '50%',
  boxShadow: '0 1px 1px rgba(0,0,0,.5)',
  userSelect: 'none',
  cursor: 'pointer',
  boxSizing: 'border-box'
};
var styles = {
  x: {
    track: _extends({}, track, {
      width: 200,
      height: 10
    }),
    active: _extends({}, active, {
      top: 0,
      height: '100%'
    }),
    thumb: _extends({}, thumb)
  },
  y: {
    track: _extends({}, track, {
      width: 10,
      height: 200
    }),
    active: _extends({}, active, {
      left: 0,
      width: '100%'
    }),
    thumb: _extends({}, thumb)
  },
  xy: {
    track: {
      position: 'relative',
      overflow: 'hidden',
      width: 200,
      height: 200,
      backgroundColor: '#5e72e4',
      borderRadius: 0
    },
    active: {},
    thumb: _extends({}, thumb)
  },
  disabled: {
    opacity: 0.5
  }
};

var Slider = function Slider(_ref) {
  var disabled = _ref.disabled,
      axis = _ref.axis,
      x = _ref.x,
      y = _ref.y,
      xmin = _ref.xmin,
      xmax = _ref.xmax,
      ymin = _ref.ymin,
      ymax = _ref.ymax,
      xstep = _ref.xstep,
      ystep = _ref.ystep,
      onChange = _ref.onChange,
      onDragStart = _ref.onDragStart,
      onDragEnd = _ref.onDragEnd,
      xreverse = _ref.xreverse,
      yreverse = _ref.yreverse,
      customStyles = _ref.styles,
      props = _objectWithoutPropertiesLoose(_ref, ["disabled", "axis", "x", "y", "xmin", "xmax", "ymin", "ymax", "xstep", "ystep", "onChange", "onDragStart", "onDragEnd", "xreverse", "yreverse", "styles"]);

  var container = useRef(null);
  var handle = useRef(null);
  var start = useRef({});
  var offset = useRef({});

  function getPosition() {
    var top = (y - ymin) / (ymax - ymin) * 100;
    var left = (x - xmin) / (xmax - xmin) * 100;
    if (top > 100) top = 100;
    if (top < 0) top = 0;
    if (axis === 'x') top = 0;
    if (left > 100) left = 100;
    if (left < 0) left = 0;
    if (axis === 'y') left = 0;
    return {
      top: top,
      left: left
    };
  }

  function change(_ref2) {
    var top = _ref2.top,
        left = _ref2.left;
    if (!onChange) return;

    var _container$current$ge = container.current.getBoundingClientRect(),
        width = _container$current$ge.width,
        height = _container$current$ge.height;

    var dx = 0;
    var dy = 0;
    if (left < 0) left = 0;
    if (left > width) left = width;
    if (top < 0) top = 0;
    if (top > height) top = height;

    if (axis === 'x' || axis === 'xy') {
      dx = left / width * (xmax - xmin);
    }

    if (axis === 'y' || axis === 'xy') {
      dy = top / height * (ymax - ymin);
    }

    var x = (dx !== 0 ? parseInt(dx / xstep, 10) * xstep : 0) + xmin;
    var y = (dy !== 0 ? parseInt(dy / ystep, 10) * ystep : 0) + ymin;
    onChange({
      x: xreverse ? xmax - x + xmin : x,
      y: yreverse ? ymax - y + ymin : y
    });
  }

  function handleMouseDown(e) {
    if (disabled) return; // e.preventDefault();

    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    var dom = handle.current;
    var clientPos = getClientPosition(e);
    start.current = {
      x: dom.offsetLeft,
      y: dom.offsetTop
    };
    offset.current = {
      x: clientPos.x,
      y: clientPos.y
    };
    document.addEventListener('mousemove', handleDrag);
    document.addEventListener('mouseup', handleDragEnd);
    document.addEventListener('touchmove', handleDrag, {
      passive: false
    });
    document.addEventListener('touchend', handleDragEnd);
    document.addEventListener('touchcancel', handleDragEnd);

    if (onDragStart) {
      onDragStart(e);
    }
  }

  function getPos(e) {
    var clientPos = getClientPosition(e);
    var left = clientPos.x + start.current.x - offset.current.x;
    var top = clientPos.y + start.current.y - offset.current.y;
    return {
      left: left,
      top: top
    };
  }

  function handleDrag(e) {
    if (disabled) return; // e.preventDefault();

    change(getPos(e));
  }

  function handleDragEnd(e) {
    if (disabled) return; // e.preventDefault();

    document.removeEventListener('mousemove', handleDrag);
    document.removeEventListener('mouseup', handleDragEnd);
    document.removeEventListener('touchmove', handleDrag, {
      passive: false
    });
    document.removeEventListener('touchend', handleDragEnd);
    document.removeEventListener('touchcancel', handleDragEnd);

    if (onDragEnd) {
      onDragEnd(e);
    }
  }

  function handleTrackMouseDown(e) {
    if (disabled) return; // e.preventDefault();

    var clientPos = getClientPosition(e);
    var rect = container.current.getBoundingClientRect();
    start.current = {
      x: clientPos.x - rect.left,
      y: clientPos.y - rect.top
    };
    offset.current = {
      x: clientPos.x,
      y: clientPos.y
    };
    document.addEventListener('mousemove', handleDrag);
    document.addEventListener('mouseup', handleDragEnd);
    document.addEventListener('touchmove', handleDrag, {
      passive: false
    });
    document.addEventListener('touchend', handleDragEnd);
    document.addEventListener('touchcancel', handleDragEnd);
    change({
      left: clientPos.x - rect.left,
      top: clientPos.y - rect.top
    });

    if (onDragStart) {
      onDragStart(e);
    }
  }

  var pos = getPosition();
  var valueStyle = {};
  if (axis === 'x') valueStyle.width = pos.left + '%';
  if (axis === 'y') valueStyle.height = pos.top + '%';
  if (xreverse) valueStyle.left = 100 - pos.left + '%';
  if (yreverse) valueStyle.top = 100 - pos.top + '%';
  var handleStyle = {
    position: 'absolute',
    transform: 'translate(-50%, -50%)',
    left: xreverse ? 100 - pos.left + '%' : pos.left + '%',
    top: yreverse ? 100 - pos.top + '%' : pos.top + '%'
  };

  if (axis === 'x') {
    handleStyle.top = '50%';
  } else if (axis === 'y') {
    handleStyle.left = '50%';
  }

  var styles$1 = {
    track: _extends({}, styles[axis].track, {}, customStyles.track),
    active: _extends({}, styles[axis].active, {}, customStyles.active),
    thumb: _extends({}, styles[axis].thumb, {}, customStyles.thumb),
    disabled: _extends({}, styles.disabled, {}, customStyles.disabled)
  };
  return jsx("div", _extends({}, props, {
    ref: container,
    css: /*#__PURE__*/_css([styles$1.track, disabled && styles$1.disabled], ";label:Slider;" + (process.env.NODE_ENV === "production" ? "" : "/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNsaWRlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUF5TU0iLCJmaWxlIjoic2xpZGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqIEBqc3gganN4ICovXG5pbXBvcnQgeyBqc3ggfSBmcm9tICdAZW1vdGlvbi9jb3JlJztcbmltcG9ydCB7IHVzZVJlZiB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IGdldENsaWVudFBvc2l0aW9uIH0gZnJvbSAnLi91dGlscyc7XG5pbXBvcnQgZGVmYXVsdFN0eWxlcyBmcm9tICcuL3N0eWxlcyc7XG5cbmNvbnN0IFNsaWRlciA9ICh7XG4gIGRpc2FibGVkLFxuICBheGlzLFxuICB4LFxuICB5LFxuICB4bWluLFxuICB4bWF4LFxuICB5bWluLFxuICB5bWF4LFxuICB4c3RlcCxcbiAgeXN0ZXAsXG4gIG9uQ2hhbmdlLFxuICBvbkRyYWdTdGFydCxcbiAgb25EcmFnRW5kLFxuICB4cmV2ZXJzZSxcbiAgeXJldmVyc2UsXG4gIHN0eWxlczogY3VzdG9tU3R5bGVzLFxuICAuLi5wcm9wc1xufSkgPT4ge1xuICBjb25zdCBjb250YWluZXIgPSB1c2VSZWYobnVsbCk7XG4gIGNvbnN0IGhhbmRsZSA9IHVzZVJlZihudWxsKTtcbiAgY29uc3Qgc3RhcnQgPSB1c2VSZWYoe30pO1xuICBjb25zdCBvZmZzZXQgPSB1c2VSZWYoe30pO1xuXG4gIGZ1bmN0aW9uIGdldFBvc2l0aW9uKCkge1xuICAgIGxldCB0b3AgPSAoKHkgLSB5bWluKSAvICh5bWF4IC0geW1pbikpICogMTAwO1xuICAgIGxldCBsZWZ0ID0gKCh4IC0geG1pbikgLyAoeG1heCAtIHhtaW4pKSAqIDEwMDtcblxuICAgIGlmICh0b3AgPiAxMDApIHRvcCA9IDEwMDtcbiAgICBpZiAodG9wIDwgMCkgdG9wID0gMDtcbiAgICBpZiAoYXhpcyA9PT0gJ3gnKSB0b3AgPSAwO1xuXG4gICAgaWYgKGxlZnQgPiAxMDApIGxlZnQgPSAxMDA7XG4gICAgaWYgKGxlZnQgPCAwKSBsZWZ0ID0gMDtcbiAgICBpZiAoYXhpcyA9PT0gJ3knKSBsZWZ0ID0gMDtcblxuICAgIHJldHVybiB7IHRvcCwgbGVmdCB9O1xuICB9XG5cbiAgZnVuY3Rpb24gY2hhbmdlKHsgdG9wLCBsZWZ0IH0pIHtcbiAgICBpZiAoIW9uQ2hhbmdlKSByZXR1cm47XG5cbiAgICBjb25zdCB7IHdpZHRoLCBoZWlnaHQgfSA9IGNvbnRhaW5lci5jdXJyZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGxldCBkeCA9IDA7XG4gICAgbGV0IGR5ID0gMDtcblxuICAgIGlmIChsZWZ0IDwgMCkgbGVmdCA9IDA7XG4gICAgaWYgKGxlZnQgPiB3aWR0aCkgbGVmdCA9IHdpZHRoO1xuICAgIGlmICh0b3AgPCAwKSB0b3AgPSAwO1xuICAgIGlmICh0b3AgPiBoZWlnaHQpIHRvcCA9IGhlaWdodDtcblxuICAgIGlmIChheGlzID09PSAneCcgfHwgYXhpcyA9PT0gJ3h5Jykge1xuICAgICAgZHggPSAobGVmdCAvIHdpZHRoKSAqICh4bWF4IC0geG1pbik7XG4gICAgfVxuXG4gICAgaWYgKGF4aXMgPT09ICd5JyB8fCBheGlzID09PSAneHknKSB7XG4gICAgICBkeSA9ICh0b3AgLyBoZWlnaHQpICogKHltYXggLSB5bWluKTtcbiAgICB9XG5cbiAgICBjb25zdCB4ID0gKGR4ICE9PSAwID8gcGFyc2VJbnQoZHggLyB4c3RlcCwgMTApICogeHN0ZXAgOiAwKSArIHhtaW47XG4gICAgY29uc3QgeSA9IChkeSAhPT0gMCA/IHBhcnNlSW50KGR5IC8geXN0ZXAsIDEwKSAqIHlzdGVwIDogMCkgKyB5bWluO1xuXG4gICAgb25DaGFuZ2Uoe1xuICAgICAgeDogeHJldmVyc2UgPyB4bWF4IC0geCArIHhtaW4gOiB4LFxuICAgICAgeTogeXJldmVyc2UgPyB5bWF4IC0geSArIHltaW4gOiB5XG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiBoYW5kbGVNb3VzZURvd24oZSkge1xuICAgIGlmIChkaXNhYmxlZCkgcmV0dXJuO1xuXG4gICAgLy8gZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgZS5uYXRpdmVFdmVudC5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcbiAgICBjb25zdCBkb20gPSBoYW5kbGUuY3VycmVudDtcbiAgICBjb25zdCBjbGllbnRQb3MgPSBnZXRDbGllbnRQb3NpdGlvbihlKTtcblxuICAgIHN0YXJ0LmN1cnJlbnQgPSB7XG4gICAgICB4OiBkb20ub2Zmc2V0TGVmdCxcbiAgICAgIHk6IGRvbS5vZmZzZXRUb3BcbiAgICB9O1xuXG4gICAgb2Zmc2V0LmN1cnJlbnQgPSB7XG4gICAgICB4OiBjbGllbnRQb3MueCxcbiAgICAgIHk6IGNsaWVudFBvcy55XG4gICAgfTtcblxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIGhhbmRsZURyYWcpO1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCBoYW5kbGVEcmFnRW5kKTtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCd0b3VjaG1vdmUnLCBoYW5kbGVEcmFnLCB7IHBhc3NpdmU6IGZhbHNlIH0pO1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoZW5kJywgaGFuZGxlRHJhZ0VuZCk7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hjYW5jZWwnLCBoYW5kbGVEcmFnRW5kKTtcblxuICAgIGlmIChvbkRyYWdTdGFydCkge1xuICAgICAgb25EcmFnU3RhcnQoZSk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gZ2V0UG9zKGUpIHtcbiAgICBjb25zdCBjbGllbnRQb3MgPSBnZXRDbGllbnRQb3NpdGlvbihlKTtcbiAgICBjb25zdCBsZWZ0ID0gY2xpZW50UG9zLnggKyBzdGFydC5jdXJyZW50LnggLSBvZmZzZXQuY3VycmVudC54O1xuICAgIGNvbnN0IHRvcCA9IGNsaWVudFBvcy55ICsgc3RhcnQuY3VycmVudC55IC0gb2Zmc2V0LmN1cnJlbnQueTtcblxuICAgIHJldHVybiB7IGxlZnQsIHRvcCB9O1xuICB9XG5cbiAgZnVuY3Rpb24gaGFuZGxlRHJhZyhlKSB7XG4gICAgaWYgKGRpc2FibGVkKSByZXR1cm47XG5cbiAgICAvLyBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgY2hhbmdlKGdldFBvcyhlKSk7XG4gIH1cblxuICBmdW5jdGlvbiBoYW5kbGVEcmFnRW5kKGUpIHtcbiAgICBpZiAoZGlzYWJsZWQpIHJldHVybjtcblxuICAgIC8vIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBoYW5kbGVEcmFnKTtcbiAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgaGFuZGxlRHJhZ0VuZCk7XG5cbiAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaG1vdmUnLCBoYW5kbGVEcmFnLCB7XG4gICAgICBwYXNzaXZlOiBmYWxzZVxuICAgIH0pO1xuICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNoZW5kJywgaGFuZGxlRHJhZ0VuZCk7XG4gICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigndG91Y2hjYW5jZWwnLCBoYW5kbGVEcmFnRW5kKTtcblxuICAgIGlmIChvbkRyYWdFbmQpIHtcbiAgICAgIG9uRHJhZ0VuZChlKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBoYW5kbGVUcmFja01vdXNlRG93bihlKSB7XG4gICAgaWYgKGRpc2FibGVkKSByZXR1cm47XG5cbiAgICAvLyBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgY29uc3QgY2xpZW50UG9zID0gZ2V0Q2xpZW50UG9zaXRpb24oZSk7XG4gICAgY29uc3QgcmVjdCA9IGNvbnRhaW5lci5jdXJyZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXG4gICAgc3RhcnQuY3VycmVudCA9IHtcbiAgICAgIHg6IGNsaWVudFBvcy54IC0gcmVjdC5sZWZ0LFxuICAgICAgeTogY2xpZW50UG9zLnkgLSByZWN0LnRvcFxuICAgIH07XG5cbiAgICBvZmZzZXQuY3VycmVudCA9IHtcbiAgICAgIHg6IGNsaWVudFBvcy54LFxuICAgICAgeTogY2xpZW50UG9zLnlcbiAgICB9O1xuXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgaGFuZGxlRHJhZyk7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIGhhbmRsZURyYWdFbmQpO1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNobW92ZScsIGhhbmRsZURyYWcsIHsgcGFzc2l2ZTogZmFsc2UgfSk7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hlbmQnLCBoYW5kbGVEcmFnRW5kKTtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCd0b3VjaGNhbmNlbCcsIGhhbmRsZURyYWdFbmQpO1xuXG4gICAgY2hhbmdlKHtcbiAgICAgIGxlZnQ6IGNsaWVudFBvcy54IC0gcmVjdC5sZWZ0LFxuICAgICAgdG9wOiBjbGllbnRQb3MueSAtIHJlY3QudG9wXG4gICAgfSk7XG5cbiAgICBpZiAob25EcmFnU3RhcnQpIHtcbiAgICAgIG9uRHJhZ1N0YXJ0KGUpO1xuICAgIH1cbiAgfVxuXG4gIGNvbnN0IHBvcyA9IGdldFBvc2l0aW9uKCk7XG4gIGNvbnN0IHZhbHVlU3R5bGUgPSB7fTtcbiAgaWYgKGF4aXMgPT09ICd4JykgdmFsdWVTdHlsZS53aWR0aCA9IHBvcy5sZWZ0ICsgJyUnO1xuICBpZiAoYXhpcyA9PT0gJ3knKSB2YWx1ZVN0eWxlLmhlaWdodCA9IHBvcy50b3AgKyAnJSc7XG4gIGlmICh4cmV2ZXJzZSkgdmFsdWVTdHlsZS5sZWZ0ID0gMTAwIC0gcG9zLmxlZnQgKyAnJSc7XG4gIGlmICh5cmV2ZXJzZSkgdmFsdWVTdHlsZS50b3AgPSAxMDAgLSBwb3MudG9wICsgJyUnO1xuXG4gIGNvbnN0IGhhbmRsZVN0eWxlID0ge1xuICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgIHRyYW5zZm9ybTogJ3RyYW5zbGF0ZSgtNTAlLCAtNTAlKScsXG4gICAgbGVmdDogeHJldmVyc2UgPyAxMDAgLSBwb3MubGVmdCArICclJyA6IHBvcy5sZWZ0ICsgJyUnLFxuICAgIHRvcDogeXJldmVyc2UgPyAxMDAgLSBwb3MudG9wICsgJyUnIDogcG9zLnRvcCArICclJ1xuICB9O1xuXG4gIGlmIChheGlzID09PSAneCcpIHtcbiAgICBoYW5kbGVTdHlsZS50b3AgPSAnNTAlJztcbiAgfSBlbHNlIGlmIChheGlzID09PSAneScpIHtcbiAgICBoYW5kbGVTdHlsZS5sZWZ0ID0gJzUwJSc7XG4gIH1cblxuICBjb25zdCBzdHlsZXMgPSB7XG4gICAgdHJhY2s6IHsgLi4uZGVmYXVsdFN0eWxlc1theGlzXS50cmFjaywgLi4uY3VzdG9tU3R5bGVzLnRyYWNrIH0sXG4gICAgYWN0aXZlOiB7IC4uLmRlZmF1bHRTdHlsZXNbYXhpc10uYWN0aXZlLCAuLi5jdXN0b21TdHlsZXMuYWN0aXZlIH0sXG4gICAgdGh1bWI6IHsgLi4uZGVmYXVsdFN0eWxlc1theGlzXS50aHVtYiwgLi4uY3VzdG9tU3R5bGVzLnRodW1iIH0sXG4gICAgZGlzYWJsZWQ6IHsgLi4uZGVmYXVsdFN0eWxlcy5kaXNhYmxlZCwgLi4uY3VzdG9tU3R5bGVzLmRpc2FibGVkIH1cbiAgfTtcblxuICByZXR1cm4gKFxuICAgIDxkaXZcbiAgICAgIHsuLi5wcm9wc31cbiAgICAgIHJlZj17Y29udGFpbmVyfVxuICAgICAgY3NzPXtbc3R5bGVzLnRyYWNrLCBkaXNhYmxlZCAmJiBzdHlsZXMuZGlzYWJsZWRdfVxuICAgICAgb25Ub3VjaFN0YXJ0PXtoYW5kbGVUcmFja01vdXNlRG93bn1cbiAgICAgIG9uTW91c2VEb3duPXtoYW5kbGVUcmFja01vdXNlRG93bn1cbiAgICA+XG4gICAgICA8ZGl2IGNzcz17c3R5bGVzLmFjdGl2ZX0gc3R5bGU9e3ZhbHVlU3R5bGV9IC8+XG4gICAgICA8ZGl2XG4gICAgICAgIHJlZj17aGFuZGxlfVxuICAgICAgICBzdHlsZT17aGFuZGxlU3R5bGV9XG4gICAgICAgIG9uVG91Y2hTdGFydD17aGFuZGxlTW91c2VEb3dufVxuICAgICAgICBvbk1vdXNlRG93bj17aGFuZGxlTW91c2VEb3dufVxuICAgICAgICBvbkNsaWNrPXtmdW5jdGlvbihlKSB7XG4gICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICBlLm5hdGl2ZUV2ZW50LnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xuICAgICAgICB9fVxuICAgICAgPlxuICAgICAgICA8ZGl2IGNzcz17c3R5bGVzLnRodW1ifSAvPlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gICk7XG59O1xuXG5TbGlkZXIuZGVmYXVsdFByb3BzID0ge1xuICBkaXNhYmxlZDogZmFsc2UsXG4gIGF4aXM6ICd4JyxcbiAgeDogNTAsXG4gIHhtaW46IDAsXG4gIHhtYXg6IDEwMCxcbiAgeTogNTAsXG4gIHltaW46IDAsXG4gIHltYXg6IDEwMCxcbiAgeHN0ZXA6IDEsXG4gIHlzdGVwOiAxLFxuICB4cmV2ZXJzZTogZmFsc2UsXG4gIHlyZXZlcnNlOiBmYWxzZSxcbiAgc3R5bGVzOiB7fVxufTtcblxuZXhwb3J0IGRlZmF1bHQgU2xpZGVyO1xuIl19 */")),
    onTouchStart: handleTrackMouseDown,
    onMouseDown: handleTrackMouseDown
  }), jsx("div", {
    css: styles$1.active,
    style: valueStyle
  }), jsx("div", {
    ref: handle,
    style: handleStyle,
    onTouchStart: handleMouseDown,
    onMouseDown: handleMouseDown,
    onClick: function onClick(e) {
      e.stopPropagation();
      e.nativeEvent.stopImmediatePropagation();
    }
  }, jsx("div", {
    css: styles$1.thumb
  })));
};

Slider.defaultProps = {
  disabled: false,
  axis: 'x',
  x: 50,
  xmin: 0,
  xmax: 100,
  y: 50,
  ymin: 0,
  ymax: 100,
  xstep: 1,
  ystep: 1,
  xreverse: false,
  yreverse: false,
  styles: {}
};

export default Slider;
