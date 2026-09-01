import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server renders the TalentLens Sports application", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  const html = await response.text();
  assert.match(html, /TalentLens Sports/i);
  assert.match(html, /体育人才与薪酬决策平台/);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton/);
});

test("includes all six requested modules and transparent data labels", async () => {
  const [page, layout, packageJson] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);

  for (const moduleName of ["经营总览", "人才地图", "AI 岗位解析", "薪酬洞察", "编制模拟", "AI 决策助手"]) {
    assert.match(page, new RegExp(moduleName));
  }
  assert.match(page, /模拟数据/);
  assert.match(page, /未连接外部大模型/);
  assert.match(layout, /TalentLens Sports/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton|site-creator-vinext-starter/);
  await access(new URL("../public/og.png", import.meta.url));
});
