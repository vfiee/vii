import { release } from '@vitejs/release-scripts'
import { logRecentCommits, run } from './releaseUtils'

release({
  repo: 'vyron',
  packages: ['cli', 'shared'],
  toTag: (pkg, version) => version,
  logChangelog: (pkg) => logRecentCommits(pkg),
  generateChangelog: async (pkgName) => {
    console.log('\nGenerating changelog...')
    const changelogArgs = [
      'conventional-changelog',
      '-p',
      'angular',
      '-i',
      'CHANGELOG.md',
      '-s',
      '--commit-path',
      '.',
    ]
    await run('npx', changelogArgs, { cwd: `packages/${pkgName}` })
  },
})
