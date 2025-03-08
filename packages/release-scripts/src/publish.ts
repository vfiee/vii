import semver from 'semver'
import {
  args,
  getActiveVersion,
  getPackageInfo,
  publishPackage,
  step,
} from './shared'

export declare interface PublishOptions {
  defaultPackage: string
  getPkgDir?: (pkg: string) => string
  provenance?: boolean
  packageManager?: 'npm' | 'pnpm'
}

export const publish = async (options: PublishOptions): Promise<void> => {
  const { defaultPackage, getPkgDir, provenance, packageManager } = options
  const tag = args._[0]
  if (!tag) throw new Error('No tag specified')

  let pkgName = defaultPackage
  let version

  if (tag.includes('@')) [pkgName, version] = tag.split('@')
  else version = tag

  if (version.startsWith('v')) version = version.slice(1)

  const { pkg, pkgDir } = getPackageInfo(pkgName, getPkgDir)
  if (pkg.version !== version)
    throw new Error(
      `Package version from tag "${version}" mismatches with current version "${pkg.version}"`,
    )

  const activeVersion = await getActiveVersion(pkg.name)

  step('Publishing package...')
  const releaseTag = version.includes('beta')
    ? 'beta'
    : version.includes('alpha')
      ? 'alpha'
      : activeVersion && semver.lt(pkg.version, activeVersion)
        ? 'previous'
        : undefined
  await publishPackage(pkgDir, releaseTag, provenance, packageManager)
}
