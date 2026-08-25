const fs = require('fs');

function addNoParallax(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  content = content.replace(/className=\"relative w-full [^\"]*\"/, (match) => {
    if (!match.includes('no-parallax')) {
      return match.slice(0, -1) + ' no-parallax"';
    }
    return match;
  });
  fs.writeFileSync(filePath, content);
}

addNoParallax('src/components/AboutSection.tsx');
addNoParallax('src/components/FinalCtaSection.tsx');
addNoParallax('src/components/ContactSection.tsx');
addNoParallax('src/components/ServicesSection.tsx');
addNoParallax('src/components/IntroductionSection.tsx');
