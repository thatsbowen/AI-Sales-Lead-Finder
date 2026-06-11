/* ========== 模型预设数据 ========== */
const MODEL_PRESETS = {
  deepseek: {
    name: 'DeepSeek',
    baseUrl: 'https://api.deepseek.com/v1',
    model: 'deepseek-chat',
    rechargeUrl: 'https://platform.deepseek.com'
  },
  minimax: {
    name: 'MiniMax',
    baseUrl: 'https://api.minimax.chat/v1',
    model: 'abab6.5s-chat',
    rechargeUrl: 'https://platform.minimax.chat'
  },
  kimi: {
    name: 'Kimi',
    baseUrl: 'https://api.moonshot.cn/v1',
    model: 'moonshot-v1-8k',
    rechargeUrl: 'https://platform.moonshot.cn'
  },
  qwen: {
    name: 'Qwen',
    baseUrl: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
    model: 'qwen-plus',
    rechargeUrl: 'https://dashscope.console.aliyun.com'
  }
};

/* ========== 状态管理 ========== */
const state = {
  currentPage: 'config',
  selectedModel: 'deepseek',
  connectionTested: false,
  apiKey: '',
  baseUrl: '',
  modelName: '',
  productName: '',
  features: '',
  scenarios: '',
  market: '',
  leads: [],
  searchElapsed: '0',
  searchTime: '',
  donationSkipped: false
};

/* ========== 页面切换 ========== */
function showPage(pageName) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const target = document.getElementById('page-' + pageName);
  if (target) target.classList.add('active');
  state.currentPage = pageName;
}

/* ========== DOM 元素引用 ========== */
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

// 页面1元素
const tabBtns = $$('.tab-btn');
const apiKeyInput = $('#api-key');
const baseUrlInput = $('#base-url');
const modelNameInput = $('#model-name');
const btnTest = $('#btn-test');
const testResult = $('#test-result');
const btnConfirmConfig = $('#btn-confirm-config');
const togglePwd = $('#toggle-pwd');

// 页面2元素
const currentModelBadge = $('#current-model');
const productNameInput = $('#product-name');
const featuresInput = $('#product-features');
const scenariosInput = $('#product-scenarios');
const marketInput = $('#product-market');
const searchPreview = $('#search-preview');
const btnSearch = $('#btn-search');

// 页面3元素
const reportMeta = $('#report-meta');
const loadingSection = $('#loading-section');
const resultSection = $('#result-section');
const emptyState = $('#empty-state');
const leadsTbody = $('#leads-tbody');
const reportActions = $('#report-actions');
const loadingHint = $('#loading-hint');

/* ========== 初始化 ========== */
function init() {
  // 默认选中 deepseek
  selectModel('deepseek');

  // 尝试从 localStorage 恢复
  loadLocalState();

  // 如果之前已配置过且测试通过，跳到页面2
  if (state.connectionTested && state.apiKey) {
    updateModelBadge();
    showPage('product');
    loadProductFields();
  }

  // 绑定事件
  bindEvents();
}

function loadLocalState() {
  try {
    const saved = localStorage.getItem('ai-sales-lead-finder');
    if (saved) {
      const data = JSON.parse(saved);
      if (data.selectedModel) state.selectedModel = data.selectedModel;
      if (data.apiKey) state.apiKey = data.apiKey;
      if (data.baseUrl) state.baseUrl = data.baseUrl;
      if (data.modelName) state.modelName = data.modelName;
      if (data.productName) state.productName = data.productName;
      if (data.features) state.features = data.features;
      if (data.scenarios) state.scenarios = data.scenarios;
      if (data.market) state.market = data.market;
      if (data.connectionTested !== undefined) state.connectionTested = data.connectionTested;
      if (data.lastReport) {
        state.leads = data.lastReport.leads || [];
        state.searchElapsed = data.lastReport.elapsed || '0';
        state.searchTime = data.lastReport.searchTime || '';
      }

      // 恢复表单
      apiKeyInput.value = state.apiKey;
      baseUrlInput.value = state.baseUrl;
      modelNameInput.value = state.modelName;
      productNameInput.value = state.productName;
      featuresInput.value = state.features;
      scenariosInput.value = state.scenarios;
      marketInput.value = state.market;

      // 选中对应选项卡
      if (data.selectedModel) {
        selectModel(data.selectedModel);
      }

      // 更新按钮状态
      if (state.connectionTested) {
        btnConfirmConfig.disabled = false;
      }
    }
  } catch (e) {
    // ignore
  }
}

