/**
 * 默认配置
 */
import { ParserConfig } from '../../types/config'
import * as path from 'path'
import * as document from '../utils/fake-document'

export default <ParserConfig>{
    alias: {},
    resolveModule: {
        'prop-types': path.join(__dirname, '../utils/propTypes')
    },
    globalObject: {
        document
    }
}