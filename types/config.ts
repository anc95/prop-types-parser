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
    base?: string,
    fileExtension?: string,
    components: Array<CompInfo>,
    alias? : Object,
    validComponents?: Object
}