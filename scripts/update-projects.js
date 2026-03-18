const fs = require('fs');
let text = fs.readFileSync('src/components/Projects.tsx', 'utf8');

text = text.replace(/category:\s*"full-stack"/g, 'category: "web-apps"');
text = text.replace(/category:\s*"nocode"/g, 'category: "web-apps"');

const updates = {
  'NGO Assist': 'mobile-apps',
  'Velora': 'mobile-apps',
  'Cartistan': 'mobile-apps',
  'AI Email Auto-Reply': 'automation',
  'FlowNest': 'automation',
  'Diamond Sync Engine': 'automation'
};

for (const [title, cat] of Object.entries(updates)) {
  const matchStr = `title: "${title}"`;
  const split = text.split(matchStr);
  if (split.length > 1) {
    const p1 = split[0];
    const rest = split[1];
    const catReplaced = rest.replace(/category:\s*"web-apps"/, `category: "${cat}"`);
    text = p1 + matchStr + catReplaced;
  }
}

fs.writeFileSync('src/components/Projects.tsx', text);
console.log('done');
