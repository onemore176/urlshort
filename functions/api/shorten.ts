import md5 from 'md5';

interface Env {
    UrlShorten: KVNamespace;
}

export async function onRequest(context: { request: Request; env: Env }) {
    const {
        request,
        env,
    } = context;

    // 只允许 POST 请求
    if (request.method !== 'POST') {
        return new Response('Method not allowed', { status: 405 });
    }

    // 检查 KV 存储是否可用
    if (!env.UrlShorten) {
        return new Response('Service unavailable', { status: 503 });
    }

    try {
        // 获取请求体
        const body = await request.json();
        const longUrl = body.url;

        // 验证 URL
        try {
            new URL(longUrl);
        } catch (e) {
            return new Response('Invalid URL', { status: 400 });
        }

        // 生成短链接
        const hash = md5(longUrl + Date.now()).substring(0, 6);
        const shortPath = `/${hash}`;

        // 存储到 KV
        await env.UrlShorten.put(shortPath, longUrl);

        // 返回短链接
        return new Response(JSON.stringify({
            success: true,
            shortUrl: shortPath,
            longUrl: longUrl
        }), {
            headers: {
                'Content-Type': 'application/json',
            }
        });

    } catch (error) {
        return new Response('Invalid request', { status: 400 });
    }
} 