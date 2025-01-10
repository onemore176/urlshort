interface Env {
    UrlShorten: KVNamespace;
}

export async function onRequest(context: { request: Request; env: Env }) {
    const html = `<!DOCTYPE html>
    <html lang="zh-CN">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>创建短链接</title>
        <link href="/style.css" rel="stylesheet">
    </head>
    <body class="bg-gray-100 min-h-screen flex items-center justify-center">
        <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
            <h1 class="text-2xl font-bold mb-6 text-center">创建短链接</h1>
            <div class="space-y-4">
                <input type="url" id="longUrl" placeholder="请输入需要缩短的网址" 
                    class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
                <button onclick="createShortUrl()" 
                    class="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    生成短链接
                </button>
                <div id="result" class="hidden">
                    <p class="text-gray-600 mb-2">生成的短链接：</p>
                    <div class="flex">
                        <input type="text" id="shortUrl" readonly 
                            class="flex-1 px-4 py-2 border rounded-l focus:outline-none">
                        <button onclick="copyUrl()" 
                            class="bg-gray-500 text-white px-4 py-2 rounded-r hover:bg-gray-600 focus:outline-none">
                            复制
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <script>
            async function createShortUrl() {
                const longUrl = document.getElementById('longUrl').value;
                if (!longUrl) {
                    alert('请输入网址');
                    return;
                }

                try {
                    const response = await fetch('/api/shorten', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ url: longUrl })
                    });

                    const data = await response.json();
                    if (data.success) {
                        const shortUrl = window.location.origin + data.shortUrl;
                        document.getElementById('shortUrl').value = shortUrl;
                        document.getElementById('result').classList.remove('hidden');
                    } else {
                        alert('生成失败：' + data.message);
                    }
                } catch (error) {
                    alert('生成失败，请重试');
                }
            }

            function copyUrl() {
                const shortUrl = document.getElementById('shortUrl');
                shortUrl.select();
                document.execCommand('copy');
                alert('已复制到剪贴板');
            }
        </script>
    </body>
    </html>`;

    return new Response(html, {
        headers: {
            'Content-Type': 'text/html;charset=UTF-8',
        },
    });
} 