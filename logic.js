/**
 * Clamp a value between a minimum and maximum
 * @param {number} S - The value to clamp
 * @param {number} W - The minimum value
 * @param {number} m - The maximum value
 * @returns {number} The clamped value
 */
gP$ = function (S, W, m) {
  return Math.min(Math.max(S, W), m);
};

/**
 * Generate point data for the heatmap visualization
 * Converts marker intensity data into SVG coordinate points (x, y)
 * 
 * @param {Array} S - Array of marker objects with intensityScoreNormalized property
 * @param {number} W - Minimum height in density pixels
 * @param {number} m - Base height (typically 40px)
 * @param {number} a - Maximum height in density pixels
 * @param {boolean} J - Whether to use smooth transitions (default: false)
 * @returns {Array} Array of {x, y} coordinate objects for SVG path
 */
YGX = function (S, W, m, a, J = !1) {
  const B = 1e3 / S.length, // Width of each segment (viewBox is 0-1000)
    E = [];
  
  // Start at bottom-left corner
  E.push({
    x: 0,
    y: 100,
  });
  
  // Process each marker to create coordinate points
  for (let z = 0; z < S.length; z++) {
    const y = (z + 0.5) * B, // X position at center of segment
      Y =
        100 -
        gP$(
          (S[z].intensityScoreNormalized || 0) * 100,
          (W / m) * 100,
          (a / m) * 100
        ); // Y position (inverted, 0 is top)
    
    // Add initial point at left edge for non-smooth mode
    z !== 0 ||
      J ||
      E.push({
        x: 0,
        y: Y,
      });
    
    // Add center point for this marker
    E.push({
      x: y,
      y: Y,
    });
    
    // Add final point at right edge for last marker
    z === S.length - 1 &&
      E.push({
        x: 1e3,
        y: Y,
      });
  }
  
  // End at bottom-right corner
  E.push({
    x: 1e3,
    y: 100,
  });
  return E;
};

/**
 * Vector class for calculating Bezier control points
 * Represents a 2D vector between two points
 */
var GeX = class {
  constructor(S, W) {
    this.N = this.C = 0;
    this.C = W.x - S.x; // X component of vector
    this.N = W.y - S.y; // Y component of vector
  }
};

/**
 * Calculate Bezier control point for smooth curves
 * Creates a point offset from the main point based on adjacent points
 * 
 * @param {Object} S - Current point {x, y}
 * @param {Object} W - Previous point {x, y}
 * @param {Object} m - Next point {x, y}
 * @param {boolean} a - Whether to reverse the vector direction
 * @returns {Object} Control point {x, y} for Bezier curve
 */
BjO = function (S, W, m, a = !1) {
  W = new GeX(W || S, m || S);
  return {
    x: S.x + KuP(W, a) * 0.2, // Control point offset by 20% of vector
    y: S.y + TjK(W, a) * 0.2,
  };
};

/**
 * Generate SVG path string from coordinate points
 * Supports both smooth Bezier curves and straight lines
 * 
 * @param {Array} S - Array of {x, y} coordinate objects
 * @param {boolean} useBezier - If true, use Bezier curves (C); if false, use lines (L)
 * @returns {string} SVG path data string (e.g., "M 0,100 C 1,80 2,2 5,0 ...")
 */
EAK = function (S, useBezier = true) {
  let W = "";
  for (let a = 0; a < S.length; a++) {
    var m = S[a];
    if (a === 0) {
      // Start with Move command
      m = `M ${m.x.toFixed(1)},${m.y.toFixed(1)}`;
    } else {
      if (useBezier) {
        // Bezier curve mode (smooth)
        const J = BjO(S[a - 1], S[a - 2], m), // Control point 1
          B = BjO(m, S[a - 1], S[a + 1], !0); // Control point 2
        m = ` ${`C ${J.x.toFixed(1)},${J.y.toFixed(1)} ${B.x.toFixed(
          1
        )},${B.y.toFixed(1)} ${m.x.toFixed(1)},${m.y.toFixed(1)}`}`;
      } else {
        // Line mode (non-smooth)
        m = ` L ${m.x.toFixed(1)},${m.y.toFixed(1)}`;
      }
    }
    W += m;
  }
  return W;
};

/**
 * Get X component of vector, optionally reversed
 * @param {GeX} S - Vector object
 * @param {boolean} W - Whether to reverse direction
 * @returns {number} X component
 */
KuP = function (S, W = !1) {
  return W ? S.C * -1 : S.C;
};

/**
 * Get Y component of vector, optionally reversed
 * @param {GeX} S - Vector object
 * @param {boolean} W - Whether to reverse direction
 * @returns {number} Y component
 */
TjK = function (S, W = !1) {
  return W ? S.N * -1 : S.N;
};
