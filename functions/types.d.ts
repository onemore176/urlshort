/// <reference types="@cloudflare/workers-types" />

declare module 'md5' {
    function md5(input: string): string;
    export default md5;
} 