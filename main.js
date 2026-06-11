const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const https = require('https');
const http = require('http');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    title: 'AI帮找产品销售线索',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  mainWindow.loadFile(path.join(__dirname, 'renderer', 'index.html'));
  mainWindow.setTitle('AI帮找产品销售线索');

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// 配置文件路径
const configPath = path.join(app.getPath('userData'), 'config.json');

// 保存配置
ipcMain.handle('save-config', async (event, config) => {
  try {
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf-8');
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

// 加载配置
ipcMain.handle('load-config', async () => {
  try {
    if (fs.existsSync(configPath)) {
      const data = fs.readFileSync(configPath, 'utf-8');
      return { success: true, config: JSON.parse(data) };
    }
    return { success: false, error: '配置文件不存在' };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

// 通用 HTTP/HTTPS 请求辅助
function makeRequest(url, options, body) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const isHttps = parsed.protocol === 'https:';
    const mod = isHttps ? https : http;

    const reqOptions = {
      hostname: parsed.hostname,
      port: parsed.port || (isHttps ? 443 : 80),
      path: parsed.pathname + parsed.search,
      method: options.method || 'GET',
      headers: options.headers || {},
      timeout: 30000
    };

    const req = mod.request(reqOptions, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve({ status: res.statusCode, data: json });
        } catch {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });

    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('请求超时')); });

    if (body) req.write(body);
    req.end();
  });
}

// 测试 API 连接
ipcMain.handle('test-connection', async (event, { apiKey, baseUrl, modelName }) => {
  try {
    const url = baseUrl.replace(/\/+$/, '') + '/models';
    const headers = {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    };
    const result = await makeRequest(url, { method: 'GET', headers });
    if (result.status === 200) {
      return { success: true };
    }
    return { success: false, error: `HTTP ${result.status}: ${JSON.stringify(result.data).slice(0, 200)}` };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

// 大模型搜索线索
ipcMain.handle('search-leads', async (event, { apiKey, baseUrl, modelName, productName, features, scenarios, market }) => {
  try {
    const prompt = `你是一个外贸销售线索挖掘专家。请通过联网搜索，帮我找到关于以下产品的潜在采购商/买家线索：
产品名称：${productName}
技术特点：${features}
应用场景：${scenarios}
目标市场：${market || '全球'}

请以严格的 JSON 数组格式返回，每个元素包含以下字段：
contact_name（联系人名称/公司名称）, contact_phone（联系电话）, contact_email（联系邮箱）, contact_demand（采购诉求/需求描述）, contact_country（所在国家）

只返回 JSON，不要任何其他文字。如果没有找到，返回空数组 []。`;

    const url = baseUrl.replace(/\/+$/, '') + '/chat/completions';
    const headers = {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    };

    // 不同模型的请求体适配
    let body = {
      model: modelName,
      messages: [
        { role: 'system', content: '你是一个外贸销售线索挖掘助手，只返回 JSON 数组。' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.3
    };

    // DeepSeek / MiniMax / Kimi / Qwen 的联网搜索参数
    if (baseUrl.includes('deepseek')) {
      body.enable_search = true;
    } else if (baseUrl.includes('minimax')) {
      body.web_search = true;
    } else if (baseUrl.includes('moonshot')) {
      body.search = true;
    } else if (baseUrl.includes('dashscope')) {
      body.enable_search = true;
    }

    const startTime = Date.now();
    const result = await makeRequest(url, { method: 'POST', headers }, JSON.stringify(body));
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

    if (result.status === 200 && result.data && result.data.choices && result.data.choices.length > 0) {
      const content = result.data.choices[0].message.content;
      let leads = [];

      // 尝试解析 JSON
      try {
        leads = JSON.parse(content);
      } catch {
        // 尝试从文本中提取 JSON 数组
        const match = content.match(/\[[\s\S]*\]/);
        if (match) {
          try {
            leads = JSON.parse(match[0]);
          } catch {
            leads = [];
          }
        }
      }

      // 规范化字段
      leads = leads.map(item => ({
        contact_name: item.contact_name || item.name || item.company || '',
        contact_phone: item.contact_phone || item.phone || item.tel || '',
        contact_email: item.contact_email || item.email || '',
        contact_demand: item.contact_demand || item.demand || item.need || '',
        contact_country: item.contact_country || item.country || ''
      }));

      return {
        success: true,
        leads: leads,
        elapsed: elapsed,
        searchTime: new Date().toISOString()
      };
    }

    return {
      success: false,
      error: `API 返回异常 (HTTP ${result.status})`,
      elapsed: elapsed,
      searchTime: new Date().toISOString()
    };
  } catch (err) {
    return { success: false, error: err.message, elapsed: '0', searchTime: new Date().toISOString() };
  }
});

// 导出 Excel (生成 CSV 内容)
ipcMain.handle('export-excel', async (event, { leads, filename }) => {
  try {
    // BOM 头保证 Excel 正确识别中文
    const BOM = '\uFEFF';
    const headers = ['联系人名称', '联系人电话', '联系人邮箱', '联系人诉求', '联系人国家'];
    let csv = BOM + headers.join(',') + '\n';

    leads.forEach(row => {
      const values = [
        (row.contact_name || '').replace(/"/g, '""'),
        (row.contact_phone || '').replace(/"/g, '""'),
        (row.contact_email || '').replace(/"/g, '""'),
        (row.contact_demand || '').replace(/"/g, '""'),
        (row.contact_country || '').replace(/"/g, '""')
      ];
      csv += '"' + values.join('","') + '"\n';
    });

    const downloadsPath = path.join(app.getPath('downloads'), filename);
    fs.writeFileSync(downloadsPath, csv, 'utf-8');
    return { success: true, path: downloadsPath };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

// 导出 PDF (生成 HTML 文件)
ipcMain.handle('export-pdf', async (event, { leads, filename }) => {
  try {
    const headers = ['联系人名称', '联系人电话', '联系人邮箱', '联系人诉求', '联系人国家'];
    let rows = '';
    leads.forEach(row => {
      rows += `<tr>
        <td>${row.contact_name || ''}</td>
        <td>${row.contact_phone || ''}</td>
        <td>${row.contact_email || ''}</td>
        <td>${row.contact_demand || ''}</td>
        <td>${row.contact_country || ''}</td>
      </tr>`;
    });

    const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<title>销售线索报告</title>
<style>
  body { font-family: -apple-system, system-ui, sans-serif; padding: 40px; }
  h1 { color: #1a1a2e; margin-bottom: 8px; }
  .meta { color: #888; font-size: 14px; margin-bottom: 24px; }
  table { width: 100%; border-collapse: collapse; }
  th { background: #3b6df0; color: #fff; padding: 10px 12px; text-align: left; font-weight: 600; }
  td { padding: 10px 12px; border-bottom: 1px solid #e8e8e8; }
  tr:nth-child(even) td { background: #f9f9fb; }
  @media print {
    body { padding: 20px; }
    @page { size: A4 landscape; }
  }
</style>
</head>
<body>
<h1>AI帮找产品销售线索 - 销售线索报告</h1>
<div class="meta">生成时间：${new Date().toLocaleString('zh-CN')} | 共 ${leads.length} 条线索</div>
<table>
<thead><tr><th>联系人名称</th><th>联系人电话</th><th>联系人邮箱</th><th>联系人诉求</th><th>联系人国家</th></tr></thead>
<tbody>${rows}</tbody>
</table>
</body>
</html>`;

    const tempPath = path.join(app.getPath('temp'), filename.replace('.pdf', '.html'));
    fs.writeFileSync(tempPath, html, 'utf-8');
    return { success: true, path: tempPath };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
