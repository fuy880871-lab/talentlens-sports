"use client";

import { useMemo, useState } from "react";

type View = "overview" | "talent" | "parser" | "salary" | "planner" | "advisor";

const navItems: Array<{ id: View; label: string; short: string; description: string }> = [
  { id: "overview", label: "经营总览", short: "01", description: "人才投资驾驶舱" },
  { id: "talent", label: "人才地图", short: "02", description: "城市与技能供需" },
  { id: "parser", label: "AI 岗位解析", short: "03", description: "JD 结构化诊断" },
  { id: "salary", label: "薪酬洞察", short: "04", description: "市场定位与公平性" },
  { id: "planner", label: "编制模拟", short: "05", description: "预算与团队配置" },
  { id: "advisor", label: "AI 决策助手", short: "06", description: "管理建议生成" },
];

const demandData = [
  { label: "赛事与内容运营", value: 88, jobs: 21, delta: "+18%" },
  { label: "数字产品与数据", value: 76, jobs: 17, delta: "+31%" },
  { label: "运动科学与教练", value: 61, jobs: 13, delta: "+12%" },
  { label: "商业拓展", value: 52, jobs: 11, delta: "+9%" },
  { label: "组织与共享服务", value: 31, jobs: 6, delta: "-4%" },
];

const cities = [
  { city: "上海", index: 86, supply: "充足", median: "24.8k", lead: "3.2月", note: "品牌、商业与赛事人才密集", accent: "lime" },
  { city: "北京", index: 79, supply: "紧平衡", median: "26.2k", lead: "3.8月", note: "内容、媒体与高阶产品突出", accent: "blue" },
  { city: "深圳", index: 71, supply: "偏紧", median: "23.6k", lead: "4.1月", note: "智能硬件与增长人才占优", accent: "orange" },
  { city: "成都", index: 68, supply: "充足", median: "18.4k", lead: "2.7月", note: "交付、社区与内容性价比高", accent: "violet" },
];

const talentRows = [
  { role: "体育数字产品经理", demand: "高", supply: "偏紧", median: "28.4k", lead: "4.2月", strategy: "外部招聘" },
  { role: "运动数据分析师", demand: "高", supply: "偏紧", median: "25.6k", lead: "4.6月", strategy: "校招 + 培养" },
  { role: "赛事内容运营", demand: "高", supply: "充足", median: "18.8k", lead: "2.5月", strategy: "区域招聘" },
  { role: "运动科学顾问", demand: "中", supply: "稀缺", median: "22.7k", lead: "5.1月", strategy: "专家合作" },
  { role: "品牌商务经理", demand: "中", supply: "紧平衡", median: "26.9k", lead: "3.4月", strategy: "重点保留" },
];

const skillHeatmap = [
  { skill: "用户洞察", values: [5, 3, 2, 4, 3] },
  { skill: "数据分析", values: [4, 5, 4, 2, 3] },
  { skill: "赛事运营", values: [2, 1, 2, 5, 3] },
  { skill: "运动科学", values: [1, 3, 5, 2, 1] },
  { skill: "商业建模", values: [4, 3, 2, 3, 5] },
  { skill: "AI 工具应用", values: [4, 5, 4, 3, 3] },
];

const salaryRows = [
  { role: "数字产品负责人", p25: 27, p50: 34, p75: 42, variable: "22%", internal: 1.06 },
  { role: "体育数据分析师", p25: 19, p50: 25, p75: 31, variable: "14%", internal: 0.94 },
  { role: "运动科学顾问", p25: 17, p50: 23, p75: 30, variable: "12%", internal: 0.91 },
  { role: "赛事运营经理", p25: 16, p50: 21, p75: 27, variable: "18%", internal: 1.01 },
  { role: "品牌商务经理", p25: 20, p50: 27, p75: 36, variable: "28%", internal: 1.08 },
];

