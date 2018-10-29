import _ from 'lodash';
import * as RNFS from 'react-native-fs';
export let getFS = async (pathStack): Promise<RNFS.ReadDirItem[]> => {
    return await RNFS.readDir(_.last(pathStack));

};
