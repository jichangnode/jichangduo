const services = [
  {id:"yuntu",name:"云图机场",rank:1,score:9.2,price:20,priceLabel:"¥20/月",line:"金融级 IEPL · 全节点 1 倍率",summary:"专线线路和统一倍率是该套餐的主要卖点。关注自选接入点、适用地区及流量计费细则。",tags:["专线","解锁"],official:"https://super.ytjcok.org/#/register?code=iV8ahCNE"},
  {id:"kunpeng",name:"鲲鹏加速",rank:2,score:9.0,price:1,priceLabel:"¥1试用 · 主套餐¥12/月",line:"VLESS 海外中转 · 全站 1 倍率",summary:"提供低门槛试用和月度套餐。试用额度、主套餐流量与续费价格需分别核对。",tags:["低价","试用","解锁"],official:"https://kunpengjiasu.com/#/register?code=GQzYysG0"},
  {id:"shunyun",name:"瞬云",rank:3,score:8.8,price:16,priceLabel:"¥16/月起",line:"IEPL 专线 · 套餐灵活",summary:"套餐选择较灵活，资料中记录了晚高峰速度和流媒体兼容信息；实际体验受网络环境影响。",tags:["专线","解锁"],speed:"700+ Mbps",official:"https://ddd.jichang.best/#/register?code=za8UKIYz"},
  {id:"jisuyun",name:"极速Cloud",rank:4,score:8.7,price:30,priceLabel:"¥30/月起",line:"CN2 GIA · AS9929 · CMIN2",summary:"线路页列出多种网络线路与地区节点。建议按所在运营商和常用时段核对体验。",tags:["专线","解锁"],speed:"900Mbps+"},
  {id:"jiuyun",name:"九云机场",rank:5,score:8.5,price:6,priceLabel:"¥6/月起",line:"VLESS 海外中转",summary:"定位为低价入门套餐。购买前确认流量额度、有效期、客户端要求和退款条件。",tags:["低价","解锁"],speed:"350Mbps+（资料记录）",official:"https://yong.jiuyyq.com"},
  {id:"huanyu",name:"寰宇云",rank:6,score:8.4,price:28,priceLabel:"¥28/月起",line:"BGP 三网 · IEPL",summary:"套餐资料包含三网与专线相关描述。建议关注套餐期限、价格变更和节点使用限制。",tags:["专线","解锁"],speed:"680–780Mbps（资料记录）",official:"https://hyy.52kok.cn/#/register?code=CPBmzXgk"},
  {id:"baoyun",name:"宝云",rank:7,score:8.0,price:4,priceLabel:"¥4/月起",line:"VLESS 海外中转",summary:"低价套餐适合先核对计费单位和流量限制。AI 与视频兼容情况应以近期测试为准。",tags:["低价","解锁"],speed:"280Mbps+（资料记录）",official:"https://888by.baoyundl.com/#/register?code=089ta958"},
  {id:"jindouyun",name:"筋斗云",rank:8,score:7.9,price:16,priceLabel:"¥16/月起",line:"IEPL / IPLC 专线 · 三网优化",summary:"线路描述涵盖专线与网络优化。具体地区、节点与设备的表现需要结合个人环境测试。",tags:["专线","解锁"],official:"https://jdy.52kok.cn/#/register?code=wUKiwosG"},
  {id:"miaomiao",name:"秒秒云",rank:9,score:7.8,price:14,priceLabel:"¥14/月起",line:"VLESS 海外中转",summary:"对比套餐时重点查看月流量、可用周期、续订方式和不同档位之间的差别。",tags:["解锁"],official:"https://m2.mouhiojl.com:8888/#/register?code=6u2dHtD4"},
  {id:"shanshui",name:"山水云",rank:10,score:7.7,price:15,priceLabel:"¥15/月起",line:"优质中转 · 灵活计费",summary:"计费方式强调灵活性。下单前查看流量扣减规则、套餐有效期与退款说明。",tags:["解锁"],official:"https://sldm1.ssyylf.com/#/register?code=4WTXbMwy"},
  {id:"andy",name:"Andy Cloud",rank:11,score:7.5,price:5,priceLabel:"¥5/月起",line:"低价入门 · 大流量套餐",summary:"页面提供多个容量档位。请比较标称流量、计费周期及套餐切换规则。",tags:["低价","解锁"],official:"https://yg.andygg.com/#/register?code=mPfoyHTr"},
  {id:"xinghua",name:"杏花云",rank:12,score:7.4,price:3,priceLabel:"¥3/月起（折算）",line:"年付优惠 · 月付可选",summary:"低价折算通常与长周期付款相关，建议先确认总价、续费价格和退款条件。",tags:["低价","解锁"],official:"https://yg.xinghuatg.com"},
  {id:"panda",name:"熊猫cloud",rank:13,score:7.3,price:7,priceLabel:"¥7/月起",line:"按需计费 · 灵活套餐",summary:"按需计费模式下，需弄清用量统计、扣费节点、余量处理和账户有效期。",tags:["低价","解锁"],official:"https://pandacloud.net"},
  {id:"jinyun",name:"锦云",rank:14,score:7.2,price:6,priceLabel:"¥6/月起",line:"小流量 · 轻度使用",summary:"轻量套餐适合先按日常用量估算需求，留意视频播放和多设备使用的流量消耗。",tags:["低价","解锁"],official:"https://jybdw1.wanhlj.com:8888/#/register?code=0xeLRRWB"}
];

