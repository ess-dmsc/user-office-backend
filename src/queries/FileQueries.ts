import { IFileDataSource } from '../datasources/IFileDataSource';
import { UserAuthorization } from '../utils/UserAuthorization';

export default class FileQueries {
  constructor(
    private fileDataSource: IFileDataSource,
    private userAuth: UserAuthorization
  ) {}

  async getFileMetadata(fileIds: string[]) {
    // TODO There should be authentification

    return this.fileDataSource.getMetadata(fileIds);
  }
}
