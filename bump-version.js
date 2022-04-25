const { execSync } = require('child_process');

// Check the type of the latest commit to know what version should be bumped
const latestCommitMessage = execSync('git log -1 --format=%s').toString('utf-8');
const commitParts = latestCommitMessage.matchAll(/(?<type>build|chore|ci|docs|feat|fix|perf|refactor|revert|style|test)(?<scope>\(\w*?\))?(?<breaking>!)?:/g);

let newBumbedVersion = '';

for (const commitPart of commitParts) {
  if (commitPart.groups.breaking) {
    newBumbedVersion = execSync('npm version major').toString('utf-8');
  } else if (commitPart.groups.type === 'feat') {
    newBumbedVersion = execSync('npm version minor').toString('utf-8');
  } else if (commitPart.groups.type === 'fix') {
    newBumbedVersion = execSync('npm version patch').toString('utf-8');
  } else {
    newBumbedVersion = execSync('npm version minor').toString('utf-8');
  }

  newBumbedVersion = newBumbedVersion.trim();

  // Create a new tag and assign it to the latest commit
  execSync(`git tag ${newBumbedVersion}`);

  // Generate changelog for the latest release
  execSync('npm run changelog');

  // Commit bumped package.jspon and generated CHANGELOG as a chore(release)
  execSync(`git add package.json package-lock.json CHANGELOG.md && git commit -q -m "chore(release): ${newBumbedVersion}"`);

  // Push commit along with the tag to the main branch
  execSync('git push --follow-tags origin main');
  // execSync('git push origin --tags');
}