function readSavedIds() {
  try {
    const value = JSON.parse(localStorage.getItem("airport-guide-saved") || "[]");
    return Array.isArray(value) ? value.filter(item => typeof item === "string") : [];
  } catch (error) {
    console.warn("Unable to read saved services from local storage.", error);
    return [];
  }
}

const state = {filter:"全部",search:"",sort:"rank",view:"all",saved:new Set(readSavedIds()),selected:new Set()};
const cards = document.querySelector("#cards");
const empty = document.querySelector("#empty");
const compareBar = document.querySelector("#compare-bar");
let toastTimer;

function createElement(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function getVisibleServices() {
  let list = [...services];
  if (state.view === "saved") list = list.filter(item => state.saved.has(item.id));
  if (state.filter !== "全部") list = list.filter(item => item.tags.includes(state.filter));
  if (state.search) {
    const query = state.search.toLocaleLowerCase();
    list = list.filter(item => `${item.name} ${item.line} ${item.summary} ${item.tags.join(" ")} ${item.priceLabel}`.toLocaleLowerCase().includes(query));
  }
  if (state.sort === "price") list.sort((a, b) => a.price - b.price);
  if (state.sort === "score") list.sort((a, b) => b.score - a.score);
  if (state.sort === "name") list.sort((a, b) => a.name.localeCompare(b.name, "zh-CN"));
  if (state.sort === "rank") list.sort((a, b) => a.rank - b.rank);
  return list;
}

function addActionButton(container, label, action, item, extraClass = "") {
  const button = createElement("button", `catalog-action ${extraClass}`.trim(), label);
  button.type = "button";
  button.dataset.action = action;
  button.dataset.id = item.id;
  container.append(button);
  return button;
}

function renderCard(item) {
  const article = createElement("article", "catalog-card");
  const top = createElement("div", "catalog-card-top");
  top.append(createElement("span", "catalog-rank", String(item.rank).padStart(2, "0")));
  const title = createElement("div", "catalog-title");
  title.append(createElement("h3", "", item.name), createElement("span", "catalog-subtitle", `资料序号 #${item.rank}`));
  top.append(title, createElement("span", "catalog-score", `${item.score.toFixed(1)} / 10`));
  article.append(top, createElement("span", "catalog-snapshot", "公开资料快照 · 2026-10"));
  article.append(createElement("p", "catalog-description", item.summary));

  const specs = createElement("dl", "catalog-specs");
  [["记录起步价", item.priceLabel], ["线路描述", item.line], ["场景标签", item.tags.join(" · ")]].forEach(([label, value]) => {
    const spec = createElement("div", "catalog-spec");
    spec.append(createElement("dt", "", label), createElement("dd", "", value));
    specs.append(spec);
  });
  article.append(specs);

  const actions = createElement("div", "catalog-card-actions");
  addActionButton(actions, state.selected.has(item.id) ? "✓ 已加入" : "+ 对比", "select", item, state.selected.has(item.id) ? "selected" : "");
  addActionButton(actions, "详情", "detail", item);
  if (item.official) {
    const link = createElement("a", "catalog-action", "前往服务商 ↗");
    link.href = item.official;
    link.target = "_blank";
    link.rel = "sponsored noreferrer";
    actions.append(link);
  } else {
    const pending = createElement("span", "catalog-action disabled", "官网待核实");
    pending.setAttribute("aria-disabled", "true");
    actions.append(pending);
  }
  const isSaved = state.saved.has(item.id);
  const favorite = addActionButton(actions, isSaved ? "♥" : "♡", "save", item, isSaved ? "favorite saved" : "favorite");
  favorite.setAttribute("aria-label", isSaved ? "取消收藏" : "收藏");
  favorite.title = isSaved ? "取消收藏" : "收藏";
  article.append(actions);
  return article;
}

function render() {
  const visible = getVisibleServices();
  cards.replaceChildren(...visible.map(renderCard));
  empty.hidden = visible.length > 0;
  document.querySelector("#result-count").textContent = String(visible.length).padStart(2, "0");
  document.querySelector("#saved-count").textContent = String(state.saved.size);
  document.querySelector("#list-heading").textContent = state.view === "saved" ? "我的收藏" : "全部条目";
  document.querySelector("#saved-view").classList.toggle("active", state.view === "saved");
  document.querySelector("#saved-view").setAttribute("aria-pressed", String(state.view === "saved"));
  document.querySelector("#list-note").textContent = state.view === "saved" ? "仅保存在此设备" : "公开资料快照 · 2026-10";
  document.querySelectorAll("[data-filter]").forEach(button => button.classList.toggle("active", button.dataset.filter === state.filter));
  compareBar.hidden = state.selected.size === 0;
  document.querySelector("#compare-count").textContent = `已选 ${state.selected.size} 项`;
}

function toast(message) {
  const node = document.querySelector("#toast");
  node.textContent = message;
  node.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { node.hidden = true; }, 2400);
}

