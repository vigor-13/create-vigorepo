import * as Commander from 'commander';
import * as packageJson from '../../package.json';
import { CreateAction } from '../actions';
import { type CreateActionOptions } from '../actions/create/create.type';

export class CommandLoader {
  private readonly _program: Commander.Command;
  private readonly _pkgJson: any;

  constructor() {
    this._program = new Commander.Command();
    this._pkgJson = packageJson;
  }

  private readonly _buildDefaultAction = (): void => {
    const { name, version, description } = this._pkgJson;
    this._program.name(name).description(description).version(version);

    this._program
      .argument('[project-directory]', 'set project directory')
      .option(
        '-t, --template [name]',
        'An template to bootstrap the app with.',
        'polyrepo',
      )
      .action(
        async (directory: string | undefined, options: Commander.Command) => {
          const createAction = new CreateAction(
            directory,
            options as CreateActionOptions,
          );
          await createAction.handle();
        },
      );
  };

  private readonly _build = (): void => {
    this._buildDefaultAction();
  };

  private readonly _parse = (): void => {
    this._program
      .parseAsync()
      .then((res) => {})
      .catch((reason) => {
        console.log(reason);
      });
  };

  public init = (): void => {
    this._build();
    this._parse();
  };
}
