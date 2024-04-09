document.addEventListener('DOMContentLoaded', function () {
    // 加载已保存的设置
    chrome.storage.sync.get(['baseurl', 'apikey'], function(items) {
        document.getElementById('baseurl').value = items.baseurl || '';
        document.getElementById('apikey').value = items.apikey || '';
    });

    // 保存设置
    document.getElementById('settingsForm').addEventListener('submit', function(e) {
        e.preventDefault();
        var baseurl = document.getElementById('baseurl').value;
        var apikey = document.getElementById('apikey').value;

        // 检查 baseurl 是否以 http:// 或 https:// 开头
        if (!/^https?:\/\//i.test(baseurl)) {
            alert('Base URL 必须以 http:// 或 https:// 开头');
            return;
        }

        chrome.storage.sync.set({
            'baseurl': baseurl,
            'apikey': apikey
        }, function() {
            alert('设置已保存');
        });
    });
});