function showDetails(item) {
  if (!item) return;
  document.querySelector("#detail-title").textContent = item.name;
  const content = document.querySelector("#detail-content");
  content.replaceChildren();
  const notice = createElement("div", "dialog-notice", "资料快照日期：2026-10。价格、优惠和服务状态可能变化，购买前请核对服务商当前套餐与条款。");
  const grid = createElement("dl", "catalog-detail-grid");
  [["资料名次", `#${item.rank}`], ["参考评分", `${item.score.toFixed(1)} / 10`], ["记录起步价", item.priceLabel], ["线路描述", item.line], ["场景标签", item.tags.join("、")], ["速度记录", item.speed || "暂无单独记录"]].forEach(([label, value]) => {
    const row = createElement("div", "catalog-detail-item");
    row.append(createElement("dt", "", label), createElement("dd", "", value));
    grid.append(row);
  });
  content.append(notice, grid, createElement("p", "catalog-detail-copy", `${item.summary} 价格、评分和线路信息是整理快照，并非本站独立实测；网络表现会因测试环境不同而变化。`));
  if (item.official) {
    const link = createElement("a", "catalog-action", "前往服务商 ↗");
    link.href = item.official;
    link.target = "_blank";
    link.rel = "sponsored noreferrer";
    content.append(link);
  }
  document.querySelector("#detail-dialog").showModal();
}

