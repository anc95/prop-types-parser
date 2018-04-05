import {
    statSync,
    existsSync
} from 'fs'

export function isDirectory(d: string): boolean {
    return existsSync(d) && statSync(d).isDirectory()
}

export function isFile(d: string): boolean {
    return existsSync(d) && statSync(d).isFile()
}

export function hasExtension(f: string): boolean {
    return /\.[a-zA-Z]+$/.test(f)
}