const defaultJd = `岗位：运动数据分析师（上海）\n职责：负责用户训练、可穿戴设备及赛事数据的清洗与分析；使用 Python、SQL 搭建指标体系与可视化看板；与产品、教练及运动科学团队协作，输出用户分层和训练建议。\n要求：本科及以上，统计学、心理学、运动科学等相关背景；2年以上分析经验；熟悉 Power BI；具备良好的业务沟通与报告表达能力。`;

const advisorAnswers = {
  city: {
    title: "建议采用“上海核心 + 成都交付”的双中心方案",
    body: "上海保留产品、品牌商务与运动科学负责人，成都承接内容运营、客户成功和标准化交付。按当前模拟口径，较全上海方案节省约 9.6% 年度人力成本，同时将平均招聘周期缩短约 0.4 个月。",
    evidence: ["城市人才指数 T-2027-01", "招聘周期样本 J-2027-03", "编制模型 V1.0"],
  },
  budget: {
    title: "预算下降时，先调整城市组合，不先削减关键岗位",
    body: "建议保留数字产品、运动数据和品牌商务三类关键岗位的 P65 定位；将 30% 的赛事运营与客户成功岗位转移至成都，并把部分运动科学专家改为项目制合作。模型显示可释放约 218 万元年度预算。",
    evidence: ["薪酬基准 S-2027-02", "岗位关键度矩阵 R-06", "情景测算 V1.0"],
  },
  skills: {
    title: "最稀缺的不是单项技术，而是跨域能力组合",
    body: "“运动科学 + 数据分析 + 业务沟通”在模拟岗位样本中的覆盖率仅 18%，却出现在 43% 的关键岗位要求中。建议用运动科学背景人才进行数据工具训练，并设置跨团队项目作为培养主线。",
    evidence: ["技能词典 K-2027", "关键岗位样本 68 条", "供需差距模型 V1.0"],
  },
  salary: {
    title: "整体薪酬不需要全面领先，关键岗位需要差异化定位",
    body: "体育数据分析师和运动科学顾问的内部 Compa-ratio 分别为 0.94 和 0.91，存在一定保留风险。建议核心数据岗调至 P65，成熟赛事运营保持 P50，并为品牌商务增加与收入挂钩的浮动激励。",
    evidence: ["模拟薪酬调查 S-2027-02", "内部公平性诊断 E-04", "奖励策略规则 R-11"],
  },
};

function formatMoney(value: number) {
  return new Intl.NumberFormat("zh-CN", { maximumFractionDigits: 0 }).format(value);
}

