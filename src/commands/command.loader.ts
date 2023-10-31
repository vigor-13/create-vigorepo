import * as Commander from 'commander';
import * as packageJson from '../../package.json';
import * as actioins from '../actions';

export class CommandLoader {
  private _program: Commander.Command;
  private _pkgJson: any;
  private _actions: any;

  constructor() {
    this._program = new Commander.Command();
    this._pkgJson = packageJson;
    this._actions = actioins;
  }

  private _buildDefaultAction = () => {
    const { name, version, description } = this._pkgJson;
    this._program.name(name).description(description).version(version);

    this._program
      .argument('[project-directory]', 'set project directory')
      .action(this._actions.createAction)
      .option(
        '-t, --template [name]',
        'An template to bootstrap the app with.',
      );
  };

  private _build = () => {
    this._buildDefaultAction();
  };

  private _parse = () => {
    this._program
      .parseAsync()
      .then((res) => {})
      .catch((reason) => {
        console.log(reason);
      });
  };

  public init = () => {
    this._build();
    this._parse();
  };
}
