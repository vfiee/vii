import colors from 'picocolors'
import prompts from 'prompts'
import { publint } from 'publint'
import { formatMessage } from 'publint/utils'
import semver from 'semver'
import {
  args,
  getPackageInfo,
  getVersionChoices,
  isDryRun,
  run,
  runIfNotDry,
  step,
  updateVersion,
} from './shared'

export declare interface ReleaseOptions {
  repo: string
  packages: string[]
  logChangelog: (pkg: string) => void | Promise<void>
  generateChangelog: (pkg: string, version: string) => void | Promise<void>
  toTag: (pkg: string, version: string) => string
  getPkgDir?: (pkg: string) => string
  ignorePublint?: boolean
  ignoreReleaseConfirm?: boolean
}

export const release = async (options: ReleaseOptions): Promise<void> => {
  const {
    repo,
    packages,
    logChangelog,
    generateChangelog,
    toTag,
    getPkgDir,
    ignorePublint = false,
    ignoreReleaseConfirm = false,
  } = options
  let targetVersion: string | undefined

  const selectedPkg: string =
    packages.length === 1
      ? packages[0]
      : (
          await prompts({
            type: 'select',
            name: 'pkg',
            message: 'Select package',
            choices: packages.map((i) => ({ value: i, title: i })),
          })
        ).pkg

  if (!selectedPkg) return

  await logChangelog(selectedPkg)

  const { pkg, pkgPath, pkgDir } = getPackageInfo(selectedPkg, getPkgDir)

  if (!ignorePublint) {
    const { messages } = await publint({ pkgDir })

    if (messages.length) {
      for (const message of messages) console.log(formatMessage(message, pkg))
      const { yes }: { yes: boolean } = await prompts({
        type: 'confirm',
        name: 'yes',
        message: `${messages.length} messages from publint. Continue anyway?`,
      })
      if (!yes) process.exit(1)
    }
  }

  if (!targetVersion) {
    const { release }: { release: string } = await prompts({
      type: 'select',
      name: 'release',
      message: 'Select release type',
      choices: getVersionChoices(pkg.version),
    })

    if (release === 'custom') {
      const res: { version: string } = await prompts({
        type: 'text',
        name: 'version',
        message: 'Input custom version',
        initial: pkg.version,
      })
      targetVersion = res.version
    } else {
      targetVersion = release
    }
  }

  if (!semver.valid(targetVersion)) {
    throw new Error(`invalid target version: ${targetVersion}`)
  }

  const tag = toTag(selectedPkg, targetVersion)

  if (targetVersion.includes('beta') && !args.tag) {
    args.tag = 'beta'
  }
  if (targetVersion.includes('alpha') && !args.tag) {
    args.tag = 'alpha'
  }

  if (!ignoreReleaseConfirm) {
    const { yes }: { yes: boolean } = await prompts({
      type: 'confirm',
      name: 'yes',
      message: `Releasing ${colors.yellow(tag)} Confirm?`,
    })

    if (!yes) return
  }

  step('\nUpdating package version...')
  updateVersion(pkgPath, targetVersion)
  await generateChangelog(selectedPkg, targetVersion)

  const { stdout } = await run('git', ['diff'], { stdio: 'pipe' })
  if (stdout) {
    step('\nCommitting changes...')
    await runIfNotDry('git', ['add', '-A'])
    await runIfNotDry('git', ['commit', '-m', `release: ${tag}`])
    await runIfNotDry('git', ['tag', '-a', '-m', tag, tag])
  } else {
    console.log('No changes to commit.')
    return
  }

  step('\nPushing to GitHub...')
  await runIfNotDry('git', ['push', 'origin', `refs/tags/${tag}`])
  await runIfNotDry('git', ['push'])

  if (isDryRun) {
    console.log(`\nDry run finished - run git diff to see package changes.`)
  } else {
    console.log(
      colors.green(
        `
Pushed, publishing should starts shortly on CI.
https://github.com/vfiee/${repo}/actions/workflows/publish.yml`,
      ),
    )
  }

  console.log()
}