function saveLocalState() {
  const data = {
    selectedModel: state.selectedModel,
    apiKey: state.apiKey,
    baseUrl: state.baseUrl,
    modelName: state.modelName,
    connectionTested: state.connectionTested,
    productName: state.productName,
    features: state.features,
    scenarios: state.scenarios,
    market: state.market,
    lastReport: {
      leads: state.leads,
      elapsed: state.searchElapsed,
      searchTime: state.searchTime
    }
  };
  localStorage.setItem('ai-sales-lead-finder', JSON.stringify(data));
}

function updateModelBadge() {
  const preset = MODEL_PRESETS[state.selectedModel];
  currentModelBadge.textContent = `当前模型：${preset.name} / ${state.modelName}`;
}

function loadProductFields() {
  productNameInput.value = state.productName;
  featuresInput.value = state.features;
  scenariosInput.value = state.scenarios;
  marketInput.value = state.market;
  updateSearchPreview();
}

/* ========== 模型选择 ========== */
function selectModel(modelKey) {
  state.selectedModel = modelKey;
  const preset = MODEL_PRESETS[modelKey];

  // 更新选项卡
  tabBtns.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.model === modelKey);
  });

  // 更新输入框
  baseUrlInput.value = preset.baseUrl;
  modelNameInput.value = preset.model;

  // 重置测试状态
  state.connectionTested = false;
  btnConfirmConfig.disabled = true;
  testResult.style.display = 'none';

  saveLocalState();
}

/* ========== 密码显示切换 ========== */
togglePwd.addEventListener('click', () => {
  const input = apiKeyInput;
  if (input.type === 'password') {
    input.type = 'text';
    togglePwd.textContent = '🙈';
  } else {
    input.type = 'password';
    togglePwd.textContent = '👁';
  }
});

/* ========== 测试连接 ========== */
async function testConnection() {
  const apiKey = apiKeyInput.value.trim();
  const baseUrl = baseUrlInput.value.trim();
  const modelName = modelNameInput.value.trim();

  if (!apiKey) {
    showTestResult(false, '请输入 API Key');
    return;
  }
  if (!baseUrl) {
    showTestResult(false, '请输入 Base URL');
    return;
  }

  testResult.style.display = 'none';
  btnTest.textContent = '测试中...';
  btnTest.disabled = true;

  try {
    const result = await window.api.invoke('test-connection', { apiKey, baseUrl, modelName });
    if (result.success) {
      showTestResult(true, '连接成功！API Key 有效');
      state.apiKey = apiKey;
      state.baseUrl = baseUrl;
      state.modelName = modelName;
      state.connectionTested = true;
      btnConfirmConfig.disabled = false;
      saveLocalState();
    } else {
      showTestResult(false, `连接失败：${result.error}`);
      state.connectionTested = false;
      btnConfirmConfig.disabled = true;
    }
  } catch (err) {
    showTestResult(false, `连接失败：${err.message}`);
    state.connectionTested = false;
    btnConfirmConfig.disabled = true;
  } finally {
    btnTest.textContent = '测试连接';
    btnTest.disabled = false;
  }
}

function showTestResult(success, message) {
  testResult.className = 'test-result ' + (success ? 'success' : 'error');
  testResult.textContent = message;
  testResult.style.display = 'block';
}

/* ========== 搜索关键词预览 ========== */
function updateSearchPreview() {
  const name = productNameInput.value.trim();
  const features = featuresInput.value.trim();
  const scenarios = scenariosInput.value.trim();

  if (!name && !features && !scenarios) {
    searchPreview.innerHTML = '<p class="preview-placeholder">输入产品信息后，此处将显示搜索关键词预览...</p>';
    return;
  }

  const keywords = [];
  if (name) keywords.push(`<span class="preview-highlight">${escapeHtml(name)}</span>`);
  if (features) {
    const kw = extractKeywords(features);
    if (kw) keywords.push(`<span class="preview-highlight">${escapeHtml(kw)}</span>`);
  }
  if (scenarios) {
    const kw = extractKeywords(scenarios);
    if (kw) keywords.push(`<span class="preview-highlight">${escapeHtml(kw)}</span>`);
  }

  const prefix = '将用以下关键词搜索：';
  const suffix = ' <strong>采购商 联系方式</strong>';
  searchPreview.innerHTML = `<p>${prefix}${keywords.join(' ')}${suffix}</p>`;
}

