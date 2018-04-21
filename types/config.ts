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
    validComponents?: Object,
    resolveModule?: Object
}

export interface ComponentSource {
    base?: string,
    fileExtension?: string,
    components: Array<CompInfo>,
}