import { RepositoryLoader } from '../RepositoryLoader';

export interface ProjectBuilderProps {
  appPath: string;
  templateInfo: TemplateInfo;
}

export type TemplateInfo = {
  username: 'vigor-13';
  name: 'create-vigorepo';
  branch: 'main';
  template: string;
};

export class ProjectBuilder {
  private _appPath: string;
  private _templateInfo: TemplateInfo;
  private _repositoryLoader: RepositoryLoader;

  constructor(props: ProjectBuilderProps) {
    this._appPath = props.appPath;
    this._templateInfo = props.templateInfo;
    this._repositoryLoader = new RepositoryLoader(props.templateInfo);
  }

  public createProject = async () => {
    await this._repositoryLoader.loadTemplate();
    return {};
  };
}
