import { release } from '@vyron/release-scripts'
import { logRecentCommits, run } from './releaseUtils'

release({
  repo: 'vii',
  ignorePublint: true,
  ignoreReleaseConfirm: true,
  packages: ['cli', 'utils', 'release-scripts', 'useAxios'],
  toTag: (pkg, version) => `${pkg}@${version}`,
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
