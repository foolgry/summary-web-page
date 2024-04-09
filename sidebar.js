

// 从背景页获取当前标签页的URL
chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    console.log(tabs)
    const url = tabs[0].url;
    const content = document.getElementById('content')
    content.textContent = 'url: ' + url;
    document.getElementById('content').textContent = '正在获取总结，请稍候...';
    if (!url) {
        alert('url is undefine')
        return;
    }

    chrome.storage.sync.get(['baseurl', 'apikey'], function (items) {
        fetchSummary(url, items.baseurl, items.apikey);
    });
});


async function fetchSummary(url, baseurl, apikey) {

    // if baseurl endwith v1/ add chat/completions
    if (baseurl.endsWith('v1/')) {
        baseurl += 'chat/completions';
    } else if (baseurl.endsWith('v1')) {
        baseurl += '/chat/completions';
    } else if (baseurl.endsWith('v1/chat')) {
        baseurl += '/completions';
    } else if (baseurl.endsWith('v1/chat/')) {
        baseurl += 'completions';
    }

    const content = document.getElementById('content')
    const md = window.markdownit();

    try {
        const response = await fetch(baseurl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apikey}`
            },
            body: JSON.stringify({
                messages: [
                    { "role": "user", "content": `总结下这篇文章的要点：${url}` }
                ],
                stream: true
            })
        });

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        // 读取数据流
        let rspText = '';
        let markdownHtml = '';
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            // 将流中的数据块转换为文本
            const chunk = decoder.decode(value, { stream: true });
            // sub str the start str "data:""
            try {
                const temp = JSON.parse(chunk.substring(5)).choices[0].delta.content
                rspText += temp;
                console.log('temp:', temp, 111)
                if (temp.indexOf('\n') !== -1) {
                    markdownHtml = md.render(rspText);
                } else {
                    markdownHtml += temp;
                }
                content.innerHTML = markdownHtml;

            } catch (e) {
                console.log('error:', e)
            }

        }

        markdownHtml = md.render(rspText);
        content.innerHTML = markdownHtml;


    } catch (error) {
        console.error('Error:', error);
        document.getElementById('content').textContent = '发生错误，无法获取总结。';
    }
}

