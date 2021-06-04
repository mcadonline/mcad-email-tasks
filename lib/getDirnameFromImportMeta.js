import { dirname } from 'path';
import { fileURLToPath } from 'url';

export default (importMeta) => dirname(fileURLToPath(importMeta.url));
