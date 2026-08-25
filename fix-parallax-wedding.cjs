const fs = require('fs');

function addNoParallax(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  content = content.replace(/<section[^>]*className=\"([^\"]*)\"/, (match, p1) => {
    if (!p1.includes('no-parallax')) {
      return match.replace(p1, p1 + ' no-parallax');
    }
    return match;
  });
  fs.writeFileSync(filePath, content);
}

addNoParallax('src/components/weddings/WeddingStorySection.tsx');
addNoParallax('src/components/weddings/WeddingApproachSection.tsx');
addNoParallax('src/components/weddings/WeddingSelectedStories.tsx');
addNoParallax('src/components/weddings/WeddingFilmsSection.tsx');
addNoParallax('src/components/weddings/WeddingWhiteCta.tsx');
