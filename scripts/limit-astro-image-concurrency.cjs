// Astro 5 generates remote images using one worker per logical CPU. Keep that
// burst small so the WordPress media origin is not overwhelmed during builds.
const os = require('node:os');

const detectedCpus = os.cpus;
os.cpus = () => detectedCpus().slice(0, 2);