function extractKeywords(text) {
  // 简单提取前几个关键词
  const words = text.replace(/[，,、\s]+/g, ' ').split(' ').filter(w => w.length > 0);
  return words.slice(0, 3).join(' ');
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/* ========== 搜索线索 ========== */
async function searchLeads() {
  const productName = productNameInput.value.trim();
  const features = featuresInput.value.trim();
  const scenarios = scenariosInput.value.trim();
  const market = marketInput.value.trim();

  if (!productName) {
    alert('请输入产品名称');
    return;
  }

  // 保存产品信息
  state.productName = productName;
  state.features = features;
  state.scenarios = scenarios;
  state.market = market;
  saveLocalState();

  // 切换到报告页
  showPage('report');
  updateModelBadge();

  // 重置报告页
  reportMeta.textContent = '';
  loadingSection.style.display = 'block';
  resultSection.style.display = 'none';
  reportActions.style.display = 'none';
  emptyState.style.display = 'none';
  leadsTbody.innerHTML = '';

  // 模拟进度提示
  const hints = [
    '正在分析产品信息...',
    '正在全网搜索潜在采购商...',
    '正在筛选外贸采购线索...',
    '正在整理联系人信息...'
  ];
  let hintIndex = 0;
  const hintInterval = setInterval(() => {
    hintIndex = (hintIndex + 1) % hints.length;
    loadingHint.textContent = hints[hintIndex];
  }, 2500);

  const startTime = Date.now();
  try {
    const result = await window.api.invoke('search-leads', {
      apiKey: state.apiKey,
      baseUrl: state.baseUrl,
      modelName: state.modelName,
      productName,
      features,
      scenarios,
      market
    });

    clearInterval(hintInterval);

    if (result.success) {
      state.leads = result.leads || [];
      state.searchElapsed = result.elapsed || ((Date.now() - startTime) / 1000).toFixed(1);
      state.searchTime = result.searchTime || new Date().toISOString();
      saveLocalState();
      renderReport();
    } else {
      state.leads = [];
      state.searchElapsed = result.elapsed || '0';
      state.searchTime = result.searchTime || new Date().toISOString();
      saveLocalState();
      alert('搜索失败：' + (result.error || '未知错误'));
      renderReport();
    }
  } catch (err) {
    clearInterval(hintInterval);
    state.leads = [];
    state.searchElapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    state.searchTime = new Date().toISOString();
    saveLocalState();
    alert('搜索出错：' + err.message);
    renderReport();
  }
}

/* ========== 渲染报告 ========== */
function renderReport() {
  loadingSection.style.display = 'none';
  resultSection.style.display = 'block';
  reportActions.style.display = 'flex';

  // 更新元信息
  const count = state.leads.length;
  const timeStr = state.searchTime
    ? new Date(state.searchTime).toLocaleString('zh-CN')
    : new Date().toLocaleString('zh-CN');
  reportMeta.innerHTML = `
    <span>共找到 <strong>${count}</strong> 条线索</span>
    <span>搜索耗时 <strong>${state.searchElapsed}</strong> 秒</span>
    <span>搜索时间 ${timeStr}</span>
  `;

  // 渲染表格
  leadsTbody.innerHTML = '';
  if (count > 0) {
    state.leads.forEach(lead => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${escapeHtml(lead.contact_name || '-')}</td>
        <td>${escapeHtml(lead.contact_phone || '-')}</td>
        <td>${escapeHtml(lead.contact_email || '-')}</td>
        <td>${escapeHtml(lead.contact_demand || '-')}</td>
        <td>${escapeHtml(lead.contact_country || '-')}</td>
      `;
      leadsTbody.appendChild(tr);
    });
    emptyState.style.display = 'none';
  } else {
    emptyState.style.display = 'block';
  }
}

/* ========== 导出 Excel (CSV) ========== */
async function exportExcel() {
  if (state.leads.length === 0) {
    alert('没有数据可导出');
    return;
  }

  const dateStr = new Date().toISOString().slice(0, 10);
  const filename = `销售线索报告_${dateStr}.csv`;

  try {
    const result = await window.api.invoke('export-excel', {
      leads: state.leads,
      filename: filename
    });
    if (result.success) {
      alert('导出成功！文件已保存到：' + result.path);
    } else {
      alert('导出失败：' + result.error);
    }
  } catch (err) {
    // 降级：客户端 CSV 生成 + 下载
    const BOM = '\uFEFF';
    const headers = ['联系人名称', '联系人电话', '联系人邮箱', '联系人诉求', '联系人国家'];
    let csv = BOM + headers.join(',') + '\n';
    state.leads.forEach(row => {
      const values = [
        (row.contact_name || '').replace(/"/g, '""'),
        (row.contact_phone || '').replace(/"/g, '""'),
        (row.contact_email || '').replace(/"/g, '""'),
        (row.contact_demand || '').replace(/"/g, '""'),
        (row.contact_country || '').replace(/"/g, '""')
      ];
      csv += '"' + values.join('","') + '"\n';
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }
}

/* ========== 导出 PDF ========== */
async function exportPDF() {
  if (state.leads.length === 0) {
    alert('没有数据可导出');
    return;
  }

  const dateStr = new Date().toISOString().slice(0, 10);
  const filename = `销售线索报告_${dateStr}.pdf`;

  try {
    const result = await window.api.invoke('export-pdf', {
      leads: state.leads,
      filename: filename
    });
    if (result.success) {
      // 用浏览器打印 HTML
      window.open('file://' + result.path);
    } else {
      // 降级：直接调用打印
      window.print();
    }
  } catch (err) {
    window.print();
  }
}

/* ========== 事件绑定 ========== */
function bindEvents() {
  // 模型选项卡点击
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const modelKey = btn.dataset.model;
      if (modelKey && MODEL_PRESETS[modelKey]) {
        selectModel(modelKey);
      }
    });
  });

  // 测试连接
  btnTest.addEventListener('click', testConnection);

  // 确认并继续 → 跳转打赏页
  btnConfirmConfig.addEventListener('click', () => {
    if (!state.connectionTested) return;
    state.apiKey = apiKeyInput.value.trim();
    state.baseUrl = baseUrlInput.value.trim();
    state.modelName = modelNameInput.value.trim();
    saveLocalState();
    showPage('donation');
  });

  // 跳过打赏 → 进入产品页
  $('#btn-skip-donation').addEventListener('click', () => {
    state.donationSkipped = true;
    saveLocalState();
    updateModelBadge();
    showPage('product');
    loadProductFields();
  });

  // 进入主界面 → 进入产品页
  $('#btn-proceed-after-donation').addEventListener('click', () => {
    state.donationSkipped = false;
    saveLocalState();
    updateModelBadge();
    showPage('product');
    loadProductFields();
  });

  // 产品输入实时预览
  [productNameInput, featuresInput, scenariosInput].forEach(el => {
    el.addEventListener('input', updateSearchPreview);
  });

  // 寻找销售线索
  btnSearch.addEventListener('click', searchLeads);

  // 导出
  $('#btn-export-excel').addEventListener('click', exportExcel);
  $('#btn-export-pdf').addEventListener('click', exportPDF);

  // 重新搜索
  $('#btn-research').addEventListener('click', () => {
    showPage('product');
  });

  // 返回修改模型配置
  $('#link-back-config').addEventListener('click', () => {
    showPage('config');
    apiKeyInput.value = state.apiKey;
    baseUrlInput.value = state.baseUrl;
    modelNameInput.value = state.modelName;
    selectModel(state.selectedModel);
    if (state.connectionTested) {
      btnConfirmConfig.disabled = false;
    }
  });

  // 修改产品信息
  $('#link-back-product').addEventListener('click', () => {
    showPage('product');
    loadProductFields();
  });
}

/* ========== 启动 ========== */
document.addEventListener('DOMContentLoaded', init);
