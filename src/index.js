import navigationTimingSet from './navigationTimingSet';

function isInvalid() {
  return typeof performance === 'undefined' || typeof performance.getEntriesByType === 'undefined'
}

const performance =
  window.performance ||
  window.webkitPerformance ||
  window.msPerformance ||
  window.mozPerformance;

const timing = {
  getNavigationDuration: function () {
    if (isInvalid()) {
      return;
    }

    const navigationTiming = performance.getEntriesByType('navigation')[0];

    return navigationTimingSet.map((item) => {
      const diff = navigationTiming[item.end] - navigationTiming[item.start];
      return Object.assign(item, {
        duration: diff < 0 ? null : diff
      });
    });
  },

  getPaintTiming: function () {
    if (isInvalid()) {
      return;
    }

    return performance.getEntriesByType('paint').map(({ startTime, name }) => {
      return {
        startTime,
        name,
        timeOrigin: performance.timeOrigin,
      };
    });
  },

  table: function() {
    if (isInvalid()) {
      return;
    }

    const navigationTiming = this.getNavigationDuration();
    const paintTiming = this.getPaintTiming();
    const resourceTiming = performance.getEntriesByType('resource');
    const performanceTable = {};
    const paintTable = {};
    const resourceTable = {};

    // navigation timing
    navigationTiming.forEach(({ name, duration, description }) => {
      performanceTable[name] = {
        ms: duration,
        s: +(duration / 1000).toFixed(2),
        description,
      };
    });
    
    // first paint
    paintTiming.forEach(({ startTime, name, timeOrigin }) => {
      paintTable[name] = {
        startTime,
        timeOrigin,
      };
    });

    // resource timing
    resourceTiming.forEach(({ name, duration, decodedBodySize, transferSize }) => {
      resourceTable[name] = {
        ms: duration,
        s: +(duration / 1000).toFixed(2),
        decodedBodySize,
        transferSize,
      };
    });

    console.group('Navigation Timing');
    console.table(performanceTable);
    console.groupEnd();
    console.group('First Paint');
    console.table(paintTable);
    console.groupEnd();
    console.groupCollapsed('Resource Timing');
    console.table(resourceTable);
    console.groupEnd();
  }
};

window.timing = window.timing || timing;