export default function Home() {
  const [view, setView] = useState<View>("overview");
  const [talentCity, setTalentCity] = useState("全部城市");
  const [salaryCity, setSalaryCity] = useState("综合市场");
  const [jd, setJd] = useState(defaultJd);
  const [parsed, setParsed] = useState(true);
  const [headcount, setHeadcount] = useState(64);
  const [marketPosition, setMarketPosition] = useState(65);
  const [cityMix, setCityMix] = useState<"core" | "balanced" | "lean">("balanced");
  const [question, setQuestion] = useState("");
  const [answerKey, setAnswerKey] = useState<keyof typeof advisorAnswers>("city");

  const plan = useMemo(() => {
    const factor = cityMix === "core" ? 1.08 : cityMix === "balanced" ? 0.99 : 0.92;
    const averageBase = 24 + (marketPosition - 50) * 0.12;
    const fixed = headcount * averageBase * factor;
    const variable = fixed * 0.16;
    const benefits = fixed * 0.17;
    const total = fixed + variable + benefits;
    return { fixed, variable, benefits, total, gap: 2410 - total };
  }, [headcount, marketPosition, cityMix]);

  const mixLabel = cityMix === "core" ? "核心城市集中" : cityMix === "balanced" ? "双中心平衡" : "成本效率优先";

  function askAdvisor(nextQuestion?: string) {
    const input = (nextQuestion ?? question).toLowerCase();
    if (/预算|成本|减少|编制/.test(input)) setAnswerKey("budget");
    else if (/技能|能力|人才|培养/.test(input)) setAnswerKey("skills");
    else if (/薪酬|工资|激励|p50|p75/.test(input)) setAnswerKey("salary");
    else setAnswerKey("city");
    if (nextQuestion) setQuestion(nextQuestion);
  }

  return (
    <div className="appShell">
      <aside className="sidebar">
        <button className="brand" onClick={() => setView("overview")} aria-label="返回经营总览">
          <span className="brandMark"><i /><i /><i /></span>
          <span><strong>TalentLens</strong><small>SPORTS</small></span>
        </button>

        <div className="scenarioCard">
          <span className="eyebrow">2027 人才计划</span>
          <strong>跃界体育集团</strong>
          <span>数字运动业务增长沙盘</span>
          <div className="scenarioMeta"><b>68</b> 个拟招岗位 <i /> <b>4</b> 个重点城市</div>
        </div>

        <nav aria-label="平台模块">
          {navItems.map((item) => (
            <button key={item.id} className={view === item.id ? "navItem active" : "navItem"} onClick={() => setView(item.id)}>
              <span>{item.short}</span>
              <div><strong>{item.label}</strong><small>{item.description}</small></div>
            </button>
          ))}
        </nav>

        <div className="sidebarFoot">
          <span className="statusDot" />
          <div><strong>演示环境</strong><small>模拟数据 · 2027 规划口径</small></div>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div>
            <span className="topLabel">SPORTS WORKFORCE INTELLIGENCE</span>
            <strong>{navItems.find((item) => item.id === view)?.label}</strong>
          </div>
          <div className="topActions">
            <span className="dataBadge"><i /> 数据已更新 · 演示口径</span>
            <button className="ghostButton" onClick={() => window.print()}>导出决策摘要</button>
            <button className="avatar" aria-label="项目负责人">FY</button>
          </div>
        </header>

        <div className="mobileNav" aria-label="移动端模块导航">
          {navItems.map((item) => <button key={item.id} className={view === item.id ? "active" : ""} onClick={() => setView(item.id)}>{item.label}</button>)}
        </div>

        <section className="content">
          {view === "overview" && (
            <>
              <section className="heroPanel">
                <div className="heroCopy">
                  <span className="heroEyebrow">经营问题 01 / 增长所需的人才是否准备就绪？</span>
                  <h1>让每一笔人才投入，<br /><em>都跑在增长曲线前面。</em></h1>
                  <p>用人才供需、薪酬定位和编制情景测算，支持跃界体育从传统赛事运营走向数字运动服务。</p>
                  <div className="heroActions">
                    <button className="primaryButton" onClick={() => setView("planner")}>开始编制测算 <span>→</span></button>
                    <button className="textButton" onClick={() => setView("advisor")}>询问 AI 顾问</button>
                  </div>
                </div>
                <div className="readinessCard">
                  <div className="readinessTop"><span>人才就绪度</span><strong>72<small>/100</small></strong></div>
                  <div className="readinessRing"><span>72%</span><small>READY</small></div>
                  <div className="readinessRows">
                    <div><span>关键岗位覆盖</span><b>76%</b></div>
                    <div><span>关键技能覆盖</span><b>68%</b></div>
                    <div><span>预算可承受度</span><b>83%</b></div>
                  </div>
                </div>
              </section>

              <div className="metricGrid">
                <article className="metricCard"><span>年度新增编制</span><strong>68<small>人</small></strong><p><b className="positive">+21%</b> 较上年度增长</p></article>
                <article className="metricCard"><span>测算总人力成本</span><strong>2,238<small>万元</small></strong><p><b>预算使用率 92.9%</b></p></article>
                <article className="metricCard"><span>招聘报价 P50</span><strong>23.6<small>k/月</small></strong><p><b className="positive">+8.4%</b> 年度变化</p></article>
                <article className="metricCard alert"><span>高风险关键岗位</span><strong>3<small>类</small></strong><p><b>数据 / 运动科学 / 商务</b></p></article>
              </div>

              <div className="twoColumn">
                <article className="panel demandPanel">
                  <div className="panelHead"><div><span className="eyebrow">TALENT DEMAND</span><h2>岗位需求结构</h2></div><button onClick={() => setView("talent")}>查看人才地图 →</button></div>
                  <div className="barChart">
                    {demandData.map((item) => (
                      <div className="barRow" key={item.label}>
                        <div className="barLabel"><span>{item.label}</span><b>{item.jobs} 个岗位</b></div>
                        <div className="barTrack"><i style={{ width: `${item.value}%` }} /></div>
                        <span className={item.delta.startsWith("+") ? "delta positive" : "delta"}>{item.delta}</span>
                      </div>
                    ))}
                  </div>
                </article>

                <article className="panel decisionPanel">
                  <div className="panelHead"><div><span className="eyebrow">DECISION SIGNAL</span><h2>本期决策信号</h2></div><span className="signalIndex">优先级 A</span></div>
                  <div className="signalHero"><span>01</span><div><strong>先补跨域能力，再扩充运营规模</strong><p>“运动科学 + 数据分析 + 业务沟通”的组合供需差距最大，是数字运动业务能否形成专业壁垒的关键。</p></div></div>
                  <ul className="actionList">
                    <li><span>未来 30 天</span><b>锁定 6 名数据与运动科学骨干</b></li>
                    <li><span>薪酬动作</span><b>关键岗位由 P50 调至 P65</b></li>
                    <li><span>组织动作</span><b>建立上海 + 成都双中心</b></li>
                  </ul>
                </article>
              </div>
            </>
          )}

          {view === "talent" && (
            <>
              <PageIntro eyebrow="MARKET & TALENT" title="体育人才供需地图" description="识别重点城市、关键岗位和跨域技能的供需差距，为招聘与人才布局提供依据。" />
              <div className="filterBar"><span>城市视角</span>{["全部城市", "上海", "北京", "深圳", "成都"].map((city) => <button key={city} className={talentCity === city ? "active" : ""} onClick={() => setTalentCity(city)}>{city}</button>)}<small>当前筛选：{talentCity}</small></div>
              <div className="cityGrid">
                {cities.filter((item) => talentCity === "全部城市" || item.city === talentCity).map((item, index) => (
                  <article className={`cityCard ${item.accent}`} key={item.city}>
                    <div className="cityRank">0{index + 1}</div><div className="cityHead"><div><h3>{item.city}</h3><span>{item.note}</span></div><strong>{item.index}<small>人才指数</small></strong></div>
                    <div className="cityMetrics"><div><span>人才供给</span><b>{item.supply}</b></div><div><span>报价中位</span><b>{item.median}</b></div><div><span>招聘周期</span><b>{item.lead}</b></div></div>
                  </article>
                ))}
              </div>
              <div className="twoColumn wideLeft">
                <article className="panel">
                  <div className="panelHead"><div><span className="eyebrow">SKILL GAP</span><h2>关键技能热力矩阵</h2></div><div className="legend"><span>低</span><i /><i /><i /><i /><i /><span>高</span></div></div>
                  <div className="heatTable">
                    <div className="heatHeader"><span>技能</span><b>产品</b><b>数据</b><b>运动科学</b><b>赛事运营</b><b>商业</b></div>
                    {skillHeatmap.map((row) => <div className="heatRow" key={row.skill}><span>{row.skill}</span>{row.values.map((value, idx) => <i key={`${row.skill}-${idx}`} data-level={value}>{value}</i>)}</div>)}
                  </div>
                </article>
                <article className="panel compactPanel">
                  <div className="panelHead"><div><span className="eyebrow">SCARCITY</span><h2>最稀缺组合</h2></div></div>
                  <div className="scarcityScore"><strong>18%</strong><span>市场覆盖率</span></div>
                  <h3>运动科学 × 数据分析 × 业务沟通</h3>
                  <p>在关键岗位中的需求率为 43%，模拟人才样本覆盖率仅 18%。建议采用“专业背景人才 + 数据训练”策略。</p>
                  <button className="secondaryButton" onClick={() => setView("advisor")}>生成培养建议</button>
                </article>
              </div>
              <article className="panel tablePanel">
                <div className="panelHead"><div><span className="eyebrow">ROLE PORTFOLIO</span><h2>重点岗位组合</h2></div><span className="sampleNote">模拟样本 · 68 个岗位</span></div>
                <div className="dataTable"><div className="tableRow tableHeader"><span>标准岗位</span><span>需求</span><span>供给</span><span>报价 P50</span><span>招聘周期</span><span>建议策略</span></div>{talentRows.map((row) => <div className="tableRow" key={row.role}><strong>{row.role}</strong><span><i className="miniDot high" />{row.demand}</span><span>{row.supply}</span><span>{row.median}</span><span>{row.lead}</span><b>{row.strategy}</b></div>)}</div>
              </article>
            </>
          )}

          {view === "parser" && (
            <>
              <PageIntro eyebrow="ROLE INTELLIGENCE" title="AI 岗位解析与标准化" description="将体育行业非结构化职位描述转化为统一岗位、技能和薪酬分析字段。" />
              <div className="notice"><span>演示说明</span> 当前为本地可交互解析器，不调用外部模型；后续接入 API 后可替换为真实大模型结构化输出。</div>
              <div className="parserGrid">
                <article className="panel inputPanel">
                  <div className="panelHead"><div><span className="eyebrow">RAW JOB DESCRIPTION</span><h2>粘贴职位描述</h2></div><button className="linkButton" onClick={() => { setJd(defaultJd); setParsed(false); }}>恢复示例</button></div>
                  <textarea value={jd} onChange={(event) => { setJd(event.target.value); setParsed(false); }} aria-label="待解析的职位描述" />
                  <div className="inputFoot"><span>{jd.length} 字 · 未发现个人信息</span><button className="primaryButton" onClick={() => setParsed(true)}>智能解析 <span>✦</span></button></div>
                </article>
                <article className={parsed ? "panel resultPanel parsed" : "panel resultPanel"}>
                  <div className="panelHead"><div><span className="eyebrow">STRUCTURED OUTPUT</span><h2>结构化诊断</h2></div><span className="confidence">置信度 94%</span></div>
                  {!parsed ? <div className="emptyState"><span>✦</span><strong>等待解析</strong><p>点击“智能解析”生成岗位标签和诊断建议。</p></div> : <>
                    <div className="roleIdentity"><span>标准岗位</span><h3>运动数据分析师</h3><div><b>数字产品与数据</b><b>专业序列 P2</b><b>上海</b></div></div>
                    <div className="resultSection"><span>核心技能</span><div className="tagList">{["Python", "SQL", "Power BI", "指标体系", "用户分层", "运动数据", "跨团队沟通"].map((tag) => <b key={tag}>{tag}</b>)}</div></div>
                    <div className="resultSection"><span>资格要求</span><div className="qualificationGrid"><div><small>学历</small><strong>本科及以上</strong></div><div><small>经验</small><strong>2 年以上</strong></div><div><small>报价带</small><strong>20–30k</strong></div><div><small>稀缺度</small><strong className="warn">较高</strong></div></div></div>
                    <div className="aiInsight"><span>AI 诊断</span><p>岗位同时要求数据工具、业务洞察和运动领域理解，建议将“运动科学背景”从硬性条件调整为加分项，扩大候选池；面试中增加业务案例测评。</p></div>
                  </>}
                </article>
              </div>
              <article className="panel pipelinePanel"><div><span>01</span><strong>文本清洗</strong><small>去重与敏感信息检查</small></div><i>→</i><div><span>02</span><strong>岗位归一</strong><small>映射标准岗位族</small></div><i>→</i><div><span>03</span><strong>技能提取</strong><small>结构化标签与权重</small></div><i>→</i><div><span>04</span><strong>人工复核</strong><small>低置信度进入复核</small></div></article>
            </>
          )}

          {view === "salary" && (
            <>
              <PageIntro eyebrow="REWARD INTELLIGENCE" title="薪酬市场与内部公平性" description="分开呈现公开招聘报价、模拟薪酬调查与内部薪酬诊断，支持差异化奖励策略。" />
              <div className="filterBar"><span>市场口径</span>{["综合市场", "上海", "北京", "深圳", "成都"].map((city) => <button key={city} className={salaryCity === city ? "active" : ""} onClick={() => setSalaryCity(city)}>{city}</button>)}<small>单位：税前月薪 k</small></div>
              <div className="metricGrid salaryMetrics"><article className="metricCard"><span>市场报价 P50</span><strong>{salaryCity === "成都" ? "18.4" : salaryCity === "北京" ? "26.2" : "23.6"}<small>k/月</small></strong><p>模拟公开职位报价</p></article><article className="metricCard"><span>年度现金总收入</span><strong>31.8<small>万元</small></strong><p>固定薪酬 + 浮动奖金</p></article><article className="metricCard"><span>整体 Compa-ratio</span><strong>0.98</strong><p><b className="positive">合理区间</b> 0.90–1.10</p></article><article className="metricCard alert"><span>需关注员工占比</span><strong>16<small>%</small></strong><p>低于薪酬区间下限</p></article></div>
              <article className="panel salaryPanel">
                <div className="panelHead"><div><span className="eyebrow">MARKET POSITION</span><h2>重点岗位薪酬带宽</h2></div><div className="rangeLegend"><span>P25</span><span>P50</span><span>P75</span></div></div>
                <div className="salaryTable">
                  <div className="salaryHeader"><span>岗位</span><span>市场带宽</span><span>浮动占比</span><span>内部定位</span></div>
                  {salaryRows.map((row) => <div className="salaryRow" key={row.role}><strong>{row.role}</strong><div className="rangeCell"><div className="rangeTrack"><i style={{ left: `${row.p25 * 1.8}%`, width: `${(row.p75 - row.p25) * 1.8}%` }} /><b style={{ left: `${row.p50 * 1.8}%` }} /></div><div><span>{row.p25}k</span><span>{row.p50}k</span><span>{row.p75}k</span></div></div><span>{row.variable}</span><b className={row.internal < 0.95 ? "risk" : "safe"}>{row.internal.toFixed(2)}</b></div>)}
                </div>
              </article>
              <div className="twoColumn">
                <article className="panel"><div className="panelHead"><div><span className="eyebrow">PAY ACTION</span><h2>建议的市场定位</h2></div></div><div className="positionList"><div><span>P75</span><div><strong>数字产品负责人</strong><small>稀缺度高 · 影响核心增长</small></div><b>领先策略</b></div><div><span>P65</span><div><strong>数据分析 / 运动科学</strong><small>跨域能力短缺 · 加强保留</small></div><b>重点倾斜</b></div><div><span>P50</span><div><strong>赛事运营 / 共享服务</strong><small>供给相对充足 · 保持竞争</small></div><b>市场跟随</b></div></div></article>
                <article className="panel policyCard"><span className="eyebrow">DATA GOVERNANCE</span><h2>数据口径说明</h2><p>本页数据为求职作品集的模拟样本，不代表任何真实公司的员工薪酬，也不应作为个人谈薪依据。</p><ul><li>公开JD仅称“招聘报价”</li><li>内部员工记录完全为模拟数据</li><li>所有分位数由确定性计算完成</li></ul></article>
              </div>
            </>
          )}

          {view === "planner" && (
            <>
              <PageIntro eyebrow="WORKFORCE PLANNING" title="组织编制与预算模拟器" description="调整团队规模、薪酬市场定位和城市布局，实时比较人力成本与组织风险。" />
              <div className="plannerGrid">
                <article className="panel controlPanel">
                  <div className="panelHead"><div><span className="eyebrow">ASSUMPTIONS</span><h2>情景参数</h2></div><span className="scenarioTag">方案：{mixLabel}</span></div>
                  <div className="sliderGroup"><div><span>新增编制</span><strong>{headcount} 人</strong></div><input id="headcount" aria-label="新增编制人数" type="range" min="40" max="90" value={headcount} onChange={(event) => setHeadcount(Number(event.target.value))} /><small><span>40</span><span>90</span></small></div>
                  <div className="sliderGroup"><div><span>薪酬市场定位</span><strong>P{marketPosition}</strong></div><input id="market-position" aria-label="薪酬市场定位" type="range" min="50" max="75" step="5" value={marketPosition} onChange={(event) => setMarketPosition(Number(event.target.value))} /><small><span>P50</span><span>P75</span></small></div>
                  <div className="optionGroup"><span>城市组合</span><button className={cityMix === "core" ? "active" : ""} onClick={() => setCityMix("core")}><strong>核心城市集中</strong><small>上海 60% · 北京 25% · 深圳 15%</small></button><button className={cityMix === "balanced" ? "active" : ""} onClick={() => setCityMix("balanced")}><strong>双中心平衡</strong><small>上海 45% · 成都 35% · 北京 20%</small></button><button className={cityMix === "lean" ? "active" : ""} onClick={() => setCityMix("lean")}><strong>成本效率优先</strong><small>上海 35% · 武汉 45% · 灵活用工 20%</small></button></div>
                </article>
                <article className="budgetPanel">
                  <div className="budgetTop"><span>年度总人力成本</span><strong>¥ {formatMoney(plan.total)}<small> 万元</small></strong><p className={plan.gap >= 0 ? "positive" : "negative"}>{plan.gap >= 0 ? `较预算结余 ${formatMoney(plan.gap)} 万元` : `超出预算 ${formatMoney(Math.abs(plan.gap))} 万元`}</p></div>
                  <div className="budgetBreakdown"><div><span>固定薪酬</span><strong>{formatMoney(plan.fixed)}</strong><i style={{ width: `${(plan.fixed / plan.total) * 100}%` }} /></div><div><span>浮动奖金</span><strong>{formatMoney(plan.variable)}</strong><i style={{ width: `${(plan.variable / plan.total) * 100}%` }} /></div><div><span>福利及雇主成本</span><strong>{formatMoney(plan.benefits)}</strong><i style={{ width: `${(plan.benefits / plan.total) * 100}%` }} /></div></div>
                  <div className="budgetFoot"><span>预算上限 ¥2,410 万</span><b>{Math.min(100, (plan.total / 2410) * 100).toFixed(1)}% 使用率</b></div>
                </article>
              </div>
              <div className="twoColumn wideLeft">
                <article className="panel">
                  <div className="panelHead"><div><span className="eyebrow">TEAM MIX</span><h2>建议团队结构</h2></div><span>{headcount} 人</span></div>
                  <div className="teamMix"><div style={{ width: "22%" }} className="team1">22%</div><div style={{ width: "16%" }} className="team2">16%</div><div style={{ width: "28%" }} className="team3">28%</div><div style={{ width: "20%" }} className="team4">20%</div><div style={{ width: "14%" }} className="team5">14%</div></div>
                  <div className="teamLegend">{[["数字产品与数据",22,"team1"],["运动科学",16,"team2"],["内容与赛事",28,"team3"],["商业拓展",20,"team4"],["组织与运营",14,"team5"]].map(([label,value,cls]) => <div key={String(label)}><i className={String(cls)} /><span>{label}</span><b>{Math.round(headcount * Number(value) / 100)} 人</b></div>)}</div>
                </article>
                <article className="panel recommendationCard"><span className="eyebrow">MODEL RECOMMENDATION</span><h2>{plan.gap >= 0 ? "方案在预算内，可进入招聘排期" : "方案超出预算，需要调整"}</h2><p>{cityMix === "core" ? "核心城市集中有利于跨团队协作，但成本最高。建议仅将产品负责人、品牌商务和运动科学专家保留在一线城市。" : cityMix === "balanced" ? "双中心方案兼顾人才质量与成本效率。建议上海负责核心产品与商业，成都负责赛事内容、客户成功和交付。" : "成本效率方案释放预算最多，但需强化异地管理和质量标准，关键岗位不建议使用灵活用工。"}</p><button className="primaryButton" onClick={() => { setView("advisor"); setAnswerKey("budget"); }}>生成管理建议</button></article>
              </div>
            </>
          )}

          {view === "advisor" && (
            <>
              <PageIntro eyebrow="AI DECISION COPILOT" title="体育人才决策助手" description="基于人才地图、薪酬基准与编制模型，生成带有依据和限制说明的管理建议。" />
              <div className="notice"><span>AI 演示模式</span> 当前回答来自本地模拟知识库和规则引擎，可完整演示交互与引用；尚未连接外部大模型。</div>
              <div className="advisorGrid">
                <article className="advisorMain">
                  <div className="assistantIdentity"><span className="assistantMark">AI</span><div><strong>TalentLens 决策顾问</strong><small><i /> 已载入 6 个模拟数据集 · 截止 2027 Q1</small></div></div>
                  <div className="userBubble">{question || "应该把数字运动团队主要放在哪个城市？"}</div>
                  <div className="assistantBubble"><span className="answerLabel">管理建议</span><h2>{advisorAnswers[answerKey].title}</h2><p>{advisorAnswers[answerKey].body}</p><div className="evidenceBox"><span>依据</span>{advisorAnswers[answerKey].evidence.map((item) => <b key={item}>{item}</b>)}</div><div className="limitation"><strong>限制说明</strong> 本结论基于模拟样本，正式决策前需要用真实招聘、员工薪酬和业务目标进行校准。</div></div>
                  <div className="questionChips">{["预算减少 10% 应该怎么调？", "哪些复合技能最稀缺？", "关键岗位薪酬应该如何定位？"].map((item) => <button key={item} onClick={() => askAdvisor(item)}>{item}</button>)}</div>
                  <div className="askBox"><input value={question} onChange={(event) => setQuestion(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") askAdvisor(); }} placeholder="输入一个人才或薪酬决策问题…" aria-label="向AI决策助手提问" /><button onClick={() => askAdvisor()} aria-label="发送问题">→</button></div>
                </article>
                <aside className="advisorSide">
                  <article><span className="eyebrow">AVAILABLE CONTEXT</span><h3>已接入的分析模块</h3><ul><li><i />人才供需地图 <b>可用</b></li><li><i />薪酬市场基准 <b>可用</b></li><li><i />组织编制模型 <b>可用</b></li><li><i />真实员工数据 <b className="muted">未接入</b></li></ul></article>
                  <article className="guardrail"><span className="eyebrow">GUARDRAIL</span><h3>回答边界</h3><p>不对个人候选人打分，不使用年龄、性别等敏感属性，不将招聘报价等同真实薪酬，数据不足时明确拒答。</p></article>
                  <article className="methodCard"><span>回答结构</span><div><b>01</b>明确问题与口径</div><div><b>02</b>引用数据与样本</div><div><b>03</b>输出建议和权衡</div><div><b>04</b>披露限制与风险</div></article>
                </aside>
              </div>
            </>
          )}
        </section>
      </main>
    </div>
  );
}

function PageIntro({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return <header className="pageIntro"><div><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>{description}</p></div><div className="pageStamp"><span>YJ SPORTS</span><strong>2027</strong><small>WORKFORCE PLAN</small></div></header>;
}