function showCompare() {
  const chosen = services.filter(item => state.selected.has(item.id));
  if (!chosen.length) {
    toast("请先选择要比较的机场");
    return;
  }
  const content = document.querySelector("#compare-content");
  content.replaceChildren();
  content.append(createElement("div", "dialog-notice", "以下为公开资料快照整理，不代表本站独立测试；购买前请以服务商当前公示为准。"));
  const wrap = createElement("div", "data-table-wrap");
  const table = createElement("table", "data-table");
  const head = document.createElement("thead");
  const headerRow = document.createElement("tr");
  headerRow.append(createElement("th", "", "比较项"));
  chosen.forEach(item => headerRow.append(createElement("th", "", item.name)));
  head.append(headerRow);
  const body = document.createElement("tbody");
  const rows = [
    ["资料名次", item => `#${item.rank}`],
    ["参考评分", item => `${item.score.toFixed(1)} / 10`],
    ["记录起步价", item => item.priceLabel],
    ["线路描述", item => item.line],
    ["场景标签", item => item.tags.join("、")],
    ["速度记录", item => item.speed || "暂无单独记录"]
  ];
  rows.forEach(([label, value]) => {
    const row = document.createElement("tr");
    row.append(createElement("th", "", label));
    chosen.forEach(item => row.append(createElement("td", "", value(item))));
    body.append(row);
  });
  table.append(head, body);
  wrap.append(table);
  content.append(wrap);
  document.querySelector("#compare-dialog").showModal();
}

cards.addEventListener("click", event => {
  const button = event.target.closest("[data-action]");
  if (!button) return;
  const item = services.find(service => service.id === button.dataset.id);
  if (!item) return;
  if (button.dataset.action === "detail") {
    showDetails(item);
  } else if (button.dataset.action === "select") {
    if (state.selected.has(item.id)) state.selected.delete(item.id);
    else if (state.selected.size < 3) state.selected.add(item.id);
    else {
      toast("最多选择 3 项进行比较");
      return;
    }
    render();
  } else if (button.dataset.action === "save") {
    if (state.saved.has(item.id)) state.saved.delete(item.id);
    else state.saved.add(item.id);
    try {
      localStorage.setItem("airport-guide-saved", JSON.stringify([...state.saved]));
    } catch (error) {
      console.error("Unable to save favorites to local storage.", error);
      toast("收藏未能保存到此设备");
    }
    render();
  }
});

document.querySelectorAll("[data-filter]").forEach(button => button.addEventListener("click", () => {
  state.filter = button.dataset.filter;
  state.view = "all";
  render();
}));

document.querySelector("#search-input").addEventListener("input", event => {
  state.search = event.target.value.trim();
  render();
});
document.querySelector("#sort-select").addEventListener("change", event => {
  state.sort = event.target.value;
  render();
});
document.querySelector("#saved-view").addEventListener("click", () => {
  state.view = state.view === "saved" ? "all" : "saved";
  state.filter = "全部";
  render();
});
document.querySelector("#reset").addEventListener("click", () => {
  state.filter = "全部";
  state.search = "";
  state.view = "all";
  document.querySelector("#search-input").value = "";
  render();
});
document.querySelector("#open-compare").addEventListener("click", showCompare);
document.querySelector("#clear-compare").addEventListener("click", () => {
  state.selected.clear();
  render();
});
document.querySelectorAll("[data-close]").forEach(button => button.addEventListener("click", () => button.closest("dialog").close()));
document.querySelectorAll("dialog").forEach(dialog => dialog.addEventListener("click", event => {
  if (event.target === dialog) dialog.close();
}));
document.addEventListener("keydown", event => {
  if (event.key === "/" && !["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement.tagName)) {
    event.preventDefault();
    document.querySelector("#search-input").focus();
  }
});
render();
