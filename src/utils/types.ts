export type DependencyList = Record<string, string>;

export interface DependencyGroups {
  dependencies?: DependencyList;
  devDependencies?: DependencyList;
  peerDependencies?: DependencyList;
  optionalDependencies?: DependencyList;
}

export interface PackageJson extends DependencyGroups {
  private?: boolean;
  name: string;
  version: string;
  description?: string;
  author: string;
  // there can be more in here, but we only care about packages
  workspaces?: Array<string> | { packages?: Array<string> };
  main?: string;
  module?: string;
  exports?: object;
  scripts?: Record<string, string>;
  packageManager?: string;
}
