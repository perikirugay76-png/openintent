# OpenIntent Spec v0.1 中文说明

OpenIntent 定义一个最小语义协议，让 AI agents 能交换、比较和解释结构化 intent 与 capability。

英文版 spec 是协议的规范文本。这个中文版用于帮助我们准确理解设计意图和共建方向。

## 1. 设计原则

### 1.1 Agent-Readable

协议对象必须容易被 agent 解析、校验、比较和解释。

### 1.2 Human-Controllable

agent 可以推理和推荐，但敏感动作必须经过明确授权。

### 1.3 Protocol, Not Platform

OpenIntent 不定义托管、排名、支付、身份提供商、marketplace 或模型行为。

### 1.4 Small Core, Extensible Edges

核心协议必须小。领域特定字段应该放在 extensions 或后续 RFC 中。

## 2. 核心对象

### 2.1 IntentCard

`IntentCard` 描述一个 actor 想要什么。

最小结构：

```json
{
  "type": "IntentCard",
  "version": "0.1",
  "id": "intent_123",
  "actor": {},
  "intent": {},
  "consent": {}
}
```

语义角色：

- 表达目标、需求、任务、请求或期望结果。
- 可以代表个人、组织、项目、服务或 agent。
- 应该可以和一个或多个 `CapabilityCard` 匹配。

### 2.2 CapabilityCard

`CapabilityCard` 描述一个 actor 能提供什么。

最小结构：

```json
{
  "type": "CapabilityCard",
  "version": "0.1",
  "id": "capability_123",
  "actor": {},
  "capability": {},
  "terms": {}
}
```

语义角色：

- 表达服务、技能、产品、API、资源、内容或可用性。
- 可以公开、私有，或在策略约束下共享。
- 应该可以和一个或多个 `IntentCard` 匹配。

### 2.3 ConsentPolicy

`ConsentPolicy` 描述 agent 被允许做什么。

最小结构：

```json
{
  "type": "ConsentPolicy",
  "version": "0.1",
  "visibility": "private",
  "can_store": true,
  "can_forward": false,
  "can_contact_matches": false,
  "requires_human_approval": true
}
```

语义角色：

- 控制可见性。
- 控制是否可存储。
- 控制是否可转发。
- 控制是否可联系匹配对象。
- 控制是否需要人类批准。

### 2.4 MatchReport

`MatchReport` 解释一个 `IntentCard` 与一个 `CapabilityCard` 的关系。

最小结构：

```json
{
  "type": "MatchReport",
  "version": "0.1",
  "intent_id": "intent_123",
  "capability_id": "capability_123",
  "score": 0.82,
  "status": "match",
  "reasons": [],
  "gaps": [],
  "requires_human_review": true
}
```

语义角色：

- 解释为什么匹配。
- 说明哪里不匹配。
- 说明缺少什么信息。
- 避免黑盒排名。
- 为 agent 决策提供审计线索。

## 3. Actor

`actor` 是协议对象所代表的实体。

```json
{
  "type": "person",
  "id": "did:example:alice",
  "name": "Alice"
}
```

v0.1 允许的 actor types：

- `person`
- `organization`
- `agent`
- `service`
- `project`

OpenIntent v0.1 不强制使用某一种身份系统。DID、OAuth、GitHub identity、域名验证和签名都可以作为后续扩展。

## 4. 可复用语义结构

OpenIntent v0.1 保持顶层对象很小，但数组内容必须足够结构化，agent 才能比较和解释。

### 4.1 Constraint

`Constraint` 出现在 `intent.constraints` 和 `capability.constraints` 中。

```json
{
  "field": "experience",
  "operator": ">=",
  "value": 5,
  "unit": "years",
  "required": true,
  "description": "Minimum relevant experience"
}
```

字段说明：

- `field`：被约束的目标字段。
- `operator`：允许 `equals`、`not_equals`、`contains`、`in`、`not_in`、`>`、`>=`、`<`、`<=`。
- `value`：比较值。v0.1 允许 scalar、array 和 object。
- `required`：可选 boolean。如果为 `true`，matcher 应该把无法满足或无法判断的约束作为 gap。
- `description`：可选的人类可读说明。

`unit` 是有序值的推荐扩展字段。它可以帮助 matcher 理解 years、days、hours per week 等数值比较，但它不是 v0.1 core schema 的必填字段。

Operator 语义：

- `equals` 和 `not_equals` 对 scalar、array 或 object 做精确语义相等比较。
- `contains` 判断候选值是否包含 constraint value，适合字符串、数组和标签类字段。
- `in` 判断候选值是否存在于 constraint `value` 中，此时 `value` 应该是数组。
- `not_in` 判断候选值是否不在 constraint `value` 中，此时 `value` 应该是数组。
- `>`、`>=`、`<`、`<=` 比较有序值。v0.1 matcher 应优先使用 number。如果需要单位，用独立字段表达，比如 `"unit": "years"`。

如果 matcher 无法理解某个 operator 或 value，它应该输出 `MatchGap`，而不是静默忽略。

### 4.2 Preference

`Preference` 出现在 `intent.preferences` 和 `capability.preferences` 中。

```json
{
  "field": "open_source_contributions",
  "value": true,
  "weight": 0.8,
  "description": "Open-source work is preferred but not required"
}
```

### 4.3 MatchReason

`MatchReason` 解释 `MatchReport` 中的正向证据。

```json
{
  "code": "shared_summary_terms",
  "message": "Intent and capability summaries share meaningful terms.",
  "evidence": [],
  "weight": 0.4
}
```

`weight` 是可选字段。如果存在，必须是 `0` 到 `1` 之间的 number。实现者不应该在无法给出有意义权重时编造精确数字。

### 4.4 MatchGap

`MatchGap` 解释 `MatchReport` 中缺失、较弱或冲突的证据。

```json
{
  "code": "category_mismatch",
  "message": "Intent and capability categories differ.",
  "severity": "warning",
  "suggested_resolution": "Confirm whether the capability category is close enough for this intent."
}
```

`suggested_resolution` 是可选字段。如果存在，应该描述一个具体的下一步。

## 5. Matching

OpenIntent 不规定具体排名算法。

一个兼容的 matcher 至少应该：

- 接受一个有效的 `IntentCard`。
- 接受一个有效的 `CapabilityCard`。
- 返回一个有效的 `MatchReport`。
- 解释正向匹配理由。
- 解释 gaps 或 mismatches。
- 保留 consent 约束。

## 6. Consent

agent 在执行任何外发动作之前，必须遵守 consent 约束。

在 v0.1 中：

- 如果 `can_contact_matches` 是 `false`，不应该自动联系匹配对象。
- 如果 `requires_human_approval` 是 `true`，关键动作必须等待人类批准。

## 7. Future Scope

后续版本可能定义：

- identity proofs
- long-lived profiles
- negotiation sessions
- audit and provenance trails
- `.well-known/openintent.json`
- MCP、A2A、ACP、OpenAPI、ActivityPub、schema.org adapters

## 8. Non-Goals

OpenIntent v0.1 不定义：

- payments
- marketplace ranking
- reputation
- hosting
- model behavior
- transport protocol
- agent runtime
- legal contract enforcement
