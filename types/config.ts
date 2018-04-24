import ignore from "../src/utils/ignore";

export type CompList = Array<Object>

export interface CompConfig {
    location: string,
    cwd?: string
}

export interface CompInfo {
    ['0']: string,
    ['1']: CompConfig,
}

export interface ParserConfig {
    alias?: Object,
    globalObject?: Object,
    resolveModule?: Object,
    babelConfig?: BabelConfig
}

export interface ComponentSource {
    base?: string,
    fileExtension?: string,
    components: Array<CompInfo>,
}

export interface BabelConfig {
    plugins?: any[],
    ignore?: RegExp | string[]
}