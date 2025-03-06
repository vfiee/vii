import type { Options as ExecaOptions, ExecaReturnBase } from 'execa'
import { execa } from 'execa'
import { readFile } from 'node:fs/promises'
import colors from 'picocolors'

export function run<EO extends ExecaOptions>(
  bin: string,
  args: string[],
  opts?: EO,
): Promise<
  EO &
    (keyof EO extends 'stdio' ? object : { stdio: 'inherit' }) &
    ExecaReturnBase<any>
> {
  return execa(bin, args, { stdio: 'inherit', ...opts }) as any
}

export async function getLatestTag(pkgName: string): Promise<string> {
  const pkgJson = JSON.parse(
    await readFile(`packages/${pkgName}/package.json`, 'utf-8'),
  )
  const version = pkgJson.version
  const isCli = pkgName === 'cli'
  return `${isCli ? '@vyron' : '@vii'}/${pkgName}@${version}`
}

export async function logRecentCommits(pkgName: string): Promise<void> {
  const tag = await getLatestTag(pkgName)
  if (!tag) return
  const sha = await run('git', ['rev-list', '-n', '1', tag], {
    stdio: 'pipe',
  }).then((res) => res.stdout.trim())
  console.log(
    colors.bold(
      `\n${colors.blue(`i`)} Commits of ${colors.green(
        pkgName,
      )} since ${colors.green(tag)} ${colors.gray(`(${sha.slice(0, 5)})`)}`,
    ),
  )
  await run(
    'git',
    [
      '--no-pager',
      'log',
      `${sha}..HEAD`,
      '--oneline',
      '--',
      `packages/${pkgName}`,
    ],
    { stdio: 'inherit' },
  )
  console.log()
}
